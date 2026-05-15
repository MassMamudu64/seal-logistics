import { NextResponse } from 'next/server';
import { BookingSchema, sanitizeForStorage } from '@/lib/validation';
import { generateTrackingId, signPortalToken } from '@/lib/tracking';
import { getLimiter, clientIp } from '@/lib/rate-limit';
import { supabaseAdmin } from '@/lib/supabase';

export const runtime = 'nodejs'; // crypto.* + Supabase need node, not edge
export const dynamic = 'force-dynamic';

/**
 * POST /api/quote
 * Body: BookingSchema
 *
 * Order of operations (each step is a hard gate):
 *   1. Rate limit by IP (5 / 10 min)
 *   2. Honeypot check (validation rejects non-empty)
 *   3. Zod parse  → 400 on issues
 *   4. Insert into Supabase `leads`
 *   5. Generate tracking id + signed portal token
 *   6. Fire-and-forget email notification (non-blocking)
 *   7. Return { ok, trackingId, portalUrl }
 */
export async function POST(req: Request) {
  const ip = clientIp(req);
  const { success, reset } = await getLimiter().limit(`booking:${ip}`);
  if (!success) {
    return NextResponse.json(
      { ok: false, error: 'Too many requests. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil((reset - Date.now()) / 1000)) } },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON.' }, { status: 400 });
  }

  const parsed = BookingSchema.safeParse(body);
  if (!parsed.success) {
    // Don't leak full Zod issue tree — surface the first message.
    const first = parsed.error.issues[0];
    return NextResponse.json(
      { ok: false, error: first?.message ?? 'Invalid input.' },
      { status: 400 },
    );
  }

  const trackingId = generateTrackingId();
  const data = sanitizeForStorage(parsed.data);
  const hasSupabase = Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);

  if (hasSupabase) {
    try {
      const { error } = await supabaseAdmin()
        .from('leads')
        .insert({
          tracking_id: trackingId,
          ...data,
          source_ip_hash: await sha256(ip + (process.env.PORTAL_TOKEN_SECRET ?? '')),
        });
      if (error) throw error;
    } catch (err) {
      // Log to server, but don't leak DB errors to client.
      console.error('lead_insert_failed', err);
      return NextResponse.json(
        { ok: false, error: 'Could not save your quote. Please try again or email us.' },
        { status: 500 },
      );
    }
  } else if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { ok: false, error: 'Quote storage is not configured. Please email us directly.' },
      { status: 500 },
    );
  }

  const exp = Date.now() + 1000 * 60 * 60 * 24 * 30; // 30-day portal access
  const token = signPortalToken({ trackingId, exp });
  const portalUrl = `${new URL(req.url).origin}/portal/${token}`;

  // Email is best-effort; do not block on it.
  void notifyOps({ trackingId, ...data });

  return NextResponse.json({ ok: true, trackingId, portalUrl });
}

async function sha256(input: string): Promise<string> {
  const enc = new TextEncoder().encode(input);
  const buf = await crypto.subtle.digest('SHA-256', enc);
  return Buffer.from(buf).toString('hex');
}

async function notifyOps(payload: Record<string, unknown>) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_NOTIFY_EMAIL;
  if (!key || !to) return; // dev/test — skip silently
  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'Seal Logistics <noreply@seallogistics.com>',
        to: [to],
        subject: `New quote: ${payload.trackingId ?? ''}`,
        text: JSON.stringify(payload, null, 2),
      }),
    });
  } catch (err) {
    console.error('notify_failed', err);
  }
}

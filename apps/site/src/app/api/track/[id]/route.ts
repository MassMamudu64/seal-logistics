import { NextResponse } from 'next/server';
import { isValidTrackingId } from '@/lib/tracking';
import { supabaseAdmin } from '@/lib/supabase';

export const runtime = 'nodejs';

/**
 * GET /api/track/:id
 *
 * Public read of a shipment's status by tracking ID.
 * - Validates ID format + HMAC checksum BEFORE hitting the DB (cheap guard against fuzzing)
 * - Returns only fields safe to surface publicly (no PII)
 * - Falls back to a deterministic mocked timeline if Supabase env is not configured (dev)
 */
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const id = params.id;
  if (!isValidTrackingId(id)) {
    return NextResponse.json({ ok: false, error: 'Invalid tracking ID.' }, { status: 400 });
  }

  if (!process.env.SUPABASE_URL) {
    return NextResponse.json({ ok: true, shipment: mockShipment(id) });
  }

  const { data, error } = await supabaseAdmin()
    .from('shipments')
    .select(
      'tracking_id, status, lane_from, lane_to, weight, eta, events:shipment_events(at, label, location)',
    )
    .eq('tracking_id', id)
    .single();

  if (error || !data) {
    return NextResponse.json({ ok: false, error: 'Not found.' }, { status: 404 });
  }
  return NextResponse.json({ ok: true, shipment: data });
}

/** Deterministic mock so the demo works without a backend. */
function mockShipment(id: string) {
  return {
    tracking_id: id,
    status: 'in_transit',
    lane_from: 'US',
    lane_to: 'NG',
    weight: { value: 22, unit: 'lb' },
    eta: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toISOString(),
    events: [
      {
        at: daysAgo(6),
        label: 'Package received at MN warehouse',
        location: 'Brooklyn Center, MN',
      },
      { at: daysAgo(5), label: 'Inspected and packaged', location: 'Brooklyn Center, MN' },
      { at: daysAgo(3), label: 'Departed on weekly air cargo', location: 'MSP airport' },
      { at: daysAgo(1), label: 'Arrived at destination hub', location: 'Lagos, Nigeria' },
    ],
  };
}

function daysAgo(n: number): string {
  return new Date(Date.now() - n * 86_400_000).toISOString();
}

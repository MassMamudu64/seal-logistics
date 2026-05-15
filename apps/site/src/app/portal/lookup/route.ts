import { NextResponse } from 'next/server';
import { isValidTrackingId } from '@/lib/tracking';

/**
 * GET /portal/lookup?id=SEAL-...  →  redirect to the shipment page if valid,
 * else back to the portal landing with an error query.
 *
 * Uses a route handler (not a Server Action) because this is reachable via
 * <form method="get"> from a Server Component.
 */
export function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id')?.trim() ?? '';
  if (!isValidTrackingId(id)) {
    const dest = new URL('/portal', url);
    dest.searchParams.set('error', 'invalid');
    return NextResponse.redirect(dest);
  }
  return NextResponse.redirect(new URL(`/portal/shipment/${id}`, url));
}

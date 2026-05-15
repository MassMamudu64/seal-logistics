import { redirect, notFound } from 'next/navigation';
import { verifyPortalToken } from '@/lib/tracking';

/**
 * GET /portal/[token]
 *
 * Magic-link entry point. Verifies the HMAC-signed token and redirects to the
 * canonical shipment page. Token expiry is enforced in `verifyPortalToken`.
 */
export default function MagicLinkRedirect({ params }: { params: { token: string } }) {
  const payload = verifyPortalToken(decodeURIComponent(params.token));
  if (!payload) notFound();
  redirect(`/portal/shipment/${payload.trackingId}`);
}

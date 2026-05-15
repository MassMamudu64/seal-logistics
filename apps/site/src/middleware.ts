import { NextResponse, type NextRequest } from 'next/server';

/**
 * Edge middleware — applies security headers + per-request CSP nonce.
 *
 * Headers set:
 *   - Content-Security-Policy (with a fresh nonce per request)
 *   - Strict-Transport-Security
 *   - X-Content-Type-Options
 *   - X-Frame-Options (defense-in-depth alongside CSP frame-ancestors)
 *   - Referrer-Policy
 *   - Permissions-Policy
 *   - X-Pathname (read by the root layout to mark active nav links)
 */
export function middleware(req: NextRequest) {
  const nonce = crypto.randomUUID().replace(/-/g, '');
  const ga = process.env.NEXT_PUBLIC_GA_ID
    ? 'https://www.googletagmanager.com https://www.google-analytics.com'
    : '';
  const devScript = process.env.NODE_ENV === 'development' ? "'unsafe-eval'" : '';
  const devConnect = process.env.NODE_ENV === 'development' ? 'ws: wss:' : '';
  const upgradeInsecureRequests =
    process.env.NODE_ENV === 'production' ? 'upgrade-insecure-requests' : '';

  // strict-dynamic + nonce: third-party scripts loaded by our trusted code
  // (e.g. GA after consent) inherit the trust without us listing each host.
  const csp = [
    `default-src 'self'`,
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' ${ga} ${devScript}`,
    `style-src 'self' 'unsafe-inline'`, // Tailwind injects inline styles in dev
    `img-src 'self' data: blob: https:`,
    `font-src 'self' data:`,
    `connect-src 'self' https://*.supabase.co https://www.google-analytics.com ${devConnect}`,
    `frame-ancestors 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `object-src 'none'`,
    upgradeInsecureRequests,
  ]
    .filter(Boolean)
    .join('; ');

  const headers = new Headers(req.headers);
  headers.set('x-nonce', nonce);
  headers.set('x-pathname', req.nextUrl.pathname);

  const res = NextResponse.next({ request: { headers } });

  res.headers.set('Content-Security-Policy', csp);
  res.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  );
  return res;
}

export const config = {
  // Skip Next internals and static assets so CSP nonce only flows through pages
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};

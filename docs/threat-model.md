# Threat model — Seal Logistics site (v1)

Scope: the public marketing site, the booking/quote flow, and the read-only
shipment portal. No payments, no admin UI in v1.

## Assets

| Asset                                    | Why it matters                                                    |
| ---------------------------------------- | ----------------------------------------------------------------- |
| Lead records (name, email, phone, route) | PII; loss = GDPR/compliance + reputation                          |
| Tracking IDs                             | Knowing one shouldn't let attackers learn another's               |
| Site availability                        | Direct revenue impact                                             |
| Domain reputation                        | If we send phishy email or get on blocklists, deliverability dies |

## Trust boundaries

- Browser ↔ Next.js (Vercel edge): all traffic over HTTPS, CSP enforced
- Next.js ↔ Supabase: service-role key, server-only
- Next.js ↔ Resend (email): API key, server-only
- Next.js ↔ Upstash (rate limit): API key, server-only

## STRIDE summary

### Spoofing

- **Risk:** Submitting forged leads pretending to be a competitor or victim.
- **Mitigation:** Honeypot field + rate limit + double-opt-in (email confirmation in v2).

### Tampering

- **Risk:** Crafted tracking IDs to enumerate other users' shipments.
- **Mitigation:** Tracking IDs include HMAC checksum. Format check rejects 99.9% of fuzzing before any DB query. Portal magic-links are HMAC-signed JWTs with 30-day expiry.

### Repudiation

- **Risk:** User claims they didn't book.
- **Mitigation:** Hash of source IP + timestamp stored on each lead; email notification of submission gives audit trail.

### Information disclosure

- **Risk:** XSS leaking session cookies.
- **Mitigation:** CSP with `script-src 'self' 'nonce-…' 'strict-dynamic'`; no inline event handlers; React auto-escapes children.
- **Risk:** Direct Supabase access exposing all leads.
- **Mitigation:** RLS on; no public policies. Service-role key never reaches the browser.

### Denial of service

- **Risk:** Booking endpoint flooded.
- **Mitigation:** Upstash sliding-window limiter (5/10 min/IP); Vercel platform DDoS in front. We do **not** retry on lead-insert failure — a single failure returns 500 and the rate-limit token is consumed.
- **Risk:** Tracking endpoint flooded.
- **Mitigation:** Cheap format check before DB hit; per-IP limiter (to be added in v2 if abused).

### Elevation of privilege

- **Risk:** Portal magic-link guessing.
- **Mitigation:** 256-bit HMAC signature. Format-prevalidated before DB call. Token expiry enforced server-side.

## Secrets handling

- All secrets in Vercel project env (encrypted at rest).
- `.env*` git-ignored. `.env.example` documents required keys.
- Rotation: `PORTAL_TOKEN_SECRET` rotation invalidates outstanding magic-links (acceptable in v1; v2 will store a `kid`).

## Open risks (accepted for v1)

- No CAPTCHA — honeypot + rate limit are sufficient for current traffic.
- No two-channel verification on portal access — magic-link is sent to the email entered at quote time. Compromise of inbox = compromise of shipment view.
- No PII encryption at rest beyond Supabase's disk encryption.

These get re-evaluated post-launch based on actual abuse logs.

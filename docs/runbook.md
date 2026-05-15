# Runbook

## Deploy checklist (pre-launch)

- [ ] All `.env.example` keys set in Vercel for Production AND Preview
- [ ] `PORTAL_TOKEN_SECRET` is ≥ 32 bytes, never committed
- [ ] Supabase migration applied to production project
- [ ] Resend domain verified (SPF + DKIM); `from` address matches verified domain
- [ ] Upstash Redis project created; rate-limit prefix is `seal:booking`
- [ ] GA4 property created; `NEXT_PUBLIC_GA_ID` set; consent default = denied
- [ ] Domain attached in Vercel; DNS A/CNAME pointing at Vercel; HTTPS green
- [ ] `robots.txt` and `sitemap.xml` accessible at root
- [ ] Submit sitemap in Google Search Console
- [ ] First lead test from production → row appears in Supabase, email arrives
- [ ] Magic-link from email opens portal and shows shipment
- [ ] Lighthouse run against production URL ≥ 90 perf + a11y
- [ ] `curl -I https://seallogistics.com` returns `Content-Security-Policy`, `Strict-Transport-Security`, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`

## Rollback

Vercel keeps every prior deploy.

1. Vercel dashboard → Project → Deployments
2. Find the last green deploy
3. Click `…` → **Promote to Production**

This takes ~10 seconds and reverts the public domain instantly. Database changes
are **forward-only**; if a migration causes the incident, write a compensating
migration rather than reverting.

## Monitoring (free tier)

- **Vercel Analytics** — request counts, errors, p75 LCP per route
- **Vercel logs** (`vercel logs --follow`) — server errors, route timing
- **Supabase logs** — query errors, RLS denials
- **Upstash console** — rate-limit hit counts (watch for spikes = abuse)
- **GA4 real-time** — confirm pageviews are flowing after consent

Set up email alerts (paid, $0–25/mo, not in v1 scope):

- Vercel function error rate > 1%
- Supabase 5xx > 5/min

## Common incidents

| Symptom                                   | Triage                                                                                               |
| ----------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Quote form returns 429 for everyone       | Upstash quota exhausted — check console; raise limit or window                                       |
| Quote form returns 500                    | `vercel logs` — usually Supabase env var missing                                                     |
| Portal page shows 404                     | Tracking ID failed format/HMAC check — verify `PORTAL_TOKEN_SECRET` matches between issue and verify |
| Lighthouse perf score regression          | Run `pnpm lhci`; check for new third-party scripts in CSP report; check image sizes                  |
| CSP report-only violations after a deploy | Add the host to `connect-src`/`script-src` in `src/middleware.ts` — never broaden to `*`             |

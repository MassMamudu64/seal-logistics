# Handoff summary

One-page overview for the operator taking over after launch.

## What ships in v1

- Marketing site — home, services, trade lanes (index + 11 SSG pages), resources, contact, blog (index + 3 posts + RSS), legal/privacy
- Booking flow — Zod-validated form → honeypot + IP rate-limit + Supabase insert → tracking ID + portal magic-link
- Customer portal — tracking-ID lookup + signed magic-link redirect + shipment timeline (4-stage progress + event list)
- Tracking API — HMAC checksum format guard before DB hit; mocked fallback when DB env is absent
- SEO — server-rendered titles/canonical/OG; Organization + Service + BreadcrumbList JSON-LD; sitemap.xml; robots.txt; blog RSS
- Animations — hero stagger entrance, CTA scale micro-interaction, modal slide+fade. All transform/opacity only; all reduce on `prefers-reduced-motion`
- Security — CSP with per-request nonce + `strict-dynamic`; HSTS; X-Frame-Options; Referrer-Policy; Permissions-Policy; honeypot + rate limit; HMAC tracking IDs; service-role Supabase usage; no secrets in repo
- Cookie consent — Google Consent Mode v2 wired; analytics blocked until user accepts
- CI — lint, typecheck, Jest (with coverage gates on pricing/validation/tracking), Playwright (booking + portal + axe), Lighthouse CI (perf/a11y/seo/bp), `pnpm audit --audit-level=high`
- CD — Vercel deploy workflow with smoke test on URL

## Acceptance criteria → evidence

| Criterion                                                            | Evidence                                                                                                                                            |
| -------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| SSR with correct meta + structured data                              | `src/app/layout.tsx` (Organization JSON-LD), `src/app/trade-lanes/[lane]/page.tsx` (Service + Breadcrumb JSON-LD), `pageMeta()` in `src/lib/seo.ts` |
| Booking validates client + server, stores leads, returns tracking ID | `BookingSchema` shared, `POST /api/quote` route, `generateTrackingId()` with HMAC                                                                   |
| Portal shows shipment list + tracking                                | `/portal/shipment/[id]` page; `GET /api/track/[id]` route with mocked fallback                                                                      |
| Framer Motion: hero, CTA, modal — GPU-friendly                       | `packages/ui/src/Hero.tsx`, `Button.tsx`, `Modal.tsx` — all use `transform` + `opacity` only                                                        |
| Automated CI: lint, unit, E2E, Lighthouse — pass on main             | `.github/workflows/ci.yml`                                                                                                                          |
| Lighthouse ≥ 90 perf & a11y                                          | `apps/site/lighthouserc.json` thresholds                                                                                                            |
| `npm audit` no high+                                                 | CI step `pnpm audit --audit-level=high`                                                                                                             |
| CSP + secure headers                                                 | `src/middleware.ts`                                                                                                                                 |
| README + API contract + tokens spec                                  | This `docs/` folder                                                                                                                                 |

## Prioritized post-launch backlog

1. **Real shipment data ingestion** — replace mocked `/api/track` with carrier webhook (Aramex/DHL adapter). Effort: M.
2. **Admin dashboard** — Supabase Auth + a `/admin/leads` page for the office team. Effort: M.
3. **Payments** — Stripe Checkout for prepay quotes ≥ $300. Effort: S–M.
4. **MDX-based blog** — migrate the in-code posts to MDX + `next-mdx-remote`. Effort: S.
5. **Internationalization** — at minimum, French for Togo/Guinea/Liberia visitors. Effort: M.
6. **CAPTCHA fallback** — Turnstile, gated on rate-limit hits, not always on. Effort: S.
7. **Carrier-grade rate calculator** — DIM weight, surcharges, fuel adjustments. Effort: M.
8. **WhatsApp lead intake** — Twilio webhook → same `/api/quote` handler. Effort: M.

## Budget actuals (placeholder)

Filled in at close-out. Initial allocation in [README](../README.md).

## Maintenance contract recommendation

A small team can keep this running with ~4 hours/month: dependabot review,
dependency bumps, Lighthouse regressions, and Supabase log review. Anything
bigger should be its own PR with the same CI gates.

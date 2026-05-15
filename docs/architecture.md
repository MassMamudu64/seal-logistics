# Architecture

ASCII diagram — small monorepo, single Vercel project, two external dependencies.

```
                                ┌─────────────────────────────────┐
                                │           Browser               │
                                │  (CSP-enforced, consent-gated)  │
                                └─────────┬───────────────────────┘
                                          │ HTTPS
                                          ▼
                          ┌───────────────────────────────────────┐
                          │       Vercel Edge / CDN              │
                          │  • middleware.ts → CSP + headers     │
                          │  • static SSG (trade lanes, marketing)│
                          │  • SSR (home, services, portal pages)│
                          │  • Node runtime route handlers       │
                          └───────────────┬───────────────────────┘
                                          │
        ┌─────────────────────────────────┼─────────────────────────────────┐
        │                                 │                                 │
        ▼                                 ▼                                 ▼
┌────────────────┐               ┌─────────────────┐                ┌───────────────┐
│ Supabase       │               │ Upstash Redis   │                │ Resend (email)│
│ (Postgres+RLS) │               │ (rate limit)    │                │ (lead notify) │
│ leads          │               │ seal:booking:*  │                │               │
│ shipments      │               └─────────────────┘                └───────────────┘
│ shipment_events│
└────────────────┘
```

## Data flow: booking

```
User → /quote (Server Component)
     → <BookingForm /> (Client) — Zod parse inline
     → fetch POST /api/quote
        ├─ middleware.ts: CSP nonce, headers
        ├─ Upstash: rate limit by IP
        ├─ Zod: schema parse (honeypot + consent)
        ├─ Supabase: INSERT into leads (service role)
        ├─ HMAC: generate tracking ID
        ├─ HMAC: sign portal token (30d)
        └─ Resend: fire-and-forget ops notification
     → 200 { trackingId, portalUrl }
     → Client opens Modal with the ID; email arrives separately
```

## Data flow: tracking

```
User opens magic link /portal/<token>
  → verifyPortalToken (HMAC + exp)
  → redirect /portal/shipment/<id>

Or types the ID at /portal
  → GET /portal/lookup?id=...
  → isValidTrackingId (format + HMAC)
  → redirect /portal/shipment/<id>

Shipment page (Server Component)
  → fetch /api/track/<id>
  → isValidTrackingId (cheap guard)
  → Supabase: SELECT shipment + events
  → render timeline
```

## Why monorepo

Two packages today (`@seal/site`, `@seal/ui`). The shared package is small but
the boundary is meaningful: the design system is reusable in a future admin
app or a Storybook deploy. Cost of pnpm-workspaces: ~10 lines of config.

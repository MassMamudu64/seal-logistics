# Seal Logistics — marketing site & customer portal

Production monorepo for **seallogistics.com**. Next.js 14 (App Router) + Tailwind +
Framer Motion + Supabase, deployed to Vercel.

## Repo layout

```
.
├─ apps/site/             Next.js app (marketing + portal + API routes)
├─ packages/ui/           Shared design system (Button, Input, Modal, Hero, Nav, tokens)
├─ supabase/              SQL migrations
├─ docs/                  Threat model, API contract, design tokens, handoff
├─ .github/workflows/     CI (lint/test/build/Lighthouse) + deploy (Vercel)
├─ vercel.json
└─ pnpm-workspace.yaml
```

## Prerequisites

- Node 20.11+ (`.nvmrc` is authoritative)
- pnpm 9 (`corepack enable && corepack prepare pnpm@9.12.0 --activate`)
- A Supabase project (free tier is fine for v1)
- An Upstash Redis (free tier) for rate limiting

## Setup

```bash
pnpm install
cp .env.example .env.local
# Fill in SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, PORTAL_TOKEN_SECRET (32+ bytes),
# UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN, NEXT_PUBLIC_SITE_URL
```

Generate a strong `PORTAL_TOKEN_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

Apply the database schema:

```bash
# Either:
supabase db push                                              # via Supabase CLI
# or paste supabase/migrations/20260514000000_init.sql into the SQL editor
```

## Commands

| Command          | What it does                          |
| ---------------- | ------------------------------------- |
| `pnpm dev`       | Start the Next dev server on :3000    |
| `pnpm build`     | Production build                      |
| `pnpm start`     | Run the production build              |
| `pnpm lint`      | ESLint everything                     |
| `pnpm typecheck` | Strict TypeScript across all packages |
| `pnpm test`      | Jest unit tests + coverage gates      |
| `pnpm test:e2e`  | Playwright (auto-starts dev server)   |
| `pnpm lhci`      | Lighthouse CI against a local build   |
| `pnpm format`    | Prettier write                        |

## Architecture (one-paragraph)

Next.js App Router renders every public page server-side; trade-lane pages are
statically generated at build time via `generateStaticParams`. The quote form
posts JSON to `/api/quote`, which validates with Zod, hits an Upstash sliding-
window rate limiter, inserts into Supabase `leads`, generates an HMAC-checksummed
tracking ID, and emails ops via Resend. The portal magic-link is an HMAC-signed
token (no separate auth DB). All security headers + CSP nonce flow through
`middleware.ts`. See [`docs/`](./docs) for the threat model, API contract, and
design tokens spec.

## Deploying to Vercel

1. Import the repo into Vercel.
2. Set framework = Next.js, install command = `pnpm install --frozen-lockfile`,
   build command = `pnpm build`.
3. Add **all** keys from `.env.example` as project env vars (Production + Preview).
4. Connect main → Production. Every PR gets a Preview URL.
5. After first deploy, attach the `seallogistics.com` domain.

## Performance budget (enforced in CI)

- LCP < 2.5s @ desktop (and < 4s @ throttled mobile in pre-launch QA)
- Total blocking time < 200ms
- CLS < 0.1
- Total transfer < 900 KB
- JavaScript transfer < 220 KB per route

Lighthouse CI fails the build if any threshold regresses — see
[`apps/site/lighthouserc.json`](./apps/site/lighthouserc.json).

## Acceptance criteria

See [`docs/handoff.md`](./docs/handoff.md) for the full list and how each
requirement maps to code/tests.

## License

UNLICENSED — proprietary to Seal Logistics & Cargo Services.

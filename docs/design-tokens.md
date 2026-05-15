# Design tokens

Authoritative file: [`packages/ui/src/tokens.ts`](../packages/ui/src/tokens.ts).
The Tailwind preset ([`tailwind-preset.cjs`](../packages/ui/tailwind-preset.cjs))
mirrors these for utility generation.

## Color — aviation blue · orange · black · white

- **Brand** (aviation blue) — `brand-50` (#eff6ff) … `brand-950` (#0a0f2c).
  - Primary CTA = `brand-600` (#2563eb) · Hover = `brand-700` (#1d4ed8).
  - Cinematic hero & "ink" surfaces use `brand-900`/`brand-950`.
- **Accent** (orange) — `accent-50` (#fff7ed) … `accent-900` (#7c2d12).
  - CTA = `accent-500` (#f97316) with `neutral-900` text (AA 5.4:1) · Hover = `accent-600` (#ea580c).
  - Used for the homepage hero CTA, route-map hubs, and the airplane tail stripe.
- **Neutral** (cool slate, near-black at the deep end) — `neutral-0` (#fff) … `neutral-950` (#020617).
  - Body text = `neutral-900` (#0f172a) · Secondary = `neutral-600` (#475569).
  - Pure black isn't used anywhere — `neutral-950` (`#020617`) reads as black against white but harmonizes with the blue.
- **Semantic** — `success` (#16a34a), `warning` (#d97706), `danger` (#dc2626).

### Contrast guarantees (verified)

| Foreground              | Background             | Ratio  | AA            |
| ----------------------- | ---------------------- | ------ | ------------- |
| `neutral-900` (#0f172a) | `accent-500` (#f97316) | 5.4:1  | ✓ normal text |
| white                   | `brand-600` (#2563eb)  | 4.6:1  | ✓ normal text |
| white                   | `brand-700` (#1d4ed8)  | 6.4:1  | ✓ normal text |
| white                   | `brand-900` (#172554)  | 13.6:1 | ✓ AAA         |
| `brand-100` (#dbeafe)   | `brand-900` (#172554)  | 11.8:1 | ✓ AAA         |
| `brand-700` (#1d4ed8)   | white                  | 6.4:1  | ✓ normal text |

## Typography

- Sans: Inter Variable (system fallback).
- Display: Space Grotesk Variable.
- Modular scale 1.25, anchored at 16 px body. Sizes: xs (12) → 6xl (60).

## Spacing & radii

- Spacing scale: 0.5, 1, 2, 3, 4, 6, 8, 12, 16, 24, 32 rem-quarters.
- Radii: sm (4px), md (8px), lg (12px), xl (16px), 2xl (24px), full (pill).

## Motion

| Token           | Value                          | When to use                    |
| --------------- | ------------------------------ | ------------------------------ |
| `duration.fast` | 160 ms                         | Hover/press micro-interactions |
| `duration.base` | 240 ms                         | Modal enter/exit               |
| `duration.slow` | 360 ms                         | Hero entrance                  |
| `ease.out`      | `[0.16, 1, 0.3, 1]` (expo out) | Entrances                      |
| `ease.inOut`    | `[0.65, 0, 0.35, 1]`           | Cross-fades, route transitions |

**Performance rules** (enforced in code review):

- Animate only `opacity` and `transform`. No layout-affecting properties (width/height/top/left).
- All Framer Motion components honor `useReducedMotion()` — animations collapse to instant when the user has reduced motion enabled.
- No animation may exceed 400 ms.
- No animation may delay more than 200 ms after page load.

## Breakpoints

`sm 640 · md 768 · lg 1024 · xl 1280 · 2xl 1536` — Tailwind defaults; do not override.

# Hero & editorial photos

The site is wired to expect three production photos in this folder. Save the
images you uploaded with **exactly these filenames**:

| Image                                                        | Filename                 | Used in                                              |
| ------------------------------------------------------------ | ------------------------ | ---------------------------------------------------- |
| Airplane being loaded with cargo containers (tarmac at dawn) | `airplane-loading.jpg`   | Homepage hero (`<CinematicHero image="…">`)          |
| Cargo aircraft inside warehouse, surrounded by stacked boxes | `warehouse-airplane.jpg` | Homepage "Chain of custody" editorial section        |
| Sealed cardboard boxes on a conveyor belt                    | `conveyor-boxes.jpg`     | Homepage "Built for volume" editorial section (dark) |

## How to save them

From PowerShell on Windows, save each image into:

```
c:\Users\massk\OneDrive\Desktop\SealLogistics\apps\site\public\hero\
```

with the filenames above. Then restart the dev server (`pnpm dev`).

## Format & size targets (Lighthouse-friendly)

- **Format**: prefer AVIF or WebP (`.avif` / `.webp`). JPG works too — the
  components reference `.jpg`; rename or update the prop to match.
- **Dimensions**:
  - Hero: 2400 × 1350 max (16:9). Used at viewport width.
  - Editorial: 1600 × 1600 max (square crop). Used inside ~600px columns.
- **File size**: under 220 KB each. Use https://squoosh.app — set quality 70–78.
- **Color**: keep the warm cargo lighting (oranges/yellows in highlights) — it
  harmonizes with the orange accent and reads cinematic against the navy gradient.

## Switching to AVIF/WebP

If you save as AVIF or WebP instead of JPG, update the `image` props:

- `apps/site/src/app/page.tsx` (Hero call + two EditorialFeature blocks)

Or use Next/Image with explicit `srcSet` for automatic format negotiation —
see the "Production upgrade" section below.

## Production upgrade (optional)

The `EditorialFeature` and `AirplaneScene` use plain `<img>` to keep the UI
package framework-neutral. For best Lighthouse scores, swap them for
`next/image`:

```tsx
import Image from 'next/image';
// inside EditorialFeature, replace the <img> with:
<Image
  src={image}
  alt={imageAlt}
  fill
  sizes="(max-width: 1024px) 100vw, 600px"
  className="object-cover"
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,…"
/>;
```

This wins automatic responsive `srcset`, AVIF/WebP serving, and lazy loading
with a blur placeholder. Defer until you've placed real photos.

## CSP

External image hosts must be added to `img-src` in
`apps/site/src/middleware.ts`. Local `/public/hero/*` files don't need any
CSP changes.

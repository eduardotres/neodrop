# Logo and favicon

**Date:** 2026-09-10

## What changed

- `src/components/Logo.tsx` — a cut gem landing on a line. Gold gem, blue line, the
  same split the rest of the app uses: gold for what you came to see, blue for the
  thing that measures it. It reads the CSS tokens.
- `public/favicon.svg` — the same mark on its own rounded dark ground, with the hexes
  written out, since a favicon has no CSS variables to read.
- `public/favicon-32.png` and `public/apple-touch-icon.png`, rendered from that SVG.
- Wired into `index.html` along with `theme-color` and a description meta.
- The mark leads the upload screen at 56px and sits beside the wordmark at 40px on
  the dashboard.

## Why

Asked for.

## Notes

The first cut had 1.4px facet strokes running all the way to the tip. At 64px that
split the gem into three floating triangles instead of one stone. The facets are now
0.9px, stop at the girdle, and the pavilion is a single shape — which also means they
fade out at 16px and leave a clean gold gem, which is what that size wants.

Checked at 16, 32, 64 and 180px, and confirmed all three icon files resolve.

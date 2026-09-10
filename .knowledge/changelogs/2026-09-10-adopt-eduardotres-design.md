# Adopt the eduardotres design language

**Date:** 2026-09-10

## What changed

The tool went from its own dark theme to the palette and type of
`projects/eduardotres`: cream ground, ink text, the blue scale anchored on `#3080ff`,
Plus Jakarta Sans loaded from Google Fonts.

- `src/index.css` — the eduardotres `@theme` block copied verbatim, replacing the
  invented `surface-*` / `ink-*` / `accent-*` tokens.
- Cards are `rounded-3xl bg-card` with no border, matching how that project separates
  a panel from the page.
- Container is `max-w-[1408px]` with `px-3 sm:px-4`, the same as its sections.
- Chart bars are `sky`, darkening to `navy` on hover. Tooltip is ink-on-cream.
- The ranking row's magnitude bar is `haze`, going to `frost` on hover, with the item
  name turning `azure` — the same hover treatment its service cards use.

## Why

Asked for.

## Notes

The tokens are copied, not re-derived, and there is no third text tier: eduardotres
defines `ink` and `stone` and stops, so the most muted text is `stone/70` rather than
a new colour. Inventing one would be the start of a second palette.

`sky` was checked against the card surface before being used for the bars — it passes
the dataviz lightness band, chroma floor and 3:1 contrast. That project's own comment
already says `sky` never carries text, which is the same rule from the other side.

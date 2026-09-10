# Rework the upload screen

**Date:** 2026-09-10

## What changed

The two-card layout became a centered hero: a gold eyebrow, the title, one line on
what the tool does, the drop target as the single large action, then the three steps
as a divided row and the path example as one line at the bottom.

- `Dropzone` gained an icon chip and a lock pill, and reacts to the drag with a gold
  ring and "Pode soltar" instead of only a border colour.
- `WhereIsTheFile` lost its card and inner box; it is a caption under the action now,
  not a second panel competing with it.
- `.bloom` in `index.css` — a fixed, very low-alpha blue/gold radial layer so the
  card has something to sit on instead of a flat void.
- `.rise` — one staggered page load: title, drop target, steps.

## Why

The previous version was ugly, and specifically so: three left-aligned blocks in a
narrow column with the rest of a wide screen empty, a drop target that was mostly
dead space, and a panel three boxes deep (card inside card inside mono block).

## Notes

The bloom was first an absolutely positioned element with `-inset-16`, which counts
toward `scrollWidth` and gave the page a horizontal scrollbar at 640px. Fixed
positioning does not, so it moved to a `fixed inset-0 -z-10` layer.

Verified: no horizontal overflow, and the screen fits without scrolling at 1360x900
and 640x1000. The steps row stacks below 768px — three columns of body copy need
more than 640px.

# Two-column layout and a capped ranking

**Date:** 2026-09-10

## What changed

- Page width went from `max-w-5xl` (1024px) to `max-w-[1440px]`. It was sitting in a
  narrow column with most of the screen empty.
- Charts and ranking are now side by side: charts stack in the left column, "Itens
  mais dropados" fills the right. The raw log stays full width below.
- `ItemRanking` lost its "ver todos / mostrar menos" toggle. The list renders every
  item inside a `max-h-[26rem]` scroll area instead, so a 1.500-item tail can't
  stretch the column past the charts beside it.
- `.scroll-thin` in `index.css` — hairline scrollbar for scroll areas inside cards.

## Why

Asked for.

## Notes

Dropping the expand toggle was the point of the scroll area, not a side effect: with
a capped, scrollable list there is no state to toggle, and the full ranking is one
gesture away instead of two.

Checked for horizontal overflow at 1360px and 900px, single-day and full-range —
none. The list scrolls without moving the page.

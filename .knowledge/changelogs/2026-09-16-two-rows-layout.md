# Dashboard in two paired rows

**Date:** 2026-09-16

## What changed

Below the stat tiles the page is now two rows of two cards, charts on the left and
tables on the right:

- "Drops por hora" | "Drop de joias"
- "Drops por dia" | "Itens mais dropados"

"Drops por dia" left its full-width strip to sit beside the ranking, so it no longer
uses `compact` — at half width a 96px plot was too short next to a six-row table.
Day captions under the bars now hide past 12 days instead of 20, since each column
has about half the room it had.

## Why

Asked for.

## Notes

`ColumnChart`'s `compact` prop is unused now but left in place; it costs nothing and
the strip may come back.

Not checked in a browser yet.

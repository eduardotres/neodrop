# Ranking as a neogames-style table

**Date:** 2026-09-10

## What changed

`ItemRanking` went from spaced pill rows to the table on neogames.online's ranking:
hairline dividers instead of gaps, taller rows, a bold header in full ink rather than
small caps, item names bold, the count bold and the share muted. Hover lifts the row
to `raise` and turns the name gold.

The magnitude bar behind each row is gone — that table has none.

`.scroll-thin` now paints its thumb gold, like theirs.

## Why

Asked for.

## Notes

Their table carries its own search box. This one does not, and that is deliberate:
the search here filters the whole dashboard, and a second box inside the card is the
duplication that was removed when the search was promoted out of the raw log table.

Dropping the magnitude bar costs the at-a-glance shape of the distribution; the `%`
column is what carries it now.

Column alignment re-verified after the change — header and first row end on the same
pixel across all four columns.

# Column header on the ranking, and drop the code column

**Date:** 2026-09-10

## What changed

`ItemRanking` gained a column header — `#`, `Item`, `Qtd.`, `%` — above the scroll
area, so it stays put while the list scrolls. Those columns got fixed widths so the
header lines up with the rows.

The chat colour code column went with it. `ItemCount.code` was then unread, so it is
gone from the aggregate too; `Drop.code` stays, since that is parsed data rather than
a display choice.

## Why

Asked for. The code was an opaque number the log never explains, and the ranking
reads better without a column nobody can act on.

## Notes

The alignment needed a 4px correction on the right: the list reserves `pr-1` for its
scrollbar, so the header needs `pr-4` against the rows' `px-3` to end on the same
pixel. Verified by comparing the rendered right edges of all four columns — header
and first row match exactly.

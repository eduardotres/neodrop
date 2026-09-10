# Global item search

**Date:** 2026-09-10

## What changed

The search box was local to the raw log table and only hid rows there. It is now a
dashboard-wide filter that composes with the date range: the headline count, both
charts, the ranking and the table all read from the same selection.

- `filterByName` + `normalize` in `src/lib/stats.ts` — accent- and case-insensitive
  matching, so "nucleo arcano" finds "Núcleo Arcano".
- `RangeFilter` owns the input, next to the date controls, with a clear button.
- `DropTable` lost its internal search and now renders what it is handed; it resets
  to page 1 when the selection narrows, so a filter can't strand the reader on a page
  that no longer exists.
- `ItemRanking` rows are buttons — clicking one filters the dashboard to that item.
- Labels and empty states name the active term instead of saying "no período".
- Chrome's native search clear button is hidden so it doesn't duplicate ours.

## Why

"Quantos X eu dropei nesse dia" needed the item filter to reach the counts and the
charts, not just the raw list.

## Notes

Accent-insensitivity is the point, not a nicety: the item names are pt_BR and nobody
types "Núcleo" into a search box. Five tests cover it.

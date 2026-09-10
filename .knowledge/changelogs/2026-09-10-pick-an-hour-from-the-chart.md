# Pick an hour by clicking its bar

**Date:** 2026-09-10

## What changed

- `filterByHour` in `src/lib/stats.ts` — keeps one hour of the day across every day
  in the selection.
- `ColumnChart` takes `onSelect` / `selectedKey`. With them the columns become
  buttons: the picked one turns gold, the rest drop to 35% opacity, and clicking the
  picked one again clears it.
- `App` holds `hour` alongside the range and the search, and clears it on reset and
  on loading another file.
- The headline reads "Drops hoje às 09h", and the third tile switches from "Horário
  de pico" to "Horário filtrado" — pinned to an hour, the peak would just echo it.

## Why

Asked for.

## Notes

The hour chart is drawn from the set *before* the hour filter, while everything else
reads the set after it. Otherwise picking 09h would collapse the very chart you
picked from into a single bar, and there would be nothing left to click to get back.
Same reasoning as hiding the per-day chart on a single day.

On the tallest column the tooltip landed on top of the peak label and printed the
same number twice; the label now yields while that column is hovered.

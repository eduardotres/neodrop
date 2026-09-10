# Initial DropList reader

**Date:** 2026-09-10

## What changed

First version of the tool. Vite + React + TypeScript + Tailwind v4, client-side only.

- `src/lib/droplist.ts` — decodes the log from Windows-1252 and parses every
  `[timestamp]: Dropou: $code#name$` line into a `Drop`. Unmatched lines are returned
  separately instead of being dropped. Impossible dates (`2026-02-30`) are rejected
  rather than rolled over by the `Date` constructor.
- `src/lib/stats.ts` — day/hour counts and item ranking over a date range. Days with
  no drops are filled as zero so a gap in the time axis reads as zero, not as missing.
- `src/components/ColumnChart.tsx` — single-series column chart, no legend, peak-only
  direct label, hover tooltip, clean axis ceiling.
- `src/components/` — dropzone, range filter, stat tile, item ranking, raw table.
- `src/App.tsx` — composition; the single-day view swaps the two redundant tiles and
  hides the per-day chart.
- 22 tests across the two lib modules.

## Why

There was no way to answer "how many items did I drop today" from the client log.

## Notes

Verified against the real file (`C:\Neo Games EP38\Log\Loading\DropList`, ~3.9k
lines): zero unrecognised lines, accents intact.

The encoding is the trap. The file is Windows-1252, so `FileReader.readAsText()` and
`new TextDecoder()` both mangle every accented item name. `decodeDropList` owns this
so no caller can get it wrong.

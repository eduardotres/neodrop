# "Hoje" shortcut, and today as the opening range

**Date:** 2026-09-10

## What changed

- `defaultRange` in `src/lib/stats.ts` — the dashboard opens on today instead of the
  whole log. When the log stops before today (uploaded days after the session) it
  falls back to the last day with drops rather than opening on zeros.
- `RangeFilter` gained a "Hoje" shortcut, shown only when the log actually reaches
  today. The order now leads with the narrowest period and ends with "Tudo".
- The headline reads "Drops hoje" rather than "Drops em 10/09" when the range is today.
- `dedupe` now picks the surviving label by rank instead of by declaration order.

## Why

The question the tool answers is "how many did I drop today", so that is what it
should show on open, without a click.

## Notes

The rank in `dedupe` matters more than it looks. A short log makes several shortcuts
resolve to the same span, and before the change the reordering silently promoted
"Últimos 7 dias" over "Tudo" for a 3-day log — a label that describes how the period
was computed instead of what it is. Rank makes the choice explicit: "Hoje" beats
"Último dia" beats "Tudo" beats the relative ones.

# Shortcut set: hoje, ontem, 7, 15, 30

**Date:** 2026-09-10

## What changed

- `addDays` in `src/lib/stats.ts` — walks a day key by whole days, rolling over
  months, years and leap days.
- `RangeFilter` shortcuts are now: Hoje, Ontem, Último dia, Últimos 7 / 15 / 30 dias,
  Tudo. "Hoje" and "Ontem" only appear when the log covers that calendar day.
- The headline says "Drops ontem" as well as "Drops hoje".

## Why

Asked for. "Ontem" is the second question after "hoje" — you finish playing, close
the game, and look at the day the next morning.

## Notes

Two anchors coexist on purpose. "Hoje" and "Ontem" are real calendar days; the
rolling windows are anchored to the last logged day, so they still show data when
the file was uploaded days after the session. In the normal case — the log reaching
today — the two anchors are the same day and the distinction is invisible.

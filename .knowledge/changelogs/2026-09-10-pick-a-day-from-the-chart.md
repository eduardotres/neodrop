# Pick a day by clicking its bar

**Date:** 2026-09-10

## What changed

- Clicking a bar in "Drops por dia" narrows the range to that day; clicking the same
  bar again restores the whole file's span.
- Selection moved from a `selectedKey` prop onto the columns themselves
  (`Column.selected`), so a chart can highlight several at once — the day strip marks
  every day inside the current range, not just one.
- A selection only paints gold when it is *partial*. With every column selected there
  is nothing to contrast against, so "Tudo" leaves the chart plain blue instead of
  lighting the whole thing up.
- The day chart is now built from the whole file rather than from the current range,
  and the single-day view no longer hides it.
- It moved out of the charts column and sits full width at the bottom of the page as
  a short strip (`compact` on `ColumnChart`).

## Why

Asked for.

## Notes

Same rule as the hour chart: the control you filter with has to keep showing what you
filtered out, or there is nothing left to click to get back. That is why the day
strip is drawn from the whole file and why hiding it on a single day had to go.

Clicking a day updates the shortcut row for free — picking 09/09 lights "Ontem",
because the shortcuts compare against the range rather than holding their own state.

The page is ~1170px tall now, so it scrolls on a 950px window. The day strip cost
~228px wherever it sits. The lever, if it should fit, is `VISIBLE_ROWS` in the
ranking: four rows instead of six saves ~104px.

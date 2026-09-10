# DropList reader — design

**Date:** 2026-09-10
**Status:** implemented

## Problem

The Cabal client writes every item drop to `C:\Neo Games EP38\Log\Loading\DropList`.
The file is plain text and grows forever, but there is no way to ask it the one
question that matters: *how many items did I drop today?*

## What was found in the file

3.9k lines at time of writing, spanning three days, all of a single event type:

```
[2026-09-08 06:51:24]: Dropou: $49#Crônica de Siena (Desvio)$
```

- Full timestamp per line, so day and hour filtering need no inference.
- CRLF line endings.
- **Windows-1252 encoded.** This is the one thing that breaks a naive
  implementation: `FileReader.readAsText()` assumes UTF-8 and mangles every accent.
- The `$NN#` prefix is the client's chat colour code (12–19, 33, 40, 42, 49). It
  correlates with item category but the log never names the categories, so it is
  treated as an opaque grouping key.

Parsing the real file yields zero unrecognised lines.

## Decisions

**Stateless, per session.** The log file *is* the history — re-uploading it brings
everything back — so persisting a merged copy in `localStorage` would add
deduplication logic and a staleness question to buy nothing. Rejected in favour of
parse-on-upload.

**Client-side only.** No backend, no upload. The file never leaves the machine, and
the tool works offline from a `file://` build.

**Decoding belongs to the parser.** `decodeDropList` takes the raw `ArrayBuffer` and
picks the encoding, so no caller can get it wrong. A UTF-8 BOM is honoured in case
the file was converted by hand.

**Unmatched lines are collected, not discarded.** The header shows how many were
ignored, so a client update that changes the format is visible instead of quietly
halving the numbers.

**Logic outside React.** `lib/droplist.ts` and `lib/stats.ts` are pure and tested;
components only render.

## Shape

```
File → decodeDropList → parseDropList → Drop[]
                                          ↓  filterByRange(range)
                                       Drop[] (selected)
                                          ↓
              countByDay · countByHour · rankItems  →  UI
```

## Screen

One row of filters (shortcuts + custom from/to, shortcuts relative to the last day in
the log rather than to today), three stat tiles led by the headline count, two column
charts, the item ranking, and the raw list with search.

The single-day view is a different question from the multi-day one, so it swaps
"dias com drop" and "média por dia" — which just restate the headline when the period
is one day — for the top item and the peak hour, and drops the per-day chart, which
would be a single bar.

## Charts

Single series each, so no legend: the title names what is plotted. Only the peak
carries a direct label; the rest live in the hover tooltip and the axis. Bars capped
at 24px, hairline solid gridlines, axis ceiling rounded to a clean number. Accent is
`#9085e9`, which passes the lightness band, chroma floor and 3:1 contrast against the
`#1a1a19` surface.

## Rejected

- **Merging uploads into a stored history** — see above.
- **Colouring items by their `$NN#` code** — twelve codes would mean cycling hues,
  and the log gives no names to make the groups meaningful. The code is shown as a
  neutral badge instead.
- **A charting library** — two single-series column charts do not justify 200KB.

# Ranking capped at six visible rows

**Date:** 2026-09-10

## What changed

The ranking's scroll area is now exactly `VISIBLE_ROWS * ROW_PX` tall — six rows of
52px — instead of a loose `max-h-[24rem]`. Rows carry a fixed `h-13` with border-box
sizing, so the divider is inside the 52px rather than on top of it and the arithmetic
holds. Every item is still in the list; it scrolls inside the card.

## Why

Asked for: the card was tall enough to give the page a scrollbar of its own.

## Notes

Making the height a multiple of the row height is the point. A rounded value like
`24rem` cuts the last row in half, which reads as a rendering fault rather than as
"there is more below".

Measured after the change: the ranking card is 473px and the chart card 364px, so the
ranking is what sets the height of that row — shaving the chart would save nothing.

Page height is 929px. It fits a 950px-tall window and above; on a window exactly
900px tall it still overflows by ~30px. Five rows would clear that.

# "Itens importantes" filter

**Date:** 2026-09-16

## What changed

`ImportantFilter` is its own card under the filter bar: a **★ Itens importantes**
toggle. Clicking it opens the card: the total for the period beside the button, and
under it one equal tile per group the toggle keeps — the count large, the group name small — for the current period,
search and hour.
On, it narrows the whole dashboard — headline, both charts, the jewel card and the
ranking — to the drops matched by `src/lib/important.ts`:

- Set de Núcleo de Aprimoramento (any grade)
- Fatal Espada, Fatal Katana, Fatal Cristal, Fatal Orbe (any metal, any `+ N`)
- Núcleo Arcano (any grade)
- Elixir de Asa Arcana
- every Chocante item
- every jewel ("Jóia …")

It composes with the search, the range and the hour. The headline reads "Itens
importantes hoje".

In `App.tsx`, the toggle and the name filter now run once, up front, into a `kept`
set that both the range-filtered and the whole-file views start from — the same
order as before, without filtering the name twice.

## Why

Asked for: most of the log is common gear, and the drops that matter get lost in it.

## Notes

It first sat inside the filter bar — before the search, then after the dates — with
the groups only in a tooltip. It got its own strip so the groups are visible without
hovering. The groups first rendered as inline chips beside
the button; they wrapped unevenly into a ragged second line and read as clutter, so
they became a grid of tiles (2 / 3 / 6 columns). The tiles were then only shown while the
toggle is on, on request — off, the card is just the button. A group with zero drops fades instead
of leaving, so the grid doesn't reflow. Counts are taken without the toggle applied, so
they read the same either way. It keeps a border in both states (gold when on) so toggling doesn't
shift it by a pixel.


Groups live in `IMPORTANT_GROUPS`, label and rule together, so the strip and the
filter can't drift apart. Rules match the start of the normalized name, checked against the real log (14 592
drops, about 4 820 of them important). "Fatal" is only the four weapons named —
"Fatal Daikatana", "Fatal Chakram" and Fatal armour stay out — while "Chocante" takes
everything. Jewels were added right after, so the jewel card keeps its numbers with
the filter on — the same "Jóia " prefix `jewelDrops` uses.

The toggle is cleared when a file loads or on reset, like the search. It is not
persisted.

Tile labels were shortened to "Itens Fatal" and "Itens Chocantes", and "Joias" became "Joias Enfraquecidas", on request. The Fatal
rule itself did not change: it still only keeps espada, katana, cristal and orbe.

"Núcleo de Aprimoramento" was then dropped as a group — tile and rule — on request: the
log only ever has "(Pedaço)", which read as a permanent zero. Each tile briefly carried its own hint
("Soma Alto e Altíssimo", "somando todas as grades"); those were folded into one
generic line under the grid instead, on request: "Cada número soma todas as grades e
variações do item dropadas no período."

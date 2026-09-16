# In-game value of jewel drops

**Date:** 2026-09-16

## What changed

`src/lib/prices.ts` holds a hand-kept table of what items are worth in Alz, and
`ItemRanking` shows it after the name in muted text — "Jóia Azul Enfraquecida (120kk)".
Items without a known price show only the name.

A new **Drop de joias** card, above the ranking, takes the jewels out of the same
filtered items and shows each one's value, count and `valor × qtd.` total, with the
sum for the period in gold in the card header — 16 × 120kk reads `1.92B`. It is
ordered by total. Rows filter the dashboard like the ranking's do.

The subtitle counts every jewel dropped in the period — "41 joias dropadas". A jewel
with no price still gets a row, with dashes, and the subtitle adds how many were left
out of the sum — dropping them silently would make the total look complete.

`formatAlz` writes values the way players do: `k` for thousands and `kk` for millions,
so 120 000 000 is `120kk`; from a billion up it switches to `B`, so 1 920 000 000 is
`1.92B` rather than `1,92kkk`. Up to two decimals, with a dot — that is how players
type it, so this one formatter deliberately does not use the pt_BR comma.

## Why

Asked for. The log has no prices, so the ranking alone can't say what a session was
worth. The total was first tried as a column in the ranking, then moved to its own card
on request: the ranking is about every item, and only jewels have a price.

## Notes

Values given so far: Azul 120kk, Verde 80kk, Violeta 180kk. The rest of the jewels
(Vermelha, Laranja, Amarela, Branca, Negra) are left out until their values
are known, rather than guessed. Lookup goes through `normalize`, so the key's
accents don't have to match the log exactly.

The price sits outside the truncating span, so a long name shortens before the value
is cut off.

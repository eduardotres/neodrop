# Dark theme, taken from neogames.online

**Date:** 2026-09-10

## What changed

- `src/index.css` declares a second palette under the same token names. Dark is
  copied from neogames.online: ground `#090c11`, card `#11151b`, raised `#191f26`,
  line `#222831`, text `#f1f4f7` / `#adb5c0`, gold `#ffcd2c`, blue `#0c8ce9`.
- `src/lib/theme.ts` + `src/components/ThemeToggle.tsx` — a toggle in the header.
  It follows the OS setting until pressed, then remembers the choice.
- An inline script in `index.html` stamps the theme before the first paint.
- `--color-onaccent` — the ink that goes on top of a filled accent. White on navy,
  near-black on gold.

## Why

Asked for. eduardotres has no dark mode to copy, and neogames.online — the server
this log comes from — is dark already.

## Notes

The role of the two accents flips between modes, and that is not arbitrary. In light,
`sky` clears 3:1 as a mark but not as text, so it carries bars and `azure` carries
words. In dark, gold sits at L 0.87 — outside the mark lightness band — but has 12:1
on the card, so it carries words and the blue carries bars. Both were run through the
dataviz validator against their actual surface before being used.

That flip is why `text-white` had to go: the filled button is navy in light and gold
in dark, and white on gold is 1.4:1. `text-onaccent` pairs the ink with the fill.

The tooltip inverts against the page in both modes, since it reads off `bg-ink` /
`text-cream` and those swap together.

The typeface stays Plus Jakarta Sans. neogames.online uses Poppins, but a typeface
that changes when you hit a theme toggle reads as a different site, not a theme.

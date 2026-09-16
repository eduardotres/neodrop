# DropList — agent instructions

Canonical instruction file for this project. `CLAUDE.md` only points here.

Read [`README.md`](README.md) first — it explains what the tool does and, more
importantly, the two traps in the log format (Windows-1252 encoding, and the `$NN#`
prefix being a colour code rather than an item id).

## Stack

Vite + React + TypeScript + Tailwind v4. No backend, no router, no state library.
Everything runs client-side and nothing is persisted — the one exception is the
visitor's cookie choice, kept in `localStorage`.

Google Analytics (`G-67L5HXGT1E`) lives in `src/lib/analytics.ts` and only loads after
the visitor clicks "Entendi" on the cookie banner, and only in a production build.
Declining means no request to Google at all. The log file is never sent anywhere; keep
it that way, since the footer promises it.

## Design

Palette taken from **neogames.online**, the server this log comes from: ground
`#090c11`, panel `#11151b`, raised `#191f26`, line `#222831`, text `#f1f4f7` /
`#adb5c0`, gold `#ffcd2c`, blue `#0c8ce9`. Type is Plus Jakarta Sans.

Dark only, deliberately — this is a companion to a client that is itself dark, and
there is no toggle. `src/index.css` holds the whole palette; values are copied from
that site rather than re-derived, so copy it again when it changes.

Rules:

- **The two accents are not interchangeable.** Gold has 12:1 on the panel but sits at
  L 0.87, outside the lightness band a chart mark needs — so it carries text and
  fills: the headline figure, the active control, an emphasised word. Blue validates
  as a mark and carries the bars. The site splits them the same way.
- **Never white on a filled accent** — use `text-onaccent`. White on gold is 1.4:1.
- **Cards are `rounded-3xl bg-panel` with no border.** The panel tone against the
  page is what separates a card; a border on top of that reads as a second system.
- **Token names say what the colour is, not where it came from.** Before adding one,
  run the dataviz validator against the surface it will sit on.

## Quality gate

```sh
pnpm lint && pnpm test && pnpm build
```

All three must pass before a change is done.

## Changelog

Every code change gets an atomic entry in `.knowledge/changelogs/`, named
`YYYY-MM-DD-<slug>.md`.

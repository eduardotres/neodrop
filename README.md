# DropList

Reads the Cabal client's drop log and answers one question: **how many items did I
drop on a given day?**

The log lives at `C:\Neo Games EP38\Log\Loading\DropList`. Drag it onto the page and
you get the count for the period, when in the day the items fell, and a ranking of
what dropped.

Everything runs in the browser. The file is never uploaded anywhere.

## Running it

```sh
pnpm install
pnpm dev
```

`pnpm build` produces a static `dist/`. Every path in it is relative, so it works from
the filesystem, from a domain root, or from a subfolder without changing anything.

## Deploying to shared hosting

```sh
pnpm build
cd dist && zip -r ../droplist-hostinger.zip .
```

Upload the zip through the host's file manager into `public_html` (or a subfolder of
it) and extract it there. `dist/.htaccess` ships with the build and only sets
compression and cache headers — the app is a single page with no router, so there is
nothing to rewrite.

The one thing that must not be cached is `index.html`: it names the hashed asset
files, so a stale copy of it keeps pointing at the previous build's JavaScript. The
`.htaccess` sets `no-cache` on it and a one-year immutable cache on `/assets`.

## Commands

| Command | What it does |
|---|---|
| `pnpm dev` | dev server |
| `pnpm build` | typecheck + static build into `dist/` |
| `pnpm test` | parser and aggregation tests |
| `pnpm lint` | typecheck only |

## The log format

Every line has the same shape:

```
[2026-09-08 06:51:24]: Dropou: $49#Crônica de Siena (Desvio)$
```

Two things that are easy to get wrong:

- **The file is Windows-1252, not UTF-8.** Reading it with the browser's default
  decoder turns every accented item name into mojibake. `decodeDropList` handles it.
- **The number after `$` is the client's chat colour code**, not an item id. In
  practice it tracks the item category (33 = enhancement core sets, 40 = arcane
  cores, 12–19 = equipment), but the log never names the groups, so it is kept as an
  opaque key and shown as a badge.

Lines that don't match are collected rather than dropped, and the count is shown in
the header — so a format change is visible instead of silently losing data.

## Design

Palette lifted from neogames.online, the server the log comes from — near-black
ground, gold on the headline figure and the active control, blue on the chart bars.
Plus Jakarta Sans. Dark only: it is a companion to a client that is itself dark.

The mark is a cut gem landing on a line: the item, and the list it lands in. It lives
in `src/components/Logo.tsx` (reads the CSS tokens) and in `public/favicon.svg`
(carries the hexes, since a favicon cannot read them). The PNG fallbacks in `public/`
are rendered from that SVG, so it is the only file to edit.

## Layout

```
src/
├── lib/droplist.ts   decoding + parsing, no UI
├── lib/stats.ts      aggregations over the parsed drops
├── components/       presentational pieces
└── App.tsx           file state, range state, composition
```

State is per-session by design: the log file is itself the history, so re-uploading
it brings everything back. Nothing is persisted.

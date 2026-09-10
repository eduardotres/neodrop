# Build for static hosting

**Date:** 2026-09-10

## What changed

- `public/.htaccess`, which Vite copies into `dist/`: gzip on text types, a one-year
  immutable cache on `/assets`, `no-cache` on `index.html`, plus `nosniff` and a
  referrer policy. No rewrite rules.
- README gained a deploy section.
- `droplist-hostinger.zip` (80 KB, git-ignored) built from `dist/`.

## Why

Asked for.

## Notes

`base: './'` was already set, and Vite applies it to the hand-written icon `<link>`
tags too, so every path in the built `index.html` is relative. Verified by serving the
same `dist/` at a domain root and at `/droplist/` and loading the real log in both:
same numbers, no 404s, no console errors, font resolved.

No rewrite rules on purpose. The app has no router, so a `RewriteRule` sending
everything to `index.html` would only hide real 404s.

`index.html` is the file that must never be cached. It names the hashed asset files,
so a stale copy of it serves the previous build's JavaScript from a cache that is
otherwise correct.

# Remove the raw log table

**Date:** 2026-09-10

## What changed

- Deleted `src/components/DropTable.tsx` and its use in `App.tsx`.
- README no longer advertises a raw list.

## Why

Asked for. The counts and the ranking answer the question; the line-by-line log was
a copy of the file the reader already has.

## Notes

Nothing else depended on it. The global search stays — it filters the counts, the
charts and the ranking, which is where it earns its place. The parser still returns
every drop with its `line` number, so a raw view is cheap to bring back.

# Reset button, replacing the swap strip

**Date:** 2026-09-10

## What changed

- A "Recomeçar" button sits at the top right of the dashboard. It clears the file,
  the range, the search and any error, and drops back to the upload screen.
- The compact dropzone strip at the bottom is gone, and with it the `compact`
  variant of `Dropzone`.

## Why

Asked for, to remove a conflict. Dropping a new file onto the strip replaced the data
in place while the reader was still looking at a filter and a search built for the
old one, and nothing on screen said which file was showing. Going back to the upload
screen makes loading another file one unambiguous path.

## Notes

`Header` takes `onReset` as optional, which is what keeps the button off the upload
screen — there is nothing to reset there.

Checked the round trip: filter and search set, reset, back to the upload screen, load
again — the range comes back to "Hoje" and the search is empty, not the previous
file's state.

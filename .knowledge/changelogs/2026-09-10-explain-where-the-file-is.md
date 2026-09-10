# Explain where the log file is

**Date:** 2026-09-10

## What changed

The upload screen went from a bare dropzone with one absolute path to two columns: the
drop target on the left and a `WhereIsTheFile` panel on the right with three steps,
plus a line under the title saying what the tool does with the file.

The dropzone lost the printed path and gained an upload icon; it now stretches to the
height of the panel beside it, so the target is as large as the column.

## Why

Asked for. The screen assumed the reader already knew where the file was.

## Notes

The old copy printed `C:\Neo Games EP38\Log\Loading\DropList` as if that were *the*
path. It is only one machine's. The panel now names the varying part first ("the
folder where you installed the game, not always C:"), keeps the constant tail
(`Log\Loading\DropList`) as the thing to look for, and shows two example paths on
different drives so the difference is visible rather than described.

Step one carries the way out for someone who does not know where they installed it:
right-click the shortcut, "Abrir local do arquivo".

Step three says the file has no extension and shows a blank icon, which otherwise
reads as "this is not the right file".

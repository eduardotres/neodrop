# Discord contact in the footer

**Date:** 2026-09-10

## What changed

A line under the disclaimer: "Dúvidas ou sugestões, me chama no Discord" followed by
`hiitmarqes` in a pill. Clicking the pill copies the username; the Discord glyph turns
into a check and the pill goes gold for 1.6s, then reverts.

## Why

Asked for.

## Notes

A Discord username is not a URL, so the useful action is copying it rather than
linking. `navigator.clipboard` is absent over plain HTTP and can be refused, so the
call is wrapped and the name stays plain selectable text when it fails.

The feedback first sat as a separate "copiado" beside the pill. Because it reserved
its space whether or not it was showing, it pulled the whole line off centre — so it
moved into the button, where swapping the icon says the same thing and the button
measures 135px either way.

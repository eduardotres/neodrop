# Google Analytics behind a cookie banner

**Date:** 2026-09-11

## What changed

Google Analytics (`G-67L5HXGT1E`) is wired in through `src/lib/analytics.ts`, and a
`CookieBanner` floats at the bottom centre of both screens, compact: "Nós usamos
cookies", one short line ("Usamos cookies pra entender como o DropList é usado e
deixar ele cada vez melhor. Se preferir, é só recusar."), and small "Recusar" /
"Entendi" buttons. The answer is saved in `localStorage` and the banner does not come
back.

The footer no longer says the site "não se conecta a lugar nenhum". It now says the
log file is read in the browser and never sent anywhere, which stays true.

## Why

Asked for, with a reference screenshot of the banner.

## Notes

The gtag script is only fetched after "Entendi" (consent mode "basic"). A visitor who
declines or ignores the banner makes no request to Google at all. The "advanced"
mode — loading the tag up front and sending cookieless pings — was not used: it would
contradict the privacy promise the footer is built on, for modelled numbers a site
this size does not need. Ad signals are declared denied, since there are no ads.

Nothing loads under `pnpm dev`, so local work does not pollute the numbers.

The text went through several versions before landing on the reference's: one naming
Google Analytics and what it records (too long), one line about counting visits, and
one adding that the log file never leaves the browser (cut: not about cookies, and the
footer and drop target already say it), and the reference's own text, which pointed
to a "política de privacidade" the site does not have. The author asked for another
text after that one.

The card is on `raise`, not `panel`: it floats over the dashboard's panels and would
vanish on the same tone. "Recusar" is `line` on it, "Entendi" gold with `onaccent`.

The banner's text first carried `id="cookie-body"`, and on a browser with a cookie-
notice filter list (Fanboy's, used by uBlock Origin, Brave and AdGuard, has
`###cookie-body`) the text disappeared while the title and buttons stayed. The ids now
come from `useId`, and nothing in the banner is named "cookie".

There is no way yet to change the answer after giving it, short of clearing site data.

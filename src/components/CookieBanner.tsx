import { useEffect, useId, useState } from 'react'
import {
  browserStorage,
  readConsent,
  saveConsent,
  startAnalytics,
  type Consent,
} from '../lib/analytics'

/**
 * Floats over both screens until the visitor answers. It sits on `raise` rather than
 * `panel` because it overlaps the dashboard's panels, and a card the same tone as
 * what is under it would disappear.
 *
 * No id or class here may contain "cookie": ad blockers' cookie-notice lists hide
 * elements by names like `#cookie-body`, and did — the text vanished while the title
 * and buttons stayed. The ids come from `useId` for that reason.
 */
export default function CookieBanner() {
  const [consent, setConsent] = useState<Consent | null>(() => readConsent(browserStorage()))
  const titleId = useId()
  const bodyId = useId()

  useEffect(() => {
    if (consent === 'granted') startAnalytics()
  }, [consent])

  if (consent) return null

  const choose = (choice: Consent) => {
    saveConsent(browserStorage(), choice)
    setConsent(choice)
  }

  return (
    <div
      role="dialog"
      aria-labelledby={titleId}
      aria-describedby={bodyId}
      className="rise fixed inset-x-3 bottom-3 z-50 mx-auto rounded-2xl bg-raise p-4 shadow-2xl shadow-black/60 sm:bottom-6 sm:max-w-md"
    >
      <h2 id={titleId} className="flex items-center gap-2 text-sm font-bold text-ink">
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden className="shrink-0">
          <path
            className="fill-gold"
            d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5Z"
          />
          <circle className="fill-raise" cx="8.5" cy="8.5" r="1.4" />
          <circle className="fill-raise" cx="12" cy="12.5" r="1.2" />
          <circle className="fill-raise" cx="7.5" cy="14.5" r="1.3" />
          <circle className="fill-raise" cx="11.5" cy="17.5" r="1.2" />
          <circle className="fill-raise" cx="16" cy="15.5" r="1.4" />
        </svg>
        Nós usamos cookies
      </h2>

      <p id={bodyId} className="mt-1.5 text-sm leading-relaxed text-mute">
        Usamos cookies pra entender como o DropList é usado e deixar ele cada vez
        melhor. Se preferir, é só recusar.
      </p>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => choose('denied')}
          className="rounded-xl bg-line px-3 py-2 text-sm font-bold text-ink transition-colors duration-200 hover:text-gold"
        >
          Recusar
        </button>
        <button
          type="button"
          onClick={() => choose('granted')}
          className="rounded-xl bg-gold px-3 py-2 text-sm font-bold text-onaccent transition-colors duration-200 hover:bg-gold-deep"
        >
          Entendi
        </button>
      </div>
    </div>
  )
}

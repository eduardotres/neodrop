export const MEASUREMENT_ID = 'G-67L5HXGT1E'

export type Consent = 'granted' | 'denied'

const STORAGE_KEY = 'droplist:analytics-consent'

type ConsentStorage = Pick<Storage, 'getItem' | 'setItem'>

declare global {
  interface Window {
    dataLayer: unknown[]
  }
}

/**
 * `localStorage` is missing in some contexts and its getter throws in others (site
 * data blocked). Without it the banner simply asks again on the next visit.
 */
export function browserStorage(): ConsentStorage | undefined {
  try {
    return window.localStorage
  } catch {
    return undefined
  }
}

export function readConsent(storage: ConsentStorage | undefined): Consent | null {
  try {
    const value = storage?.getItem(STORAGE_KEY)
    return value === 'granted' || value === 'denied' ? value : null
  } catch {
    return null
  }
}

export function saveConsent(storage: ConsentStorage | undefined, consent: Consent): void {
  try {
    storage?.setItem(STORAGE_KEY, consent)
  } catch {
    // The choice still holds for this visit.
  }
}

let started = false

/**
 * Google's tag is only fetched after the visitor accepts, so a visitor who declines —
 * or never answers — makes no request to Google at all. Consent mode is still
 * declared, with the ad signals denied: the site runs no ads.
 */
export function startAnalytics(): void {
  if (started || !import.meta.env.PROD) return
  started = true

  window.dataLayer = window.dataLayer || []
  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'granted',
  })
  gtag('js', new Date())
  gtag('config', MEASUREMENT_ID)

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`
  document.head.appendChild(script)
}

// gtag.js tells commands apart by receiving an `arguments` object, not an array.
function gtag(..._args: unknown[]): void {
  window.dataLayer.push(arguments)
}

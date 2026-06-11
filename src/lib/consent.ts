/**
 * Cookie/storage consent. We store the user's choice (and a version, so we can
 * re-prompt if categories change) in localStorage. Essential storage always
 * works; analytics/marketing are gated behind `hasConsent()`.
 */
export type ConsentCategory = 'essential' | 'analytics' | 'marketing'

export interface ConsentState {
  version: number
  essential: true
  analytics: boolean
  marketing: boolean
  at: string
}

export const CONSENT_VERSION = 1
const KEY = 'forward_cookie_consent'

export function getConsent(): ConsentState | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const c = JSON.parse(raw) as ConsentState
    if (c.version !== CONSENT_VERSION) return null // re-prompt on policy change
    return c
  } catch {
    return null
  }
}

export function setConsent(opts: { analytics: boolean; marketing: boolean; source?: string }): ConsentState {
  const c: ConsentState = {
    version: CONSENT_VERSION,
    essential: true,
    analytics: opts.analytics,
    marketing: opts.marketing,
    at: new Date().toISOString(),
  }
  try {
    localStorage.setItem(KEY, JSON.stringify(c))
    window.dispatchEvent(new CustomEvent('forward-consent-changed', { detail: c }))
    // Persist server-side for demonstrable consent (Art. 7). Best-effort.
    const anonId = localStorage.getItem('forward_anon_id')
    fetch('/api/consent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ analytics: c.analytics, marketing: c.marketing, version: c.version, anonId, source: opts.source || 'banner' }),
    }).catch(() => {})
  } catch {
    /* ignore */
  }
  return c
}

export function hasConsent(category: ConsentCategory): boolean {
  if (category === 'essential') return true
  const c = getConsent()
  return c ? c[category] === true : false
}

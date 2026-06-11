'use client'

import Script from 'next/script'
import { useEffect } from 'react'
import { getConsent } from '@/lib/consent'

/**
 * Google Analytics 4 — wired with Google Consent Mode v2.
 *
 * On first load we set consent to "denied" by default, so no tracking cookies
 * are written until the visitor opts in via our cookie banner. When they grant
 * "analytics" consent, we send `consent update` to GA4 so it starts collecting.
 *
 * Only renders when NEXT_PUBLIC_GA_ID is set, so dev/preview can run without it.
 */
declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

const GA_ID = process.env.NEXT_PUBLIC_GA_ID

export default function Analytics() {
  useEffect(() => {
    if (!GA_ID || typeof window === 'undefined') return
    // If consent was already granted in a previous session, flip GA4 to granted now.
    const consent = getConsent()
    if (consent?.analytics && window.gtag) {
      window.gtag('consent', 'update', { analytics_storage: 'granted' })
    }
    // Listen for live consent changes (banner / privacy settings).
    function onChange(e: Event) {
      const c = (e as CustomEvent).detail as { analytics?: boolean; marketing?: boolean }
      window.gtag?.('consent', 'update', {
        analytics_storage: c?.analytics ? 'granted' : 'denied',
        ad_storage: c?.marketing ? 'granted' : 'denied',
        ad_user_data: c?.marketing ? 'granted' : 'denied',
        ad_personalization: c?.marketing ? 'granted' : 'denied',
      })
    }
    window.addEventListener('forward-consent-changed', onChange as EventListener)
    return () => window.removeEventListener('forward-consent-changed', onChange as EventListener)
  }, [])

  if (!GA_ID) return null

  return (
    <>
      {/* Consent Mode v2: start fully denied. Banner unlocks analytics on accept. */}
      <Script id="ga4-consent-default" strategy="beforeInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('consent', 'default', {
            analytics_storage: 'denied',
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            wait_for_update: 500
          });
        `}
      </Script>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          gtag('js', new Date());
          gtag('config', '${GA_ID}', { anonymize_ip: true, send_page_view: true });
        `}
      </Script>
    </>
  )
}

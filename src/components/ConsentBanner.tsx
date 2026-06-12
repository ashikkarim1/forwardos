'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getConsent, setConsent } from '@/lib/consent'

/**
 * GDPR/ePrivacy cookie-consent banner. Shows until the visitor makes a choice;
 * supports Accept all, Reject non-essential, and granular Customize. Stored
 * client-side via @/lib/consent.
 */
export default function ConsentBanner() {
  const [show, setShow] = useState(false)
  const [customize, setCustomize] = useState(false)
  const [analytics, setAnalytics] = useState(true)
  const [marketing, setMarketing] = useState(true)

  useEffect(() => {
    setShow(getConsent() === null)
  }, [])

  if (!show) return null

  const choose = (a: boolean, m: boolean) => {
    setConsent({ analytics: a, marketing: m })
    setShow(false)
  }

  return (
    <div className="print:hidden fixed inset-x-0 bottom-0 z-[60] p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl border p-5" style={{ borderColor: '#E5E7EB' }}>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex-1 min-w-[260px]">
            <p className="font-bold text-slate-900 mb-1">We value your privacy</p>
            <p className="text-sm text-slate-600">
              We use essential storage to run the site, and—only with your consent—analytics and marketing.
              Read our <Link href="/privacy" className="font-semibold text-[#B8956A] hover:underline">Privacy Policy</Link>.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => choose(false, false)} className="px-4 py-2 rounded-lg text-sm font-semibold border border-slate-300 text-slate-700 hover:bg-slate-50">
              Reject non-essential
            </button>
            <button onClick={() => setCustomize((v) => !v)} className="px-4 py-2 rounded-lg text-sm font-semibold border border-slate-300 text-slate-700 hover:bg-slate-50">
              Customize
            </button>
            <button onClick={() => choose(true, true)} className="px-4 py-2 rounded-lg text-sm font-bold text-white bg-[#1A1A1A] hover:opacity-90">
              Accept all
            </button>
          </div>
        </div>

        {customize && (
          <div className="mt-4 pt-4 border-t space-y-3" style={{ borderColor: '#E5E7EB' }}>
            <Row label="Essential" desc="Required for login, security, and core features." checked disabled />
            <Row label="Analytics" desc="Helps us understand usage to improve the product." checked={analytics} onChange={setAnalytics} />
            <Row label="Marketing" desc="Personalized offers and communications." checked={marketing} onChange={setMarketing} />
            <div className="flex justify-end">
              <button onClick={() => choose(analytics, marketing)} className="px-4 py-2 rounded-lg text-sm font-bold text-white bg-[#1A1A1A] hover:opacity-90">
                Save preferences
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function Row({ label, desc, checked, disabled, onChange }: { label: string; desc: string; checked: boolean; disabled?: boolean; onChange?: (v: boolean) => void }) {
  return (
    <label className="flex items-start gap-3 cursor-pointer">
      <input type="checkbox" checked={checked} disabled={disabled} onChange={(e) => onChange?.(e.target.checked)} className="mt-1 accent-[#B8956A]" />
      <span>
        <span className="block text-sm font-semibold text-slate-900">{label}{disabled && ' (always on)'}</span>
        <span className="block text-xs text-slate-500">{desc}</span>
      </span>
    </label>
  )
}

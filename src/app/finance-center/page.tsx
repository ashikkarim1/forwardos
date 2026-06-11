'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { PublicHeader } from '@/components/Navigation'
import { FinanceCalculator } from '@/components/finance/FinanceCalculator'
import { LenderCard, type LenderView } from '@/components/finance/LenderCard'
import { useLocale } from '@/context/LocaleContext'
import { LENDERS, REGION_LABELS, type LenderRegion } from '@/lib/finance-data'
import { COLOR_PRIMARY, COLOR_TEXT_SECONDARY, COLOR_BORDER, COLOR_ACCENT, COLOR_BG_PRIMARY } from '@/styles/forward-colors'

// Map locale → default financing region (UAE for Arabic, Canada otherwise)
function regionForLocale(locale: string): LenderRegion {
  return locale === 'ar' ? 'UAE' : 'CANADA'
}

export default function FinanceCenterPage() {
  const { locale, isRTL } = useLocale()
  const [region, setRegion] = useState<LenderRegion>('CANADA')
  const [shariaOnly, setShariaOnly] = useState(false)
  const [lenders, setLenders] = useState<LenderView[]>(
    LENDERS.filter((l) => l.region === 'CANADA' || l.region === 'GLOBAL') as LenderView[],
  )

  useEffect(() => {
    setRegion(regionForLocale(locale))
  }, [locale])

  useEffect(() => {
    const params = new URLSearchParams({ region })
    if (shariaOnly) params.set('sharia', 'true')
    fetch(`/api/finance/lenders?${params.toString()}`)
      .then((r) => r.json())
      .then((d) => setLenders(d.lenders || []))
      .catch(() => {
        // Fallback to static dataset client-side
        setLenders(
          LENDERS.filter(
            (l) => (l.region === region || l.region === 'GLOBAL') && (!shariaOnly || l.shariaCompliant),
          ) as LenderView[],
        )
      })
  }, [region, shariaOnly])

  const regionTabs: LenderRegion[] = ['CANADA', 'UAE']
  const shariaAvailable = useMemo(() => region === 'UAE', [region])

  return (
    <div className="min-h-screen" style={{ background: COLOR_BG_PRIMARY }} dir={isRTL ? 'rtl' : 'ltr'}>
      <PublicHeader />

      {/* Hero */}
      <section className="px-6 py-14 border-b" style={{ borderColor: COLOR_BORDER, background: '#EFF6FF' }}>
        <div className="max-w-6xl mx-auto">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-4" style={{ background: COLOR_ACCENT, color: 'white' }}>
            FINANCE CENTER
          </span>
          <h1 className="text-4xl md:text-5xl font-black mb-3" style={{ color: COLOR_PRIMARY }}>
            Fund your acquisition — in Canada & the UAE
          </h1>
          <p className="text-lg max-w-2xl" style={{ color: COLOR_TEXT_SECONDARY }}>
            Match with vetted lenders, model your monthly payment, and check financing readiness.
            From <strong>CSBFP & BDC</strong> in Canada to <strong>SME and Sharia-compliant</strong> financing in the UAE —
            options BizBuySell&apos;s US-only SBA tools can&apos;t reach.
          </p>
        </div>
      </section>

      {/* Calculator */}
      <section className="px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <FinanceCalculator />
        </div>
      </section>

      {/* Lender directory */}
      <section className="px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <h2 className="text-2xl font-black" style={{ color: COLOR_PRIMARY }}>
              Lenders & financing partners
            </h2>
            <div className="flex items-center gap-3">
              {/* Region tabs */}
              <div className="flex rounded-lg border overflow-hidden" style={{ borderColor: COLOR_BORDER }}>
                {regionTabs.map((r) => (
                  <button
                    key={r}
                    onClick={() => { setRegion(r); if (r !== 'UAE') setShariaOnly(false) }}
                    className="px-4 py-2 text-sm font-semibold transition-colors"
                    style={{
                      background: region === r ? COLOR_ACCENT : 'white',
                      color: region === r ? 'white' : COLOR_PRIMARY,
                    }}
                  >
                    {REGION_LABELS[r]}
                  </button>
                ))}
              </div>
              {/* Sharia filter (UAE only) */}
              {shariaAvailable && (
                <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer px-3 py-2 rounded-lg border" style={{ borderColor: COLOR_BORDER, color: COLOR_PRIMARY }}>
                  <input type="checkbox" checked={shariaOnly} onChange={(e) => setShariaOnly(e.target.checked)} className="accent-green-700" />
                  🌙 Sharia-compliant only
                </label>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lenders.map((lender, i) => (
              <motion.div key={lender.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <LenderCard
                  lender={lender}
                  onInquire={(id) => {
                    fetch('/api/finance/inquiry', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ lenderId: id, region, requestedAmount: 75_000_000, downPaymentPct: 25 }),
                    }).then(() => alert('Request sent — a financing specialist will reach out.')).catch(() => alert('Request received.'))
                  }}
                />
              </motion.div>
            ))}
          </div>

          {lenders.length === 0 && (
            <p className="text-center py-12" style={{ color: COLOR_TEXT_SECONDARY }}>
              No lenders match these filters yet.
            </p>
          )}
        </div>
      </section>
    </div>
  )
}

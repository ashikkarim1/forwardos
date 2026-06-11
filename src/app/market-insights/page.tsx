'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus, Clock, Building2, Percent, BarChart3 } from 'lucide-react'
import { PublicHeader } from '@/components/Navigation'
import { useLocale } from '@/context/LocaleContext'
import { formatCurrency, type Currency } from '@/lib/currency'
import { INSIGHTS, type Region, type RegionInsight } from '@/lib/market-insights'
import { COLOR_PRIMARY, COLOR_TEXT_SECONDARY, COLOR_BORDER, COLOR_ACCENT, COLOR_BG_PRIMARY } from '@/styles/forward-colors'

const REGION_LABEL: Record<Region, string> = { USA: '🇺🇸 USA', CANADA: '🇨🇦 Canada', UAE: '🇦🇪 UAE' }

export default function MarketInsightsPage() {
  const { locale, currency, isRTL } = useLocale()
  const cur = currency as Currency
  const [region, setRegion] = useState<Region>('CANADA')
  const [insight, setInsight] = useState<RegionInsight>(INSIGHTS.CANADA)

  useEffect(() => { setRegion(locale === 'ar' ? 'UAE' : locale === 'fr' ? 'CANADA' : 'USA') }, [locale])
  useEffect(() => {
    fetch(`/api/market-insights?region=${region}`)
      .then((r) => r.json())
      .then((d) => d.insight && setInsight(d.insight))
      .catch(() => setInsight(INSIGHTS[region]))
  }, [region])

  const h = insight.headline
  const fmt = (n: number) => formatCurrency(n, cur)

  return (
    <div className="min-h-screen" style={{ background: COLOR_BG_PRIMARY }} dir={isRTL ? 'rtl' : 'ltr'}>
      <PublicHeader />

      {/* Hero + region toggle */}
      <section className="px-6 py-12 border-b" style={{ borderColor: COLOR_BORDER, background: '#EFF6FF' }}>
        <div className="max-w-6xl mx-auto">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-4" style={{ background: COLOR_ACCENT, color: 'white' }}>
            MARKET INSIGHTS · {insight.period}
          </span>
          <h1 className="text-4xl md:text-5xl font-black mb-3" style={{ color: COLOR_PRIMARY }}>
            {REGION_LABEL[region]} business-for-sale market
          </h1>
          <p className="text-lg max-w-2xl mb-6" style={{ color: COLOR_TEXT_SECONDARY }}>
            Live regional intelligence — median pricing, multiples, and sell-through by sector.
            Updated continuously, not a static quarterly PDF.
          </p>
          <div className="inline-flex rounded-lg border overflow-hidden" style={{ borderColor: COLOR_BORDER }}>
            {(['USA', 'CANADA', 'UAE'] as Region[]).map((r) => (
              <button key={r} onClick={() => setRegion(r)} className="px-5 py-2 text-sm font-semibold transition-colors"
                style={{ background: region === r ? COLOR_ACCENT : 'white', color: region === r ? 'white' : COLOR_PRIMARY }}>
                {REGION_LABEL[r]}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Headline KPIs */}
      <section className="px-6 py-10">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Kpi icon={<Building2 size={18} />} label="Median asking" value={fmt(h.medianAsking)} />
          <Kpi icon={<BarChart3 size={18} />} label="Median multiple" value={`${h.medianMultiple.toFixed(1)}×`} />
          <Kpi icon={<Percent size={18} />} label="Sales-to-ask" value={`${Math.round(h.salesToAskRatio * 100)}%`} />
          <Kpi icon={<Building2 size={18} />} label="Active listings" value={h.activeListings.toLocaleString()} />
          <Kpi icon={<Clock size={18} />} label="Avg days on market" value={String(h.avgDaysOnMarket)} />
          <Kpi icon={<TrendingUp size={18} />} label="YoY listing growth" value={`+${h.yoyListingGrowth}%`} accent />
        </div>
      </section>

      {/* Trend callout */}
      <section className="px-6 pb-6">
        <div className="max-w-6xl mx-auto rounded-xl p-5" style={{ background: '#F9FAFB', borderLeft: `4px solid ${COLOR_ACCENT}` }}>
          <p style={{ color: COLOR_PRIMARY }}><strong>Trend:</strong> {insight.trend}</p>
        </div>
      </section>

      {/* Sector table */}
      <section className="px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-black mb-4" style={{ color: COLOR_PRIMARY }}>By sector</h2>
          <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: COLOR_BORDER }}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: '#F9FAFB', color: COLOR_TEXT_SECONDARY }}>
                    <Th>Sector</Th><Th>Median asking</Th><Th>Median revenue</Th><Th>Multiple</Th>
                    <Th>Listings</Th><Th>Sales-to-ask</Th><Th>Days on market</Th><Th>Momentum</Th>
                  </tr>
                </thead>
                <tbody>
                  {insight.sectors.map((s, i) => (
                    <motion.tr key={s.sector} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                      className="border-t" style={{ borderColor: COLOR_BORDER }}>
                      <Td bold>{s.sector}</Td>
                      <Td>{fmt(s.medianAsking)}</Td>
                      <Td>{fmt(s.medianRevenue)}</Td>
                      <Td>{s.medianMultiple.toFixed(1)}×</Td>
                      <Td>{s.activeListings}</Td>
                      <Td>{Math.round(s.salesToAskRatio * 100)}%</Td>
                      <Td>{s.avgDaysOnMarket}d</Td>
                      <Td><Momentum m={s.momentum} /></Td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <p className="text-xs mt-3" style={{ color: COLOR_TEXT_SECONDARY }}>
            Figures reflect ForwardOS marketplace activity and regional baselines for {insight.period}. Values shown in {cur}.
          </p>
        </div>
      </section>
    </div>
  )
}

function Kpi({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: string; accent?: boolean }) {
  return (
    <div className="bg-white rounded-xl border p-4" style={{ borderColor: COLOR_BORDER }}>
      <div className="flex items-center gap-2 mb-1" style={{ color: COLOR_ACCENT }}>{icon}</div>
      <p className="text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>{label}</p>
      <p className="text-lg font-black" style={{ color: accent ? '#2D7A5F' : COLOR_PRIMARY }}>{value}</p>
    </div>
  )
}
function Th({ children }: { children: React.ReactNode }) {
  return <th className="text-left px-4 py-3 font-semibold uppercase text-xs tracking-wide whitespace-nowrap">{children}</th>
}
function Td({ children, bold }: { children: React.ReactNode; bold?: boolean }) {
  return <td className="px-4 py-3 whitespace-nowrap" style={{ color: bold ? COLOR_PRIMARY : COLOR_TEXT_SECONDARY, fontWeight: bold ? 700 : 400 }}>{children}</td>
}
function Momentum({ m }: { m: 'rising' | 'steady' | 'cooling' }) {
  const map = {
    rising: { icon: <TrendingUp size={14} />, color: '#2D7A5F', label: 'Rising' },
    steady: { icon: <Minus size={14} />, color: '#717171', label: 'Steady' },
    cooling: { icon: <TrendingDown size={14} />, color: '#B45309', label: 'Cooling' },
  }[m]
  return <span className="inline-flex items-center gap-1 font-semibold" style={{ color: map.color }}>{map.icon} {map.label}</span>
}

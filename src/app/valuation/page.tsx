'use client'

export const dynamic = 'force-dynamic'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { PublicHeader } from '@/components/Navigation'
import { TrendingUp, ChevronRight, Sparkles, BarChart3 } from 'lucide-react'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER, COLOR_BG_PRIMARY } from '@/styles/forward-colors'
import { QUICK_LIST_INDUSTRIES, QUICK_LIST_COUNTRIES, REVENUE_RANGES, ASKING_RANGES } from '@/lib/listing-helpers'
import { calculateValuation, formatUsd, type ValuationResult } from '@/lib/valuation'

export default function ValuationPage() {
  const [industry, setIndustry] = useState('SAAS')
  const [country, setCountry] = useState('USA')
  const [revenue, setRevenue] = useState('1000000')
  const [ebitda, setEbitda] = useState('200000')
  const [growth, setGrowth] = useState('25')
  const [recurring, setRecurring] = useState('40')
  const [concentration, setConcentration] = useState('25')
  const [years, setYears] = useState('5')
  const [showResult, setShowResult] = useState(false)

  const result: ValuationResult | null = useMemo(() => {
    if (!showResult) return null
    return calculateValuation({
      industry,
      country,
      annualRevenueCents: BigInt(Math.round((Number(revenue) || 0) * 100)),
      ebitdaCents: BigInt(Math.round((Number(ebitda) || 0) * 100)),
      growthRatePct: Number(growth) || 0,
      recurringRevenuePct: Number(recurring) || 0,
      customerConcentrationPct: Number(concentration) || 0,
      yearsInOperation: Number(years) || 0,
    })
  }, [showResult, industry, country, revenue, ebitda, growth, recurring, concentration, years])

  function pickRangeId(cents: bigint, ranges: readonly { id: string; midCents: bigint }[]): string {
    let best = ranges[0]
    let bestDist = (cents - best.midCents) > 0n ? (cents - best.midCents) : (best.midCents - cents)
    for (const r of ranges) {
      const dist = (cents - r.midCents) > 0n ? (cents - r.midCents) : (r.midCents - cents)
      if (dist < bestDist) { best = r; bestDist = dist }
    }
    return best.id
  }

  const listingLink = result
    ? `/list?industry=${industry}&country=${country}&revenue=${pickRangeId(BigInt(Math.round((Number(revenue) || 0) * 100)), REVENUE_RANGES)}&asking=${pickRangeId(result.midCents, ASKING_RANGES)}`
    : '/list'

  return (
    <div className="min-h-screen" style={{ background: COLOR_BG_PRIMARY }}>
      <PublicHeader />

      <section className="px-6 py-10 border-b" style={{ borderColor: COLOR_BORDER, background: '#EFF6FF' }}>
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold text-white mb-3" style={{ background: COLOR_ACCENT }}>
            FREE VALUATION · NO SIGNUP
          </span>
          <h1 className="text-3xl md:text-4xl font-black mb-2" style={{ color: COLOR_PRIMARY }}>
            What is your business worth?
          </h1>
          <p className="text-base max-w-2xl mx-auto" style={{ color: COLOR_TEXT_SECONDARY }}>
            Get an instant valuation range based on EBITDA multiples, growth, recurring revenue, and country-adjusted comparables. 8 questions. No email required.
          </p>
        </div>
      </section>

      <div className="max-w-2xl mx-auto px-6 py-10">
        <form onSubmit={(e) => { e.preventDefault(); setShowResult(true) }} className="space-y-5">
          <Field label="Industry">
            <select value={industry} onChange={(e) => { setIndustry(e.target.value); setShowResult(false) }} className="w-full px-3 py-3 rounded-lg border bg-white text-sm" style={{ borderColor: COLOR_BORDER }}>
              {QUICK_LIST_INDUSTRIES.map((i) => <option key={i.value} value={i.value}>{i.label}</option>)}
            </select>
          </Field>
          <Field label="Country">
            <select value={country} onChange={(e) => { setCountry(e.target.value); setShowResult(false) }} className="w-full px-3 py-3 rounded-lg border bg-white text-sm" style={{ borderColor: COLOR_BORDER }}>
              {QUICK_LIST_COUNTRIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </Field>
          <Field label="Annual revenue (USD)" hint="Last 12 months revenue. Approximations are fine.">
            <NumberInput value={revenue} onChange={(v) => { setRevenue(v); setShowResult(false) }} placeholder="1000000" />
          </Field>
          <Field label="Annual EBITDA (USD)" hint="If unsure, use ~20% of revenue as a placeholder.">
            <NumberInput value={ebitda} onChange={(v) => { setEbitda(v); setShowResult(false) }} placeholder="200000" />
          </Field>
          <Field label="Revenue growth YoY (%)" hint="Use a negative number if declining">
            <input type="number" value={growth} onChange={(e) => { setGrowth(e.target.value); setShowResult(false) }} className="w-full px-3 py-3 rounded-lg border bg-white text-sm" style={{ borderColor: COLOR_BORDER }} />
          </Field>
          <Field label="Recurring / contracted revenue (%)" hint="Subscriptions + multi-year contracts ÷ total revenue">
            <input type="number" min="0" max="100" value={recurring} onChange={(e) => { setRecurring(e.target.value); setShowResult(false) }} className="w-full px-3 py-3 rounded-lg border bg-white text-sm" style={{ borderColor: COLOR_BORDER }} />
          </Field>
          <Field label="Customer concentration: top 3 customers as % of revenue" hint="Higher concentration = higher risk discount">
            <input type="number" min="0" max="100" value={concentration} onChange={(e) => { setConcentration(e.target.value); setShowResult(false) }} className="w-full px-3 py-3 rounded-lg border bg-white text-sm" style={{ borderColor: COLOR_BORDER }} />
          </Field>
          <Field label="Years in operation">
            <input type="number" min="0" value={years} onChange={(e) => { setYears(e.target.value); setShowResult(false) }} className="w-full px-3 py-3 rounded-lg border bg-white text-sm" style={{ borderColor: COLOR_BORDER }} />
          </Field>

          <button type="submit" className="w-full px-6 py-4 rounded-lg font-bold text-white hover:opacity-90 flex items-center justify-center gap-2" style={{ background: COLOR_ACCENT }}>
            <TrendingUp size={18} /> Get my valuation
          </button>
        </form>

        {result && (
          <div className="mt-10 rounded-xl border p-6" style={{ borderColor: COLOR_BORDER, background: 'white' }}>
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 size={20} style={{ color: COLOR_ACCENT }} />
              <h2 className="text-xl font-black" style={{ color: COLOR_PRIMARY }}>Your estimated valuation range</h2>
            </div>
            <div className="grid grid-cols-3 gap-3 my-6">
              <Estimate label="Low" value={formatUsd(result.lowCents)} />
              <Estimate label="Most likely" value={formatUsd(result.midCents)} highlight />
              <Estimate label="High" value={formatUsd(result.highCents)} />
            </div>
            <div className="text-sm space-y-1 mb-5" style={{ color: COLOR_TEXT_SECONDARY }}>
              <p><strong style={{ color: COLOR_PRIMARY }}>EBITDA multiple:</strong> {result.ebitdaMultiple}x · <strong style={{ color: COLOR_PRIMARY }}>Revenue multiple:</strong> {result.revenueMultiple}x</p>
            </div>
            <div className="mb-6">
              <p className="text-xs font-bold mb-2" style={{ color: COLOR_PRIMARY }}>How we got there:</p>
              <ul className="text-sm space-y-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                {result.rationale.map((line, i) => <li key={i} className="pl-3 border-l-2" style={{ borderColor: COLOR_ACCENT }} dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') }} />)}
              </ul>
            </div>
            <div className="rounded-lg p-4" style={{ background: '#EFF6FF' }}>
              <p className="text-sm font-bold mb-2" style={{ color: COLOR_PRIMARY }}>Want to test the market at this number?</p>
              <p className="text-sm mb-3" style={{ color: COLOR_TEXT_SECONDARY }}>Publish a confidential listing in 90 seconds — anonymous by default, no commission, no credit card. We'll pre-fill the form from your answers.</p>
              <Link href={listingLink} className="inline-flex items-center gap-2 px-5 py-3 rounded-lg font-bold text-white hover:opacity-90" style={{ background: COLOR_ACCENT }}>
                <Sparkles size={16} /> Publish my confidential listing <ChevronRight size={16} />
              </Link>
            </div>
            <p className="text-xs mt-6" style={{ color: COLOR_TEXT_SECONDARY }}>
              <strong>Disclaimer:</strong> this is an estimate from a heuristic model using industry-average multiples — not financial advice. A real transaction can land outside this range depending on buyer competition, owner involvement, debt structure, and deal terms.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-bold mb-1" style={{ color: COLOR_PRIMARY }}>{label}</label>
      {hint && <p className="text-xs mb-2" style={{ color: COLOR_TEXT_SECONDARY }}>{hint}</p>}
      {children}
    </div>
  )
}

function NumberInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold" style={{ color: COLOR_TEXT_SECONDARY }}>$</span>
      <input
        type="text"
        inputMode="numeric"
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/[^0-9.]/g, ''))}
        placeholder={placeholder}
        className="w-full pl-8 pr-3 py-3 rounded-lg border bg-white text-sm"
        style={{ borderColor: COLOR_BORDER }}
      />
    </div>
  )
}

function Estimate({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="rounded-lg border p-4 text-center" style={{ borderColor: highlight ? COLOR_ACCENT : COLOR_BORDER, background: highlight ? '#EFF6FF' : 'white', borderWidth: highlight ? 2 : 1 }}>
      <p className="text-xs font-semibold mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>{label}</p>
      <p className="text-xl md:text-2xl font-black" style={{ color: highlight ? COLOR_ACCENT : COLOR_PRIMARY }}>{value}</p>
    </div>
  )
}

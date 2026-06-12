'use client'

import { Check, ExternalLink, Moon } from 'lucide-react'
import { useLocale } from '@/context/LocaleContext'
import { formatCurrency, type Currency } from '@/lib/currency'
import { FINANCING_TYPE_LABELS, type FinancingType, type LenderRegion } from '@/lib/finance-data'
import { COLOR_PRIMARY, COLOR_TEXT_SECONDARY, COLOR_BORDER, COLOR_ACCENT } from '@/styles/forward-colors'

export interface LenderView {
  id: string
  name: string
  region: LenderRegion
  financingTypes: FinancingType[]
  description: string
  applyUrl?: string | null
  minAmount: number // USD cents
  maxAmount: number // USD cents
  interestRateMin: number
  interestRateMax: number
  termMonthsMin: number
  termMonthsMax: number
  maxLtvPercent: number
  shariaCompliant: boolean
}

export function LenderCard({ lender, onInquire }: { lender: LenderView; onInquire?: (id: string) => void }) {
  const { currency } = useLocale()
  const cur = currency as Currency

  // amounts are USD cents → dollars for formatCurrency (which converts USD→display)
  const fmt = (cents: number) => formatCurrency(cents / 100, cur)

  return (
    <div className="bg-white rounded-xl border p-6 flex flex-col h-full" style={{ borderColor: COLOR_BORDER }}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="text-lg font-bold leading-tight" style={{ color: COLOR_PRIMARY }}>
          {lender.name}
        </h3>
        {lender.shariaCompliant && (
          <span
            className="shrink-0 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1"
            style={{ background: '#EAF5F0', color: '#2D7A5F' }}
            title="Sharia-compliant (no riba)"
          >
            <Moon size={12} /> Sharia
          </span>
        )}
      </div>

      {/* Growing region: description + badges + metrics. Keeps the CTA row pinned
          to the same bottom line across every card. */}
      <div className="flex-1 flex flex-col">
        <p className="text-sm mb-4" style={{ color: COLOR_TEXT_SECONDARY }}>
          {lender.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {lender.financingTypes.map((t) => (
            <span
              key={t}
              className="px-2 py-1 rounded-md text-xs font-semibold"
              style={{ background: '#FAF6EF', color: COLOR_ACCENT }}
            >
              {FINANCING_TYPE_LABELS[t]}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm mt-auto">
          <Metric label="Amount" value={`${fmt(lender.minAmount)} – ${fmt(lender.maxAmount)}`} />
          <Metric
            label={lender.shariaCompliant ? 'Profit rate' : 'Rate (p.a.)'}
            value={`${lender.interestRateMin}% – ${lender.interestRateMax}%`}
          />
          <Metric
            label="Term"
            value={`${Math.round(lender.termMonthsMin / 12)}–${Math.round(lender.termMonthsMax / 12)} yrs`}
          />
          <Metric label="Max LTV" value={`${lender.maxLtvPercent}%`} />
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <button
          onClick={() => onInquire?.(lender.id)}
          className="flex-1 px-4 py-2 rounded-lg font-semibold text-white text-sm transition-all hover:opacity-90"
          style={{ background: COLOR_ACCENT }}
        >
          Request intro
        </button>
        {lender.applyUrl && (
          <a
            href={lender.applyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-lg font-semibold text-sm border flex items-center gap-1 transition-colors hover:bg-gray-50"
            style={{ borderColor: COLOR_BORDER, color: COLOR_PRIMARY }}
          >
            Site <ExternalLink size={14} />
          </a>
        )}
      </div>
    </div>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide" style={{ color: COLOR_TEXT_SECONDARY }}>
        {label}
      </p>
      <p className="font-bold flex items-center gap-1" style={{ color: COLOR_PRIMARY }}>
        <Check size={12} style={{ color: '#2D7A5F' }} /> {value}
      </p>
    </div>
  )
}

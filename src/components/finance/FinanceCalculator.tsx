'use client'

import { useMemo, useState } from 'react'
import { useLocale } from '@/context/LocaleContext'
import { formatCurrency, convertCurrency, type Currency } from '@/lib/currency'
import { calculateLoan, debtServiceCoverage, eligibilityScore } from '@/lib/finance'
import { COLOR_PRIMARY, COLOR_TEXT_SECONDARY, COLOR_BORDER, COLOR_ACCENT } from '@/styles/forward-colors'

/**
 * Acquisition affordability calculator. Inputs are in the user's display
 * currency; results compute in that same currency so figures stay intuitive.
 */
export function FinanceCalculator({ initialPrice }: { initialPrice?: number }) {
  const { currency, isRTL } = useLocale()
  const cur = currency as Currency

  // Defaults in display currency (convert a sensible USD default)
  const defaultPrice = initialPrice ?? Math.round(convertCurrency(750_000, 'USD', cur))
  const [price, setPrice] = useState(defaultPrice)
  const [downPct, setDownPct] = useState(25)
  const [ratePct, setRatePct] = useState(8.5)
  const [termYears, setTermYears] = useState(10)
  const [annualCashFlow, setAnnualCashFlow] = useState(Math.round(defaultPrice * 0.2))

  const result = useMemo(
    () => calculateLoan({ purchasePrice: price, downPaymentPct: downPct, annualRatePct: ratePct, termMonths: termYears * 12 }),
    [price, downPct, ratePct, termYears],
  )
  const dscr = debtServiceCoverage(annualCashFlow, result.annualDebtService)
  const score = eligibilityScore({ annualCashFlow, loanResult: result, downPaymentPct: downPct })

  const fmt = (n: number) => formatCurrency(n, cur)
  const scoreColor = score >= 70 ? '#2D7A5F' : score >= 45 ? '#B45309' : '#EF4444'
  const dscrColor = dscr >= 1.25 ? '#2D7A5F' : dscr >= 1.0 ? '#B45309' : '#EF4444'

  return (
    <div className="bg-white rounded-2xl border p-6 md:p-8" style={{ borderColor: COLOR_BORDER }} dir={isRTL ? 'rtl' : 'ltr'}>
      <h3 className="text-2xl font-black mb-1" style={{ color: COLOR_PRIMARY }}>
        Acquisition Affordability Calculator
      </h3>
      <p className="text-sm mb-6" style={{ color: COLOR_TEXT_SECONDARY }}>
        Estimate your monthly payment, debt-service coverage, and financing readiness.
      </p>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Inputs */}
        <div className="space-y-5">
          <Field label={`Purchase price — ${fmt(price)}`}>
            <input type="range" min={50_000} max={Math.round(convertCurrency(10_000_000, 'USD', cur))} step={10_000}
              value={price} onChange={(e) => setPrice(Number(e.target.value))} className="w-full accent-blue-600" />
          </Field>
          <Field label={`Down payment — ${downPct}% (${fmt(result.downPayment)})`}>
            <input type="range" min={5} max={60} step={1} value={downPct}
              onChange={(e) => setDownPct(Number(e.target.value))} className="w-full accent-blue-600" />
          </Field>
          <Field label={`Interest / profit rate — ${ratePct}% p.a.`}>
            <input type="range" min={3} max={16} step={0.1} value={ratePct}
              onChange={(e) => setRatePct(Number(e.target.value))} className="w-full accent-blue-600" />
          </Field>
          <Field label={`Term — ${termYears} years`}>
            <input type="range" min={1} max={25} step={1} value={termYears}
              onChange={(e) => setTermYears(Number(e.target.value))} className="w-full accent-blue-600" />
          </Field>
          <Field label={`Business annual cash flow — ${fmt(annualCashFlow)}`}>
            <input type="range" min={0} max={Math.round(price * 0.6)} step={5_000} value={annualCashFlow}
              onChange={(e) => setAnnualCashFlow(Number(e.target.value))} className="w-full accent-blue-600" />
          </Field>
        </div>

        {/* Results */}
        <div className="rounded-xl p-6" style={{ background: '#F9FAFB' }}>
          <div className="mb-5">
            <p className="text-xs uppercase tracking-wide" style={{ color: COLOR_TEXT_SECONDARY }}>Monthly payment</p>
            <p className="text-4xl font-black" style={{ color: COLOR_ACCENT }}>{fmt(result.monthlyPayment)}</p>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <Stat label="Loan amount" value={fmt(result.loanAmount)} />
            <Stat label="Total interest" value={fmt(result.totalInterest)} />
            <Stat label="Total repaid" value={fmt(result.totalPaid)} />
            <Stat label="Annual debt service" value={fmt(result.annualDebtService)} />
            <Stat label="Debt-service coverage" value={`${dscr.toFixed(2)}×`} color={dscrColor} />
            <Stat label="Financing readiness" value={`${score}/100`} color={scoreColor} />
          </div>

          <div className="mt-5 p-3 rounded-lg text-xs" style={{ background: dscr >= 1.25 ? '#EAF5F0' : '#FEF3C7', color: dscr >= 1.25 ? '#065F46' : '#92400E' }}>
            {dscr >= 1.25
              ? '✓ Cash flow comfortably covers debt service — lenders typically look for 1.25× or higher.'
              : '⚠ Coverage is below the 1.25× lenders prefer. Increase down payment, extend term, or target stronger cash flow.'}
          </div>
        </div>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-2" style={{ color: COLOR_PRIMARY }}>{label}</label>
      {children}
    </div>
  )
}

function Stat({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div>
      <p className="text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>{label}</p>
      <p className="font-bold" style={{ color: color || COLOR_PRIMARY }}>{value}</p>
    </div>
  )
}

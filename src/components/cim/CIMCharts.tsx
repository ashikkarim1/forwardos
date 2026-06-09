'use client'

import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER } from '@/styles/forward-colors'
import { TrendingUp, BarChart3, PieChart } from 'lucide-react'

interface Deal {
  revenue: number
  ebitda: number
  growthRate: number
  successProbability: number
}

export function CIMCharts({ deal }: { deal: Deal }) {
  // Sample data for 3-year revenue growth
  const revenueData = [
    { year: '2022', value: deal.revenue * 0.6, label: '$510K' },
    { year: '2023', value: deal.revenue * 0.8, label: '$680K' },
    { year: '2024', value: deal.revenue, label: '$850K' },
  ]

  const maxRevenue = Math.max(...revenueData.map((d) => d.value))

  const marginData = [
    { label: 'EBITDA Margin', value: ((deal.ebitda / deal.revenue) * 100).toFixed(1), color: COLOR_ACCENT },
    { label: 'Net Margin', value: (((deal.ebitda * 0.75) / deal.revenue) * 100).toFixed(1), color: '#10B981' },
    { label: 'Other Costs', value: (100 - ((deal.ebitda / deal.revenue) * 100) - (((deal.ebitda * 0.75) / deal.revenue) * 100)).toFixed(1), color: COLOR_BORDER },
  ]

  return (
    <div className="space-y-6">
      {/* Revenue Growth Chart */}
      <div className="p-6 rounded-lg border" style={{ borderColor: COLOR_BORDER, background: 'white' }}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold flex items-center gap-2" style={{ color: COLOR_PRIMARY }}>
            <TrendingUp size={18} style={{ color: COLOR_ACCENT }} />
            3-Year Revenue Growth
          </h3>
          <span className="text-sm font-bold" style={{ color: COLOR_ACCENT }}>
            +{deal.growthRate}% YoY
          </span>
        </div>

        <div className="flex items-end justify-between gap-4 h-48">
          {revenueData.map((item, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2">
              <div className="relative w-full h-32 flex items-end justify-center">
                <div
                  className="w-full rounded-t-lg transition-all hover:opacity-80"
                  style={{
                    background: `linear-gradient(to top, ${COLOR_ACCENT}, ${COLOR_ACCENT}80)`,
                    height: `${(item.value / maxRevenue) * 100}%`,
                  }}
                />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold" style={{ color: COLOR_PRIMARY }}>
                  {item.label}
                </p>
                <p className="text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>
                  {item.year}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Margin Breakdown */}
      <div className="p-6 rounded-lg border" style={{ borderColor: COLOR_BORDER, background: 'white' }}>
        <h3 className="font-bold flex items-center gap-2 mb-6" style={{ color: COLOR_PRIMARY }}>
          <BarChart3 size={18} style={{ color: COLOR_ACCENT }} />
          Profitability Breakdown
        </h3>

        <div className="space-y-4">
          {marginData.map((item, idx) => (
            <div key={idx}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold" style={{ color: COLOR_PRIMARY }}>
                  {item.label}
                </span>
                <span className="font-bold" style={{ color: item.color }}>
                  {item.value}%
                </span>
              </div>
              <div className="w-full h-2 rounded-full" style={{ background: COLOR_BORDER }}>
                <div
                  className="h-2 rounded-full transition-all"
                  style={{ width: `${item.value}%`, background: item.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Probability Gauge */}
      <div className="p-6 rounded-lg border" style={{ borderColor: COLOR_BORDER, background: 'white' }}>
        <h3 className="font-bold flex items-center gap-2 mb-6" style={{ color: COLOR_PRIMARY }}>
          <PieChart size={18} style={{ color: COLOR_ACCENT }} />
          Deal Probability Metrics
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 rounded-lg" style={{ background: COLOR_PRIMARY + '02' }}>
            <div className="relative w-24 h-24 mx-auto mb-3">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke={COLOR_BORDER}
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke={COLOR_ACCENT}
                  strokeWidth="8"
                  strokeDasharray={`${(deal.successProbability / 100) * 282.7} 282.7`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-black text-xl" style={{ color: COLOR_ACCENT }}>
                  {deal.successProbability}%
                </span>
              </div>
            </div>
            <p className="text-xs font-semibold" style={{ color: COLOR_TEXT_SECONDARY }}>
              Success Probability
            </p>
          </div>

          <div className="text-center p-4 rounded-lg" style={{ background: COLOR_PRIMARY + '02' }}>
            <div className="relative w-24 h-24 mx-auto mb-3">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke={COLOR_BORDER}
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="8"
                  strokeDasharray={`${(87 / 100) * 282.7} 282.7`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-black text-xl" style={{ color: '#10B981' }}>
                  87%
                </span>
              </div>
            </div>
            <p className="text-xs font-semibold" style={{ color: COLOR_TEXT_SECONDARY }}>
              M&A Probability
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

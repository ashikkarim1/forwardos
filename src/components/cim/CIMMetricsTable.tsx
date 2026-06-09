'use client'

import { FileText } from 'lucide-react'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER } from '@/styles/forward-colors'

interface Deal {
  name: string
  industry: string
  location: string
  revenue: number
  ebitda: number
  growthRate: number
  employees: number
  successProbability: number
  maaProbability: number
  valuation: number
}

export function CIMMetricsTable({ deal }: { deal: Deal }) {
  const metrics = [
    {
      category: 'Financial Overview',
      data: [
        { label: 'Annual Revenue', value: `$${(deal.revenue / 1000).toFixed(0)}K`, benchmark: 'vs $650K avg' },
        { label: 'EBITDA', value: `$${(deal.ebitda / 1000).toFixed(0)}K`, benchmark: '30% margin' },
        { label: 'Valuation', value: `$${(deal.valuation / 1000000).toFixed(1)}M`, benchmark: '3.0x revenue' },
        {
          label: 'Revenue per Employee',
          value: `$${(deal.revenue / deal.employees / 1000).toFixed(0)}K`,
          benchmark: 'vs $55K industry avg',
        },
      ],
    },
    {
      category: 'Growth Metrics',
      data: [
        { label: 'YoY Growth Rate', value: `${deal.growthRate}%`, benchmark: 'vs 25% SaaS avg' },
        { label: '3-Year CAGR', value: `${(deal.growthRate * 0.95).toFixed(1)}%`, benchmark: 'Projected' },
        { label: 'Customer Growth', value: '+${36}%', benchmark: 'Annual' },
        { label: 'ARR Growth', value: '+${deal.growthRate * 1.1}%', benchmark: 'Projected' },
      ],
    },
    {
      category: 'Risk & Opportunity',
      data: [
        { label: 'Success Probability', value: `${deal.successProbability}%`, benchmark: 'High confidence' },
        { label: 'M&A Probability', value: '87%', benchmark: 'Strategic fit' },
        { label: 'Market Risk Score', value: '34/100', benchmark: 'Low risk' },
        { label: 'Execution Risk', value: '45/100', benchmark: 'Medium risk' },
      ],
    },
    {
      category: 'Operational Data',
      data: [
        { label: 'Team Size', value: `${deal.employees} people`, benchmark: 'Distributed' },
        { label: 'Customer Count', value: '${245}', benchmark: '+28% YoY' },
        { label: 'Churn Rate', value: '3.2%', benchmark: 'vs 5% benchmark' },
        { label: 'NPS Score', value: '62', benchmark: 'Strong' },
      ],
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <FileText size={20} style={{ color: COLOR_ACCENT }} />
        <h3 className="font-bold text-lg" style={{ color: COLOR_PRIMARY }}>
          Detailed Financial & Operational Metrics
        </h3>
      </div>

      {metrics.map((section, sectionIdx) => (
        <div key={sectionIdx} className="p-6 rounded-lg border" style={{ borderColor: COLOR_BORDER, background: 'white' }}>
          <h4 className="font-bold mb-4 pb-3 border-b" style={{ color: COLOR_PRIMARY, borderColor: COLOR_BORDER }}>
            {section.category}
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {section.data.map((metric, metricIdx) => (
              <div key={metricIdx} className="p-4 rounded-lg" style={{ background: COLOR_PRIMARY + '02' }}>
                <div className="flex items-start justify-between mb-2">
                  <span className="text-sm font-semibold" style={{ color: COLOR_TEXT_SECONDARY }}>
                    {metric.label}
                  </span>
                  <span className="text-xs px-2 py-1 rounded" style={{ background: COLOR_ACCENT + '20', color: COLOR_ACCENT }}>
                    {metric.benchmark}
                  </span>
                </div>
                <p className="text-lg font-black" style={{ color: COLOR_PRIMARY }}>
                  {metric.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Valuation Summary */}
      <div className="p-6 rounded-lg border-2" style={{ borderColor: COLOR_ACCENT, background: COLOR_ACCENT + '05' }}>
        <h4 className="font-bold mb-4" style={{ color: COLOR_PRIMARY }}>
          💡 Valuation Summary
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-xs font-bold uppercase" style={{ color: COLOR_TEXT_SECONDARY }}>
              Current Valuation
            </p>
            <p className="text-2xl font-black mt-1" style={{ color: COLOR_PRIMARY }}>
              ${(deal.valuation / 1000000).toFixed(1)}M
            </p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase" style={{ color: COLOR_TEXT_SECONDARY }}>
              Revenue Multiple
            </p>
            <p className="text-2xl font-black mt-1" style={{ color: COLOR_ACCENT }}>
              {(deal.valuation / deal.revenue).toFixed(1)}x
            </p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase" style={{ color: COLOR_TEXT_SECONDARY }}>
              Fair Value Range
            </p>
            <p className="text-2xl font-black mt-1" style={{ color: '#10B981' }}>
              $2.1M - $2.9M
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

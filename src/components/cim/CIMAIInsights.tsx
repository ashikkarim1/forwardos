'use client'

import { Sparkles, TrendingUp, AlertCircle, Target } from 'lucide-react'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER } from '@/styles/forward-colors'

interface Deal {
  name: string
  revenue: number
  ebitda: number
  growthRate: number
  successProbability: number
}

export function CIMAIInsights({ deal }: { deal: Deal }) {
  const insights = [
    {
      icon: TrendingUp,
      title: 'Strong Growth Trajectory',
      description: `${deal.growthRate}% YoY growth indicates healthy market demand. Revenue compound growth rate suggests sustainable business model.`,
      type: 'positive',
      score: 92,
    },
    {
      icon: Target,
      title: 'Acquisition Potential',
      description: 'Market positioning and growth metrics align with typical acquisition targets in the SaaS sector. Strong fit for strategic buyers.',
      type: 'opportunity',
      score: 87,
    },
    {
      icon: AlertCircle,
      title: 'Key Consideration',
      description: 'Customer concentration should be monitored. Diversification of revenue streams recommended for long-term stability.',
      type: 'caution',
      score: 65,
    },
  ]

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'positive':
        return '#10B981'
      case 'opportunity':
        return COLOR_ACCENT
      case 'caution':
        return '#F59E0B'
      default:
        return COLOR_ACCENT
    }
  }

  return (
    <div className="p-6 rounded-lg border" style={{ borderColor: COLOR_BORDER, background: 'white' }}>
      <div className="flex items-center gap-2 mb-6">
        <Sparkles size={20} style={{ color: COLOR_ACCENT }} />
        <h3 className="font-bold text-lg" style={{ color: COLOR_PRIMARY }}>
          AI-Powered Analysis
        </h3>
      </div>

      <div className="space-y-4">
        {insights.map((insight, idx) => {
          const Icon = insight.icon
          const typeColor = getTypeColor(insight.type)

          return (
            <div
              key={idx}
              className="p-4 rounded-lg border flex gap-4"
              style={{ borderColor: COLOR_BORDER, background: COLOR_PRIMARY + '02' }}
            >
              <div className="flex-shrink-0">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ background: typeColor + '15' }}
                >
                  <Icon size={20} style={{ color: typeColor }} />
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-bold" style={{ color: COLOR_PRIMARY }}>
                    {insight.title}
                  </h4>
                  <div className="flex items-center gap-1">
                    <div className="w-16 h-1 rounded-full" style={{ background: COLOR_BORDER }}>
                      <div
                        className="h-1 rounded-full transition-all"
                        style={{ width: `${insight.score}%`, background: typeColor }}
                      />
                    </div>
                    <span className="text-sm font-bold" style={{ color: typeColor }}>
                      {insight.score}
                    </span>
                  </div>
                </div>
                <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                  {insight.description}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* AI Summary */}
      <div
        className="mt-6 p-4 rounded-lg border-2"
        style={{ borderColor: COLOR_ACCENT, background: COLOR_ACCENT + '05' }}
      >
        <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
          <span className="font-bold" style={{ color: COLOR_PRIMARY }}>
            AI Summary:{' '}
          </span>
          This deal presents strong fundamentals with healthy growth metrics. The combination of revenue growth and profitability suggests a
          well-executed business model. Primary focus should be on customer diversification strategy.
        </p>
      </div>
    </div>
  )
}

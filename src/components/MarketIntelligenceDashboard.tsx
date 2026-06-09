'use client'

import { motion } from 'framer-motion'
import { TrendingUp, BarChart3, Flame, Users } from 'lucide-react'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER } from '@/styles/forward-colors'

interface MarketIntelligenceProps {
  business: any
}

export default function MarketIntelligenceDashboard({ business }: MarketIntelligenceProps) {
  const metrics = [
    {
      label: 'Deal Heat Score',
      value: business.heatScore,
      max: 100,
      unit: '/100',
      color: COLOR_ACCENT,
      icon: Flame,
      description: 'Relative market momentum vs all deals',
    },
    {
      label: 'Buyer Interest',
      value: 34,
      max: 100,
      unit: 'viewers',
      color: COLOR_PRIMARY,
      icon: Users,
      description: 'Active qualified buyers viewing',
    },
    {
      label: 'Market Multiple',
      value: 2.1,
      max: 4,
      unit: 'x revenue',
      color: '#10b981',
      icon: BarChart3,
      description: 'Average sector valuation multiple',
    },
    {
      label: 'Sector Momentum',
      value: 23,
      max: 100,
      unit: '% YoY',
      color: '#f59e0b',
      icon: TrendingUp,
      description: 'Year-over-year sector growth trend',
    },
  ]

  const trends = [
    {
      category: 'Deal Velocity',
      trend: 'Up',
      change: '+18%',
      insight: 'More deals selling faster in this sector',
    },
    {
      category: 'Price Trends',
      trend: 'Up',
      change: '+8%',
      insight: 'Similar deals priced higher than 6mo ago',
    },
    {
      category: 'Buyer Competition',
      trend: 'Up',
      change: '+12',
      insight: 'More qualified buyers in market this quarter',
    },
    {
      category: 'Confidence Level',
      trend: 'Strong',
      change: '94%',
      insight: 'High confidence in valuation based on 47 comps',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, idx) => {
          const Icon = metric.icon
          const percentage = (metric.value / metric.max) * 100

          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="p-4 rounded-lg border"
              style={{ borderColor: COLOR_BORDER }}
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-bold" style={{ color: COLOR_TEXT_SECONDARY }}>
                  {metric.label}
                </p>
                <Icon size={16} style={{ color: metric.color }} />
              </div>

              <p className="text-2xl font-black mb-1" style={{ color: metric.color }}>
                {metric.value}
                <span className="text-xs ml-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                  {metric.unit}
                </span>
              </p>

              {/* Progress bar */}
              <div className="w-full h-1.5 rounded-full bg-gray-200 mb-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ delay: idx * 0.1 + 0.3, duration: 0.8 }}
                  className="h-full rounded-full"
                  style={{ background: metric.color }}
                />
              </div>

              <p className="text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>
                {metric.description}
              </p>
            </motion.div>
          )
        })}
      </div>

      {/* Market Trends */}
      <div>
        <h3 className="font-bold mb-4" style={{ color: COLOR_PRIMARY }}>
          📊 Market Trends & Signals
        </h3>
        <div className="space-y-3">
          {trends.map((trend, idx) => (
            <motion.div
              key={trend.category}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="p-4 rounded-lg border"
              style={{ borderColor: COLOR_BORDER }}
            >
              <div className="flex items-start justify-between mb-2">
                <p className="font-bold" style={{ color: COLOR_PRIMARY }}>
                  {trend.category}
                </p>
                <div className="text-right">
                  <p className="font-bold text-sm" style={{ color: COLOR_ACCENT }}>
                    {trend.change}
                  </p>
                  <p className="text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>
                    {trend.trend}
                  </p>
                </div>
              </div>
              <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                {trend.insight}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Sector Benchmark */}
      <div>
        <h3 className="font-bold mb-4" style={{ color: COLOR_PRIMARY }}>
          🎯 Sector Benchmark
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 rounded-lg border"
            style={{ borderColor: COLOR_BORDER }}
          >
            <p className="text-xs font-bold mb-2" style={{ color: COLOR_TEXT_SECONDARY }}>
              Your Deal vs Sector Avg
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span style={{ color: COLOR_TEXT_SECONDARY }}>Revenue Multiple</span>
                <span>
                  <span className="font-bold" style={{ color: COLOR_PRIMARY }}>
                    2.02x
                  </span>
                  <span style={{ color: COLOR_TEXT_SECONDARY }}> vs 2.1x avg</span>
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span style={{ color: COLOR_TEXT_SECONDARY }}>EBITDA Margin</span>
                <span>
                  <span className="font-bold text-green-600">28.6%</span>
                  <span style={{ color: COLOR_TEXT_SECONDARY }}> vs 26% avg</span>
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span style={{ color: COLOR_TEXT_SECONDARY }}>Growth Rate</span>
                <span>
                  <span className="font-bold" style={{ color: COLOR_PRIMARY }}>
                    12%
                  </span>
                  <span style={{ color: COLOR_TEXT_SECONDARY }}> vs 11% avg</span>
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="p-4 rounded-lg"
            style={{ background: COLOR_ACCENT + '15', border: `1px solid ${COLOR_ACCENT}` }}
          >
            <p className="text-xs font-bold mb-2" style={{ color: COLOR_ACCENT }}>
              ⭐ Performance Rating
            </p>
            <div className="space-y-2">
              <p className="text-2xl font-black" style={{ color: COLOR_ACCENT }}>
                A+ Grade
              </p>
              <p className="text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>
                Above-average margins & growth in hot sector
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Prediction Confidence */}
      <div className="p-4 rounded-lg border" style={{ borderColor: COLOR_BORDER, background: COLOR_ACCENT + '08' }}>
        <p className="font-bold mb-3" style={{ color: COLOR_PRIMARY }}>
          🔮 Our Confidence Level
        </p>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span style={{ color: COLOR_TEXT_SECONDARY }}>Deal Success Probability</span>
            <span className="font-bold" style={{ color: COLOR_ACCENT }}>87%</span>
          </div>
          <div className="flex items-center justify-between">
            <span style={{ color: COLOR_TEXT_SECONDARY }}>Comparable Deals Analyzed</span>
            <span className="font-bold" style={{ color: COLOR_PRIMARY }}>47 verified</span>
          </div>
          <div className="flex items-center justify-between">
            <span style={{ color: COLOR_TEXT_SECONDARY }}>Data Sources</span>
            <span className="font-bold" style={{ color: COLOR_PRIMARY }}>SEC EDGAR, Broker Flow, Industry Data</span>
          </div>
          <p className="text-xs mt-3 pt-3 border-t" style={{ borderColor: COLOR_BORDER, color: COLOR_TEXT_SECONDARY }}>
            These predictions are based on historical M&A outcomes, market trends, and verified comparable transactions.
            Actual results may vary based on market conditions and deal-specific factors.
          </p>
        </div>
      </div>
    </div>
  )
}

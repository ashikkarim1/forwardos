'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, DollarSign, Clock, AlertCircle, CheckCircle2, Target } from 'lucide-react'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER, COLOR_SURFACE_SUCCESS } from '@/styles/forward-colors'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

interface OutcomePath {
  name: string
  valuation: string
  timeline: string
  liquidity: string
  control: string
  capital: string
  icon: React.ComponentType<{ className: string }>
  keyBenefit: string
  score?: number
}

export default function OutcomesAnalysisPage() {
  const [revenue, setRevenue] = useState('')
  const [growth, setGrowth] = useState('')
  const [profitability, setProfitability] = useState('')
  const [stage, setStage] = useState('growth')
  const [goals, setGoals] = useState('liquidity')
  const [loading, setLoading] = useState(false)
  const [outcomes, setOutcomes] = useState<any>(null)

  const handleAnalyze = async () => {
    if (!revenue || !growth || !profitability) {
      alert('Please fill in all required fields')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/tools/outcomes-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          revenue: parseFloat(revenue),
          growth: parseFloat(growth),
          profitability: parseFloat(profitability),
          stage,
          goals,
          capitalNeeds: stage === 'growth' ? 3 : stage === 'scale' ? 5 : 2,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setOutcomes(data)
      }
    } catch (error) {
      console.error('Error analyzing outcomes:', error)
    } finally {
      setLoading(false)
    }
  }

  const pathColors: Record<string, string> = {
    sale: '#10b981',
    merger: '#3b82f6',
    recap: COLOR_ACCENT,
    ipo: '#8b5cf6',
    growth: '#ec4899',
  }

  return (
    <motion.div
      className="max-w-7xl mx-auto px-6 py-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-12">
        <h1 className="text-5xl font-black mb-4" style={{ color: COLOR_PRIMARY }}>
          Strategic Outcomes Engine
        </h1>
        <p className="text-xl" style={{ color: COLOR_TEXT_SECONDARY }}>
          Compare all 5 exit pathways. Discover your highest-value future. Understand liquidity, control, and timeline tradeoffs.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Form */}
        <motion.div
          variants={itemVariants}
          className="p-8 rounded-lg border"
          style={{ borderColor: COLOR_BORDER, background: 'white' }}
        >
          <h2 className="text-2xl font-black mb-6" style={{ color: COLOR_PRIMARY }}>
            Your Profile
          </h2>

          <div className="space-y-6">
            {/* Annual Revenue */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: COLOR_PRIMARY }}>
                Annual Revenue (AED)
              </label>
              <input
                type="number"
                value={revenue}
                onChange={(e) => setRevenue(e.target.value)}
                placeholder="e.g., 5000000"
                className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
                style={{ borderColor: COLOR_BORDER, '--tw-ring-color': COLOR_ACCENT } as any}
              />
            </div>

            {/* Growth Rate */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: COLOR_PRIMARY }}>
                YoY Growth Rate (%)
              </label>
              <input
                type="number"
                value={growth}
                onChange={(e) => setGrowth(e.target.value)}
                placeholder="e.g., 25"
                className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
                style={{ borderColor: COLOR_BORDER, '--tw-ring-color': COLOR_ACCENT } as any}
              />
            </div>

            {/* Profitability */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: COLOR_PRIMARY }}>
                Net Profit Margin (%)
              </label>
              <input
                type="number"
                value={profitability}
                onChange={(e) => setProfitability(e.target.value)}
                placeholder="e.g., 20"
                className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
                style={{ borderColor: COLOR_BORDER, '--tw-ring-color': COLOR_ACCENT } as any}
              />
            </div>

            {/* Stage */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: COLOR_PRIMARY }}>
                Business Stage
              </label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
                style={{ borderColor: COLOR_BORDER, '--tw-ring-color': COLOR_ACCENT } as any}
              >
                <option value="startup">Startup (0-2 years)</option>
                <option value="growth">Growth (2-5 years)</option>
                <option value="scale">Scale (5-10 years)</option>
                <option value="mature">Mature (10+ years)</option>
              </select>
            </div>

            {/* Primary Goal */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: COLOR_PRIMARY }}>
                Primary Goal
              </label>
              <select
                value={goals}
                onChange={(e) => setGoals(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
                style={{ borderColor: COLOR_BORDER, '--tw-ring-color': COLOR_ACCENT } as any}
              >
                <option value="liquidity">Liquidity (exit now)</option>
                <option value="control">Control (keep ownership)</option>
                <option value="growth">Growth (raise capital)</option>
                <option value="timeline">Timeline (exit by year X)</option>
              </select>
            </div>

            {/* Submit Button */}
            <motion.button
              onClick={handleAnalyze}
              disabled={loading}
              className="w-full py-4 rounded-lg font-bold text-white text-lg transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
              style={{ background: COLOR_ACCENT }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? '⏳ Analyzing...' : '🎯 Compare Outcomes'}
            </motion.button>
          </div>
        </motion.div>

        {/* Results */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          {outcomes ? (
            <div className="space-y-6">
              {/* Recommendation */}
              <motion.div
                className="p-8 rounded-lg border-2"
                style={{ borderColor: COLOR_ACCENT, background: '#FFF7F3' }}
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <Target className="w-8 h-8" style={{ color: COLOR_ACCENT }} />
                  <h3 className="text-2xl font-black" style={{ color: COLOR_PRIMARY }}>
                    Recommended Path
                  </h3>
                </div>
                <p className="text-lg" style={{ color: COLOR_TEXT_SECONDARY }}>
                  {outcomes.recommendation}
                </p>
              </motion.div>

              {/* Paths Grid */}
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                variants={containerVariants}
              >
                {outcomes.paths.map((path: OutcomePath, idx: number) => (
                  <motion.div
                    key={idx}
                    className="p-6 rounded-lg border-2 relative overflow-hidden"
                    style={{
                      borderColor: pathColors[path.name.toLowerCase()] || COLOR_BORDER,
                      background: 'white',
                    }}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02, y: -4 }}
                  >
                    {/* Score Badge */}
                    {path.score && (
                      <div
                        className="absolute top-4 right-4 w-12 h-12 rounded-full flex items-center justify-center font-bold text-white"
                        style={{ background: pathColors[path.name.toLowerCase()] || COLOR_ACCENT }}
                      >
                        {path.score}
                      </div>
                    )}

                    <h4 className="text-lg font-black mb-4" style={{ color: COLOR_PRIMARY }}>
                      {path.name}
                    </h4>

                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="font-semibold mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                          💰 Valuation
                        </p>
                        <p style={{ color: COLOR_PRIMARY }} className="font-bold">
                          {path.valuation}
                        </p>
                      </div>

                      <div>
                        <p className="font-semibold mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                          ⏱️ Timeline
                        </p>
                        <p style={{ color: COLOR_PRIMARY }} className="font-bold">
                          {path.timeline}
                        </p>
                      </div>

                      <div>
                        <p className="font-semibold mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                          💵 Liquidity
                        </p>
                        <p style={{ color: COLOR_PRIMARY }} className="font-bold">
                          {path.liquidity}
                        </p>
                      </div>

                      <div>
                        <p className="font-semibold mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                          🎯 Control
                        </p>
                        <p style={{ color: COLOR_PRIMARY }} className="font-bold">
                          {path.control}
                        </p>
                      </div>

                      <div className="pt-2 border-t" style={{ borderColor: COLOR_BORDER }}>
                        <p className="text-xs italic" style={{ color: COLOR_TEXT_SECONDARY }}>
                          {path.keyBenefit}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Analysis */}
              <motion.div
                className="p-6 rounded-lg border"
                style={{ borderColor: COLOR_BORDER, background: 'white' }}
                variants={itemVariants}
              >
                <h4 className="font-bold mb-3" style={{ color: COLOR_PRIMARY }}>
                  Full Analysis
                </h4>
                <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-sm leading-relaxed">
                  {outcomes.analysis}
                </p>
              </motion.div>
            </div>
          ) : (
            <motion.div
              className="p-12 rounded-lg border-2 text-center"
              style={{ borderColor: COLOR_BORDER, background: '#FAFAF8' }}
              variants={itemVariants}
            >
              <Target className="w-12 h-12 mx-auto mb-4" style={{ color: COLOR_ACCENT, opacity: 0.3 }} />
              <p style={{ color: COLOR_TEXT_SECONDARY }}>
                Fill in your business profile to see all 5 exit pathways
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}

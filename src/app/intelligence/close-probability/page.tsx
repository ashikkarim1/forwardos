'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, AlertTriangle, CheckCircle2, Clock, DollarSign } from 'lucide-react'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER, COLOR_SURFACE_SUCCESS } from '@/styles/forward-colors'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function CloseProbabilityPage() {
  const [dealId, setDealId] = useState('')
  const [loading, setLoading] = useState(false)
  const [probability, setProbability] = useState<any>(null)

  const handleAnalyze = async () => {
    if (!dealId) {
      alert('Please enter a deal ID')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/intelligence/close-probability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dealId }),
      })

      if (response.ok) {
        const data = await response.json()
        setProbability(data)
      }
    } catch (error) {
      console.error('Error analyzing probability:', error)
    } finally {
      setLoading(false)
    }
  }

  const getProbabilityColor = (prob: number) => {
    if (prob >= 75) return '#10b981' // Green
    if (prob >= 50) return COLOR_ACCENT // Orange
    return '#ef4444' // Red
  }

  const getProbabilityLabel = (prob: number) => {
    if (prob >= 75) return 'Very High'
    if (prob >= 50) return 'Moderate'
    if (prob >= 25) return 'Low'
    return 'Very Low'
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
          Close Probability Analyzer
        </h1>
        <p className="text-xl" style={{ color: COLOR_TEXT_SECONDARY }}>
          Predict the likelihood of transaction close with AI-powered analysis of deal factors.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input */}
        <motion.div
          variants={itemVariants}
          className="p-8 rounded-lg border"
          style={{ borderColor: COLOR_BORDER, background: 'white' }}
        >
          <h2 className="text-xl font-black mb-6" style={{ color: COLOR_PRIMARY }}>
            Analyze Deal
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: COLOR_PRIMARY }}>
                Deal ID / Name
              </label>
              <input
                type="text"
                value={dealId}
                onChange={(e) => setDealId(e.target.value)}
                placeholder="e.g., TechFlow-2026-Q2"
                className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
                style={{ borderColor: COLOR_BORDER, '--tw-ring-color': COLOR_ACCENT } as any}
              />
            </div>

            <motion.button
              onClick={handleAnalyze}
              disabled={loading}
              className="w-full py-3 rounded-lg font-bold text-white transition-all hover:opacity-90 disabled:opacity-50"
              style={{ background: COLOR_ACCENT }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? '⏳ Analyzing...' : '🎯 Analyze'}
            </motion.button>
          </div>
        </motion.div>

        {/* Results */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          {probability ? (
            <div className="space-y-6">
              {/* Main Probability */}
              <motion.div
                className="p-8 rounded-lg border-2"
                style={{ borderColor: COLOR_ACCENT, background: '#FFF7F3' }}
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
              >
                <h3 className="text-lg font-bold mb-4" style={{ color: COLOR_PRIMARY }}>
                  Overall Close Probability
                </h3>

                <div className="flex items-end gap-6">
                  <div>
                    <div
                      className="text-6xl font-black"
                      style={{ color: getProbabilityColor(probability.overallProbability) }}
                    >
                      {probability.overallProbability}%
                    </div>
                    <p className="text-sm mt-2" style={{ color: COLOR_TEXT_SECONDARY }}>
                      {getProbabilityLabel(probability.overallProbability)}
                    </p>
                  </div>

                  {/* Probability Bar */}
                  <div className="flex-1 h-2 rounded-full" style={{ background: '#E5E7EB' }}>
                    <motion.div
                      className="h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${probability.overallProbability}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      style={{ background: getProbabilityColor(probability.overallProbability) }}
                    />
                  </div>
                </div>
              </motion.div>

              {/* Key Factors */}
              <motion.div
                className="grid grid-cols-2 gap-4"
                variants={containerVariants}
              >
                {[
                  { label: 'Financing', value: `${probability.financing}%`, icon: DollarSign },
                  { label: 'Timeline', value: probability.timeline, icon: Clock },
                  { label: 'Buyer Seriousness', value: `${probability.buyerSeriousness}%`, icon: CheckCircle2 },
                  { label: 'Seller Confidence', value: `${probability.sellerConfidence}%`, icon: TrendingUp },
                ].map((factor, idx) => {
                  const Icon = factor.icon
                  return (
                    <motion.div
                      key={idx}
                      className="p-4 rounded-lg border"
                      style={{ borderColor: COLOR_BORDER, background: 'white' }}
                      variants={itemVariants}
                    >
                      <Icon className="w-5 h-5 mb-2" style={{ color: COLOR_ACCENT }} />
                      <p className="text-xs font-semibold mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                        {factor.label}
                      </p>
                      <p className="text-lg font-black" style={{ color: COLOR_PRIMARY }}>
                        {factor.value}
                      </p>
                    </motion.div>
                  )
                })}
              </motion.div>

              {/* Risk Factors */}
              {probability.riskFactors && probability.riskFactors.length > 0 && (
                <motion.div
                  className="p-6 rounded-lg border"
                  style={{ borderColor: COLOR_BORDER, background: 'white' }}
                  variants={itemVariants}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle className="w-5 h-5" style={{ color: '#ef4444' }} />
                    <h4 className="font-bold" style={{ color: COLOR_PRIMARY }}>
                      Risk Factors ({probability.riskFactors.length})
                    </h4>
                  </div>
                  <ul className="space-y-2">
                    {probability.riskFactors.map((risk: string, idx: number) => (
                      <li key={idx} className="text-sm flex items-start gap-2" style={{ color: COLOR_TEXT_SECONDARY }}>
                        <span style={{ color: '#ef4444' }}>⚠</span>
                        <span>{risk}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Recommendations */}
              <motion.div
                className="p-6 rounded-lg border-2"
                style={{ borderColor: COLOR_ACCENT, background: COLOR_SURFACE_SUCCESS }}
                variants={itemVariants}
              >
                <h4 className="font-bold mb-3" style={{ color: COLOR_PRIMARY }}>
                  Next Steps
                </h4>
                <ul className="space-y-2 text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                  <li>✅ {probability.recommendation1}</li>
                  <li>✅ {probability.recommendation2}</li>
                  <li>✅ {probability.recommendation3}</li>
                </ul>
              </motion.div>
            </div>
          ) : (
            <motion.div
              className="p-12 rounded-lg border-2 text-center"
              style={{ borderColor: COLOR_BORDER, background: '#FAFAF8' }}
              variants={itemVariants}
            >
              <TrendingUp className="w-12 h-12 mx-auto mb-4" style={{ color: COLOR_ACCENT, opacity: 0.3 }} />
              <p style={{ color: COLOR_TEXT_SECONDARY }}>
                Enter a deal ID to analyze close probability
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}

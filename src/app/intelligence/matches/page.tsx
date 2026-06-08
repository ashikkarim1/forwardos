'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Users, TrendingUp, Clock, DollarSign, CheckCircle2, AlertCircle } from 'lucide-react'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER, COLOR_SURFACE_SUCCESS } from '@/styles/forward-colors'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

interface Buyer {
  id: number
  name: string
  type: 'strategic' | 'pe' | 'family_office' | 'competitor' | 'expansion'
  score: number
  likelihood: number
  timeline: string
  financing: number
  rationale: string
}

const buyerTypeColors: Record<string, string> = {
  strategic: '#10b981',
  pe: '#3b82f6',
  family_office: '#8b5cf6',
  competitor: COLOR_ACCENT,
  expansion: '#ec4899',
}

const buyerTypeLabels: Record<string, string> = {
  strategic: '🏢 Strategic',
  pe: '💼 PE Fund',
  family_office: '👥 Family Office',
  competitor: '🔄 Competitor',
  expansion: '📈 Expansion',
}

export default function BuyerMatchPage() {
  const [listingId, setListingId] = useState('')
  const [loading, setLoading] = useState(false)
  const [matches, setMatches] = useState<Buyer[]>([])
  const [stats, setStats] = useState<any>(null)

  const handleAnalyze = async () => {
    if (!listingId) {
      alert('Please enter a listing ID')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/intelligence/matches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingId }),
      })

      if (response.ok) {
        const data = await response.json()
        setMatches(data.matches)
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Error fetching matches:', error)
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10b981'
    if (score >= 60) return COLOR_ACCENT
    if (score >= 40) return '#f59e0b'
    return '#ef4444'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent'
    if (score >= 60) return 'Strong'
    if (score >= 40) return 'Moderate'
    return 'Weak'
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
          Buyer Match Engine
        </h1>
        <p className="text-xl" style={{ color: COLOR_TEXT_SECONDARY }}>
          Identify the 17 most likely buyers for your business. Ranked by strategic fit score and likelihood of offer.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Input */}
        <motion.div
          variants={itemVariants}
          className="p-8 rounded-lg border"
          style={{ borderColor: COLOR_BORDER, background: 'white' }}
        >
          <h2 className="text-xl font-black mb-6" style={{ color: COLOR_PRIMARY }}>
            Enter Listing
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: COLOR_PRIMARY }}>
                Listing ID
              </label>
              <input
                type="text"
                value={listingId}
                onChange={(e) => setListingId(e.target.value)}
                placeholder="e.g., LST-2026-045"
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
              {loading ? '⏳ Matching...' : '🎯 Find Buyers'}
            </motion.button>

            {stats && (
              <motion.div
                className="mt-6 p-4 rounded-lg border"
                style={{ borderColor: COLOR_BORDER, background: '#FAFAF8' }}
                variants={itemVariants}
              >
                <h3 className="text-sm font-bold mb-3" style={{ color: COLOR_PRIMARY }}>
                  Match Summary
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span style={{ color: COLOR_TEXT_SECONDARY }}>Avg Score</span>
                    <span style={{ color: COLOR_PRIMARY }} className="font-bold">
                      {stats.avgScore}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: COLOR_TEXT_SECONDARY }}>Avg Likelihood</span>
                    <span style={{ color: COLOR_PRIMARY }} className="font-bold">
                      {stats.avgLikelihood}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: COLOR_TEXT_SECONDARY }}>Avg Timeline</span>
                    <span style={{ color: COLOR_PRIMARY }} className="font-bold">
                      {stats.avgTimeline}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Buyers List */}
        <motion.div variants={itemVariants} className="lg:col-span-3">
          {matches.length > 0 ? (
            <div className="space-y-4">
              {/* Legend */}
              <motion.div
                className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6 p-4 rounded-lg border"
                style={{ borderColor: COLOR_BORDER, background: 'white' }}
                variants={itemVariants}
              >
                {Object.entries(buyerTypeLabels).map(([key, label]) => (
                  <div key={key} className="flex items-center gap-2 text-xs">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ background: buyerTypeColors[key] }}
                    />
                    <span style={{ color: COLOR_TEXT_SECONDARY }}>{label}</span>
                  </div>
                ))}
              </motion.div>

              {/* Buyers */}
              <motion.div
                className="space-y-3"
                variants={containerVariants}
              >
                {matches.map((buyer, idx) => (
                  <motion.div
                    key={buyer.id}
                    className="p-5 rounded-lg border-l-4 hover:shadow-lg transition-all"
                    style={{
                      borderLeftColor: buyerTypeColors[buyer.type],
                      background: 'white',
                      borderColor: COLOR_BORDER,
                    }}
                    variants={itemVariants}
                    whileHover={{ scale: 1.01, x: 4 }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                      {/* Rank & Name */}
                      <div>
                        <p className="text-xs font-semibold mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                          #{idx + 1} {buyerTypeLabels[buyer.type]}
                        </p>
                        <p className="font-bold" style={{ color: COLOR_PRIMARY }}>
                          {buyer.name}
                        </p>
                      </div>

                      {/* Score */}
                      <div>
                        <p className="text-xs font-semibold mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                          Strategic Fit
                        </p>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm"
                            style={{ background: getScoreColor(buyer.score) }}
                          >
                            {buyer.score}
                          </div>
                          <span className="text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>
                            {getScoreLabel(buyer.score)}
                          </span>
                        </div>
                      </div>

                      {/* Likelihood */}
                      <div>
                        <p className="text-xs font-semibold mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                          Offer Likelihood
                        </p>
                        <div>
                          <div className="w-full h-2 rounded-full bg-gray-200 mb-1">
                            <motion.div
                              className="h-full rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${buyer.likelihood}%` }}
                              transition={{ duration: 0.8, ease: 'easeOut' }}
                              style={{ background: COLOR_ACCENT }}
                            />
                          </div>
                          <p className="text-sm font-bold" style={{ color: COLOR_PRIMARY }}>
                            {buyer.likelihood}%
                          </p>
                        </div>
                      </div>

                      {/* Timeline */}
                      <div>
                        <p className="text-xs font-semibold mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                          Timeline
                        </p>
                        <p className="font-bold" style={{ color: COLOR_PRIMARY }}>
                          {buyer.timeline}
                        </p>
                      </div>

                      {/* Financing */}
                      <div>
                        <p className="text-xs font-semibold mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                          Financing Ability
                        </p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 rounded-full bg-gray-200">
                            <div
                              className="h-full rounded-full"
                              style={{ width: `${buyer.financing}%`, background: '#10b981' }}
                            />
                          </div>
                          <span className="text-sm font-bold" style={{ color: COLOR_PRIMARY }}>
                            {buyer.financing}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Rationale */}
                    <p className="text-xs mt-3 pt-3 border-t" style={{ borderColor: COLOR_BORDER, color: COLOR_TEXT_SECONDARY }}>
                      💡 {buyer.rationale}
                    </p>
                  </motion.div>
                ))}
              </motion.div>

              {/* Summary Stats */}
              <motion.div
                className="p-6 rounded-lg border-2 mt-6"
                style={{ borderColor: COLOR_ACCENT, background: COLOR_SURFACE_SUCCESS }}
                variants={itemVariants}
              >
                <h4 className="font-bold mb-3" style={{ color: COLOR_PRIMARY }}>
                  Next Steps
                </h4>
                <ul className="space-y-2 text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                  <li>✅ Top 3 buyers (scores 85+): Warm outreach this week</li>
                  <li>✅ Top 5-10 buyers (scores 70-85): Secondary outreach next week</li>
                  <li>✅ Prepare executive summary and teaser for distribution</li>
                  <li>✅ Brief financial advisor to coordinate buyer conversations</li>
                  <li>✅ Track buyer responsiveness — timeline impacts valuation</li>
                </ul>
              </motion.div>
            </div>
          ) : (
            <motion.div
              className="p-12 rounded-lg border-2 text-center"
              style={{ borderColor: COLOR_BORDER, background: '#FAFAF8' }}
              variants={itemVariants}
            >
              <Users className="w-12 h-12 mx-auto mb-4" style={{ color: COLOR_ACCENT, opacity: 0.3 }} />
              <p style={{ color: COLOR_TEXT_SECONDARY }}>
                Enter a listing ID to see your 17 matched buyers
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}

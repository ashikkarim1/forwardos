'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, DollarSign, AlertCircle, CheckCircle2 } from 'lucide-react'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER, COLOR_SURFACE_SUCCESS } from '@/styles/forward-colors'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function ValuationPage() {
  const [revenue, setRevenue] = useState('')
  const [ebitda, setEbitda] = useState('')
  const [industry, setIndustry] = useState('software')
  const [growth, setGrowth] = useState('')
  const [loading, setLoading] = useState(false)
  const [valuation, setValuation] = useState<any>(null)

  const handleValuation = async () => {
    if (!revenue || !ebitda || !growth) {
      alert('Please fill in all fields')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/tools/valuation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          annualRevenue: parseFloat(revenue),
          ebitda: parseFloat(ebitda),
          industry,
          growthRate: parseFloat(growth),
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setValuation(data)
      }
    } catch (error) {
      console.error('Valuation error:', error)
    } finally {
      setLoading(false)
    }
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
          Instant Business Valuation
        </h1>
        <p className="text-xl" style={{ color: COLOR_TEXT_SECONDARY }}>
          Get an AI-powered valuation range in seconds. Understand your business worth and explore exit options.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Input Form */}
        <motion.div
          variants={itemVariants}
          className="p-8 rounded-lg border"
          style={{ borderColor: COLOR_BORDER, background: 'white' }}
        >
          <h2 className="text-2xl font-black mb-6" style={{ color: COLOR_PRIMARY }}>
            Business Information
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
              <p className="text-xs mt-2" style={{ color: COLOR_TEXT_SECONDARY }}>
                Last 12 months revenue
              </p>
            </div>

            {/* EBITDA */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: COLOR_PRIMARY }}>
                EBITDA (AED)
              </label>
              <input
                type="number"
                value={ebitda}
                onChange={(e) => setEbitda(e.target.value)}
                placeholder="e.g., 1500000"
                className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
                style={{ borderColor: COLOR_BORDER, '--tw-ring-color': COLOR_ACCENT } as any}
              />
              <p className="text-xs mt-2" style={{ color: COLOR_TEXT_SECONDARY }}>
                Operating profit (EBITDA)
              </p>
            </div>

            {/* Industry */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: COLOR_PRIMARY }}>
                Industry
              </label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
                style={{ borderColor: COLOR_BORDER, '--tw-ring-color': COLOR_ACCENT } as any}
              >
                <option value="software">Software/SaaS</option>
                <option value="ecommerce">E-commerce</option>
                <option value="services">Professional Services</option>
                <option value="manufacturing">Manufacturing</option>
                <option value="healthcare">Healthcare</option>
                <option value="fintech">FinTech</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Growth Rate */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: COLOR_PRIMARY }}>
                Annual Growth Rate (%)
              </label>
              <input
                type="number"
                value={growth}
                onChange={(e) => setGrowth(e.target.value)}
                placeholder="e.g., 25"
                className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
                style={{ borderColor: COLOR_BORDER, '--tw-ring-color': COLOR_ACCENT } as any}
              />
              <p className="text-xs mt-2" style={{ color: COLOR_TEXT_SECONDARY }}>
                YoY growth rate
              </p>
            </div>

            {/* Submit Button */}
            <motion.button
              onClick={handleValuation}
              disabled={loading}
              className="w-full py-4 rounded-lg font-bold text-white text-lg transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
              style={{ background: COLOR_ACCENT }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? '⏳ Calculating...' : '💰 Get Valuation'}
            </motion.button>
          </div>
        </motion.div>

        {/* Results */}
        <motion.div variants={itemVariants}>
          {valuation ? (
            <div className="space-y-6">
              {/* Main Valuation */}
              <motion.div
                className="p-8 rounded-lg border-2"
                style={{ borderColor: COLOR_ACCENT, background: '#FFF7F3' }}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <DollarSign className="w-8 h-8" style={{ color: COLOR_ACCENT }} />
                  <h3 className="text-2xl font-black" style={{ color: COLOR_PRIMARY }}>
                    Valuation Range
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="p-6 rounded-lg" style={{ background: 'white', borderLeft: `4px solid ${COLOR_ACCENT}` }}>
                    <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-sm mb-2">
                      Conservative Estimate
                    </p>
                    <p className="text-3xl font-black" style={{ color: COLOR_ACCENT }}>
                      {valuation.conservative} AED
                    </p>
                  </div>

                  <div className="p-6 rounded-lg" style={{ background: 'white', borderLeft: `4px solid ${COLOR_ACCENT}` }}>
                    <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-sm mb-2">
                      Most Likely Estimate
                    </p>
                    <p className="text-3xl font-black" style={{ color: COLOR_PRIMARY }}>
                      {valuation.likely} AED
                    </p>
                  </div>

                  <div className="p-6 rounded-lg" style={{ background: 'white', borderLeft: `4px solid ${COLOR_ACCENT}` }}>
                    <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-sm mb-2">
                      Optimistic Estimate
                    </p>
                    <p className="text-3xl font-black" style={{ color: COLOR_ACCENT }}>
                      {valuation.optimistic} AED
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Metrics */}
              <motion.div
                className="grid grid-cols-2 gap-4"
                variants={containerVariants}
              >
                {[
                  { label: 'Revenue Multiple', value: valuation.revenueMultiple, icon: TrendingUp },
                  { label: 'EBITDA Multiple', value: valuation.ebitdaMultiple, icon: DollarSign },
                  { label: 'Growth Premium', value: `${valuation.growthPremium}%`, icon: TrendingUp },
                  { label: 'Confidence', value: valuation.confidence, icon: CheckCircle2 },
                ].map((metric, idx) => {
                  const Icon = metric.icon
                  return (
                    <motion.div
                      key={idx}
                      className="p-4 rounded-lg border"
                      style={{ borderColor: COLOR_BORDER, background: 'white' }}
                      variants={itemVariants}
                    >
                      <Icon className="w-5 h-5 mb-2" style={{ color: COLOR_ACCENT }} />
                      <p className="text-xs font-semibold mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                        {metric.label}
                      </p>
                      <p className="text-lg font-black" style={{ color: COLOR_PRIMARY }}>
                        {metric.value}
                      </p>
                    </motion.div>
                  )
                })}
              </motion.div>

              {/* Next Steps */}
              <motion.div
                className="p-6 rounded-lg border-2"
                style={{ borderColor: COLOR_ACCENT, background: COLOR_SURFACE_SUCCESS }}
                variants={itemVariants}
              >
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="w-5 h-5" style={{ color: COLOR_ACCENT }} />
                  <h4 className="font-bold" style={{ color: COLOR_PRIMARY }}>
                    Next Steps
                  </h4>
                </div>
                <ul className="space-y-2 text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                  <li>✅ Create a listing to reach 17+ likely buyers</li>
                  <li>✅ Upload financials for diligence readiness check</li>
                  <li>✅ Explore exit options (sale, recap, IPO)</li>
                  <li>✅ Get matched with strategic acquirers</li>
                </ul>
              </motion.div>
            </div>
          ) : (
            <motion.div
              className="p-8 rounded-lg border-2 text-center"
              style={{ borderColor: COLOR_BORDER, background: '#FAFAF8' }}
              variants={itemVariants}
            >
              <AlertCircle className="w-12 h-12 mx-auto mb-4" style={{ color: COLOR_ACCENT, opacity: 0.3 }} />
              <p style={{ color: COLOR_TEXT_SECONDARY }}>
                Fill in your business details to the left to get started.
              </p>
              <p className="text-sm mt-2" style={{ color: COLOR_TEXT_SECONDARY }}>
                It takes less than 60 seconds.
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}

'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, Download, Copy, Zap, CheckCircle2, AlertCircle } from 'lucide-react'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER, COLOR_SURFACE_SUCCESS } from '@/styles/forward-colors'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

interface CIMResult {
  executive_summary: string
  teaser: string
  cim_outline: string[]
  highlights: Array<{ metric: string; value: string }>
  narrative: string
}

export default function CIMGeneratorPage() {
  const [businessName, setBusinessName] = useState('')
  const [revenue, setRevenue] = useState('')
  const [ebitda, setEbitda] = useState('')
  const [customers, setCustomers] = useState('')
  const [yearFounded, setYearFounded] = useState('')
  const [keyMetrics, setKeyMetrics] = useState('')
  const [growth, setGrowth] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<CIMResult | null>(null)
  const [copied, setCopied] = useState(false)
  const [selectedTab, setSelectedTab] = useState<'summary' | 'teaser' | 'outline' | 'narrative'>('summary')

  const handleGenerate = async () => {
    if (!businessName || !revenue || !ebitda) {
      alert('Please fill in business name, revenue, and EBITDA')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/tools/cim-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName,
          revenue: parseFloat(revenue),
          ebitda: parseFloat(ebitda),
          customers: parseInt(customers) || 0,
          yearFounded: parseInt(yearFounded) || 0,
          keyMetrics,
          growth: parseFloat(growth) || 0,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setResult(data)
      }
    } catch (error) {
      console.error('Error generating CIM:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
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
          AI CIM & Teaser Generator
        </h1>
        <p className="text-xl" style={{ color: COLOR_TEXT_SECONDARY }}>
          Generate professional Confidential Information Memorandums and teasers in 60 seconds. No writers or consultants needed.
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
            Business Details
          </h2>

          <div className="space-y-6">
            {/* Business Name */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: COLOR_PRIMARY }}>
                Business Name
              </label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g., TechFlow Solutions"
                className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
                style={{ borderColor: COLOR_BORDER, '--tw-ring-color': COLOR_ACCENT } as any}
              />
            </div>

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
            </div>

            {/* Number of Customers */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: COLOR_PRIMARY }}>
                Number of Customers
              </label>
              <input
                type="number"
                value={customers}
                onChange={(e) => setCustomers(e.target.value)}
                placeholder="e.g., 250"
                className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
                style={{ borderColor: COLOR_BORDER, '--tw-ring-color': COLOR_ACCENT } as any}
              />
            </div>

            {/* Year Founded */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: COLOR_PRIMARY }}>
                Year Founded
              </label>
              <input
                type="number"
                value={yearFounded}
                onChange={(e) => setYearFounded(e.target.value)}
                placeholder="e.g., 2015"
                className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
                style={{ borderColor: COLOR_BORDER, '--tw-ring-color': COLOR_ACCENT } as any}
              />
            </div>

            {/* Key Metrics */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: COLOR_PRIMARY }}>
                Key Metrics (comma-separated)
              </label>
              <textarea
                value={keyMetrics}
                onChange={(e) => setKeyMetrics(e.target.value)}
                placeholder="e.g., 90% retention, 40% gross margin, 5 years revenue history"
                className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 resize-none"
                style={{ borderColor: COLOR_BORDER, '--tw-ring-color': COLOR_ACCENT } as any}
                rows={3}
              />
            </div>

            {/* Generate Button */}
            <motion.button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full py-4 rounded-lg font-bold text-white text-lg transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
              style={{ background: COLOR_ACCENT }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <>⏳ Generating...</>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  Generate CIM & Teaser
                </>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Results */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          {result ? (
            <div className="space-y-6">
              {/* Highlights */}
              <motion.div
                className="p-8 rounded-lg border-2"
                style={{ borderColor: COLOR_ACCENT, background: '#FFF7F3' }}
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
              >
                <h3 className="text-xl font-black mb-4" style={{ color: COLOR_PRIMARY }}>
                  Key Metrics
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {result.highlights.map((hl, idx) => (
                    <div key={idx} className="p-3 rounded-lg" style={{ background: 'white' }}>
                      <p className="text-xs font-semibold mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                        {hl.metric}
                      </p>
                      <p className="font-black" style={{ color: COLOR_PRIMARY }}>
                        {hl.value}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Tabs */}
              <div className="flex border rounded-lg overflow-hidden" style={{ borderColor: COLOR_BORDER }}>
                {(['summary', 'teaser', 'outline', 'narrative'] as const).map((tab) => (
                  <motion.button
                    key={tab}
                    onClick={() => setSelectedTab(tab)}
                    className="flex-1 py-3 font-semibold text-sm transition-all"
                    style={{
                      background: selectedTab === tab ? COLOR_ACCENT : 'white',
                      color: selectedTab === tab ? 'white' : COLOR_PRIMARY,
                      borderRight:
                        tab !== 'narrative'
                          ? `1px solid ${COLOR_BORDER}`
                          : 'none',
                    }}
                  >
                    {tab === 'summary' && '📄 Summary'}
                    {tab === 'teaser' && '🎯 Teaser'}
                    {tab === 'outline' && '📋 Outline'}
                    {tab === 'narrative' && '📖 Narrative'}
                  </motion.button>
                ))}
              </div>

              {/* Content */}
              <motion.div
                className="p-6 rounded-lg border"
                style={{ borderColor: COLOR_BORDER, background: 'white' }}
                variants={itemVariants}
              >
                {selectedTab === 'summary' && (
                  <div>
                    <p
                      className="text-sm leading-relaxed mb-4"
                      style={{ color: COLOR_TEXT_SECONDARY }}
                    >
                      {result.executive_summary}
                    </p>
                    <motion.button
                      onClick={() => handleCopy(result.executive_summary)}
                      className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg"
                      style={{ background: COLOR_SURFACE_SUCCESS, color: COLOR_PRIMARY }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <Copy className="w-4 h-4" />
                      {copied ? 'Copied!' : 'Copy'}
                    </motion.button>
                  </div>
                )}

                {selectedTab === 'teaser' && (
                  <div>
                    <p
                      className="text-sm leading-relaxed mb-4"
                      style={{ color: COLOR_TEXT_SECONDARY }}
                    >
                      {result.teaser}
                    </p>
                    <motion.button
                      onClick={() => handleCopy(result.teaser)}
                      className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg"
                      style={{ background: COLOR_SURFACE_SUCCESS, color: COLOR_PRIMARY }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <Copy className="w-4 h-4" />
                      {copied ? 'Copied!' : 'Copy'}
                    </motion.button>
                  </div>
                )}

                {selectedTab === 'outline' && (
                  <div>
                    <ul className="space-y-2 mb-4">
                      {result.cim_outline.map((item, idx) => (
                        <li
                          key={idx}
                          className="text-sm flex items-start gap-2"
                          style={{ color: COLOR_TEXT_SECONDARY }}
                        >
                          <span style={{ color: COLOR_ACCENT }}>•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <motion.button
                      onClick={() => handleCopy(result.cim_outline.join('\n'))}
                      className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg"
                      style={{ background: COLOR_SURFACE_SUCCESS, color: COLOR_PRIMARY }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <Copy className="w-4 h-4" />
                      {copied ? 'Copied!' : 'Copy'}
                    </motion.button>
                  </div>
                )}

                {selectedTab === 'narrative' && (
                  <div>
                    <p
                      className="text-sm leading-relaxed mb-4"
                      style={{ color: COLOR_TEXT_SECONDARY }}
                    >
                      {result.narrative}
                    </p>
                    <motion.button
                      onClick={() => handleCopy(result.narrative)}
                      className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg"
                      style={{ background: COLOR_SURFACE_SUCCESS, color: COLOR_PRIMARY }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <Copy className="w-4 h-4" />
                      {copied ? 'Copied!' : 'Copy'}
                    </motion.button>
                  </div>
                )}
              </motion.div>

              {/* Next Steps */}
              <motion.div
                className="p-6 rounded-lg border-2"
                style={{ borderColor: COLOR_ACCENT, background: COLOR_SURFACE_SUCCESS }}
                variants={itemVariants}
              >
                <h4 className="font-bold mb-3" style={{ color: COLOR_PRIMARY }}>
                  Next Steps
                </h4>
                <ul className="space-y-2 text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                  <li>✅ Review and customize executive summary if needed</li>
                  <li>✅ Use teaser for initial buyer outreach</li>
                  <li>✅ Fill in 10-section CIM outline with detailed content</li>
                  <li>✅ Add financials, contracts, customer data to data room</li>
                  <li>✅ Set up meeting to discuss exit timeline and buyer preferences</li>
                </ul>
              </motion.div>
            </div>
          ) : (
            <motion.div
              className="p-12 rounded-lg border-2 text-center"
              style={{ borderColor: COLOR_BORDER, background: '#FAFAF8' }}
              variants={itemVariants}
            >
              <FileText className="w-12 h-12 mx-auto mb-4" style={{ color: COLOR_ACCENT, opacity: 0.3 }} />
              <p style={{ color: COLOR_TEXT_SECONDARY }}>
                Fill in your business details to generate professional documents
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}

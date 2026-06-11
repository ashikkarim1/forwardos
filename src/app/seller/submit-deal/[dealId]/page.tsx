'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Upload, FileText, CheckCircle2, AlertCircle, TrendingUp, Users, BarChart3 } from 'lucide-react'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER, COLOR_BG_PRIMARY } from '@/styles/forward-colors'

interface FinancialData {
  revenue: number[]
  ebitda: number[]
  customers: { name: string; revenue: number }[]
  growthRate: number
  margin: number
}

interface SubmissionData {
  businessDescription: string
  foundingYear: number
  teamSize: number
  topCustomers: string
  financialsSummary: string
  uploadedFiles: { name: string; type: string; size: number }[]
  financialData?: FinancialData
}

const COMPLETION_TIERS = {
  basic: { label: 'Basic Listing', percentages: [25, 25, 25, 25] },
  premium: { label: 'Premium Verified', percentages: [15, 20, 30, 35] },
  fullTransparency: { label: 'Full Transparency', percentages: [10, 15, 25, 50] },
}

export default function SellerSubmitDeal() {
  const params = useParams()
  const dealId = params?.dealId as string

  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<SubmissionData>({
    businessDescription: '',
    foundingYear: new Date().getFullYear() - 5,
    teamSize: 10,
    topCustomers: '',
    financialsSummary: '',
    uploadedFiles: [],
  })

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [completenessScore, setCompletenessScore] = useState(0)
  const [parsedFinancials, setParsedFinancials] = useState<FinancialData | null>(null)

  const calculateCompletenessScore = (data: SubmissionData) => {
    let score = 0
    if (data.businessDescription.length > 50) score += 15
    if (data.foundingYear > 0) score += 10
    if (data.teamSize > 0) score += 10
    if (data.topCustomers.length > 20) score += 20
    if (data.financialsSummary.length > 50) score += 20
    if (data.uploadedFiles.length > 0) score += 25
    return Math.min(100, score)
  }

  const handleInputChange = (field: keyof SubmissionData, value: any) => {
    const updated = { ...formData, [field]: value }
    setFormData(updated)
    setCompletenessScore(calculateCompletenessScore(updated))
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setUploadedFiles([...uploadedFiles, ...newFiles])

      const fileData = newFiles.map(f => ({
        name: f.name,
        type: f.type,
        size: f.size,
      }))
      handleInputChange('uploadedFiles', [...formData.uploadedFiles, ...fileData])

      // Mock: Parse first Excel/CSV file
      if (newFiles[0]?.name.includes('.csv') || newFiles[0]?.name.includes('.xlsx')) {
        setParsedFinancials({
          revenue: [450000, 680000, 850000],
          ebitda: [90000, 136000, 187000],
          customers: [
            { name: 'Enterprise Corp', revenue: 170000 },
            { name: 'Tech Solutions Ltd', revenue: 127500 },
            { name: 'Innovation Labs', revenue: 105625 },
          ],
          growthRate: 45,
          margin: 22,
        })
      }
    }
  }

  const getTierStatus = () => {
    if (completenessScore >= 80) return COMPLETION_TIERS.fullTransparency
    if (completenessScore >= 50) return COMPLETION_TIERS.premium
    return COMPLETION_TIERS.basic
  }

  const tier = getTierStatus()

  return (
    <div className="min-h-screen" style={{ background: COLOR_BG_PRIMARY }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 border-b"
        style={{ borderColor: COLOR_BORDER, background: 'white' }}
      >
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-6">
          <h1 className="text-3xl font-black mb-2" style={{ color: COLOR_PRIMARY }}>
            Submit Business Data
          </h1>
          <p style={{ color: COLOR_TEXT_SECONDARY }}>
            Enhance your listing with verified business intelligence. Attract serious buyers faster.
          </p>
        </div>
      </motion.div>

      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <div className="space-y-6">
              {/* Step 1: Business Overview */}
              <motion.div className="bg-white rounded-lg border p-6" style={{ borderColor: COLOR_BORDER }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold" style={{ background: step === 1 ? COLOR_ACCENT : COLOR_TEXT_SECONDARY }}>
                    1
                  </div>
                  <h2 className="text-xl font-bold" style={{ color: COLOR_PRIMARY }}>Business Overview</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: COLOR_PRIMARY }}>
                      Business Description
                    </label>
                    <textarea
                      placeholder="Describe your business in 2-3 sentences. What do you do, who are your customers, what makes you unique?"
                      value={formData.businessDescription}
                      onChange={(e) => handleInputChange('businessDescription', e.target.value)}
                      className="w-full p-3 rounded-lg border text-sm resize-none h-24 focus:outline-none focus:ring-2"
                      style={{ borderColor: COLOR_BORDER, outlineColor: COLOR_ACCENT }}
                    />
                    <p className="text-xs mt-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                      {formData.businessDescription.length}/250 characters
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2" style={{ color: COLOR_PRIMARY }}>
                        Founding Year
                      </label>
                      <input
                        type="number"
                        min="1990"
                        max={new Date().getFullYear()}
                        value={formData.foundingYear}
                        onChange={(e) => handleInputChange('foundingYear', parseInt(e.target.value))}
                        className="w-full p-3 rounded-lg border text-sm focus:outline-none focus:ring-2"
                        style={{ borderColor: COLOR_BORDER, outlineColor: COLOR_ACCENT }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2" style={{ color: COLOR_PRIMARY }}>
                        Team Size
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={formData.teamSize}
                        onChange={(e) => handleInputChange('teamSize', parseInt(e.target.value))}
                        className="w-full p-3 rounded-lg border text-sm focus:outline-none focus:ring-2"
                        style={{ borderColor: COLOR_BORDER, outlineColor: COLOR_ACCENT }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: COLOR_PRIMARY }}>
                      Top 5 Customers (comma-separated)
                    </label>
                    <textarea
                      placeholder="e.g., Acme Corp, TechFlow Inc, Digital Solutions"
                      value={formData.topCustomers}
                      onChange={(e) => handleInputChange('topCustomers', e.target.value)}
                      className="w-full p-3 rounded-lg border text-sm resize-none h-20 focus:outline-none focus:ring-2"
                      style={{ borderColor: COLOR_BORDER, outlineColor: COLOR_ACCENT }}
                    />
                  </div>
                </div>
              </motion.div>

              {/* Step 2: Financial Summary */}
              <motion.div className="bg-white rounded-lg border p-6" style={{ borderColor: COLOR_BORDER }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold" style={{ background: step >= 2 ? COLOR_ACCENT : COLOR_TEXT_SECONDARY }}>
                    2
                  </div>
                  <h2 className="text-xl font-bold" style={{ color: COLOR_PRIMARY }}>Financial Summary</h2>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: COLOR_PRIMARY }}>
                    Last 2 Years Financial Overview
                  </label>
                  <textarea
                    placeholder="Summarize your last 2 years of performance: Revenue trend, profitability, key metrics, growth drivers"
                    value={formData.financialsSummary}
                    onChange={(e) => handleInputChange('financialsSummary', e.target.value)}
                    className="w-full p-3 rounded-lg border text-sm resize-none h-24 focus:outline-none focus:ring-2"
                    style={{ borderColor: COLOR_BORDER, outlineColor: COLOR_ACCENT }}
                  />
                </div>
              </motion.div>

              {/* Step 3: File Upload */}
              <motion.div className="bg-white rounded-lg border p-6" style={{ borderColor: COLOR_BORDER }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold" style={{ background: step >= 3 ? COLOR_ACCENT : COLOR_TEXT_SECONDARY }}>
                    3
                  </div>
                  <h2 className="text-xl font-bold" style={{ color: COLOR_PRIMARY }}>Upload Documents</h2>
                </div>

                <div className="space-y-4">
                  <div className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors" style={{ borderColor: COLOR_ACCENT }}>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.xlsx,.csv,.doc,.docx"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <Upload size={32} className="mx-auto mb-2" style={{ color: COLOR_ACCENT }} />
                      <p className="font-semibold" style={{ color: COLOR_PRIMARY }}>
                        Upload Financial Statements, P&L, Contracts
                      </p>
                      <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                        PDF, Excel, Word • Up to 50MB
                      </p>
                    </label>
                  </div>

                  {uploadedFiles.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-semibold" style={{ color: COLOR_PRIMARY }}>
                        Uploaded Files ({uploadedFiles.length})
                      </p>
                      {uploadedFiles.map((file, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3 rounded-lg" style={{ background: COLOR_BG_PRIMARY }}>
                          <FileText size={20} style={{ color: COLOR_ACCENT }} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate" style={{ color: COLOR_PRIMARY }}>
                              {file.name}
                            </p>
                            <p className="text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                          <CheckCircle2 size={20} style={{ color: '#10B981' }} />
                        </div>
                      ))}
                    </div>
                  )}

                  {parsedFinancials && (
                    <div className="p-4 rounded-lg" style={{ background: '#D1FAE515', borderLeft: '4px solid #10B981' }}>
                      <p className="text-sm font-semibold flex items-center gap-2" style={{ color: '#065F46' }}>
                        <CheckCircle2 size={18} />
                        Financial data parsed successfully!
                      </p>
                      <p className="text-xs mt-1" style={{ color: '#047857' }}>
                        Revenue trend, customer data, and margins extracted
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => alert(`Deal ${dealId} submitted! Data will appear on buyer page.`)}
                className="w-full py-4 rounded-lg font-bold text-white transition-all hover:opacity-90"
                style={{ background: COLOR_ACCENT }}
              >
                Submit Business Data
              </motion.button>
            </div>
          </motion.div>

          {/* Completeness Score Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-24 space-y-6">
              {/* Completeness Score */}
              <div className="bg-white rounded-lg border p-6" style={{ borderColor: COLOR_BORDER }}>
                <h3 className="text-lg font-bold mb-4" style={{ color: COLOR_PRIMARY }}>
                  Data Completeness
                </h3>

                <div className="mb-6">
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
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
                        strokeDasharray={`${(completenessScore / 100) * 283} 283`}
                        strokeLinecap="round"
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <p className="text-3xl font-black" style={{ color: COLOR_PRIMARY }}>
                        {completenessScore}%
                      </p>
                      <p className="text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>
                        Complete
                      </p>
                    </div>
                  </div>

                  <p className="text-center text-sm font-bold" style={{ color: COLOR_PRIMARY }}>
                    {tier.label}
                  </p>
                </div>

                {/* Tier Badge */}
                <div className="p-3 rounded-lg text-center mb-4" style={{ background: COLOR_BG_PRIMARY }}>
                  <p className="text-xs font-bold" style={{ color: COLOR_PRIMARY }}>
                    {completenessScore >= 80
                      ? '🔓 Full Transparency Tier'
                      : completenessScore >= 50
                        ? '🔐 Premium Verified'
                        : '📋 Basic Listing'}
                  </p>
                </div>
              </div>

              {/* Tier Benefits */}
              <div className="bg-white rounded-lg border p-6" style={{ borderColor: COLOR_BORDER }}>
                <h3 className="text-lg font-bold mb-4" style={{ color: COLOR_PRIMARY }}>
                  Benefits By Tier
                </h3>

                <div className="space-y-3">
                  {[
                    {
                      tier: 'Basic',
                      benefits: ['Listed on marketplace', 'Basic metrics shown'],
                      icon: '📋',
                    },
                    {
                      tier: 'Premium',
                      benefits: ['Featured badge', 'Financial data visible', 'Trust score boost'],
                      icon: '🔐',
                    },
                    {
                      tier: 'Full Transparency',
                      benefits: ['Top seller badge', 'Data room access', 'Priority matching'],
                      icon: '🔓',
                    },
                  ].map((t, i) => (
                    <motion.div
                      key={i}
                      className="p-3 rounded-lg border text-sm"
                      style={{
                        borderColor:
                          completenessScore >= (t.tier === 'Basic' ? 0 : t.tier === 'Premium' ? 50 : 80)
                            ? COLOR_ACCENT
                            : COLOR_BORDER,
                        background:
                          completenessScore >= (t.tier === 'Basic' ? 0 : t.tier === 'Premium' ? 50 : 80)
                            ? COLOR_ACCENT + '10'
                            : COLOR_BG_PRIMARY,
                      }}
                    >
                      <p className="font-bold mb-1" style={{ color: COLOR_PRIMARY }}>
                        {t.icon} {t.tier}
                      </p>
                      <ul className="text-xs space-y-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                        {t.benefits.map((b, j) => (
                          <li key={j}>✓ {b}</li>
                        ))}
                      </ul>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Parsed Data Preview */}
              {parsedFinancials && (
                <div className="bg-white rounded-lg border p-6" style={{ borderColor: COLOR_BORDER }}>
                  <h3 className="text-lg font-bold mb-4" style={{ color: COLOR_PRIMARY }}>
                    Parsed Financial Data
                  </h3>

                  <div className="space-y-3 text-sm">
                    <div className="p-3 rounded-lg" style={{ background: COLOR_BG_PRIMARY }}>
                      <p className="text-xs mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                        Revenue (3-year trend)
                      </p>
                      <p className="font-bold" style={{ color: COLOR_PRIMARY }}>
                        ${parsedFinancials.revenue.map(r => (r / 1000).toFixed(0)).join('K → ')}K
                      </p>
                    </div>

                    <div className="p-3 rounded-lg" style={{ background: COLOR_BG_PRIMARY }}>
                      <p className="text-xs mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                        Growth Rate
                      </p>
                      <p className="font-bold" style={{ color: '#10B981' }}>
                        ↗ {parsedFinancials.growthRate}% YoY
                      </p>
                    </div>

                    <div className="p-3 rounded-lg" style={{ background: COLOR_BG_PRIMARY }}>
                      <p className="text-xs mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                        Top Customer
                      </p>
                      <p className="font-bold" style={{ color: COLOR_PRIMARY }}>
                        {parsedFinancials.customers[0]?.name}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

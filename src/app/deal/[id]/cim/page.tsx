'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useLocale } from '@/context/LocaleContext'
import { useTranslation } from '@/hooks/useTranslation'
import { Download, CheckCircle2, FileText, TrendingUp, BarChart3, Sparkles, Archive } from 'lucide-react'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER } from '@/styles/forward-colors'
import { PageHeader } from '@/components/PageHeader'
import { CIMCharts } from '@/components/cim/CIMCharts'
import { CIMAIInsights } from '@/components/cim/CIMAIInsights'
import { CIMMetricsTable } from '@/components/cim/CIMMetricsTable'

export default function CIMDashboardPage() {
  const params = useParams()
  const dealId = (params?.id || '') as string
  const { locale, isRTL } = useLocale()
  const t = useTranslation()

  // Sample deal data - in production, this would come from your API
  const deal = {
    id: dealId,
    name: 'SaaS Platform - Project Management',
    industry: 'Software',
    location: 'San Francisco',
    revenue: 850000,
    valuation: 2500000,
    ebitda: 255000,
    growthRate: 45,
    employees: 12,
    successProbability: 92,
    maaProbability: 87,
  }

  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([
    'executive-summary',
    'financial-statements',
    'market-analysis',
    'team-structure',
    'valuation-analysis',
    'risk-assessment',
    'growth-projections',
  ])

  const documents = [
    { id: 'executive-summary', label: 'Executive Summary', size: '2.4 MB' },
    { id: 'financial-statements', label: 'Financial Statements (3Y)', size: '5.2 MB' },
    { id: 'market-analysis', label: 'Market Analysis & TAM', size: '3.8 MB' },
    { id: 'team-structure', label: 'Team & Org Structure', size: '1.2 MB' },
    { id: 'valuation-analysis', label: 'Valuation Analysis', size: '4.5 MB' },
    { id: 'risk-assessment', label: 'Risk Assessment', size: '2.1 MB' },
    { id: 'growth-projections', label: '5-Year Growth Projections', size: '3.3 MB' },
    { id: 'comparable-companies', label: 'Comparable Companies Analysis', size: '2.9 MB' },
    { id: 'customer-contracts', label: 'Key Customer Contracts', size: '6.7 MB' },
    { id: 'legal-docs', label: 'Legal & Compliance Docs', size: '4.1 MB' },
  ]

  const toggleDocument = (docId: string) => {
    setSelectedDocuments((prev) =>
      prev.includes(docId) ? prev.filter((id) => id !== docId) : [...prev, docId]
    )
  }

  const toggleAllDocuments = () => {
    if (selectedDocuments.length === documents.length) {
      setSelectedDocuments([])
    } else {
      setSelectedDocuments(documents.map((doc) => doc.id))
    }
  }

  const handleDownloadSelected = () => {
    console.log('Downloading selected:', selectedDocuments)
    // In production, this would trigger a ZIP download with selected files
    alert(`Downloading ${selectedDocuments.length} selected documents...`)
  }

  const handleDownloadAll = () => {
    console.log('Downloading all documents')
    // In production, this would trigger a complete ZIP download
    alert('Downloading complete CIM package...')
  }

  const totalSize = documents.reduce((acc, doc) => {
    const num = parseFloat(doc.size)
    return acc + num
  }, 0)

  return (
    <div className="min-h-screen bg-white" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Page Header with Breadcrumbs */}
      <PageHeader
        title="Confidential Information Memorandum"
        subtitle={`${deal.name} • ${deal.location}`}
        breadcrumbs={[
          { label: 'Marketplace', href: '/marketplace' },
          { label: deal.name, href: `/deal/${dealId}` },
          { label: 'CIM Dashboard' },
        ]}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2"
          style={{ color: COLOR_ACCENT }}
        >
          <Sparkles size={20} />
          <span className="text-sm font-bold">AI-Powered Dashboard</span>
        </motion.div>
      </PageHeader>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Analytics & Charts */}
          <div className="lg:col-span-2 space-y-8">
            {/* Key Metrics Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {[
                { label: 'Annual Revenue', value: `$${(deal.revenue / 1000).toFixed(0)}K`, icon: TrendingUp },
                { label: 'Valuation', value: `$${(deal.valuation / 1000000).toFixed(1)}M`, icon: BarChart3 },
                { label: 'Growth Rate', value: `${deal.growthRate}%`, icon: TrendingUp },
                { label: 'Success Probability', value: `${deal.successProbability}%`, icon: CheckCircle2 },
              ].map((metric, idx) => {
                const Icon = metric.icon
                return (
                  <div
                    key={idx}
                    className="p-6 rounded-lg border"
                    style={{ borderColor: COLOR_BORDER, background: COLOR_PRIMARY + '02' }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-wide" style={{ color: COLOR_TEXT_SECONDARY }}>
                        {metric.label}
                      </span>
                      <Icon size={18} style={{ color: COLOR_ACCENT }} />
                    </div>
                    <p className="text-2xl font-black" style={{ color: COLOR_PRIMARY }}>
                      {metric.value}
                    </p>
                  </div>
                )
              })}
            </motion.div>

            {/* Charts Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <CIMCharts deal={deal} />
            </motion.div>

            {/* AI Insights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <CIMAIInsights deal={deal} />
            </motion.div>

            {/* Detailed Metrics Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <CIMMetricsTable deal={deal} />
            </motion.div>
          </div>

          {/* Right Column - Document Selector & Downloads */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 space-y-6">
              {/* Download Actions */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-3"
              >
                <button
                  onClick={handleDownloadAll}
                  className="w-full py-3 px-4 rounded-lg font-bold text-white flex items-center justify-center gap-2 hover:opacity-90 transition-all"
                  style={{ background: COLOR_ACCENT }}
                >
                  <Download size={18} />
                  Download All (ZIP)
                </button>

                <button
                  onClick={handleDownloadSelected}
                  disabled={selectedDocuments.length === 0}
                  className="w-full py-3 px-4 rounded-lg font-bold border flex items-center justify-center gap-2 hover:bg-gray-50 transition-all disabled:opacity-50"
                  style={{
                    borderColor: COLOR_BORDER,
                    color: selectedDocuments.length === 0 ? COLOR_TEXT_SECONDARY : COLOR_PRIMARY,
                  }}
                >
                  <Archive size={18} />
                  Download Selected ({selectedDocuments.length})
                </button>
              </motion.div>

              {/* Document Selector */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="p-4 rounded-lg border"
                style={{ borderColor: COLOR_BORDER, background: COLOR_PRIMARY + '02' }}
              >
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold" style={{ color: COLOR_PRIMARY }}>
                      Documents
                    </h3>
                    <span className="text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>
                      Total: {totalSize.toFixed(1)} MB
                    </span>
                  </div>

                  {/* Select All Toggle */}
                  <button
                    onClick={toggleAllDocuments}
                    className="text-xs font-bold py-2 px-3 rounded hover:bg-gray-100 transition-colors w-full text-left"
                    style={{ color: COLOR_ACCENT }}
                  >
                    {selectedDocuments.length === documents.length ? '◻ Deselect All' : '✓ Select All'}
                  </button>
                </div>

                {/* Document List */}
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {documents.map((doc) => (
                    <label
                      key={doc.id}
                      className="flex items-start gap-3 p-2 rounded hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedDocuments.includes(doc.id)}
                        onChange={() => toggleDocument(doc.id)}
                        className="mt-1"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold" style={{ color: COLOR_PRIMARY }}>
                          {doc.label}
                        </p>
                        <p className="text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>
                          {doc.size}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </motion.div>

              {/* Info Box */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="p-4 rounded-lg border text-xs"
                style={{ borderColor: COLOR_BORDER, background: COLOR_ACCENT + '08', color: COLOR_TEXT_SECONDARY }}
              >
                <p className="mb-2 font-semibold" style={{ color: COLOR_PRIMARY }}>
                  💡 Pro Tip
                </p>
                <p>
                  Download selected documents to share with your team, or download the complete package for comprehensive due diligence.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

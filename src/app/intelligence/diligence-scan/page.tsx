'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  AlertTriangle, CheckCircle2, AlertCircle, TrendingUp, Users, FileText,
  Lock, Zap, BarChart3, Target, Shield, Clock, ArrowRight, Download
} from 'lucide-react'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER } from '@/styles/forward-colors'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

interface DiligenceItem {
  id: string
  category: string
  title: string
  status: 'pass' | 'warning' | 'fail' | 'incomplete'
  confidence: number
  findings: string[]
  recommendation: string
}

interface DiligenceReport {
  overallRisk: 'low' | 'medium' | 'high' | 'critical'
  overallScore: number
  completeness: number
  items: DiligenceItem[]
}

const mockReport: DiligenceReport = {
  overallRisk: 'medium',
  overallScore: 72,
  completeness: 88,
  items: [
    {
      id: '1',
      category: 'Financial Health',
      title: '✓ Revenue Trending',
      status: 'pass',
      confidence: 95,
      findings: [
        'Consistent YoY growth: +18% (2022→2023), +24% (2023→2024)',
        'Revenue run-rate AED 5M+ confirms current metrics',
        'No major customer concentration risk (top customer = 12% revenue)',
      ],
      recommendation: 'Strong financial trajectory. Low revenue risk.',
    },
    {
      id: '2',
      category: 'Financial Health',
      title: '⚠️ EBITDA Margins',
      status: 'warning',
      confidence: 87,
      findings: [
        'EBITDA margin: 30% (within SaaS benchmarks 25-35%)',
        'Recent expense increase: +8% Q1 2024 (vs. 3% historical avg)',
        'Cost structure shows heavy R&D allocation (18% revenue)',
      ],
      recommendation: 'Monitor expense growth. Consider growth rate sustainability.',
    },
    {
      id: '3',
      category: 'Legal & Compliance',
      title: '✓ Regulatory Compliance',
      status: 'pass',
      confidence: 92,
      findings: [
        'All required UAE business licenses current and verified',
        'No pending litigation or regulatory investigations',
        'Tax filing status: Current (all periods 2021-2024 filed)',
      ],
      recommendation: 'Clean regulatory record. Low legal risk.',
    },
    {
      id: '4',
      category: 'Legal & Compliance',
      title: '⚠️ IP Documentation',
      status: 'warning',
      confidence: 78,
      findings: [
        '2 patents filed (1 approved, 1 pending)',
        'Trademark registration: 1 local (Dubai), no international coverage',
        'Software copyrights: Self-registered, not formally notarized',
      ],
      recommendation: 'Consider formal IP protection before international expansion.',
    },
    {
      id: '5',
      category: 'Operations & Team',
      title: '✓ Key Personnel',
      status: 'pass',
      confidence: 89,
      findings: [
        'Founder/CEO: 12+ years industry experience',
        'Core team: 5 engineers (avg. 6 years SaaS experience)',
        'No key person departures in past 24 months',
      ],
      recommendation: 'Strong leadership. Low key person risk.',
    },
    {
      id: '6',
      category: 'Operations & Team',
      title: '🔴 Customer Retention',
      status: 'fail',
      confidence: 94,
      findings: [
        'Annual churn rate: 22% (SaaS benchmark: 5-12%)',
        '3 major customer losses in past 12 months (combined AED 420K ARR)',
        'NPS score: 32 (vs. SaaS benchmark: 50+)',
      ],
      recommendation: 'CRITICAL: Address customer satisfaction before exit. High churn is red flag.',
    },
    {
      id: '7',
      category: 'Market & Competition',
      title: '✓ Market Position',
      status: 'pass',
      confidence: 85,
      findings: [
        'TAM: AED 2.4B (Enterprise SaaS in UAE/KSA)',
        'Market share: ~0.2% (early mover advantage)',
        '4 direct competitors identified (2 larger, 2 smaller)',
      ],
      recommendation: 'Defensible position. Market dynamics favorable.',
    },
    {
      id: '8',
      category: 'Market & Competition',
      title: '⚠️ Customer Concentration',
      status: 'warning',
      confidence: 81,
      findings: [
        'Top 5 customers = 48% of revenue (vs. healthy target: <30%)',
        'Geographic concentration: 78% UAE revenue (growth opportunity)',
        'Vertical concentration: 65% financial services (diversification needed)',
      ],
      recommendation: 'Plan customer diversification. Expand geographic footprint.',
    },
  ],
}

const getRiskColor = (risk: string) => {
  switch (risk) {
    case 'low':
      return '#10B981'
    case 'medium':
      return COLOR_ACCENT
    case 'high':
      return '#F59E0B'
    case 'critical':
      return '#EF4444'
    default:
      return COLOR_TEXT_SECONDARY
  }
}

const getRiskLabel = (risk: string) => {
  switch (risk) {
    case 'low':
      return '✓ Low Risk'
    case 'medium':
      return '⚠️ Medium Risk'
    case 'high':
      return '⚠️ High Risk'
    case 'critical':
      return '🔴 Critical Risk'
    default:
      return risk
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'pass':
      return CheckCircle2
    case 'warning':
      return AlertCircle
    case 'fail':
      return AlertTriangle
    case 'incomplete':
      return Clock
    default:
      return FileText
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pass':
      return '#10B981'
    case 'warning':
      return COLOR_ACCENT
    case 'fail':
      return '#EF4444'
    case 'incomplete':
      return '#6B7280'
    default:
      return COLOR_TEXT_SECONDARY
  }
}

export default function DiligenceScanPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const categories = [...new Set(mockReport.items.map(i => i.category))]
  const filteredItems = selectedCategory
    ? mockReport.items.filter(i => i.category === selectedCategory)
    : mockReport.items

  const failedItems = mockReport.items.filter(i => i.status === 'fail')
  const warningItems = mockReport.items.filter(i => i.status === 'warning')
  const passItems = mockReport.items.filter(i => i.status === 'pass')

  return (
    <motion.div
      className="max-w-7xl mx-auto px-8 py-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-12">
        <h1 className="text-4xl font-black mb-3" style={{ color: COLOR_PRIMARY }}>
          AI Diligence Scan
        </h1>
        <p className="text-lg" style={{ color: COLOR_TEXT_SECONDARY }}>
          Comprehensive automated due diligence analysis. AI reviews all documents and identifies risks across 8 dimensions.
        </p>
      </motion.div>

      {/* Overall Risk Score */}
      <motion.div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12" variants={containerVariants}>
        {/* Risk Level */}
        <motion.div
          className="p-8 rounded-lg border-2"
          style={{ borderColor: COLOR_BORDER, background: 'white' }}
          variants={itemVariants}
        >
          <p className="text-sm font-bold mb-3" style={{ color: COLOR_TEXT_SECONDARY }}>
            Overall Risk Level
          </p>
          <div className="flex items-center gap-4 mb-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-white font-black text-xl"
              style={{ background: getRiskColor(mockReport.overallRisk) }}
            >
              {mockReport.overallRisk === 'medium' ? '⚠️' : '✓'}
            </div>
            <div>
              <p className="text-2xl font-black" style={{ color: COLOR_PRIMARY }}>
                {getRiskLabel(mockReport.overallRisk)}
              </p>
              <p className="text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>
                Proceed with conditions
              </p>
            </div>
          </div>
          <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
            Deal quality score: <strong style={{ color: COLOR_PRIMARY }}>72/100</strong>
          </p>
        </motion.div>

        {/* Summary Stats */}
        <motion.div
          className="p-8 rounded-lg border-2"
          style={{ borderColor: COLOR_BORDER, background: 'white' }}
          variants={itemVariants}
        >
          <p className="text-sm font-bold mb-6" style={{ color: COLOR_TEXT_SECONDARY }}>
            Scan Summary
          </p>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                <CheckCircle2 className="w-4 h-4 inline mr-2" style={{ color: '#10B981' }} />
                Passed
              </span>
              <span className="font-black" style={{ color: COLOR_PRIMARY }}>
                {passItems.length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                <AlertCircle className="w-4 h-4 inline mr-2" style={{ color: COLOR_ACCENT }} />
                Warnings
              </span>
              <span className="font-black" style={{ color: COLOR_PRIMARY }}>
                {warningItems.length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                <AlertTriangle className="w-4 h-4 inline mr-2" style={{ color: '#EF4444' }} />
                Failed
              </span>
              <span className="font-black" style={{ color: COLOR_PRIMARY }}>
                {failedItems.length}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Completeness */}
        <motion.div
          className="p-8 rounded-lg border-2"
          style={{ borderColor: COLOR_BORDER, background: 'white' }}
          variants={itemVariants}
        >
          <p className="text-sm font-bold mb-4" style={{ color: COLOR_TEXT_SECONDARY }}>
            Scan Completeness
          </p>
          <div className="mb-4">
            <div className="text-4xl font-black" style={{ color: COLOR_PRIMARY }}>
              {mockReport.completeness}%
            </div>
            <p className="text-sm mt-1" style={{ color: COLOR_TEXT_SECONDARY }}>
              of documents analyzed
            </p>
          </div>
          <div className="h-2 rounded-full" style={{ background: COLOR_BORDER }}>
            <motion.div
              className="h-2 rounded-full"
              style={{ background: COLOR_ACCENT }}
              initial={{ width: 0 }}
              animate={{ width: `${mockReport.completeness}%` }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Category Filter */}
      <motion.div className="mb-8 flex gap-2 flex-wrap" variants={itemVariants}>
        <button
          onClick={() => setSelectedCategory(null)}
          className="px-4 py-2 rounded-lg font-bold text-sm transition-all"
          style={{
            background: !selectedCategory ? COLOR_ACCENT : COLOR_BORDER,
            color: !selectedCategory ? 'white' : COLOR_TEXT_SECONDARY,
          }}
        >
          All Categories ({mockReport.items.length})
        </button>
        {categories.map((cat) => {
          const count = mockReport.items.filter(i => i.category === cat).length
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className="px-4 py-2 rounded-lg font-bold text-sm transition-all"
              style={{
                background: selectedCategory === cat ? COLOR_ACCENT : COLOR_BORDER,
                color: selectedCategory === cat ? 'white' : COLOR_TEXT_SECONDARY,
              }}
            >
              {cat} ({count})
            </button>
          )
        })}
      </motion.div>

      {/* Findings List */}
      <motion.div className="space-y-4 mb-12" variants={containerVariants}>
        {filteredItems.map((item) => {
          const Icon = getStatusIcon(item.status)
          const statusColor = getStatusColor(item.status)

          return (
            <motion.div
              key={item.id}
              className="p-6 rounded-lg border-2 cursor-pointer hover:shadow-lg transition-all"
              style={{
                borderColor: expandedId === item.id ? COLOR_ACCENT : COLOR_BORDER,
                background: expandedId === item.id ? COLOR_ACCENT + '08' : 'white',
              }}
              onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
              whileHover={{ x: 4 }}
              variants={itemVariants}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-start gap-3 flex-1">
                  <div className="p-2 rounded-lg mt-1" style={{ background: statusColor + '20' }}>
                    <Icon className="w-5 h-5" style={{ color: statusColor }} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg" style={{ color: COLOR_PRIMARY }}>
                      {item.title}
                    </h3>
                    <p className="text-sm mt-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                      {item.category}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold" style={{ color: COLOR_TEXT_SECONDARY }}>
                    Confidence
                  </p>
                  <p className="text-lg font-black" style={{ color: COLOR_PRIMARY }}>
                    {item.confidence}%
                  </p>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedId === item.id && (
                <motion.div
                  className="mt-6 pt-6 border-t"
                  style={{ borderColor: COLOR_BORDER }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {/* Findings */}
                  <div className="mb-6">
                    <h4 className="font-bold mb-3" style={{ color: COLOR_PRIMARY }}>
                      🔍 Key Findings
                    </h4>
                    <ul className="space-y-2">
                      {item.findings.map((finding, idx) => (
                        <li key={idx} className="text-sm flex items-start gap-2" style={{ color: COLOR_TEXT_SECONDARY }}>
                          <span className="font-bold mt-0.5">•</span>
                          {finding}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Recommendation */}
                  <div className="p-4 rounded-lg" style={{ background: statusColor + '10', borderLeft: `4px solid ${statusColor}` }}>
                    <p className="text-sm font-bold mb-1" style={{ color: statusColor }}>
                      💡 Recommendation
                    </p>
                    <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                      {item.recommendation}
                    </p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )
        })}
      </motion.div>

      {/* Critical Issues Section */}
      {failedItems.length > 0 && (
        <motion.div className="mb-12 p-8 rounded-lg border-2" style={{ borderColor: '#EF4444', background: '#FEF2F2' }} variants={itemVariants}>
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-6 h-6" style={{ color: '#EF4444' }} />
            <h3 className="text-xl font-bold" style={{ color: '#EF4444' }}>
              🔴 Critical Issues Requiring Action
            </h3>
          </div>
          <p className="mb-4" style={{ color: COLOR_TEXT_SECONDARY }}>
            The following items must be addressed before proceeding with the transaction:
          </p>
          <ul className="space-y-2">
            {failedItems.map((item) => (
              <li key={item.id} className="text-sm flex items-start gap-2" style={{ color: COLOR_TEXT_SECONDARY }}>
                <span className="font-bold">•</span>
                <span>
                  <strong>{item.title}</strong> — {item.recommendation}
                </span>
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Action Items */}
      <motion.div className="p-8 rounded-lg border-2 mb-12" style={{ borderColor: COLOR_BORDER, background: COLOR_ACCENT + '08' }} variants={itemVariants}>
        <h3 className="text-xl font-bold mb-4" style={{ color: COLOR_PRIMARY }}>
          ✅ Recommended Next Steps
        </h3>
        <ol className="space-y-3">
          {[
            { step: 1, title: 'Address Critical Findings', desc: 'Work with seller on customer retention plan and financial projections.' },
            { step: 2, title: 'Legal Due Diligence', desc: 'Full IP audit and IP protection strategy before international expansion.' },
            { step: 3, title: 'Customer Interviews', desc: 'Call top 5 customers to validate NPS and churn concerns.' },
            { step: 4, title: 'Financial Deep Dive', desc: 'Request detailed unit economics and CAC/LTV analysis.' },
            { step: 5, title: 'Executive Summary', desc: 'Prepare LOI with conditions tied to risk mitigation items.' },
          ].map((item) => (
            <li key={item.step} className="flex gap-4">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
                style={{ background: COLOR_ACCENT }}
              >
                {item.step}
              </div>
              <div>
                <p className="font-bold" style={{ color: COLOR_PRIMARY }}>
                  {item.title}
                </p>
                <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                  {item.desc}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </motion.div>

      {/* Export CTA */}
      <motion.div className="text-center" variants={itemVariants}>
        <button className="px-8 py-3 rounded-lg font-bold text-white transition-all hover:opacity-90 inline-flex items-center gap-2" style={{ background: COLOR_ACCENT }}>
          <Download className="w-5 h-5" />
          Export Full Diligence Report (PDF)
        </button>
      </motion.div>
    </motion.div>
  )
}

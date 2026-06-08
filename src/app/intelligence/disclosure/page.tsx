'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Lock, Unlock, FileText, AlertCircle, CheckCircle2, ArrowRight, BarChart3,
  Eye, Clock, Download, Share2, Shield, TrendingUp
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

interface Document {
  id: string
  name: string
  category: 'Financial' | 'Legal' | 'Operational'
  size: string
  uploadedAt: string
  stage: 1 | 2 | 3
  required: boolean
}

interface StageMilestone {
  stage: 1 | 2 | 3
  title: string
  description: string
  documents: number
  completed: boolean
  progress: number
  buyer?: string
}

const mockDocuments: Document[] = [
  {
    id: '1',
    name: '3-Year Financial Statements (2022-2024)',
    category: 'Financial',
    size: '2.4 MB',
    uploadedAt: '2024-06-01',
    stage: 1,
    required: true,
  },
  {
    id: '2',
    name: 'Business Registration & Tax ID',
    category: 'Legal',
    size: '0.3 MB',
    uploadedAt: '2024-06-02',
    stage: 1,
    required: true,
  },
  {
    id: '3',
    name: 'Customer Contract Samples (redacted)',
    category: 'Legal',
    size: '1.8 MB',
    uploadedAt: '2024-06-03',
    stage: 2,
    required: true,
  },
  {
    id: '4',
    name: 'Employee Roster & Org Chart',
    category: 'Operational',
    size: '0.6 MB',
    uploadedAt: '2024-06-04',
    stage: 2,
    required: true,
  },
  {
    id: '5',
    name: 'Supplier & Vendor Agreements',
    category: 'Legal',
    size: '2.1 MB',
    uploadedAt: '2024-06-05',
    stage: 3,
    required: false,
  },
  {
    id: '6',
    name: 'IP & Patent Documentation',
    category: 'Legal',
    size: '3.2 MB',
    uploadedAt: '2024-06-06',
    stage: 3,
    required: false,
  },
  {
    id: '7',
    name: 'Technology Infrastructure Report',
    category: 'Operational',
    size: '1.9 MB',
    uploadedAt: '2024-06-07',
    stage: 2,
    required: true,
  },
  {
    id: '8',
    name: 'Cap Table & Shareholder Agreements',
    category: 'Legal',
    size: '0.8 MB',
    uploadedAt: '2024-06-08',
    stage: 3,
    required: false,
  },
]

const stageMilestones: StageMilestone[] = [
  {
    stage: 1,
    title: 'Initial Disclosure',
    description: 'Core financials and business verification',
    documents: 2,
    completed: true,
    progress: 100,
    buyer: 'Public (All Qualified Buyers)',
  },
  {
    stage: 2,
    title: 'Qualified Buyer Access',
    description: 'Detailed operations, contracts, and team info',
    documents: 3,
    completed: true,
    progress: 100,
    buyer: 'Qualified Buyers (Passed Initial Review)',
  },
  {
    stage: 3,
    title: 'Due Diligence',
    description: 'Sensitive IP, detailed agreements, deep dive',
    documents: 3,
    completed: false,
    progress: 67,
    buyer: 'Serious Buyers (LOI Signed)',
  },
]

const getDocumentIcon = (category: string) => {
  switch (category) {
    case 'Financial':
      return BarChart3
    case 'Legal':
      return FileText
    case 'Operational':
      return TrendingUp
    default:
      return FileText
  }
}

const getStageColor = (stage: 1 | 2 | 3) => {
  switch (stage) {
    case 1:
      return '#3B82F6' // Blue
    case 2:
      return COLOR_ACCENT // Orange
    case 3:
      return '#F59E0B' // Amber
    default:
      return COLOR_TEXT_SECONDARY
  }
}

export default function DisclosurePage() {
  const [currentStage, setCurrentStage] = useState<1 | 2 | 3>(1)
  const [expandedDoc, setExpandedDoc] = useState<string | null>(null)

  const stageDocuments = mockDocuments.filter(d => d.stage === currentStage)
  const stage1Complete = stageMilestones[0].completed
  const stage2Complete = stageMilestones[1].completed

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
          3-Stage Disclosure Framework
        </h1>
        <p className="text-lg" style={{ color: COLOR_TEXT_SECONDARY }}>
          Control buyer access with progressive information disclosure. Match document visibility to buyer stage in the transaction.
        </p>
      </motion.div>

      {/* Stage Progress Pipeline */}
      <motion.div className="mb-12" variants={itemVariants}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {stageMilestones.map((milestone, idx) => (
            <motion.div
              key={milestone.stage}
              className="p-6 rounded-lg border-2 cursor-pointer transition-all hover:shadow-lg"
              style={{
                borderColor: currentStage === milestone.stage ? COLOR_ACCENT : COLOR_BORDER,
                background: currentStage === milestone.stage ? COLOR_ACCENT + '08' : 'white',
              }}
              onClick={() => setCurrentStage(milestone.stage)}
              whileHover={{ y: -4 }}
            >
              {/* Stage Badge */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                  style={{ background: getStageColor(milestone.stage) }}
                >
                  {milestone.stage}
                </div>
                {milestone.completed && (
                  <CheckCircle2 className="w-5 h-5" style={{ color: '#10B981' }} />
                )}
              </div>

              {/* Title & Description */}
              <h3 className="font-bold text-lg mb-2" style={{ color: COLOR_PRIMARY }}>
                {milestone.title}
              </h3>
              <p className="text-sm mb-4" style={{ color: COLOR_TEXT_SECONDARY }}>
                {milestone.description}
              </p>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold" style={{ color: COLOR_TEXT_SECONDARY }}>
                    {milestone.documents} documents
                  </span>
                  <span className="text-xs font-bold" style={{ color: getStageColor(milestone.stage) }}>
                    {milestone.progress}%
                  </span>
                </div>
                <div
                  className="h-2 rounded-full"
                  style={{ background: COLOR_BORDER }}
                >
                  <motion.div
                    className="h-2 rounded-full"
                    style={{ background: getStageColor(milestone.stage) }}
                    initial={{ width: 0 }}
                    animate={{ width: `${milestone.progress}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </div>
              </div>

              {/* Buyer Type */}
              <div className="flex items-center gap-2">
                {milestone.stage === 1 && <Eye className="w-4 h-4" style={{ color: getStageColor(1) }} />}
                {milestone.stage === 2 && <Lock className="w-4 h-4" style={{ color: getStageColor(2) }} />}
                {milestone.stage === 3 && <Shield className="w-4 h-4" style={{ color: getStageColor(3) }} />}
                <p className="text-xs font-bold" style={{ color: COLOR_TEXT_SECONDARY }}>
                  {milestone.buyer}
                </p>
              </div>

              {/* Status */}
              <p className="text-xs mt-3 font-bold" style={{ color: milestone.completed ? '#10B981' : COLOR_TEXT_SECONDARY }}>
                {milestone.completed ? '✓ Ready for Access' : '⏳ In Progress'}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Pipeline Arrow */}
        <div className="mt-4 flex items-center justify-between text-xs font-bold" style={{ color: COLOR_TEXT_SECONDARY }}>
          <span>✓ Automatically progresses when next stage is ready</span>
          <span>🔒 Earlier stages remain locked until buyer advances</span>
        </div>
      </motion.div>

      {/* Stage Details */}
      <motion.div className="mb-12" variants={itemVariants}>
        <div className="p-8 rounded-lg border-2" style={{ borderColor: COLOR_BORDER, background: 'white' }}>
          <div className="flex items-center gap-3 mb-6">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
              style={{ background: getStageColor(currentStage) }}
            >
              {currentStage}
            </div>
            <div>
              <h2 className="text-2xl font-bold" style={{ color: COLOR_PRIMARY }}>
                {stageMilestones[currentStage - 1].title}
              </h2>
              <p style={{ color: COLOR_TEXT_SECONDARY }}>
                {stageMilestones[currentStage - 1].description}
              </p>
            </div>
          </div>

          {/* Documents for Current Stage */}
          <div className="space-y-3 mt-6">
            {stageDocuments.map((doc) => {
              const Icon = getDocumentIcon(doc.category)
              return (
                <motion.div
                  key={doc.id}
                  className="p-4 rounded-lg border hover:shadow-md transition-all cursor-pointer"
                  style={{ borderColor: COLOR_BORDER, background: expandedDoc === doc.id ? COLOR_ACCENT + '08' : '#FAFAF8' }}
                  onClick={() => setExpandedDoc(expandedDoc === doc.id ? null : doc.id)}
                  whileHover={{ x: 4 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="p-2 rounded-lg" style={{ background: getStageColor(currentStage) + '20' }}>
                        <Icon className="w-5 h-5" style={{ color: getStageColor(currentStage) }} />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold" style={{ color: COLOR_PRIMARY }}>
                          {doc.name}
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>
                            {doc.category}
                          </span>
                          <span className="text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>
                            {doc.size}
                          </span>
                          {doc.required && (
                            <span className="text-xs font-bold text-white px-2 py-1 rounded-full" style={{ background: COLOR_ACCENT }}>
                              Required
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5" style={{ color: '#10B981' }} />
                      <Clock className="w-4 h-4" style={{ color: COLOR_TEXT_SECONDARY }} />
                    </div>
                  </div>

                  {expandedDoc === doc.id && (
                    <motion.div className="mt-4 pt-4 border-t" style={{ borderColor: COLOR_BORDER }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-xs font-bold mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>Uploaded</p>
                          <p className="font-bold" style={{ color: COLOR_PRIMARY }}>{doc.uploadedAt}</p>
                        </div>
                        <div>
                          <p className="text-xs font-bold mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>Accessible to</p>
                          <p className="font-bold" style={{ color: COLOR_PRIMARY }}>
                            {currentStage === 1 && 'All Qualified Buyers'}
                            {currentStage === 2 && 'Serious Buyers'}
                            {currentStage === 3 && 'Final Negotiation'}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="flex-1 px-3 py-2 rounded-lg text-sm font-bold text-white transition-all hover:opacity-90" style={{ background: COLOR_ACCENT }}>
                          <Download className="w-4 h-4 inline mr-2" />
                          Download
                        </button>
                        <button className="flex-1 px-3 py-2 rounded-lg text-sm font-bold border" style={{ borderColor: COLOR_ACCENT, color: COLOR_ACCENT }}>
                          <Share2 className="w-4 h-4 inline mr-2" />
                          Share Link
                        </button>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )
            })}
          </div>

          {stageDocuments.length === 0 && (
            <p className="text-center py-8" style={{ color: COLOR_TEXT_SECONDARY }}>
              No documents uploaded for this stage yet.
            </p>
          )}
        </div>
      </motion.div>

      {/* Lock Strategy Info */}
      <motion.div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12" variants={containerVariants}>
        {[
          {
            icon: Eye,
            title: 'Stage 1: Teaser Phase',
            points: ['Public business overview', '3-year financials', 'Business verification', 'No sensitive data'],
          },
          {
            icon: Lock,
            title: 'Stage 2: Qualified Phase',
            points: ['Detailed P&L breakdown', 'Customer contracts (redacted)', 'Team org chart', 'Technology architecture'],
          },
          {
            icon: Shield,
            title: 'Stage 3: Serious Phase',
            points: ['Unredacted contracts', 'IP & patent details', 'Supplier agreements', 'Shareholder records'],
          },
        ].map((section, idx) => {
          const Icon = section.icon
          return (
            <motion.div
              key={idx}
              className="p-6 rounded-lg border-2"
              style={{ borderColor: COLOR_BORDER, background: 'white' }}
              variants={itemVariants}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-lg" style={{ background: COLOR_ACCENT + '20' }}>
                  <Icon className="w-5 h-5" style={{ color: COLOR_ACCENT }} />
                </div>
                <h3 className="font-bold text-lg" style={{ color: COLOR_PRIMARY }}>
                  {section.title}
                </h3>
              </div>
              <ul className="space-y-2">
                {section.points.map((point, i) => (
                  <li key={i} className="text-sm flex items-start gap-2" style={{ color: COLOR_TEXT_SECONDARY }}>
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: COLOR_ACCENT }} />
                    {point}
                  </li>
                ))}
              </ul>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Activity Log */}
      <motion.div className="p-8 rounded-lg border-2 mb-12" style={{ borderColor: COLOR_BORDER, background: 'white' }} variants={itemVariants}>
        <h3 className="text-xl font-bold mb-6" style={{ color: COLOR_PRIMARY }}>
          📋 Buyer Access Timeline
        </h3>
        <div className="space-y-4">
          {[
            { buyer: 'Ahmed Al Mansouri (Strategic)', timestamp: '2024-06-01 10:32 AM', action: 'Accessed Stage 1', stage: 1 },
            { buyer: 'Sarah Khan (PE Firm)', timestamp: '2024-06-02 2:15 PM', action: 'Advanced to Stage 2', stage: 2 },
            { buyer: 'Michael Chen (Competitor)', timestamp: '2024-06-03 9:48 AM', action: 'Advanced to Stage 2', stage: 2 },
            { buyer: 'Fatima Al Maktoum (Buyer)', timestamp: '2024-06-04 4:22 PM', action: 'Advanced to Stage 3', stage: 3 },
          ].map((log, idx) => (
            <motion.div
              key={idx}
              className="flex items-center gap-4 p-4 rounded-lg"
              style={{ background: '#FAFAF8' }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ background: getStageColor(log.stage as 1 | 2 | 3) }}
              />
              <div className="flex-1">
                <p className="font-bold text-sm" style={{ color: COLOR_PRIMARY }}>
                  {log.buyer}
                </p>
                <p className="text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>
                  {log.action}
                </p>
              </div>
              <p className="text-xs font-bold" style={{ color: COLOR_TEXT_SECONDARY }}>
                {log.timestamp}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div
        className="p-8 rounded-lg border-2 text-center"
        style={{ borderColor: COLOR_ACCENT, background: COLOR_ACCENT + '08' }}
        variants={itemVariants}
      >
        <h3 className="text-xl font-bold mb-3" style={{ color: COLOR_PRIMARY }}>
          🎯 Ready to Advance to Stage 2?
        </h3>
        <p className="mb-6" style={{ color: COLOR_TEXT_SECONDARY }}>
          You've completed all Stage 1 documents. Start sharing with qualified buyers now.
        </p>
        {stage1Complete && !stage2Complete && (
          <button className="px-8 py-3 rounded-lg font-bold text-white transition-all hover:opacity-90" style={{ background: COLOR_ACCENT }}>
            Unlock Stage 2 Access <ArrowRight className="w-5 h-5 inline ml-2" />
          </button>
        )}
      </motion.div>
    </motion.div>
  )
}

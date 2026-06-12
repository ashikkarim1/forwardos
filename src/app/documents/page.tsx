'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  FileText, Upload, CheckCircle2, AlertCircle, Clock, Lock, Share2,
  Download, Trash2, MoreVertical, Plus, Filter, Search, Eye, Zap
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
  category: 'Financial' | 'Legal' | 'Operational' | 'Technical'
  status: 'requested' | 'received' | 'reviewed' | 'approved'
  requiredBy: string
  receivedDate?: string
  buyerAccess: boolean
  fileSize: string
  daysOverdue: number
}

const mockDocuments: Document[] = [
  {
    id: '1',
    name: '3-Year Financial Statements',
    category: 'Financial',
    status: 'approved',
    requiredBy: '2024-06-01',
    receivedDate: '2024-05-28',
    buyerAccess: true,
    fileSize: '2.4 MB',
    daysOverdue: 0,
  },
  {
    id: '2',
    name: 'Tax Returns (2022-2024)',
    category: 'Financial',
    status: 'reviewed',
    requiredBy: '2024-06-05',
    receivedDate: '2024-06-04',
    buyerAccess: true,
    fileSize: '1.8 MB',
    daysOverdue: 0,
  },
  {
    id: '3',
    name: 'Customer Contracts (Sample)',
    category: 'Legal',
    status: 'received',
    requiredBy: '2024-06-10',
    receivedDate: '2024-06-08',
    buyerAccess: false,
    fileSize: '3.2 MB',
    daysOverdue: 0,
  },
  {
    id: '4',
    name: 'IP Documentation & Patents',
    category: 'Legal',
    status: 'requested',
    requiredBy: '2024-06-12',
    receivedDate: undefined,
    buyerAccess: false,
    fileSize: '—',
    daysOverdue: 5,
  },
  {
    id: '5',
    name: 'Employee Roster & Agreements',
    category: 'Operational',
    status: 'approved',
    requiredBy: '2024-06-03',
    receivedDate: '2024-06-02',
    buyerAccess: true,
    fileSize: '0.8 MB',
    daysOverdue: 0,
  },
  {
    id: '6',
    name: 'Technology Architecture Documentation',
    category: 'Technical',
    status: 'requested',
    requiredBy: '2024-06-15',
    receivedDate: undefined,
    buyerAccess: false,
    fileSize: '—',
    daysOverdue: 2,
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'approved':
      return '#10B981'
    case 'reviewed':
      return '#B8956A'
    case 'received':
      return COLOR_ACCENT
    case 'requested':
      return '#F59E0B'
    default:
      return COLOR_TEXT_SECONDARY
  }
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'approved':
      return '✓ Approved'
    case 'reviewed':
      return '👁️ Reviewed'
    case 'received':
      return '📂 Received'
    case 'requested':
      return '⏳ Requested'
    default:
      return status
  }
}

export default function DocumentsPage() {
  const [docs, setDocs] = useState<Document[]>(mockDocuments)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const categories = [...new Set(docs.map(d => d.category))]
  const filtered = selectedCategory ? docs.filter(d => d.category === selectedCategory) : docs

  const stats = {
    total: docs.length,
    approved: docs.filter(d => d.status === 'approved').length,
    pending: docs.filter(d => d.status === 'requested' || d.status === 'received').length,
    overdue: docs.filter(d => d.daysOverdue > 0).length,
  }

  return (
    <motion.div
      className="max-w-7xl mx-auto px-8 py-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-black mb-2" style={{ color: COLOR_PRIMARY }}>
              Document Management
            </h1>
            <p className="text-lg" style={{ color: COLOR_TEXT_SECONDARY }}>
              Request, receive, and manage all transaction documents. Track completion status.
            </p>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-white transition-all hover:opacity-90" style={{ background: COLOR_ACCENT }}>
            <Plus className="w-5 h-5" />
            Request Document
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Documents', value: stats.total, icon: FileText },
            { label: 'Approved', value: stats.approved, icon: CheckCircle2 },
            { label: 'Pending', value: stats.pending, icon: Clock },
            { label: 'Overdue', value: stats.overdue, icon: AlertCircle },
          ].map((stat) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                className="p-4 rounded-lg border"
                style={{ borderColor: COLOR_BORDER, background: 'white' }}
                variants={itemVariants}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="w-5 h-5" style={{ color: COLOR_ACCENT }} />
                  <p className="text-xs font-bold" style={{ color: COLOR_TEXT_SECONDARY }}>
                    {stat.label}
                  </p>
                </div>
                <p className="text-2xl font-black" style={{ color: COLOR_PRIMARY }}>
                  {stat.value}
                </p>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* Category Filter */}
      <motion.div className="mb-6 flex gap-2 flex-wrap" variants={itemVariants}>
        <button
          onClick={() => setSelectedCategory(null)}
          className="px-4 py-2 rounded-lg font-bold text-sm transition-all"
          style={{
            background: !selectedCategory ? COLOR_ACCENT : COLOR_BORDER,
            color: !selectedCategory ? 'white' : COLOR_TEXT_SECONDARY,
          }}
        >
          All Categories ({docs.length})
        </button>
        {categories.map((cat) => {
          const count = docs.filter(d => d.category === cat).length
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

      {/* Documents List */}
      <motion.div className="space-y-3 mb-12" variants={containerVariants}>
        {filtered.map((doc) => (
          <motion.div
            key={doc.id}
            className="p-5 rounded-lg border-2 hover:shadow-md transition-all"
            style={{ borderColor: COLOR_BORDER, background: 'white' }}
            variants={itemVariants}
          >
            <div className="flex items-start justify-between">
              {/* Left: File Info */}
              <div className="flex items-start gap-4 flex-1">
                <div className="p-3 rounded-lg" style={{ background: getStatusColor(doc.status) + '20' }}>
                  <FileText className="w-6 h-6" style={{ color: getStatusColor(doc.status) }} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-lg" style={{ color: COLOR_PRIMARY }}>
                      {doc.name}
                    </h3>
                    <span
                      className="px-2 py-1 text-xs font-bold rounded-full"
                      style={{ background: getStatusColor(doc.status) + '20', color: getStatusColor(doc.status) }}
                    >
                      {getStatusLabel(doc.status)}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                    <span>{doc.category}</span>
                    <span>{doc.fileSize}</span>
                    {doc.daysOverdue > 0 && (
                      <span style={{ color: '#EF4444', fontWeight: 'bold' }}>
                        ⚠️ {doc.daysOverdue} days overdue
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right: Timeline & Actions */}
              <div className="text-right ml-4 flex items-center gap-4">
                <div>
                  <p className="text-xs font-bold mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                    Required By
                  </p>
                  <p className="font-bold" style={{ color: COLOR_PRIMARY }}>
                    {doc.requiredBy}
                  </p>
                  {doc.receivedDate && (
                    <p className="text-xs mt-1" style={{ color: '#10B981' }}>
                      ✓ Received {doc.receivedDate}
                    </p>
                  )}
                </div>

                {/* Access & Actions */}
                <div className="flex gap-2">
                  {doc.status !== 'requested' && (
                    <>
                      <button className="p-2 hover:bg-gray-100 rounded transition-colors">
                        <Eye className="w-5 h-5" style={{ color: COLOR_ACCENT }} />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded transition-colors">
                        <Download className="w-5 h-5" style={{ color: COLOR_TEXT_SECONDARY }} />
                      </button>
                    </>
                  )}
                  {doc.buyerAccess && (
                    <button className="p-2 hover:bg-gray-100 rounded transition-colors">
                      <Share2 className="w-5 h-5" style={{ color: '#B8956A' }} />
                    </button>
                  )}
                  <button className="p-2 hover:bg-gray-100 rounded transition-colors">
                    <MoreVertical className="w-5 h-5" style={{ color: COLOR_TEXT_SECONDARY }} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Document Checklist */}
      <motion.div className="p-8 rounded-lg border-2 mb-12" style={{ borderColor: COLOR_BORDER, background: COLOR_ACCENT + '08' }} variants={itemVariants}>
        <h3 className="text-xl font-bold mb-6" style={{ color: COLOR_PRIMARY }}>
          ✅ Document Completion Checklist
        </h3>
        <div className="space-y-3">
          {[
            { phase: 'Phase 1: Initial', docs: ['Financial Statements', 'Tax Returns', 'Business Registration'], progress: 100 },
            { phase: 'Phase 2: Detailed', docs: ['Customer Contracts', 'Employee Agreements', 'Supplier Contracts'], progress: 50 },
            { phase: 'Phase 3: Deep Dive', docs: ['IP Documentation', 'Cap Table', 'Board Minutes'], progress: 0 },
          ].map((phase) => (
            <div key={phase.phase}>
              <div className="flex items-center justify-between mb-2">
                <p className="font-bold" style={{ color: COLOR_PRIMARY }}>
                  {phase.phase}
                </p>
                <p className="text-sm font-bold" style={{ color: COLOR_ACCENT }}>
                  {phase.progress}%
                </p>
              </div>
              <div className="h-3 rounded-full" style={{ background: COLOR_BORDER }}>
                <motion.div
                  className="h-3 rounded-full"
                  style={{ background: COLOR_ACCENT }}
                  initial={{ width: 0 }}
                  animate={{ width: `${phase.progress}%` }}
                  transition={{ duration: 0.8 }}
                />
              </div>
              <p className="text-sm mt-2" style={{ color: COLOR_TEXT_SECONDARY }}>
                {phase.docs.join(', ')}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div className="text-center p-8 rounded-lg" style={{ background: COLOR_ACCENT + '08', borderColor: COLOR_ACCENT, borderWidth: 2 }} variants={itemVariants}>
        <h3 className="text-xl font-bold mb-3" style={{ color: COLOR_PRIMARY }}>
          📋 Document Request Status
        </h3>
        <p style={{ color: COLOR_TEXT_SECONDARY }} className="mb-6">
          {stats.approved} of {stats.total} documents approved. {stats.overdue} overdue.
        </p>
        <button className="px-8 py-3 rounded-lg font-bold text-white transition-all hover:opacity-90" style={{ background: COLOR_ACCENT }}>
          Send Reminder to Seller
        </button>
      </motion.div>
    </motion.div>
  )
}

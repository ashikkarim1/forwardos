'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { CheckCircle2, XCircle, Clock, AlertCircle, Eye, Download } from 'lucide-react'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER, COLOR_BG_PRIMARY } from '@/styles/forward-colors'

interface PendingSubmission {
  id: string
  userId: string
  sellerName: string
  sellerEmail: string
  companyName: string
  submittedAt: string
  status: 'PENDING_VERIFICATION' | 'VERIFIED' | 'APPROVED' | 'REJECTED'
  industry: string
  location: string
  employees: number
  documentsCount: number
  photosCount: number
}

export default function AdminApprovalsPage() {
  const [submissions, setSubmissions] = useState<PendingSubmission[]>([
    // Mock data for demonstration
    {
      id: 'deal-mock-1',
      userId: 'user-1',
      sellerName: 'John Smith',
      sellerEmail: 'john@example.com',
      companyName: 'TechFlow Solutions',
      submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      status: 'PENDING_VERIFICATION',
      industry: 'SAAS',
      location: 'San Francisco, USA',
      employees: 25,
      documentsCount: 5,
      photosCount: 4,
    },
    {
      id: 'deal-mock-2',
      userId: 'user-2',
      sellerName: 'Sarah Johnson',
      sellerEmail: 'sarah@example.com',
      companyName: 'Digital Marketing Pro',
      submittedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      status: 'VERIFIED',
      industry: 'SERVICES',
      location: 'New York, USA',
      employees: 12,
      documentsCount: 3,
      photosCount: 3,
    },
  ])

  const [filter, setFilter] = useState<'all' | 'pending' | 'verified' | 'approved' | 'rejected'>('pending')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const filteredSubmissions = submissions.filter(sub => {
    if (filter === 'all') return true
    if (filter === 'pending') return sub.status === 'PENDING_VERIFICATION'
    if (filter === 'verified') return sub.status === 'VERIFIED'
    if (filter === 'approved') return sub.status === 'APPROVED'
    if (filter === 'rejected') return sub.status === 'REJECTED'
    return true
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING_VERIFICATION':
        return { bg: '#FEF3C7', color: '#92400E', icon: Clock }
      case 'VERIFIED':
        return { bg: '#D1FAE5', color: '#065F46', icon: CheckCircle2 }
      case 'APPROVED':
        return { bg: '#D1FAE5', color: '#065F46', icon: CheckCircle2 }
      case 'REJECTED':
        return { bg: '#FEE2E2', color: '#7F1D1D', icon: XCircle }
      default:
        return { bg: COLOR_BG_PRIMARY, color: COLOR_TEXT_SECONDARY, icon: AlertCircle }
    }
  }

  return (
    <div className="min-h-screen" style={{ background: COLOR_BG_PRIMARY }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b"
        style={{ borderColor: COLOR_BORDER, background: 'white' }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
          <h1 className="text-3xl font-black mb-2" style={{ color: COLOR_PRIMARY }}>
            Seller Approval Dashboard
          </h1>
          <p style={{ color: COLOR_TEXT_SECONDARY }}>
            Review and approve seller submissions
          </p>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Filters */}
        <div className="mb-8 flex gap-3 overflow-x-auto pb-2">
          {(['all', 'pending', 'verified', 'approved', 'rejected'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all ${
                filter === f ? 'text-white' : 'border'
              }`}
              style={{
                background: filter === f ? COLOR_ACCENT : 'transparent',
                borderColor: COLOR_BORDER,
                color: filter === f ? 'white' : COLOR_TEXT_SECONDARY,
              }}
            >
              {f === 'all' ? 'All' : f === 'pending' ? 'Pending' : f.charAt(0).toUpperCase() + f.slice(1)}
              <span className="ml-2 opacity-70">
                ({submissions.filter(s => f === 'all' || s.status.toLowerCase().includes(f)).length})
              </span>
            </button>
          ))}
        </div>

        {/* Submissions Grid */}
        <div className="grid gap-6">
          {filteredSubmissions.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <CheckCircle2 size={48} className="mx-auto mb-4" style={{ color: COLOR_ACCENT }} />
              <p className="text-lg font-bold" style={{ color: COLOR_PRIMARY }}>
                No submissions to review
              </p>
              <p style={{ color: COLOR_TEXT_SECONDARY }}>
                All submissions have been processed!
              </p>
            </motion.div>
          ) : (
            filteredSubmissions.map((submission, idx) => {
              const statusColor = getStatusColor(submission.status)
              const StatusIcon = statusColor.icon

              return (
                <motion.div
                  key={submission.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white rounded-lg border p-6 hover:shadow-lg transition-all cursor-pointer"
                  style={{ borderColor: COLOR_BORDER }}
                  onClick={() => setSelectedId(selectedId === submission.id ? null : submission.id)}
                >
                  {/* Main Row */}
                  <div className="flex items-start gap-4">
                    {/* Status Badge */}
                    <div
                      className="px-3 py-1 rounded-lg flex items-center gap-2 whitespace-nowrap"
                      style={{ background: statusColor.bg }}
                    >
                      <StatusIcon size={16} style={{ color: statusColor.color }} />
                      <span className="text-xs font-bold" style={{ color: statusColor.color }}>
                        {submission.status === 'PENDING_VERIFICATION'
                          ? 'Pending Review'
                          : submission.status === 'VERIFIED'
                            ? 'Verified'
                            : submission.status}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg" style={{ color: COLOR_PRIMARY }}>
                        {submission.companyName}
                      </h3>
                      <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                        {submission.sellerName} • {submission.sellerEmail}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs flex-wrap" style={{ color: COLOR_TEXT_SECONDARY }}>
                        <span>📍 {submission.location}</span>
                        <span>🏢 {submission.employees} employees</span>
                        <span>📄 {submission.documentsCount} documents</span>
                        <span>📸 {submission.photosCount} photos</span>
                      </div>
                    </div>

                    {/* Time */}
                    <div className="text-right text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>
                      <p>{new Date(submission.submittedAt).toLocaleDateString()}</p>
                      <p>{new Date(submission.submittedAt).toLocaleTimeString()}</p>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {selectedId === submission.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-6 pt-6 border-t space-y-4"
                      style={{ borderColor: COLOR_BORDER }}
                    >
                      {/* Document Links */}
                      <div>
                        <h4 className="font-bold text-sm mb-3" style={{ color: COLOR_PRIMARY }}>
                          📄 Documents ({submission.documentsCount})
                        </h4>
                        <div className="space-y-2">
                          {[...Array(submission.documentsCount)].map((_, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-3 p-2 rounded-lg"
                              style={{ background: COLOR_BG_PRIMARY }}
                            >
                              <Download size={16} style={{ color: COLOR_ACCENT }} />
                              <span className="text-sm flex-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                                document_{i + 1}.pdf
                              </span>
                              <button className="text-xs font-semibold px-2 py-1 rounded" style={{ color: COLOR_ACCENT }}>
                                View
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3 pt-4">
                        <Link
                          href={`/admin/approvals/${submission.id}`}
                          className="flex-1 px-4 py-2 rounded-lg font-semibold text-white transition-all hover:opacity-90 text-center"
                          style={{ background: COLOR_ACCENT }}
                        >
                          Review Details
                        </Link>
                        {submission.status === 'PENDING_VERIFICATION' && (
                          <>
                            <button
                              className="flex-1 px-4 py-2 rounded-lg font-semibold border transition-all hover:bg-gray-50 text-center"
                              style={{ borderColor: COLOR_BORDER, color: COLOR_PRIMARY }}
                            >
                              Request Changes
                            </button>
                            <button
                              className="flex-1 px-4 py-2 rounded-lg font-semibold text-white transition-all hover:opacity-90 text-center"
                              style={{ background: '#10B981' }}
                            >
                              Approve
                            </button>
                          </>
                        )}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}

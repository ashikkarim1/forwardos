'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronLeft, CheckCircle2, XCircle, AlertCircle, Download, Eye, MessageSquare, Send } from 'lucide-react'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER, COLOR_BG_PRIMARY } from '@/styles/forward-colors'

interface SubmissionDetails {
  dealId: string
  sellerName: string
  sellerEmail: string
  companyName: string
  businessDescription: string
  industry: string
  location: string
  foundingYear: number
  employees: number
  topCustomers: string
  financialsSummary: string
  photos: Array<{ name: string; url: string }>
  documents: Array<{ name: string; url: string; size: string }>
  planTier: 'freemium' | 'premium'
  submittedAt: string
}

export default function ApprovalDetailPage() {
  const params = useParams()
  const dealId = params?.dealId as string

  // Mock data
  const [submission] = useState<SubmissionDetails>({
    dealId,
    sellerName: 'John Smith',
    sellerEmail: 'john@example.com',
    companyName: 'TechFlow Solutions',
    businessDescription: 'We build enterprise SaaS solutions for financial institutions. Our platform helps banks and fintech companies manage compliance and risk.',
    industry: 'SAAS',
    location: 'San Francisco, USA',
    foundingYear: 2018,
    employees: 25,
    topCustomers: 'Goldman Sachs, JPMorgan Chase, Stripe',
    financialsSummary: 'Revenue grew 45% YoY to $2.5M ARR. Profitable at 22% margins with 90% retention.',
    photos: [
      { name: 'office-1.jpg', url: '/uploads/photos/office-1.jpg' },
      { name: 'team.jpg', url: '/uploads/photos/team.jpg' },
      { name: 'product.jpg', url: '/uploads/photos/product.jpg' },
    ],
    documents: [
      { name: 'Financial_Statements_2025.pdf', url: '/uploads/documents/financials.pdf', size: '2.4 MB' },
      { name: 'Tax_Return_2024.pdf', url: '/uploads/documents/taxes.pdf', size: '1.8 MB' },
      { name: 'Customer_Contracts.pdf', url: '/uploads/documents/contracts.pdf', size: '3.2 MB' },
    ],
    planTier: 'premium',
    submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  })

  const [decision, setDecision] = useState<'approve' | 'request_changes' | 'reject' | null>(null)
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleApprove = async () => {
    if (!notes.trim()) {
      alert('Please add approval notes')
      return
    }

    setIsSubmitting(true)
    try {
      // TODO: API call to approve
      const response = await fetch(`/api/admin/approvals/${dealId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'approve',
          notes,
          planTier: submission.planTier,
        }),
      })

      if (response.ok) {
        alert('Seller approved! Email notification sent.')
        window.location.href = '/admin/approvals'
      } else {
        alert('Failed to approve seller')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReject = async () => {
    if (!notes.trim()) {
      alert('Please provide a reason for rejection')
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/admin/approvals/${dealId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reject',
          notes,
        }),
      })

      if (response.ok) {
        alert('Submission rejected. Email notification sent.')
        window.location.href = '/admin/approvals'
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRequestChanges = async () => {
    if (!notes.trim()) {
      alert('Please specify what changes are needed')
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/admin/approvals/${dealId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'request_changes',
          notes,
        }),
      })

      if (response.ok) {
        alert('Change request sent to seller.')
        window.location.href = '/admin/approvals'
      }
    } finally {
      setIsSubmitting(false)
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
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-6">
          <Link
            href="/admin/approvals"
            className="flex items-center gap-2 text-sm font-semibold mb-4"
            style={{ color: COLOR_ACCENT }}
          >
            <ChevronLeft size={18} />
            Back to Approvals
          </Link>
          <h1 className="text-3xl font-black" style={{ color: COLOR_PRIMARY }}>
            {submission.companyName}
          </h1>
          <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-sm mt-2">
            Plan: {submission.planTier === 'premium' ? '✨ Premium' : '📋 Freemium'}
          </p>
        </div>
      </motion.div>

      <div className="max-w-5xl mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Seller Info */}
            <div className="bg-white rounded-lg border p-6" style={{ borderColor: COLOR_BORDER }}>
              <h2 className="font-bold text-lg mb-4" style={{ color: COLOR_PRIMARY }}>
                Seller Information
              </h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p style={{ color: COLOR_TEXT_SECONDARY }}>Name</p>
                  <p className="font-bold" style={{ color: COLOR_PRIMARY }}>
                    {submission.sellerName}
                  </p>
                </div>
                <div>
                  <p style={{ color: COLOR_TEXT_SECONDARY }}>Email</p>
                  <p className="font-bold" style={{ color: COLOR_PRIMARY }}>
                    {submission.sellerEmail}
                  </p>
                </div>
                <div>
                  <p style={{ color: COLOR_TEXT_SECONDARY }}>Industry</p>
                  <p className="font-bold" style={{ color: COLOR_PRIMARY }}>
                    {submission.industry}
                  </p>
                </div>
                <div>
                  <p style={{ color: COLOR_TEXT_SECONDARY }}>Location</p>
                  <p className="font-bold" style={{ color: COLOR_PRIMARY }}>
                    {submission.location}
                  </p>
                </div>
                <div>
                  <p style={{ color: COLOR_TEXT_SECONDARY }}>Founded</p>
                  <p className="font-bold" style={{ color: COLOR_PRIMARY }}>
                    {submission.foundingYear}
                  </p>
                </div>
                <div>
                  <p style={{ color: COLOR_TEXT_SECONDARY }}>Employees</p>
                  <p className="font-bold" style={{ color: COLOR_PRIMARY }}>
                    {submission.employees}
                  </p>
                </div>
              </div>
            </div>

            {/* Business Description */}
            <div className="bg-white rounded-lg border p-6" style={{ borderColor: COLOR_BORDER }}>
              <h2 className="font-bold text-lg mb-4" style={{ color: COLOR_PRIMARY }}>
                Business Overview
              </h2>
              <p style={{ color: COLOR_TEXT_SECONDARY }} className="mb-4">
                {submission.businessDescription}
              </p>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-bold mb-1" style={{ color: COLOR_PRIMARY }}>
                    Top Customers
                  </p>
                  <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                    {submission.topCustomers}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-bold mb-1" style={{ color: COLOR_PRIMARY }}>
                    Financial Summary
                  </p>
                  <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                    {submission.financialsSummary}
                  </p>
                </div>
              </div>
            </div>

            {/* Photos */}
            <div className="bg-white rounded-lg border p-6" style={{ borderColor: COLOR_BORDER }}>
              <h2 className="font-bold text-lg mb-4" style={{ color: COLOR_PRIMARY }}>
                📸 Photos ({submission.photos.length})
              </h2>
              <div className="grid grid-cols-3 gap-4">
                {submission.photos.map((photo, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative group rounded-lg overflow-hidden"
                  >
                    <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                      <Eye size={24} style={{ color: COLOR_TEXT_SECONDARY }} />
                    </div>
                    <p className="text-xs mt-2 text-center" style={{ color: COLOR_TEXT_SECONDARY }}>
                      {photo.name}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Documents */}
            <div className="bg-white rounded-lg border p-6" style={{ borderColor: COLOR_BORDER }}>
              <h2 className="font-bold text-lg mb-4" style={{ color: COLOR_PRIMARY }}>
                📄 Documents ({submission.documents.length})
              </h2>
              <div className="space-y-2">
                {submission.documents.map((doc, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3 p-3 rounded-lg"
                    style={{ background: COLOR_BG_PRIMARY }}
                  >
                    <Download size={18} style={{ color: COLOR_ACCENT }} />
                    <div className="flex-1">
                      <p className="text-sm font-bold" style={{ color: COLOR_PRIMARY }}>
                        {doc.name}
                      </p>
                      <p className="text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>
                        {doc.size}
                      </p>
                    </div>
                    <button className="text-xs font-bold px-3 py-1 rounded" style={{ color: COLOR_ACCENT }}>
                      View
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Sidebar - Decision */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-24 bg-white rounded-lg border p-6" style={{ borderColor: COLOR_BORDER }}>
              <h3 className="font-bold text-lg mb-4" style={{ color: COLOR_PRIMARY }}>
                Decision
              </h3>

              <div className="space-y-3 mb-6">
                <button
                  onClick={() => setDecision('approve')}
                  className={`w-full p-3 rounded-lg border-2 font-bold transition-all flex items-center gap-2 ${
                    decision === 'approve' ? 'border-green-500' : 'border-gray-200'
                  }`}
                  style={{
                    background: decision === 'approve' ? '#D1FAE5' : 'transparent',
                    color: decision === 'approve' ? '#065F46' : COLOR_TEXT_SECONDARY,
                  }}
                >
                  <CheckCircle2 size={18} />
                  Approve
                </button>

                <button
                  onClick={() => setDecision('request_changes')}
                  className={`w-full p-3 rounded-lg border-2 font-bold transition-all flex items-center gap-2 ${
                    decision === 'request_changes' ? 'border-yellow-500' : 'border-gray-200'
                  }`}
                  style={{
                    background: decision === 'request_changes' ? '#FEF3C7' : 'transparent',
                    color: decision === 'request_changes' ? '#92400E' : COLOR_TEXT_SECONDARY,
                  }}
                >
                  <AlertCircle size={18} />
                  Request Changes
                </button>

                <button
                  onClick={() => setDecision('reject')}
                  className={`w-full p-3 rounded-lg border-2 font-bold transition-all flex items-center gap-2 ${
                    decision === 'reject' ? 'border-red-500' : 'border-gray-200'
                  }`}
                  style={{
                    background: decision === 'reject' ? '#FEE2E2' : 'transparent',
                    color: decision === 'reject' ? '#7F1D1D' : COLOR_TEXT_SECONDARY,
                  }}
                >
                  <XCircle size={18} />
                  Reject
                </button>
              </div>

              {decision && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
                      {decision === 'approve'
                        ? 'Approval Notes'
                        : decision === 'request_changes'
                          ? 'Required Changes'
                          : 'Rejection Reason'}
                    </label>
                    <textarea
                      placeholder="Add your notes..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full p-3 rounded-lg border text-sm resize-none h-24 focus:outline-none focus:ring-2"
                      style={{ borderColor: COLOR_BORDER, outlineColor: COLOR_ACCENT }}
                    />
                  </div>

                  <button
                    onClick={
                      decision === 'approve'
                        ? handleApprove
                        : decision === 'request_changes'
                          ? handleRequestChanges
                          : handleReject
                    }
                    disabled={isSubmitting || !notes.trim()}
                    className="w-full py-2 rounded-lg font-bold text-white transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    style={{
                      background:
                        decision === 'approve'
                          ? '#10B981'
                          : decision === 'request_changes'
                            ? '#F59E0B'
                            : '#EF4444',
                    }}
                  >
                    <Send size={16} />
                    {isSubmitting ? 'Submitting...' : decision === 'approve' ? 'Approve Seller' : decision === 'request_changes' ? 'Send Request' : 'Reject Seller'}
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

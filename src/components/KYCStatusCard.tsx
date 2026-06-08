'use client'

import { motion } from 'framer-motion'
import { CheckCircle2, AlertCircle, Clock, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER } from '@/styles/forward-colors'

interface KYCStatusCardProps {
  status: 'not_started' | 'in_progress' | 'completed' | 'failed' | 'expired'
  completionPercentage: number
  riskLevel: 'low' | 'medium' | 'high'
  approvalStatus: 'approved' | 'rejected' | 'pending_review'
  lastVerificationDate?: string
  expiryDate?: string
}

export function KYCStatusCard({
  status,
  completionPercentage,
  riskLevel,
  approvalStatus,
  lastVerificationDate,
  expiryDate,
}: KYCStatusCardProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'completed':
        return '#10B981'
      case 'in_progress':
        return COLOR_ACCENT
      case 'failed':
      case 'expired':
        return '#EF4444'
      default:
        return COLOR_TEXT_SECONDARY
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5" style={{ color: '#10B981' }} />
      case 'failed':
      case 'expired':
        return <AlertCircle className="w-5 h-5" style={{ color: '#EF4444' }} />
      case 'in_progress':
        return <Clock className="w-5 h-5" style={{ color: COLOR_ACCENT }} />
      default:
        return <AlertCircle className="w-5 h-5" style={{ color: COLOR_TEXT_SECONDARY }} />
    }
  }

  const getStatusText = () => {
    switch (status) {
      case 'completed':
        return approvalStatus === 'approved' ? 'Verified & Approved' : 'Pending Final Review'
      case 'in_progress':
        return 'Verification In Progress'
      case 'failed':
        return 'Verification Failed'
      case 'expired':
        return 'Verification Expired'
      default:
        return 'Not Started'
    }
  }

  const getRiskColor = () => {
    switch (riskLevel) {
      case 'low':
        return '#10B981'
      case 'medium':
        return '#F59E0B'
      case 'high':
        return '#EF4444'
      default:
        return COLOR_TEXT_SECONDARY
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-lg border overflow-hidden"
      style={{ borderColor: COLOR_BORDER, background: 'white' }}
    >
      {/* Header */}
      <div
        className="p-6 border-b"
        style={{ borderColor: COLOR_BORDER, background: getStatusColor() + '15' }}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3">
            {getStatusIcon()}
            <div>
              <h3 className="font-bold text-lg" style={{ color: COLOR_PRIMARY }}>
                Identity Verification
              </h3>
              <p className="text-xs mt-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                KYC/AML Verification Status
              </p>
            </div>
          </div>
          {status === 'not_started' && (
            <Link href="/dashboard/seller/kyc">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-lg hover:bg-white transition-colors"
                style={{ color: COLOR_ACCENT }}
              >
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </Link>
          )}
        </div>

        <p className="text-sm font-bold" style={{ color: getStatusColor() }}>
          {getStatusText()}
        </p>
      </div>

      {/* Body */}
      <div className="p-6 space-y-6">
        {/* Progress Bar */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-bold" style={{ color: COLOR_PRIMARY }}>
              Overall Progress
            </p>
            <p className="text-sm font-bold" style={{ color: COLOR_ACCENT }}>
              {completionPercentage}%
            </p>
          </div>
          <div className="w-full h-2 rounded-full" style={{ background: COLOR_BORDER }}>
            <motion.div
              className="h-2 rounded-full"
              style={{ background: COLOR_ACCENT }}
              initial={{ width: '0%' }}
              animate={{ width: `${completionPercentage}%` }}
              transition={{ duration: 0.6, delay: 0.2 }}
            />
          </div>
        </div>

        {/* Risk Level */}
        <div className="flex items-center justify-between p-4 rounded-lg" style={{ background: getRiskColor() + '15' }}>
          <div>
            <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
              Risk Assessment
            </p>
            <p className="font-bold text-lg mt-1" style={{ color: COLOR_PRIMARY }}>
              {riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)} Risk
            </p>
          </div>
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white"
            style={{ background: getRiskColor() }}
          >
            ✓
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4">
          {lastVerificationDate && (
            <div className="p-3 rounded-lg border" style={{ borderColor: COLOR_BORDER }}>
              <p className="text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>
                Verified
              </p>
              <p className="font-bold text-sm mt-1" style={{ color: COLOR_PRIMARY }}>
                {new Date(lastVerificationDate).toLocaleDateString()}
              </p>
            </div>
          )}
          {expiryDate && (
            <div className="p-3 rounded-lg border" style={{ borderColor: COLOR_BORDER }}>
              <p className="text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>
                Expires
              </p>
              <p className="font-bold text-sm mt-1" style={{ color: COLOR_PRIMARY }}>
                {new Date(expiryDate).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>

        {/* Status Messages */}
        {status === 'failed' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 rounded-lg border-l-4"
            style={{ borderColor: '#EF4444', background: '#FEF2F2' }}
          >
            <p className="text-sm font-bold" style={{ color: '#991B1B' }}>
              Action Required
            </p>
            <p className="text-xs mt-1" style={{ color: '#7F1D1D' }}>
              Your verification was unsuccessful. Please review the feedback and resubmit your documents.
            </p>
          </motion.div>
        )}

        {status === 'in_progress' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 rounded-lg border-l-4"
            style={{ borderColor: COLOR_ACCENT, background: COLOR_ACCENT + '15' }}
          >
            <p className="text-sm font-bold" style={{ color: COLOR_ACCENT }}>
              Under Review
            </p>
            <p className="text-xs mt-1" style={{ color: COLOR_TEXT_SECONDARY }}>
              Your documents are being reviewed by our compliance team. This typically takes 24-48 hours.
            </p>
          </motion.div>
        )}

        {status === 'completed' && approvalStatus === 'approved' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 rounded-lg border-l-4"
            style={{ borderColor: '#10B981', background: '#F0FDF4' }}
          >
            <p className="text-sm font-bold" style={{ color: '#065F46' }}>
              ✓ Verification Complete
            </p>
            <p className="text-xs mt-1" style={{ color: '#047857' }}>
              You can now list companies and access all seller features on Forward.
            </p>
          </motion.div>
        )}
      </div>

      {/* Footer */}
      {status !== 'completed' && (
        <div
          className="p-4 border-t flex items-center justify-between"
          style={{ borderColor: COLOR_BORDER, background: COLOR_ACCENT + '08' }}
        >
          <p className="text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>
            Complete your verification to list deals
          </p>
          <Link href="/dashboard/seller/kyc">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 rounded-lg font-bold text-white text-sm flex items-center gap-2"
              style={{ background: COLOR_ACCENT }}
            >
              Continue <ChevronRight className="w-4 h-4" />
            </motion.button>
          </Link>
        </div>
      )}
    </motion.div>
  )
}

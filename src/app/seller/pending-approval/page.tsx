'use client'

// Dynamic: reads runtime query params (userId, plan, session) — not statically prerenderable
export const dynamic = 'force-dynamic'

import { Suspense } from 'react'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Clock, Mail, CheckCircle2, Zap, AlertCircle } from 'lucide-react'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER, COLOR_BG_PRIMARY } from '@/styles/forward-colors'

function PendingApprovalPageInner() {
  const searchParams = useSearchParams()
  const userId = searchParams?.get('userId')
  const [userEmail, setUserEmail] = useState('')
  const [userPlan, setUserPlan] = useState<'FREEMIUM' | 'PREMIUM'>('FREEMIUM')
  const [status, setStatus] = useState<'email_verified' | 'approved' | 'checking'>('checking')

  useEffect(() => {
    // Check approval status
    const checkStatus = async () => {
      try {
        const response = await fetch(`/api/seller/status?userId=${userId}`)
        const data = await response.json()
        setUserEmail(data.email)
        setUserPlan(data.sellerPlanTier || 'FREEMIUM')
        setStatus(data.approved ? 'approved' : 'email_verified')
      } catch (error) {
        console.error('Status check failed:', error)
      }
    }

    if (userId) {
      checkStatus()
      // Poll every 5 seconds
      const interval = setInterval(checkStatus, 5000)
      return () => clearInterval(interval)
    }
  }, [userId])

  if (status === 'checking') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: COLOR_BG_PRIMARY }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          <Clock size={48} style={{ color: COLOR_ACCENT }} />
        </motion.div>
      </div>
    )
  }

  if (status === 'approved') {
    return <ApprovedPage userId={userId || ''} />
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: COLOR_BG_PRIMARY }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full mx-auto px-4"
      >
        <div className="bg-white rounded-2xl border p-8 md:p-12 text-center" style={{ borderColor: COLOR_BORDER }}>
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 100 }}
            className="mb-6"
          >
            <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center" style={{ background: COLOR_BG_PRIMARY }}>
              <Clock size={40} style={{ color: COLOR_ACCENT }} />
            </div>
          </motion.div>

          <h1 className="text-3xl font-black mb-2" style={{ color: COLOR_PRIMARY }}>
            Account Under Review ⏳
          </h1>

          <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-lg mb-2">
            Your account has been created and email verified. We're reviewing your details.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg mb-8" style={{ background: userPlan === 'PREMIUM' ? 'rgba(245, 158, 11, 0.15)' : COLOR_BG_PRIMARY }}>
            {userPlan === 'PREMIUM' ? (
              <>
                <span style={{ color: '#F59E0B' }}>👑</span>
                <span className="text-xs font-bold" style={{ color: '#F59E0B' }}>Premium Plan</span>
              </>
            ) : (
              <>
                <span>✓</span>
                <span className="text-xs font-bold" style={{ color: COLOR_ACCENT }}>Freemium Plan</span>
              </>
            )}
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-lg border p-6 mb-8 text-left space-y-6" style={{ borderColor: COLOR_BORDER }}>
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <CheckCircle2 size={24} style={{ color: '#10B981' }} />
              </div>
              <div>
                <h3 className="font-bold" style={{ color: COLOR_PRIMARY }}>
                  ✓ Email Verified
                </h3>
                <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                  Your email address has been confirmed
                </p>
              </div>
            </div>

            <div className="h-8 flex justify-center">
              <div className="w-1" style={{ background: COLOR_BORDER }}></div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <Clock size={24} style={{ color: COLOR_ACCENT }} />
              </div>
              <div>
                <h3 className="font-bold" style={{ color: COLOR_PRIMARY }}>
                  ⏳ Account Review (1-24 hours)
                </h3>
                <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                  Our team is reviewing your account for verification
                </p>
              </div>
            </div>

            <div className="h-8 flex justify-center">
              <div className="w-1 opacity-40" style={{ background: COLOR_BORDER }}></div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <CheckCircle2 size={24} className="opacity-40" style={{ color: COLOR_TEXT_SECONDARY }} />
              </div>
              <div>
                <h3 className="font-bold opacity-60" style={{ color: COLOR_PRIMARY }}>
                  Account Approved
                </h3>
                <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                  You'll unlock access to submit your business information
                </p>
              </div>
            </div>
          </div>

          {/* What To Expect */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 rounded-lg mb-8 border"
            style={{ background: '#F0F9FF', borderColor: '#93C5FD' }}
          >
            <div className="flex items-start gap-3">
              <Mail size={20} style={{ color: '#3B82F6' }} className="flex-shrink-0 mt-0.5" />
              <div className="text-left">
                <p className="font-bold text-sm" style={{ color: '#1E40AF' }}>
                  Check your email
                </p>
                <p className="text-xs mt-1" style={{ color: '#3B82F6' }}>
                  Once approved, we'll send you a confirmation email with a link to submit your business details.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Why We Review */}
          <div className="text-left space-y-3 p-4 rounded-lg" style={{ background: COLOR_BG_PRIMARY }}>
            <h3 className="font-bold text-sm" style={{ color: COLOR_PRIMARY }}>
              Why we review accounts:
            </h3>
            <ul className="space-y-2 text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
              <li className="flex items-center gap-2">
                <Zap size={16} style={{ color: COLOR_ACCENT }} />
                Prevent fraud and protect buyers
              </li>
              <li className="flex items-center gap-2">
                <Zap size={16} style={{ color: COLOR_ACCENT }} />
                Verify seller legitimacy
              </li>
              <li className="flex items-center gap-2">
                <Zap size={16} style={{ color: COLOR_ACCENT }} />
                Ensure quality listings on marketplace
              </li>
            </ul>
          </div>

          {/* CTA */}
          <div className="mt-8 pt-8 border-t" style={{ borderColor: COLOR_BORDER }}>
            <p className="text-sm mb-4" style={{ color: COLOR_TEXT_SECONDARY }}>
              Questions? Email us at{' '}
              <a href="mailto:support@forward.com" className="font-bold" style={{ color: COLOR_ACCENT }}>
                support@forward.com
              </a>
            </p>
            <Link
              href="/marketplace"
              className="inline-block px-6 py-3 rounded-lg font-semibold border transition-all hover:bg-gray-50"
              style={{ borderColor: COLOR_BORDER, color: COLOR_PRIMARY }}
            >
              Browse Marketplace
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function ApprovedPage({ userId }: { userId: string }) {
  const router = useRouter()

  useEffect(() => {
    setTimeout(() => {
      router.push(`/seller/submit-business?userId=${userId}`)
    }, 3000)
  }, [router, userId])

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: COLOR_BG_PRIMARY }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full mx-auto px-4"
      >
        <div className="bg-white rounded-2xl border p-8 md:p-12 text-center" style={{ borderColor: COLOR_BORDER }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 100 }}
            className="mb-6"
          >
            <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center" style={{ background: COLOR_BG_PRIMARY }}>
              <CheckCircle2 size={40} style={{ color: '#10B981' }} />
            </div>
          </motion.div>

          <h1 className="text-3xl font-black mb-2" style={{ color: COLOR_PRIMARY }}>
            Account Approved! 🎉
          </h1>

          <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-lg mb-8">
            Your account has been approved. Redirecting to submit your business details...
          </p>

          <div className="p-4 rounded-lg" style={{ background: '#D1FAE5', borderLeft: '4px solid #10B981' }}>
            <p style={{ color: '#065F46' }} className="text-sm">
              ✨ The more complete your business information, the better your chances of selling!
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}


export default function PendingApprovalPage() {
  return (
    <Suspense fallback={null}>
      <PendingApprovalPageInner />
    </Suspense>
  )
}

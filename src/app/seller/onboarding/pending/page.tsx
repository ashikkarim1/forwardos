'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { CheckCircle2, Clock, AlertCircle, Mail, MessageSquare } from 'lucide-react'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER, COLOR_BG_PRIMARY } from '@/styles/forward-colors'

export default function PendingApprovalPage() {
  const [emailSent, setEmailSent] = useState(false)

  useEffect(() => {
    // Simulate email verification notification
    setEmailSent(true)
  }, [])

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
            Verification in Progress
          </h1>

          <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-lg mb-8">
            Thank you for submitting your business details! Our team is now reviewing your listing.
          </p>

          {/* Timeline */}
          <div className="bg-white rounded-lg border p-6 mb-8 text-left space-y-6" style={{ borderColor: COLOR_BORDER }}>
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <CheckCircle2 size={24} style={{ color: '#10B981' }} />
              </div>
              <div>
                <h3 className="font-bold" style={{ color: COLOR_PRIMARY }}>
                  ✓ Data Received
                </h3>
                <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                  All your business information, photos, and documents have been securely uploaded.
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
                  ⏳ Verification (24-48 hours)
                </h3>
                <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                  Our team is reviewing your business details, verifying authenticity, and checking documents. We may contact you if we need clarification.
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
                  Launch Your Listing
                </h3>
                <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                  Once approved, your listing will go live on the Forward marketplace and buyers can see your profile.
                </p>
              </div>
            </div>
          </div>

          {/* Email Verification */}
          {emailSent && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 rounded-lg mb-8 border"
              style={{ background: '#F0F9FF', borderColor: '#93C5FD' }}
            >
              <div className="flex items-start gap-3">
                <Mail size={20} style={{ color: '#3B82F6' }} />
                <div className="text-left">
                  <p className="font-bold text-sm" style={{ color: '#1E40AF' }}>
                    Check your email
                  </p>
                  <p className="text-xs mt-1" style={{ color: '#3B82F6' }}>
                    We've sent a verification link to confirm your email address. Click it to complete email verification.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Next Steps */}
          <div className="space-y-4 mb-8">
            <h3 className="font-bold" style={{ color: COLOR_PRIMARY }}>
              While You Wait...
            </h3>
            <ul className="space-y-3 text-left">
              <li className="flex items-center gap-3 text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                <span className="text-base">📧</span>
                <span>Verify your email address from the link we sent</span>
              </li>
              <li className="flex items-center gap-3 text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                <span className="text-base">📚</span>
                <span>Read our buyer guide to understand the platform</span>
              </li>
              <li className="flex items-center gap-3 text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                <span className="text-base">💼</span>
                <span>Prepare answers to potential buyer questions</span>
              </li>
              <li className="flex items-center gap-3 text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                <span className="text-base">🎯</span>
                <span>If you selected Premium, we'll send payment info after approval</span>
              </li>
            </ul>
          </div>

          {/* FAQ */}
          <motion.details
            className="p-4 rounded-lg text-left cursor-pointer border mb-8"
            style={{ borderColor: COLOR_BORDER, background: COLOR_BG_PRIMARY }}
          >
            <summary className="font-bold flex items-center gap-2" style={{ color: COLOR_PRIMARY }}>
              <span>❓ Frequently Asked Questions</span>
            </summary>
            <div className="mt-4 space-y-4 text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
              <div>
                <p className="font-semibold mb-1" style={{ color: COLOR_PRIMARY }}>
                  How long does verification take?
                </p>
                <p>Most listings are verified within 24-48 hours. Complex cases may take up to 5 business days.</p>
              </div>
              <div>
                <p className="font-semibold mb-1" style={{ color: COLOR_PRIMARY }}>
                  What happens if my listing is rejected?
                </p>
                <p>We'll email you with specific reasons and give you a chance to make corrections. Most rejections are due to incomplete information.</p>
              </div>
              <div>
                <p className="font-semibold mb-1" style={{ color: COLOR_PRIMARY }}>
                  Can I edit my listing while it's being reviewed?
                </p>
                <p>Yes, you can update most information. However, major changes may restart the verification process.</p>
              </div>
              <div>
                <p className="font-semibold mb-1" style={{ color: COLOR_PRIMARY }}>
                  When do I pay for Premium?
                </p>
                <p>Premium payment happens AFTER we verify your business is legitimate. You'll receive a Stripe payment link via email.</p>
              </div>
            </div>
          </motion.details>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/marketplace"
              className="px-6 py-3 rounded-lg font-semibold border transition-all hover:bg-gray-50 text-center"
              style={{ borderColor: COLOR_BORDER, color: COLOR_PRIMARY }}
            >
              Browse Marketplace
            </Link>
            <button
              className="px-6 py-3 rounded-lg font-semibold text-white transition-all hover:opacity-90 text-center flex items-center justify-center gap-2"
              style={{ background: COLOR_ACCENT }}
            >
              <MessageSquare size={18} />
              Contact Support
            </button>
          </div>

          {/* Help Text */}
          <p className="text-xs mt-8" style={{ color: COLOR_TEXT_SECONDARY }}>
            Questions? Email us at <a href="mailto:support@forward.com" className="underline hover:opacity-80"  style={{ color: COLOR_ACCENT }}>support@forward.com</a>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

'use client'

// Dynamic: reads runtime query params (userId, plan, session) — not statically prerenderable
export const dynamic = 'force-dynamic'

import { Suspense } from 'react'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { CheckCircle2, ArrowRight, Zap } from 'lucide-react'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER, COLOR_BG_PRIMARY } from '@/styles/forward-colors'

function CheckoutSuccessPageInner() {
  const searchParams = useSearchParams()
  const sessionId = searchParams?.get('sessionId')
  const dealId = searchParams?.get('dealId')
  const [isVerifying, setIsVerifying] = useState(true)
  const [verified, setVerified] = useState(false)

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId || !dealId) {
        setIsVerifying(false)
        return
      }

      try {
        const response = await fetch('/api/seller/checkout/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId, dealId }),
        })

        if (response.ok) {
          setVerified(true)
        }
      } catch (error) {
        console.error('Payment verification failed:', error)
      } finally {
        setIsVerifying(false)
      }
    }

    verifyPayment()
  }, [sessionId, dealId])

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: COLOR_BG_PRIMARY }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full mx-auto px-4"
      >
        <div className="bg-white rounded-2xl border p-8 md:p-12 text-center" style={{ borderColor: COLOR_BORDER }}>
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 100, delay: 0.2 }}
            className="mb-6"
          >
            <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center" style={{ background: COLOR_BG_PRIMARY }}>
              <CheckCircle2 size={40} style={{ color: '#10B981' }} />
            </div>
          </motion.div>

          <h1 className="text-3xl font-black mb-2" style={{ color: COLOR_PRIMARY }}>
            Payment Successful! 🎉
          </h1>

          <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-lg mb-8">
            {isVerifying
              ? 'Verifying your payment...'
              : verified
                ? 'Your Premium listing is now active and will appear featured on the Forward marketplace.'
                : 'Thank you for your payment!'}
          </p>

          {/* Benefits */}
          {!isVerifying && verified && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-green-50 rounded-lg border p-6 mb-8"
              style={{ borderColor: '#D1FAE5' }}
            >
              <h3 className="font-bold mb-4" style={{ color: '#065F46' }}>
                Your Premium Benefits Are Active:
              </h3>
              <ul className="space-y-3 text-left">
                <li className="flex items-start gap-3" style={{ color: '#065F46' }}>
                  <Zap size={18} className="flex-shrink-0 mt-0.5" />
                  <span>⭐ Featured placement on marketplace homepage</span>
                </li>
                <li className="flex items-start gap-3" style={{ color: '#065F46' }}>
                  <Zap size={18} className="flex-shrink-0 mt-0.5" />
                  <span>📊 Full analytics dashboard with buyer insights</span>
                </li>
                <li className="flex items-start gap-3" style={{ color: '#065F46' }}>
                  <Zap size={18} className="flex-shrink-0 mt-0.5" />
                  <span>🔐 Secure data room for buyer access</span>
                </li>
                <li className="flex items-start gap-3" style={{ color: '#065F46' }}>
                  <Zap size={18} className="flex-shrink-0 mt-0.5" />
                  <span>💬 Priority seller support</span>
                </li>
                <li className="flex items-start gap-3" style={{ color: '#065F46' }}>
                  <Zap size={18} className="flex-shrink-0 mt-0.5" />
                  <span>✨ Premium seller badge on your profile</span>
                </li>
              </ul>
            </motion.div>
          )}

          {/* Next Steps */}
          <div className="space-y-4 mb-8">
            <h3 className="font-bold" style={{ color: COLOR_PRIMARY }}>
              What's Next?
            </h3>
            <ol className="space-y-2 text-left text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
              <li>✅ Payment processed and confirmed</li>
              <li>✅ Your listing is now active on the marketplace</li>
              <li>✅ Buyers can see your profile and request access</li>
              <li>⏳ Check your dashboard for inquiries and buyer interest</li>
              <li>⏳ Access your analytics to monitor performance</li>
            </ol>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/dashboard/seller"
              className="flex-1 px-6 py-3 rounded-lg font-semibold text-white transition-all hover:opacity-90 text-center flex items-center justify-center gap-2"
              style={{ background: COLOR_ACCENT }}
            >
              Go to Dashboard
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/marketplace"
              className="flex-1 px-6 py-3 rounded-lg font-semibold border transition-all hover:bg-gray-50 text-center"
              style={{ borderColor: COLOR_BORDER, color: COLOR_PRIMARY }}
            >
              View Marketplace
            </Link>
          </div>

          {/* Support */}
          <p className="text-xs mt-8" style={{ color: COLOR_TEXT_SECONDARY }}>
            Questions? Contact us at{' '}
            <a href="mailto:support@forward.com" className="underline hover:opacity-80" style={{ color: COLOR_ACCENT }}>
              support@forward.com
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  )
}


export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutSuccessPageInner />
    </Suspense>
  )
}

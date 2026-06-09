'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { AlertCircle, Loader, Lock } from 'lucide-react'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER, COLOR_BG_PRIMARY } from '@/styles/forward-colors'

export default function CheckoutPage() {
  const searchParams = useSearchParams()
  const dealId = searchParams.get('dealId')
  const planTier = searchParams.get('planTier')

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [checkoutUrl, setCheckoutUrl] = useState('')

  useEffect(() => {
    if (!dealId || planTier !== 'premium') {
      setError('Invalid checkout parameters')
      setIsLoading(false)
      return
    }

    // Fetch checkout session from server
    const fetchCheckout = async () => {
      try {
        const response = await fetch('/api/seller/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ dealId, planTier }),
        })

        if (!response.ok) {
          throw new Error('Failed to create checkout session')
        }

        const data = await response.json()
        if (data.checkoutUrl) {
          // Redirect to Stripe
          window.location.href = data.checkoutUrl
        } else {
          setError('Could not initiate checkout')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Checkout failed')
        setIsLoading(false)
      }
    }

    fetchCheckout()
  }, [dealId, planTier])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: COLOR_BG_PRIMARY }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full mx-auto px-4"
        >
          <div className="bg-white rounded-lg border p-8 text-center" style={{ borderColor: COLOR_BORDER }}>
            <AlertCircle size={48} className="mx-auto mb-4" style={{ color: '#EF4444' }} />
            <h1 className="text-2xl font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
              Checkout Error
            </h1>
            <p style={{ color: COLOR_TEXT_SECONDARY }} className="mb-6">
              {error}
            </p>
            <Link
              href="/seller/onboarding/pending"
              className="inline-block px-6 py-2 rounded-lg font-semibold text-white transition-all"
              style={{ background: COLOR_ACCENT }}
            >
              Go Back
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: COLOR_BG_PRIMARY }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full mx-auto px-4"
      >
        <div className="bg-white rounded-lg border p-8 text-center" style={{ borderColor: COLOR_BORDER }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="mb-6"
          >
            <Loader size={48} className="mx-auto" style={{ color: COLOR_ACCENT }} />
          </motion.div>
          <h1 className="text-2xl font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
            Setting up Payment
          </h1>
          <p style={{ color: COLOR_TEXT_SECONDARY }}>
            Redirecting to Stripe checkout...
          </p>
          <div className="mt-6 pt-6 border-t" style={{ borderColor: COLOR_BORDER }}>
            <div className="flex items-center justify-center gap-2 text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>
              <Lock size={16} />
              <span>Secure payment powered by Stripe</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

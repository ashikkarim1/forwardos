'use client'

import { useState } from 'react'
import { useLocale } from '@/context/LocaleContext'
import { formatCurrency } from '@/lib/currency'
import { useStripe } from '@/hooks/useStripe'
import { AlertCircle, Loader } from 'lucide-react'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER } from '@/styles/forward-colors'

interface StripeCheckoutProps {
  planId: 'starter' | 'professional' | 'enterprise'
  planName: string
  amount: number
  features: string[]
  onSuccess?: () => void
  onCancel?: () => void
}

export function StripeCheckout({
  planId,
  planName,
  amount,
  features,
  onSuccess,
  onCancel,
}: StripeCheckoutProps) {
  const { locale, currency, isRTL } = useLocale()
  const { isLoading, error, success, initiateCheckout } = useStripe({
    planId,
    userId: 'user_123', // Would come from auth context
    userEmail: 'user@example.com', // Would come from auth context
  })

  const handleCheckout = async () => {
    await initiateCheckout()
  }

  if (success) {
    return (
      <div className="p-8 rounded-lg border-2 text-center" style={{ borderColor: COLOR_ACCENT, background: COLOR_ACCENT + '05' }}>
        <div className="text-4xl mb-4">✅</div>
        <h3 className="text-2xl font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
          Subscription Confirmed
        </h3>
        <p style={{ color: COLOR_TEXT_SECONDARY }} className="mb-6">
          Welcome to {planName}! Check your email for confirmation and next steps.
        </p>
        <button
          onClick={onSuccess}
          className="px-8 py-3 rounded-lg font-bold text-white hover:opacity-90"
          style={{ background: COLOR_ACCENT }}
        >
          Go to Dashboard
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Checkout Summary */}
      <div className="p-8 rounded-lg border" style={{ borderColor: COLOR_BORDER }}>
        <h3 className="text-2xl font-bold mb-4" style={{ color: COLOR_PRIMARY }}>
          {planName} Plan
        </h3>

        <div className="mb-6 pb-6 border-b" style={{ borderColor: COLOR_BORDER }}>
          <p className="text-3xl font-bold" style={{ color: COLOR_ACCENT }}>
            {formatCurrency(amount, currency, locale)}/month
          </p>
          <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-sm mt-1">
            Billed {currency === 'AED' ? 'monthly in AED' : currency === 'CAD' ? 'monthly in CAD' : 'monthly in USD'}
          </p>
        </div>

        {/* Features List */}
        <div className="mb-6">
          <h4 className="font-bold mb-3" style={{ color: COLOR_PRIMARY }}>
            Included Features:
          </h4>
          <ul className="space-y-2">
            {features.map((feature, idx) => (
              <li key={idx} className="flex gap-2 text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                <span style={{ color: COLOR_ACCENT }}>✓</span>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Payment Details */}
        <div className="mb-6 pb-6 border-b" style={{ borderColor: COLOR_BORDER }}>
          <p className="text-sm font-semibold mb-2" style={{ color: COLOR_PRIMARY }}>
            Payment Summary
          </p>
          <div className={`flex justify-between text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
            <span style={{ color: COLOR_TEXT_SECONDARY }}>Subtotal:</span>
            <span style={{ color: COLOR_PRIMARY }} className="font-semibold">
              {formatCurrency(amount, currency, locale)}
            </span>
          </div>
          <div className={`flex justify-between text-sm mt-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <span style={{ color: COLOR_TEXT_SECONDARY }}>Tax:</span>
            <span style={{ color: COLOR_PRIMARY }} className="font-semibold">
              —
            </span>
          </div>
          <div className={`flex justify-between text-lg mt-3 font-bold border-t pt-3 ${isRTL ? 'flex-row-reverse' : ''}`} style={{ borderColor: COLOR_BORDER, color: COLOR_PRIMARY }}>
            <span>Total:</span>
            <span style={{ color: COLOR_ACCENT }}>
              {formatCurrency(amount, currency, locale)}/month
            </span>
          </div>
        </div>

        {/* Terms */}
        <div style={{ background: COLOR_PRIMARY + '02', color: COLOR_TEXT_SECONDARY }} className="p-3 rounded-lg mb-6 text-xs">
          <p>
            By confirming your subscription, you agree to our{' '}
            <a href="#" className="underline font-semibold">
              Terms of Service
            </a>{' '}
            and authorize recurring charges on your payment method.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 rounded-lg flex gap-3" style={{ background: '#FEE2E2', borderColor: '#FCA5A5', border: '1px solid' }}>
            <AlertCircle size={20} style={{ color: '#B91C1C' }} className="flex-shrink-0 mt-0.5" />
            <div style={{ color: '#B91C1C' }}>
              <p className="font-semibold text-sm">{error}</p>
              <p className="text-xs mt-1">Please try again or contact support.</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 px-6 py-3 rounded-lg font-bold border hover:bg-gray-50 disabled:opacity-50"
            style={{ borderColor: COLOR_BORDER, color: COLOR_PRIMARY }}
          >
            Cancel
          </button>
          <button
            onClick={handleCheckout}
            disabled={isLoading}
            className="flex-1 px-6 py-3 rounded-lg font-bold text-white hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
            style={{ background: COLOR_ACCENT }}
          >
            {isLoading && <Loader size={18} className="animate-spin" />}
            {isLoading ? 'Processing...' : 'Continue to Payment'}
          </button>
        </div>
      </div>

      {/* Security Note */}
      <div className="text-center text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>
        <p>🔒 Secure payment powered by Stripe. Your payment information is encrypted.</p>
      </div>
    </div>
  )
}

// Stripe integration hook for payment processing
import { useCallback, useState } from 'react'
import { useLocale } from '@/context/LocaleContext'
import type { Currency } from '@/lib/currency'
import { formatStripeAmount, createCheckoutSessionConfig } from '@/lib/stripe-config'

interface UseStripeOptions {
  planId: string
  userId: string
  userEmail: string
}

interface StripeCheckoutState {
  isLoading: boolean
  error: string | null
  success: boolean
}

export function useStripe({ planId, userId, userEmail }: UseStripeOptions) {
  const { currency, locale } = useLocale()
  const [state, setState] = useState<StripeCheckoutState>({
    isLoading: false,
    error: null,
    success: false,
  })

  const initiateCheckout = useCallback(async () => {
    setState({ isLoading: true, error: null, success: false })

    try {
      // Create checkout session on backend
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId,
          currency,
          userId,
          userEmail,
          locale,
          successUrl: `${window.location.origin}/dashboard?payment=success`,
          cancelUrl: `${window.location.origin}/dashboard?payment=canceled`,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create checkout session')
      }

      const { sessionId } = await response.json()

      // Redirect to Stripe Checkout
      if (typeof window !== 'undefined' && window.location) {
        // This would need @stripe/stripe-js loaded
        // For now, just redirect to the session
        window.location.href = `/checkout/${sessionId}`
      }

      setState({ isLoading: false, error: null, success: true })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Payment processing failed'
      setState({ isLoading: false, error: errorMessage, success: false })
    }
  }, [planId, currency, userId, userEmail, locale])

  const cancelCheckout = useCallback(() => {
    setState({ isLoading: false, error: null, success: false })
  }, [])

  return {
    ...state,
    initiateCheckout,
    cancelCheckout,
    currency,
    locale,
  }
}

// Hook to format prices with Stripe amounts
export function useStripePrice(amountInCents: number) {
  const { currency } = useLocale()
  return formatStripeAmount(amountInCents, currency as Currency)
}

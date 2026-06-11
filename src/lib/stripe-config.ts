// Stripe configuration for multi-currency payment processing
// Supports CAD (Canada), AED (UAE), and USD (US)

import type { Currency } from './currency'

export interface StripeConfig {
  publishableKey: string
  secretKey: string
  currencies: Currency[]
  defaultCurrency: Currency
}

export interface StripePriceConfig {
  currency: Currency
  amount: number // in cents/smallest denomination
  productId: string
  priceId: string
  description: string
}

// Environment-based Stripe keys
export function getStripeConfig(environment: 'development' | 'production' = 'development'): StripeConfig {
  const isDev = environment === 'development' || process.env.NODE_ENV === 'development'

  return {
    publishableKey: isDev
      ? process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_DEV || 'pk_test_example'
      : process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_PROD || 'pk_live_example',
    secretKey: isDev
      ? process.env.STRIPE_SECRET_KEY_DEV || 'sk_test_example'
      : process.env.STRIPE_SECRET_KEY_PROD || 'sk_live_example',
    currencies: ['USD', 'CAD', 'AED'],
    defaultCurrency: 'USD',
  }
}

// Subscription plans for different user types
export const subscriptionPlans: Record<string, Record<Currency, StripePriceConfig>> = {
  // Buyer subscription plans
  buyer_starter: {
    USD: {
      currency: 'USD',
      amount: 49900, // $499/month
      productId: 'prod_buyer_starter',
      priceId: 'price_buyer_starter_usd',
      description: 'Buyer Starter Plan (USD)',
    },
    CAD: {
      currency: 'CAD',
      amount: 67500, // ~C$675/month
      productId: 'prod_buyer_starter',
      priceId: 'price_buyer_starter_cad',
      description: 'Buyer Starter Plan (CAD)',
    },
    AED: {
      currency: 'AED',
      amount: 183300, // ~د.إ1833/month
      productId: 'prod_buyer_starter',
      priceId: 'price_buyer_starter_aed',
      description: 'Buyer Starter Plan (AED)',
    },
  },
  buyer_professional: {
    USD: {
      currency: 'USD',
      amount: 199900, // $1,999/month
      productId: 'prod_buyer_professional',
      priceId: 'price_buyer_professional_usd',
      description: 'Buyer Professional Plan (USD)',
    },
    CAD: {
      currency: 'CAD',
      amount: 270000, // ~C$2,700/month
      productId: 'prod_buyer_professional',
      priceId: 'price_buyer_professional_cad',
      description: 'Buyer Professional Plan (CAD)',
    },
    AED: {
      currency: 'AED',
      amount: 733300, // ~د.إ7,333/month
      productId: 'prod_buyer_professional',
      priceId: 'price_buyer_professional_aed',
      description: 'Buyer Professional Plan (AED)',
    },
  },
  // Broker subscription plans
  broker_network: {
    USD: {
      currency: 'USD',
      amount: 249900, // $2,499/month
      productId: 'prod_broker_network',
      priceId: 'price_broker_network_usd',
      description: 'Broker Network Plan (USD)',
    },
    CAD: {
      currency: 'CAD',
      amount: 337500, // ~C$3,375/month
      productId: 'prod_broker_network',
      priceId: 'price_broker_network_cad',
      description: 'Broker Network Plan (CAD)',
    },
    AED: {
      currency: 'AED',
      amount: 916700, // ~د.إ9,167/month
      productId: 'prod_broker_network',
      priceId: 'price_broker_network_aed',
      description: 'Broker Network Plan (AED)',
    },
  },
}

// Stripe webhook endpoints
export const webhookEndpoints = {
  checkout: '/api/stripe/checkout',
  webhook: '/api/stripe/webhook',
  success: '/dashboard?payment=success',
  cancel: '/dashboard?payment=canceled',
}

// Helper function to get plan pricing for a currency
export function getPlanPrice(planId: string, currency: Currency): StripePriceConfig | null {
  return subscriptionPlans[planId]?.[currency] ?? null
}

// Helper function to format Stripe amount for display
export function formatStripeAmount(amountInCents: number, currency: Currency): string {
  const amount = amountInCents / 100
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(amount)
}

// Helper to create checkout session config
export interface CheckoutSessionConfig {
  planId: string
  currency: Currency
  userId: string
  userEmail: string
  locale: 'en' | 'fr' | 'ar'
  successUrl: string
  cancelUrl: string
}

export function createCheckoutSessionConfig(config: CheckoutSessionConfig) {
  const plan = getPlanPrice(config.planId, config.currency)
  if (!plan) {
    throw new Error(`Plan ${config.planId} not found for currency ${config.currency}`)
  }

  return {
    mode: 'subscription' as const,
    payment_method_types: ['card'],
    line_items: [
      {
        price: plan.priceId,
        quantity: 1,
      },
    ],
    customer_email: config.userEmail,
    client_reference_id: config.userId,
    metadata: {
      userId: config.userId,
      planId: config.planId,
      locale: config.locale,
      currency: config.currency,
    },
    success_url: config.successUrl,
    cancel_url: config.cancelUrl,
  }
}

// Billing page configuration
export const billingConfig = {
  invoiceRetentionDays: 7,
  paymentRetryDays: 3,
  gracePeriodDays: 7,
  supportEmail: 'billing@forwardos.ai',
  supportPhone: {
    US: '+1-888-FORWARD-1',
    CA: '+1-888-FORWARD-1',
    AE: '+971-4-XXX-XXXX', // To be filled with actual number
  },
}

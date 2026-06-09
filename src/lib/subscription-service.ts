import { PlanTier, SubscriptionStatus } from '@prisma/client'

// Plan configuration
export const PLAN_CONFIG: Record<PlanTier, {
  name: string
  monthlyPrice: number
  annualPrice: number
  features: string[]
  apiCallsLimit: number
  maxDealComparisons: number
}> = {
  [PlanTier.STARTER]: {
    name: 'Starter',
    monthlyPrice: 49900, // $499 in cents
    annualPrice: 49900, // Annual pricing (could be different)
    features: [
      'Advanced search & filters (10 categories)',
      'Deal heat scores & success probability',
      'Deal comparison (up to 3)',
      'PDF export for partners',
      'Basic financial metrics',
      'Saved searches & alerts',
      'Email support',
    ],
    apiCallsLimit: 1000,
    maxDealComparisons: 3,
  },
  [PlanTier.PROFESSIONAL]: {
    name: 'Professional',
    monthlyPrice: 199900, // $1999 in cents
    annualPrice: 199900,
    features: [
      'Everything in Starter +',
      'Financial modeling tools (DCF, SDE, ROI)',
      'Deal comparison (up to 5)',
      'Portfolio dashboard & tracking',
      'AI-powered recommendations',
      'Comparables database access',
      'API access (10,000 calls/month)',
      'Priority support',
      'Discussion threads per deal',
    ],
    apiCallsLimit: 10000,
    maxDealComparisons: 5,
  },
  [PlanTier.ENTERPRISE]: {
    name: 'Enterprise',
    monthlyPrice: 0, // Custom pricing
    annualPrice: 0,
    features: [
      'Everything in Professional +',
      'Unlimited API access',
      'Custom integrations',
      'White-label marketplace',
      'Dedicated account manager',
      'Custom reporting & analytics',
      'Institutional API tier',
      'Advanced pipeline analytics',
      '24/7 phone support',
    ],
    apiCallsLimit: -1, // Unlimited
    maxDealComparisons: -1, // Unlimited
  },
}

/**
 * Check if a user's subscription is active
 * Includes active status and trialing status
 */
export function isSubscriptionActive(subscription: {
  status: SubscriptionStatus
  expiresAt: Date | null
  cancelledAt: Date | null
}): boolean {
  if (subscription.cancelledAt) {
    return false
  }

  if (subscription.status === SubscriptionStatus.EXPIRED) {
    return false
  }

  if (subscription.status === SubscriptionStatus.PAYMENT_FAILED) {
    return false
  }

  // Check if expired based on expiresAt date
  if (subscription.expiresAt && new Date() > subscription.expiresAt) {
    return false
  }

  return subscription.status === SubscriptionStatus.ACTIVE || subscription.status === SubscriptionStatus.TRIALING
}

/**
 * Calculate expiration date when subscription is cancelled
 * Expires the next day after the subscription end date
 */
export function calculateCancellationExpiryDate(endDate: Date | null): Date {
  if (!endDate) {
    // If no end date, cancel immediately
    return new Date()
  }

  // Set expiry to next day after end date
  const expiryDate = new Date(endDate)
  expiryDate.setDate(expiryDate.getDate() + 1)
  expiryDate.setHours(0, 0, 0, 0) // Set to start of day

  return expiryDate
}

/**
 * Check if a user can perform an action based on their plan
 */
export function canPerformAction(
  plan: PlanTier,
  action: 'deal_comparison' | 'api_call' | 'export_pdf' | 'financial_modeling'
): boolean {
  const config = PLAN_CONFIG[plan]

  switch (action) {
    case 'deal_comparison':
      return config.maxDealComparisons === -1 || config.maxDealComparisons > 0
    case 'api_call':
      return config.apiCallsLimit === -1 || config.apiCallsLimit > 0
    case 'export_pdf':
      return plan !== PlanTier.STARTER || true // All plans can export
    case 'financial_modeling':
      return plan === PlanTier.PROFESSIONAL || plan === PlanTier.ENTERPRISE
    default:
      return false
  }
}

/**
 * Get remaining API calls for a user
 */
export function getRemainingApiCalls(subscription: {
  planTier: PlanTier
  apiCallsUsed: number
}): number {
  const config = PLAN_CONFIG[subscription.planTier]
  if (config.apiCallsLimit === -1) {
    return -1 // Unlimited
  }
  return Math.max(0, config.apiCallsLimit - subscription.apiCallsUsed)
}

/**
 * Get number of remaining deal comparisons
 */
export function getRemainingDealComparisons(subscription: {
  planTier: PlanTier
  apiCallsUsed: number
}): number {
  const config = PLAN_CONFIG[subscription.planTier]
  if (config.maxDealComparisons === -1) {
    return -1 // Unlimited
  }
  return config.maxDealComparisons
}

/**
 * Convert cents to currency string
 */
export function formatPrice(cents: number, currency: string = 'USD'): string {
  const dollars = cents / 100
  if (currency === 'CAD') {
    return `C$${dollars.toFixed(2)}`
  }
  if (currency === 'AED') {
    return `د.إ${dollars.toFixed(2)}`
  }
  return `$${dollars.toFixed(2)}`
}

/**
 * Get plan tier from string
 */
export function getPlanTier(plan: string): PlanTier {
  const upperPlan = plan.toUpperCase()
  if (upperPlan === 'STARTER') return PlanTier.STARTER
  if (upperPlan === 'PROFESSIONAL') return PlanTier.PROFESSIONAL
  if (upperPlan === 'ENTERPRISE') return PlanTier.ENTERPRISE
  return PlanTier.STARTER
}

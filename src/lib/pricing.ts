/**
 * Pricing & capability matrix — single source of truth for what each tier
 * costs and what each tier can do. Everything (pricing page, gates, dashboard
 * upgrade prompts, Stripe products) reads from here.
 */

// USD monthly pricing.
export const PRICING = {
  buyer: {
    free: { monthly: 0 },
    premium: { monthly: 99 },
  },
  seller: {
    free: { monthly: 0 },          // basic listing — free
    premium: { monthly: 199 },     // premium listing
  },
  broker: {
    pro: { monthly: 599 },         // broker pro — only paid tier
  },
  // Legacy aliases — keep old components compiling. Same numbers as the
  // canonical entries above; remove once every reference is migrated to
  // PRICING.{buyer|seller|broker}.{tier}.monthly.
  premium: { regular: 199, launch: 199, monthly: 199 },
  starter: { regular: 0, launch: 0, monthly: 0 },
  pro: { regular: 99, launch: 99, monthly: 99 },
  freemium: { regular: 0, launch: 0, monthly: 0 },
} as const

// Tier-id strings used across the app + Stripe price ids in env vars.
export const TIER = {
  BUYER_FREE: 'BUYER_FREE',
  BUYER_PREMIUM: 'BUYER_PREMIUM',
  SELLER_FREE: 'SELLER_FREE',
  SELLER_PREMIUM: 'SELLER_PREMIUM',
  BROKER_PRO: 'BROKER_PRO',
} as const
export type TierId = typeof TIER[keyof typeof TIER]

// Stripe price ids — set in Vercel env. Falsey while you wire Stripe up.
export const STRIPE_PRICE_IDS: Record<TierId, string | undefined> = {
  BUYER_FREE: undefined,
  BUYER_PREMIUM: process.env.STRIPE_PRICE_BUYER_PREMIUM,
  SELLER_FREE: undefined,
  SELLER_PREMIUM: process.env.STRIPE_PRICE_SELLER_PREMIUM,
  BROKER_PRO: process.env.STRIPE_PRICE_BROKER_PRO,
}

// ───────────────────────────────────────────────────────────────────────────
// Capabilities — the canonical list of gated features. Add a new feature
// here and gate it via hasCapability() / requireCapability().
// ───────────────────────────────────────────────────────────────────────────
export const CAPABILITY = {
  // Buyer
  BROWSE_LISTINGS: 'BROWSE_LISTINGS',
  CONTACT_SELLER: 'CONTACT_SELLER',
  AI_SEARCH: 'AI_SEARCH',
  SAVED_SEARCHES: 'SAVED_SEARCHES',
  DEAL_ALERTS: 'DEAL_ALERTS',
  EARLY_ACCESS_LISTINGS: 'EARLY_ACCESS_LISTINGS',   // premium buyer
  ADVANCED_AI_MATCHING: 'ADVANCED_AI_MATCHING',     // premium buyer
  MARKET_ANALYTICS: 'MARKET_ANALYTICS',             // premium buyer
  COMPARABLE_TRANSACTIONS: 'COMPARABLE_TRANSACTIONS', // premium buyer
  ACQUISITION_SCORING: 'ACQUISITION_SCORING',       // premium buyer
  // Seller (per-listing)
  LIST_BUSINESS: 'LIST_BUSINESS',
  FEATURED_PLACEMENT: 'FEATURED_PLACEMENT',         // premium listing
  AI_VALUATION: 'AI_VALUATION',                     // premium listing
  AI_LISTING_ENHANCEMENT: 'AI_LISTING_ENHANCEMENT', // premium listing
  PERFORMANCE_ANALYTICS: 'PERFORMANCE_ANALYTICS',   // premium listing
  LEAD_MANAGEMENT: 'LEAD_MANAGEMENT',               // premium listing
  OUTBOUND_CURATED_EMAILS: 'OUTBOUND_CURATED_EMAILS', // premium listing
  // Broker
  UNLIMITED_LISTINGS: 'UNLIMITED_LISTINGS',         // broker pro
  CRM: 'CRM',                                       // broker pro
  AI_PROSPECTING: 'AI_PROSPECTING',                 // broker pro
  MARKETING_AUTOMATION: 'MARKETING_AUTOMATION',     // broker pro
  DEAL_ROOM: 'DEAL_ROOM',                           // broker pro
  REALTIME_UPDATES: 'REALTIME_UPDATES',             // broker pro
  DEAL_ANALYTICS: 'DEAL_ANALYTICS',                 // broker pro
} as const
export type Capability = typeof CAPABILITY[keyof typeof CAPABILITY]

// Capabilities granted by each tier — a *plan* may grant many capabilities,
// and a user often holds plans across multiple roles simultaneously.
export const TIER_CAPABILITIES: Record<TierId, Capability[]> = {
  BUYER_FREE: [
    CAPABILITY.BROWSE_LISTINGS,
    CAPABILITY.CONTACT_SELLER,
    CAPABILITY.AI_SEARCH,
    CAPABILITY.SAVED_SEARCHES,
    CAPABILITY.DEAL_ALERTS,
  ],
  BUYER_PREMIUM: [
    CAPABILITY.BROWSE_LISTINGS,
    CAPABILITY.CONTACT_SELLER,
    CAPABILITY.AI_SEARCH,
    CAPABILITY.SAVED_SEARCHES,
    CAPABILITY.DEAL_ALERTS,
    CAPABILITY.EARLY_ACCESS_LISTINGS,
    CAPABILITY.ADVANCED_AI_MATCHING,
    CAPABILITY.MARKET_ANALYTICS,
    CAPABILITY.COMPARABLE_TRANSACTIONS,
    CAPABILITY.ACQUISITION_SCORING,
  ],
  SELLER_FREE: [
    CAPABILITY.LIST_BUSINESS,
  ],
  SELLER_PREMIUM: [
    CAPABILITY.LIST_BUSINESS,
    CAPABILITY.FEATURED_PLACEMENT,
    CAPABILITY.AI_VALUATION,
    CAPABILITY.AI_LISTING_ENHANCEMENT,
    CAPABILITY.PERFORMANCE_ANALYTICS,
    CAPABILITY.LEAD_MANAGEMENT,
    CAPABILITY.OUTBOUND_CURATED_EMAILS,
  ],
  BROKER_PRO: [
    CAPABILITY.LIST_BUSINESS,
    CAPABILITY.UNLIMITED_LISTINGS,
    CAPABILITY.CRM,
    CAPABILITY.AI_PROSPECTING,
    CAPABILITY.MARKETING_AUTOMATION,
    CAPABILITY.DEAL_ROOM,
    CAPABILITY.REALTIME_UPDATES,
    CAPABILITY.DEAL_ANALYTICS,
    // Brokers also get the premium-seller features for the listings they manage.
    CAPABILITY.FEATURED_PLACEMENT,
    CAPABILITY.AI_VALUATION,
    CAPABILITY.AI_LISTING_ENHANCEMENT,
    CAPABILITY.PERFORMANCE_ANALYTICS,
    CAPABILITY.LEAD_MANAGEMENT,
    CAPABILITY.OUTBOUND_CURATED_EMAILS,
  ],
}

// Free listing cap for sellers + brokers without a paid plan — a listing
// over this count requires upgrading to seller premium / broker pro.
export const FREE_LISTING_LIMIT = 3

// Threshold for showing the public "Deals Closed" page — until we hit this,
// the page is unlisted from nav + returns 404 (don't show empty social proof).
export const DEALS_CLOSED_PUBLIC_THRESHOLD = 100

// ───────────────────────────────────────────────────────────────────────────
// Capability helpers (server + client safe — no DB or process.env reads).
// ───────────────────────────────────────────────────────────────────────────
export interface UserPlans {
  /** Buyer-side plan ('FREE' | 'PREMIUM_BUYER' enum value from User.buyerPlanTier). */
  buyerPlanTier?: string | null
  /** Seller-side plan ('FREEMIUM' | 'PREMIUM' enum value from User.sellerPlanTier). */
  sellerPlanTier?: string | null
  /** Broker-side plan ('NONE' | 'BROKER_PRO' enum value from User.brokerPlanTier). */
  brokerPlanTier?: string | null
  /** Account-wide active-until date — null = no active paid plan. */
  planActiveUntil?: Date | null
}

/** Resolve the set of tiers a user currently holds. */
export function userTiers(u: UserPlans | null | undefined, now: Date = new Date()): TierId[] {
  if (!u) return ['BUYER_FREE']
  // A user can be a buyer + seller + broker simultaneously.
  const out: TierId[] = ['BUYER_FREE', 'SELLER_FREE']
  const planActive = u.planActiveUntil ? new Date(u.planActiveUntil) > now : false
  if (u.buyerPlanTier === 'PREMIUM_BUYER' && planActive) out.push('BUYER_PREMIUM')
  if (u.sellerPlanTier === 'PREMIUM' && planActive) out.push('SELLER_PREMIUM')
  if (u.brokerPlanTier === 'BROKER_PRO' && planActive) out.push('BROKER_PRO')
  return out
}

/** Does the user have a given capability via any of their tiers? */
export function hasCapability(
  u: UserPlans | null | undefined,
  cap: Capability,
  now: Date = new Date(),
): boolean {
  for (const t of userTiers(u, now)) {
    if (TIER_CAPABILITIES[t].includes(cap)) return true
  }
  return false
}

/**
 * Server-side guard: throws an Error with a structured upgrade reason
 * (`requiredTier`) if the user lacks the capability. Used by API routes.
 */
export function requireCapability(
  u: UserPlans | null | undefined,
  cap: Capability,
): { allowed: true } | { allowed: false; requiredTier: TierId } {
  if (hasCapability(u, cap)) return { allowed: true }
  // Map capability → first tier that unlocks it.
  const tierForCap = (Object.entries(TIER_CAPABILITIES) as [TierId, Capability[]][])
    .find(([, caps]) => caps.includes(cap))?.[0] ?? 'BUYER_PREMIUM'
  return { allowed: false, requiredTier: tierForCap }
}

/** Display-friendly tier name. */
export const TIER_LABEL: Record<TierId, string> = {
  BUYER_FREE: 'Buyer · Free',
  BUYER_PREMIUM: 'Buyer · Premium ($99/mo)',
  SELLER_FREE: 'Seller · Basic',
  SELLER_PREMIUM: 'Seller · Premium ($199/mo)',
  BROKER_PRO: 'Broker · Pro ($599/mo)',
}

// ───────────────────────────────────────────────────────────────────────────
// Legacy launch-promo helpers — kept for backwards compat with any page that
// imports them, but no longer used by the new pricing UI.
// ───────────────────────────────────────────────────────────────────────────
export const LAUNCH_END_ISO = '2026-09-09T23:59:59Z'
export const LAUNCH_DISCOUNT_PCT = 0
export function launchActive(_now: Date = new Date()): boolean { return false }
export function timeRemaining(now: Date = new Date()) {
  const ms = Math.max(0, new Date(LAUNCH_END_ISO).getTime() - now.getTime())
  return {
    days: Math.floor(ms / 86_400_000),
    hours: Math.floor((ms % 86_400_000) / 3_600_000),
    minutes: Math.floor((ms % 3_600_000) / 60_000),
    seconds: Math.floor((ms % 60_000) / 1000),
    total: ms,
  }
}
export const COMPETITORS: { name: string; featuredMonthly: number; note: string }[] = [
  { name: 'Leading marketplace — featured tier', featuredMonthly: 99.95, note: 'Higher search placement' },
  { name: 'Leading marketplace — top tier', featuredMonthly: 199.95, note: 'Top placement + buyer email blasts' },
  { name: 'Major industry marketplace', featuredMonthly: 59.95, note: 'Standard featured listing' },
  { name: 'International business-for-sale site', featuredMonthly: 79.0, note: 'Premium listing' },
]
export function lowestCompetitorMonthly(): number {
  return Math.min(...COMPETITORS.map((c) => c.featuredMonthly))
}

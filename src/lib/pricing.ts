/**
 * Pricing & launch-promo configuration — single source of truth.
 *
 * 90-day launch offer: Premium listings at 50% off, positioned below every major
 * competitor's featured tier. Change the numbers/date here and the pricing page,
 * banner, and comparison table all update.
 */

// Launch window. Today is 2026-06-11; promo runs 90 days.
export const LAUNCH_END_ISO = '2026-09-09T23:59:59Z'
export const LAUNCH_DISCOUNT_PCT = 50

// USD prices (pricing is USD-only). Launch = 50% off regular for the first 90 days.
export const PRICING = {
  // Seller plans
  freemium: { regular: 0, launch: 0 },
  premium: { regular: 78, launch: 39 }, // $39/mo launch (reg. $78)
  // Buyer plans
  starter: { regular: 998, launch: 499 }, // $499/mo launch (reg. $998)
  pro: { regular: 4998, launch: 2499 }, // $2,499/mo launch (reg. $4,998)
}

/**
 * Published competitor prices for an equivalent *featured* listing (monthly,
 * standard term). Used for the transparent "how we compare" table.
 * Sources are each competitor's public pricing / listing pages.
 */
export const COMPETITORS: { name: string; featuredMonthly: number; note: string }[] = [
  { name: 'BizBuySell — Showcase', featuredMonthly: 99.95, note: 'Higher search placement' },
  { name: 'BizBuySell — Diamond', featuredMonthly: 199.95, note: 'Top placement + BuyerBlast' },
  { name: 'BizQuest', featuredMonthly: 59.95, note: 'Standard featured listing' },
  { name: 'BusinessesForSale.com', featuredMonthly: 79.0, note: 'Premium listing' },
]

/** Lowest competitor featured price — the bar we beat by 50%. */
export function lowestCompetitorMonthly(): number {
  return Math.min(...COMPETITORS.map((c) => c.featuredMonthly))
}

export function launchActive(now: Date = new Date()): boolean {
  return now.getTime() < new Date(LAUNCH_END_ISO).getTime()
}

/** Days/hours/minutes/seconds remaining until the launch promo ends. */
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

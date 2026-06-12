/**
 * Lightweight, deterministic business valuation model used by the public
 * /valuation tool. Returns a low / mid / high range plus a written rationale,
 * based on industry multiples + ebitda + growth + recurring-revenue mix.
 *
 * This is intentionally a heuristic — not a regression-trained model. The goal
 * is a credible *range* that anchors the seller's expectation, captures their
 * email, and routes them into the quick-list flow.
 */

export interface ValuationInputs {
  industry: string             // one of QUICK_LIST_INDUSTRIES values
  country: string              // USA | Canada | UAE | KSA
  annualRevenueCents: bigint   // LTM revenue
  ebitdaCents: bigint          // LTM EBITDA (use 20% of revenue if user doesn't know)
  growthRatePct: number        // 0-100, recent yoy revenue growth
  recurringRevenuePct: number  // 0-100, % of revenue under contract / subscription
  customerConcentrationPct: number  // 0-100, % of revenue from top 3 customers (higher = riskier)
  yearsInOperation: number     // age of the business
}

export interface ValuationResult {
  /** Low, mid, high estimates in cents. */
  lowCents: bigint
  midCents: bigint
  highCents: bigint
  /** Effective multiple applied to EBITDA at the midpoint. */
  ebitdaMultiple: number
  /** Effective multiple applied to revenue at the midpoint. */
  revenueMultiple: number
  /** Plain-language rationale lines (markdown-safe). */
  rationale: string[]
}

// EBITDA multiples by industry — based on 2024-2025 SMB transaction averages.
// First number is base mid-market multiple; second is the spread (low/high band).
const EBITDA_MULTIPLE: Record<string, { base: number; spread: number }> = {
  SAAS:          { base: 6.5, spread: 2.5 },
  FINTECH:       { base: 6.0, spread: 2.5 },
  BIOTECH:       { base: 8.5, spread: 3.0 },
  HEALTHCARE:    { base: 5.5, spread: 1.5 },
  ECOMMERCE:     { base: 4.0, spread: 1.5 },
  CPG:           { base: 5.0, spread: 1.5 },
  MEDIA:         { base: 4.5, spread: 1.5 },
  SERVICES:      { base: 3.5, spread: 1.0 },
  MANUFACTURING: { base: 4.5, spread: 1.5 },
  LOGISTICS:     { base: 4.0, spread: 1.0 },
  RETAIL:        { base: 3.0, spread: 1.0 },
  HOSPITALITY:   { base: 3.0, spread: 1.0 },
  AUTOMOTIVE:    { base: 3.5, spread: 1.0 },
  AGRICULTURE:   { base: 4.0, spread: 1.5 },
  EDUCATION:     { base: 5.0, spread: 1.5 },
  ENERGY:        { base: 4.5, spread: 1.5 },
  REAL_ESTATE:   { base: 6.0, spread: 2.0 },
  TELECOM:       { base: 5.0, spread: 1.5 },
  OTHER:         { base: 4.0, spread: 1.5 },
}

// Country adjustment — buyers price in country-risk + market depth.
const COUNTRY_MULTIPLIER: Record<string, number> = {
  USA:    1.00,
  Canada: 0.95,
  UAE:    0.90,
  KSA:    0.85,
}

const MAX_MULTIPLE_CAP = 18  // hard cap so high-growth SaaS doesn't go silly

/** Run the valuation. Returns deterministic low/mid/high range + rationale. */
export function calculateValuation(input: ValuationInputs): ValuationResult {
  const revenue = Number(input.annualRevenueCents)
  const ebitdaRaw = Number(input.ebitdaCents)
  // If EBITDA is missing or absurd vs revenue, fall back to 20% of revenue.
  const ebitda = ebitdaRaw > 0 && ebitdaRaw < revenue ? ebitdaRaw : Math.round(revenue * 0.20)

  const base = EBITDA_MULTIPLE[input.industry] || EBITDA_MULTIPLE.OTHER
  let mid = base.base
  const rationale: string[] = []
  rationale.push(`Industry baseline EBITDA multiple for ${input.industry}: **${base.base}x** (low/high ±${base.spread}x).`)

  // Growth adjustment: each 10% over 20% growth adds +0.5x; each 10% under -20% subtracts -0.3x
  if (input.growthRatePct >= 20) {
    const bonus = ((input.growthRatePct - 20) / 10) * 0.5
    mid += bonus
    rationale.push(`Growth of ${input.growthRatePct}% YoY → +${bonus.toFixed(1)}x for above-baseline growth.`)
  } else if (input.growthRatePct < 0) {
    const penalty = (Math.abs(input.growthRatePct) / 10) * 0.3
    mid -= penalty
    rationale.push(`Declining revenue (${input.growthRatePct}% YoY) → −${penalty.toFixed(1)}x risk discount.`)
  } else {
    rationale.push(`Modest growth (${input.growthRatePct}% YoY) — no multiple adjustment.`)
  }

  // Recurring-revenue premium: each 25% of recurring adds +0.5x (capped at +2x)
  if (input.recurringRevenuePct >= 25) {
    const bonus = Math.min(2.0, (input.recurringRevenuePct / 25) * 0.5)
    mid += bonus
    rationale.push(`${input.recurringRevenuePct}% recurring / contracted revenue → +${bonus.toFixed(1)}x for predictability.`)
  }

  // Concentration penalty: top-3 customers >50% of revenue costs -1x; >70% costs -1.5x
  if (input.customerConcentrationPct >= 70) {
    mid -= 1.5
    rationale.push(`Customer concentration ${input.customerConcentrationPct}% (top 3) → −1.5x for concentration risk.`)
  } else if (input.customerConcentrationPct >= 50) {
    mid -= 1.0
    rationale.push(`Customer concentration ${input.customerConcentrationPct}% (top 3) → −1.0x for concentration risk.`)
  }

  // Tenure premium — long-operating businesses earn a small buyer-trust premium.
  if (input.yearsInOperation >= 15) {
    mid += 0.3
    rationale.push(`${input.yearsInOperation} years in operation → +0.3x for tenure / brand stability.`)
  } else if (input.yearsInOperation <= 2) {
    mid -= 0.5
    rationale.push(`Only ${input.yearsInOperation} years in operation → −0.5x for early-stage risk.`)
  }

  // Country multiplier
  const ctyMult = COUNTRY_MULTIPLIER[input.country] ?? 0.85
  if (ctyMult !== 1) {
    mid *= ctyMult
    rationale.push(`Country adjustment for **${input.country}**: ${(ctyMult * 100).toFixed(0)}% of US-equivalent.`)
  }

  // Clamp to sensible range
  mid = Math.max(1.5, Math.min(MAX_MULTIPLE_CAP, mid))

  const low = Math.max(1.0, mid - base.spread)
  const high = Math.min(MAX_MULTIPLE_CAP, mid + base.spread)

  const lowCents = BigInt(Math.round(ebitda * low))
  const midCents = BigInt(Math.round(ebitda * mid))
  const highCents = BigInt(Math.round(ebitda * high))

  return {
    lowCents,
    midCents,
    highCents,
    ebitdaMultiple: Number(mid.toFixed(2)),
    revenueMultiple: revenue > 0 ? Number((Number(midCents) / revenue).toFixed(2)) : 0,
    rationale,
  }
}

/** Pretty-format cents to a $-string. */
export function formatUsd(cents: bigint): string {
  const dollars = Number(cents) / 100
  if (dollars >= 1_000_000) return `$${(dollars / 1_000_000).toFixed(2)}M`
  if (dollars >= 1_000) return `$${(dollars / 1_000).toFixed(0)}K`
  return `$${dollars.toFixed(0)}`
}

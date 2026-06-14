/**
 * Forward M&A Predictions — v1 close-probability model.
 *
 * What it does:
 *   Given a deal, returns a 0-100 score for how likely the deal closes
 *   in the next 6 months, plus the three strongest driver signals
 *   that produced the score.
 *
 * What it is:
 *   A deterministic, explainable weighted-sum model over fields we
 *   already have on every Deal: dealQualityScore, heatIndex, days on
 *   market, financing eligibility, seller verification, and growth.
 *   Each signal is on a 0-1 normalized scale; the final score is a
 *   weighted average × 100.
 *
 * What it is NOT (yet):
 *   A trained model. v2 plugs in historical close outcomes for ML.
 *   Until then, this serves as a defensible "explainable v1" that the
 *   product can launch with — every score has visible drivers; nothing
 *   is magic.
 *
 * Why this matters:
 *   Close-probability scoring is the proprietary intelligence layer
 *   that justifies Buyer Premium ($99/mo). Free buyers see deals; paid
 *   buyers see which ones will actually close — and act first.
 */

export interface PredictionInput {
  dealQualityScore?: number   // 0-100, our editorial quality score
  heatIndex?: number          // 0-100, real-time buyer demand
  daysOnMarket?: number       // age in days
  financingEligible?: boolean // SBA/BDC/etc eligible
  sellerVerified?: boolean    // KYC complete
  growthRate?: number         // YoY revenue growth, %
}

export interface DriverSignal {
  key: 'quality' | 'demand' | 'freshness' | 'financing' | 'verification' | 'growth'
  label: string
  detail: string              // human sentence shown in the UI
  weight: number              // 0-1, share of the final score
  contribution: number        // 0-1, this signal's normalized value × its weight
}

export interface Prediction {
  score: number               // 0-100 close probability
  band: 'low' | 'medium' | 'high' | 'very-high'
  closeWindowMonths: { min: number; max: number }
  drivers: DriverSignal[]     // sorted by contribution desc, top 3
  rationale: string           // 1-sentence summary
}

const WEIGHTS = {
  quality:      0.30,   // proprietary editorial score
  demand:       0.25,   // current buyer heat
  freshness:    0.15,   // not stale on market
  financing:    0.12,   // financing easier = closes faster
  verification: 0.10,   // verified sellers move
  growth:       0.08,   // growing businesses attract more bidders
}

const clamp01 = (n: number) => Math.max(0, Math.min(1, n))

// Map days-on-market into a 0-1 freshness signal. New listings (<14d)
// peak at 1.0; signal decays smoothly and bottoms at 0.15 after 365d.
function freshnessFromDays(days: number): number {
  if (days <= 14) return 1
  if (days >= 365) return 0.15
  const decay = (days - 14) / (365 - 14)
  return Math.max(0.15, 1 - decay * 0.85)
}

// YoY growth into a 0-1 growth signal. -10% or worse = 0;
// 0% = 0.4 (a stable business still closes); 30%+ = 1.0.
function growthSignal(growthPct: number): number {
  if (growthPct <= -10) return 0
  if (growthPct >= 30) return 1
  // piecewise linear: -10 → 0, 0 → 0.4, 30 → 1
  if (growthPct < 0)  return ((growthPct + 10) / 10) * 0.4
  return 0.4 + (growthPct / 30) * 0.6
}

export function predictCloseProbability(input: PredictionInput): Prediction {
  const sQuality      = clamp01((input.dealQualityScore ?? 50) / 100)
  const sDemand       = clamp01((input.heatIndex          ?? 50) / 100)
  const sFreshness    = freshnessFromDays(input.daysOnMarket ?? 60)
  const sFinancing    = input.financingEligible ? 1 : 0.4
  const sVerification = input.sellerVerified    ? 1 : 0.3
  const sGrowth       = growthSignal(input.growthRate ?? 0)

  const drivers: DriverSignal[] = [
    {
      key: 'quality', label: 'Deal Quality',
      detail: sQuality >= 0.75
        ? 'Top-quartile editorial quality score across financials, narrative, and disclosures.'
        : sQuality >= 0.5
          ? 'Solid editorial quality — financials and disclosures are well-documented.'
          : 'Quality gaps in disclosure may slow diligence.',
      weight: WEIGHTS.quality, contribution: sQuality * WEIGHTS.quality,
    },
    {
      key: 'demand', label: 'Buyer Demand',
      detail: sDemand >= 0.75
        ? 'Strong active buyer interest right now — competing offers likely.'
        : sDemand >= 0.5
          ? 'Healthy buyer interest in this sector & region.'
          : 'Buyer interest is currently soft for this profile.',
      weight: WEIGHTS.demand, contribution: sDemand * WEIGHTS.demand,
    },
    {
      key: 'freshness', label: 'Time on Market',
      detail: sFreshness >= 0.8
        ? 'New listing — momentum window is open.'
        : sFreshness >= 0.5
          ? 'Still within the typical engagement window.'
          : 'Listing is aging — sellers may be more flexible on terms.',
      weight: WEIGHTS.freshness, contribution: sFreshness * WEIGHTS.freshness,
    },
    {
      key: 'financing', label: 'Financing Path',
      detail: sFinancing === 1
        ? 'SBA / regional lender eligible — buyer pool is wider.'
        : 'No pre-qualified financing path — buyer needs cash or independent debt.',
      weight: WEIGHTS.financing, contribution: sFinancing * WEIGHTS.financing,
    },
    {
      key: 'verification', label: 'Seller Verification',
      detail: sVerification === 1
        ? 'Seller KYC complete — diligence can start on day one.'
        : 'Seller verification pending — adds days at the front of diligence.',
      weight: WEIGHTS.verification, contribution: sVerification * WEIGHTS.verification,
    },
    {
      key: 'growth', label: 'Business Momentum',
      detail: sGrowth >= 0.8
        ? 'Strong revenue growth — premium multiples and faster close.'
        : sGrowth >= 0.4
          ? 'Stable revenue — predictable close trajectory.'
          : 'Declining revenue — close is possible but requires repricing.',
      weight: WEIGHTS.growth, contribution: sGrowth * WEIGHTS.growth,
    },
  ]

  const score01 = drivers.reduce((s, d) => s + d.contribution, 0)
  const score = Math.round(score01 * 100)

  const band: Prediction['band'] =
    score >= 80 ? 'very-high' :
    score >= 65 ? 'high'      :
    score >= 45 ? 'medium'    : 'low'

  // Close window narrows as score rises.
  const closeWindowMonths =
    band === 'very-high' ? { min: 1, max: 3 } :
    band === 'high'      ? { min: 2, max: 5 } :
    band === 'medium'    ? { min: 4, max: 9 } :
                            { min: 8, max: 18 }

  const top = [...drivers].sort((a, b) => b.contribution - a.contribution).slice(0, 3)

  const rationale =
    band === 'very-high' ? `Top-decile close signal. Driven by ${top[0].label.toLowerCase()} and ${top[1].label.toLowerCase()}.` :
    band === 'high'      ? `Above-market close signal. ${top[0].label} is the strongest factor.` :
    band === 'medium'    ? `Mixed signal. Best lever: ${top[0].label.toLowerCase()}.` :
                            `Weak close signal. ${top[0].label} is the main drag.`

  return { score, band, closeWindowMonths, drivers: top, rationale }
}

export const BAND_COPY: Record<Prediction['band'], { label: string; color: string }> = {
  'very-high': { label: 'Very high close probability', color: '#1B7F4E' },
  'high':      { label: 'High close probability',      color: '#2E8B57' },
  'medium':    { label: 'Medium close probability',    color: '#8C6D45' },
  'low':       { label: 'Low close probability',       color: '#9CA3AF' },
}

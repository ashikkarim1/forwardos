/**
 * Editorial narrative generator for the Luxury-Presence-style listing layout.
 *
 * Produces a 3-4 sentence "AI writeup" from a deal's structured metrics —
 * deterministic (same deal → same prose) so it's SSR/ISR-safe and free.
 * When a real LLM pipeline is wired later, swap generateNarrative() for an
 * API call and keep this as the zero-cost fallback.
 */

export interface NarrativeDeal {
  title: string
  category: string          // industry enum, e.g. SAAS
  location: string
  country: string
  askingPrice: number       // dollars
  annualRevenue: number     // dollars
  ebitda: number            // dollars
  profitMarginPercent: number
  heatIndex: number
  dealQualityScore: number
  growthRate: number
  employeeCount: number
  daysOnMarket: number
  marketPosition: 'underpriced' | 'fair' | 'premium'
  sellerMotivation: string
  financingEligible?: boolean
  isConfidential?: boolean
}

const INDUSTRY_PHRASE: Record<string, string> = {
  SAAS: 'software business',
  FINTECH: 'financial technology company',
  HEALTHCARE: 'healthcare operation',
  HOSPITALITY: 'hospitality group',
  LOGISTICS: 'logistics operation',
  RETAIL: 'retail business',
  ECOMMERCE: 'e-commerce brand',
  SERVICES: 'services firm',
  MANUFACTURING: 'manufacturing business',
  EDUCATION: 'education business',
  ENERGY: 'energy services company',
  REAL_ESTATE: 'real-estate operation',
  AUTOMOTIVE: 'automotive business',
  AGRICULTURE: 'agriculture business',
  BIOTECH: 'life-sciences company',
  CPG: 'consumer-goods brand',
  MEDIA: 'media business',
  TELECOM: 'telecom operator',
  OTHER: 'established business',
}

const fmtMoney = (n: number) =>
  n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(1)}M` : n >= 1_000 ? `$${Math.round(n / 1_000)}K` : `$${Math.round(n)}`

const INDUSTRY_LABEL: Record<string, string> = {
  SAAS: 'SaaS', FINTECH: 'FinTech', ECOMMERCE: 'E-Commerce', EDTECH: 'EdTech',
  REAL_ESTATE: 'Real Estate', CPG: 'Consumer Goods',
}
export function industryLabel(industry: string): string {
  if (INDUSTRY_LABEL[industry]) return INDUSTRY_LABEL[industry]
  return industry.split('_').map((w) => w[0] + w.slice(1).toLowerCase()).join(' ')
}

/**
 * Privacy-safe display headline. The REAL listing title must never be sent
 * to or rendered for unverified visitors — CSS blurring leaks the name via
 * the DOM. This generates a generic-but-distinct headline from non-
 * identifying fields only (industry + country + an id-derived ref code).
 */
export function maskedHeadline(d: Pick<NarrativeDeal, 'category' | 'country'> & { id: string }): string {
  const ref = d.id.replace(/[^a-z0-9]/gi, '').slice(-4).toUpperCase()
  return `A Confidential ${industryLabel(d.category)} Company · Ref ${ref}`
}

/** One-line eyebrow label, e.g. "SAAS · TORONTO, CANADA" */
export function narrativeEyebrow(d: NarrativeDeal): string {
  const ind = d.category.replace(/_/g, ' ')
  return `${ind} · ${d.location}${d.location.includes(d.country) ? '' : `, ${d.country}`}`.toUpperCase()
}

/** 3-4 sentence editorial writeup. */
export function generateNarrative(d: NarrativeDeal): string {
  const phrase = INDUSTRY_PHRASE[d.category] || INDUSTRY_PHRASE.OTHER
  const s: string[] = []

  // Sentence 1 — who/where/scale
  const sizeClause =
    d.annualRevenue >= 1_000_000
      ? `generating ${fmtMoney(d.annualRevenue)} in annual revenue`
      : `with ${fmtMoney(d.annualRevenue)} in annual revenue`
  const teamClause = d.employeeCount > 0 ? ` and a team of ${d.employeeCount}` : ''
  s.push(`A ${d.marketPosition === 'underpriced' ? 'compellingly priced' : d.marketPosition === 'premium' ? 'premium' : 'well-positioned'} ${phrase} based in ${d.location}, ${sizeClause}${teamClause}.`)

  // Sentence 2 — profitability
  if (d.ebitda > 0) {
    const marginNote = d.profitMarginPercent >= 25 ? 'healthy' : d.profitMarginPercent >= 15 ? 'solid' : 'developing'
    s.push(`The business produces ${fmtMoney(d.ebitda)} in EBITDA at a ${marginNote} ${d.profitMarginPercent}% margin${d.growthRate >= 40 ? `, with momentum — recent growth signals track at ${d.growthRate}%` : ''}.`)
  }

  // Sentence 3 — market intelligence angle (the Forward moat)
  if (d.heatIndex >= 85) {
    s.push(`Forward Intelligence rates this one of the most-watched listings on the platform right now (heat ${d.heatIndex}/100), and buyer interest typically peaks in the first ${Math.max(14, d.daysOnMarket + 7)} days.`)
  } else if (d.dealQualityScore >= 80) {
    s.push(`Our deal-quality model scores it ${d.dealQualityScore}/100 — above the platform median — on financial consistency and transferability.`)
  } else {
    s.push(`Listed ${d.daysOnMarket} days ago; our models flag it as a candidate for buyers seeking ${d.marketPosition === 'underpriced' ? 'value entries' : 'stable cash flow'} in the sector.`)
  }

  // Sentence 4 — financing hook, when available
  if (d.financingEligible) {
    s.push(`Acquisition financing is pre-qualified for this listing.`)
  }

  return s.join(' ')
}

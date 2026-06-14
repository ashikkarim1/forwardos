/**
 * Market signals — real, computed-from-DB intelligence for each role's
 * dashboard. Replaces the hardcoded "Healthcare Sector Heat Spike +34%"
 * mock strings that previously misled paying customers.
 *
 * Each signal returns the shape the existing DailyIntelligenceDashboard
 * widget expects, so this is a drop-in replacement once the dashboard
 * fetches it client-side via /api/dashboard/signals?role=X.
 *
 * The signals are:
 *   - hot:   sector demand is concentrating (high median heat + new listings)
 *   - trend: sector activity steady (medium heat, listing flow)
 *   - cold:  sector demand softening (low heat + few new listings)
 *   - alert: actionable: something the user should look at now
 *
 * Computed each request — no caching yet. Fine until we cross ~1000
 * active listings; then we should snapshot daily.
 */
import { prisma } from '@/lib/prisma'

export interface MarketSignal {
  id: string
  title: string
  description: string
  type: 'hot' | 'cold' | 'trend' | 'alert'
  metric: string
  change: number
  industry?: string
  insight: string
  action?: string
  actionHref?: string
}

const INDUSTRY_LABEL: Record<string, string> = {
  SAAS: 'SaaS', HEALTHCARE: 'Healthcare', ECOMMERCE: 'E-commerce',
  FINTECH: 'FinTech', MANUFACTURING: 'Manufacturing',
  PROFESSIONAL_SERVICES: 'Professional Services', HOSPITALITY: 'Hospitality',
  EDUCATION: 'Education', LOGISTICS: 'Logistics', RETAIL: 'Retail',
  REAL_ESTATE: 'Real Estate', FINANCE: 'Finance', AGRICULTURE: 'Agriculture',
  MARKETING: 'Marketing', OTHER: 'Other',
}

const ind = (key: string) => INDUSTRY_LABEL[key] ?? key

interface SectorAgg {
  industry: string
  count: number              // active listings in sector
  newCount: number           // published in last 7 days
  medianHeat: number
  medianAskCents: number
}

async function aggregateSectors(): Promise<SectorAgg[]> {
  const deals = await prisma.deal.findMany({
    where: { status: { in: ['PUBLISHED', 'ACTIVE'] } },
    select: { industry: true, heatScore: true, askingPrice: true, createdAt: true },
  }).catch(() => [])

  const sevenDaysAgo = Date.now() - 7 * 86_400_000
  const bySector = new Map<string, { heats: number[]; asks: number[]; total: number; newRecent: number }>()
  for (const d of deals) {
    const key = String(d.industry)
    if (!bySector.has(key)) bySector.set(key, { heats: [], asks: [], total: 0, newRecent: 0 })
    const b = bySector.get(key)!
    b.total++
    if (d.heatScore != null) b.heats.push(d.heatScore)
    if (d.askingPrice) b.asks.push(Number(d.askingPrice))
    if (d.createdAt.getTime() >= sevenDaysAgo) b.newRecent++
  }

  const sectors: SectorAgg[] = []
  for (const [industry, b] of bySector.entries()) {
    sectors.push({
      industry,
      count: b.total,
      newCount: b.newRecent,
      medianHeat: median(b.heats),
      medianAskCents: median(b.asks),
    })
  }
  return sectors
}

function median(xs: number[]): number {
  if (xs.length === 0) return 0
  const sorted = [...xs].sort((a, b) => a - b)
  return sorted[Math.floor(sorted.length / 2)]
}

function fmtMillions(cents: number): string {
  if (!cents) return '—'
  const m = cents / 100 / 1_000_000
  return m >= 10 ? `$${m.toFixed(0)}M` : `$${m.toFixed(1)}M`
}

/** BUYER signals — what should I act on today? */
export async function buyerSignals(): Promise<MarketSignal[]> {
  const sectors = await aggregateSectors()
  const signals: MarketSignal[] = []

  // 1) Hottest sector with new flow → 'hot'
  const hot = sectors
    .filter((s) => s.count >= 1 && s.newCount >= 1)
    .sort((a, b) => (b.medianHeat * 1.5 + b.newCount * 4) - (a.medianHeat * 1.5 + a.newCount * 4))[0]
  if (hot) {
    signals.push({
      id: 'buyer-hot',
      title: `${ind(hot.industry)} sector heat`,
      description: `${hot.newCount} new ${hot.newCount === 1 ? 'listing' : 'listings'} in the past 7 days. Median heat ${hot.medianHeat}.`,
      type: 'hot',
      metric: `heat ${hot.medianHeat}`,
      change: hot.newCount,
      industry: ind(hot.industry),
      insight: `${ind(hot.industry)} is concentrating buyer demand right now. Median asking price is ${fmtMillions(hot.medianAskCents)}.`,
      action: `View ${ind(hot.industry)} deals`,
      actionHref: `/deals?industry=${hot.industry}`,
    })
  }

  // 2) Stable-multiple sector → 'trend'
  const trend = sectors
    .filter((s) => s.count >= 2 && s.medianHeat >= 50 && s.medianHeat < 80)
    .sort((a, b) => b.count - a.count)[0]
  if (trend) {
    signals.push({
      id: 'buyer-trend',
      title: `${ind(trend.industry)} activity steady`,
      description: `${trend.count} active listings. Median heat ${trend.medianHeat}.`,
      type: 'trend',
      metric: `${trend.count}`,
      change: 0,
      industry: ind(trend.industry),
      insight: `${ind(trend.industry)} has a consistent flow of listings. Good entry window if you have flexible criteria.`,
      action: `Compare ${ind(trend.industry)} valuations`,
      actionHref: `/deals/comparables`,
    })
  }

  // 3) Cool sector — buyer-flex window → 'cold'
  const cold = sectors
    .filter((s) => s.count >= 1 && s.medianHeat > 0 && s.medianHeat < 50)
    .sort((a, b) => a.medianHeat - b.medianHeat)[0]
  if (cold) {
    signals.push({
      id: 'buyer-cold',
      title: `${ind(cold.industry)}: low competition`,
      description: `${cold.count} active ${cold.count === 1 ? 'listing' : 'listings'}. Median heat ${cold.medianHeat}.`,
      type: 'cold',
      metric: `heat ${cold.medianHeat}`,
      change: -1,
      industry: ind(cold.industry),
      insight: `${ind(cold.industry)} has lower current demand. Sellers tend to be more flexible on terms.`,
      action: `Explore ${ind(cold.industry)} deals`,
      actionHref: `/deals?industry=${cold.industry}`,
    })
  }

  return signals
}

/** SELLER signals — how is my market behaving? */
export async function sellerSignals(userId: string): Promise<MarketSignal[]> {
  const myDeals = await prisma.deal.findMany({
    where: { sellerId: userId, status: { in: ['PUBLISHED', 'ACTIVE'] } },
    select: { industry: true, country: true, heatScore: true, askingPrice: true },
  }).catch(() => [])
  const mySectors = new Set(myDeals.map((d) => String(d.industry)))

  const all = await aggregateSectors()
  const signals: MarketSignal[] = []

  // 1) Heat in my sector(s)
  const mySectorAgg = all.find((s) => mySectors.has(s.industry))
  if (mySectorAgg) {
    signals.push({
      id: 'seller-mysector',
      title: `Buyer interest: ${ind(mySectorAgg.industry)}`,
      description: `Your sector has ${mySectorAgg.count} active listings. Median heat ${mySectorAgg.medianHeat}.`,
      type: mySectorAgg.medianHeat >= 70 ? 'hot' : 'trend',
      metric: `heat ${mySectorAgg.medianHeat}`,
      change: mySectorAgg.newCount,
      industry: ind(mySectorAgg.industry),
      insight: mySectorAgg.medianHeat >= 70
        ? 'High buyer interest in your sector — consider keeping price firm.'
        : 'Demand is steady. Highlight differentiators in your description.',
      action: 'Compare your listing',
      actionHref: '/deals/comparables',
    })
  }

  // 2) Hottest sector overall — informational
  const hot = all.sort((a, b) => b.medianHeat - a.medianHeat)[0]
  if (hot && !mySectors.has(hot.industry)) {
    signals.push({
      id: 'seller-market-hot',
      title: `Hottest sector: ${ind(hot.industry)}`,
      description: `Forward-wide heat leader with ${hot.count} active listings.`,
      type: 'trend',
      metric: `heat ${hot.medianHeat}`,
      change: hot.newCount,
      industry: ind(hot.industry),
      insight: 'Buyer attention is concentrating here this week. Adjacent sectors often benefit by spillover.',
      action: 'See the heat map',
      actionHref: '/deals/heat-maps',
    })
  }

  return signals
}

/** BROKER signals — pipeline health + market context. */
export async function brokerSignals(userId: string): Promise<MarketSignal[]> {
  // Annotate the empty-array fallback so TS keeps the row shape across
  // the .catch — otherwise downstream .createdAt access types as never.
  type EnquiryRow = { id: string; status: string; createdAt: Date; dealId: string }
  type DealRow    = { id: string; industry: string; heatScore: number | null }
  const [enquiries, myDeals] = await Promise.all([
    prisma.enquiry.findMany({
      where: { deal: { sellerId: userId } },
      select: { id: true, status: true, createdAt: true, dealId: true },
    }).catch(() => [] as EnquiryRow[]),
    prisma.deal.findMany({
      where: { sellerId: userId, status: { in: ['PUBLISHED', 'ACTIVE'] } },
      select: { id: true, industry: true, heatScore: true },
    }).catch(() => [] as DealRow[]),
  ]) as [EnquiryRow[], DealRow[]]

  const signals: MarketSignal[] = []
  const sevenDaysAgo = Date.now() - 7 * 86_400_000
  const recentNew = enquiries.filter((e) => e.createdAt.getTime() >= sevenDaysAgo).length
  const pending = enquiries.filter((e) => e.status === 'pending').length

  // 1) Pipeline pulse
  if (enquiries.length > 0) {
    signals.push({
      id: 'broker-pipeline',
      title: 'Pipeline pulse',
      description: `${enquiries.length} all-time inquiries · ${pending} awaiting your response.`,
      type: pending > 0 ? 'alert' : 'trend',
      metric: `${pending}`,
      change: recentNew,
      insight: pending > 0
        ? `${pending} buyer ${pending === 1 ? 'is' : 'are'} waiting. Median response time matters — top brokers reply in <4h.`
        : 'Your pipeline is current. Watch for new inquiries throughout the day.',
      action: 'Open pipeline',
      actionHref: '/dashboard/broker/pipeline',
    })
  }

  // 2) Heat in my portfolio's sectors
  const mySectors = new Set(myDeals.map((d) => String(d.industry)))
  const all = await aggregateSectors()
  const myHot = all
    .filter((s) => mySectors.has(s.industry))
    .sort((a, b) => b.medianHeat - a.medianHeat)[0]
  if (myHot) {
    signals.push({
      id: 'broker-portfolio-heat',
      title: `Portfolio heat: ${ind(myHot.industry)}`,
      description: `${myHot.count} active listings Forward-wide. Median heat ${myHot.medianHeat}.`,
      type: myHot.medianHeat >= 70 ? 'hot' : 'trend',
      metric: `heat ${myHot.medianHeat}`,
      change: myHot.newCount,
      industry: ind(myHot.industry),
      insight: myHot.medianHeat >= 70
        ? 'Strong buyer interest in your portfolio sector. Reach out to your warm list.'
        : 'Steady demand in your portfolio sector. Keep listings fresh.',
      action: 'See the heat map',
      actionHref: '/deals/heat-maps',
    })
  }

  return signals
}

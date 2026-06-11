/**
 * Saved-search matching.
 *
 * Translates a saved search's stored filter JSON into a Prisma `where` clause and
 * returns deals ranked by ForwardOS intelligence signals (heat score + predicted
 * close probability) — so alert emails lead with the best matches, not a raw list.
 * This is the edge over BizBuySell's plain chronological alerts.
 */
import { prisma } from '@/lib/prisma'

export interface SavedSearchFilters {
  industries?: string[] // IndustryType values
  country?: string
  minPrice?: number // USD cents
  maxPrice?: number // USD cents
  minRevenue?: number // USD cents
  maxRevenue?: number // USD cents
  minHeatScore?: number
  isFranchise?: boolean
  financingEligible?: boolean
}

export function buildDealWhere(filters: SavedSearchFilters): Record<string, unknown> {
  const where: Record<string, unknown> = { status: { in: ['ACTIVE', 'PUBLISHED'] } }

  if (filters.industries?.length) where.industry = { in: filters.industries }
  if (filters.country) where.country = filters.country
  if (filters.isFranchise != null) where.isFranchise = filters.isFranchise
  if (filters.financingEligible != null) where.financingEligible = filters.financingEligible
  if (filters.minHeatScore != null) where.heatScore = { gte: filters.minHeatScore }

  if (filters.minPrice != null || filters.maxPrice != null) {
    where.askingPrice = {
      ...(filters.minPrice != null ? { gte: BigInt(filters.minPrice) } : {}),
      ...(filters.maxPrice != null ? { lte: BigInt(filters.maxPrice) } : {}),
    }
  }
  if (filters.minRevenue != null || filters.maxRevenue != null) {
    where.revenue = {
      ...(filters.minRevenue != null ? { gte: BigInt(filters.minRevenue) } : {}),
      ...(filters.maxRevenue != null ? { lte: BigInt(filters.maxRevenue) } : {}),
    }
  }

  return where
}

/** Run a saved search and return AI-ranked matching deals. */
export async function matchDeals(filters: SavedSearchFilters, opts?: { since?: Date; take?: number }) {
  const where = buildDealWhere(filters)
  if (opts?.since) {
    where.publishedAt = { gt: opts.since }
  }

  const deals = await prisma.deal.findMany({
    where,
    orderBy: [{ heatScore: 'desc' }, { predictedCloseProb: 'desc' }, { publishedAt: 'desc' }],
    take: opts?.take ?? 50,
    select: {
      id: true, title: true, slug: true, industry: true, country: true, city: true,
      askingPrice: true, revenue: true, heatScore: true, predictedCloseProb: true,
      dealQualityScore: true, financingEligible: true, publishedAt: true,
    },
  })

  // BigInt → number for JSON
  return deals.map((d) => ({
    ...d,
    askingPrice: d.askingPrice != null ? Number(d.askingPrice) : null,
    revenue: d.revenue != null ? Number(d.revenue) : null,
  }))
}

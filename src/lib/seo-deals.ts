/**
 * Server-side deal queries for the SEO landing pages. Returns lightweight,
 * SSR-friendly records (real text + links) that search engines can crawl.
 */
import { prisma } from '@/lib/prisma'

export interface SeoDeal {
  id: string
  title: string
  city: string | null
  country: string
  industry: string
  askingPriceUsd: number | null
  heatScore: number | null
  financingEligible: boolean
}

function serialize(d: {
  id: string; title: string; city: string | null; country: string; industry: string
  askingPrice: bigint | null; heatScore: number | null; financingEligible: boolean
}): SeoDeal {
  return {
    id: d.id, title: d.title, city: d.city, country: d.country, industry: d.industry,
    askingPriceUsd: d.askingPrice != null ? Number(d.askingPrice) / 100 : null,
    heatScore: d.heatScore, financingEligible: d.financingEligible,
  }
}

const SELECT = { id: true, title: true, city: true, country: true, industry: true, askingPrice: true, heatScore: true, financingEligible: true } as const

export async function dealsByLocation(opts: { country?: string; city?: string; take?: number }): Promise<SeoDeal[]> {
  try {
    const where: Record<string, unknown> = { status: { in: ['ACTIVE', 'PUBLISHED'] } }
    if (opts.city) where.city = opts.city
    else if (opts.country) where.country = opts.country
    const rows = await prisma.deal.findMany({ where, orderBy: { heatScore: 'desc' }, take: opts.take ?? 24, select: SELECT })
    return rows.map(serialize)
  } catch {
    return []
  }
}

export async function franchiseDeals(take = 24): Promise<SeoDeal[]> {
  try {
    const rows = await prisma.deal.findMany({
      where: { status: { in: ['ACTIVE', 'PUBLISHED'] }, isFranchise: true },
      orderBy: { heatScore: 'desc' }, take, select: SELECT,
    })
    return rows.map(serialize)
  } catch {
    return []
  }
}

export async function dealCountByLocation(country?: string, city?: string): Promise<number> {
  try {
    const where: Record<string, unknown> = { status: { in: ['ACTIVE', 'PUBLISHED'] } }
    if (city) where.city = city
    else if (country) where.country = country
    return await prisma.deal.count({ where })
  } catch {
    return 0
  }
}

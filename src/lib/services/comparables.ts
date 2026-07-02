/**
 * Live comparables, computed from the platform's own active listings.
 *
 * Every result carries `sampleSize` and a `confidence` tier — surfaces are
 * REQUIRED to disclose both. A median from 4 listings is directional, not
 * market truth, and saying so is what makes bankers trust the number.
 */
import { prisma } from '@/lib/prisma'

export interface Percentiles {
  p25: number
  median: number
  p75: number
}

export type CompConfidence = 'strong' | 'moderate' | 'directional'

export interface ComparablesResult {
  sampleSize: number
  confidence: CompConfidence
  /** Human-readable base disclosure, e.g. "Based on 12 active Technology listings in USA" */
  basis: string
  askingPriceUsd: Percentiles | null
  ebitdaMultiple: Percentiles | null
  revenueUsd: Percentiles | null
  /** True when the revenue band filter was applied (±50% of subject revenue) */
  revenueBandApplied: boolean
}

const pct = (sorted: number[], p: number): number =>
  sorted[Math.min(sorted.length - 1, Math.floor((p / 100) * (sorted.length - 1)))]

const percentiles = (values: number[]): Percentiles | null => {
  const clean = values.filter((v) => Number.isFinite(v) && v > 0).sort((a, b) => a - b)
  if (clean.length === 0) return null
  return { p25: pct(clean, 25), median: pct(clean, 50), p75: pct(clean, 75) }
}

export function confidenceForSample(n: number): CompConfidence {
  if (n >= 20) return 'strong'
  if (n >= 8) return 'moderate'
  return 'directional'
}

export const CONFIDENCE_LABEL: Record<CompConfidence, string> = {
  strong: 'Strong sample',
  moderate: 'Moderate sample',
  directional: 'Directional — small sample',
}

/**
 * Comps for an industry × country, optionally narrowed to a ±50% revenue band
 * around the subject business. Falls back to the unbanded set when the band
 * leaves fewer than 4 comps — a wider honest sample beats a narrower noisy one.
 */
export async function getComparables(opts: {
  industry: string
  country: string
  revenueUsd?: number | null
  excludeDealId?: string
}): Promise<ComparablesResult> {
  const baseWhere = {
    status: { in: ['ACTIVE', 'PUBLISHED'] as any },
    industry: opts.industry as any,
    country: opts.country,
    ...(opts.excludeDealId ? { id: { not: opts.excludeDealId } } : {}),
  }

  const fetchSet = (banded: boolean) =>
    prisma.deal.findMany({
      where: {
        ...baseWhere,
        ...(banded && opts.revenueUsd
          ? {
              revenue: {
                gte: BigInt(Math.round(opts.revenueUsd * 100 * 0.5)),
                lte: BigInt(Math.round(opts.revenueUsd * 100 * 1.5)),
              },
            }
          : {}),
      },
      select: { askingPrice: true, pricingMultiple: true, revenue: true },
      take: 500,
    })

  let revenueBandApplied = Boolean(opts.revenueUsd)
  let rows = await fetchSet(revenueBandApplied)
  if (revenueBandApplied && rows.length < 4) {
    rows = await fetchSet(false)
    revenueBandApplied = false
  }

  const toUsd = (v: bigint | null) => (v == null ? NaN : Number(v) / 100)
  const sampleSize = rows.length

  return {
    sampleSize,
    confidence: confidenceForSample(sampleSize),
    basis: `Based on ${sampleSize} active listing${sampleSize === 1 ? '' : 's'} in this industry and country${revenueBandApplied ? ', within ±50% of this revenue' : ''}`,
    askingPriceUsd: percentiles(rows.map((r) => toUsd(r.askingPrice))),
    ebitdaMultiple: percentiles(rows.map((r) => r.pricingMultiple ?? NaN)),
    revenueUsd: percentiles(rows.map((r) => toUsd(r.revenue))),
    revenueBandApplied,
  }
}

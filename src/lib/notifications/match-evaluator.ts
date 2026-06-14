/**
 * Match evaluator — runs on Deal publish to buffer matches into
 * PendingAlert. Idempotent: re-running for the same (user, deal,
 * search) tuple does nothing (unique index protects us).
 *
 * The evaluator is intentionally NOT responsible for deciding *when*
 * to send. The send-window cron owns that, reading pendingAlerts and
 * enforcing tier + preferences + quiet hours + daily cap. This split
 * is what makes the system retry-safe and rate-limit-safe.
 */
import { prisma } from '@/lib/prisma'
import { buildDealWhere } from '@/lib/services/saved-search-service'

interface EvaluateOptions {
  /**
   * Hard cap on the number of saved searches we look at per evaluation
   * to keep the job bounded under listing storms. Tune as you scale.
   */
  maxSavedSearches?: number
}

interface EvaluateResult {
  dealId: string
  alertsBuffered: number
  searchesChecked: number
}

/**
 * Evaluate a single freshly-published deal against every alert-enabled
 * saved search. For each match, write a PendingAlert row (unless one
 * already exists for this user × deal × search × category).
 */
export async function evaluateNewListing(dealId: string, opts: EvaluateOptions = {}): Promise<EvaluateResult> {
  const max = opts.maxSavedSearches ?? 5000

  const deal = await prisma.deal.findUnique({
    where: { id: dealId },
    select: { id: true, industry: true, country: true, status: true, askingPrice: true, revenue: true, ebitda: true, heatScore: true, financingEligible: true, isFranchise: true },
  })
  if (!deal) return { dealId, alertsBuffered: 0, searchesChecked: 0 }
  if (deal.status !== 'PUBLISHED' && deal.status !== 'ACTIVE') {
    return { dealId, alertsBuffered: 0, searchesChecked: 0 }
  }

  const searches = await prisma.savedSearch.findMany({
    where: { alertEnabled: true },
    take: max,
    select: { id: true, userId: true, filters: true },
  })

  let buffered = 0
  for (const search of searches) {
    let filters
    try {
      filters = JSON.parse(search.filters)
    } catch {
      continue
    }
    if (!dealMatchesFilters(deal, filters)) continue

    // Idempotent insert — unique constraint covers (userId, dealId,
    // savedSearchId, category). Skip on conflict instead of erroring.
    try {
      await prisma.pendingAlert.create({
        data: {
          userId: search.userId,
          dealId: deal.id,
          savedSearchId: search.id,
          category: 'match',
          importance: scoreImportance(deal),
        },
      })
      buffered++
    } catch {
      // Unique violation → already buffered, fine.
    }
  }

  return { dealId, alertsBuffered: buffered, searchesChecked: searches.length }
}

/**
 * In-process matcher — same logic as buildDealWhere() but applied to a
 * single deal in memory. Avoids round-trips when scoring matches for
 * thousands of saved searches against the same new deal.
 */
function dealMatchesFilters(deal: {
  industry: string
  country: string
  askingPrice: bigint | null
  revenue: bigint | null
  heatScore: number | null
  financingEligible: boolean
  isFranchise: boolean
}, filters: Record<string, unknown>): boolean {
  const industries = filters.industries as string[] | undefined
  if (industries?.length && !industries.includes(String(deal.industry))) return false

  const country = filters.country as string | undefined
  if (country && country !== deal.country) return false

  const isFranchise = filters.isFranchise as boolean | undefined
  if (isFranchise != null && isFranchise !== deal.isFranchise) return false

  const financingEligible = filters.financingEligible as boolean | undefined
  if (financingEligible != null && financingEligible !== deal.financingEligible) return false

  const minHeat = filters.minHeatScore as number | undefined
  if (minHeat != null && (deal.heatScore ?? 0) < minHeat) return false

  const minPrice = filters.minPrice as number | undefined
  const maxPrice = filters.maxPrice as number | undefined
  if (minPrice != null && (!deal.askingPrice || Number(deal.askingPrice) < minPrice)) return false
  if (maxPrice != null && (!deal.askingPrice || Number(deal.askingPrice) > maxPrice)) return false

  const minRev = filters.minRevenue as number | undefined
  const maxRev = filters.maxRevenue as number | undefined
  if (minRev != null && (!deal.revenue || Number(deal.revenue) < minRev)) return false
  if (maxRev != null && (!deal.revenue || Number(deal.revenue) > maxRev)) return false

  return true
}

/**
 * Importance signal used by the send-window to decide whether a match
 * is good enough for INSTANT delivery, or whether it should roll into
 * the user's next digest. Higher = more deserving of an interrupt.
 */
function scoreImportance(deal: { heatScore: number | null; financingEligible: boolean }): number {
  let s = 50
  if (deal.heatScore != null) s = Math.max(s, deal.heatScore)
  if (deal.financingEligible) s += 5
  return Math.min(100, s)
}

// Kept for future use — match against a buyer's saved-deal updates
// (price changes, withdrawal, sold) and inject as category='price-change'
// etc. Out of scope for v1, but the table shape supports it.
export type { EvaluateResult }
export { buildDealWhere as _filterShape }  // re-export so callers can build server filters

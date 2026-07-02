/**
 * Forward Copilot tool registry.
 *
 * Every tool is server-only, session-scoped, and read-only unless the tool
 * name starts with `draft_` — those return prepared content but never send.
 * Anything a counterparty would see stays in the approval queue.
 *
 * The role that owns each tool is declared in `role`; the chat endpoint
 * filters the tool set per session so a buyer session can't call seller
 * tools.
 */
import { prisma } from '@/lib/prisma'
import { buildDealWhere, type SavedSearchFilters } from '@/lib/services/saved-search-service'
import { confidenceForSample, CONFIDENCE_LABEL } from '@/lib/services/comparables'

type Role = 'buyer' | 'seller' | 'broker' | 'shared'

export interface ToolDef {
  name: string
  role: Role
  description: string
  input_schema: {
    type: 'object'
    properties: Record<string, unknown>
    required?: string[]
    additionalProperties?: boolean
  }
  handler: (args: any, ctx: ToolCtx) => Promise<unknown>
}

export interface ToolCtx {
  userId: string
  role: 'BUYER' | 'SELLER' | 'BROKER' | 'ADMIN'
}

// ── Helpers ─────────────────────────────────────────────────────────────
const cents = (v: bigint | number | null | undefined): number | null =>
  v == null ? null : Number(v) / 100

const dealBrief = (d: any) => ({
  id: d.id,
  slug: d.slug,
  title: d.title,
  industry: d.industry,
  country: d.country,
  city: d.city ?? null,
  askingPriceUsd: cents(d.askingPrice),
  revenueUsd: cents(d.revenue),
  ebitdaUsd: cents(d.ebitda),
  cashFlowUsd: cents(d.cashFlow),
  pricingMultiple: d.pricingMultiple ?? null,
  heatScore: d.heatScore ?? null,
  closeProbability: d.predictedCloseProb ?? null,
  financingEligible: d.financingEligible ?? false,
  sellerMotivation: d.sellerMotivation ?? null,
  sellerType: d.sellerType ?? null,
  listedByRole: d.listedByRole ?? null,
  yearsInOperation: d.yearsInOperation ?? null,
  employees: d.employees ?? null,
  reasonForSale: d.reasonForSale ?? null,
  publishedAt: d.publishedAt?.toISOString?.() ?? null,
  viewCount: d.viewCount ?? 0,
})

// ── BUYER TOOLS ─────────────────────────────────────────────────────────

const listSavedSearches: ToolDef = {
  name: 'list_saved_searches',
  role: 'buyer',
  description:
    'List the current buyer\'s saved searches with fresh match counts. Use to answer "what am I watching?" or before running a specific search.',
  input_schema: { type: 'object', properties: {}, additionalProperties: false },
  handler: async (_args, ctx) => {
    const searches = await prisma.savedSearch.findMany({
      where: { userId: ctx.userId },
      orderBy: { updatedAt: 'desc' },
    })
    const withCounts = await Promise.all(
      searches.map(async (s) => {
        let filters: SavedSearchFilters = {}
        try { filters = JSON.parse(s.filters) } catch { /* ignore malformed */ }
        const matchCount = await prisma.deal
          .count({ where: buildDealWhere(filters) as any })
          .catch(() => 0)
        return {
          id: s.id,
          name: s.name,
          country: s.country,
          alertEnabled: s.alertEnabled,
          alertFrequency: s.alertFrequency,
          lastAlertedAt: s.lastAlertedAt?.toISOString() ?? null,
          filters,
          matchCount,
        }
      }),
    )
    return { count: withCounts.length, searches: withCounts }
  },
}

const runSavedSearch: ToolDef = {
  name: 'run_saved_search',
  role: 'buyer',
  description:
    'Run one of the buyer\'s saved searches. Returns AI-ranked matching listings (heat + close probability + freshness). Include limit to cap results (default 8).',
  input_schema: {
    type: 'object',
    properties: {
      savedSearchId: { type: 'string', description: 'Saved-search id from list_saved_searches.' },
      limit: { type: 'integer', minimum: 1, maximum: 25, default: 8 },
    },
    required: ['savedSearchId'],
    additionalProperties: false,
  },
  handler: async (args, ctx) => {
    const s = await prisma.savedSearch.findFirst({
      where: { id: args.savedSearchId, userId: ctx.userId },
    })
    if (!s) return { error: 'Saved search not found or not yours.' }
    let filters: SavedSearchFilters = {}
    try { filters = JSON.parse(s.filters) } catch { /* ignore */ }
    const deals = await prisma.deal.findMany({
      where: buildDealWhere(filters) as any,
      orderBy: [
        { heatScore: 'desc' },
        { predictedCloseProb: 'desc' },
        { publishedAt: 'desc' },
      ],
      take: args.limit ?? 8,
    })
    return {
      name: s.name,
      filters,
      matches: deals.map(dealBrief),
    }
  },
}

const searchListings: ToolDef = {
  name: 'search_listings',
  role: 'shared',
  description:
    'Ad-hoc marketplace search across published Forward listings. Combine industry, country, price/revenue ranges, seller motivation, and financing eligibility. Returns ranked results.',
  input_schema: {
    type: 'object',
    properties: {
      industries: {
        type: 'array',
        items: {
          enum: [
            'SAAS', 'HEALTHCARE', 'RETAIL', 'ECOMMERCE', 'MANUFACTURING',
            'FINTECH', 'SERVICES', 'HOSPITALITY', 'EDUCATION', 'ENERGY',
            'REAL_ESTATE', 'LOGISTICS', 'AUTOMOTIVE', 'AGRICULTURE',
            'BIOTECH', 'CPG', 'MEDIA', 'TELECOM', 'OTHER',
          ],
        },
      },
      country: { type: 'string', description: 'ISO country name or code (e.g. "USA", "Canada", "UAE").' },
      minPriceUsd: { type: 'number', description: 'Minimum asking price in USD (not cents).' },
      maxPriceUsd: { type: 'number' },
      minRevenueUsd: { type: 'number' },
      maxRevenueUsd: { type: 'number' },
      sellerMotivation: {
        enum: ['STRATEGIC_EXIT', 'SUCCESSION', 'RETIREMENT', 'GROWTH_CAPITAL',
               'PORTFOLIO_OPTIMIZATION', 'DISTRESSED', 'RELOCATION', 'OTHER'],
      },
      financingEligible: { type: 'boolean' },
      limit: { type: 'integer', minimum: 1, maximum: 25, default: 10 },
    },
    additionalProperties: false,
  },
  handler: async (args) => {
    const filters: SavedSearchFilters = {
      industries: args.industries,
      country: args.country,
      minPrice: args.minPriceUsd != null ? Math.round(args.minPriceUsd * 100) : undefined,
      maxPrice: args.maxPriceUsd != null ? Math.round(args.maxPriceUsd * 100) : undefined,
      minRevenue: args.minRevenueUsd != null ? Math.round(args.minRevenueUsd * 100) : undefined,
      maxRevenue: args.maxRevenueUsd != null ? Math.round(args.maxRevenueUsd * 100) : undefined,
      financingEligible: args.financingEligible,
    }
    const where = buildDealWhere(filters) as any
    if (args.sellerMotivation) where.sellerMotivation = args.sellerMotivation
    const deals = await prisma.deal.findMany({
      where,
      orderBy: [
        { heatScore: 'desc' },
        { predictedCloseProb: 'desc' },
        { publishedAt: 'desc' },
      ],
      take: args.limit ?? 10,
    })
    return { count: deals.length, matches: deals.map(dealBrief) }
  },
}

const getListing: ToolDef = {
  name: 'get_listing',
  role: 'shared',
  description:
    'Get the full brief for one listing (by id or slug). Includes intelligence signals (heat, close probability), seller motivation, financing eligibility, and confidential fields visible to the current user.',
  input_schema: {
    type: 'object',
    properties: {
      dealId: { type: 'string' },
      slug: { type: 'string' },
    },
    additionalProperties: false,
  },
  handler: async (args) => {
    if (!args.dealId && !args.slug) return { error: 'Provide dealId or slug.' }
    const deal = await prisma.deal.findFirst({
      where: args.dealId ? { id: args.dealId } : { slug: args.slug },
    })
    if (!deal) return { error: 'Listing not found.' }
    return dealBrief(deal)
  },
}

const getComparables: ToolDef = {
  name: 'get_comparables',
  role: 'shared',
  description:
    'Live comparable-transactions view. Returns median + p25/p75 of asking price, revenue, and pricing multiple for published Forward listings matching industry (and optionally country + revenue band). Use to answer "what does a fair offer look like?"',
  input_schema: {
    type: 'object',
    properties: {
      industry: {
        enum: ['SAAS', 'HEALTHCARE', 'RETAIL', 'ECOMMERCE', 'MANUFACTURING',
               'FINTECH', 'SERVICES', 'HOSPITALITY', 'EDUCATION', 'ENERGY',
               'REAL_ESTATE', 'LOGISTICS', 'AUTOMOTIVE', 'AGRICULTURE',
               'BIOTECH', 'CPG', 'MEDIA', 'TELECOM', 'OTHER'],
      },
      country: { type: 'string' },
      centerRevenueUsd: {
        type: 'number',
        description: 'Optional: narrow comps to listings with revenue within ±50% of this figure.',
      },
    },
    required: ['industry'],
    additionalProperties: false,
  },
  handler: async (args) => {
    const where: Record<string, unknown> = {
      status: { in: ['ACTIVE', 'PUBLISHED'] },
      industry: args.industry,
    }
    if (args.country) where.country = args.country
    if (args.centerRevenueUsd != null) {
      const c = Math.round(args.centerRevenueUsd * 100)
      where.revenue = { gte: BigInt(Math.round(c * 0.5)), lte: BigInt(Math.round(c * 1.5)) }
    }
    const deals = await prisma.deal.findMany({
      where: where as any,
      select: { askingPrice: true, revenue: true, ebitda: true, pricingMultiple: true },
      take: 200,
    })
    if (deals.length === 0) return { sampleSize: 0, note: 'No comparable listings yet for this cut.' }

    const pct = (arr: number[], p: number) => {
      const sorted = arr.slice().sort((a, b) => a - b)
      const idx = Math.min(sorted.length - 1, Math.max(0, Math.floor((p / 100) * (sorted.length - 1))))
      return sorted[idx]
    }
    const prices    = deals.map((d) => cents(d.askingPrice)).filter((x): x is number => x != null && x > 0)
    const revenues  = deals.map((d) => cents(d.revenue)).filter((x): x is number => x != null && x > 0)
    const ebitdas   = deals.map((d) => cents(d.ebitda)).filter((x): x is number => x != null && x > 0)
    const multiples = deals.map((d) => d.pricingMultiple).filter((x): x is number => x != null && x > 0)

    const bandOrNull = (arr: number[]) => arr.length ? { p25: pct(arr, 25), median: pct(arr, 50), p75: pct(arr, 75) } : null

    return {
      sampleSize: deals.length,
      confidence: CONFIDENCE_LABEL[confidenceForSample(deals.length)],
      disclosure: `Always tell the user the sample size (${deals.length} listings) when citing these numbers.`,
      industry: args.industry,
      country: args.country ?? 'all',
      askingPriceUsd: bandOrNull(prices),
      revenueUsd: bandOrNull(revenues),
      ebitdaUsd: bandOrNull(ebitdas),
      pricingMultiple: bandOrNull(multiples),
    }
  },
}

const listMyInquiries: ToolDef = {
  name: 'list_my_inquiries',
  role: 'buyer',
  description:
    'List enquiries the current buyer has already sent, with status. Use to avoid duplicate outreach or to review pipeline.',
  input_schema: {
    type: 'object',
    properties: { limit: { type: 'integer', minimum: 1, maximum: 50, default: 20 } },
    additionalProperties: false,
  },
  handler: async (args, ctx) => {
    const rows = await prisma.enquiry.findMany({
      where: { inquirerId: ctx.userId },
      orderBy: { createdAt: 'desc' },
      take: args.limit ?? 20,
      include: { deal: { select: { id: true, title: true, industry: true, country: true, slug: true } } },
    })
    return {
      count: rows.length,
      inquiries: rows.map((r) => ({
        id: r.id,
        dealId: r.dealId,
        dealTitle: r.deal.title,
        industry: r.deal.industry,
        country: r.deal.country,
        status: r.status,
        inquiryType: r.inquiryType,
        createdAt: r.createdAt.toISOString(),
        respondedAt: r.respondedAt?.toISOString() ?? null,
      })),
    }
  },
}

const listSavedDeals: ToolDef = {
  name: 'list_saved_deals',
  role: 'buyer',
  description: 'List listings the buyer has saved (hearted) to their watchlist.',
  input_schema: { type: 'object', properties: {}, additionalProperties: false },
  handler: async (_args, ctx) => {
    const rows = await prisma.savedDeal.findMany({
      where: { userId: ctx.userId },
      include: { deal: true },
      orderBy: { savedAt: 'desc' },
    })
    return {
      count: rows.length,
      saved: rows.map((r) => ({ ...dealBrief(r.deal), notes: r.notes, savedAt: r.savedAt.toISOString() })),
    }
  },
}

const draftInquiry: ToolDef = {
  name: 'draft_inquiry',
  role: 'buyer',
  description:
    'Prepare a first-touch inquiry draft for a specific listing, tailored to the disclosed seller motivation. Returns text only — never sends. The buyer approves and sends via the normal enquiry flow.',
  input_schema: {
    type: 'object',
    properties: {
      dealId: { type: 'string' },
      angle: {
        type: 'string',
        description: 'Optional buyer angle to weave in (e.g., "strategic acquirer with adjacent portfolio", "search fund principal", "family office long-hold").',
      },
      tone: {
        enum: ['direct', 'warm', 'formal'],
        default: 'warm',
      },
    },
    required: ['dealId'],
    additionalProperties: false,
  },
  handler: async (args) => {
    const deal = await prisma.deal.findUnique({ where: { id: args.dealId } })
    if (!deal) return { error: 'Listing not found.' }
    return {
      dealId: deal.id,
      subjectSuggestion: `Interest in your ${deal.industry.toLowerCase()} business in ${deal.country}`,
      briefContext: {
        motivation: deal.sellerMotivation ?? 'undisclosed',
        sellerType: deal.sellerType ?? 'undisclosed',
        askingPriceUsd: cents(deal.askingPrice),
        revenueUsd: cents(deal.revenue),
        angle: args.angle ?? null,
        tone: args.tone ?? 'warm',
      },
      instruction: 'Write the draft as a first-touch inquiry — 4-6 sentences, reference the seller motivation naturally (if disclosed), acknowledge the confidential nature of the listing, and end with a clear next step (NDA / call / data-room access).',
    }
  },
}

// ── SELLER TOOLS ────────────────────────────────────────────────────────

const listMyListings: ToolDef = {
  name: 'list_my_listings',
  role: 'seller',
  description:
    'List the current seller\'s own listings (any status) with views, saves, heat score, and inquiry counts. Use to answer "how are my listings doing?"',
  input_schema: { type: 'object', properties: {}, additionalProperties: false },
  handler: async (_args, ctx) => {
    const deals = await prisma.deal.findMany({
      where: { sellerId: ctx.userId },
      orderBy: { updatedAt: 'desc' },
    })
    const withCounts = await Promise.all(
      deals.map(async (d) => {
        const [saveCount, inquiryCount] = await Promise.all([
          prisma.savedDeal.count({ where: { dealId: d.id } }),
          prisma.enquiry.count({ where: { dealId: d.id } }),
        ])
        return { ...dealBrief(d), status: d.status, saveCount, inquiryCount }
      }),
    )
    return { count: withCounts.length, listings: withCounts }
  },
}

const listInquiriesForMyDeals: ToolDef = {
  name: 'list_inquiries_for_my_deals',
  role: 'seller',
  description:
    'List buyer inquiries across all of the seller\'s listings, newest first. Each includes the buyer-submitted details (capital available, timeline, financing need) captured at contact time, and whether the inquiry looks like a saved-search match. Use before grading or replying.',
  input_schema: {
    type: 'object',
    properties: {
      dealId: { type: 'string', description: 'Optional — scope to one listing.' },
      limit: { type: 'integer', minimum: 1, maximum: 50, default: 20 },
    },
    additionalProperties: false,
  },
  handler: async (args, ctx) => {
    const myDealIds = (
      await prisma.deal.findMany({ where: { sellerId: ctx.userId }, select: { id: true, title: true } })
    )
    const idSet = new Set(myDealIds.map((d) => d.id))
    if (args.dealId && !idSet.has(args.dealId)) return { error: 'That listing is not yours.' }

    const rows = await prisma.enquiry.findMany({
      where: { dealId: args.dealId ? args.dealId : { in: Array.from(idSet) } },
      orderBy: { createdAt: 'desc' },
      take: args.limit ?? 20,
      include: { inquirer: { select: { id: true, kycStatus: true } } },
    })
    const titleById = Object.fromEntries(myDealIds.map((d) => [d.id, d.title]))

    return {
      count: rows.length,
      inquiries: rows.map((r) => {
        let buyerDetails: Record<string, unknown> = {}
        try { buyerDetails = r.buyerDetails ? JSON.parse(r.buyerDetails) : {} } catch { /* ignore */ }
        return {
          id: r.id,
          dealId: r.dealId,
          dealTitle: titleById[r.dealId] ?? 'Unknown listing',
          inquiryType: r.inquiryType,
          status: r.status,
          message: r.message,
          buyerDetails,
          buyerKycStatus: r.inquirer.kycStatus,
          bindingAcknowledged: r.bindingAcknowledged,
          createdAt: r.createdAt.toISOString(),
        }
      }),
    }
  },
}

const gradeInquiry: ToolDef = {
  name: 'grade_inquiry',
  role: 'seller',
  description:
    'Grade one buyer inquiry (A/B/C/D) using verification status, stated capital vs asking price, timeline urgency, and message specificity. Returns the grade and the reasoning — the seller decides who to prioritize.',
  input_schema: {
    type: 'object',
    properties: { inquiryId: { type: 'string' } },
    required: ['inquiryId'],
    additionalProperties: false,
  },
  handler: async (args, ctx) => {
    const row = await prisma.enquiry.findUnique({
      where: { id: args.inquiryId },
      include: { deal: true, inquirer: { select: { kycStatus: true } } },
    })
    if (!row || row.deal.sellerId !== ctx.userId) return { error: 'Inquiry not found or not yours.' }

    let buyerDetails: Record<string, any> = {}
    try { buyerDetails = row.buyerDetails ? JSON.parse(row.buyerDetails) : {} } catch { /* ignore */ }

    const askingUsd = cents(row.deal.askingPrice) ?? 0
    const capital = Number(buyerDetails.capitalAvailable ?? buyerDetails.capital ?? 0)
    const verified = row.inquirer.kycStatus === 'VERIFIED'
    const specific = row.message.length > 120

    return {
      inquiryId: row.id,
      signals: {
        buyerVerified: verified,
        statedCapitalUsd: capital || null,
        askingPriceUsd: askingUsd || null,
        capitalCoversAsking: askingUsd > 0 && capital > 0 ? capital >= askingUsd : null,
        messageIsSpecific: specific,
        bindingAcknowledged: row.bindingAcknowledged,
      },
      instruction:
        'Assign a grade A (verified + capital covers asking + specific message), B (2 of 3 signals positive), C (1 of 3), or D (unverified, vague, or capital well short of asking). Explain the grade in one sentence and recommend a next step.',
    }
  },
}

const suggestPriceBand: ToolDef = {
  name: 'suggest_price_band',
  role: 'seller',
  description:
    'Suggest a price band for one of the seller\'s own listings using live comparables for the same industry/country/revenue-band. Wraps get_comparables scoped to the listing.',
  input_schema: {
    type: 'object',
    properties: { dealId: { type: 'string' } },
    required: ['dealId'],
    additionalProperties: false,
  },
  handler: async (args, ctx) => {
    const deal = await prisma.deal.findFirst({ where: { id: args.dealId, sellerId: ctx.userId } })
    if (!deal) return { error: 'Listing not found or not yours.' }
    const centerRevenue = cents(deal.revenue)
    const where: Record<string, unknown> = {
      status: { in: ['ACTIVE', 'PUBLISHED'] },
      industry: deal.industry,
      country: deal.country,
    }
    if (centerRevenue) {
      const c = Math.round(centerRevenue * 100)
      where.revenue = { gte: BigInt(Math.round(c * 0.5)), lte: BigInt(Math.round(c * 1.5)) }
    }
    const comps = await prisma.deal.findMany({
      where: where as any,
      select: { askingPrice: true, pricingMultiple: true },
      take: 200,
    })
    const prices = comps.map((d) => cents(d.askingPrice)).filter((x): x is number => x != null && x > 0)
    const multiples = comps.map((d) => d.pricingMultiple).filter((x): x is number => x != null && x > 0)
    const pct = (arr: number[], p: number) => {
      const sorted = arr.slice().sort((a, b) => a - b)
      return sorted.length ? sorted[Math.min(sorted.length - 1, Math.floor((p / 100) * (sorted.length - 1)))] : null
    }
    return {
      dealId: deal.id,
      currentAskingUsd: cents(deal.askingPrice),
      sampleSize: prices.length,
      confidence: CONFIDENCE_LABEL[confidenceForSample(prices.length)],
      disclosure: `Always tell the seller the sample size (${prices.length} comparable listings) when recommending a price band.`,
      comparableAskingPriceUsd: prices.length ? { p25: pct(prices, 25), median: pct(prices, 50), p75: pct(prices, 75) } : null,
      comparableMultiple: multiples.length ? { p25: pct(multiples, 25), median: pct(multiples, 50), p75: pct(multiples, 75) } : null,
    }
  },
}

const draftReply: ToolDef = {
  name: 'draft_reply',
  role: 'seller',
  description:
    'Prepare a reply draft to a specific buyer inquiry. Returns text only — never sends. The seller approves and sends via the normal inquiry response flow.',
  input_schema: {
    type: 'object',
    properties: {
      inquiryId: { type: 'string' },
      tone: { enum: ['direct', 'warm', 'formal'], default: 'warm' },
      decision: {
        enum: ['invite_to_data_room', 'ask_clarifying_questions', 'decline'],
        description: 'What the seller wants this reply to accomplish.',
      },
    },
    required: ['inquiryId', 'decision'],
    additionalProperties: false,
  },
  handler: async (args, ctx) => {
    const row = await prisma.enquiry.findUnique({ where: { id: args.inquiryId }, include: { deal: true } })
    if (!row || row.deal.sellerId !== ctx.userId) return { error: 'Inquiry not found or not yours.' }
    return {
      inquiryId: row.id,
      buyerMessage: row.message,
      decision: args.decision,
      tone: args.tone ?? 'warm',
      instruction:
        'Write a 3-5 sentence reply matching the decision: invite_to_data_room should set expectations for NDA + data-room access; ask_clarifying_questions should request specifics needed to evaluate seriously (timeline, financing, structure); decline should be brief and courteous with no reason required.',
    }
  },
}

// ── BROKER TOOLS ────────────────────────────────────────────────────────

const listClientDeals: ToolDef = {
  name: 'list_client_deals',
  role: 'broker',
  description:
    'List all deals the broker is representing (listedByRole = BROKER, sellerId = broker\'s account), with stage-relevant signals: inquiry count, days since last inquiry response, days since publish.',
  input_schema: { type: 'object', properties: {}, additionalProperties: false },
  handler: async (_args, ctx) => {
    const deals = await prisma.deal.findMany({
      where: { sellerId: ctx.userId },
      orderBy: { updatedAt: 'desc' },
    })
    const now = Date.now()
    const withSignals = await Promise.all(
      deals.map(async (d) => {
        const enquiries = await prisma.enquiry.findMany({
          where: { dealId: d.id },
          orderBy: { createdAt: 'desc' },
          select: { status: true, createdAt: true, respondedAt: true },
        })
        const daysSincePublish = d.publishedAt
          ? Math.round((now - new Date(d.publishedAt).getTime()) / 86_400_000)
          : null
        const lastActivity = enquiries[0]?.createdAt ?? d.publishedAt ?? d.updatedAt
        const daysSinceLastActivity = Math.round((now - new Date(lastActivity).getTime()) / 86_400_000)
        return {
          ...dealBrief(d),
          status: d.status,
          totalInquiries: enquiries.length,
          pendingInquiries: enquiries.filter((e) => e.status === 'pending').length,
          daysSincePublish,
          daysSinceLastActivity,
        }
      }),
    )
    return { count: withSignals.length, deals: withSignals }
  },
}

const portfolioHealth: ToolDef = {
  name: 'portfolio_health',
  role: 'broker',
  description:
    'Flag deals in the broker\'s portfolio that look stalled — no inquiry activity in 21+ days while still active/published, or pending inquiries unanswered 7+ days. Use for "what needs my attention?"',
  input_schema: { type: 'object', properties: {}, additionalProperties: false },
  handler: async (_args, ctx) => {
    const deals = await prisma.deal.findMany({
      where: { sellerId: ctx.userId, status: { in: ['ACTIVE', 'PUBLISHED'] } },
    })
    const now = Date.now()
    const flags: Array<Record<string, unknown>> = []
    for (const d of deals) {
      const enquiries = await prisma.enquiry.findMany({
        where: { dealId: d.id },
        orderBy: { createdAt: 'desc' },
      })
      const lastActivity = enquiries[0]?.createdAt ?? d.publishedAt
      const daysSinceLastActivity = lastActivity
        ? Math.round((now - new Date(lastActivity).getTime()) / 86_400_000)
        : null
      const stalePending = enquiries.filter(
        (e) => e.status === 'pending' && Math.round((now - new Date(e.createdAt).getTime()) / 86_400_000) >= 7,
      )
      if ((daysSinceLastActivity != null && daysSinceLastActivity >= 21) || stalePending.length > 0) {
        flags.push({
          dealId: d.id,
          title: d.title,
          daysSinceLastActivity,
          stalePendingInquiries: stalePending.length,
          reason:
            stalePending.length > 0
              ? `${stalePending.length} inquiry(ies) unanswered 7+ days`
              : `No activity in ${daysSinceLastActivity} days`,
        })
      }
    }
    return { flaggedCount: flags.length, flagged: flags }
  },
}

const rankBuyersForDeal: ToolDef = {
  name: 'rank_buyers_for_deal',
  role: 'broker',
  description:
    'For one of the broker\'s listings, rank the buyers most likely to be interested — from saved searches whose filters match this listing\'s industry/country/price band, ordered by alert-enabled recency. Returns anonymized buyer-account signals only (no PII beyond what the buyer has already disclosed via inquiry).',
  input_schema: {
    type: 'object',
    properties: { dealId: { type: 'string' }, limit: { type: 'integer', minimum: 1, maximum: 20, default: 10 } },
    required: ['dealId'],
    additionalProperties: false,
  },
  handler: async (args, ctx) => {
    const deal = await prisma.deal.findFirst({ where: { id: args.dealId, sellerId: ctx.userId } })
    if (!deal) return { error: 'Listing not found or not yours.' }

    const candidateSearches = await prisma.savedSearch.findMany({
      where: { alertEnabled: true, OR: [{ country: deal.country }, { country: null }] },
      take: 200,
    })

    const matches: Array<{ savedSearchId: string; userId: string; matchedOn: string[] }> = []
    for (const s of candidateSearches) {
      let filters: SavedSearchFilters = {}
      try { filters = JSON.parse(s.filters) } catch { continue }
      const matchedOn: string[] = []
      if (!filters.industries?.length || filters.industries.includes(deal.industry)) matchedOn.push('industry')
      else continue
      if (filters.country && filters.country !== deal.country) continue
      matchedOn.push('country')
      const askingUsd = cents(deal.askingPrice)
      if (askingUsd != null) {
        if (filters.minPrice != null && askingUsd * 100 < filters.minPrice) continue
        if (filters.maxPrice != null && askingUsd * 100 > filters.maxPrice) continue
        matchedOn.push('price-band')
      }
      matches.push({ savedSearchId: s.id, userId: s.userId, matchedOn })
    }

    const ranked = matches.slice(0, args.limit ?? 10)
    return {
      dealId: deal.id,
      candidateCount: matches.length,
      topMatches: ranked.map((m) => ({
        buyerAccountId: m.userId,
        matchedOn: m.matchedOn,
        note: 'Buyer identity stays confidential until they inquire — use this list to prioritize proactive outreach via the platform message tool, not direct contact.',
      })),
    }
  },
}

const draftClientUpdate: ToolDef = {
  name: 'draft_client_update',
  role: 'broker',
  description:
    'Draft a weekly client update for one listing — views, saves, inquiry pipeline, and recommended next step. Returns text only; broker sends via their own channel.',
  input_schema: {
    type: 'object',
    properties: { dealId: { type: 'string' } },
    required: ['dealId'],
    additionalProperties: false,
  },
  handler: async (args, ctx) => {
    const deal = await prisma.deal.findFirst({ where: { id: args.dealId, sellerId: ctx.userId } })
    if (!deal) return { error: 'Listing not found or not yours.' }
    const [saveCount, enquiries] = await Promise.all([
      prisma.savedDeal.count({ where: { dealId: deal.id } }),
      prisma.enquiry.findMany({ where: { dealId: deal.id } }),
    ])
    return {
      dealBrief: dealBrief(deal),
      metrics: {
        views: deal.viewCount,
        saves: saveCount,
        totalInquiries: enquiries.length,
        pendingInquiries: enquiries.filter((e) => e.status === 'pending').length,
        respondedInquiries: enquiries.filter((e) => e.status === 'responded').length,
      },
      instruction:
        'Write a 4-6 sentence partner-to-client update: headline metric trend, pipeline status, one recommended next step. Professional, no fluff.',
    }
  },
}

// ── REGISTRY ────────────────────────────────────────────────────────────

const ALL: ToolDef[] = [
  listSavedSearches,
  runSavedSearch,
  searchListings,
  getListing,
  getComparables,
  listMyInquiries,
  listSavedDeals,
  draftInquiry,
  listMyListings,
  listInquiriesForMyDeals,
  gradeInquiry,
  suggestPriceBand,
  draftReply,
  listClientDeals,
  portfolioHealth,
  rankBuyersForDeal,
  draftClientUpdate,
]

/** Return the tool set for a given role. Buyers see buyer + shared tools. */
export function getToolsForRole(role: 'buyer' | 'seller' | 'broker'): ToolDef[] {
  return ALL.filter((t) => t.role === role || t.role === 'shared')
}

export function toAnthropicToolDefs(tools: ToolDef[]) {
  return tools.map((t) => ({
    name: t.name,
    description: t.description,
    input_schema: t.input_schema,
  }))
}

export async function invokeTool(name: string, args: unknown, ctx: ToolCtx): Promise<unknown> {
  const tool = ALL.find((t) => t.name === name)
  if (!tool) return { error: `Unknown tool: ${name}` }
  try {
    return await tool.handler(args as any, ctx)
  } catch (err: any) {
    return { error: `Tool ${name} failed: ${err?.message ?? 'unknown error'}` }
  }
}

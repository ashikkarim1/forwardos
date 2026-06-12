import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { maskCity, confidentialTitle } from '@/lib/listing-helpers'

/**
 * GET /api/deals — published marketplace listings from the database, mapped to
 * the marketplace card display shape. Returns { deals, source }. The marketplace
 * page falls back to its built-in sample set if this returns empty / errors.
 */

const IMAGE_BY_INDUSTRY: Record<string, string> = {
  SAAS: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=400&fit=crop',
  FINTECH: 'https://images.unsplash.com/photo-1565514020179-026b92b84bb6?w=500&h=400&fit=crop',
  HEALTHCARE: 'https://images.unsplash.com/photo-1576091160550-112173f31c77?w=500&h=400&fit=crop',
  HOSPITALITY: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&h=400&fit=crop',
  LOGISTICS: 'https://images.unsplash.com/photo-1586398128686-0a03e8917b87?w=500&h=400&fit=crop',
  RETAIL: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&h=400&fit=crop',
  ECOMMERCE: 'https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=500&h=400&fit=crop',
  SERVICES: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=500&h=400&fit=crop',
  MANUFACTURING: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&h=400&fit=crop',
  EDUCATION: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=400&fit=crop',
  ENERGY: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=500&h=400&fit=crop',
  DEFAULT: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=400&fit=crop',
}

function daysSince(date: Date | null): number {
  if (!date) return 30
  return Math.max(1, Math.round((Date.now() - new Date(date).getTime()) / 86_400_000))
}

// Map DB enum values to the human-readable strings the marketplace card +
// filter sidebar expect. Keeping the marketplace UI shape stable means we
// don't have to refactor the filter logic that consumes these labels.
const SELLER_TYPE_LABEL: Record<string, string> = {
  FOUNDER: 'Founder',
  FAMILY: 'Family',
  PE: 'PE Firm',
  CORPORATE: 'Corporate',
  BROKER: 'Broker',
  MANAGEMENT: 'Management',
  OTHER: 'Other',
}
const MOTIVATION_LABEL: Record<string, string> = {
  STRATEGIC_EXIT: 'Strategic Exit',
  SUCCESSION: 'Succession',
  RETIREMENT: 'Retirement',
  GROWTH_CAPITAL: 'Growth Capital',
  PORTFOLIO_OPTIMIZATION: 'Portfolio Optimization',
  DISTRESSED: 'Distressed',
  RELOCATION: 'Relocation',
  OTHER: 'Other',
}

export async function GET(_request: NextRequest) {
  try {
    const rows = await prisma.deal.findMany({
      where: { status: { in: ['ACTIVE', 'PUBLISHED'] } },
      orderBy: [{ heatScore: 'desc' }, { publishedAt: 'desc' }],
      take: 200,
      include: {
        // Cover photo if uploaded; else fall back to industry stock image.
        photos: {
          where: { isFeatured: true },
          orderBy: { displayOrder: 'asc' },
          take: 1,
          select: { photoUrl: true },
        },
      },
    })

    if (rows.length === 0) throw new Error('no-db-rows')

    const deals = rows.map((d) => {
      const askingPrice = d.askingPrice != null ? Number(d.askingPrice) / 100 : 0
      const annualRevenue = d.revenue != null ? Number(d.revenue) / 100 : 0
      const ebitda = d.ebitda != null ? Number(d.ebitda) / 100 : 0
      const heat = d.heatScore ?? 50
      const margin = d.ebitdaMargin ?? (annualRevenue > 0 ? Math.round((ebitda / annualRevenue) * 100) : 0)
      const roi = askingPrice > 0 ? Number(((ebitda / askingPrice) * 100).toFixed(1)) : 0
      const payback = ebitda > 0 ? Math.round((askingPrice / ebitda) * 12) : 0
      const dom = daysSince(d.publishedAt)
      const status: 'NEW' | 'FEATURED' | 'STANDARD' = heat >= 85 ? 'FEATURED' : dom <= 7 ? 'NEW' : 'STANDARD'
      const position: 'underpriced' | 'fair' | 'premium' =
        d.pricingMultiple != null ? (d.pricingMultiple < 3 ? 'underpriced' : d.pricingMultiple > 4.5 ? 'premium' : 'fair') : 'fair'

      // PRIVACY RULE: titles + cities are masked for EVERYONE in the public
      // API. The original `isConfidential` flag is now a no-op for masking —
      // identity is only ever revealed inside an authenticated, NDA-gated
      // deal room (paid tier). All financial metrics stay public — that's
      // how buyers decide whether to engage.
      const publicTitle = confidentialTitle(d.industry, d.country, d.id)
      const publicLocation = maskCity(d.city, d.country)

      return {
        id: d.id,
        slug: d.slug,
        title: publicTitle,
        location: publicLocation,
        country: d.country,
        image: d.photos[0]?.photoUrl || IMAGE_BY_INDUSTRY[d.industry] || IMAGE_BY_INDUSTRY.DEFAULT,
        isConfidential: d.isConfidential,
        askingPrice,
        askingPriceCurrency: 'USD',
        annualRevenue,
        cashFlowMin: Math.round(ebitda * 0.8),
        cashFlowMax: Math.round(ebitda * 1.05),
        ebitda,
        profitMarginPercent: Math.round(margin),
        dealQualityScore: d.dealQualityScore ?? heat,
        heatIndex: heat,
        roiProjection: roi,
        paybackPeriod: payback,
        growthRate: d.predictedCloseProb != null ? Math.round(d.predictedCloseProb) : 30,
        status,
        category: d.industry,
        dealType: 'SALE' as const,
        employeeCount: d.employees ?? 0,
        sellerVerified: true,
        sellerTrustScore: 85,
        marketTrend: 'up' as const,
        marketPosition: position,
        daysOnMarket: dom,
        location_country: d.country,
        sellerType: d.sellerType ? SELLER_TYPE_LABEL[d.sellerType] : 'Founder',
        sellerMotivation: d.sellerMotivation ? MOTIVATION_LABEL[d.sellerMotivation] : 'Strategic Exit',
        financingEligible: d.financingEligible,
      }
    })

    return NextResponse.json({ deals, source: 'db', count: deals.length })
  } catch (error) {
    return NextResponse.json({ deals: [], source: 'fallback', note: (error as Error).message })
  }
}

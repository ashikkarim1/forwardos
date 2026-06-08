import { NextRequest, NextResponse } from 'next/server'

// AI Valuation Engine - UAE Market specific
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { annualRevenue, ebitda, industry, growthRate } = body

    if (!annualRevenue || !ebitda || !industry || growthRate === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Industry-specific multiples (UAE market)
    const multiples: Record<string, { revenue: number; ebitda: number }> = {
      'software': { revenue: 8, ebitda: 25 },
      'ecommerce': { revenue: 2.5, ebitda: 12 },
      'services': { revenue: 3, ebitda: 10 },
      'manufacturing': { revenue: 1.5, ebitda: 8 },
      'healthcare': { revenue: 4, ebitda: 15 },
      'fintech': { revenue: 10, ebitda: 30 },
      'other': { revenue: 3, ebitda: 12 },
    }

    const baseMultiples = multiples[industry] || multiples['other']

    // Growth premium (higher growth = higher multiple)
    const growthPremium = Math.min(growthRate * 0.15, 50) // Max 50% premium
    const revenueMultiple = baseMultiples.revenue * (1 + growthPremium / 100)
    const ebitdaMultiple = baseMultiples.ebitda * (1 + growthPremium / 100)

    // Calculate valuations
    const revenueValuation = annualRevenue * revenueMultiple
    const ebitdaValuation = ebitda * ebitdaMultiple

    // Weighted average (60% revenue, 40% EBITDA)
    const likelyValuation = (revenueValuation * 0.6 + ebitdaValuation * 0.4)

    // Conservative and optimistic ranges
    const conservative = likelyValuation * 0.85
    const optimistic = likelyValuation * 1.15

    // Confidence score based on data quality
    const confidence = `${Math.min(90 + (growthRate / 100), 99)}%`

    return NextResponse.json({
      conservative: Math.round(conservative).toLocaleString('en-AE'),
      likely: Math.round(likelyValuation).toLocaleString('en-AE'),
      optimistic: Math.round(optimistic).toLocaleString('en-AE'),
      revenueMultiple: revenueMultiple.toFixed(1) + 'x',
      ebitdaMultiple: ebitdaMultiple.toFixed(1) + 'x',
      growthPremium: growthPremium.toFixed(0),
      confidence,
      buyerUniverse: {
        strategic: 5,
        pe: 3,
        familyOffice: 2,
        competitors: 4,
        expansion: 3,
      },
      financing: {
        likelihood: `${Math.min(70 + growthRate, 95)}%`,
        typicalTerms: `${Math.min(3 + growthRate / 20, 5)}x EBITDA leverage`,
      },
      timeline: growthRate > 30 ? '6-9 months' : growthRate > 15 ? '9-12 months' : '12-18 months',
    })
  } catch (error) {
    console.error('Valuation error:', error)
    return NextResponse.json(
      { error: 'Valuation calculation failed' },
      { status: 500 }
    )
  }
}

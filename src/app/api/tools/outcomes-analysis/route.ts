import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { revenue, growth, profitability, stage, goals, capitalNeeds } = body

    if (!revenue || growth === undefined || profitability === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Calculate base valuation multiples
    const baseRevMultiple = growth > 30 ? 8 : growth > 15 ? 5 : 3
    const baseEbitda = revenue * (profitability / 100)

    // Path 1: SALE (Quick exit, full liquidity, lose control)
    const saleValuation = Math.round(revenue * baseRevMultiple * 0.95) // -5% for quick sale discount
    const saleScore = goals === 'liquidity' ? 95 : goals === 'control' ? 30 : 65

    // Path 2: MERGER (Strategic fit, shared control, moderate timeline)
    const mergerValuation = Math.round(revenue * baseRevMultiple * 1.1) // +10% synergy premium
    const mergerScore = goals === 'control' ? 65 : goals === 'growth' ? 75 : 70

    // Path 3: RECAPITALIZATION (Keep control, raise capital, no liquidity yet)
    const recapValuation = Math.round(revenue * baseRevMultiple * 1.4) // +40% for post-recap valuation
    const recapCapital = Math.round(revenue * 0.2) // Raise 20% of revenue
    const recapScore = goals === 'control' ? 95 : goals === 'growth' ? 90 : 60

    // Path 4: IPO (Highest valuation, lose control, 3-year timeline)
    const ipoValuation = Math.round(revenue * baseRevMultiple * 2) // 2x uplift for public markets
    const ipoScore = stage === 'scale' || stage === 'mature' ? 85 : stage === 'growth' ? 60 : 20

    // Path 5: GROWTH MODE (Retain control, organic growth, future optionality)
    const growthValuation = Math.round(revenue * baseRevMultiple * 1.2) // +20% for continued growth
    const growthScore = goals === 'control' ? 90 : goals === 'timeline' ? 60 : 70

    // Timeline logic
    const getTimeline = (path: string): string => {
      switch (path) {
        case 'sale':
          return '6-9 months'
        case 'merger':
          return '12-18 months'
        case 'recap':
          return '2-4 months'
        case 'ipo':
          return '3 years'
        case 'growth':
          return 'Ongoing (3-5 year vision)'
        default:
          return 'TBD'
      }
    }

    // Liquidity logic
    const getLiquidity = (path: string): string => {
      switch (path) {
        case 'sale':
          return 'Full, 6 months'
        case 'merger':
          return 'Partial, 12 months'
        case 'recap':
          return 'None (yet)'
        case 'ipo':
          return 'Partial, Year 2 lockup ends'
        case 'growth':
          return 'None (future exit)'
        default:
          return 'TBD'
      }
    }

    // Control logic
    const getControl = (path: string): string => {
      switch (path) {
        case 'sale':
          return 'Loss'
        case 'merger':
          return 'Shared'
        case 'recap':
          return 'Retain (minority dilution)'
        case 'ipo':
          return 'Loss'
        case 'growth':
          return 'Retain'
        default:
          return 'TBD'
      }
    }

    const paths = [
      {
        name: 'Sale',
        valuation: `AED ${saleValuation.toLocaleString('en-AE')}`,
        timeline: getTimeline('sale'),
        liquidity: getLiquidity('sale'),
        control: getControl('sale'),
        capital: 'No capital raised',
        keyBenefit: 'Fastest path to liquidity. Immediate cash. Seller can retire or pursue new ventures.',
        score: saleScore,
      },
      {
        name: 'Merger',
        valuation: `AED ${mergerValuation.toLocaleString('en-AE')}`,
        timeline: getTimeline('merger'),
        liquidity: getLiquidity('merger'),
        control: getControl('merger'),
        capital: 'No capital raised',
        keyBenefit: 'Higher valuation via synergy. Partial liquidity. Continued involvement in integration.',
        score: mergerScore,
      },
      {
        name: 'Recapitalization',
        valuation: `AED ${recapValuation.toLocaleString('en-AE')}`,
        timeline: getTimeline('recap'),
        liquidity: getLiquidity('recap'),
        control: getControl('recap'),
        capital: `Raise AED ${recapCapital.toLocaleString('en-AE')}`,
        keyBenefit: 'Growth capital without selling. Retain control. Build toward larger exit in 3-4 years.',
        score: recapScore,
      },
      {
        name: 'IPO Pathway',
        valuation: `AED ${ipoValuation.toLocaleString('en-AE')}`,
        timeline: getTimeline('ipo'),
        liquidity: getLiquidity('ipo'),
        control: getControl('ipo'),
        capital: 'Raise $50M+',
        keyBenefit: 'Highest valuation potential. Public company prestige. Requires 3-year journey and scale.',
        score: ipoScore,
      },
      {
        name: 'Growth Mode',
        valuation: `AED ${growthValuation.toLocaleString('en-AE')}`,
        timeline: getTimeline('growth'),
        liquidity: getLiquidity('growth'),
        control: getControl('growth'),
        capital: 'Bootstrap/angel',
        keyBenefit: 'Remain owner-operator. No dilution yet. Compound growth. Exit optionality later.',
        score: growthScore,
      },
    ]

    // Determine recommendation based on goals
    let recommendation = ''
    let primaryPath = ''

    if (goals === 'liquidity') {
      primaryPath = 'Sale'
      recommendation = `Based on your liquidity priority, the SALE path is optimal: Exit in 6-9 months at AED ${saleValuation.toLocaleString('en-AE')} with full liquidity. You keep 100% of proceeds and can immediately deploy capital elsewhere.`
    } else if (goals === 'control') {
      if (growth > 20) {
        primaryPath = 'Recapitalization'
        recommendation = `Your growth rate (${growth}%) and control priority align perfectly with RECAPITALIZATION. Raise AED ${recapCapital.toLocaleString('en-AE')} at AED ${recapValuation.toLocaleString('en-AE')} valuation (diluting ~20%), then exit in 3-4 years at AED ${Math.round(recapValuation * 1.5).toLocaleString('en-AE')}+ for a double.`
      } else {
        primaryPath = 'Growth Mode'
        recommendation = `With moderate growth (${growth}%), GROWTH MODE gives you maximum control without dilution. Bootstrap growth, then explore strategic exit in 3-5 years when scale is larger.`
      }
    } else if (goals === 'growth') {
      if (stage === 'scale' || stage === 'mature') {
        primaryPath = 'IPO Pathway'
        recommendation = `At your scale (AED ${revenue.toLocaleString('en-AE')} revenue, ${growth}% growth), the IPO pathway is viable. Target AED ${ipoValuation.toLocaleString('en-AE')} public valuation in 3 years. Requires professionalization and market visibility.`
      } else {
        primaryPath = 'Recapitalization'
        recommendation = `RECAPITALIZATION is the growth accelerator. Raise AED ${recapCapital.toLocaleString('en-AE')} at AED ${recapValuation.toLocaleString('en-AE')} valuation. Use capital to reach scale stage in 2-3 years, then IPO or strategic exit at AED ${Math.round(ipoValuation * 0.75).toLocaleString('en-AE')}+.`
      }
    } else {
      primaryPath = 'Merger'
      recommendation = `Given your stage (${stage}) and balanced priorities, MERGER offers an optimal risk-adjusted path. Expect AED ${mergerValuation.toLocaleString('en-AE')} valuation in 12-18 months with partial liquidity and continued leadership role.`
    }

    const analysis = `
Your business (AED ${revenue.toLocaleString('en-AE')} revenue, ${growth}% growth, ${profitability}% profit margin) has optionality across all 5 pathways.

**${primaryPath} (Recommended):** This path aligns with your stated priority (${goals}) and stage (${stage}). It balances valuation (AED ${paths.find(p => p.name === primaryPath)?.valuation}), timeline, and control tradeoffs.

**Valuation Spread:** Sale (AED ${saleValuation.toLocaleString('en-AE')}) vs. IPO (AED ${ipoValuation.toLocaleString('en-AE')}) shows a ${Math.round(((ipoValuation - saleValuation) / saleValuation) * 100)}% spread. Recap sits in between at AED ${recapValuation.toLocaleString('en-AE')}.

**Next Steps:**
1. If pursuing ${primaryPath}: Engage advisors in next 2 weeks (M&A for Sale/Merger, Investment bankers for IPO, VCs/PE for Recap)
2. Prepare data room (financials, contracts, employee data, IP documentation)
3. Define walk-away price and timeline constraints clearly
4. Model downside scenario (market downturn, buyer hesitation)

Your optimal exit window: **6-18 months** if proceeding with Sale/Merger, **2-4 months** if Recap, **3 years** if IPO.
    `

    return NextResponse.json({
      recommendation,
      paths,
      analysis: analysis.trim(),
    })
  } catch (error) {
    console.error('Outcomes analysis error:', error)
    return NextResponse.json(
      { error: 'Analysis failed' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { listingId } = await request.json()

    if (!listingId) {
      return NextResponse.json(
        { error: 'Listing ID required' },
        { status: 400 }
      )
    }

    // Mock buyer database - In production, fetch from buyers table
    const strategicBuyers = [
      {
        name: 'Zoom Technologies',
        type: 'strategic' as const,
        score: 92,
        likelihood: 85,
        timeline: '6-9 months',
        financing: 95,
        rationale: 'Perfect vertical fit. Proven M&A track record. Can close quickly.',
      },
      {
        name: 'Salesforce',
        type: 'strategic' as const,
        score: 88,
        likelihood: 78,
        timeline: '9-12 months',
        financing: 98,
        rationale: 'Synergistic product roadmap. Strategic alignment on customer base.',
      },
      {
        name: 'Adobe Systems',
        type: 'strategic' as const,
        score: 85,
        likelihood: 72,
        timeline: '6-12 months',
        financing: 97,
        rationale: 'Adjacent market. Complementary technologies. Potential bundle play.',
      },
      {
        name: 'Microsoft',
        type: 'strategic' as const,
        score: 82,
        likelihood: 68,
        timeline: '12-18 months',
        financing: 99,
        rationale: 'Large buyer, slow process. Strategic for Azure ecosystem.',
      },
      {
        name: 'Oracle',
        type: 'strategic' as const,
        score: 78,
        likelihood: 62,
        timeline: '12-18 months',
        financing: 99,
        rationale: 'Cloud expansion strategy. Past acquisition history in this space.',
      },
    ]

    const peBuyers = [
      {
        name: 'Apax Partners',
        type: 'pe' as const,
        score: 84,
        likelihood: 80,
        timeline: '6-9 months',
        financing: 92,
        rationale: 'Focused on software buyouts. Proven value-add playbook.',
      },
      {
        name: 'Thoma Bravo',
        type: 'pe' as const,
        score: 81,
        likelihood: 75,
        timeline: '6-12 months',
        financing: 95,
        rationale: 'Largest SaaS acquirer. Strong portfolio. Recurring revenue model fit.',
      },
      {
        name: 'Warburg Pincus',
        type: 'pe' as const,
        score: 77,
        likelihood: 68,
        timeline: '9-12 months',
        financing: 94,
        rationale: 'Growth-focused. Can provide growth capital post-acquisition.',
      },
    ]

    const familyOfficeBuyers = [
      {
        name: 'UAE Holding Company #1',
        type: 'family_office' as const,
        score: 72,
        likelihood: 65,
        timeline: '9-12 months',
        financing: 85,
        rationale: 'Regional wealth. Seeking yield. Long-term hold mentality.',
      },
      {
        name: 'GCC Investment Fund',
        type: 'family_office' as const,
        score: 68,
        likelihood: 58,
        timeline: '12-18 months',
        financing: 80,
        rationale: 'Conservative underwriting. Prefers proven business models.',
      },
    ]

    const competitorBuyers = [
      {
        name: 'HubSpot',
        type: 'competitor' as const,
        score: 86,
        likelihood: 82,
        timeline: '6-9 months',
        financing: 90,
        rationale: 'Direct competitor. Natural strategic fit. Proven integration track record.',
      },
      {
        name: 'Asana',
        type: 'competitor' as const,
        score: 83,
        likelihood: 75,
        timeline: '9-12 months',
        financing: 88,
        rationale: 'Market consolidation play. Similar customer base overlap.',
      },
      {
        name: 'Monday.com',
        type: 'competitor' as const,
        score: 80,
        likelihood: 72,
        timeline: '9-12 months',
        financing: 85,
        rationale: 'Adjacent product space. Platform expansion strategy.',
      },
      {
        name: 'Notion Labs',
        type: 'competitor' as const,
        score: 76,
        likelihood: 65,
        timeline: '12-18 months',
        financing: 92,
        rationale: 'Potential platform partnership. Less likely full acquisition.',
      },
    ]

    const expansionBuyers = [
      {
        name: 'Accenture',
        type: 'expansion' as const,
        score: 74,
        likelihood: 70,
        timeline: '9-12 months',
        financing: 94,
        rationale: 'Capabilities expansion. Can leverage global go-to-market.',
      },
      {
        name: 'Deloitte',
        type: 'expansion' as const,
        score: 71,
        likelihood: 65,
        timeline: '12-18 months',
        financing: 93,
        rationale: 'Service offering enhancement. Client cross-sell opportunity.',
      },
      {
        name: 'IBM',
        type: 'expansion' as const,
        score: 68,
        likelihood: 60,
        timeline: '12-18 months',
        financing: 96,
        rationale: 'Cloud services expansion. Partner integration possible.',
      },
    ]

    const allBuyers = [
      ...strategicBuyers,
      ...peBuyers,
      ...familyOfficeBuyers,
      ...competitorBuyers,
      ...expansionBuyers,
    ]

    // Add IDs and sort by score descending
    const matches = allBuyers.map((buyer, idx) => ({
      id: idx + 1,
      ...buyer,
    })).sort((a, b) => b.score - a.score)

    // Calculate stats
    const avgScore = Math.round(matches.reduce((sum, b) => sum + b.score, 0) / matches.length)
    const avgLikelihood = Math.round(matches.reduce((sum, b) => sum + b.likelihood, 0) / matches.length)

    // Average timeline (complex, just show most common)
    const timelineMap: Record<string, number> = {}
    matches.forEach(b => {
      timelineMap[b.timeline] = (timelineMap[b.timeline] || 0) + 1
    })
    const avgTimeline = Object.entries(timelineMap).sort((a, b) => b[1] - a[1])[0]?.[0] || '6-12 months'

    const stats = {
      total: matches.length,
      avgScore,
      avgLikelihood,
      avgTimeline,
      strategyCount: strategicBuyers.length,
      peCount: peBuyers.length,
      familyOfficeCount: familyOfficeBuyers.length,
      competitorCount: competitorBuyers.length,
      expansionCount: expansionBuyers.length,
    }

    return NextResponse.json({
      matches,
      stats,
    })
  } catch (error) {
    console.error('Buyer match error:', error)
    return NextResponse.json(
      { error: 'Matching failed' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'

interface Feed {
  id: string
  type: 'sec_edgar' | 'news' | 'market_data' | 'regulatory'
  title: string
  description: string
  lastUpdate: string
  status: 'active'
}

const mockFeeds: Feed[] = [
  {
    id: 'edgar_1',
    type: 'sec_edgar',
    title: 'SEC EDGAR Filings',
    description: '8-K, 10-Q, and 10-K filings processed in real-time',
    lastUpdate: '2 minutes ago',
    status: 'active',
  },
  {
    id: 'news_1',
    type: 'news',
    title: 'Deal Rumors',
    description: 'Curated financial news and acquisition rumors',
    lastUpdate: '5 minutes ago',
    status: 'active',
  },
  {
    id: 'market_1',
    type: 'market_data',
    title: 'Market Movements',
    description: 'Stock price changes and trading activity alerts',
    lastUpdate: 'just now',
    status: 'active',
  },
  {
    id: 'regulatory_1',
    type: 'regulatory',
    title: 'Regulatory Filings',
    description: 'State filings, business registration changes',
    lastUpdate: '15 minutes ago',
    status: 'active',
  },
]

const comparableDeals = [
  {
    id: 'deal_1',
    company: 'TechFlow Systems',
    price: 180000000,
    multiple: 8.9,
    revenue: 45000000,
    ebitda: 12000000,
    synergy: 45000000,
    timeline: 7,
  },
  {
    id: 'deal_2',
    company: 'CloudMasters Inc',
    price: 320000000,
    multiple: 9.2,
    revenue: 38000000,
    ebitda: 10200000,
    synergy: 38000000,
    timeline: 8,
  },
  {
    id: 'deal_3',
    company: 'DataCore Analytics',
    price: 215000000,
    multiple: 8.6,
    revenue: 28000000,
    ebitda: 7560000,
    synergy: 28000000,
    timeline: 6,
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const includeComparables = searchParams.get('comparables') === 'true'

    const response: any = {
      feeds: mockFeeds,
      feedStats: {
        totalSources: mockFeeds.length,
        activeFeeds: mockFeeds.filter(f => f.status === 'active').length,
        avgLatency: '2.3 minutes',
        coverage: '24/7',
      },
      success: true,
    }

    if (includeComparables) {
      response.comparables = comparableDeals
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch feeds', success: false },
      { status: 500 }
    )
  }
}

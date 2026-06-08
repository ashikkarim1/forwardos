import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getSession } from '@/lib/auth'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const sellerId = searchParams.get('sellerId') || session.userId
    const period = searchParams.get('period') || '7d'

    // Get all published deals for this seller
    const deals = await prisma.deal.findMany({
      where: {
        sellerId,
        status: 'PUBLISHED',
      },
      select: {
        id: true,
        title: true,
        industry: true,
        estimatedValuation: true,
        publishedAt: true,
      },
    })

    // Calculate heat for each deal
    const heatMaps = await Promise.all(
      deals.map(async deal => {
        // Count data room views
        const views = await prisma.dataRoomView.count({
          where: {
            request: { dealId: deal.id },
          },
        })

        // Count access requests (inquiries)
        const inquiries = await prisma.dataRoomRequest.count({
          where: { dealId: deal.id },
        })

        // Count messages
        const messages = await prisma.message.count({
          where: { dealId: deal.id },
        })

        // Calculate heat temperature
        const industryMultiplier = getIndustryMultiplier(deal.industry || 'OTHER')
        const baseHeat = (views + inquiries + messages) * industryMultiplier
        const temperature = Math.min(Math.round(baseHeat), 100)

        return {
          dealId: deal.id,
          title: deal.title,
          industry: deal.industry,
          temperature,
          heatLabel: getHeatLabel(temperature),
          metrics: {
            views,
            inquiries,
            messages,
            total: views + inquiries + messages,
          },
          industryMultiplier: industryMultiplier.toFixed(2),
          timeToClose: getTimeToClose(temperature),
        }
      })
    )

    // Sort by temperature (hottest first)
    heatMaps.sort((a, b) => b.temperature - a.temperature)

    return NextResponse.json({
      heatMaps,
      count: heatMaps.length,
      period,
      success: true,
    })
  } catch (error) {
    console.error('Heat maps API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch heat maps', success: false },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { dealId, period = '7d' } = body

    if (!dealId) {
      return NextResponse.json({ error: 'Missing dealId' }, { status: 400 })
    }

    // Get the deal
    const deal = await prisma.deal.findUnique({
      where: { id: dealId },
      select: {
        id: true,
        title: true,
        industry: true,
        estimatedValuation: true,
        sellerId: true,
        status: true,
        publishedAt: true,
      },
    })

    if (!deal) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 })
    }

    if (deal.sellerId !== session.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get engagement metrics
    const views = await prisma.dataRoomView.count({
      where: { request: { dealId } },
    })

    const inquiries = await prisma.dataRoomRequest.count({
      where: { dealId },
    })

    const messages = await prisma.message.count({
      where: { dealId },
    })

    const industryMultiplier = getIndustryMultiplier(deal.industry || 'OTHER')
    const baseTemperature = (views + inquiries + messages) * industryMultiplier
    const temperature = Math.min(Math.round(baseTemperature), 100)

    // Get buyer breakdown
    const buyerData = await prisma.dataRoomRequest.findMany({
      where: { dealId },
      include: {
        buyer: { select: { id: true } },
      },
    })

    const uniqueBuyers = new Set(buyerData.map(r => r.buyer.id)).size

    return NextResponse.json({
      deal: {
        id: deal.id,
        title: deal.title,
        industry: deal.industry,
        status: deal.status,
        publishedAt: deal.publishedAt,
      },
      heat: {
        temperature,
        label: getHeatLabel(temperature),
      },
      metrics: {
        views,
        inquiries,
        messages,
        uniqueBuyers,
        total: views + inquiries + messages,
      },
      industryMultiplier: industryMultiplier.toFixed(2),
      timeToClose: getTimeToClose(temperature),
      riskFactors: getRiskFactors(temperature),
      recommendations: getRecommendations(temperature, deal.industry || 'OTHER'),
    })
  } catch (error) {
    console.error('Heat map calculation error:', error)
    return NextResponse.json(
      { error: 'Heat map calculation failed' },
      { status: 500 }
    )
  }
}

// Helper functions

function getAllHeatMaps() {
  return [
    {
      id: '1',
      name: 'TechFlow Solutions',
      industry: 'SaaS',
      temperature: 92,
      trend: '+14°',
      buyerInterest: 12,
    },
    {
      id: '2',
      name: 'Emirates Healthcare',
      industry: 'Healthcare',
      temperature: 88,
      trend: '+8°',
      buyerInterest: 15,
    },
    {
      id: '3',
      name: 'DubaiRetail Group',
      industry: 'Retail',
      temperature: 76,
      trend: '+2°',
      buyerInterest: 8,
    },
  ]
}

function getIndustryMultiplier(industry: string): number {
  const multipliers: Record<string, number> = {
    'SaaS': 1.3,
    'FinTech': 1.25,
    'Healthcare': 1.2,
    'E-commerce': 1.15,
    'Services': 1.1,
    'Retail': 1.05,
    'Manufacturing': 1.0,
  }
  return multipliers[industry] || 1.0
}

function getHeatLabel(temperature: number): string {
  if (temperature >= 85) return '🔥 Red Hot'
  if (temperature >= 70) return '🟠 Hot'
  if (temperature >= 55) return '🟡 Warm'
  if (temperature >= 40) return '🟠 Lukewarm'
  if (temperature >= 25) return '🔵 Cool'
  return '❄️ Cold'
}

function getHeatTrend(period: string): { previous: number; current: number; change: number } {
  const trends: Record<string, { previous: number; current: number }> = {
    '7d': { previous: 78, current: 92 },
    '30d': { previous: 65, current: 92 },
    '90d': { previous: 45, current: 92 },
  }

  const trend = trends[period] || { previous: 80, current: 92 }
  return {
    previous: trend.previous,
    current: trend.current,
    change: trend.current - trend.previous,
  }
}

function getTimeToClose(temperature: number): string {
  if (temperature >= 85) return '4-6 weeks'
  if (temperature >= 70) return '6-8 weeks'
  if (temperature >= 55) return '8-12 weeks'
  if (temperature >= 40) return '12-16 weeks'
  return '16-24 weeks'
}

function getRiskFactors(temperature: number): string[] {
  const risks: string[] = []

  if (temperature >= 85) {
    risks.push('High deal complexity—expect extended negotiations')
    risks.push('Multiple competitive bids—prepare for price escalation')
  }

  if (temperature >= 70) {
    risks.push('Moderate buyer competition—clarify terms early')
  }

  if (temperature < 40) {
    risks.push('Low buyer interest—consider repositioning or price adjustment')
    risks.push('Extended timeline—plan for patience')
  }

  return risks
}

function getRecommendations(temperature: number, industry: string): string[] {
  const recommendations: string[] = []

  if (temperature >= 85) {
    recommendations.push('Prepare for aggressive negotiation—have walk-away price ready')
    recommendations.push('Schedule multiple buyer meetings simultaneously for better terms')
    recommendations.push('Engage advisors to manage deal complexity')
  }

  if (temperature >= 70 && temperature < 85) {
    recommendations.push('Maintain momentum—respond to inquiries within 2 hours')
    recommendations.push('Request non-binding LOI from top 3 buyers')
  }

  if (temperature < 55) {
    recommendations.push(`Re-evaluate ${industry} positioning or valuation`)
    recommendations.push('Launch targeted marketing campaign to expand buyer universe')
    recommendations.push('Consider price reduction to increase heat')
  }

  recommendations.push('Monitor heat score weekly—adjust strategy based on trends')

  return recommendations
}

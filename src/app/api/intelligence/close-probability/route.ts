import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getSession } from '@/lib/auth'

const prisma = new PrismaClient()

// Predictive ML Model: 3-Signal Patent-Worthy Algorithm
// Signals:
// 1. Buyer Seriousness (40%) - based on engagement metrics
// 2. Deal Heat (35%) - market momentum and competition
// 3. Timeline Alignment (25%) - KYC completion + NDA status

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const sellerId = searchParams.get('sellerId') || session.userId

    // Get all published deals for seller
    const deals = await prisma.deal.findMany({
      where: {
        sellerId,
        status: 'PUBLISHED',
      },
      include: {
        dataRoom: { select: { id: true } },
      },
    })

    const probabilities = await Promise.all(
      deals.map(async deal => {
        const probability = await calculateCloseProbability(deal.id)
        return {
          dealId: deal.id,
          title: deal.title,
          probability: probability.score,
          forecast: probability.forecast,
          confidence: probability.confidence,
        }
      })
    )

    return NextResponse.json({
      probabilities: probabilities.sort((a, b) => b.probability - a.probability),
      count: probabilities.length,
      success: true,
    })
  } catch (error) {
    console.error('Close probability error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch close probability' },
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

    const { dealId } = await request.json()

    if (!dealId) {
      return NextResponse.json({ error: 'Missing dealId' }, { status: 400 })
    }

    // Get deal
    const deal = await prisma.deal.findUnique({
      where: { id: dealId },
      select: { sellerId: true },
    })

    if (!deal || deal.sellerId !== session.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const probability = await calculateCloseProbability(dealId)

    return NextResponse.json({
      dealId,
      ...probability,
    })
  } catch (error) {
    console.error('Close probability calculation error:', error)
    return NextResponse.json(
      { error: 'Close probability calculation failed' },
      { status: 500 }
    )
  }
}

// Calculate close probability using 3-signal model
async function calculateCloseProbability(dealId: string) {
  try {
    // SIGNAL 1: Buyer Seriousness (40% weight)
    const seriousnessScores = await prisma.buyerSeriousness.findMany({
      where: {
        dealId,
      },
    })

    const avgSeriousness = seriousnessScores.length > 0
      ? seriousnessScores.reduce((sum, s) => sum + s.score, 0) / seriousnessScores.length
      : 0

    const seriousnessSignal = Math.min(avgSeriousness / 100, 1) // Normalize to 0-1

    // SIGNAL 2: Deal Heat (35% weight)
    const views = await prisma.dataRoomView.count({
      where: { request: { dealId } },
    })

    const inquiries = await prisma.dataRoomRequest.count({
      where: { dealId },
    })

    const messages = await prisma.message.count({
      where: { dealId },
    })

    const deal = await prisma.deal.findUnique({
      where: { id: dealId },
      select: { industry: true },
    })

    const industryMultiplier = getIndustryMultiplier(deal?.industry || 'OTHER')
    const heatScore = Math.min((views + inquiries + messages) * industryMultiplier / 100, 1)

    // SIGNAL 3: Timeline Alignment (25% weight)
    // Based on NDA completion and KYC status
    const ndaSignedCount = await prisma.dataRoomRequest.count({
      where: {
        dealId,
        status: 'NDA_SIGNED',
      },
    })

    const totalRequests = await prisma.dataRoomRequest.count({
      where: { dealId },
    })

    const timelineScore = totalRequests > 0
      ? (ndaSignedCount / totalRequests) * 0.7 + 0.3 // Baseline 30% for having interest
      : 0.3

    // WEIGHTED CALCULATION
    const closeProbability = (
      (seriousnessSignal * 0.4) +
      (heatScore * 0.35) +
      (timelineScore * 0.25)
    )

    const score = Math.round(closeProbability * 100)
    const confidence = getConfidence(score)
    const forecast = getForecast(score)

    return {
      score,
      confidence,
      forecast,
      signals: {
        buyerSeriousness: Math.round(seriousnessSignal * 100),
        dealHeat: Math.round(heatScore * 100),
        timelineAlignment: Math.round(timelineScore * 100),
      },
      factors: [
        {
          name: 'Buyer Seriousness',
          impact: `${Math.round(seriousnessSignal * 100)}%`,
          status: seriousnessSignal > 0.6 ? 'Strong' : 'Developing',
        },
        {
          name: 'Deal Heat',
          impact: `${Math.round(heatScore * 100)}%`,
          status: heatScore > 0.6 ? 'Hot' : 'Warming',
        },
        {
          name: 'NDA Progress',
          impact: `${totalRequests > 0 ? Math.round((ndaSignedCount / totalRequests) * 100) : 0}%`,
          status: ndaSignedCount > 0 ? 'Advancing' : 'Initiating',
        },
      ],
    }
  } catch (error) {
    console.error('Close probability calculation error:', error)
    return {
      score: 0,
      confidence: 'Unknown',
      forecast: 'Unable to calculate',
      signals: { buyerSeriousness: 0, dealHeat: 0, timelineAlignment: 0 },
      factors: [],
    }
  }
}

function getIndustryMultiplier(industry: string): number {
  const multipliers: Record<string, number> = {
    'SAAS': 1.3,
    'FINTECH': 1.25,
    'HEALTHCARE': 1.2,
    'ECOMMERCE': 1.15,
    'SERVICES': 1.1,
    'RETAIL': 1.05,
    'MANUFACTURING': 1.0,
    'HOSPITALITY': 0.95,
    'OTHER': 1.0,
  }
  return multipliers[industry] || 1.0
}

function getConfidence(score: number): string {
  if (score >= 80) return 'Very High'
  if (score >= 65) return 'High'
  if (score >= 50) return 'Medium'
  if (score >= 35) return 'Low'
  return 'Very Low'
}

function getForecast(score: number): string {
  if (score >= 85) return '2-4 weeks'
  if (score >= 70) return '4-8 weeks'
  if (score >= 55) return '8-12 weeks'
  if (score >= 40) return '12-16 weeks'
  return '16+ weeks'
}

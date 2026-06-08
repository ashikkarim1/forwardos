import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getSession } from '@/lib/auth'

const prisma = new PrismaClient()

// Calculate seriousness score based on multiple factors
function calculateSeriousnessScore(factors: {
  pagesViewed: number
  totalPages: number
  timeSpentMinutes: number
  documentRequests: number
  messagesSent: number
  responseTimeHours: number | null
}): { score: number; assessment: string } {
  let score = 0

  // Pages viewed (0-25 points)
  if (factors.totalPages > 0) {
    const viewRatio = Math.min(factors.pagesViewed / factors.totalPages, 1)
    score += viewRatio * 25
  }

  // Time spent (0-25 points)
  const timeScore = Math.min(factors.timeSpentMinutes / 120, 1) * 25 // 2 hours = max score
  score += timeScore

  // Document requests (0-25 points)
  const docScore = Math.min(factors.documentRequests / 3, 1) * 25 // 3+ requests = max score
  score += docScore

  // Message engagement (0-15 points)
  const messageScore = Math.min(factors.messagesSent / 5, 1) * 15 // 5+ messages = max score
  score += messageScore

  // Response time (0-10 points) - faster response = higher score
  if (factors.responseTimeHours !== null) {
    const responseScore = Math.max(10 - (factors.responseTimeHours / 24) * 10, 0) // Penalize slow responses
    score += responseScore
  }

  score = Math.min(score, 100)

  let assessment = 'Low'
  if (score >= 75) assessment = 'High'
  else if (score >= 50) assessment = 'Medium'

  return { score: Math.round(score), assessment }
}

// POST: Calculate or update seriousness score
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { buyerId, dealId } = await request.json()

    // Get buyer's engagement data
    const views = await prisma.dataRoomView.findMany({
      where: {
        viewer: { id: buyerId },
        request: { dealId },
      },
    })

    const totalPages = views.reduce((sum, v) => sum + (v.pagesViewed?.length || 0), 0)
    const totalTime = views.reduce((sum, v) => sum + v.totalTimeMinutes, 0)

    const messages = await prisma.message.findMany({
      where: {
        senderId: buyerId,
        dealId,
      },
    })

    // Calculate response time (simplified)
    let responseTime = null
    if (messages.length > 0) {
      const firstMessage = messages[0]
      const now = new Date()
      responseTime = (now.getTime() - firstMessage.createdAt.getTime()) / (1000 * 60 * 60) // in hours
    }

    const docRequests = await prisma.dataRoomView.findMany({
      where: {
        viewer: { id: buyerId },
        request: { dealId },
        infoRequested: true,
      },
    })

    const { score, assessment } = calculateSeriousnessScore({
      pagesViewed: totalPages,
      totalPages: 20, // Assume ~20 pages in data room
      timeSpentMinutes: totalTime,
      documentRequests: docRequests.length,
      messagesSent: messages.length,
      responseTimeHours: responseTime,
    })

    const seriousness = await prisma.buyerSeriousness.upsert({
      where: {
        buyerId_dealId: {
          buyerId,
          dealId,
        },
      },
      update: {
        score,
        assessment,
        viewedPages: totalPages,
        timeSpentMinutes: totalTime,
        documentRequests: docRequests.length,
        messagesSent: messages.length,
      },
      create: {
        buyerId,
        dealId,
        score,
        assessment,
        viewedPages: totalPages,
        timeSpentMinutes: totalTime,
        documentRequests: docRequests.length,
        messagesSent: messages.length,
      },
    })

    return NextResponse.json({ seriousness })
  } catch (error) {
    console.error('Calculate seriousness score error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// GET: Get seriousness score for buyer-deal pair
export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const buyerId = searchParams.get('buyerId')
    const dealId = searchParams.get('dealId')

    if (!buyerId || !dealId) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
    }

    const seriousness = await prisma.buyerSeriousness.findUnique({
      where: {
        buyerId_dealId: {
          buyerId,
          dealId,
        },
      },
    })

    return NextResponse.json({ seriousness })
  } catch (error) {
    console.error('Fetch seriousness score error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

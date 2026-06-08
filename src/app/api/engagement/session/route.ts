import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getSession } from '@/lib/auth'

const prisma = new PrismaClient()

// GET: Get session analytics
export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const requestId = searchParams.get('requestId')
    const sessionId = searchParams.get('sessionId')
    const dealId = searchParams.get('dealId')

    if (!requestId && !sessionId && !dealId) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
    }

    let where: any = { viewerId: session.userId }

    if (requestId) {
      where.requestId = requestId
    } else if (sessionId) {
      where.id = sessionId
    } else if (dealId) {
      // Get all requests for this deal
      where.request = { dealId }
    }

    const sessions = await prisma.dataRoomView.findMany({
      where,
      include: {
        request: {
          select: {
            id: true,
            deal: { select: { id: true, title: true } },
            status: true,
          },
        },
      },
      orderBy: { sessionStarted: 'desc' },
    })

    if (sessions.length === 0) {
      return NextResponse.json({
        sessions: [],
        count: 0,
        message: 'No sessions found.',
      })
    }

    // Parse and aggregate data
    const parsedSessions = sessions.map(s => {
      const pageTimeData = s.pageTimeSpent ? JSON.parse(s.pageTimeSpent) : {}
      const pagesByTime = Object.entries(pageTimeData)
        .map(([page, time]) => ({ page, timeSpent: time as number }))
        .sort((a, b) => b.timeSpent - a.timeSpent)

      return {
        id: s.id,
        dealTitle: s.request.deal.title,
        dealId: s.request.deal.id,
        totalTimeMinutes: s.totalTimeMinutes,
        pagesViewed: s.pagesViewed?.length || 0,
        pagesByMostTime: pagesByTime.slice(0, 5),
        sessionStarted: s.sessionStarted,
        sessionEnded: s.updatedAt,
        returningVisitor: s.returningVisitor,
        requestStatus: s.request.status,
      }
    })

    return NextResponse.json({
      sessions: parsedSessions,
      count: parsedSessions.length,
    })
  } catch (error) {
    console.error('Fetch session error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

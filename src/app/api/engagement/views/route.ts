import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getSession } from '@/lib/auth'

const prisma = new PrismaClient()

// POST: Record page view in data room
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { requestId, documentId, pageNumber, timeSpentSeconds } = await request.json()

    // Get or create view session
    let view = await prisma.dataRoomView.findFirst({
      where: {
        requestId,
        viewerId: session.userId,
      },
    })

    if (!view) {
      view = await prisma.dataRoomView.create({
        data: {
          requestId,
          viewerId: session.userId,
          sessionStarted: new Date(),
        },
      })
    }

    // Update session metrics
    const pagesViewed = view.pagesViewed || []
    if (pageNumber && !pagesViewed.includes(pageNumber)) {
      pagesViewed.push(pageNumber)
    }

    const pageTimeSpent = view.pageTimeSpent ? JSON.parse(view.pageTimeSpent) : {}
    if (pageNumber && timeSpentSeconds) {
      pageTimeSpent[`page${pageNumber}`] = (pageTimeSpent[`page${pageNumber}`] || 0) + timeSpentSeconds
    }

    const updatedView = await prisma.dataRoomView.update({
      where: { id: view.id },
      data: {
        pagesViewed,
        pageTimeSpent: JSON.stringify(pageTimeSpent),
        updatedAt: new Date(),
      },
    })

    return NextResponse.json({ view: updatedView }, { status: 200 })
  } catch (error) {
    console.error('Record view error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// GET: Get view analytics for a request
export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const requestId = searchParams.get('requestId')

    if (!requestId) {
      return NextResponse.json({ error: 'Missing requestId' }, { status: 400 })
    }

    const view = await prisma.dataRoomView.findFirst({
      where: {
        requestId,
        viewerId: session.userId,
      },
    })

    if (!view) {
      return NextResponse.json({ error: 'View not found' }, { status: 404 })
    }

    return NextResponse.json({ view })
  } catch (error) {
    console.error('Fetch view error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

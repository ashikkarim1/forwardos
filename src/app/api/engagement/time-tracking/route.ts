import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getSession } from '@/lib/auth'

const prisma = new PrismaClient()

// POST: Track time spent on document
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { requestId, documentId, timeSpentSeconds } = await request.json()

    if (!requestId || !timeSpentSeconds) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

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
          totalTimeMinutes: 0,
        },
      })
    }

    // Update total time
    const newTotalTime = view.totalTimeMinutes + Math.ceil(timeSpentSeconds / 60)

    // If tracking a specific document, update per-document time
    let pageTimeSpent = view.pageTimeSpent ? JSON.parse(view.pageTimeSpent) : {}
    if (documentId) {
      const docKey = `doc_${documentId}`
      pageTimeSpent[docKey] = (pageTimeSpent[docKey] || 0) + timeSpentSeconds
    }

    const updatedView = await prisma.dataRoomView.update({
      where: { id: view.id },
      data: {
        totalTimeMinutes: newTotalTime,
        pageTimeSpent: JSON.stringify(pageTimeSpent),
        updatedAt: new Date(),
      },
    })

    return NextResponse.json({
      view: updatedView,
      message: 'Time tracking recorded.',
    })
  } catch (error) {
    console.error('Time tracking error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

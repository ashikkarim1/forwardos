import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getSession } from '@/lib/auth'

const prisma = new PrismaClient()

// POST: Request data room access extension
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { requestId, daysRequested, reason } = await request.json()

    if (!requestId || !daysRequested) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Get the original request
    const dataRoomRequest = await prisma.dataRoomRequest.findUnique({
      where: { id: requestId },
      include: {
        deal: { select: { id: true, sellerId: true, title: true } },
      },
    })

    if (!dataRoomRequest) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 })
    }

    // Verify the user is the buyer
    if (dataRoomRequest.buyerId !== session.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Calculate new expiry
    const currentExpiry = dataRoomRequest.expiresAt || new Date()
    const newExpiry = new Date(currentExpiry.getTime() + daysRequested * 24 * 60 * 60 * 1000)

    // Create extension request
    const extension = await prisma.dataRoomExtension.create({
      data: {
        requestId,
        currentExpiresAt: currentExpiry,
        requestedExpiresAt: newExpiry,
        daysRequested,
        reason: reason || 'Extension requested by buyer',
        status: 'PENDING',
        requestedAt: new Date(),
      },
    })

    // Notify seller
    await prisma.notification.create({
      data: {
        recipientId: dataRoomRequest.deal.sellerId,
        type: 'DATA_ROOM_REQUEST',
        title: 'Data Room Extension Requested',
        message: `${session.userId} is requesting a ${daysRequested}-day extension for ${dataRoomRequest.deal.title}`,
        dealId: dataRoomRequest.dealId,
        relatedId: extension.id,
      },
    })

    return NextResponse.json(
      {
        extension,
        message: 'Extension request sent to seller for approval.',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Request extension error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// GET: List extension requests for a seller
export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const dealId = searchParams.get('dealId')

    let where: any = {
      request: {
        deal: {
          sellerId: session.userId,
        },
      },
    }

    if (dealId) {
      where = {
        ...where,
        request: {
          ...where.request,
          dealId,
        },
      }
    }

    const extensions = await prisma.dataRoomExtension.findMany({
      where,
      include: {
        request: {
          select: {
            id: true,
            buyer: { select: { name: true, email: true } },
            deal: { select: { title: true } },
          },
        },
      },
      orderBy: { requestedAt: 'desc' },
    })

    return NextResponse.json({ extensions, count: extensions.length })
  } catch (error) {
    console.error('Fetch extensions error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

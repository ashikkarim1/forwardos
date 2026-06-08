import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getSession } from '@/lib/auth'

const prisma = new PrismaClient()

// PUT: Seller requests more information from buyer
export async function PUT(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { requestId, infoNeeded } = await request.json()

    if (!requestId || !infoNeeded) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Get the request
    const dataRoomRequest = await prisma.dataRoomRequest.findUnique({
      where: { id: requestId },
      include: {
        deal: { select: { id: true, sellerId: true, title: true } },
        buyer: { select: { name: true } },
      },
    })

    if (!dataRoomRequest) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 })
    }

    // Verify the user is the seller
    if (dataRoomRequest.deal.sellerId !== session.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Update request status
    const updatedRequest = await prisma.dataRoomRequest.update({
      where: { id: requestId },
      data: {
        status: 'INFO_REQUESTED',
        informationRequested: infoNeeded,
        infoRequestedAt: new Date(),
      },
    })

    // Create notification for buyer
    await prisma.notification.create({
      data: {
        recipientId: dataRoomRequest.buyerId,
        type: 'INFORMATION_REQUEST',
        title: 'Additional Information Requested',
        message: `Seller is requesting additional information for ${dataRoomRequest.deal.title}: ${infoNeeded}`,
        dealId: dataRoomRequest.dealId,
        relatedId: requestId,
      },
    })

    return NextResponse.json({
      request: updatedRequest,
      message: 'Information request sent to buyer.',
    })
  } catch (error) {
    console.error('Request info error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

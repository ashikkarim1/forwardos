import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getSession } from '@/lib/auth'

const prisma = new PrismaClient()

// PUT: Decline data room request
export async function PUT(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { requestId, reason } = await request.json()

    if (!requestId) {
      return NextResponse.json({ error: 'Missing requestId' }, { status: 400 })
    }

    // Get the request
    const dataRoomRequest = await prisma.dataRoomRequest.findUnique({
      where: { id: requestId },
      include: {
        deal: { select: { id: true, sellerId: true, title: true } },
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
        status: 'DECLINED',
        declinedAt: new Date(),
        declineReason: reason || 'Request declined by seller',
      },
    })

    // Create notification for buyer
    await prisma.notification.create({
      data: {
        recipientId: dataRoomRequest.buyerId,
        type: 'APPROVAL_DECISION',
        title: 'Data Room Access Declined',
        message: `Your request to access ${dataRoomRequest.deal.title} has been declined. Reason: ${reason || 'Not specified'}`,
        dealId: dataRoomRequest.dealId,
        relatedId: requestId,
      },
    })

    return NextResponse.json({
      request: updatedRequest,
      message: 'Request declined.',
    })
  } catch (error) {
    console.error('Decline request error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

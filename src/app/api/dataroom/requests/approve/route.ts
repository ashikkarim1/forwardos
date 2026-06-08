import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getSession } from '@/lib/auth'

const prisma = new PrismaClient()

// PUT: Approve data room request (triggers NDA generation)
export async function PUT(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { requestId } = await request.json()

    if (!requestId) {
      return NextResponse.json({ error: 'Missing requestId' }, { status: 400 })
    }

    // Get the request
    const dataRoomRequest = await prisma.dataRoomRequest.findUnique({
      where: { id: requestId },
      include: {
        deal: { select: { id: true, sellerId: true } },
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
        status: 'APPROVED',
        approvedAt: new Date(),
        approvalReason: 'Request approved by seller',
      },
    })

    // Create notification for buyer
    await prisma.notification.create({
      data: {
        recipientId: dataRoomRequest.buyerId,
        type: 'APPROVAL_DECISION',
        title: 'Data Room Access Approved',
        message: `Your request to access ${dataRoomRequest.deal.id} has been approved. Please review and sign the NDA.`,
        dealId: dataRoomRequest.dealId,
        relatedId: requestId,
      },
    })

    return NextResponse.json({
      request: updatedRequest,
      message: 'Request approved. NDA will be generated for buyer to sign.',
    })
  } catch (error) {
    console.error('Approve request error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

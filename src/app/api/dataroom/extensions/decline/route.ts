import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getSession } from '@/lib/auth'

const prisma = new PrismaClient()

// PUT: Decline extension request
export async function PUT(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { extensionId, reason } = await request.json()

    if (!extensionId) {
      return NextResponse.json({ error: 'Missing extensionId' }, { status: 400 })
    }

    // Get the extension
    const extension = await prisma.dataRoomExtension.findUnique({
      where: { id: extensionId },
      include: {
        request: {
          select: {
            id: true,
            dealId: true,
            buyerId: true,
            deal: { select: { sellerId: true, title: true } },
          },
        },
      },
    })

    if (!extension) {
      return NextResponse.json({ error: 'Extension not found' }, { status: 404 })
    }

    // Verify the user is the seller
    if (extension.request.deal.sellerId !== session.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Update extension status
    const declinedExtension = await prisma.dataRoomExtension.update({
      where: { id: extensionId },
      data: {
        status: 'DECLINED',
        declinedAt: new Date(),
        declineReason: reason || 'Request declined by seller',
      },
    })

    // Notify buyer
    await prisma.notification.create({
      data: {
        recipientId: extension.request.buyerId,
        type: 'APPROVAL_DECISION',
        title: 'Extension Declined',
        message: `Your extension request for ${extension.request.deal.title} has been declined. Reason: ${reason || 'Not specified'}`,
        dealId: extension.request.dealId,
        relatedId: extensionId,
      },
    })

    return NextResponse.json({
      extension: declinedExtension,
      message: 'Extension request declined.',
    })
  } catch (error) {
    console.error('Decline extension error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

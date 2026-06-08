import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getSession } from '@/lib/auth'

const prisma = new PrismaClient()

// PUT: Approve extension request
export async function PUT(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { extensionId } = await request.json()

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
    const approvedExtension = await prisma.dataRoomExtension.update({
      where: { id: extensionId },
      data: {
        status: 'APPROVED',
        approvedAt: new Date(),
      },
    })

    // Update the data room request expiry
    await prisma.dataRoomRequest.update({
      where: { id: extension.request.id },
      data: {
        expiresAt: extension.requestedExpiresAt,
      },
    })

    // Notify buyer
    await prisma.notification.create({
      data: {
        recipientId: extension.request.buyerId,
        type: 'APPROVAL_DECISION',
        title: 'Extension Approved',
        message: `Your extension request for ${extension.request.deal.title} has been approved. New expiry: ${extension.requestedExpiresAt.toLocaleDateString()}`,
        dealId: extension.request.dealId,
        relatedId: extensionId,
      },
    })

    return NextResponse.json({
      extension: approvedExtension,
      message: 'Extension approved successfully.',
    })
  } catch (error) {
    console.error('Approve extension error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

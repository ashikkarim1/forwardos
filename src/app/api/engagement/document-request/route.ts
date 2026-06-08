import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getSession } from '@/lib/auth'

const prisma = new PrismaClient()

// POST: Record document/information request from buyer
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { requestId, documentId, documentName, reason } = await request.json()

    if (!requestId) {
      return NextResponse.json({ error: 'Missing requestId' }, { status: 400 })
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
        },
      })
    }

    // Mark that info was requested
    const updatedView = await prisma.dataRoomView.update({
      where: { id: view.id },
      data: {
        infoRequested: true,
        updatedAt: new Date(),
      },
    })

    // Create a document view record for this request
    if (documentId) {
      await prisma.dataRoomDocumentView.create({
        data: {
          viewId: view.id,
          documentId,
          documentName: documentName || 'Unknown',
          requested: true,
          reason: reason || 'Document requested',
        },
      })
    }

    // Get the data room request details to notify seller
    const dataRoomRequest = await prisma.dataRoomRequest.findUnique({
      where: { id: requestId },
      include: {
        deal: { select: { title: true, sellerId: true } },
        buyer: { select: { name: true } },
      },
    })

    if (dataRoomRequest) {
      // Notify seller
      await prisma.notification.create({
        data: {
          recipientId: dataRoomRequest.deal.sellerId,
          type: 'INFORMATION_REQUEST',
          title: 'Document Request Received',
          message: `${dataRoomRequest.buyer.name} requested: ${documentName || 'Additional information'} for ${dataRoomRequest.deal.title}`,
          dealId: dataRoomRequest.dealId,
          relatedId: requestId,
        },
      })
    }

    return NextResponse.json({
      view: updatedView,
      message: 'Document request recorded.',
    })
  } catch (error) {
    console.error('Document request error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// GET: List document requests for a deal (seller view)
export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const dealId = searchParams.get('dealId')

    if (!dealId) {
      return NextResponse.json({ error: 'Missing dealId' }, { status: 400 })
    }

    // Verify user is seller of this deal
    const deal = await prisma.deal.findUnique({
      where: { id: dealId },
      select: { sellerId: true },
    })

    if (!deal || deal.sellerId !== session.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get all document requests for this deal
    const requests = await prisma.dataRoomDocumentView.findMany({
      where: {
        view: {
          request: {
            dealId,
          },
        },
        requested: true,
      },
      include: {
        view: {
          select: {
            requestId: true,
            viewerId: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    // Enrich with buyer info
    const enrichedRequests = await Promise.all(
      requests.map(async req => {
        const buyer = await prisma.user.findUnique({
          where: { id: req.view.viewerId },
          select: { name: true, email: true },
        })
        return {
          ...req,
          buyerName: buyer?.name,
          buyerEmail: buyer?.email,
        }
      })
    )

    return NextResponse.json({
      requests: enrichedRequests,
      count: enrichedRequests.length,
    })
  } catch (error) {
    console.error('Fetch document requests error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

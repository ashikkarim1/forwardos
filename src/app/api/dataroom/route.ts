import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getSession } from '@/lib/auth'

const prisma = new PrismaClient()

// GET: Get data room details by ID
export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const dataRoomId = searchParams.get('id')
    const dealId = searchParams.get('dealId')

    if (!dataRoomId && !dealId) {
      return NextResponse.json({ error: 'Missing id or dealId' }, { status: 400 })
    }

    let where: any = {}
    if (dataRoomId) {
      where.id = dataRoomId
    }
    if (dealId) {
      where.dealId = dealId
    }

    const dataRoom = await prisma.dataRoom.findFirst({
      where,
      include: {
        deal: {
          select: {
            id: true,
            title: true,
            sellerId: true,
            seller: { select: { name: true, email: true } },
          },
        },
        documents: {
          orderBy: { uploadedAt: 'desc' },
        },
      },
    })

    if (!dataRoom) {
      return NextResponse.json({ error: 'Data room not found' }, { status: 404 })
    }

    // Check access permissions
    if (dataRoom.deal.sellerId !== session.userId) {
      // Buyer trying to access
      const hasAccess = await prisma.dataRoomRequest.findFirst({
        where: {
          dealId: dataRoom.dealId,
          buyerId: session.userId,
          status: 'NDA_SIGNED',
        },
      })

      if (!hasAccess) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    }

    return NextResponse.json({ dataRoom })
  } catch (error) {
    console.error('Fetch data room error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST: Create data room for a deal
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { dealId } = await request.json()

    if (!dealId) {
      return NextResponse.json({ error: 'Missing dealId' }, { status: 400 })
    }

    // Get the deal and verify seller
    const deal = await prisma.deal.findUnique({
      where: { id: dealId },
      select: { sellerId: true },
    })

    if (!deal) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 })
    }

    if (deal.sellerId !== session.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Check if data room already exists
    const existingDataRoom = await prisma.dataRoom.findFirst({
      where: { dealId },
    })

    if (existingDataRoom) {
      return NextResponse.json({
        dataRoom: existingDataRoom,
        message: 'Data room already exists for this deal.',
      })
    }

    // Create data room
    const dataRoom = await prisma.dataRoom.create({
      data: {
        dealId,
        createdAt: new Date(),
      },
      include: {
        deal: { select: { title: true } },
      },
    })

    return NextResponse.json(
      {
        dataRoom,
        message: 'Data room created successfully.',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Create data room error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

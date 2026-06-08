import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getSession } from '@/lib/auth'

const prisma = new PrismaClient()

// POST: Create data room access request
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { dealId, dataRoomId } = await request.json()

    // Check if request already exists
    const existing = await prisma.dataRoomRequest.findFirst({
      where: {
        buyerId: session.userId,
        dealId,
      },
    })

    if (existing) {
      return NextResponse.json({ error: 'Request already exists' }, { status: 400 })
    }

    const request_obj = await prisma.dataRoomRequest.create({
      data: {
        buyerId: session.userId,
        dealId,
        dataRoomId,
        status: 'PENDING',
      },
      include: { nda: true },
    })

    return NextResponse.json({ request: request_obj }, { status: 201 })
  } catch (error) {
    console.error('Create data room request error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// GET: List data room requests for seller
export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const requests = await prisma.dataRoomRequest.findMany({
      where: {
        dataRoom: {
          sellerId: session.userId,
        },
      },
      include: {
        buyer: { select: { id: true, email: true, name: true, company: true } },
        deal: { select: { id: true, title: true } },
        nda: true,
      },
      orderBy: { requestedAt: 'desc' },
    })

    return NextResponse.json({ requests, count: requests.length })
  } catch (error) {
    console.error('Fetch data room requests error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

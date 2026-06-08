import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getSession } from '@/lib/auth'

const prisma = new PrismaClient()

// POST: Sign NDA
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { ndaId } = await request.json()

    if (!ndaId) {
      return NextResponse.json({ error: 'Missing ndaId' }, { status: 400 })
    }

    // Get NDA and verify it exists
    const nda = await prisma.nda.findUnique({
      where: { id: ndaId },
      include: {
        request: {
          select: {
            id: true,
            dealId: true,
            buyerId: true,
            sellerId: true,
          },
        },
      },
    })

    if (!nda) {
      return NextResponse.json({ error: 'NDA not found' }, { status: 404 })
    }

    // Verify the user is the buyer
    if (nda.request.buyerId !== session.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Check if NDA has expired
    if (nda.expiresAt && new Date() > nda.expiresAt) {
      return NextResponse.json({ error: 'NDA has expired' }, { status: 400 })
    }

    // Update NDA status
    const signedNda = await prisma.nda.update({
      where: { id: ndaId },
      data: {
        status: 'SIGNED',
        signedAt: new Date(),
      },
    })

    // Update data room request status to NDA_SIGNED
    await prisma.dataRoomRequest.update({
      where: { id: nda.request.id },
      data: {
        status: 'NDA_SIGNED',
      },
    })

    return NextResponse.json({
      nda: signedNda,
      message: 'NDA signed successfully. Data room access granted.',
    })
  } catch (error) {
    console.error('Sign NDA error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

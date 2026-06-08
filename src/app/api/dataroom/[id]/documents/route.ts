import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getSession } from '@/lib/auth'

const prisma = new PrismaClient()

// POST: Upload document to data room
export async function POST(request: NextRequest, context: any) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: dataRoomId } = context.params

    const { fileName, fileUrl, fileSize, fileType, description, phase } = await request.json()

    if (!fileName || !fileUrl || !dataRoomId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Get the data room and verify seller
    const dataRoom = await prisma.dataRoom.findUnique({
      where: { id: dataRoomId },
      select: { dealId: true, deal: { select: { sellerId: true } } },
    })

    if (!dataRoom) {
      return NextResponse.json({ error: 'Data room not found' }, { status: 404 })
    }

    if (dataRoom.deal.sellerId !== session.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Create document
    const document = await prisma.dataRoomDocument.create({
      data: {
        dataRoomId,
        fileName,
        fileUrl,
        fileSize: fileSize || 0,
        fileType: fileType || 'application/pdf',
        description: description || '',
        phase: phase || 'STAGE_1',
        uploadedAt: new Date(),
      },
    })

    return NextResponse.json(
      {
        document,
        message: 'Document uploaded successfully.',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Upload document error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// GET: List documents in data room
export async function GET(request: NextRequest, context: any) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: dataRoomId } = context.params
    const { searchParams } = new URL(request.url)
    const phase = searchParams.get('phase') // Optional phase filter

    if (!dataRoomId) {
      return NextResponse.json({ error: 'Missing dataRoomId' }, { status: 400 })
    }

    // Get data room
    const dataRoom = await prisma.dataRoom.findUnique({
      where: { id: dataRoomId },
      select: { deal: { select: { sellerId: true } } },
    })

    if (!dataRoom) {
      return NextResponse.json({ error: 'Data room not found' }, { status: 404 })
    }

    // Buyers can only see if they have approved access
    if (dataRoom.deal.sellerId !== session.userId) {
      const hasAccess = await prisma.dataRoomRequest.findFirst({
        where: {
          dealId: dataRoom.deal.id,
          buyerId: session.userId,
          status: 'NDA_SIGNED', // Only NDA-signed buyers can access
        },
      })

      if (!hasAccess) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    }

    // Build query
    let where: any = { dataRoomId }
    if (phase) {
      where = { ...where, phase }
    }

    const documents = await prisma.dataRoomDocument.findMany({
      where,
      orderBy: { uploadedAt: 'desc' },
    })

    return NextResponse.json({
      documents,
      count: documents.length,
    })
  } catch (error) {
    console.error('Fetch documents error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

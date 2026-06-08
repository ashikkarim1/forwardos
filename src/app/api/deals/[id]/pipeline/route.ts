import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getSession } from '@/lib/auth'

const prisma = new PrismaClient()

// GET: Get pipeline info for a specific deal
export async function GET(request: NextRequest, context: any) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: dealId } = context.params

    const deal = await prisma.deal.findUnique({
      where: { id: dealId },
      include: {
        pipeline: true,
        progressionHistory: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: {
            changedBy: { select: { name: true, email: true } },
          },
        },
      },
    })

    if (!deal) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 })
    }

    // Verify seller ownership
    if (deal.sellerId !== session.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return NextResponse.json({
      dealId: deal.id,
      title: deal.title,
      pipeline: deal.pipeline,
      history: deal.progressionHistory,
      daysInCurrentStage: deal.pipeline
        ? Math.floor((new Date().getTime() - new Date(deal.pipeline.stageStartedAt).getTime()) / (1000 * 60 * 60 * 24))
        : 0,
    })
  } catch (error) {
    console.error('Fetch deal pipeline error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT: Update deal pipeline stage
export async function PUT(request: NextRequest, context: any) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: dealId } = context.params
    const { newStage, progressPercent, estimatedClosingDate, reason, notes } = await request.json()

    if (!newStage) {
      return NextResponse.json({ error: 'Missing newStage' }, { status: 400 })
    }

    // Get current pipeline
    const deal = await prisma.deal.findUnique({
      where: { id: dealId },
      include: { pipeline: true },
    })

    if (!deal) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 })
    }

    if (deal.sellerId !== session.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const currentStage = deal.pipeline?.currentStage

    // Update pipeline
    const updatedPipeline = await prisma.dealPipeline.update({
      where: { dealId },
      data: {
        currentStage: newStage,
        progressPercent: progressPercent || (newStage === 'CLOSED' ? 100 : deal.pipeline?.progressPercent || 0),
        stageStartedAt: new Date(),
        estimatedClosingDate: estimatedClosingDate ? new Date(estimatedClosingDate) : deal.pipeline?.estimatedClosingDate,
      },
    })

    // Record progression history
    if (currentStage && currentStage !== newStage) {
      await prisma.dealProgressionHistory.create({
        data: {
          dealId,
          fromStage: currentStage,
          toStage: newStage,
          changedById: session.userId,
          reason: reason || undefined,
          notes: notes || undefined,
        },
      })
    }

    // Create notification for buyer (if visible to them)
    if (updatedPipeline.visibleToBuyer) {
      // Get buyers with access to this deal
      const requests = await prisma.dataRoomRequest.findMany({
        where: {
          dealId,
          status: 'NDA_SIGNED',
        },
        select: { buyerId: true },
      })

      // Notify each buyer
      for (const req of requests) {
        await prisma.notification.create({
          data: {
            recipientId: req.buyerId,
            type: 'SYSTEM',
            title: `Deal Progress: ${deal.title}`,
            message: `The deal has progressed to ${newStage} stage${reason ? ': ' + reason : ''}`,
            dealId,
            relatedId: dealId,
          },
        })
      }
    }

    return NextResponse.json({
      pipeline: updatedPipeline,
      message: `Deal moved to ${newStage} stage`,
    })
  } catch (error) {
    console.error('Update pipeline error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

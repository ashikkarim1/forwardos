import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getSession } from '@/lib/auth'

const prisma = new PrismaClient()

// POST: Publish a deal (triggers KYC verification checks)
export async function POST(request: NextRequest, context: any) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: dealId } = context.params

    if (!dealId) {
      return NextResponse.json({ error: 'Missing dealId' }, { status: 400 })
    }

    // Get the deal
    const deal = await prisma.deal.findUnique({
      where: { id: dealId },
      include: {
        seller: {
          select: {
            id: true,
            kycStatus: true,
            name: true,
            email: true,
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

    // Check KYC status
    if (deal.seller.kycStatus !== 'VERIFIED') {
      return NextResponse.json({
        error: 'KYC verification required before publishing',
        kycStatus: deal.seller.kycStatus,
        requiredStatus: 'VERIFIED',
      }, { status: 400 })
    }

    // Validate deal has required fields
    if (!deal.title || !deal.industry || !deal.estimatedValuation) {
      return NextResponse.json({
        error: 'Deal missing required fields: title, industry, estimatedValuation',
      }, { status: 400 })
    }

    // Update deal status to PUBLISHED
    const publishedDeal = await prisma.deal.update({
      where: { id: dealId },
      data: {
        status: 'PUBLISHED',
        publishedAt: new Date(),
      },
      include: {
        seller: { select: { name: true, email: true } },
      },
    })

    // Create data room for this deal
    const dataRoom = await prisma.dataRoom.create({
      data: {
        dealId: publishedDeal.id,
        createdAt: new Date(),
      },
    })

    return NextResponse.json({
      deal: publishedDeal,
      dataRoom,
      message: 'Deal published successfully. Data room created.',
    })
  } catch (error) {
    console.error('Publish deal error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

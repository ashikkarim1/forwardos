import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { retrieveCheckoutSession } from '@/lib/services/stripe'
import { sendApprovalNotification } from '@/lib/services/email'

interface VerifyRequest {
  sessionId: string
  dealId: string
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as VerifyRequest

    if (!body.sessionId || !body.dealId) {
      return NextResponse.json(
        { error: 'Missing session or deal ID' },
        { status: 400 }
      )
    }

    // ========== VERIFY STRIPE SESSION ==========
    const session = await retrieveCheckoutSession(body.sessionId)

    if (!session || session.payment_status !== 'paid') {
      return NextResponse.json(
        { error: 'Payment not confirmed' },
        { status: 400 }
      )
    }

    // ========== FETCH DEAL & USER ==========
    const deal = await prisma.deal.findUnique({
      where: { id: body.dealId },
      include: { seller: true },
    })

    if (!deal || !deal.seller) {
      return NextResponse.json(
        { error: 'Deal not found' },
        { status: 404 }
      )
    }

    // ========== CREATE SUBSCRIPTION IN DB ==========
    let subscription = await prisma.subscription.findUnique({
      where: { userId: deal.sellerId },
    })

    if (!subscription) {
      subscription = await prisma.subscription.create({
        data: {
          userId: deal.sellerId,
          planTier: 'PROFESSIONAL', // Premium tier
          status: 'ACTIVE',
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          stripeSubscriptionId: `sub_${Date.now()}`,
          monthlyPrice: 9900, // $99/month in cents
        },
      })
    } else {
      subscription = await prisma.subscription.update({
        where: { userId: deal.sellerId },
        data: {
          status: 'ACTIVE',
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      })
    }

    // ========== ACTIVATE LISTING ==========
    await prisma.deal.update({
      where: { id: body.dealId },
      data: {
        status: 'ACTIVE',
      },
    })

    await prisma.user.update({
      where: { id: deal.sellerId },
      data: {
        listingApprovalStatus: 'ACTIVE',
      },
    })

    // ========== SEND CONFIRMATION EMAIL ==========
    await sendApprovalNotification(deal.seller.email, deal.seller.name, deal.title)

    // ========== LOG TRANSACTION ==========
    await prisma.transaction.create({
      data: {
        dealId: body.dealId,
        initiatorId: deal.sellerId,
        transactionType: 'DEAL_CLOSED',
        amount: BigInt(9900), // $99 in cents
        currency: 'USD',
        status: 'completed',
        completedAt: new Date(),
        description: 'Premium seller listing payment',
        referenceId: body.sessionId,
      },
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Payment verified and listing activated',
        dealId: body.dealId,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[API] Payment verification error:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Payment verification failed',
      },
      { status: 500 }
    )
  }
}

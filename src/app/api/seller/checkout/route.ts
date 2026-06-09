import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createCheckoutSession } from '@/lib/services/stripe'

interface CheckoutRequest {
  dealId: string
  planTier: 'premium'
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as CheckoutRequest

    if (!body.dealId || body.planTier !== 'premium') {
      return NextResponse.json(
        { error: 'Invalid checkout request' },
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
        { error: 'Deal or seller not found' },
        { status: 404 }
      )
    }

    // ========== CREATE STRIPE CHECKOUT SESSION ==========
    const checkoutSession = await createCheckoutSession({
      dealId: body.dealId,
      userId: deal.sellerId,
      userEmail: deal.seller.email,
      userName: deal.seller.name,
      planTier: 'premium',
    })

    return NextResponse.json(
      {
        success: true,
        checkoutUrl: checkoutSession.url,
        sessionId: checkoutSession.sessionId,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[API] Checkout error:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to create checkout',
      },
      { status: 500 }
    )
  }
}

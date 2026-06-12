/**
 * POST /api/broker/checkout
 *
 * Generates a Stripe Checkout Session for the Broker Pro tier ($599/mo).
 * Auth-gated: identifies the user from the session cookie. The webhook
 * flips User.brokerPlanTier to BROKER_PRO on `checkout.session.completed`.
 */
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { createCheckoutSession } from '@/lib/services/stripe'

export async function POST() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Sign in to upgrade.' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { id: true, email: true, name: true },
    })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const checkout = await createCheckoutSession({
      userId: user.id,
      userEmail: user.email,
      userName: user.name ?? undefined,
      planTier: 'broker_pro',
      successPath: '/dashboard/broker?upgraded=1',
      cancelPath: '/pricing',
    })

    return NextResponse.json({
      success: true,
      checkoutUrl: checkout.url,
      sessionId: checkout.sessionId,
    })
  } catch (err) {
    console.error('[API] Broker checkout error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to create checkout' },
      { status: 500 },
    )
  }
}

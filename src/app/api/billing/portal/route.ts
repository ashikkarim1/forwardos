/**
 * POST /api/billing/portal
 *
 * Creates a Stripe Customer Portal session so the signed-in user can update
 * their payment method, view invoices, or cancel without contacting support.
 * Requires the user to have a stripeCustomerId on their User row (set by the
 * webhook on first checkout completion).
 *
 * Configure the portal once in Stripe dashboard:
 *   Settings → Billing → Customer portal → activate + brand it.
 */
import Stripe from 'stripe'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

const secretKey = process.env.STRIPE_SECRET_KEY
const stripe = secretKey ? new Stripe(secretKey) : null

export async function POST() {
  try {
    if (!stripe) {
      return NextResponse.json({ error: 'Billing not configured.' }, { status: 503 })
    }

    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Sign in to manage billing.' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { stripeCustomerId: true },
    })

    if (!user?.stripeCustomerId) {
      // User hasn't completed a paid checkout yet — nothing to manage.
      return NextResponse.json(
        { error: 'No active subscription to manage. Subscribe first.' },
        { status: 400 },
      )
    }

    const appUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.forwardos.ai'
    const portal = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${appUrl}/dashboard`,
    })

    return NextResponse.json({ url: portal.url })
  } catch (err) {
    console.error('[API] Portal error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to open portal' },
      { status: 500 },
    )
  }
}

/**
 * GET /api/billing/checkout?tier=BUYER_PREMIUM | SELLER_PREMIUM | BROKER_PRO
 *
 * Single canonical entry point used by all "Upgrade" CTAs on the pricing page.
 * Routes the click → the right Stripe Checkout Session → 302 to checkout.stripe.com.
 *
 * Behavior:
 *  - Unauthenticated → redirect to /auth/signup?redirect=/api/billing/checkout?tier=X
 *  - Authenticated → create checkout session and 302 to the Stripe-hosted URL
 *  - Unknown tier → 400
 *  - Seller flow here is the *account-level* premium (no dealId); per-deal
 *    listing upgrades still flow through /api/seller/checkout from the
 *    dashboard.
 */
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { createCheckoutSession, type PlanTier } from '@/lib/services/stripe'

const TIER_MAP: Record<string, { plan: PlanTier; successPath: string }> = {
  BUYER_PREMIUM:  { plan: 'buyer_premium',  successPath: '/dashboard/buyer?upgraded=1'  },
  SELLER_PREMIUM: { plan: 'seller_premium', successPath: '/dashboard/seller?upgraded=1' },
  BROKER_PRO:     { plan: 'broker_pro',     successPath: '/dashboard/broker?upgraded=1' },
}

export async function GET(req: NextRequest) {
  const tier = req.nextUrl.searchParams.get('tier') || ''
  const mapped = TIER_MAP[tier]

  if (!mapped) {
    return NextResponse.json(
      { error: `Unknown tier "${tier}". Use BUYER_PREMIUM, SELLER_PREMIUM, or BROKER_PRO.` },
      { status: 400 },
    )
  }

  const session = await getSession()

  if (!session) {
    // Funnel through signup, then bounce them right back to checkout once auth'd.
    const back = `/api/billing/checkout?tier=${encodeURIComponent(tier)}`
    return NextResponse.redirect(new URL(`/auth/signup?redirect=${encodeURIComponent(back)}`, req.url))
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true, email: true, name: true,
      buyerPlanTier: true, sellerPlanTier: true, brokerPlanTier: true,
    },
  })
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  // Guard against double-subscribing. If the user already has the tier
  // they're trying to buy, send them to the Customer Portal to manage
  // (downgrade / cancel / update card) instead of creating a duplicate
  // Stripe subscription that would charge them again.
  if (isAlreadyOnTier(tier, user)) {
    return NextResponse.redirect(new URL('/account/billing?already=1', req.url))
  }

  try {
    const checkout = await createCheckoutSession({
      userId: user.id,
      userEmail: user.email,
      userName: user.name ?? undefined,
      planTier: mapped.plan,
      successPath: mapped.successPath,
      cancelPath: '/pricing',
    })
    return NextResponse.redirect(checkout.url, { status: 303 })
  } catch (err) {
    console.error('[API] Billing checkout error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to create checkout' },
      { status: 500 },
    )
  }
}

function isAlreadyOnTier(
  tier: string,
  user: { buyerPlanTier: string | null; sellerPlanTier: string | null; brokerPlanTier: string | null },
): boolean {
  if (tier === 'BUYER_PREMIUM')  return user.buyerPlanTier === 'PREMIUM_BUYER'
  if (tier === 'SELLER_PREMIUM') return user.sellerPlanTier === 'PREMIUM'
  if (tier === 'BROKER_PRO')     return user.brokerPlanTier === 'BROKER_PRO'
  return false
}

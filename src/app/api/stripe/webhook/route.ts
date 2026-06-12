// Stripe webhook — verifies the signature and processes subscription lifecycle
// events. Configure the endpoint URL + signing secret (STRIPE_WEBHOOK_SECRET) in
// the Stripe dashboard. No-ops safely until Stripe is configured.
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { constructWebhookEvent, stripeEnabled } from '@/lib/services/stripe'
import { logAudit } from '@/lib/audit'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  if (!stripeEnabled) return NextResponse.json({ received: true, note: 'stripe-not-configured' })

  const sig = req.headers.get('stripe-signature') || ''
  const raw = await req.text() // raw body required for signature verification

  let event
  try {
    event = constructWebhookEvent(raw, sig)
  } catch (err) {
    return NextResponse.json({ error: `Webhook signature failed: ${(err as Error).message}` }, { status: 400 })
  }
  if (!event) return NextResponse.json({ received: true })

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const s = event.data.object as { metadata?: Record<string, string>; customer?: string; subscription?: string }
        const { userId, dealId, planTier } = s.metadata || {}
        if (userId) {
          // Map the plan tier → which column to flip. 'premium' is the legacy
          // alias for seller premium (kept for backwards compat with existing
          // /api/seller/checkout flow).
          const update: Record<string, unknown> = {}
          if (planTier === 'premium' || planTier === 'seller_premium') {
            update.sellerPlanTier = 'PREMIUM'
          } else if (planTier === 'buyer_premium') {
            update.buyerPlanTier = 'PREMIUM_BUYER'
          } else if (planTier === 'broker_pro') {
            update.brokerPlanTier = 'BROKER_PRO'
          }
          // Always cache the Stripe customer ID so the Customer Portal works.
          if (s.customer) update.stripeCustomerId = s.customer

          if (Object.keys(update).length > 0) {
            await prisma.user.update({ where: { id: userId }, data: update }).catch(() => {})
          }
        }
        if (dealId && (planTier === 'premium' || planTier === 'seller_premium')) {
          await prisma.deal.update({ where: { id: dealId }, data: { status: 'ACTIVE' } }).catch(() => {})
        }
        await logAudit({ action: 'stripe.checkout.completed', resourceType: 'subscription', resourceId: s.subscription || null, changes: { userId, planTier } })
        break
      }
      case 'customer.subscription.deleted': {
        // Downgrade the user back to free across whichever tier the sub covered.
        const sub = event.data.object as { metadata?: Record<string, string> }
        const { userId, planTier } = sub.metadata || {}
        if (userId) {
          const downgrade: Record<string, unknown> = {}
          if (planTier === 'premium' || planTier === 'seller_premium') downgrade.sellerPlanTier = 'FREEMIUM'
          else if (planTier === 'buyer_premium') downgrade.buyerPlanTier = 'FREE'
          else if (planTier === 'broker_pro') downgrade.brokerPlanTier = 'NONE'
          if (Object.keys(downgrade).length > 0) {
            await prisma.user.update({ where: { id: userId }, data: downgrade }).catch(() => {})
          }
        }
        await logAudit({ action: `stripe.${event.type}`, resourceType: 'subscription', resourceId: (event.data.object as { id?: string }).id || null })
        break
      }
      case 'customer.subscription.updated': {
        await logAudit({ action: `stripe.${event.type}`, resourceType: 'subscription', resourceId: (event.data.object as { id?: string }).id || null })
        break
      }
      default:
        break
    }
  } catch (err) {
    console.error('[stripe webhook] handler error:', err)
    // Return 200 so Stripe doesn't retry on our internal handling errors.
  }

  return NextResponse.json({ received: true })
}

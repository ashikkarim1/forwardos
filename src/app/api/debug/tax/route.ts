/**
 * GET /api/debug/tax — one-shot diagnostic to confirm Stripe Tax wiring
 * is healthy after dashboard activation. Returns each price's tax_behavior
 * (inclusive / exclusive / unspecified) + creates a sample session so we
 * can see Stripe's tax estimate on a $199 sub for an AE buyer.
 * Delete after the once-over.
 */
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

export const dynamic = 'force-dynamic'

export async function GET(_req: NextRequest) {
  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) return NextResponse.json({ error: 'STRIPE_SECRET_KEY not set' }, { status: 500 })
  const stripe = new Stripe(secretKey)
  const out: Record<string, unknown> = {}

  // Per-price tax_behavior (inclusive | exclusive | unspecified)
  const priceVars = ['STRIPE_PRICE_SELLER_PREMIUM', 'STRIPE_PRICE_BUYER_PREMIUM', 'STRIPE_PRICE_BROKER_PRO'] as const
  const prices: Record<string, unknown> = {}
  for (const v of priceVars) {
    const id = process.env[v]
    if (!id) { prices[v] = { error: 'env var not set' }; continue }
    try {
      const p = await stripe.prices.retrieve(id)
      prices[v] = { id: p.id, taxBehavior: p.tax_behavior, unitAmount: p.unit_amount, currency: p.currency }
    } catch (e) {
      prices[v] = { id, error: e instanceof Error ? e.message : String(e) }
    }
  }
  out.prices = prices

  // Sample checkout session — inspect total + tax breakdown.
  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer_email: 'diag-buyer@forwardos.ai',
      line_items: [{ price: process.env.STRIPE_PRICE_SELLER_PREMIUM!, quantity: 1 }],
      success_url: 'https://www.forwardos.ai/seller/checkout/success?sessionId={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://www.forwardos.ai/pricing',
      billing_address_collection: 'required',
      tax_id_collection: { enabled: true },
      automatic_tax: { enabled: true },
      customer_update: { address: 'auto', name: 'auto' },
    })
    out.sampleSession = {
      id: session.id,
      status: session.status,
      currency: session.currency,
      amountSubtotal: session.amount_subtotal,
      amountTotal: session.amount_total,
      totalDetails: session.total_details,
      automaticTaxStatus: session.automatic_tax?.status,
      automaticTaxEnabled: session.automatic_tax?.enabled,
    }
  } catch (e) {
    out.sampleSessionError = e instanceof Error ? e.message : String(e)
  }

  return NextResponse.json(out, { status: 200 })
}

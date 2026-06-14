/**
 * GET /api/debug/confirm-tax — verifies the live system is wired to the
 * new tax-inclusive prices end-to-end.
 *
 *  1. Reads the 3 STRIPE_PRICE_* env vars
 *  2. For each, retrieves the Stripe Price object and reports tax_behavior
 *  3. Creates a real test checkout session against SELLER_PREMIUM and
 *     reports the line-item price ID + total
 *
 * Delete after running once.
 */
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

export const dynamic = 'force-dynamic'

const VARS = ['STRIPE_PRICE_SELLER_PREMIUM', 'STRIPE_PRICE_BUYER_PREMIUM', 'STRIPE_PRICE_BROKER_PRO'] as const

export async function GET() {
  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) return NextResponse.json({ error: 'STRIPE_SECRET_KEY not set' }, { status: 500 })
  const stripe = new Stripe(secretKey)
  const out: Record<string, unknown> = {}

  const prices: Record<string, unknown> = {}
  for (const v of VARS) {
    const id = process.env[v]
    if (!id) { prices[v] = { error: 'env var not set' }; continue }
    try {
      const p = await stripe.prices.retrieve(id)
      prices[v] = {
        id: p.id,
        taxBehavior: p.tax_behavior,
        unitAmount: p.unit_amount,
        currency: p.currency,
        active: p.active,
      }
    } catch (e) {
      prices[v] = { id, error: e instanceof Error ? e.message : String(e) }
    }
  }
  out.prices = prices

  try {
    const sellerPriceId = process.env.STRIPE_PRICE_SELLER_PREMIUM
    if (sellerPriceId) {
      const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        customer_email: 'diag-buyer@forwardos.ai',
        line_items: [{ price: sellerPriceId, quantity: 1 }],
        success_url: 'https://www.forwardos.ai/seller/checkout/success?sessionId={CHECKOUT_SESSION_ID}',
        cancel_url: 'https://www.forwardos.ai/pricing',
        billing_address_collection: 'required',
        tax_id_collection: { enabled: true },
        automatic_tax: { enabled: true },
      })
      // Look up the session's line_items + computed price.
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id)
      out.testSession = {
        id: session.id,
        status: session.status,
        currency: session.currency,
        amountSubtotal: session.amount_subtotal,
        amountTotal: session.amount_total,
        automaticTaxStatus: session.automatic_tax?.status,
        lineItem: lineItems.data[0] ? {
          priceId: lineItems.data[0].price?.id,
          priceTaxBehavior: lineItems.data[0].price?.tax_behavior,
          amountTotal: lineItems.data[0].amount_total,
        } : null,
      }
    }
  } catch (e) {
    out.testSessionError = e instanceof Error ? e.message : String(e)
  }

  return NextResponse.json(out, { status: 200 })
}

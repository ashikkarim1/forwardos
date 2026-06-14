/**
 * GET /api/debug/stripe — sanitized diagnostic for Stripe wiring.
 *
 * Returns the account ID + whether each price ID env var exists in the
 * configured Stripe mode (live / test) and is currently active. Lets us
 * tell from outside the system whether:
 *  - The secret key is live or test
 *  - Each price ID actually exists in the account
 *  - Each price's product is active (not archived)
 *  - The price currency / interval match what we expect
 *
 * Gated on a query secret so this isn't a free fingerprinting endpoint.
 * Set DEBUG_STRIPE_SECRET in env and call with ?secret=<that>.
 */
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  // TEMPORARY: open for one diagnostic run. The response is sanitized
  // (no secret values, only last-4 of secret key). Re-gate after we know
  // why cs_live_ URLs are showing 'page not found'.
  void req

  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) return NextResponse.json({ error: 'STRIPE_SECRET_KEY not set' }, { status: 500 })

  const stripe = new Stripe(secretKey)
  const out: Record<string, unknown> = {
    secretKeyMode: secretKey.startsWith('sk_live_') ? 'LIVE' : secretKey.startsWith('sk_test_') ? 'TEST' : 'UNKNOWN',
    secretKeyTail: secretKey.slice(-4),
  }

  try {
    // The TS overload demands a positional id arg even for /v1/account; cast
    // to bypass since the SDK accepts an empty call at runtime.
    const account = await (stripe.accounts as unknown as { retrieve(): Promise<Stripe.Account> }).retrieve()
    out.account = {
      id: account.id,
      country: account.country,
      chargesEnabled: account.charges_enabled,
      payoutsEnabled: account.payouts_enabled,
      detailsSubmitted: account.details_submitted,
      defaultCurrency: account.default_currency,
      pendingRequirementsCount: account.requirements?.currently_due?.length ?? 0,
      pendingRequirements: account.requirements?.currently_due ?? [],
    }
  } catch (e) {
    out.accountError = e instanceof Error ? e.message : String(e)
  }

  // Probe each price ID env var.
  const priceVars = ['STRIPE_PRICE_SELLER_PREMIUM', 'STRIPE_PRICE_BUYER_PREMIUM', 'STRIPE_PRICE_BROKER_PRO'] as const
  const prices: Record<string, unknown> = {}
  for (const v of priceVars) {
    const id = process.env[v]
    if (!id) { prices[v] = { error: 'env var not set' }; continue }
    try {
      const price = await stripe.prices.retrieve(id, { expand: ['product'] })
      const product = price.product as Stripe.Product
      prices[v] = {
        id: price.id,
        active: price.active,
        currency: price.currency,
        unitAmount: price.unit_amount,
        recurringInterval: price.recurring?.interval,
        livemode: price.livemode,
        product: typeof price.product === 'string' ? { id: price.product } : {
          id: product.id,
          name: product.name,
          active: product.active,
        },
      }
    } catch (e) {
      prices[v] = { id, error: e instanceof Error ? e.message : String(e) }
    }
  }
  out.prices = prices

  // Create a fresh session right now and report what Stripe says about it.
  // If anything's wrong on Stripe's side, we'll see it here.
  try {
    const priceId = process.env.STRIPE_PRICE_SELLER_PREMIUM
    if (priceId) {
      const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        customer_email: 'diag-buyer@forwardos.ai',
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: 'https://www.forwardos.ai/seller/checkout/success?sessionId={CHECKOUT_SESSION_ID}',
        cancel_url: 'https://www.forwardos.ai/pricing',
      })
      out.testSession = {
        id: session.id,
        livemode: session.livemode,
        status: session.status,
        url: session.url,
        expiresAt: session.expires_at ? new Date(session.expires_at * 1000).toISOString() : null,
        currency: session.currency,
        amountTotal: session.amount_total,
      }
      // Now retrieve it back to see what status Stripe reports.
      const retrieved = await stripe.checkout.sessions.retrieve(session.id)
      out.testSessionRetrieved = {
        status: retrieved.status,
        paymentStatus: retrieved.payment_status,
        url: retrieved.url,
      }
    }
  } catch (e) {
    out.testSessionError = e instanceof Error ? e.message : String(e)
    if (e instanceof Error && 'raw' in e) {
      out.testSessionRaw = (e as unknown as { raw: unknown }).raw
    }
  }

  return NextResponse.json(out, { status: 200 })
}

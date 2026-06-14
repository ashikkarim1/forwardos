/**
 * POST /api/debug/recreate-prices — one-shot helper.
 *
 * For each of the 3 paid tiers:
 *   1. Look up the current price → grab its product + amount + currency + interval
 *   2. Create a NEW price on the same product with tax_behavior='inclusive'
 *   3. Return the new price IDs so the operator can update Vercel env vars
 *
 * Does NOT archive the old prices — that's done manually after env vars
 * are flipped + a smoke test passes, so an in-flight checkout session can't
 * break.
 *
 * Delete this endpoint after running once.
 */
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

export const dynamic = 'force-dynamic'

const SOURCE_VARS = [
  'STRIPE_PRICE_SELLER_PREMIUM',
  'STRIPE_PRICE_BUYER_PREMIUM',
  'STRIPE_PRICE_BROKER_PRO',
] as const

export async function POST() {
  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) return NextResponse.json({ error: 'STRIPE_SECRET_KEY not set' }, { status: 500 })
  const stripe = new Stripe(secretKey)

  const results: Record<string, unknown> = {}
  for (const v of SOURCE_VARS) {
    const oldId = process.env[v]
    if (!oldId) { results[v] = { error: 'env var not set' }; continue }

    try {
      const old = await stripe.prices.retrieve(oldId, { expand: ['product'] })
      const product = typeof old.product === 'string' ? old.product : old.product.id

      if (old.tax_behavior === 'inclusive') {
        results[v] = {
          oldId,
          newId: oldId,
          note: 'already inclusive — no new price created',
        }
        continue
      }

      const fresh = await stripe.prices.create({
        product,
        currency: old.currency,
        unit_amount: old.unit_amount ?? undefined,
        recurring: old.recurring ? {
          interval: old.recurring.interval,
          interval_count: old.recurring.interval_count,
        } : undefined,
        tax_behavior: 'inclusive',
      })

      results[v] = {
        oldId,
        newId: fresh.id,
        amount: fresh.unit_amount,
        currency: fresh.currency,
        taxBehavior: fresh.tax_behavior,
        note: `Set ${v}=${fresh.id} in Vercel + redeploy. Then archive ${oldId} in Stripe dashboard.`,
      }
    } catch (e) {
      results[v] = { oldId, error: e instanceof Error ? e.message : String(e) }
    }
  }

  return NextResponse.json({ results }, { status: 200 })
}

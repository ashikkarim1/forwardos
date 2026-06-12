/**
 * Deprecated. The live checkout flow runs through /api/seller/checkout, which
 * calls `createCheckoutSession()` in src/lib/services/stripe.ts with real
 * Stripe price IDs. This endpoint used to return a mocked session id from a
 * stale pricing config — gone now so it can't accidentally be wired into a
 * paid surface.
 */
import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json(
    { error: 'Use /api/seller/checkout for paid plans.' },
    { status: 410 },
  )
}

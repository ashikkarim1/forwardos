/**
 * Stripe Integration Service.
 *
 * Uses the real Stripe SDK when STRIPE_SECRET_KEY is set; otherwise runs in a
 * safe mock mode (logs + fake session) so the flow works in dev without keys.
 * Plans map to price IDs via env — set these in your Stripe dashboard + Vercel:
 *   STRIPE_PRICE_SELLER_PREMIUM  (seller Premium, $199/mo)
 *   STRIPE_PRICE_BUYER_PREMIUM   (buyer Premium, $99/mo)
 *   STRIPE_PRICE_BROKER_PRO      (broker Pro, $599/mo)
 *
 * Plan tier aliases: legacy code passes `premium` for seller premium; we keep
 * that mapping so existing checkout calls don't break.
 */
import Stripe from 'stripe'

export type PlanTier =
  | 'premium'        // legacy alias for seller_premium
  | 'seller_premium'
  | 'buyer_premium'
  | 'broker_pro'

const secretKey = process.env.STRIPE_SECRET_KEY
export const stripeEnabled = Boolean(secretKey)
const stripe = secretKey ? new Stripe(secretKey) : null

const PRICE_ENV: Record<PlanTier, string> = {
  premium: 'STRIPE_PRICE_SELLER_PREMIUM',         // legacy
  seller_premium: 'STRIPE_PRICE_SELLER_PREMIUM',
  buyer_premium: 'STRIPE_PRICE_BUYER_PREMIUM',
  broker_pro: 'STRIPE_PRICE_BROKER_PRO',
}
function priceFor(plan: PlanTier): string | undefined {
  return process.env[PRICE_ENV[plan]]
}
function appUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || process.env.APP_URL || 'http://localhost:3000'
}

interface CreateCheckoutSessionOptions {
  dealId?: string
  userId: string
  userEmail: string
  userName?: string
  planTier: PlanTier
  successPath?: string
  cancelPath?: string
}
interface CheckoutSession { sessionId: string; url: string; mocked?: boolean }

export async function createCheckoutSession(options: CreateCheckoutSessionOptions): Promise<CheckoutSession> {
  const success = `${appUrl()}${options.successPath || `/seller/checkout/success`}?sessionId={CHECKOUT_SESSION_ID}${options.dealId ? `&dealId=${options.dealId}` : ''}`
  const cancel = `${appUrl()}${options.cancelPath || '/pricing'}`

  if (!stripe) {
    const mockSessionId = `cs_mock_${Date.now()}`
    console.log('[STRIPE:mock] checkout session', { plan: options.planTier, email: options.userEmail })
    return { sessionId: mockSessionId, url: `${appUrl()}/seller/checkout/success?sessionId=${mockSessionId}${options.dealId ? `&dealId=${options.dealId}` : ''}`, mocked: true }
  }

  const price = priceFor(options.planTier)
  if (!price) throw new Error(`Missing price ID for "${options.planTier}". Set ${PRICE_ENV[options.planTier]} in your environment.`)

  // Tax-compliance config — non-negotiable. Stripe needs the buyer's billing
  // address to:
  //   - Substantiate zero-rated VAT exports out of the UAE (FTA audit evidence)
  //   - Apply correct EU/UK VAT rate when Stripe Tax is on
  //   - Determine US/Canada sales-tax nexus
  //   - Match 2-piece location evidence for EU B2C digital services
  // tax_id_collection lets B2B customers enter a VAT/GST number so the sale
  // is reverse-charged to them and we don't owe their local VAT.
  // automatic_tax: { enabled: true } only fires when Stripe Tax is activated
  // in the dashboard (Settings → Tax). Until then it's a no-op; turning it
  // on in Stripe makes calculations + filing automatic — no code change needed.
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer_email: options.userEmail,
    line_items: [{ price, quantity: 1 }],
    success_url: success,
    cancel_url: cancel,
    billing_address_collection: 'required',
    tax_id_collection: { enabled: true },
    automatic_tax: { enabled: true },
    // customer_update is only valid alongside a customer: ID for an existing
    // Stripe customer. We use customer_email and let Stripe create a new
    // customer; address is auto-attached during checkout, so no need to set it.
    metadata: { userId: options.userId, dealId: options.dealId || '', planTier: options.planTier },
    subscription_data: { metadata: { userId: options.userId, planTier: options.planTier } },
  })
  return { sessionId: session.id, url: session.url || cancel }
}

export async function retrieveCheckoutSession(sessionId: string) {
  if (!stripe) return { id: sessionId, payment_status: 'paid', mocked: true } as { id: string; payment_status: string; mocked?: boolean }
  return stripe.checkout.sessions.retrieve(sessionId)
}

/** Construct & verify a webhook event from the raw body + signature. */
export function constructWebhookEvent(rawBody: string, signature: string): Stripe.Event | null {
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) return null
  return stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET)
}

export async function cancelSubscription(subscriptionId: string, immediate = false) {
  if (!stripe) { console.log('[STRIPE:mock] cancel', subscriptionId); return }
  if (immediate) await stripe.subscriptions.cancel(subscriptionId)
  else await stripe.subscriptions.update(subscriptionId, { cancel_at_period_end: true })
}

export async function getPaymentMethods(stripeCustomerId: string) {
  if (!stripe) return []
  const methods = await stripe.paymentMethods.list({ customer: stripeCustomerId, type: 'card' })
  return methods.data
}

/**
 * /account/billing — single page that handles the full plan lifecycle.
 *
 * Shows all 3 tier slots (Buyer / Seller / Broker), each in one of three
 * states with a different primary action:
 *
 *  - FREE / NONE     → "Upgrade to {tier}" → /api/billing/checkout?tier=…
 *  - PAID (active)   → "Manage in portal" → /api/billing/portal
 *  - PAID + canceled → "Reactivate" → /api/billing/portal
 *
 * The tier slots are independent — a buyer can also be a seller, etc.
 * Each one carries its own subscription on the Stripe side and its own
 * plan-tier column on the User row.
 */
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowRight, Check, CheckCircle2, Lock, Settings, Sparkles } from 'lucide-react'
import { PublicHeader } from '@/components/Navigation'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { PRICING } from '@/lib/pricing'

export const dynamic = 'force-dynamic'

interface SlotConfig {
  name: string
  priceMonthly: number
  tierParam: 'BUYER_PREMIUM' | 'SELLER_PREMIUM' | 'BROKER_PRO'
  features: string[]
}

const SLOTS: Record<'buyer' | 'seller' | 'broker', SlotConfig> = {
  buyer: {
    name: 'Buyer Premium',
    priceMonthly: PRICING.buyer.premium.monthly,
    tierParam: 'BUYER_PREMIUM',
    features: [
      'Early access to new listings (24–48h ahead)',
      'Advanced AI matching',
      'Market analytics & comparables',
      'Acquisition scoring on every listing',
    ],
  },
  seller: {
    name: 'Seller Premium',
    priceMonthly: PRICING.seller.premium.monthly,
    tierParam: 'SELLER_PREMIUM',
    features: [
      'Featured marketplace placement',
      'AI valuation + listing enhancement',
      'Performance analytics',
      'Lead management + curated outbound',
    ],
  },
  broker: {
    name: 'Broker Pro',
    priceMonthly: PRICING.broker.pro.monthly,
    tierParam: 'BROKER_PRO',
    features: [
      'Unlimited listings',
      'Built-in CRM + AI prospecting',
      'Marketing automation',
      'In-app deal room + analytics',
    ],
  },
}

export default async function BillingPage({ searchParams }: { searchParams: { already?: string } }) {
  const session = await getSession()
  if (!session) redirect('/auth/login?redirect=%2Faccount%2Fbilling')

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      buyerPlanTier: true, sellerPlanTier: true, brokerPlanTier: true,
      stripeCustomerId: true,
    },
  })

  const slots = [
    {
      ...SLOTS.buyer,
      active: user?.buyerPlanTier === 'PREMIUM_BUYER',
    },
    {
      ...SLOTS.seller,
      active: user?.sellerPlanTier === 'PREMIUM',
    },
    {
      ...SLOTS.broker,
      active: user?.brokerPlanTier === 'BROKER_PRO',
    },
  ]

  const hasPortal = !!user?.stripeCustomerId

  return (
    <div style={{ minHeight: '100vh', background: '#FAF6EF' }}>
      <PublicHeader />
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '48px 24px' }}>
        <p style={{
          fontSize: 11, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase',
          color: '#8C6D45', margin: 0, marginBottom: 8,
        }}>Account · Billing</p>
        <h1 style={{ fontSize: 36, fontWeight: 800, color: '#0F1419', margin: 0, marginBottom: 12 }}>
          Plans & subscriptions
        </h1>
        <p style={{ fontSize: 16, color: '#454D58', maxWidth: 640, margin: 0, marginBottom: 32 }}>
          Each plan is independent — you can hold one, two, or all three at the same time. Downgrades and cancellations happen in the Stripe Customer Portal so your billing history stays in one place.
        </p>

        {searchParams?.already && (
          <div style={{
            background: '#FFFAE6', border: '1px solid #FFEEB5', color: '#7A3608',
            borderRadius: 10, padding: '14px 18px', marginBottom: 24, display: 'flex', gap: 12,
            alignItems: 'flex-start',
          }}>
            <CheckCircle2 size={20} style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <strong>You&apos;re already on that plan.</strong> Use the Manage button on the right to update payment, cancel, or downgrade.
            </div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {slots.map((slot) => (
            <Slot
              key={slot.tierParam}
              name={slot.name}
              priceMonthly={slot.priceMonthly}
              tierParam={slot.tierParam}
              features={slot.features}
              active={slot.active}
              hasPortal={hasPortal}
            />
          ))}
        </div>

        {/* Single portal entry for everything (cards, invoices, downgrades) */}
        {hasPortal && (
          <div style={{
            marginTop: 32, padding: 20, borderRadius: 12,
            background: '#FFFFFF', border: '1px solid #E8EAED',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
          }}>
            <div>
              <p style={{ margin: 0, fontWeight: 700, color: '#0F1419', fontSize: 15 }}>Stripe Customer Portal</p>
              <p style={{ margin: '4px 0 0', fontSize: 13, color: '#454D58' }}>
                Update card · download invoices · pause or cancel any subscription
              </p>
            </div>
            <form action="/api/billing/portal" method="POST" style={{ flexShrink: 0 }}>
              <button style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '10px 18px', border: '1px solid #C7CCD3', borderRadius: 8,
                background: '#FFFFFF', color: '#0F1419',
                fontSize: 14, fontWeight: 600, cursor: 'pointer',
              }}>
                <Settings size={14} /> Open Customer Portal
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

function Slot({
  name, priceMonthly, tierParam, features, active, hasPortal,
}: {
  name: string
  priceMonthly: number
  tierParam: 'BUYER_PREMIUM' | 'SELLER_PREMIUM' | 'BROKER_PRO'
  features: string[]
  active: boolean
  hasPortal: boolean
}) {
  return (
    <div style={{
      background: '#FFFFFF',
      border: active ? '1px solid #D4BB8C' : '1px solid #E8EAED',
      borderRadius: 12, padding: 24,
      display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24,
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#0F1419' }}>{name}</h3>
          {active && (
            <span style={{
              fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
              color: '#1B4D3F', background: '#EAF5F0',
              padding: '3px 8px', borderRadius: 4, display: 'inline-flex', alignItems: 'center', gap: 4,
            }}>
              <CheckCircle2 size={11} /> Active
            </span>
          )}
        </div>
        <p style={{ margin: 0, marginBottom: 14, fontSize: 14, color: '#454D58' }}>
          <strong style={{ color: '#0F1419' }}>${priceMonthly}</strong>/month, tax inclusive · cancel anytime
        </p>
        <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {features.map((f) => (
            <li key={f} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 13, color: '#454D58' }}>
              <Check size={14} style={{ color: '#B8956A', marginTop: 3, flexShrink: 0 }} /> {f}
            </li>
          ))}
        </ul>
      </div>

      <div style={{ flexShrink: 0, alignSelf: 'center' }}>
        {active ? (
          hasPortal ? (
            <form action="/api/billing/portal" method="POST">
              <button style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '10px 18px', borderRadius: 8,
                background: '#FFFFFF', color: '#0F1419', border: '1px solid #C7CCD3',
                fontSize: 14, fontWeight: 600, cursor: 'pointer',
              }}>
                <Settings size={14} /> Manage
              </button>
            </form>
          ) : (
            <span style={{ fontSize: 13, color: '#6C7480' }}>Active</span>
          )
        ) : (
          <Link href={`/api/billing/checkout?tier=${tierParam}`} style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '10px 18px', borderRadius: 8,
            background: '#0F1419', color: '#FFFFFF',
            fontSize: 14, fontWeight: 600, textDecoration: 'none',
          }}>
            <Sparkles size={14} /> Upgrade <ArrowRight size={14} />
          </Link>
        )}
      </div>
    </div>
  )
}

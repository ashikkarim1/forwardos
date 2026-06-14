/**
 * <UpgradeBanner role="buyer" />
 *
 * Server component. Pulls the caller's plan tier for the given role.
 * If they're on the FREE tier for that role, renders the editorial
 * upgrade strip with a one-click link to the matching checkout.
 * If they're already paid, renders nothing.
 */
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { PRICING } from '@/lib/pricing'

interface Props {
  role: 'buyer' | 'seller' | 'broker'
}

const COPY = {
  buyer: {
    name: 'Buyer Premium',
    tierParam: 'BUYER_PREMIUM',
    pitch: 'See deals 24–48h before everyone else, plus AI matching, market analytics, and acquisition scoring.',
    price: PRICING.buyer.premium.monthly,
  },
  seller: {
    name: 'Seller Premium',
    tierParam: 'SELLER_PREMIUM',
    pitch: 'Featured placement, AI valuation, lead management, and curated outbound to our verified buyer pool.',
    price: PRICING.seller.premium.monthly,
  },
  broker: {
    name: 'Broker Pro',
    tierParam: 'BROKER_PRO',
    pitch: 'Unlimited listings, built-in CRM, AI prospecting, deal room, and analytics — everything to move deals faster.',
    price: PRICING.broker.pro.monthly,
  },
} as const

export async function UpgradeBanner({ role }: Props) {
  const session = await getSession()
  if (!session) return null

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { buyerPlanTier: true, sellerPlanTier: true, brokerPlanTier: true },
  })
  if (!user) return null

  const isPaid =
    (role === 'buyer'  && user.buyerPlanTier  === 'PREMIUM_BUYER') ||
    (role === 'seller' && user.sellerPlanTier === 'PREMIUM') ||
    (role === 'broker' && user.brokerPlanTier === 'BROKER_PRO')
  if (isPaid) return null

  const c = COPY[role]
  return (
    <div style={{
      background: 'linear-gradient(135deg, #FAF6EF 0%, #F2EAD9 100%)',
      border: '1px solid #E5D5B5',
      borderRadius: 12,
      padding: '20px 24px',
      marginBottom: 24,
      display: 'flex',
      alignItems: 'center',
      gap: 20,
      flexWrap: 'wrap',
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: 999, background: '#0F1419',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        color: '#FFFFFF', flexShrink: 0,
      }}>
        <Sparkles size={20} />
      </div>
      <div style={{ flex: 1, minWidth: 240 }}>
        <p style={{
          fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase',
          color: '#8C6D45', margin: 0, marginBottom: 4,
        }}>
          Upgrade · ${c.price}/mo · tax inclusive
        </p>
        <h3 style={{ margin: 0, marginBottom: 4, fontSize: 16, fontWeight: 700, color: '#0F1419' }}>
          Unlock {c.name}
        </h3>
        <p style={{ margin: 0, fontSize: 13, color: '#454D58', lineHeight: 1.5 }}>
          {c.pitch}
        </p>
      </div>
      <Link
        href={`/api/billing/checkout?tier=${c.tierParam}`}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '10px 18px', borderRadius: 8,
          background: '#0F1419', color: '#FFFFFF',
          fontSize: 14, fontWeight: 600, textDecoration: 'none',
          flexShrink: 0,
        }}
      >
        Upgrade <ArrowRight size={14} />
      </Link>
      <Link
        href="/account/billing"
        style={{
          fontSize: 13, fontWeight: 600, color: '#454D58',
          textDecoration: 'underline', textUnderlineOffset: 3,
          flexShrink: 0,
        }}
      >
        Manage plans
      </Link>
    </div>
  )
}

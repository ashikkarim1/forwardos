/**
 * <CapabilityGate capability={CAPABILITY.X}> — server component that
 * renders children only if the current user's plan tier covers the named
 * capability. Otherwise shows an editorial upsell card that links to the
 * matching /api/billing/checkout?tier=… upgrade path.
 *
 * Use to gate premium-only blocks inside any dashboard:
 *
 *   <CapabilityGate capability={CAPABILITY.MARKET_ANALYTICS}>
 *     <MarketAnalyticsModule />
 *   </CapabilityGate>
 *
 * Free users see "Unlock with Buyer Premium ($99/mo)" cards instead of
 * the premium UI, with a button that takes them to checkout.
 */
import { ReactNode } from 'react'
import Link from 'next/link'
import { Lock } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import {
  type Capability, CAPABILITY, TIER_CAPABILITIES, type TierId,
  hasCapability, PRICING, TIER,
} from '@/lib/pricing'

interface Props {
  capability: Capability
  children: ReactNode
  /** Optional: override the upsell card's title for context. */
  upsellTitle?: string
  /** Optional: hide the upsell card entirely (just render nothing for free users). */
  silent?: boolean
}

type UserPlanShape = {
  sellerPlanTier: 'FREEMIUM' | 'PREMIUM' | null
  buyerPlanTier:  'FREE' | 'PREMIUM_BUYER'
  brokerPlanTier: 'NONE' | 'BROKER_PRO'
} | null

export async function CapabilityGate({ capability, children, upsellTitle, silent }: Props) {
  const session = await getSession()
  if (!session) {
    return silent ? null : <CapabilityUpsell capability={capability} upsellTitle={upsellTitle} />
  }
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { sellerPlanTier: true, buyerPlanTier: true, brokerPlanTier: true },
  })
  if (allowed(user, capability)) return <>{children}</>
  return silent ? null : <CapabilityUpsell capability={capability} upsellTitle={upsellTitle} />
}

function allowed(user: UserPlanShape, cap: Capability): boolean {
  if (!user) return false
  return hasCapability(
    {
      sellerPlanTier: user.sellerPlanTier ?? null,
      buyerPlanTier:  user.buyerPlanTier  ?? 'FREE',
      brokerPlanTier: user.brokerPlanTier ?? 'NONE',
    },
    cap,
  )
}

function CapabilityUpsell({ capability, upsellTitle }: { capability: Capability; upsellTitle?: string }) {
  // Find the smallest tier that grants the capability so we link to the
  // cheapest upgrade path. Buyer Premium first (cheapest), then Seller
  // Premium, then Broker Pro.
  const ordered: TierId[] = [TIER.BUYER_PREMIUM, TIER.SELLER_PREMIUM, TIER.BROKER_PRO]
  const upgradeTier = ordered.find((t) => TIER_CAPABILITIES[t].includes(capability))

  const tierName = upgradeTier === TIER.BUYER_PREMIUM ? 'Buyer Premium'
    : upgradeTier === TIER.SELLER_PREMIUM ? 'Seller Premium'
    : upgradeTier === TIER.BROKER_PRO ? 'Broker Pro' : 'Premium'

  const tierPrice = upgradeTier === TIER.BUYER_PREMIUM ? PRICING.buyer.premium.monthly
    : upgradeTier === TIER.SELLER_PREMIUM ? PRICING.seller.premium.monthly
    : upgradeTier === TIER.BROKER_PRO ? PRICING.broker.pro.monthly : 0

  const checkoutHref = `/api/billing/checkout?tier=${upgradeTier ?? 'BUYER_PREMIUM'}`

  return (
    <div style={{
      border: '1px solid #F2EAD9',
      background: 'linear-gradient(180deg, #FAF6EF 0%, #FFFFFF 100%)',
      borderRadius: 12,
      padding: 24,
      display: 'flex',
      gap: 16,
      alignItems: 'flex-start',
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: 999, background: '#F2EAD9',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        color: '#8C6D45', flexShrink: 0,
      }}>
        <Lock size={18} />
      </div>
      <div style={{ flex: 1 }}>
        <p style={{
          fontSize: 11, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase',
          color: '#8C6D45', margin: 0, marginBottom: 6,
        }}>
          {tierName} feature
        </p>
        <h3 style={{ margin: 0, marginBottom: 8, fontSize: 18, fontWeight: 700, color: '#0F1419' }}>
          {upsellTitle || labelFor(capability)}
        </h3>
        <p style={{ margin: 0, marginBottom: 16, fontSize: 14, color: '#454D58', lineHeight: 1.55 }}>
          Upgrade to {tierName} (${tierPrice}/mo) to unlock this — and the rest of the {tierName} toolkit.
        </p>
        <Link href={checkoutHref} style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '10px 18px', borderRadius: 8,
          background: '#0F1419', color: '#FFFFFF',
          fontSize: 14, fontWeight: 600, textDecoration: 'none',
        }}>
          Upgrade to {tierName}
        </Link>
      </div>
    </div>
  )
}

function labelFor(cap: Capability): string {
  switch (cap) {
    case CAPABILITY.EARLY_ACCESS_LISTINGS:   return 'Early access to new listings'
    case CAPABILITY.ADVANCED_AI_MATCHING:    return 'Advanced AI matching'
    case CAPABILITY.MARKET_ANALYTICS:        return 'Market analytics'
    case CAPABILITY.COMPARABLE_TRANSACTIONS: return 'Comparable transactions database'
    case CAPABILITY.ACQUISITION_SCORING:     return 'AI acquisition scoring'
    case CAPABILITY.FEATURED_PLACEMENT:      return 'Featured marketplace placement'
    case CAPABILITY.AI_VALUATION:            return 'AI valuation'
    case CAPABILITY.AI_LISTING_ENHANCEMENT:  return 'AI-enhanced listing copy'
    case CAPABILITY.PERFORMANCE_ANALYTICS:   return 'Listing performance analytics'
    case CAPABILITY.LEAD_MANAGEMENT:         return 'Qualified lead management'
    case CAPABILITY.OUTBOUND_CURATED_EMAILS: return 'Outbound curated emails'
    case CAPABILITY.UNLIMITED_LISTINGS:      return 'Unlimited listings'
    case CAPABILITY.CRM:                     return 'Built-in CRM'
    case CAPABILITY.AI_PROSPECTING:          return 'AI prospecting'
    case CAPABILITY.MARKETING_AUTOMATION:    return 'Marketing automation'
    case CAPABILITY.DEAL_ROOM:               return 'Secure deal room'
    case CAPABILITY.REALTIME_UPDATES:        return 'Real-time updates'
    case CAPABILITY.DEAL_ANALYTICS:          return 'Deal analytics'
    default:                                 return 'Premium feature'
  }
}

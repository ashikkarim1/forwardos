/**
 * <LockedFeature />
 *
 * Drop-in page for a Premium-only feature that hasn't shipped yet (or
 * is gated). Replaces 404s on /heat-maps, /comparables, etc. with a
 * branded "this is behind your plan" screen.
 *
 * Each stub page sets:
 *   - title / kicker / pitch
 *   - bullet list of what's behind the wall
 *   - the tier required → drives the price + upgrade CTA
 *
 * Secondary actions cover the lifecycle the user asked for:
 *   - "Manage plan" → /account/billing (upgrade / downgrade / cancel)
 *   - "Back to dashboard" → escape hatch
 */
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Lock, Sparkles, Check, Settings } from 'lucide-react'
import { PublicHeader } from '@/components/Navigation'
import { PRICING } from '@/lib/pricing'

type RequiredTier = 'BUYER_PREMIUM' | 'SELLER_PREMIUM' | 'BROKER_PRO'

const TIER_META: Record<RequiredTier, { name: string; price: number; back: string }> = {
  BUYER_PREMIUM:  { name: 'Buyer Premium',  price: PRICING.buyer.premium.monthly,  back: '/dashboard/buyer' },
  SELLER_PREMIUM: { name: 'Seller Premium', price: PRICING.seller.premium.monthly, back: '/dashboard/seller' },
  BROKER_PRO:     { name: 'Broker Pro',     price: PRICING.broker.pro.monthly,     back: '/dashboard/broker' },
}

interface Props {
  kicker: string                 // small uppercase label, e.g. "Intelligence"
  title: string                  // headline, e.g. "Heat Maps"
  pitch: string                  // 1-2 sentence value pitch
  bullets: string[]              // 3-5 things the user unlocks
  requiredTier: RequiredTier
  comingSoon?: boolean           // optional badge when feature isn't shipped yet
}

export function LockedFeature({ kicker, title, pitch, bullets, requiredTier, comingSoon }: Props) {
  const tier = TIER_META[requiredTier]

  return (
    <div style={{ minHeight: '100vh', background: '#FAF6EF' }}>
      <PublicHeader />
      <div style={{ maxWidth: 880, margin: '0 auto', padding: '48px 24px 80px' }}>
        <Link
          href={tier.back}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontSize: 13, fontWeight: 600, color: '#6C7480',
            textDecoration: 'none', marginBottom: 24,
          }}
        >
          <ArrowLeft size={14} /> Back to dashboard
        </Link>

        <div style={{
          background: '#FFFFFF',
          border: '1px solid #E8EAED',
          borderRadius: 16,
          padding: '40px 40px 32px',
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 12px', borderRadius: 999,
            background: '#0F1419', color: '#FFFFFF',
            fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase',
            marginBottom: 20,
          }}>
            <Lock size={12} /> {comingSoon ? `Coming with ${tier.name}` : tier.name}
          </div>

          <p style={{
            fontSize: 11, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase',
            color: '#8C6D45', margin: 0, marginBottom: 8,
          }}>{kicker}</p>

          <h1 style={{
            fontSize: 40, fontWeight: 800, color: '#0F1419',
            margin: 0, marginBottom: 16, letterSpacing: '-0.02em',
          }}>{title}</h1>

          <p style={{
            fontSize: 17, color: '#454D58', lineHeight: 1.6,
            margin: 0, marginBottom: 28, maxWidth: 640,
          }}>{pitch}</p>

          <ul style={{
            listStyle: 'none', margin: 0, padding: 0,
            display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32,
          }}>
            {bullets.map((b) => (
              <li key={b} style={{
                display: 'flex', gap: 12, alignItems: 'flex-start',
                fontSize: 15, color: '#1F2937',
              }}>
                <span style={{
                  flexShrink: 0, width: 22, height: 22, borderRadius: 999,
                  background: '#F2EAD9', color: '#8C6D45',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  marginTop: 1,
                }}>
                  <Check size={13} />
                </span>
                {b}
              </li>
            ))}
          </ul>

          <div style={{
            display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 16,
            paddingTop: 24, borderTop: '1px solid #F0E8D8',
          }}>
            <Link
              href={`/api/billing/checkout?tier=${requiredTier}`}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '12px 22px', borderRadius: 10,
                background: '#0F1419', color: '#FFFFFF',
                fontSize: 15, fontWeight: 600, textDecoration: 'none',
              }}
            >
              <Sparkles size={15} /> Upgrade to {tier.name} <ArrowRight size={14} />
            </Link>
            <Link
              href="/account/billing"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '12px 18px', borderRadius: 10,
                background: '#FFFFFF', color: '#0F1419', border: '1px solid #C7CCD3',
                fontSize: 15, fontWeight: 600, textDecoration: 'none',
              }}
            >
              <Settings size={14} /> Manage plan
            </Link>
            <span style={{ fontSize: 13, color: '#6C7480', marginLeft: 'auto' }}>
              <strong style={{ color: '#0F1419' }}>${tier.price}</strong>/mo · tax inclusive · cancel anytime
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

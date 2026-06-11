'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Check, ArrowRight, Crown } from 'lucide-react'
import { useLocale } from '@/context/LocaleContext'
import { PRICING, COMPETITORS, LAUNCH_DISCOUNT_PCT, lowestCompetitorMonthly } from '@/lib/pricing'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER, COLOR_BG_PRIMARY } from '@/styles/forward-colors'

export function SellerPricingTiers() {
  const { locale, currency, isRTL } = useLocale()
  const router = useRouter()

  const getPrice = (basePrice: number): { display: string; amount: number } => {
    let display = ''
    if (currency === 'CAD') {
      display = `C$${Math.round(basePrice * 1.35)}`
    } else if (currency === 'AED') {
      display = `د.إ${Math.round(basePrice * 3.67)}`
    } else {
      display = `$${Math.round(basePrice)}`
    }

    return { display, amount: basePrice }
  }

  const handleSelectPlan = (plan: 'freemium' | 'premium') => {
    router.push(`/seller/register?plan=${plan}`)
  }

  const sellerTiers = [
    {
      id: 'freemium',
      name: 'Freemium',
      description: 'Perfect for getting started',
      basePrice: 0,
      period: '',
      features: [
        'Listed on marketplace',
        'Searchable by buyers',
        'Buyer messaging',
        'Basic analytics',
        'Photo gallery (5)',
        'Document upload',
        '6-month listing',
        'Email support',
      ],
      cta: 'Get Started Free',
      highlighted: false,
      ctaAction: () => handleSelectPlan('freemium'),
    },
    {
      id: 'premium',
      name: 'Premium',
      description: 'Maximum visibility & buyer trust',
      basePrice: PRICING.premium.launch,
      regularPrice: PRICING.premium.regular,
      period: '/month',
      features: [
        '⭐ Featured on homepage',
        '📊 Financial data visible',
        '🔐 Secure data room',
        '📈 Advanced analytics',
        '💎 Premium seller badge',
        '🎯 Priority buyer matching',
        '24/7 priority support',
        'Unlimited photos',
      ],
      cta: 'Lock in launch price',
      highlighted: true,
      premium: true,
      ctaAction: () => handleSelectPlan('premium'),
      note: `${LAUNCH_DISCOUNT_PCT}% off for 90 days · free trial after approval`,
    },
  ]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 border-t" style={{ borderColor: COLOR_BORDER, background: COLOR_PRIMARY + '02' }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black mb-6" style={{ color: COLOR_PRIMARY }}>
            Seller Pricing - List Your Business
          </h2>
          <p className="text-xl mb-8" style={{ color: COLOR_TEXT_SECONDARY }}>
            Choose the right plan to showcase your business to verified buyers
          </p>
        </div>

        {/* Seller Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {sellerTiers.map((tier, idx) => (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`rounded-lg p-8 border transition-all flex flex-col ${
                tier.highlighted ? 'ring-2 shadow-xl relative' : ''
              }`}
              style={{
                borderColor: tier.highlighted ? COLOR_ACCENT : COLOR_BORDER,
                background: tier.highlighted ? COLOR_ACCENT + '08' : 'white',
              }}
            >
              {tier.highlighted && (
                <div className="absolute -top-4 left-8 inline-block px-3 py-1 rounded-full text-xs font-bold text-white" style={{ background: COLOR_ACCENT }}>
                  ⭐ Most Popular
                </div>
              )}

              <div className="flex-1">
                <h3 className="text-2xl font-black mb-2" style={{ color: COLOR_PRIMARY }}>
                  {tier.name}
                </h3>
                <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-sm mb-6">
                  {tier.description}
                </p>

                <div className="mb-6">
                  {tier.basePrice > 0 ? (
                    <>
                      {'regularPrice' in tier && (tier as { regularPrice?: number }).regularPrice ? (
                        <div className="inline-flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 rounded-full text-xs font-bold text-white" style={{ background: '#2D7A5F' }}>
                            {LAUNCH_DISCOUNT_PCT}% OFF · LAUNCH
                          </span>
                          <span className="text-sm line-through" style={{ color: COLOR_TEXT_SECONDARY }}>
                            {getPrice((tier as { regularPrice: number }).regularPrice).display}{tier.period}
                          </span>
                        </div>
                      ) : null}
                      <div className="flex items-baseline gap-2">
                        <p className="text-4xl font-black" style={{ color: COLOR_ACCENT }}>
                          {getPrice(tier.basePrice).display}
                        </p>
                        <span style={{ color: COLOR_TEXT_SECONDARY }} className="text-sm">
                          {tier.period}
                        </span>
                      </div>
                      <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-xs mt-2">
                        {tier.note && `✓ ${tier.note}`}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-4xl font-black" style={{ color: COLOR_ACCENT }}>
                        FREE
                      </p>
                      <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-sm mt-2">
                        No credit card required
                      </p>
                    </>
                  )}
                </div>

                <div className="space-y-3 mb-6">
                  {tier.features.map((feature, fidx) => (
                    <div key={fidx} className="flex gap-3">
                      <Check size={16} style={{ color: COLOR_ACCENT, flexShrink: 0 }} className="mt-1" />
                      <span style={{ color: COLOR_TEXT_SECONDARY }} className="text-sm">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={tier.ctaAction}
                className={`w-full px-6 py-3 rounded-lg font-bold transition-all hover:opacity-90 flex items-center justify-center gap-2 ${
                  tier.highlighted ? 'text-white' : ''
                }`}
                style={{
                  background: tier.highlighted ? COLOR_ACCENT : COLOR_ACCENT + '20',
                  color: tier.highlighted ? 'white' : COLOR_ACCENT,
                }}
              >
                {tier.cta}
                {tier.highlighted && <Crown size={16} />}
              </button>
            </motion.div>
          ))}
        </div>

        {/* How We Compare — 50% cheaper launch pricing */}
        <div className="bg-white rounded-lg border p-8 md:p-12 mb-16" style={{ borderColor: COLOR_BORDER }}>
          <div className="text-center mb-8">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold text-white mb-3" style={{ background: '#2D7A5F' }}>
              90-DAY LAUNCH PRICING
            </span>
            <h3 className="text-2xl md:text-3xl font-black mb-2" style={{ color: COLOR_PRIMARY }}>
              Half the price of every major competitor
            </h3>
            <p style={{ color: COLOR_TEXT_SECONDARY }}>
              Forward Premium is <strong>{getPrice(PRICING.premium.launch).display}/mo</strong> during launch —
              less than half of comparable featured listings elsewhere.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ color: COLOR_TEXT_SECONDARY }}>
                  <th className="text-left py-2 px-3 font-semibold">Platform</th>
                  <th className="text-left py-2 px-3 font-semibold">Featured listing / mo</th>
                  <th className="text-left py-2 px-3 font-semibold">You save with Forward</th>
                </tr>
              </thead>
              <tbody>
                <tr className="rounded-lg" style={{ background: COLOR_ACCENT + '10' }}>
                  <td className="py-3 px-3 font-bold" style={{ color: COLOR_PRIMARY }}>⭐ Forward Premium (launch)</td>
                  <td className="py-3 px-3 font-black" style={{ color: COLOR_ACCENT }}>{getPrice(PRICING.premium.launch).display}</td>
                  <td className="py-3 px-3 font-semibold" style={{ color: '#2D7A5F' }}>—</td>
                </tr>
                {COMPETITORS.map((c) => {
                  const savePct = Math.round((1 - PRICING.premium.launch / c.featuredMonthly) * 100)
                  return (
                    <tr key={c.name} className="border-t" style={{ borderColor: COLOR_BORDER }}>
                      <td className="py-3 px-3" style={{ color: COLOR_PRIMARY }}>
                        {c.name}
                        <span className="block text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>{c.note}</span>
                      </td>
                      <td className="py-3 px-3" style={{ color: COLOR_TEXT_SECONDARY }}>{getPrice(c.featuredMonthly).display}</td>
                      <td className="py-3 px-3 font-bold" style={{ color: '#2D7A5F' }}>{savePct}% less</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <p className="text-xs mt-4" style={{ color: COLOR_TEXT_SECONDARY }}>
            Competitor prices reflect publicly listed featured/premium tiers and may vary by term. Forward launch
            pricing ends in 90 days; lock it in now and keep it for your listing period.
          </p>
        </div>

        {/* Why Complete Listings Matter */}
        <div className="bg-white rounded-lg border p-12" style={{ borderColor: COLOR_BORDER }}>
          <h3 className="text-2xl font-black mb-8 text-center" style={{ color: COLOR_PRIMARY }}>
            Completeness = Better Outcomes
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="flex justify-center mb-4 text-4xl">
                📊
              </div>
              <p className="font-semibold mb-2" style={{ color: COLOR_PRIMARY }}>
                5x More Interest
              </p>
              <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-sm">
                80%+ complete listings get 5x more buyer inquiries
              </p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-4 text-4xl">
                ⭐
              </div>
              <p className="font-semibold mb-2" style={{ color: COLOR_PRIMARY }}>
                Featured Placement
              </p>
              <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-sm">
                Premium tier shows on homepage for maximum visibility
              </p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-4 text-4xl">
                🔐
              </div>
              <p className="font-semibold mb-2" style={{ color: COLOR_PRIMARY }}>
                Secure Data Room
              </p>
              <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-sm">
                Premium sellers get NDA-protected buyer access
              </p>
            </div>
          </div>
        </div>

        {/* How Completeness Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 bg-white rounded-lg border p-8"
          style={{ borderColor: COLOR_BORDER }}
        >
          <div className="flex gap-4 items-start">
            <div className="text-3xl flex-shrink-0">📈</div>
            <div>
              <h4 className="text-xl font-bold mb-4" style={{ color: COLOR_PRIMARY }}>
                Your Completeness Score Matters
              </h4>
              <p style={{ color: COLOR_TEXT_SECONDARY }} className="mb-4">
                When you submit business information, we calculate a completeness score (0-100%). The more details you provide—especially financial summaries and supporting documents—the higher your visibility to qualified buyers.
              </p>

              <div className="grid grid-cols-3 gap-4 mt-4">
                <div>
                  <p className="font-bold mb-1" style={{ color: COLOR_PRIMARY }}>25%+</p>
                  <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-xs">📋 Listed</p>
                </div>
                <div>
                  <p className="font-bold mb-1" style={{ color: COLOR_PRIMARY }}>50%+</p>
                  <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-xs">⭐ Featured</p>
                </div>
                <div>
                  <p className="font-bold mb-1" style={{ color: COLOR_PRIMARY }}>80%+</p>
                  <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-xs">🔓 Full Access</p>
                </div>
              </div>

              <p style={{ color: COLOR_PRIMARY }} className="font-bold mb-3 mt-4">
                What happens when you're featured:
              </p>

              <ul className="space-y-2 mb-4">
                <li className="flex gap-2">
                  <span style={{ color: COLOR_ACCENT }}>✓</span>
                  <span style={{ color: COLOR_TEXT_SECONDARY }} className="text-sm">
                    <strong>Seller receives</strong> exact copy of newsletter sent to buyers (with performance stats)
                  </span>
                </li>
                <li className="flex gap-2">
                  <span style={{ color: COLOR_ACCENT }}>✓</span>
                  <span style={{ color: COLOR_TEXT_SECONDARY }} className="text-sm">
                    <strong>Broker receives</strong> feature notification + buyer inquiry analytics
                  </span>
                </li>
                <li className="flex gap-2">
                  <span style={{ color: COLOR_ACCENT }}>✓</span>
                  <span style={{ color: COLOR_TEXT_SECONDARY }} className="text-sm">
                    <strong>Professional photos</strong> curated from your 20-photo library (5-8 best images)
                  </span>
                </li>
                <li className="flex gap-2">
                  <span style={{ color: COLOR_ACCENT }}>✓</span>
                  <span style={{ color: COLOR_TEXT_SECONDARY }} className="text-sm">
                    <strong>Strategic messaging</strong> highlighting your competitive advantages
                  </span>
                </li>
              </ul>

              <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-sm italic">
                Rotation ensures every premium listing gets featured approximately every 4-6 weeks, with priority given to newly listed and highest-performing businesses.
              </p>
            </div>
          </div>
        </motion.div>

        {/* FAQ */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold mb-6 text-center" style={{ color: COLOR_PRIMARY }}>
            Seller Pricing FAQ
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                q: 'Can I cancel my premium listing anytime?',
                a: 'Yes. Cancel anytime before your annual renewal. Your listing remains active until the end of your paid period.',
              },
              {
                q: 'What if I don\'t get a buyer?',
                a: '30-day money-back guarantee. If your listing doesn\'t generate qualified buyer interest in the first 30 days, we refund 100%.',
              },
              {
                q: 'Do I pay commission when I sell?',
                a: 'No commission from Forward OS. You may work with a broker who earns commission—that\'s between you and them.',
              },
              {
                q: 'Can I upload my own photos?',
                a: 'Yes. Upload up to 20 photos, and our team curates the 5-8 best for the weekly newsletter.',
              },
              {
                q: 'How do buyers find my listing?',
                a: 'Buyers discover you through: (1) marketplace search, (2) weekly newsletter feature, (3) broker recommendations, (4) alerts.',
              },
              {
                q: 'What regions are supported?',
                a: 'Currently: Canada and UAE (US coming Q4 2024). Each region has its own verified buyer network.',
              },
            ].map((faq, idx) => (
              <div key={idx} className="p-6 rounded-lg border" style={{ borderColor: COLOR_BORDER, background: COLOR_PRIMARY + '02' }}>
                <p className="font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
                  {faq.q}
                </p>
                <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-sm">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

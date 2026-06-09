'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Check, ArrowRight, Star, TrendingUp, Mail, BarChart3, Target } from 'lucide-react'
import { useLocale } from '@/context/LocaleContext'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER } from '@/styles/forward-colors'

export function SellerPricingTiers() {
  const { locale, currency, isRTL } = useLocale()

  const getPrice = (basePrice: number): { display: string; amount: number } => {
    let display = ''
    if (currency === 'CAD') {
      display = `C$${Math.round(basePrice * 1.35)}`
    } else if (currency === 'AED') {
      display = `د.إ${Math.round(basePrice * 1.1)}`
    } else {
      display = `$${Math.round(basePrice)}`
    }

    return { display, amount: basePrice }
  }

  const sellerTiers = [
    {
      id: 'free',
      name: 'Free Listing',
      description: 'Get started with a basic listing',
      basePrice: 0,
      features: [
        'One business listing',
        'Up to 3 photos',
        'Basic business information',
        'Listing duration: 90 days',
        'Limited visibility',
        'Email support',
      ],
      cta: 'Create Free Listing',
      highlighted: false,
    },
    {
      id: 'premium',
      name: 'Premium Listing',
      description: 'Maximum visibility to find the right buyer',
      basePrice: 499,
      features: [
        'Unlimited business listings',
        'Professional photography (up to 20 photos)',
        'Weekly featured newsletter',
        'Featured on landing page',
        'Seller + Broker get visibility email',
        'Enhanced CIM hosting & security',
        'Broker network matching',
        'Real-time analytics dashboard',
        'Priority email support',
        'Listing duration: 365 days',
        'SEO optimization',
        'Social media promotion',
      ],
      cta: 'Start Premium Listing',
      highlighted: true,
      premium: true,
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
                      <div className="flex items-baseline gap-2">
                        <p className="text-4xl font-black" style={{ color: COLOR_ACCENT }}>
                          {getPrice(tier.basePrice).display}
                        </p>
                        <span style={{ color: COLOR_TEXT_SECONDARY }} className="text-sm">
                          /year
                        </span>
                      </div>
                      <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-xs mt-2">
                        ~{getPrice(Math.round(tier.basePrice / 12)).display}/month
                      </p>
                      <p style={{ color: COLOR_ACCENT }} className="text-xs font-bold mt-3">
                        ✓ 30-day money-back guarantee
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-3xl font-black" style={{ color: COLOR_PRIMARY }}>
                        Free
                      </p>
                      <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-sm mt-2">
                        Upgrade anytime
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

              <Link
                href={tier.id === 'free' ? '/auth/signup-seller' : '/pricing'}
                className={`w-full block text-center px-6 py-3 rounded-lg font-bold transition-all ${
                  tier.highlighted ? 'text-white' : ''
                }`}
                style={{
                  background: tier.highlighted ? COLOR_ACCENT : COLOR_ACCENT + '20',
                  color: tier.highlighted ? 'white' : COLOR_ACCENT,
                }}
              >
                {tier.cta} <ArrowRight className="inline ml-2" size={16} />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Why Premium Matters */}
        <div className="bg-white rounded-lg border p-12" style={{ borderColor: COLOR_BORDER }}>
          <h3 className="text-2xl font-black mb-8 text-center" style={{ color: COLOR_PRIMARY }}>
            Why Premium Sellers Sell Faster
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-lg" style={{ background: COLOR_ACCENT + '15' }}>
                  <TrendingUp size={32} style={{ color: COLOR_ACCENT }} />
                </div>
              </div>
              <p className="font-semibold mb-2" style={{ color: COLOR_PRIMARY }}>
                3x More Inquiries
              </p>
              <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-sm">
                With featured newsletter exposure
              </p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-lg" style={{ background: COLOR_ACCENT + '15' }}>
                  <Mail size={32} style={{ color: COLOR_ACCENT }} />
                </div>
              </div>
              <p className="font-semibold mb-2" style={{ color: COLOR_PRIMARY }}>
                Weekly Updates
              </p>
              <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-sm">
                Seller + broker excitement email every week
              </p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-lg" style={{ background: COLOR_ACCENT + '15' }}>
                  <BarChart3 size={32} style={{ color: COLOR_ACCENT }} />
                </div>
              </div>
              <p className="font-semibold mb-2" style={{ color: COLOR_PRIMARY }}>
                Real-Time Analytics
              </p>
              <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-sm">
                Track buyer interest and engagement
              </p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-lg" style={{ background: COLOR_ACCENT + '15' }}>
                  <Target size={32} style={{ color: COLOR_ACCENT }} />
                </div>
              </div>
              <p className="font-semibold mb-2" style={{ color: COLOR_PRIMARY }}>
                Expert Matching
              </p>
              <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-sm">
                Matched with qualified brokers in your industry
              </p>
            </div>
          </div>
        </div>

        {/* Newsletter Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 bg-white rounded-lg border p-8"
          style={{ borderColor: COLOR_BORDER }}
        >
          <div className="flex gap-4 items-start">
            <Star size={28} style={{ color: COLOR_ACCENT, flexShrink: 0 }} fill={COLOR_ACCENT} />
            <div>
              <h4 className="text-xl font-bold mb-4" style={{ color: COLOR_PRIMARY }}>
                Weekly Featured Newsletter
              </h4>
              <p style={{ color: COLOR_TEXT_SECONDARY }} className="mb-4">
                Every Monday, we feature 3 premium listings to {'>'}5,000 verified buyers, investment professionals, and brokers across North America and the Middle East.
              </p>

              <p style={{ color: COLOR_PRIMARY }} className="font-bold mb-3">
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

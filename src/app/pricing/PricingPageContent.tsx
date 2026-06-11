'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Check, ArrowRight, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { useLocale } from '@/context/LocaleContext'
import { useTranslation } from '@/hooks/useTranslation'
import { SellerPricingTiers } from '@/components/SellerPricingTiers'
import { UserTypeSelector } from '@/components/UserTypeSelector'
import { PRICING, LAUNCH_DISCOUNT_PCT } from '@/lib/pricing'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER } from '@/styles/forward-colors'

interface PricingTier {
  id: string
  name: string
  description: string
  basePrice: number      // launch price (USD)
  regularPrice?: number  // struck-through regular price (USD)
  features: string[]
  cta: string
  highlighted?: boolean
}

export function PricingPageContent() {
  const { isRTL } = useLocale()
  const t = useTranslation()
  const [showUserTypeModal, setShowUserTypeModal] = useState(false)
  const [view, setView] = useState<'sellers' | 'buyers'>('sellers')

  const jumpTo = (section: 'sellers' | 'buyers') => {
    setView(section)
    if (typeof document !== 'undefined') {
      document.getElementById(section)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // Pricing is USD-only.
  const getPrice = (basePrice: number): { display: string; amount: number } => {
    return { display: `$${Math.round(basePrice).toLocaleString()}`, amount: basePrice }
  }

  const tiers: PricingTier[] = [
    {
      id: 'starter',
      name: 'Starter',
      description: 'For active individual buyers',
      basePrice: PRICING.starter.launch,
      regularPrice: PRICING.starter.regular,
      features: [
        'Full marketplace access',
        'Deal heat scores & success probability',
        'Saved searches & email alerts',
        'Basic financial metrics',
        'Buyer messaging & inquiries',
        'Finance Center & valuation tools',
        'Email support',
      ],
      cta: 'Start free trial',
      highlighted: false,
    },
    {
      id: 'professional',
      name: 'Pro',
      description: 'For serious acquirers & small funds',
      basePrice: PRICING.pro.launch,
      regularPrice: PRICING.pro.regular,
      features: [
        'Everything in Starter +',
        'Financial modeling tools (DCF, SDE, ROI)',
        'Deal comparison (up to 5)',
        'Portfolio dashboard & tracking',
        'AI-powered recommendations',
        'Comparables database access',
        'Secure data-room access',
        'Priority support',
      ],
      cta: 'Start free trial',
      highlighted: true,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'For institutions & PE firms',
      basePrice: 0,
      features: [
        'Everything in Pro +',
        'Unlimited API access',
        'Custom integrations',
        'White-label marketplace',
        'Dedicated account manager',
        'Custom reporting & analytics',
        '24/7 phone support',
      ],
      cta: 'Contact sales',
      highlighted: false,
    },
  ]

  return (
    <div className="min-h-screen bg-white" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Navigation Bar */}
      <nav
        className="sticky top-0 z-50 bg-white border-b"
        style={{ borderColor: COLOR_BORDER }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles size={32} style={{ color: COLOR_ACCENT }} />
            <span className="text-xl font-black" style={{ color: COLOR_PRIMARY }}>
              Forward Intelligence
            </span>
          </Link>
          <div className={`flex items-center gap-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Link
              href="/marketplace"
              className="font-bold hover:opacity-80"
              style={{ color: COLOR_PRIMARY }}
            >
              {t('nav.browseDeals')}
            </Link>
            <Link
              href="/pricing"
              className="font-bold hover:opacity-80"
              style={{ color: COLOR_PRIMARY }}
            >
              Pricing
            </Link>
            <Link
              href="/auth/signin"
              className="px-6 py-2 rounded-lg font-bold text-white hover:opacity-90"
              style={{ background: COLOR_ACCENT }}
            >
              {t('nav.signIn')}
            </Link>
          </div>
        </div>
      </nav>

      {/* Pricing Header */}
      <div className="border-b py-12 px-4 sm:px-6 lg:px-8" style={{ borderColor: COLOR_BORDER }}>
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-black mb-3" style={{ color: COLOR_PRIMARY }}>
            {t('pricing.title')}
          </h1>
          <p className="text-lg mb-6" style={{ color: COLOR_TEXT_SECONDARY }}>
            14-day free trial. No credit card required. Cancel anytime.
          </p>

          {/* For Sellers / For Buyers toggle */}
          <div className="inline-flex rounded-full border p-1" style={{ borderColor: COLOR_BORDER, background: '#F3F4F6' }}>
            <button
              onClick={() => jumpTo('sellers')}
              className="px-6 py-2.5 rounded-full text-sm font-bold transition-all"
              style={{ background: view === 'sellers' ? COLOR_ACCENT : 'transparent', color: view === 'sellers' ? 'white' : COLOR_PRIMARY }}
            >
              🏷️ For Sellers
            </button>
            <button
              onClick={() => jumpTo('buyers')}
              className="px-6 py-2.5 rounded-full text-sm font-bold transition-all"
              style={{ background: view === 'buyers' ? COLOR_ACCENT : 'transparent', color: view === 'buyers' ? 'white' : COLOR_PRIMARY }}
            >
              🔍 For Buyers
            </button>
          </div>
          <p className="text-xs mt-3" style={{ color: COLOR_TEXT_SECONDARY }}>
            Sellers list free. Buyers unlock AI deal intelligence. All prices in USD.
          </p>
        </div>
      </div>

      {/* ============ SELLERS FIRST (free to list) ============ */}
      <div id="sellers" className="scroll-mt-20">
        <SellerPricingTiers />
      </div>

      {/* ============ BUYERS ============ */}
      <div id="buyers" className="py-16 px-4 sm:px-6 lg:px-8 border-t scroll-mt-20" style={{ borderColor: COLOR_BORDER }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold text-white mb-3" style={{ background: '#2D7A5F' }}>
              {LAUNCH_DISCOUNT_PCT}% OFF · 90-DAY LAUNCH
            </span>
            <h2 className="text-4xl font-black mb-3" style={{ color: COLOR_PRIMARY }}>
              For Buyers — Deal Intelligence Plans
            </h2>
            <p className="text-lg" style={{ color: COLOR_TEXT_SECONDARY }}>
              Browsing is free. Upgrade for AI scoring, modeling tools, and data rooms — all USD, 50% off during launch.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tiers.map((tier, idx) => (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`rounded-lg p-8 border transition-all flex flex-col ${
                  tier.highlighted ? 'ring-2 shadow-xl md:scale-105' : ''
                }`}
                style={{
                  borderColor: tier.highlighted ? COLOR_ACCENT : COLOR_BORDER,
                  background: tier.highlighted ? COLOR_ACCENT + '08' : 'white',
                }}
              >
                <div className="flex-1">
                  {tier.highlighted && (
                    <div
                      className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-4 text-white"
                      style={{ background: COLOR_ACCENT }}
                    >
                      Most Popular
                    </div>
                  )}

                  <h3 className="text-2xl font-black mb-2" style={{ color: COLOR_PRIMARY }}>
                    {tier.name}
                  </h3>
                  <p style={{ color: COLOR_TEXT_SECONDARY }} className="mb-6 text-sm">
                    {tier.description}
                  </p>

                  <div className="mb-6">
                    {tier.basePrice > 0 ? (
                      <>
                        {tier.regularPrice ? (
                          <div className="inline-flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 rounded-full text-xs font-bold text-white" style={{ background: '#2D7A5F' }}>
                              {LAUNCH_DISCOUNT_PCT}% OFF
                            </span>
                            <span className="text-sm line-through" style={{ color: COLOR_TEXT_SECONDARY }}>
                              {getPrice(tier.regularPrice).display}/mo
                            </span>
                          </div>
                        ) : null}
                        <div className="flex items-baseline gap-2">
                          <p className="text-4xl font-black" style={{ color: COLOR_ACCENT }}>
                            {getPrice(tier.basePrice).display}
                          </p>
                          <span style={{ color: COLOR_TEXT_SECONDARY }} className="text-sm">/month</span>
                        </div>
                        <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-xs mt-1">
                          USD · 14-day free trial · cancel anytime
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-2xl font-bold" style={{ color: COLOR_PRIMARY }}>
                          Custom Pricing
                        </p>
                        <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-sm mt-1">
                          for enterprise scale
                        </p>
                      </>
                    )}
                  </div>

                  <div className="space-y-3 mb-6">
                    {tier.features.map((feature, fidx) => (
                      <div key={fidx} className="flex gap-3">
                        <Check size={20} style={{ color: COLOR_ACCENT, flexShrink: 0 }} />
                        <span style={{ color: COLOR_TEXT_SECONDARY }} className="text-sm">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  href={tier.id === 'enterprise' ? '/contact-sales' : `/auth/signup?plan=${tier.id}`}
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
        </div>
      </div>

      {/* Value Proposition */}
      <div className="bg-gray-50 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black mb-12 text-center" style={{ color: COLOR_PRIMARY }}>
            Why Forward Intelligence Pricing Is A Bargain
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="p-8 rounded-lg border" style={{ borderColor: COLOR_BORDER, background: 'white' }}>
              <p className="font-bold mb-4 text-lg" style={{ color: COLOR_PRIMARY }}>
                Using The Others Today:
              </p>
              <ul className="space-y-3 text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                <li>✗ 3-4 hours per deal</li>
                <li>✗ Manual Excel comparison</li>
                <li>✗ Email broker for help</li>
                <li>✗ No deal intelligence</li>
                <li>✗ <strong>Cost: $750-1,000/deal</strong></li>
              </ul>
            </div>

            <div
              className="p-8 rounded-lg border"
              style={{ borderColor: COLOR_ACCENT, background: COLOR_ACCENT + '08' }}
            >
              <p className="font-bold mb-4 text-lg" style={{ color: COLOR_PRIMARY }}>
                Using Forward Intelligence:
              </p>
              <ul className="space-y-3 text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                <li>✓ 16 minutes per deal</li>
                <li>✓ 1-click comparison (5 deals)</li>
                <li>✓ 5 AI predictions built-in</li>
                <li>✓ Success % & heat score visible</li>
                <li>✓ <strong>Cost: $65/deal</strong></li>
              </ul>
            </div>
          </div>

          <div className="p-8 rounded-lg border-2 text-center" style={{ borderColor: COLOR_ACCENT + '40', background: COLOR_ACCENT + '08' }}>
            <p className="text-2xl font-black mb-2" style={{ color: COLOR_PRIMARY }}>
              💰 $685 saved per deal
            </p>
            <p style={{ color: COLOR_TEXT_SECONDARY }} className="mb-4">
              At 10 deals/year = $6,850 in savings
            </p>
            <p className="font-bold text-lg" style={{ color: COLOR_ACCENT }}>
              {getPrice(499).display}/month subscription = <span style={{ color: COLOR_PRIMARY }}>ROI on first deal</span>
            </p>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-black mb-12 text-center" style={{ color: COLOR_PRIMARY }}>
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {[
              {
                q: 'Can I upgrade or downgrade anytime?',
                a: 'Yes, change plans at any time. Changes take effect on your next billing cycle.',
              },
              {
                q: 'What payment methods do you accept?',
                a: 'All major credit cards (Visa, Mastercard, Amex) via Stripe. All plans are billed in USD.',
              },
              {
                q: 'Is there a free trial?',
                a: '14-day free trial on all paid plans. No credit card required.',
              },
              {
                q: 'What if I need custom features?',
                a: 'Enterprise customers can customize integrations and pricing. Contact sales for details.',
              },
              {
                q: 'Is there a launch discount?',
                a: 'Yes — all paid plans are 50% off for the first 90 days during our launch. Lock in the rate now.',
              },
            ].map((faq, idx) => (
              <div key={idx} className="p-6 rounded-lg border" style={{ borderColor: COLOR_BORDER }}>
                <p className="font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
                  {faq.q}
                </p>
                <p style={{ color: COLOR_TEXT_SECONDARY }}>
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div
        className="py-16 px-4 sm:px-6 lg:px-8 text-center border-t"
        style={{ borderColor: COLOR_BORDER, background: COLOR_PRIMARY + '02' }}
      >
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-black mb-6" style={{ color: COLOR_PRIMARY }}>
            Ready to Close Deals Faster?
          </h2>
          <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-lg mb-8">
            Start your 14-day free trial. No credit card required.
          </p>
          <button
            onClick={() => setShowUserTypeModal(true)}
            className="inline-block px-8 py-4 rounded-lg font-bold text-white transition-all hover:opacity-90"
            style={{ background: COLOR_ACCENT }}
          >
            Start Free Trial <ArrowRight className="inline ml-2" size={20} />
          </button>
        </div>
      </div>

      {/* User Type Selector Modal */}
      <UserTypeSelector
        isOpen={showUserTypeModal}
        onClose={() => setShowUserTypeModal(false)}
        redirectAfterSelection={true}
      />
    </div>
  )
}

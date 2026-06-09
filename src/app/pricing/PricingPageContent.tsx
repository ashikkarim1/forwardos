'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Check, ArrowRight, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { useLocale } from '@/context/LocaleContext'
import { useTranslation } from '@/hooks/useTranslation'
import { LocaleSelector } from '@/components/LocaleSelector'
import { SellerPricingTiers } from '@/components/SellerPricingTiers'
import { UserTypeSelector } from '@/components/UserTypeSelector'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER } from '@/styles/forward-colors'

interface PricingTier {
  id: string
  name: string
  description: string
  basePrice: number
  currency: string
  features: string[]
  cta: string
  highlighted?: boolean
}

export function PricingPageContent() {
  const { locale, currency, isRTL } = useLocale()
  const t = useTranslation()
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly')
  const [showUserTypeModal, setShowUserTypeModal] = useState(false)

  const getPrice = (basePrice: number): { display: string; amount: number } => {
    // Apply 15% discount for yearly billing
    const finalPrice = billingPeriod === 'yearly' ? basePrice * 0.85 : basePrice

    let display = ''
    if (currency === 'CAD') {
      display = `C$${Math.round(finalPrice * 1.35)}`
    } else if (currency === 'AED') {
      display = `د.إ${Math.round(finalPrice * 3.67)}`
    } else {
      display = `$${Math.round(finalPrice)}`
    }

    return { display, amount: finalPrice }
  }

  const tiers: PricingTier[] = [
    {
      id: 'starter',
      name: t('pricing.starter'),
      description: t('pricing.starterDesc'),
      basePrice: 499,
      currency: 'USD',
      features: [
        t('pricing.starter_feature1'),
        'Deal heat scores & success probability',
        t('pricing.starter_feature2'),
        t('pricing.starter_feature3'),
        'Basic financial metrics',
        'Saved searches & alerts',
        t('pricing.starter_feature4'),
        'Trusted by 100+ professionals',
      ],
      cta: t('pricing.trial'),
      highlighted: false,
    },
    {
      id: 'professional',
      name: t('pricing.professional'),
      description: t('pricing.professionalDesc'),
      basePrice: 1999,
      currency: 'USD',
      features: [
        t('pricing.pro_feature1'),
        'Financial modeling tools (DCF, SDE, ROI)',
        'Deal comparison (up to 5)',
        'Portfolio dashboard & tracking',
        'AI-powered recommendations',
        'Comparables database access',
        'API access (10,000 calls/month)',
        'Priority support',
        'Discussion threads per deal',
      ],
      cta: t('pricing.trial'),
      highlighted: true,
    },
    {
      id: 'enterprise',
      name: t('pricing.enterprise'),
      description: t('pricing.enterpriseDesc'),
      basePrice: 0,
      currency: 'USD',
      features: [
        'Everything in Professional +',
        'Unlimited API access',
        'Custom integrations',
        'White-label marketplace',
        'Dedicated account manager',
        'Custom reporting & analytics',
        'Institutional API tier',
        'Advanced pipeline analytics',
        '24/7 phone support',
      ],
      cta: t('pricing.contact'),
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
              Forward OS
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
            <LocaleSelector />
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
      <div className="border-b py-20 px-4 sm:px-6 lg:px-8" style={{ borderColor: COLOR_BORDER }}>
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-black mb-6" style={{ color: COLOR_PRIMARY }}>
            {t('pricing.title')}
          </h1>
          <p className="text-xl mb-8" style={{ color: COLOR_TEXT_SECONDARY }}>
            {t('pricing.subtitle')}
          </p>
        </div>
      </div>

      {/* Billing Period Toggle */}
      <div className="py-12 px-4 sm:px-6 lg:px-8" style={{ background: COLOR_PRIMARY + '02' }}>
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-6 flex-wrap">
            <span style={{ color: COLOR_TEXT_SECONDARY }} className="text-sm font-semibold">
              Billed Monthly
            </span>

            {/* Toggle Switch */}
            <button
              onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
              className={`relative w-16 h-8 rounded-full transition-all ${
                billingPeriod === 'yearly' ? '' : ''
              }`}
              style={{
                background: billingPeriod === 'yearly' ? COLOR_ACCENT : COLOR_BORDER,
              }}
            >
              <motion.div
                className="absolute top-1 w-6 h-6 rounded-full bg-white"
                animate={{
                  left: billingPeriod === 'yearly' ? '32px' : '2px',
                }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </button>

            <div className="flex items-center gap-2">
              <span style={{ color: COLOR_TEXT_SECONDARY }} className="text-sm font-semibold">
                Billed Yearly
              </span>
              <span
                className="px-3 py-1 rounded-full text-xs font-bold text-white"
                style={{ background: COLOR_ACCENT }}
              >
                Save 15%
              </span>
            </div>
          </div>

          <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-center text-sm mt-6">
            {billingPeriod === 'yearly'
              ? '✅ Cancel anytime before period ends • No automatic renewals • End date is locked'
              : '✅ Cancel anytime before month ends • No automatic renewals • End date is locked'}
          </p>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
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
                        <div className="flex items-baseline gap-3">
                          <p className="text-4xl font-black" style={{ color: COLOR_ACCENT }}>
                            {getPrice(tier.basePrice).display}
                          </p>
                          {billingPeriod === 'yearly' && (
                            <span
                              className="text-xs font-bold px-2 py-1 rounded"
                              style={{ background: COLOR_ACCENT + '20', color: COLOR_ACCENT }}
                            >
                              Save 15%
                            </span>
                          )}
                        </div>
                        <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-sm mt-1">
                          {billingPeriod === 'yearly' ? 'per month, billed yearly' : 'per month, billed monthly'}
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

      {/* Seller Pricing Section */}
      <SellerPricingTiers />

      {/* Value Proposition */}
      <div className="bg-gray-50 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black mb-12 text-center" style={{ color: COLOR_PRIMARY }}>
            Why Forward OS Pricing Is A Bargain
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
                Using Forward OS:
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
                a: 'All major credit cards (Visa, Mastercard, Amex) via Stripe. We support USD, CAD, and AED.',
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
                q: 'Do you offer annual discounts?',
                a: '15% discount when billed annually instead of monthly.',
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

'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Check, ArrowRight } from 'lucide-react'
import { useLocale } from '@/context/LocaleContext'
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

export default function PricingPage() {
  const { locale, currency, isRTL } = useLocale()

  const getPrice = (basePrice: number): string => {
    if (currency === 'CAD') return `C$${Math.round(basePrice * 1.35)}`
    if (currency === 'AED') return `د.إ${Math.round(basePrice * 3.67)}`
    return `$${basePrice}`
  }

  const tiers: PricingTier[] = [
    {
      id: 'starter',
      name: 'Starter',
      description: 'For emerging fund managers & small PE firms',
      basePrice: 499,
      currency: 'USD',
      features: [
        'Advanced search & filters (10 categories)',
        'Deal heat scores & success probability',
        'Deal comparison (up to 3)',
        'PDF export for partners',
        'Basic financial metrics',
        'Saved searches & alerts',
        'Email support',
        'Trusted by 100+ professionals',
      ],
      cta: 'Start Free Trial',
      highlighted: false,
    },
    {
      id: 'professional',
      name: 'Professional',
      description: 'For mid-market PE & institutional investors',
      basePrice: 1999,
      currency: 'USD',
      features: [
        'Everything in Starter +',
        'Financial modeling tools (DCF, SDE, ROI)',
        'Deal comparison (up to 5)',
        'Portfolio dashboard & tracking',
        'AI-powered recommendations',
        'Comparables database access',
        'API access (10,000 calls/month)',
        'Priority support',
        'Discussion threads per deal',
      ],
      cta: 'Start Free Trial',
      highlighted: true,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'For large PE firms & family offices',
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
      cta: 'Contact Sales',
      highlighted: false,
    },
  ]

  return (
    <div className="min-h-screen bg-white" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="border-b py-20 px-4 sm:px-6 lg:px-8" style={{ borderColor: COLOR_BORDER }}>
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-black mb-6" style={{ color: COLOR_PRIMARY }}>
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl mb-8" style={{ color: COLOR_TEXT_SECONDARY }}>
            Save 180+ hours/year per analyst. ROI pays for itself on the first deal.
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
                className={`rounded-lg p-8 border transition-all ${
                  tier.highlighted ? 'ring-2 shadow-xl md:scale-105' : ''
                }`}
                style={{
                  borderColor: tier.highlighted ? COLOR_ACCENT : COLOR_BORDER,
                  background: tier.highlighted ? COLOR_ACCENT + '08' : 'white',
                }}
              >
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
                      <p className="text-4xl font-black" style={{ color: COLOR_ACCENT }}>
                        {getPrice(tier.basePrice)}
                      </p>
                      <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-sm mt-1">
                        per month, billed annually
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

                <Link
                  href={tier.id === 'enterprise' ? '/contact-sales' : `/auth/signup?plan=${tier.id}`}
                  className={`w-full block text-center px-6 py-3 rounded-lg font-bold transition-all mb-8 ${
                    tier.highlighted ? 'text-white' : ''
                  }`}
                  style={{
                    background: tier.highlighted ? COLOR_ACCENT : COLOR_ACCENT + '20',
                    color: tier.highlighted ? 'white' : COLOR_ACCENT,
                  }}
                >
                  {tier.cta} <ArrowRight className="inline ml-2" size={16} />
                </Link>

                <div className="space-y-3">
                  {tier.features.map((feature, fidx) => (
                    <div key={fidx} className="flex gap-3">
                      <Check size={20} style={{ color: COLOR_ACCENT, flexShrink: 0 }} />
                      <span style={{ color: COLOR_TEXT_SECONDARY }} className="text-sm">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Value Proposition */}
      <div className="bg-gray-50 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black mb-12 text-center" style={{ color: COLOR_PRIMARY }}>
            Why Forward OS Pricing Is A Bargain
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="p-8 rounded-lg border" style={{ borderColor: COLOR_BORDER, background: 'white' }}>
              <p className="font-bold mb-4 text-lg" style={{ color: COLOR_PRIMARY }}>
                Using BFS.com Today:
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
              {getPrice(499)}/month subscription = <span style={{ color: COLOR_PRIMARY }}>ROI on first deal</span>
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
          <Link
            href="/auth/signup"
            className="inline-block px-8 py-4 rounded-lg font-bold text-white transition-all hover:opacity-90"
            style={{ background: COLOR_ACCENT }}
          >
            Start Free Trial <ArrowRight className="inline ml-2" size={20} />
          </Link>
        </div>
      </div>
    </div>
  )
}

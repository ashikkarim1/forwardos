'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { useLocale } from '@/context/LocaleContext'
import { StripeCheckout } from '@/components/StripeCheckout'
import { ArrowLeft } from 'lucide-react'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER } from '@/styles/forward-colors'

interface Plan {
  id: 'starter' | 'professional' | 'enterprise'
  name: string
  description: string
  basePrice: number
  features: string[]
  recommended?: boolean
}

export function SignupContent() {
  const { locale, currency, isRTL } = useLocale()
  const searchParams = useSearchParams()
  const selectedPlanParam = searchParams?.get('plan') as 'starter' | 'professional' | 'enterprise' | null
  
  const [selectedPlan, setSelectedPlan] = useState<'starter' | 'professional' | 'enterprise' | null>(selectedPlanParam || null)
  const [step, setStep] = useState<'plans' | 'checkout'>('plans')

  const getPrice = (basePrice: number): number => {
    if (currency === 'CAD') return Math.round(basePrice * 1.35)
    if (currency === 'AED') return Math.round(basePrice * 3.67)
    return basePrice
  }

  const plans: Plan[] = [
    {
      id: 'starter',
      name: 'Starter',
      description: 'For emerging fund managers',
      basePrice: 499,
      features: [
        'Advanced search & filters',
        'Deal comparison (up to 3)',
        'PDF export',
        'Basic financial metrics',
        'Saved searches & alerts',
        'Email support',
      ],
    },
    {
      id: 'professional',
      name: 'Professional',
      description: 'For mid-market PE firms',
      basePrice: 1999,
      features: [
        'Everything in Starter',
        'Financial modeling tools (DCF, SDE, ROI)',
        'Deal comparison (up to 5)',
        'Portfolio dashboard & tracking',
        'AI-powered recommendations',
        'API access (10,000 calls/month)',
        'Priority support',
      ],
      recommended: true,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'For large PE firms',
      basePrice: 0,
      features: [
        'Everything in Professional',
        'Unlimited API access',
        'Custom integrations',
        'White-label marketplace',
        'Dedicated account manager',
        'Custom reporting',
        '24/7 phone support',
      ],
    },
  ]

  if (step === 'checkout' && selectedPlan) {
    const plan = plans.find((p) => p.id === selectedPlan)!
    return (
      <div className="min-h-screen bg-white" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="border-b py-6 px-4 sm:px-6 lg:px-8" style={{ borderColor: COLOR_BORDER }}>
          <div className="max-w-3xl mx-auto">
            <button
              onClick={() => setStep('plans')}
              className="flex items-center gap-2 text-sm font-semibold hover:opacity-75"
              style={{ color: COLOR_PRIMARY }}
            >
              <ArrowLeft size={16} style={{ transform: isRTL ? 'scaleX(-1)' : 'none' }} />
              Back to Plans
            </button>
          </div>
        </div>

        <div className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-black text-center mb-12" style={{ color: COLOR_PRIMARY }}>
              Complete Your Signup
            </h1>
            <StripeCheckout
              planId={selectedPlan}
              planName={plan.name}
              amount={getPrice(plan.basePrice)}
              features={plan.features}
              onCancel={() => setStep('plans')}
              onSuccess={() => {
                window.location.href = '/dashboard'
              }}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="border-b py-8 px-4 sm:px-6 lg:px-8" style={{ borderColor: COLOR_BORDER }}>
        <div className="max-w-5xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold hover:opacity-75" style={{ color: COLOR_PRIMARY }}>
            <ArrowLeft size={16} style={{ transform: isRTL ? 'scaleX(-1)' : 'none' }} />
            Back to Home
          </Link>
          <h1 className="text-4xl font-black mt-4 mb-2" style={{ color: COLOR_PRIMARY }}>
            Choose Your Plan
          </h1>
          <p style={{ color: COLOR_TEXT_SECONDARY }}>
            14-day free trial. Cancel anytime. No credit card required for trial.
          </p>
        </div>
      </div>

      {/* Plans */}
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, idx) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`rounded-lg p-8 border transition-all relative ${
                  plan.recommended ? 'ring-2 md:scale-105' : ''
                }`}
                style={{
                  borderColor: plan.recommended ? COLOR_ACCENT : COLOR_BORDER,
                  background: plan.recommended ? COLOR_ACCENT + '08' : 'white',
                }}
              >
                {plan.recommended && (
                  <div
                    className="absolute -top-4 left-8 inline-block px-3 py-1 rounded-full text-xs font-bold text-white"
                    style={{ background: COLOR_ACCENT }}
                  >
                    Recommended
                  </div>
                )}

                <h3 className="text-2xl font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
                  {plan.name}
                </h3>
                <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-sm mb-6">
                  {plan.description}
                </p>

                <div className="mb-6">
                  {plan.basePrice > 0 ? (
                    <>
                      <p className="text-4xl font-black" style={{ color: COLOR_ACCENT }}>
                        ${plan.basePrice}
                      </p>
                      <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-xs mt-1">
                        per month
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-2xl font-bold" style={{ color: COLOR_PRIMARY }}>
                        Custom Pricing
                      </p>
                    </>
                  )}
                </div>

                <button
                  onClick={() => {
                    setSelectedPlan(plan.id)
                    setStep('checkout')
                  }}
                  className={`w-full px-6 py-3 rounded-lg font-bold transition-all mb-6 ${
                    plan.recommended ? 'text-white' : ''
                  }`}
                  style={{
                    background: plan.recommended ? COLOR_ACCENT : COLOR_ACCENT + '20',
                    color: plan.recommended ? 'white' : COLOR_ACCENT,
                  }}
                >
                  {plan.id === 'enterprise' ? 'Contact Sales' : 'Start Free Trial'}
                </button>

                <div className="space-y-3">
                  {plan.features.map((feature, fidx) => (
                    <div key={fidx} className="flex gap-3 text-sm">
                      <span style={{ color: COLOR_ACCENT }}>✓</span>
                      <span style={{ color: COLOR_TEXT_SECONDARY }}>{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* FAQ */}
          <div className="mt-20 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8" style={{ color: COLOR_PRIMARY }}>
              Questions?
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: "What's included in the free trial?",
                  a: 'Full access to your selected plan for 14 days. No credit card required.',
                },
                {
                  q: 'Can I change plans later?',
                  a: 'Yes, upgrade or downgrade anytime. Changes take effect on your next billing cycle.',
                },
                {
                  q: 'What payment methods do you accept?',
                  a: 'All major credit cards via Stripe in USD, CAD, and AED.',
                },
              ].map((faq, idx) => (
                <div key={idx} className="p-4 rounded-lg border" style={{ borderColor: COLOR_BORDER }}>
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
      </div>
    </div>
  )
}

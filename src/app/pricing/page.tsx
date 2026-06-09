'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckCircle2, ArrowRight, Crown } from 'lucide-react'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER, COLOR_BG_PRIMARY } from '@/styles/forward-colors'

export default function PricingPage() {
  const router = useRouter()

  const handleSelectPlan = (plan: 'freemium' | 'premium') => {
    router.push(`/seller/register?plan=${plan}`)
  }

  return (
    <div className="min-h-screen" style={{ background: COLOR_BG_PRIMARY }}>
      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-8 py-6 border-b"
        style={{ borderColor: COLOR_BORDER }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-black text-lg" style={{ background: COLOR_ACCENT }}>
              F
            </div>
            <span className="font-black text-xl" style={{ color: COLOR_PRIMARY }}>
              Forward OS
            </span>
          </Link>
          <Link href="/" className="text-sm font-bold" style={{ color: COLOR_TEXT_SECONDARY }}>
            ← Back to Home
          </Link>
        </div>
      </motion.nav>

      {/* Header */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-8 py-16 text-center"
      >
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl lg:text-6xl font-black mb-6" style={{ color: COLOR_PRIMARY }}>
            Simple Pricing for Sellers
          </h1>
          <p className="text-xl" style={{ color: COLOR_TEXT_SECONDARY }}>
            Choose the plan that fits your business. Start free, upgrade anytime.
          </p>
        </div>
      </motion.section>

      {/* Pricing Cards */}
      <motion.section className="px-8 py-12">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* FREEMIUM */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border-2 p-8 bg-white hover:shadow-lg transition-all"
            style={{ borderColor: COLOR_BORDER }}
          >
            <h2 className="text-3xl font-black mb-2" style={{ color: COLOR_PRIMARY }}>
              Freemium
            </h2>
            <p style={{ color: COLOR_TEXT_SECONDARY }} className="mb-8">
              Perfect for getting started
            </p>

            <div className="mb-8">
              <div className="text-5xl font-black" style={{ color: COLOR_ACCENT }}>
                FREE
              </div>
              <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-sm mt-2">
                No credit card required
              </p>
            </div>

            <button
              onClick={() => handleSelectPlan('freemium')}
              className="w-full py-3 rounded-lg font-bold text-white transition-all hover:opacity-90 mb-8"
              style={{ background: COLOR_ACCENT }}
            >
              Get Started Free
            </button>

            <div className="space-y-4">
              <h3 className="font-bold text-sm" style={{ color: COLOR_PRIMARY }}>
                What's Included:
              </h3>
              <ul className="space-y-3 text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                {[
                  '📋 Listed on marketplace',
                  '🔍 Searchable by buyers',
                  '💬 Buyer messaging',
                  '📊 Basic analytics',
                  '📸 Photo gallery',
                  '📄 Document upload',
                  '⏰ 6-month listing',
                  '📧 Email support',
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span>{feature.split(' ')[0]}</span>
                    {feature.substring(2)}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* PREMIUM */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative rounded-2xl border-2 p-8 bg-white hover:shadow-lg transition-all overflow-hidden"
            style={{ borderColor: '#F59E0B' }}
          >
            <div className="absolute top-0 right-0 bg-yellow-400 text-white text-xs font-black px-4 py-1 rounded-bl-lg">
              RECOMMENDED
            </div>

            <div className="pt-4">
              <div className="flex items-center gap-2 mb-2">
                <Crown size={24} style={{ color: '#F59E0B' }} />
                <h2 className="text-3xl font-black" style={{ color: COLOR_PRIMARY }}>
                  Premium
                </h2>
              </div>
              <p style={{ color: COLOR_TEXT_SECONDARY }} className="mb-8">
                Maximum visibility & buyer trust
              </p>
            </div>

            <div className="mb-8">
              <div className="text-5xl font-black" style={{ color: '#F59E0B' }}>
                $99
              </div>
              <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-sm mt-2">
                per month (after approval)
              </p>
              <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-xs mt-1">
                ✓ First month free after account approval
              </p>
            </div>

            <button
              onClick={() => handleSelectPlan('premium')}
              className="w-full py-3 rounded-lg font-bold text-white transition-all hover:opacity-90 mb-8 flex items-center justify-center gap-2"
              style={{ background: '#F59E0B' }}
            >
              Choose Premium
              <Crown size={18} />
            </button>

            <div className="space-y-4">
              <h3 className="font-bold text-sm" style={{ color: COLOR_PRIMARY }}>
                Everything in Freemium, Plus:
              </h3>
              <ul className="space-y-3 text-sm font-semibold" style={{ color: '#F59E0B' }}>
                {[
                  '⭐ Featured on homepage',
                  '📊 Financial data visible',
                  '🔐 Secure data room',
                  '📈 Advanced analytics',
                  '💎 Premium seller badge',
                  '🎯 Priority buyer matching',
                  '💬 Enhanced messaging',
                  '🔔 24/7 priority support',
                  '🌍 Higher search ranking',
                  '📸 Unlimited photos',
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span>{feature.split(' ')[0]}</span>
                    {feature.substring(2)}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 pt-8 border-t p-4 rounded-lg" style={{ borderColor: COLOR_BORDER, background: 'rgba(245, 158, 11, 0.1)' }}>
              <p className="text-xs font-bold" style={{ color: '#F59E0B' }}>
                💡 Complete 80%+ of your listing = 5x more buyer interest!
              </p>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* FAQ */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="px-8 py-16"
      >
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-12" style={{ color: COLOR_PRIMARY }}>
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            {[
              {
                q: 'Do I need a credit card to start?',
                a: 'No! Freemium is 100% free. Premium is also free to try after approval - you only pay if you keep it.',
              },
              {
                q: 'What happens during account approval?',
                a: 'We verify you\'re a real business (1-24 hours). Once approved, submit your business details with no time limit.',
              },
              {
                q: 'Can I upgrade to Premium later?',
                a: 'Yes! Start free, upgrade anytime. Your listing quality score (completeness) determines your visibility regardless of plan.',
              },
              {
                q: 'What affects my listing visibility?',
                a: 'Completeness score (0-100%): Business description, financials, photos, documents, customers. Premium adds featured placement.',
              },
              {
                q: 'Can I cancel Premium anytime?',
                a: 'Absolutely. Cancel anytime, no fees. Your Freemium listing stays live with all your data intact.',
              },
            ].map((faq, i) => (
              <details key={i} className="p-4 rounded-lg border cursor-pointer group" style={{ borderColor: COLOR_BORDER, background: 'white' }}>
                <summary className="font-bold flex items-center justify-between" style={{ color: COLOR_PRIMARY }}>
                  <span>{faq.q}</span>
                  <span className="group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-4 text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Footer */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="px-8 py-16 text-center border-t"
        style={{ borderColor: COLOR_BORDER, background: COLOR_BG_PRIMARY }}
      >
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-black mb-6" style={{ color: COLOR_PRIMARY }}>
            Start Selling Today
          </h2>

          <p className="text-lg mb-8" style={{ color: COLOR_TEXT_SECONDARY }}>
            Choose your plan above and get approved in 24 hours. The better your business details, the more buyers you'll reach.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => handleSelectPlan('freemium')}
              className="px-8 py-4 rounded-lg font-bold text-white transition-all hover:opacity-90 flex items-center justify-center gap-2"
              style={{ background: COLOR_ACCENT }}
            >
              Get Started Free
              <ArrowRight size={20} />
            </button>
            <button
              onClick={() => handleSelectPlan('premium')}
              className="px-8 py-4 rounded-lg font-bold border-2 transition-all hover:bg-gray-50 flex items-center justify-center gap-2"
              style={{ borderColor: '#F59E0B', color: '#F59E0B' }}
            >
              Choose Premium
              <Crown size={20} />
            </button>
          </div>

          <p className="text-xs mt-8" style={{ color: COLOR_TEXT_SECONDARY }}>
            Questions? Email <a href="mailto:support@forward.com" className="underline">support@forward.com</a>
          </p>
        </div>
      </motion.section>
    </div>
  )
}

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Flame, CheckCircle2, ArrowRight, Zap, TrendingUp, Shield, Users, BarChart3 } from 'lucide-react'
import { PublicHeader } from '@/components/Navigation'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER } from '@/styles/forward-colors'

export default function HomePage() {
  const [emailSignup, setEmailSignup] = useState('')

  const stats = [
    { number: '$2.5T', label: 'Annual M&A Market' },
    { number: '500+', label: 'Verified Deals' },
    { number: '91%', label: 'Prediction Accuracy' },
    { number: '24-36mo', label: 'Competitive Moat' },
  ]

  const userTypes = [
    {
      icon: '💼',
      title: 'For Sellers',
      description: 'Know exactly what your deal is worth. Find the right buyers. Time your exit perfectly.',
      benefits: [
        'Fair valuation powered by AI ($8.1M-$9.2M ranges)',
        'Optimal timing recommendations (+$680K uplift shown)',
        '30% faster close with buyer matching',
        'Transparent market intelligence',
      ],
      cta: 'List Your Business',
      href: '/auth/signup?type=seller',
    },
    {
      icon: '🎯',
      title: 'For Buyers',
      description: 'Discover the best deals before the market. Get AI-powered intelligence on every opportunity.',
      benefits: [
        '5 AI predictions per deal (87% accuracy)',
        'Deal success probability scoring',
        'Broker reputation ratings (verified outcomes)',
        'API access to market data',
      ],
      cta: 'Find Deals',
      href: '/auth/signup?type=buyer',
    },
    {
      icon: '🤝',
      title: 'For Brokers',
      description: 'Build your reputation on outcomes. Get more deal flow. Close faster with AI insights.',
      benefits: [
        'Reputation system (followers, ratings, success %)',
        'Deal intelligence tools',
        'Institutional buyer access',
        '$2-5k/month from platform',
      ],
      cta: 'Join the Network',
      href: '/auth/signup?type=broker',
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />

      <div style={{ paddingTop: '80px' }}>
        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8" style={{ background: COLOR_PRIMARY + '05' }}>
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Flame size={24} style={{ color: COLOR_ACCENT }} />
                <span className="text-sm font-bold" style={{ color: COLOR_ACCENT }}>
                  AI-Powered M&A Intelligence Platform
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl font-black mb-6" style={{ color: COLOR_PRIMARY }}>
                Stop Guessing. Start Winning.
              </h1>

              <p className="text-xl mb-8" style={{ color: COLOR_TEXT_SECONDARY }}>
                Forward OS gives you the exact intelligence brokers charge 5-10% to provide. 
                AI predictions, market data, and institutional connections in one platform.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                {stats.map(stat => (
                  <div key={stat.label} className="p-4 rounded-lg bg-white border" style={{ borderColor: COLOR_BORDER }}>
                    <p className="text-2xl font-black" style={{ color: COLOR_ACCENT }}>
                      {stat.number}
                    </p>
                    <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/auth/signup"
                  className="px-8 py-4 rounded-lg font-bold text-white text-center transition-all hover:opacity-90"
                  style={{ background: COLOR_ACCENT }}
                >
                  Start Free Trial →
                </Link>
                <Link
                  href="/marketplace"
                  className="px-8 py-4 rounded-lg font-bold border text-center transition-all hover:bg-gray-50"
                  style={{ borderColor: COLOR_BORDER, color: COLOR_PRIMARY }}
                >
                  Browse Deals
                </Link>
              </div>

              <p className="text-xs mt-4" style={{ color: COLOR_TEXT_SECONDARY }}>
                ✅ No credit card required • ✅ Free access to 47 deals • ✅ SOC 2 Type II certified
              </p>
            </motion.div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 border-b" style={{ borderColor: COLOR_BORDER }}>
          <div className="max-w-5xl mx-auto">
            <p className="text-center text-sm font-bold mb-6" style={{ color: COLOR_TEXT_SECONDARY }}>
              TRUSTED BY SELLERS, BUYERS & BROKERS
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <p className="text-3xl font-black" style={{ color: COLOR_ACCENT }}>
                  $2.4B+
                </p>
                <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-sm">
                  Deals Listed Annually
                </p>
              </div>
              <div>
                <p className="text-3xl font-black" style={{ color: COLOR_ACCENT }}>
                  500+
                </p>
                <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-sm">
                  Verified M&A Transactions
                </p>
              </div>
              <div>
                <p className="text-3xl font-black" style={{ color: COLOR_ACCENT }}>
                  87%
                </p>
                <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-sm">
                  Deal Success Probability
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* User Types */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl font-black text-center mb-12" style={{ color: COLOR_PRIMARY }}>
              Built for Every Role in M&A
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {userTypes.map((user, idx) => (
                <motion.div
                  key={user.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-8 rounded-lg border hover:shadow-lg transition-all"
                  style={{ borderColor: COLOR_BORDER }}
                >
                  <p className="text-4xl mb-4">{user.icon}</p>
                  <h3 className="text-2xl font-black mb-3" style={{ color: COLOR_PRIMARY }}>
                    {user.title}
                  </h3>
                  <p className="mb-6" style={{ color: COLOR_TEXT_SECONDARY }}>
                    {user.description}
                  </p>

                  <ul className="space-y-3 mb-8">
                    {user.benefits.map(benefit => (
                      <li key={benefit} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 size={18} style={{ color: COLOR_ACCENT }} className="flex-shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={user.href}
                    className="block py-3 rounded-lg font-bold text-center transition-all hover:opacity-90"
                    style={{ background: COLOR_ACCENT + '20', color: COLOR_ACCENT }}
                  >
                    {user.cta} →
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Forward OS */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 border-t" style={{ borderColor: COLOR_BORDER, background: COLOR_ACCENT + '05' }}>
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl font-black text-center mb-12" style={{ color: COLOR_PRIMARY }}>
              Why Competitors Can Only Acquire Us
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-xl font-black mb-3" style={{ color: COLOR_PRIMARY }}>
                    🧠 5 AI Models
                  </h3>
                  <p style={{ color: COLOR_TEXT_SECONDARY }}>
                    Trained on 500+ verified M&A deals with real outcomes. Deal success (91% accuracy), 
                    timing optimization (+$680K shown), pricing models (93% accuracy), growth forecasts, and buyer matching.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-black mb-3" style={{ color: COLOR_PRIMARY }}>
                    🏆 Broker Reputation
                  </h3>
                  <p style={{ color: COLOR_TEXT_SECONDARY }}>
                    Brokers build followers, ratings, and success scores. Leaving = losing reputation capital. 
                    Lock-in through social proof and deal flow.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-black mb-3" style={{ color: COLOR_PRIMARY }}>
                    👥 Community Validation
                  </h3>
                  <p style={{ color: COLOR_TEXT_SECONDARY }}>
                    631 verified deal outcomes. Community reviews validate predictions. Models improve 1% per deal. 
                    Feedback loop competitors can't replicate.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-xl font-black mb-3" style={{ color: COLOR_PRIMARY }}>
                    🔐 Institutional Lock-In
                  </h3>
                  <p style={{ color: COLOR_TEXT_SECONDARY }}>
                    White-label API. Custom integrations. Data room connections. Switching = 6+ months of 
                    re-integration. Customers won't leave.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-black mb-3" style={{ color: COLOR_PRIMARY }}>
                    📊 Real Market Data
                  </h3>
                  <p style={{ color: COLOR_TEXT_SECONDARY }}>
                    500+ deal outcomes flowing in continuously. Real-time model training. Predictions improve 
                    every single deal.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-black mb-3" style={{ color: COLOR_PRIMARY }}>
                    ⏱️ 24-36 Month Head Start
                  </h3>
                  <p style={{ color: COLOR_TEXT_SECONDARY }}>
                    Competitors need 3+ years to build equivalent moat. We're growing the gap daily. 
                    Acquisition is their only option.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Phase Roadmap */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl font-black text-center mb-12" style={{ color: COLOR_PRIMARY }}>
              The 5-Phase Moat Strategy
            </h2>

            <div className="space-y-4">
              {[
                { phase: 'Phase 1', title: 'Beautiful UI + Auth', time: '1-week defensibility', status: '✅ Live' },
                { phase: 'Phase 2', title: 'Market Intelligence', time: '6-12 month defensibility', status: '✅ Live' },
                { phase: 'Phase 3', title: 'Institutional Network', time: '6-18 month defensibility', status: '✅ Live' },
                { phase: 'Phase 4', title: 'AI Predictions', time: '12-18 month defensibility', status: '✅ Live' },
                { phase: 'Phase 5', title: 'Network Effects', time: '24-36 month defensibility', status: '✅ Live' },
              ].map((item, idx) => (
                <motion.div
                  key={item.phase}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-6 rounded-lg border flex items-start justify-between"
                  style={{ borderColor: COLOR_BORDER, background: COLOR_ACCENT + '05' }}
                >
                  <div>
                    <p className="font-bold" style={{ color: COLOR_ACCENT }}>
                      {item.phase}
                    </p>
                    <h3 className="text-xl font-black" style={{ color: COLOR_PRIMARY }}>
                      {item.title}
                    </h3>
                    <p className="text-sm mt-2" style={{ color: COLOR_TEXT_SECONDARY }}>
                      {item.time}
                    </p>
                  </div>
                  <span className="text-xl font-bold">{item.status}</span>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 p-6 rounded-lg border" style={{ borderColor: COLOR_BORDER, background: COLOR_ACCENT + '08' }}>
              <p style={{ color: COLOR_PRIMARY }} className="text-center font-bold text-lg">
                After Phase 5: Acquisition-Only Outcome
              </p>
              <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-center mt-2">
                Competitors can't replicate the technology. They can only acquire the company.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 border-t" style={{ borderColor: COLOR_BORDER }}>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-black mb-6" style={{ color: COLOR_PRIMARY }}>
              Ready to Win Your Next M&A Deal?
            </h2>
            <p className="text-lg mb-8" style={{ color: COLOR_TEXT_SECONDARY }}>
              Get AI-powered intelligence, connect with verified brokers, and close faster.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/signup"
                className="px-8 py-4 rounded-lg font-bold text-white transition-all hover:opacity-90"
                style={{ background: COLOR_ACCENT }}
              >
                Get Started Free →
              </Link>
              <Link
                href="/contact-sales"
                className="px-8 py-4 rounded-lg font-bold border transition-all hover:bg-gray-50"
                style={{ borderColor: COLOR_BORDER, color: COLOR_PRIMARY }}
              >
                Enterprise Demo
              </Link>
            </div>
            <p className="text-xs mt-6" style={{ color: COLOR_TEXT_SECONDARY }}>
              ✅ No credit card required • ✅ Instant access • ✅ Bank-level security
            </p>
          </div>
        </section>

        {/* Footer */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 border-t" style={{ borderColor: COLOR_BORDER, background: COLOR_PRIMARY + '02' }}>
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div>
                <h4 className="font-bold mb-4" style={{ color: COLOR_PRIMARY }}>Product</h4>
                <ul className="space-y-2 text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                  <li><Link href="/marketplace" className="hover:underline">Marketplace</Link></li>
                  <li><Link href="/institutional" className="hover:underline">Institutional</Link></li>
                  <li><Link href="/pricing" className="hover:underline">Pricing</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-4" style={{ color: COLOR_PRIMARY }}>Company</h4>
                <ul className="space-y-2 text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                  <li><Link href="/about" className="hover:underline">About Us</Link></li>
                  <li><Link href="/contact-sales" className="hover:underline">Contact</Link></li>
                  <li><Link href="/help" className="hover:underline">Help Center</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-4" style={{ color: COLOR_PRIMARY }}>Legal</h4>
                <ul className="space-y-2 text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                  <li><Link href="/privacy" className="hover:underline">Privacy</Link></li>
                  <li><Link href="/terms" className="hover:underline">Terms</Link></li>
                  <li><Link href="/security" className="hover:underline">Security</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-4" style={{ color: COLOR_PRIMARY }}>Resources</h4>
                <ul className="space-y-2 text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                  <li><Link href="/blog" className="hover:underline">Blog</Link></li>
                  <li><Link href="/guides" className="hover:underline">Guides</Link></li>
                  <li><Link href="/api-docs" className="hover:underline">API Docs</Link></li>
                </ul>
              </div>
            </div>

            <div className="border-t pt-8" style={{ borderColor: COLOR_BORDER }}>
              <p className="text-center text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                © 2024 Forward OS. All rights reserved. | 
                <Link href="/partnerships" className="ml-2 font-bold hover:underline" style={{ color: COLOR_ACCENT }}>
                  Partnership Opportunities
                </Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

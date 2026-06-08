'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Check, Zap, Crown, Sparkles } from 'lucide-react'
import { PublicHeader } from '@/components/Navigation'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER, COLOR_SURFACE_SUCCESS } from '@/styles/forward-colors'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function PricingPage() {
  const tiers = [
    {
      name: 'STARTER',
      price: 'Free',
      description: 'For founders, family businesses, startups, and first-time sellers.',
      icon: Zap,
      color: '#9A9A9A',
      cta: 'Get Started',
      features: [
        'Company profile',
        'AI valuation estimate',
        'Strategic Paths Engine',
        'Deal readiness score',
        'Buyer discovery',
        'Seller discovery',
        'Basic NDA workflow',
        'Capital raise assessment',
        'Basic acquisition target finder',
      ],
      limits: [
        '1 company',
        '5 AI analyses per month',
        '1 active opportunity',
      ],
      goal: 'Acquire users.',
      highlighted: false,
    },
    {
      name: 'GROWTH',
      price: '$99',
      period: '/month',
      description: 'For companies with revenue under $5M.',
      icon: Crown,
      color: COLOR_ACCENT,
      cta: 'Start Free Trial',
      features: [
        'Full DealOS profile',
        'AI Strategic Advisor',
        'Unlimited valuations',
        'Investor matching',
        'Lender matching',
        'Acquisition target discovery',
        'Confidential opportunity room',
        'AI market intelligence',
        'AI industry benchmarking',
        'Buyer outreach tools',
      ],
      limits: [
        '3 active opportunities',
        '5 users',
      ],
      highlighted: false,
    },
    {
      name: 'PROFESSIONAL',
      price: '$499',
      period: '/month',
      description: 'Everything you need for serious M&A.',
      icon: Crown,
      color: COLOR_ACCENT,
      cta: 'Start Free Trial',
      features: [
        'Financing OS (capital raise management, investor CRM, family office intelligence)',
        'M&A OS (buyer matching, seller matching, roll-up engine, acquisition scoring)',
        'Deal Room (secure data room, AI document analysis, watermarking)',
        'Trust Layer (verification badge, enhanced KYC, proof of funds)',
        'Unlimited internal users',
        'Audit logs',
      ],
      highlighted: true,
      badge: 'Primary Package',
      note: 'Everything in Growth plus:',
    },
  ]

  const dealRoomPricing = [
    {
      name: 'Essential Deal Room',
      price: '$1,500',
      period: '/month',
      description: 'For single transactions',
      features: [
        'Unlimited documents',
        'NDA automation',
        'AI diligence',
        'Q&A workflows',
        'Audit trail',
      ],
    },
    {
      name: 'Enterprise Deal Room',
      price: '$5,000',
      period: '/month',
      description: 'For competitive processes',
      features: [
        'Multiple bidders',
        'Advanced diligence',
        'Legal collaboration',
        'AI negotiation assistant',
        'Buyer scoring',
      ],
    },
  ]

  const successFees = [
    { category: 'Capital Raises', fee: '0.25%', min: '$5,000', max: '$100,000' },
    { category: 'Debt Placements', fee: '0.15%', min: '$5,000', max: '—' },
    { category: 'M&A Transactions', fee: '0.25%', min: '$10,000', max: '$250,000' },
    { category: 'Roll-Up Transactions', fee: '0.10%', min: '—', max: 'Volume discount' },
  ]

  const addOns = [
    {
      name: 'Investor Intelligence',
      price: '$299/month',
      description: 'Access to family offices, PE funds, venture funds, strategic investors, acquisition buyers, corporate development teams',
    },
    {
      name: 'M&A Intelligence',
      price: '$499/month',
      description: 'Acquisition target engine, strategic fit scoring, synergy modeling, roll-up identification, market maps',
    },
    {
      name: 'AI Board Member™',
      price: '$399/month',
      description: 'Board packages, risk analysis, governance recommendations, executive summaries, board-ready presentations',
    },
    {
      name: 'AI Corporate Advisor™',
      price: '$999/month',
      description: 'Acts as CFO, corporate development officer, M&A advisor, capital markets advisor, strategic planner. Trained on your company data.',
    },
  ]

  return (
    <div>
      <PublicHeader />
      <motion.div
        className="bg-white"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Hero Section */}
      <motion.section
        className="max-w-7xl mx-auto px-6 py-16 md:py-24 text-center"
        variants={itemVariants}
      >
        <div className="mb-6">
          <span className="inline-block px-4 py-2 rounded-full font-semibold text-sm" style={{ background: '#FEE2CC', color: COLOR_ACCENT }}>
            🚀 The AI Operating System for Company Success
          </span>
        </div>
        <h1 className="text-5xl md:text-6xl font-black mb-6" style={{ color: COLOR_PRIMARY }}>
          ForwardOS™ Pricing
        </h1>
        <p className="text-xl max-w-3xl mx-auto mb-8" style={{ color: COLOR_TEXT_SECONDARY }}>
          In buying, selling, rolling up, and gaining access on inorganic growth or recover engine.
        </p>
        <div className="p-8 rounded-lg border-2" style={{ borderColor: COLOR_ACCENT, background: '#FFF7F3' }}>
          <p className="text-lg font-semibold mb-4" style={{ color: COLOR_PRIMARY }}>
            Our Winning Strategy
          </p>
          <p className="mb-4" style={{ color: COLOR_TEXT_SECONDARY }}>
            Get every company into the ecosystem. Then monetize transactions, capital raises, acquisitions, IPOs, and premium intelligence later.
          </p>
          <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
            Research across B2B SaaS and marketplace pricing shows successful platforms typically use a combination of subscription tiers, enterprise plans, and transaction-based fees rather than relying solely on listings.
          </p>
        </div>
      </motion.section>

      {/* Subscription Tiers */}
      <motion.section className="max-w-7xl mx-auto px-6 py-16" variants={itemVariants}>
        <h2 className="text-4xl font-black mb-4 text-center" style={{ color: COLOR_PRIMARY }}>
          Subscription Tiers
        </h2>
        <p className="text-center mb-12" style={{ color: COLOR_TEXT_SECONDARY }}>
          Choose the plan that fits your stage and goals
        </p>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
        >
          {tiers.map((tier) => {
            const Icon = tier.icon
            return (
              <motion.div
                key={tier.name}
                className="relative p-8 rounded-xl border-2 transition-all"
                style={{
                  borderColor: tier.highlighted ? COLOR_ACCENT : COLOR_BORDER,
                  background: tier.highlighted ? '#FFF7F3' : 'white',
                  transform: tier.highlighted ? 'scale(1.05)' : 'scale(1)',
                }}
                variants={itemVariants}
                whileHover={{ y: -8 }}
              >
                {tier.highlighted && (
                  <div
                    className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-4 py-2 rounded-full text-xs font-bold text-white"
                    style={{ background: COLOR_ACCENT }}
                  >
                    {tier.badge}
                  </div>
                )}

                {/* Header */}
                <div className="mb-6">
                  <Icon className="w-8 h-8 mb-4" style={{ color: tier.color }} />
                  <h3 className="text-2xl font-black mb-2" style={{ color: COLOR_PRIMARY }}>
                    {tier.name}
                  </h3>
                  <div className="mb-4">
                    <span className="text-4xl font-black" style={{ color: tier.color }}>
                      {tier.price}
                    </span>
                    {tier.period && (
                      <span style={{ color: COLOR_TEXT_SECONDARY }}>{tier.period}</span>
                    )}
                  </div>
                  <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                    {tier.description}
                  </p>
                </div>

                {/* CTA */}
                <button
                  className="w-full py-3 rounded-lg font-bold text-white mb-8 transition-all hover:opacity-90"
                  style={{ background: tier.color }}
                >
                  {tier.cta}
                </button>

                {/* Features */}
                {tier.note && (
                  <p className="text-xs font-semibold mb-4 italic" style={{ color: COLOR_TEXT_SECONDARY }}>
                    {tier.note}
                  </p>
                )}
                <div className="space-y-3 mb-8">
                  {tier.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-3">
                      <Check className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: tier.color }} />
                      <span className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Limits */}
                {tier.limits && (
                  <>
                    <div className="border-t mb-6" style={{ borderColor: COLOR_BORDER }}></div>
                    <div className="mb-6">
                      <p className="text-xs font-semibold mb-3 uppercase" style={{ color: COLOR_TEXT_SECONDARY }}>
                        Limits
                      </p>
                      <div className="space-y-2">
                        {tier.limits.map((limit) => (
                          <p key={limit} className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                            • {limit}
                          </p>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Goal */}
                {tier.goal && (
                  <div className="p-4 rounded-lg" style={{ background: tier.highlighted ? 'rgba(255, 140, 0, 0.1)' : '#F7F6F4' }}>
                    <p className="text-sm font-semibold" style={{ color: tier.color }}>
                      Goal: {tier.goal}
                    </p>
                  </div>
                )}
              </motion.div>
            )
          })}
        </motion.div>
      </motion.section>

      {/* Founding Member Pricing */}
      <motion.section className="max-w-7xl mx-auto px-6 py-16" variants={itemVariants}>
        <div className="p-8 rounded-xl border-2" style={{ borderColor: COLOR_ACCENT, background: COLOR_SURFACE_SUCCESS }}>
          <h3 className="text-2xl font-black mb-4" style={{ color: COLOR_PRIMARY }}>
            🎯 Founding Member Pricing
          </h3>
          <p className="mb-6" style={{ color: COLOR_TEXT_SECONDARY }}>
            For the first 100 UAE and Canadian companies. Price lock for life.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-lg bg-white border" style={{ borderColor: COLOR_BORDER }}>
              <p className="font-semibold mb-2" style={{ color: COLOR_PRIMARY }}>Growth</p>
              <p className="text-3xl font-black mb-2" style={{ color: COLOR_ACCENT }}>$49/month</p>
              <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>Forever (normally $99/month)</p>
            </div>
            <div className="p-6 rounded-lg bg-white border" style={{ borderColor: COLOR_BORDER }}>
              <p className="font-semibold mb-2" style={{ color: COLOR_PRIMARY }}>Professional</p>
              <p className="text-3xl font-black mb-2" style={{ color: COLOR_ACCENT }}>$249/month</p>
              <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>Forever (normally $499/month)</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Deal Room Pricing */}
      <motion.section className="max-w-7xl mx-auto px-6 py-16" variants={itemVariants}>
        <h2 className="text-4xl font-black mb-4 text-center" style={{ color: COLOR_PRIMARY }}>
          Deal Room Pricing
        </h2>
        <p className="text-center mb-12" style={{ color: COLOR_TEXT_SECONDARY }}>
          Only charged when a transaction goes live
        </p>

        <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-8" variants={containerVariants}>
          {dealRoomPricing.map((room) => (
            <motion.div
              key={room.name}
              className="p-8 rounded-xl border"
              style={{ borderColor: COLOR_BORDER, background: 'white' }}
              variants={itemVariants}
              whileHover={{ y: -4 }}
            >
              <h3 className="text-xl font-black mb-2" style={{ color: COLOR_PRIMARY }}>
                {room.name}
              </h3>
              <div className="mb-4">
                <span className="text-3xl font-black" style={{ color: COLOR_ACCENT }}>
                  {room.price}
                </span>
                <span style={{ color: COLOR_TEXT_SECONDARY }}>{room.period}</span>
              </div>
              <p className="text-sm mb-6" style={{ color: COLOR_TEXT_SECONDARY }}>
                {room.description}
              </p>
              <div className="space-y-3">
                {room.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <Check className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: COLOR_ACCENT }} />
                    <span className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Success Fees */}
      <motion.section className="max-w-7xl mx-auto px-6 py-16" variants={itemVariants}>
        <h2 className="text-4xl font-black mb-4 text-center" style={{ color: COLOR_PRIMARY }}>
          Success Fees
        </h2>
        <p className="text-center mb-12" style={{ color: COLOR_TEXT_SECONDARY }}>
          This is where real revenue comes from
        </p>

        <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6" variants={containerVariants}>
          {successFees.map((fee) => (
            <motion.div
              key={fee.category}
              className="p-6 rounded-xl border"
              style={{ borderColor: COLOR_BORDER, background: 'white' }}
              variants={itemVariants}
            >
              <p className="font-black text-lg mb-4" style={{ color: COLOR_PRIMARY }}>
                {fee.category}
              </p>
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-semibold uppercase" style={{ color: COLOR_TEXT_SECONDARY }}>
                    Fee
                  </p>
                  <p className="text-2xl font-black" style={{ color: COLOR_ACCENT }}>
                    {fee.fee}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase" style={{ color: COLOR_TEXT_SECONDARY }}>
                    Minimum
                  </p>
                  <p style={{ color: COLOR_PRIMARY }}>{fee.min}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase" style={{ color: COLOR_TEXT_SECONDARY }}>
                    Maximum
                  </p>
                  <p style={{ color: COLOR_PRIMARY }}>{fee.max}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Add-Ons */}
      <motion.section className="max-w-7xl mx-auto px-6 py-16" variants={itemVariants}>
        <h2 className="text-4xl font-black mb-4 text-center" style={{ color: COLOR_PRIMARY }}>
          Premium Add-Ons
        </h2>
        <p className="text-center mb-12" style={{ color: COLOR_TEXT_SECONDARY }}>
          Enhance your Forward OS experience with specialized tools
        </p>

        <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-8" variants={containerVariants}>
          {addOns.map((addon) => (
            <motion.div
              key={addon.name}
              className="p-8 rounded-xl border"
              style={{ borderColor: COLOR_BORDER, background: 'white' }}
              variants={itemVariants}
              whileHover={{ y: -4 }}
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-black flex-1" style={{ color: COLOR_PRIMARY }}>
                  {addon.name}
                </h3>
                <Sparkles className="w-6 h-6" style={{ color: COLOR_ACCENT }} />
              </div>
              <p className="text-2xl font-black mb-4" style={{ color: COLOR_ACCENT }}>
                {addon.price}
              </p>
              <p style={{ color: COLOR_TEXT_SECONDARY }}>
                {addon.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Highest Margin Product */}
        <motion.div
          className="mt-8 p-8 rounded-xl border-2"
          style={{ borderColor: COLOR_ACCENT, background: '#FFF7F3' }}
          variants={itemVariants}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase mb-2" style={{ color: COLOR_ACCENT }}>
                Your Highest-Margin Product
              </p>
              <h3 className="text-2xl font-black" style={{ color: COLOR_PRIMARY }}>
                AI Corporate Advisor™
              </h3>
              <p className="text-xl font-black mt-2" style={{ color: COLOR_ACCENT }}>
                $999/month
              </p>
              <p className="mt-4" style={{ color: COLOR_TEXT_SECONDARY }}>
                Acts as CFO, corporate development officer, M&A advisor, capital markets advisor, and strategic planner—trained on your company data.
              </p>
            </div>
            <Crown className="w-12 h-12" style={{ color: COLOR_ACCENT }} />
          </div>
        </motion.div>
      </motion.section>

      {/* The Hidden Moat */}
      <motion.section className="max-w-7xl mx-auto px-6 py-16" variants={itemVariants}>
        <div className="p-12 rounded-xl border-2" style={{ borderColor: COLOR_ACCENT, background: COLOR_SURFACE_SUCCESS }}>
          <h2 className="text-3xl font-black mb-6" style={{ color: COLOR_PRIMARY }}>
            🎯 The Hidden Moat
          </h2>
          <p className="text-lg mb-6" style={{ color: COLOR_TEXT_SECONDARY }}>
            This pricing page should not sell:
          </p>
          <ul className="space-y-4 mb-8">
            {['Data rooms', 'Listings', 'AI'].map((item) => (
              <li key={item} className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full" style={{ background: COLOR_ACCENT }}></div>
                <span className="text-lg font-semibold" style={{ color: COLOR_PRIMARY }}>
                  {item}
                </span>
              </li>
            ))}
          </ul>
          <p className="text-lg font-semibold" style={{ color: COLOR_ACCENT }}>
            It should sell outcomes.
          </p>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="max-w-7xl mx-auto px-6 py-16 text-center"
        variants={itemVariants}
      >
        <h2 className="text-4xl font-black mb-6" style={{ color: COLOR_PRIMARY }}>
          Ready to Transform Your M&A Journey?
        </h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto" style={{ color: COLOR_TEXT_SECONDARY }}>
          Join the ecosystem. Get every company in first. Monetize outcomes later.
        </p>
        <Link
          href="/login"
          className="inline-block px-8 py-4 rounded-lg font-bold text-white text-lg transition-all hover:opacity-90"
          style={{ background: COLOR_ACCENT }}
        >
          Start Your Free Account →
        </Link>
      </motion.section>
    </motion.div>
    </div>
  )
}

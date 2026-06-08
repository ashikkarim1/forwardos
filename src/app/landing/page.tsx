'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  CheckCircle2, ArrowRight, Lock, Users, Zap, TrendingUp, Eye, MessageSquare,
  FileText, Shield, Rocket, BarChart3
} from 'lucide-react'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER } from '@/styles/forward-colors'
import { SellerIcon, BuyerIcon, BrokerIcon } from '@/components/Icons/UserTypeIcons'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function LandingPage() {
  return (
    <motion.div className="bg-white" initial="hidden" animate="visible" variants={containerVariants}>
      {/* Navigation */}
      <motion.nav className="px-8 py-6 border-b" style={{ borderColor: COLOR_BORDER }} variants={itemVariants}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-black text-lg" style={{ background: COLOR_ACCENT }}>
              F
            </div>
            <span className="font-black text-xl" style={{ color: COLOR_PRIMARY }}>
              Forward OS
            </span>
          </div>
          <div className="flex items-center gap-6">
            <button className="text-sm font-bold" style={{ color: COLOR_TEXT_SECONDARY }}>
              Features
            </button>
            <button className="text-sm font-bold" style={{ color: COLOR_TEXT_SECONDARY }}>
              How It Works
            </button>
            <button className="text-sm font-bold" style={{ color: COLOR_TEXT_SECONDARY }}>
              Pricing
            </button>
            <Link href="/marketplace" className="text-sm font-bold" style={{ color: COLOR_TEXT_SECONDARY }}>
              Marketplace
            </Link>
            <Link href="/dashboard/seller" className="px-6 py-2 rounded-lg font-bold text-white transition-all hover:opacity-90" style={{ background: COLOR_ACCENT }}>
              Sign In
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* ==================== HERO ==================== */}
      <motion.section className="px-8 py-20" variants={itemVariants}>
        <div className="max-w-7xl mx-auto text-center">
          {/* Tagline */}
          <motion.div className="mb-8" variants={itemVariants}>
            <p className="text-sm font-black uppercase tracking-widest mb-4" style={{ color: COLOR_ACCENT }}>
              🚀 The World's First Strategic Transaction Operating System
            </p>
          </motion.div>

          {/* Main Heading */}
          <motion.h1 className="text-6xl lg:text-7xl font-black mb-6 leading-tight" style={{ color: COLOR_PRIMARY }} variants={itemVariants}>
            Move Forward<br />
            <span style={{ color: COLOR_ACCENT }}>With Confidence</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p className="text-2xl mb-12 max-w-3xl mx-auto" style={{ color: COLOR_TEXT_SECONDARY }} variants={itemVariants}>
            From capital raising to M&A, IPOs, roll-ups, and exits—Forward OS helps companies and their advisors navigate strategic transactions from start to close.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div className="flex items-center justify-center gap-4 mb-16 flex-wrap" variants={itemVariants}>
            <Link href="/dashboard/seller" className="px-8 py-4 rounded-lg font-bold text-white text-lg transition-all hover:opacity-90 flex items-center gap-2" style={{ background: COLOR_ACCENT }}>
              Start as Seller <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/dashboard/buyer" className="px-8 py-4 rounded-lg font-bold text-lg transition-all hover:opacity-90 border-2" style={{ borderColor: COLOR_ACCENT, color: COLOR_ACCENT }}>
              Browse as Buyer
            </Link>
            <Link href="/dashboard/broker" className="px-8 py-4 rounded-lg font-bold text-lg transition-all hover:opacity-90 border-2" style={{ borderColor: COLOR_BORDER, color: COLOR_TEXT_SECONDARY }}>
              Facilitate as Broker
            </Link>
          </motion.div>

          {/* Trust Badges */}
          <motion.div className="flex items-center justify-center gap-8 flex-wrap" variants={itemVariants}>
            {[
              { icon: Lock, label: 'KYC-Verified Network' },
              { icon: MessageSquare, label: 'In-System Comms' },
              { icon: BarChart3, label: 'Real-Time Analytics' },
              { icon: Shield, label: 'Enterprise Grade' },
            ].map((badge) => {
              const Icon = badge.icon
              return (
                <div key={badge.label} className="flex items-center gap-2" style={{ color: COLOR_TEXT_SECONDARY }}>
                  <Icon className="w-5 h-5" style={{ color: COLOR_ACCENT }} />
                  <span className="text-sm font-bold">{badge.label}</span>
                </div>
              )
            })}
          </motion.div>
        </div>
      </motion.section>

      {/* ==================== PROBLEM ==================== */}
      <motion.section className="px-8 py-20" style={{ background: '#FAFAF8' }} variants={itemVariants}>
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-black mb-12 text-center" style={{ color: COLOR_PRIMARY }}>
            Why Transactions Fail Today
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Eye,
                title: 'Fragmented Information',
                desc: 'Deals spread across emails, spreadsheets, WhatsApp, and disconnected platforms. No single source of truth.',
              },
              {
                icon: Lock,
                title: 'No Trust Layer',
                desc: 'Unverified buyers, sellers, and brokers. No confidence in counterparties. Fraud risk high.',
              },
              {
                icon: Zap,
                title: 'Slow Deal Velocity',
                desc: 'Manual approvals, document workflows, and communication delays stretch timelines from weeks to months.',
              },
              {
                icon: TrendingUp,
                title: 'No Intelligence',
                desc: 'Sellers don\'t know if buyers are serious. Brokers can\'t measure deal momentum. Buyers miss market context.',
              },
              {
                icon: Users,
                title: 'Siloed Experiences',
                desc: 'Sellers, buyers, and brokers use different platforms. No ecosystem. Coordination is a nightmare.',
              },
              {
                icon: FileText,
                title: 'Hidden Deal Value',
                desc: 'Transactions close at suboptimal terms because key parties lack visibility into market conditions.',
              },
            ].map((item, idx) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={idx}
                  className="p-6 rounded-lg border-2 bg-white"
                  style={{ borderColor: COLOR_BORDER }}
                  variants={itemVariants}
                >
                  <div className="p-3 rounded-lg mb-4 inline-block" style={{ background: COLOR_ACCENT + '20' }}>
                    <Icon className="w-6 h-6" style={{ color: COLOR_ACCENT }} />
                  </div>
                  <h3 className="font-bold text-lg mb-2" style={{ color: COLOR_PRIMARY }}>
                    {item.title}
                  </h3>
                  <p style={{ color: COLOR_TEXT_SECONDARY }}>
                    {item.desc}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </motion.section>

      {/* ==================== SOLUTION ==================== */}
      <motion.section className="px-8 py-20" variants={itemVariants}>
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-black mb-4 text-center" style={{ color: COLOR_PRIMARY }}>
            One Operating System.<br />
            <span style={{ color: COLOR_ACCENT }}>For All Strategic Transactions.</span>
          </h2>
          <p className="text-xl text-center mb-16 max-w-3xl mx-auto" style={{ color: COLOR_TEXT_SECONDARY }}>
            Forward OS is the first platform to unify sellers, buyers, and brokers in a single, verified, intelligence-driven ecosystem.
          </p>

          {/* Three Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: Shield,
                title: 'Verified Trust Layer',
                features: [
                  'One-time KYC per account',
                  'All parties verified before outreach',
                  'Complete audit trail',
                  'Enterprise-grade security',
                ],
              },
              {
                icon: Zap,
                title: 'Unified Workflow',
                features: [
                  'Request → Approval → NDA → Access',
                  'All comms flow through system',
                  'Real-time collaboration',
                  'Automated document workflows',
                ],
              },
              {
                icon: BarChart3,
                title: 'Intelligence Moat',
                features: [
                  'Real-time deal heat mapping',
                  'Buyer seriousness scoring',
                  'Market condition visibility',
                  'Predictive close probability',
                ],
              },
            ].map((pillar, idx) => {
              const Icon = pillar.icon
              return (
                <motion.div
                  key={idx}
                  className="p-8 rounded-lg border-2"
                  style={{ borderColor: COLOR_BORDER, background: 'white' }}
                  variants={itemVariants}
                >
                  <div className="p-4 rounded-lg mb-4 inline-block" style={{ background: COLOR_ACCENT + '20' }}>
                    <Icon className="w-8 h-8" style={{ color: COLOR_ACCENT }} />
                  </div>
                  <h3 className="font-bold text-2xl mb-4" style={{ color: COLOR_PRIMARY }}>
                    {pillar.title}
                  </h3>
                  <ul className="space-y-3">
                    {pillar.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2" style={{ color: COLOR_TEXT_SECONDARY }}>
                        <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: COLOR_ACCENT }} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )
            })}
          </div>
        </div>
      </motion.section>

      {/* ==================== TRANSACTION LIFECYCLE ==================== */}
      <motion.section className="px-8 py-20" style={{ background: '#FAFAF8' }} variants={itemVariants}>
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-black mb-16 text-center" style={{ color: COLOR_PRIMARY }}>
            The Complete Transaction Lifecycle
          </h2>

          {/* Timeline */}
          <div className="space-y-8">
            {[
              {
                phase: '1. Discovery',
                title: 'Buyers find deals. Sellers market confidently.',
                features: ['Anonymous deal browsing', 'Strategic fit scoring', 'Market heat visibility', 'Saved deal lists'],
              },
              {
                phase: '2. Qualification',
                title: 'KYC gates access. Trust is established.',
                features: ['One-time KYC verification', 'Verified profile visible', 'Direct messaging unlocked', 'Data room requests enabled'],
              },
              {
                phase: '3. Due Diligence',
                title: 'Data room access. Real-time engagement tracking.',
                features: ['Auto-NDA generation & signing', '7-day windows with extensions', 'Page-level analytics', 'Seriousness scoring in real-time'],
              },
              {
                phase: '4. Negotiation',
                title: 'Structured deal progression. Intelligence-driven terms.',
                features: ['LOI tracking', 'Close probability monitoring', 'Buyer momentum alerts', 'Alternative scenario modeling'],
              },
              {
                phase: '5. Close',
                title: 'All documents in one place. Timeline accountability.',
                features: ['Milestone tracking', 'Contingency management', 'Final document flow', 'Closing coordination'],
              },
            ].map((stage, idx) => (
              <motion.div key={idx} className="relative" variants={itemVariants}>
                <div className="flex items-start gap-8">
                  {/* Number */}
                  <div className="flex-shrink-0 flex items-center justify-center w-16 h-16 rounded-full text-white font-black text-xl" style={{ background: COLOR_ACCENT }}>
                    {stage.phase.split('.')[0]}
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-8 rounded-lg border-2" style={{ borderColor: COLOR_BORDER, background: 'white' }}>
                    <p className="text-sm font-bold mb-1" style={{ color: COLOR_ACCENT }}>
                      {stage.phase}
                    </p>
                    <h3 className="font-black text-2xl mb-4" style={{ color: COLOR_PRIMARY }}>
                      {stage.title}
                    </h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {stage.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2" style={{ color: COLOR_TEXT_SECONDARY }}>
                          <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: COLOR_ACCENT }} />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Arrow */}
                {idx < 4 && (
                  <div className="flex justify-center my-4">
                    <ArrowRight className="w-6 h-6 -rotate-90" style={{ color: COLOR_ACCENT }} />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ==================== FOR EACH USER TYPE ==================== */}
      <motion.section className="px-8 py-20" variants={itemVariants}>
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-black mb-16 text-center" style={{ color: COLOR_PRIMARY }}>
            Designed for Every Player
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: SellerIcon,
                title: 'For Sellers',
                subtitle: 'Control your narrative. Know your buyers.',
                features: [
                  '🚪 Data room approval authority',
                  '📊 Real-time buyer engagement tracking',
                  '🔥 Deal heat scoring & market positioning',
                  '💬 Unified buyer communication',
                  '📈 Weekly seriousness analytics',
                  '🎯 Scenario modeling for negotiation',
                ],
                cta: 'Start Selling',
                link: '/dashboard/seller',
              },
              {
                icon: BuyerIcon,
                title: 'For Buyers',
                subtitle: 'Find your next deal. Bid with confidence.',
                features: [
                  '🔍 Browse vetted opportunities anonymously',
                  '🎯 Strategic fit scoring',
                  '🔥 Market heat visibility',
                  '🔑 One-click data room requests',
                  '⏰ Access window management',
                  '📊 Competitive landscape context',
                ],
                cta: 'Browse Deals',
                link: '/dashboard/buyer',
              },
              {
                icon: BrokerIcon,
                title: 'For Brokers',
                subtitle: 'Close more deals. Earn more commission.',
                features: [
                  '✅ Approve data room access (if delegated)',
                  '📊 Seller client portfolio overview',
                  '💰 Commission tracking by deal',
                  '🤝 Facilitate buyer-seller matching',
                  '📈 Deal velocity analytics',
                  '🎯 Smart recommendation engine',
                ],
                cta: 'Start Facilitating',
                link: '/dashboard/broker',
              },
            ].map((userType, idx) => {
              const Icon = userType.icon
              return (
                <motion.div
                  key={idx}
                  className="p-8 rounded-lg border-2"
                  style={{ borderColor: COLOR_BORDER, background: 'white' }}
                  variants={itemVariants}
                >
                  <div className="mb-6">
                    <Icon />
                  </div>
                  <h3 className="font-black text-2xl mb-2" style={{ color: COLOR_PRIMARY }}>
                    {userType.title}
                  </h3>
                  <p className="text-sm mb-6" style={{ color: COLOR_TEXT_SECONDARY }}>
                    {userType.subtitle}
                  </p>
                  <ul className="space-y-3 mb-8">
                    {userType.features.map((feature) => (
                      <li key={feature} className="text-sm flex items-start gap-2" style={{ color: COLOR_TEXT_SECONDARY }}>
                        <span className="mt-1">•</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link href={userType.link} className="w-full px-4 py-3 rounded-lg font-bold text-white transition-all hover:opacity-90 text-center block" style={{ background: COLOR_ACCENT }}>
                    {userType.cta} →
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </div>
      </motion.section>

      {/* ==================== KEY FEATURES ==================== */}
      <motion.section className="px-8 py-20" style={{ background: COLOR_ACCENT + '08' }} variants={itemVariants}>
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-black mb-16 text-center" style={{ color: COLOR_PRIMARY }}>
            Powered by Strategic Intelligence
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                icon: BarChart3,
                title: 'Strategic Heat Maps',
                desc: 'See deal momentum across all buyers, industries, and regions. Real-time visibility into what matters.',
              },
              {
                icon: Eye,
                title: 'Buyer Engagement Scoring',
                desc: 'Predict buyer seriousness from viewing patterns, document requests, and response velocity.',
              },
              {
                icon: TrendingUp,
                title: 'Probability Modeling',
                desc: '6-factor close analysis updated in real-time. Know deal likelihood before you negotiate.',
              },
              {
                icon: MessageSquare,
                title: 'Unified Communication',
                desc: 'All messages, documents, and decisions in one thread. Complete audit trail. No lost context.',
              },
              {
                icon: FileText,
                title: 'CIM Studio',
                desc: 'Professional investor documents in 60 seconds. Executive summaries, teasers, investment theses.',
              },
              {
                icon: Zap,
                title: 'Exit Scenario Modeling',
                desc: 'Model 4 paths (strategic, PE, family office, IPO) with valuation and term impacts.',
              },
            ].map((feature, idx) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={idx}
                  className="p-6 rounded-lg border-2 bg-white"
                  style={{ borderColor: COLOR_BORDER }}
                  variants={itemVariants}
                >
                  <div className="p-3 rounded-lg mb-4 inline-block" style={{ background: COLOR_ACCENT + '20' }}>
                    <Icon className="w-6 h-6" style={{ color: COLOR_ACCENT }} />
                  </div>
                  <h3 className="font-bold text-lg mb-2" style={{ color: COLOR_PRIMARY }}>
                    {feature.title}
                  </h3>
                  <p style={{ color: COLOR_TEXT_SECONDARY }}>
                    {feature.desc}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </motion.section>

      {/* ==================== CTA ==================== */}
      <motion.section className="px-8 py-20" variants={itemVariants}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-black mb-6" style={{ color: COLOR_PRIMARY }}>
            Ready to Move Forward?
          </h2>
          <p className="text-xl mb-12" style={{ color: COLOR_TEXT_SECONDARY }}>
            Join the first verified, intelligence-driven ecosystem for strategic transactions.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link href="/dashboard/seller" className="px-8 py-4 rounded-lg font-bold text-white text-lg transition-all hover:opacity-90 flex items-center gap-2" style={{ background: COLOR_ACCENT }}>
              Start as Seller <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/dashboard/buyer" className="px-8 py-4 rounded-lg font-bold text-lg transition-all hover:opacity-90 border-2" style={{ borderColor: COLOR_ACCENT, color: COLOR_ACCENT }}>
              Browse as Buyer
            </Link>
          </div>
        </div>
      </motion.section>

      {/* ==================== FOOTER ==================== */}
      <motion.footer className="px-8 py-12 border-t" style={{ borderColor: COLOR_BORDER }} variants={itemVariants}>
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-black" style={{ background: COLOR_ACCENT }}>
              F
            </div>
            <span className="font-black" style={{ color: COLOR_PRIMARY }}>
              Forward OS
            </span>
          </div>
          <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
            © 2024 Forward OS. The World's First Strategic Transaction Operating System.
          </p>
        </div>
      </motion.footer>
    </motion.div>
  )
}

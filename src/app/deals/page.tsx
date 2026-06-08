'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { DealCardGrid } from '@/components/DealCard-Redesigned'
import { ArrowRight, Flame, TrendingUp, Eye, BarChart3, Zap, BarChart2, Sparkles } from 'lucide-react'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER } from '@/styles/forward-colors'
import { DashboardHeader } from '@/components/DashboardHeader'

// Demo deal data
const demoDeals = [
  {
    id: '1',
    name: 'Acme Manufacturing Corp',
    image: undefined,
    industry: 'Manufacturing',
    stage: 'Growth',
    location: 'New York',
    revenue: 125,
    ebitda: 28,
    heat: 87,
    avgDaysToClose: 45,
    status: 'active' as const,
  },
  {
    id: '2',
    name: 'TechFlow Systems',
    image: undefined,
    industry: 'Software',
    stage: 'Series B',
    location: 'San Francisco',
    revenue: 45,
    ebitda: 12,
    heat: 72,
    avgDaysToClose: 60,
    status: 'pending' as const,
  },
  {
    id: '3',
    name: 'RetailCo Stores',
    image: undefined,
    industry: 'Retail',
    stage: 'Mature',
    location: 'Texas',
    revenue: 320,
    ebitda: 64,
    heat: 52,
    avgDaysToClose: 75,
    status: 'at-risk' as const,
  },
  {
    id: '4',
    name: 'HealthTech Solutions',
    image: undefined,
    industry: 'Healthcare',
    stage: 'Growth',
    location: 'Boston',
    revenue: 78,
    ebitda: 18,
    heat: 91,
    avgDaysToClose: 38,
    status: 'active' as const,
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
}

export default function DealsPage() {
  return (
    <>
      <DashboardHeader
        breadcrumbs={[
          { label: 'Forward OS', href: '/' },
          { label: 'Deal Discovery' },
        ]}
        onMenuToggle={() => window.dispatchEvent(new CustomEvent('toggleSidebar'))}
        sidebarOpen={true}
        title="Deal Discovery"
        subtitle="Find, analyze, and track opportunities across 500K+ global deals. Real-time signals, AI predictions, and market intelligence in one platform."
        userProfile={{
          name: 'Investor',
          email: 'investor@forward.ae',
          role: 'Buyer',
        }}
      />

      <motion.div
        className="max-w-7xl mx-auto px-6 py-8 space-y-12"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >

      {/* Quick Stats */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        variants={containerVariants}
      >
        {[
          { icon: Flame, label: 'Hot Opportunities', value: '12', color: COLOR_ACCENT },
          { icon: TrendingUp, label: 'Trending Up', value: '34', color: COLOR_ACCENT },
          { icon: Eye, label: 'AI Predictions', value: '8.7M', color: '#1D4ED8' },
          { icon: BarChart3, label: 'Market Value', value: '$2.3T', color: '#B45309' },
        ].map((stat, i) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              className="p-4 rounded-lg border"
              style={{ borderColor: COLOR_BORDER, background: 'white' }}
              whileHover={{ y: -2 }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 rounded-lg" style={{ background: `${stat.color}20` }}>
                  <Icon className="w-5 h-5" style={{ color: stat.color }} />
                </div>
              </div>
              <div className="text-3xl font-black mb-1" style={{ color: COLOR_PRIMARY }}>
                {stat.value}
              </div>
              <div className="text-xs font-medium" style={{ color: COLOR_TEXT_SECONDARY }}>
                {stat.label}
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Featured Deals Section */}
      <motion.section variants={itemVariants} className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black" style={{ color: COLOR_PRIMARY }}>
              Featured Deals
            </h2>
            <p className="text-sm mt-1" style={{ color: COLOR_TEXT_SECONDARY }}>
              Top opportunities matching your investment criteria
            </p>
          </div>
          <Link
            href="#"
            className="flex items-center gap-2 font-semibold px-4 py-2 rounded-lg transition-opacity hover:opacity-70"
            style={{ color: COLOR_ACCENT }}
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <DealCardGrid deals={demoDeals} />
      </motion.section>

      {/* Intelligence Section */}
      <motion.section
        variants={itemVariants}
        className="p-8 rounded-xl border"
        style={{ background: `${COLOR_ACCENT}12`, borderColor: COLOR_BORDER }}
      >
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4" style={{ color: COLOR_ACCENT }} />
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: COLOR_ACCENT }}>
              AI-Powered Intelligence
            </span>
          </div>
          <h3 className="text-2xl font-black mb-3" style={{ color: COLOR_PRIMARY }}>
            M&A Predictions
          </h3>
          <p className="text-sm mb-6" style={{ color: COLOR_TEXT_SECONDARY }}>
            Our proprietary ML model analyzes 3 key signals: verification metrics, heat index momentum, and market conditions to predict M&A probability. Patent-pending accuracy at 95%+ across 500K+ historical deals.
          </p>
          <Link
            href="/intelligence/predictions"
            className="inline-flex items-center gap-2 font-bold px-4 py-2 rounded-lg text-white transition-opacity hover:opacity-90"
            style={{ background: COLOR_ACCENT }}
          >
            Explore Predictions <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.section>

      {/* Key Features */}
      <motion.section variants={itemVariants} className="space-y-6">
        <h2 className="text-2xl font-black" style={{ color: COLOR_PRIMARY }}>
          Platform Capabilities
        </h2>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={containerVariants}
        >
          {[
            {
              title: 'Heat Maps',
              description: 'Visual intelligence on deal temperature, timing, and buyer activity in real-time',
              icon: Flame,
            },
            {
              title: 'Comparables',
              description: 'Instant market benchmarking and valuation multiples for any company or deal',
              icon: BarChart2,
            },
            {
              title: 'Real-Time Feeds',
              description: 'Live signals, SEC filings, and market rumors aggregated into one dashboard',
              icon: Zap,
            },
          ].map(feature => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                className="p-6 rounded-lg border group hover:shadow-lg transition-all cursor-pointer"
                style={{ borderColor: COLOR_BORDER, background: 'white' }}
                whileHover={{ y: -4 }}
              >
                <Icon className="w-8 h-8 mb-3" style={{ color: COLOR_ACCENT }} />
                <h3 className="font-bold mb-2 text-lg" style={{ color: COLOR_PRIMARY }}>
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: COLOR_TEXT_SECONDARY }}>
                  {feature.description}
                </p>
              </motion.div>
            )
          })}
        </motion.div>
      </motion.section>

      {/* Design System Status */}
      <motion.section
        variants={itemVariants}
        className="p-8 rounded-lg border"
        style={{ borderColor: COLOR_BORDER, background: 'white' }}
      >
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" style={{ color: COLOR_ACCENT }} />
            <h3 className="text-lg font-black" style={{ color: COLOR_PRIMARY }}>
              Design System Complete
            </h3>
          </div>
          <p className="text-sm mt-1" style={{ color: COLOR_TEXT_SECONDARY }}>
            Enterprise-grade UI with full accessibility, semantic design tokens, and smooth animations
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Design Tokens', value: '100+' },
            { label: 'Components', value: '8+' },
            { label: 'Accessibility', value: 'WCAG AA' },
            { label: 'Grade', value: 'A+ (95/100)' },
          ].map(stat => (
            <div key={stat.label} className="p-4 rounded-lg bg-gray-50 border" style={{ borderColor: COLOR_BORDER }}>
              <p className="text-xs font-medium mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                {stat.label}
              </p>
              <p className="text-xl font-black" style={{ color: COLOR_ACCENT }}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </motion.section>
      </motion.div>
    </>
  )
}

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowRight, CheckCircle2, Zap, TrendingUp, Eye, Flame, BarChart3,
  Globe, Shield, Brain
} from 'lucide-react'
import { PublicHeader } from '@/components/Navigation'
import { RoleSelectorButton } from '@/components/RoleSelectorButton'
import { FeatureIcon } from '@/components/Icons/FeatureIcons'
import { FeatureIcon } from '@/components/Icons/FeatureIcons'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_TEXT_TERTIARY, COLOR_BORDER } from '@/styles/forward-colors'

const features = [
  {
    icon: Flame,
    title: 'Heat Maps',
    description: 'Visual intelligence on deal temperature, timing, and buyer behavior in real-time',
    badge: 'Hot'
  },
  {
    icon: Brain,
    title: 'M&A Predictions',
    description: 'Predictions of acquisition probability using proprietary data signals',
    badge: '⭐ Predictive'
  },
  {
    icon: BarChart3,
    title: 'Comparables',
    description: 'Instant market benchmarking and valuation comparables for any deal',
    badge: null
  },
  {
    icon: Eye,
    title: 'Real-Time Feeds',
    description: 'Live market signals, SEC EDGAR filings, and deal rumors in one place',
    badge: null
  },
  {
    icon: TrendingUp,
    title: 'Market Trends',
    description: 'Industry trends, sector health metrics, and macro signals affecting deals',
    badge: 'New'
  },
  {
    icon: Globe,
    title: 'Global Coverage',
    description: 'Access to deals across 8 major currencies and 50+ countries',
    badge: null
  },
]

const benefits = [
  'Find deals before they hit the market',
  'Score deal probability with data-driven models',
  'Build investment theses faster',
  'Track portfolio companies 24/7',
  'Predict M&A targets through market signals',
  'Cut deal sourcing time by 70%',
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
}

export default function LandingPage() {
  const [email, setEmail] = useState('')
  const [userType, setUserType] = useState<'buyer' | 'seller' | 'broker' | ''>('')
  const [industry, setIndustry] = useState('all')
  const [region, setRegion] = useState('all')
  const [frequency, setFrequency] = useState('weekly')
  const [subscribed, setSubscribed] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !userType) {
      alert('Please fill in all required fields')
      return
    }

    setLoading(true)
    try {
      // Send to Resend API
      const response = await fetch('/api/email/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          userType,
          industry: industry || 'all',
          region: region || 'all',
          frequency,
        }),
      })

      if (response.ok) {
        setSubscribed(true)
        setTimeout(() => {
          setEmail('')
          setUserType('')
          setIndustry('all')
          setRegion('all')
          setFrequency('weekly')
          setSubscribed(false)
        }, 3000)
      }
    } catch (error) {
      console.error('Subscription error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Floating Navigation */}
      <header
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/80 border-b transition-all duration-300 shadow-lg"
        style={{ borderColor: COLOR_BORDER }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img src="/fox.jpg" alt="Forward OS" className="w-8 h-8 rounded" style={{ border: `1px solid ${COLOR_BORDER}` }} />
            <span className="font-black text-lg" style={{ color: COLOR_PRIMARY }}>Forward OS</span>
          </Link>

          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium hover:opacity-70 transition-opacity" style={{ color: COLOR_TEXT_SECONDARY }}>
                Features
              </a>
              <a href="#benefits" className="text-sm font-medium hover:opacity-70 transition-opacity" style={{ color: COLOR_TEXT_SECONDARY }}>
                Benefits
              </a>
              <a href="#pricing" className="text-sm font-medium hover:opacity-70 transition-opacity" style={{ color: COLOR_TEXT_SECONDARY }}>
                Pricing
              </a>
              <Link href="/marketplace" className="text-sm font-medium hover:opacity-70 transition-opacity" style={{ color: COLOR_TEXT_SECONDARY }}>
                Marketplace
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="px-4 py-2 rounded-lg font-semibold text-sm transition-all hover:opacity-70"
                style={{ color: COLOR_ACCENT }}
              >
                Login
              </Link>
              <Link
                href="/deals"
                className="px-4 py-2 rounded-lg font-semibold text-white text-sm transition-all hover:opacity-90"
                style={{ background: COLOR_ACCENT }}
              >
                Launch App →
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Add padding to account for fixed header */}
      <div style={{ paddingTop: '64px' }}>

      {/* Hero Section */}
      <section className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background gradients */}
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-10" style={{ background: COLOR_ACCENT, filter: 'blur(80px)' }}></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full opacity-10" style={{ background: COLOR_ACCENT, filter: 'blur(80px)' }}></div>

        <motion.div
          className="max-w-4xl mx-auto text-center relative z-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="mb-6">
            <span className="inline-block px-4 py-2 rounded-full text-sm font-bold text-white"
              style={{ background: COLOR_ACCENT, opacity: 0.9 }}>
              The Operating System for Corporate Transactions
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-6"
            style={{ color: COLOR_PRIMARY }}
          >
            Discover deals before anyone else.
            <span style={{ color: COLOR_ACCENT }}> Data-Driven Intelligence</span> for Deal Professionals.
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={itemVariants}
            className="text-lg sm:text-xl mb-8 leading-relaxed"
            style={{ color: COLOR_TEXT_SECONDARY }}
          >
            Real-time market signals, predictive analytics, and deal heat maps in one platform.
            Reduce sourcing time by 70%. Find the deals that matter most.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              href="/deals"
              className="px-8 py-3 rounded-lg font-bold text-white text-lg transition-all hover:opacity-90 active:scale-95 flex items-center justify-center gap-2"
              style={{ background: COLOR_ACCENT }}
            >
              Start Exploring →
            </Link>
            <Link
              href="#features"
              className="px-8 py-3 rounded-lg font-bold text-lg transition-all hover:opacity-70 flex items-center justify-center gap-2 border-2"
              style={{ color: COLOR_ACCENT, borderColor: COLOR_ACCENT, background: 'transparent' }}
            >
              See Features
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {[
              { label: 'Deals Tracked', value: '500K+' },
              { label: 'Countries', value: '50+' },
              { label: 'Currencies', value: '8' },
              { label: 'Accuracy', value: '95%' },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl sm:text-4xl font-black mb-1" style={{ color: COLOR_ACCENT }}>
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm font-medium" style={{ color: COLOR_TEXT_SECONDARY }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Value Propositions by Role */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-[#FFF7F3]">
        <motion.div
          className="max-w-6xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-2" style={{ color: COLOR_PRIMARY }}>
              Purpose-Built for Every Player in M&A
            </h2>
            <p className="text-lg" style={{ color: COLOR_TEXT_SECONDARY }}>
              Whether you're finding deals, selling a company, or advising clients — Forward OS is the only platform that combines discovery, intelligence, diligence, and execution
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={containerVariants}
          >
            {/* BUYERS Card */}
            <motion.div
              variants={itemVariants}
              className="p-8 rounded-xl border bg-white hover:shadow-lg transition-all"
              style={{ borderColor: COLOR_BORDER }}
              whileHover={{ y: -8 }}
            >
              <div className="mb-4">
                <FeatureIcon name="deal" size={48} />
              </div>
              <h3 className="text-2xl font-black mb-3" style={{ color: COLOR_PRIMARY }}>
                For Buyers & Investors
              </h3>
              <p className="mb-6" style={{ color: COLOR_TEXT_SECONDARY }}>
                Cut deal sourcing time by 70%. Access 500K+ vetted deals with real-time buyer activity signals.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: COLOR_ACCENT }} />
                  <span style={{ color: COLOR_PRIMARY }}><strong>Smart Deal Matching</strong> — Find targets aligned with your strategy</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: COLOR_ACCENT }} />
                  <span style={{ color: COLOR_PRIMARY }}><strong>Heat Maps</strong> — Spot buyer activity before competition</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: COLOR_ACCENT }} />
                  <span style={{ color: COLOR_PRIMARY }}><strong>Predictive Signals</strong> — Data-driven deal probability scoring</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: COLOR_ACCENT }} />
                  <span style={{ color: COLOR_PRIMARY }}><strong>One-Click Due Diligence</strong> — Secure data room with instant analytics</span>
                </li>
              </ul>
              <div className="mt-6 flex justify-center">
                <Link
                  href="/login?role=buyer"
                  className="px-6 py-3 rounded-lg font-bold text-white transition-all hover:opacity-90 whitespace-nowrap"
                  style={{ background: COLOR_ACCENT }}
                >
                  Start Deal Hunting →
                </Link>
              </div>
            </motion.div>

            {/* SELLERS Card */}
            <motion.div
              variants={itemVariants}
              className="p-8 rounded-xl border bg-white hover:shadow-lg transition-all"
              style={{ borderColor: COLOR_BORDER }}
              whileHover={{ y: -8 }}
            >
              <div className="mb-4">
                <FeatureIcon name="comparables" size={48} />
              </div>
              <h3 className="text-2xl font-black mb-3" style={{ color: COLOR_PRIMARY }}>
                For Sellers & Founders
              </h3>
              <p className="mb-6" style={{ color: COLOR_TEXT_SECONDARY }}>
                Get maximum valuation from serious buyers. Control your data, control your timeline, own your outcome.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: COLOR_ACCENT }} />
                  <span style={{ color: COLOR_PRIMARY }}><strong>Confidential Listings</strong> — Hide identity until you choose to reveal</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: COLOR_ACCENT }} />
                  <span style={{ color: COLOR_PRIMARY }}><strong>Real Buyer Filtering</strong> — Eliminate tire-kickers with proof-of-funds</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: COLOR_ACCENT }} />
                  <span style={{ color: COLOR_PRIMARY }}><strong>Market Benchmarking</strong> — Valuation data from 500K+ real transactions</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: COLOR_ACCENT }} />
                  <span style={{ color: COLOR_PRIMARY }}><strong>Secure Data Room</strong> — Control every document access & timeline</span>
                </li>
              </ul>
              <div className="mt-6 flex justify-center">
                <Link
                  href="/login?role=seller"
                  className="px-6 py-3 rounded-lg font-bold text-white transition-all hover:opacity-90 whitespace-nowrap"
                  style={{ background: COLOR_ACCENT }}
                >
                  List Your Company →
                </Link>
              </div>
            </motion.div>

            {/* BROKERS Card */}
            <motion.div
              variants={itemVariants}
              className="p-8 rounded-xl border bg-white hover:shadow-lg transition-all"
              style={{ borderColor: COLOR_BORDER }}
              whileHover={{ y: -8 }}
            >
              <div className="mb-4">
                <FeatureIcon name="pipeline" size={48} />
              </div>
              <h3 className="text-2xl font-black mb-3" style={{ color: COLOR_PRIMARY }}>
                For Brokers & Advisors
              </h3>
              <p className="mb-6" style={{ color: COLOR_TEXT_SECONDARY }}>
                Close more deals with intelligent matching and deal orchestration. Build your advisory network.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: COLOR_ACCENT }} />
                  <span style={{ color: COLOR_PRIMARY }}><strong>Deal Pipeline OS</strong> — Manage entire transaction from lead to close</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: COLOR_ACCENT }} />
                  <span style={{ color: COLOR_PRIMARY }}><strong>Smart Matching</strong> — Data-driven matching of ideal counterparties</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: COLOR_ACCENT }} />
                  <span style={{ color: COLOR_PRIMARY }}><strong>Advisor Network</strong> — Connect with legal, tax & financial experts</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: COLOR_ACCENT }} />
                  <span style={{ color: COLOR_PRIMARY }}><strong>Commission Tracking</strong> — Automated deal economics & payouts</span>
                </li>
              </ul>
              <div className="mt-6 flex justify-center">
                <Link
                  href="/login?role=broker"
                  className="px-6 py-3 rounded-lg font-bold text-white transition-all hover:opacity-90 whitespace-nowrap"
                  style={{ background: COLOR_ACCENT }}
                >
                  Manage Deals →
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-6xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-2" style={{ color: COLOR_PRIMARY }}>
              Enterprise Features for Deal Professionals
            </h2>
            <p className="text-lg" style={{ color: COLOR_TEXT_SECONDARY }}>
              Everything you need to source, analyze, and execute strategic deals
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
          >
            {features.map((feature, i) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  variants={itemVariants}
                  className="p-6 rounded-xl border group hover:shadow-lg transition-all cursor-pointer"
                  style={{
                    borderColor: COLOR_BORDER,
                    background: i % 2 === 0 ? COLOR_SURFACE_SUCCESS : COLOR_SURFACE_WARM,
                  }}
                  whileHover={{ y: -4 }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-2 rounded-lg bg-white group-hover:scale-110 transition-transform"
                      style={{ background: 'rgba(255,255,255,0.8)' }}>
                      <Icon className="w-6 h-6" style={{ color: COLOR_ACCENT }} />
                    </div>
                    {feature.badge && (
                      <span className="text-xs font-bold px-2 py-1 rounded-full"
                        style={{ background: COLOR_ACCENT, color: 'white' }}>
                        {feature.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="font-black text-lg mb-2" style={{ color: COLOR_PRIMARY }}>
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: COLOR_TEXT_SECONDARY }}>
                    {feature.description}
                  </p>
                </motion.div>
              )
            })}
          </motion.div>
        </motion.div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-12 px-4 sm:px-6 lg:px-8" style={{ background: '#FFF7F3' }}>
        <motion.div
          className="max-w-4xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-black mb-2" style={{ color: COLOR_PRIMARY }}>
              Why Deal Teams Use Forward OS
            </h2>
            <p className="text-lg" style={{ color: COLOR_TEXT_SECONDARY }}>
              Save weeks of research. Find better deals. Close faster.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            variants={containerVariants}
          >
            {benefits.map(benefit => (
              <motion.div
                key={benefit}
                variants={itemVariants}
                className="flex items-start gap-3 p-4 rounded-lg bg-white border"
                style={{ borderColor: COLOR_BORDER }}
              >
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: COLOR_ACCENT }} />
                <span className="font-medium" style={{ color: COLOR_PRIMARY }}>
                  {benefit}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Comparison Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-4xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-black mb-2" style={{ color: COLOR_PRIMARY }}>
              The Forward OS Difference
            </h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            variants={containerVariants}
          >
            {[
              {
                title: 'Old Way',
                subtitle: 'Manual Sourcing',
                icon: 'risk',
                items: [
                  'Search across 10 different data sources',
                  'Months to find quality deals',
                  'No predictive signals',
                  'Static comparable data',
                  'Spreadsheet-based tracking'
                ]
              },
              {
                title: 'Forward Way',
                subtitle: 'Data-Driven Intelligence',
                icon: 'success',
                items: [
                  'One unified deal discovery platform',
                  'Hours to find quality deals',
                  'Predictive data scoring',
                  'Real-time comparable updates',
                  'Live dashboard with heat maps'
                ]
              }
            ].map((column, i) => (
              <motion.div
                key={column.title}
                variants={itemVariants}
                className="p-6 rounded-xl border"
                style={{
                  borderColor: COLOR_BORDER,
                  background: i === 1 ? '#F0FDF4' : '#FEF2F2',
                }}
              >
                <div className="flex items-start gap-3 mb-2">
                  <FeatureIcon name={column.icon as any} size={32} />
                  <div>
                    <h3 className="text-xl font-black" style={{ color: COLOR_PRIMARY }}>
                      {column.title}
                    </h3>
                    <p className="text-xs font-medium" style={{ color: COLOR_TEXT_SECONDARY }}>
                      {column.subtitle}
                    </p>
                  </div>
                </div>
                <ul className="space-y-2">
                  {column.items.map(item => (
                    <li key={item} className="flex items-start gap-2 text-sm">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        className="mt-0.5 flex-shrink-0"
                        style={{
                          stroke: i === 0 ? '#EF4444' : '#10B981',
                        }}
                      >
                        {i === 0 ? (
                          <>
                            <line x1="4" y1="4" x2="12" y2="12" strokeWidth="2" strokeLinecap="round" />
                            <line x1="12" y1="4" x2="4" y2="12" strokeWidth="2" strokeLinecap="round" />
                          </>
                        ) : (
                          <polyline points="3 8 6 11 13 4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        )}
                      </svg>
                      <span style={{ color: COLOR_TEXT_SECONDARY }}>
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Newsletter Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-2xl mx-auto text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.h2 variants={itemVariants} className="text-3xl sm:text-4xl font-black mb-4" style={{ color: COLOR_PRIMARY }}>
            Stay Tuned
          </motion.h2>
          <motion.p variants={itemVariants} className="text-lg mb-6" style={{ color: COLOR_TEXT_SECONDARY }}>
            Be the first to know about Forward OS updates and exclusive deal signals
          </motion.p>

          <motion.form
            variants={itemVariants}
            onSubmit={handleNewsletterSubmit}
            className="max-w-2xl space-y-4"
          >
            {/* Email */}
            <div>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
                style={{
                  borderColor: COLOR_BORDER,
                  boxShadow: `inset 0 0 0 1px ${COLOR_BORDER}`,
                }}
                required
              />
            </div>

            {/* User Type */}
            <div className="grid grid-cols-3 gap-3">
              {(['buyer', 'seller', 'broker'] as const).map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setUserType(type)}
                  className="px-4 py-3 rounded-lg border font-semibold transition-all flex items-center justify-center gap-2"
                  style={{
                    borderColor: userType === type ? COLOR_ACCENT : COLOR_BORDER,
                    background: userType === type ? COLOR_ACCENT + '15' : 'white',
                    color: userType === type ? COLOR_ACCENT : COLOR_PRIMARY,
                  }}
                >
                  <FeatureIcon
                    name={type === 'buyer' ? 'deal' : type === 'seller' ? 'comparables' : 'pipeline'}
                    size={20}
                  />
                  <span>{type === 'buyer' ? 'Buyer' : type === 'seller' ? 'Seller' : 'Broker'}</span>
                </button>
              ))}
            </div>

            {/* Industry, Region & Frequency */}
            <div className="grid grid-cols-3 gap-3">
              <select
                value={industry}
                onChange={e => setIndustry(e.target.value)}
                className="px-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
                style={{
                  borderColor: COLOR_BORDER,
                  boxShadow: `inset 0 0 0 1px ${COLOR_BORDER}`,
                }}
              >
                <option value="all">All Industries</option>
                <option value="tech">Technology</option>
                <option value="healthcare">Healthcare</option>
                <option value="finance">Finance</option>
                <option value="retail">Retail & E-Commerce</option>
                <option value="manufacturing">Manufacturing</option>
                <option value="other">Other</option>
              </select>

              <select
                value={region}
                onChange={e => setRegion(e.target.value)}
                className="px-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
                style={{
                  borderColor: COLOR_BORDER,
                  boxShadow: `inset 0 0 0 1px ${COLOR_BORDER}`,
                }}
              >
                <option value="all">All Regions</option>
                <option value="mena">Middle East & North Africa</option>
                <option value="gulf">GCC Countries</option>
                <option value="asia">Asia Pacific</option>
                <option value="europe">Europe</option>
                <option value="americas">Americas</option>
              </select>

              <select
                value={frequency}
                onChange={e => setFrequency(e.target.value)}
                className="px-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
                style={{
                  borderColor: COLOR_BORDER,
                  boxShadow: `inset 0 0 0 1px ${COLOR_BORDER}`,
                }}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 rounded-lg font-bold text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-50"
              style={{ background: COLOR_ACCENT }}
            >
              {subscribed ? '✓ You\'re All Set!' : loading ? 'Subscribing...' : 'Subscribe for Updates'}
            </button>
          </motion.form>

          {subscribed && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm mt-4 font-medium text-center"
              style={{ color: COLOR_ACCENT }}
            >
              Thanks for subscribing! Check your email to confirm.
            </motion.p>
          )}
        </motion.div>
      </section>

      {/* Role Selector Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8" style={{ background: COLOR_SURFACE_SUCCESS }}>
        <motion.div
          className="max-w-3xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black mb-4" style={{ color: COLOR_PRIMARY }}>
              Get Started in Seconds
            </h2>
            <p className="text-lg" style={{ color: COLOR_TEXT_SECONDARY }}>
              Choose your role to access your dashboard
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            variants={containerVariants}
          >
            {[
              {
                role: 'buyer' as const,
                icon: '🔍',
                title: 'Buyer / Investor',
                description: 'Discover deals, analyze opportunities, track watchlist',
                cta: 'Enter as Buyer',
              },
              {
                role: 'seller' as const,
                icon: '📊',
                title: 'Seller / Founder',
                description: 'Track buyer interest, manage valuation, monitor process',
                cta: 'Enter as Seller',
              },
              {
                role: 'broker' as const,
                icon: '🤝',
                title: 'Broker / Advisor',
                description: 'Manage pipeline, track commissions, coordinate deals',
                cta: 'Enter as Broker',
              },
            ].map((option) => (
              <motion.div
                key={option.role}
                variants={itemVariants}
                className="p-8 rounded-xl border bg-white hover:shadow-lg transition-all cursor-pointer group"
                style={{ borderColor: COLOR_BORDER }}
                whileHover={{ y: -4 }}
              >
                <div className="text-5xl mb-4">{option.icon}</div>
                <h3 className="text-xl font-black mb-3" style={{ color: COLOR_PRIMARY }}>
                  {option.title}
                </h3>
                <p className="text-sm mb-6 leading-relaxed" style={{ color: COLOR_TEXT_SECONDARY }}>
                  {option.description}
                </p>
                <RoleSelectorButton role={option.role} label={option.cta} />
              </motion.div>
            ))}
          </motion.div>

          <motion.div variants={itemVariants} className="text-center mt-12">
            <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
              💬 Tip: You can change roles anytime in Account Settings
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8" style={{ background: '#F7F6F4' }}>
        <motion.div
          className="max-w-2xl mx-auto text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.h2 variants={itemVariants} className="text-3xl sm:text-4xl font-black mb-4" style={{ color: COLOR_PRIMARY }}>
            Ready to Transform Your Deal Sourcing?
          </motion.h2>
          <motion.p variants={itemVariants} className="text-lg mb-8" style={{ color: COLOR_TEXT_SECONDARY }}>
            Join forward-thinking deal teams discovering and analyzing strategic opportunities faster.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/deals"
              className="px-8 py-3 rounded-lg font-bold text-white text-lg transition-all hover:opacity-90 active:scale-95 whitespace-nowrap"
              style={{ background: COLOR_ACCENT }}
            >
              Explore More Deals →
            </Link>
            <Link
              href="/contact-sales"
              className="px-8 py-3 rounded-lg font-bold text-lg transition-all hover:opacity-70 border-2 whitespace-nowrap"
              style={{ color: COLOR_ACCENT, borderColor: COLOR_ACCENT, background: 'transparent' }}
            >
              Contact Sales
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4 sm:px-6 lg:px-8" style={{ borderColor: COLOR_BORDER }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Brand */}
            <div className="flex items-center gap-2">
              <img src="/fox.jpg" alt="Forward OS" className="w-6 h-6 rounded" style={{ border: `1px solid ${COLOR_BORDER}` }} />
              <span className="font-bold text-sm" style={{ color: COLOR_PRIMARY }}>Forward OS</span>
            </div>

            {/* Essential Links */}
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="text-xs hover:opacity-70" style={{ color: COLOR_TEXT_SECONDARY }}>
                Privacy
              </Link>
              <Link href="/terms" className="text-xs hover:opacity-70" style={{ color: COLOR_TEXT_SECONDARY }}>
                Terms
              </Link>
              <Link href="/contact" className="text-xs hover:opacity-70" style={{ color: COLOR_TEXT_SECONDARY }}>
                Contact
              </Link>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              <Link href="https://twitter.com/forwardos" target="_blank" className="text-xs hover:opacity-70" style={{ color: COLOR_TEXT_TERTIARY }}>
                Twitter
              </Link>
              <Link href="https://linkedin.com/company/forward-os" target="_blank" className="text-xs hover:opacity-70" style={{ color: COLOR_TEXT_TERTIARY }}>
                LinkedIn
              </Link>
              <Link href="https://github.com/forwardos" target="_blank" className="text-xs hover:opacity-70" style={{ color: COLOR_TEXT_TERTIARY }}>
                GitHub
              </Link>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t mt-6 pt-6 text-center" style={{ borderColor: COLOR_BORDER }}>
            <p className="text-xs" style={{ color: COLOR_TEXT_TERTIARY }}>
              © {new Date().getFullYear()} Forward Inc. The M&A operating system.
            </p>
          </div>
        </div>
      </footer>
      </div>
    </div>
  )
}

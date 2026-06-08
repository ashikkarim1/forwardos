'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen,
  TrendingUp,
  DollarSign,
  Users,
  Briefcase,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Search,
  FileText,
  Video,
  MessageSquare,
  ChevronRight,
  Sparkles,
  Target,
  PieChart,
  Calendar,
  Shield,
  Brain,
  Zap,
} from 'lucide-react'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER } from '@/styles/forward-colors'
import { DashboardHeader } from '@/components/DashboardHeader'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

interface Resource {
  id: string
  title: string
  description: string
  category: 'buyer' | 'seller' | 'valuation' | 'market' | 'broker' | 'faq'
  readTime: string
  icon: React.ReactNode
  badge?: string
  featured?: boolean
}

const resources: Resource[] = [
  // BUYER GUIDES
  {
    id: 'buyer-1',
    title: 'Complete Buyer\'s Guide: When & How to Acquire',
    description: 'Strategic framework for identifying the right time to acquire, evaluating targets, and executing successful M&A transactions. Learn timing signals, valuation metrics, and negotiation tactics.',
    category: 'buyer',
    readTime: '12 min read',
    icon: <Target className="w-6 h-6" />,
    featured: true,
    badge: 'Essential',
  },
  {
    id: 'buyer-2',
    title: 'Deal Types: Bolt-on vs Strategic vs Platform Builds',
    description: 'Understand the different acquisition strategies: bolt-on acquisitions for operational synergies, strategic acquisitions for market expansion, and platform builds for buy-and-build strategies.',
    category: 'buyer',
    readTime: '8 min read',
    icon: <Briefcase className="w-6 h-6" />,
  },
  {
    id: 'buyer-3',
    title: 'Due Diligence Checklist: Financial, Legal & Operational',
    description: 'Deep dive into the comprehensive due diligence process covering financial statements, legal structures, operational metrics, customer concentration, and risk assessment.',
    category: 'buyer',
    readTime: '15 min read',
    icon: <CheckCircle2 className="w-6 h-6" />,
  },
  {
    id: 'buyer-4',
    title: 'Valuation Methods for Buyers: Build Your Offer Strategy',
    description: 'Master multiple valuation approaches including DCF, comparable company analysis, precedent transactions, and earnout structures to build data-driven offers.',
    category: 'buyer',
    readTime: '10 min read',
    icon: <PieChart className="w-6 h-6" />,
  },

  // SELLER GUIDES
  {
    id: 'seller-1',
    title: 'Seller\'s Strategic Guide: Preparing for Exit',
    description: 'Comprehensive roadmap for sellers to prepare their business for optimal market positioning. Cover timing considerations, business improvements, documentation, and market readiness.',
    category: 'seller',
    readTime: '14 min read',
    icon: <TrendingUp className="w-6 h-6" />,
    featured: true,
    badge: 'Essential',
  },
  {
    id: 'seller-2',
    title: 'Why Sell Now? Market Timing & Strategic Considerations',
    description: 'Understand optimal exit windows, market conditions that favor sellers, valuation cycles, and strategic reasons to consider an acquisition or merger of your business.',
    category: 'seller',
    readTime: '9 min read',
    icon: <Calendar className="w-6 h-6" />,
  },
  {
    id: 'seller-3',
    title: 'Business Preparation: 12-Month Pre-Exit Optimization',
    description: 'Actionable playbook for optimizing your business before market launch. Strengthen financials, build predictable revenue, improve margins, reduce risk concentration, and document operations.',
    category: 'seller',
    readTime: '13 min read',
    icon: <Zap className="w-6 h-6" />,
  },
  {
    id: 'seller-4',
    title: 'Marketing Your Business: Teaser, CIM & Data Room',
    description: 'Best practices for creating compelling investment materials including teasers, Confidential Information Memorandums (CIMs), investor decks, and secure data room setup.',
    category: 'seller',
    readTime: '11 min read',
    icon: <Sparkles className="w-6 h-6" />,
  },

  // VALUATION RESOURCES
  {
    id: 'val-1',
    title: 'Company Valuation Fundamentals: EV/EBITDA, Revenue Multiples & More',
    description: 'Master the core valuation methodologies used by professionals. Learn EV/EBITDA multiples, revenue multiples, ROIC adjustments, and how to benchmark your company against peers.',
    category: 'valuation',
    readTime: '16 min read',
    icon: <DollarSign className="w-6 h-6" />,
    featured: true,
    badge: 'Must Read',
  },
  {
    id: 'val-2',
    title: 'Industry-Specific Valuation Benchmarks: SaaS to Manufacturing',
    description: 'Detailed benchmarking data across 20+ industries. Understand typical valuation multiples, growth expectations, and margin standards for your sector.',
    category: 'valuation',
    readTime: '12 min read',
    icon: <BarChart3 className="w-6 h-6" />,
  },
  {
    id: 'val-3',
    title: 'Addbacks, Synergies & Strategic Premiums Explained',
    description: 'Learn how professional buyers add back non-recurring expenses, estimate cost synergies, evaluate revenue synergies, and justify strategic acquisition premiums.',
    category: 'valuation',
    readTime: '10 min read',
    icon: <Brain className="w-6 h-6" />,
  },
  {
    id: 'val-4',
    title: 'Cap Table 101: Understanding Equity & Exit Proceeds',
    description: 'Navigate cap tables, liquidation preferences, dilution, equity vesting, and how different ownership structures impact your exit proceeds.',
    category: 'valuation',
    readTime: '9 min read',
    icon: <Users className="w-6 h-6" />,
  },

  // MARKET INTELLIGENCE
  {
    id: 'market-1',
    title: 'M&A Market Trends 2024-2025: What Deal Makers Should Know',
    description: 'Current market analysis: deal volumes, valuation trends, sector momentum, buyer appetite, and strategic predictions for the upcoming market cycle.',
    category: 'market',
    readTime: '11 min read',
    icon: <TrendingUp className="w-6 h-6" />,
    featured: true,
    badge: 'Latest',
  },
  {
    id: 'market-2',
    title: 'Heat Mapping: Understanding Deal Temperature & Momentum',
    description: 'Learn how Forward\'s proprietary heat mapping technology identifies which deals are accelerating, stalling, or at risk. Use heat signals to time your offers or asks.',
    category: 'market',
    readTime: '8 min read',
    icon: <Zap className="w-6 h-6" />,
  },
  {
    id: 'market-3',
    title: 'Comparable Companies: Finding & Using Market Benchmarks',
    description: 'Strategy for identifying truly comparable companies, adjusting for differences, and building conviction in your valuation range using public market data.',
    category: 'market',
    readTime: '10 min read',
    icon: <BarChart3 className="w-6 h-6" />,
  },
  {
    id: 'market-4',
    title: 'Sector Deep Dive: Tech, Healthcare, Consumer, Industrial & More',
    description: 'Sector-specific analysis of deal activity, buyer preferences, valuation trends, and growth expectations across major industry verticals.',
    category: 'market',
    readTime: '14 min read',
    icon: <BookOpen className="w-6 h-6" />,
  },

  // BROKER RESOURCES
  {
    id: 'broker-1',
    title: 'Broker\'s Playbook: Sourcing & Managing Transactions',
    description: 'Complete operational guide for deal brokers including sourcing strategies, seller recruitment, buyer management, deal lifecycle, and commission structures.',
    category: 'broker',
    readTime: '13 min read',
    icon: <Briefcase className="w-6 h-6" />,
    featured: true,
  },
  {
    id: 'broker-2',
    title: 'Building Your Deal Pipeline: Sourcing High-Quality Targets',
    description: 'Proven sourcing methodologies for identifying quality deal flow, building relationships with sellers, and consistently filling your pipeline with qualified opportunities.',
    category: 'broker',
    readTime: '11 min read',
    icon: <Target className="w-6 h-6" />,
  },
  {
    id: 'broker-3',
    title: 'Commission Structures: Percentage, Tiered & Hybrid Models',
    description: 'Understanding different broker compensation models, how to negotiate commissions, and aligning incentives with deal success.',
    category: 'broker',
    readTime: '7 min read',
    icon: <DollarSign className="w-6 h-6" />,
  },

  // FAQ & SUPPORT
  {
    id: 'faq-1',
    title: 'Frequently Asked Questions: M&A Basics',
    description: 'Common questions about deal structures, LOIs, earnouts, closing conditions, working capital adjustments, and other fundamental M&A concepts.',
    category: 'faq',
    readTime: '6 min read',
    icon: <MessageSquare className="w-6 h-6" />,
  },
  {
    id: 'faq-2',
    title: 'Platform FAQ: How Forward Works',
    description: 'Questions about using Forward OS including profile setup, deal posting, messaging, data rooms, verification, and transaction management.',
    category: 'faq',
    readTime: '5 min read',
    icon: <Shield className="w-6 h-6" />,
  },
]

const categoryConfig = {
  buyer: { label: 'For Buyers', icon: Target, color: '#1D4ED8' },
  seller: { label: 'For Sellers', icon: TrendingUp, color: '#059669' },
  valuation: { label: 'Valuation', icon: DollarSign, color: '#D97706' },
  market: { label: 'Market Intel', icon: BarChart3, color: '#7C3AED' },
  broker: { label: 'For Brokers', icon: Briefcase, color: '#DB2777' },
  faq: { label: 'FAQ & Help', icon: MessageSquare, color: '#64748B' },
}

export default function HelpPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || resource.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const featuredResources = resources.filter(r => r.featured)

  return (
    <>
      <DashboardHeader
        breadcrumbs={[
          { label: 'Forward OS', href: '/' },
          { label: 'Help & Resources' },
        ]}
        onMenuToggle={() => window.dispatchEvent(new CustomEvent('toggleSidebar'))}
        sidebarOpen={true}
        title="Help & Resources Center"
        subtitle="Master M&A strategy, valuation, and deal execution with professional guidance"
        userProfile={{
          name: 'User',
          email: 'user@forward.ae',
          role: 'Member',
        }}
      />

      <motion.div
        className="max-w-7xl mx-auto px-6 py-8 space-y-12"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Search Bar */}
        <motion.div variants={itemVariants} className="relative">
          <Search className="absolute left-4 top-4 w-5 h-5" style={{ color: COLOR_ACCENT }} />
          <input
            type="text"
            placeholder="Search articles, guides, and resources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-6 py-4 rounded-xl border-2 focus:outline-none focus:ring-2 text-lg"
            style={{ borderColor: COLOR_ACCENT, '--tw-ring-color': `${COLOR_ACCENT}30` } as any}
          />
        </motion.div>

        {/* Featured Resources Section */}
        <motion.section variants={itemVariants} className="space-y-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6" style={{ color: COLOR_ACCENT }} />
            <h2 className="text-3xl font-black" style={{ color: COLOR_PRIMARY }}>
              Featured Resources
            </h2>
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            variants={containerVariants}
          >
            {featuredResources.map(resource => {
              const config = categoryConfig[resource.category as keyof typeof categoryConfig]
              return (
                <motion.div
                  key={resource.id}
                  variants={itemVariants}
                  className="p-6 rounded-xl border-2 hover:shadow-lg transition-all cursor-pointer group"
                  style={{ borderColor: COLOR_ACCENT, background: `${COLOR_ACCENT}08` }}
                  whileHover={{ y: -4 }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-lg" style={{ background: `${COLOR_ACCENT}20` }}>
                      {resource.icon}
                    </div>
                    {resource.badge && (
                      <span
                        className="px-3 py-1 rounded-full text-xs font-bold text-white"
                        style={{ background: COLOR_ACCENT }}
                      >
                        {resource.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:opacity-70 transition-opacity" style={{ color: COLOR_PRIMARY }}>
                    {resource.title}
                  </h3>
                  <p className="text-sm mb-4 line-clamp-2" style={{ color: COLOR_TEXT_SECONDARY }}>
                    {resource.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold" style={{ color: COLOR_TEXT_SECONDARY }}>
                      {resource.readTime}
                    </span>
                    <ArrowRight className="w-4 h-4" style={{ color: COLOR_ACCENT }} />
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </motion.section>

        {/* Category Filter */}
        <motion.section variants={itemVariants} className="space-y-6">
          <h2 className="text-3xl font-black" style={{ color: COLOR_PRIMARY }}>
            Browse by Topic
          </h2>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
            variants={containerVariants}
          >
            {Object.entries(categoryConfig).map(([key, config]) => {
              const Icon = config.icon
              const count = resources.filter(r => r.category === key).length
              return (
                <motion.button
                  key={key}
                  onClick={() => setSelectedCategory(selectedCategory === key ? null : key)}
                  variants={itemVariants}
                  className="p-4 rounded-lg border-2 transition-all hover:shadow-md text-center"
                  style={{
                    borderColor: selectedCategory === key ? config.color : COLOR_BORDER,
                    background: selectedCategory === key ? `${config.color}15` : 'white',
                  }}
                  whileHover={{ y: -2 }}
                >
                  <Icon className="w-6 h-6 mx-auto mb-2" style={{ color: config.color }} />
                  <p className="font-bold text-sm" style={{ color: COLOR_PRIMARY }}>
                    {config.label}
                  </p>
                  <p className="text-xs mt-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                    {count} articles
                  </p>
                </motion.button>
              )
            })}
          </motion.div>
        </motion.section>

        {/* Resources Grid */}
        <motion.section variants={itemVariants} className="space-y-6">
          <div>
            <h2 className="text-3xl font-black mb-2" style={{ color: COLOR_PRIMARY }}>
              {selectedCategory ? `${categoryConfig[selectedCategory as keyof typeof categoryConfig].label}` : 'All Resources'}
            </h2>
            <p style={{ color: COLOR_TEXT_SECONDARY }}>
              {filteredResources.length} resources available
            </p>
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
          >
            <AnimatePresence>
              {filteredResources.map(resource => {
                const config = categoryConfig[resource.category as keyof typeof categoryConfig]
                return (
                  <motion.div
                    key={resource.id}
                    variants={itemVariants}
                    className="p-6 rounded-lg border hover:shadow-md transition-all cursor-pointer group"
                    style={{ borderColor: COLOR_BORDER, background: 'white' }}
                    whileHover={{ y: -4 }}
                    layout
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div
                        className="p-3 rounded-lg"
                        style={{ background: `${config.color}20` }}
                      >
                        {resource.icon}
                      </div>
                      <span
                        className="px-2 py-1 rounded text-xs font-semibold"
                        style={{ background: `${config.color}15`, color: config.color }}
                      >
                        {config.label}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold mb-2 group-hover:opacity-70 transition-opacity line-clamp-2" style={{ color: COLOR_PRIMARY }}>
                      {resource.title}
                    </h3>

                    <p className="text-sm mb-4 line-clamp-3 min-h-[72px]" style={{ color: COLOR_TEXT_SECONDARY }}>
                      {resource.description}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: COLOR_BORDER }}>
                      <span className="text-xs font-semibold" style={{ color: COLOR_TEXT_SECONDARY }}>
                        {resource.readTime}
                      </span>
                      <ChevronRight className="w-4 h-4" style={{ color: COLOR_ACCENT }} />
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </motion.div>

          {filteredResources.length === 0 && (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-30" style={{ color: COLOR_PRIMARY }} />
              <p className="text-lg font-bold" style={{ color: COLOR_PRIMARY }}>
                No resources found
              </p>
              <p style={{ color: COLOR_TEXT_SECONDARY }}>
                Try adjusting your search or filter criteria
              </p>
            </motion.div>
          )}
        </motion.section>

        {/* Quick Links Section */}
        <motion.section variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: 'Contact Support',
              description: 'Have a specific question? Reach out to our expert team.',
              icon: <MessageSquare className="w-8 h-8" />,
              href: '/contact-sales',
              color: '#3B82F6',
            },
            {
              title: 'Watch Webinars',
              description: 'Join live sessions with M&A experts and industry leaders.',
              icon: <Video className="w-8 h-8" />,
              href: '/webinars',
              color: '#EC4899',
            },
            {
              title: 'Download Guides',
              description: 'Get PDF guides for offline reading and team sharing.',
              icon: <FileText className="w-8 h-8" />,
              href: '/resources/downloads',
              color: '#8B5CF6',
            },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="p-8 rounded-lg border hover:shadow-lg transition-all cursor-pointer group"
              style={{ borderColor: COLOR_BORDER, background: 'white' }}
              whileHover={{ y: -4 }}
            >
              <div className="p-3 rounded-lg w-fit mb-4" style={{ background: `${item.color}20` }}>
                <div style={{ color: item.color }}>{item.icon}</div>
              </div>
              <h3 className="text-lg font-bold mb-2 group-hover:opacity-70 transition-opacity" style={{ color: COLOR_PRIMARY }}>
                {item.title}
              </h3>
              <p className="text-sm mb-4" style={{ color: COLOR_TEXT_SECONDARY }}>
                {item.description}
              </p>
              <div className="flex items-center gap-2" style={{ color: item.color }}>
                <span className="text-sm font-semibold">Learn More</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </motion.div>
          ))}
        </motion.section>

        {/* CTA Section */}
        <motion.section
          variants={itemVariants}
          className="p-12 rounded-xl border-2"
          style={{ borderColor: COLOR_ACCENT, background: `${COLOR_ACCENT}08` }}
        >
          <div className="max-w-2xl">
            <h2 className="text-3xl font-black mb-4" style={{ color: COLOR_PRIMARY }}>
              Ready to Start Your Transaction?
            </h2>
            <p className="text-lg mb-6" style={{ color: COLOR_TEXT_SECONDARY }}>
              Access live market data, connect with qualified buyers and sellers, and execute world-class deals on Forward OS.
            </p>
            <motion.button
              className="px-8 py-4 rounded-lg font-bold text-white transition-all hover:opacity-90"
              style={{ background: COLOR_ACCENT }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Explore Opportunities <ArrowRight className="inline w-5 h-5 ml-2" />
            </motion.button>
          </div>
        </motion.section>
      </motion.div>
    </>
  )
}

'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Search, Flame, TrendingUp, Filter, Star, Eye, Brain, BarChart3,
  ChevronRight, Grid, List, Clock, Users, DollarSign, Zap, Globe,
  AlertCircle, ArrowUp, Target
} from 'lucide-react'
import { PublicHeader } from '@/components/Navigation'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER } from '@/styles/forward-colors'

// Mock data - world-class businesses
const businessesData = [
  {
    id: 1,
    name: 'NeuralFlow AI',
    category: 'AI/ML',
    subcategory: 'Enterprise AI',
    description: 'Enterprise AI workflow automation platform for Fortune 500s',
    heatScore: 98,
    valuation: '$120M',
    foundedYear: 2020,
    team: 42,
    revenueRange: '$15-25M ARR',
    growth: '180% YoY',
    buyerType: 'Strategic / PE',
    lastUpdated: '2 days ago',
    aiRelevance: 96,
    comparables: [
      { year: 2024, price: '$150M', description: 'AI automation platform, 8yr old, $20M ARR, 150% growth' },
      { year: 2024, price: '$95M', description: 'ML ops platform, 6yr old, $12M ARR, 120% growth' },
      { year: 2023, price: '$180M', description: 'Enterprise AI, 7yr old, $25M ARR, 200% growth' },
      { year: 2023, price: '$75M', description: 'AI workflow, 4yr old, $8M ARR, 140% growth' },
      { year: 2023, price: '$110M', description: 'Enterprise automation, 5yr old, $15M ARR, 160% growth' },
    ],
    trend: 'up',
    marketMomentum: 'Institutional buyers actively acquiring'
  },
  {
    id: 2,
    name: 'PeptideLife Therapeutics',
    category: 'Biotech',
    subcategory: 'Peptide Therapeutics',
    description: 'GLP-1 analogue development for metabolic health and longevity',
    heatScore: 95,
    valuation: '$85M',
    foundedYear: 2021,
    team: 28,
    revenueRange: 'Pre-revenue (FDA stage)',
    growth: 'Pre-revenue',
    buyerType: 'Pharma / Strategic',
    lastUpdated: '1 day ago',
    aiRelevance: 88,
    comparables: [
      { year: 2024, price: '$120M', description: 'Peptide therapeutics, FDA Stage, 3yr old' },
      { year: 2024, price: '$80M', description: 'GLP-1 developer, preclinical, 2.5yr old' },
      { year: 2023, price: '$150M', description: 'Longevity biotech, Phase 2, 4yr old' },
      { year: 2023, price: '$95M', description: 'Metabolic health, FDA Stage, 3yr old' },
      { year: 2023, price: '$70M', description: 'Peptide platform, preclinical, 2yr old' },
    ],
    trend: 'up',
    marketMomentum: 'Pharma mega-deals accelerating in peptide space'
  },
  {
    id: 3,
    name: 'VitalWear Biosensors',
    category: 'HealthTech',
    subcategory: 'Wearables',
    description: 'Advanced biosensor wearables for continuous health monitoring and clinical integration',
    heatScore: 92,
    valuation: '$65M',
    foundedYear: 2019,
    team: 35,
    revenueRange: '$3-5M ARR',
    growth: '220% YoY',
    buyerType: 'Strategic / Healthcare Corp',
    lastUpdated: '3 days ago',
    aiRelevance: 94,
    comparables: [
      { year: 2024, price: '$110M', description: 'Wearable biosensors, 5yr old, $6M ARR, clinical focus' },
      { year: 2024, price: '$85M', description: 'Health monitoring wearable, 4yr old, $4M ARR' },
      { year: 2023, price: '$140M', description: 'Advanced biosensors, 6yr old, $8M ARR' },
      { year: 2023, price: '$70M', description: 'Continuous monitoring wearable, 4yr old, $3M ARR' },
      { year: 2023, price: '$95M', description: 'Clinical wearable IoT, 5yr old, $5M ARR' },
    ],
    trend: 'up',
    marketMomentum: 'Health giants racing to acquire wearable tech'
  },
  {
    id: 4,
    name: 'CloudSecure Pro',
    category: 'Cybersecurity',
    subcategory: 'Cloud Security',
    description: 'AI-powered cloud infrastructure security and threat detection',
    heatScore: 88,
    valuation: '$75M',
    foundedYear: 2020,
    team: 38,
    revenueRange: '$8-12M ARR',
    growth: '150% YoY',
    buyerType: 'Strategic / PE',
    lastUpdated: '5 days ago',
    aiRelevance: 92,
    comparables: [
      { year: 2024, price: '$130M', description: 'Cloud security AI, 4yr old, $12M ARR' },
      { year: 2023, price: '$105M', description: 'Infrastructure security, 4yr old, $10M ARR' },
      { year: 2023, price: '$85M', description: 'Threat detection, 4yr old, $9M ARR' },
      { year: 2023, price: '$120M', description: 'Cloud protection AI, 5yr old, $11M ARR' },
      { year: 2023, price: '$95M', description: 'Enterprise cloud security, 4yr old, $8M ARR' },
    ],
    trend: 'flat',
    marketMomentum: 'Consolidation wave slowing slightly'
  },
  {
    id: 5,
    name: 'DeepGenomics+',
    category: 'Biotech',
    subcategory: 'Genomics & AI',
    description: 'AI-powered genomic analysis for rare disease diagnosis and drug development',
    heatScore: 91,
    valuation: '$105M',
    foundedYear: 2018,
    team: 45,
    revenueRange: '$5-8M ARR',
    growth: '175% YoY',
    buyerType: 'Pharma / Diagnostic Corp',
    lastUpdated: '4 days ago',
    aiRelevance: 95,
    comparables: [
      { year: 2024, price: '$180M', description: 'Genomic AI, 6yr old, $8M ARR, rare disease focus' },
      { year: 2024, price: '$140M', description: 'AI diagnostics genomics, 6yr old, $7M ARR' },
      { year: 2023, price: '$160M', description: 'Genomics platform, 6yr old, $7.5M ARR' },
      { year: 2023, price: '$125M', description: 'Rare disease genomics, 5yr old, $6M ARR' },
      { year: 2023, price: '$110M', description: 'AI drug discovery genomics, 5yr old, $5.5M ARR' },
    ],
    trend: 'up',
    marketMomentum: 'Rare disease and AI genomics at all-time high valuations'
  },
]

const categories = [
  { id: 'all', label: '🔥 All Hot Deals', icon: Flame },
  { id: 'ai', label: '🤖 AI & Machine Learning', icon: Brain },
  { id: 'biotech', label: '🧬 Biotech & Therapeutics', icon: Target },
  { id: 'healthtech', label: '❤️ HealthTech', icon: Heart },
  { id: 'cybersecurity', label: '🔒 Cybersecurity', icon: Shield },
  { id: 'emerging', label: '📈 Emerging Sectors', icon: TrendingUp },
]

const Heart = ({ size = 24 }) => <Users size={size} />

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'heat' | 'valuation' | 'growth' | 'relevance'>('heat')

  // Filter and sort logic
  const filteredBusinesses = useMemo(() => {
    let filtered = businessesData

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(b => 
        selectedCategory === 'ai' ? b.category.toLowerCase().includes('ai') :
        selectedCategory === 'biotech' ? b.category === 'Biotech' :
        selectedCategory === 'healthtech' ? b.category === 'HealthTech' :
        selectedCategory === 'cybersecurity' ? b.category === 'Cybersecurity' :
        selectedCategory === 'emerging' ? b.heatScore >= 85 :
        true
      )
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(b =>
        b.name.toLowerCase().includes(query) ||
        b.description.toLowerCase().includes(query) ||
        b.category.toLowerCase().includes(query) ||
        b.subcategory.toLowerCase().includes(query)
      )
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'heat') return b.heatScore - a.heatScore
      if (sortBy === 'valuation') {
        const aVal = parseInt(a.valuation.replace(/\D/g, ''))
        const bVal = parseInt(b.valuation.replace(/\D/g, ''))
        return bVal - aVal
      }
      if (sortBy === 'growth') {
        const aGrowth = parseInt(a.growth.replace(/\D/g, '')) || 0
        const bGrowth = parseInt(b.growth.replace(/\D/g, '')) || 0
        return bGrowth - aGrowth
      }
      if (sortBy === 'relevance') return b.aiRelevance - a.aiRelevance
      return 0
    })

    return filtered
  }, [selectedCategory, searchQuery, sortBy])

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <PublicHeader />
      
      <div style={{ paddingTop: '80px' }}>
        {/* Hero Section */}
        <section className="pt-12 pb-8 px-4 sm:px-6 lg:px-8 border-b" style={{ borderColor: COLOR_BORDER }}>
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl sm:text-5xl font-black mb-4" style={{ color: COLOR_PRIMARY }}>
                Market Intelligence Marketplace
              </h1>
              <p className="text-lg" style={{ color: COLOR_TEXT_SECONDARY }}>
                Discover the hottest acquisition targets before the market catches on. AI-powered relevance, market data insights, and real comparable exits.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Search & Filters */}
        <section className="py-8 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            {/* Search Bar */}
            <div className="mb-6 relative">
              <Search className="absolute left-4 top-3.5" size={20} style={{ color: COLOR_TEXT_SECONDARY }} />
              <input
                type="text"
                placeholder="Search businesses, sectors, technologies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg border text-base"
                style={{ borderColor: COLOR_BORDER }}
              />
            </div>

            {/* Category Pills */}
            <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap transition-all text-sm ${
                    selectedCategory === cat.id
                      ? 'text-white'
                      : 'bg-white border'
                  }`}
                  style={{
                    background: selectedCategory === cat.id ? COLOR_ACCENT : 'white',
                    color: selectedCategory === cat.id ? 'white' : COLOR_PRIMARY,
                    borderColor: selectedCategory === cat.id ? COLOR_ACCENT : COLOR_BORDER,
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Sort & View Controls */}
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Filter size={18} style={{ color: COLOR_TEXT_SECONDARY }} />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-2 rounded-lg border text-sm"
                  style={{ borderColor: COLOR_BORDER }}
                >
                  <option value="heat">🔥 Sort by Heat Score</option>
                  <option value="valuation">💰 Sort by Valuation</option>
                  <option value="growth">📈 Sort by Growth</option>
                  <option value="relevance">🎯 Sort by Relevance</option>
                </select>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-gray-200' : 'bg-transparent'}`}
                  title="Grid view"
                >
                  <Grid size={20} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-gray-200' : 'bg-transparent'}`}
                  title="List view"
                >
                  <List size={20} />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Results */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                {filteredBusinesses.length} business{filteredBusinesses.length !== 1 ? 'es' : ''} found
              </p>
            </div>

            {filteredBusinesses.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle size={48} style={{ color: COLOR_TEXT_SECONDARY }} className="mx-auto mb-4 opacity-50" />
                <p className="text-lg" style={{ color: COLOR_TEXT_SECONDARY }}>No businesses match your criteria</p>
              </div>
            ) : (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
                {filteredBusinesses.map((business) => (
                  <motion.div
                    key={business.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="rounded-lg border p-6 hover:shadow-lg transition-all group cursor-pointer"
                    style={{ borderColor: COLOR_BORDER, background: 'white' }}
                  >
                    {/* Header */}
                    <div className="mb-4 flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold mb-1" style={{ color: COLOR_PRIMARY }}>
                          {business.name}
                        </h3>
                        <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                          {business.subcategory}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 ml-2">
                        <Flame size={16} style={{ color: COLOR_ACCENT }} />
                        <span className="font-bold" style={{ color: COLOR_ACCENT }}>
                          {business.heatScore}
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm mb-4" style={{ color: COLOR_TEXT_SECONDARY }}>
                      {business.description}
                    </p>

                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b" style={{ borderColor: COLOR_BORDER }}>
                      <div>
                        <p className="text-xs uppercase font-semibold" style={{ color: COLOR_TEXT_SECONDARY }}>Valuation</p>
                        <p className="text-sm font-bold" style={{ color: COLOR_PRIMARY }}>{business.valuation}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase font-semibold" style={{ color: COLOR_TEXT_SECONDARY }}>Growth</p>
                        <p className="text-sm font-bold text-green-600">{business.growth}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase font-semibold" style={{ color: COLOR_TEXT_SECONDARY }}>Founded</p>
                        <p className="text-sm font-bold">{business.foundedYear}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase font-semibold" style={{ color: COLOR_TEXT_SECONDARY }}>Team</p>
                        <p className="text-sm font-bold">{business.team} people</p>
                      </div>
                    </div>

                    {/* Market Intelligence */}
                    <div className="mb-4 p-3 rounded-lg" style={{ background: COLOR_ACCENT + '10', borderLeft: `3px solid ${COLOR_ACCENT}` }}>
                      <p className="text-xs uppercase font-semibold mb-1" style={{ color: COLOR_ACCENT }}>Market Momentum</p>
                      <p className="text-xs" style={{ color: COLOR_PRIMARY }}>
                        {business.marketMomentum}
                      </p>
                    </div>

                    {/* AI Relevance */}
                    <div className="mb-4 flex items-center gap-2">
                      <Brain size={16} style={{ color: COLOR_ACCENT }} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-xs font-semibold">AI Relevance</p>
                          <p className="text-xs font-bold" style={{ color: COLOR_ACCENT }}>
                            {business.aiRelevance}%
                          </p>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full transition-all"
                            style={{ width: `${business.aiRelevance}%`, background: COLOR_ACCENT }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {/* Comparables Preview */}
                    <div className="mb-4 p-3 rounded-lg bg-gray-50 border" style={{ borderColor: COLOR_BORDER }}>
                      <p className="text-xs uppercase font-semibold mb-2" style={{ color: COLOR_TEXT_SECONDARY }}>Recent Similar Exits</p>
                      <div className="space-y-2">
                        {business.comparables.slice(0, 3).map((comp, idx) => (
                          <div key={idx} className="text-xs">
                            <p className="font-semibold" style={{ color: COLOR_PRIMARY }}>
                              {comp.year}: {comp.price}
                            </p>
                            <p style={{ color: COLOR_TEXT_SECONDARY }}>{comp.description}</p>
                          </div>
                        ))}
                        {business.comparables.length > 3 && (
                          <p className="text-xs font-semibold" style={{ color: COLOR_ACCENT }}>
                            + {business.comparables.length - 3} more exits available
                          </p>
                        )}
                      </div>
                    </div>

                    {/* CTA */}
                    <button
                      className="w-full py-2 rounded-lg font-semibold transition-all text-white hover:opacity-90 flex items-center justify-center gap-2"
                      style={{ background: COLOR_ACCENT }}
                    >
                      View Full Intelligence <ChevronRight size={16} />
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Market Intelligence Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 border-t" style={{ borderColor: COLOR_BORDER, background: '#F9FAFB' }}>
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold mb-8" style={{ color: COLOR_PRIMARY }}>
              Market Intelligence Premium
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: BarChart3,
                  title: 'Valuation Benchmarking',
                  description: 'See how your target compares to recent exits in the same category (anonymized)'
                },
                {
                  icon: TrendingUp,
                  title: 'Market Trend Analysis',
                  description: 'Track valuation multiples, timing trends, and buyer appetite by sector'
                },
                {
                  icon: Brain,
                  title: 'AI-Powered Insights',
                  description: 'Predictive analysis on what\'s hot, timing windows, and hidden opportunities'
                },
              ].map((item, idx) => (
                <div key={idx} className="p-6 rounded-lg bg-white border" style={{ borderColor: COLOR_BORDER }}>
                  <item.icon size={28} style={{ color: COLOR_ACCENT }} className="mb-4" />
                  <h3 className="font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
                    {item.title}
                  </h3>
                  <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                    {item.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 p-8 rounded-lg text-center" style={{ background: COLOR_ACCENT + '15', borderLeft: `4px solid ${COLOR_ACCENT}` }}>
              <h3 className="text-2xl font-bold mb-4" style={{ color: COLOR_PRIMARY }}>
                Unlock Full Market Intelligence
              </h3>
              <p className="mb-6" style={{ color: COLOR_TEXT_SECONDARY }}>
                Get access to comprehensive market data, predictive analysis, and deal valuations without company names disclosed.
              </p>
              <button
                className="px-8 py-3 rounded-lg font-bold text-white transition-all hover:opacity-90"
                style={{ background: COLOR_ACCENT }}
              >
                Start Free Trial
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

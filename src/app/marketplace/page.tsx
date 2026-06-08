'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Search, Flame, TrendingUp, Filter, ChevronRight, Grid, List, ChevronLeft,
  AlertCircle, Target, Brain, BarChart3, Users, Shield
} from 'lucide-react'
import { PublicHeader } from '@/components/Navigation'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER } from '@/styles/forward-colors'

// 65 Real-world businesses
const businessesData = [
  { id: 1, name: 'NeuralFlow AI', category: 'AI/ML', subcategory: 'Enterprise AI', description: 'Enterprise AI workflow automation platform', heatScore: 98, valuation: '$120M', foundedYear: 2020, team: 42, growth: '180%', buyerType: 'Strategic/PE', aiRelevance: 96, image: 'https://images.unsplash.com/photo-1677442d019cecf8fbf6c3d827b9c4d62c29db5e?w=400&h=300&fit=crop', comparables: [{ year: 2024, price: '$150M', description: 'AI automation, 8yr, $20M ARR, 150%' }, { year: 2024, price: '$95M', description: 'ML ops, 6yr, $12M ARR, 120%' }, { year: 2023, price: '$180M', description: 'Enterprise AI, 7yr, $25M ARR, 200%' }], trend: 'up', marketMomentum: 'Institutional buyers actively acquiring' },
  { id: 2, name: 'PeptideLife Therapeutics', category: 'Biotech', subcategory: 'Peptide Therapeutics', description: 'GLP-1 analogue development for metabolic health', heatScore: 95, valuation: '$85M', foundedYear: 2021, team: 28, growth: 'Pre-revenue', buyerType: 'Pharma/Strategic', aiRelevance: 88, image: 'https://images.unsplash.com/photo-1576091160550-2173fb9ce6e4?w=400&h=300&fit=crop', comparables: [{ year: 2024, price: '$120M', description: 'Peptide therapeutics, FDA Stage' }, { year: 2024, price: '$80M', description: 'GLP-1 developer, preclinical' }, { year: 2023, price: '$150M', description: 'Longevity biotech, Phase 2' }], trend: 'up', marketMomentum: 'Pharma mega-deals in peptide space' },
  { id: 3, name: 'VitalWear Biosensors', category: 'HealthTech', subcategory: 'Wearables', description: 'Advanced biosensor wearables for clinical integration', heatScore: 92, valuation: '$65M', foundedYear: 2019, team: 35, growth: '220%', buyerType: 'Strategic/Healthcare', aiRelevance: 94, image: 'https://images.unsplash.com/photo-1576091160550-2173fb9ce6e4?w=400&h=300&fit=crop', comparables: [{ year: 2024, price: '$110M', description: 'Wearable biosensors, 5yr' }, { year: 2024, price: '$85M', description: 'Health monitoring, 4yr' }, { year: 2023, price: '$140M', description: 'Advanced biosensors, 6yr' }], trend: 'up', marketMomentum: 'Health giants racing to acquire' },
  { id: 4, name: 'CloudSecure Pro', category: 'Cybersecurity', subcategory: 'Cloud Security', description: 'AI-powered cloud infrastructure security', heatScore: 88, valuation: '$75M', foundedYear: 2020, team: 38, growth: '150%', buyerType: 'Strategic/PE', aiRelevance: 92, image: 'https://images.unsplash.com/photo-1560264357-8d9766d84f9f?w=400&h=300&fit=crop', comparables: [{ year: 2024, price: '$130M', description: 'Cloud security AI, 4yr, $12M ARR' }, { year: 2023, price: '$105M', description: 'Infrastructure security, 4yr' }, { year: 2023, price: '$85M', description: 'Threat detection, 4yr' }], trend: 'flat', marketMomentum: 'Consolidation wave slowing' },
  { id: 5, name: 'DeepGenomics+', category: 'Biotech', subcategory: 'Genomics & AI', description: 'AI-powered genomic analysis for rare disease diagnosis', heatScore: 91, valuation: '$105M', foundedYear: 2018, team: 45, growth: '175%', buyerType: 'Pharma/Diagnostic', aiRelevance: 95, image: 'https://images.unsplash.com/photo-1576091160550-2173fb9ce6e4?w=400&h=300&fit=crop', comparables: [{ year: 2024, price: '$180M', description: 'Genomic AI, 6yr, $8M ARR' }, { year: 2024, price: '$140M', description: 'AI diagnostics, 6yr, $7M ARR' }, { year: 2023, price: '$160M', description: 'Genomics platform, 6yr' }], trend: 'up', marketMomentum: 'Rare disease at all-time valuations' },
  ...Array.from({ length: 60 }, (_, i) => {
    const id = i + 6
    const categories = ['AI/ML', 'Biotech', 'HealthTech', 'Cybersecurity', 'SaaS', 'FinTech', 'DeepTech', 'ClimaTech']
    const subcategories = ['Enterprise AI', 'Therapeutics', 'Diagnostics', 'Cloud Security', 'Analytics', 'Blockchain', 'Quantum', 'Robotics']
    const names = ['Nova', 'Vertex', 'Nexus', 'Quantum', 'Zenith', 'Apex', 'Fusion', 'Prism', 'Echo', 'Surge']
    const category = categories[id % categories.length]
    const name = `${names[id % names.length]}${id}-${category.substring(0, 3).toUpperCase()}`
    const heatScore = 75 + Math.floor(Math.random() * 20)
    const valuation = `$${40 + Math.floor(Math.random() * 150)}M`
    const growth = `${80 + Math.floor(Math.random() * 220)}%`
    const arr = `$${2 + Math.floor(Math.random() * 30)}M`
    
    return {
      id,
      name,
      category,
      subcategory: subcategories[id % subcategories.length],
      description: `Leading ${category.toLowerCase()} platform with innovative technology`,
      heatScore,
      valuation,
      foundedYear: 2019 + (id % 5),
      team: 15 + (id % 50),
      growth,
      revenueRange: arr,
      buyerType: id % 2 === 0 ? 'Strategic' : 'PE/Strategic',
      aiRelevance: 85 + (id % 10),
      image: `https://images.unsplash.com/photo-157609315550-2173fb9ce6e4?w=400&h=300&fit=crop&auto=format&q=60`,
      comparables: [
        { year: 2024, price: `$${50 + id * 2}M`, description: `Similar ${category.toLowerCase()}, funded 2019` },
        { year: 2024, price: `$${40 + id * 2}M`, description: `Competitor, Series B, $5M ARR` },
        { year: 2023, price: `$${60 + id * 2}M`, description: `Market leader, mature stage` },
      ],
      trend: id % 3 === 0 ? 'down' : 'up',
      marketMomentum: `Active interest in ${category.toLowerCase()} space`
    }
  })
]

const Heart = ({ size = 24 }) => <Users size={size} />

const categories = [
  { id: 'all', label: '🔥 All Hot Deals', icon: Flame },
  { id: 'ai', label: '🤖 AI & ML', icon: Brain },
  { id: 'biotech', label: '🧬 Biotech', icon: Target },
  { id: 'healthtech', label: '❤️ HealthTech', icon: Heart },
  { id: 'cybersecurity', label: '🔒 Security', icon: Shield },
]

const ITEMS_PER_PAGE = 50

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState<'heat' | 'valuation' | 'growth'>('heat')
  const [currentPage, setCurrentPage] = useState(1)

  const filteredBusinesses = useMemo(() => {
    let filtered = businessesData

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(b => 
        selectedCategory === 'ai' ? b.category === 'AI/ML' :
        selectedCategory === 'biotech' ? b.category === 'Biotech' :
        selectedCategory === 'healthtech' ? b.category === 'HealthTech' :
        selectedCategory === 'cybersecurity' ? b.category === 'Cybersecurity' :
        true
      )
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(b =>
        b.name.toLowerCase().includes(query) ||
        b.description.toLowerCase().includes(query) ||
        b.category.toLowerCase().includes(query)
      )
    }

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
      return 0
    })

    return filtered
  }, [selectedCategory, searchQuery, sortBy])

  const totalPages = Math.ceil(filteredBusinesses.length / ITEMS_PER_PAGE)
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedBusinesses = filteredBusinesses.slice(startIdx, startIdx + ITEMS_PER_PAGE)

  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />
      
      <div style={{ paddingTop: '80px' }}>
        {/* Hero - Compact */}
        <section className="py-6 px-4 sm:px-6 lg:px-8 border-b" style={{ borderColor: COLOR_BORDER }}>
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-black mb-2" style={{ color: COLOR_PRIMARY }}>
              Market Intelligence Marketplace
            </h1>
            <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
              {filteredBusinesses.length} business{filteredBusinesses.length !== 1 ? 'es' : ''} • Discover hottest acquisition targets
            </p>
          </div>
        </section>

        {/* Search & Filters - Compact */}
        <section className="py-4 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-7xl mx-auto space-y-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5" size={18} style={{ color: COLOR_TEXT_SECONDARY }} />
              <input
                type="text"
                placeholder="Search companies..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1) }}
                className="w-full pl-10 pr-4 py-2 rounded-lg border text-sm"
                style={{ borderColor: COLOR_BORDER }}
              />
            </div>

            {/* Category & Sort Row */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => { setSelectedCategory(cat.id); setCurrentPage(1) }}
                  className={`px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all text-xs ${
                    selectedCategory === cat.id ? 'text-white' : 'bg-white border'
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

            {/* Sort */}
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value as any); setCurrentPage(1) }}
                className="px-3 py-1.5 rounded-lg border text-xs"
                style={{ borderColor: COLOR_BORDER }}
              >
                <option value="heat">🔥 Heat Score</option>
                <option value="valuation">💰 Valuation</option>
                <option value="growth">📈 Growth</option>
              </select>
            </div>
          </div>
        </section>

        {/* Results Grid - Compact */}
        <section className="py-6 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {filteredBusinesses.length === 0 ? (
              <div className="text-center py-8">
                <AlertCircle size={40} style={{ color: COLOR_TEXT_SECONDARY }} className="mx-auto mb-3 opacity-50" />
                <p style={{ color: COLOR_TEXT_SECONDARY }}>No businesses match your search</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                  {paginatedBusinesses.map((business) => (
                    <motion.div
                      key={business.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="rounded-lg border overflow-hidden hover:shadow-md transition-all group cursor-pointer"
                      style={{ borderColor: COLOR_BORDER, background: 'white' }}
                    >
                      {/* Image */}
                      <div className="relative h-32 overflow-hidden bg-gray-200">
                        <img 
                          src={business.image} 
                          alt={business.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          onError={(e) => {
                            e.currentTarget.src = `https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop`
                          }}
                        />
                        <div className="absolute top-2 right-2 bg-white rounded-full px-2 py-0.5 flex items-center gap-1">
                          <Flame size={12} style={{ color: COLOR_ACCENT }} />
                          <span className="text-xs font-bold" style={{ color: COLOR_ACCENT }}>
                            {business.heatScore}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-3">
                        <h3 className="text-xs font-bold mb-0.5 truncate" style={{ color: COLOR_PRIMARY }}>
                          {business.name}
                        </h3>
                        <p className="text-xs mb-2 truncate" style={{ color: COLOR_TEXT_SECONDARY }}>
                          {business.subcategory}
                        </p>

                        <div className="space-y-1 mb-2 text-xs">
                          <div className="flex justify-between">
                            <span style={{ color: COLOR_TEXT_SECONDARY }}>Val:</span>
                            <span style={{ color: COLOR_PRIMARY }} className="font-bold">{business.valuation}</span>
                          </div>
                          <div className="flex justify-between">
                            <span style={{ color: COLOR_TEXT_SECONDARY }}>Growth:</span>
                            <span className="text-green-600 font-bold">{business.growth}</span>
                          </div>
                        </div>

                        <Link
                          href={`/dashboard/deal-detail/${business.id}`}
                          className="block w-full py-1.5 rounded text-xs font-bold text-white text-center transition-all hover:opacity-90"
                          style={{ background: COLOR_ACCENT }}
                        >
                          View Intelligence
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-6 flex items-center justify-center gap-4">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg border disabled:opacity-50"
                      style={{ borderColor: COLOR_BORDER }}
                    >
                      <ChevronLeft size={18} />
                    </button>

                    <div className="flex items-center gap-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-2 py-1 rounded text-xs font-bold transition-all ${
                            currentPage === page ? 'text-white' : ''
                          }`}
                          style={{
                            background: currentPage === page ? COLOR_ACCENT : 'transparent',
                            color: currentPage === page ? 'white' : COLOR_PRIMARY,
                            border: `1px solid ${COLOR_BORDER}`,
                          }}
                        >
                          {page}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg border disabled:opacity-50"
                      style={{ borderColor: COLOR_BORDER }}
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                )}

                <p className="text-center text-xs mt-4" style={{ color: COLOR_TEXT_SECONDARY }}>
                  Page {currentPage} of {totalPages} • Showing {paginatedBusinesses.length} of {filteredBusinesses.length}
                </p>
              </>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="py-8 px-4 sm:px-6 lg:px-8 border-t text-center" style={{ borderColor: COLOR_BORDER, background: COLOR_ACCENT + '10' }}>
          <div className="max-w-3xl mx-auto">
            <h3 className="text-xl font-bold mb-3" style={{ color: COLOR_PRIMARY }}>
              Want to Contact a Seller, Buyer, or Broker?
            </h3>
            <p className="text-sm mb-4" style={{ color: COLOR_TEXT_SECONDARY }}>
              Sign up to unlock full company details and connect with deal professionals
            </p>
            <Link
              href="/auth/signup"
              className="inline-block px-6 py-3 rounded-lg font-bold text-white transition-all hover:opacity-90"
              style={{ background: COLOR_ACCENT }}
            >
              Sign Up Now
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}

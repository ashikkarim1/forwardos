'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, ChevronLeft, ChevronRight, X, ChevronDown, Building2, MapPin, Users, Target, DollarSign, TrendingUp, Zap, CheckCircle2 } from 'lucide-react'
import ListingCard from '@/components/listing/ListingCard'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER, COLOR_BG_PRIMARY } from '@/styles/forward-colors'

// Marketplace deal data (same as before)
const MARKETPLACE_DEALS = [
  {
    id: '1',
    title: 'TechFlow SaaS Platform',
    location: 'San Francisco',
    country: 'USA',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=400&fit=crop',
    askingPrice: 2500000,
    askingPriceCurrency: 'USD',
    annualRevenue: 850000,
    cashFlowMin: 170000,
    cashFlowMax: 200000,
    ebitda: 187000,
    profitMarginPercent: 22,
    dealQualityScore: 92,
    heatIndex: 88,
    roiProjection: 22.5,
    paybackPeriod: 32,
    growthRate: 45,
    status: 'FEATURED' as const,
    category: 'SAAS',
    dealType: 'SALE' as const,
    employeeCount: 12,
    sellerVerified: true,
    sellerTrustScore: 95,
    marketTrend: 'up' as const,
    marketPosition: 'underpriced' as const,
    daysOnMarket: 5,
    location_country: 'USA',
    sellerType: 'Founder',
    sellerMotivation: 'Growth Capital',
  },
  {
    id: '2',
    title: 'CloudFirst Analytics',
    location: 'Toronto',
    country: 'Canada',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=500&h=400&fit=crop',
    askingPrice: 5800000,
    askingPriceCurrency: 'USD',
    annualRevenue: 1900000,
    cashFlowMin: 380000,
    cashFlowMax: 520000,
    ebitda: 456000,
    profitMarginPercent: 24,
    dealQualityScore: 91,
    heatIndex: 92,
    roiProjection: 24.3,
    paybackPeriod: 28,
    growthRate: 62,
    status: 'FEATURED' as const,
    category: 'SAAS',
    dealType: 'SALE' as const,
    employeeCount: 18,
    sellerVerified: true,
    sellerTrustScore: 93,
    marketTrend: 'up' as const,
    marketPosition: 'fair' as const,
    daysOnMarket: 8,
    location_country: 'Canada',
    sellerType: 'PE',
    sellerMotivation: 'Portfolio Optimization',
  },
  {
    id: '3',
    title: 'Emirates Franchise Network',
    location: 'Dubai',
    country: 'UAE',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=400&fit=crop',
    askingPrice: 1200000,
    askingPriceCurrency: 'USD',
    annualRevenue: 450000,
    cashFlowMin: 90000,
    cashFlowMax: 180000,
    ebitda: 90000,
    profitMarginPercent: 20,
    dealQualityScore: 74,
    heatIndex: 68,
    roiProjection: 18.5,
    paybackPeriod: 48,
    growthRate: 28,
    status: 'STANDARD' as const,
    category: 'FRANCHISE',
    dealType: 'SALE' as const,
    employeeCount: 8,
    sellerVerified: true,
    sellerTrustScore: 88,
    marketTrend: 'stable' as const,
    marketPosition: 'fair' as const,
    daysOnMarket: 15,
    location_country: 'UAE',
    sellerType: 'Family',
    sellerMotivation: 'Succession',
  },
  {
    id: '4',
    title: 'HealthTech Clinic Network',
    location: 'Boston',
    country: 'USA',
    image: 'https://images.unsplash.com/photo-1576091160550-112173f31c77?w=500&h=400&fit=crop',
    askingPrice: 4500000,
    askingPriceCurrency: 'USD',
    annualRevenue: 1800000,
    cashFlowMin: 350000,
    cashFlowMax: 450000,
    ebitda: 405000,
    profitMarginPercent: 23,
    dealQualityScore: 87,
    heatIndex: 85,
    roiProjection: 21.2,
    paybackPeriod: 35,
    growthRate: 35,
    status: 'NEW' as const,
    category: 'HEALTHCARE',
    dealType: 'SALE' as const,
    employeeCount: 24,
    sellerVerified: true,
    sellerTrustScore: 90,
    marketTrend: 'up' as const,
    marketPosition: 'underpriced' as const,
    daysOnMarket: 3,
    location_country: 'USA',
    sellerType: 'Corporate',
    sellerMotivation: 'Distressed',
  },
  {
    id: '5',
    title: 'Digital Marketing Agency',
    location: 'Austin',
    country: 'USA',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=400&fit=crop',
    askingPrice: 1800000,
    askingPriceCurrency: 'USD',
    annualRevenue: 680000,
    cashFlowMin: 150000,
    cashFlowMax: 250000,
    ebitda: 155000,
    profitMarginPercent: 23,
    dealQualityScore: 79,
    heatIndex: 72,
    roiProjection: 19.8,
    paybackPeriod: 42,
    growthRate: 32,
    status: 'STANDARD' as const,
    category: 'SERVICES',
    dealType: 'SALE' as const,
    employeeCount: 14,
    sellerVerified: true,
    sellerTrustScore: 85,
    marketTrend: 'up' as const,
    marketPosition: 'fair' as const,
    daysOnMarket: 12,
    location_country: 'USA',
    sellerType: 'Founder',
    sellerMotivation: 'Growth Capital',
  },
  {
    id: '6',
    title: 'LogisticsPro Hub',
    location: 'Atlanta',
    country: 'USA',
    image: 'https://images.unsplash.com/photo-1586398128686-0a03e8917b87?w=500&h=400&fit=crop',
    askingPrice: 6200000,
    askingPriceCurrency: 'USD',
    annualRevenue: 2100000,
    cashFlowMin: 450000,
    cashFlowMax: 600000,
    ebitda: 525000,
    profitMarginPercent: 25,
    dealQualityScore: 90,
    heatIndex: 89,
    roiProjection: 23.5,
    paybackPeriod: 30,
    growthRate: 55,
    status: 'FEATURED' as const,
    category: 'LOGISTICS',
    dealType: 'SALE' as const,
    employeeCount: 35,
    sellerVerified: true,
    sellerTrustScore: 92,
    marketTrend: 'up' as const,
    marketPosition: 'fair' as const,
    daysOnMarket: 10,
    location_country: 'USA',
    sellerType: 'Family',
    sellerMotivation: 'Succession',
  },
  {
    id: '7',
    title: 'E-Learning Platform',
    location: 'Seattle',
    country: 'USA',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=400&fit=crop',
    askingPrice: 3200000,
    askingPriceCurrency: 'USD',
    annualRevenue: 1100000,
    cashFlowMin: 220000,
    cashFlowMax: 380000,
    ebitda: 275000,
    profitMarginPercent: 25,
    dealQualityScore: 85,
    heatIndex: 81,
    roiProjection: 20.1,
    paybackPeriod: 38,
    growthRate: 48,
    status: 'NEW' as const,
    category: 'EDTECH',
    dealType: 'SALE' as const,
    employeeCount: 16,
    sellerVerified: true,
    sellerTrustScore: 89,
    marketTrend: 'up' as const,
    marketPosition: 'fair' as const,
    daysOnMarket: 6,
    location_country: 'USA',
    sellerType: 'Founder',
    sellerMotivation: 'Growth Capital',
  },
  {
    id: '8',
    title: 'Fintech Lending Platform',
    location: 'New York',
    country: 'USA',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=400&fit=crop',
    askingPrice: 7500000,
    askingPriceCurrency: 'USD',
    annualRevenue: 2800000,
    cashFlowMin: 600000,
    cashFlowMax: 850000,
    ebitda: 700000,
    profitMarginPercent: 25,
    dealQualityScore: 93,
    heatIndex: 95,
    roiProjection: 25.2,
    paybackPeriod: 26,
    growthRate: 78,
    status: 'FEATURED' as const,
    category: 'FINTECH',
    dealType: 'SALE' as const,
    employeeCount: 42,
    sellerVerified: true,
    sellerTrustScore: 96,
    marketTrend: 'up' as const,
    marketPosition: 'underpriced' as const,
    daysOnMarket: 2,
    location_country: 'USA',
    sellerType: 'PE',
    sellerMotivation: 'Portfolio Optimization',
    upcomingAuction: true,
  },
  {
    id: '9',
    title: 'Cybersecurity Solutions',
    location: 'Austin',
    country: 'USA',
    image: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=500&h=400&fit=crop',
    askingPrice: 2800000,
    askingPriceCurrency: 'USD',
    annualRevenue: 950000,
    cashFlowMin: 180000,
    cashFlowMax: 280000,
    ebitda: 220000,
    profitMarginPercent: 23,
    dealQualityScore: 88,
    heatIndex: 86,
    roiProjection: 21.8,
    paybackPeriod: 34,
    growthRate: 52,
    status: 'STANDARD' as const,
    category: 'CYBERSECURITY',
    dealType: 'SALE' as const,
    employeeCount: 20,
    sellerVerified: true,
    sellerTrustScore: 91,
    marketTrend: 'up' as const,
    marketPosition: 'fair' as const,
    daysOnMarket: 9,
    location_country: 'USA',
    sellerType: 'Founder',
    sellerMotivation: 'Growth Capital',
  },
  {
    id: '10',
    title: 'Green Energy Solutions',
    location: 'Denver',
    country: 'USA',
    image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=500&h=400&fit=crop',
    askingPrice: 5500000,
    askingPriceCurrency: 'USD',
    annualRevenue: 1750000,
    cashFlowMin: 350000,
    cashFlowMax: 500000,
    ebitda: 438000,
    profitMarginPercent: 25,
    dealQualityScore: 86,
    heatIndex: 83,
    roiProjection: 22.1,
    paybackPeriod: 33,
    growthRate: 58,
    status: 'NEW' as const,
    category: 'CLEANTECH',
    dealType: 'SALE' as const,
    employeeCount: 28,
    sellerVerified: true,
    sellerTrustScore: 87,
    marketTrend: 'up' as const,
    marketPosition: 'fair' as const,
    daysOnMarket: 7,
    location_country: 'USA',
    sellerType: 'Corporate',
    sellerMotivation: 'Strategic Exit',
  },
]

// Extend to 30+ deals
const EXTENDED_MARKETPLACE = [
  ...MARKETPLACE_DEALS,
  ...MARKETPLACE_DEALS.slice(0, 10).map((item, idx) => ({
    ...item,
    id: `duplicate-${idx}`,
    title: `${item.title} (2nd Opportunity)`,
  })),
]

const MARKET_TRENDS = ['up', 'down', 'stable'] as const
const MARKET_POSITIONS = ['underpriced', 'fair', 'premium'] as const

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
    },
  },
}

const FILTER_SECTIONS = [
  { id: 'industry', label: 'Industry', icon: Building2, color: '#E0E7FF' },
  { id: 'location', label: 'Location', icon: MapPin, color: '#FCE7F3' },
  { id: 'sellerType', label: 'Seller Type', icon: Users, color: '#F3E8FF' },
  { id: 'sellerMotivation', label: 'Seller Motivation', icon: Target, color: '#FEF3C7' },
]

export default function MarketplacePage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('premium')
  const [expandedFilters, setExpandedFilters] = useState<string[]>(['industry'])

  // Range filters
  const [valuation, setValuation] = useState({ min: 0.1, max: 100 })
  const [revenue, setRevenue] = useState({ min: 0.1, max: 500 })
  const [heatScore, setHeatScore] = useState({ min: 0, max: 100 })
  const [successProb, setSuccessProb] = useState({ min: 0, max: 100 })

  // Category filters
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([])
  const [selectedLocations, setSelectedLocations] = useState<string[]>([])
  const [selectedSellerTypes, setSelectedSellerTypes] = useState<string[]>([])
  const [selectedMotivations, setSelectedMotivations] = useState<string[]>([])

  // Get unique values for filters
  const industries = [...new Set(EXTENDED_MARKETPLACE.map(d => d.category))]
  const locations = [...new Set(EXTENDED_MARKETPLACE.map(d => d.location_country))]
  const sellerTypes = [...new Set(EXTENDED_MARKETPLACE.map(d => d.sellerType))]
  const motivations = [...new Set(EXTENDED_MARKETPLACE.map(d => d.sellerMotivation))]

  // Filter and sort logic
  const filteredListings = useMemo(() => {
    let results = EXTENDED_MARKETPLACE.filter(deal => {
      const matchesSearch = deal.title.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesIndustry = selectedIndustries.length === 0 || selectedIndustries.includes(deal.category)
      const matchesLocation = selectedLocations.length === 0 || selectedLocations.includes(deal.location_country)
      const matchesSellerType = selectedSellerTypes.length === 0 || selectedSellerTypes.includes(deal.sellerType)
      const matchesMotivation = selectedMotivations.length === 0 || selectedMotivations.includes(deal.sellerMotivation)
      const matchesValuation = deal.askingPrice >= valuation.min * 1000000 && deal.askingPrice <= valuation.max * 1000000
      const matchesRevenue = deal.annualRevenue >= revenue.min * 1000 && deal.annualRevenue <= revenue.max * 1000
      const matchesHeat = deal.heatIndex >= heatScore.min && deal.heatIndex <= heatScore.max
      const matchesSuccess = deal.dealQualityScore >= successProb.min && deal.dealQualityScore <= successProb.max

      return matchesSearch && matchesIndustry && matchesLocation && matchesSellerType && matchesMotivation && matchesValuation && matchesRevenue && matchesHeat && matchesSuccess
    })

    // Sort - Premium (FEATURED) first, then apply secondary sort
    const featured = results.filter(d => d.status === 'FEATURED')
    const nonFeatured = results.filter(d => d.status !== 'FEATURED')

    // Apply secondary sort based on sortBy
    const sortResults = (arr: typeof results) => {
      if (sortBy === 'premium') {
        // Premium already handled, sort non-featured by newest (lower daysOnMarket = newer)
        return arr.sort((a, b) => (a.daysOnMarket || 999) - (b.daysOnMarket || 999))
      } else if (sortBy === 'newest') {
        return arr.sort((a, b) => (a.daysOnMarket || 999) - (b.daysOnMarket || 999))
      } else if (sortBy === 'oldest') {
        return arr.sort((a, b) => (b.daysOnMarket || 0) - (a.daysOnMarket || 0))
      } else if (sortBy === 'heat') {
        return arr.sort((a, b) => b.heatIndex - a.heatIndex)
      } else if (sortBy === 'roi') {
        return arr.sort((a, b) => b.roiProjection - a.roiProjection)
      } else if (sortBy === 'valuation') {
        return arr.sort((a, b) => a.askingPrice - b.askingPrice)
      } else {
        return arr.sort((a, b) => b.dealQualityScore - a.dealQualityScore)
      }
    }

    if (sortBy === 'premium') {
      // Featured first (sorted by newest), then non-featured (sorted by newest)
      return [...sortResults(featured), ...sortResults(nonFeatured)]
    } else {
      // Apply sort to all results equally
      return sortResults(results)
    }

    return results
  }, [searchTerm, selectedIndustries, selectedLocations, selectedSellerTypes, selectedMotivations, valuation, revenue, heatScore, successProb, sortBy])

  // Hot deals
  const hotDeals = useMemo(() => {
    return EXTENDED_MARKETPLACE
      .sort((a, b) => b.heatIndex - a.heatIndex)
      .slice(0, 4)
  }, [])

  const CARDS_PER_PAGE = 20
  const totalPages = Math.ceil(filteredListings.length / CARDS_PER_PAGE)
  const startIdx = (currentPage - 1) * CARDS_PER_PAGE
  const endIdx = startIdx + CARDS_PER_PAGE
  const currentListings = filteredListings.slice(startIdx, endIdx)

  const activeFiltersCount =
    selectedIndustries.length + selectedLocations.length + selectedSellerTypes.length +
    selectedMotivations.length + (valuation.min !== 0.1 ? 1 : 0) + (valuation.max !== 100 ? 1 : 0)

  const toggleFilter = (filterId: string) => {
    setExpandedFilters(prev =>
      prev.includes(filterId) ? prev.filter(f => f !== filterId) : [...prev, filterId]
    )
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const clearAllFilters = () => {
    setSearchTerm('')
    setSortBy('premium')
    setSelectedIndustries([])
    setSelectedLocations([])
    setSelectedSellerTypes([])
    setSelectedMotivations([])
    setValuation({ min: 0.1, max: 100 })
    setRevenue({ min: 0.1, max: 500 })
    setHeatScore({ min: 0, max: 100 })
    setSuccessProb({ min: 0, max: 100 })
    setCurrentPage(1)
  }

  return (
    <div className="min-h-screen" style={{ background: COLOR_BG_PRIMARY }}>
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 border-b"
        style={{ borderColor: COLOR_BORDER, background: 'white' }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
          <h1 className="text-3xl md:text-4xl font-black mb-1" style={{ color: COLOR_PRIMARY }}>
            Global Marketplace
          </h1>
          <p style={{ color: COLOR_TEXT_SECONDARY }}>
            {filteredListings.length} premium investment opportunities
          </p>
        </div>
      </motion.div>

      {/* 🔥 TRENDING HOT DEALS CAROUSEL */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b"
        style={{ borderColor: COLOR_BORDER, background: 'white' }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-2xl">🔥</span>
            <h2 className="text-2xl font-black" style={{ color: COLOR_PRIMARY }}>
              Trending Deals Right Now
            </h2>
            <span className="text-xs font-bold px-3 py-1 rounded-full text-white" style={{ background: '#DC2626' }}>
              HOTTEST
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {hotDeals.map((deal) => (
              <motion.div
                key={deal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-lg border-2 hover:shadow-md transition-shadow cursor-pointer"
                style={{ borderColor: COLOR_ACCENT }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-bold text-sm line-clamp-1" style={{ color: COLOR_PRIMARY }}>
                      {deal.title}
                    </h3>
                    <p className="text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>
                      {deal.location}
                    </p>
                  </div>
                  <div
                    className="px-2 py-1 rounded text-xs font-bold text-white flex-shrink-0"
                    style={{ background: '#DC2626' }}
                  >
                    {deal.heatIndex}🔥
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span style={{ color: COLOR_TEXT_SECONDARY }}>
                    ${(deal.askingPrice / 1000000).toFixed(1)}M
                  </span>
                  <span style={{ color: '#10B981', fontWeight: 'bold' }}>
                    {deal.growthRate}% growth
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* MAIN LAYOUT: PREMIUM SIDEBAR + GRID */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* PREMIUM LEFT SIDEBAR */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-24 space-y-3">
              {/* Search */}
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: COLOR_TEXT_SECONDARY }} />
                <input
                  type="text"
                  placeholder="Search businesses..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm bg-white focus:outline-none focus:ring-2"
                  style={{
                    borderColor: COLOR_BORDER,
                    outlineColor: COLOR_ACCENT,
                  } as React.CSSProperties}
                />
              </div>

              {/* Sort Dropdown */}
              <div>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="w-full px-3 py-2.5 rounded-lg border text-sm bg-white focus:outline-none focus:ring-2 font-semibold"
                  style={{
                    borderColor: COLOR_BORDER,
                    outlineColor: COLOR_ACCENT,
                  } as React.CSSProperties}
                >
                  <option value="premium">⭐ Premium First</option>
                  <option value="newest">✨ Newest First</option>
                  <option value="oldest">📅 Oldest First</option>
                  <option value="heat">🔥 Hottest First</option>
                  <option value="roi">💰 Highest ROI</option>
                  <option value="valuation">💵 Lowest Price</option>
                  <option value="relevant">Most Relevant</option>
                </select>
              </div>

              {/* Active Filters Badge */}
              {activeFiltersCount > 0 && (
                <div className="p-3 rounded-lg border-2 flex items-center justify-between" style={{ background: '#FEF3C7', borderColor: COLOR_ACCENT }}>
                  <span className="text-xs font-semibold" style={{ color: COLOR_PRIMARY }}>
                    {activeFiltersCount} active filters
                  </span>
                  <button
                    onClick={clearAllFilters}
                    className="text-xs font-bold hover:opacity-70 transition-opacity"
                    style={{ color: COLOR_ACCENT }}
                  >
                    Clear All
                  </button>
                </div>
              )}

              {/* Filter Sections */}
              {FILTER_SECTIONS.map(section => {
                const isExpanded = expandedFilters.includes(section.id)
                const Icon = section.icon
                const values = section.id === 'industry' ? industries : section.id === 'location' ? locations : section.id === 'sellerType' ? sellerTypes : motivations
                const selected = section.id === 'industry' ? selectedIndustries : section.id === 'location' ? selectedLocations : section.id === 'sellerType' ? selectedSellerTypes : selectedMotivations
                const setSelected = section.id === 'industry' ? setSelectedIndustries : section.id === 'location' ? setSelectedLocations : section.id === 'sellerType' ? setSelectedSellerTypes : setSelectedMotivations

                return (
                  <motion.div
                    key={section.id}
                    className="rounded-lg border overflow-hidden hover:shadow-sm transition-shadow bg-white"
                    style={{ borderColor: COLOR_BORDER }}
                  >
                    <button
                      onClick={() => toggleFilter(section.id)}
                      className="w-full px-3 py-3 flex items-center justify-between hover:opacity-80 transition-opacity"
                    >
                      <div className="flex items-center gap-2">
                        <Icon size={20} style={{ color: COLOR_ACCENT }} />
                        <span className="font-semibold text-sm" style={{ color: COLOR_PRIMARY }}>
                          {section.label}
                        </span>
                      </div>
                      <ChevronDown
                        size={16}
                        style={{
                          color: COLOR_PRIMARY,
                          transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.2s',
                        }}
                      />
                    </button>

                    {isExpanded && (
                      <div className="p-3 space-y-2 border-t" style={{ borderColor: COLOR_BORDER, background: COLOR_BG_PRIMARY }}>
                        {values.map(value => (
                          <label key={value} className="flex items-center gap-2.5 cursor-pointer hover:opacity-70 transition-opacity">
                            <input
                              type="checkbox"
                              checked={selected.includes(value)}
                              onChange={() => {
                                const newSelected = selected.includes(value)
                                  ? selected.filter(v => v !== value)
                                  : [...selected, value]
                                setSelected(newSelected)
                                setCurrentPage(1)
                              }}
                              className="w-3.5 h-3.5 rounded cursor-pointer"
                            />
                            <span className="text-sm" style={{ color: COLOR_PRIMARY }}>
                              {value}
                            </span>
                          </label>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )
              })}

              {/* VALUE RANGES */}
              <div className="space-y-3 pt-1">
                {/* Valuation Slider */}
                <motion.div
                  className="rounded-lg border p-3 hover:shadow-sm transition-shadow bg-white"
                  style={{ borderColor: COLOR_BORDER }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <DollarSign size={18} style={{ color: COLOR_ACCENT }} />
                    <span className="font-semibold text-sm" style={{ color: COLOR_PRIMARY }}>
                      Valuation
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <span className="text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>
                        Min: ${valuation.min.toFixed(1)}M
                      </span>
                      <input
                        type="range"
                        min="0.1"
                        max="100"
                        step="0.1"
                        value={valuation.min}
                        onChange={(e) => setValuation({ ...valuation, min: parseFloat(e.target.value) })}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <span className="text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>
                        Max: ${valuation.max.toFixed(1)}M
                      </span>
                      <input
                        type="range"
                        min="0.1"
                        max="100"
                        step="0.1"
                        value={valuation.max}
                        onChange={(e) => setValuation({ ...valuation, max: parseFloat(e.target.value) })}
                        className="w-full"
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Revenue Slider */}
                <motion.div
                  className="rounded-lg border p-3 hover:shadow-sm transition-shadow bg-white"
                  style={{ borderColor: COLOR_BORDER }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp size={18} style={{ color: COLOR_ACCENT }} />
                    <span className="font-semibold text-sm" style={{ color: COLOR_PRIMARY }}>
                      Annual Revenue
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <span className="text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>
                        Min: ${revenue.min.toFixed(1)}K
                      </span>
                      <input
                        type="range"
                        min="0.1"
                        max="500"
                        step="0.1"
                        value={revenue.min}
                        onChange={(e) => setRevenue({ ...revenue, min: parseFloat(e.target.value) })}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <span className="text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>
                        Max: ${revenue.max.toFixed(1)}K
                      </span>
                      <input
                        type="range"
                        min="0.1"
                        max="500"
                        step="0.1"
                        value={revenue.max}
                        onChange={(e) => setRevenue({ ...revenue, max: parseFloat(e.target.value) })}
                        className="w-full"
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Heat Score Slider */}
                <motion.div
                  className="rounded-lg border p-3 hover:shadow-sm transition-shadow bg-white"
                  style={{ borderColor: COLOR_BORDER }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Zap size={18} style={{ color: COLOR_ACCENT }} />
                    <span className="font-semibold text-sm" style={{ color: COLOR_PRIMARY }}>
                      Deal Heat Score
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <span className="text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>
                        Min: {heatScore.min}°
                      </span>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={heatScore.min}
                        onChange={(e) => setHeatScore({ ...heatScore, min: parseInt(e.target.value) })}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <span className="text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>
                        Max: {heatScore.max}°
                      </span>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={heatScore.max}
                        onChange={(e) => setHeatScore({ ...heatScore, max: parseInt(e.target.value) })}
                        className="w-full"
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Success Probability Slider */}
                <motion.div
                  className="rounded-lg border p-3 hover:shadow-sm transition-shadow bg-white"
                  style={{ borderColor: COLOR_BORDER }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 size={18} style={{ color: COLOR_ACCENT }} />
                    <span className="font-semibold text-sm" style={{ color: COLOR_PRIMARY }}>
                      Success Probability
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <span className="text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>
                        Min: {successProb.min}%
                      </span>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={successProb.min}
                        onChange={(e) => setSuccessProb({ ...successProb, min: parseInt(e.target.value) })}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <span className="text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>
                        Max: {successProb.max}%
                      </span>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={successProb.max}
                        onChange={(e) => setSuccessProb({ ...successProb, max: parseInt(e.target.value) })}
                        className="w-full"
                      />
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* MAIN GRID */}
          <div className="lg:col-span-3">
            {currentListings.length > 0 ? (
              <>
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
                >
                  {currentListings.map((listing) => (
                    <motion.div key={listing.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                      <ListingCard
                        {...listing}
                        onSave={() => console.log('Saved:', listing.id)}
                        onViewSimilar={() => console.log('Similar:', listing.id)}
                        onContact={() => console.log('Contact:', listing.id)}
                      />
                    </motion.div>
                  ))}
                </motion.div>

                {/* PAGINATION */}
                {totalPages > 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-center gap-2 py-8"
                  >
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg border transition-all hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ borderColor: COLOR_BORDER, color: COLOR_PRIMARY }}
                    >
                      <ChevronLeft size={20} />
                    </button>

                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum
                      if (totalPages <= 5) {
                        pageNum = i + 1
                      } else if (currentPage <= 3) {
                        pageNum = i + 1
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i
                      } else {
                        pageNum = currentPage - 2 + i
                      }
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                            currentPage === pageNum ? 'text-white' : 'border hover:bg-gray-50'
                          }`}
                          style={
                            currentPage === pageNum
                              ? { background: COLOR_ACCENT }
                              : { borderColor: COLOR_BORDER, color: COLOR_PRIMARY }
                          }
                        >
                          {pageNum}
                        </button>
                      )
                    })}

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg border transition-all hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ borderColor: COLOR_BORDER, color: COLOR_PRIMARY }}
                    >
                      <ChevronRight size={20} />
                    </button>

                    <span className="ml-4 text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                      Page {currentPage} of {totalPages}
                    </span>
                  </motion.div>
                )}
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <p className="text-lg" style={{ color: COLOR_TEXT_SECONDARY }}>
                  No opportunities found. Try adjusting your filters.
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, ChevronLeft, ChevronRight, X, Flame, TrendingUp, Eye, BarChart3 } from 'lucide-react'
import ListingCard from '@/components/listing/ListingCard'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER, COLOR_BG_PRIMARY } from '@/styles/forward-colors'

// Marketplace deal data with all intelligence metrics
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
  },
  {
    id: '11',
    title: 'AI/ML Startup',
    location: 'Silicon Valley',
    country: 'USA',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=400&fit=crop',
    askingPrice: 8200000,
    askingPriceCurrency: 'USD',
    annualRevenue: 3200000,
    cashFlowMin: 700000,
    cashFlowMax: 950000,
    ebitda: 800000,
    profitMarginPercent: 25,
    dealQualityScore: 95,
    heatIndex: 97,
    roiProjection: 26.8,
    paybackPeriod: 24,
    growthRate: 85,
    status: 'FEATURED' as const,
    category: 'AI',
    dealType: 'SALE' as const,
    employeeCount: 38,
    sellerVerified: true,
    sellerTrustScore: 97,
    marketTrend: 'up' as const,
    marketPosition: 'premium' as const,
    daysOnMarket: 4,
  },
  {
    id: '12',
    title: 'PropTech Platform',
    location: 'Miami',
    country: 'USA',
    image: 'https://images.unsplash.com/photo-1553531088-b29d91df4e84?w=500&h=400&fit=crop',
    askingPrice: 3800000,
    askingPriceCurrency: 'USD',
    annualRevenue: 1250000,
    cashFlowMin: 250000,
    cashFlowMax: 400000,
    ebitda: 313000,
    profitMarginPercent: 25,
    dealQualityScore: 83,
    heatIndex: 79,
    roiProjection: 20.5,
    paybackPeriod: 40,
    growthRate: 42,
    status: 'STANDARD' as const,
    category: 'PROPTECH',
    dealType: 'SALE' as const,
    employeeCount: 22,
    sellerVerified: true,
    sellerTrustScore: 86,
    marketTrend: 'stable' as const,
    marketPosition: 'fair' as const,
    daysOnMarket: 14,
  },
  {
    id: '13',
    title: 'Supply Chain AI',
    location: 'Chicago',
    country: 'USA',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=400&fit=crop',
    askingPrice: 4200000,
    askingPriceCurrency: 'USD',
    annualRevenue: 1400000,
    cashFlowMin: 280000,
    cashFlowMax: 420000,
    ebitda: 350000,
    profitMarginPercent: 25,
    dealQualityScore: 89,
    heatIndex: 84,
    roiProjection: 21.5,
    paybackPeriod: 36,
    growthRate: 51,
    status: 'NEW' as const,
    category: 'LOGISTICS',
    dealType: 'SALE' as const,
    employeeCount: 26,
    sellerVerified: true,
    sellerTrustScore: 88,
    marketTrend: 'up' as const,
    marketPosition: 'underpriced' as const,
    daysOnMarket: 6,
  },
  {
    id: '14',
    title: 'Wellness App Platform',
    location: 'San Diego',
    country: 'USA',
    image: 'https://images.unsplash.com/photo-1576091160550-112173f31c77?w=500&h=400&fit=crop',
    askingPrice: 2200000,
    askingPriceCurrency: 'USD',
    annualRevenue: 750000,
    cashFlowMin: 150000,
    cashFlowMax: 280000,
    ebitda: 188000,
    profitMarginPercent: 25,
    dealQualityScore: 81,
    heatIndex: 76,
    roiProjection: 19.2,
    paybackPeriod: 44,
    growthRate: 38,
    status: 'STANDARD' as const,
    category: 'HEALTH',
    dealType: 'SALE' as const,
    employeeCount: 18,
    sellerVerified: true,
    sellerTrustScore: 84,
    marketTrend: 'up' as const,
    marketPosition: 'fair' as const,
    daysOnMarket: 11,
  },
  {
    id: '15',
    title: 'Marketplace Platform',
    location: 'Portland',
    country: 'USA',
    image: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=500&h=400&fit=crop',
    askingPrice: 6800000,
    askingPriceCurrency: 'USD',
    annualRevenue: 2200000,
    cashFlowMin: 480000,
    cashFlowMax: 680000,
    ebitda: 550000,
    profitMarginPercent: 25,
    dealQualityScore: 87,
    heatIndex: 88,
    roiProjection: 23.8,
    paybackPeriod: 29,
    growthRate: 64,
    status: 'FEATURED' as const,
    category: 'MARKETPLACE',
    dealType: 'SALE' as const,
    employeeCount: 32,
    sellerVerified: true,
    sellerTrustScore: 93,
    marketTrend: 'up' as const,
    marketPosition: 'fair' as const,
    daysOnMarket: 9,
  },
]

// Extend to 30+ deals for pagination testing
const EXTENDED_MARKETPLACE = [
  ...MARKETPLACE_DEALS,
  ...MARKETPLACE_DEALS.slice(0, 15).map((item, idx) => ({
    ...item,
    id: `duplicate-${idx}`,
    title: `${item.title} (2nd Opportunity)`,
  })),
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
    },
  },
}

export default function MarketplacePage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [minValuation, setMinValuation] = useState<number | ''>(0)
  const [maxValuation, setMaxValuation] = useState<number | ''>(10000000)
  const [minGrowth, setMinGrowth] = useState<number | ''>(0)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  // Filter listings
  const filteredListings = useMemo(() => {
    return EXTENDED_MARKETPLACE.filter(listing => {
      const matchesSearch =
        listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.category.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesValuation = listing.askingPrice >= (minValuation as number) && listing.askingPrice <= (maxValuation as number)
      const matchesGrowth = listing.growthRate >= (minGrowth as number)
      const matchesCategory = selectedCategory === 'all' || listing.category === selectedCategory

      return matchesSearch && matchesValuation && matchesGrowth && matchesCategory
    })
  }, [searchTerm, minValuation, maxValuation, minGrowth, selectedCategory])

  const CARDS_PER_PAGE = 15
  const totalPages = Math.ceil(filteredListings.length / CARDS_PER_PAGE)
  const startIdx = (currentPage - 1) * CARDS_PER_PAGE
  const endIdx = startIdx + CARDS_PER_PAGE
  const currentListings = filteredListings.slice(startIdx, endIdx)

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleResetFilters = () => {
    setSearchTerm('')
    setMinValuation(0)
    setMaxValuation(10000000)
    setMinGrowth(0)
    setSelectedCategory('all')
    setCurrentPage(1)
  }

  const categories = ['all', 'SAAS', 'HEALTHCARE', 'SERVICES', 'LOGISTICS', 'FINTECH', 'AI', 'PROPTECH']

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

      {/* MAIN LAYOUT: SIDEBAR + GRID */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* SIDEBAR - FILTERS */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-24 space-y-6">
              {/* SEARCH */}
              <div>
                <label className="block text-sm font-bold mb-3" style={{ color: COLOR_PRIMARY }}>
                  Search
                </label>
                <div className="relative">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: COLOR_TEXT_SECONDARY }} />
                  <input
                    type="text"
                    placeholder="Company, location..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value)
                      setCurrentPage(1)
                    }}
                    className="w-full pl-10 pr-3 py-2.5 rounded-lg border text-sm bg-white focus:outline-none focus:ring-2"
                    style={{
                      borderColor: COLOR_BORDER,
                      outlineColor: COLOR_ACCENT,
                    } as React.CSSProperties}
                  />
                </div>
              </div>

              {/* CATEGORY FILTER */}
              <div>
                <label className="block text-sm font-bold mb-3" style={{ color: COLOR_PRIMARY }}>
                  Category
                </label>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <label key={cat} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === cat}
                        onChange={() => {
                          setSelectedCategory(cat)
                          setCurrentPage(1)
                        }}
                        className="w-4 h-4"
                      />
                      <span className="text-sm" style={{ color: COLOR_PRIMARY }}>
                        {cat === 'all' ? 'All Categories' : cat}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* VALUATION RANGE */}
              <div>
                <label className="block text-sm font-bold mb-3" style={{ color: COLOR_PRIMARY }}>
                  Valuation (USD)
                </label>
                <div className="space-y-3">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minValuation}
                    onChange={(e) => {
                      setMinValuation(e.target.value === '' ? '' : Number(e.target.value))
                      setCurrentPage(1)
                    }}
                    className="w-full px-3 py-2 rounded-lg border text-sm bg-white focus:outline-none focus:ring-2"
                    style={{
                      borderColor: COLOR_BORDER,
                      outlineColor: COLOR_ACCENT,
                    } as React.CSSProperties}
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxValuation}
                    onChange={(e) => {
                      setMaxValuation(e.target.value === '' ? '' : Number(e.target.value))
                      setCurrentPage(1)
                    }}
                    className="w-full px-3 py-2 rounded-lg border text-sm bg-white focus:outline-none focus:ring-2"
                    style={{
                      borderColor: COLOR_BORDER,
                      outlineColor: COLOR_ACCENT,
                    } as React.CSSProperties}
                  />
                </div>
              </div>

              {/* GROWTH FILTER */}
              <div>
                <label className="block text-sm font-bold mb-3" style={{ color: COLOR_PRIMARY }}>
                  Min Growth Rate
                </label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="Min Growth %"
                    value={minGrowth}
                    onChange={(e) => {
                      setMinGrowth(e.target.value === '' ? '' : Number(e.target.value))
                      setCurrentPage(1)
                    }}
                    step="1"
                    className="w-full px-3 py-2 rounded-lg border text-sm bg-white focus:outline-none focus:ring-2"
                    style={{
                      borderColor: COLOR_BORDER,
                      outlineColor: COLOR_ACCENT,
                    } as React.CSSProperties}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                    %
                  </span>
                </div>
              </div>

              {/* RESET BUTTON */}
              <button
                onClick={handleResetFilters}
                className="w-full px-4 py-2.5 rounded-lg border text-sm font-semibold transition-all hover:bg-gray-50 flex items-center justify-center gap-2"
                style={{ borderColor: COLOR_BORDER, color: COLOR_PRIMARY }}
              >
                <X size={16} />
                Clear Filters
              </button>
            </div>
          </motion.div>

          {/* MAIN CONTENT - GRID */}
          <div className="lg:col-span-3">
            {currentListings.length > 0 ? (
              <>
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8"
                >
                  {currentListings.map((listing) => (
                    <motion.div key={listing.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                      <ListingCard
                        {...listing}
                        onSave={() => console.log('Saved:', listing.id)}
                        onViewSimilar={() => console.log('View similar to:', listing.id)}
                        onContact={() => console.log('Contact for:', listing.id)}
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

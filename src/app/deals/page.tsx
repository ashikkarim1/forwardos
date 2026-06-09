'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useState, useMemo } from 'react'
import { ArrowRight, Flame, TrendingUp, Eye, BarChart3, Zap, BarChart2, Sparkles, Search, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER, COLOR_BG_PRIMARY } from '@/styles/forward-colors'
import { DashboardHeader } from '@/components/DashboardHeader'
import ListingCard from '@/components/listing/ListingCard'

// Mock deal data - 40 deals for testing pagination
const MOCK_LISTINGS = [
  {
    id: '1',
    title: 'Prime Restaurant For Sale In Dubai',
    location: 'Dubai',
    country: 'UAE',
    image: 'https://images.unsplash.com/photo-1552566626-52f8b29e368c?w=500&h=400&fit=crop',
    askingPrice: 680000,
    askingPriceCurrency: 'AED',
    annualRevenue: 2500000,
    cashFlowMin: 500000,
    cashFlowMax: 2500000,
    ebitda: 750000,
    profitMarginPercent: 30,
    dealQualityScore: 85,
    heatIndex: 92,
    roiProjection: 18.5,
    paybackPeriod: 38,
    growthRate: 12,
    status: 'NEW' as const,
    category: 'BUSINESS',
    dealType: 'SALE' as const,
    employeeCount: 8,
    sellerVerified: true,
    sellerTrustScore: 92,
    marketTrend: 'up' as const,
    marketPosition: 'underpriced' as const,
    daysOnMarket: 8,
  },
  {
    id: '2',
    title: 'Luxury Spa & Wellness Center Abu Dhabi',
    location: 'Abu Dhabi',
    country: 'UAE',
    image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=500&h=400&fit=crop',
    askingPrice: 450000,
    askingPriceCurrency: 'AED',
    annualRevenue: 1800000,
    cashFlowMin: 300000,
    cashFlowMax: 1200000,
    ebitda: 540000,
    profitMarginPercent: 30,
    dealQualityScore: 78,
    heatIndex: 65,
    roiProjection: 16.2,
    paybackPeriod: 45,
    growthRate: 8,
    status: 'STANDARD' as const,
    category: 'BUSINESS',
    dealType: 'SALE' as const,
    employeeCount: 12,
  },
  {
    id: '3',
    title: 'Boutique Hotel - Jumeirah',
    location: 'Dubai',
    country: 'UAE',
    image: 'https://images.unsplash.com/photo-1631049307038-da5ec5d128c2?w=500&h=400&fit=crop',
    askingPrice: 2500000,
    askingPriceCurrency: 'AED',
    annualRevenue: 8000000,
    cashFlowMin: 1200000,
    cashFlowMax: 4500000,
    ebitda: 2400000,
    profitMarginPercent: 30,
    dealQualityScore: 88,
    heatIndex: 87,
    roiProjection: 19.2,
    paybackPeriod: 40,
    growthRate: 15,
    status: 'FEATURED' as const,
    category: 'BUSINESS',
    dealType: 'SALE' as const,
    employeeCount: 24,
  },
  {
    id: '4',
    title: 'Fitness Gym Franchise - Dubai Marina',
    location: 'Dubai',
    country: 'UAE',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&h=400&fit=crop',
    askingPrice: 320000,
    askingPriceCurrency: 'AED',
    annualRevenue: 1200000,
    cashFlowMin: 200000,
    cashFlowMax: 800000,
    ebitda: 360000,
    profitMarginPercent: 30,
    dealQualityScore: 72,
    heatIndex: 78,
    roiProjection: 20.1,
    paybackPeriod: 32,
    growthRate: 11,
    status: 'NEW' as const,
    category: 'FRANCHISE',
    dealType: 'LEASE' as const,
    employeeCount: 6,
  },
  {
    id: '5',
    title: 'Coffee Shop Chain - Multiple Locations',
    location: 'Dubai',
    country: 'UAE',
    image: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=500&h=400&fit=crop',
    askingPrice: 580000,
    askingPriceCurrency: 'AED',
    annualRevenue: 2200000,
    cashFlowMin: 450000,
    cashFlowMax: 1800000,
    ebitda: 660000,
    profitMarginPercent: 30,
    dealQualityScore: 81,
    heatIndex: 84,
    roiProjection: 17.8,
    paybackPeriod: 41,
    growthRate: 13,
    status: 'STANDARD' as const,
    category: 'BUSINESS',
    dealType: 'SALE' as const,
    employeeCount: 18,
  },
  {
    id: '6',
    title: 'Real Estate Agency - Established Client Base',
    location: 'Abu Dhabi',
    country: 'UAE',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500&h=400&fit=crop',
    askingPrice: 420000,
    askingPriceCurrency: 'AED',
    annualRevenue: 1600000,
    cashFlowMin: 280000,
    cashFlowMax: 1000000,
    ebitda: 480000,
    profitMarginPercent: 30,
    dealQualityScore: 76,
    heatIndex: 61,
    roiProjection: 15.5,
    paybackPeriod: 48,
    growthRate: 9,
    status: 'STANDARD' as const,
    category: 'BUSINESS',
    dealType: 'SALE' as const,
    employeeCount: 8,
  },
  {
    id: '7',
    title: 'Organic Grocery Store - Downtown Dubai',
    location: 'Dubai',
    country: 'UAE',
    image: 'https://images.unsplash.com/photo-1578365746617-84e7f6265e22?w=500&h=400&fit=crop',
    askingPrice: 250000,
    askingPriceCurrency: 'AED',
    annualRevenue: 950000,
    cashFlowMin: 150000,
    cashFlowMax: 600000,
    ebitda: 285000,
    profitMarginPercent: 30,
    dealQualityScore: 68,
    heatIndex: 52,
    roiProjection: 14.4,
    paybackPeriod: 50,
    growthRate: 7,
    status: 'STANDARD' as const,
    category: 'BUSINESS',
    dealType: 'SALE' as const,
    employeeCount: 5,
  },
  {
    id: '8',
    title: 'Digital Marketing Agency - White Label',
    location: 'Dubai',
    country: 'UAE',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=400&fit=crop',
    askingPrice: 380000,
    askingPriceCurrency: 'AED',
    annualRevenue: 1500000,
    cashFlowMin: 250000,
    cashFlowMax: 900000,
    ebitda: 450000,
    profitMarginPercent: 30,
    dealQualityScore: 79,
    heatIndex: 73,
    roiProjection: 16.8,
    paybackPeriod: 43,
    growthRate: 10,
    status: 'NEW' as const,
    category: 'BUSINESS',
    dealType: 'SALE' as const,
    employeeCount: 7,
  },
  {
    id: '9',
    title: 'Catering Business - Corporate Contracts',
    location: 'Dubai',
    country: 'UAE',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&h=400&fit=crop',
    askingPrice: 520000,
    askingPriceCurrency: 'AED',
    annualRevenue: 2000000,
    cashFlowMin: 350000,
    cashFlowMax: 1400000,
    ebitda: 600000,
    profitMarginPercent: 30,
    dealQualityScore: 74,
    heatIndex: 68,
    roiProjection: 15.9,
    paybackPeriod: 44,
    growthRate: 8,
    status: 'STANDARD' as const,
    category: 'BUSINESS',
    dealType: 'QUICK_SALE' as const,
    employeeCount: 11,
  },
  {
    id: '10',
    title: 'Tutoring Center - Multiple Branches',
    location: 'Dubai',
    country: 'UAE',
    image: 'https://images.unsplash.com/photo-1427504494785-cdee173cdb4d?w=500&h=400&fit=crop',
    askingPrice: 360000,
    askingPriceCurrency: 'AED',
    annualRevenue: 1400000,
    cashFlowMin: 240000,
    cashFlowMax: 800000,
    ebitda: 420000,
    profitMarginPercent: 30,
    dealQualityScore: 75,
    heatIndex: 58,
    roiProjection: 15.2,
    paybackPeriod: 45,
    growthRate: 9,
    status: 'STANDARD' as const,
    category: 'BUSINESS',
    dealType: 'SALE' as const,
    employeeCount: 9,
  },
  {
    id: '11',
    title: 'Beauty Salon & Barbershop - Premium',
    location: 'Abu Dhabi',
    country: 'UAE',
    image: 'https://images.unsplash.com/photo-1560066620-fbcf5e66b613?w=500&h=400&fit=crop',
    askingPrice: 310000,
    askingPriceCurrency: 'AED',
    annualRevenue: 1150000,
    cashFlowMin: 200000,
    cashFlowMax: 700000,
    ebitda: 345000,
    profitMarginPercent: 30,
    dealQualityScore: 70,
    heatIndex: 62,
    roiProjection: 14.8,
    paybackPeriod: 46,
    growthRate: 6,
    status: 'STANDARD' as const,
    category: 'BUSINESS',
    dealType: 'SALE' as const,
    employeeCount: 8,
  },
  {
    id: '12',
    title: 'Pet Care Services - Boarding & Grooming',
    location: 'Dubai',
    country: 'UAE',
    image: 'https://images.unsplash.com/photo-1560599810-543149e7f548?w=500&h=400&fit=crop',
    askingPrice: 280000,
    askingPriceCurrency: 'AED',
    annualRevenue: 1050000,
    cashFlowMin: 180000,
    cashFlowMax: 650000,
    ebitda: 315000,
    profitMarginPercent: 30,
    dealQualityScore: 67,
    heatIndex: 55,
    roiProjection: 14.1,
    paybackPeriod: 47,
    growthRate: 7,
    status: 'STANDARD' as const,
    category: 'BUSINESS',
    dealType: 'SALE' as const,
    employeeCount: 6,
  },
  {
    id: '13',
    title: 'E-commerce Store - Dropshipping Setup',
    location: 'Dubai',
    country: 'UAE',
    image: 'https://images.unsplash.com/photo-1556740722-a3051d60e478?w=500&h=400&fit=crop',
    askingPrice: 180000,
    askingPriceCurrency: 'AED',
    annualRevenue: 720000,
    cashFlowMin: 120000,
    cashFlowMax: 480000,
    ebitda: 216000,
    profitMarginPercent: 30,
    dealQualityScore: 62,
    heatIndex: 48,
    roiProjection: 12.8,
    paybackPeriod: 52,
    growthRate: 5,
    status: 'STANDARD' as const,
    category: 'BUSINESS',
    dealType: 'SALE' as const,
    employeeCount: 2,
  },
  {
    id: '14',
    title: 'Translation & Documentation Services',
    location: 'Dubai',
    country: 'UAE',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=400&fit=crop',
    askingPrice: 220000,
    askingPriceCurrency: 'AED',
    annualRevenue: 880000,
    cashFlowMin: 150000,
    cashFlowMax: 550000,
    ebitda: 264000,
    profitMarginPercent: 30,
    dealQualityScore: 65,
    heatIndex: 50,
    roiProjection: 13.5,
    paybackPeriod: 51,
    growthRate: 6,
    status: 'STANDARD' as const,
    category: 'BUSINESS',
    dealType: 'SALE' as const,
    employeeCount: 4,
  },
  {
    id: '15',
    title: 'Commercial Cleaning Company - Contracts',
    location: 'Abu Dhabi',
    country: 'UAE',
    image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=500&h=400&fit=crop',
    askingPrice: 350000,
    askingPriceCurrency: 'AED',
    annualRevenue: 1300000,
    cashFlowMin: 220000,
    cashFlowMax: 800000,
    ebitda: 390000,
    profitMarginPercent: 30,
    dealQualityScore: 71,
    heatIndex: 59,
    roiProjection: 15.3,
    paybackPeriod: 46,
    growthRate: 8,
    status: 'NEW' as const,
    category: 'BUSINESS',
    dealType: 'SALE' as const,
    employeeCount: 10,
  },
  {
    id: '16',
    title: 'Photography & Videography Studio',
    location: 'Dubai',
    country: 'UAE',
    image: 'https://images.unsplash.com/photo-1502920917128-1aa500764882?w=500&h=400&fit=crop',
    askingPrice: 210000,
    askingPriceCurrency: 'AED',
    annualRevenue: 840000,
    cashFlowMin: 140000,
    cashFlowMax: 520000,
    ebitda: 252000,
    profitMarginPercent: 30,
    dealQualityScore: 64,
    heatIndex: 49,
    roiProjection: 13.2,
    paybackPeriod: 51,
    growthRate: 5,
    status: 'STANDARD' as const,
    category: 'BUSINESS',
    dealType: 'SALE' as const,
    employeeCount: 3,
  },
  {
    id: '17',
    title: 'IT Consulting & Solutions Firm',
    location: 'Dubai',
    country: 'UAE',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=400&fit=crop',
    askingPrice: 420000,
    askingPriceCurrency: 'AED',
    annualRevenue: 1650000,
    cashFlowMin: 280000,
    cashFlowMax: 1050000,
    ebitda: 495000,
    profitMarginPercent: 30,
    dealQualityScore: 77,
    heatIndex: 66,
    roiProjection: 16.1,
    paybackPeriod: 44,
    growthRate: 9,
    status: 'STANDARD' as const,
    category: 'BUSINESS',
    dealType: 'SALE' as const,
    employeeCount: 8,
  },
  {
    id: '18',
    title: 'Dental Clinic - Established Practice',
    location: 'Dubai',
    country: 'UAE',
    image: 'https://images.unsplash.com/photo-1606724261537-b8997c75d5de?w=500&h=400&fit=crop',
    askingPrice: 680000,
    askingPriceCurrency: 'AED',
    annualRevenue: 2600000,
    cashFlowMin: 480000,
    cashFlowMax: 2200000,
    ebitda: 780000,
    profitMarginPercent: 30,
    dealQualityScore: 86,
    heatIndex: 89,
    roiProjection: 18.9,
    paybackPeriod: 39,
    growthRate: 12,
    status: 'FEATURED' as const,
    category: 'BUSINESS',
    dealType: 'SALE' as const,
    employeeCount: 9,
  },
  {
    id: '19',
    title: 'Logistics & Warehousing Operation',
    location: 'Abu Dhabi',
    country: 'UAE',
    image: 'https://images.unsplash.com/photo-1586528116039-bac0ad82a90d?w=500&h=400&fit=crop',
    askingPrice: 950000,
    askingPriceCurrency: 'AED',
    annualRevenue: 3600000,
    cashFlowMin: 600000,
    cashFlowMax: 2400000,
    ebitda: 1080000,
    profitMarginPercent: 30,
    dealQualityScore: 80,
    heatIndex: 75,
    roiProjection: 17.5,
    paybackPeriod: 42,
    growthRate: 11,
    status: 'STANDARD' as const,
    category: 'BUSINESS',
    dealType: 'LEASE' as const,
    employeeCount: 16,
  },
  {
    id: '20',
    title: 'Restaurant Group - 3 Locations',
    location: 'Dubai',
    country: 'UAE',
    image: 'https://images.unsplash.com/photo-1552566626-52f8b29e368c?w=500&h=400&fit=crop',
    askingPrice: 1800000,
    askingPriceCurrency: 'AED',
    annualRevenue: 6800000,
    cashFlowMin: 1100000,
    cashFlowMax: 4200000,
    ebitda: 2040000,
    profitMarginPercent: 30,
    dealQualityScore: 87,
    heatIndex: 91,
    roiProjection: 19.1,
    paybackPeriod: 38,
    growthRate: 14,
    status: 'FEATURED' as const,
    category: 'BUSINESS',
    dealType: 'SALE' as const,
    employeeCount: 45,
  },
]

// Add gap-filling data to all listings (seller verification, market trends, etc.)
const addMarketData = (listings: typeof MOCK_LISTINGS) => {
  return listings.map((item, idx) => ({
    ...item,
    sellerVerified: true,
    sellerTrustScore: 80 + Math.floor(Math.random() * 20), // 80-100
    marketTrend: ['up', 'down', 'stable'][idx % 3] as const,
    marketPosition: ['underpriced', 'fair', 'premium'][idx % 3] as const,
    daysOnMarket: 5 + Math.floor(Math.random() * 40), // 5-45 days
    upcomingAuction: idx % 9 === 0, // 1 in 9 chance of auction
  }))
}

const ENHANCED_LISTINGS = addMarketData(MOCK_LISTINGS)

// Duplicate for testing pagination (40 total)
const EXTENDED_LISTINGS = [
  ...ENHANCED_LISTINGS,
  ...addMarketData(MOCK_LISTINGS.slice(0, 20).map((item, idx) => ({
    ...item,
    id: `dup-${idx}`,
    title: `${item.title} (2)`,
  }))),
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

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
}

export default function DealsPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [minPrice, setMinPrice] = useState<number | ''>(0)
  const [maxPrice, setMaxPrice] = useState<number | ''>(5000000)
  const [minROI, setMinROI] = useState<number | ''>(0)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  // Filter listings based on search and filters
  const filteredListings = useMemo(() => {
    return EXTENDED_LISTINGS.filter(listing => {
      const matchesSearch =
        listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.category.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesPrice = listing.askingPrice >= (minPrice as number) && listing.askingPrice <= (maxPrice as number)
      const matchesROI = listing.roiProjection >= (minROI as number)
      const matchesCategory = selectedCategory === 'all' || listing.category === selectedCategory

      return matchesSearch && matchesPrice && matchesROI && matchesCategory
    })
  }, [searchTerm, minPrice, maxPrice, minROI, selectedCategory])

  // Calculate pagination
  const CARDS_PER_PAGE = 15 // 3 columns x 5 rows
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
    setMinPrice(0)
    setMaxPrice(5000000)
    setMinROI(0)
    setSelectedCategory('all')
    setCurrentPage(1)
  }

  const categories = ['all', 'BUSINESS', 'FRANCHISE']

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
        className="max-w-7xl mx-auto px-6 py-8 space-y-8"
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
            { icon: Flame, label: 'Hot Opportunities', value: filteredListings.filter(l => l.heatIndex > 80).length.toString(), color: COLOR_ACCENT },
            { icon: TrendingUp, label: 'High ROI', value: filteredListings.filter(l => l.roiProjection > 17).length.toString(), color: COLOR_ACCENT },
            { icon: Eye, label: 'Excellent Quality', value: filteredListings.filter(l => l.dealQualityScore > 80).length.toString(), color: '#1D4ED8' },
            { icon: BarChart3, label: 'Total Value', value: `${(filteredListings.reduce((sum, l) => sum + l.askingPrice, 0) / 1000000).toFixed(0)}M`, color: '#B45309' },
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

        {/* MAIN LAYOUT: SIDEBAR + GRID */}
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
                    placeholder="Business name, location..."
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

              {/* PRICE RANGE */}
              <div>
                <label className="block text-sm font-bold mb-3" style={{ color: COLOR_PRIMARY }}>
                  Asking Price (AED)
                </label>
                <div className="space-y-3">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => {
                      setMinPrice(e.target.value === '' ? '' : Number(e.target.value))
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
                    value={maxPrice}
                    onChange={(e) => {
                      setMaxPrice(e.target.value === '' ? '' : Number(e.target.value))
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

              {/* ROI FILTER */}
              <div>
                <label className="block text-sm font-bold mb-3" style={{ color: COLOR_PRIMARY }}>
                  Min ROI Projection
                </label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="Min ROI %"
                    value={minROI}
                    onChange={(e) => {
                      setMinROI(e.target.value === '' ? '' : Number(e.target.value))
                      setCurrentPage(1)
                    }}
                    step="0.5"
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
                  No deals found. Try adjusting your filters.
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </>
  )
}

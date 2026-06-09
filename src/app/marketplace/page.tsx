'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useLocale } from '@/context/LocaleContext'
import { useTranslation } from '@/hooks/useTranslation'
import { PageHeader } from '@/components/PageHeader'
import { ModernMarketplaceSearch } from '@/components/ModernMarketplaceSearch'
import { DealComparison } from '@/components/MarketplaceSearch'
import { BusinessPhotoGallery } from '@/components/BusinessPhotoGallery'
import { HelpContactWidget } from '@/components/HelpContactWidget'
import { WorldClassFooter } from '@/components/WorldClassFooter'
import { Heart, Eye, Sparkles, Flame, CheckCircle2, Search, X, ChevronLeft, ChevronRight, TrendingUp, Star, Image as ImageIcon } from 'lucide-react'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER } from '@/styles/forward-colors'

interface Deal {
  id: string
  name: string
  franchiseType: 'franchise-new' | 'franchise-existing' | 'non-franchise'
  industry: string
  businessType?: string // e.g., "SaaS Platform", "Healthcare Network"
  valuation: number
  revenue: number
  cashFlow?: number
  ebitda: number
  ebitdaMargin: number
  growthRate: number
  location: string
  city?: string
  successProbability: number
  heatScore: number
  employees: number
  customerCount: number
  likes: number
  viewers: number
  isAIRecommended: boolean
  isTrending: boolean
  aiInsight: string
  isVerified: boolean
  riskScore: number
  maaProbability: number
  comparablesCount: number
  recentActivity: string
  sellerType: string
  sellerMotivation: string
  photos?: string[] // Array of photo URLs
  heroImage?: string // Main hero image
}

const mockDeals: Deal[] = [
  {
    id: '1',
    name: 'TechFlow SaaS',
    businessType: 'SaaS Platform - Project Management',
    franchiseType: 'non-franchise',
    industry: 'SaaS / Software',
    valuation: 2500000,
    revenue: 850000,
    cashFlow: 185000,
    ebitda: 187000,
    ebitdaMargin: 22,
    growthRate: 45,
    location: 'San Francisco, CA',
    city: 'San Francisco',
    successProbability: 92,
    heatScore: 88,
    employees: 12,
    customerCount: 187,
    likes: 234,
    viewers: 1842,
    isAIRecommended: true,
    isTrending: true,
    aiInsight: 'Strong PMF with 45% YoY growth.',
    isVerified: true,
    riskScore: 12,
    maaProbability: 87,
    comparablesCount: 14,
    recentActivity: '342 views this week',
    sellerType: 'Founder',
    sellerMotivation: 'Growth Capital Needed',
    heroImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=500&fit=crop',
    photos: [
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1553531088-b29d91df4e84?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=500&fit=crop',
    ],
  },
  {
    id: '2',
    name: 'CloudFirst Analytics',
    businessType: 'Analytics Platform - Business Intelligence',
    franchiseType: 'non-franchise',
    industry: 'SaaS / Software',
    valuation: 5800000,
    revenue: 1900000,
    cashFlow: 456000,
    ebitda: 456000,
    ebitdaMargin: 24,
    growthRate: 62,
    location: 'Toronto, ON',
    city: 'Toronto',
    successProbability: 87,
    heatScore: 92,
    employees: 18,
    customerCount: 342,
    likes: 567,
    viewers: 3201,
    isAIRecommended: true,
    isTrending: true,
    aiInsight: '62% growth + 24% margins = perfect bolt-on.',
    isVerified: true,
    riskScore: 15,
    maaProbability: 91,
    comparablesCount: 23,
    recentActivity: '512 views this week',
    sellerType: 'PE/Financial',
    sellerMotivation: 'Portfolio Optimization',
    heroImage: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=500&fit=crop',
    photos: [
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&h=500&fit=crop',
    ],
  },
  {
    id: '3',
    name: 'Emirates Franchise Network',
    franchiseType: 'franchise-existing',
    industry: 'Food & Beverage',
    valuation: 1200000,
    revenue: 450000,
    ebitda: 90000,
    ebitdaMargin: 20,
    growthRate: 28,
    location: 'United Arab Emirates',
    successProbability: 74,
    heatScore: 68,
    employees: 8,
    customerCount: 3400,
    likes: 189,
    viewers: 945,
    isAIRecommended: false,
    isTrending: false,
    aiInsight: 'Established franchise with brand recognition.',
    isVerified: true,
    riskScore: 28,
    maaProbability: 62,
    comparablesCount: 8,
    recentActivity: '156 views this week',
    sellerType: 'Family',
    sellerMotivation: 'Retirement / Exit',
  },
  {
    id: '4',
    name: 'MediCare Solutions',
    franchiseType: 'non-franchise',
    industry: 'Healthcare / Medical',
    valuation: 4500000,
    revenue: 1600000,
    ebitda: 400000,
    ebitdaMargin: 25,
    growthRate: 38,
    location: 'Canada',
    successProbability: 89,
    heatScore: 82,
    employees: 22,
    customerCount: 450,
    likes: 189,
    viewers: 1456,
    isAIRecommended: true,
    isTrending: false,
    aiInsight: 'Healthcare services with recurring revenue.',
    isVerified: true,
    riskScore: 18,
    maaProbability: 78,
    comparablesCount: 19,
    recentActivity: '267 views this week',
    sellerType: 'Founder',
    sellerMotivation: 'Growth Capital Needed',
  },
  {
    id: '5',
    name: 'FoodChain Restaurant Group',
    franchiseType: 'non-franchise',
    industry: 'Food & Beverage',
    valuation: 1800000,
    revenue: 650000,
    ebitda: 130000,
    ebitdaMargin: 20,
    growthRate: 32,
    location: 'United States',
    successProbability: 78,
    heatScore: 65,
    employees: 28,
    customerCount: 0,
    likes: 92,
    viewers: 734,
    isAIRecommended: false,
    isTrending: false,
    aiInsight: 'Multi-unit F&B. Higher risk, higher capex.',
    isVerified: false,
    riskScore: 42,
    maaProbability: 55,
    comparablesCount: 6,
    recentActivity: '98 views this week',
    sellerType: 'Corporate',
    sellerMotivation: 'Distressed / Urgent',
  },
  {
    id: '6',
    name: 'LogisticsPro Hub',
    franchiseType: 'non-franchise',
    industry: 'Logistics / Transportation',
    valuation: 6200000,
    revenue: 2100000,
    ebitda: 525000,
    ebitdaMargin: 25,
    growthRate: 55,
    location: 'United States',
    successProbability: 90,
    heatScore: 89,
    employees: 35,
    customerCount: 1200,
    likes: 512,
    viewers: 3872,
    isAIRecommended: true,
    isTrending: true,
    aiInsight: 'B2B logistics services. Strategic bolt-on.',
    isVerified: true,
    riskScore: 14,
    maaProbability: 85,
    comparablesCount: 21,
    recentActivity: '634 views this week',
    sellerType: 'Family',
    sellerMotivation: 'Succession Planning',
  },
]

// Photo library for different business types
const photoLibrary: Record<string, string[]> = {
  'SaaS / Software': [
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=500&fit=crop',
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=500&fit=crop',
    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=500&fit=crop',
  ],
  'Healthcare / Medical': [
    'https://images.unsplash.com/photo-1576091160550-112173f31c77?w=800&h=500&fit=crop',
    'https://images.unsplash.com/photo-1576091160550-112173f31c77?w=800&h=500&fit=crop',
    'https://images.unsplash.com/photo-1586654190992-42d72fd5ca1f?w=800&h=500&fit=crop',
  ],
  'Food & Beverage': [
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=500&fit=crop',
    'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&h=500&fit=crop',
    'https://images.unsplash.com/photo-1540521110410-3cde6a3d2b3f?w=800&h=500&fit=crop',
  ],
  'Logistics / Transportation': [
    'https://images.unsplash.com/photo-1586398128686-0a03e8917b87?w=800&h=500&fit=crop',
    'https://images.unsplash.com/photo-1578074063215-b0ad0a92f04e?w=800&h=500&fit=crop',
    'https://images.unsplash.com/photo-1552234612-7039dd65dfec?w=800&h=500&fit=crop',
  ],
}

// Helper to enrich deals with missing fields
function enrichDeal(deal: Deal): Deal {
  const photos = photoLibrary[deal.industry] || photoLibrary['SaaS / Software']
  const city = deal.location?.split(',')[0] || deal.location

  return {
    ...deal,
    businessType: deal.businessType || `${deal.industry} Business`,
    cashFlow: deal.cashFlow || Math.floor(deal.revenue * 0.3),
    city,
    photos: deal.photos || [photos[0], photos[1], photos[2], ...photos],
    heroImage: deal.heroImage || photos[0],
  }
}

// Generate mock deals for pagination (50 total)
const enrichedMockDeals = mockDeals.map(enrichDeal)
const allMockDeals: Deal[] = Array.from({ length: 50 }, (_, i) => {
  const baseDeal = enrichedMockDeals[i % enrichedMockDeals.length]
  return {
    ...baseDeal,
    id: `deal-${i + 1}`,
    // Don't show the name initially - show business type instead
  }
})

const ITEMS_PER_PAGE = 24

export default function MarketplacePage() {
  const { locale, isRTL } = useLocale()
  const t = useTranslation()
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedDeals, setSelectedDeals] = useState<string[]>([])
  const [favourites, setFavourites] = useState<string[]>([])
  const [photoModalOpen, setPhotoModalOpen] = useState(false)
  const [selectedDealPhotos, setSelectedDealPhotos] = useState<string[]>([])
  const [selectedDealType, setSelectedDealType] = useState('')


  useEffect(() => {
    const saved = localStorage.getItem('forward_favourites')
    if (saved) setFavourites(JSON.parse(saved))
  }, [])

  useEffect(() => {
    localStorage.setItem('forward_favourites', JSON.stringify(favourites))
  }, [favourites])

  const [filters, setFilters] = useState({
    query: '',
    industry: [] as string[],
    valuation: [100000, 100000000] as [number, number],
    revenue: [100000, 50000000] as [number, number],
    ebitda: [5, 80] as [number, number],
    location: [] as string[],
    growth: [-20, 100] as [number, number],
    sellerType: [] as string[],
    sellerMotivation: [] as string[],
    heatScore: [0, 100] as [number, number],
    successProbability: [0, 100] as [number, number],
    sort: 'relevance',
  })

  const toggleFavourite = (dealId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    setFavourites((prev) =>
      prev.includes(dealId) ? prev.filter((id) => id !== dealId) : [...prev, dealId]
    )
  }

  const toggleDealSelection = (dealId: string) => {
    setSelectedDeals((prev) =>
      prev.includes(dealId) ? prev.filter((id) => id !== dealId) : [...prev.slice(-4), dealId]
    )
  }

  const activeFilterCount =
    (filters.industry.length > 0 ? 1 : 0) +
    (filters.location.length > 0 ? 1 : 0) +
    (filters.sellerType.length > 0 ? 1 : 0) +
    (filters.sellerMotivation.length > 0 ? 1 : 0) +
    (filters.valuation[0] !== 100000 || filters.valuation[1] !== 100000000 ? 1 : 0) +
    (filters.revenue[0] !== 100000 || filters.revenue[1] !== 50000000 ? 1 : 0) +
    (filters.ebitda[0] !== 5 || filters.ebitda[1] !== 80 ? 1 : 0) +
    (filters.growth[0] !== -20 || filters.growth[1] !== 100 ? 1 : 0) +
    (filters.heatScore[0] !== 0 || filters.heatScore[1] !== 100 ? 1 : 0) +
    (filters.successProbability[0] !== 0 || filters.successProbability[1] !== 100 ? 1 : 0) +
    (filters.query ? 1 : 0)

  const trendingData = [
    { label: 'SaaS', count: 12, heat: 92 },
    { label: 'Healthcare', count: 6, heat: 85 },
    { label: 'Logistics', count: 4, heat: 89 },
  ]

  const filteredDeals = allMockDeals.filter((deal) => {
    const matchesSearch = deal.name.toLowerCase().includes(filters.query.toLowerCase()) || deal.industry.toLowerCase().includes(filters.query.toLowerCase())
    const matchesIndustry = filters.industry.length === 0 || filters.industry.includes(deal.industry)
    const matchesLocation = filters.location.length === 0 || filters.location.includes(deal.location)
    const matchesSellerType = filters.sellerType.length === 0 || filters.sellerType.includes(deal.sellerType)
    const matchesSellerMotivation = filters.sellerMotivation.length === 0 || filters.sellerMotivation.includes(deal.sellerMotivation)
    const matchesValuation = deal.valuation >= filters.valuation[0] && deal.valuation <= filters.valuation[1]
    const matchesRevenue = deal.revenue >= filters.revenue[0] && deal.revenue <= filters.revenue[1]
    const matchesEbitda = deal.ebitdaMargin >= filters.ebitda[0] && deal.ebitdaMargin <= filters.ebitda[1]
    const matchesGrowth = deal.growthRate >= filters.growth[0] && deal.growthRate <= filters.growth[1]
    const matchesHeat = deal.heatScore >= filters.heatScore[0] && deal.heatScore <= filters.heatScore[1]
    const matchesSuccess = deal.successProbability >= filters.successProbability[0] && deal.successProbability <= filters.successProbability[1]

    return matchesSearch && matchesIndustry && matchesLocation && matchesSellerType && matchesSellerMotivation && matchesValuation && matchesRevenue && matchesEbitda && matchesGrowth && matchesHeat && matchesSuccess
  })

  const totalPages = Math.ceil(filteredDeals.length / ITEMS_PER_PAGE)
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedDeals = filteredDeals.slice(startIdx, startIdx + ITEMS_PER_PAGE)
  const selectedDealObjects = allMockDeals.filter((d) => selectedDeals.includes(d.id))

  return (
    <div className="min-h-screen bg-white" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* HEADER with Breadcrumbs */}
      <PageHeader
        title={t('marketplace.title')}
        subtitle={`${filteredDeals.length} ${t('marketplace.dealsFound')}`}
        breadcrumbs={[{ label: 'Marketplace' }]}
      >
        <Link
          href="/my-favourites"
          className="px-6 py-3 rounded-lg font-bold text-white flex items-center gap-2 hover:opacity-90"
          style={{ background: COLOR_ACCENT }}
        >
          <Star size={20} />
          {t('marketplace.myFavourites')} ({favourites.length})
        </Link>
      </PageHeader>

      {/* Trending Section */}
      <div style={{ borderColor: COLOR_BORDER, background: COLOR_PRIMARY + '02' }} className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {trendingData.map((item, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-lg border" style={{ borderColor: COLOR_BORDER, background: 'white' }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp size={16} style={{ color: COLOR_ACCENT }} />
                    <span className="font-semibold" style={{ color: COLOR_PRIMARY }}>{item.label}</span>
                  </div>
                  <span className="px-2 py-1 rounded text-xs font-bold" style={{ background: '#FF6B35' + '20', color: '#FF6B35' }}>{t('marketplace.heat')} {item.heat}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* FILTERS - Modern World-Class Filter System */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-1">
            <div className="sticky top-8">
              <ModernMarketplaceSearch
                onFilterChange={(newFilters) => {
                  setFilters(newFilters)
                  setCurrentPage(1)
                }}
                onSortChange={(sort) => {
                  setFilters({ ...filters, sort })
                }}
                dealCount={filteredDeals.length}
              />
            </div>
          </motion.div>

          {/* GRID - FIXED HEIGHT CARDS */}
          <div className="lg:col-span-3">
            {paginatedDeals.length === 0 ? (
              <div className="text-center py-12">
                <p style={{ color: COLOR_TEXT_SECONDARY }}>No deals match your filters</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8 auto-rows-max">
                  {paginatedDeals.map((deal) => (
                    <motion.div
                      key={deal.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={() => toggleDealSelection(deal.id)}
                      className={`rounded-xl border overflow-hidden hover:shadow-lg transition-all cursor-pointer h-full flex flex-col group ${selectedDeals.includes(deal.id) ? 'ring-2' : ''}`}
                      style={{ borderColor: selectedDeals.includes(deal.id) ? COLOR_ACCENT : COLOR_BORDER, background: selectedDeals.includes(deal.id) ? COLOR_ACCENT + '05' : 'white' }}
                    >
                      {/* HERO IMAGE - Responsive Height */}
                      <div className="relative w-full h-32 sm:h-40 bg-gray-200 overflow-hidden">
                        <img
                          src={deal.heroImage}
                          alt={deal.businessType}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />

                        {/* Photo Gallery Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedDealPhotos(deal.photos || [deal.heroImage || ''])
                            setSelectedDealType(deal.businessType || 'Business')
                            setPhotoModalOpen(true)
                          }}
                          className="absolute bottom-2 right-2 p-2 rounded-lg bg-white/90 hover:bg-white transition-all shadow-md"
                        >
                          <ImageIcon size={18} style={{ color: COLOR_ACCENT }} />
                        </button>

                        {/* Badges */}
                        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                          {deal.isAIRecommended && <span className="px-2 py-1 rounded text-xs font-bold" style={{ background: COLOR_ACCENT + '90', color: 'white' }}>✨ AI</span>}
                          {deal.isTrending && <span className="px-2 py-1 rounded text-xs font-bold" style={{ background: '#FF6B35', color: 'white' }}>🔥 Hot</span>}
                        </div>
                      </div>

                      {/* Business Info - NO NAME */}
                      <div style={{ background: COLOR_ACCENT + '05', borderBottom: `1px solid ${COLOR_BORDER}` }} className="p-3 md:p-4">
                        <h3 className="font-bold text-sm md:text-base mb-1" style={{ color: COLOR_PRIMARY }}>
                          {deal.businessType || 'Business Opportunity'}
                        </h3>
                        <p className="text-xs md:text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                          {deal.city || deal.location?.split(',')[0]} • {deal.employees} employees
                        </p>
                      </div>

                      {/* Key Business Metrics */}
                      <div className="p-3 md:p-4 space-y-2 flex-1 overflow-hidden">
                        {/* Financial Metrics Grid */}
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <p className="text-xs font-bold uppercase tracking-wide" style={{ color: COLOR_TEXT_SECONDARY }}>{t('marketplace.revenue')}</p>
                            <p className="text-sm font-black" style={{ color: COLOR_PRIMARY }}>${(deal.revenue / 1000).toFixed(0)}K</p>
                          </div>
                          <div>
                            <p className="text-xs font-bold uppercase tracking-wide" style={{ color: COLOR_TEXT_SECONDARY }}>{t('marketplace.valuation')}</p>
                            <p className="text-sm font-black" style={{ color: COLOR_PRIMARY }}>${(deal.valuation / 1000000).toFixed(1)}M</p>
                          </div>
                          <div>
                            <p className="text-xs font-bold uppercase tracking-wide" style={{ color: COLOR_TEXT_SECONDARY }}>{t('marketplace.cashFlow')}</p>
                            <p className="text-sm font-black" style={{ color: COLOR_PRIMARY }}>${((deal.cashFlow || deal.revenue * 0.3) / 1000).toFixed(0)}K</p>
                          </div>
                          <div>
                            <p className="text-xs font-bold uppercase tracking-wide" style={{ color: COLOR_TEXT_SECONDARY }}>{t('marketplace.growth')}</p>
                            <p className="text-sm font-black" style={{ color: COLOR_PRIMARY }}>{deal.growthRate}%</p>
                          </div>
                        </div>

                        {/* Success & M&A Probability */}
                        <div style={{ background: COLOR_PRIMARY + '02', borderRadius: '6px' }} className="p-2 space-y-1">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-bold" style={{ color: COLOR_TEXT_SECONDARY }}>{t('marketplace.successProb')}</span>
                            <span className="font-black" style={{ color: '#10b981' }}>{deal.successProbability}%</span>
                          </div>
                          <div className="flex justify-between items-center text-xs border-t pt-1" style={{ borderColor: COLOR_BORDER }}>
                            <span className="font-bold" style={{ color: COLOR_TEXT_SECONDARY }}>{t('marketplace.maaProbability')}</span>
                            <span className="font-black" style={{ color: COLOR_ACCENT }}>{deal.maaProbability}%</span>
                          </div>
                        </div>
                      </div>

                      {/* Favorite & View Deal Buttons */}
                      <div className="p-3 md:p-4 border-t space-y-2" style={{ borderColor: COLOR_BORDER }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleFavourite(deal.id)
                          }}
                          className="w-full py-3 md:py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all border"
                          style={{
                            borderColor: favourites.includes(deal.id) ? COLOR_ACCENT : COLOR_BORDER,
                            background: favourites.includes(deal.id) ? COLOR_ACCENT + '10' : 'white',
                            color: favourites.includes(deal.id) ? COLOR_ACCENT : COLOR_PRIMARY,
                            minHeight: '44px',
                          }}
                        >
                          <Star size={16} fill={favourites.includes(deal.id) ? COLOR_ACCENT : 'none'} />
                          {favourites.includes(deal.id) ? t('marketplace.saved') : t('marketplace.saveDeal')}
                        </button>
                        <Link
                          href={`/deal/${deal.id}`}
                          className="w-full block text-center py-3 md:py-2 font-bold text-white hover:opacity-90 transition-all rounded-lg text-sm"
                          style={{ background: COLOR_ACCENT, minHeight: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          {t('marketplace.viewDeal')}
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* PAGINATION */}
                <div className="flex items-center justify-center gap-2 md:gap-4 py-8 px-4 overflow-x-auto">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-4 md:px-4 py-3 md:py-2 rounded-lg border font-bold disabled:opacity-50 flex-shrink-0"
                    style={{ borderColor: COLOR_BORDER, color: COLOR_PRIMARY, minHeight: '44px', minWidth: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <ChevronLeft size={20} />
                  </button>

                  <div className="flex items-center gap-1 md:gap-2">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = i + 1
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 md:px-3 py-3 md:py-2 rounded-lg font-bold transition-all flex-shrink-0 ${currentPage === page ? 'text-white' : ''}`}
                          style={{
                            background: currentPage === page ? COLOR_ACCENT : COLOR_BORDER,
                            color: currentPage === page ? 'white' : COLOR_PRIMARY,
                            minHeight: '44px',
                            minWidth: '44px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {page}
                        </button>
                      )
                    })}
                    {totalPages > 5 && <span style={{ color: COLOR_TEXT_SECONDARY }}>... {totalPages}</span>}
                  </div>

                  <span style={{ color: COLOR_TEXT_SECONDARY }} className="text-sm font-semibold">
                    Page {currentPage} of {totalPages}
                  </span>

                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-lg border font-bold disabled:opacity-50"
                    style={{ borderColor: COLOR_BORDER, color: COLOR_PRIMARY }}
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Comparison */}
      {selectedDealObjects.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-lg border"
            style={{ borderColor: COLOR_ACCENT, background: COLOR_ACCENT + '05' }}
          >
            <h3 className="font-black text-lg mb-4" style={{ color: COLOR_PRIMARY }}>
              Comparing {selectedDealObjects.length} Deal{selectedDealObjects.length !== 1 ? 's' : ''}
            </h3>
            <DealComparison selectedDeals={selectedDealObjects} />
          </motion.div>
        </div>
      )}

      {/* Business Photo Gallery Modal */}
      <BusinessPhotoGallery
        isOpen={photoModalOpen}
        onClose={() => setPhotoModalOpen(false)}
        photos={selectedDealPhotos}
        businessType={selectedDealType}
      />

      {/* Help Contact Widget */}
      <HelpContactWidget />

      {/* World Class Footer */}
      <WorldClassFooter />
    </div>
  )
}

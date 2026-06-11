'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Search, ChevronLeft, ChevronRight, ChevronDown, Building2, MapPin, Users, Target, DollarSign, TrendingUp, Zap, CheckCircle2 } from 'lucide-react'
import ListingCard from '@/components/listing/ListingCard'
import { BusinessPhotoGallery } from '@/components/BusinessPhotoGallery'
import { SaveSearchButton } from '@/components/SaveSearchButton'
import { PublicHeader } from '@/components/Navigation'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER, COLOR_BG_PRIMARY } from '@/styles/forward-colors'

interface Deal {
  id: string; title: string; location: string; country: string; image: string; askingPrice: number; askingPriceCurrency: string; annualRevenue: number; cashFlowMin: number; cashFlowMax: number; ebitda: number; profitMarginPercent: number; dealQualityScore: number; heatIndex: number; roiProjection: number; paybackPeriod: number; growthRate: number; status: 'NEW' | 'FEATURED' | 'STANDARD'; category: string; dealType: 'SALE' | 'LEASE' | 'QUICK_SALE'; employeeCount: number; sellerVerified: boolean; sellerTrustScore: number; marketTrend: 'up' | 'down' | 'stable'; marketPosition: 'underpriced' | 'fair' | 'premium'; daysOnMarket: number; location_country: string; sellerType: string; sellerMotivation: string; upcomingAuction?: boolean
}

const DEALS: Deal[] = [
  { id: 'deal-1', title: 'TechFlow SaaS Platform', location: 'San Francisco', country: 'USA', image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=400&fit=crop', askingPrice: 2500000, askingPriceCurrency: 'USD', annualRevenue: 850000, cashFlowMin: 170000, cashFlowMax: 200000, ebitda: 187000, profitMarginPercent: 22, dealQualityScore: 92, heatIndex: 88, roiProjection: 22.5, paybackPeriod: 32, growthRate: 45, status: 'FEATURED', category: 'SAAS', dealType: 'SALE', employeeCount: 12, sellerVerified: true, sellerTrustScore: 95, marketTrend: 'up', marketPosition: 'underpriced', daysOnMarket: 5, location_country: 'USA', sellerType: 'Founder', sellerMotivation: 'Growth Capital' },
  { id: 'deal-2', title: 'CloudFirst Analytics', location: 'Toronto', country: 'Canada', image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=500&h=400&fit=crop', askingPrice: 5800000, askingPriceCurrency: 'USD', annualRevenue: 1900000, cashFlowMin: 380000, cashFlowMax: 520000, ebitda: 456000, profitMarginPercent: 24, dealQualityScore: 91, heatIndex: 92, roiProjection: 24.3, paybackPeriod: 28, growthRate: 62, status: 'FEATURED', category: 'SAAS', dealType: 'SALE', employeeCount: 18, sellerVerified: true, sellerTrustScore: 93, marketTrend: 'up', marketPosition: 'fair', daysOnMarket: 8, location_country: 'Canada', sellerType: 'PE', sellerMotivation: 'Portfolio Optimization' },
  { id: 'deal-3', title: 'Emirates Franchise Network', location: 'Dubai', country: 'UAE', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=400&fit=crop', askingPrice: 1200000, askingPriceCurrency: 'USD', annualRevenue: 450000, cashFlowMin: 90000, cashFlowMax: 180000, ebitda: 90000, profitMarginPercent: 20, dealQualityScore: 74, heatIndex: 68, roiProjection: 18.5, paybackPeriod: 48, growthRate: 28, status: 'STANDARD', category: 'FRANCHISE', dealType: 'SALE', employeeCount: 8, sellerVerified: true, sellerTrustScore: 88, marketTrend: 'stable', marketPosition: 'fair', daysOnMarket: 15, location_country: 'UAE', sellerType: 'Family', sellerMotivation: 'Succession' },
  { id: 'deal-4', title: 'HealthTech Clinic Network', location: 'Boston', country: 'USA', image: 'https://images.unsplash.com/photo-1576091160550-112173f31c77?w=500&h=400&fit=crop', askingPrice: 4500000, askingPriceCurrency: 'USD', annualRevenue: 1800000, cashFlowMin: 350000, cashFlowMax: 450000, ebitda: 405000, profitMarginPercent: 23, dealQualityScore: 87, heatIndex: 85, roiProjection: 21.2, paybackPeriod: 35, growthRate: 35, status: 'NEW', category: 'HEALTHCARE', dealType: 'SALE', employeeCount: 24, sellerVerified: true, sellerTrustScore: 90, marketTrend: 'up', marketPosition: 'underpriced', daysOnMarket: 3, location_country: 'USA', sellerType: 'Corporate', sellerMotivation: 'Distressed' },
  { id: 'deal-5', title: 'Digital Marketing Agency', location: 'Austin', country: 'USA', image: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=500&h=400&fit=crop', askingPrice: 1800000, askingPriceCurrency: 'USD', annualRevenue: 680000, cashFlowMin: 150000, cashFlowMax: 250000, ebitda: 155000, profitMarginPercent: 23, dealQualityScore: 79, heatIndex: 72, roiProjection: 19.8, paybackPeriod: 42, growthRate: 32, status: 'STANDARD', category: 'SERVICES', dealType: 'SALE', employeeCount: 14, sellerVerified: true, sellerTrustScore: 85, marketTrend: 'up', marketPosition: 'fair', daysOnMarket: 12, location_country: 'USA', sellerType: 'Founder', sellerMotivation: 'Growth Capital' },
  { id: 'deal-6', title: 'LogisticsPro Hub', location: 'Atlanta', country: 'USA', image: 'https://images.unsplash.com/photo-1586398128686-0a03e8917b87?w=500&h=400&fit=crop', askingPrice: 6200000, askingPriceCurrency: 'USD', annualRevenue: 2100000, cashFlowMin: 450000, cashFlowMax: 600000, ebitda: 525000, profitMarginPercent: 25, dealQualityScore: 90, heatIndex: 89, roiProjection: 23.5, paybackPeriod: 30, growthRate: 55, status: 'FEATURED', category: 'LOGISTICS', dealType: 'SALE', employeeCount: 35, sellerVerified: true, sellerTrustScore: 92, marketTrend: 'up', marketPosition: 'fair', daysOnMarket: 10, location_country: 'USA', sellerType: 'Family', sellerMotivation: 'Succession' },
  { id: 'deal-7', title: 'E-Learning Platform', location: 'Seattle', country: 'USA', image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=400&fit=crop', askingPrice: 3200000, askingPriceCurrency: 'USD', annualRevenue: 1100000, cashFlowMin: 220000, cashFlowMax: 380000, ebitda: 275000, profitMarginPercent: 25, dealQualityScore: 85, heatIndex: 81, roiProjection: 20.1, paybackPeriod: 38, growthRate: 48, status: 'NEW', category: 'EDTECH', dealType: 'SALE', employeeCount: 16, sellerVerified: true, sellerTrustScore: 89, marketTrend: 'up', marketPosition: 'fair', daysOnMarket: 6, location_country: 'USA', sellerType: 'Founder', sellerMotivation: 'Growth Capital' },
  { id: 'deal-8', title: 'Fintech Lending Platform', location: 'New York', country: 'USA', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=400&fit=crop', askingPrice: 7500000, askingPriceCurrency: 'USD', annualRevenue: 2800000, cashFlowMin: 600000, cashFlowMax: 850000, ebitda: 700000, profitMarginPercent: 25, dealQualityScore: 93, heatIndex: 95, roiProjection: 25.2, paybackPeriod: 26, growthRate: 78, status: 'FEATURED', category: 'FINTECH', dealType: 'SALE', employeeCount: 42, sellerVerified: true, sellerTrustScore: 96, marketTrend: 'up', marketPosition: 'underpriced', daysOnMarket: 2, location_country: 'USA', sellerType: 'PE', sellerMotivation: 'Portfolio Optimization', upcomingAuction: true },
  { id: 'deal-9', title: 'Cybersecurity Solutions', location: 'Austin', country: 'USA', image: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=500&h=400&fit=crop', askingPrice: 2800000, askingPriceCurrency: 'USD', annualRevenue: 950000, cashFlowMin: 180000, cashFlowMax: 280000, ebitda: 220000, profitMarginPercent: 23, dealQualityScore: 88, heatIndex: 86, roiProjection: 21.8, paybackPeriod: 34, growthRate: 52, status: 'STANDARD', category: 'CYBERSECURITY', dealType: 'SALE', employeeCount: 20, sellerVerified: true, sellerTrustScore: 91, marketTrend: 'up', marketPosition: 'fair', daysOnMarket: 9, location_country: 'USA', sellerType: 'Founder', sellerMotivation: 'Growth Capital' },
  { id: 'deal-10', title: 'Green Energy Solutions', location: 'Denver', country: 'USA', image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=500&h=400&fit=crop', askingPrice: 5500000, askingPriceCurrency: 'USD', annualRevenue: 1750000, cashFlowMin: 350000, cashFlowMax: 500000, ebitda: 438000, profitMarginPercent: 25, dealQualityScore: 86, heatIndex: 83, roiProjection: 22.1, paybackPeriod: 33, growthRate: 58, status: 'NEW', category: 'CLEANTECH', dealType: 'SALE', employeeCount: 28, sellerVerified: true, sellerTrustScore: 87, marketTrend: 'up', marketPosition: 'fair', daysOnMarket: 7, location_country: 'USA', sellerType: 'Corporate', sellerMotivation: 'Strategic Exit' },
]

// Duplicate for pagination demo
const EXTENDED_DEALS = [...DEALS, ...DEALS]

// Format category names: SAAS -> Saas, FINTECH -> Fintech, etc.
const formatCategoryName = (name: string) => {
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
}

const FILTER_SECTIONS = [
  { id: 'industry', label: 'Industry', icon: Building2 },
  { id: 'location', label: 'Location', icon: MapPin },
  { id: 'sellerType', label: 'Seller Type', icon: Users },
  { id: 'sellerMotivation', label: 'Seller Motivation', icon: Target },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.03 },
  },
}

export default function MarketplacePage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('premium')
  const [expandedFilters, setExpandedFilters] = useState<string[]>(['industry'])
  const [photoModalOpen, setPhotoModalOpen] = useState(false)
  const [selectedDealPhotos, setSelectedDealPhotos] = useState<string[]>([])

  const [valuation, setValuation] = useState({ min: 0.1, max: 100 })
  const [revenue, setRevenue] = useState({ min: 0.1, max: 500 })
  const [heatScore, setHeatScore] = useState({ min: 0, max: 100 })
  const [successProb, setSuccessProb] = useState({ min: 0, max: 100 })
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([])
  const [selectedLocations, setSelectedLocations] = useState<string[]>([])
  const [selectedSellerTypes, setSelectedSellerTypes] = useState<string[]>([])
  const [selectedMotivations, setSelectedMotivations] = useState<string[]>([])

  // Live deals from the database; falls back to the built-in sample set until
  // loaded or if the DB returns nothing.
  const [dbDeals, setDbDeals] = useState<Deal[] | null>(null)
  useEffect(() => {
    fetch('/api/deals')
      .then(r => r.json())
      .then(d => { if (Array.isArray(d.deals) && d.deals.length > 0) setDbDeals(d.deals) })
      .catch(() => {})
  }, [])
  const activeDeals = dbDeals && dbDeals.length > 0 ? dbDeals : EXTENDED_DEALS

  const industries = Array.from(new Set(activeDeals.map(d => d.category)))
  const locations = Array.from(new Set(activeDeals.map(d => d.location_country)))
  const sellerTypes = Array.from(new Set(activeDeals.map(d => d.sellerType)))
  const motivations = Array.from(new Set(activeDeals.map(d => d.sellerMotivation)))

  const filteredListings = useMemo(() => {
    let results = activeDeals.filter(deal => {
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

    const featured = results.filter(d => d.status === 'FEATURED')
    const nonFeatured = results.filter(d => d.status !== 'FEATURED')

    const sortResults = (arr: Deal[]) => {
      if (sortBy === 'newest') return arr.sort((a, b) => a.daysOnMarket - b.daysOnMarket)
      if (sortBy === 'oldest') return arr.sort((a, b) => b.daysOnMarket - a.daysOnMarket)
      if (sortBy === 'heat') return arr.sort((a, b) => b.heatIndex - a.heatIndex)
      if (sortBy === 'roi') return arr.sort((a, b) => b.roiProjection - a.roiProjection)
      if (sortBy === 'valuation') return arr.sort((a, b) => a.askingPrice - b.askingPrice)
      return arr.sort((a, b) => b.dealQualityScore - a.dealQualityScore)
    }

    if (sortBy === 'premium') {
      return [...sortResults(featured), ...sortResults(nonFeatured)]
    }
    return sortResults(results)
  }, [activeDeals, searchTerm, selectedIndustries, selectedLocations, selectedSellerTypes, selectedMotivations, valuation, revenue, heatScore, successProb, sortBy])

  const hotDeals = useMemo(() => [...activeDeals].sort((a, b) => b.heatIndex - a.heatIndex).slice(0, 4), [activeDeals])

  const CARDS_PER_PAGE = 20
  const totalPages = Math.ceil(filteredListings.length / CARDS_PER_PAGE)
  const startIdx = (currentPage - 1) * CARDS_PER_PAGE
  const currentListings = filteredListings.slice(startIdx, startIdx + CARDS_PER_PAGE)

  const activeFiltersCount = selectedIndustries.length + selectedLocations.length + selectedSellerTypes.length + selectedMotivations.length + (valuation.min !== 0.1 ? 1 : 0) + (valuation.max !== 100 ? 1 : 0)

  const toggleFilter = (id: string) => setExpandedFilters(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id])

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
      <PublicHeader />

      <section className="px-4 md:px-8 py-12 border-b" style={{ borderColor: COLOR_BORDER, background: '#EFF6FF' }}>
        <div className="max-w-7xl mx-auto">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-4" style={{ background: COLOR_ACCENT, color: 'white' }}>
            MARKETPLACE
          </span>
          <h1 className="text-4xl md:text-5xl font-black mb-2" style={{ color: COLOR_PRIMARY }}>Global Marketplace</h1>
          <p className="text-lg" style={{ color: COLOR_TEXT_SECONDARY }}>
            {filteredListings.length} verified businesses for sale across the UAE &amp; Canada
          </p>
        </div>
      </section>

      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="border-b" style={{ borderColor: COLOR_BORDER, background: 'white' }}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-2xl">🔥</span>
            <h2 className="text-2xl font-black" style={{ color: COLOR_PRIMARY }}>Trending Deals Right Now</h2>
            <span className="text-xs font-bold px-3 py-1 rounded-full text-white" style={{ background: COLOR_ACCENT }}>HOTTEST</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {hotDeals.map(deal => (
              <motion.div key={deal.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-xl border hover:shadow-md transition-shadow cursor-pointer bg-white" style={{ borderColor: COLOR_BORDER }}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-bold text-sm line-clamp-1" style={{ color: COLOR_PRIMARY }}>{deal.title}</h3>
                    <p className="text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>{deal.location}</p>
                  </div>
                  <div className="px-2 py-1 rounded text-xs font-bold text-white flex-shrink-0" style={{ background: '#DC2626' }}>{deal.heatIndex}🔥</div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span style={{ color: COLOR_TEXT_SECONDARY }}>${(deal.askingPrice / 1000000).toFixed(1)}M</span>
                  <span style={{ color: '#10B981', fontWeight: 'bold' }}>{deal.growthRate}% growth</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-1">
            <div className="sticky top-24 space-y-3">
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: COLOR_TEXT_SECONDARY }} />
                <input type="text" placeholder="Search businesses..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1) }} className="w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm bg-white focus:outline-none focus:ring-2" style={{ borderColor: COLOR_BORDER, outlineColor: COLOR_ACCENT }} />
              </div>

              <select value={sortBy} onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1) }} className="w-full px-3 py-2.5 rounded-lg border text-sm bg-white focus:outline-none focus:ring-2 font-semibold" style={{ borderColor: COLOR_BORDER, outlineColor: COLOR_ACCENT }}>
                <option value="premium">⭐ Premium First</option>
                <option value="newest">✨ Newest First</option>
                <option value="oldest">📅 Oldest First</option>
                <option value="heat">🔥 Hottest First</option>
                <option value="roi">💰 Highest ROI</option>
                <option value="valuation">💵 Lowest Price</option>
                <option value="relevant">Most Relevant</option>
              </select>

              <SaveSearchButton
                filters={{
                  industries: selectedIndustries,
                  country: selectedLocations[0],
                  minPrice: valuation.min !== 0.1 ? Math.round(valuation.min * 1_000_000 * 100) : undefined,
                  maxPrice: valuation.max !== 100 ? Math.round(valuation.max * 1_000_000 * 100) : undefined,
                  minHeatScore: heatScore.min !== 0 ? heatScore.min : undefined,
                }}
              />

              {activeFiltersCount > 0 && (
                <div className="p-3 rounded-xl border flex items-center justify-between" style={{ background: '#EFF6FF', borderColor: COLOR_BORDER }}>
                  <span className="text-xs font-semibold" style={{ color: COLOR_PRIMARY }}>{activeFiltersCount} active filters</span>
                  <button onClick={clearAllFilters} className="text-xs font-bold hover:opacity-70 transition-opacity" style={{ color: COLOR_ACCENT }}>Clear All</button>
                </div>
              )}

              {FILTER_SECTIONS.map(section => {
                const isExpanded = expandedFilters.includes(section.id)
                const Icon = section.icon
                const values = section.id === 'industry' ? industries : section.id === 'location' ? locations : section.id === 'sellerType' ? sellerTypes : motivations
                const selected = section.id === 'industry' ? selectedIndustries : section.id === 'location' ? selectedLocations : section.id === 'sellerType' ? selectedSellerTypes : selectedMotivations
                const setSelected = section.id === 'industry' ? setSelectedIndustries : section.id === 'location' ? setSelectedLocations : section.id === 'sellerType' ? setSelectedSellerTypes : setSelectedMotivations

                return (
                  <motion.div key={section.id} className="rounded-lg border overflow-hidden hover:shadow-sm transition-shadow bg-white" style={{ borderColor: COLOR_BORDER }}>
                    <button onClick={() => toggleFilter(section.id)} className="w-full px-3 py-3 flex items-center justify-between hover:opacity-80 transition-opacity">
                      <div className="flex items-center gap-2">
                        <Icon size={20} style={{ color: COLOR_ACCENT }} />
                        <span className="font-semibold text-sm" style={{ color: COLOR_PRIMARY }}>{section.label}</span>
                      </div>
                      <ChevronDown size={16} style={{ color: COLOR_PRIMARY, transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
                    </button>
                    {isExpanded && (
                      <div className="p-3 space-y-2 border-t max-h-64 overflow-y-auto" style={{ borderColor: COLOR_BORDER, background: COLOR_BG_PRIMARY }}>
                        {values.map(value => (
                          <label key={value} className="flex items-center gap-2.5 cursor-pointer hover:opacity-70 transition-opacity">
                            <input type="checkbox" checked={selected.includes(value)} onChange={() => { const newSelected = selected.includes(value) ? selected.filter(v => v !== value) : [...selected, value]; setSelected(newSelected); setCurrentPage(1) }} className="w-3.5 h-3.5 rounded cursor-pointer" />
                            <span className="text-sm" style={{ color: COLOR_PRIMARY }}>{formatCategoryName(value)}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )
              })}

              <div className="space-y-3 pt-1">
                {[
                  { label: 'Valuation', icon: DollarSign, min: valuation.min, max: valuation.max, setRange: setValuation, minMax: { min: 0.1, max: 100 }, suffix: 'M' },
                  { label: 'Annual Revenue', icon: TrendingUp, min: revenue.min, max: revenue.max, setRange: setRevenue, minMax: { min: 0.1, max: 500 }, suffix: 'K' },
                  { label: 'Deal Heat Score', icon: Zap, min: heatScore.min, max: heatScore.max, setRange: setHeatScore, minMax: { min: 0, max: 100 }, suffix: '°' },
                  { label: 'Success Probability', icon: CheckCircle2, min: successProb.min, max: successProb.max, setRange: setSuccessProb, minMax: { min: 0, max: 100 }, suffix: '%' },
                ].map((range, i) => {
                  const Icon = range.icon
                  return (
                    <motion.div key={i} className="rounded-lg border p-3 hover:shadow-sm transition-shadow bg-white" style={{ borderColor: COLOR_BORDER }}>
                      <div className="flex items-center gap-2 mb-3">
                        <Icon size={18} style={{ color: COLOR_ACCENT }} />
                        <span className="font-semibold text-sm" style={{ color: COLOR_PRIMARY }}>{range.label}</span>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <span className="text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>Min: {range.min}{range.suffix}</span>
                          <input type="range" min={range.minMax.min} max={range.minMax.max} step="0.1" value={range.min} onChange={(e) => range.setRange({ min: parseFloat(e.target.value), max: range.max })} className="w-full" />
                        </div>
                        <div>
                          <span className="text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>Max: {range.max}{range.suffix}</span>
                          <input type="range" min={range.minMax.min} max={range.minMax.max} step="0.1" value={range.max} onChange={(e) => range.setRange({ min: range.min, max: parseFloat(e.target.value) })} className="w-full" />
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </motion.div>

          <div className="lg:col-span-3">
            {currentListings.length > 0 ? (
              <>
                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {currentListings.map(deal => (
                    <motion.div key={deal.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                      <ListingCard
                        {...deal}
                        onSave={() => {}}
                        onViewPhotos={() => {
                          setSelectedDealPhotos([deal.image])
                          setPhotoModalOpen(true)
                        }}
                      />
                    </motion.div>
                  ))}
                </motion.div>

                {totalPages > 1 && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-center gap-2 py-8">
                    <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="p-2 rounded-lg border transition-all hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed" style={{ borderColor: COLOR_BORDER, color: COLOR_PRIMARY }}><ChevronLeft size={20} /></button>
                    {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                      let pageNum = currentPage <= 3 ? i + 1 : currentPage >= totalPages - 2 ? totalPages - 4 + i : currentPage - 2 + i
                      return (
                        <button key={pageNum} onClick={() => handlePageChange(pageNum)} className={`px-4 py-2 rounded-lg font-semibold transition-all ${currentPage === pageNum ? 'text-white' : 'border hover:bg-gray-50'}`} style={currentPage === pageNum ? { background: COLOR_ACCENT } : { borderColor: COLOR_BORDER, color: COLOR_PRIMARY }}>{pageNum}</button>
                      )
                    })}
                    <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 rounded-lg border transition-all hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed" style={{ borderColor: COLOR_BORDER, color: COLOR_PRIMARY }}><ChevronRight size={20} /></button>
                    <span className="ml-4 text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>Page {currentPage} of {totalPages}</span>
                  </motion.div>
                )}
              </>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
                <p className="text-lg" style={{ color: COLOR_TEXT_SECONDARY }}>No opportunities found. Try adjusting your filters.</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <BusinessPhotoGallery isOpen={photoModalOpen} onClose={() => setPhotoModalOpen(false)} photos={selectedDealPhotos} businessType="Business" />
    </div>
  )
}

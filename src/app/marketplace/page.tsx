'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Search, Flame, TrendingUp, ChevronRight, ChevronLeft,
  AlertCircle, Target, Brain, BarChart3, Users, Shield, Utensils,
  Sparkles, Stethoscope, Building2, Briefcase, Clock, LogOut,
  CheckCircle2, Eye
} from 'lucide-react'
import { PublicHeader } from '@/components/Navigation'
import AuthModal from '@/components/AuthModal'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER } from '@/styles/forward-colors'

// Sector-specific image map
const getSectorImage = (businessType: string, seed: number) => {
  const imageMap: Record<string, string[]> = {
    restaurant: [
      'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=500&h=400&fit=crop',
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=400&fit=crop',
      'https://images.unsplash.com/photo-1504674900949-f282474e126d?w=500&h=400&fit=crop',
      'https://images.unsplash.com/photo-1525521398926-a48bbd8a3d6f?w=500&h=400&fit=crop',
    ],
    spa: [
      'https://images.unsplash.com/photo-1544161515-81205f8aebb3?w=500&h=400&fit=crop',
      'https://images.unsplash.com/photo-1600334089393-b8ab0317c4b9?w=500&h=400&fit=crop',
      'https://images.unsplash.com/photo-1596178065887-8f180a90e1b6?w=500&h=400&fit=crop',
    ],
    dental: [
      'https://images.unsplash.com/photo-1631217314831-dc34b37c76d8?w=500&h=400&fit=crop',
      'https://images.unsplash.com/photo-1576091160550-2173fb9ce6e4?w=500&h=400&fit=crop',
    ],
    hospital: [
      'https://images.unsplash.com/photo-1587854692152-cbe660dbde0b?w=500&h=400&fit=crop',
      'https://images.unsplash.com/photo-1576091160550-2173fb9ce6e4?w=500&h=400&fit=crop',
    ],
    turnkey: [
      'https://images.unsplash.com/photo-1556740711-330d6b2be954?w=500&h=400&fit=crop',
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=400&fit=crop',
    ],
    ai: ['https://images.unsplash.com/photo-1677442d019cecf8fbf6c3d827b9c4d62c29db5e?w=500&h=400&fit=crop'],
    biotech: ['https://images.unsplash.com/photo-1576091160550-2173fb9ce6e4?w=500&h=400&fit=crop'],
  }
  const images = imageMap[businessType] || imageMap.turnkey
  return images[seed % images.length]
}

// Enhanced business data with trust signals
const businessesData = [
  { 
    id: 1, 
    name: 'Prime Cut Steakhouse', 
    businessType: 'restaurant',
    category: 'F&B', 
    subcategory: 'Fine Dining', 
    description: 'Award-winning steakhouse',
    heatScore: 92,
    valuation: '$8.5M',
    revenue: '$4.2M',
    ebitda: '$1.2M',
    foundedYear: 2004,
    team: 28,
    growth: '12%',
    seeking: 'none',
    ownerMotivation: 'retiring',
    image: getSectorImage('restaurant', 1),
    verified: true,
    buyerInterest: 34,
    trendingUp: true,
    successProbability: 87,
  },
  // Add more verified businesses...
].concat(Array.from({ length: 46 }, (_, i) => {
  const id = i + 2
  const types = ['restaurant', 'spa', 'dental', 'hospital', 'turnkey']
  const businessType = types[i % types.length]
  const baseVal = businessType === 'restaurant' ? 3500000 : 4200000
  const val = Math.floor(baseVal + (Math.random() - 0.5) * baseVal * 0.4)
  
  return {
    id,
    name: `Business ${id}`,
    businessType,
    category: 'Category',
    subcategory: 'Subcategory',
    description: `Professional ${businessType} business`,
    heatScore: 65 + Math.floor(Math.random() * 25),
    valuation: `$${(val / 1000000).toFixed(1)}M`,
    revenue: `$${(val * 0.35 / 1000000).toFixed(2)}M`,
    ebitda: `$${(val * 0.35 * 0.3 / 1000000).toFixed(2)}M`,
    foundedYear: 2005 + Math.floor(Math.random() * 18),
    team: 8 + Math.floor(Math.random() * 35),
    growth: `${4 + Math.floor(Math.random() * 20)}%`,
    seeking: ['none', 'investor', 'operating_partner'][Math.floor(Math.random() * 3)] as any,
    ownerMotivation: ['growth', 'retiring', 'portfolio_liquidation'][Math.floor(Math.random() * 3)] as any,
    image: getSectorImage(businessType, id),
    verified: Math.random() > 0.1,
    buyerInterest: Math.floor(Math.random() * 80),
    trendingUp: Math.random() > 0.4,
    successProbability: 70 + Math.floor(Math.random() * 20),
  }
}))

const ITEMS_PER_PAGE = 20

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [selectedBusiness, setSelectedBusiness] = useState<typeof businessesData[0] | null>(null)

  const filteredBusinesses = useMemo(() => {
    let filtered = businessesData
    if (selectedType !== 'all') {
      filtered = filtered.filter(b => b.businessType === selectedType)
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      filtered = filtered.filter(b => b.name.toLowerCase().includes(q))
    }
    filtered.sort((a, b) => b.heatScore - a.heatScore)
    return filtered
  }, [selectedType, searchQuery])

  const totalPages = Math.ceil(filteredBusinesses.length / ITEMS_PER_PAGE)
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedBusinesses = filteredBusinesses.slice(startIdx, startIdx + ITEMS_PER_PAGE)

  const trendingDeals = useMemo(() => 
    businessesData.filter(b => b.trendingUp).sort((a, b) => b.heatScore - a.heatScore).slice(0, 3),
    []
  )

  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)}
        businessName={selectedBusiness?.name}
        onSuccess={() => {
          if (selectedBusiness) {
            window.location.href = `/dashboard/deal-detail/${selectedBusiness.id}`
          }
        }}
      />

      <div style={{ paddingTop: '80px' }}>
        {/* Hero */}
        <section className="py-8 px-4 sm:px-6 lg:px-8 border-b" style={{ borderColor: COLOR_BORDER }}>
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-black mb-2" style={{ color: COLOR_PRIMARY }}>
              Enterprise Marketplace
            </h1>
            <p className="text-base" style={{ color: COLOR_TEXT_SECONDARY }}>
              {filteredBusinesses.length} verified opportunities • Restaurants, Healthcare, Wellness & More
            </p>
          </div>
        </section>

        {/* Trending Section */}
        <section className="py-6 px-4 sm:px-6 lg:px-8" style={{ background: COLOR_ACCENT + '08' }}>
          <div className="max-w-7xl mx-auto">
            <h3 className="font-black mb-4 text-sm" style={{ color: COLOR_PRIMARY }}>
              🔥 TRENDING NOW
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {trendingDeals.map((deal) => (
                <motion.button
                  key={deal.id}
                  onClick={() => {
                    setSelectedBusiness(deal)
                    setAuthModalOpen(true)
                  }}
                  className="text-left p-4 rounded-lg border hover:shadow-lg transition-all"
                  style={{ borderColor: COLOR_BORDER, background: 'white' }}
                  whileHover={{ y: -2 }}
                >
                  <p className="font-bold text-sm mb-1" style={{ color: COLOR_PRIMARY }}>{deal.name}</p>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs px-2 py-1 rounded" style={{ background: COLOR_ACCENT + '20', color: COLOR_ACCENT }}>
                      📈 +{Math.floor(Math.random() * 30)}% trending
                    </span>
                  </div>
                  <p className="text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>{deal.valuation} val • {deal.revenue} revenue</p>
                </motion.button>
              ))}
            </div>
          </div>
        </section>

        {/* Search */}
        <section className="py-6 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-7xl mx-auto space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5" size={18} style={{ color: COLOR_TEXT_SECONDARY }} />
              <input
                type="text"
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1) }}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm"
                style={{ borderColor: COLOR_BORDER }}
              />
            </div>

            <div className="flex gap-2 overflow-x-auto">
              {['all', 'restaurant', 'spa', 'dental', 'hospital'].map(type => (
                <button
                  key={type}
                  onClick={() => { setSelectedType(type); setCurrentPage(1) }}
                  className={`px-3 py-1.5 rounded-full font-semibold whitespace-nowrap text-xs ${
                    selectedType === type ? 'text-white' : 'bg-white border'
                  }`}
                  style={{
                    background: selectedType === type ? COLOR_ACCENT : 'white',
                    borderColor: selectedType === type ? COLOR_ACCENT : COLOR_BORDER,
                  }}
                >
                  {type === 'all' && '🔥 All'} {type === 'restaurant' && '🍽️ Restaurants'}
                  {type === 'spa' && '✨ Spa'} {type === 'dental' && '🦷 Dental'} {type === 'hospital' && '⚕️ Medical'}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Results Grid */}
        <section className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {paginatedBusinesses.map((business) => (
                <motion.div
                  key={business.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="rounded-xl border overflow-hidden hover:shadow-lg transition-all group cursor-pointer"
                  style={{ borderColor: COLOR_BORDER, background: 'white' }}
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden bg-gray-200">
                    <img
                      src={business.image}
                      alt={business.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    {business.verified && (
                      <div className="absolute top-3 left-3 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <CheckCircle2 size={12} />
                        Verified
                      </div>
                    )}
                    <div className="absolute top-3 right-3 bg-white rounded-full px-2.5 py-1 flex items-center gap-1">
                      <Flame size={14} style={{ color: COLOR_ACCENT }} />
                      <span className="text-xs font-bold" style={{ color: COLOR_ACCENT }}>
                        {business.heatScore}
                      </span>
                    </div>
                    {business.buyerInterest > 0 && (
                      <div className="absolute bottom-3 left-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                        <Eye size={12} />
                        {business.buyerInterest} people viewing
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="mb-3">
                      <h3 className="text-sm font-black mb-1" style={{ color: COLOR_PRIMARY }}>
                        {business.name}
                      </h3>
                      <p className="text-xs mb-2" style={{ color: COLOR_TEXT_SECONDARY }}>
                        {business.subcategory}
                      </p>
                    </div>

                    {/* Trust Badges */}
                    <div className="flex gap-1 mb-3 flex-wrap">
                      {business.verified && (
                        <span className="text-xs px-2 py-1 rounded" style={{ background: COLOR_PRIMARY + '10', color: COLOR_PRIMARY }}>
                          📊 Verified Financials
                        </span>
                      )}
                      <span className="text-xs px-2 py-1 rounded" style={{ background: COLOR_ACCENT + '20', color: COLOR_ACCENT }}>
                        {business.successProbability}% Success
                      </span>
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                      <div className="p-2 rounded bg-gray-50" style={{ borderLeft: `3px solid ${COLOR_ACCENT}` }}>
                        <p style={{ color: COLOR_TEXT_SECONDARY }}>Valuation</p>
                        <p className="font-bold" style={{ color: COLOR_PRIMARY }}>{business.valuation}</p>
                      </div>
                      <div className="p-2 rounded bg-gray-50" style={{ borderLeft: `3px solid ${COLOR_PRIMARY}` }}>
                        <p style={{ color: COLOR_TEXT_SECONDARY }}>Revenue</p>
                        <p className="font-bold" style={{ color: COLOR_PRIMARY }}>{business.revenue}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedBusiness(business)
                        setAuthModalOpen(true)
                      }}
                      className="w-full py-2 rounded font-bold text-xs text-white transition-all hover:opacity-90"
                      style={{ background: COLOR_ACCENT }}
                    >
                      View Intelligence
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-4">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border disabled:opacity-50"
                  style={{ borderColor: COLOR_BORDER }}
                >
                  <ChevronLeft size={18} />
                </button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = currentPage <= 3 ? i + 1 : currentPage - 2 + i
                    if (page > totalPages) return null
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-2.5 py-1.5 rounded text-xs font-bold transition-all`}
                        style={{
                          background: currentPage === page ? COLOR_ACCENT : 'transparent',
                          color: currentPage === page ? 'white' : COLOR_PRIMARY,
                          border: `1px solid ${COLOR_BORDER}`,
                        }}
                      >
                        {page}
                      </button>
                    )
                  })}
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
          </div>
        </section>

        {/* CTA */}
        <section className="py-8 px-4 sm:px-6 lg:px-8 border-t text-center" style={{ borderColor: COLOR_BORDER, background: COLOR_ACCENT + '10' }}>
          <div className="max-w-3xl mx-auto">
            <h3 className="text-xl font-bold mb-3" style={{ color: COLOR_PRIMARY }}>
              Ready to Unlock Deal Intelligence?
            </h3>
            <p className="text-sm mb-4" style={{ color: COLOR_TEXT_SECONDARY }}>
              See verified financials, market comparables, success predictions, and rollup opportunities
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}

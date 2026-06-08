'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Search, Filter, MapPin, DollarSign, TrendingUp, Heart, Zap } from 'lucide-react'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER, COLOR_SURFACE_SUCCESS } from '@/styles/forward-colors'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

const INDUSTRIES = ['SaaS / Software', 'E-commerce', 'Professional Services', 'Manufacturing', 'Healthcare', 'FinTech', 'Retail', 'Hospitality', 'Other']
const CITIES = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Other']
const SORTS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'revenue-low', label: 'Revenue: Low to High' },
  { value: 'revenue-high', label: 'Revenue: High to Low' },
  { value: 'viewed', label: 'Most Viewed' },
  { value: 'saved', label: 'Most Saved' },
]

interface Listing {
  id: string
  businessName: string
  industry: string
  city: string
  country: string
  revenue: number
  ebitda: number
  askingPrice: number
  employees: number
  yearsInOperation: number
  description: string
  viewsCount: number
  savesCount: number
  inquiriesCount: number
  createdAt: string
}

export default function ListingsPage() {
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState<Set<string>>(new Set())

  // Filters
  const [industry, setIndustry] = useState('')
  const [city, setCity] = useState('')
  const [minRevenue, setMinRevenue] = useState('')
  const [maxRevenue, setMaxRevenue] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [sort, setSort] = useState('newest')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (industry) params.append('industry', industry)
        if (city) params.append('location', city)
        if (minRevenue) params.append('minRevenue', minRevenue)
        if (maxRevenue) params.append('maxRevenue', maxRevenue)
        params.append('sort', sort)

        const response = await fetch(`/api/listings?${params}`)
        if (response.ok) {
          const data = await response.json()
          setListings(data)
        }
      } catch (error) {
        console.error('Error fetching listings:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchListings()
  }, [industry, city, minRevenue, maxRevenue, sort])

  const handleSave = (id: string) => {
    setSaved(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const formatCurrency = (value: number) => {
    return `AED ${(value / 1000000).toFixed(1)}M`
  }

  return (
    <motion.div
      className="min-h-screen px-6 py-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="max-w-7xl mx-auto mb-12">
        <h1 className="text-4xl font-black mb-3" style={{ color: COLOR_PRIMARY }}>
          Business Opportunities
        </h1>
        <p className="text-lg" style={{ color: COLOR_TEXT_SECONDARY }}>
          Discover verified UAE businesses ready for acquisition, investment, or partnership.
        </p>
      </motion.div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <motion.div
          variants={itemVariants}
          className={`lg:block ${showFilters ? 'block' : 'hidden'} p-6 rounded-lg border h-fit`}
          style={{ borderColor: COLOR_BORDER, background: 'white' }}
        >
          <h3 className="text-lg font-bold mb-6" style={{ color: COLOR_PRIMARY }}>
            Filters
          </h3>

          <div className="space-y-6">
            {/* Industry */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: COLOR_PRIMARY }}>
                Industry
              </label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border text-sm"
                style={{ borderColor: COLOR_BORDER }}
              >
                <option value="">All Industries</option>
                {INDUSTRIES.map(ind => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: COLOR_PRIMARY }}>
                City
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border text-sm"
                style={{ borderColor: COLOR_BORDER }}
              >
                <option value="">All Cities</option>
                {CITIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Revenue Range */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: COLOR_PRIMARY }}>
                Annual Revenue (AED)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={minRevenue}
                  onChange={(e) => setMinRevenue(e.target.value)}
                  placeholder="Min"
                  className="w-1/2 px-3 py-2 rounded-lg border text-sm"
                  style={{ borderColor: COLOR_BORDER }}
                />
                <input
                  type="number"
                  value={maxRevenue}
                  onChange={(e) => setMaxRevenue(e.target.value)}
                  placeholder="Max"
                  className="w-1/2 px-3 py-2 rounded-lg border text-sm"
                  style={{ borderColor: COLOR_BORDER }}
                />
              </div>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: COLOR_PRIMARY }}>
                Sort By
              </label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border text-sm"
                style={{ borderColor: COLOR_BORDER }}
              >
                {SORTS.map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>

            {/* Clear Button */}
            {(industry || city || minRevenue || maxRevenue) && (
              <button
                onClick={() => {
                  setIndustry('')
                  setCity('')
                  setMinRevenue('')
                  setMaxRevenue('')
                }}
                className="w-full py-2 rounded-lg font-semibold text-sm border"
                style={{ borderColor: COLOR_BORDER, color: COLOR_ACCENT }}
              >
                Clear Filters
              </button>
            )}
          </div>
        </motion.div>

        {/* Listings Grid */}
        <motion.div className="lg:col-span-3" variants={itemVariants}>
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden mb-6 w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 text-white"
            style={{ background: COLOR_ACCENT }}
          >
            <Filter className="w-5 h-5" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>

          {loading ? (
            <div className="text-center py-12">
              <p style={{ color: COLOR_TEXT_SECONDARY }}>Loading listings...</p>
            </div>
          ) : listings.length === 0 ? (
            <div className="text-center py-12">
              <p style={{ color: COLOR_TEXT_SECONDARY }} className="mb-4">
                No listings found matching your filters.
              </p>
              <button
                onClick={() => {
                  setIndustry('')
                  setCity('')
                  setMinRevenue('')
                  setMaxRevenue('')
                }}
                className="px-6 py-2 rounded-lg font-semibold text-white"
                style={{ background: COLOR_ACCENT }}
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6" variants={containerVariants}>
              {listings.map((listing, idx) => (
                <motion.div
                  key={listing.id}
                  className="p-6 rounded-lg border hover:shadow-lg transition-all cursor-pointer group"
                  style={{ borderColor: COLOR_BORDER, background: 'white' }}
                  variants={itemVariants}
                  whileHover={{ y: -4, scale: 1.01 }}
                >
                  <Link href={`/listings/${listing.id}`}>
                    <div>
                      {/* Header */}
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-black mb-2" style={{ color: COLOR_PRIMARY }}>
                            {listing.businessName}
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            <span
                              className="text-xs font-bold px-3 py-1 rounded-full text-white"
                              style={{ background: COLOR_ACCENT }}
                            >
                              {listing.industry}
                            </span>
                            <span
                              className="text-xs font-bold px-3 py-1 rounded-full"
                              style={{ background: '#FEE2CC', color: COLOR_PRIMARY }}
                            >
                              {listing.city}
                            </span>
                          </div>
                        </div>

                        {/* Save Button */}
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            handleSave(listing.id)
                          }}
                          className="p-2 rounded-lg hover:bg-gray-100 transition-all"
                        >
                          <Heart
                            className="w-6 h-6"
                            style={{ color: saved.has(listing.id) ? COLOR_ACCENT : COLOR_TEXT_SECONDARY }}
                            fill={saved.has(listing.id) ? COLOR_ACCENT : 'none'}
                          />
                        </button>
                      </div>

                      {/* Description */}
                      <p className="text-sm mb-4 line-clamp-2" style={{ color: COLOR_TEXT_SECONDARY }}>
                        {listing.description}
                      </p>

                      {/* Metrics */}
                      <div className="grid grid-cols-3 gap-4 mb-4 pb-4 border-b" style={{ borderColor: COLOR_BORDER }}>
                        <div>
                          <p className="text-xs font-semibold mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                            Revenue
                          </p>
                          <p className="font-bold" style={{ color: COLOR_PRIMARY }}>
                            {formatCurrency(listing.revenue)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                            EBITDA
                          </p>
                          <p className="font-bold" style={{ color: COLOR_PRIMARY }}>
                            {formatCurrency(listing.ebitda)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                            Asking Price
                          </p>
                          <p className="font-bold" style={{ color: COLOR_ACCENT }}>
                            {formatCurrency(listing.askingPrice)}
                          </p>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex justify-between items-center">
                        <div className="flex gap-4 text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>
                          <span>👥 {listing.employees} employees</span>
                          <span>📅 {listing.yearsInOperation} years</span>
                        </div>
                        <motion.button
                          className="px-4 py-2 rounded-lg font-bold text-white text-sm"
                          style={{ background: COLOR_ACCENT }}
                          whileHover={{ scale: 1.05 }}
                          onClick={(e) => e.preventDefault()}
                        >
                          View
                        </motion.button>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}

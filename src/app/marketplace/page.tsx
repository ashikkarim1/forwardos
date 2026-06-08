'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Search, Flame, TrendingUp, Filter, ChevronRight, ChevronLeft,
  AlertCircle, Target, Brain, BarChart3, Users, Shield, Utensils,
  Sparkles, Stethoscope, Building2, Briefcase, Clock, LogOut, Plus
} from 'lucide-react'
import { PublicHeader } from '@/components/Navigation'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER } from '@/styles/forward-colors'

// Sector-specific image map
const getSectorImage = (businessType: string, seed: number) => {
  const imageMap: Record<string, string[]> = {
    restaurant: [
      'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=500&h=400&fit=crop',
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=400&fit=crop',
      'https://images.unsplash.com/photo-1504674900949-f282474e126d?w=500&h=400&fit=crop',
      'https://images.unsplash.com/photo-1525521398926-a48bbd8a3d6f?w=500&h=400&fit=crop',
      'https://images.unsplash.com/photo-1517248135467-4d71bcdd2d59?w=500&h=400&fit=crop',
    ],
    spa: [
      'https://images.unsplash.com/photo-1544161515-81205f8aebb3?w=500&h=400&fit=crop',
      'https://images.unsplash.com/photo-1600334089393-b8ab0317c4b9?w=500&h=400&fit=crop',
      'https://images.unsplash.com/photo-1596178065887-8f180a90e1b6?w=500&h=400&fit=crop',
      'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=500&h=400&fit=crop',
    ],
    dental: [
      'https://images.unsplash.com/photo-1631217314831-dc34b37c76d8?w=500&h=400&fit=crop',
      'https://images.unsplash.com/photo-1576091160550-2173fb9ce6e4?w=500&h=400&fit=crop',
      'https://images.unsplash.com/photo-1576161787924-f5200ac4baa7?w=500&h=400&fit=crop',
    ],
    hospital: [
      'https://images.unsplash.com/photo-1587854692152-cbe660dbde0b?w=500&h=400&fit=crop',
      'https://images.unsplash.com/photo-1576091160550-2173fb9ce6e4?w=500&h=400&fit=crop',
      'https://images.unsplash.com/photo-1631217314831-dc34b37c76d8?w=500&h=400&fit=crop',
    ],
    turnkey: [
      'https://images.unsplash.com/photo-1556740711-330d6b2be954?w=500&h=400&fit=crop',
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=400&fit=crop',
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=400&fit=crop',
    ],
    ai: [
      'https://images.unsplash.com/photo-1677442d019cecf8fbf6c3d827b9c4d62c29db5e?w=500&h=400&fit=crop',
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&h=400&fit=crop',
    ],
    biotech: [
      'https://images.unsplash.com/photo-1576091160550-2173fb9ce6e4?w=500&h=400&fit=crop',
      'https://images.unsplash.com/photo-1576091160550-2173fb9ce6e4?w=500&h=400&fit=crop',
    ],
  }
  const images = imageMap[businessType] || imageMap.turnkey
  return images[seed % images.length]
}

// Enhanced business data with diverse types
const businessesData = [
  // Featured healthy businesses
  { 
    id: 1, 
    name: 'Prime Cut Steakhouse', 
    businessType: 'restaurant',
    category: 'F&B', 
    subcategory: 'Fine Dining Steakhouse', 
    description: 'Award-winning steakhouse with 20yr track record, $4.2M annual revenue',
    heatScore: 92,
    valuation: '$8.5M',
    revenue: '$4.2M',
    ebitda: '$1.2M',
    netIncome: '$850K',
    foundedYear: 2004,
    team: 28,
    growth: '12%',
    seeking: 'none',
    ownerMotivation: 'retiring',
    image: getSectorImage('restaurant', 1),
    comparables: [
      { year: 2024, price: '$8.2M', description: 'Similar steakhouse, 3.5M revenue' },
      { year: 2024, price: '$9.1M', description: 'Fine dining, $4.5M revenue' },
    ],
    canRollUpWith: [2, 3],
  },
  {
    id: 2,
    name: 'Blissful Wellness Spa',
    businessType: 'spa',
    category: 'Wellness',
    subcategory: 'Full-Service Spa',
    description: '8,000 sq ft luxury spa, recurring client base, $2.8M ARR',
    heatScore: 88,
    valuation: '$5.2M',
    revenue: '$2.8M',
    ebitda: '$820K',
    netIncome: '$580K',
    foundedYear: 2008,
    team: 22,
    growth: '8%',
    seeking: 'operating_partner',
    ownerMotivation: 'growth',
    image: getSectorImage('spa', 2),
    comparables: [
      { year: 2024, price: '$5.0M', description: 'Similar spa, $2.6M revenue' },
      { year: 2024, price: '$6.1M', description: 'Wellness center, $3.2M revenue' },
    ],
    canRollUpWith: [1, 3, 4],
  },
  {
    id: 3,
    name: 'Radiant Smiles Dental Group',
    businessType: 'dental',
    category: 'Healthcare',
    subcategory: 'Multi-Location Dental',
    description: '4 dental practices across metro area, $6.5M collective revenue',
    heatScore: 95,
    valuation: '$18.5M',
    revenue: '$6.5M',
    ebitda: '$2.1M',
    netIncome: '$1.5M',
    foundedYear: 2006,
    team: 45,
    growth: '15%',
    seeking: 'investor',
    ownerMotivation: 'portfolio_liquidation',
    image: getSectorImage('dental', 3),
    comparables: [
      { year: 2024, price: '$17.8M', description: 'Dental DSO, $6.2M revenue' },
      { year: 2024, price: '$19.2M', description: 'Multi-practice dental, $6.8M revenue' },
    ],
    canRollUpWith: [4, 5],
  },
  {
    id: 4,
    name: 'CareFirst Medical Clinic',
    businessType: 'hospital',
    category: 'Healthcare',
    subcategory: 'Urgent Care Network',
    description: '6 urgent care centers, $12.3M annual revenue, high margins',
    heatScore: 94,
    valuation: '$32.1M',
    revenue: '$12.3M',
    ebitda: '$4.2M',
    netIncome: '$3.1M',
    foundedYear: 2010,
    team: 120,
    growth: '18%',
    seeking: 'investor',
    ownerMotivation: 'retiring',
    image: getSectorImage('hospital', 4),
    comparables: [
      { year: 2024, price: '$31.5M', description: 'Urgent care network, $11.8M revenue' },
      { year: 2024, price: '$33.2M', description: 'Medical clinic group, $12.8M revenue' },
    ],
    canRollUpWith: [3, 5],
  },
  {
    id: 5,
    name: 'PhysioPro Rehab Centers',
    businessType: 'hospital',
    category: 'Healthcare',
    subcategory: 'Physical Therapy',
    description: '8 PT/rehab locations, $4.8M revenue, 45% EBITDA margins',
    heatScore: 89,
    valuation: '$12.5M',
    revenue: '$4.8M',
    ebitda: '$2.16M',
    netIncome: '$1.58M',
    foundedYear: 2012,
    team: 52,
    growth: '11%',
    seeking: 'operating_partner',
    ownerMotivation: 'growth',
    image: getSectorImage('hospital', 5),
    comparables: [
      { year: 2024, price: '$12.1M', description: 'PT network, $4.6M revenue' },
      { year: 2024, price: '$13.2M', description: 'Rehab centers, $5.2M revenue' },
    ],
    canRollUpWith: [3, 4, 6],
  },
  {
    id: 6,
    name: 'NeuralFlow AI',
    businessType: 'ai',
    category: 'AI/ML',
    subcategory: 'Enterprise AI',
    description: 'Enterprise AI workflow automation, $18.5M ARR, 180% growth',
    heatScore: 98,
    valuation: '$120M',
    revenue: '$18.5M',
    ebitda: '$4.2M',
    netIncome: '$2.1M',
    foundedYear: 2020,
    team: 42,
    growth: '180%',
    seeking: 'investor',
    ownerMotivation: 'growth',
    image: getSectorImage('ai', 6),
    comparables: [
      { year: 2024, price: '$150M', description: 'AI automation, 8yr, $20M ARR' },
      { year: 2024, price: '$95M', description: 'ML ops, 6yr, $12M ARR' },
    ],
    canRollUpWith: [7, 8],
  },
  {
    id: 7,
    name: 'PeptideLife Therapeutics',
    businessType: 'biotech',
    category: 'Biotech',
    subcategory: 'Therapeutics',
    description: 'GLP-1 development, FDA stage, pre-revenue but high potential',
    heatScore: 95,
    valuation: '$85M',
    revenue: '$0',
    ebitda: '-$2.1M',
    netIncome: '-$2.5M',
    foundedYear: 2021,
    team: 28,
    growth: 'N/A',
    seeking: 'investor',
    ownerMotivation: 'growth',
    image: getSectorImage('biotech', 7),
    comparables: [
      { year: 2024, price: '$120M', description: 'Peptide therapeutics, FDA Stage' },
      { year: 2024, price: '$80M', description: 'GLP-1 developer, preclinical' },
    ],
    canRollUpWith: [8],
  },
  {
    id: 8,
    name: 'DeepGenomics+',
    businessType: 'biotech',
    category: 'Biotech',
    subcategory: 'Genomics',
    description: 'AI genomic analysis for rare diseases, $8.2M ARR, 175% growth',
    heatScore: 91,
    valuation: '$105M',
    revenue: '$8.2M',
    ebitda: '$1.8M',
    netIncome: '$1.2M',
    foundedYear: 2018,
    team: 45,
    growth: '175%',
    seeking: 'investor',
    ownerMotivation: 'growth',
    image: getSectorImage('biotech', 8),
    comparables: [
      { year: 2024, price: '$180M', description: 'Genomic AI, 6yr' },
      { year: 2024, price: '$140M', description: 'AI diagnostics, 6yr' },
    ],
    canRollUpWith: [6, 7],
  },
  // Turnkey businesses
  {
    id: 9,
    name: 'Express Laundry Franchise Pack',
    businessType: 'turnkey',
    category: 'Service',
    subcategory: 'Laundry',
    description: '3-location laundry business, turnkey operations, $1.8M annual revenue',
    heatScore: 72,
    valuation: '$2.4M',
    revenue: '$1.8M',
    ebitda: '$540K',
    netIncome: '$380K',
    foundedYear: 2015,
    team: 12,
    growth: '6%',
    seeking: 'buyer',
    ownerMotivation: 'retiring',
    image: getSectorImage('turnkey', 9),
    comparables: [
      { year: 2024, price: '$2.3M', description: 'Similar laundry, $1.7M revenue' },
      { year: 2024, price: '$2.6M', description: 'Multi-location laundry, $2.0M revenue' },
    ],
    canRollUpWith: [10],
  },
  {
    id: 10,
    name: 'QuickFix Auto Maintenance',
    businessType: 'turnkey',
    category: 'Service',
    subcategory: 'Auto Service',
    description: '5 auto service centers, recurring revenue model, $3.2M annual',
    heatScore: 78,
    valuation: '$4.5M',
    revenue: '$3.2M',
    ebitda: '$960K',
    netIncome: '$680K',
    foundedYear: 2013,
    team: 32,
    growth: '9%',
    seeking: 'operating_partner',
    ownerMotivation: 'portfolio_liquidation',
    image: getSectorImage('turnkey', 10),
    comparables: [
      { year: 2024, price: '$4.3M', description: 'Auto service, $3.0M revenue' },
      { year: 2024, price: '$4.8M', description: 'Multi-location auto, $3.4M revenue' },
    ],
    canRollUpWith: [9],
  },
  // More restaurants
  {
    id: 11,
    name: 'Pasta Paradise',
    businessType: 'restaurant',
    category: 'F&B',
    subcategory: 'Italian Restaurant',
    description: 'Family-owned Italian restaurant, 35yr history, $2.4M revenue',
    heatScore: 75,
    valuation: '$3.8M',
    revenue: '$2.4M',
    ebitda: '$480K',
    netIncome: '$320K',
    foundedYear: 1989,
    team: 18,
    growth: '4%',
    seeking: 'buyer',
    ownerMotivation: 'retiring',
    image: getSectorImage('restaurant', 11),
    comparables: [
      { year: 2024, price: '$3.6M', description: 'Italian restaurant, $2.2M revenue' },
      { year: 2024, price: '$4.0M', description: 'Fine dining Italian, $2.6M revenue' },
    ],
    canRollUpWith: [1, 12],
  },
  {
    id: 12,
    name: 'Urban Taco Company',
    businessType: 'restaurant',
    category: 'F&B',
    subcategory: 'Fast Casual',
    description: '3-location taco concept, $1.9M revenue, strong growth trajectory',
    heatScore: 84,
    valuation: '$3.2M',
    revenue: '$1.9M',
    ebitda: '$570K',
    netIncome: '$400K',
    foundedYear: 2018,
    team: 24,
    growth: '22%',
    seeking: 'investor',
    ownerMotivation: 'growth',
    image: getSectorImage('restaurant', 12),
    comparables: [
      { year: 2024, price: '$3.0M', description: 'Fast casual, $1.8M revenue' },
      { year: 2024, price: '$3.5M', description: 'Multi-location taco, $2.1M revenue' },
    ],
    canRollUpWith: [1, 11],
  },
];

// Add generated businesses for variety
const generatedBusinesses = Array.from({ length: 35 }, (_, i) => {
  const id = i + 13
  const types = [
    { type: 'restaurant', names: ['Grill House', 'Café Corner', 'Burger Junction', 'Sushi Palace', 'Bakery Fresh'] },
    { type: 'spa', names: ['Zen Wellness', 'Serenity Spa', 'Healing Touch', 'Retreat Wellness'] },
    { type: 'turnkey', names: ['Cleaning Pro', 'Pet Care Plus', 'Tutoring Hub', 'Fitness Center'] },
  ]
  
  const typeObj = types[i % types.length]
  const businessType = typeObj.type
  const baseNames = typeObj.names
  const name = baseNames[i % baseNames.length] + ' #' + (Math.floor(i / types.length) + 1)
  
  const baseValuation = businessType === 'restaurant' ? 3500000 : businessType === 'spa' ? 4200000 : 2800000
  const valuation = Math.floor(baseValuation + (Math.random() - 0.5) * baseValuation * 0.4)
  const revenue = Math.floor(valuation * 0.35)
  const ebitda = Math.floor(revenue * (0.2 + Math.random() * 0.15))
  const netIncome = Math.floor(ebitda * 0.7)
  
  return {
    id,
    name,
    businessType,
    category: businessType === 'restaurant' ? 'F&B' : businessType === 'spa' ? 'Wellness' : 'Service',
    subcategory: `${businessType.charAt(0).toUpperCase() + businessType.slice(1)} Operation`,
    description: `Established ${businessType} with steady revenue stream, $${(revenue / 1000000).toFixed(1)}M annual`,
    heatScore: 65 + Math.floor(Math.random() * 25),
    valuation: `$${(valuation / 1000000).toFixed(1)}M`,
    revenue: `$${(revenue / 1000000).toFixed(2)}M`,
    ebitda: `$${(ebitda / 1000000).toFixed(2)}M`,
    netIncome: `$${(netIncome / 1000000).toFixed(2)}M`,
    foundedYear: 2005 + Math.floor(Math.random() * 18),
    team: 8 + Math.floor(Math.random() * 35),
    growth: `${4 + Math.floor(Math.random() * 20)}%`,
    seeking: ['none', 'investor', 'operating_partner', 'buyer'][Math.floor(Math.random() * 4)] as any,
    ownerMotivation: ['growth', 'retiring', 'portfolio_liquidation', 'none'][Math.floor(Math.random() * 4)] as any,
    image: getSectorImage(businessType, id),
    comparables: [
      { year: 2024, price: `$${(valuation * 0.95 / 1000000).toFixed(1)}M`, description: `Similar ${businessType}` },
      { year: 2024, price: `$${(valuation * 1.05 / 1000000).toFixed(1)}M`, description: `Comparable business` },
    ],
    canRollUpWith: [],
  }
})

const businessesData_full = [...businessesData, ...generatedBusinesses]

const businessTypes = [
  { id: 'all', label: '🔥 All Opportunities', icon: Flame },
  { id: 'restaurant', label: '🍽️ Restaurants', icon: Utensils },
  { id: 'spa', label: '✨ Spa & Wellness', icon: Sparkles },
  { id: 'dental', label: '🦷 Dental', icon: Target },
  { id: 'hospital', label: '⚕️ Medical', icon: Stethoscope },
  { id: 'turnkey', label: '📦 Turnkey', icon: Briefcase },
  { id: 'ai', label: '🤖 Tech', icon: Brain },
  { id: 'biotech', label: '🧬 Biotech', icon: Target },
]

const seekingFilters = [
  { id: 'all_seeking', label: 'All Status', icon: Flame },
  { id: 'cofounder', label: '👥 Seeking Partner', icon: Users },
  { id: 'investor', label: '💰 Seeking Investor', icon: BarChart3 },
  { id: 'buyer', label: '🏪 Ready to Sell', icon: Building2 },
]

const motivationFilters = [
  { id: 'all_motivation', label: 'All Owners', icon: Flame },
  { id: 'retiring', label: '🕐 Retiring', icon: Clock },
  { id: 'portfolio_liquidation', label: '💼 Liquidating', icon: LogOut },
  { id: 'growth', label: '📈 Growth Mode', icon: TrendingUp },
]

const ITEMS_PER_PAGE = 12

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedSeeking, setSelectedSeeking] = useState('all_seeking')
  const [selectedMotivation, setSelectedMotivation] = useState('all_motivation')
  const [sortBy, setSortBy] = useState<'heat' | 'valuation' | 'revenue'>('heat')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedBusiness, setSelectedBusiness] = useState<typeof businessesData_full[0] | null>(null)

  const filteredBusinesses = useMemo(() => {
    let filtered = businessesData_full

    if (selectedType !== 'all') {
      filtered = filtered.filter(b => b.businessType === selectedType)
    }

    if (selectedSeeking !== 'all_seeking') {
      filtered = filtered.filter(b => {
        if (selectedSeeking === 'cofounder') return b.seeking === 'operating_partner'
        if (selectedSeeking === 'investor') return b.seeking === 'investor'
        if (selectedSeeking === 'buyer') return b.seeking === 'buyer'
        return true
      })
    }

    if (selectedMotivation !== 'all_motivation') {
      filtered = filtered.filter(b => {
        if (selectedMotivation === 'retiring') return b.ownerMotivation === 'retiring'
        if (selectedMotivation === 'portfolio_liquidation') return b.ownerMotivation === 'portfolio_liquidation'
        if (selectedMotivation === 'growth') return b.ownerMotivation === 'growth'
        return true
      })
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
        const aVal = parseFloat((a.valuation as string).replace(/\D/g, ''))
        const bVal = parseFloat((b.valuation as string).replace(/\D/g, ''))
        return bVal - aVal
      }
      if (sortBy === 'revenue') {
        const aRev = typeof a.revenue === 'string' ? parseFloat(a.revenue.replace(/\D/g, '')) : 0
        const bRev = typeof b.revenue === 'string' ? parseFloat(b.revenue.replace(/\D/g, '')) : 0
        return bRev - aRev
      }
      return 0
    })

    return filtered
  }, [selectedType, selectedSeeking, selectedMotivation, searchQuery, sortBy])

  const totalPages = Math.ceil(filteredBusinesses.length / ITEMS_PER_PAGE)
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedBusinesses = filteredBusinesses.slice(startIdx, startIdx + ITEMS_PER_PAGE)

  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />

      <div style={{ paddingTop: '80px' }}>
        {/* Hero */}
        <section className="py-8 px-4 sm:px-6 lg:px-8 border-b" style={{ borderColor: COLOR_BORDER }}>
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-black mb-2" style={{ color: COLOR_PRIMARY }}>
              Enterprise Marketplace
            </h1>
            <p className="text-base" style={{ color: COLOR_TEXT_SECONDARY }}>
              {filteredBusinesses.length} opportunities • Restaurants, Healthcare, Wellness, Tech & More
            </p>
          </div>
        </section>

        {/* Search & Core Filters */}
        <section className="py-6 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-7xl mx-auto space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5" size={18} style={{ color: COLOR_TEXT_SECONDARY }} />
              <input
                type="text"
                placeholder="Search by name, industry..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1) }}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm"
                style={{ borderColor: COLOR_BORDER }}
              />
            </div>

            {/* Business Type Filter */}
            <div>
              <p className="text-xs font-bold mb-2" style={{ color: COLOR_TEXT_SECONDARY }}>BUSINESS TYPE</p>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {businessTypes.map(type => (
                  <button
                    key={type.id}
                    onClick={() => { setSelectedType(type.id); setCurrentPage(1) }}
                    className={`px-3 py-1.5 rounded-full font-semibold whitespace-nowrap text-xs transition-all ${
                      selectedType === type.id ? 'text-white' : 'bg-white border'
                    }`}
                    style={{
                      background: selectedType === type.id ? COLOR_ACCENT : 'white',
                      color: selectedType === type.id ? 'white' : COLOR_PRIMARY,
                      borderColor: selectedType === type.id ? COLOR_ACCENT : COLOR_BORDER,
                    }}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Seeking Filter */}
            <div>
              <p className="text-xs font-bold mb-2" style={{ color: COLOR_TEXT_SECONDARY }}>OWNER SEEKING</p>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {seekingFilters.map(filter => (
                  <button
                    key={filter.id}
                    onClick={() => { setSelectedSeeking(filter.id); setCurrentPage(1) }}
                    className={`px-3 py-1.5 rounded-full font-semibold whitespace-nowrap text-xs transition-all ${
                      selectedSeeking === filter.id ? 'text-white' : 'bg-white border'
                    }`}
                    style={{
                      background: selectedSeeking === filter.id ? COLOR_ACCENT : 'white',
                      color: selectedSeeking === filter.id ? 'white' : COLOR_PRIMARY,
                      borderColor: selectedSeeking === filter.id ? COLOR_ACCENT : COLOR_BORDER,
                    }}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Motivation Filter */}
            <div>
              <p className="text-xs font-bold mb-2" style={{ color: COLOR_TEXT_SECONDARY }}>OWNER MOTIVATION</p>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {motivationFilters.map(filter => (
                  <button
                    key={filter.id}
                    onClick={() => { setSelectedMotivation(filter.id); setCurrentPage(1) }}
                    className={`px-3 py-1.5 rounded-full font-semibold whitespace-nowrap text-xs transition-all ${
                      selectedMotivation === filter.id ? 'text-white' : 'bg-white border'
                    }`}
                    style={{
                      background: selectedMotivation === filter.id ? COLOR_ACCENT : 'white',
                      color: selectedMotivation === filter.id ? 'white' : COLOR_PRIMARY,
                      borderColor: selectedMotivation === filter.id ? COLOR_ACCENT : COLOR_BORDER,
                    }}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
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
                <option value="revenue">📊 Revenue</option>
              </select>
            </div>
          </div>
        </section>

        {/* Results Grid - 3 columns max */}
        <section className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {filteredBusinesses.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle size={40} style={{ color: COLOR_TEXT_SECONDARY }} className="mx-auto mb-3 opacity-50" />
                <p style={{ color: COLOR_TEXT_SECONDARY }}>No businesses match your filters</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {paginatedBusinesses.map((business) => (
                    <motion.div
                      key={business.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="rounded-xl border overflow-hidden hover:shadow-lg transition-all group cursor-pointer"
                      style={{ borderColor: COLOR_BORDER, background: 'white' }}
                      onClick={() => setSelectedBusiness(business)}
                    >
                      {/* Image */}
                      <div className="relative h-48 overflow-hidden bg-gray-200">
                        <img
                          src={business.image}
                          alt={business.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          onError={(e) => {
                            e.currentTarget.src = getSectorImage(business.businessType, business.id)
                          }}
                        />
                        <div className="absolute top-3 right-3 flex gap-2">
                          <div className="bg-white rounded-full px-2.5 py-1 flex items-center gap-1">
                            <Flame size={14} style={{ color: COLOR_ACCENT }} />
                            <span className="text-xs font-bold" style={{ color: COLOR_ACCENT }}>
                              {business.heatScore}
                            </span>
                          </div>
                        </div>
                        {business.ownerMotivation === 'retiring' && (
                          <div className="absolute top-3 left-3 bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs font-bold">
                            Owner Retiring
                          </div>
                        )}
                        {business.seeking !== 'none' && (
                          <div className="absolute bottom-3 left-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-xs font-bold">
                            {business.seeking === 'operating_partner' && '👥 Seeking Operating Partner'}
                            {business.seeking === 'investor' && '💰 Seeking Investor'}
                            {business.seeking === 'buyer' && '🏪 Ready to Sell'}
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <div className="mb-3">
                          <h3 className="text-sm font-black mb-1 line-clamp-2" style={{ color: COLOR_PRIMARY }}>
                            {business.name}
                          </h3>
                          <p className="text-xs mb-2" style={{ color: COLOR_TEXT_SECONDARY }}>
                            {business.subcategory}
                          </p>
                          <p className="text-xs mb-3 line-clamp-2" style={{ color: COLOR_TEXT_SECONDARY }}>
                            {business.description}
                          </p>
                        </div>

                        {/* Key Metrics - Data Intensive */}
                        <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                          <div className="p-2 rounded bg-gray-50" style={{ borderLeft: `3px solid ${COLOR_ACCENT}` }}>
                            <p style={{ color: COLOR_TEXT_SECONDARY }}>Valuation</p>
                            <p className="font-bold" style={{ color: COLOR_PRIMARY }}>{business.valuation}</p>
                          </div>
                          <div className="p-2 rounded bg-gray-50" style={{ borderLeft: `3px solid ${COLOR_PRIMARY}` }}>
                            <p style={{ color: COLOR_TEXT_SECONDARY }}>Revenue</p>
                            <p className="font-bold" style={{ color: COLOR_PRIMARY }}>
                              {typeof business.revenue === 'string' ? business.revenue : `$${business.revenue}M`}
                            </p>
                          </div>
                          <div className="p-2 rounded bg-gray-50" style={{ borderLeft: `3px solid #10b981` }}>
                            <p style={{ color: COLOR_TEXT_SECONDARY }}>EBITDA</p>
                            <p className="font-bold text-green-600">
                              {typeof business.ebitda === 'string' ? business.ebitda : `$${business.ebitda}M`}
                            </p>
                          </div>
                          <div className="p-2 rounded bg-gray-50" style={{ borderLeft: `3px solid #3b82f6` }}>
                            <p style={{ color: COLOR_TEXT_SECONDARY }}>Growth</p>
                            <p className="font-bold text-blue-600">{business.growth}</p>
                          </div>
                        </div>

                        <Link
                          href={`/dashboard/deal-detail/${business.id}`}
                          className="block w-full py-2 rounded font-bold text-xs text-white text-center transition-all hover:opacity-90"
                          style={{ background: COLOR_ACCENT }}
                        >
                          View Full Intelligence
                        </Link>
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
                            className={`px-2.5 py-1.5 rounded text-xs font-bold transition-all ${
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

                <p className="text-center text-xs mt-6" style={{ color: COLOR_TEXT_SECONDARY }}>
                  Page {currentPage} of {totalPages} • Showing {paginatedBusinesses.length} of {filteredBusinesses.length}
                </p>
              </>
            )}
          </div>
        </section>

        {/* Rollup Analytics Modal */}
        {selectedBusiness && (
          <RollupAnalyticsModal business={selectedBusiness} onClose={() => setSelectedBusiness(null)} allBusinesses={businessesData_full} />
        )}

        {/* CTA */}
        <section className="py-8 px-4 sm:px-6 lg:px-8 border-t text-center" style={{ borderColor: COLOR_BORDER, background: COLOR_ACCENT + '10' }}>
          <div className="max-w-3xl mx-auto">
            <h3 className="text-xl font-bold mb-3" style={{ color: COLOR_PRIMARY }}>
              Ready to Build Your Portfolio?
            </h3>
            <p className="text-sm mb-4" style={{ color: COLOR_TEXT_SECONDARY }}>
              Create an account to access rollup analytics, comparable valuations, and connect with business owners
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

function RollupAnalyticsModal({ business, onClose, allBusinesses }: any) {
  const rollupCandidates = business.canRollUpWith?.map((id: number) => allBusinesses.find((b: any) => b.id === id)).filter(Boolean) || []
  const combinedRevenue = (parseFloat((business.revenue as string).replace(/\D/g, '')) || 0) + 
    rollupCandidates.reduce((sum: number, b: any) => sum + (parseFloat((b.revenue as string).replace(/\D/g, '')) || 0), 0)
  const combinedEBITDA = (parseFloat((business.ebitda as string).replace(/\D/g, '')) || 0) + 
    rollupCandidates.reduce((sum: number, b: any) => sum + (parseFloat((b.ebitda as string).replace(/\D/g, '')) || 0), 0)
  const synergy = Math.floor(combinedEBITDA * 0.15)

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-96 overflow-y-auto"
      >
        <div className="p-6 border-b" style={{ borderColor: COLOR_BORDER }}>
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-black" style={{ color: COLOR_PRIMARY }}>{business.name}</h2>
              <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-sm mt-1">Rollup Opportunity Analysis</p>
            </div>
            <button onClick={onClose} className="text-2xl">×</button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="font-bold mb-3" style={{ color: COLOR_PRIMARY }}>Primary Business</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span style={{ color: COLOR_TEXT_SECONDARY }}>Valuation:</span> <span className="font-bold" style={{ color: COLOR_PRIMARY }}>{business.valuation}</span></div>
              <div><span style={{ color: COLOR_TEXT_SECONDARY }}>Revenue:</span> <span className="font-bold" style={{ color: COLOR_PRIMARY }}>{business.revenue}</span></div>
              <div><span style={{ color: COLOR_TEXT_SECONDARY }}>EBITDA:</span> <span className="font-bold text-green-600">{business.ebitda}</span></div>
              <div><span style={{ color: COLOR_TEXT_SECONDARY }}>Margin:</span> <span className="font-bold text-blue-600">
                {business.revenue && business.ebitda ? `${Math.round((parseFloat((business.ebitda as string).replace(/\D/g, '')) / parseFloat((business.revenue as string).replace(/\D/g, ''))) * 100)}%` : 'N/A'}
              </span></div>
            </div>
          </div>

          {rollupCandidates.length > 0 && (
            <>
              <div>
                <h3 className="font-bold mb-3" style={{ color: COLOR_PRIMARY }}>Rollup Candidates</h3>
                {rollupCandidates.map((candidate: any) => (
                  <div key={candidate.id} className="p-3 rounded border mb-2" style={{ borderColor: COLOR_BORDER }}>
                    <p className="font-bold text-sm" style={{ color: COLOR_PRIMARY }}>{candidate.name}</p>
                    <p className="text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>Val: {candidate.valuation} | Rev: {candidate.revenue} | EBITDA: {candidate.ebitda}</p>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-lg" style={{ background: COLOR_ACCENT + '20', border: `1px solid ${COLOR_ACCENT}` }}>
                <h3 className="font-bold mb-3" style={{ color: COLOR_PRIMARY }}>📊 Combined Rollup Metrics</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p style={{ color: COLOR_TEXT_SECONDARY }}>Combined Revenue</p>
                    <p className="text-lg font-black" style={{ color: COLOR_ACCENT }}>
                      ${(combinedRevenue / 1000000).toFixed(2)}M
                    </p>
                  </div>
                  <div>
                    <p style={{ color: COLOR_TEXT_SECONDARY }}>Combined EBITDA</p>
                    <p className="text-lg font-black text-green-600">
                      ${(combinedEBITDA / 1000000).toFixed(2)}M
                    </p>
                  </div>
                  <div>
                    <p style={{ color: COLOR_TEXT_SECONDARY }}>Est. Synergy Value</p>
                    <p className="text-lg font-black text-blue-600">
                      ${(synergy / 1000000).toFixed(2)}M
                    </p>
                  </div>
                  <div>
                    <p style={{ color: COLOR_TEXT_SECONDARY }}>Pro Forma Margin</p>
                    <p className="text-lg font-black" style={{ color: COLOR_PRIMARY }}>
                      {Math.round((combinedEBITDA / combinedRevenue) * 100)}%
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          <Link
            href={`/dashboard/deal-detail/${business.id}`}
            className="w-full block py-3 rounded-lg font-bold text-white text-center transition-all hover:opacity-90"
            style={{ background: COLOR_ACCENT }}
          >
            View Full Intelligence & Data Room
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

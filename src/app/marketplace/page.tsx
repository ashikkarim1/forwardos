'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Search,
  MapPin,
  DollarSign,
  TrendingUp,
  Bookmark,
  Phone,
  Filter,
  Star,
  Building2,
  Clock,
  Users,
  BarChart3,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Heart,
  Home,
} from 'lucide-react'
import Link from 'next/link'
import { DashboardHeader } from '@/components/DashboardHeader'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER } from '@/styles/forward-colors'

const dealsData = [
  {
    id: 1,
    title: 'Aesthetic Polyclinic Dubai – DHA Licensed, Fully Equipped',
    location: 'Deira, Dubai, UAE',
    image: 'https://images.unsplash.com/photo-1576091160550-112173e7f869?w=600&h=400&fit=crop',
    askingPrice: 'On request',
    revenue: 'AED 500K - AED 1M',
    cashFlow: 'On request',
    description: 'Fully operational aesthetic polyclinic with active DHA license. 7 treatment rooms fully equipped. Currently running with a lean experienced team.',
    badges: ['NEW', 'BUSINESS'],
    tags: ['LEASE', 'RELOCATABLE', 'QUICK SALE'],
    details: {
      yearsOperating: 2,
      employees: 3,
      margin: '35%',
      growth: '25%',
      type: 'Healthcare',
    },
    heat: 88,
    saved: false,
  },
  {
    id: 2,
    title: 'Premium Gym & Fitness Center – Abu Dhabi',
    location: 'Al Reem Island, Abu Dhabi, UAE',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop',
    askingPrice: 'On request',
    revenue: 'AED 800K - AED 1.5M',
    cashFlow: 'On request',
    description: 'State-of-the-art fitness facility with 5,000 sq ft space. 200+ active members, modern equipment, personal training services.',
    badges: ['ACTIVE', 'BUSINESS'],
    tags: ['LEASE', 'PROFITABLE', 'ESTABLISHED'],
    details: {
      yearsOperating: 4,
      employees: 12,
      margin: '28%',
      growth: '18%',
      type: 'Fitness & Wellness',
    },
    heat: 75,
    saved: false,
  },
  {
    id: 3,
    title: 'Fine Dining Restaurant – Marina Dubai',
    location: 'Dubai Marina, Dubai, UAE',
    image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600&h=400&fit=crop',
    askingPrice: 'On request',
    revenue: 'AED 2M - AED 3.5M',
    cashFlow: 'On request',
    description: 'Award-winning fine dining establishment. 150-seat capacity, full liquor license, Michelin-trained chefs, consistent footfall.',
    badges: ['PREMIUM', 'BUSINESS'],
    tags: ['LEASE', 'PREMIUM', 'HIGH REVENUE'],
    details: {
      yearsOperating: 6,
      employees: 35,
      margin: '22%',
      growth: '15%',
      type: 'Food & Beverage',
    },
    heat: 92,
    saved: false,
  },
  {
    id: 4,
    title: 'E-Commerce & Logistics Hub – Jebel Ali',
    location: 'Jebel Ali, Dubai, UAE',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=400&fit=crop',
    askingPrice: 'On request',
    revenue: 'AED 1.5M - AED 2.8M',
    cashFlow: 'On request',
    description: 'Fully integrated e-commerce operation with warehousing. 10,000+ SKUs, fulfillment center, established supplier network.',
    badges: ['SCALABLE', 'TECH'],
    tags: ['LEASE', 'GROWTH', 'ASSET HEAVY'],
    details: {
      yearsOperating: 3,
      employees: 28,
      margin: '18%',
      growth: '42%',
      type: 'E-Commerce',
    },
    heat: 85,
    saved: false,
  },
  {
    id: 5,
    title: 'Boutique Hotel – Old Town, Dubai',
    location: 'Al Fahidi, Dubai, UAE',
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&h=400&fit=crop',
    askingPrice: 'On request',
    revenue: 'AED 1.2M - AED 2.1M',
    cashFlow: 'On request',
    description: '35-room luxury boutique hotel in heritage location. 85% occupancy rate, strong tourism demand, premium positioning.',
    badges: ['HOSPITALITY', 'ASSET'],
    tags: ['LEASE', 'TOURISM', 'PREMIUM'],
    details: {
      yearsOperating: 5,
      employees: 22,
      margin: '32%',
      growth: '12%',
      type: 'Hospitality',
    },
    heat: 79,
    saved: false,
  },
  {
    id: 6,
    title: 'Tech Startup – SaaS B2B Platform',
    location: 'Dubai Silicon Oasis, Dubai, UAE',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop',
    askingPrice: 'On request',
    revenue: 'AED 600K - AED 1.2M',
    cashFlow: 'On request',
    description: 'Fast-growing SaaS platform serving Middle East SMEs. 50+ enterprise clients, recurring revenue model, expansion ready.',
    badges: ['TECH', 'GROWTH'],
    tags: ['QUICK SALE', 'HIGH GROWTH', 'SCALABLE'],
    details: {
      yearsOperating: 2,
      employees: 8,
      margin: '45%',
      growth: '65%',
      type: 'Software/SaaS',
    },
    heat: 94,
    saved: false,
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function MarketplacePage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [deals, setDeals] = useState(dealsData)

  const filteredDeals = deals.filter(deal => {
    const matchesSearch = deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deal.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === 'all' || deal.details.type.toLowerCase().includes(selectedType)
    return matchesSearch && matchesType
  })

  const businessTypes = ['All Businesses', 'Healthcare', 'Fitness & Wellness', 'Food & Beverage', 'E-Commerce', 'Hospitality', 'Software/SaaS']

  return (
    <>
      {/* Top Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/80 border-b transition-all duration-300 shadow-lg" style={{ borderColor: COLOR_BORDER }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img src="/fox.jpg" alt="Forward OS" className="w-8 h-8 rounded" style={{ border: `1px solid ${COLOR_BORDER}` }} />
            <span className="font-black text-lg" style={{ color: COLOR_PRIMARY }}>Forward OS</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all hover:opacity-70" style={{ color: COLOR_ACCENT }}>
              <Home className="w-4 h-4" />
              Home
            </Link>
            <Link href="/login" className="px-4 py-2 rounded-lg font-semibold text-sm transition-all hover:opacity-70" style={{ color: COLOR_ACCENT }}>
              Sign In
            </Link>
            <Link href="/signup" className="px-6 py-2 rounded-lg font-bold text-white text-sm transition-all hover:opacity-90" style={{ background: COLOR_ACCENT }}>
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content with top padding for fixed header */}
      <div className="pt-20">
      <DashboardHeader
        breadcrumbs={[
          { label: 'Forward OS', href: '/' },
          { label: 'Marketplace' },
        ]}
        title="Businesses for Sale - UAE"
        subtitle="Discover premium businesses available for acquisition across Dubai, Abu Dhabi, and UAE"
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
        {/* Market Overview Stats */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Businesses', value: '1,247', icon: Building2, color: '#FF8C00' },
            { label: 'Avg Asking Price', value: 'AED 1.2M', icon: DollarSign, color: '#10B981' },
            { label: 'Avg Revenue', value: 'AED 1.5M', icon: TrendingUp, color: '#3B82F6' },
            { label: 'Avg Growth', value: '24% YoY', icon: BarChart3, color: '#8B5CF6' },
          ].map((stat, idx) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={idx}
                className="p-6 rounded-lg border hover:shadow-md transition-all"
                style={{ borderColor: COLOR_BORDER, background: 'white' }}
                whileHover={{ y: -2 }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Icon className="w-5 h-5" style={{ color: stat.color }} />
                  <p className="text-sm font-semibold" style={{ color: COLOR_TEXT_SECONDARY }}>
                    {stat.label}
                  </p>
                </div>
                <p className="text-2xl font-black" style={{ color: COLOR_PRIMARY }}>
                  {stat.value}
                </p>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Search & Filter */}
        <motion.div variants={itemVariants} className="space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-4 w-5 h-5" style={{ color: COLOR_ACCENT }} />
            <input
              type="text"
              placeholder="Search by business name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-4 rounded-lg border-2 focus:outline-none text-lg"
              style={{ borderColor: COLOR_ACCENT }}
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {businessTypes.map((type) => (
              <motion.button
                key={type}
                onClick={() => setSelectedType(type === 'All Businesses' ? 'all' : type.toLowerCase())}
                className="px-4 py-2 rounded-full border-2 font-semibold whitespace-nowrap transition-all"
                style={{
                  borderColor: (selectedType === 'all' && type === 'All Businesses') || selectedType === type.toLowerCase() ? COLOR_ACCENT : COLOR_BORDER,
                  color: (selectedType === 'all' && type === 'All Businesses') || selectedType === type.toLowerCase() ? COLOR_ACCENT : COLOR_TEXT_SECONDARY,
                  background: (selectedType === 'all' && type === 'All Businesses') || selectedType === type.toLowerCase() ? `${COLOR_ACCENT}10` : 'white',
                }}
                whileHover={{ scale: 1.05 }}
              >
                {type}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Featured Deals */}
        <motion.section variants={itemVariants}>
          <h2 className="text-3xl font-black mb-6" style={{ color: COLOR_PRIMARY }}>
            Featured Deals ({filteredDeals.length})
          </h2>

          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            variants={containerVariants}
          >
            {filteredDeals.map((deal) => (
              <motion.div
                key={deal.id}
                className="rounded-lg border hover:shadow-lg transition-all overflow-hidden group"
                style={{ borderColor: COLOR_BORDER, background: 'white' }}
                variants={itemVariants}
                whileHover={{ y: -4 }}
              >
                {/* Image Section */}
                <div className="relative h-48 bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center overflow-hidden bg-cover bg-center" style={{ backgroundImage: `url(${deal.image})` }}>
                  <div className="absolute inset-0 bg-black opacity-10"></div>
                  <div className="absolute top-4 left-4 right-4 flex gap-2">
                    {deal.badges.map((badge) => (
                      <span
                        key={badge}
                        className="px-3 py-1 rounded-full text-xs font-bold text-white"
                        style={{ background: badge === 'NEW' ? '#EF4444' : COLOR_ACCENT }}
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                  <div className="absolute top-4 right-4">
                    <button className="p-2 rounded-lg bg-white hover:bg-gray-100">
                      <Heart className="w-5 h-5" style={{ color: COLOR_ACCENT }} />
                    </button>
                  </div>

                  {/* Heat Score */}
                  <div className="absolute bottom-4 left-4 px-3 py-1 rounded-full text-white text-sm font-bold" style={{ background: COLOR_ACCENT }}>
                    🔥 Heat: {deal.heat}/100
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-xl font-black mb-2 group-hover:opacity-70 transition-opacity" style={{ color: COLOR_PRIMARY }}>
                      {deal.title}
                    </h3>
                    <div className="flex items-center gap-2" style={{ color: COLOR_TEXT_SECONDARY }}>
                      <MapPin className="w-4 h-4" />
                      <p className="text-sm">{deal.location}</p>
                    </div>
                  </div>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-3 gap-3 py-3 border-y" style={{ borderColor: COLOR_BORDER }}>
                    <div>
                      <p className="text-xs font-semibold mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                        Asking Price
                      </p>
                      <p className="font-black text-sm" style={{ color: COLOR_ACCENT }}>
                        {deal.askingPrice}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                        Revenue
                      </p>
                      <p className="font-black text-sm" style={{ color: COLOR_PRIMARY }}>
                        {deal.revenue}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                        Cash Flow
                      </p>
                      <p className="font-black text-sm" style={{ color: COLOR_PRIMARY }}>
                        {deal.cashFlow}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm line-clamp-2" style={{ color: COLOR_TEXT_SECONDARY }}>
                    {deal.description}
                  </p>

                  {/* Deal Types */}
                  <div className="flex flex-wrap gap-2">
                    {deal.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full text-xs font-semibold"
                        style={{ background: `${COLOR_ACCENT}20`, color: COLOR_ACCENT }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-4 gap-2 pt-2">
                    {[
                      { icon: Clock, label: deal.details.yearsOperating + 'y', title: 'Operating' },
                      { icon: Users, label: deal.details.employees, title: 'Team' },
                      { icon: TrendingUp, label: deal.details.growth, title: 'Growth' },
                      { icon: DollarSign, label: deal.details.margin, title: 'Margin' },
                    ].map((item, idx) => {
                      const Icon = item.icon
                      return (
                        <div key={idx} className="text-center">
                          <Icon className="w-4 h-4 mx-auto mb-1" style={{ color: COLOR_ACCENT }} />
                          <p className="text-xs font-bold" style={{ color: COLOR_PRIMARY }}>
                            {item.label}
                          </p>
                          <p className="text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>
                            {item.title}
                          </p>
                        </div>
                      )
                    })}
                  </div>

                  {/* CTA Buttons */}
                  <div className="grid grid-cols-2 gap-3 pt-4">
                    <motion.button
                      className="px-4 py-3 rounded-lg border-2 font-bold text-sm transition-all"
                      style={{ borderColor: COLOR_BORDER, color: COLOR_PRIMARY }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <Bookmark className="w-4 h-4 inline mr-2" />
                      Save
                    </motion.button>
                    <motion.button
                      className="px-4 py-3 rounded-lg font-bold text-sm text-white transition-all"
                      style={{ background: COLOR_ACCENT }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <Phone className="w-4 h-4 inline mr-2" />
                      Contact
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* Why Choose Forward CTA */}
        <motion.section
          variants={itemVariants}
          className="p-12 rounded-xl border-2"
          style={{ borderColor: COLOR_ACCENT, background: `${COLOR_ACCENT}08` }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <CheckCircle2 className="w-8 h-8 mb-3" style={{ color: COLOR_ACCENT }} />
              <h3 className="text-lg font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
                Vetted Deals Only
              </h3>
              <p style={{ color: COLOR_TEXT_SECONDARY }}>
                Every business is verified with full financial due diligence and legal compliance checks.
              </p>
            </div>
            <div>
              <BarChart3 className="w-8 h-8 mb-3" style={{ color: COLOR_ACCENT }} />
              <h3 className="text-lg font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
                Real Market Data
              </h3>
              <p style={{ color: COLOR_TEXT_SECONDARY }}>
                Access comparable sales, market trends, and valuation analysis for every listing.
              </p>
            </div>
            <div>
              <TrendingUp className="w-8 h-8 mb-3" style={{ color: COLOR_ACCENT }} />
              <h3 className="text-lg font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
                Growth Potential
              </h3>
              <p style={{ color: COLOR_TEXT_SECONDARY }}>
                Identify high-growth opportunities with detailed business intelligence and forecasting.
              </p>
            </div>
          </div>
        </motion.section>
      </motion.div>
      </div>
    </>
  )
}

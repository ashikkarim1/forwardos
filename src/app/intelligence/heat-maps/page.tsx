'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Flame, TrendingUp, Users, Eye, MessageSquare, Clock, Map, Zap } from 'lucide-react'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER } from '@/styles/forward-colors'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

interface HeatMapListing {
  id: string
  name: string
  industry: string
  city: string
  revenue: string
  temperature: number // 0-100
  inquiries: number
  views: number
  messagesLastDay: number
  timeToClose: string
}

interface IndustryHeat {
  industry: string
  heat: number // 0-100
  activeListings: number
  totalInquiries: number
  avgPriceRange: string
}

interface GeographicHeat {
  city: string
  heat: number // 0-100
  activeDeals: number
  topIndustry: string
  avgDaysToClose: number
}

const mockListingHeatMap: HeatMapListing[] = [
  {
    id: '1',
    name: 'TechFlow Solutions',
    industry: 'SaaS',
    city: 'Dubai',
    revenue: 'AED 5M',
    temperature: 92,
    inquiries: 12,
    views: 342,
    messagesLastDay: 8,
    timeToClose: '6-8 weeks',
  },
  {
    id: '2',
    name: 'Emirates Healthcare',
    industry: 'Healthcare',
    city: 'Dubai',
    revenue: 'AED 12M',
    temperature: 88,
    inquiries: 15,
    views: 567,
    messagesLastDay: 6,
    timeToClose: '8-10 weeks',
  },
  {
    id: '3',
    name: 'DubaiRetail Group',
    industry: 'Retail',
    city: 'Dubai',
    revenue: 'AED 8M',
    temperature: 76,
    inquiries: 8,
    views: 289,
    messagesLastDay: 3,
    timeToClose: '10-12 weeks',
  },
  {
    id: '4',
    name: 'FinTech Innovations',
    industry: 'FinTech',
    city: 'Dubai',
    revenue: 'AED 7M',
    temperature: 84,
    inquiries: 10,
    views: 431,
    messagesLastDay: 5,
    timeToClose: '7-9 weeks',
  },
  {
    id: '5',
    name: 'AlManufacturing',
    industry: 'Manufacturing',
    city: 'Sharjah',
    revenue: 'AED 15M',
    temperature: 62,
    inquiries: 4,
    views: 156,
    messagesLastDay: 1,
    timeToClose: '14-16 weeks',
  },
  {
    id: '6',
    name: 'Gulf Logistics',
    industry: 'Services',
    city: 'Abu Dhabi',
    revenue: 'AED 3M',
    temperature: 45,
    inquiries: 2,
    views: 98,
    messagesLastDay: 0,
    timeToClose: '16-20 weeks',
  },
]

const industryHeatMap: IndustryHeat[] = [
  {
    industry: 'SaaS',
    heat: 94,
    activeListings: 8,
    totalInquiries: 47,
    avgPriceRange: 'AED 5-15M',
  },
  {
    industry: 'Healthcare',
    heat: 88,
    activeListings: 5,
    totalInquiries: 32,
    avgPriceRange: 'AED 10-30M',
  },
  {
    industry: 'FinTech',
    heat: 85,
    activeListings: 6,
    totalInquiries: 28,
    avgPriceRange: 'AED 7-20M',
  },
  {
    industry: 'Retail',
    heat: 72,
    activeListings: 4,
    totalInquiries: 15,
    avgPriceRange: 'AED 5-12M',
  },
  {
    industry: 'Services',
    heat: 58,
    activeListings: 7,
    totalInquiries: 12,
    avgPriceRange: 'AED 2-8M',
  },
  {
    industry: 'Manufacturing',
    heat: 48,
    activeListings: 3,
    totalInquiries: 6,
    avgPriceRange: 'AED 10-25M',
  },
]

const geographicHeatMap: GeographicHeat[] = [
  {
    city: 'Dubai',
    heat: 89,
    activeDeals: 18,
    topIndustry: 'SaaS',
    avgDaysToClose: 52,
  },
  {
    city: 'Abu Dhabi',
    heat: 71,
    activeDeals: 8,
    topIndustry: 'Healthcare',
    avgDaysToClose: 68,
  },
  {
    city: 'Sharjah',
    heat: 54,
    activeDeals: 4,
    topIndustry: 'Manufacturing',
    avgDaysToClose: 74,
  },
  {
    city: 'Ajman',
    heat: 38,
    activeDeals: 2,
    topIndustry: 'Services',
    avgDaysToClose: 82,
  },
]

const getHeatColor = (temperature: number) => {
  if (temperature >= 85) return '#DC2626' // Red-hot
  if (temperature >= 70) return '#EA580C' // Orange-hot
  if (temperature >= 55) return '#F59E0B' // Warm
  if (temperature >= 40) return '#FBBF24' // Lukewarm
  if (temperature >= 25) return '#93C5FD' // Cool
  return '#3B82F6' // Cold
}

const getHeatLabel = (temperature: number) => {
  if (temperature >= 85) return '🔥 Red Hot'
  if (temperature >= 70) return '🟠 Hot'
  if (temperature >= 55) return '🟡 Warm'
  if (temperature >= 40) return '🟠 Lukewarm'
  if (temperature >= 25) return '🔵 Cool'
  return '❄️ Cold'
}

const HeatBarVisualization = ({ temperature, width = '100%' }: { temperature: number; width?: string }) => {
  return (
    <div className="flex items-center gap-3" style={{ width }}>
      <div className="flex-1 h-2 rounded-full bg-gray-200 overflow-hidden">
        <motion.div
          className="h-full"
          initial={{ width: 0 }}
          animate={{ width: `${temperature}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{ background: getHeatColor(temperature) }}
        />
      </div>
      <div className="text-sm font-bold w-16 text-right" style={{ color: getHeatColor(temperature) }}>
        {temperature}°
      </div>
    </div>
  )
}

export default function HeatMapsPage() {
  const [selectedTab, setSelectedTab] = useState<'listings' | 'industry' | 'geographic'>('listings')
  const [hoveredListing, setHoveredListing] = useState<string | null>(null)

  const avgListingHeat = Math.round(mockListingHeatMap.reduce((sum, l) => sum + l.temperature, 0) / mockListingHeatMap.length)
  const avgIndustryHeat = Math.round(industryHeatMap.reduce((sum, i) => sum + i.heat, 0) / industryHeatMap.length)
  const avgGeographicHeat = Math.round(geographicHeatMap.reduce((sum, g) => sum + g.heat, 0) / geographicHeatMap.length)

  return (
    <motion.div
      className="max-w-7xl mx-auto px-6 py-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <Flame className="w-8 h-8" style={{ color: COLOR_ACCENT }} />
          <h1 className="text-4xl font-black" style={{ color: COLOR_PRIMARY }}>
            Deal Heat Maps
          </h1>
        </div>
        <p className="text-lg" style={{ color: COLOR_TEXT_SECONDARY }}>
          Real-time visualization of buyer interest, deal temperature, and market activity. Cool (blue) to Hot (red).
        </p>
      </motion.div>

      {/* Overview Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        variants={containerVariants}
      >
        {[
          { label: 'Listing Heat', value: avgListingHeat, icon: Flame },
          { label: 'Industry Heat', value: avgIndustryHeat, icon: TrendingUp },
          { label: 'Geographic Heat', value: avgGeographicHeat, icon: Map },
        ].map((item) => {
          const Icon = item.icon
          return (
            <motion.div
              key={item.label}
              className="p-6 rounded-lg border-2 hover:shadow-lg transition-all"
              style={{ borderColor: getHeatColor(item.value), background: getHeatColor(item.value) + '10' }}
              variants={itemVariants}
              whileHover={{ y: -4 }}
            >
              <div className="flex items-center gap-3 mb-3">
                <Icon className="w-6 h-6" style={{ color: getHeatColor(item.value) }} />
                <p className="text-sm font-semibold" style={{ color: COLOR_TEXT_SECONDARY }}>
                  {item.label}
                </p>
              </div>
              <p className="text-3xl font-black mb-2" style={{ color: getHeatColor(item.value) }}>
                {item.value}°
              </p>
              <p className="text-xs font-bold" style={{ color: getHeatColor(item.value) }}>
                {getHeatLabel(item.value)}
              </p>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Tab Navigation */}
      <motion.div variants={itemVariants} className="mb-8 flex gap-2 border-b" style={{ borderColor: COLOR_BORDER }}>
        {[
          { id: 'listings', label: '📊 Listing Heat Map' },
          { id: 'industry', label: '🏢 Industry Heat' },
          { id: 'geographic', label: '🗺️ Geographic Heat' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id as any)}
            className="px-6 py-4 font-bold border-b-2 transition-all"
            style={{
              color: selectedTab === tab.id ? COLOR_ACCENT : COLOR_TEXT_SECONDARY,
              borderColor: selectedTab === tab.id ? COLOR_ACCENT : 'transparent',
            }}
          >
            {tab.label}
          </button>
        ))}
      </motion.div>

      {/* Listing Heat Map */}
      {selectedTab === 'listings' && (
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          variants={containerVariants}
        >
          {mockListingHeatMap.map((listing) => (
            <motion.div
              key={listing.id}
              className="p-6 rounded-lg border-2 hover:shadow-lg transition-all cursor-pointer"
              style={{
                borderColor: getHeatColor(listing.temperature),
                background: getHeatColor(listing.temperature) + '08',
              }}
              onHoverStart={() => setHoveredListing(listing.id)}
              onHoverEnd={() => setHoveredListing(null)}
              variants={itemVariants}
              whileHover={{ x: 4 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-center">
                {/* Left: Name & Industry */}
                <div>
                  <p className="font-bold text-lg" style={{ color: COLOR_PRIMARY }}>
                    {listing.name}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-bold text-white"
                      style={{ background: COLOR_ACCENT }}
                    >
                      {listing.industry}
                    </span>
                    <span className="text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>
                      {listing.city}
                    </span>
                  </div>
                </div>

                {/* Center: Heat Bar */}
                <div className="lg:col-span-2">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-xs font-semibold" style={{ color: COLOR_TEXT_SECONDARY }}>
                      Deal Temperature
                    </p>
                    <p className="text-sm font-bold" style={{ color: getHeatColor(listing.temperature) }}>
                      {getHeatLabel(listing.temperature)}
                    </p>
                  </div>
                  <HeatBarVisualization temperature={listing.temperature} />
                </div>

                {/* Right: Key Metrics */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center">
                    <p className="text-xs font-semibold mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                      Inquiries
                    </p>
                    <p className="text-2xl font-black" style={{ color: COLOR_PRIMARY }}>
                      {listing.inquiries}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-semibold mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                      Messages
                    </p>
                    <p className="text-2xl font-black" style={{ color: COLOR_PRIMARY }}>
                      {listing.messagesLastDay}
                    </p>
                  </div>
                </div>
              </div>

              {/* Expanded Details (on hover) */}
              {hoveredListing === listing.id && (
                <motion.div
                  className="mt-4 pt-4 border-t"
                  style={{ borderColor: getHeatColor(listing.temperature) }}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="grid grid-cols-4 gap-4 text-center">
                    <div>
                      <Eye className="w-5 h-5 mx-auto mb-2" style={{ color: getHeatColor(listing.temperature) }} />
                      <p className="text-xs font-semibold mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                        Views
                      </p>
                      <p className="font-bold" style={{ color: COLOR_PRIMARY }}>
                        {listing.views}
                      </p>
                    </div>
                    <div>
                      <Users className="w-5 h-5 mx-auto mb-2" style={{ color: getHeatColor(listing.temperature) }} />
                      <p className="text-xs font-semibold mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                        Active Buyers
                      </p>
                      <p className="font-bold" style={{ color: COLOR_PRIMARY }}>
                        {Math.floor(listing.inquiries * 1.5)}
                      </p>
                    </div>
                    <div>
                      <Clock className="w-5 h-5 mx-auto mb-2" style={{ color: getHeatColor(listing.temperature) }} />
                      <p className="text-xs font-semibold mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                        To Close
                      </p>
                      <p className="font-bold text-xs" style={{ color: COLOR_PRIMARY }}>
                        {listing.timeToClose}
                      </p>
                    </div>
                    <div>
                      <Zap className="w-5 h-5 mx-auto mb-2" style={{ color: getHeatColor(listing.temperature) }} />
                      <p className="text-xs font-semibold mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                        Revenue
                      </p>
                      <p className="font-bold text-xs" style={{ color: COLOR_PRIMARY }}>
                        {listing.revenue}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Industry Heat Map */}
      {selectedTab === 'industry' && (
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          variants={containerVariants}
        >
          {industryHeatMap.map((industry) => (
            <motion.div
              key={industry.industry}
              className="p-6 rounded-lg border-2 hover:shadow-lg transition-all"
              style={{
                borderColor: getHeatColor(industry.heat),
                background: getHeatColor(industry.heat) + '08',
              }}
              variants={itemVariants}
              whileHover={{ x: 4 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-center">
                <div>
                  <p className="font-bold text-lg" style={{ color: COLOR_PRIMARY }}>
                    {industry.industry}
                  </p>
                  <p className="text-sm mt-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                    {industry.avgPriceRange}
                  </p>
                </div>

                <div className="lg:col-span-2">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-xs font-semibold" style={{ color: COLOR_TEXT_SECONDARY }}>
                      Market Heat
                    </p>
                    <p className="text-sm font-bold" style={{ color: getHeatColor(industry.heat) }}>
                      {getHeatLabel(industry.heat)}
                    </p>
                  </div>
                  <HeatBarVisualization temperature={industry.heat} />
                </div>

                <div className="grid grid-cols-2 gap-3 text-center">
                  <div>
                    <p className="text-xs font-semibold mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                      Listings
                    </p>
                    <p className="text-2xl font-black" style={{ color: COLOR_PRIMARY }}>
                      {industry.activeListings}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                      Inquiries
                    </p>
                    <p className="text-2xl font-black" style={{ color: COLOR_PRIMARY }}>
                      {industry.totalInquiries}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Geographic Heat Map */}
      {selectedTab === 'geographic' && (
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          variants={containerVariants}
        >
          {geographicHeatMap.map((geo) => (
            <motion.div
              key={geo.city}
              className="p-6 rounded-lg border-2 hover:shadow-lg transition-all"
              style={{
                borderColor: getHeatColor(geo.heat),
                background: getHeatColor(geo.heat) + '08',
              }}
              variants={itemVariants}
              whileHover={{ x: 4 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-center">
                <div>
                  <p className="font-bold text-lg" style={{ color: COLOR_PRIMARY }}>
                    {geo.city}
                  </p>
                  <p className="text-sm mt-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                    {geo.topIndustry} (Top)
                  </p>
                </div>

                <div className="lg:col-span-2">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-xs font-semibold" style={{ color: COLOR_TEXT_SECONDARY }}>
                      Regional Heat
                    </p>
                    <p className="text-sm font-bold" style={{ color: getHeatColor(geo.heat) }}>
                      {getHeatLabel(geo.heat)}
                    </p>
                  </div>
                  <HeatBarVisualization temperature={geo.heat} />
                </div>

                <div className="grid grid-cols-2 gap-3 text-center">
                  <div>
                    <p className="text-xs font-semibold mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                      Active Deals
                    </p>
                    <p className="text-2xl font-black" style={{ color: COLOR_PRIMARY }}>
                      {geo.activeDeals}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                      Avg. Close
                    </p>
                    <p className="text-sm font-bold" style={{ color: COLOR_PRIMARY }}>
                      {geo.avgDaysToClose}d
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Legend */}
      <motion.div
        className="mt-12 p-6 rounded-lg border-2"
        style={{ borderColor: COLOR_BORDER, background: 'white' }}
        variants={itemVariants}
      >
        <h3 className="font-bold mb-4" style={{ color: COLOR_PRIMARY }}>
          Heat Map Color Legend
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { temp: 95, label: '🔥 Red Hot', range: '85-100°' },
            { temp: 78, label: '🟠 Hot', range: '70-84°' },
            { temp: 62, label: '🟡 Warm', range: '55-69°' },
            { temp: 47, label: '🟠 Lukewarm', range: '40-54°' },
            { temp: 30, label: '🔵 Cool', range: '25-39°' },
            { temp: 15, label: '❄️ Cold', range: '0-24°' },
          ].map((item) => (
            <div key={item.temp} className="text-center">
              <div
                className="w-full h-12 rounded-lg mb-2"
                style={{ background: getHeatColor(item.temp) }}
              />
              <p className="text-xs font-bold" style={{ color: COLOR_PRIMARY }}>
                {item.label}
              </p>
              <p className="text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>
                {item.range}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Insight Card */}
      <motion.div
        className="mt-8 p-6 rounded-lg border-2"
        style={{ borderColor: COLOR_ACCENT, background: '#FFF7F3' }}
        variants={itemVariants}
      >
        <h3 className="font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
          💡 Market Insight
        </h3>
        <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-sm mb-3">
          SaaS and Healthcare sectors are currently the hottest markets with average heat scores of 94° and 88° respectively. Dubai leads geographically with 89° heat. TechFlow Solutions has the highest deal temperature at 92°—a prime candidate for acceleration.
        </p>
        <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-sm">
          <strong>Recommendation:</strong> Focus outreach efforts on SaaS and FinTech deals in Dubai. Manufacturing and services sectors show coolest temperatures—consider targeted marketing campaigns to increase buyer engagement.
        </p>
      </motion.div>
    </motion.div>
  )
}

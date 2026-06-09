'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { useLocale } from '@/context/LocaleContext'
import { Breadcrumbs, BreadcrumbItem } from '@/components/Breadcrumbs'
import { BusinessPhotoGallery } from '@/components/BusinessPhotoGallery'
import { HelpContactWidget } from '@/components/HelpContactWidget'
import { WorldClassFooter } from '@/components/WorldClassFooter'
import {
  ArrowLeft,
  Star,
  MapPin,
  Users,
  TrendingUp,
  DollarSign,
  Briefcase,
  CheckCircle2,
  Flame,
  Phone,
  Mail,
  Share2,
  Image as ImageIcon,
  Download,
  BarChart3,
  Target,
  Sparkles,
} from 'lucide-react'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER } from '@/styles/forward-colors'

interface Comparable {
  name: string
  type: 'Current Similar' | 'Historical Comparable'
  valuation: number
  revenue: number
  growth: number
  margin: number
  id: string
}

interface Deal {
  id: string
  name: string
  businessType: string
  industry: string
  location: string
  city: string
  description: string

  // Financial
  valuation: number
  revenue: number
  cashFlow: number
  ebitda: number
  ebitdaMargin: number

  // Growth & Market
  growthRate: number
  successProbability: number
  heatScore: number
  maaProbability: number

  // Operations
  employees: number
  customerCount: number

  // Seller
  sellerType: string
  sellerMotivation: string

  // Media
  heroImage: string
  photos: string[]

  // Additional info
  keyHighlights: string[]
  businessModel: string
  targetBuyers: string[]
  comparables?: Comparable[]
}

// Mock deal data for the first 3 deals
const dealDatabase: Record<string, Deal> = {
  'deal-1': {
    id: 'deal-1',
    name: 'TechFlow SaaS',
    businessType: 'SaaS Platform - Project Management',
    industry: 'SaaS / Software',
    location: 'San Francisco, CA',
    city: 'San Francisco',
    description:
      'TechFlow is a rapidly growing SaaS platform providing enterprise-grade project management solutions. With strong product-market fit, 45% YoY growth, and a loyal customer base of 187 companies, the platform is ready for the next phase of scaling. Perfect for strategic buyers looking to expand their software portfolio.',

    valuation: 2500000,
    revenue: 850000,
    cashFlow: 185000,
    ebitda: 187000,
    ebitdaMargin: 22,

    growthRate: 45,
    successProbability: 92,
    heatScore: 88,
    maaProbability: 87,

    employees: 12,
    customerCount: 187,

    sellerType: 'Founder',
    sellerMotivation: 'Growth Capital Needed',

    heroImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=600&fit=crop',
    photos: [
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1461749007519-f2ea6ecc6768?w=800&h=500&fit=crop',
    ],

    keyHighlights: [
      '45% YoY growth trajectory',
      '$850K annual recurring revenue',
      '22% EBITDA margin - profitability at scale',
      '187 enterprise customers',
      'Founder-led with 12-person team',
      '92% AI-predicted success probability',
    ],

    businessModel: 'B2B SaaS - Monthly subscription model with enterprise accounts averaging $4.5K/month',

    targetBuyers: [
      'Enterprise Software Companies',
      'Strategic Buyers in Tech',
      'Growth-focused Private Equity',
      'Strategic Consolidators',
    ],
    comparables: [
      {
        name: 'Similar Deal: TaskMaster Pro',
        type: 'Current Similar',
        valuation: 2800000,
        revenue: 920000,
        growth: 48,
        margin: 24,
        id: 'deal-2',
      },
      {
        name: 'Historical: ProjectFlow (Sold 2023)',
        type: 'Historical Comparable',
        valuation: 2200000,
        revenue: 750000,
        growth: 42,
        margin: 20,
        id: 'historical-1',
      },
      {
        name: 'Similar Deal: CollabHub',
        type: 'Current Similar',
        valuation: 3100000,
        revenue: 1050000,
        growth: 50,
        margin: 25,
        id: 'deal-3',
      },
      {
        name: 'Historical: WorkSync (Sold 2024)',
        type: 'Historical Comparable',
        valuation: 2650000,
        revenue: 890000,
        growth: 46,
        margin: 23,
        id: 'historical-2',
      },
    ],
  },

  'deal-2': {
    id: 'deal-2',
    name: 'CloudFirst Analytics',
    businessType: 'Analytics Platform - Business Intelligence',
    industry: 'SaaS / Software',
    location: 'Toronto, ON',
    city: 'Toronto',
    description:
      'CloudFirst Analytics is a leading business intelligence platform helping mid-market companies make data-driven decisions. With 62% YoY growth, 342 active customers, and strong unit economics, this platform is a strategic asset for any analytics-focused buyer.',

    valuation: 5800000,
    revenue: 1900000,
    cashFlow: 456000,
    ebitda: 456000,
    ebitdaMargin: 24,

    growthRate: 62,
    successProbability: 87,
    heatScore: 92,
    maaProbability: 91,

    employees: 18,
    customerCount: 342,

    sellerType: 'PE/Financial',
    sellerMotivation: 'Portfolio Optimization',

    heroImage: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&h=600&fit=crop',
    photos: [
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&h=500&fit=crop',
    ],

    keyHighlights: [
      '62% YoY growth - fastest growing in analytics space',
      '$1.9M annual recurring revenue',
      '24% EBITDA margin - exceptional profitability',
      '342 paying customers with 98% retention',
      'PE-backed with experienced 18-person team',
      '91% M&A probability - strategic fit',
    ],

    businessModel: 'B2B SaaS - Enterprise analytics platform with tiered pricing ($2K-$20K/month)',

    targetBuyers: [
      'Data Analytics Companies',
      'Enterprise Software Giants',
      'Private Equity Firms',
      'Business Intelligence Platforms',
    ],
    comparables: [
      {
        name: 'Similar Deal: InsightFlow Analytics',
        type: 'Current Similar',
        valuation: 5500000,
        revenue: 1800000,
        growth: 60,
        margin: 25,
        id: 'deal-1',
      },
      {
        name: 'Historical: DataViz Pro (Sold 2023)',
        type: 'Historical Comparable',
        valuation: 4800000,
        revenue: 1600000,
        growth: 55,
        margin: 23,
        id: 'historical-3',
      },
      {
        name: 'Similar Deal: MetricsHub',
        type: 'Current Similar',
        valuation: 6200000,
        revenue: 2100000,
        growth: 65,
        margin: 26,
        id: 'deal-3',
      },
      {
        name: 'Historical: BI Solutions Inc (Sold 2024)',
        type: 'Historical Comparable',
        valuation: 5100000,
        revenue: 1750000,
        growth: 58,
        margin: 24,
        id: 'historical-4',
      },
    ],
  },

  'deal-3': {
    id: 'deal-3',
    name: 'Emirates Franchise Network',
    businessType: 'Franchise Management - Network Operations',
    industry: 'Franchise / Network',
    location: 'Dubai, UAE',
    city: 'Dubai',
    description:
      'Emirates Franchise Network is the leading franchise management and support platform in the Middle East, operating a network of 450+ franchise locations across the region. With strong brand recognition and operational excellence, this is a rare opportunity to acquire a diversified, cash-generating business with expansion potential.',

    valuation: 12000000,
    revenue: 3200000,
    cashFlow: 960000,
    ebitda: 768000,
    ebitdaMargin: 24,

    growthRate: 28,
    successProbability: 74,
    heatScore: 85,
    maaProbability: 62,

    employees: 35,
    customerCount: 450,

    sellerType: 'Family',
    sellerMotivation: 'Succession Planning',

    heroImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=600&fit=crop',
    photos: [
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=500&fit=crop',
    ],

    keyHighlights: [
      '450+ franchise locations across Middle East',
      '$3.2M annual revenue with diversified income',
      '28% YoY growth with expansion opportunities',
      'Family-owned, established brand with strong reputation',
      'Rare opportunity in high-growth Middle East market',
      'Ready for institutional ownership',
    ],

    businessModel: 'Franchise Network - Franchise fees, royalties, and supply chain revenue',

    targetBuyers: [
      'International Franchise Companies',
      'Private Equity - Middle East Focus',
      'Strategic Consolidators',
      'Family Office Investors',
    ],
    comparables: [
      {
        name: 'Similar Deal: Middle East Food Network',
        type: 'Current Similar',
        valuation: 11500000,
        revenue: 3100000,
        growth: 30,
        margin: 25,
        id: 'deal-1',
      },
      {
        name: 'Historical: GCC Franchise Corp (Sold 2023)',
        type: 'Historical Comparable',
        valuation: 10200000,
        revenue: 2900000,
        growth: 26,
        margin: 23,
        id: 'historical-5',
      },
      {
        name: 'Similar Deal: Arabian Commerce Network',
        type: 'Current Similar',
        valuation: 13500000,
        revenue: 3500000,
        growth: 32,
        margin: 26,
        id: 'deal-2',
      },
      {
        name: 'Historical: Emirates Trading Group (Sold 2024)',
        type: 'Historical Comparable',
        valuation: 12100000,
        revenue: 3200000,
        growth: 29,
        margin: 24,
        id: 'historical-6',
      },
    ],
  },
}

export default function DealPage() {
  const { locale, isRTL } = useLocale()
  const params = useParams()
  const dealId = params?.id as string

  const [deal, setDeal] = useState<Deal | null>(null)
  const [isFavourite, setIsFavourite] = useState(false)
  const [photoModalOpen, setPhotoModalOpen] = useState(false)

  useEffect(() => {
    // Load deal from database
    const dealData = dealDatabase[dealId]
    setDeal(dealData || null)

    // Load favourite status from localStorage
    const saved = localStorage.getItem('forward_favourites')
    if (saved) {
      const favourites = JSON.parse(saved)
      setIsFavourite(favourites.includes(dealId))
    }
  }, [dealId])

  const toggleFavourite = () => {
    const saved = localStorage.getItem('forward_favourites')
    let favourites = saved ? JSON.parse(saved) : []

    if (isFavourite) {
      favourites = favourites.filter((id: string) => id !== dealId)
    } else {
      favourites.push(dealId)
    }

    localStorage.setItem('forward_favourites', JSON.stringify(favourites))
    setIsFavourite(!isFavourite)
  }

  if (!deal) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: COLOR_PRIMARY + '02' }}>
        <div className="text-center">
          <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-lg font-semibold">
            Deal not found
          </p>
          <Link
            href="/marketplace"
            className="mt-4 inline-block px-6 py-2 rounded-lg font-bold text-white"
            style={{ background: COLOR_ACCENT }}
          >
            Back to Marketplace
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header with Home & Back Button */}
      <div
        className="border-b sticky top-0 z-40 bg-white"
        style={{ borderColor: COLOR_BORDER }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="hover:opacity-80 transition-opacity"
              title="Back to Home"
            >
              <Sparkles size={28} style={{ color: COLOR_ACCENT }} />
            </Link>
            <Link
              href="/marketplace"
              className="flex items-center gap-2 font-bold hover:opacity-80 transition-opacity"
              style={{ color: COLOR_PRIMARY }}
            >
              <ArrowLeft size={20} />
              Back to Marketplace
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleFavourite}
              className="p-3 rounded-lg border transition-all hover:shadow-md"
              style={{
                borderColor: isFavourite ? COLOR_ACCENT : COLOR_BORDER,
                background: isFavourite ? COLOR_ACCENT + '10' : 'white',
              }}
            >
              <Star
                size={20}
                fill={isFavourite ? COLOR_ACCENT : 'none'}
                style={{ color: isFavourite ? COLOR_ACCENT : COLOR_TEXT_SECONDARY }}
              />
            </button>
            <button
              className="p-3 rounded-lg border transition-all hover:shadow-md"
              style={{ borderColor: COLOR_BORDER, background: 'white' }}
            >
              <Share2 size={20} style={{ color: COLOR_PRIMARY }} />
            </button>
          </div>
        </div>
      </div>

      {/* Breadcrumbs */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 border-b" style={{ borderColor: COLOR_BORDER }}>
        <Breadcrumbs
          items={[
            { label: 'Marketplace', href: '/marketplace' },
            { label: deal.name },
          ]}
        />
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images & Key Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Image */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative w-full aspect-video rounded-2xl overflow-hidden bg-gray-200 cursor-pointer group"
              onClick={() => setPhotoModalOpen(true)}
            >
              <img
                src={deal.heroImage}
                alt={deal.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />

              {/* Photo Counter */}
              <button
                onClick={() => setPhotoModalOpen(true)}
                className="absolute bottom-4 right-4 px-3 py-2 rounded-lg bg-white/90 hover:bg-white transition-all shadow-md flex items-center gap-2 font-semibold"
              >
                <ImageIcon size={18} style={{ color: COLOR_ACCENT }} />
                View {deal.photos.length} Photos
              </button>
            </motion.div>

            {/* Business Title & Type */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black mb-2" style={{ color: COLOR_PRIMARY }}>
                {deal.name}
              </h1>
              <p className="text-sm sm:text-base md:text-lg" style={{ color: COLOR_TEXT_SECONDARY }}>
                {deal.businessType}
              </p>

              {/* Location & Quick Facts */}
              <div className="flex flex-wrap gap-2 sm:gap-4 mt-4 text-xs sm:text-sm">
                <div className="flex items-center gap-2" style={{ color: COLOR_TEXT_SECONDARY }}>
                  <MapPin size={16} style={{ color: COLOR_ACCENT }} />
                  {deal.location}
                </div>
                <div className="flex items-center gap-2" style={{ color: COLOR_TEXT_SECONDARY }}>
                  <Users size={16} style={{ color: COLOR_ACCENT }} />
                  {deal.employees} employees
                </div>
                <div className="flex items-center gap-2" style={{ color: COLOR_TEXT_SECONDARY }}>
                  <Briefcase size={16} style={{ color: COLOR_ACCENT }} />
                  {deal.industry}
                </div>
              </div>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="p-4 sm:p-6 rounded-xl border"
              style={{ borderColor: COLOR_BORDER, background: COLOR_PRIMARY + '02' }}
            >
              <h2 className="font-bold text-base sm:text-lg mb-3" style={{ color: COLOR_PRIMARY }}>
                About This Business
              </h2>
              <p className="leading-relaxed text-sm sm:text-base" style={{ color: COLOR_TEXT_SECONDARY }}>
                {deal.description}
              </p>
            </motion.div>

            {/* Key Highlights */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              <h2 className="font-bold text-base sm:text-lg md:text-xl mb-3 sm:mb-4" style={{ color: COLOR_PRIMARY }}>
                Key Highlights
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3">
                {deal.keyHighlights.map((highlight, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-lg border" style={{ borderColor: COLOR_BORDER }}>
                    <CheckCircle2 size={18} className="sm:w-5 sm:h-5 flex-shrink-0" style={{ color: COLOR_ACCENT }} />
                    <span style={{ color: COLOR_PRIMARY }} className="text-xs sm:text-sm font-medium">
                      {highlight}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Financial Metrics Grid */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
              <h2 className="font-bold text-base sm:text-lg md:text-xl mb-3 sm:mb-4" style={{ color: COLOR_PRIMARY }}>
                Financial Overview
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
                {[
                  { label: 'Valuation', value: `$${(deal.valuation / 1000000).toFixed(1)}M`, icon: DollarSign, color: '#10B981' },
                  { label: 'Annual Revenue', value: `$${(deal.revenue / 1000).toFixed(0)}K`, icon: TrendingUp, color: '#3B82F6' },
                  { label: 'Cash Flow', value: `$${(deal.cashFlow / 1000).toFixed(0)}K`, icon: BarChart3, color: '#06B6D4' },
                  { label: 'EBITDA Margin', value: `${deal.ebitdaMargin}%`, icon: CheckCircle2, color: '#8B5CF6' },
                  { label: 'Growth Rate', value: `${deal.growthRate}% YoY`, icon: TrendingUp, color: '#F59E0B' },
                  { label: 'Customers', value: `${deal.customerCount.toLocaleString()}`, icon: Users, color: '#EC4899' },
                ].map((metric, idx) => {
                  const Icon = metric.icon
                  return (
                    <div key={idx} className="p-4 rounded-lg border" style={{ borderColor: COLOR_BORDER, background: 'white' }}>
                      <div className="flex items-center gap-2 mb-2">
                        <Icon size={18} style={{ color: metric.color }} />
                        <span className="text-xs font-bold uppercase" style={{ color: COLOR_TEXT_SECONDARY }}>
                          {metric.label}
                        </span>
                      </div>
                      <p className="text-lg font-black" style={{ color: COLOR_PRIMARY }}>
                        {metric.value}
                      </p>
                    </div>
                  )
                })}
              </div>
            </motion.div>

            {/* Business Model */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="p-6 rounded-xl border"
              style={{ borderColor: COLOR_BORDER, background: COLOR_ACCENT + '05' }}
            >
              <h3 className="font-bold text-lg mb-2" style={{ color: COLOR_PRIMARY }}>
                Business Model
              </h3>
              <p style={{ color: COLOR_TEXT_SECONDARY }}>{deal.businessModel}</p>
            </motion.div>

            {/* Market Comparables & Historical Data */}
            {deal.comparables && deal.comparables.length > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                <h2 className="font-bold text-xl mb-4" style={{ color: COLOR_PRIMARY }}>
                  📊 Market Comparables & Historical Data
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {deal.comparables.map((comp, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + idx * 0.05 }}
                      className="p-4 rounded-lg border hover:shadow-md transition-all cursor-pointer"
                      style={{
                        borderColor: COLOR_BORDER,
                        background: comp.type === 'Current Similar' ? COLOR_ACCENT + '05' : 'white',
                      }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-bold text-sm" style={{ color: COLOR_PRIMARY }}>
                            {comp.name}
                          </h4>
                          <span
                            className="inline-block text-xs font-bold px-2 py-1 rounded mt-1"
                            style={{
                              background: comp.type === 'Current Similar' ? COLOR_ACCENT + '30' : '#F3E8FF',
                              color: comp.type === 'Current Similar' ? COLOR_ACCENT : '#8B5CF6',
                            }}
                          >
                            {comp.type}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-xs font-bold" style={{ color: COLOR_TEXT_SECONDARY }}>
                            Valuation
                          </p>
                          <p className="font-black text-sm mt-1" style={{ color: COLOR_PRIMARY }}>
                            ${(comp.valuation / 1000000).toFixed(1)}M
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-bold" style={{ color: COLOR_TEXT_SECONDARY }}>
                            Revenue
                          </p>
                          <p className="font-black text-sm mt-1" style={{ color: COLOR_PRIMARY }}>
                            ${(comp.revenue / 1000).toFixed(0)}K
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-bold" style={{ color: COLOR_TEXT_SECONDARY }}>
                            Growth
                          </p>
                          <p className="font-black text-sm mt-1" style={{ color: '#10B981' }}>
                            {comp.growth}%
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-bold" style={{ color: COLOR_TEXT_SECONDARY }}>
                            Margin
                          </p>
                          <p className="font-black text-sm mt-1" style={{ color: COLOR_ACCENT }}>
                            {comp.margin}%
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-6 p-4 rounded-lg border" style={{ borderColor: COLOR_BORDER, background: COLOR_ACCENT + '10' }}>
                  <p className="text-sm" style={{ color: COLOR_PRIMARY }}>
                    <strong>💡 Insight:</strong> This deal's valuation and growth metrics are in line with current market comparables and historical precedents in the {deal.industry} space.
                  </p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            {/* AI Predictions Card */}
            <div className="p-6 rounded-xl border sticky top-24" style={{ borderColor: COLOR_BORDER, background: COLOR_PRIMARY + '02' }}>
              <h3 className="font-bold text-lg mb-4" style={{ color: COLOR_PRIMARY }}>
                AI Market Intelligence
              </h3>

              <div className="space-y-4">
                {[
                  { label: 'Success Probability', value: deal.successProbability, color: '#10B981', icon: CheckCircle2 },
                  { label: 'M&A Probability', value: deal.maaProbability, color: COLOR_ACCENT, icon: Target },
                  { label: 'Deal Heat Score', value: deal.heatScore, color: '#FF6B35', icon: Flame },
                ].map((metric, idx) => {
                  const Icon = metric.icon
                  return (
                    <div key={idx}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Icon size={16} style={{ color: metric.color }} />
                          <span className="text-sm font-bold" style={{ color: COLOR_PRIMARY }}>
                            {metric.label}
                          </span>
                        </div>
                        <span className="font-black text-lg" style={{ color: metric.color }}>
                          {metric.value}%
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full" style={{ background: COLOR_BORDER }}>
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${metric.value}%`, background: metric.color }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Seller Info */}
            <div className="p-6 rounded-xl border" style={{ borderColor: COLOR_BORDER, background: 'white' }}>
              <h3 className="font-bold text-lg mb-4" style={{ color: COLOR_PRIMARY }}>
                Seller Information
              </h3>

              <div className="space-y-3">
                <div>
                  <p className="text-xs font-bold uppercase" style={{ color: COLOR_TEXT_SECONDARY }}>
                    Seller Type
                  </p>
                  <p className="font-bold mt-1" style={{ color: COLOR_PRIMARY }}>
                    {deal.sellerType}
                  </p>
                </div>
                <div className="border-t pt-3" style={{ borderColor: COLOR_BORDER }}>
                  <p className="text-xs font-bold uppercase" style={{ color: COLOR_TEXT_SECONDARY }}>
                    Motivation
                  </p>
                  <p className="font-bold mt-1" style={{ color: COLOR_PRIMARY }}>
                    {deal.sellerMotivation}
                  </p>
                </div>
              </div>
            </div>

            {/* Target Buyers */}
            <div className="p-6 rounded-xl border" style={{ borderColor: COLOR_BORDER, background: 'white' }}>
              <h3 className="font-bold text-lg mb-4" style={{ color: COLOR_PRIMARY }}>
                Ideal for:
              </h3>
              <div className="space-y-2">
                {deal.targetBuyers.map((buyer, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm" style={{ color: COLOR_PRIMARY }}>
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ background: COLOR_ACCENT }}
                    />
                    {buyer}
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-2 sm:space-y-3">
              <button
                className="w-full py-3 sm:py-4 rounded-lg font-bold text-white hover:opacity-90 transition-all text-sm sm:text-base md:text-lg"
                style={{ background: COLOR_ACCENT, minHeight: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                Schedule Call with Seller
              </button>
              <Link
                href={`/deal/${dealId}/cim`}
                className="w-full py-3 sm:py-4 rounded-lg font-bold border transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
                style={{ borderColor: COLOR_BORDER, background: COLOR_ACCENT + '10', color: COLOR_PRIMARY, minHeight: '44px' }}
              >
                <BarChart3 size={18} className="sm:w-5 sm:h-5" />
                CIM Dashboard
              </Link>
              <button
                className="w-full py-3 sm:py-4 rounded-lg font-bold border transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
                style={{ borderColor: COLOR_BORDER, background: COLOR_ACCENT + '10', color: COLOR_PRIMARY, minHeight: '44px' }}
              >
                <Download size={18} className="sm:w-5 sm:h-5" />
                Download CIM
              </button>
              <Link
                href={`/my-favourites?view=${dealId}&compare=true`}
                className="w-full py-3 sm:py-4 rounded-lg font-bold border transition-all text-center text-sm sm:text-base flex items-center justify-center gap-2"
                style={{ borderColor: COLOR_BORDER, background: COLOR_ACCENT + '10', color: COLOR_PRIMARY, minHeight: '44px' }}
              >
                <BarChart3 size={18} className="sm:w-5 sm:h-5" />
                View in Comparison
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Photo Gallery Modal */}
      <BusinessPhotoGallery
        isOpen={photoModalOpen}
        onClose={() => setPhotoModalOpen(false)}
        photos={deal.photos}
        businessType={deal.businessType}
      />

      {/* Help Contact Widget */}
      <HelpContactWidget />

      {/* World Class Footer */}
      <WorldClassFooter />
    </div>
  )
}

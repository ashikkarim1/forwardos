'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronLeft, Flame, CheckCircle2, AlertCircle } from 'lucide-react'
import ComparableAnalyzer from '@/components/ComparableAnalyzer'
import MarketIntelligenceDashboard from '@/components/MarketIntelligenceDashboard'
import PredictiveIntelligence from '@/components/PredictiveIntelligence'
import RecommendationEngine from '@/components/RecommendationEngine'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER } from '@/styles/forward-colors'

const businessesData = [
  { 
    id: 1, 
    name: 'Prime Cut Steakhouse', 
    businessType: 'restaurant',
    category: 'F&B', 
    subcategory: 'Fine Dining Steakhouse', 
    description: 'Award-winning steakhouse with 20yr track record',
    heatScore: 92,
    valuation: '$8.5M',
    revenue: '$4.2M',
    ebitda: '$1.2M',
    foundedYear: 2004,
    team: 28,
    growth: '12%',
    seeking: 'none',
    ownerMotivation: 'retiring',
    image: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=600&h=400&fit=crop',
    verified: true,
    successProbability: 87,
  },
  // Add minimal data for other businesses
  { id: 2, name: 'Business 2', businessType: 'restaurant', category: 'F&B', subcategory: 'Casual', description: 'Test', heatScore: 80, valuation: '$5M', revenue: '$2.5M', ebitda: '$750K', foundedYear: 2015, team: 15, growth: '8%', seeking: 'none', ownerMotivation: 'growth', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop', verified: true, successProbability: 82 },
]

const getBusiness = (id: number) => businessesData.find(b => b.id === id)

type TabType = 'overview' | 'comparables' | 'intelligence' | 'predictions' | 'recommendations' | 'scenarios'

export default function DealDetailPageV2() {
  const params = useParams()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [isAuthed, setIsAuthed] = useState(false)
  const [loading, setLoading] = useState(true)

  const businessId = params?.id ? parseInt(params.id as string) : 0
  const business = businessId > 0 ? getBusiness(businessId) : null

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      router.push('/auth/login?redirect=' + window.location.pathname)
      return
    }
    setIsAuthed(true)
    setLoading(false)
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: COLOR_ACCENT }}></div>
          <p className="mt-4" style={{ color: COLOR_TEXT_SECONDARY }}>Loading deal intelligence...</p>
        </div>
      </div>
    )
  }

  if (!business) {
    return (
      <div className="min-h-screen bg-white p-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 mb-8 font-bold"
          style={{ color: COLOR_PRIMARY }}
        >
          <ChevronLeft size={20} />
          Back
        </button>
        <div className="text-center">
          <AlertCircle size={48} style={{ color: COLOR_TEXT_SECONDARY }} className="mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Deal Not Found</h1>
        </div>
      </div>
    )
  }

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'overview', label: '📋 Overview', icon: 'overview' },
    { id: 'comparables', label: '📊 Comparables', icon: 'comparables' },
    { id: 'intelligence', label: '🔮 Market Intelligence', icon: 'intelligence' },
    { id: 'predictions', label: '🤖 AI Predictions', icon: 'predictions' },
    { id: 'recommendations', label: '💡 Recommendations', icon: 'recommendations' },
    { id: 'scenarios', label: '📈 Scenarios', icon: 'scenarios' },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b bg-white p-6" style={{ borderColor: COLOR_BORDER }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 font-bold"
            style={{ color: COLOR_PRIMARY }}
          >
            <ChevronLeft size={20} />
            Back to Marketplace
          </button>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ background: COLOR_ACCENT + '20' }}>
            <Flame size={18} style={{ color: COLOR_ACCENT }} />
            <span className="font-bold" style={{ color: COLOR_ACCENT }}>Heat {business.heatScore}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Hero */}
        <div className="mb-8">
          <h1 className="text-4xl font-black mb-2" style={{ color: COLOR_PRIMARY }}>
            {business.name}
          </h1>
          <p className="text-lg mb-4" style={{ color: COLOR_TEXT_SECONDARY }}>
            {business.description}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div>
              <p className="text-xs uppercase font-bold mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>Valuation</p>
              <p className="text-2xl font-black" style={{ color: COLOR_ACCENT }}>{business.valuation}</p>
            </div>
            <div>
              <p className="text-xs uppercase font-bold mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>Revenue</p>
              <p className="text-2xl font-black" style={{ color: COLOR_PRIMARY }}>{business.revenue}</p>
            </div>
            <div>
              <p className="text-xs uppercase font-bold mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>EBITDA</p>
              <p className="text-2xl font-black text-green-600">{business.ebitda}</p>
            </div>
            <div>
              <p className="text-xs uppercase font-bold mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>Growth</p>
              <p className="text-2xl font-black text-blue-600">{business.growth}</p>
            </div>
          </div>

          {business.verified && (
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 size={20} style={{ color: COLOR_ACCENT }} />
              <span className="font-bold" style={{ color: COLOR_ACCENT }}>
                ✅ Verified & Authenticated • {business.successProbability}% Acquisition Probability
              </span>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex gap-2 border-b overflow-x-auto" style={{ borderColor: COLOR_BORDER }}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 font-bold text-sm whitespace-nowrap border-b-2 transition-all ${
                  activeTab === tab.id ? 'border-b-2' : 'border-b-transparent'
                }`}
                style={{
                  borderColor: activeTab === tab.id ? COLOR_ACCENT : 'transparent',
                  color: activeTab === tab.id ? COLOR_ACCENT : COLOR_TEXT_SECONDARY,
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-6 rounded-lg border"
                  style={{ borderColor: COLOR_BORDER }}
                >
                  <h3 className="font-bold mb-4" style={{ color: COLOR_PRIMARY }}>Company Profile</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span style={{ color: COLOR_TEXT_SECONDARY }}>Founded</span>
                      <span className="font-bold" style={{ color: COLOR_PRIMARY }}>{business.foundedYear}</span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: COLOR_TEXT_SECONDARY }}>Team Size</span>
                      <span className="font-bold" style={{ color: COLOR_PRIMARY }}>{business.team} people</span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: COLOR_TEXT_SECONDARY }}>Category</span>
                      <span className="font-bold" style={{ color: COLOR_PRIMARY }}>{business.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: COLOR_TEXT_SECONDARY }}>Status</span>
                      <span className="font-bold" style={{ color: COLOR_ACCENT }}>
                        {business.ownerMotivation === 'retiring' && '🕐 Owner Retiring'}
                        {business.ownerMotivation === 'growth' && '📈 Growth Mode'}
                        {business.ownerMotivation === 'portfolio_liquidation' && '💼 Liquidating'}
                      </span>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="p-6 rounded-lg"
                  style={{ background: COLOR_ACCENT + '15', border: `1px solid ${COLOR_ACCENT}` }}
                >
                  <h3 className="font-bold mb-4" style={{ color: COLOR_ACCENT }}>⭐ Deal Quality</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p style={{ color: COLOR_TEXT_SECONDARY }}>Market Position</p>
                      <p className="text-lg font-bold" style={{ color: COLOR_ACCENT }}>A+ Grade</p>
                    </div>
                    <div>
                      <p style={{ color: COLOR_TEXT_SECONDARY }}>Acquisition Probability</p>
                      <p className="text-lg font-bold text-green-600">{business.successProbability}%</p>
                    </div>
                    <div>
                      <p style={{ color: COLOR_TEXT_SECONDARY }}>Verification Status</p>
                      <p className="text-sm font-bold" style={{ color: COLOR_ACCENT }}>✅ Fully Verified</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          )}

          {activeTab === 'comparables' && (
            <ComparableAnalyzer business={business} />
          )}

          {activeTab === 'intelligence' && (
            <MarketIntelligenceDashboard business={business} />
          )}

          {activeTab === 'predictions' && (
            <PredictiveIntelligence business={business} />
          )}

          {activeTab === 'recommendations' && (
            <RecommendationEngine business={business} />
          )}

          {activeTab === 'scenarios' && (
            <div className="p-6 rounded-lg border" style={{ borderColor: COLOR_BORDER }}>
              <h3 className="font-bold mb-4" style={{ color: COLOR_PRIMARY }}>Rollup Scenarios</h3>
              <p style={{ color: COLOR_TEXT_SECONDARY }}>
                Coming soon: Build acquisition scenarios, combine with other businesses, and see pro forma outcomes
              </p>
            </div>
          )}
        </motion.div>

        {/* Contact Section */}
        <div className="mt-12 border-t pt-8" style={{ borderColor: COLOR_BORDER }}>
          <h3 className="font-bold mb-4" style={{ color: COLOR_PRIMARY }}>
            Ready to Acquire?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="#"
              className="p-4 rounded-lg border text-center font-bold"
              style={{ borderColor: COLOR_ACCENT, background: COLOR_ACCENT + '10' }}
            >
              📧 Email Seller
            </Link>
            <Link
              href="#"
              className="p-4 rounded-lg border text-center font-bold"
              style={{ borderColor: COLOR_ACCENT, background: COLOR_ACCENT + '10' }}
            >
              💬 Message Broker
            </Link>
            <Link
              href="#"
              className="p-4 rounded-lg border text-center font-bold"
              style={{ borderColor: COLOR_ACCENT, background: COLOR_ACCENT + '10' }}
            >
              📞 Schedule Call
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

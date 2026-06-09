'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useLocale } from '@/context/LocaleContext'
import { MarketplaceSearch, DealComparison } from '@/components/MarketplaceSearch'
import { ArrowRight, TrendingUp, Users, Zap } from 'lucide-react'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER } from '@/styles/forward-colors'

// Mock deal data
const mockDeals = [
  {
    id: '1',
    name: 'TechFlow SaaS',
    industry: 'SaaS / Software',
    valuation: 2500000,
    revenue: 850000,
    ebitda: 187000,
    ebitdaMargin: 22,
    growthRate: 45,
    location: 'United States',
    successProbability: 92,
    heatScore: 88,
    employees: 12,
    customerCount: 187,
  },
  {
    id: '2',
    name: 'CloudFirst Analytics',
    industry: 'SaaS / Software',
    valuation: 5800000,
    revenue: 1900000,
    ebitda: 456000,
    ebitdaMargin: 24,
    growthRate: 62,
    location: 'Canada',
    successProbability: 87,
    heatScore: 92,
    employees: 18,
    customerCount: 342,
  },
  {
    id: '3',
    name: 'Emirates E-Commerce',
    industry: 'E-Commerce',
    valuation: 3200000,
    revenue: 1100000,
    ebitda: 220000,
    ebitdaMargin: 20,
    growthRate: 78,
    location: 'United Arab Emirates',
    successProbability: 85,
    heatScore: 95,
    employees: 15,
    customerCount: 12400,
  },
  {
    id: '4',
    name: 'MediCare Solutions',
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
  },
  {
    id: '5',
    name: 'FoodChain Restaurant Group',
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
  },
  {
    id: '6',
    name: 'LogisticsPro Hub',
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
  },
]

export default function MarketplacePage() {
  const { locale, isRTL } = useLocale()
  const [selectedDeals, setSelectedDeals] = useState<string[]>([])
  const [deals] = useState(mockDeals)

  const toggleDealSelection = (dealId: string) => {
    setSelectedDeals((prev) =>
      prev.includes(dealId) ? prev.filter((id) => id !== dealId) : [...prev.slice(-4), dealId]
    )
  }

  const selectedDealObjects = deals.filter((d) => selectedDeals.includes(d.id))

  return (
    <div className="min-h-screen bg-white" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="border-b py-12 px-4 sm:px-6 lg:px-8" style={{ borderColor: COLOR_BORDER }}>
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-black mb-2" style={{ color: COLOR_PRIMARY }}>
            Browse Deals
          </h1>
          <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-lg">
            47+ verified businesses for sale. Search, compare, and analyze with AI insights.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Search Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <MarketplaceSearch dealCount={deals.length} />
              </div>
            </div>

            {/* Deals Grid */}
            <div className="lg:col-span-3 space-y-6">
              {/* Deals List */}
              <div className="space-y-4">
                {deals.map((deal) => (
                  <motion.div
                    key={deal.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-6 rounded-lg border cursor-pointer transition-all ${
                      selectedDeals.includes(deal.id) ? 'ring-2' : 'hover:border-opacity-50'
                    }`}
                    style={{
                      borderColor: COLOR_BORDER,
                      
                      background: selectedDeals.includes(deal.id) ? COLOR_ACCENT + '05' : 'white',
                    }}
                    onClick={() => toggleDealSelection(deal.id)}
                  >
                    <div className={`flex gap-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      {/* Selection Checkbox */}
                      <div className="flex-shrink-0">
                        <input
                          type="checkbox"
                          checked={selectedDeals.includes(deal.id)}
                          onChange={() => toggleDealSelection(deal.id)}
                          className="w-5 h-5 rounded mt-1"
                          style={{ accentColor: COLOR_ACCENT }}
                        />
                      </div>

                      {/* Deal Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg mb-2" style={{ color: COLOR_PRIMARY }}>
                          {deal.name}
                        </h3>

                        <div
                          className={`flex flex-wrap gap-4 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}
                        >
                          <div>
                            <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-xs">
                              Valuation
                            </p>
                            <p className="font-bold" style={{ color: COLOR_PRIMARY }}>
                              ${(deal.valuation / 1000000).toFixed(1)}M
                            </p>
                          </div>
                          <div>
                            <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-xs">
                              Revenue
                            </p>
                            <p className="font-bold" style={{ color: COLOR_PRIMARY }}>
                              ${(deal.revenue / 1000000).toFixed(2)}M
                            </p>
                          </div>
                          <div>
                            <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-xs">
                              EBITDA Margin
                            </p>
                            <p className="font-bold" style={{ color: COLOR_PRIMARY }}>
                              {deal.ebitdaMargin}%
                            </p>
                          </div>
                          <div>
                            <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-xs">
                              Growth
                            </p>
                            <p className="font-bold" style={{ color: COLOR_PRIMARY }}>
                              {deal.growthRate}% YoY
                            </p>
                          </div>
                        </div>

                        <div
                          className={`flex flex-wrap gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}
                        >
                          <span
                            className="px-2 py-1 rounded text-xs font-semibold"
                            style={{ background: COLOR_ACCENT + '15', color: COLOR_ACCENT }}
                          >
                            {deal.industry}
                          </span>
                          <span
                            className="px-2 py-1 rounded text-xs font-semibold"
                            style={{ background: '#E8F5E9', color: '#2E7D32' }}
                          >
                            Success {deal.successProbability}%
                          </span>
                          <span
                            className="px-2 py-1 rounded text-xs font-semibold"
                            style={{ background: '#FFF3E0', color: '#E65100' }}
                          >
                            Heat {deal.heatScore}
                          </span>
                        </div>
                      </div>

                      {/* CTA */}
                      <div className="flex-shrink-0 flex flex-col justify-center">
                        <Link
                          href={`/deal/${deal.id}`}
                          className="px-4 py-2 rounded-lg font-semibold text-white transition-all hover:opacity-90"
                          style={{ background: COLOR_ACCENT }}
                        >
                          View <ArrowRight className="inline ml-1" size={16} />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Comparison Panel */}
              {selectedDealObjects.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 rounded-lg border"
                  style={{ borderColor: COLOR_ACCENT, background: COLOR_ACCENT + '05' }}
                >
                  <h3 className="font-bold text-lg mb-4" style={{ color: COLOR_PRIMARY }}>
                    Comparing {selectedDealObjects.length} Deal{selectedDealObjects.length !== 1 ? 's' : ''}
                  </h3>
                  <DealComparison selectedDeals={selectedDealObjects} />
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div
        className="py-16 px-4 sm:px-6 lg:px-8 border-t"
        style={{ borderColor: COLOR_BORDER, background: COLOR_PRIMARY + '02' }}
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black mb-12 text-center" style={{ color: COLOR_PRIMARY }}>
            Marketplace Advantages
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: TrendingUp,
                title: '10 Filter Categories',
                desc: 'Find deals by industry, valuation, growth, heat score, and more.',
              },
              {
                icon: Users,
                title: 'Side-by-Side Comparison',
                desc: 'Compare up to 5 deals at once. See all key metrics at a glance.',
              },
              {
                icon: Zap,
                title: 'AI Predictions',
                desc: 'Success probability and deal heat scores updated in real-time.',
              },
            ].map((benefit, idx) => {
              const Icon = benefit.icon
              return (
                <div key={idx} className="p-6 rounded-lg border" style={{ borderColor: COLOR_BORDER }}>
                  <Icon size={32} style={{ color: COLOR_ACCENT }} className="mb-4" />
                  <h3 className="font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
                    {benefit.title}
                  </h3>
                  <p style={{ color: COLOR_TEXT_SECONDARY }}>{benefit.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

import { Suspense, useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { useLocale } from '@/context/LocaleContext'
import { HelpContactWidget } from '@/components/HelpContactWidget'
import { WorldClassFooter } from '@/components/WorldClassFooter'
import {
  ArrowLeft,
  Star,
  Trash2,
  Download,
  TrendingUp,
  DollarSign,
  BarChart3,
  CheckCircle2,
  Plus,
  Zap,
  AlertCircle,
  Target,
  Flame,
} from 'lucide-react'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER } from '@/styles/forward-colors'

interface Deal {
  id: string
  name: string
  businessType: string
  industry: string
  location: string
  valuation: number
  revenue: number
  growthRate: number
  ebitdaMargin: number
  successProbability: number
  heatScore: number
  maaProbability: number
  employees: number
}

interface DeltaInsight {
  type: string
  severity: 'positive' | 'caution' | 'opportunity' | 'neutral'
  text: string
}

// Mock deal database with full data
const dealDatabase: Record<string, Deal> = {
  'deal-1': {
    id: 'deal-1',
    name: 'TechFlow SaaS',
    businessType: 'SaaS Platform - Project Management',
    industry: 'SaaS / Software',
    location: 'San Francisco, CA',
    valuation: 2500000,
    revenue: 850000,
    growthRate: 45,
    ebitdaMargin: 22,
    successProbability: 92,
    heatScore: 88,
    maaProbability: 87,
    employees: 12,
  },
  'deal-2': {
    id: 'deal-2',
    name: 'CloudFirst Analytics',
    businessType: 'Analytics Platform - Business Intelligence',
    industry: 'SaaS / Software',
    location: 'Toronto, ON',
    valuation: 5800000,
    revenue: 1900000,
    growthRate: 62,
    ebitdaMargin: 24,
    successProbability: 87,
    heatScore: 92,
    maaProbability: 91,
    employees: 18,
  },
  'deal-3': {
    id: 'deal-3',
    name: 'Emirates Franchise Network',
    businessType: 'Franchise Management - Network Operations',
    industry: 'Franchise / Network',
    location: 'Dubai, UAE',
    valuation: 12000000,
    revenue: 3200000,
    growthRate: 28,
    ebitdaMargin: 24,
    successProbability: 74,
    heatScore: 85,
    maaProbability: 62,
    employees: 35,
  },
}

// Historical comparable deals
const historicalComparables: Record<string, Deal[]> = {
  'SaaS / Software': [
    {
      id: 'hist-1',
      name: 'ProjectFlow (Sold 2023)',
      businessType: 'SaaS - Project Management',
      industry: 'SaaS / Software',
      location: 'San Francisco, CA',
      valuation: 2200000,
      revenue: 750000,
      growthRate: 42,
      ebitdaMargin: 20,
      successProbability: 85,
      heatScore: 82,
      maaProbability: 80,
      employees: 11,
    },
    {
      id: 'hist-2',
      name: 'WorkSync (Sold 2024)',
      businessType: 'SaaS - Collaboration',
      industry: 'SaaS / Software',
      location: 'Boston, MA',
      valuation: 3100000,
      revenue: 920000,
      growthRate: 48,
      ebitdaMargin: 23,
      successProbability: 89,
      heatScore: 87,
      maaProbability: 85,
      employees: 14,
    },
  ],
  'Franchise / Network': [
    {
      id: 'hist-3',
      name: 'GCC Franchise Corp (Sold 2023)',
      businessType: 'Franchise Network',
      industry: 'Franchise / Network',
      location: 'Dubai, UAE',
      valuation: 10200000,
      revenue: 2900000,
      growthRate: 26,
      ebitdaMargin: 23,
      successProbability: 71,
      heatScore: 81,
      maaProbability: 58,
      employees: 32,
    },
    {
      id: 'hist-4',
      name: 'Emirates Trading Group (Sold 2024)',
      businessType: 'Network Operations',
      industry: 'Franchise / Network',
      location: 'Dubai, UAE',
      valuation: 12100000,
      revenue: 3200000,
      growthRate: 29,
      ebitdaMargin: 24,
      successProbability: 75,
      heatScore: 84,
      maaProbability: 61,
      employees: 36,
    },
  ],
}

function MyFavouritesContent() {
  const { locale, isRTL } = useLocale()
  const searchParams = useSearchParams()
  const viewDealId = searchParams?.get('view')
  const compareMode = searchParams?.get('compare') === 'true'

  const [favourites, setFavourites] = useState<string[]>([])
  const [selectedDeals, setSelectedDeals] = useState<string[]>([])
  const [showCompareModal, setShowCompareModal] = useState(false)

  useEffect(() => {
    // Try to load from localStorage
    try {
      const saved = localStorage.getItem('forward_favourites')
      if (saved) {
        setFavourites(JSON.parse(saved))
      }
    } catch (e) {
      console.error('Error loading favourites:', e)
    }

    // If coming from deal detail with view param, auto-select it
    if (viewDealId && compareMode) {
      setSelectedDeals([viewDealId])
      // Also add to favourites if not already there
      setFavourites((prev) => {
        if (!prev.includes(viewDealId)) {
          const updated = [...prev, viewDealId]
          localStorage.setItem('forward_favourites', JSON.stringify(updated))
          return updated
        }
        return prev
      })
    }
  }, [viewDealId, compareMode])

  const favoriteDealObjects = (favourites.length > 0 ? favourites : (viewDealId ? [viewDealId] : []))
    .map((id) => dealDatabase[id])
    .filter(Boolean)

  const selectedDealObjects = selectedDeals
    .map((id) => dealDatabase[id])
    .filter(Boolean)

  // Get historical comparables for selected deals
  const getHistoricalComparables = (industry: string) => {
    return historicalComparables[industry] || []
  }

  const toggleDealSelection = (dealId: string) => {
    setSelectedDeals((prev) =>
      prev.includes(dealId)
        ? prev.filter((id) => id !== dealId)
        : [...prev.slice(-4), dealId]
    )
  }

  const removeFavourite = (dealId: string) => {
    const updated = favourites.filter((id) => id !== dealId)
    setFavourites(updated)
    localStorage.setItem('forward_favourites', JSON.stringify(updated))
    setSelectedDeals((prev) => prev.filter((id) => id !== dealId))
  }

  // Calculate delta analysis vs historical comparables
  const calculateDeltaAnalysis = (currentDeal: Deal) => {
    const comparables = getHistoricalComparables(currentDeal.industry)
    if (comparables.length === 0) return null

    const avgHistValuation = comparables.reduce((sum, d) => sum + d.valuation, 0) / comparables.length
    const avgHistGrowth = comparables.reduce((sum, d) => sum + d.growthRate, 0) / comparables.length
    const avgHistSuccess = comparables.reduce((sum, d) => sum + d.successProbability, 0) / comparables.length
    const avgHistMargin = comparables.reduce((sum, d) => sum + d.ebitdaMargin, 0) / comparables.length

    const valuationDeltaPct = ((currentDeal.valuation - avgHistValuation) / avgHistValuation) * 100
    const growthDelta = currentDeal.growthRate - avgHistGrowth
    const successDelta = currentDeal.successProbability - avgHistSuccess
    const marginDelta = currentDeal.ebitdaMargin - avgHistMargin

    return {
      historicalMedian: {
        valuation: avgHistValuation,
        growth: avgHistGrowth,
        success: avgHistSuccess,
        margin: avgHistMargin,
      },
      deltas: {
        valuation: { pct: valuationDeltaPct, abs: currentDeal.valuation - avgHistValuation },
        growth: growthDelta,
        success: successDelta,
        margin: marginDelta,
      },
    }
  }

  // Generate AI delta insights
  const generateDeltaInsights = (deal: Deal, deltaAnalysis: any): DeltaInsight[] => {
    if (!deltaAnalysis) return []

    const insights: DeltaInsight[] = []
    const { deltas } = deltaAnalysis

    // Valuation insight
    if (deltas.valuation.pct > 15) {
      insights.push({
        type: 'valuation',
        severity: 'positive',
        text: `Premium valuation: This deal commands a ${deltas.valuation.pct.toFixed(1)}% premium vs. historical comparables, justified by ${deal.growthRate > 50 ? 'exceptional growth trajectory' : 'superior market position'}.`,
      })
    } else if (deltas.valuation.pct < -15) {
      insights.push({
        type: 'valuation',
        severity: 'opportunity',
        text: `Valuation discount: Trading at ${Math.abs(deltas.valuation.pct).toFixed(1)}% discount vs. historical deals. Strong acquisition opportunity if fundamentals are solid.`,
      })
    } else {
      insights.push({
        type: 'valuation',
        severity: 'neutral',
        text: `Fair valuation: Priced within historical market range (${deltas.valuation.pct > 0 ? '+' : ''}${deltas.valuation.pct.toFixed(1)}% vs. comparables).`,
      })
    }

    // Growth insight
    if (deltas.growth > 10) {
      insights.push({
        type: 'growth',
        severity: 'positive',
        text: `High-growth asset: ${deltas.growth.toFixed(0)}% above historical growth rates. Shows momentum and scaling potential above market average.`,
      })
    } else if (deltas.growth < -10) {
      insights.push({
        type: 'growth',
        severity: 'caution',
        text: `Growth concerns: ${Math.abs(deltas.growth).toFixed(0)}% below historical norms. Investigate market saturation or competitive pressures.`,
      })
    }

    // Success probability insight
    if (deltas.success > 10) {
      insights.push({
        type: 'success',
        severity: 'positive',
        text: `Superior fundamentals: ${deltas.success.toFixed(0)}% higher success probability than historical precedents. Strong execution capability and market fit.`,
      })
    } else if (deltas.success < -10) {
      insights.push({
        type: 'success',
        severity: 'caution',
        text: `Execution risk: Success probability ${Math.abs(deltas.success).toFixed(0)}% below historical baseline. Requires deeper due diligence on operational risks.`,
      })
    }

    // Margin insight
    if (deltas.margin > 3) {
      insights.push({
        type: 'margin',
        severity: 'positive',
        text: `Exceptional profitability: ${deltas.margin.toFixed(1)}% higher EBITDA margin than historical peers. Suggests operational excellence and pricing power.`,
      })
    } else if (deltas.margin < -3) {
      insights.push({
        type: 'margin',
        severity: 'caution',
        text: `Margin pressure: EBITDA margin ${Math.abs(deltas.margin).toFixed(1)}% below historical norms. May indicate cost structure or competitive challenges.`,
      })
    }

    return insights
  }

  // Calculate AI insights
  const calculateAIInsights = (deals: Deal[]) => {
    if (deals.length === 0) return null

    const avgValuation = deals.reduce((sum, d) => sum + d.valuation, 0) / deals.length
    const avgGrowth = deals.reduce((sum, d) => sum + d.growthRate, 0) / deals.length
    const avgSuccess = deals.reduce((sum, d) => sum + d.successProbability, 0) / deals.length
    const totalRevenue = deals.reduce((sum, d) => sum + d.revenue, 0)

    return {
      avgValuation,
      avgGrowth,
      avgSuccess,
      totalRevenue,
      dealCount: deals.length,
    }
  }

  const insights = calculateAIInsights(selectedDealObjects)

  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <div className="min-h-screen bg-white" dir={isRTL ? 'rtl' : 'ltr'}>
        {/* Header */}
        <div
          className="border-b sticky top-0 z-40 bg-white"
          style={{ borderColor: COLOR_BORDER }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <Link
              href="/marketplace"
              className="flex items-center gap-2 font-bold hover:opacity-80 transition-opacity"
              style={{ color: COLOR_PRIMARY }}
            >
              <ArrowLeft size={20} />
              Back to Marketplace
            </Link>

            <h1 className="text-2xl font-bold" style={{ color: COLOR_PRIMARY }}>
              Advanced Deal Comparison
            </h1>

            <div className="w-20" />
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {favoriteDealObjects.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <Star size={48} style={{ color: COLOR_ACCENT }} className="mx-auto mb-4 opacity-50" />
              <h2 className="text-2xl font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
                No Deals Selected Yet
              </h2>
              <p style={{ color: COLOR_TEXT_SECONDARY }} className="mb-6">
                Browse the marketplace and click "View in Comparison" or save deals to start analyzing.
              </p>
              <Link
                href="/marketplace"
                className="inline-block px-6 py-3 rounded-lg font-bold text-white hover:opacity-90 transition-opacity"
                style={{ background: COLOR_ACCENT }}
              >
                Browse Marketplace
              </Link>
            </motion.div>
          ) : (
            <>
              {/* Available Deals to Compare */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-12">
                <h2 className="text-xl font-bold mb-6" style={{ color: COLOR_PRIMARY }}>
                  📌 Select Deals to Compare ({favoriteDealObjects.length})
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {favoriteDealObjects.map((deal, idx) => (
                    <motion.div
                      key={deal.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className={`p-6 rounded-xl border transition-all cursor-pointer flex flex-col ${
                        selectedDeals.includes(deal.id) ? 'ring-2' : ''
                      }`}
                      onClick={() => toggleDealSelection(deal.id)}
                      style={{
                        borderColor: selectedDeals.includes(deal.id) ? COLOR_ACCENT : COLOR_BORDER,
                        background: selectedDeals.includes(deal.id) ? COLOR_ACCENT + '05' : 'white',
                      }}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-bold text-lg" style={{ color: COLOR_PRIMARY }}>
                            {deal.name}
                          </h3>
                          <p className="text-sm mt-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                            {deal.businessType}
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={selectedDeals.includes(deal.id)}
                          onChange={() => toggleDealSelection(deal.id)}
                          className="w-5 h-5 rounded cursor-pointer"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>

                      <div className="space-y-2 mb-4 pb-4 border-b" style={{ borderColor: COLOR_BORDER }}>
                        <div className="flex justify-between text-sm">
                          <span style={{ color: COLOR_TEXT_SECONDARY }}>Valuation</span>
                          <span className="font-bold" style={{ color: COLOR_PRIMARY }}>
                            ${(deal.valuation / 1000000).toFixed(1)}M
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span style={{ color: COLOR_TEXT_SECONDARY }}>Growth</span>
                          <span className="font-bold" style={{ color: '#10B981' }}>
                            {deal.growthRate}%
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span style={{ color: COLOR_TEXT_SECONDARY }}>Success</span>
                          <span className="font-bold" style={{ color: COLOR_ACCENT }}>
                            {deal.successProbability}%
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Link
                          href={`/deal/${deal.id}`}
                          className="flex-1 py-2 rounded-lg font-bold text-sm text-center transition-all"
                          style={{ background: COLOR_ACCENT + '20', color: COLOR_ACCENT }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          View Deal
                        </Link>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            removeFavourite(deal.id)
                          }}
                          className="px-3 py-2 rounded-lg border hover:bg-red-50 transition-colors"
                          style={{ borderColor: COLOR_BORDER, color: '#EF4444' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Compare Deals Button */}
                {selectedDealObjects.length >= 2 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-center mb-8"
                  >
                    <button
                      onClick={() => setShowCompareModal(true)}
                      className="flex items-center gap-2 px-8 py-3 rounded-lg font-bold text-white hover:opacity-90 transition-all text-lg"
                      style={{ background: COLOR_ACCENT }}
                    >
                      <BarChart3 size={20} />
                      Compare Selected Deals
                    </button>
                  </motion.div>
                )}
              </motion.div>

              {/* Compare Deals Modal */}
              {showCompareModal && selectedDealObjects.length >= 2 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
                  onClick={() => setShowCompareModal(false)}
                >
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white rounded-xl max-w-7xl w-full max-h-[90vh] overflow-y-auto p-8"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Modal Header */}
                    <div className="flex items-center justify-between mb-8 sticky top-0 bg-white pb-4 border-b" style={{ borderColor: COLOR_BORDER }}>
                      <div className="flex items-center gap-3">
                        <BarChart3 size={28} style={{ color: COLOR_ACCENT }} />
                        <h2 className="text-3xl font-bold" style={{ color: COLOR_PRIMARY }}>
                          Side-by-Side Deal Comparison
                        </h2>
                      </div>
                      <button
                        onClick={() => setShowCompareModal(false)}
                        className="text-2xl hover:opacity-50 transition-opacity"
                        style={{ color: COLOR_TEXT_SECONDARY }}
                      >
                        ✕
                      </button>
                    </div>

                    {/* Comparison Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr style={{ borderBottom: `2px solid ${COLOR_BORDER}`, background: COLOR_PRIMARY + '02' }}>
                            <th className="p-4 text-left font-bold sticky left-0 bg-white" style={{ borderRight: `1px solid ${COLOR_BORDER}`, color: COLOR_PRIMARY }}>
                              Metric
                            </th>
                            {selectedDealObjects.map((deal) => (
                              <th key={deal.id} className="p-4 text-center font-bold min-w-[200px]" style={{ color: COLOR_PRIMARY }}>
                                <div style={{ color: COLOR_ACCENT }} className="font-black text-lg">
                                  Deal {selectedDealObjects.indexOf(deal) + 1}
                                </div>
                                <div style={{ color: COLOR_TEXT_SECONDARY }} className="text-sm font-normal mt-1">
                                  {deal.name}
                                </div>
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {/* Scope & Business Type */}
                          <tr style={{ borderBottom: `1px solid ${COLOR_BORDER}` }}>
                            <td className="p-4 font-bold sticky left-0 bg-white" style={{ borderRight: `1px solid ${COLOR_BORDER}`, color: COLOR_PRIMARY }}>
                              Business Type
                            </td>
                            {selectedDealObjects.map((deal) => (
                              <td key={deal.id} className="p-4 text-center" style={{ color: COLOR_TEXT_SECONDARY }}>
                                {deal.businessType}
                              </td>
                            ))}
                          </tr>

                          <tr style={{ borderBottom: `1px solid ${COLOR_BORDER}`, background: COLOR_PRIMARY + '02' }}>
                            <td className="p-4 font-bold sticky left-0 bg-white" style={{ borderRight: `1px solid ${COLOR_BORDER}`, color: COLOR_PRIMARY, background: COLOR_PRIMARY + '02' }}>
                              Location
                            </td>
                            {selectedDealObjects.map((deal) => (
                              <td key={deal.id} className="p-4 text-center" style={{ color: COLOR_TEXT_SECONDARY }}>
                                {deal.location}
                              </td>
                            ))}
                          </tr>

                          <tr style={{ borderBottom: `1px solid ${COLOR_BORDER}` }}>
                            <td className="p-4 font-bold sticky left-0 bg-white" style={{ borderRight: `1px solid ${COLOR_BORDER}`, color: COLOR_PRIMARY }}>
                              Employees
                            </td>
                            {selectedDealObjects.map((deal) => (
                              <td key={deal.id} className="p-4 text-center font-bold" style={{ color: COLOR_ACCENT }}>
                                {deal.employees}
                              </td>
                            ))}
                          </tr>

                          {/* Size Metrics */}
                          <tr style={{ borderBottom: `1px solid ${COLOR_BORDER}`, background: COLOR_PRIMARY + '02' }}>
                            <td className="p-4 font-bold sticky left-0 bg-white" style={{ borderRight: `1px solid ${COLOR_BORDER}`, color: COLOR_PRIMARY, background: COLOR_PRIMARY + '02' }}>
                              Valuation
                            </td>
                            {selectedDealObjects.map((deal) => (
                              <td key={deal.id} className="p-4 text-center font-black text-lg" style={{ color: '#3B82F6' }}>
                                ${(deal.valuation / 1000000).toFixed(1)}M
                              </td>
                            ))}
                          </tr>

                          <tr style={{ borderBottom: `1px solid ${COLOR_BORDER}` }}>
                            <td className="p-4 font-bold sticky left-0 bg-white" style={{ borderRight: `1px solid ${COLOR_BORDER}`, color: COLOR_PRIMARY }}>
                              Annual Revenue
                            </td>
                            {selectedDealObjects.map((deal) => (
                              <td key={deal.id} className="p-4 text-center font-black text-lg" style={{ color: '#10B981' }}>
                                ${(deal.revenue / 1000000).toFixed(2)}M
                              </td>
                            ))}
                          </tr>

                          {/* Financial Metrics */}
                          <tr style={{ borderBottom: `1px solid ${COLOR_BORDER}`, background: COLOR_PRIMARY + '02' }}>
                            <td className="p-4 font-bold sticky left-0 bg-white" style={{ borderRight: `1px solid ${COLOR_BORDER}`, color: COLOR_PRIMARY, background: COLOR_PRIMARY + '02' }}>
                              EBITDA Margin
                            </td>
                            {selectedDealObjects.map((deal) => (
                              <td key={deal.id} className="p-4 text-center font-bold" style={{ color: '#F59E0B' }}>
                                {deal.ebitdaMargin}%
                              </td>
                            ))}
                          </tr>

                          <tr style={{ borderBottom: `1px solid ${COLOR_BORDER}` }}>
                            <td className="p-4 font-bold sticky left-0 bg-white" style={{ borderRight: `1px solid ${COLOR_BORDER}`, color: COLOR_PRIMARY }}>
                              Revenue per Employee
                            </td>
                            {selectedDealObjects.map((deal) => (
                              <td key={deal.id} className="p-4 text-center font-bold" style={{ color: '#8B5CF6' }}>
                                ${((deal.revenue / deal.employees) / 1000).toFixed(0)}K
                              </td>
                            ))}
                          </tr>

                          {/* Growth & Performance */}
                          <tr style={{ borderBottom: `1px solid ${COLOR_BORDER}`, background: COLOR_PRIMARY + '02' }}>
                            <td className="p-4 font-bold sticky left-0 bg-white" style={{ borderRight: `1px solid ${COLOR_BORDER}`, color: COLOR_PRIMARY, background: COLOR_PRIMARY + '02' }}>
                              YoY Growth Rate
                            </td>
                            {selectedDealObjects.map((deal) => (
                              <td key={deal.id} className="p-4 text-center font-black text-lg" style={{ color: '#10B981' }}>
                                {deal.growthRate}%
                              </td>
                            ))}
                          </tr>

                          {/* Deal Quality Metrics */}
                          <tr style={{ borderBottom: `1px solid ${COLOR_BORDER}` }}>
                            <td className="p-4 font-bold sticky left-0 bg-white" style={{ borderRight: `1px solid ${COLOR_BORDER}`, color: COLOR_PRIMARY }}>
                              Success Probability
                            </td>
                            {selectedDealObjects.map((deal) => (
                              <td key={deal.id} className="p-4 text-center font-bold" style={{ color: COLOR_ACCENT }}>
                                <div className="text-lg">{deal.successProbability}%</div>
                                <div
                                  className="h-1 rounded mt-2 mx-auto w-24"
                                  style={{ background: COLOR_BORDER }}
                                >
                                  <div
                                    className="h-1 rounded"
                                    style={{
                                      width: `${deal.successProbability}%`,
                                      background: deal.successProbability > 80 ? '#10B981' : deal.successProbability > 70 ? '#F59E0B' : '#EF4444',
                                    }}
                                  />
                                </div>
                              </td>
                            ))}
                          </tr>

                          <tr style={{ borderBottom: `1px solid ${COLOR_BORDER}`, background: COLOR_PRIMARY + '02' }}>
                            <td className="p-4 font-bold sticky left-0 bg-white" style={{ borderRight: `1px solid ${COLOR_BORDER}`, color: COLOR_PRIMARY, background: COLOR_PRIMARY + '02' }}>
                              Deal Heat Score
                            </td>
                            {selectedDealObjects.map((deal) => (
                              <td key={deal.id} className="p-4 text-center font-bold" style={{ color: '#EF4444' }}>
                                <div className="text-lg">{deal.heatScore}/100</div>
                                <div
                                  className="h-1 rounded mt-2 mx-auto w-24"
                                  style={{ background: COLOR_BORDER }}
                                >
                                  <div
                                    className="h-1 rounded"
                                    style={{
                                      width: `${deal.heatScore}%`,
                                      background: deal.heatScore > 85 ? '#EF4444' : deal.heatScore > 75 ? '#F59E0B' : '#10B981',
                                    }}
                                  />
                                </div>
                              </td>
                            ))}
                          </tr>

                          <tr style={{ borderBottom: `1px solid ${COLOR_BORDER}` }}>
                            <td className="p-4 font-bold sticky left-0 bg-white" style={{ borderRight: `1px solid ${COLOR_BORDER}`, color: COLOR_PRIMARY }}>
                              M&A Probability
                            </td>
                            {selectedDealObjects.map((deal) => (
                              <td key={deal.id} className="p-4 text-center font-bold" style={{ color: COLOR_ACCENT }}>
                                {deal.maaProbability}%
                              </td>
                            ))}
                          </tr>

                          {/* Valuation Multiples */}
                          <tr style={{ borderBottom: `1px solid ${COLOR_BORDER}`, background: COLOR_PRIMARY + '02' }}>
                            <td className="p-4 font-bold sticky left-0 bg-white" style={{ borderRight: `1px solid ${COLOR_BORDER}`, color: COLOR_PRIMARY, background: COLOR_PRIMARY + '02' }}>
                              Revenue Multiple (V/R)
                            </td>
                            {selectedDealObjects.map((deal) => (
                              <td key={deal.id} className="p-4 text-center font-bold" style={{ color: '#3B82F6' }}>
                                {(deal.valuation / deal.revenue).toFixed(1)}x
                              </td>
                            ))}
                          </tr>

                          <tr style={{ borderBottom: `1px solid ${COLOR_BORDER}` }}>
                            <td className="p-4 font-bold sticky left-0 bg-white" style={{ borderRight: `1px solid ${COLOR_BORDER}`, color: COLOR_PRIMARY }}>
                              Revenue per $ Valuation
                            </td>
                            {selectedDealObjects.map((deal) => (
                              <td key={deal.id} className="p-4 text-center font-bold text-sm" style={{ color: '#10B981' }}>
                                ${(deal.revenue / deal.valuation * 100).toFixed(1)}%
                              </td>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Key Takeaways */}
                    <div className="mt-8 p-6 rounded-lg border" style={{ borderColor: COLOR_BORDER, background: COLOR_ACCENT + '05' }}>
                      <p style={{ color: COLOR_PRIMARY }} className="font-bold mb-3 text-sm uppercase">
                        📊 Comparison Summary
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p style={{ color: COLOR_TEXT_SECONDARY }} className="mb-1">
                            <strong style={{ color: COLOR_PRIMARY }}>Highest Valuation:</strong> {selectedDealObjects.sort((a, b) => b.valuation - a.valuation)[0].name} at ${(selectedDealObjects.sort((a, b) => b.valuation - a.valuation)[0].valuation / 1000000).toFixed(1)}M
                          </p>
                        </div>
                        <div>
                          <p style={{ color: COLOR_TEXT_SECONDARY }} className="mb-1">
                            <strong style={{ color: COLOR_PRIMARY }}>Highest Growth:</strong> {selectedDealObjects.sort((a, b) => b.growthRate - a.growthRate)[0].name} at {selectedDealObjects.sort((a, b) => b.growthRate - a.growthRate)[0].growthRate}% YoY
                          </p>
                        </div>
                        <div>
                          <p style={{ color: COLOR_TEXT_SECONDARY }} className="mb-1">
                            <strong style={{ color: COLOR_PRIMARY }}>Best Success Rate:</strong> {selectedDealObjects.sort((a, b) => b.successProbability - a.successProbability)[0].name} at {selectedDealObjects.sort((a, b) => b.successProbability - a.successProbability)[0].successProbability}% probability
                          </p>
                        </div>
                        <div>
                          <p style={{ color: COLOR_TEXT_SECONDARY }} className="mb-1">
                            <strong style={{ color: COLOR_PRIMARY }}>Best Margins:</strong> {selectedDealObjects.sort((a, b) => b.ebitdaMargin - a.ebitdaMargin)[0].name} at {selectedDealObjects.sort((a, b) => b.ebitdaMargin - a.ebitdaMargin)[0].ebitdaMargin}% EBITDA
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Close Button */}
                    <div className="flex justify-end gap-4 mt-8">
                      <button
                        onClick={() => setShowCompareModal(false)}
                        className="px-6 py-2 rounded-lg font-bold border hover:bg-gray-50 transition-all"
                        style={{ borderColor: COLOR_BORDER, color: COLOR_PRIMARY }}
                      >
                        Close
                      </button>
                      <button
                        className="px-6 py-2 rounded-lg font-bold text-white hover:opacity-90 transition-all flex items-center gap-2"
                        style={{ background: COLOR_ACCENT }}
                      >
                        <Download size={16} />
                        Export Comparison
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}

              {/* AI Analysis & Comparison */}
              {selectedDealObjects.length > 0 && (
                <>
                  {/* AI Insights Dashboard */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12 p-8 rounded-xl border"
                    style={{ borderColor: COLOR_BORDER, background: COLOR_ACCENT + '05' }}
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <Zap size={24} style={{ color: COLOR_ACCENT }} />
                      <h2 className="text-2xl font-bold" style={{ color: COLOR_PRIMARY }}>
                        🤖 AI-Powered Analysis
                      </h2>
                    </div>

                    {insights && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                          { label: 'Avg Valuation', value: `$${(insights.avgValuation / 1000000).toFixed(1)}M`, color: '#3B82F6' },
                          { label: 'Avg Growth', value: `${insights.avgGrowth.toFixed(0)}%`, color: '#10B981' },
                          { label: 'Avg Success %', value: `${insights.avgSuccess.toFixed(0)}%`, color: COLOR_ACCENT },
                          { label: 'Total Revenue', value: `$${(insights.totalRevenue / 1000000).toFixed(1)}M`, color: '#8B5CF6' },
                        ].map((stat, idx) => (
                          <div key={idx} className="p-4 rounded-lg bg-white border" style={{ borderColor: COLOR_BORDER }}>
                            <p className="text-xs font-bold uppercase mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                              {stat.label}
                            </p>
                            <p className="text-2xl font-black" style={{ color: stat.color }}>
                              {stat.value}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="mt-6 p-4 rounded-lg border" style={{ borderColor: COLOR_BORDER, background: 'white' }}>
                      <p className="text-sm leading-relaxed" style={{ color: COLOR_TEXT_SECONDARY }}>
                        <strong style={{ color: COLOR_PRIMARY }}>AI Recommendation:</strong> Based on the selected deals, your portfolio shows{' '}
                        <strong style={{ color: '#10B981' }}>strong growth potential</strong> with an average {insights?.avgGrowth.toFixed(0)}%
                        YoY growth. The deals are positioned in{' '}
                        <strong style={{ color: COLOR_ACCENT }}>high-opportunity markets</strong> with{' '}
                        <strong style={{ color: COLOR_ACCENT }}>{insights?.avgSuccess.toFixed(0)}% success probability</strong> on average.
                      </p>
                    </div>
                  </motion.div>

                  {/* Detailed Comparison Table */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12 p-8 rounded-xl border"
                    style={{ borderColor: COLOR_BORDER, background: COLOR_PRIMARY + '02' }}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold" style={{ color: COLOR_PRIMARY }}>
                        📊 Detailed Metrics Comparison
                      </h2>
                      <button
                        className="flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-white hover:opacity-90 transition-opacity"
                        style={{ background: COLOR_ACCENT }}
                      >
                        <Download size={16} />
                        Export Analysis
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr style={{ borderBottom: `2px solid ${COLOR_BORDER}`, background: COLOR_PRIMARY + '02' }}>
                            <th className="p-4 text-left font-bold" style={{ color: COLOR_PRIMARY }}>
                              Metric
                            </th>
                            {selectedDealObjects.map((deal) => (
                              <th key={deal.id} className="p-4 text-left font-bold" style={{ color: COLOR_PRIMARY }}>
                                {deal.name}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            { key: 'valuation', label: 'Valuation', format: (v: number) => `$${(v / 1000000).toFixed(1)}M` },
                            { key: 'revenue', label: 'Annual Revenue', format: (v: number) => `$${(v / 1000).toFixed(0)}K` },
                            { key: 'growthRate', label: 'Growth Rate', format: (v: number) => `${v}%` },
                            { key: 'ebitdaMargin', label: 'EBITDA Margin', format: (v: number) => `${v}%` },
                            { key: 'successProbability', label: 'Success Probability', format: (v: number) => `${v}%` },
                            { key: 'heatScore', label: 'Heat Score', format: (v: number) => `${v}/100` },
                            { key: 'maaProbability', label: 'M&A Probability', format: (v: number) => `${v}%` },
                            { key: 'employees', label: 'Employees', format: (v: number) => v.toString() },
                          ].map((metric, idx) => (
                            <tr
                              key={metric.key}
                              style={{
                                borderBottom: `1px solid ${COLOR_BORDER}`,
                                background: idx % 2 === 0 ? 'white' : COLOR_PRIMARY + '02',
                              }}
                            >
                              <td className="p-4 font-semibold" style={{ color: COLOR_PRIMARY }}>
                                {metric.label}
                              </td>
                              {selectedDealObjects.map((deal) => {
                                const value = deal[metric.key as keyof Deal]
                                return (
                                  <td key={deal.id} className="p-4" style={{ color: COLOR_TEXT_SECONDARY }}>
                                    {metric.format(value as number)}
                                  </td>
                                )
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>

                  {/* Delta Analysis vs Historical Comparables */}
                  {selectedDealObjects.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-12 p-8 rounded-xl border"
                      style={{ borderColor: COLOR_BORDER, background: COLOR_PRIMARY + '02' }}
                    >
                      <div className="flex items-center gap-3 mb-8">
                        <TrendingUp size={24} style={{ color: COLOR_ACCENT }} />
                        <h2 className="text-2xl font-bold" style={{ color: COLOR_PRIMARY }}>
                          📊 Delta Analysis vs Historical Comparables
                        </h2>
                      </div>

                      <div className="space-y-8">
                        {selectedDealObjects.map((deal) => {
                          const deltaAnalysis = calculateDeltaAnalysis(deal)
                          const deltaInsights = deltaAnalysis ? generateDeltaInsights(deal, deltaAnalysis) : []

                          return (
                            <div key={deal.id} className="border-t pt-8" style={{ borderColor: COLOR_BORDER }}>
                              <h3 className="text-lg font-bold mb-6" style={{ color: COLOR_PRIMARY }}>
                                {deal.name}
                              </h3>

                              {deltaAnalysis && (
                                <>
                                  {/* Delta Metrics Grid */}
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    {/* Valuation Delta */}
                                    <div
                                      className="p-6 rounded-lg border"
                                      style={{
                                        borderColor: deltaAnalysis.deltas.valuation.pct > 0 ? '#10B981' : '#EF4444',
                                        background: deltaAnalysis.deltas.valuation.pct > 0 ? '#10B981' + '10' : '#EF4444' + '10',
                                      }}
                                    >
                                      <div className="flex items-start justify-between mb-3">
                                        <div>
                                          <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-xs font-bold uppercase">
                                            Valuation Delta
                                          </p>
                                          <p className="text-2xl font-black mt-1" style={{ color: deltaAnalysis.deltas.valuation.pct > 0 ? '#10B981' : '#EF4444' }}>
                                            {deltaAnalysis.deltas.valuation.pct > 0 ? '+' : ''}{deltaAnalysis.deltas.valuation.pct.toFixed(1)}%
                                          </p>
                                        </div>
                                        <span className="text-xs font-bold px-2 py-1 rounded" style={{ background: 'white', color: deltaAnalysis.deltas.valuation.pct > 0 ? '#10B981' : '#EF4444' }}>
                                          {deltaAnalysis.deltas.valuation.pct > 0 ? 'Premium' : 'Discount'}
                                        </span>
                                      </div>
                                      <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                                        Historical median: ${(deltaAnalysis.historicalMedian.valuation / 1000000).toFixed(1)}M
                                      </p>
                                    </div>

                                    {/* Growth Delta */}
                                    <div
                                      className="p-6 rounded-lg border"
                                      style={{
                                        borderColor: deltaAnalysis.deltas.growth > 0 ? '#10B981' : '#EF4444',
                                        background: deltaAnalysis.deltas.growth > 0 ? '#10B981' + '10' : '#EF4444' + '10',
                                      }}
                                    >
                                      <div className="flex items-start justify-between mb-3">
                                        <div>
                                          <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-xs font-bold uppercase">
                                            Growth Delta
                                          </p>
                                          <p className="text-2xl font-black mt-1" style={{ color: deltaAnalysis.deltas.growth > 0 ? '#10B981' : '#EF4444' }}>
                                            {deltaAnalysis.deltas.growth > 0 ? '+' : ''}{deltaAnalysis.deltas.growth.toFixed(1)}%
                                          </p>
                                        </div>
                                        <span className="text-xs font-bold px-2 py-1 rounded" style={{ background: 'white', color: deltaAnalysis.deltas.growth > 0 ? '#10B981' : '#EF4444' }}>
                                          {deltaAnalysis.deltas.growth > 0 ? 'Above Avg' : 'Below Avg'}
                                        </span>
                                      </div>
                                      <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                                        Historical median: {deltaAnalysis.historicalMedian.growth.toFixed(1)}%
                                      </p>
                                    </div>

                                    {/* Success Probability Delta */}
                                    <div
                                      className="p-6 rounded-lg border"
                                      style={{
                                        borderColor: deltaAnalysis.deltas.success > 0 ? '#10B981' : '#EF4444',
                                        background: deltaAnalysis.deltas.success > 0 ? '#10B981' + '10' : '#EF4444' + '10',
                                      }}
                                    >
                                      <div className="flex items-start justify-between mb-3">
                                        <div>
                                          <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-xs font-bold uppercase">
                                            Success Delta
                                          </p>
                                          <p className="text-2xl font-black mt-1" style={{ color: deltaAnalysis.deltas.success > 0 ? '#10B981' : '#EF4444' }}>
                                            {deltaAnalysis.deltas.success > 0 ? '+' : ''}{deltaAnalysis.deltas.success.toFixed(1)}%
                                          </p>
                                        </div>
                                        <span className="text-xs font-bold px-2 py-1 rounded" style={{ background: 'white', color: deltaAnalysis.deltas.success > 0 ? '#10B981' : '#EF4444' }}>
                                          {deltaAnalysis.deltas.success > 0 ? 'Stronger' : 'Weaker'}
                                        </span>
                                      </div>
                                      <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                                        Historical median: {deltaAnalysis.historicalMedian.success.toFixed(1)}%
                                      </p>
                                    </div>

                                    {/* EBITDA Margin Delta */}
                                    <div
                                      className="p-6 rounded-lg border"
                                      style={{
                                        borderColor: deltaAnalysis.deltas.margin > 0 ? '#10B981' : '#EF4444',
                                        background: deltaAnalysis.deltas.margin > 0 ? '#10B981' + '10' : '#EF4444' + '10',
                                      }}
                                    >
                                      <div className="flex items-start justify-between mb-3">
                                        <div>
                                          <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-xs font-bold uppercase">
                                            Margin Delta
                                          </p>
                                          <p className="text-2xl font-black mt-1" style={{ color: deltaAnalysis.deltas.margin > 0 ? '#10B981' : '#EF4444' }}>
                                            {deltaAnalysis.deltas.margin > 0 ? '+' : ''}{deltaAnalysis.deltas.margin.toFixed(1)}%
                                          </p>
                                        </div>
                                        <span className="text-xs font-bold px-2 py-1 rounded" style={{ background: 'white', color: deltaAnalysis.deltas.margin > 0 ? '#10B981' : '#EF4444' }}>
                                          {deltaAnalysis.deltas.margin > 0 ? 'Higher' : 'Lower'}
                                        </span>
                                      </div>
                                      <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                                        Historical median: {deltaAnalysis.historicalMedian.margin.toFixed(1)}%
                                      </p>
                                    </div>
                                  </div>

                                  {/* AI-Generated Delta Insights */}
                                  <div className="space-y-3 bg-white p-6 rounded-lg border" style={{ borderColor: COLOR_BORDER }}>
                                    <p style={{ color: COLOR_PRIMARY }} className="text-sm font-bold uppercase">
                                      🤖 AI Delta Analysis
                                    </p>
                                    {deltaInsights.map((insight, idx) => (
                                      <div key={idx} className="flex gap-3 items-start">
                                        <div
                                          className="w-1 h-1 rounded-full mt-2 flex-shrink-0"
                                          style={{
                                            background: insight.severity === 'positive' ? '#10B981' : insight.severity === 'caution' ? '#F59E0B' : '#3B82F6',
                                          }}
                                        />
                                        <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-sm leading-relaxed">
                                          {insight.text}
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                </>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </motion.div>
                  )}

                  {/* Current Deal Comparison (if multiple deals) */}
                  {selectedDealObjects.length > 1 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-12 p-8 rounded-xl border"
                      style={{ borderColor: COLOR_BORDER, background: '#F59E0B' + '05' }}
                    >
                      <div className="flex items-center gap-3 mb-8">
                        <BarChart3 size={24} style={{ color: '#F59E0B' }} />
                        <h2 className="text-2xl font-bold" style={{ color: COLOR_PRIMARY }}>
                          ⚖️ Current Deal Comparison Analysis
                        </h2>
                      </div>

                      <div className="space-y-6">
                        {/* Valuation Comparison */}
                        <div className="p-6 rounded-lg border" style={{ borderColor: COLOR_BORDER, background: 'white' }}>
                          <p style={{ color: COLOR_PRIMARY }} className="font-bold mb-4">
                            Valuation Positioning
                          </p>
                          <div className="space-y-2">
                            {selectedDealObjects
                              .sort((a, b) => b.valuation - a.valuation)
                              .map((deal, idx) => (
                                <div key={deal.id} className="flex items-center justify-between text-sm">
                                  <span style={{ color: COLOR_TEXT_SECONDARY }}>
                                    {idx + 1}. {deal.name}
                                  </span>
                                  <span style={{ color: COLOR_PRIMARY }} className="font-bold">
                                    ${(deal.valuation / 1000000).toFixed(1)}M {idx === 0 ? '(highest)' : idx === selectedDealObjects.length - 1 ? '(lowest)' : ''}
                                  </span>
                                </div>
                              ))}
                          </div>
                          <p className="text-sm mt-4" style={{ color: COLOR_TEXT_SECONDARY }}>
                            <strong style={{ color: COLOR_PRIMARY }}>Insight:</strong> Valuation spread of $
                            {((Math.max(...selectedDealObjects.map((d) => d.valuation)) - Math.min(...selectedDealObjects.map((d) => d.valuation))) / 1000000).toFixed(1)}
                            M across the portfolio. Consider diversification benefits.
                          </p>
                        </div>

                        {/* Growth Comparison */}
                        <div className="p-6 rounded-lg border" style={{ borderColor: COLOR_BORDER, background: 'white' }}>
                          <p style={{ color: COLOR_PRIMARY }} className="font-bold mb-4">
                            Growth Rate Ranking
                          </p>
                          <div className="space-y-2">
                            {selectedDealObjects
                              .sort((a, b) => b.growthRate - a.growthRate)
                              .map((deal, idx) => (
                                <div key={deal.id} className="flex items-center justify-between text-sm">
                                  <span style={{ color: COLOR_TEXT_SECONDARY }}>
                                    {idx + 1}. {deal.name}
                                  </span>
                                  <span style={{ color: '#10B981' }} className="font-bold">
                                    {deal.growthRate}% YoY
                                  </span>
                                </div>
                              ))}
                          </div>
                          <p className="text-sm mt-4" style={{ color: COLOR_TEXT_SECONDARY }}>
                            <strong style={{ color: COLOR_PRIMARY }}>Insight:</strong> Average growth across portfolio: {(insights?.avgGrowth || 0).toFixed(1)}%. Mix of high-growth and stable cash generators.
                          </p>
                        </div>

                        {/* Risk Profile Comparison */}
                        <div className="p-6 rounded-lg border" style={{ borderColor: COLOR_BORDER, background: 'white' }}>
                          <p style={{ color: COLOR_PRIMARY }} className="font-bold mb-4">
                            Risk vs Reward Profile
                          </p>
                          <div className="space-y-3">
                            {selectedDealObjects.map((deal) => {
                              const riskScore = 100 - deal.successProbability
                              const rewardScore = deal.growthRate
                              const ratioNum = rewardScore / (riskScore || 1)
                              const ratioStr = ratioNum.toFixed(2)
                              return (
                                <div key={deal.id} className="p-4 rounded-lg border" style={{ borderColor: COLOR_BORDER, background: COLOR_PRIMARY + '02' }}>
                                  <div className="flex justify-between items-start mb-2">
                                    <span style={{ color: COLOR_PRIMARY }} className="font-semibold">
                                      {deal.name}
                                    </span>
                                    <span
                                      style={{
                                        color: ratioNum > 1 ? '#10B981' : ratioNum > 0.5 ? '#F59E0B' : '#EF4444',
                                      }}
                                      className="text-sm font-bold"
                                    >
                                      Reward/Risk: {ratioStr}x
                                    </span>
                                  </div>
                                  <div className="flex gap-2 text-xs">
                                    <span style={{ color: COLOR_TEXT_SECONDARY }}>
                                      Success: {deal.successProbability}%
                                    </span>
                                    <span style={{ color: COLOR_TEXT_SECONDARY }}>•</span>
                                    <span style={{ color: COLOR_TEXT_SECONDARY }}>
                                      Growth: {deal.growthRate}%
                                    </span>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Things to Note from AI - Strategic Insights */}
                  {selectedDealObjects.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-12 p-8 rounded-xl border"
                      style={{ borderColor: COLOR_BORDER, background: '#8B5CF6' + '05' }}
                    >
                      <div className="flex items-center gap-3 mb-8">
                        <AlertCircle size={24} style={{ color: '#8B5CF6' }} />
                        <h2 className="text-2xl font-bold" style={{ color: COLOR_PRIMARY }}>
                          💡 Things to Note from AI
                        </h2>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Deal Attractiveness Scoring */}
                        <div className="p-6 rounded-lg border" style={{ borderColor: COLOR_BORDER, background: 'white' }}>
                          <p style={{ color: COLOR_PRIMARY }} className="font-bold mb-4">
                            Deal Attractiveness Ranking
                          </p>
                          <div className="space-y-3">
                            {selectedDealObjects
                              .map((deal) => ({
                                deal,
                                score:
                                  (deal.successProbability * 0.35 + deal.growthRate * 0.4 + deal.heatScore * 0.25) / 100,
                              }))
                              .sort((a, b) => b.score - a.score)
                              .map(({ deal, score }, idx) => (
                                <div key={deal.id} className="flex items-center justify-between p-3 rounded-lg border" style={{ borderColor: COLOR_BORDER, background: COLOR_PRIMARY + '02' }}>
                                  <div>
                                    <span className="text-sm font-bold" style={{ color: COLOR_PRIMARY }}>
                                      {idx + 1}. {deal.name}
                                    </span>
                                    <p className="text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>
                                      Composite score based on success × growth × heat
                                    </p>
                                  </div>
                                  <span
                                    className="text-lg font-black"
                                    style={{
                                      color: score > 0.7 ? '#10B981' : score > 0.5 ? '#F59E0B' : '#EF4444',
                                    }}
                                  >
                                    {(score * 100).toFixed(0)}/100
                                  </span>
                                </div>
                              ))}
                          </div>
                        </div>

                        {/* Key Flags & Opportunities */}
                        <div className="p-6 rounded-lg border" style={{ borderColor: COLOR_BORDER, background: 'white' }}>
                          <p style={{ color: COLOR_PRIMARY }} className="font-bold mb-4">
                            Key Strategic Notes
                          </p>
                          <div className="space-y-3 text-sm">
                            {selectedDealObjects.some((d) => d.maaProbability > 80) && (
                              <div className="flex gap-3 items-start p-3 rounded-lg border" style={{ borderColor: '#10B981', background: '#10B981' + '10' }}>
                                <Flame size={16} style={{ color: '#10B981', flexShrink: 0 }} />
                                <span style={{ color: COLOR_TEXT_SECONDARY }}>
                                  <strong style={{ color: '#10B981' }}>High M&A Fit:</strong> {selectedDealObjects.filter((d) => d.maaProbability > 80).map((d) => d.name).join(', ')} show strong strategic fit indicators
                                </span>
                              </div>
                            )}
                            {selectedDealObjects.some((d) => d.ebitdaMargin > 25) && (
                              <div className="flex gap-3 items-start p-3 rounded-lg border" style={{ borderColor: '#10B981', background: '#10B981' + '10' }}>
                                <DollarSign size={16} style={{ color: '#10B981', flexShrink: 0 }} />
                                <span style={{ color: COLOR_TEXT_SECONDARY }}>
                                  <strong style={{ color: '#10B981' }}>Margin Excellence:</strong> High profitability deals present immediate EBITDA accretion opportunities
                                </span>
                              </div>
                            )}
                            {selectedDealObjects.some((d) => d.growthRate < 35) && (
                              <div className="flex gap-3 items-start p-3 rounded-lg border" style={{ borderColor: '#F59E0B', background: '#F59E0B' + '10' }}>
                                <TrendingUp size={16} style={{ color: '#F59E0B', flexShrink: 0 }} />
                                <span style={{ color: COLOR_TEXT_SECONDARY }}>
                                  <strong style={{ color: '#F59E0B' }}>Growth Consideration:</strong> Some deals show lower growth; evaluate for cash generation vs. growth potential
                                </span>
                              </div>
                            )}
                            {selectedDealObjects.some((d) => d.successProbability < 80) && (
                              <div className="flex gap-3 items-start p-3 rounded-lg border" style={{ borderColor: '#F59E0B', background: '#F59E0B' + '10' }}>
                                <Target size={16} style={{ color: '#F59E0B', flexShrink: 0 }} />
                                <span style={{ color: COLOR_TEXT_SECONDARY }}>
                                  <strong style={{ color: '#F59E0B' }}>Due Diligence Focus:</strong> Lower success probability deals require deeper operational assessment
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Acquisition Strategy Recommendations */}
                        <div className="p-6 rounded-lg border md:col-span-2" style={{ borderColor: COLOR_BORDER, background: 'white' }}>
                          <p style={{ color: COLOR_PRIMARY }} className="font-bold mb-4">
                            Recommended Acquisition Strategy
                          </p>
                          <div className="space-y-4 text-sm">
                            {insights && selectedDealObjects.length === 1 && (
                              <p style={{ color: COLOR_TEXT_SECONDARY }}>
                                <strong style={{ color: COLOR_PRIMARY }}>Single-Deal Strategy:</strong> With a ${(insights.avgValuation / 1000000).toFixed(1)}M investment at {insights.avgGrowth.toFixed(0)}% growth, prioritize immediate operational integration to capture synergies. Target hold period: 3-5 years with focus on market expansion.
                              </p>
                            )}
                            {insights && selectedDealObjects.length > 1 && (
                              <>
                                <p style={{ color: COLOR_TEXT_SECONDARY }}>
                                  <strong style={{ color: COLOR_PRIMARY }}>Portfolio Strategy:</strong> Total portfolio value of ${(insights.avgValuation * selectedDealObjects.length / 1000000).toFixed(1)}M with {insights.avgGrowth.toFixed(0)}% blended growth. Recommend:
                                </p>
                                <ul className="list-disc list-inside space-y-2" style={{ color: COLOR_TEXT_SECONDARY }}>
                                  <li>Parallel track due diligence to reduce timeline</li>
                                  <li>Cross-portfolio synergies: {selectedDealObjects.length > 1 ? 'Identify shared customer bases, product bundling opportunities' : ''}</li>
                                  <li>Phased integration: High performers first, then integration of complementary assets</li>
                                  <li>Post-acquisition roadmap: 18-month integration for platform consolidation</li>
                                </ul>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Risk Mitigation */}
                        <div className="p-6 rounded-lg border md:col-span-2" style={{ borderColor: COLOR_BORDER, background: '#EF4444' + '05' }}>
                          <p style={{ color: '#EF4444' }} className="font-bold mb-4">
                            ⚠️ Risk Mitigation Priorities
                          </p>
                          <div className="space-y-3 text-sm">
                            {selectedDealObjects.some((d) => d.successProbability < 75) && (
                              <p style={{ color: COLOR_TEXT_SECONDARY }}>
                                <strong style={{ color: COLOR_PRIMARY }}>Execution Risk:</strong> Conduct detailed operational assessment. Request 2-3 years of audited financials and customer contracts.
                              </p>
                            )}
                            {selectedDealObjects.some((d) => d.heatScore > 85) && (
                              <p style={{ color: COLOR_TEXT_SECONDARY }}>
                                <strong style={{ color: COLOR_PRIMARY }}>Competitive Pressure:</strong> Hot deals attract multiple bidders. Prepare competitive LOI with clear differentiation.
                              </p>
                            )}
                            {selectedDealObjects.some((d) => d.employees < 15) && (
                              <p style={{ color: COLOR_TEXT_SECONDARY }}>
                                <strong style={{ color: COLOR_PRIMARY }}>Key Person Risk:</strong> Small teams are vulnerable. Secure retention agreements with founders/key staff for 24+ months.
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Historical Comparables */}
                  {selectedDealObjects.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-8 rounded-xl border"
                      style={{ borderColor: COLOR_BORDER, background: COLOR_PRIMARY + '02' }}
                    >
                      <div className="flex items-center gap-3 mb-6">
                        <Target size={24} style={{ color: COLOR_ACCENT }} />
                        <h2 className="text-2xl font-bold" style={{ color: COLOR_PRIMARY }}>
                          📈 Historical Comparable Deals
                        </h2>
                      </div>

                      <div className="space-y-6">
                        {selectedDealObjects.map((deal) => {
                          const comparables = getHistoricalComparables(deal.industry)
                          return (
                            <div key={deal.id}>
                              <h3 className="font-bold text-lg mb-4" style={{ color: COLOR_PRIMARY }}>
                                {deal.name} — Similar Historical Deals
                              </h3>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {comparables.map((comp, compIdx) => (
                                  <div
                                    key={comp.id}
                                    className="p-4 rounded-lg border"
                                    style={{ borderColor: COLOR_BORDER, background: 'white' }}
                                  >
                                    <div className="mb-3">
                                      <h4 className="font-bold" style={{ color: COLOR_PRIMARY }}>
                                        Historical Deal {compIdx + 1}
                                      </h4>
                                      <span
                                        className="inline-block text-xs font-bold px-2 py-1 rounded mt-1"
                                        style={{ background: '#8B5CF6' + '30', color: '#8B5CF6' }}
                                      >
                                        Market Precedent
                                      </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                      <div>
                                        <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-xs font-bold">
                                          Valuation
                                        </p>
                                        <p className="font-black" style={{ color: COLOR_PRIMARY }}>
                                          ${(comp.valuation / 1000000).toFixed(1)}M
                                        </p>
                                      </div>
                                      <div>
                                        <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-xs font-bold">
                                          Growth
                                        </p>
                                        <p className="font-black" style={{ color: '#10B981' }}>
                                          {comp.growthRate}%
                                        </p>
                                      </div>
                                      <div>
                                        <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-xs font-bold">
                                          Success %
                                        </p>
                                        <p className="font-black" style={{ color: COLOR_ACCENT }}>
                                          {comp.successProbability}%
                                        </p>
                                      </div>
                                      <div>
                                        <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-xs font-bold">
                                          Margin
                                        </p>
                                        <p className="font-black" style={{ color: '#F59E0B' }}>
                                          {comp.ebitdaMargin}%
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )
                        })}
                      </div>

                      <div className="mt-6 p-4 rounded-lg border" style={{ borderColor: COLOR_BORDER, background: COLOR_ACCENT + '10' }}>
                        <p className="text-sm" style={{ color: COLOR_PRIMARY }}>
                          <strong>💡 Historical Insight:</strong> Comparable historical deals in this space show similar valuation multiples and success rates. Your selected deals align with market precedents, providing confidence in valuations and deal structures.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </>
              )}
            </>
          )}
        </div>

        {/* Help Contact Widget */}
        <HelpContactWidget />

        {/* World Class Footer */}
        <WorldClassFooter />
      </div>
    </Suspense>
  )
}

export default function MyFavouritesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <MyFavouritesContent />
    </Suspense>
  )
}

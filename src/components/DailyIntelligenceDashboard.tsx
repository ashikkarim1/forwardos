'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  TrendingUp, TrendingDown, AlertTriangle, Flame, Zap, Eye, Clock, DollarSign,
  Target, Activity, BarChart3, Users, ArrowUpRight, ArrowDownRight, CheckCircle2,
  AlertCircle, MessageSquare, RefreshCw
} from 'lucide-react'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER } from '@/styles/forward-colors'
import { palette } from '@/styles/tokens'

interface MarketSignal {
  id: string
  title: string
  description: string
  type: 'hot' | 'cold' | 'trend' | 'alert'
  metric: string
  change: number
  industry?: string
  insight: string
  action?: string
  actionHref?: string
}

interface DealMomentum {
  id: string
  dealName: string
  stage: string
  heat: number
  momentum: 'accelerating' | 'steady' | 'stalling'
  lastUpdate: string
  nextAction: string
  riskLevel: 'low' | 'medium' | 'high'
}

interface ComparablePrice {
  id: string
  dealName: string
  industry: string
  revenue: number
  valuation: number
  multiple: number
  compareToYour: number
  percentageDiff: number
  status: 'higher' | 'lower' | 'market'
}

interface IntegratedIntelligence {
  userType: 'buyer' | 'seller' | 'broker'
  marketSignals: MarketSignal[]
  dealMomentum: DealMomentum[]
  comparables: ComparablePrice[]
  alerts: Array<{
    id: string
    severity: 'high' | 'medium' | 'low'
    title: string
    description: string
    timestamp: string
    action?: string
    actionHref?: string
  }>
  personalizedInsights: string[]
  lastUpdated: string
}

export function DailyIntelligenceDashboard({
  userType,
  marketSignals,
  dealMomentum,
  comparables,
  alerts,
  personalizedInsights,
  lastUpdated,
}: IntegratedIntelligence) {
  const [selectedDealMomentum, setSelectedDealMomentum] = useState<string | null>(null)
  const [selectedTab, setSelectedTab] = useState<'signals' | 'momentum' | 'comparables' | 'alerts'>('signals')

  const getMomentumColor = (momentum: string) => {
    if (momentum === 'accelerating') return palette.emerald[500]
    if (momentum === 'steady') return COLOR_ACCENT
    return palette.crimson[400]
  }

  const getMomentumIcon = (momentum: string) => {
    if (momentum === 'accelerating') return <TrendingUp className="w-4 h-4" />
    if (momentum === 'steady') return <Activity className="w-4 h-4" />
    return <TrendingDown className="w-4 h-4" />
  }

  const getSignalBackground = (type: string) => {
    switch (type) {
      case 'hot':
        return palette.ink[50]
      case 'cold':
        return palette.ink[50]
      case 'trend':
        return palette.champagne[50]
      case 'alert':
        return palette.crimson[50]
      default:
        return 'white'
    }
  }

  const getSignalBorderColor = (type: string) => {
    switch (type) {
      case 'hot':
        return COLOR_ACCENT
      case 'cold':
        return palette.ink[200]
      case 'trend':
        return palette.champagne[500]
      case 'alert':
        return palette.crimson[400]
      default:
        return COLOR_BORDER
    }
  }

  return (
    <div className="space-y-6">
      {/* Header with Last Updated */}
      <motion.div
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h2 className="text-2xl font-black" style={{ color: COLOR_PRIMARY }}>
            📊 Daily Market Intelligence
          </h2>
          <p className="text-sm mt-1" style={{ color: COLOR_TEXT_SECONDARY }}>
            Your personalized deal ecosystem insights
          </p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2 justify-end mb-2">
            <RefreshCw className="w-4 h-4" style={{ color: COLOR_ACCENT }} />
            <span className="text-xs font-bold" style={{ color: COLOR_TEXT_SECONDARY }}>
              Updated {lastUpdated}
            </span>
          </div>
          <span className="text-xs px-3 py-1 rounded-full" style={{ background: palette.emerald[50], color: palette.emerald[500] }}>
            ✓ Real-time
          </span>
        </div>
      </motion.div>

      {/* Personalized Insights Banner */}
      {personalizedInsights.length > 0 && (
        <motion.div
          className="p-4 rounded-lg border-2"
          style={{ borderColor: COLOR_ACCENT, background: COLOR_ACCENT + '08' }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-start gap-3">
            <Zap className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: COLOR_ACCENT }} />
            <div className="flex-1">
              <h3 className="font-bold text-sm mb-2" style={{ color: COLOR_PRIMARY }}>
                Your Top Insight Today
              </h3>
              <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                {personalizedInsights[0]}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Tab Navigation */}
      <motion.div
        className="flex gap-2 border-b overflow-x-auto"
        style={{ borderColor: COLOR_BORDER }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {[
          { id: 'signals', label: '🔥 Market Signals', count: marketSignals.length },
          { id: 'momentum', label: '📈 Deal Momentum', count: dealMomentum.length },
          { id: 'comparables', label: '💰 Comparable Pricing', count: comparables.length },
          { id: 'alerts', label: '⚠️ Critical Alerts', count: alerts.length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id as any)}
            className="px-4 py-3 font-bold text-sm transition-all whitespace-nowrap flex items-center gap-2"
            style={{
              color: selectedTab === tab.id ? COLOR_ACCENT : COLOR_TEXT_SECONDARY,
              borderBottom: selectedTab === tab.id ? `3px solid ${COLOR_ACCENT}` : 'none',
            }}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-bold text-white" style={{ background: COLOR_ACCENT }}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </motion.div>

      {/* ==================== MARKET SIGNALS TAB ==================== */}
      {selectedTab === 'signals' && (
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {marketSignals.map((signal, idx) => (
            <motion.div
              key={signal.id}
              className="p-5 rounded-lg border-2 hover:shadow-lg transition-all cursor-pointer"
              style={{
                borderColor: getSignalBorderColor(signal.type),
                background: getSignalBackground(signal.type),
              }}
              whileHover={{ y: -2 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-sm" style={{ color: COLOR_PRIMARY }}>
                    {signal.title}
                  </h3>
                  {signal.industry && (
                    <p className="text-xs mt-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                      {signal.industry}
                    </p>
                  )}
                </div>
                <div
                  className="p-2 rounded-lg"
                  style={{
                    background: signal.type === 'hot' ? COLOR_ACCENT + '20' : COLOR_ACCENT + '20',
                  }}
                >
                  {signal.type === 'hot' && <Flame className="w-4 h-4" style={{ color: COLOR_ACCENT }} />}
                  {signal.type === 'cold' && <TrendingDown className="w-4 h-4" style={{ color: palette.ink[400] }} />}
                  {signal.type === 'trend' && <TrendingUp className="w-4 h-4" style={{ color: palette.champagne[500] }} />}
                  {signal.type === 'alert' && <AlertTriangle className="w-4 h-4" style={{ color: palette.crimson[400] }} />}
                </div>
              </div>

              <p className="text-xs mb-3" style={{ color: COLOR_TEXT_SECONDARY }}>
                {signal.description}
              </p>

              <div className="bg-white rounded-lg p-3 mb-3">
                <p className="text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>
                  Current Metric
                </p>
                <div className="flex items-baseline gap-2 mt-1">
                  <p className="text-2xl font-black" style={{ color: COLOR_PRIMARY }}>
                    {signal.metric}
                  </p>
                  <div className="flex items-center gap-1">
                    {signal.change > 0 ? (
                      <ArrowUpRight className="w-4 h-4" style={{ color: palette.emerald[500] }} />
                    ) : (
                      <ArrowDownRight className="w-4 h-4" style={{ color: palette.crimson[400] }} />
                    )}
                    <span
                      className="text-xs font-bold"
                      style={{ color: signal.change > 0 ? palette.emerald[500] : palette.crimson[400] }}
                    >
                      {Math.abs(signal.change)}% {signal.change > 0 ? 'up' : 'down'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg border" style={{ borderColor: COLOR_BORDER, background: 'white' }}>
                <p className="text-xs font-bold mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                  What This Means
                </p>
                <p className="text-xs" style={{ color: COLOR_PRIMARY }}>
                  {signal.insight}
                </p>
              </div>

              {signal.action && (
                signal.actionHref ? (
                  <Link href={signal.actionHref}
                    className="block w-full mt-3 px-3 py-2 rounded-lg text-xs font-bold border text-center transition-all hover:bg-white"
                    style={{ borderColor: COLOR_ACCENT, color: COLOR_ACCENT }}>
                    {signal.action}
                  </Link>
                ) : (
                  <button disabled
                    className="w-full mt-3 px-3 py-2 rounded-lg text-xs font-bold border cursor-not-allowed opacity-50"
                    style={{ borderColor: COLOR_BORDER, color: COLOR_TEXT_SECONDARY }}
                    title="Action not yet wired">
                    {signal.action}
                  </button>
                )
              )}
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* ==================== DEAL MOMENTUM TAB ==================== */}
      {selectedTab === 'momentum' && (
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {dealMomentum.map((deal, idx) => (
            <motion.div
              key={deal.id}
              className="p-5 rounded-lg border-2 cursor-pointer transition-all"
              style={{
                borderColor: selectedDealMomentum === deal.id ? COLOR_ACCENT : COLOR_BORDER,
                background: selectedDealMomentum === deal.id ? COLOR_ACCENT + '08' : 'white',
              }}
              onClick={() => setSelectedDealMomentum(selectedDealMomentum === deal.id ? null : deal.id)}
              whileHover={{ scale: 1.01 }}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold" style={{ color: COLOR_PRIMARY }}>
                    {deal.dealName}
                  </h3>
                  <p className="text-xs mt-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                    {deal.stage} • Updated {deal.lastUpdate}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="px-3 py-1 rounded-full flex items-center gap-1"
                    style={{
                      background: getMomentumColor(deal.momentum) + '20',
                      color: getMomentumColor(deal.momentum),
                    }}
                  >
                    {getMomentumIcon(deal.momentum)}
                    <span className="text-xs font-bold capitalize">
                      {deal.momentum}
                    </span>
                  </div>
                </div>
              </div>

              {/* Heat Score */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold" style={{ color: COLOR_TEXT_SECONDARY }}>
                    Deal Heat
                  </span>
                  <span className="text-sm font-black" style={{ color: COLOR_PRIMARY }}>
                    {deal.heat}/100
                  </span>
                </div>
                <div className="h-2 rounded-full bg-gray-200">
                  <motion.div
                    className="h-2 rounded-full"
                    style={{
                      background: deal.heat > 75 ? COLOR_ACCENT : deal.heat > 50 ? palette.amber[500] : palette.ink[400],
                      width: `${deal.heat}%`,
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${deal.heat}%` }}
                    transition={{ duration: 0.8 }}
                  />
                </div>
              </div>

              {/* Expandable Details */}
              {selectedDealMomentum === deal.id && (
                <motion.div
                  className="mt-4 pt-4 border-t space-y-3"
                  style={{ borderColor: COLOR_BORDER }}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg" style={{ background: palette.ink[50] }}>
                      <p className="text-xs font-bold mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                        Risk Level
                      </p>
                      <p className="text-sm font-bold capitalize" style={{
                        color: deal.riskLevel === 'high' ? palette.crimson[400] : deal.riskLevel === 'medium' ? palette.amber[500] : palette.emerald[500]
                      }}>
                        {deal.riskLevel}
                      </p>
                    </div>
                    <div className="p-3 rounded-lg" style={{ background: palette.ink[50] }}>
                      <p className="text-xs font-bold mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                        Next Action
                      </p>
                      <p className="text-sm font-bold" style={{ color: COLOR_PRIMARY }}>
                        {deal.nextAction}
                      </p>
                    </div>
                  </div>
                  <button className="w-full px-4 py-2 rounded-lg font-bold text-sm transition-all text-white" style={{ background: COLOR_ACCENT }}>
                    View Full Deal →
                  </button>
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* ==================== COMPARABLE PRICING TAB ==================== */}
      {selectedTab === 'comparables' && (
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {comparables.map((comp, idx) => {
            const isHigher = comp.percentageDiff > 10
            const isLower = comp.percentageDiff < -10
            return (
              <motion.div
                key={comp.id}
                className="p-5 rounded-lg border-2 hover:shadow-lg transition-all"
                style={{ borderColor: COLOR_BORDER }}
                whileHover={{ y: -2 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold" style={{ color: COLOR_PRIMARY }}>
                      {comp.dealName}
                    </h3>
                    <p className="text-xs mt-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                      {comp.industry}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black" style={{ color: COLOR_PRIMARY }}>
                      {comp.multiple.toFixed(1)}x Revenue
                    </p>
                    <div className="flex items-center gap-1 justify-end mt-1">
                      {isHigher && <ArrowUpRight className="w-4 h-4" style={{ color: palette.crimson[400] }} />}
                      {isLower && <ArrowDownRight className="w-4 h-4" style={{ color: palette.emerald[500] }} />}
                      <span
                        className="text-xs font-bold"
                        style={{ color: isHigher ? palette.crimson[400] : isLower ? palette.emerald[500] : COLOR_TEXT_SECONDARY }}
                      >
                        {Math.abs(comp.percentageDiff)}% {isHigher ? 'overvalued' : isLower ? 'undervalued' : 'at market'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 rounded-lg" style={{ background: palette.ink[50] }}>
                    <p className="text-xs font-bold mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                      Revenue
                    </p>
                    <p className="text-sm font-black" style={{ color: COLOR_PRIMARY }}>
                      AED {(comp.revenue / 1000000).toFixed(1)}M
                    </p>
                  </div>
                  <div className="p-3 rounded-lg" style={{ background: palette.ink[50] }}>
                    <p className="text-xs font-bold mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                      Valuation
                    </p>
                    <p className="text-sm font-black" style={{ color: COLOR_PRIMARY }}>
                      AED {(comp.valuation / 1000000).toFixed(0)}M
                    </p>
                  </div>
                  <div className="p-3 rounded-lg" style={{ background: COLOR_ACCENT + '20' }}>
                    <p className="text-xs font-bold mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                      vs Your Deal
                    </p>
                    <p className="text-sm font-black" style={{ color: COLOR_ACCENT }}>
                      {comp.compareToYour.toFixed(1)}x
                    </p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      )}

      {/* ==================== CRITICAL ALERTS TAB ==================== */}
      {selectedTab === 'alerts' && (
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {alerts.length === 0 ? (
            <motion.div
              className="p-8 rounded-lg border-2 text-center"
              style={{ borderColor: COLOR_BORDER, background: palette.emerald[50] }}
            >
              <CheckCircle2 className="w-8 h-8 mx-auto mb-2" style={{ color: palette.emerald[500] }} />
              <p className="font-bold" style={{ color: palette.emerald[500] }}>
                All Clear!
              </p>
              <p className="text-sm mt-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                No critical alerts at this time
              </p>
            </motion.div>
          ) : (
            alerts.map((alert, idx) => (
              <motion.div
                key={alert.id}
                className="p-4 rounded-lg border-l-4"
                style={{
                  borderLeftColor: alert.severity === 'high' ? palette.crimson[400] : alert.severity === 'medium' ? palette.amber[500] : palette.champagne[500],
                  background: alert.severity === 'high' ? palette.crimson[50] : alert.severity === 'medium' ? palette.amber[50] : palette.champagne[50],
                }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {alert.severity === 'high' && (
                        <AlertTriangle className="w-4 h-4" style={{ color: palette.crimson[400] }} />
                      )}
                      {alert.severity === 'medium' && (
                        <AlertCircle className="w-4 h-4" style={{ color: palette.amber[500] }} />
                      )}
                      {alert.severity === 'low' && (
                        <AlertCircle className="w-4 h-4" style={{ color: palette.champagne[500] }} />
                      )}
                      <h3 className="font-bold text-sm" style={{ color: COLOR_PRIMARY }}>
                        {alert.title}
                      </h3>
                    </div>
                    <p className="text-xs mb-2" style={{ color: COLOR_TEXT_SECONDARY }}>
                      {alert.description}
                    </p>
                    <p className="text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>
                      {alert.timestamp}
                    </p>
                  </div>
                  {alert.action && (
                    alert.actionHref ? (
                      <Link href={alert.actionHref}
                        className="px-3 py-1 rounded text-xs font-bold whitespace-nowrap border"
                        style={{ borderColor: COLOR_ACCENT, color: COLOR_ACCENT }}>
                        {alert.action}
                      </Link>
                    ) : (
                      <button disabled
                        className="px-3 py-1 rounded text-xs font-bold whitespace-nowrap border cursor-not-allowed opacity-50"
                        style={{ borderColor: COLOR_BORDER, color: COLOR_TEXT_SECONDARY }}
                        title="Action not yet wired">
                        {alert.action}
                      </button>
                    )
                  )}
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      )}
    </div>
  )
}

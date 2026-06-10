'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, AlertCircle, Clock, Target, DollarSign, Users, CheckCircle2, Zap } from 'lucide-react'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER, COLOR_SURFACE_SUCCESS } from '@/styles/forward-colors'

interface DealMetric {
  stage: string
  count: number
  value: number
  daysInStage: number
  riskLevel: 'low' | 'medium' | 'high'
}

interface SellerDashboardSummaryProps {
  companyName: string
  totalDeals: number
  activeDeals: number
  totalPipelineValue: number
  currency: string
  dealsByStage: DealMetric[]
  riskIndicators: {
    totalRisks: number
    high: number
    medium: number
    low: number
  }
  keyMetrics: {
    avgDaysToClose: number
    avgDealSize: number
    conversionRate: number
    commissionsEarned: number
    commissionRate: number
  }
  trends: {
    pipelineGrowth: number
    activeDealsGrowth: number
    closureRate: number
  }
}

export function SellerDashboardSummary({
  companyName,
  totalDeals,
  activeDeals,
  totalPipelineValue,
  currency,
  dealsByStage,
  riskIndicators,
  keyMetrics,
  trends,
}: SellerDashboardSummaryProps) {
  const [selectedDealStage, setSelectedDealStage] = useState<string | null>(null)

  const formatCurrency = (value: number) => {
    const divisor = value >= 1000000 ? 1000000 : 1000
    const suffix = value >= 1000000 ? 'M' : 'K'
    return `${(value / divisor).toFixed(1)}${suffix}`
  }

  return (
    <div className="space-y-6">
      {/* Primary Metrics Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ staggerChildren: 0.1 }}
      >
        {/* Total Pipeline Value */}
        <motion.div
          className="p-6 rounded-lg border bg-white"
          style={{ borderColor: COLOR_BORDER }}
          whileHover={{ y: -2 }}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs font-bold mb-2" style={{ color: COLOR_TEXT_SECONDARY }}>
                PIPELINE VALUE
              </p>
              <p className="text-3xl font-black" style={{ color: COLOR_PRIMARY }}>
                {currency} {formatCurrency(totalPipelineValue)}
              </p>
            </div>
            <div
              className="p-3 rounded-lg"
              style={{ background: COLOR_ACCENT + '20' }}
            >
              <DollarSign className="w-5 h-5" style={{ color: COLOR_ACCENT }} />
            </div>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="w-4 h-4" style={{ color: '#10B981' }} />
            <span className="text-xs font-bold" style={{ color: '#10B981' }}>
              ↑ {trends.pipelineGrowth}% this quarter
            </span>
          </div>
        </motion.div>

        {/* Active Deals */}
        <motion.div
          className="p-6 rounded-lg border bg-white"
          style={{ borderColor: COLOR_BORDER }}
          whileHover={{ y: -2 }}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs font-bold mb-2" style={{ color: COLOR_TEXT_SECONDARY }}>
                ACTIVE DEALS
              </p>
              <p className="text-3xl font-black" style={{ color: COLOR_PRIMARY }}>
                {activeDeals}
              </p>
              <p className="text-xs mt-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                of {totalDeals} total
              </p>
            </div>
            <div
              className="p-3 rounded-lg"
              style={{ background: COLOR_ACCENT + '20' }}
            >
              <Zap className="w-5 h-5" style={{ color: COLOR_ACCENT }} />
            </div>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="w-4 h-4" style={{ color: '#10B981' }} />
            <span className="text-xs font-bold" style={{ color: '#10B981' }}>
              ↑ {trends.activeDealsGrowth}% from last month
            </span>
          </div>
        </motion.div>

        {/* Avg Deal Size */}
        <motion.div
          className="p-6 rounded-lg border bg-white"
          style={{ borderColor: COLOR_BORDER }}
          whileHover={{ y: -2 }}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs font-bold mb-2" style={{ color: COLOR_TEXT_SECONDARY }}>
                AVG DEAL SIZE
              </p>
              <p className="text-3xl font-black" style={{ color: COLOR_PRIMARY }}>
                {currency} {formatCurrency(keyMetrics.avgDealSize)}
              </p>
            </div>
            <div
              className="p-3 rounded-lg"
              style={{ background: '#10B981' + '20' }}
            >
              <Target className="w-5 h-5" style={{ color: '#10B981' }} />
            </div>
          </div>
          <p className="text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>
            Median size across all active deals
          </p>
        </motion.div>

        {/* Closure Rate */}
        <motion.div
          className="p-6 rounded-lg border bg-white"
          style={{ borderColor: COLOR_BORDER }}
          whileHover={{ y: -2 }}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs font-bold mb-2" style={{ color: COLOR_TEXT_SECONDARY }}>
                CLOSURE RATE
              </p>
              <p className="text-3xl font-black" style={{ color: COLOR_PRIMARY }}>
                {keyMetrics.conversionRate}%
              </p>
            </div>
            <div
              className="p-3 rounded-lg"
              style={{ background: '#10B981' + '20' }}
            >
              <CheckCircle2 className="w-5 h-5" style={{ color: '#10B981' }} />
            </div>
          </div>
          <p className="text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>
            {trends.closureRate}% vs target
          </p>
        </motion.div>
      </motion.div>

      {/* Deal Aging & Pipeline Stage Analysis */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, staggerChildren: 0.05 }}
      >
        {/* Deal Aging Timeline */}
        <motion.div
          className="p-6 rounded-lg border bg-white"
          style={{ borderColor: COLOR_BORDER }}
        >
          <h3 className="text-lg font-bold mb-6" style={{ color: COLOR_PRIMARY }}>
            📊 Deal Aging Analysis
          </h3>
          <div className="space-y-4">
            {dealsByStage.map((stage, idx) => {
              const maxDays = Math.max(...dealsByStage.map(s => s.daysInStage))
              const percentComplete = (stage.daysInStage / maxDays) * 100
              const riskColor = stage.riskLevel === 'high' ? '#EF4444' : stage.riskLevel === 'medium' ? '#F59E0B' : '#10B981'

              return (
                <motion.div
                  key={idx}
                  className="p-4 rounded-lg border cursor-pointer transition-all"
                  style={{
                    borderColor: selectedDealStage === stage.stage ? COLOR_ACCENT : COLOR_BORDER,
                    background: selectedDealStage === stage.stage ? COLOR_ACCENT + '08' : '#FAFAF8',
                  }}
                  onClick={() => setSelectedDealStage(selectedDealStage === stage.stage ? null : stage.stage)}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-bold text-sm" style={{ color: COLOR_PRIMARY }}>
                        {stage.stage}
                      </p>
                      <p className="text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>
                        {stage.count} deal{stage.count !== 1 ? 's' : ''} • {currency} {formatCurrency(stage.value)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold" style={{ color: riskColor }}>
                        {stage.daysInStage}d
                      </p>
                      <p className="text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>
                        in stage
                      </p>
                    </div>
                  </div>
                  <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
                    <motion.div
                      className="h-full"
                      style={{ background: riskColor }}
                      initial={{ width: 0 }}
                      animate={{ width: `${percentComplete}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                    />
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ background: riskColor }}
                    />
                    <span className="text-xs font-bold" style={{ color: riskColor }}>
                      {stage.riskLevel === 'high' ? 'HIGH RISK' : stage.riskLevel === 'medium' ? 'MEDIUM RISK' : 'LOW RISK'}
                    </span>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Risk & Issues Dashboard */}
        <motion.div
          className="p-6 rounded-lg border bg-white"
          style={{ borderColor: COLOR_BORDER }}
        >
          <h3 className="text-lg font-bold mb-6" style={{ color: COLOR_PRIMARY }}>
            ⚠️ Risk Assessment
          </h3>

          {/* Risk Summary */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-4 rounded-lg text-center" style={{ background: '#F3F4F6' }}>
              <p className="text-2xl font-black" style={{ color: '#EF4444' }}>
                {riskIndicators.high}
              </p>
              <p className="text-xs font-bold mt-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                High Risk
              </p>
            </div>
            <div className="p-4 rounded-lg text-center" style={{ background: '#FEF3C7' }}>
              <p className="text-2xl font-black" style={{ color: '#F59E0B' }}>
                {riskIndicators.medium}
              </p>
              <p className="text-xs font-bold mt-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                Medium Risk
              </p>
            </div>
            <div className="p-4 rounded-lg text-center" style={{ background: '#DCFCE7' }}>
              <p className="text-2xl font-black" style={{ color: '#10B981' }}>
                {riskIndicators.low}
              </p>
              <p className="text-xs font-bold mt-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                Low Risk
              </p>
            </div>
          </div>

          {/* Critical Issues */}
          <div>
            <h4 className="font-bold text-sm mb-3 flex items-center gap-2" style={{ color: COLOR_PRIMARY }}>
              <AlertCircle className="w-4 h-4" style={{ color: '#EF4444' }} />
              Critical Issues
            </h4>
            <div className="space-y-2">
              {riskIndicators.high > 0 && (
                <div className="p-3 rounded-lg border-l-4" style={{ borderLeftColor: '#EF4444', background: '#FEF2F2' }}>
                  <p className="text-sm font-bold" style={{ color: '#EF4444' }}>
                    {riskIndicators.high} deal{riskIndicators.high !== 1 ? 's' : ''} at risk of stalling
                  </p>
                  <p className="text-xs mt-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                    Deals exceeding expected stage duration - requires immediate action
                  </p>
                </div>
              )}
              {riskIndicators.medium > 0 && (
                <div className="p-3 rounded-lg border-l-4" style={{ borderLeftColor: '#F59E0B', background: '#FFFBEB' }}>
                  <p className="text-sm font-bold" style={{ color: '#F59E0B' }}>
                    {riskIndicators.medium} deal{riskIndicators.medium !== 1 ? 's' : ''} showing friction
                  </p>
                  <p className="text-xs mt-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                    Monitor closely for potential delays
                  </p>
                </div>
              )}
              {riskIndicators.high === 0 && riskIndicators.medium === 0 && (
                <div className="p-3 rounded-lg border-l-4" style={{ borderLeftColor: '#10B981', background: '#F0FDF4' }}>
                  <p className="text-sm font-bold" style={{ color: '#10B981' }}>
                    All systems go
                  </p>
                  <p className="text-xs mt-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                    No critical issues detected
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Commission & Performance KPIs */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {/* Commissions Earned */}
        <motion.div
          className="p-6 rounded-lg border bg-white"
          style={{ borderColor: COLOR_BORDER }}
          whileHover={{ y: -2 }}
        >
          <h4 className="text-xs font-bold mb-3" style={{ color: COLOR_TEXT_SECONDARY }}>
            COMMISSIONS EARNED
          </h4>
          <div className="mb-4">
            <p className="text-3xl font-black" style={{ color: COLOR_ACCENT }}>
              {currency} {formatCurrency(keyMetrics.commissionsEarned)}
            </p>
            <p className="text-sm mt-2" style={{ color: COLOR_TEXT_SECONDARY }}>
              @ {keyMetrics.commissionRate}% average rate
            </p>
          </div>
          <div className="pt-4 border-t" style={{ borderColor: COLOR_BORDER }}>
            <p className="text-xs font-bold" style={{ color: COLOR_TEXT_SECONDARY }}>
              Projected annual: {currency} {formatCurrency(keyMetrics.commissionsEarned * 4)}
            </p>
          </div>
        </motion.div>

        {/* Average Time to Close */}
        <motion.div
          className="p-6 rounded-lg border bg-white"
          style={{ borderColor: COLOR_BORDER }}
          whileHover={{ y: -2 }}
        >
          <h4 className="text-xs font-bold mb-3 flex items-center gap-2" style={{ color: COLOR_TEXT_SECONDARY }}>
            <Clock className="w-4 h-4" />
            AVG TIME TO CLOSE
          </h4>
          <div className="mb-4">
            <p className="text-3xl font-black" style={{ color: COLOR_PRIMARY }}>
              {keyMetrics.avgDaysToClose}
            </p>
            <p className="text-sm mt-2" style={{ color: COLOR_TEXT_SECONDARY }}>
              days from interest to close
            </p>
          </div>
          <div className="pt-4 border-t" style={{ borderColor: COLOR_BORDER }}>
            <p className="text-xs font-bold" style={{ color: COLOR_TEXT_SECONDARY }}>
              Industry benchmark: 115 days
            </p>
          </div>
        </motion.div>

        {/* Buyer Engagement */}
        <motion.div
          className="p-6 rounded-lg border bg-white"
          style={{ borderColor: COLOR_BORDER }}
          whileHover={{ y: -2 }}
        >
          <h4 className="text-xs font-bold mb-3 flex items-center gap-2" style={{ color: COLOR_TEXT_SECONDARY }}>
            <Users className="w-4 h-4" />
            BUYER ENGAGEMENT
          </h4>
          <div className="mb-4">
            <p className="text-3xl font-black" style={{ color: COLOR_PRIMARY }}>
              {totalDeals * 2.4}
            </p>
            <p className="text-sm mt-2" style={{ color: COLOR_TEXT_SECONDARY }}>
              qualified buyer interactions
            </p>
          </div>
          <div className="pt-4 border-t" style={{ borderColor: COLOR_BORDER }}>
            <p className="text-xs font-bold" style={{ color: COLOR_TEXT_SECONDARY }}>
              Avg: {(totalDeals * 2.4 / totalDeals).toFixed(1)} per deal
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp, BarChart3, LineChart, DollarSign, Zap, AlertCircle,
  ChevronRight, Download, Share2, Edit2, Copy, Lock, Unlock
} from 'lucide-react'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER } from '@/styles/forward-colors'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

interface Scenario {
  id: string
  name: string
  buyerType: string
  baseRevenue: number
  growthRate: number
  revenueMultiple: number
  ebitdaMultiple: number
  growthPremium: number
  expectedValuation: number
  color: string
  confidence: number
}

const mockScenarios: Scenario[] = [
  {
    id: '1',
    name: 'Conservative',
    buyerType: 'PE Firm',
    baseRevenue: 5000000,
    growthRate: 0.18,
    revenueMultiple: 6.5,
    ebitdaMultiple: 20,
    growthPremium: 1.08,
    expectedValuation: 10800000,
    color: '#EF4444',
    confidence: 92,
  },
  {
    id: '2',
    name: 'Base Case',
    buyerType: 'Strategic',
    baseRevenue: 5000000,
    growthRate: 0.24,
    revenueMultiple: 8,
    ebitdaMultiple: 25,
    growthPremium: 1.15,
    expectedValuation: 13200000,
    color: COLOR_ACCENT,
    confidence: 88,
  },
  {
    id: '3',
    name: 'Optimistic',
    buyerType: 'Family Office',
    baseRevenue: 5000000,
    growthRate: 0.30,
    revenueMultiple: 10,
    ebitdaMultiple: 30,
    growthPremium: 1.25,
    expectedValuation: 16500000,
    color: '#10B981',
    confidence: 75,
  },
  {
    id: '4',
    name: 'IPO Ready',
    buyerType: 'Public Market',
    baseRevenue: 5000000,
    growthRate: 0.35,
    revenueMultiple: 12,
    ebitdaMultiple: 40,
    growthPremium: 1.35,
    expectedValuation: 21600000,
    color: '#8B5CF6',
    confidence: 45,
  },
]

const assumptions = [
  { label: 'Current Revenue (AED)', key: 'revenue', value: 'AED 5M' },
  { label: 'EBITDA Margin', key: 'ebitda', value: '30%' },
  { label: 'Growth Rate (YoY)', key: 'growth', value: '+24%' },
  { label: 'Market Conditions', key: 'market', value: 'Favorable' },
  { label: 'Customer Concentration', key: 'concentration', value: '48% (Top 5)' },
  { label: 'Buyer Competition', key: 'competition', value: 'High (5 serious)' },
]

const financialLevers = [
  {
    name: 'Revenue Growth',
    impact: '+5M per additional 10%',
    control: 'Seller Actions',
  },
  {
    name: 'EBITDA Margin Improvement',
    impact: '+2.5M per 5% margin improvement',
    control: 'Cost Optimization',
  },
  {
    name: 'Market Multiple Expansion',
    impact: '+1.5M per 1x multiple increase',
    control: 'Market Conditions',
  },
  {
    name: 'Synergy Realization',
    impact: '+2-3M if buyer is strategic',
    control: 'Buyer Type Selection',
  },
]

export default function FinancialModelingPage() {
  const [selectedScenario, setSelectedScenario] = useState<string | null>('2')
  const [editMode, setEditMode] = useState(false)

  const selected = mockScenarios.find(s => s.id === selectedScenario)
  const minValuation = Math.min(...mockScenarios.map(s => s.expectedValuation))
  const maxValuation = Math.max(...mockScenarios.map(s => s.expectedValuation))
  const avgValuation = Math.round(mockScenarios.reduce((sum, s) => sum + s.expectedValuation, 0) / mockScenarios.length)

  return (
    <motion.div
      className="max-w-7xl mx-auto px-8 py-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-12">
        <h1 className="text-4xl font-black mb-3" style={{ color: COLOR_PRIMARY }}>
          Financial Modeling & Scenarios
        </h1>
        <p className="text-lg" style={{ color: COLOR_TEXT_SECONDARY }}>
          Explore valuation scenarios based on buyer type, market conditions, and financial assumptions.
        </p>
      </motion.div>

      {/* Key Assumptions */}
      <motion.div className="mb-12 p-8 rounded-lg border-2" style={{ borderColor: COLOR_BORDER, background: 'white' }} variants={itemVariants}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold" style={{ color: COLOR_PRIMARY }}>
            📊 Key Assumptions
          </h3>
          <button
            onClick={() => setEditMode(!editMode)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border font-bold text-sm"
            style={{ borderColor: COLOR_ACCENT, color: COLOR_ACCENT }}
          >
            <Edit2 className="w-4 h-4" />
            {editMode ? 'Done' : 'Edit'}
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
          {assumptions.map((assumption, idx) => (
            <div
              key={idx}
              className="p-4 rounded-lg border"
              style={{ borderColor: COLOR_BORDER, background: editMode ? COLOR_ACCENT + '08' : '#FAFAF8' }}
            >
              <p className="text-xs font-bold mb-2" style={{ color: COLOR_TEXT_SECONDARY }}>
                {assumption.label}
              </p>
              <p className="text-lg font-black" style={{ color: COLOR_PRIMARY }}>
                {assumption.value}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Valuation Range Overview */}
      <motion.div className="mb-12 grid grid-cols-1 lg:grid-cols-4 gap-6" variants={containerVariants}>
        {[
          { label: 'Floor (Conservative)', value: `AED ${minValuation/1000000}M`, color: '#EF4444' },
          { label: 'Target (Base Case)', value: `AED ${selected?.expectedValuation/1000000 || avgValuation/1000000}M`, color: COLOR_ACCENT },
          { label: 'Upside (Optimistic)', value: `AED ${maxValuation/1000000}M`, color: '#10B981' },
          { label: 'Valuation Range', value: `AED ${minValuation/1000000}M - ${maxValuation/1000000}M`, color: '#8B5CF6' },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            className="p-6 rounded-lg border-2"
            style={{ borderColor: COLOR_BORDER, background: 'white' }}
            variants={itemVariants}
          >
            <p className="text-sm font-bold mb-2" style={{ color: COLOR_TEXT_SECONDARY }}>
              {stat.label}
            </p>
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ background: stat.color + '20' }}
              >
                <DollarSign className="w-6 h-6" style={{ color: stat.color }} />
              </div>
              <div>
                <p className="text-2xl font-black" style={{ color: COLOR_PRIMARY }}>
                  {stat.value}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Scenario Cards */}
      <motion.div className="mb-12" variants={itemVariants}>
        <h3 className="text-xl font-bold mb-6" style={{ color: COLOR_PRIMARY }}>
          🎯 Valuation Scenarios
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockScenarios.map((scenario) => (
            <motion.div
              key={scenario.id}
              className="p-6 rounded-lg border-2 cursor-pointer hover:shadow-lg transition-all"
              style={{
                borderColor: selectedScenario === scenario.id ? COLOR_ACCENT : COLOR_BORDER,
                background: selectedScenario === scenario.id ? scenario.color + '08' : 'white',
                borderLeft: `6px solid ${scenario.color}`,
              }}
              onClick={() => setSelectedScenario(scenario.id)}
              whileHover={{ y: -4 }}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-lg font-bold" style={{ color: COLOR_PRIMARY }}>
                    {scenario.name}
                  </h4>
                  <p className="text-sm mt-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                    {scenario.buyerType}
                  </p>
                </div>
                <div
                  className="px-3 py-1 rounded-full text-xs font-bold"
                  style={{ background: scenario.color + '20', color: scenario.color }}
                >
                  {scenario.confidence}% confidence
                </div>
              </div>

              {/* Valuation Highlight */}
              <div className="p-4 rounded-lg mb-4" style={{ background: scenario.color + '15' }}>
                <p className="text-xs font-bold mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                  Expected Valuation
                </p>
                <p className="text-3xl font-black" style={{ color: scenario.color }}>
                  AED {(scenario.expectedValuation / 1000000).toFixed(1)}M
                </p>
              </div>

              {/* Multiples */}
              <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b" style={{ borderColor: COLOR_BORDER }}>
                <div>
                  <p className="text-xs font-bold mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                    Revenue Multiple
                  </p>
                  <p className="font-bold" style={{ color: COLOR_PRIMARY }}>
                    {scenario.revenueMultiple}x
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                    EBITDA Multiple
                  </p>
                  <p className="font-bold" style={{ color: COLOR_PRIMARY }}>
                    {scenario.ebitdaMultiple}x
                  </p>
                </div>
              </div>

              {/* Growth Rate */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                    Growth Rate
                  </p>
                  <p className="font-bold" style={{ color: COLOR_PRIMARY }}>
                    +{Math.round(scenario.growthRate * 100)}%
                  </p>
                </div>
                <TrendingUp className="w-5 h-5" style={{ color: scenario.color }} />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Selected Scenario Detail */}
      {selected && (
        <motion.div className="mb-12 p-8 rounded-lg border-2" style={{ borderColor: COLOR_BORDER, background: selected.color + '05' }} variants={itemVariants}>
          <div className="flex items-center gap-3 mb-6">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: selected.color }}
            >
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold" style={{ color: COLOR_PRIMARY }}>
                {selected.name} Scenario Analysis
              </h3>
              <p style={{ color: COLOR_TEXT_SECONDARY }}>{selected.buyerType} perspective</p>
            </div>
          </div>

          {/* Detailed Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {[
              { label: 'Base Revenue', value: `AED ${(selected.baseRevenue / 1000000).toFixed(1)}M` },
              { label: 'Revenue Multiple', value: `${selected.revenueMultiple}x` },
              { label: 'Growth Premium', value: `${Math.round((selected.growthPremium - 1) * 100)}%` },
              { label: 'Final Valuation', value: `AED ${(selected.expectedValuation / 1000000).toFixed(1)}M` },
            ].map((item) => (
              <div key={item.label} className="p-4 rounded-lg" style={{ background: 'white' }}>
                <p className="text-xs font-bold mb-2" style={{ color: COLOR_TEXT_SECONDARY }}>
                  {item.label}
                </p>
                <p className="text-2xl font-black" style={{ color: selected.color }}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          {/* Buyer Rationale */}
          <div className="mt-6 pt-6 border-t" style={{ borderColor: COLOR_BORDER }}>
            <p className="text-sm mb-3" style={{ color: COLOR_TEXT_SECONDARY }}>
              <strong>Why {selected.buyerType} would offer this:</strong> Based on industry benchmarks for
              {selected.buyerType === 'Strategic' && ' strategic M&A (synergy premium of 10-15%)'}
              {selected.buyerType === 'PE Firm' && ' PE roll-ups (conservative 5-7% discount)'}
              {selected.buyerType === 'Family Office' && ' long-term value investing (growth premium of 15-20%)'}
              {selected.buyerType === 'Public Market' && ' public market multiples (25-40x EBITDA)'}
              .
            </p>
          </div>
        </motion.div>
      )}

      {/* Financial Levers */}
      <motion.div className="mb-12" variants={itemVariants}>
        <h3 className="text-xl font-bold mb-6" style={{ color: COLOR_PRIMARY }}>
          🎚️ Valuation Levers (How to Increase Deal Value)
        </h3>
        <div className="space-y-3">
          {financialLevers.map((lever, idx) => (
            <motion.div
              key={idx}
              className="p-4 rounded-lg border flex items-start gap-4 hover:shadow-md transition-all"
              style={{ borderColor: COLOR_BORDER, background: 'white' }}
              whileHover={{ x: 4 }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0"
                style={{ background: COLOR_ACCENT }}
              >
                {idx + 1}
              </div>
              <div className="flex-1">
                <h4 className="font-bold mb-1" style={{ color: COLOR_PRIMARY }}>
                  {lever.name}
                </h4>
                <p className="text-sm mb-2" style={{ color: COLOR_TEXT_SECONDARY }}>
                  {lever.impact}
                </p>
                <p className="text-xs font-bold" style={{ color: COLOR_ACCENT }}>
                  {lever.control}
                </p>
              </div>
              <ChevronRight className="w-5 h-5" style={{ color: COLOR_ACCENT }} />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Sensitivity Analysis */}
      <motion.div className="mb-12 p-8 rounded-lg border-2" style={{ borderColor: COLOR_BORDER, background: COLOR_ACCENT + '08' }} variants={itemVariants}>
        <h3 className="text-xl font-bold mb-6" style={{ color: COLOR_PRIMARY }}>
          📈 Sensitivity Analysis
        </h3>
        <p className="text-sm mb-6" style={{ color: COLOR_TEXT_SECONDARY }}>
          How valuation changes with 10% shifts in key inputs:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { variable: 'Revenue Growth', baseCase: 'AED 13.2M', upside: 'AED 14.1M', downside: 'AED 12.3M', impact: '+/- AED 0.9M' },
            { variable: 'EBITDA Margin', baseCase: 'AED 13.2M', upside: 'AED 14.8M', downside: 'AED 11.6M', impact: '+/- AED 1.6M' },
            { variable: 'Revenue Multiple', baseCase: 'AED 13.2M', upside: 'AED 15.0M', downside: 'AED 11.4M', impact: '+/- AED 1.8M' },
          ].map((analysis, idx) => (
            <div key={idx} className="p-4 rounded-lg" style={{ background: 'white' }}>
              <p className="font-bold mb-3" style={{ color: COLOR_PRIMARY }}>
                {analysis.variable}
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span style={{ color: COLOR_TEXT_SECONDARY }}>Base Case:</span>
                  <span className="font-bold" style={{ color: COLOR_PRIMARY }}>
                    {analysis.baseCase}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: '#10B981' }}>Upside (+10%):</span>
                  <span className="font-bold" style={{ color: '#10B981' }}>
                    {analysis.upside}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: '#EF4444' }}>Downside (-10%):</span>
                  <span className="font-bold" style={{ color: '#EF4444' }}>
                    {analysis.downside}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Export CTA */}
      <motion.div className="text-center" variants={itemVariants}>
        <button className="inline-flex items-center gap-2 px-8 py-3 rounded-lg font-bold text-white transition-all hover:opacity-90 mr-3" style={{ background: COLOR_ACCENT }}>
          <Download className="w-5 h-5" />
          Export Model (Excel)
        </button>
        <button className="inline-flex items-center gap-2 px-8 py-3 rounded-lg font-bold border" style={{ borderColor: COLOR_ACCENT, color: COLOR_ACCENT }}>
          <Share2 className="w-5 h-5" />
          Share with Advisor
        </button>
      </motion.div>
    </motion.div>
  )
}

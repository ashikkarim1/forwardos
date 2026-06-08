'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Users, DollarSign, Clock, TrendingUp, ChevronRight, Plus, Settings,
  Eye, MessageSquare, FileText, AlertCircle, CheckCircle2
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

interface Deal {
  id: string
  buyerName: string
  buyerType: string
  business: string
  proposedPrice: string
  stage: 'lead' | 'qualified' | 'negotiation' | 'loi' | 'closing' | 'closed'
  probability: number
  expectedClose: string
  notes: number
  lastActivity: string
  color: string
}

const mockDeals: Deal[] = [
  {
    id: '1',
    buyerName: 'Ahmed Al Mansouri',
    buyerType: 'Strategic',
    business: 'TechFlow Solutions',
    proposedPrice: 'AED 12-13M',
    stage: 'negotiation',
    probability: 85,
    expectedClose: '3 weeks',
    notes: 4,
    lastActivity: '2 hours ago',
    color: '#3B82F6',
  },
  {
    id: '2',
    buyerName: 'Sarah Khan',
    buyerType: 'PE Firm',
    business: 'TechFlow Solutions',
    proposedPrice: 'AED 11.5-12M',
    stage: 'qualified',
    probability: 72,
    expectedClose: '4 weeks',
    notes: 2,
    lastActivity: '1 day ago',
    color: '#8B5CF6',
  },
  {
    id: '3',
    buyerName: 'Michael Chen',
    buyerType: 'Competitor',
    business: 'TechFlow Solutions',
    proposedPrice: 'AED 10-11M',
    stage: 'lead',
    probability: 45,
    expectedClose: '6 weeks',
    notes: 1,
    lastActivity: '3 days ago',
    color: '#EC4899',
  },
  {
    id: '4',
    buyerName: 'Fatima Al Maktoum',
    buyerType: 'Family Office',
    business: 'Emirates Healthcare',
    proposedPrice: 'AED 14-15M',
    stage: 'loi',
    probability: 92,
    expectedClose: '2 weeks',
    notes: 7,
    lastActivity: '4 hours ago',
    color: '#14B8A6',
  },
  {
    id: '5',
    buyerName: 'Global Tech Fund',
    buyerType: 'PE Firm',
    business: 'Emirates Healthcare',
    proposedPrice: 'AED 13M',
    stage: 'closing',
    probability: 88,
    expectedClose: '1 week',
    notes: 12,
    lastActivity: '30 mins ago',
    color: '#10B981',
  },
  {
    id: '6',
    buyerName: 'Middle East Ventures',
    buyerType: 'VC',
    business: 'FinTech Innovations',
    proposedPrice: 'AED 8-9M',
    stage: 'qualified',
    probability: 65,
    expectedClose: '5 weeks',
    notes: 3,
    lastActivity: '6 hours ago',
    color: '#F59E0B',
  },
]

const stages = [
  { id: 'lead', label: 'Lead', color: '#6B7280', width: 'w-80' },
  { id: 'qualified', label: 'Qualified', color: '#3B82F6', width: 'w-80' },
  { id: 'negotiation', label: 'Negotiation', color: COLOR_ACCENT, width: 'w-80' },
  { id: 'loi', label: 'LOI', color: '#14B8A6', width: 'w-80' },
  { id: 'closing', label: 'Closing', color: '#10B981', width: 'w-80' },
  { id: 'closed', label: 'Closed', color: '#10B981', width: 'w-80' },
]

const getProbabilityColor = (prob: number) => {
  if (prob >= 80) return '#10B981'
  if (prob >= 60) return COLOR_ACCENT
  if (prob >= 40) return '#F59E0B'
  return '#EF4444'
}

export default function DealPipelinePage() {
  const [deals, setDeals] = useState<Deal[]>(mockDeals)

  const dealsByStage = stages.map(stage => ({
    ...stage,
    deals: deals.filter(d => d.stage === stage.id as any),
  }))

  const totalDeals = deals.length
  const totalValue = deals.reduce((sum, d) => {
    const priceMin = parseInt(d.proposedPrice.split('-')[0].replace(/\D/g, ''))
    return sum + priceMin
  }, 0)
  const avgProbability = Math.round(deals.reduce((sum, d) => sum + d.probability, 0) / deals.length)

  return (
    <motion.div
      className="max-w-full px-8 py-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-black mb-2" style={{ color: COLOR_PRIMARY }}>
              Deal Pipeline
            </h1>
            <p className="text-lg" style={{ color: COLOR_TEXT_SECONDARY }}>
              Track buyer engagement across all stages. Drag deals to update status.
            </p>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-white transition-all hover:opacity-90" style={{ background: COLOR_ACCENT }}>
            <Plus className="w-5 h-5" />
            Add Buyer
          </button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Deals', value: totalDeals, icon: Users },
            { label: 'Pipeline Value', value: `AED ${totalValue}M+`, icon: DollarSign },
            { label: 'Avg. Probability', value: `${avgProbability}%`, icon: TrendingUp },
            { label: 'Expected Close', value: '2-3 weeks', icon: Clock },
          ].map((stat) => {
            const Icon = stat.icon
            return (
              <motion.div key={stat.label} className="p-4 rounded-lg border" style={{ borderColor: COLOR_BORDER, background: 'white' }} variants={itemVariants}>
                <div className="flex items-center gap-3 mb-2">
                  <Icon className="w-5 h-5" style={{ color: COLOR_ACCENT }} />
                  <p className="text-xs font-bold" style={{ color: COLOR_TEXT_SECONDARY }}>
                    {stat.label}
                  </p>
                </div>
                <p className="text-2xl font-black" style={{ color: COLOR_PRIMARY }}>
                  {stat.value}
                </p>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* Kanban Board */}
      <motion.div className="overflow-x-auto pb-8" variants={itemVariants}>
        <div className="flex gap-6" style={{ minWidth: '100%' }}>
          {dealsByStage.map((stage) => (
            <div key={stage.id} className={`${stage.width} flex-shrink-0`}>
              {/* Stage Header */}
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ background: stage.color }}
                  />
                  <h3 className="font-bold" style={{ color: COLOR_PRIMARY }}>
                    {stage.label}
                  </h3>
                  <span
                    className="text-xs font-bold px-2 py-1 rounded-full"
                    style={{ background: stage.color + '20', color: stage.color }}
                  >
                    {stage.deals.length}
                  </span>
                </div>
                <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                  <Settings className="w-4 h-4" style={{ color: COLOR_TEXT_SECONDARY }} />
                </button>
              </div>

              {/* Deal Cards */}
              <div className="space-y-3 min-h-96">
                {stage.deals.map((deal) => (
                  <motion.div
                    key={deal.id}
                    className="p-4 rounded-lg border-2 hover:shadow-lg transition-all cursor-grab active:cursor-grabbing"
                    style={{
                      borderColor: deal.color + '40',
                      background: 'white',
                      borderLeft: `4px solid ${deal.color}`,
                    }}
                    whileHover={{ y: -2 }}
                  >
                    {/* Buyer Info */}
                    <div className="mb-3">
                      <p className="font-bold text-sm" style={{ color: COLOR_PRIMARY }}>
                        {deal.buyerName}
                      </p>
                      <p className="text-xs mt-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                        {deal.buyerType}
                      </p>
                      <p className="text-xs mt-2 px-2 py-1 rounded-full font-bold w-fit" style={{ background: COLOR_ACCENT + '20', color: COLOR_ACCENT }}>
                        {deal.business}
                      </p>
                    </div>

                    {/* Price & Probability */}
                    <div className="mb-3 pb-3 border-t" style={{ borderColor: COLOR_BORDER }}>
                      <p className="text-sm font-black" style={{ color: COLOR_PRIMARY }}>
                        {deal.proposedPrice}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="h-2 flex-1 rounded-full" style={{ background: COLOR_BORDER }}>
                          <motion.div
                            className="h-2 rounded-full"
                            style={{ background: getProbabilityColor(deal.probability) }}
                            initial={{ width: 0 }}
                            animate={{ width: `${deal.probability}%` }}
                            transition={{ duration: 0.5 }}
                          />
                        </div>
                        <span className="text-xs font-bold" style={{ color: getProbabilityColor(deal.probability) }}>
                          {deal.probability}%
                        </span>
                      </div>
                    </div>

                    {/* Expected Close */}
                    <p className="text-xs font-bold mb-3" style={{ color: COLOR_TEXT_SECONDARY }}>
                      Close: <span style={{ color: COLOR_PRIMARY }}>{deal.expectedClose}</span>
                    </p>

                    {/* Activity Icons */}
                    <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: COLOR_BORDER }}>
                      <div className="flex gap-2">
                        <div className="flex items-center gap-1">
                          <MessageSquare className="w-4 h-4" style={{ color: '#3B82F6' }} />
                          <span className="text-xs font-bold" style={{ color: COLOR_TEXT_SECONDARY }}>
                            {deal.notes}
                          </span>
                        </div>
                        <span className="text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>
                          {deal.lastActivity}
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4" style={{ color: COLOR_ACCENT }} />
                    </div>
                  </motion.div>
                ))}

                {/* Empty State */}
                {stage.deals.length === 0 && (
                  <div className="flex items-center justify-center h-32 border-2 border-dashed rounded-lg" style={{ borderColor: COLOR_BORDER }}>
                    <p className="text-sm text-center" style={{ color: COLOR_TEXT_SECONDARY }}>
                      No deals in this stage
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Key Metrics Section */}
      <motion.div className="mt-12 p-8 rounded-lg border-2" style={{ borderColor: COLOR_BORDER, background: 'white' }} variants={itemVariants}>
        <h3 className="text-xl font-bold mb-6" style={{ color: COLOR_PRIMARY }}>
          📊 Pipeline Health
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Stage Distribution */}
          <div>
            <p className="font-bold mb-4" style={{ color: COLOR_PRIMARY }}>
              Deals by Stage
            </p>
            <div className="space-y-2">
              {dealsByStage.map((stage) => (
                <div key={stage.id} className="flex items-center gap-3">
                  <div className="flex-1">
                    <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                      {stage.label}
                    </p>
                  </div>
                  <div className="text-sm font-bold" style={{ color: COLOR_PRIMARY }}>
                    {stage.deals.length}
                  </div>
                  <div className="w-20 h-2 rounded-full" style={{ background: COLOR_BORDER }}>
                    <div
                      className="h-2 rounded-full"
                      style={{
                        background: stage.color,
                        width: `${(stage.deals.length / totalDeals) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Probability Distribution */}
          <div>
            <p className="font-bold mb-4" style={{ color: COLOR_PRIMARY }}>
              Close Probability
            </p>
            <div className="space-y-2">
              {[
                { label: 'Very High (80%+)', color: '#10B981', count: deals.filter(d => d.probability >= 80).length },
                { label: 'High (60-80%)', color: COLOR_ACCENT, count: deals.filter(d => d.probability >= 60 && d.probability < 80).length },
                { label: 'Medium (40-60%)', color: '#F59E0B', count: deals.filter(d => d.probability >= 40 && d.probability < 60).length },
                { label: 'Low (<40%)', color: '#EF4444', count: deals.filter(d => d.probability < 40).length },
              ].map((prob) => (
                <div key={prob.label} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ background: prob.color }} />
                  <p className="text-sm flex-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                    {prob.label}
                  </p>
                  <p className="text-sm font-bold" style={{ color: COLOR_PRIMARY }}>
                    {prob.count}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline to Close */}
          <div>
            <p className="font-bold mb-4" style={{ color: COLOR_PRIMARY }}>
              Timeline Distribution
            </p>
            <div className="space-y-2">
              {[
                { label: '1-2 weeks', count: 2 },
                { label: '2-3 weeks', count: 3 },
                { label: '3-4 weeks', count: 1 },
                { label: '5+ weeks', count: 1 },
              ].map((timeline) => (
                <div key={timeline.label} className="flex items-center gap-3">
                  <Clock className="w-4 h-4" style={{ color: COLOR_ACCENT }} />
                  <p className="text-sm flex-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                    {timeline.label}
                  </p>
                  <p className="text-sm font-bold" style={{ color: COLOR_PRIMARY }}>
                    {timeline.count}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* CTA Footer */}
      <motion.div className="mt-8 p-8 rounded-lg text-center" style={{ background: COLOR_ACCENT + '08', borderColor: COLOR_ACCENT, borderWidth: 2 }} variants={itemVariants}>
        <h3 className="text-xl font-bold mb-3" style={{ color: COLOR_PRIMARY }}>
          🚀 Expected Close: 2-3 Weeks
        </h3>
        <p style={{ color: COLOR_TEXT_SECONDARY }} className="mb-6">
          With Ahmed Al Mansouri (Strategic) and Fatima Al Maktoum (Family Office) both at high probability.
        </p>
        <Link href="/dashboard/seller" className="inline-block px-8 py-3 rounded-lg font-bold text-white transition-all hover:opacity-90" style={{ background: COLOR_ACCENT }}>
          View Deal Details →
        </Link>
      </motion.div>
    </motion.div>
  )
}

'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ChevronLeft, Eye, Clock, Users, TrendingUp, MessageSquare, Share2, Lock,
  BarChart3, AlertCircle, CheckCircle2, Download, Calendar
} from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER } from '@/styles/forward-colors'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

// Mock deal details
const mockDealDetails = {
  '1': {
    id: '1',
    name: 'TechFlow Solutions',
    industry: 'SaaS',
    revenue: 'AED 5M',
    growth: '24%',
    views: 567,
    uniqueVisitors: 82,
    returningVisitors: 28,
    dataRoomTime: 12840,
    dataRoomPages: 18,
    stage: 'Due Diligence',
    valuation: 'AED 19M',
    multiple: '3.8x',
    status: 'Published',
    createdAt: '2024-05-10',
    description: 'Fast-growing SaaS platform serving mid-market enterprises with cloud-based solutions.',
    keyMetrics: {
      mrr: 'AED 416K',
      churnRate: '3.2%',
      customerCount: 127,
      nps: 68,
    },
    financials: {
      revenue2024: 'AED 5.0M',
      ebitda2024: 'AED 1.25M',
      growth2024: '24%',
      margin: '25%',
    },
    buyers: [
      { name: 'Ahmed Al-Mansouri', company: 'AlManara Investments', status: 'Active', daysViewing: 5 },
      { name: 'Sarah Khan', company: 'Gulf Capital', status: 'Active', daysViewing: 3 },
    ],
    documents: [
      { name: 'Financial Statements.pdf', views: 12, lastViewed: '2 hours ago' },
      { name: 'Cap Table.xlsx', views: 8, lastViewed: '1 day ago' },
      { name: 'Customer List.pdf', views: 15, lastViewed: '4 hours ago' },
    ],
  },
  '2': {
    id: '2',
    name: 'Emirates Healthcare Network',
    industry: 'Healthcare',
    revenue: 'AED 12M',
    growth: '18%',
    views: 412,
    uniqueVisitors: 56,
    returningVisitors: 19,
    dataRoomTime: 8940,
    dataRoomPages: 14,
    stage: 'Qualification',
    valuation: 'AED 57.6M',
    multiple: '4.8x',
    status: 'Published',
    createdAt: '2024-05-10',
    description: 'Leading healthcare provider network with 24 clinics across UAE.',
    keyMetrics: {
      mrr: 'AED 1M',
      churnRate: '2.1%',
      customerCount: 45,
      nps: 72,
    },
    financials: {
      revenue2024: 'AED 12.0M',
      ebitda2024: 'AED 3.6M',
      growth2024: '18%',
      margin: '30%',
    },
    buyers: [
      { name: 'Fatima Al-Falasi', company: 'Healthcare Ventures', status: 'Active', daysViewing: 8 },
    ],
    documents: [
      { name: 'Medical Licenses.pdf', views: 5, lastViewed: '3 days ago' },
      { name: 'Patient Data (Anonymized).xlsx', views: 3, lastViewed: '5 days ago' },
    ],
  },
  '3': {
    id: '3',
    name: 'DubaiRetail Group',
    industry: 'Retail',
    revenue: 'AED 8M',
    growth: '12%',
    views: 289,
    uniqueVisitors: 41,
    returningVisitors: 12,
    dataRoomTime: 2340,
    dataRoomPages: 8,
    stage: 'Interest',
    valuation: 'AED 28.8M',
    multiple: '3.6x',
    status: 'KYC Pending',
    createdAt: '2024-06-01',
    description: 'Multi-location retail chain with strong brand presence in UAE.',
    keyMetrics: {
      mrr: 'AED 667K',
      churnRate: '4.5%',
      customerCount: 250,
      nps: 58,
    },
    financials: {
      revenue2024: 'AED 8.0M',
      ebitda2024: 'AED 1.6M',
      growth2024: '12%',
      margin: '20%',
    },
    buyers: [],
    documents: [
      { name: 'Store Locations.pdf', views: 2, lastViewed: '2 weeks ago' },
    ],
  },
}

export default function DealDetailPage() {
  const params = useParams()
  const dealId = params.id as string
  const deal = mockDealDetails[dealId as keyof typeof mockDealDetails]

  if (!deal) {
    return (
      <div className="max-w-7xl mx-auto px-8 py-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Link href="/dashboard/seller" className="flex items-center gap-2 text-sm font-bold mb-8" style={{ color: COLOR_ACCENT }}>
            <ChevronLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <div className="p-12 rounded-lg border-2 text-center" style={{ borderColor: COLOR_BORDER }}>
            <p style={{ color: COLOR_TEXT_SECONDARY }}>Deal not found</p>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <motion.div className="max-w-7xl mx-auto px-8 py-8" initial="hidden" animate="visible" variants={containerVariants}>
      {/* Back Button */}
      <motion.div variants={itemVariants} className="mb-8">
        <Link href="/dashboard/seller" className="flex items-center gap-2 text-sm font-bold mb-6" style={{ color: COLOR_ACCENT }}>
          <ChevronLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-4xl font-black mb-2" style={{ color: COLOR_PRIMARY }}>
              {deal.name}
            </h1>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-bold text-white" style={{ background: COLOR_ACCENT }}>
                {deal.industry}
              </span>
              <span className="text-sm font-bold" style={{ color: COLOR_TEXT_SECONDARY }}>
                {deal.stage}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold" style={{
                background: deal.status === 'Published' ? '#DCFCE7' : '#FEF3C7',
                color: deal.status === 'Published' ? '#10B981' : '#F59E0B'
              }}>
                {deal.status}
              </span>
            </div>
          </div>

          <div className="text-right">
            <p className="text-4xl font-black" style={{ color: COLOR_PRIMARY }}>
              {deal.valuation}
            </p>
            <p className="text-sm mt-1" style={{ color: COLOR_TEXT_SECONDARY }}>
              {deal.multiple} revenue multiple
            </p>
          </div>
        </div>
      </motion.div>

      {/* Key Metrics Grid */}
      <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12" variants={containerVariants}>
        {[
          { icon: Eye, label: 'Total Views', value: deal.views, detail: `${deal.uniqueVisitors} unique` },
          { icon: Users, label: 'Returning Visitors', value: deal.returningVisitors, detail: 'of ' + deal.uniqueVisitors },
          { icon: Clock, label: 'Data Room Time', value: `${Math.floor(deal.dataRoomTime / 60)}h`, detail: `${deal.dataRoomPages} pages viewed` },
          { icon: TrendingUp, label: 'Growth Rate', value: deal.growth, detail: 'YoY' },
        ].map((metric, idx) => {
          const Icon = metric.icon
          return (
            <motion.div
              key={idx}
              className="p-6 rounded-lg border-2"
              style={{ borderColor: COLOR_BORDER, background: 'white' }}
              variants={itemVariants}
            >
              <div className="flex items-center gap-3 mb-3">
                <Icon className="w-5 h-5" style={{ color: COLOR_ACCENT }} />
                <span className="text-xs font-bold" style={{ color: COLOR_TEXT_SECONDARY }}>
                  {metric.label}
                </span>
              </div>
              <p className="text-2xl font-black" style={{ color: COLOR_PRIMARY }}>
                {metric.value}
              </p>
              <p className="text-xs mt-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                {metric.detail}
              </p>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Main Content Grid */}
      <motion.div className="grid grid-cols-1 lg:grid-cols-3 gap-6" variants={containerVariants}>
        {/* Left: Description & Financials */}
        <motion.div className="lg:col-span-2 space-y-6" variants={containerVariants}>
          {/* Description */}
          <motion.div className="p-6 rounded-lg border-2" style={{ borderColor: COLOR_BORDER, background: 'white' }} variants={itemVariants}>
            <h2 className="text-xl font-bold mb-4" style={{ color: COLOR_PRIMARY }}>
              About
            </h2>
            <p style={{ color: COLOR_TEXT_SECONDARY }}>
              {deal.description}
            </p>
          </motion.div>

          {/* Financials */}
          <motion.div className="p-6 rounded-lg border-2" style={{ borderColor: COLOR_BORDER, background: 'white' }} variants={itemVariants}>
            <h2 className="text-xl font-bold mb-4" style={{ color: COLOR_PRIMARY }}>
              Financial Overview
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(deal.financials).map(([key, value]) => (
                <div key={key}>
                  <p className="text-xs font-bold mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                    {key.replace(/([A-Z])/g, ' $1').toUpperCase()}
                  </p>
                  <p className="text-lg font-bold" style={{ color: COLOR_PRIMARY }}>
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Key Metrics */}
          <motion.div className="p-6 rounded-lg border-2" style={{ borderColor: COLOR_BORDER, background: 'white' }} variants={itemVariants}>
            <h2 className="text-xl font-bold mb-4" style={{ color: COLOR_PRIMARY }}>
              Key Performance Indicators
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(deal.keyMetrics).map(([key, value]) => (
                <div key={key}>
                  <p className="text-xs font-bold mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                    {key.replace(/([A-Z])/g, ' $1').toUpperCase()}
                  </p>
                  <p className="text-lg font-bold" style={{ color: COLOR_PRIMARY }}>
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Documents */}
          {deal.documents.length > 0 && (
            <motion.div className="p-6 rounded-lg border-2" style={{ borderColor: COLOR_BORDER, background: 'white' }} variants={itemVariants}>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: COLOR_PRIMARY }}>
                <Lock className="w-5 h-5" style={{ color: COLOR_ACCENT }} />
                Data Room Documents
              </h2>
              <div className="space-y-2">
                {deal.documents.map((doc, idx) => (
                  <div key={idx} className="p-3 rounded-lg flex items-center justify-between" style={{ background: '#F3F4F6' }}>
                    <div>
                      <p className="text-sm font-bold" style={{ color: COLOR_PRIMARY }}>
                        {doc.name}
                      </p>
                      <p className="text-xs mt-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                        {doc.views} views • Last viewed {doc.lastViewed}
                      </p>
                    </div>
                    <Download className="w-4 h-4" style={{ color: COLOR_ACCENT }} />
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Right: Sidebar */}
        <motion.div className="space-y-6" variants={containerVariants}>
          {/* Active Buyers */}
          {deal.buyers.length > 0 && (
            <motion.div className="p-6 rounded-lg border-2" style={{ borderColor: COLOR_BORDER, background: 'white' }} variants={itemVariants}>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: COLOR_PRIMARY }}>
                <Users className="w-5 h-5" style={{ color: COLOR_ACCENT }} />
                Active Buyers ({deal.buyers.length})
              </h3>
              <div className="space-y-3">
                {deal.buyers.map((buyer, idx) => (
                  <div key={idx} className="p-3 rounded-lg border" style={{ borderColor: COLOR_BORDER }}>
                    <p className="text-sm font-bold" style={{ color: COLOR_PRIMARY }}>
                      {buyer.name}
                    </p>
                    <p className="text-xs mt-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                      {buyer.company}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs px-2 py-1 rounded-full" style={{ background: '#10B98120', color: '#10B981' }}>
                        {buyer.status}
                      </span>
                      <span className="text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>
                        {buyer.daysViewing}d viewing
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Actions */}
          <motion.div className="space-y-2" variants={itemVariants}>
            <button className="w-full px-4 py-3 rounded-lg font-bold text-white transition-all hover:opacity-90" style={{ background: COLOR_ACCENT }}>
              <MessageSquare className="w-4 h-4 inline mr-2" />
              Message Buyers
            </button>
            <button className="w-full px-4 py-3 rounded-lg font-bold border transition-all hover:bg-gray-100" style={{ borderColor: COLOR_BORDER, color: COLOR_PRIMARY }}>
              <Share2 className="w-4 h-4 inline mr-2" />
              Share Deal
            </button>
            <button className="w-full px-4 py-3 rounded-lg font-bold border transition-all hover:bg-gray-100" style={{ borderColor: COLOR_BORDER, color: COLOR_PRIMARY }}>
              <BarChart3 className="w-4 h-4 inline mr-2" />
              Analytics
            </button>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

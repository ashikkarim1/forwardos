'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  DollarSign, Users, Eye, Lock, TrendingUp, AlertCircle, CheckCircle2, MessageSquare,
  ChevronRight, Calendar, Zap, BarChart3, Settings, FileText, Share2, Download
} from 'lucide-react'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER } from '@/styles/forward-colors'
import { DealPipeline } from '@/components/DealPipeline'
import { DailyIntelligenceDashboard } from '@/components/DailyIntelligenceDashboard'
import { DashboardHeader } from '@/components/DashboardHeader'

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

interface ApprovalRequest {
  id: string
  buyerName: string
  buyerCompany: string
  dealName: string
  sellerName: string
  kycStatus: 'verified' | 'pending'
  requestDate: string
  buyerType: string
}

interface ClientDeal {
  id: string
  sellerName: string
  dealName: string
  status: 'active' | 'negotiating' | 'closed'
  views: number
  inquiries: number
  estimatedCommission: number
  closeProbability: number
}

const mockApprovalRequests: ApprovalRequest[] = [
  {
    id: '1',
    buyerName: 'Ahmed Al Mansouri',
    buyerCompany: 'AlManara Investments',
    dealName: 'TechFlow Solutions',
    sellerName: 'Sarah Tech',
    kycStatus: 'verified',
    requestDate: '2 hours ago',
    buyerType: 'Strategic',
  },
  {
    id: '2',
    buyerName: 'Sarah Khan',
    buyerCompany: 'Gulf Capital Partners',
    dealName: 'TechFlow Solutions',
    sellerName: 'Sarah Tech',
    kycStatus: 'verified',
    requestDate: '4 hours ago',
    buyerType: 'PE Firm',
  },
]

const mockClientDeals: ClientDeal[] = [
  {
    id: '1',
    sellerName: 'Sarah Tech',
    dealName: 'TechFlow Solutions',
    status: 'active',
    views: 342,
    inquiries: 5,
    estimatedCommission: 75000,
    closeProbability: 85,
  },
  {
    id: '2',
    sellerName: 'Fatima Healthcare',
    dealName: 'Emirates Healthcare',
    status: 'negotiating',
    views: 567,
    inquiries: 8,
    estimatedCommission: 120000,
    closeProbability: 72,
  },
]

// Mock deals for pipeline visualization
interface PipelineDeal {
  dealId: string
  title: string
  industry: string
  revenue: number
  valuation?: number
  currentStage?: string
  progressPercent: number
  stageStartedAt: Date
  daysInStage?: number
}

const mockDeals: PipelineDeal[] = [
  {
    dealId: 'deal-1',
    title: 'TechFlow Solutions',
    industry: 'SaaS',
    revenue: 5,
    valuation: 25000000,
    currentStage: 'DUE_DILIGENCE',
    progressPercent: 45,
    stageStartedAt: new Date('2024-06-01'),
    daysInStage: 7,
  },
  {
    dealId: 'deal-2',
    title: 'Emirates Healthcare Network',
    industry: 'Healthcare',
    revenue: 12,
    valuation: 45000000,
    currentStage: 'NEGOTIATION',
    progressPercent: 65,
    stageStartedAt: new Date('2024-05-20'),
    daysInStage: 19,
  },
]

export default function BrokerDashboardV2() {
  const [activeTab, setActiveTab] = useState<'inbox' | 'deals' | 'pipeline' | 'commissions' | 'analytics'>('inbox')
  const [delegatedBroker, setDelegatedBroker] = useState(true) // For this example, assume delegated

  const totalCommissionEarned = 195000
  const thisMonthCommission = 87500
  const estimatedMonthEnd = thisMonthCommission + 45000

  return (
    <>
      {/* Dashboard Header - Consolidated */}
      <DashboardHeader
        breadcrumbs={[
          { label: 'Forward OS', href: '/' },
          { label: 'Broker Dashboard' },
        ]}
        onMenuToggle={() => window.dispatchEvent(new CustomEvent('toggleSidebar'))}
        sidebarOpen={true}
        title="Broker Dashboard"
        subtitle={delegatedBroker
          ? 'Approve data room requests, manage seller clients, track commissions'
          : 'Manage seller clients and track deal progress'}
        stats={[
          {
            label: 'Seller Clients',
            value: '3',
            trend: 'up',
            trendValue: '+1 this month',
          },
          {
            label: 'Active Deals',
            value: mockClientDeals.length,
            trend: 'up',
            trendValue: '2 negotiating',
          },
          {
            label: 'This Month Earned',
            value: `AED ${thisMonthCommission / 1000}K`,
            trend: 'up',
            trendValue: 'On track',
          },
          {
            label: 'Total Commission',
            value: `AED ${totalCommissionEarned / 1000}K`,
            trend: 'up',
            trendValue: '+18%',
          },
        ]}
        userProfile={{
          name: 'Mohamed Al-Maktoum',
          email: 'broker@forward.ae',
          role: 'Deal Broker',
        }}
      />

      <motion.div className="max-w-7xl mx-auto px-8 py-8">
        {/* Header removed - now in DashboardHeader */}
        <motion.div className="mb-8" style={{ display: 'none' }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-black mb-2" style={{ color: COLOR_PRIMARY }}>
                Broker Dashboard
              </h1>
              <p className="text-lg" style={{ color: COLOR_TEXT_SECONDARY }}>
                {delegatedBroker
                  ? 'Approve data room requests, manage seller clients, track commissions'
                  : 'Manage seller clients and track deal progress'}
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { label: 'Seller Clients', value: 3, icon: Users },
              { label: 'Active Deals', value: mockClientDeals.length, icon: FileText },
              { label: 'This Month Earned', value: `AED ${thisMonthCommission / 1000}K`, icon: DollarSign },
              { label: 'Total Commission', value: `AED ${totalCommissionEarned / 1000}K`, icon: TrendingUp },
              delegatedBroker && { label: 'Pending Approvals', value: mockApprovalRequests.length, icon: Lock },
            ].filter(Boolean).map((stat: any) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                className="p-4 rounded-lg border"
                style={{ borderColor: COLOR_BORDER, background: 'white' }}
                variants={itemVariants}
              >
                <div className="flex items-center gap-2 mb-2">
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

      {/* Daily Market Intelligence */}
      <motion.div className="mb-12">
        <DailyIntelligenceDashboard
          userType="broker"
          marketSignals={[
            {
              id: '1',
              title: 'Portfolio Heat: SaaS Spike',
              description: '12 qualified buyers browsing 4 of your SaaS portfolio companies.',
              type: 'hot',
              metric: '+45%',
              change: 45,
              industry: 'SaaS',
              insight: 'Your SaaS clients are in high demand. Expected 2-3 term sheets this week.',
              action: 'Alert clients',
            },
            {
              id: '2',
              title: 'Market Window: Healthcare Closing',
              description: 'Healthcare M&A window peaked. Multiples moving down 8% this week.',
              type: 'alert',
              metric: '4.2x',
              change: -8,
              industry: 'Healthcare',
              insight: 'If you have healthcare clients, this is final window. Recommend acceleration.',
              action: 'Client alert',
            },
            {
              id: '3',
              title: 'Commission Opportunity',
              description: 'Two deals in your pipeline approaching close. Combined AED 450K commission.',
              type: 'trend',
              metric: 'AED 450K',
              change: 100,
              insight: 'TechFlow and Emirates likely to close in next 30 days. Plan cash flow.',
              action: 'Track deals',
            },
            {
              id: '4',
              title: 'ALERT: Broker Matching',
              description: 'Your SaaS seller matches 8 interested buyers. Multi-broker competition.',
              type: 'alert',
              metric: '8 buyers',
              change: 0,
              insight: 'Need to accelerate TechFlow deal or risk losing to competing brokers.',
              action: 'Escalate',
            },
          ]}
          dealMomentum={[
            {
              id: '1',
              dealName: 'TechFlow Solutions (Sarah Tech)',
              stage: 'Due Diligence',
              heat: 92,
              momentum: 'accelerating',
              lastUpdate: '2 hours ago',
              nextAction: 'Coordinate DD with buyers',
              riskLevel: 'low',
            },
            {
              id: '2',
              dealName: 'Emirates Healthcare (Dr. Al-Falasi)',
              stage: 'Negotiation',
              heat: 85,
              momentum: 'accelerating',
              lastUpdate: '3 hours ago',
              nextAction: 'Facilitate term sheet review',
              riskLevel: 'low',
            },
            {
              id: '3',
              dealName: 'DubaiRetail Group (Hassan Al-Mazrouei)',
              stage: 'Interest',
              heat: 38,
              momentum: 'stalling',
              lastUpdate: '3 days ago',
              nextAction: 'Re-engage seller & buyers',
              riskLevel: 'high',
            },
          ]}
          comparables={[
            {
              id: '1',
              dealName: 'TechFlow Solutions',
              industry: 'SaaS',
              revenue: 5000000,
              valuation: 19000000,
              multiple: 3.8,
              compareToYour: 3.8,
              percentageDiff: -5,
              status: 'lower',
            },
            {
              id: '2',
              dealName: 'Emirates Healthcare',
              industry: 'Healthcare',
              revenue: 12000000,
              valuation: 57600000,
              multiple: 4.8,
              compareToYour: 4.8,
              percentageDiff: 8,
              status: 'higher',
            },
            {
              id: '3',
              dealName: 'Similar Retail Deal (Closed)',
              industry: 'Retail',
              revenue: 7500000,
              valuation: 25500000,
              multiple: 3.4,
              compareToYour: 3.0,
              percentageDiff: -12,
              status: 'lower',
            },
          ]}
          alerts={[
            {
              id: '1',
              severity: 'high',
              title: 'DubaiRetail: Lost 3 Days',
              description: 'No activity since weekend. Recommend re-engagement with seller today.',
              timestamp: '3 days ago',
              action: 'Call Now',
            },
            {
              id: '2',
              severity: 'medium',
              title: 'Commission Planning',
              description: 'TechFlow & Emirates expected close in 28-35 days. Plan commission timing.',
              timestamp: '6 hours ago',
              action: 'Plan Ahead',
            },
            {
              id: '3',
              severity: 'medium',
              title: 'Competitive Threat',
              description: 'Another broker is pitching TechFlow to 6 of your identified buyers.',
              timestamp: '4 hours ago',
              action: 'Counter',
            },
          ]}
          personalizedInsights={[
            'Your portfolio timing is excellent: SaaS spike + healthcare window closing = AED 450K commission likely in 30 days. Healthcare clients should move fast.',
          ]}
          lastUpdated="8 minutes ago"
        />
      </motion.div>

      {/* Tab Navigation */}
      <motion.div className="mb-8 flex gap-3 border-b" style={{ borderColor: COLOR_BORDER }}>
        {[
          delegatedBroker && { id: 'inbox', label: '📬 Inbox', icon: Lock, badge: mockApprovalRequests.length },
          { id: 'deals', label: '📊 Client Deals', icon: FileText },
          { id: 'pipeline', label: '🔄 Pipeline', icon: TrendingUp },
          { id: 'commissions', label: '💰 Commissions', icon: DollarSign },
          { id: 'analytics', label: '📈 Analytics', icon: BarChart3 },
        ].filter(Boolean).map((tab: any) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="px-4 py-3 font-bold text-sm transition-all"
            style={{
              color: activeTab === tab.id ? COLOR_ACCENT : COLOR_TEXT_SECONDARY,
              borderBottom: activeTab === tab.id ? `3px solid ${COLOR_ACCENT}` : 'none',
            }}
          >
            {tab.label}
            {tab.badge && (
              <span className="px-2 py-0.5 rounded-full text-xs font-bold text-white ml-1" style={{ background: COLOR_ACCENT }}>
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </motion.div>

      {/* ==================== INBOX TAB ==================== */}
      {activeTab === 'inbox' && delegatedBroker && (
        <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ color: COLOR_PRIMARY }}>
            🚪 Data Room Approval Requests
            <span className="px-3 py-1 rounded-full text-sm font-bold text-white" style={{ background: COLOR_ACCENT }}>
              {mockApprovalRequests.length} Pending
            </span>
          </h2>

          <div className="space-y-4">
            {mockApprovalRequests.map((request) => (
              <motion.div
                key={request.id}
                className="p-6 rounded-lg border-2 hover:shadow-lg transition-all"
                style={{ borderColor: COLOR_ACCENT, background: COLOR_ACCENT + '08' }}
                variants={itemVariants}
              >
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-start">
                  <div>
                    <p className="font-bold text-lg" style={{ color: COLOR_PRIMARY }}>
                      {request.buyerName}
                    </p>
                    <p className="text-sm mt-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                      {request.buyerCompany}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="px-2 py-1 rounded-full text-xs font-bold text-white" style={{ background: COLOR_ACCENT }}>
                        {request.buyerType}
                      </span>
                      {request.kycStatus === 'verified' && (
                        <span className="px-2 py-1 rounded-full text-xs font-bold text-white" style={{ background: '#10B981' }}>
                          ✓ KYC
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-bold mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                      Deal
                    </p>
                    <p className="font-bold" style={{ color: COLOR_PRIMARY }}>
                      {request.dealName}
                    </p>
                    <p className="text-xs mt-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                      Seller: {request.sellerName}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-bold mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                      Requested
                    </p>
                    <p className="font-bold" style={{ color: COLOR_PRIMARY }}>
                      {request.requestDate}
                    </p>
                  </div>

                  <div className="lg:col-span-2 flex gap-2">
                    <button
                      onClick={() => {
                        if (confirm(`Approve ${request.buyerName}'s data room access for ${request.dealName}?`)) {
                          // TODO(api): POST /api/broker/data-room/approve once endpoint lands
                          alert('Approved. Buyer notified and data room access granted.')
                        }
                      }}
                      className="flex-1 px-4 py-2 rounded-lg font-bold text-white transition-all hover:opacity-90"
                      style={{ background: '#10B981' }}
                    >
                      ✓ Approve
                    </button>
                    <Link
                      href={`/messages?to=${encodeURIComponent(request.buyerName)}&deal=${encodeURIComponent(request.dealName)}&intent=request-info`}
                      className="flex-1 text-center px-4 py-2 rounded-lg font-bold border"
                      style={{ borderColor: COLOR_ACCENT, color: COLOR_ACCENT }}
                    >
                      ? Request Info
                    </Link>
                    <button
                      onClick={() => {
                        if (confirm(`Decline ${request.buyerName}'s request for ${request.dealName}?`)) {
                          // TODO(api): POST /api/broker/data-room/decline once endpoint lands
                          alert('Request declined. Buyer notified.')
                        }
                      }}
                      className="px-4 py-2 rounded-lg font-bold border"
                      style={{ borderColor: '#EF4444', color: '#EF4444' }}
                    >
                      ✗ Decline
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ==================== DEALS TAB ==================== */}
      {activeTab === 'deals' && (
        <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
          <h2 className="text-xl font-bold mb-6" style={{ color: COLOR_PRIMARY }}>
            📊 Client Deals ({mockClientDeals.length})
          </h2>

          <div className="space-y-4">
            {mockClientDeals.map((deal) => (
              <motion.div
                key={deal.id}
                className="p-6 rounded-lg border-2 hover:shadow-lg transition-all"
                style={{ borderColor: COLOR_BORDER, background: 'white' }}
                variants={itemVariants}
              >
                <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 items-start">
                  <div>
                    <p className="font-bold text-lg" style={{ color: COLOR_PRIMARY }}>
                      {deal.dealName}
                    </p>
                    <p className="text-sm mt-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                      Seller: {deal.sellerName}
                    </p>
                    <div className="mt-2">
                      <span className="px-2 py-1 rounded-full text-xs font-bold text-white" style={{ background: deal.status === 'active' ? '#10B981' : deal.status === 'negotiating' ? COLOR_ACCENT : '#6B7280' }}>
                        {deal.status === 'active' ? '🟢 Active' : deal.status === 'negotiating' ? '🟡 Negotiating' : '✓ Closed'}
                      </span>
                    </div>
                  </div>

                  <div className="text-center">
                    <Eye className="w-5 h-5 mx-auto mb-2" style={{ color: COLOR_ACCENT }} />
                    <p className="text-xs font-semibold mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                      Views
                    </p>
                    <p className="text-2xl font-black" style={{ color: COLOR_PRIMARY }}>
                      {deal.views}
                    </p>
                  </div>

                  <div className="text-center">
                    <MessageSquare className="w-5 h-5 mx-auto mb-2" style={{ color: COLOR_ACCENT }} />
                    <p className="text-xs font-semibold mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                      Inquiries
                    </p>
                    <p className="text-2xl font-black" style={{ color: COLOR_PRIMARY }}>
                      {deal.inquiries}
                    </p>
                  </div>

                  <div className="text-center">
                    <DollarSign className="w-5 h-5 mx-auto mb-2" style={{ color: COLOR_ACCENT }} />
                    <p className="text-xs font-semibold mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                      Est. Commission
                    </p>
                    <p className="text-xl font-black" style={{ color: COLOR_PRIMARY }}>
                      AED {(deal.estimatedCommission / 1000).toFixed(0)}K
                    </p>
                  </div>

                  <div className="text-center">
                    <TrendingUp className="w-5 h-5 mx-auto mb-2" style={{ color: COLOR_ACCENT }} />
                    <p className="text-xs font-semibold mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                      Close Prob.
                    </p>
                    <p className="text-2xl font-black" style={{ color: COLOR_PRIMARY }}>
                      {deal.closeProbability}%
                    </p>
                  </div>

                  <Link href={`/listing/${deal.id}`} className="px-4 py-2 rounded-lg font-bold border" style={{ borderColor: COLOR_ACCENT, color: COLOR_ACCENT }}>
                    View Details →
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ==================== PIPELINE TAB ==================== */}
      {activeTab === 'pipeline' && (
        <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
          {/* Pipeline Stats */}
          <motion.div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
            {[
              { label: 'Total Deals Managed', value: mockDeals.length, color: COLOR_ACCENT },
              { label: 'In Due Diligence', value: mockDeals.filter(d => d.currentStage === 'DUE_DILIGENCE').length, color: '#FF9C3D' },
              { label: 'In Negotiation', value: mockDeals.filter(d => d.currentStage === 'NEGOTIATION').length, color: '#F59E0B' },
              { label: 'Total Pipeline Value', value: `AED ${((mockDeals.reduce((sum, d) => sum + (d.valuation || 0), 0) / 1000000).toFixed(1))}M`, color: '#10B981' },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                className="p-4 rounded-lg border-2"
                style={{ borderColor: COLOR_BORDER, background: '#FFFFFF' }}
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              >
                <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-xs font-semibold mb-2">
                  {stat.label}
                </p>
                <p className="text-2xl font-black" style={{ color: stat.color }}>
                  {stat.value}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Pipeline Visualization */}
          <motion.div className="bg-white rounded-lg border-2 p-6" style={{ borderColor: COLOR_BORDER }} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
            <DealPipeline
              deals={mockDeals}
              onStageDrop={async () => {}}
              isEditable={false}
            />
          </motion.div>

          {/* Pipeline Notes */}
          <motion.div className="mt-6 p-6 rounded-lg border-2" style={{ borderColor: COLOR_BORDER, background: '#FFFFFF' }} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
            <h3 className="font-bold text-lg mb-4" style={{ color: COLOR_PRIMARY }}>
              Delegated Deal Pipeline
            </h3>
            <p style={{ color: COLOR_TEXT_SECONDARY }} className="leading-relaxed">
              Track all deals you're managing on behalf of your seller clients. Monitor progression through each stage and collaborate with sellers and buyers to keep deals moving forward. Your commission is earned when deals close.
            </p>
          </motion.div>
        </motion.div>
      )}

      {/* ==================== COMMISSIONS TAB ==================== */}
      {activeTab === 'commissions' && (
        <motion.div className="space-y-6" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
          {/* Summary Cards */}
          <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
            {[
              { label: 'This Month Earned', value: `AED ${thisMonthCommission / 1000}K`, trend: '+35% vs last month' },
              { label: 'Estimated Month-End', value: `AED ${estimatedMonthEnd / 1000}K`, trend: '+AED 45K pending' },
              { label: 'Total Earned (YTD)', value: `AED ${totalCommissionEarned / 1000}K`, trend: 'All-time high' },
            ].map((card) => (
              <motion.div
                key={card.label}
                className="p-6 rounded-lg border-2"
                style={{ borderColor: COLOR_BORDER, background: 'white' }}
                variants={itemVariants}
              >
                <p className="text-xs font-bold mb-2" style={{ color: COLOR_TEXT_SECONDARY }}>
                  {card.label}
                </p>
                <p className="text-3xl font-black mb-2" style={{ color: COLOR_PRIMARY }}>
                  {card.value}
                </p>
                <p className="text-xs" style={{ color: COLOR_ACCENT }}>
                  {card.trend}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Commission Breakdown */}
          <motion.div className="p-6 rounded-lg border-2" style={{ borderColor: COLOR_BORDER, background: 'white' }} variants={itemVariants}>
            <h3 className="text-xl font-bold mb-6" style={{ color: COLOR_PRIMARY }}>
              Commission Breakdown by Deal
            </h3>
            <div className="space-y-3">
              {mockClientDeals.map((deal) => (
                <div key={deal.id} className="flex items-center justify-between pb-3" style={{ borderBottom: `1px solid ${COLOR_BORDER}` }}>
                  <div>
                    <p className="font-bold" style={{ color: COLOR_PRIMARY }}>
                      {deal.dealName}
                    </p>
                    <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                      Estimated commission if closed
                    </p>
                  </div>
                  <p className="text-xl font-black" style={{ color: COLOR_ACCENT }}>
                    AED {(deal.estimatedCommission / 1000).toFixed(0)}K
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* ==================== ANALYTICS TAB ==================== */}
      {activeTab === 'analytics' && (
        <motion.div initial="hidden" animate="visible" variants={itemVariants}>
          <div className="p-8 rounded-lg border-2 text-center" style={{ borderColor: COLOR_BORDER, background: COLOR_ACCENT + '08' }}>
            <BarChart3 className="w-12 h-12 mx-auto mb-4" style={{ color: COLOR_ACCENT }} />
            <h2 className="text-xl font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
              Advanced Analytics
            </h2>
            <p style={{ color: COLOR_TEXT_SECONDARY }}>
              Deal velocity, buyer engagement trends, and performance benchmarks coming soon...
            </p>
            <Link href="/market-insights" className="inline-block mt-4 px-6 py-3 rounded-lg font-bold text-white transition-all hover:opacity-90" style={{ background: COLOR_ACCENT }}>
              View Full Analytics
            </Link>
          </div>
        </motion.div>
      )}
      </motion.div>
    </>
  )
}

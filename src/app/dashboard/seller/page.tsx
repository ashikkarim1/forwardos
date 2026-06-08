'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  FileText, Eye, Clock, Users, TrendingUp, AlertCircle, CheckCircle2, MessageSquare,
  ChevronRight, Edit2, Trash2, Plus, Settings, Shield, MoreVertical, Send, X,
  Inbox, BarChart3, Zap, Download, Share2, Lock, Calendar
} from 'lucide-react'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER } from '@/styles/forward-colors'
import { DealPipeline } from '@/components/DealPipeline'
import { DealCreationModal } from '@/components/DealCreationModal'
import { KYCStatusCard } from '@/components/KYCStatusCard'
import { SellerDashboardSummary } from '@/components/SellerDashboardSummary'
import { DailyIntelligenceDashboard } from '@/components/DailyIntelligenceDashboard'
import { DashboardHeader } from '@/components/DashboardHeader'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

interface DataRoomRequest {
  id: string
  buyerName: string
  buyerCompany: string
  buyerType: string
  dealName: string
  kycStatus: 'verified' | 'pending'
  requestDate: string
  status: 'pending' | 'info-requested' | 'declined'
  reason?: string
}

interface Deal {
  id: string
  name: string
  industry: string
  revenue: string
  status: 'published' | 'kyc-pending'
  views: number
  uniqueVisitors: number
  dataRoomTime: number
  dataRoomPages: number
  returningVisitors: number
  kycProgress?: { identity: boolean; documents: boolean; aiVerification: boolean }
  activeViewers?: number
  lastEngagement?: string
  createdAt: string
}

interface Message {
  id: string
  buyerName: string
  lastMessage: string
  timestamp: string
  unread: boolean
}

interface InfoRequest {
  id: string
  buyerName: string
  dealName: string
  requestedDocs: string[]
  requestDate: string
}

const mockDataRoomRequests: DataRoomRequest[] = [
  {
    id: '1',
    buyerName: 'Ahmed Al Mansouri',
    buyerCompany: 'AlManara Investments',
    buyerType: 'Strategic Buyer',
    dealName: 'TechFlow Solutions',
    kycStatus: 'verified',
    requestDate: '2 hours ago',
    status: 'pending',
  },
  {
    id: '2',
    buyerName: 'Sarah Khan',
    buyerCompany: 'Gulf Capital Partners',
    buyerType: 'PE Firm',
    dealName: 'TechFlow Solutions',
    kycStatus: 'verified',
    requestDate: '6 hours ago',
    status: 'pending',
  },
]

const mockMessages: Message[] = [
  {
    id: '1',
    buyerName: 'Ahmed Al Mansouri',
    lastMessage: 'Can you clarify the customer retention metrics?',
    timestamp: '2 hours ago',
    unread: true,
  },
  {
    id: '2',
    buyerName: 'Fatima Al Maktoum',
    lastMessage: 'Thanks for the documents. We\'ll review and follow up.',
    timestamp: '1 day ago',
    unread: false,
  },
]

const mockInfoRequests: InfoRequest[] = [
  {
    id: '1',
    buyerName: 'Michael Chen',
    dealName: 'TechFlow Solutions',
    requestedDocs: ['Customer Contracts', 'Technology Architecture'],
    requestDate: '4 hours ago',
  },
]

const mockDeals: Deal[] = [
  {
    id: '1',
    name: 'TechFlow Solutions',
    industry: 'SaaS',
    revenue: 'AED 5M',
    status: 'published',
    views: 342,
    uniqueVisitors: 47,
    dataRoomTime: 8420,
    dataRoomPages: 12,
    returningVisitors: 12,
    activeViewers: 2,
    lastEngagement: 'Ahmed viewing Financials (23 mins)',
    createdAt: '2024-05-15',
  },
  {
    id: '2',
    name: 'Emirates Healthcare Network',
    industry: 'Healthcare',
    revenue: 'AED 12M',
    status: 'published',
    views: 567,
    uniqueVisitors: 82,
    dataRoomTime: 12840,
    dataRoomPages: 18,
    returningVisitors: 28,
    activeViewers: 1,
    lastEngagement: 'Fatima viewing Cap Table (15 mins)',
    createdAt: '2024-05-10',
  },
  {
    id: '3',
    name: 'DubaiRetail Group',
    industry: 'Retail',
    revenue: 'AED 8M',
    status: 'kyc-pending',
    views: 89,
    uniqueVisitors: 12,
    dataRoomTime: 1240,
    dataRoomPages: 4,
    returningVisitors: 2,
    kycProgress: { identity: true, documents: true, aiVerification: false },
    createdAt: '2024-06-01',
  },
]

export default function SellerDashboardV2() {
  const [activeTab, setActiveTab] = useState<'inbox' | 'deals' | 'analytics' | 'settings' | 'pipeline'>('inbox')
  const [expandedRequest, setExpandedRequest] = useState<string | null>(null)
  const [showApprovalModal, setShowApprovalModal] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<DataRoomRequest | null>(null)
  const [showDealCreation, setShowDealCreation] = useState(false)
  const [collapsedSections, setCollapsedSections] = useState<{ [key: string]: boolean }>({
    messages: false,
    infoRequests: false,
    declined: true,
  })

  const toggleSection = (section: string) => {
    setCollapsedSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  const handleApproveClick = (request: DataRoomRequest) => {
    setSelectedRequest(request)
    setShowApprovalModal(true)
  }

  const handleDealCreation = (formData: any) => {
    console.log('New deal created:', formData)
    // In production, this would submit to an API endpoint
    // For now, just close the modal and show a success message
    alert(`Deal "${formData.companyName}" has been published!`)
    setShowDealCreation(false)
  }

  const publishedDeals = mockDeals.filter(d => d.status === 'published')
  const pendingDeals = mockDeals.filter(d => d.status === 'kyc-pending')
  const totalViews = mockDeals.reduce((sum, d) => sum + d.views, 0)
  const totalRevenue = mockDeals.length * 8 // Avg AED 8M

  return (
    <>
      {/* Dashboard Header - Consolidated */}
      <DashboardHeader
        breadcrumbs={[
          { label: 'Forward OS', href: '/' },
          { label: 'Seller Dashboard' },
        ]}
        onMenuToggle={() => window.dispatchEvent(new CustomEvent('toggleSidebar'))}
        sidebarOpen={true}
        title="Seller Dashboard"
        subtitle="Manage your deals, track buyer interest, and monitor data room access."
        actionButton={{
          label: 'Create Deal',
          onClick: () => setShowDealCreation(true),
          icon: <Plus className="w-4 h-4" />,
        }}
        stats={[
          {
            label: 'Total Deals',
            value: mockDeals.length,
            trend: 'up',
            trendValue: '+2 this month',
          },
          {
            label: 'Published',
            value: publishedDeals.length,
            trend: 'up',
            trendValue: 'All active',
          },
          {
            label: 'Total Views',
            value: totalViews,
            trend: 'up',
            trendValue: '+156 today',
          },
          {
            label: 'Data Room Requests',
            value: mockDataRoomRequests.length,
            trend: 'neutral',
            trendValue: '2 pending',
          },
        ]}
        userProfile={{
          name: 'Ahmed Al-Mansouri',
          email: 'ahmed@forward.ae',
          role: 'Company Owner',
        }}
      />

      <motion.div
        className="max-w-7xl mx-auto px-8 py-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Header removed - now in DashboardHeader */}
        <motion.div variants={itemVariants} className="mb-8" style={{ display: 'none' }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-black mb-2" style={{ color: COLOR_PRIMARY }}>
                Seller Dashboard
              </h1>
              <p className="text-lg" style={{ color: COLOR_TEXT_SECONDARY }}>
                Manage your deals, track buyer interest, and monitor data room access.
              </p>
            </div>
            <button
              onClick={() => setShowDealCreation(true)}
              className="flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-white transition-all hover:opacity-90"
              style={{ background: COLOR_ACCENT }}
            >
              <Plus className="w-5 h-5" />
              Create Deal
            </button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Deals', value: mockDeals.length, icon: FileText },
              { label: 'Published', value: publishedDeals.length, icon: CheckCircle2 },
              { label: 'Total Views', value: totalViews, icon: Eye },
              { label: 'Data Room Requests', value: mockDataRoomRequests.length, badge: true, icon: Inbox },
            ].map((stat) => {
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
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-black" style={{ color: COLOR_PRIMARY }}>
                    {stat.value}
                  </p>
                  {stat.badge && (
                    <span className="px-2 py-1 rounded-full text-xs font-bold text-white" style={{ background: COLOR_ACCENT }}>
                      New
                    </span>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* KYC Status Card */}
      <motion.div variants={itemVariants} className="mb-8">
        <KYCStatusCard
          status="completed"
          completionPercentage={100}
          riskLevel="low"
          approvalStatus="approved"
          lastVerificationDate={new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()}
          expiryDate={new Date(Date.now() + 358 * 24 * 60 * 60 * 1000).toISOString()}
        />
      </motion.div>

      {/* Impact Dashboard Summary */}
      <motion.div variants={itemVariants} className="mb-12">
        <SellerDashboardSummary
          companyName="TechFlow Solutions"
          totalDeals={mockDeals.length}
          activeDeals={publishedDeals.length}
          totalPipelineValue={48000000}
          currency="AED"
          dealsByStage={[
            {
              stage: 'Interest',
              count: 3,
              value: 12000000,
              daysInStage: 5,
              riskLevel: 'low',
            },
            {
              stage: 'Qualification',
              count: 2,
              value: 8000000,
              daysInStage: 12,
              riskLevel: 'low',
            },
            {
              stage: 'Due Diligence',
              count: 1,
              value: 15000000,
              daysInStage: 32,
              riskLevel: 'medium',
            },
            {
              stage: 'Offers',
              count: 1,
              value: 13000000,
              daysInStage: 18,
              riskLevel: 'low',
            },
          ]}
          riskIndicators={{
            totalRisks: 1,
            high: 0,
            medium: 1,
            low: 5,
          }}
          keyMetrics={{
            avgDaysToClose: 87,
            avgDealSize: 12000000,
            conversionRate: 35,
            commissionsEarned: 720000,
            commissionRate: 1.5,
          }}
          trends={{
            pipelineGrowth: 23,
            activeDealsGrowth: 15,
            closureRate: 92,
          }}
        />
      </motion.div>

      {/* Daily Market Intelligence */}
      <motion.div variants={itemVariants} className="mb-12">
        <DailyIntelligenceDashboard
          userType="seller"
          marketSignals={[
            {
              id: '1',
              title: 'Buyer Interest: Healthcare Spike',
              description: '8 qualified buyers browsing healthcare sector today. Your deals are in high demand.',
              type: 'hot',
              metric: '+8 viewers',
              change: 45,
              industry: 'Healthcare',
              insight: 'Healthcare buyers are actively searching. Now is an optimal time to engage with serious prospects.',
              action: 'View interested buyers',
            },
            {
              id: '2',
              title: 'Market Comparables Updated',
              description: 'Similar SaaS companies trading at 4.2-4.8x revenue multiples.',
              type: 'trend',
              metric: '4.5x avg',
              change: 5,
              industry: 'SaaS',
              insight: 'Your SaaS company at 3.8x revenue is attractively priced. Consider this window.',
              action: 'View comparables',
            },
            {
              id: '3',
              title: 'Broker Network Activity',
              description: '2 brokers are actively pitching your deal to their buyer networks.',
              type: 'hot',
              metric: '2 brokers',
              change: 100,
              insight: 'Broker engagement is high. Multiple channels increasing buyer visibility.',
              action: 'Track broker deals',
            },
            {
              id: '4',
              title: 'ALERT: Deal Stalling Risk',
              description: 'TechFlow in Due Diligence for 32 days. Industry average is 21 days.',
              type: 'alert',
              metric: '32 days',
              change: 0,
              insight: 'This deal may lose momentum. Consider proactive outreach to accelerate.',
              action: 'Take action',
            },
          ]}
          dealMomentum={[
            {
              id: '1',
              dealName: 'TechFlow Solutions',
              stage: 'Due Diligence',
              heat: 92,
              momentum: 'accelerating',
              lastUpdate: '1 hour ago',
              nextAction: 'Respond to data requests',
              riskLevel: 'low',
            },
            {
              id: '2',
              dealName: 'Emirates Healthcare',
              stage: 'Qualification',
              heat: 78,
              momentum: 'steady',
              lastUpdate: '4 hours ago',
              nextAction: 'Schedule management meeting',
              riskLevel: 'low',
            },
            {
              id: '3',
              dealName: 'DubaiRetail Group',
              stage: 'Interest',
              heat: 45,
              momentum: 'stalling',
              lastUpdate: '2 days ago',
              nextAction: 'Send follow-up materials',
              riskLevel: 'high',
            },
          ]}
          comparables={[
            {
              id: '1',
              dealName: 'TechFlow Solutions (Your Deal)',
              industry: 'SaaS',
              revenue: 5000000,
              valuation: 19000000,
              multiple: 3.8,
              compareToYour: 3.8,
              percentageDiff: 0,
              status: 'market',
            },
            {
              id: '2',
              dealName: 'Similar SaaS Company A',
              industry: 'SaaS',
              revenue: 4800000,
              valuation: 22080000,
              multiple: 4.6,
              compareToYour: 4.6,
              percentageDiff: 21,
              status: 'higher',
            },
            {
              id: '3',
              dealName: 'Similar SaaS Company B',
              industry: 'SaaS',
              revenue: 5200000,
              valuation: 18720000,
              multiple: 3.6,
              compareToYour: 3.6,
              percentageDiff: -5,
              status: 'lower',
            },
          ]}
          alerts={[
            {
              id: '1',
              severity: 'high',
              title: 'DubaiRetail: Lost Momentum',
              description: 'No buyer activity in 2 days. Recommend immediate follow-up.',
              timestamp: '2 days ago',
              action: 'Reach Out',
            },
            {
              id: '2',
              severity: 'medium',
              title: 'Data Room: New File Needed',
              description: 'Buyer Ahmed Al Mansouri requested additional financial statements.',
              timestamp: '6 hours ago',
              action: 'Upload File',
            },
          ]}
          personalizedInsights={[
            'Healthcare M&A window is open: Your deal matches 6 active buyers. Market multiples are favorable at 4.5x - consider engaging now.',
          ]}
          lastUpdated="15 minutes ago"
        />
      </motion.div>

      {/* Tab Navigation */}
      <motion.div className="mb-8 flex gap-3 border-b overflow-x-auto" style={{ borderColor: COLOR_BORDER }} variants={itemVariants}>
        {[
          { id: 'inbox', label: 'Inbox', icon: Inbox, badge: mockDataRoomRequests.length + mockMessages.filter(m => m.unread).length },
          { id: 'deals', label: 'Deals', icon: FileText },
          { id: 'pipeline', label: 'Pipeline', icon: TrendingUp },
          { id: 'analytics', label: 'Analytics', icon: BarChart3 },
          { id: 'settings', label: 'Settings', icon: Settings },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-3 font-bold text-sm transition-all flex items-center gap-2`}
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
      {activeTab === 'inbox' && (
        <motion.div className="space-y-8" initial="hidden" animate="visible" variants={containerVariants}>
          {/* Data Room Requests */}
          <motion.div variants={itemVariants}>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ color: COLOR_PRIMARY }}>
              Data Room Access Requests
              <span className="px-3 py-1 rounded-full text-sm font-bold text-white" style={{ background: COLOR_ACCENT }}>
                {mockDataRoomRequests.length} Pending
              </span>
            </h2>

            <div className="space-y-4">
              {mockDataRoomRequests.map((request) => (
                <motion.div
                  key={request.id}
                  className="p-6 rounded-lg border-2 hover:shadow-lg transition-all"
                  style={{ borderColor: COLOR_ACCENT, background: COLOR_ACCENT + '08' }}
                  variants={itemVariants}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-start">
                    {/* Buyer Info */}
                    <div>
                      <p className="font-bold text-lg" style={{ color: COLOR_PRIMARY }}>
                        {request.buyerName}
                      </p>
                      <p className="text-sm mt-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                        {request.buyerCompany}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="px-2 py-1 rounded-full text-xs font-bold" style={{ background: COLOR_ACCENT + '20', color: COLOR_ACCENT }}>
                          {request.buyerType}
                        </span>
                        {request.kycStatus === 'verified' && (
                          <span className="px-2 py-1 rounded-full text-xs font-bold text-white" style={{ background: '#10B981' }}>
                            ✓ KYC Verified
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Deal */}
                    <div>
                      <p className="text-xs font-bold mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                        Deal Requested
                      </p>
                      <p className="font-bold" style={{ color: COLOR_PRIMARY }}>
                        {request.dealName}
                      </p>
                    </div>

                    {/* Request Time */}
                    <div>
                      <p className="text-xs font-bold mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                        Requested
                      </p>
                      <p className="font-bold" style={{ color: COLOR_PRIMARY }}>
                        {request.requestDate}
                      </p>
                    </div>

                    {/* Decision Buttons */}
                    <div className="lg:col-span-2 flex gap-2">
                      <button
                        onClick={() => handleApproveClick(request)}
                        className="flex-1 px-4 py-2 rounded-lg font-bold text-white transition-all hover:opacity-90"
                        style={{ background: '#10B981' }}
                      >
                        ✓ Approve
                      </button>
                      <button className="flex-1 px-4 py-2 rounded-lg font-bold border" style={{ borderColor: COLOR_ACCENT, color: COLOR_ACCENT }}>
                        ? Request Info
                      </button>
                      <button className="px-4 py-2 rounded-lg font-bold border" style={{ borderColor: '#EF4444', color: '#EF4444' }}>
                        ✗ Decline
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Messages Section */}
          <motion.div variants={itemVariants}>
            <button
              onClick={() => toggleSection('messages')}
              className="w-full p-4 rounded-lg border-2 flex items-center justify-between hover:bg-gray-50 transition-all"
              style={{ borderColor: COLOR_BORDER, background: 'white' }}
            >
              <h3 className="text-lg font-bold flex items-center gap-2" style={{ color: COLOR_PRIMARY }}>
                <MessageSquare className="w-5 h-5" style={{ color: COLOR_ACCENT }} />
                Messages Requiring Response
                <span className="px-2 py-0.5 rounded-full text-xs font-bold text-white" style={{ background: '#3B82F6' }}>
                  {mockMessages.filter(m => m.unread).length}
                </span>
              </h3>
              <ChevronRight className="w-5 h-5" style={{ transform: collapsedSections.messages ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
            </button>

            {!collapsedSections.messages && (
              <motion.div className="mt-4 space-y-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {mockMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className="p-4 rounded-lg hover:shadow-md transition-all"
                    style={{ borderColor: COLOR_BORDER, borderWidth: 1, background: msg.unread ? COLOR_ACCENT + '10' : 'white' }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-bold" style={{ color: COLOR_PRIMARY }}>
                          {msg.buyerName}
                        </p>
                        <p className="text-sm mt-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                          {msg.lastMessage}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold" style={{ color: COLOR_TEXT_SECONDARY }}>
                          {msg.timestamp}
                        </p>
                        {msg.unread && (
                          <div className="w-2 h-2 rounded-full mt-2 mx-auto" style={{ background: COLOR_ACCENT }} />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </motion.div>

          {/* Info Requests Section */}
          <motion.div variants={itemVariants}>
            <button
              onClick={() => toggleSection('infoRequests')}
              className="w-full p-4 rounded-lg border-2 flex items-center justify-between hover:bg-gray-50 transition-all"
              style={{ borderColor: COLOR_BORDER, background: 'white' }}
            >
              <h3 className="text-lg font-bold flex items-center gap-2" style={{ color: COLOR_PRIMARY }}>
                <FileText className="w-5 h-5" style={{ color: COLOR_ACCENT }} />
                Information Requests
                <span className="px-2 py-0.5 rounded-full text-xs font-bold text-white" style={{ background: COLOR_ACCENT }}>
                  {mockInfoRequests.length}
                </span>
              </h3>
              <ChevronRight className="w-5 h-5" style={{ transform: collapsedSections.infoRequests ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
            </button>

            {!collapsedSections.infoRequests && (
              <motion.div className="mt-4 space-y-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {mockInfoRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-4 rounded-lg border-2 hover:shadow-md transition-all"
                    style={{ borderColor: COLOR_ACCENT, background: COLOR_ACCENT + '05' }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-bold" style={{ color: COLOR_PRIMARY }}>
                          {req.buyerName} requested info
                        </p>
                        <p className="text-sm mt-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                          Deal: {req.dealName}
                        </p>
                      </div>
                      <p className="text-xs font-bold" style={{ color: COLOR_TEXT_SECONDARY }}>
                        {req.requestDate}
                      </p>
                    </div>
                    <div className="flex gap-2 flex-wrap mb-3">
                      {req.requestedDocs.map((doc) => (
                        <span key={doc} className="px-2 py-1 rounded-full text-xs font-bold" style={{ background: COLOR_BORDER, color: COLOR_TEXT_SECONDARY }}>
                          {doc}
                        </span>
                      ))}
                    </div>
                    <button className="px-4 py-2 rounded-lg font-bold text-white transition-all hover:opacity-90 text-sm" style={{ background: COLOR_ACCENT }}>
                      Upload Documents
                    </button>
                  </div>
                ))}
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}

      {/* ==================== DEALS TAB ==================== */}
      {activeTab === 'deals' && (
        <motion.div className="space-y-8" initial="hidden" animate="visible" variants={containerVariants}>
          {/* Published Deals */}
          <motion.div variants={itemVariants}>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ color: COLOR_PRIMARY }}>
              <CheckCircle2 className="w-6 h-6" style={{ color: '#10B981' }} />
              Published Deals ({publishedDeals.length})
            </h2>

            <div className="space-y-4">
              {publishedDeals.map((deal) => (
                <motion.div
                  key={deal.id}
                  className="p-6 rounded-lg border-2 hover:shadow-lg transition-all"
                  style={{ borderColor: COLOR_BORDER, background: 'white' }}
                  variants={itemVariants}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start mb-4">
                    {/* Left: Deal Info */}
                    <div>
                      <p className="font-bold text-lg" style={{ color: COLOR_PRIMARY }}>
                        {deal.name}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="px-3 py-1 rounded-full text-xs font-bold text-white" style={{ background: COLOR_ACCENT }}>
                          {deal.industry}
                        </span>
                        <span className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                          {deal.revenue}
                        </span>
                      </div>
                      {deal.activeViewers && deal.activeViewers > 0 && (
                        <div className="mt-3 p-2 rounded-lg" style={{ background: '#10B981' + '20' }}>
                          <p className="text-xs font-bold" style={{ color: '#10B981' }}>
                            ✓ {deal.activeViewers} active viewer{deal.activeViewers > 1 ? 's' : ''}
                          </p>
                          <p className="text-xs mt-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                            {deal.lastEngagement}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Metrics */}
                    <div className="text-center">
                      <Eye className="w-5 h-5 mx-auto mb-2" style={{ color: COLOR_ACCENT }} />
                      <p className="text-xs font-semibold mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                        Views
                      </p>
                      <p className="text-2xl font-black" style={{ color: COLOR_PRIMARY }}>
                        {deal.views}
                      </p>
                      <p className="text-xs mt-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                        {deal.uniqueVisitors} unique
                      </p>
                    </div>

                    <div className="text-center">
                      <Clock className="w-5 h-5 mx-auto mb-2" style={{ color: COLOR_ACCENT }} />
                      <p className="text-xs font-semibold mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                        Data Room
                      </p>
                      <p className="text-2xl font-black" style={{ color: COLOR_PRIMARY }}>
                        {Math.floor(deal.dataRoomTime / 60)}h
                      </p>
                      <p className="text-xs mt-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                        {deal.dataRoomPages} pages
                      </p>
                    </div>

                    <div className="text-center">
                      <Users className="w-5 h-5 mx-auto mb-2" style={{ color: COLOR_ACCENT }} />
                      <p className="text-xs font-semibold mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                        Returning
                      </p>
                      <p className="text-2xl font-black" style={{ color: COLOR_PRIMARY }}>
                        {deal.returningVisitors}
                      </p>
                      <p className="text-xs mt-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                        visitors
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button className="flex-1 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                        <Edit2 className="w-5 h-5 mx-auto" style={{ color: COLOR_ACCENT }} />
                      </button>
                      <button className="flex-1 p-2 rounded-lg hover:bg-red-100 transition-colors">
                        <Trash2 className="w-5 h-5 mx-auto" style={{ color: '#ef4444' }} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* KYC Pending Deals */}
          {pendingDeals.length > 0 && (
            <motion.div variants={itemVariants}>
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ color: COLOR_PRIMARY }}>
                <Clock className="w-6 h-6" style={{ color: COLOR_ACCENT }} />
                KYC Pending ({pendingDeals.length})
              </h2>

              <div className="space-y-4">
                {pendingDeals.map((deal) => (
                  <motion.div
                    key={deal.id}
                    className="p-6 rounded-lg border-2 hover:shadow-lg transition-all"
                    style={{ borderColor: COLOR_BORDER, background: '#FFFBEB' }}
                    variants={itemVariants}
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
                      <div>
                        <p className="font-bold text-lg" style={{ color: COLOR_PRIMARY }}>
                          {deal.name}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="px-3 py-1 rounded-full text-xs font-bold text-white" style={{ background: COLOR_ACCENT }}>
                            {deal.industry}
                          </span>
                          <span className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                            {deal.revenue}
                          </span>
                        </div>
                      </div>

                      <div className="lg:col-span-2 space-y-2">
                        {[
                          { name: 'Identity Verification', done: deal.kycProgress?.identity },
                          { name: 'Document Scan', done: deal.kycProgress?.documents },
                          { name: 'AI Verification', done: deal.kycProgress?.aiVerification },
                        ].map((item) => (
                          <div key={item.name} className="flex items-center gap-2">
                            {item.done ? (
                              <CheckCircle2 className="w-5 h-5" style={{ color: '#10B981' }} />
                            ) : (
                              <AlertCircle className="w-5 h-5" style={{ color: '#F59E0B' }} />
                            )}
                            <span className="text-sm" style={{ color: item.done ? COLOR_PRIMARY : COLOR_TEXT_SECONDARY }}>
                              {item.name}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <button className="flex-1 p-3 rounded-lg text-sm font-bold text-white transition-all hover:opacity-90" style={{ background: COLOR_ACCENT }}>
                          Complete KYC
                        </button>
                        <button className="p-3 rounded-lg hover:bg-red-100 transition-colors">
                          <Trash2 className="w-5 h-5" style={{ color: '#ef4444' }} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* ==================== PIPELINE TAB ==================== */}
      {activeTab === 'pipeline' && (
        <motion.div className="space-y-8" initial="hidden" animate="visible" variants={containerVariants}>
          <motion.div variants={itemVariants}>
            <h2 className="text-2xl font-black mb-6" style={{ color: COLOR_PRIMARY }}>
              🔄 Deal Pipeline Progression
            </h2>
            <p className="mb-6" style={{ color: COLOR_TEXT_SECONDARY }}>
              Track all your deals through their lifecycle from initial interest to closed. See where each deal stands and move them between stages.
            </p>
            <div className="rounded-lg border-2 p-6" style={{ borderColor: COLOR_BORDER, background: 'white' }}>
              <DealPipeline
                deals={mockDeals.map((deal) => ({
                  dealId: deal.id,
                  title: deal.name,
                  industry: deal.industry,
                  revenue: parseInt(deal.revenue.replace(/[^0-9]/g, '')) * 1000000,
                  valuation: 50000000,
                  currentStage: 'INTEREST',
                  progressPercent: 25,
                  stageStartedAt: new Date(deal.createdAt),
                  daysInStage: 7,
                }))}
                isEditable={true}
              />
            </div>
          </motion.div>

          {/* Pipeline Stats */}
          <motion.div className="grid grid-cols-2 lg:grid-cols-4 gap-4" variants={itemVariants}>
            {[
              { label: 'In Interest', value: 3, color: '#3B82F6' },
              { label: 'In Due Diligence', value: 1, color: '#FF8C00' },
              { label: 'In Negotiation', value: 1, color: '#F59E0B' },
              { label: 'Closed', value: 0, color: '#10B981' },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                className="p-4 rounded-lg border-2"
                style={{ borderColor: COLOR_BORDER, background: 'white' }}
                variants={itemVariants}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full" style={{ background: stat.color }} />
                  <p className="text-xs font-bold" style={{ color: COLOR_TEXT_SECONDARY }}>
                    {stat.label}
                  </p>
                </div>
                <p className="text-2xl font-black" style={{ color: COLOR_PRIMARY }}>
                  {stat.value}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      )}

      {/* ==================== ANALYTICS TAB ==================== */}
      {activeTab === 'analytics' && (
        <motion.div className="space-y-8" initial="hidden" animate="visible" variants={containerVariants}>
          <motion.div variants={itemVariants} className="p-8 rounded-lg border-2" style={{ borderColor: COLOR_BORDER, background: COLOR_ACCENT + '08' }}>
            <h2 className="text-xl font-bold mb-4" style={{ color: COLOR_PRIMARY }}>
              📈 Data Room Analytics
            </h2>
            <p style={{ color: COLOR_TEXT_SECONDARY }}>
              Weekly summaries, seriousness scoring, and engagement trends coming next...
            </p>
            <button className="mt-4 px-6 py-3 rounded-lg font-bold text-white transition-all hover:opacity-90" style={{ background: COLOR_ACCENT }}>
              View Full Analytics
            </button>
          </motion.div>
        </motion.div>
      )}

      {/* ==================== SETTINGS TAB ==================== */}
      {activeTab === 'settings' && (
        <motion.div className="space-y-8" initial="hidden" animate="visible" variants={containerVariants}>
          <motion.div variants={itemVariants} className="p-8 rounded-lg border-2" style={{ borderColor: COLOR_BORDER, background: 'white' }}>
            <h2 className="text-xl font-bold mb-4" style={{ color: COLOR_PRIMARY }}>
              KYC Status
            </h2>
            <p className="text-green-600 font-bold">✓ Verified</p>
            <p style={{ color: COLOR_TEXT_SECONDARY }} className="mt-2">Your account is fully verified. You can list deals and receive data room requests.</p>
          </motion.div>

          <motion.div variants={itemVariants} className="p-8 rounded-lg border-2" style={{ borderColor: COLOR_BORDER, background: 'white' }}>
            <h2 className="text-xl font-bold mb-4" style={{ color: COLOR_PRIMARY }}>
              🤝 Broker Delegation
            </h2>
            <p style={{ color: COLOR_TEXT_SECONDARY }} className="mb-4">
              Delegate data room approval authority to your brokers.
            </p>
            <button className="px-6 py-3 rounded-lg font-bold border" style={{ borderColor: COLOR_ACCENT, color: COLOR_ACCENT }}>
              Manage Delegated Brokers
            </button>
          </motion.div>
        </motion.div>
      )}

      {/* Approval Modal */}
      {showApprovalModal && selectedRequest && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="bg-white rounded-lg p-8 max-w-2xl w-full"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black" style={{ color: COLOR_PRIMARY }}>
                Approve Data Room Access
              </h2>
              <button onClick={() => setShowApprovalModal(false)}>
                <X className="w-6 h-6" style={{ color: COLOR_TEXT_SECONDARY }} />
              </button>
            </div>

            <div className="space-y-6 mb-8">
              <div className="p-4 rounded-lg" style={{ background: '#FAFAF8' }}>
                <p className="text-xs font-bold mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                  Buyer Profile
                </p>
                <p className="font-bold text-lg" style={{ color: COLOR_PRIMARY }}>
                  {selectedRequest.buyerName}
                </p>
                <p style={{ color: COLOR_TEXT_SECONDARY }} className="mt-1">
                  {selectedRequest.buyerCompany} • {selectedRequest.buyerType}
                </p>
              </div>

              <div className="p-4 rounded-lg" style={{ background: '#FAFAF8' }}>
                <p className="text-xs font-bold mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                  Requesting Access To
                </p>
                <p className="font-bold text-lg" style={{ color: COLOR_PRIMARY }}>
                  {selectedRequest.dealName}
                </p>
              </div>

              <div>
                <p className="font-bold mb-3" style={{ color: COLOR_PRIMARY }}>
                  Your Options:
                </p>
                <div className="space-y-3">
                  <button className="w-full p-4 rounded-lg border-2 hover:shadow-md transition-all text-left" style={{ borderColor: '#10B981', background: '#10B981' + '10' }}>
                    <p className="font-bold" style={{ color: '#10B981' }}>✓ Approve Instantly</p>
                    <p className="text-sm mt-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                      NDA auto-generates and sends. Buyer gets 7-day access.
                    </p>
                  </button>

                  <button className="w-full p-4 rounded-lg border-2 hover:shadow-md transition-all text-left" style={{ borderColor: COLOR_ACCENT, background: COLOR_ACCENT + '10' }}>
                    <p className="font-bold" style={{ color: COLOR_ACCENT }}>? Request More Information</p>
                    <p className="text-sm mt-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                      Ask qualifying questions (e.g., investment thesis, timeline, budget).
                    </p>
                  </button>

                  <button className="w-full p-4 rounded-lg border-2 hover:shadow-md transition-all text-left" style={{ borderColor: '#F59E0B', background: '#F59E0B' + '10' }}>
                    <p className="font-bold" style={{ color: '#F59E0B' }}>⟲ Counter Offer</p>
                    <p className="text-sm mt-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                      Approve for fewer days or with conditions.
                    </p>
                  </button>

                  <button className="w-full p-4 rounded-lg border-2 hover:shadow-md transition-all text-left" style={{ borderColor: '#EF4444', background: '#EF4444' + '10' }}>
                    <p className="font-bold" style={{ color: '#EF4444' }}>✗ Decline</p>
                    <p className="text-sm mt-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                      Politely decline (e.g., "In final negotiations, will update").
                    </p>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowApprovalModal(false)}
                className="flex-1 px-6 py-3 rounded-lg font-bold border"
                style={{ borderColor: COLOR_BORDER, color: COLOR_TEXT_SECONDARY }}
              >
                Cancel
              </button>
              <button className="flex-1 px-6 py-3 rounded-lg font-bold text-white transition-all hover:opacity-90" style={{ background: COLOR_ACCENT }}>
                Proceed with Selection
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Deal Creation Modal */}
      <DealCreationModal
        isOpen={showDealCreation}
        onClose={() => setShowDealCreation(false)}
        onSubmit={handleDealCreation}
      />
      </motion.div>
    </>
  )
}

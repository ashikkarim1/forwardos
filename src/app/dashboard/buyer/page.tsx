'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

// Real market signals fetched from /api/dashboard/signals on mount.
// Replaces the previously hardcoded "Healthcare Sector Heat Spike +34%"
// strings that misled customers into thinking they were buying real intel.
interface MarketSignal {
  id: string; title: string; description: string
  type: 'hot' | 'cold' | 'trend' | 'alert'
  metric: string; change: number; industry?: string
  insight: string; action?: string; actionHref?: string
}
import {
  Search, Filter, Eye, Clock, TrendingUp, Zap, Lock, CheckCircle2, AlertCircle,
  ChevronRight, Calendar, MessageSquare, Share2, Download, X, Star, Building2, MapPin
} from 'lucide-react'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER } from '@/styles/forward-colors'
import { DealPipeline } from '@/components/DealPipeline'
import { DashboardHeader } from '@/components/DashboardHeader'
import { DailyIntelligenceDashboard } from '@/components/DailyIntelligenceDashboard'
import { CopilotFab } from '@/components/copilot/CopilotFab'

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

interface Deal {
  id: string
  name: string
  industry: string
  revenue: number
  ebitda: number
  location: string
  growth: number
  stage: string
  fit: number // Strategic fit score 0-100
  views?: number
  heat?: number
  saved?: boolean
  image?: string // Company image/logo URL
}

interface DataRoomAccess {
  id: string
  dealName: string
  status: 'pending' | 'approved' | 'active' | 'expired'
  requestDate: string
  approvedDate?: string
  expiresAt?: string
  daysRemaining?: number
  viewed: boolean
  viewedPages: number
  totalPages: number
}

const mockFeaturedDeals: Deal[] = [
  {
    id: '1',
    name: 'TechFlow Solutions',
    industry: 'SaaS',
    revenue: 5,
    ebitda: 1.5,
    location: 'Dubai',
    growth: 24,
    stage: 'Growth',
    fit: 87,
    heat: 92,
    views: 342,
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop',
  },
  {
    id: '2',
    name: 'Emirates Healthcare Network',
    industry: 'Healthcare',
    revenue: 12,
    ebitda: 3.6,
    location: 'Dubai',
    growth: 18,
    stage: 'Growth',
    fit: 72,
    heat: 88,
    views: 567,
    image: 'https://images.unsplash.com/photo-1576091160550-112173f7f477?w=500&h=300&fit=crop',
  },
  {
    id: '3',
    name: 'RetailCo Stores',
    industry: 'Retail',
    revenue: 8,
    ebitda: 1.6,
    location: 'Abu Dhabi',
    growth: 12,
    stage: 'Mature',
    fit: 52,
    heat: 76,
    views: 289,
    image: 'https://images.unsplash.com/photo-1460925895917-aeb19be489c7?w=500&h=300&fit=crop',
  },
  {
    id: '4',
    name: 'HealthTech Solutions',
    industry: 'Healthcare',
    revenue: 78,
    ebitda: 18,
    location: 'Boston',
    growth: 35,
    stage: 'Growth',
    fit: 91,
    heat: 91,
    views: 612,
    image: 'https://images.unsplash.com/photo-1579154204601-01d5551a667e?w=500&h=300&fit=crop',
  },
  {
    id: '5',
    name: 'CloudCore Infrastructure',
    industry: 'SaaS',
    revenue: 15,
    ebitda: 4.5,
    location: 'Singapore',
    growth: 28,
    stage: 'Growth',
    fit: 85,
    heat: 89,
    views: 456,
    image: 'https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=500&h=300&fit=crop',
  },
  {
    id: '6',
    name: 'AlManara Finance',
    industry: 'Finance',
    revenue: 22,
    ebitda: 6.6,
    location: 'Riyadh',
    growth: 16,
    stage: 'Growth',
    fit: 78,
    heat: 82,
    views: 398,
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500&h=300&fit=crop',
  },
  {
    id: '7',
    name: 'NextGen E-Commerce',
    industry: 'Retail',
    revenue: 18,
    ebitda: 2.7,
    location: 'Dubai',
    growth: 42,
    stage: 'Growth',
    fit: 88,
    heat: 94,
    views: 723,
    image: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=500&h=300&fit=crop',
  },
  {
    id: '8',
    name: 'Precision Manufacturing Ltd',
    industry: 'Manufacturing',
    revenue: 45,
    ebitda: 9,
    location: 'Abu Dhabi',
    growth: 8,
    stage: 'Mature',
    fit: 64,
    heat: 71,
    views: 234,
    image: 'https://images.unsplash.com/photo-1581092918484-8987c1d64718?w=500&h=300&fit=crop',
  },
  {
    id: '9',
    name: 'Digital Marketing Pro',
    industry: 'Marketing',
    revenue: 6,
    ebitda: 1.8,
    location: 'Dubai',
    growth: 31,
    stage: 'Growth',
    fit: 76,
    heat: 87,
    views: 489,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=300&fit=crop',
  },
  {
    id: '10',
    name: 'Gulf Logistics Hub',
    industry: 'Logistics',
    revenue: 35,
    ebitda: 7,
    location: 'Jebel Ali',
    growth: 14,
    stage: 'Mature',
    fit: 68,
    heat: 78,
    views: 312,
    image: 'https://images.unsplash.com/photo-1578575437980-63f5340ce3ad?w=500&h=300&fit=crop',
  },
  {
    id: '11',
    name: 'BioMed Research Labs',
    industry: 'Healthcare',
    revenue: 28,
    ebitda: 8.4,
    location: 'London',
    growth: 22,
    stage: 'Growth',
    fit: 89,
    heat: 85,
    views: 567,
    image: 'https://images.unsplash.com/photo-1576091160550-112173f7f477?w=500&h=300&fit=crop',
  },
  {
    id: '12',
    name: 'Quantum Analytics',
    industry: 'SaaS',
    revenue: 9,
    ebitda: 2.7,
    location: 'Berlin',
    growth: 38,
    stage: 'Growth',
    fit: 83,
    heat: 88,
    views: 534,
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop',
  },
  {
    id: '13',
    name: 'Premium Hotels Group',
    industry: 'Hospitality',
    revenue: 55,
    ebitda: 11,
    location: 'Dubai',
    growth: 6,
    stage: 'Mature',
    fit: 71,
    heat: 73,
    views: 298,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&h=300&fit=crop',
  },
  {
    id: '14',
    name: 'EdTech Innovators',
    industry: 'Education',
    revenue: 8,
    ebitda: 1.6,
    location: 'Dubai',
    growth: 45,
    stage: 'Growth',
    fit: 82,
    heat: 90,
    views: 678,
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500&h=300&fit=crop',
  },
  {
    id: '15',
    name: 'Renewable Energy Solutions',
    industry: 'Energy',
    revenue: 32,
    ebitda: 9.6,
    location: 'Abu Dhabi',
    growth: 19,
    stage: 'Growth',
    fit: 79,
    heat: 84,
    views: 425,
    image: 'https://images.unsplash.com/photo-1509391366360-2e938286db4c?w=500&h=300&fit=crop',
  },
  {
    id: '16',
    name: 'FintechFlow Banking',
    industry: 'Finance',
    revenue: 18,
    ebitda: 5.4,
    location: 'Singapore',
    growth: 26,
    stage: 'Growth',
    fit: 84,
    heat: 86,
    views: 512,
    image: 'https://images.unsplash.com/photo-1563986768609-322d69d7b00b?w=500&h=300&fit=crop',
  },
  {
    id: '17',
    name: 'Real Estate Ventures',
    industry: 'Real Estate',
    revenue: 68,
    ebitda: 13.6,
    location: 'Dubai',
    growth: 9,
    stage: 'Mature',
    fit: 73,
    heat: 75,
    views: 267,
    image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=500&h=300&fit=crop',
  },
  {
    id: '18',
    name: 'ConsumerTech Retail',
    industry: 'Retail',
    revenue: 12,
    ebitda: 2.4,
    location: 'London',
    growth: 33,
    stage: 'Growth',
    fit: 86,
    heat: 89,
    views: 601,
    image: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=500&h=300&fit=crop',
  },
]

const mockDataRoomAccess: DataRoomAccess[] = [
  {
    id: '1',
    dealName: 'TechFlow Solutions',
    status: 'active',
    requestDate: '2024-06-01',
    approvedDate: '2024-06-02',
    expiresAt: '2024-06-15',
    daysRemaining: 7,
    viewed: true,
    viewedPages: 8,
    totalPages: 12,
  },
  {
    id: '2',
    dealName: 'Emirates Healthcare Network',
    status: 'pending',
    requestDate: '2024-06-07',
    viewed: false,
    viewedPages: 0,
    totalPages: 18,
  },
  {
    id: '3',
    dealName: 'RetailCo Stores',
    status: 'active',
    requestDate: '2024-05-30',
    approvedDate: '2024-05-31',
    expiresAt: '2024-06-07',
    daysRemaining: 0,
    viewed: true,
    viewedPages: 5,
    totalPages: 12,
  },
  {
    id: '4',
    dealName: 'HealthTech Solutions',
    status: 'active',
    requestDate: '2024-05-25',
    approvedDate: '2024-05-26',
    expiresAt: '2024-06-20',
    daysRemaining: 12,
    viewed: true,
    viewedPages: 15,
    totalPages: 22,
  },
  {
    id: '5',
    dealName: 'CloudCore Infrastructure',
    status: 'active',
    requestDate: '2024-06-03',
    approvedDate: '2024-06-04',
    expiresAt: '2024-06-18',
    daysRemaining: 10,
    viewed: true,
    viewedPages: 11,
    totalPages: 16,
  },
  {
    id: '6',
    dealName: 'NextGen E-Commerce',
    status: 'pending',
    requestDate: '2024-06-06',
    viewed: false,
    viewedPages: 0,
    totalPages: 20,
  },
  {
    id: '7',
    dealName: 'Digital Marketing Pro',
    status: 'active',
    requestDate: '2024-06-02',
    approvedDate: '2024-06-03',
    expiresAt: '2024-06-12',
    daysRemaining: 4,
    viewed: true,
    viewedPages: 6,
    totalPages: 10,
  },
  {
    id: '8',
    dealName: 'BioMed Research Labs',
    status: 'active',
    requestDate: '2024-05-28',
    approvedDate: '2024-05-29',
    expiresAt: '2024-06-25',
    daysRemaining: 17,
    viewed: true,
    viewedPages: 18,
    totalPages: 25,
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
  {
    dealId: 'deal-3',
    title: 'DubaiRetail Group',
    industry: 'Retail',
    revenue: 8,
    valuation: 32000000,
    currentStage: 'OFFERS',
    progressPercent: 55,
    stageStartedAt: new Date('2024-05-28'),
    daysInStage: 11,
  },
]

// Mock messages
interface Message {
  id: string
  dealName: string
  senderName: string
  subject: string
  preview: string
  timestamp: string
  unread: boolean
}

const mockMessages: Message[] = [
  {
    id: '1',
    dealName: 'TechFlow Solutions',
    senderName: 'Ahmed Al-Mansouri',
    subject: 'Follow-up on Due Diligence Questions',
    preview: 'Thank you for your interest in TechFlow. We have prepared additional financial...',
    timestamp: '2024-06-08 09:30 AM',
    unread: true,
  },
  {
    id: '2',
    dealName: 'HealthTech Solutions',
    senderName: 'Sarah Johnson',
    subject: 'Meeting Scheduled for Next Week',
    preview: 'Perfect! We have scheduled a call with our management team for Tuesday at...',
    timestamp: '2024-06-07 02:15 PM',
    unread: true,
  },
  {
    id: '3',
    dealName: 'Emirates Healthcare Network',
    senderName: 'Fatima Al-Falasi',
    subject: 'Data Room Access Granted',
    preview: 'Your data room access has been approved. You now have access to all...',
    timestamp: '2024-06-06 11:45 AM',
    unread: false,
  },
  {
    id: '4',
    dealName: 'NextGen E-Commerce',
    senderName: 'Omar Al-Mazrouei',
    subject: 'Valuation Discussion - Next Steps',
    preview: 'Based on the preliminary review, we believe the fair valuation range is...',
    timestamp: '2024-06-05 03:20 PM',
    unread: false,
  },
  {
    id: '5',
    dealName: 'CloudCore Infrastructure',
    senderName: 'Lisa Chen',
    subject: 'Additional Documents Uploaded',
    preview: 'We have uploaded recent customer contracts and revenue attestations to your...',
    timestamp: '2024-06-04 10:00 AM',
    unread: false,
  },
]

// Mock profile data
interface UserProfile {
  name: string
  company: string
  email: string
  phone: string
  role: string
  industry: string
  kycStatus: 'verified' | 'pending' | 'incomplete'
  investmentSize: string
  savedDeals: number
  activeDataRooms: number
}

const mockProfile: UserProfile = {
  name: 'Hassan Al-Mazrouei',
  company: 'AlManara Capital Partners',
  email: 'hassan@almanaracap.ae',
  phone: '+971 4 XXX XXXX',
  role: 'Investment Manager',
  industry: 'Venture Capital & PE',
  kycStatus: 'verified',
  investmentSize: '$50M - $500M',
  savedDeals: 5,
  activeDataRooms: 3,
}

export default function BuyerDashboardV2() {
  const [activeTab, setActiveTab] = useState<'discover' | 'access' | 'pipeline' | 'messages' | 'profile'>('discover')
  const [searchTerm, setSearchTerm] = useState('')
  const [saved, setSaved] = useState<string[]>(['1', '4', '7', '12', '14'])
  const [showAccessRequest, setShowAccessRequest] = useState(false)
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null)
  const [marketSignals, setMarketSignals] = useState<MarketSignal[]>([])
  const [counts, setCounts] = useState<{
    savedDeals: number; activeEnquiries: number
    pendingDataRoomRequests: number; unreadMessages: number
  } | null>(null)

  // Pull real signals on mount. Empty array if we haven't loaded yet or
  // the compute errored — better blank than stale mock numbers.
  useEffect(() => {
    fetch('/api/dashboard/signals?role=buyer', { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : { signals: [] }))
      .then((d) => setMarketSignals(Array.isArray(d?.signals) ? d.signals : []))
      .catch(() => setMarketSignals([]))

    fetch('/api/dashboard/counts?role=buyer', { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : { counts: null }))
      .then((d) => setCounts(d?.counts ?? null))
      .catch(() => setCounts(null))
  }, [])

  // Real per-user counters fetched on mount. Until they load we show
  // 0 instead of mockDeals.length so a brand-new buyer never sees fake
  // "My Active Deals: 3" in their first session.

  const filteredDeals = mockFeaturedDeals.filter(d =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.industry.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getHeatColor = (heat: number) => {
    if (heat >= 85) return '#ef4444'
    if (heat >= 70) return COLOR_ACCENT
    if (heat >= 55) return '#f59e0b'
    return '#6b7280'
  }

  const getFitColor = (fit: number) => {
    if (fit >= 80) return '#10b981'
    if (fit >= 60) return COLOR_ACCENT
    if (fit >= 40) return '#f59e0b'
    return '#ef4444'
  }

  // Create a callback to handle sidebar toggle via window event
  const handleMenuToggle = (open: boolean) => {
    // Dispatch a custom event that AppShell can listen to
    window.dispatchEvent(new CustomEvent('toggleSidebar', { detail: { open } }))
  }

  return (
    <>
      {/* Dashboard Header - IPOReady Style */}
      <DashboardHeader
        breadcrumbs={[
          { label: 'Forward OS', href: '/' },
          { label: 'Buyer Dashboard' },
        ]}
        onMenuToggle={handleMenuToggle}
        sidebarOpen={true}
        title="Deal Discovery"
        subtitle="Browse premium M&A opportunities across 100+ vetted deals"
        actionButton={{
          label: 'Complete KYC',
          href: '/dashboard/seller/kyc',
          icon: <CheckCircle2 className="w-4 h-4" />,
        }}
        stats={[
          {
            label: 'Active Opportunities',
            value: '100+',
            trend: 'up',
            trendValue: '12%',
          },
          {
            label: 'My Saved Deals',
            value: saved.length,
            trend: 'up',
            trendValue: '5 this week',
          },
          {
            label: 'Data Room Access',
            value: mockDataRoomAccess.filter(a => a.status === 'active').length,
            trend: 'neutral',
            trendValue: '3 active',
          },
          {
            label: 'Pending Requests',
            value: mockDataRoomAccess.filter(a => a.status === 'pending').length,
            trend: 'down',
            trendValue: 'Awaiting approval',
          },
        ]}
        userProfile={{
          name: mockProfile.name,
          email: mockProfile.email,
          role: mockProfile.role,
        }}
      />

      <motion.div className="max-w-7xl mx-auto px-8 py-8">

      {/* Tab Navigation */}
      <motion.div className="mb-8 flex gap-3 border-b overflow-x-auto" style={{ borderColor: COLOR_BORDER }}>
        {[
          { id: 'discover', label: '🔍 Discover Deals', icon: Search },
          { id: 'access', label: '🔑 My Data Room Access', icon: Lock, badge: mockDataRoomAccess.filter(a => a.status === 'active' || a.status === 'pending').length },
          { id: 'pipeline', label: '🔄 My Deals Pipeline', icon: TrendingUp },
          { id: 'messages', label: '💬 Messages', icon: MessageSquare },
          { id: 'profile', label: '👤 My Profile', icon: Star },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className="px-4 py-3 font-bold text-sm transition-all flex items-center gap-2"
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

      {/* ==================== DISCOVER TAB ==================== */}
      {activeTab === 'discover' && (
        <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
          {/* Daily Intelligence Dashboard */}
          <motion.div className="mb-12" variants={itemVariants}>
            <DailyIntelligenceDashboard
              userType="buyer"
              marketSignals={marketSignals}
              dealMomentum={[
                {
                  id: '1',
                  dealName: 'TechFlow Solutions',
                  stage: 'Due Diligence',
                  heat: 87,
                  momentum: 'accelerating',
                  lastUpdate: '2 hours ago',
                  nextAction: 'Schedule next round meeting',
                  riskLevel: 'low',
                },
                {
                  id: '2',
                  dealName: 'Emirates Healthcare Network',
                  stage: 'Negotiation',
                  heat: 76,
                  momentum: 'steady',
                  lastUpdate: '6 hours ago',
                  nextAction: 'Review term sheet',
                  riskLevel: 'low',
                },
                {
                  id: '3',
                  dealName: 'CloudCore Infrastructure',
                  stage: 'Interest',
                  heat: 52,
                  momentum: 'stalling',
                  lastUpdate: '1 day ago',
                  nextAction: 'Follow up with seller KYC',
                  riskLevel: 'medium',
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
                  percentageDiff: 0,
                  status: 'market',
                },
                {
                  id: '2',
                  dealName: 'Emirates Healthcare Network',
                  industry: 'Healthcare',
                  revenue: 12000000,
                  valuation: 57600000,
                  multiple: 4.8,
                  compareToYour: 4.8,
                  percentageDiff: 12,
                  status: 'higher',
                },
                {
                  id: '3',
                  dealName: 'DubaiRetail Group',
                  industry: 'Retail',
                  revenue: 8000000,
                  valuation: 28800000,
                  multiple: 3.6,
                  compareToYour: 3.2,
                  percentageDiff: -8,
                  status: 'lower',
                },
              ]}
              alerts={[
                {
                  id: '1',
                  severity: 'high',
                  title: 'CloudCore: Seller KYC Incomplete',
                  description: 'Data room access delayed pending seller verification. May impact timeline.',
                  timestamp: '6 hours ago',
                  action: 'Follow Up',
                },
                {
                  id: '2',
                  severity: 'medium',
                  title: 'Emirates Healthcare: Q2 Financials Due',
                  description: 'Seller to provide updated financials. Required for final valuation.',
                  timestamp: '1 day ago',
                  action: 'Check Status',
                },
              ]}
              personalizedInsights={[
                'Healthcare valuations are at a 12-month low. Perfect time to acquire if it matches your strategy. 2 new healthcare deals match your saved criteria.',
              ]}
              lastUpdated="2 minutes ago"
            />
          </motion.div>

          {/* Search & Filter */}
          <motion.div className="mb-8 flex gap-3" variants={itemVariants}>
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-3" style={{ color: COLOR_TEXT_SECONDARY }} />
              <input
                type="text"
                placeholder="Search by company name or industry..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border"
                style={{ borderColor: COLOR_BORDER }}
              />
            </div>
            <button className="px-4 py-2 rounded-lg border flex items-center gap-2" style={{ borderColor: COLOR_BORDER }}>
              <Filter className="w-5 h-5" style={{ color: COLOR_ACCENT }} />
              <span className="text-sm font-bold">Filter</span>
            </button>
          </motion.div>

          {/* Deal Cards Grid */}
          <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
            {filteredDeals.map((deal) => (
              <motion.div
                key={deal.id}
                className="overflow-hidden rounded-lg border-2 hover:shadow-lg transition-all"
                style={{ borderColor: COLOR_BORDER, background: 'white' }}
                variants={itemVariants}
              >
                {/* Company Image */}
                <div className="relative w-full h-48 bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden">
                  {deal.image ? (
                    <img
                      src={deal.image}
                      alt={deal.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none'
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                      <span className="text-5xl font-black text-white opacity-50">
                        {deal.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  {/* Heat Badge */}
                  <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1.5 font-bold text-sm flex items-center gap-1">
                    <span style={{ color: getHeatColor(deal.heat || 0) }}>🔥</span>
                    <span style={{ color: getHeatColor(deal.heat || 0) }}>
                      {deal.heat}%
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg" style={{ color: COLOR_PRIMARY }}>
                      {deal.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-2 py-1 rounded-full text-xs font-bold text-white" style={{ background: COLOR_ACCENT }}>
                        {deal.industry}
                      </span>
                      <span className="text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>
                        {deal.stage}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSaved(saved.includes(deal.id) ? saved.filter(id => id !== deal.id) : [...saved, deal.id])}
                    className="text-2xl transition-transform"
                  >
                    {saved.includes(deal.id) ? '★' : '☆'}
                  </button>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b" style={{ borderColor: COLOR_BORDER }}>
                  <div>
                    <p className="text-xs font-bold mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                      Revenue
                    </p>
                    <p className="font-bold" style={{ color: COLOR_PRIMARY }}>
                      ${deal.revenue}M
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                      EBITDA
                    </p>
                    <p className="font-bold" style={{ color: COLOR_PRIMARY }}>
                      ${deal.ebitda}M
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                      Growth
                    </p>
                    <p className="font-bold" style={{ color: COLOR_PRIMARY }}>
                      +{deal.growth}%
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                      Views
                    </p>
                    <p className="font-bold" style={{ color: COLOR_PRIMARY }}>
                      {deal.views}
                    </p>
                  </div>
                </div>

                {/* Scores */}
                <div className="space-y-3 mb-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-bold" style={{ color: COLOR_TEXT_SECONDARY }}>
                        Strategic Fit
                      </p>
                      <span className="text-xs font-bold" style={{ color: getFitColor(deal.fit) }}>
                        {deal.fit}%
                      </span>
                    </div>
                    <div className="h-2 rounded-full" style={{ background: COLOR_BORDER }}>
                      <div className="h-2 rounded-full" style={{ background: getFitColor(deal.fit), width: `${deal.fit}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-bold" style={{ color: COLOR_TEXT_SECONDARY }}>
                        Market Heat
                      </p>
                      <span className="text-xs font-bold" style={{ color: getHeatColor(deal.heat || 0) }}>
                        {deal.heat}°
                      </span>
                    </div>
                    <div className="h-2 rounded-full" style={{ background: COLOR_BORDER }}>
                      <div className="h-2 rounded-full" style={{ background: getHeatColor(deal.heat || 0), width: `${(deal.heat || 0)}%` }} />
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <button
                  onClick={() => {
                    setSelectedDeal(deal)
                    setShowAccessRequest(true)
                  }}
                  className="w-full px-4 py-2 rounded-lg font-bold text-white transition-all hover:opacity-90"
                  style={{ background: COLOR_ACCENT }}
                >
                  View Data Room →
                </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      )}

      {/* ==================== ACCESS TAB ==================== */}
      {activeTab === 'access' && (
        <motion.div className="space-y-6" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
          {mockDataRoomAccess.map((access) => (
            <motion.div
              key={access.id}
              className="p-6 rounded-lg border-2 hover:shadow-lg transition-all"
              style={{
                borderColor: access.status === 'active' ? COLOR_ACCENT : access.status === 'approved' ? '#B8956A' : COLOR_BORDER,
                background: access.status === 'active' ? COLOR_ACCENT + '05' : access.status === 'approved' ? '#DBEAFE' : 'white',
              }}
              variants={itemVariants}
            >
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-start">
                {/* Deal Info */}
                <div>
                  <p className="font-bold text-lg" style={{ color: COLOR_PRIMARY }}>
                    {access.dealName}
                  </p>
                  <div className="mt-3">
                    {access.status === 'active' && (
                      <div className="px-3 py-1 rounded-full text-xs font-bold text-white inline-block" style={{ background: '#10B981' }}>
                        ✓ Active {access.daysRemaining === 0 ? '(Expires Today)' : `(${access.daysRemaining} days)`}
                      </div>
                    )}
                    {access.status === 'pending' && (
                      <div className="px-3 py-1 rounded-full text-xs font-bold text-white inline-block" style={{ background: '#F59E0B' }}>
                        ⏳ Pending Approval
                      </div>
                    )}
                    {access.status === 'expired' && (
                      <div className="px-3 py-1 rounded-full text-xs font-bold text-white inline-block" style={{ background: '#EF4444' }}>
                        ✗ Expired
                      </div>
                    )}
                  </div>
                </div>

                {/* Timeline */}
                <div>
                  <p className="text-xs font-bold mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                    Requested
                  </p>
                  <p className="font-bold" style={{ color: COLOR_PRIMARY }}>
                    {access.requestDate}
                  </p>
                  {access.approvedDate && (
                    <>
                      <p className="text-xs font-bold mb-1 mt-2" style={{ color: COLOR_TEXT_SECONDARY }}>
                        Approved
                      </p>
                      <p className="font-bold" style={{ color: COLOR_PRIMARY }}>
                        {access.approvedDate}
                      </p>
                    </>
                  )}
                </div>

                {/* Pages Viewed */}
                <div>
                  <p className="text-xs font-bold mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                    Pages Viewed
                  </p>
                  <p className="font-bold" style={{ color: COLOR_PRIMARY }}>
                    {access.viewedPages} of {access.totalPages}
                  </p>
                  <div className="h-2 rounded-full mt-2" style={{ background: COLOR_BORDER }}>
                    <div className="h-2 rounded-full" style={{ background: COLOR_ACCENT, width: `${(access.viewedPages / access.totalPages) * 100}%` }} />
                  </div>
                </div>

                {/* Actions */}
                <div className="lg:col-span-2 flex flex-col gap-2">
                  {access.status === 'active' && (
                    <>
                      <Link href="/data-rooms" className="px-4 py-2 rounded-lg font-bold text-white text-center transition-all hover:opacity-90" style={{ background: COLOR_ACCENT }}>
                        Open Data Room →
                      </Link>
                      {access.daysRemaining && access.daysRemaining <= 2 && (
                        <Link href="/data-rooms" className="px-4 py-2 rounded-lg font-bold border text-center" style={{ borderColor: COLOR_ACCENT, color: COLOR_ACCENT }}>
                          Request Extension
                        </Link>
                      )}
                    </>
                  )}
                  {access.status === 'pending' && (
                    <p className="text-sm font-bold" style={{ color: '#F59E0B' }}>
                      ⏳ Waiting for seller approval...
                    </p>
                  )}
                  {access.status === 'expired' && (
                    <Link href="/data-rooms" className="px-4 py-2 rounded-lg font-bold border text-center" style={{ borderColor: COLOR_ACCENT, color: COLOR_ACCENT }}>
                      Request Access Again
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* ==================== PIPELINE TAB ==================== */}
      {activeTab === 'pipeline' && (
        <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
          {/* Pipeline Stats */}
          <motion.div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6" variants={itemVariants}>
            {[
              // Pipeline stage breakdowns require per-stage tracking we
              // don't yet capture per-user. Until we wire the per-stage
              // counts through /api/dashboard/counts, show the topline
              // active count and zero the rest — never the mock numbers.
              { label: 'My Active Deals', value: counts?.activeEnquiries ?? 0, color: COLOR_ACCENT },
              { label: 'In Due Diligence', value: 0, color: '#FF9C3D' },
              { label: 'In Negotiation', value: 0, color: '#F59E0B' },
              { label: 'Total Pipeline Value', value: '—', color: '#10B981' },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                className="p-4 rounded-lg border-2"
                style={{ borderColor: COLOR_BORDER, background: '#FFFFFF' }}
                variants={itemVariants}
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
          <motion.div className="bg-white rounded-lg border-2 p-6" style={{ borderColor: COLOR_BORDER }} variants={itemVariants}>
            <DealPipeline
              deals={mockDeals}
              onStageDrop={async () => {}}
              isEditable={false}
            />
          </motion.div>

          {/* Pipeline Notes */}
          <motion.div className="mt-6 p-6 rounded-lg border-2" style={{ borderColor: COLOR_BORDER, background: '#FFFFFF' }} variants={itemVariants}>
            <h3 className="font-bold text-lg mb-4" style={{ color: COLOR_PRIMARY }}>
              About Your Deals
            </h3>
            <p style={{ color: COLOR_TEXT_SECONDARY }} className="leading-relaxed">
              Your deals progress through multiple stages from initial interest to closing. You can see your current stage, next required steps, and timeline for each deal. The seller and your brokers have visibility into the same stage information to keep everyone synchronized.
            </p>
          </motion.div>
        </motion.div>
      )}

      {/* ==================== MESSAGES TAB ==================== */}
      {activeTab === 'messages' && (
        <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.05 } } }}>
          <div className="space-y-3">
            {mockMessages.map(msg => (
              <motion.div
                key={msg.id}
                variants={itemVariants}
                className="p-4 rounded-lg border-2 hover:shadow-md transition-all cursor-pointer"
                style={{
                  borderColor: COLOR_BORDER,
                  background: msg.unread ? COLOR_ACCENT + '08' : 'white',
                  borderLeftColor: msg.unread ? COLOR_ACCENT : COLOR_BORDER,
                  borderLeftWidth: msg.unread ? '4px' : '2px',
                }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-bold" style={{ color: COLOR_PRIMARY }}>
                        {msg.senderName}
                      </p>
                      {msg.unread && (
                        <span className="w-2 h-2 rounded-full" style={{ background: COLOR_ACCENT }} />
                      )}
                    </div>
                    <p className="text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>
                      {msg.dealName}
                    </p>
                  </div>
                  <p className="text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>
                    {msg.timestamp}
                  </p>
                </div>
                <p className="font-semibold text-sm mb-1" style={{ color: COLOR_PRIMARY }}>
                  {msg.subject}
                </p>
                <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                  {msg.preview}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ==================== PROFILE TAB ==================== */}
      {activeTab === 'profile' && (
        <motion.div className="space-y-6" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
          {/* Profile Header */}
          <motion.div className="p-8 rounded-lg border-2" style={{ borderColor: COLOR_BORDER, background: 'white' }} variants={itemVariants}>
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="font-black text-3xl mb-1" style={{ color: COLOR_PRIMARY }}>
                  {mockProfile.name}
                </h3>
                <p style={{ color: COLOR_TEXT_SECONDARY }}>
                  {mockProfile.role} at {mockProfile.company}
                </p>
              </div>
              <Link href="/account" className="px-6 py-3 rounded-lg font-bold border" style={{ borderColor: COLOR_ACCENT, color: COLOR_ACCENT }}>
                Edit Profile
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Email', value: mockProfile.email },
                { label: 'Phone', value: mockProfile.phone },
                { label: 'Role', value: mockProfile.role },
                { label: 'Industry', value: mockProfile.industry },
              ].map(item => (
                <div key={item.label}>
                  <p className="text-xs font-bold mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                    {item.label}
                  </p>
                  <p className="font-semibold" style={{ color: COLOR_PRIMARY }}>
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* KYC & Investment */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div className="p-6 rounded-lg border-2" style={{ borderColor: COLOR_BORDER, background: '#F0FDF4' }} variants={itemVariants}>
              <div className="flex items-start gap-3">
                <span className="text-3xl">✓</span>
                <div>
                  <h3 className="font-bold text-lg mb-2" style={{ color: COLOR_PRIMARY }}>
                    KYC Status
                  </h3>
                  <p className="text-green-600 font-bold mb-2">Verified</p>
                  <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-sm">
                    Your account is fully verified and you can request access to any deal data room on the platform.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div className="p-6 rounded-lg border-2" style={{ borderColor: COLOR_BORDER, background: COLOR_ACCENT + '08' }} variants={itemVariants}>
              <h3 className="font-bold text-lg mb-3" style={{ color: COLOR_PRIMARY }}>
                Investment Profile
              </h3>
              <div className="space-y-2">
                <div>
                  <p className="text-xs font-bold mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                    Investment Size
                  </p>
                  <p className="font-semibold" style={{ color: COLOR_PRIMARY }}>
                    {mockProfile.investmentSize}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                    Saved Deals
                  </p>
                  <p className="font-semibold" style={{ color: COLOR_PRIMARY }}>
                    {mockProfile.savedDeals} deals
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Investment Preferences */}
          <motion.div className="p-6 rounded-lg border-2" style={{ borderColor: COLOR_BORDER, background: 'white' }} variants={itemVariants}>
            <h3 className="font-bold text-lg mb-4" style={{ color: COLOR_PRIMARY }}>
              Investment Preferences
            </h3>
            <p style={{ color: COLOR_TEXT_SECONDARY }} className="mb-6">
              Customize your deal preferences to get better recommendations and filter opportunities.
            </p>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg" style={{ background: '#FAFAF8' }}>
                <div>
                  <p className="font-semibold" style={{ color: COLOR_PRIMARY }}>
                    Target Industries
                  </p>
                  <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                    Tech, Healthcare, Finance
                  </p>
                </div>
                <Link href="/saved-searches" style={{ color: COLOR_ACCENT }} className="font-bold">
                  Edit →
                </Link>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg" style={{ background: '#FAFAF8' }}>
                <div>
                  <p className="font-semibold" style={{ color: COLOR_PRIMARY }}>
                    Target Regions
                  </p>
                  <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                    MENA, Asia Pacific
                  </p>
                </div>
                <Link href="/saved-searches" style={{ color: COLOR_ACCENT }} className="font-bold">
                  Edit →
                </Link>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg" style={{ background: '#FAFAF8' }}>
                <div>
                  <p className="font-semibold" style={{ color: COLOR_PRIMARY }}>
                    Deal Size Range
                  </p>
                  <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                    $50M - $500M
                  </p>
                </div>
                <Link href="/saved-searches" style={{ color: COLOR_ACCENT }} className="font-bold">
                  Edit →
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Data Room Access Request Modal */}
      {showAccessRequest && selectedDeal && (
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
                Request Data Room Access
              </h2>
              <button onClick={() => setShowAccessRequest(false)}>
                <X className="w-6 h-6" style={{ color: COLOR_TEXT_SECONDARY }} />
              </button>
            </div>

            <div className="space-y-6 mb-8">
              <div className="p-4 rounded-lg" style={{ background: '#FAFAF8' }}>
                <p className="text-xs font-bold mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                  Deal You're Requesting
                </p>
                <p className="font-bold text-lg" style={{ color: COLOR_PRIMARY }}>
                  {selectedDeal.name}
                </p>
                <p style={{ color: COLOR_TEXT_SECONDARY }} className="mt-1">
                  {selectedDeal.industry} • ${selectedDeal.revenue}M revenue
                </p>
              </div>

              <div className="p-4 rounded-lg" style={{ background: COLOR_ACCENT + '10' }}>
                <p className="font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
                  ℹ️ What happens next:
                </p>
                <ol className="space-y-2 text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                  <li>1. Your request is sent to the seller</li>
                  <li>2. Seller reviews your profile and approves</li>
                  <li>3. NDA is auto-generated with your name</li>
                  <li>4. You sign the NDA</li>
                  <li>5. Get 7-day access to the data room</li>
                </ol>
              </div>

              <div>
                <label className="flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer" style={{ borderColor: COLOR_BORDER, background: 'white' }}>
                  <input type="checkbox" defaultChecked className="w-5 h-5" />
                  <span className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                    I agree to the terms of the NDA and understand this is a confidential review
                  </span>
                </label>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowAccessRequest(false)}
                className="flex-1 px-6 py-3 rounded-lg font-bold border"
                style={{ borderColor: COLOR_BORDER, color: COLOR_TEXT_SECONDARY }}
              >
                Cancel
              </button>
              <button className="flex-1 px-6 py-3 rounded-lg font-bold text-white transition-all hover:opacity-90" style={{ background: COLOR_ACCENT }}>
                Send Access Request
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
      </motion.div>
      <CopilotFab role="buyer" />
    </>
  )
}

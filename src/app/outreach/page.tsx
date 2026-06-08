'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Send, Mail, MessageSquare, FileText, CheckCircle2, Clock, AlertCircle,
  Plus, Filter, Search, MoreVertical, Share2, Copy, Eye, Zap, TrendingUp
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

interface OutreachBuyer {
  id: string
  name: string
  company: string
  type: string
  email: string
  phone: string
  status: 'not-contacted' | 'interested' | 'viewing' | 'negotiating' | 'passed'
  lastContact: string
  messagesExchanged: number
  documentsShared: number
  openedAt: number
  responseTime: string
  nextAction: string
  color: string
}

const mockBuyers: OutreachBuyer[] = [
  {
    id: '1',
    name: 'Ahmed Al Mansouri',
    company: 'AlManara Investments',
    type: 'Strategic Buyer',
    email: 'ahmed@almanara.ae',
    phone: '+971 50 123 4567',
    status: 'negotiating',
    lastContact: '2 hours ago',
    messagesExchanged: 12,
    documentsShared: 8,
    openedAt: 15,
    responseTime: '4 min',
    nextAction: 'Send revised LOI',
    color: '#3B82F6',
  },
  {
    id: '2',
    name: 'Sarah Khan',
    company: 'Gulf Capital Partners',
    type: 'PE Firm',
    email: 'sarah@gulfcap.ae',
    phone: '+971 50 987 6543',
    status: 'interested',
    lastContact: '1 day ago',
    messagesExchanged: 5,
    documentsShared: 3,
    openedAt: 8,
    responseTime: '2 hours',
    nextAction: 'Schedule call',
    color: '#8B5CF6',
  },
  {
    id: '3',
    name: 'Michael Chen',
    company: 'Asia Tech Holdings',
    type: 'Competitor',
    email: 'michael@asiatech.com',
    phone: '+1 650 555 1234',
    status: 'viewing',
    lastContact: '3 days ago',
    messagesExchanged: 3,
    documentsShared: 2,
    openedAt: 5,
    responseTime: '6 hours',
    nextAction: 'Follow up on interest',
    color: '#EC4899',
  },
  {
    id: '4',
    name: 'Fatima Al Maktoum',
    company: 'Dubai Family Office',
    type: 'Family Office',
    email: 'fatima@dubaifamilyoffice.ae',
    phone: '+971 50 555 8888',
    status: 'negotiating',
    lastContact: '4 hours ago',
    messagesExchanged: 18,
    documentsShared: 10,
    openedAt: 22,
    responseTime: '15 min',
    nextAction: 'Review cap table questions',
    color: '#14B8A6',
  },
  {
    id: '5',
    name: 'John Smith',
    company: 'Middle East Ventures',
    type: 'VC Fund',
    email: 'john@mev.ae',
    phone: '+971 4 123 5678',
    status: 'not-contacted',
    lastContact: 'Never',
    messagesExchanged: 0,
    documentsShared: 0,
    openedAt: 0,
    responseTime: '—',
    nextAction: 'Send intro email',
    color: '#F59E0B',
  },
  {
    id: '6',
    name: 'Lisa Rodriguez',
    company: 'Global Tech Fund',
    type: 'PE Firm',
    email: 'lisa@globaltech.com',
    phone: '+1 415 333 4444',
    status: 'passed',
    lastContact: '2 weeks ago',
    messagesExchanged: 4,
    documentsShared: 2,
    openedAt: 3,
    responseTime: '1 day',
    nextAction: 'Re-engage if needed',
    color: '#10B981',
  },
]

const outreachTemplates = [
  {
    id: '1',
    name: 'Initial Introduction',
    subject: 'Exciting Business Opportunity',
    preview: 'Hi [Buyer], I have a promising SaaS business that might interest...',
  },
  {
    id: '2',
    name: 'Request for Meeting',
    subject: 'Let\'s Discuss This Opportunity',
    preview: 'Following up on my previous message. Would you be available for a...',
  },
  {
    id: '3',
    name: 'Share Data Room',
    subject: 'Exclusive Data Room Access',
    preview: 'I\'ve prepared detailed materials in a secure data room...',
  },
  {
    id: '4',
    name: 'Close Follow-up',
    subject: 'We\'re Close - Let\'s Finalize',
    preview: 'Based on our discussions, I\'d like to propose the following...',
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'negotiating':
      return '#10B981'
    case 'interested':
      return COLOR_ACCENT
    case 'viewing':
      return '#3B82F6'
    case 'not-contacted':
      return '#6B7280'
    case 'passed':
      return '#EF4444'
    default:
      return COLOR_TEXT_SECONDARY
  }
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'negotiating':
      return '🤝 Negotiating'
    case 'interested':
      return '👀 Interested'
    case 'viewing':
      return '📂 Viewing Docs'
    case 'not-contacted':
      return '❌ Not Contacted'
    case 'passed':
      return '✗ Passed'
    default:
      return status
  }
}

export default function OutreachPage() {
  const [selectedBuyer, setSelectedBuyer] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string | null>(null)

  const filteredBuyers = mockBuyers.filter(b => {
    const matchesSearch = b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         b.company.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = !filterStatus || b.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const getMetrics = () => {
    return {
      totalBuyers: mockBuyers.length,
      negotiating: mockBuyers.filter(b => b.status === 'negotiating').length,
      interested: mockBuyers.filter(b => b.status === 'interested').length,
      avgResponseTime: '3.5 hours',
      totalMessagesExchanged: mockBuyers.reduce((sum, b) => sum + b.messagesExchanged, 0),
    }
  }

  const metrics = getMetrics()
  const selectedBuyerData = mockBuyers.find(b => b.id === selectedBuyer)

  return (
    <motion.div
      className="max-w-7xl mx-auto px-8 py-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-black mb-2" style={{ color: COLOR_PRIMARY }}>
              Smart Buyer Outreach
            </h1>
            <p className="text-lg" style={{ color: COLOR_TEXT_SECONDARY }}>
              Manage buyer communications, send documents, and track engagement.
            </p>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-white transition-all hover:opacity-90" style={{ background: COLOR_ACCENT }}>
            <Plus className="w-5 h-5" />
            Add Buyer
          </button>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { label: 'Total Buyers', value: metrics.totalBuyers, icon: Users },
            { label: 'Negotiating', value: metrics.negotiating, icon: TrendingUp },
            { label: 'Interested', value: metrics.interested, icon: Eye },
            { label: 'Avg Response', value: metrics.avgResponseTime, icon: Clock },
            { label: 'Messages', value: metrics.totalMessagesExchanged, icon: MessageSquare },
          ].map((metric, idx) => {
            const Icon = metric.icon || null
            return (
              <motion.div
                key={idx}
                className="p-4 rounded-lg border"
                style={{ borderColor: COLOR_BORDER, background: 'white' }}
                variants={itemVariants}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="w-4 h-4" style={{ color: COLOR_ACCENT }} />
                  <p className="text-xs font-bold" style={{ color: COLOR_TEXT_SECONDARY }}>
                    {metric.label}
                  </p>
                </div>
                <p className="text-2xl font-black" style={{ color: COLOR_PRIMARY }}>
                  {metric.value}
                </p>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Buyer List */}
        <motion.div className="lg:col-span-2" variants={itemVariants}>
          {/* Search & Filter */}
          <div className="mb-6 flex gap-3">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-3" style={{ color: COLOR_TEXT_SECONDARY }} />
              <input
                type="text"
                placeholder="Search buyers..."
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
          </div>

          {/* Buyer Cards */}
          <div className="space-y-3">
            {filteredBuyers.map((buyer) => (
              <motion.div
                key={buyer.id}
                className="p-5 rounded-lg border-2 cursor-pointer hover:shadow-md transition-all"
                style={{
                  borderColor: selectedBuyer === buyer.id ? COLOR_ACCENT : COLOR_BORDER,
                  background: selectedBuyer === buyer.id ? COLOR_ACCENT + '08' : 'white',
                  borderLeft: `4px solid ${buyer.color}`,
                }}
                onClick={() => setSelectedBuyer(selectedBuyer === buyer.id ? null : buyer.id)}
                whileHover={{ x: 4 }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg" style={{ color: COLOR_PRIMARY }}>
                      {buyer.name}
                    </h3>
                    <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                      {buyer.company} • {buyer.type}
                    </p>
                  </div>
                  <span
                    className="px-3 py-1 rounded-full text-xs font-bold"
                    style={{ background: getStatusColor(buyer.status) + '20', color: getStatusColor(buyer.status) }}
                  >
                    {getStatusLabel(buyer.status)}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-3 pb-3 border-t" style={{ borderColor: COLOR_BORDER }}>
                  <div>
                    <p className="text-xs font-bold mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                      Last Contact
                    </p>
                    <p className="text-sm font-bold" style={{ color: COLOR_PRIMARY }}>
                      {buyer.lastContact}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                      Messages
                    </p>
                    <p className="text-sm font-bold" style={{ color: COLOR_PRIMARY }}>
                      {buyer.messagesExchanged}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                      Documents
                    </p>
                    <p className="text-sm font-bold" style={{ color: COLOR_PRIMARY }}>
                      {buyer.documentsShared}
                    </p>
                  </div>
                </div>

                {/* Expand Content */}
                {selectedBuyer === buyer.id && (
                  <motion.div className="pt-3 border-t" style={{ borderColor: COLOR_BORDER }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="mb-4">
                      <p className="text-xs font-bold mb-2" style={{ color: COLOR_TEXT_SECONDARY }}>
                        📌 Next Action
                      </p>
                      <p className="text-sm" style={{ color: COLOR_PRIMARY }}>
                        {buyer.nextAction}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button className="flex-1 px-3 py-2 rounded-lg text-sm font-bold text-white transition-all hover:opacity-90" style={{ background: COLOR_ACCENT }}>
                        <Send className="w-4 h-4 inline mr-1" />
                        Send Message
                      </button>
                      <button className="flex-1 px-3 py-2 rounded-lg text-sm font-bold border" style={{ borderColor: COLOR_ACCENT, color: COLOR_ACCENT }}>
                        <FileText className="w-4 h-4 inline mr-1" />
                        Share Docs
                      </button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right Panel - Details & Templates */}
        {selectedBuyerData && (
          <motion.div className="p-8 rounded-lg border-2" style={{ borderColor: COLOR_BORDER, background: 'white' }} variants={itemVariants}>
            {/* Buyer Details */}
            <h3 className="text-xl font-bold mb-4" style={{ color: COLOR_PRIMARY }}>
              📋 Contact Info
            </h3>
            <div className="space-y-3 mb-6 pb-6 border-b" style={{ borderColor: COLOR_BORDER }}>
              <div>
                <p className="text-xs font-bold mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                  Email
                </p>
                <p className="text-sm font-bold cursor-pointer hover:underline" style={{ color: COLOR_PRIMARY }}>
                  {selectedBuyerData.email}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                  Phone
                </p>
                <p className="text-sm font-bold" style={{ color: COLOR_PRIMARY }}>
                  {selectedBuyerData.phone}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                  Response Time
                </p>
                <p className="text-sm font-bold" style={{ color: COLOR_PRIMARY }}>
                  {selectedBuyerData.responseTime}
                </p>
              </div>
            </div>

            {/* Message Templates */}
            <h3 className="text-lg font-bold mb-4" style={{ color: COLOR_PRIMARY }}>
              📧 Message Templates
            </h3>
            <div className="space-y-2">
              {outreachTemplates.map((template) => (
                <div
                  key={template.id}
                  className="p-3 rounded-lg border hover:bg-gray-50 cursor-pointer transition-all"
                  style={{ borderColor: COLOR_BORDER }}
                >
                  <div className="flex items-start gap-2">
                    <Mail className="w-4 h-4 mt-1" style={{ color: COLOR_ACCENT }} />
                    <div className="flex-1">
                      <p className="text-sm font-bold" style={{ color: COLOR_PRIMARY }}>
                        {template.name}
                      </p>
                      <p className="text-xs mt-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                        {template.preview}
                      </p>
                    </div>
                    <Copy className="w-4 h-4" style={{ color: COLOR_TEXT_SECONDARY }} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Outreach Campaign Stats */}
      <motion.div className="p-8 rounded-lg border-2 mb-12" style={{ borderColor: COLOR_BORDER, background: COLOR_ACCENT + '08' }} variants={itemVariants}>
        <h3 className="text-xl font-bold mb-6" style={{ color: COLOR_PRIMARY }}>
          📊 Outreach Performance
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'Emails Sent', value: '24', trend: '+8 this week' },
            { label: 'Avg Open Rate', value: '78%', trend: '+5% vs last week' },
            { label: 'Click Rate', value: '42%', trend: '+12% vs last week' },
            { label: 'Meeting Scheduled', value: '4', trend: '+2 this week' },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-xs font-bold mb-2" style={{ color: COLOR_TEXT_SECONDARY }}>
                {stat.label}
              </p>
              <p className="text-2xl font-black mb-1" style={{ color: COLOR_PRIMARY }}>
                {stat.value}
              </p>
              <p className="text-xs" style={{ color: getStatusColor('interested') }}>
                {stat.trend}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div className="text-center p-8 rounded-lg" style={{ background: COLOR_ACCENT + '08', borderColor: COLOR_ACCENT, borderWidth: 2 }} variants={itemVariants}>
        <h3 className="text-xl font-bold mb-3" style={{ color: COLOR_PRIMARY }}>
          🚀 Ready to Accelerate Outreach?
        </h3>
        <p style={{ color: COLOR_TEXT_SECONDARY }} className="mb-6">
          Send customized documents to all interested buyers in one click.
        </p>
        <button className="px-8 py-3 rounded-lg font-bold text-white transition-all hover:opacity-90" style={{ background: COLOR_ACCENT }}>
          Send Batch Outreach
        </button>
      </motion.div>
    </motion.div>
  )
}

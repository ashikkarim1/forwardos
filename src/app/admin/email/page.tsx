'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, TrendingUp, Eye, Send, Repeat2, Archive } from 'lucide-react'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER, COLOR_BG_PRIMARY } from '@/styles/forward-colors'

const CAMPAIGNS_DATA = [
  {
    id: 1,
    name: 'Weekly Deal Spotlight',
    type: 'Buyers',
    sent: 12340,
    delivered: 12298,
    opened: 4706,
    clicked: 2029,
    unsubscribed: 38,
    sentDate: 'Mar 8, 2026 at 9:00 AM',
    status: 'completed',
    openRate: 38.2,
    clickRate: 16.4,
  },
  {
    id: 2,
    name: 'Broker Deal Flow',
    type: 'Brokers',
    sent: 2150,
    delivered: 2140,
    opened: 903,
    clicked: 392,
    unsubscribed: 8,
    sentDate: 'Mar 6, 2026 at 10:00 AM',
    status: 'completed',
    openRate: 42.1,
    clickRate: 18.2,
  },
  {
    id: 3,
    name: 'Seller Performance',
    type: 'Sellers',
    sent: 5630,
    delivered: 5600,
    opened: 1986,
    clicked: 828,
    unsubscribed: 12,
    sentDate: 'Mar 5, 2026 at 8:00 AM',
    status: 'completed',
    openRate: 35.4,
    clickRate: 14.7,
  },
  {
    id: 4,
    name: 'Upgrade Promotion',
    type: 'Free Users',
    sent: 1200,
    delivered: 1188,
    opened: 265,
    clicked: 63,
    unsubscribed: 15,
    sentDate: 'Mar 3, 2026 at 10:00 AM',
    status: 'completed',
    openRate: 22.1,
    clickRate: 5.3,
  },
]

export default function AdminEmailPage() {
  const [campaigns, setCampaigns] = useState(CAMPAIGNS_DATA)
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#10B981'
      case 'sending':
        return '#F59E0B'
      case 'draft':
        return '#6B7280'
      default:
        return COLOR_TEXT_SECONDARY
    }
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-black mb-2" style={{ color: COLOR_PRIMARY }}>
          Email Management
        </h1>
        <p style={{ color: COLOR_TEXT_SECONDARY }}>
          Manage campaigns, templates, and track email performance
        </p>
      </div>

      {/* Create Campaign Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full md:w-auto px-6 py-3 rounded-lg font-bold text-white flex items-center justify-center gap-2 transition-all"
        style={{ background: COLOR_ACCENT }}
      >
        <Send size={20} />
        Create New Campaign
      </motion.button>

      {/* Campaigns List */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold" style={{ color: COLOR_PRIMARY }}>
          Campaigns (This Week)
        </h2>

        {campaigns.map((campaign, idx) => (
          <motion.div
            key={campaign.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="rounded-lg border overflow-hidden"
            style={{ borderColor: COLOR_BORDER }}
          >
            {/* Campaign Header */}
            <div
              className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setExpandedId(expandedId === campaign.id ? null : campaign.id)}
            >
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                <div>
                  <h3 className="font-bold text-lg" style={{ color: COLOR_PRIMARY }}>
                    {campaign.name}
                  </h3>
                  <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                    {campaign.type} • {campaign.sentDate}
                  </p>
                </div>

                <div className="text-center">
                  <p className="text-2xl font-black" style={{ color: COLOR_ACCENT }}>
                    {campaign.sent.toLocaleString()}
                  </p>
                  <p className="text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>
                    Sent
                  </p>
                </div>

                <div className="text-center">
                  <p className="text-2xl font-black" style={{ color: '#10B981' }}>
                    {campaign.openRate}%
                  </p>
                  <p className="text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>
                    Open Rate
                  </p>
                </div>

                <div className="text-center">
                  <p className="text-2xl font-black" style={{ color: '#3B82F6' }}>
                    {campaign.clickRate}%
                  </p>
                  <p className="text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>
                    Click Rate
                  </p>
                </div>

                <div className="text-right">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-bold text-white"
                    style={{ background: getStatusColor(campaign.status) }}
                  >
                    {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>

            {/* Campaign Details (Expanded) */}
            {expandedId === campaign.id && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 border-t"
                style={{ background: COLOR_BG_PRIMARY, borderColor: COLOR_BORDER }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                  {[
                    { label: 'Delivered', value: campaign.delivered, color: '#10B981' },
                    { label: 'Opened', value: campaign.opened, color: '#3B82F6' },
                    { label: 'Clicked', value: campaign.clicked, color: COLOR_ACCENT },
                    { label: 'Unsubscribed', value: campaign.unsubscribed, color: '#EF4444' },
                  ].map((stat, idx) => (
                    <div key={idx}>
                      <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                        {stat.label}
                      </p>
                      <p className="text-2xl font-bold mt-1" style={{ color: stat.color }}>
                        {stat.value.toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg border font-semibold text-sm transition-all hover:bg-gray-100"
                    style={{ borderColor: COLOR_BORDER, color: COLOR_PRIMARY }}>
                    <Eye size={18} />
                    View Details
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg border font-semibold text-sm transition-all hover:bg-gray-100"
                    style={{ borderColor: COLOR_BORDER, color: COLOR_PRIMARY }}>
                    <Repeat2 size={18} />
                    Re-send
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg border font-semibold text-sm transition-all hover:bg-gray-100"
                    style={{ borderColor: COLOR_BORDER, color: COLOR_PRIMARY }}>
                    <Archive size={18} />
                    Archive
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Templates Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-lg border"
        style={{ borderColor: COLOR_BORDER }}
      >
        <h2 className="text-xl font-bold mb-4" style={{ color: COLOR_PRIMARY }}>
          Email Templates
        </h2>

        <div className="space-y-4">
          {[
            { name: 'Weekly Deal Spotlight', variants: 27, type: 'Buyer' },
            { name: 'Broker Deal Flow', variants: 22, type: 'Broker' },
            { name: 'Seller Performance Update', variants: 18, type: 'Seller' },
            { name: 'Premium Upgrade Offer', variants: 15, type: 'All Users' },
          ].map((template, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 rounded-lg" style={{ background: COLOR_BG_PRIMARY }}>
              <div>
                <p className="font-bold" style={{ color: COLOR_PRIMARY }}>
                  {template.name}
                </p>
                <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                  {template.type} • {template.variants} variations
                </p>
              </div>
              <button className="px-4 py-2 rounded-lg border font-semibold text-sm transition-all hover:bg-white"
                style={{ borderColor: COLOR_BORDER, color: COLOR_PRIMARY }}>
                Edit
              </button>
            </div>
          ))}
        </div>

        <button className="w-full mt-4 px-4 py-3 rounded-lg border font-bold text-sm transition-all hover:bg-gray-50"
          style={{ borderColor: COLOR_BORDER, color: COLOR_PRIMARY }}>
          + Create New Template
        </button>
      </motion.div>

      {/* Performance Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        {[
          { label: 'Total Sent', value: '67,320', color: COLOR_ACCENT },
          { label: 'Avg Open Rate', value: '36.9%', color: '#10B981' },
          { label: 'Avg Click Rate', value: '14.2%', color: '#3B82F6' },
          { label: 'Unsubscribe Rate', value: '0.28%', color: '#EF4444' },
        ].map((stat, idx) => (
          <div key={idx} className="p-4 rounded-lg border" style={{ borderColor: COLOR_BORDER }}>
            <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
              {stat.label}
            </p>
            <p className="text-3xl font-black mt-2" style={{ color: stat.color }}>
              {stat.value}
            </p>
          </div>
        ))}
      </motion.div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { BarChart3, TrendingUp, Users, DollarSign, FileText, Eye, MessageSquare, Calendar, ChevronRight, ArrowUpRight } from 'lucide-react'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER, COLOR_SURFACE_SUCCESS } from '@/styles/forward-colors'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

interface Metric {
  label: string
  value: string | number
  change: number
  icon: React.ComponentType<any>
  color: string
}

interface Inquiry {
  id: string
  buyer: string
  listing: string
  date: string
  status: 'pending' | 'responded' | 'qualified'
}

interface Listing {
  id: string
  name: string
  industry: string
  revenue: string
  views: number
  inquiries: number
  status: 'active' | 'archived'
}

const metrics: Metric[] = [
  {
    label: 'Active Listings',
    value: 12,
    change: 3,
    icon: FileText,
    color: '#3B82F6',
  },
  {
    label: 'Total Inquiries',
    value: 47,
    change: 12,
    icon: MessageSquare,
    color: '#3B82F6',
  },
  {
    label: 'Profile Views',
    value: '2,847',
    change: 28,
    icon: Eye,
    color: '#8B5CF6',
  },
  {
    label: 'Closed Deals',
    value: 3,
    change: 1,
    icon: TrendingUp,
    color: '#10B981',
  },
  {
    label: 'Total Commission',
    value: 'AED 125K',
    change: 15,
    icon: DollarSign,
    color: '#F59E0B',
  },
  {
    label: 'Connected Buyers',
    value: 156,
    change: 24,
    icon: Users,
    color: '#EC4899',
  },
]

const recentInquiries: Inquiry[] = [
  {
    id: '1',
    buyer: 'Ahmed Al Mansouri',
    listing: 'TechFlow Solutions',
    date: '2 mins ago',
    status: 'pending',
  },
  {
    id: '2',
    buyer: 'Fatima Al Khaleej',
    listing: 'DubaiRetail Group',
    date: '15 mins ago',
    status: 'pending',
  },
  {
    id: '3',
    buyer: 'Mohammed Investment',
    listing: 'Emirates Healthcare',
    date: '1 hour ago',
    status: 'qualified',
  },
  {
    id: '4',
    buyer: 'Sarah Johnson',
    listing: 'FinTech Innovations',
    date: '2 hours ago',
    status: 'responded',
  },
  {
    id: '5',
    buyer: 'Peter Kim',
    listing: 'AlManufacturing',
    date: '3 hours ago',
    status: 'pending',
  },
]

const activeListings: Listing[] = [
  {
    id: '1',
    name: 'TechFlow Solutions',
    industry: 'SaaS',
    revenue: 'AED 5M',
    views: 342,
    inquiries: 12,
    status: 'active',
  },
  {
    id: '2',
    name: 'DubaiRetail Group',
    industry: 'Retail',
    revenue: 'AED 8M',
    views: 289,
    inquiries: 8,
    status: 'active',
  },
  {
    id: '3',
    name: 'Emirates Healthcare',
    industry: 'Healthcare',
    revenue: 'AED 12M',
    views: 567,
    inquiries: 15,
    status: 'active',
  },
  {
    id: '4',
    name: 'Gulf Logistics',
    industry: 'Services',
    revenue: 'AED 3M',
    views: 156,
    inquiries: 4,
    status: 'active',
  },
]

const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case 'pending':
      return '#FCD34D'
    case 'responded':
      return '#DBEAFE'
    case 'qualified':
      return '#DCFCE7'
    default:
      return '#F3F4F6'
  }
}

const getStatusBadgeTextColor = (status: string) => {
  switch (status) {
    case 'pending':
      return '#78350F'
    case 'responded':
      return '#0C4A6E'
    case 'qualified':
      return '#15803D'
    default:
      return '#4B5563'
  }
}

export default function BrokerDashboardPage() {
  const [selectedInquiry, setSelectedInquiry] = useState<string | null>(null)

  return (
    <motion.div
      className="max-w-7xl mx-auto px-6 py-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-12">
        <h1 className="text-4xl font-black mb-3" style={{ color: COLOR_PRIMARY }}>
          Broker Dashboard
        </h1>
        <p className="text-lg" style={{ color: COLOR_TEXT_SECONDARY }}>
          Manage your listings, track inquiries, and monitor your commission pipeline.
        </p>
      </motion.div>

      {/* Metrics Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
        variants={containerVariants}
      >
        {metrics.map((metric) => {
          const Icon = metric.icon
          return (
            <motion.div
              key={metric.label}
              className="p-6 rounded-lg border-2 hover:shadow-lg transition-all"
              style={{ borderColor: COLOR_BORDER, background: 'white' }}
              variants={itemVariants}
              whileHover={{ y: -4 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className="p-3 rounded-lg"
                  style={{ background: metric.color + '20' }}
                >
                  <Icon className="w-6 h-6" style={{ color: metric.color }} />
                </div>
                <div className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold" style={{ background: '#DCFCE7', color: '#15803D' }}>
                  <ArrowUpRight className="w-4 h-4" />
                  {metric.change}%
                </div>
              </div>

              <p className="text-sm font-semibold mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                {metric.label}
              </p>
              <p className="text-3xl font-black" style={{ color: COLOR_PRIMARY }}>
                {metric.value}
              </p>
            </motion.div>
          )
        })}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Inquiries */}
        <motion.div
          className="lg:col-span-2 p-8 rounded-lg border"
          style={{ borderColor: COLOR_BORDER, background: 'white' }}
          variants={itemVariants}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black" style={{ color: COLOR_PRIMARY }}>
              Recent Inquiries
            </h2>
            <Link
              href="/broker/inquiries"
              className="text-sm font-bold flex items-center gap-1 hover:opacity-70 transition-opacity"
              style={{ color: COLOR_ACCENT }}
            >
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentInquiries.map((inquiry) => (
              <motion.div
                key={inquiry.id}
                className="p-4 rounded-lg border hover:bg-gray-50 transition-colors cursor-pointer"
                style={{ borderColor: COLOR_BORDER, background: selectedInquiry === inquiry.id ? '#FFF7F3' : 'white' }}
                onClick={() => setSelectedInquiry(inquiry.id)}
                whileHover={{ x: 4 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-bold" style={{ color: COLOR_PRIMARY }}>
                      {inquiry.buyer}
                    </p>
                    <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                      {inquiry.listing}
                    </p>
                  </div>
                  <div
                    className="px-3 py-1 rounded-full text-xs font-bold"
                    style={{
                      background: getStatusBadgeColor(inquiry.status),
                      color: getStatusBadgeTextColor(inquiry.status),
                    }}
                  >
                    {inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1)}
                  </div>
                </div>
                <p className="text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>
                  {inquiry.date}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          className="p-8 rounded-lg border"
          style={{ borderColor: COLOR_BORDER, background: 'white' }}
          variants={itemVariants}
        >
          <h3 className="text-xl font-black mb-6" style={{ color: COLOR_PRIMARY }}>
            Quick Actions
          </h3>

          <div className="space-y-3">
            <Link
              href="/listings/create"
              className="block p-4 rounded-lg font-bold text-white text-center transition-all hover:opacity-90"
              style={{ background: COLOR_ACCENT }}
            >
              + Create Listing
            </Link>

            <Link
              href="/broker/inquiries"
              className="block p-4 rounded-lg font-bold border-2 text-center transition-all hover:bg-gray-50"
              style={{ borderColor: COLOR_ACCENT, color: COLOR_ACCENT }}
            >
              📬 Manage Inquiries
            </Link>

            <Link
              href="/broker/listings"
              className="block p-4 rounded-lg font-bold border-2 text-center transition-all hover:bg-gray-50"
              style={{ borderColor: COLOR_ACCENT, color: COLOR_ACCENT }}
            >
              📋 My Listings
            </Link>

            <Link
              href="/broker/profile"
              className="block p-4 rounded-lg font-bold border-2 text-center transition-all hover:bg-gray-50"
              style={{ borderColor: COLOR_ACCENT, color: COLOR_ACCENT }}
            >
              👤 Edit Profile
            </Link>
          </div>

          {/* Commission Info */}
          <motion.div
            className="mt-8 p-4 rounded-lg border-2"
            style={{ borderColor: COLOR_ACCENT, background: COLOR_SURFACE_SUCCESS }}
            variants={itemVariants}
          >
            <p className="text-xs font-bold text-uppercase mb-2" style={{ color: COLOR_ACCENT }}>
              This Month
            </p>
            <p className="text-3xl font-black mb-2" style={{ color: COLOR_PRIMARY }}>
              AED 35K
            </p>
            <p className="text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>
              Commission from 2 closed deals
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Active Listings */}
      <motion.div
        className="mt-8 p-8 rounded-lg border"
        style={{ borderColor: COLOR_BORDER, background: 'white' }}
        variants={itemVariants}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black" style={{ color: COLOR_PRIMARY }}>
            Your Active Listings
          </h2>
          <Link
            href="/broker/listings"
            className="text-sm font-bold flex items-center gap-1 hover:opacity-70 transition-opacity"
            style={{ color: COLOR_ACCENT }}
          >
            Manage All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottomColor: COLOR_BORDER }} className="border-b">
                <th className="text-left p-3 font-bold" style={{ color: COLOR_PRIMARY }}>
                  Listing
                </th>
                <th className="text-left p-3 font-bold" style={{ color: COLOR_PRIMARY }}>
                  Industry
                </th>
                <th className="text-left p-3 font-bold" style={{ color: COLOR_PRIMARY }}>
                  Revenue
                </th>
                <th className="text-center p-3 font-bold" style={{ color: COLOR_PRIMARY }}>
                  Views
                </th>
                <th className="text-center p-3 font-bold" style={{ color: COLOR_PRIMARY }}>
                  Inquiries
                </th>
              </tr>
            </thead>
            <tbody>
              {activeListings.map((listing) => (
                <motion.tr
                  key={listing.id}
                  style={{ borderBottomColor: COLOR_BORDER }}
                  className="border-b hover:bg-gray-50 transition-colors"
                  whileHover={{ x: 4 }}
                >
                  <td className="p-3">
                    <Link href={`/listings/${listing.id}`} className="font-bold hover:opacity-70">
                      {listing.name}
                    </Link>
                  </td>
                  <td className="p-3" style={{ color: COLOR_TEXT_SECONDARY }}>
                    {listing.industry}
                  </td>
                  <td className="p-3" style={{ color: COLOR_TEXT_SECONDARY }}>
                    {listing.revenue}
                  </td>
                  <td className="p-3 text-center font-bold" style={{ color: COLOR_PRIMARY }}>
                    {listing.views}
                  </td>
                  <td className="p-3 text-center">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-bold text-white"
                      style={{ background: COLOR_ACCENT }}
                    >
                      {listing.inquiries}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Info Card */}
      <motion.div
        className="mt-8 p-6 rounded-lg border-2"
        style={{ borderColor: COLOR_ACCENT, background: COLOR_SURFACE_SUCCESS }}
        variants={itemVariants}
      >
        <h3 className="font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
          💡 Pro Tip
        </h3>
        <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-sm">
          Respond to inquiries within 2 hours to increase conversion rates by 45%. Use the messaging system to stay connected with buyers throughout the process.
        </p>
      </motion.div>
    </motion.div>
  )
}

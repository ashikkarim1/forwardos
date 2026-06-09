'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, Download, Eye, Flag, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER, COLOR_BACKGROUND } from '@/styles/forward-colors'

const LISTINGS_DATA = [
  {
    id: '487',
    name: 'SaaS Platform - Project Management',
    location: 'San Francisco',
    owner: 'John Doe',
    status: 'approved',
    tier: 'premium',
    revenue: '$850K',
    valuation: '$2.5M',
    views: 127,
    saves: 8,
    featured: true,
  },
  {
    id: '486',
    name: 'Healthcare Network',
    location: 'Boston',
    owner: 'Jane Smith',
    status: 'pending',
    tier: 'standard',
    revenue: '$1.2M',
    valuation: '$3.2M',
    views: 87,
    saves: 5,
    featured: false,
  },
  {
    id: '485',
    name: 'Digital Marketing Agency',
    location: 'Seattle',
    owner: 'Mike Chen',
    status: 'flagged',
    tier: 'standard',
    revenue: '$1.8M',
    valuation: '$2.8M',
    views: 12,
    saves: 0,
    featured: false,
    flagReason: 'Suspicious Metrics',
  },
  {
    id: '484',
    name: 'E-commerce Platform',
    location: 'Chicago',
    owner: 'Sarah Lee',
    status: 'approved',
    tier: 'standard',
    revenue: '$2.1M',
    valuation: '$4.5M',
    views: 156,
    saves: 14,
    featured: false,
  },
  {
    id: '483',
    name: 'SaaS Analytics Tool',
    location: 'Austin',
    owner: 'Alex Johnson',
    status: 'pending',
    tier: 'free',
    revenue: '$450K',
    valuation: '$1.8M',
    views: 34,
    saves: 2,
    featured: false,
  },
]

const STATUS_COLORS = {
  approved: { bg: '#10B981', text: 'white' },
  pending: { bg: '#F59E0B', text: 'white' },
  flagged: { bg: '#EF4444', text: 'white' },
  rejected: { bg: '#6B7280', text: 'white' },
}

const TIER_COLORS = {
  premium: '#FF8C00',
  standard: '#6366F1',
  free: '#8B5CF6',
}

export default function AdminListingsPage() {
  const [listings, setListings] = useState(LISTINGS_DATA)
  const [selectedStatus, setSelectedStatus] = useState<string[]>(['approved', 'pending', 'flagged'])
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filteredListings = listings.filter((listing) => {
    const matchesStatus = selectedStatus.length === 0 || selectedStatus.includes(listing.status)
    const matchesSearch = listing.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.location.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const handleApprove = (id: string) => {
    setListings(listings.map((l) => (l.id === id ? { ...l, status: 'approved' } : l)))
  }

  const handleReject = (id: string) => {
    setListings(listings.map((l) => (l.id === id ? { ...l, status: 'rejected' } : l)))
  }

  const handleFlag = (id: string) => {
    setListings(listings.map((l) => (l.id === id ? { ...l, status: 'flagged' } : l)))
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-black mb-2" style={{ color: COLOR_PRIMARY }}>
          Listing Management
        </h1>
        <p style={{ color: COLOR_TEXT_SECONDARY }}>
          Review, approve, and manage all marketplace listings
        </p>
      </div>

      {/* Filters & Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-lg border"
        style={{ borderColor: COLOR_BORDER }}
      >
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: COLOR_TEXT_SECONDARY }} />
            <input
              type="text"
              placeholder="Search by listing name, owner, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border bg-white focus:outline-none focus:ring-2"
              style={{
                borderColor: COLOR_BORDER,
                '--tw-ring-color': COLOR_ACCENT,
              } as any}
            />
          </div>

          {/* Status Filters */}
          <div className="flex flex-wrap gap-3">
            {['approved', 'pending', 'flagged', 'rejected'].map((status) => (
              <button
                key={status}
                onClick={() => {
                  if (selectedStatus.includes(status)) {
                    setSelectedStatus(selectedStatus.filter((s) => s !== status))
                  } else {
                    setSelectedStatus([...selectedStatus, status])
                  }
                }}
                className="px-4 py-2 rounded-lg font-semibold text-sm transition-all"
                style={{
                  background: selectedStatus.includes(status) ? STATUS_COLORS[status as keyof typeof STATUS_COLORS].bg : COLOR_BACKGROUND,
                  color: selectedStatus.includes(status) ? 'white' : COLOR_PRIMARY,
                  border: `2px solid ${selectedStatus.includes(status) ? STATUS_COLORS[status as keyof typeof STATUS_COLORS].bg : COLOR_BORDER}`,
                }}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex justify-between items-center">
            <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
              Showing {filteredListings.length} of {listings.length} listings
            </p>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-semibold transition-all hover:bg-gray-50"
              style={{ borderColor: COLOR_BORDER, color: COLOR_PRIMARY }}>
              <Download size={18} />
              Export CSV
            </button>
          </div>
        </div>
      </motion.div>

      {/* Listings Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-lg border overflow-hidden"
        style={{ borderColor: COLOR_BORDER }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: COLOR_BACKGROUND, borderBottom: `1px solid ${COLOR_BORDER}` }}>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide" style={{ color: COLOR_TEXT_SECONDARY }}>
                  Listing
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide" style={{ color: COLOR_TEXT_SECONDARY }}>
                  Owner
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide" style={{ color: COLOR_TEXT_SECONDARY }}>
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide" style={{ color: COLOR_TEXT_SECONDARY }}>
                  Metrics
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide" style={{ color: COLOR_TEXT_SECONDARY }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredListings.map((listing, idx) => (
                <motion.tbody key={listing.id}>
                  <tr
                    style={{
                      borderBottom: `1px solid ${COLOR_BORDER}`,
                      background: expandedId === listing.id ? COLOR_BACKGROUND : 'white',
                    }}
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-sm" style={{ color: COLOR_PRIMARY }}>
                          {listing.name}
                        </p>
                        <p className="text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>
                          {listing.location} • {listing.valuation}
                        </p>
                        {listing.featured && (
                          <span className="inline-block mt-1 px-2 py-1 rounded text-xs font-bold text-white" style={{ background: COLOR_ACCENT }}>
                            Premium Featured
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm" style={{ color: COLOR_PRIMARY }}>
                      {listing.owner}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="px-3 py-1 rounded-full text-xs font-bold text-white"
                        style={{ background: STATUS_COLORS[listing.status as keyof typeof STATUS_COLORS].bg }}
                      >
                        {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm" style={{ color: COLOR_PRIMARY }}>
                      <div>
                        <p>👁️ {listing.views} views</p>
                        <p>⭐ {listing.saves} saves</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setExpandedId(expandedId === listing.id ? null : listing.id)}
                          className="p-2 hover:bg-gray-100 rounded transition-colors"
                          title="View Details"
                        >
                          <Eye size={18} style={{ color: COLOR_PRIMARY }} />
                        </button>
                        {listing.status !== 'approved' && (
                          <button
                            onClick={() => handleApprove(listing.id)}
                            className="p-2 hover:bg-green-100 rounded transition-colors"
                            title="Approve"
                          >
                            <CheckCircle size={18} color="#10B981" />
                          </button>
                        )}
                        {listing.status !== 'rejected' && (
                          <button
                            onClick={() => handleReject(listing.id)}
                            className="p-2 hover:bg-red-100 rounded transition-colors"
                            title="Reject"
                          >
                            <XCircle size={18} color="#EF4444" />
                          </button>
                        )}
                        <button
                          onClick={() => handleFlag(listing.id)}
                          className="p-2 hover:bg-orange-100 rounded transition-colors"
                          title="Flag"
                        >
                          <Flag size={18} color={COLOR_ACCENT} />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expandedId === listing.id && (
                    <tr style={{ background: COLOR_BACKGROUND }}>
                      <td colSpan={5} className="px-6 py-6">
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="grid grid-cols-1 md:grid-cols-2 gap-6"
                        >
                          <div>
                            <h4 className="font-bold mb-3" style={{ color: COLOR_PRIMARY }}>
                              Financial Information
                            </h4>
                            <div className="space-y-2">
                              <p className="text-sm">
                                <span style={{ color: COLOR_TEXT_SECONDARY }}>Revenue:</span>{' '}
                                <span style={{ color: COLOR_PRIMARY }} className="font-semibold">
                                  {listing.revenue}
                                </span>
                              </p>
                              <p className="text-sm">
                                <span style={{ color: COLOR_TEXT_SECONDARY }}>Valuation:</span>{' '}
                                <span style={{ color: COLOR_PRIMARY }} className="font-semibold">
                                  {listing.valuation}
                                </span>
                              </p>
                              <p className="text-sm">
                                <span style={{ color: COLOR_TEXT_SECONDARY }}>Tier:</span>{' '}
                                <span style={{ color: TIER_COLORS[listing.tier as keyof typeof TIER_COLORS] }} className="font-semibold">
                                  {listing.tier.toUpperCase()}
                                </span>
                              </p>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-bold mb-3" style={{ color: COLOR_PRIMARY }}>
                              Engagement
                            </h4>
                            <div className="space-y-2">
                              <p className="text-sm">
                                <span style={{ color: COLOR_TEXT_SECONDARY }}>Total Views:</span>{' '}
                                <span style={{ color: COLOR_PRIMARY }} className="font-semibold">
                                  {listing.views}
                                </span>
                              </p>
                              <p className="text-sm">
                                <span style={{ color: COLOR_TEXT_SECONDARY }}>Saved By:</span>{' '}
                                <span style={{ color: COLOR_PRIMARY }} className="font-semibold">
                                  {listing.saves} users
                                </span>
                              </p>
                              {listing.flagReason && (
                                <p className="text-sm text-red-600">
                                  <AlertCircle className="inline mr-1" size={16} />
                                  Flag: {listing.flagReason}
                                </p>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      </td>
                    </tr>
                  )}
                </motion.tbody>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}

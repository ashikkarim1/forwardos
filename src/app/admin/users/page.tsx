'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, Download, Eye, Shield, Ban, Mail } from 'lucide-react'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER, COLOR_BACKGROUND } from '@/styles/forward-colors'

const USERS_DATA = [
  {
    id: '1024',
    name: 'John Doe',
    email: 'john@example.com',
    type: 'seller',
    tier: 'premium',
    kycStatus: 'verified',
    status: 'active',
    joined: 'Mar 1, 2026',
    lastActive: 'Mar 8, 4:20 PM',
    listings: 2,
    activity: 287,
  },
  {
    id: '1023',
    name: 'Jane Smith',
    email: 'jane@example.com',
    type: 'broker',
    tier: 'premium',
    kycStatus: 'verified',
    status: 'active',
    joined: 'Feb 20, 2026',
    lastActive: 'Mar 8, 3:45 PM',
    listings: 5,
    activity: 234,
  },
  {
    id: '1022',
    name: 'Mike Chen',
    email: 'mike@example.com',
    type: 'buyer',
    tier: 'free',
    kycStatus: 'verified',
    status: 'active',
    joined: 'Mar 5, 2026',
    lastActive: 'Mar 8, 2:10 PM',
    listings: 0,
    activity: 45,
  },
  {
    id: '1021',
    name: 'Sarah Lee',
    email: 'sarah@example.com',
    type: 'buyer',
    tier: 'free',
    kycStatus: 'pending',
    status: 'active',
    joined: 'Mar 6, 2026',
    lastActive: 'Mar 7, 10:30 AM',
    listings: 0,
    activity: 12,
  },
  {
    id: '1020',
    name: 'Alex Rodriguez',
    email: 'alex@example.com',
    type: 'broker',
    tier: 'free',
    kycStatus: 'rejected',
    status: 'suspended',
    joined: 'Feb 28, 2026',
    lastActive: 'Mar 3, 5:15 PM',
    listings: 1,
    activity: 23,
  },
]

const USER_TYPE_COLORS = {
  seller: '#10B981',
  broker: '#3B82F6',
  buyer: '#8B5CF6',
}

const KYC_STATUS_COLORS = {
  verified: '#10B981',
  pending: '#F59E0B',
  rejected: '#EF4444',
}

const STATUS_COLORS = {
  active: '#10B981',
  inactive: '#6B7280',
  suspended: '#EF4444',
}

const TIER_COLORS = {
  free: '#8B5CF6',
  premium: COLOR_ACCENT,
  enterprise: '#EC4899',
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState(USERS_DATA)
  const [selectedType, setSelectedType] = useState<string[]>(['seller', 'broker', 'buyer'])
  const [selectedStatus, setSelectedStatus] = useState<string[]>(['active', 'inactive', 'suspended'])
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filteredUsers = users.filter((user) => {
    const matchesType = selectedType.length === 0 || selectedType.includes(user.type)
    const matchesStatus = selectedStatus.length === 0 || selectedStatus.includes(user.status)
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesType && matchesStatus && matchesSearch
  })

  const handleSuspend = (id: string) => {
    setUsers(users.map((u) => (u.id === id ? { ...u, status: 'suspended' } : u)))
  }

  const handleUnsuspend = (id: string) => {
    setUsers(users.map((u) => (u.id === id ? { ...u, status: 'active' } : u)))
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-black mb-2" style={{ color: COLOR_PRIMARY }}>
          User Management
        </h1>
        <p style={{ color: COLOR_TEXT_SECONDARY }}>
          View, manage, and monitor all platform users
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
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border bg-white focus:outline-none focus:ring-2"
              style={{
                borderColor: COLOR_BORDER,
                '--tw-ring-color': COLOR_ACCENT,
              } as any}
            />
          </div>

          {/* Type Filters */}
          <div>
            <p className="text-sm font-semibold mb-2" style={{ color: COLOR_PRIMARY }}>
              User Type
            </p>
            <div className="flex flex-wrap gap-3">
              {['seller', 'broker', 'buyer'].map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    if (selectedType.includes(type)) {
                      setSelectedType(selectedType.filter((t) => t !== type))
                    } else {
                      setSelectedType([...selectedType, type])
                    }
                  }}
                  className="px-4 py-2 rounded-lg font-semibold text-sm transition-all text-white"
                  style={{
                    background: selectedType.includes(type) ? USER_TYPE_COLORS[type as keyof typeof USER_TYPE_COLORS] : COLOR_BACKGROUND,
                    color: selectedType.includes(type) ? 'white' : COLOR_PRIMARY,
                  }}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Status Filters */}
          <div>
            <p className="text-sm font-semibold mb-2" style={{ color: COLOR_PRIMARY }}>
              Status
            </p>
            <div className="flex flex-wrap gap-3">
              {['active', 'inactive', 'suspended'].map((status) => (
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
                    background: selectedStatus.includes(status) ? STATUS_COLORS[status as keyof typeof STATUS_COLORS] : COLOR_BACKGROUND,
                    color: selectedStatus.includes(status) ? 'white' : COLOR_PRIMARY,
                  }}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
              Showing {filteredUsers.length} of {users.length} users
            </p>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-semibold transition-all hover:bg-gray-50"
              style={{ borderColor: COLOR_BORDER, color: COLOR_PRIMARY }}>
              <Download size={18} />
              Export CSV
            </button>
          </div>
        </div>
      </motion.div>

      {/* Users Table */}
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
                  User
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide" style={{ color: COLOR_TEXT_SECONDARY }}>
                  Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide" style={{ color: COLOR_TEXT_SECONDARY }}>
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide" style={{ color: COLOR_TEXT_SECONDARY }}>
                  KYC
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide" style={{ color: COLOR_TEXT_SECONDARY }}>
                  Activity
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide" style={{ color: COLOR_TEXT_SECONDARY }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <motion.tbody key={user.id}>
                  <tr
                    style={{
                      borderBottom: `1px solid ${COLOR_BORDER}`,
                      background: expandedId === user.id ? COLOR_BACKGROUND : 'white',
                    }}
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-sm" style={{ color: COLOR_PRIMARY }}>
                          {user.name}
                        </p>
                        <p className="text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>
                          {user.email}
                        </p>
                        <p className="text-xs mt-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                          Joined {user.joined}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="px-3 py-1 rounded-full text-xs font-bold text-white"
                        style={{ background: USER_TYPE_COLORS[user.type as keyof typeof USER_TYPE_COLORS] }}
                      >
                        {user.type.charAt(0).toUpperCase() + user.type.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="px-3 py-1 rounded-full text-xs font-bold text-white"
                        style={{ background: STATUS_COLORS[user.status as keyof typeof STATUS_COLORS] }}
                      >
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="px-3 py-1 rounded-full text-xs font-bold text-white"
                        style={{ background: KYC_STATUS_COLORS[user.kycStatus as keyof typeof KYC_STATUS_COLORS] }}
                      >
                        {user.kycStatus.charAt(0).toUpperCase() + user.kycStatus.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm" style={{ color: COLOR_PRIMARY }}>
                      <p>{user.activity} actions</p>
                      <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-xs">
                        Last: {user.lastActive}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setExpandedId(expandedId === user.id ? null : user.id)}
                          className="p-2 hover:bg-gray-100 rounded transition-colors"
                          title="View Details"
                        >
                          <Eye size={18} style={{ color: COLOR_PRIMARY }} />
                        </button>
                        <button
                          className="p-2 hover:bg-blue-100 rounded transition-colors"
                          title="Message"
                        >
                          <Mail size={18} color="#3B82F6" />
                        </button>
                        {user.status === 'active' ? (
                          <button
                            onClick={() => handleSuspend(user.id)}
                            className="p-2 hover:bg-red-100 rounded transition-colors"
                            title="Suspend"
                          >
                            <Ban size={18} color="#EF4444" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUnsuspend(user.id)}
                            className="p-2 hover:bg-green-100 rounded transition-colors"
                            title="Unsuspend"
                          >
                            <Shield size={18} color="#10B981" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                  {expandedId === user.id && (
                    <tr style={{ background: COLOR_BACKGROUND }}>
                      <td colSpan={6} className="px-6 py-6">
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="grid grid-cols-1 md:grid-cols-3 gap-6"
                        >
                          <div>
                            <h4 className="font-bold mb-3" style={{ color: COLOR_PRIMARY }}>
                              Account Info
                            </h4>
                            <div className="space-y-2">
                              <p className="text-sm">
                                <span style={{ color: COLOR_TEXT_SECONDARY }}>User ID:</span>{' '}
                                <code style={{ color: COLOR_PRIMARY }} className="font-mono">
                                  {user.id}
                                </code>
                              </p>
                              <p className="text-sm">
                                <span style={{ color: COLOR_TEXT_SECONDARY }}>Tier:</span>{' '}
                                <span style={{ color: TIER_COLORS[user.tier as keyof typeof TIER_COLORS] }} className="font-semibold">
                                  {user.tier.toUpperCase()}
                                </span>
                              </p>
                              <p className="text-sm">
                                <span style={{ color: COLOR_TEXT_SECONDARY }}>2FA:</span>{' '}
                                <span style={{ color: COLOR_PRIMARY }} className="font-semibold">
                                  ✓ Enabled
                                </span>
                              </p>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-bold mb-3" style={{ color: COLOR_PRIMARY }}>
                              Activity
                            </h4>
                            <div className="space-y-2">
                              <p className="text-sm">
                                <span style={{ color: COLOR_TEXT_SECONDARY }}>Listings:</span>{' '}
                                <span style={{ color: COLOR_PRIMARY }} className="font-semibold">
                                  {user.listings}
                                </span>
                              </p>
                              <p className="text-sm">
                                <span style={{ color: COLOR_TEXT_SECONDARY }}>Total Actions:</span>{' '}
                                <span style={{ color: COLOR_PRIMARY }} className="font-semibold">
                                  {user.activity}
                                </span>
                              </p>
                              <p className="text-sm">
                                <span style={{ color: COLOR_TEXT_SECONDARY }}>Last Active:</span>{' '}
                                <span style={{ color: COLOR_PRIMARY }} className="font-semibold text-xs">
                                  {user.lastActive}
                                </span>
                              </p>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-bold mb-3" style={{ color: COLOR_PRIMARY }}>
                              KYC Details
                            </h4>
                            <div className="space-y-2">
                              <p className="text-sm">
                                <span style={{ color: COLOR_TEXT_SECONDARY }}>ID Verified:</span>{' '}
                                {user.kycStatus === 'verified' ? (
                                  <span style={{ color: '#10B981' }} className="font-semibold">
                                    ✓ Yes
                                  </span>
                                ) : (
                                  <span style={{ color: COLOR_TEXT_SECONDARY }}>Pending</span>
                                )}
                              </p>
                              <p className="text-sm">
                                <span style={{ color: COLOR_TEXT_SECONDARY }}>Address:</span>{' '}
                                {user.kycStatus === 'verified' ? (
                                  <span style={{ color: '#10B981' }} className="font-semibold">
                                    ✓ Verified
                                  </span>
                                ) : (
                                  <span style={{ color: COLOR_TEXT_SECONDARY }}>Pending</span>
                                )}
                              </p>
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

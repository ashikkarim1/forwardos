'use client'

import { motion } from 'framer-motion'
import { Search, Filter, Download, Eye, Save, Share2, FileDown, MessageSquare } from 'lucide-react'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER, COLOR_BG_PRIMARY } from '@/styles/forward-colors'

const ACTIVITY_TYPES = {
  login: { icon: '🔐', color: '#B8956A', label: 'Login' },
  view: { icon: '👁️', color: '#8B5CF6', label: 'View Deal' },
  save: { icon: '⭐', color: '#F59E0B', label: 'Save Deal' },
  compare: { icon: '📊', color: '#10B981', label: 'Compare' },
  download: { icon: '⬇️', color: COLOR_ACCENT, label: 'Download CIM' },
  message: { icon: '💬', color: '#EC4899', label: 'Message' },
  upload: { icon: '⬆️', color: '#6366F1', label: 'Upload' },
  flag: { icon: '🚩', color: '#EF4444', label: 'Flag' },
}

const RECENT_ACTIVITIES = [
  { time: '4:32 PM', user: 'Jane Smith #1023', action: 'view', details: 'Viewed Deal #487', icon: '👁️' },
  { time: '4:31 PM', user: 'Mike Chen #1022', action: 'save', details: 'Saved Deal #486', icon: '⭐' },
  { time: '4:30 PM', user: 'System', action: 'flag', details: 'Auto-flagged Listing #523 (Duplicate)', icon: '🚩' },
  { time: '4:29 PM', user: 'John Doe #1024', action: 'upload', details: 'Updated Listing #487 (revenue)', icon: '⬆️' },
  { time: '4:28 PM', user: 'Sarah Lee #1021', action: 'download', details: 'Downloaded CIM #487', icon: '⬇️' },
  { time: '4:25 PM', user: 'Admin Sarah', action: 'flag', details: 'Approved KYC for User #1021', icon: '✓' },
  { time: '4:20 PM', user: 'Mike Chen #1022', action: 'compare', details: 'Ran Comparison (3 deals)', icon: '📊' },
  { time: '4:15 PM', user: 'System', action: 'flag', details: 'Suspicious activity detected on User #1020', icon: '🚩' },
  { time: '4:10 PM', user: 'Jane Smith #1023', action: 'message', details: 'Sent message to seller (Deal #487)', icon: '💬' },
  { time: '4:05 PM', user: 'John Doe #1024', action: 'login', details: 'Logged in from 192.168.1.100', icon: '🔐' },
]

export default function AdminActivityPage() {
  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-black mb-2" style={{ color: COLOR_PRIMARY }}>
          Activity Monitoring
        </h1>
        <p style={{ color: COLOR_TEXT_SECONDARY }}>
          Real-time activity stream and user action tracking
        </p>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-lg border"
        style={{ borderColor: COLOR_BORDER }}
      >
        <div className="space-y-4">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: COLOR_TEXT_SECONDARY }} />
            <input
              type="text"
              placeholder="Search by user or action..."
              className="w-full pl-10 pr-4 py-3 rounded-lg border bg-white focus:outline-none focus:ring-2"
              style={{
                borderColor: COLOR_BORDER,
                '--tw-ring-color': COLOR_ACCENT,
              } as any}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {Object.entries(ACTIVITY_TYPES).map(([key, value]) => (
              <button
                key={key}
                className="px-3 py-2 rounded-lg text-sm font-semibold transition-all hover:scale-105"
                style={{
                  background: value.color + '20',
                  color: value.color,
                  border: `2px solid ${value.color}50`,
                }}
              >
                {value.icon} {value.label}
              </button>
            ))}
          </div>

          <div className="flex justify-between items-center">
            <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
              Showing last 10 activities (more available)
            </p>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-semibold transition-all hover:bg-gray-50"
              style={{ borderColor: COLOR_BORDER, color: COLOR_PRIMARY }}>
              <Download size={18} />
              Export
            </button>
          </div>
        </div>
      </motion.div>

      {/* Activity Stream */}
      <div className="space-y-3">
        {RECENT_ACTIVITIES.map((activity, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="p-4 rounded-lg border flex items-start gap-4 hover:bg-gray-50 transition-colors"
            style={{ borderColor: COLOR_BORDER }}
          >
            <div className="text-2xl flex-shrink-0">{activity.icon}</div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm" style={{ color: COLOR_PRIMARY }}>
                {activity.user}
              </p>
              <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                {activity.details}
              </p>
            </div>
            <p className="text-xs flex-shrink-0 whitespace-nowrap" style={{ color: COLOR_TEXT_SECONDARY }}>
              {activity.time}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Analytics Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {[
          { label: 'Logins This Week', value: '8,234', icon: '🔐', color: '#B8956A' },
          { label: 'Deals Viewed', value: '45,120', icon: '👁️', color: '#8B5CF6' },
          { label: 'Comparisons', value: '2,345', icon: '📊', color: '#10B981' },
          { label: 'CIM Downloads', value: '567', icon: '⬇️', color: COLOR_ACCENT },
        ].map((stat, idx) => (
          <div key={idx} className="p-4 rounded-lg border" style={{ borderColor: COLOR_BORDER }}>
            <p className="text-2xl mb-2">{stat.icon}</p>
            <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
              {stat.label}
            </p>
            <p className="text-2xl font-black mt-1" style={{ color: stat.color }}>
              {stat.value}
            </p>
          </div>
        ))}
      </motion.div>
    </div>
  )
}

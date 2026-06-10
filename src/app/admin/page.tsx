'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  ArrowUpRight,
  AlertCircle,
  Users,
  ShoppingCart,
  Mail,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
} from 'lucide-react'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER, COLOR_BG_PRIMARY } from '@/styles/forward-colors'

const METRICS = [
  {
    label: 'New Users Today',
    value: '47',
    change: '+12%',
    icon: Users,
    color: '#3B82F6',
  },
  {
    label: 'New Listings',
    value: '23',
    change: '+8%',
    icon: ShoppingCart,
    color: '#3B82F6',
  },
  {
    label: 'Pending Approvals',
    value: '12',
    severity: 'urgent',
    icon: AlertCircle,
    color: '#DC2626',
  },
  {
    label: 'Suspicious Flags',
    value: '3',
    severity: 'alert',
    icon: AlertCircle,
    color: '#EA580C',
  },
]

const USER_METRICS = [
  { label: 'Total Users', value: '12,847' },
  { label: 'Active This Week', value: '3,214 (25%)' },
  { label: 'Unverified KYC', value: '234 (1.8%)' },
  { label: 'Verified Premium', value: '567 (4.4%)' },
]

const LISTING_METRICS = [
  { label: 'Total Deals', value: '487' },
  { label: 'Active This Month', value: '412 (84%)' },
  { label: 'Pending Approval', value: '12' },
  { label: 'Premium Featured', value: '89 (18%)' },
]

const REVENUE_METRICS = [
  { label: 'Premium Subscriptions', value: '$28,450' },
  { label: 'Featured Listings', value: '$12,300' },
  { label: 'Total MRR', value: '$40,750' },
]

const EMAIL_METRICS = [
  { label: 'Sent This Week', value: '45,220' },
  { label: 'Open Rate', value: '38.2%' },
  { label: 'Click Rate', value: '16.4%' },
  { label: 'Unsubscribe Rate', value: '0.3%' },
]

const RECENT_ALERTS = [
  {
    icon: AlertCircle,
    title: '12 listings pending approval',
    description: 'Waiting >24 hours',
    severity: 'urgent',
  },
  {
    icon: AlertCircle,
    title: '3 suspicious listings flagged',
    description: 'Needs review',
    severity: 'alert',
  },
  {
    icon: Clock,
    title: 'KYC verification backlog',
    description: '5 users pending verification',
    severity: 'warning',
  },
  {
    icon: Mail,
    title: 'Bulk email sent',
    description: 'To 2,341 buyers',
    severity: 'info',
  },
]

const QUICK_ACTIONS = [
  { label: 'Review Pending', href: '/admin/listings?status=pending', icon: ShoppingCart },
  { label: 'Flag Suspicious', href: '/admin/listings?flagged=true', icon: AlertCircle },
  { label: 'Manage Users', href: '/admin/users', icon: Users },
  { label: 'View Emails', href: '/admin/email', icon: Mail },
  { label: 'Export Report', href: '/admin/reports', icon: TrendingUp },
  { label: 'Support Tickets', href: '/admin/support', icon: CheckCircle2 },
]

export default function AdminDashboard() {
  return (
    <div className="p-4 md:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-black mb-2" style={{ color: COLOR_PRIMARY }}>
          Dashboard
        </h1>
        <p style={{ color: COLOR_TEXT_SECONDARY }}>
          Welcome back! Here's what's happening with your platform today.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {QUICK_ACTIONS.map((action) => {
          const Icon = action.icon
          return (
            <Link key={action.href} href={action.href}>
              <motion.button
                whileHover={{ y: -4 }}
                className="w-full p-4 rounded-lg border text-center transition-all"
                style={{ borderColor: COLOR_BORDER, color: COLOR_PRIMARY }}
              >
                <Icon size={24} className="mx-auto mb-2" />
                <p className="text-xs font-bold">{action.label}</p>
              </motion.button>
            </Link>
          )
        })}
      </div>

      {/* Primary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {METRICS.map((metric, idx) => {
          const Icon = metric.icon
          const isCritical = metric.severity === 'urgent' || metric.severity === 'alert'
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="p-6 rounded-lg border"
              style={{
                borderColor: isCritical ? metric.color : COLOR_BORDER,
                background: isCritical ? metric.color + '08' : COLOR_BG_PRIMARY,
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide" style={{ color: COLOR_TEXT_SECONDARY }}>
                    {metric.label}
                  </p>
                  <p className="text-3xl font-black mt-2" style={{ color: metric.color }}>
                    {metric.value}
                  </p>
                </div>
                <Icon size={24} style={{ color: metric.color }} />
              </div>
              {metric.change && (
                <p className="text-xs font-bold flex items-center gap-1" style={{ color: COLOR_ACCENT }}>
                  <ArrowUpRight size={14} /> {metric.change} vs yesterday
                </p>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* User Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 rounded-lg border"
          style={{ borderColor: COLOR_BORDER }}
        >
          <h3 className="font-bold text-lg mb-4" style={{ color: COLOR_PRIMARY }}>
            👥 User Metrics
          </h3>
          <div className="space-y-3">
            {USER_METRICS.map((m, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <span className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                  {m.label}
                </span>
                <span className="font-bold text-sm" style={{ color: COLOR_PRIMARY }}>
                  {m.value}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Listing Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="p-6 rounded-lg border"
          style={{ borderColor: COLOR_BORDER }}
        >
          <h3 className="font-bold text-lg mb-4" style={{ color: COLOR_PRIMARY }}>
            📊 Listing Metrics
          </h3>
          <div className="space-y-3">
            {LISTING_METRICS.map((m, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <span className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                  {m.label}
                </span>
                <span className="font-bold text-sm" style={{ color: COLOR_PRIMARY }}>
                  {m.value}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Revenue Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-6 rounded-lg border"
          style={{ borderColor: COLOR_BORDER }}
        >
          <h3 className="font-bold text-lg mb-4" style={{ color: COLOR_PRIMARY }}>
            💰 Revenue (This Month)
          </h3>
          <div className="space-y-3">
            {REVENUE_METRICS.map((m, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <span className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                  {m.label}
                </span>
                <span className="font-bold text-sm" style={{ color: COLOR_ACCENT }}>
                  {m.value}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Email Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="p-6 rounded-lg border"
          style={{ borderColor: COLOR_BORDER }}
        >
          <h3 className="font-bold text-lg mb-4" style={{ color: COLOR_PRIMARY }}>
            ✉️ Email Metrics (Week)
          </h3>
          <div className="space-y-3">
            {EMAIL_METRICS.map((m, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <span className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                  {m.label}
                </span>
                <span className="font-bold text-sm" style={{ color: COLOR_PRIMARY }}>
                  {m.value}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Alerts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="p-6 rounded-lg border"
        style={{ borderColor: COLOR_BORDER }}
      >
        <h3 className="font-bold text-lg mb-4" style={{ color: COLOR_PRIMARY }}>
          Recent Alerts
        </h3>
        <div className="space-y-3">
          {RECENT_ALERTS.map((alert, idx) => {
            const Icon = alert.icon
            const severityColor =
              alert.severity === 'urgent'
                ? '#DC2626'
                : alert.severity === 'alert'
                  ? '#EA580C'
                  : alert.severity === 'warning'
                    ? '#F59E0B'
                    : COLOR_TEXT_SECONDARY
            return (
              <div
                key={idx}
                className="flex items-start gap-4 p-4 rounded-lg"
                style={{ background: COLOR_BG_PRIMARY }}
              >
                <Icon size={20} style={{ color: severityColor, flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <p className="font-semibold text-sm" style={{ color: COLOR_PRIMARY }}>
                    {alert.title}
                  </p>
                  <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                    {alert.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}
// Build trigger: Tue Jun  9 21:00:36 +04 2026
// New build trigger: Tue Jun  9 21:31:50 +04 2026

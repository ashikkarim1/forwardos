'use client'

import { motion } from 'framer-motion'
import { BarChart3, TrendingUp, Users, DollarSign, Mail, AlertCircle, Download, Plus } from 'lucide-react'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER, COLOR_BG_PRIMARY } from '@/styles/forward-colors'

const REPORTS = [
  {
    name: 'Executive Dashboard',
    description: 'KPIs, trends, revenue, and growth',
    icon: BarChart3,
    lastRun: 'Today at 9:00 AM',
    frequency: 'Daily',
    recipients: 'C-Suite',
  },
  {
    name: 'User Growth Report',
    description: 'New users, by type, activation, retention',
    icon: Users,
    lastRun: 'Mar 8 at 3:00 PM',
    frequency: 'Weekly',
    recipients: 'Marketing',
  },
  {
    name: 'Listing Health Report',
    description: 'Approvals, suspensions, fraud, quality scores',
    icon: AlertCircle,
    lastRun: 'Mar 8 at 2:00 PM',
    frequency: 'Daily',
    recipients: 'Operations',
  },
  {
    name: 'Revenue Report',
    description: 'Premium subscriptions, featured listings, MRR',
    icon: DollarSign,
    lastRun: 'Mar 1 at 12:00 AM',
    frequency: 'Monthly',
    recipients: 'Finance',
  },
  {
    name: 'Email Performance Report',
    description: 'Campaigns, opens, clicks, conversions, unsubscribes',
    icon: Mail,
    lastRun: 'Today at 6:00 AM',
    frequency: 'Weekly',
    recipients: 'Marketing',
  },
  {
    name: 'Fraud & Compliance Report',
    description: 'Flagged items, investigations, resolutions',
    icon: AlertCircle,
    lastRun: 'Mar 7 at 4:00 PM',
    frequency: 'Daily',
    recipients: 'Legal & Compliance',
  },
]

const REPORT_METRICS = [
  { label: 'Revenue (This Month)', value: '$40,750', icon: DollarSign, color: COLOR_ACCENT },
  { label: 'Active Users (This Week)', value: '3,214', icon: Users, color: '#10B981' },
  { label: 'Avg Email Open Rate', value: '36.9%', icon: Mail, color: '#B8956A' },
  { label: 'Growth Rate (YoY)', value: '+34.2%', icon: TrendingUp, color: '#10B981' },
]

export default function AdminReportsPage() {
  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-black mb-2" style={{ color: COLOR_PRIMARY }}>
          Reports & Analytics
        </h1>
        <p style={{ color: COLOR_TEXT_SECONDARY }}>
          Pre-built reports and custom analytics dashboard
        </p>
      </div>

      {/* Create Custom Report */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full md:w-auto px-6 py-3 rounded-lg font-bold text-white flex items-center justify-center gap-2 transition-all"
        style={{ background: COLOR_ACCENT }}
      >
        <Plus size={20} />
        Create Custom Report
      </motion.button>

      {/* Key Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {REPORT_METRICS.map((metric, idx) => {
          const Icon = metric.icon
          return (
            <div key={idx} className="p-4 rounded-lg border" style={{ borderColor: COLOR_BORDER }}>
              <div className="flex items-center gap-2 mb-2">
                <Icon size={20} style={{ color: metric.color }} />
                <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                  {metric.label}
                </p>
              </div>
              <p className="text-2xl font-black" style={{ color: metric.color }}>
                {metric.value}
              </p>
            </div>
          )
        })}
      </motion.div>

      {/* Pre-built Reports */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold" style={{ color: COLOR_PRIMARY }}>
          Pre-Built Reports
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {REPORTS.map((report, idx) => {
            const Icon = report.icon
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="p-6 rounded-lg border hover:shadow-lg transition-all cursor-pointer group"
                style={{ borderColor: COLOR_BORDER }}
              >
                <div className="flex items-start justify-between mb-3">
                  <Icon size={32} style={{ color: COLOR_ACCENT }} />
                  <Download
                    size={20}
                    style={{ color: COLOR_TEXT_SECONDARY }}
                    className="group-hover:opacity-100 opacity-0 transition-opacity"
                  />
                </div>
                <h3 className="font-bold text-lg mb-1" style={{ color: COLOR_PRIMARY }}>
                  {report.name}
                </h3>
                <p className="text-sm mb-4" style={{ color: COLOR_TEXT_SECONDARY }}>
                  {report.description}
                </p>

                <div className="space-y-2 mb-4 pb-4 border-t" style={{ borderColor: COLOR_BORDER }}>
                  <div className="flex justify-between text-xs">
                    <span style={{ color: COLOR_TEXT_SECONDARY }}>Last Run:</span>
                    <span style={{ color: COLOR_PRIMARY }} className="font-semibold">
                      {report.lastRun}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span style={{ color: COLOR_TEXT_SECONDARY }}>Frequency:</span>
                    <span style={{ color: COLOR_PRIMARY }} className="font-semibold">
                      {report.frequency}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span style={{ color: COLOR_TEXT_SECONDARY }}>Recipients:</span>
                    <span style={{ color: COLOR_PRIMARY }} className="font-semibold">
                      {report.recipients}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 px-3 py-2 rounded-lg text-sm font-bold transition-all hover:bg-gray-100"
                    style={{ borderColor: COLOR_BORDER, border: `1px solid ${COLOR_BORDER}`, color: COLOR_PRIMARY }}>
                    View
                  </button>
                  <button className="flex-1 px-3 py-2 rounded-lg text-sm font-bold text-white transition-all hover:opacity-90"
                    style={{ background: COLOR_ACCENT }}>
                    Download
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Custom Report Builder */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-6 rounded-lg border"
        style={{ borderColor: COLOR_BORDER }}
      >
        <h2 className="text-xl font-bold mb-6" style={{ color: COLOR_PRIMARY }}>
          Custom Report Builder
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
              Report Name
            </label>
            <input
              type="text"
              placeholder="e.g., Q1 Performance Analysis"
              className="w-full px-4 py-3 rounded-lg border bg-white focus:outline-none focus:ring-2"
              style={{
                borderColor: COLOR_BORDER,
                '--tw-ring-color': COLOR_ACCENT,
              } as any}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
                Data Source
              </label>
              <select
                className="w-full px-4 py-3 rounded-lg border bg-white focus:outline-none focus:ring-2"
                style={{
                  borderColor: COLOR_BORDER,
                  '--tw-ring-color': COLOR_ACCENT,
                } as any}
              >
                <option>Users</option>
                <option>Listings</option>
                <option>Emails</option>
                <option>Transactions</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
                Schedule
              </label>
              <select
                className="w-full px-4 py-3 rounded-lg border bg-white focus:outline-none focus:ring-2"
                style={{
                  borderColor: COLOR_BORDER,
                  '--tw-ring-color': COLOR_ACCENT,
                } as any}
              >
                <option>Once</option>
                <option>Daily</option>
                <option>Weekly</option>
                <option>Monthly</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
                From Date
              </label>
              <input
                type="date"
                className="w-full px-4 py-3 rounded-lg border bg-white focus:outline-none focus:ring-2"
                style={{
                  borderColor: COLOR_BORDER,
                  '--tw-ring-color': COLOR_ACCENT,
                } as any}
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
                To Date
              </label>
              <input
                type="date"
                className="w-full px-4 py-3 rounded-lg border bg-white focus:outline-none focus:ring-2"
                style={{
                  borderColor: COLOR_BORDER,
                  '--tw-ring-color': COLOR_ACCENT,
                } as any}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
              Recipients (Email)
            </label>
            <input
              type="text"
              placeholder="admin@forward.com, marketing@forward.com"
              className="w-full px-4 py-3 rounded-lg border bg-white focus:outline-none focus:ring-2"
              style={{
                borderColor: COLOR_BORDER,
                '--tw-ring-color': COLOR_ACCENT,
              } as any}
            />
          </div>

          <div className="flex gap-3">
            <button className="flex-1 px-4 py-3 rounded-lg font-bold text-white transition-all hover:opacity-90"
              style={{ background: COLOR_ACCENT }}>
              Create Report
            </button>
            <button className="flex-1 px-4 py-3 rounded-lg font-bold border transition-all hover:bg-gray-50"
              style={{ borderColor: COLOR_BORDER, color: COLOR_PRIMARY }}>
              Cancel
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

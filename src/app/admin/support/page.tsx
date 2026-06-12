'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Clock, AlertCircle, MessageCircle, CheckCircle, Eye } from 'lucide-react'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER, COLOR_BG_PRIMARY } from '@/styles/forward-colors'

const TICKETS_DATA = [
  {
    id: '#547',
    title: "Can't download CIM",
    user: 'Mike Chen',
    priority: 'urgent',
    status: 'open',
    created: 'Mar 8, 12:30 PM',
    waiting: '4h 02m',
    category: 'Technical Issue',
    message: "I tried to download the CIM for the SaaS Platform deal (#487) but got an error: 'File download failed'.",
  },
  {
    id: '#546',
    title: 'Listing not showing premium',
    user: 'Jane Smith',
    priority: 'urgent',
    status: 'open',
    created: 'Mar 8, 12:15 PM',
    waiting: '4h 17m',
    category: 'Billing',
    message: 'I paid for premium featured but the listing is still showing as standard.',
  },
  {
    id: '#545',
    title: 'Questions about KYC',
    user: 'Sarah Lee',
    priority: 'high',
    status: 'open',
    created: 'Mar 8, 10:45 AM',
    waiting: '5h 47m',
    category: 'Account',
    message: 'What documents do I need to upload for KYC verification?',
  },
  {
    id: '#544',
    title: 'Password reset issue',
    user: 'Alex Johnson',
    priority: 'normal',
    status: 'in_progress',
    created: 'Mar 7, 3:20 PM',
    waiting: '1d 9h',
    category: 'Account',
    message: 'Password reset email not arriving.',
  },
  {
    id: '#543',
    title: 'Comparison not working',
    user: 'Robert Davis',
    priority: 'normal',
    status: 'open',
    created: 'Mar 7, 2:10 PM',
    waiting: '1d 10h',
    category: 'Technical Issue',
    message: 'When I try to compare 3 deals, the page shows an error.',
  },
]

const PRIORITY_COLORS = {
  urgent: { bg: '#DC2626', label: '🔴 Urgent' },
  high: { bg: '#F59E0B', label: '🟡 High' },
  normal: { bg: '#10B981', label: '🟢 Normal' },
  low: { bg: '#6B7280', label: '⚪ Low' },
}

const STATUS_COLORS = {
  open: '#EF4444',
  in_progress: '#F59E0B',
  resolved: '#10B981',
  closed: '#6B7280',
}

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState(TICKETS_DATA)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const openCount = tickets.filter((t) => t.status === 'open').length
  const urgentCount = tickets.filter((t) => t.priority === 'urgent').length
  const avgWaitTime = '4.2h'

  const priorityQueues = {
    urgent: tickets.filter((t) => t.priority === 'urgent'),
    high: tickets.filter((t) => t.priority === 'high'),
    normal: tickets.filter((t) => t.priority === 'normal'),
    low: tickets.filter((t) => t.priority === 'low'),
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Header & Stats */}
      <div>
        <h1 className="text-3xl md:text-4xl font-black mb-4" style={{ color: COLOR_PRIMARY }}>
          Support Tickets
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Open Tickets', value: openCount, color: '#EF4444' },
            { label: 'Urgent', value: urgentCount, color: '#DC2626' },
            { label: 'In Progress', value: 2, color: '#F59E0B' },
            { label: 'Avg Wait Time', value: avgWaitTime, color: '#B8956A' },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="p-4 rounded-lg border"
              style={{ borderColor: COLOR_BORDER }}
            >
              <p className="text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>
                {stat.label}
              </p>
              <p className="text-3xl font-black mt-2" style={{ color: stat.color }}>
                {stat.value}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Urgent & High Priority */}
      {(priorityQueues.urgent.length > 0 || priorityQueues.high.length > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-lg border-2"
          style={{ borderColor: '#DC2626', background: '#FEE2E2' }}
        >
          <div className="flex items-start gap-3">
            <AlertCircle size={24} color="#DC2626" style={{ flexShrink: 0 }} />
            <div>
              <p className="font-bold" style={{ color: '#991B1B' }}>
                {priorityQueues.urgent.length} urgent and {priorityQueues.high.length} high-priority tickets waiting response
              </p>
              <p className="text-sm" style={{ color: '#7F1D1D' }}>
                Please address these tickets as soon as possible
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: COLOR_TEXT_SECONDARY }} />
        <input
          type="text"
          placeholder="Search tickets by ID, user, or title..."
          className="w-full pl-10 pr-4 py-3 rounded-lg border bg-white focus:outline-none focus:ring-2"
          style={{
            borderColor: COLOR_BORDER,
            '--tw-ring-color': COLOR_ACCENT,
          } as any}
        />
      </motion.div>

      {/* Tickets by Priority */}
      {Object.entries(priorityQueues).map(([priority, priorityTickets]) => {
        if (priorityTickets.length === 0) return null

        return (
          <div key={priority} className="space-y-3">
            <h2 className="text-lg font-bold" style={{ color: COLOR_PRIMARY }}>
              {PRIORITY_COLORS[priority as keyof typeof PRIORITY_COLORS].label}
            </h2>

            {priorityTickets.map((ticket, idx) => (
              <motion.div
                key={ticket.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="rounded-lg border overflow-hidden hover:shadow-md transition-shadow"
                style={{ borderColor: COLOR_BORDER }}
              >
                <div
                  className="p-4 cursor-pointer"
                  onClick={() => setExpandedId(expandedId === ticket.id ? null : ticket.id)}
                >
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span
                          className="px-2 py-1 rounded-full text-xs font-bold text-white"
                          style={{ background: PRIORITY_COLORS[priority as keyof typeof PRIORITY_COLORS].bg }}
                        >
                          {ticket.id}
                        </span>
                        <h3 className="font-bold" style={{ color: COLOR_PRIMARY }}>
                          {ticket.title}
                        </h3>
                      </div>
                      <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                        {ticket.user} • {ticket.category} • {ticket.created}
                      </p>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span
                        className="px-3 py-1 rounded-full text-xs font-bold text-white inline-block mb-2"
                        style={{ background: STATUS_COLORS[ticket.status as keyof typeof STATUS_COLORS] }}
                      >
                        {ticket.status === 'in_progress' ? 'In Progress' : ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                      </span>
                      <p className="text-xs mt-2" style={{ color: COLOR_TEXT_SECONDARY }}>
                        Waiting: {ticket.waiting}
                      </p>
                    </div>
                  </div>
                </div>

                {expandedId === ticket.id && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 border-t"
                    style={{ background: COLOR_BG_PRIMARY, borderColor: COLOR_BORDER }}
                  >
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
                          Ticket Details
                        </h4>
                        <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                          {ticket.message}
                        </p>
                      </div>

                      {ticket.status === 'open' && (
                        <div className="p-4 rounded-lg border" style={{ borderColor: COLOR_BORDER }}>
                          <label className="block text-sm font-bold mb-3" style={{ color: COLOR_PRIMARY }}>
                            Send Response
                          </label>
                          <textarea
                            placeholder="Type your response here..."
                            className="w-full px-4 py-3 rounded-lg border bg-white focus:outline-none focus:ring-2 mb-3"
                            rows={4}
                            style={{
                              borderColor: COLOR_BORDER,
                              '--tw-ring-color': COLOR_ACCENT,
                            } as any}
                          />
                          <div className="flex gap-2">
                            <button className="flex-1 px-4 py-2 rounded-lg font-bold text-white transition-all hover:opacity-90"
                              style={{ background: COLOR_ACCENT }}>
                              Send Response
                            </button>
                            <button className="flex-1 px-4 py-2 rounded-lg font-bold border transition-all hover:bg-gray-100"
                              style={{ borderColor: COLOR_BORDER, color: COLOR_PRIMARY }}>
                              Resolve
                            </button>
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <button className="flex-1 px-4 py-2 rounded-lg border text-sm font-semibold transition-all hover:bg-gray-100"
                          style={{ borderColor: COLOR_BORDER, color: COLOR_PRIMARY }}>
                          <Eye className="inline mr-2" size={16} />
                          View Full Ticket
                        </button>
                        <button className="flex-1 px-4 py-2 rounded-lg border text-sm font-semibold transition-all hover:bg-gray-100"
                          style={{ borderColor: COLOR_BORDER, color: COLOR_PRIMARY }}>
                          <MessageCircle className="inline mr-2" size={16} />
                          Add Internal Note
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        )
      })}
    </div>
  )
}

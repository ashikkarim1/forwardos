'use client'

import { motion } from 'framer-motion'
import { MessageCircle, Users, Share2, Lock, Eye, Edit2, Zap, CheckCircle2, Clock } from 'lucide-react'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER } from '@/styles/forward-colors'

const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }

export default function CollaborationPage() {
  return (
    <motion.div className="max-w-7xl mx-auto px-8 py-8" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
      <motion.div variants={itemVariants} className="mb-12">
        <h1 className="text-4xl font-black mb-3" style={{ color: COLOR_PRIMARY }}>
          Real-Time Collaboration Suite
        </h1>
        <p className="text-lg" style={{ color: COLOR_TEXT_SECONDARY }}>
          Work seamlessly with advisors, legal teams, and investment partners in real-time.
        </p>
      </motion.div>

      {/* Collaboration Tools */}
      <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
        {[
          {
            title: 'Deal War Room',
            description: 'Central collaboration hub for entire transaction',
            icon: MessageCircle,
            features: ['Live deal threads', 'Real-time updates', 'Activity feed', 'Mention @advisors'],
          },
          {
            title: 'Team Workspace',
            description: 'Invite advisors, lawyers, accountants, and partners',
            icon: Users,
            features: ['Role-based access', 'Team assignments', 'Status tracking', 'Notifications'],
          },
          {
            title: 'Shared Workspace',
            description: 'Collaborate on documents with full version control',
            icon: Share2,
            features: ['Live document editing', 'Comments & markup', 'Version history', 'Export prepared'],
          },
        ].map((tool, idx) => {
          const Icon = tool.icon
          return (
            <motion.div key={idx} className="p-6 rounded-lg border-2" style={{ borderColor: COLOR_BORDER, background: 'white' }} variants={itemVariants}>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-lg" style={{ background: COLOR_ACCENT + '20' }}>
                  <Icon className="w-6 h-6" style={{ color: COLOR_ACCENT }} />
                </div>
                <div>
                  <h3 className="font-bold text-lg" style={{ color: COLOR_PRIMARY }}>
                    {tool.title}
                  </h3>
                  <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                    {tool.description}
                  </p>
                </div>
              </div>
              <ul className="space-y-2">
                {tool.features.map((f, i) => (
                  <li key={i} className="text-sm flex items-start gap-2" style={{ color: COLOR_TEXT_SECONDARY }}>
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: COLOR_ACCENT }} />
                    {f}
                  </li>
                ))}
              </ul>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Access Control */}
      <motion.div className="p-8 rounded-lg border-2 mb-12" style={{ borderColor: COLOR_BORDER, background: COLOR_ACCENT + '08' }} variants={itemVariants}>
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ color: COLOR_PRIMARY }}>
          <Lock className="w-6 h-6" />
          Granular Access Control
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { role: 'Seller', access: ['All data', 'Full edit', 'Invite users', 'View analytics'] },
            { role: 'Advisor', access: ['Deal data', 'Document edit', 'View team', 'Export reports'] },
            { role: 'Legal', access: ['Legal docs', 'Comment only', 'Version control', 'Audit trail'] },
            { role: 'Buyer', access: ['Shared docs', 'View only', 'Upload response', 'Send feedback'] },
          ].map((access) => (
            <div key={access.role} className="p-4 rounded-lg" style={{ background: 'white' }}>
              <p className="font-bold mb-3" style={{ color: COLOR_PRIMARY }}>{access.role}</p>
              <ul className="space-y-1 text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                {access.access.map((a, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Eye className="w-4 h-4" style={{ color: COLOR_ACCENT }} />
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Activity Timeline */}
      <motion.div className="p-8 rounded-lg border-2" style={{ borderColor: COLOR_BORDER, background: 'white' }} variants={itemVariants}>
        <h3 className="text-xl font-bold mb-6" style={{ color: COLOR_PRIMARY }}>
          Recent Collaboration Activity
        </h3>
        <div className="space-y-4">
          {[
            { user: 'Ahmed Al Mansouri', action: 'Left comment on LOI draft', time: '2 mins ago' },
            { user: 'Legal Advisor (Sarah)', action: 'Marked document as ready', time: '15 mins ago' },
            { user: 'You', action: 'Shared financial model with team', time: '1 hour ago' },
            { user: 'CFO Advisor', action: 'Added notes to due diligence checklist', time: '3 hours ago' },
          ].map((activity, idx) => (
            <div key={idx} className="p-4 rounded-lg hover:bg-gray-50 transition-colors" style={{ borderColor: COLOR_BORDER, borderBottom: idx < 3 ? `1px solid ${COLOR_BORDER}` : 'none' }}>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: COLOR_ACCENT }} />
                <div className="flex-1">
                  <p className="font-bold" style={{ color: COLOR_PRIMARY }}>
                    {activity.user}
                  </p>
                  <p className="text-sm mt-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                    {activity.action}
                  </p>
                </div>
                <p className="text-xs font-bold" style={{ color: COLOR_TEXT_SECONDARY }}>
                  {activity.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

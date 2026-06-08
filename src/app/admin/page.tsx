'use client'

import { motion } from 'framer-motion'
import { Users, Lock, Eye, Shield, AlertTriangle, CheckCircle2, Clock, MoreVertical } from 'lucide-react'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER } from '@/styles/forward-colors'

const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }

export default function AdminPage() {
  return (
    <motion.div className="max-w-7xl mx-auto px-8 py-8" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
      <motion.div variants={itemVariants} className="mb-12">
        <h1 className="text-4xl font-black mb-3" style={{ color: COLOR_PRIMARY }}>
          Enterprise Administration
        </h1>
        <p className="text-lg" style={{ color: COLOR_TEXT_SECONDARY }}>
          Manage teams, permissions, audit logs, and security settings.
        </p>
      </motion.div>

      {/* Team Management */}
      <motion.div className="mb-12 p-8 rounded-lg border-2" style={{ borderColor: COLOR_BORDER, background: 'white' }} variants={itemVariants}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold flex items-center gap-2" style={{ color: COLOR_PRIMARY }}>
            <Users className="w-6 h-6" />
            Team Members
          </h3>
          <button className="px-4 py-2 rounded-lg font-bold text-white text-sm" style={{ background: COLOR_ACCENT }}>
            + Invite Team
          </button>
        </div>
        <div className="space-y-3">
          {[
            { name: 'Ahmed Al Mansouri', email: 'ahmed@forward.ae', role: 'Owner', status: 'active' },
            { name: 'Sarah Khan', email: 'sarah@forward.ae', role: 'Admin', status: 'active' },
            { name: 'Michael Chen', email: 'michael@advisors.com', role: 'Advisor', status: 'active' },
          ].map((member, idx) => (
            <div key={idx} className="p-4 rounded-lg hover:bg-gray-50 flex items-center justify-between" style={{ borderColor: COLOR_BORDER, borderBottom: idx < 2 ? `1px solid ${COLOR_BORDER}` : 'none' }}>
              <div>
                <p className="font-bold" style={{ color: COLOR_PRIMARY }}>{member.name}</p>
                <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>{member.email}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="px-2 py-1 rounded text-xs font-bold" style={{ background: COLOR_ACCENT + '20', color: COLOR_ACCENT }}>
                  {member.role}
                </span>
                <button className="p-2 hover:bg-gray-100 rounded">
                  <MoreVertical className="w-5 h-5" style={{ color: COLOR_TEXT_SECONDARY }} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Audit Log */}
      <motion.div className="mb-12 p-8 rounded-lg border-2" style={{ borderColor: COLOR_BORDER, background: 'white' }} variants={itemVariants}>
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ color: COLOR_PRIMARY }}>
          <Eye className="w-6 h-6" />
          Audit Log (Last 24 Hours)
        </h3>
        <div className="space-y-3">
          {[
            { user: 'Ahmed Al Mansouri', action: 'Downloaded financial statements', timestamp: '2 mins ago', ip: '192.168.1.1' },
            { user: 'Sarah Khan', action: 'Invited Michael Chen to deal', timestamp: '14 mins ago', ip: '10.0.0.5' },
            { user: 'Ahmed Al Mansouri', action: 'Shared data room link with buyer', timestamp: '1 hour ago', ip: '192.168.1.1' },
            { user: 'System', action: 'Backup completed successfully', timestamp: '3 hours ago', ip: 'automated' },
          ].map((log, idx) => (
            <div key={idx} className="p-4 rounded-lg hover:bg-gray-50" style={{ background: '#FAFAF8' }}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-bold" style={{ color: COLOR_PRIMARY }}>{log.user}</p>
                  <p className="text-sm mt-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                    {log.action}
                  </p>
                  <p className="text-xs mt-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                    IP: {log.ip}
                  </p>
                </div>
                <p className="text-xs font-bold" style={{ color: COLOR_TEXT_SECONDARY }}>
                  {log.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Security & Compliance */}
      <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
        {[
          {
            title: 'Security Settings',
            icon: Shield,
            items: [
              { label: 'Two-Factor Authentication', status: 'enabled' },
              { label: 'IP Whitelist', status: 'disabled' },
              { label: 'Password Policy', status: 'strong' },
              { label: 'Session Timeout', status: '60 minutes' },
            ],
          },
          {
            title: 'Compliance & Privacy',
            icon: Lock,
            items: [
              { label: 'GDPR Compliance', status: 'compliant' },
              { label: 'Data Encryption', status: 'AES-256' },
              { label: 'Backup Frequency', status: 'daily' },
              { label: 'SOC 2 Certified', status: 'yes' },
            ],
          },
        ].map((section) => {
          const Icon = section.icon
          return (
            <motion.div key={section.title} className="p-6 rounded-lg border-2" style={{ borderColor: COLOR_BORDER, background: 'white' }} variants={itemVariants}>
              <h3 className="font-bold text-lg flex items-center gap-2 mb-4" style={{ color: COLOR_PRIMARY }}>
                <Icon className="w-6 h-6" style={{ color: COLOR_ACCENT }} />
                {section.title}
              </h3>
              <div className="space-y-3">
                {section.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between pb-3" style={{ borderBottom: idx < section.items.length - 1 ? `1px solid ${COLOR_BORDER}` : 'none' }}>
                    <p style={{ color: COLOR_TEXT_SECONDARY }}>{item.label}</p>
                    <span className="text-sm font-bold" style={{ color: '#10B981' }}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      {/* System Status */}
      <motion.div className="p-8 rounded-lg border-2" style={{ borderColor: COLOR_BORDER, background: COLOR_ACCENT + '08' }} variants={itemVariants}>
        <h3 className="text-xl font-bold mb-6" style={{ color: COLOR_PRIMARY }}>
          System Status
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { service: 'API Server', status: 'operational', uptime: '99.99%' },
            { service: 'Database', status: 'operational', uptime: '99.98%' },
            { service: 'File Storage', status: 'operational', uptime: '99.99%' },
          ].map((service) => (
            <div key={service.service} className="p-4 rounded-lg" style={{ background: 'white' }}>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-5 h-5" style={{ color: '#10B981' }} />
                <p className="font-bold" style={{ color: COLOR_PRIMARY }}>{service.service}</p>
              </div>
              <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                {service.status} • Uptime: {service.uptime}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

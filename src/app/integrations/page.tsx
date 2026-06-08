'use client'

import { motion } from 'framer-motion'
import { Zap, Database, Link2, CheckCircle2, AlertCircle, Settings, Key } from 'lucide-react'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER } from '@/styles/forward-colors'

const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }

export default function IntegrationsPage() {
  return (
    <motion.div className="max-w-7xl mx-auto px-8 py-8" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
      <motion.div variants={itemVariants} className="mb-12">
        <h1 className="text-4xl font-black mb-3" style={{ color: COLOR_PRIMARY }}>
          Integration Hub
        </h1>
        <p className="text-lg" style={{ color: COLOR_TEXT_SECONDARY }}>
          Connect with CRM, accounting, legal, and document management systems.
        </p>
      </motion.div>

      {/* Available Integrations */}
      <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
        {[
          { name: 'Salesforce', category: 'CRM', status: 'connected', icon: '☁️' },
          { name: 'QuickBooks', category: 'Accounting', status: 'connected', icon: '📊' },
          { name: 'Box', category: 'Document Storage', status: 'connected', icon: '📦' },
          { name: 'DocuSign', category: 'E-Signatures', status: 'available', icon: '✍️' },
          { name: 'Slack', category: 'Communications', status: 'available', icon: '💬' },
          { name: 'Stripe', category: 'Payments', status: 'available', icon: '💳' },
        ].map((integration) => (
          <motion.div key={integration.name} className="p-6 rounded-lg border-2" style={{ borderColor: COLOR_BORDER, background: 'white' }} variants={itemVariants}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-2xl mb-2">{integration.icon}</p>
                <h3 className="font-bold" style={{ color: COLOR_PRIMARY }}>
                  {integration.name}
                </h3>
                <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                  {integration.category}
                </p>
              </div>
              {integration.status === 'connected' ? (
                <CheckCircle2 className="w-6 h-6" style={{ color: '#10B981' }} />
              ) : (
                <AlertCircle className="w-6 h-6" style={{ color: '#F59E0B' }} />
              )}
            </div>
            <button className="w-full px-3 py-2 rounded-lg text-sm font-bold" style={{ background: integration.status === 'connected' ? COLOR_ACCENT + '20' : COLOR_ACCENT, color: integration.status === 'connected' ? COLOR_ACCENT : 'white' }}>
              {integration.status === 'connected' ? '✓ Connected' : 'Connect'}
            </button>
          </motion.div>
        ))}
      </motion.div>

      {/* API Configuration */}
      <motion.div className="p-8 rounded-lg border-2 mb-12" style={{ borderColor: COLOR_BORDER, background: COLOR_ACCENT + '08' }} variants={itemVariants}>
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ color: COLOR_PRIMARY }}>
          <Key className="w-6 h-6" />
          API & Webhooks
        </h3>
        <div className="space-y-4">
          <div className="p-4 rounded-lg" style={{ background: 'white' }}>
            <p className="font-bold mb-2" style={{ color: COLOR_PRIMARY }}>API Key</p>
            <input type="text" value="sk_live_5c3a4f9e8d2b1a0c" disabled className="w-full px-3 py-2 rounded border" style={{ borderColor: COLOR_BORDER }} />
            <p className="text-xs mt-2" style={{ color: COLOR_TEXT_SECONDARY }}>Keep this secret. Regenerate if compromised.</p>
          </div>
          <div className="p-4 rounded-lg" style={{ background: 'white' }}>
            <p className="font-bold mb-2" style={{ color: COLOR_PRIMARY }}>Webhook URL</p>
            <input type="text" value="https://yourapp.com/webhooks/forward" disabled className="w-full px-3 py-2 rounded border" style={{ borderColor: COLOR_BORDER }} />
            <p className="text-xs mt-2" style={{ color: COLOR_TEXT_SECONDARY }}>Receives real-time updates for deals, messages, and documents.</p>
          </div>
        </div>
      </motion.div>

      {/* Data Sync Status */}
      <motion.div className="p-8 rounded-lg border-2" style={{ borderColor: COLOR_BORDER, background: 'white' }} variants={itemVariants}>
        <h3 className="text-xl font-bold mb-6" style={{ color: COLOR_PRIMARY }}>
          Data Synchronization Status
        </h3>
        <div className="space-y-3">
          {[
            { system: 'Salesforce CRM', lastSync: '2 mins ago', records: '487 contacts', status: 'synced' },
            { system: 'QuickBooks', lastSync: '15 mins ago', records: 'All transactions', status: 'synced' },
            { system: 'Box Documents', lastSync: 'Real-time', records: '234 files', status: 'synced' },
          ].map((sync, idx) => (
            <div key={idx} className="p-4 rounded-lg flex items-center justify-between" style={{ background: '#FAFAF8' }}>
              <div>
                <p className="font-bold" style={{ color: COLOR_PRIMARY }}>{sync.system}</p>
                <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                  Last sync: {sync.lastSync} • {sync.records}
                </p>
              </div>
              <CheckCircle2 className="w-6 h-6" style={{ color: '#10B981' }} />
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

'use client'

import { motion } from 'framer-motion'
import { CheckCircle2, Lock, Zap, Globe } from 'lucide-react'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER } from '@/styles/forward-colors'

interface Integration {
  name: string
  description: string
  features: string[]
  icon: string
  status: 'active' | 'coming-soon'
  connector?: string
}

const integrations: Integration[] = [
  {
    name: 'Carta Cap Tables',
    description: 'Sync ownership structures and cap table data directly',
    features: [
      'Auto-import cap tables',
      'Real-time ownership data',
      'Dilution calculations',
      'Grant vesting schedules'
    ],
    icon: '📊',
    status: 'coming-soon',
    connector: 'OAuth'
  },
  {
    name: 'LinkedIn Profile',
    description: 'Enrich deal teams with LinkedIn professional profiles',
    features: [
      'Auto-enrich founder/CEO info',
      'Team composition insights',
      'Background verification',
      'Network analysis'
    ],
    icon: '👔',
    status: 'coming-soon',
    connector: 'OAuth'
  },
  {
    name: 'Bank Lending Data',
    description: 'Access institutional lending databases for valuation',
    features: [
      'SBA lending comparables',
      'Bank valuation multiples',
      'Credit profiles',
      'Financing benchmarks'
    ],
    icon: '🏦',
    status: 'coming-soon',
    connector: 'API'
  },
  {
    name: 'SEC EDGAR',
    description: 'Pull public M&A data and financial filings',
    features: [
      '10,000+ verified comps',
      'Quarterly financial data',
      '8-K deal announcements',
      'Executive compensation'
    ],
    icon: '📋',
    status: 'active',
    connector: 'API'
  },
  {
    name: 'Industry Reports',
    description: 'Access premium industry research and trends',
    features: [
      'Sector valuations',
      'Market multiples',
      'Growth benchmarks',
      'M&A activity'
    ],
    icon: '📈',
    status: 'active',
    connector: 'API'
  },
  {
    name: 'Tax Return Data',
    description: 'Verify revenue and profitability claims',
    features: [
      'IRS tax return validation',
      'Historical financials',
      'Owner income verification',
      'Fraud detection'
    ],
    icon: '🔍',
    status: 'coming-soon',
    connector: 'Secure Partner API'
  },
]

export default function InstitutionalIntegrations() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-black mb-2" style={{ color: COLOR_PRIMARY }}>
          🔗 Institutional Integrations
        </h2>
        <p style={{ color: COLOR_TEXT_SECONDARY }}>
          Connected to the data sources that power institutional M&A
        </p>
      </div>

      {/* Integration Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {integrations.map((integration, idx) => (
          <motion.div
            key={integration.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="p-6 rounded-lg border hover:shadow-lg transition-all"
            style={{ borderColor: COLOR_BORDER }}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{integration.icon}</span>
                <div>
                  <p className="font-bold" style={{ color: COLOR_PRIMARY }}>
                    {integration.name}
                  </p>
                  <p className="text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>
                    {integration.description}
                  </p>
                </div>
              </div>
              {integration.status === 'active' ? (
                <div className="flex items-center gap-1 px-2 py-1 rounded-full" style={{ background: '#10b98120' }}>
                  <CheckCircle2 size={14} className="text-green-600" />
                  <span className="text-xs font-bold text-green-600">Live</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 px-2 py-1 rounded-full" style={{ background: COLOR_ACCENT + '20' }}>
                  <Zap size={14} style={{ color: COLOR_ACCENT }} />
                  <span className="text-xs font-bold" style={{ color: COLOR_ACCENT }}>Soon</span>
                </div>
              )}
            </div>

            {/* Features */}
            <ul className="space-y-2 mb-4">
              {integration.features.map(feature => (
                <li key={feature} className="flex items-center gap-2 text-xs">
                  <div
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: COLOR_ACCENT }}
                  />
                  <span style={{ color: COLOR_TEXT_SECONDARY }}>{feature}</span>
                </li>
              ))}
            </ul>

            {/* Connector */}
            <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: COLOR_BORDER }}>
              <span className="text-xs font-bold" style={{ color: COLOR_TEXT_SECONDARY }}>
                {integration.connector}
              </span>
              <button
                disabled={integration.status === 'coming-soon'}
                className="text-xs font-bold px-3 py-1 rounded transition-all disabled:opacity-50"
                style={{
                  color: integration.status === 'active' ? 'white' : COLOR_TEXT_SECONDARY,
                  background: integration.status === 'active' ? COLOR_ACCENT : 'transparent',
                }}
              >
                {integration.status === 'active' ? 'Connected' : 'Coming Soon'}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Data Privacy Notice */}
      <div className="p-6 rounded-lg" style={{ background: '#f0f9ff', border: `1px solid #0ea5e9` }}>
        <div className="flex gap-3">
          <Lock size={20} style={{ color: '#0369a1' }} className="flex-shrink-0 mt-1" />
          <div>
            <p className="font-bold text-sm mb-1" style={{ color: '#0369a1' }}>
              🔐 Bank-Level Security
            </p>
            <p className="text-xs" style={{ color: '#0c4a6e' }}>
              All integrations use OAuth 2.0 and API encryption. Forward OS is SOC 2 Type II compliant. 
              Tax return data is handled through secure partner APIs with signed NDAs. Your data never leaves 
              encrypted channels.
            </p>
          </div>
        </div>
      </div>

      {/* API Access */}
      <div className="p-6 rounded-lg border" style={{ borderColor: COLOR_BORDER }}>
        <h3 className="font-bold mb-4" style={{ color: COLOR_PRIMARY }}>
          📡 Custom Data Feeds
        </h3>
        <p className="text-sm mb-4" style={{ color: COLOR_TEXT_SECONDARY }}>
          Institutional partners can build custom integrations with our REST API
        </p>
        <div className="space-y-3 text-sm">
          <div>
            <p className="font-bold mb-1" style={{ color: COLOR_PRIMARY }}>
              Available Endpoints
            </p>
            <ul className="space-y-1" style={{ color: COLOR_TEXT_SECONDARY }}>
              <li>• <code>GET /api/deals</code> - Real-time deal feed</li>
              <li>• <code>GET /api/comparables</code> - Market comparable data</li>
              <li>• <code>GET /api/valuations</code> - Valuation estimates</li>
              <li>• <code>POST /api/webhooks</code> - Deal activity notifications</li>
            </ul>
          </div>
          <div>
            <p className="font-bold mb-1" style={{ color: COLOR_PRIMARY }}>
              Rate Limits
            </p>
            <p style={{ color: COLOR_TEXT_SECONDARY }}>
              Starter: 100 requests/min • Professional: 1000 requests/min • Enterprise: Custom
            </p>
          </div>
        </div>
        <button
          className="mt-4 px-4 py-2 rounded-lg font-bold text-white text-sm transition-all hover:opacity-90"
          style={{ background: COLOR_ACCENT }}
        >
          Request API Access
        </button>
      </div>
    </div>
  )
}

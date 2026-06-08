'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, DollarSign, BarChart3, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react'
import { DashboardHeader } from '@/components/DashboardHeader'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER } from '@/styles/forward-colors'

const deal = {
  id: '1',
  name: 'Acme Manufacturing Corp',
  industry: 'Manufacturing',
  location: 'New York, USA',
  status: 'active',
  revenue: 125,
  ebitda: 28,
  revenueGrowth: 12.5,
  ebitdaMargin: 22.4,
  description: 'Leading manufacturer of industrial components with strong market position.',
}

export default function DealDetailPage() {
  const [activeTab, setActiveTab] = useState('overview')

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Eye },
    { id: 'financials', label: 'Financials & Valuation', icon: DollarSign },
    { id: 'comparables', label: 'Comparables', icon: BarChart3 },
    { id: 'market', label: 'Market Analysis', icon: TrendingUp },
    { id: 'risks', label: 'Risk Dashboard', icon: AlertCircle },
    { id: 'diligence', label: 'Diligence', icon: CheckCircle2 },
  ]

  return (
    <>
      <DashboardHeader
        breadcrumbs={[
          { label: 'Forward OS', href: '/' },
          { label: 'Deal Discovery', href: '/deals' },
          { label: deal.name },
        ]}
        title={deal.name}
        subtitle={`${deal.industry} • ${deal.location} • ${deal.status.toUpperCase()}`}
        userProfile={{ name: 'Investor', email: 'investor@forward.ae', role: 'Buyer' }}
      />

      <motion.div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tab Navigation */}
        <motion.div className="border-b mb-8" style={{ borderColor: COLOR_BORDER }}>
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map(tab => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="px-6 py-3 border-b-2 font-semibold text-sm whitespace-nowrap flex items-center gap-2"
                  style={{
                    borderColor: isActive ? COLOR_ACCENT : 'transparent',
                    color: isActive ? COLOR_ACCENT : COLOR_TEXT_SECONDARY,
                  }}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </motion.button>
              )
            })}
          </div>
        </motion.div>

        {/* TAB CONTENT */}
        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <motion.div className="p-8 rounded-lg border" style={{ borderColor: COLOR_BORDER, background: 'white' }}>
              <h2 className="text-2xl font-black mb-4" style={{ color: COLOR_PRIMARY }}>Investment Thesis</h2>
              <p style={{ color: COLOR_TEXT_SECONDARY }}>{deal.description}</p>
            </motion.div>
          </motion.div>
        )}

        {activeTab === 'financials' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <motion.div className="p-8 rounded-lg border" style={{ borderColor: COLOR_BORDER, background: 'white' }}>
              <h2 className="text-2xl font-black mb-6" style={{ color: COLOR_PRIMARY }}>Financial Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { label: 'Revenue (LTM)', value: `$${deal.revenue}M`, detail: `+${deal.revenueGrowth}% YoY` },
                  { label: 'EBITDA (LTM)', value: `$${deal.ebitda}M`, detail: `${deal.ebitdaMargin}% margin` },
                  { label: 'Gross Margin', value: '42.1%', detail: 'Strong and stable' },
                  { label: 'Debt/EBITDA', value: '2.1x', detail: 'Moderate leverage' },
                ].map((item, idx) => (
                  <div key={idx} className="p-4 rounded-lg border" style={{ borderColor: COLOR_BORDER, background: '#FFFFFF' }}>
                    <p className="text-sm font-semibold mb-2" style={{ color: COLOR_TEXT_SECONDARY }}>{item.label}</p>
                    <p className="text-2xl font-black mb-2" style={{ color: COLOR_ACCENT }}>{item.value}</p>
                    <p className="text-xs font-semibold" style={{ color: COLOR_PRIMARY }}>{item.detail}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}

        {activeTab === 'comparables' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <motion.div className="p-8 rounded-lg border-2" style={{ borderColor: COLOR_ACCENT, background: `${COLOR_ACCENT}08` }}>
              <h2 className="text-2xl font-black mb-4" style={{ color: COLOR_PRIMARY }}>Similar Deals</h2>
              <p style={{ color: COLOR_TEXT_SECONDARY }}>Acme at 8.2x EBITDA aligns with market comparable companies trading at 8.0x-8.5x.</p>
            </motion.div>
          </motion.div>
        )}

        {activeTab === 'market' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <motion.div className="p-8 rounded-lg border" style={{ borderColor: COLOR_BORDER, background: 'white' }}>
              <h2 className="text-2xl font-black mb-4" style={{ color: COLOR_PRIMARY }}>Market Analysis</h2>
              <div className="space-y-2">
                <div className="flex justify-between"><span style={{ color: COLOR_TEXT_SECONDARY }}>Market Size</span><span className="font-bold" style={{ color: COLOR_PRIMARY }}>$4,500M</span></div>
                <div className="flex justify-between"><span style={{ color: COLOR_TEXT_SECONDARY }}>Market Share</span><span className="font-bold" style={{ color: COLOR_ACCENT }}>2.8%</span></div>
                <div className="flex justify-between"><span style={{ color: COLOR_TEXT_SECONDARY }}>Market Growth</span><span className="font-bold" style={{ color: '#10B981' }}>4.2% CAGR</span></div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {activeTab === 'risks' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            {[
              { title: 'Market Risk', severity: 'MEDIUM', desc: 'Cyclical industry sensitivity' },
              { title: 'Customer Risk', severity: 'LOW', desc: 'Top 3 customers = 35% revenue' },
              { title: 'Supply Chain', severity: 'MEDIUM', desc: 'Asia supplier concentration' },
              { title: 'Technology', severity: 'LOW', desc: 'Moderate capex requirements' },
            ].map((risk, idx) => (
              <motion.div key={idx} className="p-6 rounded-lg border" style={{ borderColor: COLOR_BORDER, background: 'white' }}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold" style={{ color: COLOR_PRIMARY }}>{risk.title}</h3>
                    <p className="text-sm mt-1" style={{ color: COLOR_TEXT_SECONDARY }}>{risk.desc}</p>
                  </div>
                  <span className="px-3 py-1 rounded text-xs font-bold text-white" style={{ background: risk.severity === 'HIGH' ? '#EF4444' : risk.severity === 'MEDIUM' ? '#F59E0B' : '#10B981' }}>
                    {risk.severity}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {activeTab === 'diligence' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            {[
              { category: 'Financial', items: ['3-year audited financials', 'Tax returns', 'Banking relationships', 'Working capital'] },
              { category: 'Legal', items: ['Corporate structure', 'Material contracts', 'Litigation', 'Compliance'] },
              { category: 'Commercial', items: ['Customer analysis', 'Suppliers', 'Pricing', 'Market trends'] },
              { category: 'Operational', items: ['Management team', 'Systems', 'Capacity', 'Supply chain'] },
            ].map((section, idx) => (
              <motion.div key={idx} className="p-6 rounded-lg border" style={{ borderColor: COLOR_BORDER, background: 'white' }}>
                <h3 className="font-bold text-lg mb-3" style={{ color: COLOR_PRIMARY }}>{section.category}</h3>
                <ul className="space-y-2">
                  {section.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                      <CheckCircle2 className="w-4 h-4" style={{ color: '#10B981' }} /> {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </>
  )
}

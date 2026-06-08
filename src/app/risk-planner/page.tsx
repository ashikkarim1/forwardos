'use client'

import { motion } from 'framer-motion'
import { AlertTriangle, Shield, TrendingDown, Zap, Target, CheckCircle2 } from 'lucide-react'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER } from '@/styles/forward-colors'

const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }

interface Risk { id: string; title: string; probability: number; impact: string; mitigation: string; owner: string }

const risks: Risk[] = [
  {
    id: '1',
    title: 'Customer Churn Acceleration',
    probability: 65,
    impact: 'AED 500K+ revenue loss',
    mitigation: 'Customer retention plan + key account management',
    owner: 'Seller',
  },
  {
    id: '2',
    title: 'Key Employee Departure',
    probability: 25,
    impact: 'Product development delay',
    mitigation: 'Retention bonuses + equity roll-forward',
    owner: 'Both',
  },
  {
    id: '3',
    title: 'Financing Contingency Not Met',
    probability: 15,
    impact: 'Deal termination',
    mitigation: 'Require commitment letter by LOI',
    owner: 'Buyer',
  },
  {
    id: '4',
    title: 'Regulatory Changes (UAE)',
    probability: 10,
    impact: 'Business model adjustment',
    mitigation: 'Monitor regulatory updates, escrow clause',
    owner: 'Both',
  },
]

export default function RiskPlannerPage() {
  return (
    <motion.div className="max-w-7xl mx-auto px-8 py-8" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
      <motion.div variants={itemVariants} className="mb-12">
        <h1 className="text-4xl font-black mb-3" style={{ color: COLOR_PRIMARY }}>
          Risk & Contingency Planning
        </h1>
        <p className="text-lg" style={{ color: COLOR_TEXT_SECONDARY }}>
          Identify risks and prepare mitigation strategies to protect deal value.
        </p>
      </motion.div>

      {/* Risk Heat Map */}
      <motion.div className="mb-12 p-8 rounded-lg border-2" style={{ borderColor: COLOR_BORDER, background: 'white' }} variants={itemVariants}>
        <h3 className="text-xl font-bold mb-6" style={{ color: COLOR_PRIMARY }}>
          Risk Heat Map
        </h3>
        <div className="grid grid-cols-3 gap-2 p-6 rounded-lg" style={{ background: '#FAFAF8' }}>
          {[
            { label: 'Low', color: '#10B981', count: 2 },
            { label: 'Medium', color: COLOR_ACCENT, count: 1 },
            { label: 'High', color: '#F59E0B', count: 1 },
          ].map((risk) => (
            <div key={risk.label} className="text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto text-white font-bold" style={{ background: risk.color }}>
                {risk.count}
              </div>
              <p className="text-sm font-bold mt-2" style={{ color: COLOR_PRIMARY }}>
                {risk.label} Risk
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Risk List */}
      <motion.div className="space-y-4" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
        {risks.map((risk) => {
          const severityColor = risk.probability >= 60 ? '#F59E0B' : risk.probability >= 30 ? COLOR_ACCENT : '#10B981'
          return (
            <motion.div key={risk.id} className="p-6 rounded-lg border-2" style={{ borderColor: COLOR_BORDER, background: 'white' }} variants={itemVariants}>
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg" style={{ background: severityColor + '20' }}>
                  <AlertTriangle className="w-6 h-6" style={{ color: severityColor }} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-lg mb-2" style={{ color: COLOR_PRIMARY }}>
                    {risk.title}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                    <div>
                      <p className="text-xs font-bold mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>Probability</p>
                      <div className="h-2 rounded-full" style={{ background: COLOR_BORDER }}>
                        <div className="h-2 rounded-full" style={{ background: severityColor, width: `${risk.probability}%` }} />
                      </div>
                      <p className="text-sm font-bold mt-1" style={{ color: severityColor }}>{risk.probability}%</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>Impact</p>
                      <p className="text-sm font-bold" style={{ color: COLOR_PRIMARY }}>{risk.impact}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>Owner</p>
                      <p className="text-sm font-bold" style={{ color: COLOR_PRIMARY }}>{risk.owner}</p>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg" style={{ background: COLOR_ACCENT + '10' }}>
                    <p className="text-xs font-bold mb-1" style={{ color: COLOR_ACCENT }}>Mitigation</p>
                    <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>{risk.mitigation}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Contingency Plans */}
      <motion.div className="mt-12 p-8 rounded-lg border-2" style={{ borderColor: COLOR_BORDER, background: COLOR_ACCENT + '08' }} variants={itemVariants}>
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ color: COLOR_PRIMARY }}>
          <Shield className="w-6 h-6" />
          Contingency Plans
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { scenario: 'Customer Loses Major Account', plan: 'Activate retention bonuses, renegotiate LOI price' },
            { scenario: 'Key Team Member Leaves', plan: 'Accelerate close, increase retention packages' },
            { scenario: 'Buyer Financing Falls Through', plan: 'Activate backup buyers, extend timeline' },
            { scenario: 'Regulatory Change', plan: 'Escrow portion, renegotiate terms' },
          ].map((c, idx) => (
            <div key={idx} className="p-4 rounded-lg" style={{ background: 'white' }}>
              <p className="font-bold mb-2" style={{ color: COLOR_PRIMARY }}>{c.scenario}</p>
              <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>{c.plan}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

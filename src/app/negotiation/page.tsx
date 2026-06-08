'use client'

import { motion } from 'framer-motion'
import { BookOpen, Target, Zap, Users, CheckCircle2, AlertCircle, TrendingUp } from 'lucide-react'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER } from '@/styles/forward-colors'

const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }

export default function NegotiationPage() {
  return (
    <motion.div className="max-w-7xl mx-auto px-8 py-8" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
      <motion.div variants={itemVariants} className="mb-12">
        <h1 className="text-4xl font-black mb-3" style={{ color: COLOR_PRIMARY }}>
          Negotiation Playbook
        </h1>
        <p className="text-lg" style={{ color: COLOR_TEXT_SECONDARY }}>
          Best practices and strategies for each deal stage. Learn from expert negotiators.
        </p>
      </motion.div>

      {/* Strategic Framework */}
      <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
        {[
          {
            title: 'Know Your Walk-Away Price',
            tips: ['AED 12M floor (conservative)', 'AED 13M likely (base case)', 'AED 15M upside (if competing buyers)'],
            icon: Target,
          },
          {
            title: 'Understand Buyer Motivations',
            tips: ['Strategic: Seeking synergies (+15% premium)', 'PE: Looking for arbitrage (5-7% discount)', 'Family: Long-term value (+20% premium)'],
            icon: Users,
          },
          {
            title: 'Control Information Flow',
            tips: ['Phase documents strategically', 'Reveal strengths gradually', 'Address weaknesses proactively'],
            icon: BookOpen,
          },
        ].map((strategy, idx) => {
          const Icon = strategy.icon
          return (
            <motion.div key={idx} className="p-6 rounded-lg border-2" style={{ borderColor: COLOR_BORDER, background: 'white' }} variants={itemVariants}>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-lg" style={{ background: COLOR_ACCENT + '20' }}>
                  <Icon className="w-6 h-6" style={{ color: COLOR_ACCENT }} />
                </div>
                <h3 className="font-bold text-lg" style={{ color: COLOR_PRIMARY }}>
                  {strategy.title}
                </h3>
              </div>
              <ul className="space-y-2">
                {strategy.tips.map((tip, i) => (
                  <li key={i} className="text-sm flex items-start gap-2" style={{ color: COLOR_TEXT_SECONDARY }}>
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: COLOR_ACCENT }} />
                    {tip}
                  </li>
                ))}
              </ul>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Deal Stage Playbook */}
      <motion.div className="space-y-6 mb-12" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
        {[
          {
            stage: 'Qualified Buyer Phase',
            objective: 'Build trust and demonstrate capability',
            dos: ['Respond within 2 hours', 'Answer ALL questions', 'Show strong financials', 'Share impressive metrics'],
            donts: ['Delay responses', 'Be evasive', 'Oversell the business', 'Share sensitive data early'],
          },
          {
            stage: 'LOI Negotiation',
            objective: 'Lock in favorable terms',
            dos: ['Counter every unreasonable ask', 'Get competing offers before responding', 'Include walk-away items', 'Use silence as leverage'],
            donts: ['Accept first offer', 'Negotiate alone', 'Be too agreeable', 'Discuss price before terms'],
          },
          {
            stage: 'Due Diligence',
            objective: 'Manage information and timeline',
            dos: ['Control document flow', 'Schedule buyer meetings strategically', 'Address issues early', 'Keep momentum'],
            donts: ['Dump all data at once', 'Hide problems', 'Over-communicate', 'Let deal stall'],
          },
          {
            stage: 'Final Negotiation',
            objective: 'Maximize value while closing',
            dos: ['Focus on last-minute asks', 'Use earnouts strategically', 'Lock down reps & warranties', 'Prepare for post-close'],
            donts: ['Renegotiate old terms', 'Accept new contingencies', 'Give without getting', 'Rush closing'],
          },
        ].map((playbook, idx) => (
          <motion.div key={idx} className="p-6 rounded-lg border-2" style={{ borderColor: COLOR_BORDER, background: 'white' }} variants={itemVariants}>
            <h3 className="text-xl font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
              Stage {idx + 1}: {playbook.stage}
            </h3>
            <p className="text-sm mb-4" style={{ color: COLOR_TEXT_SECONDARY }}>
              <strong>Objective:</strong> {playbook.objective}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="font-bold mb-2 text-green-600">✓ DO:</p>
                <ul className="space-y-1 text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                  {playbook.dos.map((d, i) => <li key={i}>• {d}</li>)}
                </ul>
              </div>
              <div>
                <p className="font-bold mb-2 text-red-600">✗ DON'T:</p>
                <ul className="space-y-1 text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                  {playbook.donts.map((d, i) => <li key={i}>• {d}</li>)}
                </ul>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Current Negotiation Positions */}
      <motion.div className="p-8 rounded-lg border-2" style={{ borderColor: COLOR_BORDER, background: COLOR_ACCENT + '08' }} variants={itemVariants}>
        <h3 className="text-xl font-bold mb-6" style={{ color: COLOR_PRIMARY }}>
          Current Buyer Positions (Ahmed - Strategic Buyer)
        </h3>
        <div className="space-y-4">
          {[
            { item: 'Proposed Price', seller: 'AED 14-15M', buyer: 'AED 12-13M', recommendation: 'Counter at AED 13.5M' },
            { item: 'Earnout', seller: '0%', buyer: '15% of growth above AED 6M', recommendation: 'Cap earnout at 10%, 2-year period' },
            { item: 'Retention', seller: '3-month', buyer: '12-month + bonus pool', recommendation: 'Agree to 6-month, negotiate bonus terms' },
          ].map((negotiation, idx) => (
            <div key={idx} className="p-4 rounded-lg" style={{ background: 'white' }}>
              <div className="grid grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="font-bold" style={{ color: COLOR_PRIMARY }}>{negotiation.item}</p>
                </div>
                <div>
                  <p className="text-xs font-bold mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>Your Ask</p>
                  <p style={{ color: COLOR_PRIMARY }}>{negotiation.seller}</p>
                </div>
                <div>
                  <p className="text-xs font-bold mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>Their Offer</p>
                  <p style={{ color: COLOR_PRIMARY }}>{negotiation.buyer}</p>
                </div>
                <div>
                  <p className="text-xs font-bold mb-1" style={{ color: COLOR_ACCENT }}>Our Recommendation</p>
                  <p style={{ color: COLOR_PRIMARY }}>{negotiation.recommendation}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

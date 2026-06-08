'use client'

import { motion } from 'framer-motion'
import { BarChart3, TrendingUp, Clock, Users, DollarSign, AlertCircle, CheckCircle2 } from 'lucide-react'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER } from '@/styles/forward-colors'

const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }

export default function DealProgressPage() {
  return (
    <motion.div className="max-w-7xl mx-auto px-8 py-8" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
      <motion.div variants={itemVariants} className="mb-12">
        <h1 className="text-4xl font-black mb-3" style={{ color: COLOR_PRIMARY }}>
          Deal Progress Dashboard
        </h1>
        <p className="text-lg" style={{ color: COLOR_TEXT_SECONDARY }}>
          Real-time overview of all deal metrics, buyer engagement, and critical path items.
        </p>
      </motion.div>

      {/* Key Metrics */}
      <motion.div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
        {[
          { label: 'Total Value at Risk', value: 'AED 47M', icon: DollarSign, color: COLOR_ACCENT },
          { label: 'Avg Close Timeline', value: '4 weeks', icon: Clock, color: '#3B82F6' },
          { label: 'Total Buyers', value: '6 serious', icon: Users, color: '#10B981' },
          { label: 'Documents Complete', value: '88%', icon: CheckCircle2, color: '#14B8A6' },
        ].map((metric) => {
          const Icon = metric.icon
          return (
            <motion.div key={metric.label} className="p-6 rounded-lg border-2" style={{ borderColor: COLOR_BORDER, background: 'white' }} variants={itemVariants}>
              <div className="flex items-center gap-3 mb-3">
                <Icon className="w-6 h-6" style={{ color: metric.color }} />
                <p className="text-sm font-bold" style={{ color: COLOR_TEXT_SECONDARY }}>
                  {metric.label}
                </p>
              </div>
              <p className="text-2xl font-black" style={{ color: COLOR_PRIMARY }}>
                {metric.value}
              </p>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Deal Status Summary */}
      <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
        {/* Active Deals */}
        <motion.div className="p-8 rounded-lg border-2" style={{ borderColor: COLOR_BORDER, background: 'white' }} variants={itemVariants}>
          <h3 className="text-xl font-bold mb-6" style={{ color: COLOR_PRIMARY }}>
            Active Deals by Status
          </h3>
          {[
            { status: 'Negotiating', count: 2, color: '#10B981' },
            { status: 'Qualified', count: 2, color: COLOR_ACCENT },
            { status: 'Due Diligence', count: 1, color: '#3B82F6' },
            { status: 'LOI Signed', count: 1, color: '#14B8A6' },
          ].map((deal) => (
            <div key={deal.status} className="flex items-center justify-between mb-4">
              <span style={{ color: COLOR_PRIMARY }}>{deal.status}</span>
              <div className="flex items-center gap-3">
                <div className="h-2 w-24 rounded-full" style={{ background: COLOR_BORDER }}>
                  <div className="h-2 rounded-full" style={{ background: deal.color, width: `${deal.count * 25}%` }} />
                </div>
                <span className="font-bold" style={{ color: COLOR_PRIMARY }}>{deal.count}</span>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Timeline */}
        <motion.div className="p-8 rounded-lg border-2" style={{ borderColor: COLOR_BORDER, background: 'white' }} variants={itemVariants}>
          <h3 className="text-xl font-bold mb-6" style={{ color: COLOR_PRIMARY }}>
            Expected Close Timeline
          </h3>
          {[
            { window: '1-2 weeks', deals: 'Ahmed (LOI signed)', color: '#10B981' },
            { window: '2-3 weeks', deals: 'Fatima, Sarah', color: COLOR_ACCENT },
            { window: '3-4 weeks', deals: 'Michael', color: '#F59E0B' },
            { window: '5+ weeks', deals: 'John', color: '#EF4444' },
          ].map((timeline) => (
            <div key={timeline.window} className="flex items-center justify-between mb-4">
              <div>
                <p className="font-bold" style={{ color: COLOR_PRIMARY }}>{timeline.window}</p>
                <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>{timeline.deals}</p>
              </div>
              <div className="w-3 h-3 rounded-full" style={{ background: timeline.color }} />
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Critical Path */}
      <motion.div className="p-8 rounded-lg border-2 mb-12" style={{ borderColor: COLOR_BORDER, background: COLOR_ACCENT + '08' }} variants={itemVariants}>
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ color: COLOR_PRIMARY }}>
          <AlertCircle className="w-6 h-6" />
          Critical Path Items (Next 7 Days)
        </h3>
        <div className="space-y-3">
          {[
            { task: 'Ahmed: Final LOI review', dueDate: 'Tomorrow', priority: 'HIGH' },
            { task: 'Fatima: Management call #2', dueDate: '2024-06-09', priority: 'HIGH' },
            { task: 'Submit IP documentation', dueDate: '2024-06-12', priority: 'MEDIUM' },
            { task: 'Sarah: Send revised proposal', dueDate: '2024-06-13', priority: 'MEDIUM' },
          ].map((item, idx) => (
            <div key={idx} className="p-4 rounded-lg" style={{ background: 'white' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold" style={{ color: COLOR_PRIMARY }}>{item.task}</p>
                  <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>Due: {item.dueDate}</p>
                </div>
                <span className="px-2 py-1 text-xs font-bold rounded-full" style={{ background: item.priority === 'HIGH' ? '#EF4444' : COLOR_ACCENT, color: 'white' }}>
                  {item.priority}
                </span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Buyer Engagement Score */}
      <motion.div className="p-8 rounded-lg border-2" style={{ borderColor: COLOR_BORDER, background: 'white' }} variants={itemVariants}>
        <h3 className="text-xl font-bold mb-6" style={{ color: COLOR_PRIMARY }}>
          Buyer Engagement Scores
        </h3>
        <div className="space-y-4">
          {[
            { buyer: 'Ahmed Al Mansouri', score: 92, momentum: 'Up 8%' },
            { buyer: 'Fatima Al Maktoum', score: 88, momentum: 'Up 5%' },
            { buyer: 'Sarah Khan', score: 75, momentum: 'Flat' },
            { buyer: 'Michael Chen', score: 62, momentum: 'Down 3%' },
            { buyer: 'Global Tech Fund', score: 55, momentum: 'Down 8%' },
            { buyer: 'John Smith', score: 28, momentum: 'Down 15%' },
          ].map((buyer) => (
            <div key={buyer.buyer}>
              <div className="flex items-center justify-between mb-2">
                <p className="font-bold" style={{ color: COLOR_PRIMARY }}>{buyer.buyer}</p>
                <p className="text-sm font-bold" style={{ color: COLOR_ACCENT }}>{buyer.score}/100</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-3 rounded-full" style={{ background: COLOR_BORDER }}>
                  <div className="h-3 rounded-full" style={{ background: buyer.score >= 80 ? '#10B981' : buyer.score >= 60 ? COLOR_ACCENT : '#F59E0B', width: `${buyer.score}%` }} />
                </div>
                <p className="text-xs font-bold" style={{ color: buyer.momentum.includes('Up') ? '#10B981' : buyer.momentum.includes('Down') ? '#EF4444' : COLOR_TEXT_SECONDARY }}>
                  {buyer.momentum}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

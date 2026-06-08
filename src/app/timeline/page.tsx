'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, CheckCircle2, Clock, AlertCircle, TrendingUp, ChevronRight } from 'lucide-react'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER } from '@/styles/forward-colors'

const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }

interface Milestone {
  id: string
  title: string
  dueDate: string
  status: 'completed' | 'in-progress' | 'at-risk' | 'pending'
  owner: string
  progress: number
  description: string
  notes: string
}

const milestones: Milestone[] = [
  {
    id: '1',
    title: 'Initial Buyer Qualification',
    dueDate: '2024-05-15',
    status: 'completed',
    owner: 'Seller',
    progress: 100,
    description: 'Submit business overview to qualified buyers',
    notes: '5 buyers qualified, 3 high interest',
  },
  {
    id: '2',
    title: 'Data Room Setup',
    dueDate: '2024-05-25',
    status: 'completed',
    owner: 'Seller',
    progress: 100,
    description: 'Upload financial statements and docs',
    notes: 'All Phase 1 documents complete',
  },
  {
    id: '3',
    title: 'Management Presentations',
    dueDate: '2024-06-05',
    status: 'in-progress',
    owner: 'Seller',
    progress: 60,
    description: 'Host buyer meetings with management',
    notes: '2 of 3 scheduled, 1 completed',
  },
  {
    id: '4',
    title: 'LOI Negotiations',
    dueDate: '2024-06-15',
    status: 'in-progress',
    owner: 'Both',
    progress: 40,
    description: 'Exchange and negotiate LOI terms',
    notes: 'Ahmed on track, Sarah delayed 3 days',
  },
  {
    id: '5',
    title: 'Full Due Diligence',
    dueDate: '2024-06-25',
    status: 'at-risk',
    owner: 'Buyer',
    progress: 20,
    description: 'Buyer completes comprehensive DD',
    notes: 'Risk: Fatima requesting extended timeline',
  },
  {
    id: '6',
    title: 'Final Negotiation',
    dueDate: '2024-07-05',
    status: 'pending',
    owner: 'Both',
    progress: 0,
    description: 'Close final deal terms',
    notes: 'Awaiting LOI signature',
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed': return '#10B981'
    case 'in-progress': return COLOR_ACCENT
    case 'at-risk': return '#F59E0B'
    case 'pending': return '#6B7280'
    default: return COLOR_TEXT_SECONDARY
  }
}

export default function TimelinePage() {
  return (
    <motion.div className="max-w-7xl mx-auto px-8 py-8" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
      <motion.div variants={itemVariants} className="mb-12">
        <h1 className="text-4xl font-black mb-3" style={{ color: COLOR_PRIMARY }}>
          Deal Timeline & Milestones
        </h1>
        <p className="text-lg" style={{ color: COLOR_TEXT_SECONDARY }}>
          Track transaction progress across 6 key milestones. Expected close: July 5, 2024.
        </p>
      </motion.div>

      {/* Timeline Progress */}
      <motion.div className="mb-12 p-8 rounded-lg border-2" style={{ borderColor: COLOR_BORDER, background: 'white' }} variants={itemVariants}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold" style={{ color: COLOR_PRIMARY }}>
            Overall Progress
          </h3>
          <span className="text-2xl font-black" style={{ color: COLOR_ACCENT }}>
            37%
          </span>
        </div>
        <div className="h-4 rounded-full" style={{ background: COLOR_BORDER }}>
          <motion.div className="h-4 rounded-full" style={{ background: COLOR_ACCENT }} initial={{ width: 0 }} animate={{ width: '37%' }} transition={{ duration: 1 }} />
        </div>
        <p className="text-sm mt-4" style={{ color: COLOR_TEXT_SECONDARY }}>
          3 of 6 milestones completed. 1 at risk. Expected close: 27 days.
        </p>
      </motion.div>

      {/* Milestones */}
      <motion.div className="space-y-4" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
        {milestones.map((m, idx) => (
          <motion.div key={m.id} className="p-6 rounded-lg border-2" style={{ borderColor: COLOR_BORDER, background: 'white' }} variants={itemVariants}>
            <div className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold" style={{ background: getStatusColor(m.status) }}>
                  {m.status === 'completed' ? <CheckCircle2 className="w-6 h-6" /> : idx + 1}
                </div>
                {idx < milestones.length - 1 && (
                  <div className="w-1 h-12 mt-2" style={{ background: getStatusColor(m.status) }} />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-bold text-lg" style={{ color: COLOR_PRIMARY }}>
                      {m.title}
                    </h4>
                    <p className="text-sm mt-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                      {m.description}
                    </p>
                  </div>
                  <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ background: getStatusColor(m.status) + '20', color: getStatusColor(m.status) }}>
                    {m.status === 'completed' && '✓ Complete'}
                    {m.status === 'in-progress' && '🔄 In Progress'}
                    {m.status === 'at-risk' && '⚠️ At Risk'}
                    {m.status === 'pending' && '⏳ Pending'}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-3 pt-3 border-t" style={{ borderColor: COLOR_BORDER }}>
                  <div>
                    <p className="text-xs font-bold mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>Due Date</p>
                    <p className="text-sm font-bold" style={{ color: COLOR_PRIMARY }}>{m.dueDate}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>Owner</p>
                    <p className="text-sm font-bold" style={{ color: COLOR_PRIMARY }}>{m.owner}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>Progress</p>
                    <div className="h-2 rounded-full" style={{ background: COLOR_BORDER }}>
                      <div className="h-2 rounded-full" style={{ background: getStatusColor(m.status), width: `${m.progress}%` }} />
                    </div>
                  </div>
                </div>

                {m.notes && (
                  <p className="text-sm mt-3 p-2 rounded" style={{ background: getStatusColor(m.status) + '10', color: COLOR_TEXT_SECONDARY }}>
                    {m.notes}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Risk Assessment */}
      <motion.div className="mt-12 p-8 rounded-lg border-2" style={{ borderColor: '#F59E0B', background: '#FFFBEB' }} variants={itemVariants}>
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: '#F59E0B' }}>
          <AlertCircle className="w-6 h-6" />
          At-Risk Items
        </h3>
        <div className="space-y-3">
          <div className="p-4 rounded-lg" style={{ background: 'white' }}>
            <p className="font-bold mb-1" style={{ color: COLOR_PRIMARY }}>Full Due Diligence Timeline</p>
            <p className="text-sm mb-2" style={{ color: COLOR_TEXT_SECONDARY }}>Fatima requesting 10-day extension due to team capacity</p>
            <p className="text-xs font-bold" style={{ color: '#F59E0B' }}>Action: Agree to extension, negotiate later close date</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

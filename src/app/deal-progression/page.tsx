'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, TrendingUp, Calendar, Users, Filter, Download } from 'lucide-react'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER } from '@/styles/forward-colors'
import { DealPipeline } from '@/components/DealPipeline'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

interface DealStats {
  totalDeals: number
  dealsInProgress: number
  closedDeals: number
  totalValue: number
  averageDealSize: number
  averageDaysToClose: number
}

interface StageMetrics {
  stage: string
  count: number
  avgDaysInStage: number
  conversionRate: number
}

export default function DealProgressionPage() {
  const [deals, setDeals] = useState<any[]>([])
  const [stats, setStats] = useState<DealStats | null>(null)
  const [stageMetrics, setStageMetrics] = useState<StageMetrics[]>([])
  const [loading, setLoading] = useState(true)
  const [filterBy, setFilterBy] = useState('all') // all, active, completed
  const [view, setView] = useState('kanban') // kanban, timeline, table

  useEffect(() => {
    const fetchPipeline = async () => {
      try {
        const response = await fetch(`/api/deals/pipeline?view=${view}`)
        const data = await response.json()

        let allDeals: any[] = []
        if (view === 'kanban') {
          // Flatten kanban data
          Object.values(data.kanban || {}).forEach((stageDeal: any) => {
            allDeals.push(...(Array.isArray(stageDeal) ? stageDeal : []))
          })
          setDeals(allDeals)
        } else {
          allDeals = data.timeline || data.deals || []
          setDeals(allDeals)
        }

        // Calculate stats
        const totalDeals = data.totalDeals || 0
        const closed = allDeals?.filter((d: any) => d.currentStage === 'CLOSED').length || 0
        const inProgress = totalDeals - closed
        const totalValue = allDeals?.reduce((sum: number, d: any) => sum + (d.valuation || 0), 0) || 0

        setStats({
          totalDeals,
          dealsInProgress: inProgress,
          closedDeals: closed,
          totalValue,
          averageDealSize: totalDeals > 0 ? totalValue / totalDeals : 0,
          averageDaysToClose: 45, // Placeholder
        })
      } catch (err) {
        console.error('Failed to fetch pipeline:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPipeline()
  }, [view])

  const handleStageDrop = async (dealId: string, newStage: string) => {
    try {
      const response = await fetch(`/api/deals/${dealId}/pipeline`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newStage }),
      })

      if (!response.ok) throw new Error('Failed to update stage')

      // Refresh pipeline
      window.location.reload()
    } catch (err) {
      console.error('Error:', err)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: COLOR_ACCENT }} />
      </div>
    )
  }

  return (
    <motion.div
      className="flex-1 overflow-auto bg-white p-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div className="mb-8" variants={itemVariants}>
        <h1 className="text-4xl font-black mb-2" style={{ color: COLOR_PRIMARY }}>
          Deal Progression Pipeline
        </h1>
        <p style={{ color: COLOR_TEXT_SECONDARY }}>
          Track your deals from initial interest through closing
        </p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8" variants={itemVariants}>
        {[
          {
            label: 'Total Deals',
            value: stats?.totalDeals || 0,
            icon: BarChart3,
            color: COLOR_ACCENT,
          },
          {
            label: 'In Progress',
            value: stats?.dealsInProgress || 0,
            icon: TrendingUp,
            color: '#FF9C3D',
          },
          {
            label: 'Closed',
            value: stats?.closedDeals || 0,
            icon: '✅',
            color: '#10B981',
          },
          {
            label: 'Pipeline Value',
            value: `AED ${((stats?.totalValue || 0) / 1000000).toFixed(1)}M`,
            icon: '💰',
            color: COLOR_ACCENT,
          },
          {
            label: 'Avg Deal Size',
            value: `AED ${((stats?.averageDealSize || 0) / 1000000).toFixed(1)}M`,
            icon: '📊',
            color: '#8B5CF6',
          },
          {
            label: 'Avg Days',
            value: `${stats?.averageDaysToClose || 45}`,
            icon: Calendar,
            color: '#3B82F6',
          },
        ].map((stat, idx) => (
          <div
            key={idx}
            className="p-4 rounded-lg border-2"
            style={{ borderColor: COLOR_BORDER, background: '#F7F6F4' }}
          >
            <div className="flex items-center justify-between mb-2">
              <span style={{ color: COLOR_TEXT_SECONDARY }} className="text-xs font-semibold">
                {stat.label}
              </span>
              {typeof stat.icon === 'string' ? (
                <span className="text-xl">{stat.icon}</span>
              ) : (
                <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
              )}
            </div>
            <div className="text-2xl font-black" style={{ color: COLOR_PRIMARY }}>
              {stat.value}
            </div>
          </div>
        ))}
      </motion.div>

      {/* View Controls */}
      <motion.div className="flex gap-3 mb-6" variants={itemVariants}>
        <div className="flex gap-2">
          {[
            { id: 'kanban', label: 'Kanban' },
            { id: 'timeline', label: 'Timeline' },
            { id: 'table', label: 'Table' },
          ].map((v) => (
            <button
              key={v.id}
              onClick={() => setView(v.id)}
              className="px-4 py-2 rounded-lg font-semibold transition-all"
              style={{
                background: view === v.id ? COLOR_ACCENT : 'white',
                color: view === v.id ? 'white' : COLOR_PRIMARY,
                border: `2px solid ${view === v.id ? COLOR_ACCENT : COLOR_BORDER}`,
              }}
            >
              {v.label}
            </button>
          ))}
        </div>

        <button
          className="ml-auto px-4 py-2 rounded-lg border-2 font-semibold flex items-center gap-2"
          style={{ borderColor: COLOR_BORDER, color: COLOR_PRIMARY }}
        >
          <Filter className="w-4 h-4" />
          Filter
        </button>

        <button
          className="px-4 py-2 rounded-lg font-semibold text-white flex items-center gap-2"
          style={{ background: COLOR_ACCENT }}
        >
          <Download className="w-4 h-4" />
          Export
        </button>
      </motion.div>

      {/* Pipeline Visualization */}
      <motion.div variants={itemVariants}>
        {view === 'kanban' && (
          <div className="bg-white rounded-lg p-4 border-2" style={{ borderColor: COLOR_BORDER }}>
            <DealPipeline
              deals={deals}
              onStageDrop={handleStageDrop}
              isEditable={true}
            />
          </div>
        )}

        {view === 'timeline' && (
          <div className="bg-white rounded-lg p-4 border-2" style={{ borderColor: COLOR_BORDER }}>
            <div className="space-y-4">
              {deals.map((deal) => (
                <div key={deal.dealId} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-bold" style={{ color: COLOR_PRIMARY }}>
                      {deal.title}
                    </h3>
                    <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-sm">
                      {deal.currentStage?.replace(/_/g, ' ')} • {deal.progressPercent}% complete
                    </p>
                  </div>
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        background: COLOR_ACCENT,
                        width: `${deal.progressPercent}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'table' && (
          <div className="bg-white rounded-lg overflow-hidden border-2" style={{ borderColor: COLOR_BORDER }}>
            <table className="w-full">
              <thead>
                <tr style={{ background: '#F7F6F4', borderBottom: `2px solid ${COLOR_BORDER}` }}>
                  <th className="text-left px-6 py-4 font-bold" style={{ color: COLOR_PRIMARY }}>
                    Deal Name
                  </th>
                  <th className="text-left px-6 py-4 font-bold" style={{ color: COLOR_PRIMARY }}>
                    Stage
                  </th>
                  <th className="text-left px-6 py-4 font-bold" style={{ color: COLOR_PRIMARY }}>
                    Progress
                  </th>
                  <th className="text-left px-6 py-4 font-bold" style={{ color: COLOR_PRIMARY }}>
                    Days in Stage
                  </th>
                  <th className="text-left px-6 py-4 font-bold" style={{ color: COLOR_PRIMARY }}>
                    Value
                  </th>
                </tr>
              </thead>
              <tbody>
                {deals.map((deal) => (
                  <tr
                    key={deal.dealId}
                    style={{ borderBottom: `1px solid ${COLOR_BORDER}` }}
                  >
                    <td className="px-6 py-4 font-semibold" style={{ color: COLOR_PRIMARY }}>
                      {deal.title}
                    </td>
                    <td className="px-6 py-4" style={{ color: COLOR_TEXT_SECONDARY }}>
                      {deal.currentStage?.replace(/_/g, ' ')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 rounded h-2">
                          <div
                            className="h-2 rounded"
                            style={{
                              background: COLOR_ACCENT,
                              width: `${deal.progressPercent}%`,
                            }}
                          />
                        </div>
                        <span style={{ color: COLOR_ACCENT }} className="font-semibold text-sm">
                          {deal.progressPercent}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4" style={{ color: COLOR_TEXT_SECONDARY }}>
                      {deal.daysInStage || 0} days
                    </td>
                    <td className="px-6 py-4 font-semibold" style={{ color: COLOR_PRIMARY }}>
                      AED {((deal.valuation || 0) / 1000000).toFixed(1)}M
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Legend */}
      <motion.div className="mt-8 p-4 rounded-lg" style={{ background: '#F7F6F4' }} variants={itemVariants}>
        <h3 className="font-bold mb-3" style={{ color: COLOR_PRIMARY }}>
          Pipeline Stages Explained
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 text-sm">
          {[
            { stage: 'Interest', desc: 'Initial interest from buyer' },
            { stage: 'Qualification', desc: 'Buyer verified & KYC complete' },
            { stage: 'Due Diligence', desc: 'Financial & operational review' },
            { stage: 'LOI', desc: 'Letter of Intent signed' },
            { stage: 'Offers', desc: 'Multiple offers received' },
            { stage: 'Negotiation', desc: 'Terms being negotiated' },
            { stage: 'Final Agreement', desc: 'Agreement reached' },
            { stage: 'Closing', desc: 'Final documentation' },
            { stage: 'Closed', desc: 'Deal completed' },
          ].map((item) => (
            <div key={item.stage}>
              <div className="font-semibold" style={{ color: COLOR_PRIMARY }}>
                {item.stage}
              </div>
              <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-xs">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

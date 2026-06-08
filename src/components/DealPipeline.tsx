'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, Plus, MoreVertical, TrendingUp, Calendar, DollarSign } from 'lucide-react'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER } from '@/styles/forward-colors'

const STAGES = [
  { id: 'INTEREST', label: 'Interest', icon: '👁️' },
  { id: 'QUALIFICATION', label: 'Qualification', icon: '✓' },
  { id: 'DUE_DILIGENCE', label: 'Due Diligence', icon: '📋' },
  { id: 'LOI', label: 'LOI', icon: '📝' },
  { id: 'OFFERS', label: 'Offers', icon: '💰' },
  { id: 'NEGOTIATION', label: 'Negotiation', icon: '🤝' },
  { id: 'FINAL_AGREEMENT', label: 'Final Agreement', icon: '✅' },
  { id: 'CLOSING', label: 'Closing', icon: '🏁' },
  { id: 'CLOSED', label: 'Closed', icon: '🎉' },
]

interface Deal {
  dealId: string
  title: string
  industry: string
  revenue: number
  valuation?: number
  currentStage?: string
  progressPercent: number
  stageStartedAt: Date
  daysInStage?: number
}

interface DealPipelineProps {
  deals: Deal[]
  onStageDrop?: (dealId: string, newStage: string) => Promise<void>
  onEditDeal?: (dealId: string) => void
  isEditable?: boolean
}

export function DealPipeline({
  deals,
  onStageDrop,
  onEditDeal,
  isEditable = true,
}: DealPipelineProps) {
  const [allDeals, setAllDeals] = useState<Deal[]>(deals)
  const [selectedDeal, setSelectedDeal] = useState<string | null>(null)

  useEffect(() => {
    setAllDeals(deals)
  }, [deals])

  const groupedByStage = STAGES.reduce((acc, stage) => {
    acc[stage.id] = allDeals.filter((d) => d.currentStage === stage.id)
    return acc
  }, {} as Record<string, Deal[]>)

  const handleMoveDeal = async (dealId: string, newStage: string) => {
    if (onStageDrop) {
      try {
        await onStageDrop(dealId, newStage)
        // Update local state
        setAllDeals((prev) =>
          prev.map((d) =>
            d.dealId === dealId ? { ...d, currentStage: newStage } : d
          )
        )
      } catch (err) {
        console.error('Failed to move deal:', err)
      }
    }
  }

  return (
    <div className="w-full overflow-x-auto pb-4">
      <div className="flex gap-4 min-w-full px-4">
        {STAGES.map((stage) => {
          const stageDealss = groupedByStage[stage.id] || []
          const totalValue = stageDealss.reduce((sum, d) => sum + (d.valuation || 0), 0)

          return (
            <motion.div
              key={stage.id}
              className="flex-shrink-0 w-80"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Stage Header */}
              <div
                className="p-4 rounded-lg mb-3 border-2"
                style={{
                  background: '#F7F6F4',
                  borderColor: COLOR_BORDER,
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{stage.icon}</span>
                    <div>
                      <div className="font-bold" style={{ color: COLOR_PRIMARY }}>
                        {stage.label}
                      </div>
                      <div className="text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>
                        {stageDealss.length} deal{stageDealss.length !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>
                  {isEditable && (
                    <button className="p-1 hover:bg-white rounded transition-all">
                      <Plus className="w-4 h-4" style={{ color: COLOR_ACCENT }} />
                    </button>
                  )}
                </div>

                {totalValue > 0 && (
                  <div className="text-xs font-semibold flex items-center gap-1" style={{ color: COLOR_ACCENT }}>
                    <DollarSign className="w-3 h-3" />
                    {(totalValue / 1000000).toFixed(1)}M
                  </div>
                )}
              </div>

              {/* Deal Cards */}
              <div className="space-y-3 min-h-96">
                <AnimatePresence>
                  {stageDealss.map((deal) => (
                    <motion.div
                      key={deal.dealId}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      onClick={() => setSelectedDeal(deal.dealId)}
                      className="p-3 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md"
                      style={{
                        background: 'white',
                        borderColor: selectedDeal === deal.dealId ? COLOR_ACCENT : COLOR_BORDER,
                        borderWidth: selectedDeal === deal.dealId ? 2 : 1,
                      }}
                    >
                      {/* Deal Title */}
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4
                            className="font-bold text-sm line-clamp-2"
                            style={{ color: COLOR_PRIMARY }}
                          >
                            {deal.title}
                          </h4>
                          <p className="text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>
                            {deal.industry}
                          </p>
                        </div>
                        {isEditable && (
                          <button className="p-1 hover:bg-gray-100 rounded">
                            <MoreVertical className="w-4 h-4" style={{ color: COLOR_TEXT_SECONDARY }} />
                          </button>
                        )}
                      </div>

                      {/* Metrics */}
                      <div className="space-y-1 mb-3 text-xs">
                        {deal.revenue > 0 && (
                          <div className="flex justify-between">
                            <span style={{ color: COLOR_TEXT_SECONDARY }}>Revenue:</span>
                            <span className="font-semibold" style={{ color: COLOR_PRIMARY }}>
                              AED {(deal.revenue / 1000000).toFixed(1)}M
                            </span>
                          </div>
                        )}
                        {deal.daysInStage && (
                          <div className="flex justify-between">
                            <span style={{ color: COLOR_TEXT_SECONDARY }}>In stage:</span>
                            <span className="font-semibold" style={{ color: COLOR_PRIMARY }}>
                              {deal.daysInStage} days
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div
                          className="h-2 rounded-full"
                          style={{ background: COLOR_ACCENT }}
                          initial={{ width: 0 }}
                          animate={{ width: `${deal.progressPercent}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>

                      {/* Stage Progress */}
                      <div className="text-xs mt-2 font-medium" style={{ color: COLOR_ACCENT }}>
                        {deal.progressPercent}% complete
                      </div>

                      {/* Action Buttons */}
                      {isEditable && (
                        <div className="flex gap-2 mt-3">
                          {STAGES.map((nextStage, idx) => {
                            const currentIdx = STAGES.findIndex((s) => s.id === stage.id)
                            const nextIdx = STAGES.findIndex((s) => s.id === nextStage.id)

                            if (nextIdx === currentIdx + 1) {
                              return (
                                <button
                                  key={nextStage.id}
                                  onClick={() => handleMoveDeal(deal.dealId, nextStage.id)}
                                  className="flex-1 py-1 px-2 rounded text-xs font-semibold flex items-center justify-center gap-1 transition-all hover:opacity-90"
                                  style={{
                                    background: COLOR_ACCENT,
                                    color: 'white',
                                  }}
                                >
                                  Move <ChevronRight className="w-3 h-3" />
                                </button>
                              )
                            }
                            return null
                          })}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>

                {stageDealss.length === 0 && (
                  <div
                    className="flex items-center justify-center h-32 rounded-lg border-2 border-dashed"
                    style={{ borderColor: COLOR_BORDER, color: COLOR_TEXT_SECONDARY }}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">📭</div>
                      <p className="text-sm">No deals yet</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

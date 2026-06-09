'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, Zap, ArrowRight, ChevronRight } from 'lucide-react'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER, COLOR_BG_PRIMARY } from '@/styles/forward-colors'

interface ListingCardProps {
  id: string
  title: string
  location: string
  country: string
  image: string
  askingPrice: number
  askingPriceCurrency: string
  annualRevenue: number
  cashFlowMin: number
  cashFlowMax: number
  ebitda: number
  profitMarginPercent: number
  dealQualityScore: number
  heatIndex: number
  roiProjection: number
  paybackPeriod: number
  growthRate: number
  status: 'NEW' | 'FEATURED' | 'STANDARD'
  category: string
  dealType: 'SALE' | 'LEASE' | 'QUICK_SALE'
  employeeCount?: number
  isSaved?: boolean
  onSave?: () => void
  onViewSimilar?: () => void
  onContact?: () => void
}

const DEAL_QUALITY_COLORS = {
  excellent: '#10B981',
  good: '#3B82F6',
  fair: '#F59E0B',
  poor: '#EF4444',
}

const getQualityColor = (score: number) => {
  if (score >= 80) return DEAL_QUALITY_COLORS.excellent
  if (score >= 60) return DEAL_QUALITY_COLORS.good
  if (score >= 40) return DEAL_QUALITY_COLORS.fair
  return DEAL_QUALITY_COLORS.poor
}

const getQualityLabel = (score: number) => {
  if (score >= 80) return 'Excellent'
  if (score >= 60) return 'Good'
  if (score >= 40) return 'Fair'
  return 'Monitor'
}

const formatCurrency = (value: number, currency: string = 'AED') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export default function ListingCard({
  id,
  title,
  location,
  country,
  image,
  askingPrice,
  askingPriceCurrency,
  annualRevenue,
  cashFlowMin,
  cashFlowMax,
  ebitda,
  profitMarginPercent,
  dealQualityScore,
  heatIndex,
  roiProjection,
  paybackPeriod,
  growthRate,
  status,
  category,
  dealType,
  employeeCount,
  isSaved = false,
  onSave,
  onViewSimilar,
  onContact,
}: ListingCardProps) {
  const [saved, setSaved] = useState(isSaved)

  const handleSave = () => {
    setSaved(!saved)
    onSave?.()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-lg border overflow-hidden hover:shadow-lg transition-shadow bg-white flex flex-col h-full"
      style={{ borderColor: COLOR_BORDER }}
    >
      {/* IMAGE + STATUS BADGES */}
      <div className="relative h-40 overflow-hidden bg-gray-200 flex-shrink-0">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover hover:scale-105 transition-transform"
        />

        {/* Status Badges - Top Left */}
        <div className="absolute top-2 left-2 flex gap-2 z-10">
          {status === 'NEW' && (
            <span
              className="px-2 py-1 rounded-full text-xs font-bold text-white"
              style={{ background: '#EF4444' }}
            >
              🆕 NEW
            </span>
          )}
          {status === 'FEATURED' && (
            <span
              className="px-2 py-1 rounded-full text-xs font-bold text-white"
              style={{ background: COLOR_ACCENT }}
            >
              ⭐ FEATURED
            </span>
          )}
        </div>

        {/* Heat Index - Top Right */}
        <div className="absolute top-2 right-2 z-10">
          <div
            className="px-2 py-1 rounded-lg text-xs font-bold text-white flex items-center gap-1"
            style={{ background: heatIndex > 70 ? '#DC2626' : '#F59E0B' }}
          >
            <Zap size={12} />
            {heatIndex}
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="absolute bottom-2 right-2 p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-all z-10"
        >
          <Heart
            size={16}
            className={saved ? 'fill-current' : ''}
            style={{ color: saved ? COLOR_ACCENT : COLOR_TEXT_SECONDARY }}
          />
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div className="p-3 space-y-3 flex flex-col flex-grow">
        {/* Title + Location */}
        <div>
          <h3
            className="font-black text-sm mb-0.5 line-clamp-2"
            style={{ color: COLOR_PRIMARY }}
          >
            {title}
          </h3>
          <p className="text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>
            📍 {location}, {country}
          </p>
        </div>

        {/* DEAL TYPE + CATEGORY BADGES */}
        <div className="flex gap-1 flex-wrap">
          <span
            className="px-2 py-0.5 rounded-full text-xs font-semibold text-white"
            style={{ background: COLOR_PRIMARY }}
          >
            {category}
          </span>
          <span
            className="px-2 py-0.5 rounded-full text-xs font-semibold text-white"
            style={{
              background:
                dealType === 'LEASE'
                  ? '#06B6D4'
                  : dealType === 'QUICK_SALE'
                    ? '#DC2626'
                    : '#10B981',
            }}
          >
            {dealType === 'LEASE' ? '🏢 LEASE' : dealType === 'QUICK_SALE' ? '⚡ QUICK' : '💼 SALE'}
          </span>
        </div>

        {/* FINANCIAL METRICS - 3x3 GRID - COMPACT */}
        <div className="grid grid-cols-3 gap-2 py-2 px-2 rounded-lg text-xs flex-grow" style={{ background: COLOR_BG_PRIMARY }}>
          {/* Row 1 */}
          <div>
            <p className="font-semibold mb-0.5 leading-tight" style={{ color: COLOR_TEXT_SECONDARY }}>
              Asking
            </p>
            <p className="font-black text-xs" style={{ color: COLOR_ACCENT }}>
              {formatCurrency(askingPrice / 1000, askingPriceCurrency)}K
            </p>
          </div>

          <div>
            <p className="font-semibold mb-0.5 leading-tight" style={{ color: COLOR_TEXT_SECONDARY }}>
              Revenue
            </p>
            <p className="font-black text-xs" style={{ color: COLOR_PRIMARY }}>
              {formatCurrency(annualRevenue / 1000, askingPriceCurrency)}K
            </p>
          </div>

          <div>
            <p className="font-semibold mb-0.5 leading-tight" style={{ color: COLOR_TEXT_SECONDARY }}>
              Cash Flow
            </p>
            <p className="font-black text-xs" style={{ color: COLOR_PRIMARY }}>
              {formatCurrency(cashFlowMin / 1000, askingPriceCurrency)}K
            </p>
          </div>

          {/* Row 2 */}
          <div>
            <p className="font-semibold mb-0.5 leading-tight" style={{ color: COLOR_TEXT_SECONDARY }}>
              EBITDA
            </p>
            <p className="font-black text-xs" style={{ color: '#10B981' }}>
              {formatCurrency(ebitda / 1000, askingPriceCurrency)}K
            </p>
          </div>

          <div>
            <p className="font-semibold mb-0.5 leading-tight" style={{ color: COLOR_TEXT_SECONDARY }}>
              Margin
            </p>
            <p className="font-black text-xs" style={{ color: '#3B82F6' }}>
              {profitMarginPercent}%
            </p>
          </div>

          <div>
            <p className="font-semibold mb-0.5 leading-tight" style={{ color: COLOR_TEXT_SECONDARY }}>
              Growth
            </p>
            <p className="font-black text-xs" style={{ color: '#10B981' }}>
              ↗ {growthRate}%
            </p>
          </div>

          {/* Row 3 */}
          <div>
            <p className="font-semibold mb-0.5 leading-tight" style={{ color: COLOR_TEXT_SECONDARY }}>
              ROI
            </p>
            <p className="font-black text-xs" style={{ color: '#F59E0B' }}>
              {roiProjection}%
            </p>
          </div>

          <div>
            <p className="font-semibold mb-0.5 leading-tight" style={{ color: COLOR_TEXT_SECONDARY }}>
              Payback
            </p>
            <p className="font-black text-xs" style={{ color: '#DC2626' }}>
              {paybackPeriod}mo
            </p>
          </div>

          <div>
            <p className="font-semibold mb-0.5 leading-tight" style={{ color: COLOR_TEXT_SECONDARY }}>
              Quality
            </p>
            <div className="flex items-center gap-1">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white"
                style={{ background: getQualityColor(dealQualityScore) }}
              >
                {Math.floor(dealQualityScore / 10)}
              </div>
            </div>
          </div>
        </div>

        {/* CALL-TO-ACTION BUTTONS */}
        <div className="grid grid-cols-2 gap-2 pt-1 flex-shrink-0">
          <button
            onClick={onViewSimilar}
            className="px-2 py-1.5 rounded-lg border text-xs font-semibold transition-all hover:bg-gray-50 flex items-center justify-center gap-1"
            style={{ borderColor: COLOR_BORDER, color: COLOR_PRIMARY }}
          >
            <ChevronRight size={12} />
            Similar
          </button>

          <button
            onClick={onContact}
            className="px-2 py-1.5 rounded-lg text-xs font-semibold text-white transition-all hover:opacity-90 flex items-center justify-center gap-1"
            style={{ background: COLOR_ACCENT }}
          >
            Contact
            <ArrowRight size={12} />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

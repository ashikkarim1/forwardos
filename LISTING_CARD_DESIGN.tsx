'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, TrendingUp, Zap, ArrowRight, ChevronRight } from 'lucide-react'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER, COLOR_BG_PRIMARY } from '@/styles/forward-colors'

/**
 * LISTING CARD COMPONENT - Full Financial Data + Forward OS Moat Features
 *
 * Matches: Asking Price, Annual Revenue, Cash Flow (competitor baseline)
 * Exceeds: EBITDA, Profit Margin, Deal Quality Score, Similar Deals, ROI/Payback
 */

interface ListingCardProps {
  id: string
  title: string
  location: string
  country: string
  image: string

  // Baseline financial metrics (match competitor)
  askingPrice: number
  askingPriceCurrency: string
  annualRevenue: number
  cashFlowMin: number
  cashFlowMax: number

  // Forward OS exceed metrics
  ebitda: number
  profitMarginPercent: number

  // Moat features
  dealQualityScore: number // 0-100, Forward OS proprietary
  heatIndex: number // 0-100, buyer interest

  // Buyer intelligence
  roiProjection: number // % annual return
  paybackPeriod: number // months
  growthRate: number // % YoY

  // Metadata
  status: 'NEW' | 'FEATURED' | 'STANDARD'
  category: string // "BUSINESS" | "FRANCHISE"
  dealType: 'SALE' | 'LEASE' | 'QUICK_SALE'
  employeeCount?: number

  // Actions
  isSaved?: boolean
  onSave?: () => void
  onViewSimilar?: () => void
  onContact?: () => void
}

const DEAL_QUALITY_COLORS = {
  excellent: '#10B981', // Green - 80-100
  good: '#3B82F6',      // Blue - 60-79
  fair: '#F59E0B',      // Orange - 40-59
  poor: '#EF4444',      // Red - 0-39
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
      className="rounded-lg border overflow-hidden hover:shadow-lg transition-shadow bg-white"
      style={{ borderColor: COLOR_BORDER }}
    >
      {/* IMAGE + STATUS BADGES */}
      <div className="relative h-48 overflow-hidden bg-gray-200">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover hover:scale-105 transition-transform"
        />

        {/* Status Badges - Top Left */}
        <div className="absolute top-3 left-3 flex gap-2 z-10">
          {status === 'NEW' && (
            <span
              className="px-3 py-1 rounded-full text-xs font-bold text-white"
              style={{ background: '#EF4444' }}
            >
              🆕 NEW
            </span>
          )}
          {status === 'FEATURED' && (
            <span
              className="px-3 py-1 rounded-full text-xs font-bold text-white"
              style={{ background: COLOR_ACCENT }}
            >
              ⭐ FEATURED
            </span>
          )}
        </div>

        {/* Heat Index + Deal Quality - Top Right */}
        <div className="absolute top-3 right-3 flex gap-2 z-10">
          <div
            className="px-3 py-1 rounded-lg text-xs font-bold text-white flex items-center gap-1"
            style={{ background: heatIndex > 70 ? '#DC2626' : '#F59E0B' }}
          >
            <Zap size={14} />
            {heatIndex}
          </div>
        </div>

        {/* Save Button - Floating */}
        <button
          onClick={handleSave}
          className="absolute bottom-3 right-3 p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-all z-10"
        >
          <Heart
            size={20}
            className={saved ? 'fill-current' : ''}
            style={{ color: saved ? COLOR_ACCENT : COLOR_TEXT_SECONDARY }}
          />
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div className="p-4 space-y-4">
        {/* Title + Location */}
        <div>
          <h3
            className="font-black text-lg mb-1 line-clamp-2 hover:text-opacity-80 cursor-pointer"
            style={{ color: COLOR_PRIMARY }}
          >
            {title}
          </h3>
          <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
            📍 {location}, {country}
          </p>
        </div>

        {/* DEAL TYPE + CATEGORY BADGES */}
        <div className="flex gap-2 flex-wrap">
          <span
            className="px-2.5 py-1 rounded-full text-xs font-semibold text-white"
            style={{ background: COLOR_PRIMARY }}
          >
            {category}
          </span>
          <span
            className="px-2.5 py-1 rounded-full text-xs font-semibold text-white"
            style={{
              background:
                dealType === 'LEASE'
                  ? '#06B6D4'
                  : dealType === 'QUICK_SALE'
                    ? '#DC2626'
                    : '#10B981',
            }}
          >
            {dealType === 'LEASE' ? '🏢 LEASE' : dealType === 'QUICK_SALE' ? '⚡ QUICK SALE' : '💼 SALE'}
          </span>
          {employeeCount && (
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold border" style={{ borderColor: COLOR_BORDER, color: COLOR_PRIMARY }}>
              {employeeCount} employees
            </span>
          )}
        </div>

        {/* FINANCIAL METRICS - 3x3 GRID */}
        <div className="grid grid-cols-3 gap-3 py-3 px-3 rounded-lg" style={{ background: COLOR_BG_PRIMARY }}>
          {/* Row 1: Price, Revenue, Cash Flow (BASELINE - MATCH COMPETITOR) */}
          <div>
            <p className="text-xs font-semibold mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>
              Asking Price
            </p>
            <p className="text-sm font-black" style={{ color: COLOR_ACCENT }}>
              {formatCurrency(askingPrice, askingPriceCurrency)}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>
              Annual Revenue
            </p>
            <p className="text-sm font-black" style={{ color: COLOR_PRIMARY }}>
              {formatCurrency(annualRevenue, askingPriceCurrency)}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>
              Cash Flow
            </p>
            <p className="text-sm font-black" style={{ color: COLOR_PRIMARY }}>
              {formatCurrency(cashFlowMin, askingPriceCurrency)}
            </p>
            <p className="text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>
              - {formatCurrency(cashFlowMax, askingPriceCurrency)}
            </p>
          </div>

          {/* Row 2: EBITDA, Profit Margin, Growth (FORWARD OS EXCEED) */}
          <div>
            <p className="text-xs font-semibold mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>
              EBITDA
            </p>
            <p className="text-sm font-black" style={{ color: '#10B981' }}>
              {formatCurrency(ebitda, askingPriceCurrency)}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>
              Profit Margin
            </p>
            <p className="text-sm font-black" style={{ color: '#3B82F6' }}>
              {profitMarginPercent}%
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>
              YoY Growth
            </p>
            <p className="text-sm font-black flex items-center gap-1" style={{ color: '#10B981' }}>
              <TrendingUp size={14} />
              {growthRate}%
            </p>
          </div>

          {/* Row 3: ROI, Payback, Deal Quality (BUYER INTELLIGENCE + MOAT) */}
          <div>
            <p className="text-xs font-semibold mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>
              ROI Projection
            </p>
            <p className="text-sm font-black" style={{ color: '#F59E0B' }}>
              {roiProjection}% /yr
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>
              Payback Period
            </p>
            <p className="text-sm font-black" style={{ color: '#DC2626' }}>
              {paybackPeriod} mo
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>
              Deal Quality
            </p>
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                style={{ background: getQualityColor(dealQualityScore) }}
              >
                {dealQualityScore}
              </div>
              <p className="text-xs font-semibold">{getQualityLabel(dealQualityScore)}</p>
            </div>
          </div>
        </div>

        {/* CALL-TO-ACTION BUTTONS */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          {/* Similar Deals Button (FORWARD OS MOAT) */}
          <button
            onClick={onViewSimilar}
            className="px-4 py-2.5 rounded-lg border font-semibold text-sm transition-all hover:bg-gray-50 flex items-center justify-center gap-2"
            style={{ borderColor: COLOR_BORDER, color: COLOR_PRIMARY }}
          >
            <ChevronRight size={16} />
            Similar
          </button>

          {/* Contact Seller Button (BASELINE) */}
          <button
            onClick={onContact}
            className="px-4 py-2.5 rounded-lg font-semibold text-sm text-white transition-all hover:opacity-90 flex items-center justify-center gap-2"
            style={{ background: COLOR_ACCENT }}
          >
            Contact
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

/**
 * EXAMPLE USAGE:
 *
 * <ListingCard
 *   id="deal-001"
 *   title="Prime Restaurant For Sale In Dubai"
 *   location="Dubai"
 *   country="UAE"
 *   image="/images/restaurant.jpg"
 *   askingPrice={680000}
 *   askingPriceCurrency="AED"
 *   annualRevenue={2500000}
 *   cashFlowMin={500000}
 *   cashFlowMax={2500000}
 *   ebitda={750000}
 *   profitMarginPercent={30}
 *   dealQualityScore={85}
 *   heatIndex={92}
 *   roiProjection={18.5}
 *   paybackPeriod={38}
 *   growthRate={12}
 *   status="NEW"
 *   category="BUSINESS"
 *   dealType="SALE"
 *   employeeCount={8}
 *   onSave={() => console.log('Saved!')}
 *   onViewSimilar={() => console.log('Show similar deals')}
 *   onContact={() => console.log('Contact seller')}
 * />
 */

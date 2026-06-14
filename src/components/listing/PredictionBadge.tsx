/**
 * <PredictionBadge>
 *
 * Compact close-probability pill shown on every marketplace card.
 * The score itself is visible to everyone (creates the hook), but the
 * driver-signal breakdown + the full ranked list lives at
 * /intelligence/predictions and is gated by Buyer Premium.
 */
'use client'

import Link from 'next/link'
import { TrendingUp } from 'lucide-react'
import { predictCloseProbability, BAND_COPY } from '@/lib/predictions'

interface Props {
  dealQualityScore: number
  heatIndex: number
  daysOnMarket: number
  financingEligible?: boolean
  sellerVerified?: boolean
  growthRate?: number
  compact?: boolean
}

export function PredictionBadge({
  dealQualityScore, heatIndex, daysOnMarket,
  financingEligible, sellerVerified, growthRate, compact,
}: Props) {
  const p = predictCloseProbability({
    dealQualityScore, heatIndex, daysOnMarket,
    financingEligible, sellerVerified, growthRate,
  })
  const band = BAND_COPY[p.band]

  if (compact) {
    return (
      <Link
        href="/intelligence/predictions"
        title={`${band.label} — ${p.score}/100. Close in ${p.closeWindowMonths.min}–${p.closeWindowMonths.max} mo. ${p.rationale}`}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          padding: '3px 7px', borderRadius: 999,
          background: band.color + '18', color: band.color,
          fontSize: 10, fontWeight: 700, letterSpacing: '0.02em',
          textDecoration: 'none',
        }}
      >
        <TrendingUp size={9} /> {p.score}
      </Link>
    )
  }

  return (
    <Link
      href="/intelligence/predictions"
      title={p.rationale}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '4px 10px', borderRadius: 999,
        background: band.color + '18', color: band.color,
        fontSize: 11, fontWeight: 700, letterSpacing: '0.02em',
        textDecoration: 'none',
      }}
    >
      <TrendingUp size={11} /> {p.score} · Close {p.closeWindowMonths.min}–{p.closeWindowMonths.max}mo
    </Link>
  )
}

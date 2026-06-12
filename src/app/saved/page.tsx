'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Heart, ArrowRight } from 'lucide-react'
import ListingCard from '@/components/listing/ListingCard'
import { PublicHeader } from '@/components/Navigation'
import { useSavedDeals } from '@/hooks/useSavedDeals'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER, COLOR_BG_PRIMARY } from '@/styles/forward-colors'

interface Deal { id: string; title: string; location: string; country: string; image: string; askingPrice: number; askingPriceCurrency: string; annualRevenue: number; cashFlowMin: number; cashFlowMax: number; ebitda: number; profitMarginPercent: number; dealQualityScore: number; heatIndex: number; roiProjection: number; paybackPeriod: number; growthRate: number; status: 'NEW' | 'FEATURED' | 'STANDARD'; category: string; dealType: 'SALE' | 'LEASE' | 'QUICK_SALE'; employeeCount: number; sellerVerified: boolean; sellerTrustScore: number; marketTrend: 'up' | 'down' | 'stable'; marketPosition: 'underpriced' | 'fair' | 'premium'; daysOnMarket: number; location_country: string; sellerType: string; sellerMotivation: string }

export default function SavedDealsPage() {
  const savedDeals = useSavedDeals()
  const [allDeals, setAllDeals] = useState<Deal[] | null>(null)

  useEffect(() => {
    fetch('/api/deals')
      .then((r) => r.json())
      .then((d) => { if (Array.isArray(d.deals)) setAllDeals(d.deals) })
      .catch(() => setAllDeals([]))
  }, [])

  const savedListings = (allDeals || []).filter((d) => savedDeals.isSaved(d.id))
  const isLoading = allDeals === null
  const hydratedAndEmpty = savedDeals.hydrated && !isLoading && savedListings.length === 0

  return (
    <div className="min-h-screen" style={{ background: COLOR_BG_PRIMARY }}>
      <PublicHeader />

      <section className="px-4 md:px-8 py-6 border-b" style={{ borderColor: COLOR_BORDER, background: '#EFF6FF' }}>
        <div className="max-w-7xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-white mb-2" style={{ background: COLOR_ACCENT }}>
            <Heart size={12} className="fill-current" /> SAVED
          </span>
          <h1 className="text-3xl md:text-4xl font-black mb-1" style={{ color: COLOR_PRIMARY }}>Your saved listings</h1>
          <p className="text-base" style={{ color: COLOR_TEXT_SECONDARY }}>
            {savedDeals.hydrated
              ? `${savedDeals.count} ${savedDeals.count === 1 ? 'listing saved' : 'listings saved'}`
              : 'Loading…'}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="rounded-xl border bg-white animate-pulse" style={{ borderColor: COLOR_BORDER, height: 360 }} />
            ))}
          </div>
        ) : hydratedAndEmpty ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 px-6">
            <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6" style={{ background: '#EFF6FF' }}>
              <Heart size={32} style={{ color: COLOR_ACCENT }} />
            </div>
            <h2 className="text-2xl font-black mb-2" style={{ color: COLOR_PRIMARY }}>No saved listings yet</h2>
            <p className="text-base mb-6 max-w-md mx-auto" style={{ color: COLOR_TEXT_SECONDARY }}>
              Tap the heart on any listing in the marketplace to save it here. Compare side-by-side, share with partners, or come back later.
            </p>
            <Link href="/marketplace" className="inline-flex items-center gap-2 px-5 py-3 rounded-lg font-bold text-white hover:opacity-90" style={{ background: COLOR_ACCENT }}>
              Browse marketplace <ArrowRight size={16} />
            </Link>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedListings.map((deal) => (
              <motion.div key={deal.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <ListingCard
                  {...deal}
                  isSaved={true}
                  onSave={() => savedDeals.toggle(deal.id)}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}

'use client'

/**
 * DESIGN PREVIEW — editorial marketplace layout, inspired by the
 * Luxury Presence "best agent websites" gallery format:
 *   alternating full-bleed imagery · small-caps eyebrow · oversized
 *   headline · AI narrative writeup · quiet CTA · generous whitespace.
 *
 * Company names are masked (blur + lock) for visitors, demonstrating the
 * "reveal for verified buyers" mechanic. Review at /marketplace/editorial.
 */

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Lock, ArrowRight, Heart, Sparkles } from 'lucide-react'
import { PublicHeader } from '@/components/Navigation'
import { useSavedDeals } from '@/hooks/useSavedDeals'
import { generateNarrative, narrativeEyebrow, type NarrativeDeal } from '@/lib/listing-narrative'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER, COLOR_BG_PRIMARY } from '@/styles/forward-colors'

interface Deal extends NarrativeDeal {
  id: string
  slug?: string
  image: string
  status: 'NEW' | 'FEATURED' | 'STANDARD'
}

const fmt = (n: number) =>
  n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(1)}M` : n >= 1_000 ? `$${Math.round(n / 1_000)}K` : `$${Math.round(n)}`

export default function EditorialMarketplacePreview() {
  const [deals, setDeals] = useState<Deal[] | null>(null)
  const savedDeals = useSavedDeals()
  // Demo toggle so you can preview both visitor tiers from the banner.
  const [isVerifiedBuyer, setIsVerifiedBuyer] = useState(false)

  useEffect(() => {
    fetch('/api/deals')
      .then((r) => r.json())
      .then((d) => {
        if (!Array.isArray(d.deals)) return
        const top = [...d.deals]
          .sort((a, b) => (b.heatIndex ?? 0) - (a.heatIndex ?? 0))
          .slice(0, 8)
        setDeals(top)
      })
      .catch(() => setDeals([]))
  }, [])

  return (
    <div className="min-h-screen" style={{ background: COLOR_BG_PRIMARY }}>
      <PublicHeader />

      {/* Preview banner with tier toggle */}
      <div className="px-6 py-3 text-center text-sm font-semibold text-white flex items-center justify-center gap-4 flex-wrap" style={{ background: COLOR_PRIMARY }}>
        <span>DESIGN PREVIEW — editorial listing layout</span>
        <button
          onClick={() => setIsVerifiedBuyer(!isVerifiedBuyer)}
          className="px-3 py-1 rounded-full text-xs font-bold border border-white/40 hover:bg-white/10"
        >
          Viewing as: {isVerifiedBuyer ? 'Verified buyer (names revealed)' : 'Visitor (names masked)'} — click to switch
        </button>
      </div>

      {/* Editorial hero */}
      <section className="px-6 pt-20 pb-14 text-center">
        <p className="text-xs font-bold tracking-[0.25em] mb-5" style={{ color: COLOR_TEXT_SECONDARY }}>
          THE FORWARD COLLECTION
        </p>
        <h1 className="text-4xl md:text-6xl font-black max-w-3xl mx-auto leading-tight mb-5" style={{ color: COLOR_PRIMARY }}>
          Exceptional businesses, presented exceptionally.
        </h1>
        <p className="text-lg max-w-xl mx-auto" style={{ color: COLOR_TEXT_SECONDARY }}>
          Each listing analyzed by Forward Intelligence — the story behind the numbers, written for serious buyers.
        </p>
      </section>

      {/* Alternating editorial entries */}
      <div className="max-w-6xl mx-auto px-6 pb-24 space-y-24 md:space-y-32">
        {deals === null && (
          <div className="space-y-24">
            {[0, 1].map((i) => (
              <div key={i} className="grid md:grid-cols-2 gap-10 items-center">
                <div className="rounded-2xl bg-gray-100 animate-pulse" style={{ height: 420 }} />
                <div className="space-y-4">
                  <div className="h-3 w-40 bg-gray-100 animate-pulse rounded" />
                  <div className="h-10 w-72 bg-gray-100 animate-pulse rounded" />
                  <div className="h-24 w-full bg-gray-100 animate-pulse rounded" />
                </div>
              </div>
            ))}
          </div>
        )}

        {deals?.map((deal, idx) => {
          const masked = !isVerifiedBuyer
          const narrative = generateNarrative(deal)
          const flip = idx % 2 === 1
          return (
            <motion.article
              key={deal.id}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55 }}
              className={`grid md:grid-cols-2 gap-10 md:gap-16 items-center ${flip ? 'md:[direction:rtl]' : ''}`}
            >
              {/* Image panel */}
              <div className="[direction:ltr] relative group">
                <div className="rounded-2xl overflow-hidden shadow-sm" style={{ aspectRatio: '16/11' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={deal.image}
                    alt={masked ? 'Confidential business listing' : deal.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                </div>
                {/* Floating heat chip */}
                {deal.heatIndex >= 85 && (
                  <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-bold text-white backdrop-blur" style={{ background: 'rgba(26,26,26,0.75)' }}>
                    <Sparkles size={11} className="inline mr-1.5 -mt-0.5" />
                    Most-watched this week
                  </div>
                )}
                {/* Save heart */}
                <button
                  onClick={() => savedDeals.toggle(deal.id)}
                  aria-label="Save listing"
                  className="absolute top-4 right-4 p-2.5 rounded-full bg-white/90 backdrop-blur shadow-md hover:shadow-lg transition-all"
                >
                  <Heart
                    size={16}
                    className={savedDeals.isSaved(deal.id) ? 'fill-current' : ''}
                    style={{ color: savedDeals.isSaved(deal.id) ? COLOR_ACCENT : COLOR_TEXT_SECONDARY }}
                  />
                </button>
              </div>

              {/* Text panel */}
              <div className="[direction:ltr]">
                <p className="text-[11px] font-bold tracking-[0.22em] mb-4" style={{ color: COLOR_TEXT_SECONDARY }}>
                  {narrativeEyebrow(deal)}
                </p>

                {/* Headline — masked for visitors */}
                {masked ? (
                  <div className="mb-5">
                    <h2
                      className="text-3xl md:text-4xl font-black leading-tight select-none"
                      style={{ color: COLOR_PRIMARY, filter: 'blur(10px)' }}
                      aria-hidden
                    >
                      {deal.title}
                    </h2>
                    <div className="flex items-center gap-2 mt-3">
                      <Lock size={13} style={{ color: COLOR_ACCENT }} />
                      <span className="text-xs font-bold" style={{ color: COLOR_ACCENT }}>
                        Company name revealed to verified buyers
                      </span>
                    </div>
                  </div>
                ) : (
                  <h2 className="text-3xl md:text-4xl font-black leading-tight mb-5" style={{ color: COLOR_PRIMARY }}>
                    {deal.title}
                  </h2>
                )}

                {/* AI narrative */}
                <p className="text-base leading-relaxed mb-7" style={{ color: COLOR_TEXT_SECONDARY }}>
                  {narrative}
                </p>

                {/* Minimal stat strip — hairline rules, no boxes */}
                <div className="flex divide-x mb-8" style={{ borderColor: COLOR_BORDER }}>
                  <Stat label="Asking" value={fmt(deal.askingPrice)} first />
                  <Stat label="Revenue" value={fmt(deal.annualRevenue)} />
                  <Stat label="EBITDA" value={fmt(deal.ebitda)} />
                  <Stat label="Quality" value={`${deal.dealQualityScore}/100`} />
                </div>

                <div className="flex items-center gap-4">
                  <Link
                    href={`/deal/${deal.id}`}
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg font-bold text-white hover:opacity-90 transition-opacity"
                    style={{ background: COLOR_PRIMARY }}
                  >
                    View listing <ArrowRight size={15} />
                  </Link>
                  {masked && (
                    <Link href="/auth/signup" className="text-sm font-bold hover:opacity-70" style={{ color: COLOR_ACCENT }}>
                      Become a verified buyer →
                    </Link>
                  )}
                </div>
              </div>
            </motion.article>
          )
        })}
      </div>

      {/* Footer CTA */}
      <section className="px-6 py-20 border-t text-center" style={{ borderColor: COLOR_BORDER, background: 'white' }}>
        <h2 className="text-3xl font-black mb-3" style={{ color: COLOR_PRIMARY }}>55+ businesses, three regions, one standard.</h2>
        <p className="mb-7 max-w-lg mx-auto" style={{ color: COLOR_TEXT_SECONDARY }}>
          Browse the full marketplace with filters, saved searches, and financing pre-checks — or list your own company in 90 seconds.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link href="/marketplace" className="px-6 py-3 rounded-lg font-bold text-white hover:opacity-90" style={{ background: COLOR_ACCENT }}>Browse all listings</Link>
          <Link href="/list" className="px-6 py-3 rounded-lg font-bold border bg-white hover:bg-gray-50" style={{ borderColor: COLOR_BORDER, color: COLOR_PRIMARY }}>Sell with Forward</Link>
        </div>
      </section>
    </div>
  )
}

function Stat({ label, value, first }: { label: string; value: string; first?: boolean }) {
  return (
    <div className={first ? 'pr-5' : 'px-5'}>
      <p className="text-[10px] font-bold tracking-widest uppercase mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>{label}</p>
      <p className="text-lg font-black" style={{ color: COLOR_PRIMARY }}>{value}</p>
    </div>
  )
}

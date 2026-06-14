'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Search, ChevronLeft, ChevronRight, ChevronDown, X, SlidersHorizontal, Heart, ArrowRight, Lock, Sparkles, Camera, CheckCircle2, Mail } from 'lucide-react'
import { BusinessPhotoGallery } from '@/components/BusinessPhotoGallery'
import { SaveSearchButton } from '@/components/SaveSearchButton'
import { SavedViewsMenu } from '@/components/marketplace/SavedViews'
import { PublicHeader } from '@/components/Navigation'
import { useSavedDeals } from '@/hooks/useSavedDeals'
import { generateNarrative, narrativeEyebrow, maskedHeadline, industryLabel } from '@/lib/listing-narrative'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER, COLOR_BG_PRIMARY } from '@/styles/forward-colors'
import { palette } from '@/styles/tokens'

interface Deal {
  id: string; slug?: string; title: string; location: string; country: string; image: string; askingPrice: number; askingPriceCurrency: string; annualRevenue: number; cashFlowMin: number; cashFlowMax: number; ebitda: number; profitMarginPercent: number; dealQualityScore: number; heatIndex: number; roiProjection: number; paybackPeriod: number; growthRate: number; status: 'NEW' | 'FEATURED' | 'STANDARD'; category: string; dealType: 'SALE' | 'LEASE' | 'QUICK_SALE'; employeeCount: number; sellerVerified: boolean; sellerTrustScore: number; marketTrend: 'up' | 'down' | 'stable'; marketPosition: 'underpriced' | 'fair' | 'premium'; daysOnMarket: number; location_country: string; sellerType: string; sellerMotivation: string; financingEligible?: boolean; upcomingAuction?: boolean
}

// Canonical detail-page URL — the masked /listing/[slug] route. Falls back to
// the legacy /deal/[id] only when slug is missing (shouldn't happen for new
// data — every Deal row has a unique slug now).
const detailHref = (d: Pick<Deal, 'slug' | 'id'>) => d.slug ? `/listing/${d.slug}` : `/deal/${d.id}`

// Pretty-print enum-style values for filter options.
const SPECIAL_LABELS: Record<string, string> = {
  SAAS: 'SaaS', USA: 'USA', UAE: 'UAE', KSA: 'KSA', UK: 'UK',
  EDTECH: 'EdTech', FINTECH: 'FinTech', ECOMMERCE: 'E-Commerce',
}
const formatCategoryName = (name: string) => {
  if (!name) return ''
  const upper = name.toUpperCase()
  if (SPECIAL_LABELS[upper]) return SPECIAL_LABELS[upper]
  return upper.split('_').map((p) => p.charAt(0) + p.slice(1).toLowerCase()).join(' ')
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.03 } },
}

// Default ranges — used both as initial state and to detect "untouched".
const DEFAULT_VALUATION = { min: 0.1, max: 100 }
const DEFAULT_REVENUE = { min: 0, max: 50 }
const DEFAULT_HEAT = { min: 0, max: 100 }
const DEFAULT_QUALITY = { min: 0, max: 100 }

export default function MarketplacePage() {
  // When this page is rendered at /deals (re-exported into the dashboard
  // route), the surrounding AppShell already provides nav chrome — skip
  // the public site header to avoid a double-header. Everywhere else
  // (including /marketplace) renders the public header as before.
  const pathname = usePathname()
  const embeddedInDashboard = pathname?.startsWith('/deals') ?? false
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('premium')
  const [photoModalOpen, setPhotoModalOpen] = useState(false)
  const [selectedDealPhotos, setSelectedDealPhotos] = useState<string[]>([])
  // Which filter pill's popover is open (one at a time, click-outside closes).
  const [openMenu, setOpenMenu] = useState<string | null>(null)

  const [valuation, setValuation] = useState(DEFAULT_VALUATION)
  const [revenue, setRevenue] = useState(DEFAULT_REVENUE)
  const [heatScore, setHeatScore] = useState(DEFAULT_HEAT)
  const [successProb, setSuccessProb] = useState(DEFAULT_QUALITY)
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([])
  const [selectedLocations, setSelectedLocations] = useState<string[]>([])
  const [selectedSellerTypes, setSelectedSellerTypes] = useState<string[]>([])
  const [selectedMotivations, setSelectedMotivations] = useState<string[]>([])

  // Live deals from the database — no hardcoded fallback (see git history:
  // the old sample-data fallback caused filters to apply to fake listings).
  const [dbDeals, setDbDeals] = useState<Deal[] | null>(null)
  const [loadError, setLoadError] = useState(false)
  useEffect(() => {
    let cancelled = false
    fetch('/api/deals')
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return
        if (Array.isArray(d.deals)) setDbDeals(d.deals)
        else setLoadError(true)
      })
      .catch(() => { if (!cancelled) setLoadError(true) })
    return () => { cancelled = true }
  }, [])
  const activeDeals = dbDeals ?? []
  const isLoading = dbDeals === null && !loadError

  const savedDeals = useSavedDeals()

  // Option lists + per-option deal counts (shown next to each checkbox so the
  // user knows what a filter will do BEFORE clicking it — key usability win).
  const countBy = (key: keyof Deal) => {
    const m = new Map<string, number>()
    for (const d of activeDeals) {
      const v = String(d[key] ?? '')
      if (!v) continue
      m.set(v, (m.get(v) || 0) + 1)
    }
    return m
  }
  const industryCounts = useMemo(() => countBy('category'), [activeDeals])   // eslint-disable-line react-hooks/exhaustive-deps
  const locationCounts = useMemo(() => countBy('location_country'), [activeDeals])  // eslint-disable-line react-hooks/exhaustive-deps
  const sellerTypeCounts = useMemo(() => countBy('sellerType'), [activeDeals])      // eslint-disable-line react-hooks/exhaustive-deps
  const motivationCounts = useMemo(() => countBy('sellerMotivation'), [activeDeals]) // eslint-disable-line react-hooks/exhaustive-deps

  const filteredListings = useMemo(() => {
    const results = activeDeals.filter((deal) => {
      const matchesSearch = deal.title.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesIndustry = selectedIndustries.length === 0 || selectedIndustries.includes(deal.category)
      const matchesLocation = selectedLocations.length === 0 || selectedLocations.includes(deal.location_country)
      const matchesSellerType = selectedSellerTypes.length === 0 || selectedSellerTypes.includes(deal.sellerType)
      const matchesMotivation = selectedMotivations.length === 0 || selectedMotivations.includes(deal.sellerMotivation)
      const matchesValuation = deal.askingPrice >= valuation.min * 1000000 && deal.askingPrice <= valuation.max * 1000000
      const matchesRevenue = deal.annualRevenue >= revenue.min * 1000000 && deal.annualRevenue <= revenue.max * 1000000
      const matchesHeat = deal.heatIndex >= heatScore.min && deal.heatIndex <= heatScore.max
      const matchesSuccess = deal.dealQualityScore >= successProb.min && deal.dealQualityScore <= successProb.max
      return matchesSearch && matchesIndustry && matchesLocation && matchesSellerType && matchesMotivation && matchesValuation && matchesRevenue && matchesHeat && matchesSuccess
    })

    const featured = results.filter((d) => d.status === 'FEATURED')
    const nonFeatured = results.filter((d) => d.status !== 'FEATURED')
    const sortResults = (arr: Deal[]) => {
      if (sortBy === 'newest') return arr.sort((a, b) => a.daysOnMarket - b.daysOnMarket)
      if (sortBy === 'oldest') return arr.sort((a, b) => b.daysOnMarket - a.daysOnMarket)
      if (sortBy === 'heat') return arr.sort((a, b) => b.heatIndex - a.heatIndex)
      if (sortBy === 'roi') return arr.sort((a, b) => b.roiProjection - a.roiProjection)
      if (sortBy === 'valuation') return arr.sort((a, b) => a.askingPrice - b.askingPrice)
      return arr.sort((a, b) => b.dealQualityScore - a.dealQualityScore)
    }
    if (sortBy === 'premium') return [...sortResults(featured), ...sortResults(nonFeatured)]
    return sortResults(results)
  }, [activeDeals, searchTerm, selectedIndustries, selectedLocations, selectedSellerTypes, selectedMotivations, valuation, revenue, heatScore, successProb, sortBy])

  // Trending rail — deliberately UNFILTERED. It's an editorial discovery
  // surface showing the 4 hottest listings platform-wide; filters only
  // affect the main grid below.
  const hotDeals = useMemo(() => [...activeDeals].sort((a, b) => b.heatIndex - a.heatIndex).slice(0, 4), [activeDeals])

  const rangesActive = {
    valuation: valuation.min !== DEFAULT_VALUATION.min || valuation.max !== DEFAULT_VALUATION.max,
    revenue: revenue.min !== DEFAULT_REVENUE.min || revenue.max !== DEFAULT_REVENUE.max,
    heat: heatScore.min !== DEFAULT_HEAT.min || heatScore.max !== DEFAULT_HEAT.max,
    quality: successProb.min !== DEFAULT_QUALITY.min || successProb.max !== DEFAULT_QUALITY.max,
  }
  const activeFiltersCount =
    selectedIndustries.length + selectedLocations.length + selectedSellerTypes.length + selectedMotivations.length
    + (rangesActive.valuation ? 1 : 0) + (rangesActive.revenue ? 1 : 0)
    + (rangesActive.heat ? 1 : 0) + (rangesActive.quality ? 1 : 0)
    + (searchTerm.trim() ? 1 : 0)

  // Editorial rows are tall — 10 per page keeps scroll length reasonable.
  const CARDS_PER_PAGE = 10
  const totalPages = Math.ceil(filteredListings.length / CARDS_PER_PAGE)
  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) setCurrentPage(1)
    if (totalPages === 0 && currentPage !== 1) setCurrentPage(1)
  }, [totalPages, currentPage])
  const startIdx = (currentPage - 1) * CARDS_PER_PAGE
  const currentListings = filteredListings.slice(startIdx, startIdx + CARDS_PER_PAGE)

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const clearAllFilters = () => {
    setSearchTerm('')
    setSelectedIndustries([])
    setSelectedLocations([])
    setSelectedSellerTypes([])
    setSelectedMotivations([])
    setValuation(DEFAULT_VALUATION)
    setRevenue(DEFAULT_REVENUE)
    setHeatScore(DEFAULT_HEAT)
    setSuccessProb(DEFAULT_QUALITY)
    setCurrentPage(1)
  }

  const toggleValue = (value: string, selected: string[], setSelected: (v: string[]) => void) => {
    setSelected(selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value])
    setCurrentPage(1)
  }

  // Removable chips for every active filter — one tap to undo any of them.
  const chips: { label: string; remove: () => void }[] = []
  if (searchTerm.trim()) chips.push({ label: `“${searchTerm.trim()}”`, remove: () => setSearchTerm('') })
  for (const v of selectedLocations) chips.push({ label: formatCategoryName(v), remove: () => toggleValue(v, selectedLocations, setSelectedLocations) })
  for (const v of selectedIndustries) chips.push({ label: formatCategoryName(v), remove: () => toggleValue(v, selectedIndustries, setSelectedIndustries) })
  for (const v of selectedSellerTypes) chips.push({ label: v, remove: () => toggleValue(v, selectedSellerTypes, setSelectedSellerTypes) })
  for (const v of selectedMotivations) chips.push({ label: v, remove: () => toggleValue(v, selectedMotivations, setSelectedMotivations) })
  if (rangesActive.valuation) chips.push({ label: `Price $${valuation.min}M–$${valuation.max}M`, remove: () => setValuation(DEFAULT_VALUATION) })
  if (rangesActive.revenue) chips.push({ label: `Revenue $${revenue.min}M–$${revenue.max}M`, remove: () => setRevenue(DEFAULT_REVENUE) })
  if (rangesActive.heat) chips.push({ label: `Heat ${heatScore.min}–${heatScore.max}`, remove: () => setHeatScore(DEFAULT_HEAT) })
  if (rangesActive.quality) chips.push({ label: `Quality ${successProb.min}–${successProb.max}`, remove: () => setSuccessProb(DEFAULT_QUALITY) })

  return (
    <div className="min-h-screen" style={{ background: COLOR_BG_PRIMARY }}>
      {!embeddedInDashboard && <PublicHeader />}

      <section className="px-4 md:px-8 py-6 border-b" style={{ borderColor: COLOR_BORDER, background: palette.champagne[50] }}>
        <div className="max-w-7xl mx-auto">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-2" style={{ background: COLOR_ACCENT, color: 'white' }}>
            MARKETPLACE
          </span>
          <h1 className="text-3xl md:text-4xl font-black mb-1" style={{ color: COLOR_PRIMARY }}>Global Marketplace</h1>
          <p className="text-base" style={{ color: COLOR_TEXT_SECONDARY }}>
            {activeDeals.length || '—'} verified businesses for sale across the USA, Canada &amp; the UAE
          </p>
        </div>
      </section>

      {/* Trending rail — unfiltered, always visible once data loads */}
      {!isLoading && activeDeals.length > 0 && (
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="border-b" style={{ borderColor: COLOR_BORDER, background: 'white' }}>
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">🔥</span>
              <h2 className="text-2xl font-black" style={{ color: COLOR_PRIMARY }}>Trending Deals Right Now</h2>
              <span className="text-xs font-bold px-3 py-1 rounded-full text-white" style={{ background: COLOR_ACCENT }}>HOTTEST</span>
            </div>
            <p className="text-xs mb-6" style={{ color: COLOR_TEXT_SECONDARY }}>Platform-wide — not affected by your filters below.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {hotDeals.map((deal) => (
                <Link key={deal.id} href={detailHref(deal)}>
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-xl border hover:shadow-md transition-shadow cursor-pointer bg-white" style={{ borderColor: COLOR_BORDER }}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        {/* Identity masked platform-wide — industry stands in for the name */}
                        <h3 className="font-bold text-sm line-clamp-1" style={{ color: COLOR_PRIMARY }}>Confidential {industryLabel(deal.category)}</h3>
                        <p className="text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>{deal.location}</p>
                      </div>
                      <div className="px-2 py-1 rounded text-xs font-bold text-white flex-shrink-0" style={{ background: palette.crimson[600] }}>{deal.heatIndex}🔥</div>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span style={{ color: COLOR_TEXT_SECONDARY }}>${(deal.askingPrice / 1000000).toFixed(1)}M</span>
                      <span style={{ color: palette.emerald[500], fontWeight: 'bold' }}>{deal.growthRate}% growth</span>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* ─── Filter bar: search + pill popovers + sort, sticky ─────────────── */}
      <div className="sticky top-0 z-30 border-b bg-white/95 backdrop-blur" style={{ borderColor: COLOR_BORDER }}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative flex-shrink-0 w-full sm:w-56">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: COLOR_TEXT_SECONDARY }} />
              <input
                type="text"
                placeholder="Search businesses…"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1) }}
                className="w-full pl-9 pr-3 py-2 rounded-full border text-sm bg-white focus:outline-none focus:ring-2"
                style={{ borderColor: COLOR_BORDER, outlineColor: COLOR_ACCENT }}
              />
            </div>

            <FilterPill
              id="region" label="Region" count={selectedLocations.length}
              openMenu={openMenu} setOpenMenu={setOpenMenu}
            >
              <OptionList
                options={Array.from(locationCounts.keys()).sort()}
                counts={locationCounts}
                selected={selectedLocations}
                onToggle={(v) => toggleValue(v, selectedLocations, setSelectedLocations)}
              />
            </FilterPill>

            <FilterPill
              id="industry" label="Industry" count={selectedIndustries.length}
              openMenu={openMenu} setOpenMenu={setOpenMenu}
            >
              <OptionList
                options={Array.from(industryCounts.keys()).sort()}
                counts={industryCounts}
                selected={selectedIndustries}
                onToggle={(v) => toggleValue(v, selectedIndustries, setSelectedIndustries)}
              />
            </FilterPill>

            <FilterPill
              id="price" label="Price" count={rangesActive.valuation ? 1 : 0}
              openMenu={openMenu} setOpenMenu={setOpenMenu}
            >
              <RangeControl
                label="Asking price" suffix="M" minMax={DEFAULT_VALUATION}
                value={valuation} onChange={(v) => { setValuation(v); setCurrentPage(1) }}
              />
            </FilterPill>

            <FilterPill
              id="seller" label="Seller" count={selectedSellerTypes.length + selectedMotivations.length}
              openMenu={openMenu} setOpenMenu={setOpenMenu} wide
            >
              <p className="text-[10px] font-bold tracking-widest uppercase mb-2" style={{ color: COLOR_TEXT_SECONDARY }}>Seller type</p>
              <OptionList
                options={Array.from(sellerTypeCounts.keys()).sort()}
                counts={sellerTypeCounts}
                selected={selectedSellerTypes}
                onToggle={(v) => toggleValue(v, selectedSellerTypes, setSelectedSellerTypes)}
                raw
              />
              <p className="text-[10px] font-bold tracking-widest uppercase mt-4 mb-2" style={{ color: COLOR_TEXT_SECONDARY }}>Motivation</p>
              <OptionList
                options={Array.from(motivationCounts.keys()).sort()}
                counts={motivationCounts}
                selected={selectedMotivations}
                onToggle={(v) => toggleValue(v, selectedMotivations, setSelectedMotivations)}
                raw
              />
            </FilterPill>

            <FilterPill
              id="more" label="More" icon={<SlidersHorizontal size={13} />}
              count={(rangesActive.revenue ? 1 : 0) + (rangesActive.heat ? 1 : 0) + (rangesActive.quality ? 1 : 0)}
              openMenu={openMenu} setOpenMenu={setOpenMenu} wide
            >
              <RangeControl label="Annual revenue" suffix="M" minMax={DEFAULT_REVENUE} value={revenue} onChange={(v) => { setRevenue(v); setCurrentPage(1) }} />
              <div className="mt-4"><RangeControl label="Heat score" suffix="°" minMax={DEFAULT_HEAT} value={heatScore} onChange={(v) => { setHeatScore(v); setCurrentPage(1) }} /></div>
              <div className="mt-4"><RangeControl label="Quality score" suffix="%" minMax={DEFAULT_QUALITY} value={successProb} onChange={(v) => { setSuccessProb(v); setCurrentPage(1) }} /></div>
            </FilterPill>

            <div className="flex-1" />

            <select
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1) }}
              className="px-3 py-2 rounded-full border text-sm bg-white font-semibold focus:outline-none"
              style={{ borderColor: COLOR_BORDER, color: COLOR_PRIMARY }}
            >
              <option value="premium">⭐ Featured first</option>
              <option value="newest">✨ Newest</option>
              <option value="oldest">📅 Oldest</option>
              <option value="heat">🔥 Hottest</option>
              <option value="roi">💰 Highest ROI</option>
              <option value="valuation">💵 Lowest price</option>
            </select>

            <SaveSearchButton
              filters={{
                industries: selectedIndustries,
                country: selectedLocations[0],
                minPrice: rangesActive.valuation ? Math.round(valuation.min * 1_000_000 * 100) : undefined,
                maxPrice: rangesActive.valuation ? Math.round(valuation.max * 1_000_000 * 100) : undefined,
                minHeatScore: heatScore.min !== 0 ? heatScore.min : undefined,
              }}
            />

            <SavedViewsMenu />

            {/* Institutional view — opens a TanStack-powered, sortable data
                table for analysts evaluating dozens of deals at once. */}
            <Link
              href="/marketplace/table"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border bg-white text-sm font-semibold transition-colors"
              style={{ borderColor: COLOR_BORDER, color: COLOR_PRIMARY }}
              onMouseEnter={(e) => { e.currentTarget.style.background = palette.cream[100] }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '' }}
              title="Open the institutional view — sortable table, CSV export, bulk actions"
            >
              <SlidersHorizontal size={14} /> Table view
            </Link>
          </div>

          {/* Active filter chips — one tap to remove any individual filter */}
          {chips.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap pt-3">
              {chips.map((chip, i) => (
                <button
                  key={`${chip.label}-${i}`}
                  onClick={chip.remove}
                  className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1.5 rounded-full text-xs font-bold border hover:bg-gray-50 transition-colors"
                  style={{ borderColor: COLOR_ACCENT, color: COLOR_ACCENT, background: palette.champagne[50] }}
                >
                  {chip.label}
                  <X size={12} />
                </button>
              ))}
              <button onClick={clearAllFilters} className="text-xs font-bold hover:opacity-70 ml-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ─── Main grid (full width — this is the ONLY section filters touch) ── */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="mb-5 flex items-baseline justify-between">
          <h2 className="text-lg font-black" style={{ color: COLOR_PRIMARY }}>
            {isLoading
              ? 'Loading listings…'
              : activeFiltersCount > 0
                ? `${filteredListings.length} ${filteredListings.length === 1 ? 'listing' : 'listings'}`
                : `All ${activeDeals.length} verified listings`}
          </h2>
          {activeFiltersCount > 0 && !isLoading && (
            <span className="text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>
              filtered from {activeDeals.length}
            </span>
          )}
        </div>

        {isLoading ? (
          <div className="space-y-16 mb-8" aria-busy="true">
            {[0, 1].map((i) => (
              <div key={i} className="grid md:grid-cols-5 gap-10 items-center">
                <div className="md:col-span-2 rounded-2xl bg-gray-100 animate-pulse" style={{ height: 320 }} />
                <div className="md:col-span-3 space-y-4">
                  <div className="h-3 w-44 bg-gray-100 animate-pulse rounded" />
                  <div className="h-9 w-80 bg-gray-100 animate-pulse rounded" />
                  <div className="h-20 w-full bg-gray-100 animate-pulse rounded" />
                  <div className="h-12 w-2/3 bg-gray-100 animate-pulse rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : loadError ? (
          <div className="text-center py-20 px-6">
            <p className="text-2xl font-black mb-2" style={{ color: COLOR_PRIMARY }}>Couldn&apos;t load listings</p>
            <p className="text-base mb-6" style={{ color: COLOR_TEXT_SECONDARY }}>Network hiccup. Try refreshing the page.</p>
            <button onClick={() => window.location.reload()} className="px-5 py-3 rounded-lg font-bold text-white hover:opacity-90" style={{ background: COLOR_ACCENT }}>Refresh</button>
          </div>
        ) : currentListings.length > 0 ? (
          <>
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-16 md:space-y-20 mb-8">
              {currentListings.map((deal, idx) => (
                <EditorialRow
                  key={deal.id}
                  deal={deal}
                  flip={idx % 2 === 1}
                  isSaved={savedDeals.isSaved(deal.id)}
                  onSave={() => savedDeals.toggle(deal.id)}
                  onViewPhotos={() => {
                    setSelectedDealPhotos([deal.image])
                    setPhotoModalOpen(true)
                  }}
                />
              ))}
            </motion.div>

            {totalPages > 1 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-center gap-2 py-8">
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="p-2 rounded-lg border transition-all hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed" style={{ borderColor: COLOR_BORDER, color: COLOR_PRIMARY }}><ChevronLeft size={20} /></button>
                {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                  const pageNum = currentPage <= 3 ? i + 1 : currentPage >= totalPages - 2 ? totalPages - 4 + i : currentPage - 2 + i
                  return (
                    <button key={pageNum} onClick={() => handlePageChange(pageNum)} className={`px-4 py-2 rounded-lg font-semibold transition-all ${currentPage === pageNum ? 'text-white' : 'border hover:bg-gray-50'}`} style={currentPage === pageNum ? { background: COLOR_ACCENT } : { borderColor: COLOR_BORDER, color: COLOR_PRIMARY }}>{pageNum}</button>
                  )
                })}
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 rounded-lg border transition-all hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed" style={{ borderColor: COLOR_BORDER, color: COLOR_PRIMARY }}><ChevronRight size={20} /></button>
                <span className="ml-4 text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>Page {currentPage} of {totalPages}</span>
              </motion.div>
            )}
          </>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 px-6">
            <p className="text-2xl font-black mb-2" style={{ color: COLOR_PRIMARY }}>
              No listings match {activeFiltersCount > 0 ? `your ${activeFiltersCount} filter${activeFiltersCount === 1 ? '' : 's'}` : 'your search'}
            </p>
            <p className="text-base mb-6" style={{ color: COLOR_TEXT_SECONDARY }}>
              {activeFiltersCount > 0
                ? `Try removing a filter chip above. ${activeDeals.length} listings total.`
                : 'No listings published yet.'}
            </p>
            {activeFiltersCount > 0 && (
              <button onClick={clearAllFilters} className="px-5 py-3 rounded-lg font-bold text-white hover:opacity-90" style={{ background: COLOR_ACCENT }}>
                Clear all filters → show {activeDeals.length} listings
              </button>
            )}
          </motion.div>
        )}
      </div>

      <BusinessPhotoGallery isOpen={photoModalOpen} onClose={() => setPhotoModalOpen(false)} photos={selectedDealPhotos} businessType="Business" />
    </div>
  )
}

/* ─── Editorial listing row — full data parity with the old ListingCard ───── */

const fmtMoney = (n: number) =>
  n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(1)}M` : n >= 1_000 ? `$${Math.round(n / 1_000)}K` : `$${Math.round(n)}`

function EditorialRow({
  deal, flip, isSaved, onSave, onViewPhotos,
}: {
  deal: Deal
  flip: boolean
  isSaved: boolean
  onSave: () => void
  onViewPhotos: () => void
}) {
  const headline = maskedHeadline(deal)
  const narrative = generateNarrative(deal)
  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5 }}
      className={`grid md:grid-cols-5 gap-8 md:gap-12 items-start ${flip ? 'md:[direction:rtl]' : ''}`}
    >
      {/* ── Media + actions panel — image top-aligned with the text column,
            CTA stack directly beneath so actions live with the media. ── */}
      <div className="[direction:ltr] md:col-span-2">
        <div className="relative group">
          <Link href={detailHref(deal)} className="block rounded-2xl overflow-hidden shadow-sm" style={{ aspectRatio: '16/11' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={deal.image} alt="Confidential business listing" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
          </Link>
          {/* Status chip */}
          {deal.status !== 'STANDARD' && (
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-black tracking-wide text-white" style={{ background: deal.status === 'FEATURED' ? COLOR_ACCENT : palette.emerald[500] }}>
              {deal.status === 'FEATURED' ? '★ FEATURED' : 'NEW'}
            </div>
          )}
          {/* Heat chip */}
          {deal.heatIndex >= 85 && (
            <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold text-white backdrop-blur" style={{ background: 'rgba(26,26,26,0.75)' }}>
              <Sparkles size={10} className="inline mr-1 -mt-0.5" />
              Most-watched · {deal.heatIndex}°
            </div>
          )}
          {/* Photos */}
          <div className="absolute top-3 right-3 flex gap-2">
            <button onClick={onViewPhotos} aria-label="View photos" className="p-2 rounded-full bg-white/90 backdrop-blur shadow-md hover:shadow-lg transition-all">
              <Camera size={14} style={{ color: COLOR_TEXT_SECONDARY }} />
            </button>
          </div>
        </div>

        {/* CTA stack — Contact seller is the highest-intent action, so it
            leads. View listing secondary; Save stays quiet. */}
        <div className="mt-4 space-y-2">
          <Link
            href={deal.slug ? `/listing/${deal.slug}/contact` : detailHref(deal)}
            className="flex items-center justify-center gap-2 w-full px-5 py-3 rounded-lg font-bold text-white hover:opacity-90 transition-opacity text-sm"
            style={{ background: COLOR_PRIMARY }}
          >
            <Mail size={14} /> Contact seller
          </Link>
          <div className="flex gap-2">
            <Link
              href={detailHref(deal)}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-bold border bg-white hover:bg-gray-50 transition-colors text-sm"
              style={{ borderColor: COLOR_BORDER, color: COLOR_PRIMARY }}
            >
              View listing <ArrowRight size={13} />
            </Link>
            <button
              onClick={onSave}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg font-bold border bg-white hover:bg-gray-50 transition-colors text-sm"
              style={{ borderColor: isSaved ? COLOR_ACCENT : COLOR_BORDER, color: isSaved ? COLOR_ACCENT : COLOR_TEXT_SECONDARY }}
            >
              <Heart size={13} className={isSaved ? 'fill-current' : ''} />
              {isSaved ? 'Saved' : 'Save'}
            </button>
          </div>
        </div>
      </div>

      {/* ── Text panel ── */}
      <div className="[direction:ltr] md:col-span-3">
        <p className="text-[11px] font-bold tracking-[0.22em] mb-3" style={{ color: COLOR_TEXT_SECONDARY }}>
          {narrativeEyebrow(deal)} · LISTED {deal.daysOnMarket}D AGO
        </p>

        <Link href={detailHref(deal)} className="block hover:opacity-80 transition-opacity">
          <h3 className="text-2xl md:text-3xl font-black leading-tight mb-2" style={{ color: COLOR_PRIMARY }}>
            {headline}
          </h3>
        </Link>
        <div className="flex items-center gap-2 mb-3">
          <Lock size={12} style={{ color: COLOR_ACCENT }} />
          <span className="text-[11px] font-bold" style={{ color: COLOR_ACCENT }}>Identity shared after NDA with verified buyers</span>
        </div>

        {/* Badge row — trust + position signals from the old card */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {deal.sellerVerified && <Badge bg={palette.emerald[50]} color={palette.emerald[500]}><CheckCircle2 size={10} className="inline mr-1 -mt-0.5" />Verified · trust {deal.sellerTrustScore}/100</Badge>}
          {deal.marketPosition === 'underpriced' && <Badge bg={palette.emerald[50]} color={palette.emerald[500]}>Below market</Badge>}
          {deal.marketPosition === 'premium' && <Badge bg={palette.amber[50]} color={palette.amber[500]}>Premium positioning</Badge>}
          {deal.marketTrend === 'up' && <Badge bg={palette.champagne[50]} color={palette.champagne[700]}>Trending ↑</Badge>}
          {deal.financingEligible && <Badge bg={palette.champagne[50]} color={palette.champagne[700]}>Financing eligible</Badge>}
        </div>

        {/* AI narrative */}
        <p className="text-sm md:text-base leading-relaxed mb-5" style={{ color: COLOR_TEXT_SECONDARY }}>
          {narrative}
        </p>

        {/* Primary stat strip — hairline rules */}
        <div className="flex divide-x mb-4 overflow-x-auto" style={{ borderColor: COLOR_BORDER }}>
          <StatCell label="Asking" value={fmtMoney(deal.askingPrice)} first highlight />
          <StatCell label="Revenue" value={fmtMoney(deal.annualRevenue)} />
          <StatCell label="EBITDA" value={fmtMoney(deal.ebitda)} />
          <StatCell label="Cash flow" value={`${fmtMoney(deal.cashFlowMin)}–${fmtMoney(deal.cashFlowMax)}`} />
        </div>

        {/* Secondary metrics — every remaining data point from the old card */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-x-4 gap-y-2 text-[11px]">
          <MiniStat label="Margin" value={`${deal.profitMarginPercent}%`} />
          <MiniStat label="ROI" value={`${deal.roiProjection}%`} />
          <MiniStat label="Payback" value={`${deal.paybackPeriod}mo`} />
          <MiniStat label="Growth" value={`↗ ${deal.growthRate}%`} positive />
          <MiniStat label="Quality" value={`${deal.dealQualityScore}/100`} />
          <MiniStat label="Team" value={`${deal.employeeCount}`} />
        </div>
      </div>
    </motion.article>
  )
}

function Badge({ bg, color, children }: { bg: string; color: string; children: React.ReactNode }) {
  return (
    <span className="px-2 py-1 rounded-full text-[10px] font-bold" style={{ background: bg, color }}>
      {children}
    </span>
  )
}

function StatCell({ label, value, first, highlight }: { label: string; value: string; first?: boolean; highlight?: boolean }) {
  return (
    <div className={`${first ? 'pr-4' : 'px-4'} flex-shrink-0`}>
      <p className="text-[10px] font-bold tracking-widest uppercase mb-0.5" style={{ color: COLOR_TEXT_SECONDARY }}>{label}</p>
      <p className="text-base md:text-lg font-black whitespace-nowrap" style={{ color: highlight ? COLOR_ACCENT : COLOR_PRIMARY }}>{value}</p>
    </div>
  )
}

function MiniStat({ label, value, positive }: { label: string; value: string; positive?: boolean }) {
  return (
    <div>
      <span className="block font-semibold" style={{ color: COLOR_TEXT_SECONDARY }}>{label}</span>
      <span className="font-black text-xs" style={{ color: positive ? palette.emerald[500] : COLOR_PRIMARY }}>{value}</span>
    </div>
  )
}

/* ─── Filter bar building blocks ──────────────────────────────────────────── */

function FilterPill({
  id, label, count, icon, openMenu, setOpenMenu, wide, children,
}: {
  id: string
  label: string
  count: number
  icon?: React.ReactNode
  openMenu: string | null
  setOpenMenu: (v: string | null) => void
  wide?: boolean
  children: React.ReactNode
}) {
  const isOpen = openMenu === id
  const active = count > 0
  return (
    <div className="relative flex-shrink-0">
      <button
        onClick={() => setOpenMenu(isOpen ? null : id)}
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border text-sm font-bold transition-colors hover:bg-gray-50"
        style={{
          borderColor: active || isOpen ? COLOR_ACCENT : COLOR_BORDER,
          color: active ? COLOR_ACCENT : COLOR_PRIMARY,
          background: active ? palette.champagne[50] : 'white',
        }}
        aria-expanded={isOpen}
      >
        {icon}
        {label}
        {active && (
          <span className="w-5 h-5 rounded-full text-[10px] font-black text-white flex items-center justify-center" style={{ background: COLOR_ACCENT }}>
            {count}
          </span>
        )}
        <ChevronDown size={14} style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform .15s' }} />
      </button>
      {isOpen && (
        <>
          {/* click-outside catcher */}
          <div className="fixed inset-0 z-30" onClick={() => setOpenMenu(null)} />
          <div
            className={`absolute z-40 mt-2 ${wide ? 'w-80' : 'w-64'} max-h-[26rem] overflow-y-auto rounded-2xl border bg-white shadow-xl p-4 left-0`}
            style={{ borderColor: COLOR_BORDER }}
          >
            {children}
          </div>
        </>
      )}
    </div>
  )
}

function OptionList({
  options, counts, selected, onToggle, raw,
}: {
  options: string[]
  counts: Map<string, number>
  selected: string[]
  onToggle: (v: string) => void
  raw?: boolean
}) {
  if (options.length === 0) {
    return <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>No options yet.</p>
  }
  return (
    <div className="space-y-1">
      {options.map((value) => {
        const checked = selected.includes(value)
        return (
          <label
            key={value}
            className="flex items-center justify-between gap-3 px-2 py-1.5 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <span className="flex items-center gap-2.5">
              <input type="checkbox" checked={checked} onChange={() => onToggle(value)} className="w-4 h-4 rounded cursor-pointer" style={{ accentColor: palette.champagne[500] }} />
              <span className="text-sm font-medium" style={{ color: COLOR_PRIMARY }}>
                {raw ? value : formatLabel(value)}
              </span>
            </span>
            <span className="text-xs tabular-nums" style={{ color: COLOR_TEXT_SECONDARY }}>{counts.get(value) ?? 0}</span>
          </label>
        )
      })}
    </div>
  )
}

function formatLabel(name: string): string {
  const SPECIAL: Record<string, string> = { SAAS: 'SaaS', USA: 'USA', UAE: 'UAE', KSA: 'KSA', EDTECH: 'EdTech', FINTECH: 'FinTech', ECOMMERCE: 'E-Commerce' }
  const upper = name.toUpperCase()
  if (SPECIAL[upper]) return SPECIAL[upper]
  return upper.split('_').map((p) => p.charAt(0) + p.slice(1).toLowerCase()).join(' ')
}

function RangeControl({
  label, suffix, minMax, value, onChange,
}: {
  label: string
  suffix: string
  minMax: { min: number; max: number }
  value: { min: number; max: number }
  onChange: (v: { min: number; max: number }) => void
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <p className="text-sm font-bold" style={{ color: COLOR_PRIMARY }}>{label}</p>
        <p className="text-xs tabular-nums" style={{ color: COLOR_TEXT_SECONDARY }}>
          {value.min}{suffix} – {value.max}{suffix}
        </p>
      </div>
      <div className="space-y-2">
        <input
          type="range" min={minMax.min} max={minMax.max} step="0.1" value={value.min}
          onChange={(e) => onChange({ min: Math.min(parseFloat(e.target.value), value.max), max: value.max })}
          className="w-full" style={{ accentColor: palette.champagne[500] }}
          aria-label={`${label} minimum`}
        />
        <input
          type="range" min={minMax.min} max={minMax.max} step="0.1" value={value.max}
          onChange={(e) => onChange({ min: value.min, max: Math.max(parseFloat(e.target.value), value.min) })}
          className="w-full" style={{ accentColor: palette.champagne[500] }}
          aria-label={`${label} maximum`}
        />
      </div>
    </div>
  )
}

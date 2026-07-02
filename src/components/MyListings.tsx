'use client'

/**
 * Per-deal control panel for the seller / broker dashboard.
 *
 * Each listing renders as a row with status chip, plan chip, and the full
 * lifecycle action set: Edit (deep-link to listing edit), Unlist, Relist,
 * Sold, Cancel, Upgrade to Premium, Downgrade.
 *
 * All actions call POST /api/seller/deals/[id]/action (or /upgrade
 * triggers Stripe checkout flow). Only the deal's seller (or an admin)
 * can hit them — the API enforces that.
 */
import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Eye, EyeOff, RotateCw, CheckCircle2, XCircle, ArrowUpCircle,
  ArrowDownCircle, Edit3, Inbox, ExternalLink, Loader, AlertCircle,
  Sparkles, Building2,
} from 'lucide-react'
import { COLOR_PRIMARY, COLOR_TEXT_SECONDARY, COLOR_BORDER } from '@/styles/forward-colors'
import { industryLabel } from '@/lib/listing-narrative'
import { maskCity } from '@/lib/listing-helpers'

interface Deal {
  id: string
  slug: string | null
  title: string
  industry: string
  country: string
  city: string | null
  askingPrice: number | null
  status: string
  dealPlan: string
  dealPlanActiveUntil: string | null
  enquiryCount: number
  publishedAt: string | null
  closedAt: string | null
}

const STATUS_LABEL: Record<string, { label: string; color: string; bg: string }> = {
  ACTIVE:    { label: 'Live',        color: '#15803D', bg: '#EAF5F0' },
  PUBLISHED: { label: 'Live',        color: '#15803D', bg: '#EAF5F0' },
  DRAFT:     { label: 'Draft',       color: '#6B6760', bg: '#F4F2EE' },
  ARCHIVED:  { label: 'Unlisted',    color: '#B45309', bg: '#FEF3C7' },
  CLOSED:    { label: 'Sold',        color: '#8C6D45', bg: '#FAF6EF' },
  WITHDRAWN: { label: 'Cancelled',   color: '#9A938A', bg: '#F4F2EE' },
}

export function MyListings() {
  const [deals, setDeals] = useState<Deal[] | null>(null)
  const [loadError, setLoadError] = useState(false)

  async function load() {
    try {
      const r = await fetch('/api/seller/deals', { credentials: 'include' })
      if (!r.ok) { setLoadError(true); return }
      const data = await r.json()
      setDeals(data.deals || [])
    } catch {
      setLoadError(true)
    }
  }
  useEffect(() => { load() }, [])

  if (loadError) {
    return <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>Couldn&apos;t load your listings.</p>
  }
  if (deals === null) {
    return (
      <div className="space-y-3">
        {[0, 1].map((i) => (
          <div key={i} className="rounded-xl border bg-white animate-pulse" style={{ borderColor: COLOR_BORDER, height: 110 }} />
        ))}
      </div>
    )
  }
  if (deals.length === 0) {
    return (
      <div className="rounded-xl border bg-white p-8 text-center" style={{ borderColor: COLOR_BORDER }}>
        <p className="text-base font-bold mb-1" style={{ color: COLOR_PRIMARY }}>No listings yet.</p>
        <p className="text-sm mb-4" style={{ color: COLOR_TEXT_SECONDARY }}>Publish your first confidential listing in 90 seconds.</p>
        <Link href="/list" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-white text-sm hover:opacity-90" style={{ background: COLOR_PRIMARY }}>List a business</Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {deals.map((d) => (
        <DealRow key={d.id} deal={d} onChange={load} />
      ))}
    </div>
  )
}

function DealRow({ deal, onChange }: { deal: Deal; onChange: () => void }) {
  const status = STATUS_LABEL[deal.status] || STATUS_LABEL.DRAFT
  const isPremium = deal.dealPlan === 'PREMIUM' && (!deal.dealPlanActiveUntil || new Date(deal.dealPlanActiveUntil) > new Date())
  const askDollars = deal.askingPrice != null ? Number(deal.askingPrice) / 100 : null
  const askFmt = askDollars == null ? '—' : askDollars >= 1_000_000 ? `$${(askDollars / 1_000_000).toFixed(2)}M` : askDollars >= 1_000 ? `$${Math.round(askDollars / 1_000)}K` : '—'

  const [busy, setBusy] = useState<string | null>(null)
  const [error, setError] = useState('')

  const canUnlist = deal.status === 'ACTIVE' || deal.status === 'PUBLISHED'
  const canRelist = deal.status === 'ARCHIVED' || deal.status === 'WITHDRAWN'
  const canMarkSold = deal.status === 'ACTIVE' || deal.status === 'PUBLISHED'
  const canCancel = deal.status !== 'WITHDRAWN' && deal.status !== 'CLOSED'

  async function fire(action: string, confirmMessage?: string) {
    if (confirmMessage && !confirm(confirmMessage)) return

    // Outcome capture on close: optional, but every recorded final price
    // strengthens the platform's comparables and predictive dataset.
    let extra: Record<string, unknown> = {}
    if (action === 'sold') {
      const raw = prompt(
        'Final sale price in USD (optional — improves market comparables; kept private, never shown on your listing):'
      )
      if (raw && raw.trim()) {
        const parsed = Number(raw.replace(/[$,\s]/g, ''))
        if (Number.isFinite(parsed) && parsed > 0) extra = { finalPriceUsd: parsed }
      }
    }

    setBusy(action); setError('')
    try {
      const r = await fetch(`/api/seller/deals/${deal.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ...extra }),
      })
      const data = await r.json()
      if (!r.ok) { setError(data.error || 'Action failed'); return }
      onChange()
    } catch {
      setError('Network error')
    } finally {
      setBusy(null)
    }
  }

  function goToUpgrade() {
    // Stripe checkout flow — wired once Stripe price ids are set in Vercel.
    window.location.href = `/api/billing/checkout?tier=SELLER_PREMIUM&dealId=${deal.id}`
  }

  return (
    <div className="rounded-xl border bg-white p-5" style={{ borderColor: COLOR_BORDER }}>
      <div className="flex items-start gap-4 flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase" style={{ color: status.color, background: status.bg }}>
              {status.label}
            </span>
            {isPremium && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase" style={{ color: '#B8956A', background: '#FAF6EF' }}>
                <Sparkles size={9} /> Premium
              </span>
            )}
            {deal.enquiryCount > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase" style={{ color: '#8C6D45', background: '#FAF6EF' }}>
                <Inbox size={9} /> {deal.enquiryCount} inquir{deal.enquiryCount === 1 ? 'y' : 'ies'}
              </span>
            )}
          </div>
          <p className="font-bold text-sm leading-snug" style={{ color: COLOR_PRIMARY }}>
            Confidential {industryLabel(deal.industry)} · {maskCity(deal.city, deal.country)}
          </p>
          <p className="text-xs mt-0.5" style={{ color: COLOR_TEXT_SECONDARY }}>
            Asking {askFmt} · Listing id <span className="font-mono">{deal.id.slice(-8).toUpperCase()}</span>
          </p>
        </div>
        <Link
          href={deal.slug ? `/listing/${deal.slug}` : `/deal/${deal.id}`}
          target="_blank"
          className="inline-flex items-center gap-1 text-xs font-bold hover:underline"
          style={{ color: COLOR_TEXT_SECONDARY }}
        >
          View public page <ExternalLink size={11} />
        </Link>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <ActionButton icon={<Edit3 size={12} />} label="Edit" href={`/seller/edit/${deal.id}`} />
        {isPremium
          ? <ActionButton icon={<ArrowDownCircle size={12} />} label="Downgrade to Basic" busy={busy === 'downgrade'} onClick={() => fire('downgrade')} />
          : <ActionButton icon={<ArrowUpCircle size={12} />} label="Upgrade to Premium · $199/mo" highlight onClick={goToUpgrade} />}
        {canUnlist && <ActionButton icon={<EyeOff size={12} />} label="Unlist" busy={busy === 'unlist'} onClick={() => fire('unlist')} />}
        {canRelist && <ActionButton icon={<Eye size={12} />} label="Relist" busy={busy === 'relist'} onClick={() => fire('relist')} />}
        {canMarkSold && <ActionButton icon={<CheckCircle2 size={12} />} label="Mark sold" busy={busy === 'sold'} onClick={() => fire('sold', 'Mark this listing as SOLD? Followers will be notified anonymously and this listing will move to your Closed history.')} />}
        {canCancel && <ActionButton icon={<XCircle size={12} />} label="Cancel" busy={busy === 'cancel'} onClick={() => fire('cancel', 'Cancel this listing permanently? You can relist a new one anytime.')} />}
      </div>

      {error && (
        <div className="mt-3 rounded-lg border p-2.5 text-xs flex items-center gap-2" style={{ borderColor: '#FCA5A5', background: '#FEE2E2', color: '#991B1B' }}>
          <AlertCircle size={13} /> {error}
        </div>
      )}
    </div>
  )
}

function ActionButton({
  icon, label, onClick, href, busy, highlight,
}: {
  icon: React.ReactNode; label: string
  onClick?: () => void; href?: string; busy?: boolean; highlight?: boolean
}) {
  const className = 'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
  const style = highlight
    ? { background: COLOR_PRIMARY, color: 'white', borderColor: COLOR_PRIMARY }
    : { background: 'white', color: COLOR_PRIMARY, borderColor: COLOR_BORDER }
  if (href) {
    return <Link href={href} className={className} style={style}>{icon}{label}</Link>
  }
  return (
    <button onClick={onClick} disabled={busy} className={className} style={style}>
      {busy ? <Loader size={12} className="animate-spin" /> : icon}
      {label}
    </button>
  )
}

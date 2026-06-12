'use client'

/**
 * Read-only dashboard tour shown to visitors who tap "Demo Seller / Buyer /
 * Broker" on the login page. Replaces the old prefilled-credentials approach
 * which required real DB accounts and was a footgun (a visitor could land in
 * a real session and mutate state — fake inquiries, marked-sold deals, etc).
 *
 * Tradeoffs: screenshot-based, so it never goes out of sync with the dashboard
 * IF we refresh the images. Storage in /public/demo/ (Vercel CDN, free).
 */
import { useEffect } from 'react'
import Link from 'next/link'
import { X, Lock, ArrowRight, UserPlus } from 'lucide-react'
import { COLOR_PRIMARY, COLOR_TEXT_SECONDARY, COLOR_BORDER, COLOR_ACCENT, COLOR_BG_PRIMARY } from '@/styles/forward-colors'

export type DemoRole = 'seller' | 'buyer' | 'broker'

interface RoleConfig {
  label: string
  blurb: string
  highlights: string[]
  screenshot: string // public path
  signupHref: string
}

const ROLE: Record<DemoRole, RoleConfig> = {
  seller: {
    label: 'Seller Dashboard',
    blurb: 'See how Forward shows you the buyers, the inquiries, and the deal velocity for every listing you publish.',
    highlights: [
      'Per-listing controls — Edit, Unlist, Mark sold, Upgrade to Premium',
      'Verified inquiry inbox with buyer-profile snapshots',
      'Performance analytics: views, watchers, inquiries, growth',
      'One-click confidential listing publishing in 90 seconds',
    ],
    screenshot: '/demo/seller-dashboard.png',
    signupHref: '/auth/signup?type=seller',
  },
  buyer: {
    label: 'Buyer Dashboard',
    blurb: 'See how Forward Intelligence ranks, scores, and matches confidential opportunities to your acquisition thesis.',
    highlights: [
      'Saved listings, saved searches, deal alerts',
      'Forward Score + Quality Score on every listing',
      'Anonymized comparables (Premium) and acquisition scoring',
      'Binding introductions to verified sellers via Forward',
    ],
    screenshot: '/demo/buyer-dashboard.png',
    signupHref: '/auth/signup?type=buyer',
  },
  broker: {
    label: 'Broker Dashboard',
    blurb: 'See how brokers manage their book, prospect with AI, and run their deal rooms inside Forward.',
    highlights: [
      'Unlimited listings + per-deal lifecycle controls',
      'In-app CRM, deal room, marketing automation',
      'AI prospecting — find your next listing',
      'Realtime updates + one-click contact-seller from email',
    ],
    screenshot: '/demo/broker-dashboard.png',
    signupHref: '/auth/signup?type=broker',
  },
}

export function DashboardTour({ role, onClose }: { role: DemoRole; onClose: () => void }) {
  const cfg = ROLE[role]

  // ESC closes; lock body scroll while open.
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [onClose])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="dashboard-tour-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(15,20,25,0.78)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[92vh] overflow-hidden flex flex-col"
        style={{ border: `1px solid ${COLOR_BORDER}` }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b flex items-start gap-4" style={{ borderColor: COLOR_BORDER, background: COLOR_BG_PRIMARY }}>
          <div className="flex-1">
            <p className="text-[10px] font-bold tracking-[0.22em] uppercase mb-1" style={{ color: '#B8956A' }}>
              Read-only preview
            </p>
            <h2 id="dashboard-tour-title" className="text-2xl font-black" style={{ color: COLOR_PRIMARY }}>
              {cfg.label}
            </h2>
            <p className="text-sm mt-1" style={{ color: COLOR_TEXT_SECONDARY }}>{cfg.blurb}</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close tour"
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
            style={{ color: COLOR_TEXT_SECONDARY }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid md:grid-cols-3 gap-0">
            {/* Screenshot */}
            <div className="md:col-span-2 p-6" style={{ background: '#F4F2EE' }}>
              <div className="rounded-xl overflow-hidden shadow-lg border bg-white" style={{ borderColor: COLOR_BORDER }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={cfg.screenshot}
                  alt={`${cfg.label} preview`}
                  className="w-full h-auto block"
                  onError={(e) => {
                    // If the screenshot hasn't been added to /public/demo yet,
                    // render a clear placeholder rather than a broken image.
                    const img = e.currentTarget
                    img.style.display = 'none'
                    const parent = img.parentElement
                    if (parent && !parent.querySelector('.placeholder')) {
                      const ph = document.createElement('div')
                      ph.className = 'placeholder p-16 text-center'
                      ph.innerHTML = `<p style="color:#717171;font-size:13px">Screenshot of the live ${cfg.label.toLowerCase()} will load here.<br><span style="font-size:11px;opacity:.7">Drop a PNG at public${cfg.screenshot}</span></p>`
                      parent.appendChild(ph)
                    }
                  }}
                />
              </div>
              <p className="text-[11px] mt-3 flex items-center gap-1.5" style={{ color: COLOR_TEXT_SECONDARY }}>
                <Lock size={11} /> Demo data only · all confidential signals masked
              </p>
            </div>

            {/* What you get */}
            <div className="p-6 flex flex-col">
              <p className="text-[10px] font-bold tracking-[0.22em] uppercase mb-3" style={{ color: '#B8956A' }}>
                What you get
              </p>
              <ul className="space-y-3 mb-6">
                {cfg.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2 text-sm leading-snug" style={{ color: COLOR_PRIMARY }}>
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#B8956A' }} />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto space-y-2">
                <Link
                  href={cfg.signupHref}
                  className="flex items-center justify-center gap-2 w-full px-5 py-3 rounded-lg font-bold text-white text-sm hover:opacity-90 transition-opacity"
                  style={{ background: COLOR_PRIMARY }}
                  onClick={onClose}
                >
                  <UserPlus size={14} /> Get my own dashboard — free
                </Link>
                <Link
                  href="/marketplace"
                  className="flex items-center justify-center gap-1.5 w-full px-5 py-2.5 rounded-lg font-bold text-sm border bg-white hover:bg-gray-50 transition-colors"
                  style={{ borderColor: COLOR_BORDER, color: COLOR_PRIMARY }}
                  onClick={onClose}
                >
                  Browse the marketplace <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

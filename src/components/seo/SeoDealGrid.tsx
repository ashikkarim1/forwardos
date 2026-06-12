import Link from 'next/link'
import type { SeoDeal } from '@/lib/seo-deals'
import { COLOR_PRIMARY, COLOR_TEXT_SECONDARY, COLOR_BORDER, COLOR_ACCENT } from '@/styles/forward-colors'

const fmtUsd = (n: number) =>
  n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(1)}M` : `$${Math.round(n / 1000)}K`

const titleCase = (s: string) => s.charAt(0) + s.slice(1).toLowerCase()

/**
 * Server-rendered listing grid for SEO pages — plain crawlable links and text,
 * no client JS required.
 */
export function SeoDealGrid({ deals }: { deals: SeoDeal[] }) {
  if (deals.length === 0) {
    return (
      <p className="py-8" style={{ color: COLOR_TEXT_SECONDARY }}>
        New listings are added daily. <Link href="/marketplace" style={{ color: COLOR_ACCENT }}>Browse the full marketplace →</Link>
      </p>
    )
  }
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {deals.map((d) => (
        <Link
          key={d.id}
          href={`/deal/${d.id}`}
          className="block bg-white rounded-xl border p-5 hover:shadow-md transition-shadow"
          style={{ borderColor: COLOR_BORDER }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="px-2 py-0.5 rounded-md text-xs font-semibold" style={{ background: '#FAF6EF', color: COLOR_ACCENT }}>
              {titleCase(d.industry)}
            </span>
            {d.financingEligible && (
              <span className="px-2 py-0.5 rounded-md text-xs font-semibold" style={{ background: '#EAF5F0', color: '#2D7A5F' }}>
                💰 Financing
              </span>
            )}
          </div>
          <h3 className="font-bold leading-snug mb-1" style={{ color: COLOR_PRIMARY }}>{d.title}</h3>
          <p className="text-sm mb-3" style={{ color: COLOR_TEXT_SECONDARY }}>
            📍 {d.city ? `${d.city}, ` : ''}{d.country}
          </p>
          <div className="flex items-center justify-between">
            <span className="font-black" style={{ color: COLOR_ACCENT }}>
              {d.askingPriceUsd != null ? fmtUsd(d.askingPriceUsd) : 'Inquire'}
            </span>
            {d.heatScore != null && (
              <span className="text-xs font-semibold" style={{ color: COLOR_TEXT_SECONDARY }}>🔥 {d.heatScore}</span>
            )}
          </div>
        </Link>
      ))}
    </div>
  )
}

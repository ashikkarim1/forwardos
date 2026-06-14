/**
 * /deals/heat-maps — Industry × Region demand heat map
 *
 * The visual companion to /intelligence/predictions. Predictions tells
 * you WHICH deals will close; Heat Maps tells you WHERE the demand is
 * concentrating so you can pick lanes before they overheat.
 *
 * What we show:
 *   A grid: rows = industries, columns = regions. Each cell is a deal
 *   pool — the count of active listings, the median heat score, and a
 *   color band derived from those two combined. Hot cells are the
 *   sector × region intersections where buyers should focus.
 *
 * Access model:
 *   - Free buyers see the grid with counts but heat scores blurred +
 *     an upgrade CTA. They can FEEL where the action is.
 *   - Buyer Premium / Admin see full heat scores + cell-level drill.
 *
 * Data source:
 *   Real deals from Prisma. We aggregate heatScore by (industry, country)
 *   and bucket countries into 4 macro regions to keep the grid readable.
 */
import Link from 'next/link'
import { ArrowRight, Sparkles, Info, Lock } from 'lucide-react'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { LockedFeature } from '@/components/dashboard/LockedFeature'
import { PublicHeader } from '@/components/Navigation'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Heat Maps · Forward Intelligence' }

const INDUSTRIES = [
  'SAAS', 'HEALTHCARE', 'ECOMMERCE', 'FINTECH', 'MANUFACTURING',
  'PROFESSIONAL_SERVICES', 'HOSPITALITY', 'EDUCATION', 'LOGISTICS', 'OTHER',
] as const
type Industry = typeof INDUSTRIES[number]

const REGIONS = ['USA', 'Canada', 'UAE', 'Other'] as const
type Region = typeof REGIONS[number]

function countryToRegion(country: string | null | undefined): Region {
  if (!country) return 'Other'
  const c = country.toUpperCase()
  if (c === 'USA' || c === 'US' || c === 'UNITED STATES') return 'USA'
  if (c === 'CA' || c === 'CANADA') return 'Canada'
  if (c === 'AE' || c === 'UAE' || c === 'UNITED ARAB EMIRATES') return 'UAE'
  return 'Other'
}

interface Cell {
  count: number
  medianHeat: number
  topHeat: number  // 90th-pct heat in the cell, for "is anything hot here?"
}

function pct(arr: number[], p: number): number {
  if (arr.length === 0) return 0
  const sorted = [...arr].sort((a, b) => a - b)
  const idx = Math.floor((p / 100) * (sorted.length - 1))
  return sorted[idx]
}

async function loadGrid(): Promise<Record<Industry, Record<Region, Cell>>> {
  const deals = await prisma.deal.findMany({
    where: { status: { in: ['PUBLISHED', 'ACTIVE'] } },
    select: { industry: true, country: true, heatScore: true },
  }).catch(() => [])

  // Bucket every deal into (industry, region).
  const buckets: Record<string, number[]> = {}
  for (const d of deals) {
    const ind = (INDUSTRIES as readonly string[]).includes(String(d.industry))
      ? (String(d.industry) as Industry)
      : 'OTHER'
    const reg = countryToRegion(d.country)
    const key = `${ind}|${reg}`
    if (!buckets[key]) buckets[key] = []
    buckets[key].push(d.heatScore ?? 50)
  }

  const grid: Record<Industry, Record<Region, Cell>> = {} as never
  for (const ind of INDUSTRIES) {
    grid[ind] = {} as Record<Region, Cell>
    for (const reg of REGIONS) {
      const list = buckets[`${ind}|${reg}`] ?? []
      grid[ind][reg] = {
        count: list.length,
        medianHeat: list.length ? pct(list, 50) : 0,
        topHeat:    list.length ? pct(list, 90) : 0,
      }
    }
  }

  return grid
}

// Cell color from combined demand × supply signal.
// High heat with low supply (count) = scarce + hot = "overheated lane".
// High heat with high supply = "active market".
// Low heat anywhere = "cold lane".
function cellColor(cell: Cell): { bg: string; ink: string; band: string } {
  if (cell.count === 0)       return { bg: '#F4F4F4', ink: '#9CA3AF', band: 'Empty' }
  if (cell.medianHeat >= 80)  return { bg: '#1B7F4E', ink: '#FFFFFF', band: 'Overheated' }
  if (cell.medianHeat >= 65)  return { bg: '#2E8B57', ink: '#FFFFFF', band: 'Active' }
  if (cell.medianHeat >= 45)  return { bg: '#F2EAD9', ink: '#0F1419', band: 'Warm' }
  return { bg: '#F4F4F4', ink: '#6C7480', band: 'Cool' }
}

const INDUSTRY_LABEL: Record<Industry, string> = {
  SAAS: 'SaaS', HEALTHCARE: 'Healthcare', ECOMMERCE: 'E-commerce',
  FINTECH: 'FinTech', MANUFACTURING: 'Manufacturing',
  PROFESSIONAL_SERVICES: 'Professional Services', HOSPITALITY: 'Hospitality',
  EDUCATION: 'Education', LOGISTICS: 'Logistics', OTHER: 'Other',
}

export default async function HeatMapsPage() {
  const session = await getSession()
  if (!session) {
    return (
      <LockedFeature
        kicker="Intelligence"
        title="Heat Maps"
        pitch="Sign in to see where buyer demand is concentrating by industry × region."
        bullets={[
          'Live heat scores on every active listing',
          'Sector-by-region demand overlays for USA, Canada & UAE',
          'Watchlists for industries you are actively pursuing',
          '24–48h lead time on new listings before public release',
        ]}
        requiredTier="BUYER_PREMIUM"
      />
    )
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { buyerPlanTier: true, role: true },
  })
  const hasAccess = user?.role === 'ADMIN' || user?.buyerPlanTier === 'PREMIUM_BUYER'

  const grid = await loadGrid()
  const totalCount = INDUSTRIES.reduce((s, i) => s + REGIONS.reduce((t, r) => t + grid[i][r].count, 0), 0)

  return (
    <div style={{ minHeight: '100vh', background: '#FAF6EF' }}>
      <PublicHeader />
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '40px 24px 80px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24, marginBottom: 32, flexWrap: 'wrap' }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#8C6D45', margin: 0, marginBottom: 8 }}>
              Intelligence · Heat Maps
            </p>
            <h1 style={{ fontSize: 36, fontWeight: 800, color: '#0F1419', margin: 0, marginBottom: 8, letterSpacing: '-0.02em' }}>
              Where buyers are concentrating now
            </h1>
            <p style={{ fontSize: 16, color: '#454D58', margin: 0, maxWidth: 640 }}>
              Industry × region demand grid built from every active listing on Forward. Pick the lanes before they overheat.
            </p>
          </div>
          <div style={{ fontSize: 13, color: '#6C7480', textAlign: 'right' }}>
            <div>{totalCount} active listings</div>
            <div>Refreshed just now</div>
          </div>
        </div>

        {!hasAccess && (
          <div style={{
            background: 'linear-gradient(135deg, #FAF6EF 0%, #F2EAD9 100%)',
            border: '1px solid #E5D5B5', borderRadius: 14, padding: '18px 22px',
            marginBottom: 24, display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap',
          }}>
            <div style={{ width: 40, height: 40, borderRadius: 999, background: '#0F1419', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
              <Sparkles size={18} />
            </div>
            <div style={{ flex: 1, minWidth: 260 }}>
              <p style={{ margin: 0, fontWeight: 700, color: '#0F1419', fontSize: 14 }}>Unlock cell-level heat scores and weekly trend lines</p>
              <p style={{ margin: 0, fontSize: 12, color: '#454D58' }}>Buyer Premium · $99/mo · cancel anytime.</p>
            </div>
            <Link href="/api/billing/checkout?tier=BUYER_PREMIUM" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '9px 16px', borderRadius: 8,
              background: '#0F1419', color: '#fff',
              fontSize: 13, fontWeight: 600, textDecoration: 'none',
            }}>
              Upgrade <ArrowRight size={13} />
            </Link>
          </div>
        )}

        {/* Grid */}
        <div style={{
          background: '#fff', border: '1px solid #E8EAED', borderRadius: 14,
          overflow: 'hidden',
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
            <thead>
              <tr style={{ background: '#FAFAF8' }}>
                <th style={th}>Industry</th>
                {REGIONS.map((r) => <th key={r} style={th}>{r}</th>)}
              </tr>
            </thead>
            <tbody>
              {INDUSTRIES.map((ind) => (
                <tr key={ind} style={{ borderTop: '1px solid #F0F2F4' }}>
                  <td style={{ ...td, fontWeight: 700, color: '#0F1419' }}>{INDUSTRY_LABEL[ind]}</td>
                  {REGIONS.map((reg) => {
                    const cell = grid[ind][reg]
                    const color = cellColor(cell)
                    const filterHref = `/deals?industry=${ind}`
                    return (
                      <td key={reg} style={{ ...td, padding: 6 }}>
                        <Link href={filterHref} style={{
                          display: 'block', borderRadius: 8,
                          background: color.bg, color: color.ink,
                          padding: '12px 10px', textDecoration: 'none',
                          textAlign: 'left', minHeight: 72,
                        }}>
                          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', opacity: 0.85 }}>
                            {color.band}
                          </div>
                          <div style={{ fontSize: 22, fontWeight: 800, marginTop: 2, lineHeight: 1 }}>
                            {cell.count}
                            <span style={{ fontSize: 11, fontWeight: 500, opacity: 0.7, marginLeft: 4 }}>
                              {cell.count === 1 ? 'deal' : 'deals'}
                            </span>
                          </div>
                          {hasAccess ? (
                            cell.count > 0 && (
                              <div style={{ fontSize: 11, fontWeight: 600, marginTop: 6 }}>
                                heat {cell.medianHeat} · top {cell.topHeat}
                              </div>
                            )
                          ) : (
                            cell.count > 0 && (
                              <div style={{ fontSize: 10, fontWeight: 600, marginTop: 6, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                <Lock size={9} /> unlock heat
                              </div>
                            )
                          )}
                        </Link>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div style={{ marginTop: 18, display: 'flex', gap: 14, flexWrap: 'wrap', fontSize: 12, color: '#454D58' }}>
          {[
            { label: 'Overheated (≥80)', bg: '#1B7F4E', ink: '#fff' },
            { label: 'Active (65–79)',    bg: '#2E8B57', ink: '#fff' },
            { label: 'Warm (45–64)',      bg: '#F2EAD9', ink: '#0F1419' },
            { label: 'Cool (<45)',        bg: '#F4F4F4', ink: '#6C7480' },
            { label: 'Empty',             bg: '#F4F4F4', ink: '#9CA3AF' },
          ].map((l) => (
            <span key={l.label} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 14, height: 14, borderRadius: 3, background: l.bg, color: l.ink, border: '1px solid #E8EAED' }} />
              {l.label}
            </span>
          ))}
        </div>

        <p style={{ marginTop: 24, fontSize: 12, color: '#6C7480', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Info size={12} /> Click any cell to filter the marketplace to that industry. Heat scores update daily from new buyer activity.
        </p>
      </div>
    </div>
  )
}

const th: React.CSSProperties = {
  padding: '12px 14px', fontSize: 11, textTransform: 'uppercase',
  letterSpacing: '0.08em', color: '#6C7480', textAlign: 'left',
  fontWeight: 700,
}
const td: React.CSSProperties = {
  padding: '12px 14px', fontSize: 14, verticalAlign: 'middle',
}

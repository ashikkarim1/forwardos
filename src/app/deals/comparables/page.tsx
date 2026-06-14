/**
 * /deals/comparables — Deal Comparables
 *
 * The valuation-anchoring surface that Premium buyers use to argue
 * price. For each industry × region, we show how Forward's active
 * listings price relative to revenue and EBITDA — median + range.
 *
 * Real data, computed live from Prisma. Free buyers see the structure
 * (industries and counts) but multiples are masked; Premium sees the
 * numbers and can drill to the underlying deals.
 *
 * Out of scope (next):
 *   - Historical closed-deal multiples (needs ClosedDeal aggregations)
 *   - Comparables for specific deals (one-click "show me comps for
 *     this listing") — wired from listing detail page
 *   - Exportable PDF for IC packs
 */
import Link from 'next/link'
import { ArrowRight, Sparkles, Info, Lock, TrendingUp } from 'lucide-react'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { LockedFeature } from '@/components/dashboard/LockedFeature'
import { PublicHeader } from '@/components/Navigation'
import { IntelligenceNav } from '@/components/intelligence/IntelligenceNav'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Comparables · Forward Intelligence' }

const INDUSTRIES = [
  'SAAS', 'HEALTHCARE', 'ECOMMERCE', 'FINTECH', 'MANUFACTURING',
  'PROFESSIONAL_SERVICES', 'HOSPITALITY', 'EDUCATION', 'LOGISTICS', 'OTHER',
] as const
type Industry = typeof INDUSTRIES[number]

const REGIONS = ['USA', 'Canada', 'UAE', 'Global'] as const
type Region = typeof REGIONS[number]

function countryToRegion(country: string | null | undefined): Region {
  if (!country) return 'Global'
  const c = country.toUpperCase()
  if (c === 'USA' || c === 'US' || c === 'UNITED STATES') return 'USA'
  if (c === 'CA' || c === 'CANADA') return 'Canada'
  if (c === 'AE' || c === 'UAE' || c === 'UNITED ARAB EMIRATES') return 'UAE'
  return 'Global'
}

const INDUSTRY_LABEL: Record<Industry, string> = {
  SAAS: 'SaaS', HEALTHCARE: 'Healthcare', ECOMMERCE: 'E-commerce',
  FINTECH: 'FinTech', MANUFACTURING: 'Manufacturing',
  PROFESSIONAL_SERVICES: 'Professional Services', HOSPITALITY: 'Hospitality',
  EDUCATION: 'Education', LOGISTICS: 'Logistics', OTHER: 'Other',
}

interface CompRow {
  industry: Industry
  region: Region
  count: number
  revMultiple: { p25: number; median: number; p75: number } | null
  ebitdaMultiple: { p25: number; median: number; p75: number } | null
  medianAskingMillions: number | null
}

function pct(arr: number[], p: number): number {
  if (arr.length === 0) return 0
  const sorted = [...arr].sort((a, b) => a - b)
  const idx = Math.floor((p / 100) * (sorted.length - 1))
  return sorted[idx]
}

async function loadComps(): Promise<CompRow[]> {
  const deals = await prisma.deal.findMany({
    where: { status: { in: ['PUBLISHED', 'ACTIVE'] } },
    select: { industry: true, country: true, askingPrice: true, revenue: true, ebitda: true },
  }).catch(() => [])

  type Bucket = { revMults: number[]; ebitdaMults: number[]; askingCents: number[] }
  const buckets = new Map<string, Bucket>()

  for (const d of deals) {
    const ind = (INDUSTRIES as readonly string[]).includes(String(d.industry))
      ? (String(d.industry) as Industry)
      : 'OTHER'
    const reg = countryToRegion(d.country)
    const key = `${ind}|${reg}`
    if (!buckets.has(key)) buckets.set(key, { revMults: [], ebitdaMults: [], askingCents: [] })
    const b = buckets.get(key)!

    const asking = d.askingPrice ? Number(d.askingPrice) : 0
    const rev    = d.revenue     ? Number(d.revenue)     : 0
    const ebit   = d.ebitda      ? Number(d.ebitda)      : 0

    if (asking > 0) b.askingCents.push(asking)
    if (asking > 0 && rev > 0)  b.revMults.push(asking / rev)
    if (asking > 0 && ebit > 0) b.ebitdaMults.push(asking / ebit)
  }

  const rows: CompRow[] = []
  for (const ind of INDUSTRIES) {
    for (const reg of REGIONS) {
      const b = buckets.get(`${ind}|${reg}`)
      if (!b || b.askingCents.length === 0) continue

      rows.push({
        industry: ind,
        region: reg,
        count: b.askingCents.length,
        revMultiple: b.revMults.length >= 3 ? {
          p25:    Number(pct(b.revMults, 25).toFixed(2)),
          median: Number(pct(b.revMults, 50).toFixed(2)),
          p75:    Number(pct(b.revMults, 75).toFixed(2)),
        } : null,
        ebitdaMultiple: b.ebitdaMults.length >= 3 ? {
          p25:    Number(pct(b.ebitdaMults, 25).toFixed(2)),
          median: Number(pct(b.ebitdaMults, 50).toFixed(2)),
          p75:    Number(pct(b.ebitdaMults, 75).toFixed(2)),
        } : null,
        medianAskingMillions: Number((pct(b.askingCents, 50) / 100 / 1_000_000).toFixed(1)),
      })
    }
  }

  // Sort by count desc — most-populated cells first.
  rows.sort((a, b) => b.count - a.count)
  return rows
}

export default async function ComparablesPage() {
  // HARD GATE: Buyer Premium ($99/mo) or ADMIN only. Anonymous and free
  // signed-in users see the pitch only — no industry/region/count/median
  // leakage, since even structure is a competitive advantage.
  const session = await getSession()
  const user = session ? await prisma.user.findUnique({
    where: { id: session.userId },
    select: { buyerPlanTier: true, role: true },
  }) : null
  const hasAccess = user?.role === 'ADMIN' || user?.buyerPlanTier === 'PREMIUM_BUYER'
  if (!hasAccess) {
    return (
      <LockedFeature
        kicker="Intelligence"
        title="Deal Comparables"
        pitch="Anchor your valuation in real transactions, not gut feel. Live multiples by industry × region, computed from every active Forward listing."
        bullets={[
          'Median EBITDA & revenue multiples by sector × region',
          'Range (p25 / median / p75) for every cell',
          'Cross-reference against your saved listings',
          'Export comparables to PDF for committee review',
        ]}
        requiredTier="BUYER_PREMIUM"
      />
    )
  }

  const rows = await loadComps()
  const totalDeals = rows.reduce((s, r) => s + r.count, 0)

  return (
    <div style={{ minHeight: '100vh', background: '#FAF6EF' }}>
      <PublicHeader />
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '40px 24px 80px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24, marginBottom: 32, flexWrap: 'wrap' }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#8C6D45', margin: 0, marginBottom: 8 }}>
              Intelligence · Comparables
            </p>
            <h1 style={{ fontSize: 36, fontWeight: 800, color: '#0F1419', margin: 0, marginBottom: 8, letterSpacing: '-0.02em' }}>
              Anchor your price in the market
            </h1>
            <p style={{ fontSize: 16, color: '#454D58', margin: 0, maxWidth: 640 }}>
              Live multiples by industry × region, computed from every active listing on Forward. Bring real numbers to your next negotiation.
            </p>
          </div>
          <div style={{ fontSize: 13, color: '#6C7480', textAlign: 'right' }}>
            <div>{totalDeals} listings</div>
            <div>{rows.length} comparable cells</div>
          </div>
        </div>

        <IntelligenceNav active="comparables" />

        {rows.length === 0 ? (
          <div style={{ background: '#fff', border: '1px solid #E8EAED', borderRadius: 12, padding: '48px 24px', textAlign: 'center', color: '#6C7480' }}>
            Not enough active listings to compute comparables yet. We need at least 3 priced listings per industry × region to publish multiples.
          </div>
        ) : (
          <div style={{ background: '#fff', border: '1px solid #E8EAED', borderRadius: 14, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#FAFAF8' }}>
                  <th style={th}>Industry</th>
                  <th style={th}>Region</th>
                  <th style={th}>Listings</th>
                  <th style={th}>Median ask</th>
                  <th style={th}>Revenue multiple <span style={pHint}>p25 · med · p75</span></th>
                  <th style={th}>EBITDA multiple <span style={pHint}>p25 · med · p75</span></th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={`${r.industry}|${r.region}`} style={{ borderTop: '1px solid #F0F2F4' }}>
                    <td style={{ ...td, fontWeight: 700, color: '#0F1419' }}>{INDUSTRY_LABEL[r.industry]}</td>
                    <td style={td}>{r.region}</td>
                    <td style={td}>{r.count}</td>
                    <td style={td}>{r.medianAskingMillions ? `$${r.medianAskingMillions}M` : '—'}</td>
                    <td style={td}>
                      <MultipleCell mult={r.revMultiple} suffix="x" />
                    </td>
                    <td style={td}>
                      <MultipleCell mult={r.ebitdaMultiple} suffix="x" />
                    </td>
                    <td style={{ ...td, textAlign: 'right' }}>
                      <Link href={`/deals?industry=${r.industry}`} style={{
                        display: 'inline-flex', alignItems: 'center', gap: 4,
                        fontSize: 12, fontWeight: 600, color: '#8C6D45',
                        textDecoration: 'none',
                      }}>
                        <TrendingUp size={11} /> Deals
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p style={{ marginTop: 24, fontSize: 12, color: '#6C7480', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Info size={12} /> Multiples shown only where at least 3 priced listings exist in the cell. We don't publish multiples for thin samples.
        </p>
      </div>
    </div>
  )
}

function MultipleCell({ mult, suffix }: { mult: { p25: number; median: number; p75: number } | null; suffix: string }) {
  if (!mult) return <span style={{ color: '#9CA3AF', fontSize: 12 }}>thin sample</span>
  return (
    <span style={{ fontVariantNumeric: 'tabular-nums', fontSize: 13 }}>
      <span style={{ color: '#9CA3AF' }}>{mult.p25}{suffix}</span>
      {' · '}
      <strong style={{ color: '#0F1419' }}>{mult.median}{suffix}</strong>
      {' · '}
      <span style={{ color: '#9CA3AF' }}>{mult.p75}{suffix}</span>
    </span>
  )
}

function LockedCell() {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#8C6D45', fontWeight: 600 }}>
      <Lock size={10} /> Premium
    </span>
  )
}

const th: React.CSSProperties = {
  padding: '12px 14px', fontSize: 11, textTransform: 'uppercase',
  letterSpacing: '0.08em', color: '#6C7480', textAlign: 'left',
  fontWeight: 700, whiteSpace: 'nowrap',
}
const td: React.CSSProperties = {
  padding: '12px 14px', fontSize: 14, verticalAlign: 'middle',
  color: '#0F1419',
}
const pHint: React.CSSProperties = {
  display: 'block', fontSize: 9, fontWeight: 500,
  color: '#9CA3AF', textTransform: 'none', letterSpacing: 0,
  marginTop: 2,
}

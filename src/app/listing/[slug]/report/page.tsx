/**
 * Forward Intelligence Report — the shareable one-page brief for a listing.
 *
 * Print-optimized (Cmd+P → PDF gives a clean A4 document). Brokers put this
 * in front of clients; sellers see their business analyzed like an
 * institution would; buyers use it to frame diligence. Uses only data that
 * is already public on the masked listing page, so the route is public too.
 */
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { confidentialTitle, maskCity } from '@/lib/listing-helpers'
import { industryLabel } from '@/lib/listing-narrative'
import { getComparables, CONFIDENCE_LABEL } from '@/lib/services/comparables'
import { PrintButton } from './PrintButton'

interface Props { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: `Intelligence Report · Forward`,
    robots: { index: false }, // the listing page is the SEO surface, not the report
  }
}

const INK = '#0F1419'
const MUTED = '#454D58'
const GREY = '#6C7480'
const BORDER = '#E8EAED'
const CHAMPAGNE = '#8C6D45'
const CREAM = '#FAF6EF'

const fmtUsd = (dollars: number | null): string => {
  if (dollars == null || !Number.isFinite(dollars)) return '—'
  if (dollars >= 1_000_000) return `$${(dollars / 1_000_000).toFixed(2)}M`
  if (dollars >= 1_000) return `$${Math.round(dollars / 1_000)}K`
  return `$${Math.round(dollars)}`
}
const centsToUsd = (v: bigint | null): number | null => (v == null ? null : Number(v) / 100)

const parseJsonArray = (s: string | null): string[] => {
  if (!s) return []
  try { const a = JSON.parse(s); return Array.isArray(a) ? a.slice(0, 4) : [] } catch { return [] }
}

export default async function IntelligenceReportPage({ params }: Props) {
  const deal = await prisma.deal.findUnique({ where: { slug: params.slug } }).catch(() => null)
  if (!deal) notFound()
  if (deal.status !== 'ACTIVE' && deal.status !== 'PUBLISHED') notFound()

  const [saveCount, enquiryCount, comps] = await Promise.all([
    prisma.savedDeal.count({ where: { dealId: deal.id } }).catch(() => 0),
    prisma.enquiry.count({ where: { dealId: deal.id } }).catch(() => 0),
    getComparables({
      industry: deal.industry,
      country: deal.country,
      revenueUsd: deal.revenue ? Number(deal.revenue) / 100 : null,
      excludeDealId: deal.id,
    }).catch(() => null),
  ])

  const headline = confidentialTitle(deal.industry, deal.country, deal.id)
  const region = maskCity(deal.city, deal.country)
  const indLabel = industryLabel(deal.industry)
  const asking = centsToUsd(deal.askingPrice)
  const revenue = centsToUsd(deal.revenue)
  const ebitda = centsToUsd(deal.ebitda)
  const daysOnMarket = deal.publishedAt
    ? Math.max(1, Math.round((Date.now() - new Date(deal.publishedAt).getTime()) / 86_400_000))
    : null
  const strengths = parseJsonArray(deal.keyStrengths)
  const risks = parseJsonArray(deal.riskFactors)

  const medianAsk = comps?.askingPriceUsd?.median ?? null
  const askVsMedian =
    asking != null && medianAsk != null && medianAsk > 0
      ? Math.round(((asking - medianAsk) / medianAsk) * 100)
      : null

  const generatedOn = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh', fontFamily: 'var(--font-sans), -apple-system, sans-serif', color: INK }}>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          @page { margin: 14mm; }
        }
      `}</style>

      <div className="mx-auto max-w-[820px] px-8 py-10">
        {/* Screen-only toolbar */}
        <div className="no-print mb-8 flex items-center justify-between rounded-xl border px-4 py-3" style={{ borderColor: BORDER, background: CREAM }}>
          <p className="text-xs" style={{ color: MUTED }}>
            This report prints to a clean one-page PDF — use the button or Cmd/Ctrl+P.
          </p>
          <PrintButton />
        </div>

        {/* Letterhead */}
        <header className="flex items-start justify-between border-b-2 pb-6" style={{ borderColor: INK }}>
          <div>
            <p className="text-[10px] font-bold uppercase" style={{ letterSpacing: '0.25em', color: CHAMPAGNE }}>
              Forward Intelligence Report
            </p>
            <h1 className="mt-2 text-2xl font-black leading-tight" style={{ letterSpacing: '-0.01em' }}>{headline}</h1>
            <p className="mt-1 text-sm" style={{ color: MUTED }}>
              {indLabel} · {region} · Confidential listing
            </p>
          </div>
          <div className="text-right text-[11px] leading-relaxed" style={{ color: GREY }}>
            <p className="font-bold" style={{ color: INK }}>forwardos.ai</p>
            <p>Generated {generatedOn}</p>
            {daysOnMarket != null && <p>{daysOnMarket} days on market</p>}
          </div>
        </header>

        {/* Headline metrics */}
        <section className="mt-7 grid grid-cols-4 gap-3">
          <ReportStat label="Asking price" value={fmtUsd(asking)} />
          <ReportStat label="Annual revenue" value={fmtUsd(revenue)} />
          <ReportStat label="EBITDA" value={fmtUsd(ebitda)} />
          <ReportStat label="Implied multiple" value={deal.pricingMultiple ? `${deal.pricingMultiple.toFixed(1)}x` : '—'} />
        </section>

        {/* Forward scores */}
        <ReportSection title="Forward Intelligence scores">
          <div className="grid grid-cols-3 gap-3">
            <ScoreBar label="Engagement (Forward Score)" value={deal.heatScore ?? 0} max={100} note="Platform-wide buyer engagement signal" />
            <ScoreBar label="Deal quality" value={deal.dealQualityScore ?? 0} max={100} note="Financial consistency + transferability" />
            <ScoreBar label="Close probability" value={Math.round(deal.predictedCloseProb ?? 0)} max={100} note="Signal-based score — heat, freshness, verification, financing" />
          </div>
        </ReportSection>

        {/* Comparables */}
        <ReportSection title="Market comparables — computed live">
          {comps && comps.sampleSize >= 3 ? (
            <>
              <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                    <th className="py-2 text-left text-[10px] font-bold uppercase" style={{ letterSpacing: '0.12em', color: GREY }}>Metric</th>
                    <th className="py-2 text-right text-[10px] font-bold uppercase" style={{ letterSpacing: '0.12em', color: GREY }}>P25</th>
                    <th className="py-2 text-right text-[10px] font-bold uppercase" style={{ letterSpacing: '0.12em', color: GREY }}>Median</th>
                    <th className="py-2 text-right text-[10px] font-bold uppercase" style={{ letterSpacing: '0.12em', color: GREY }}>P75</th>
                    <th className="py-2 text-right text-[10px] font-bold uppercase" style={{ letterSpacing: '0.12em', color: CHAMPAGNE }}>This listing</th>
                  </tr>
                </thead>
                <tbody>
                  {comps.askingPriceUsd && (
                    <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                      <td className="py-2.5 font-semibold">Asking price</td>
                      <td className="py-2.5 text-right" style={{ color: MUTED }}>{fmtUsd(comps.askingPriceUsd.p25)}</td>
                      <td className="py-2.5 text-right font-bold">{fmtUsd(comps.askingPriceUsd.median)}</td>
                      <td className="py-2.5 text-right" style={{ color: MUTED }}>{fmtUsd(comps.askingPriceUsd.p75)}</td>
                      <td className="py-2.5 text-right font-black" style={{ color: CHAMPAGNE }}>{fmtUsd(asking)}</td>
                    </tr>
                  )}
                  {comps.ebitdaMultiple && (
                    <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                      <td className="py-2.5 font-semibold">EBITDA multiple</td>
                      <td className="py-2.5 text-right" style={{ color: MUTED }}>{comps.ebitdaMultiple.p25.toFixed(1)}x</td>
                      <td className="py-2.5 text-right font-bold">{comps.ebitdaMultiple.median.toFixed(1)}x</td>
                      <td className="py-2.5 text-right" style={{ color: MUTED }}>{comps.ebitdaMultiple.p75.toFixed(1)}x</td>
                      <td className="py-2.5 text-right font-black" style={{ color: CHAMPAGNE }}>{deal.pricingMultiple ? `${deal.pricingMultiple.toFixed(1)}x` : '—'}</td>
                    </tr>
                  )}
                  {comps.revenueUsd && (
                    <tr>
                      <td className="py-2.5 font-semibold">Annual revenue</td>
                      <td className="py-2.5 text-right" style={{ color: MUTED }}>{fmtUsd(comps.revenueUsd.p25)}</td>
                      <td className="py-2.5 text-right font-bold">{fmtUsd(comps.revenueUsd.median)}</td>
                      <td className="py-2.5 text-right" style={{ color: MUTED }}>{fmtUsd(comps.revenueUsd.p75)}</td>
                      <td className="py-2.5 text-right font-black" style={{ color: CHAMPAGNE }}>{fmtUsd(revenue)}</td>
                    </tr>
                  )}
                </tbody>
              </table>
              {askVsMedian != null && (
                <p className="mt-3 text-sm font-semibold">
                  Positioning: asked {Math.abs(askVsMedian)}% {askVsMedian >= 0 ? 'above' : 'below'} the comparable median.
                </p>
              )}
              <p className="mt-2 text-[11px] leading-relaxed" style={{ color: GREY }}>
                <strong style={{ color: INK }}>{CONFIDENCE_LABEL[comps.confidence]}.</strong> {comps.basis}, computed live
                from Forward marketplace data at generation time — not a static industry table. Small samples are
                directional; use them to frame diligence, not to price a transaction.
              </p>
            </>
          ) : (
            <p className="text-sm" style={{ color: MUTED }}>
              Fewer than 3 comparable active listings exist for this industry × country cohort right now. Forward does
              not report comparable ranges on samples that small.
            </p>
          )}
        </ReportSection>

        {/* Demand signal */}
        <ReportSection title="Buyer demand signal">
          <div className="grid grid-cols-3 gap-3">
            <ReportStat label="Listing views" value={String(deal.viewCount ?? 0)} />
            <ReportStat label="Saved by buyers" value={String(saveCount)} />
            <ReportStat label="Inquiries received" value={String(enquiryCount)} />
          </div>
        </ReportSection>

        {/* Strengths / risks side by side */}
        {(strengths.length > 0 || risks.length > 0) && (
          <ReportSection title="Assessment">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="mb-2 text-[10px] font-bold uppercase" style={{ letterSpacing: '0.12em', color: '#2D7A5F' }}>Key strengths</p>
                <ul className="space-y-1.5 text-[13px] leading-relaxed" style={{ color: MUTED }}>
                  {strengths.length ? strengths.map((s, i) => <li key={i}>· {s}</li>) : <li>—</li>}
                </ul>
              </div>
              <div>
                <p className="mb-2 text-[10px] font-bold uppercase" style={{ letterSpacing: '0.12em', color: '#B45309' }}>Risks to diligence</p>
                <ul className="space-y-1.5 text-[13px] leading-relaxed" style={{ color: MUTED }}>
                  {risks.length ? risks.map((s, i) => <li key={i}>· {s}</li>) : <li>—</li>}
                </ul>
              </div>
            </div>
          </ReportSection>
        )}

        {/* Transaction readiness */}
        <ReportSection title="Transaction readiness">
          <div className="flex flex-wrap gap-2 text-[12px]">
            <ReadyChip ok label="Seller verified by Forward" />
            <ReadyChip ok label="Sanctions-screened" />
            <ReadyChip ok={deal.financingEligible} label={deal.financingEligible ? 'Financing pre-qualified' : 'Financing not yet assessed'} />
            <ReadyChip ok label={`Seller motivation disclosed${deal.reasonForSale ? '' : ' under NDA'}`} />
          </div>
        </ReportSection>

        {/* Footer */}
        <footer className="mt-10 border-t pt-4 text-[10px] leading-relaxed" style={{ borderColor: BORDER, color: GREY }}>
          <p>
            Generated by Forward Intelligence (forwardos.ai) on {generatedOn}. The business identity, exact location,
            and contact details are confidential and disclosed only to qualified buyers under NDA through Forward.
            Scores are signal-based platform computations, not audited figures; comparable ranges reflect active
            Forward listings at generation time. This report is informational and is not investment, legal, or tax advice.
          </p>
          <p className="mt-1 font-semibold" style={{ color: INK }}>
            Full listing: forwardos.ai/listing/{deal.slug}
          </p>
        </footer>
      </div>
    </div>
  )
}

function ReportSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="mb-3 border-b pb-1.5 text-[11px] font-bold uppercase" style={{ letterSpacing: '0.18em', color: INK, borderColor: BORDER }}>
        {title}
      </h2>
      {children}
    </section>
  )
}

function ReportStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border p-3" style={{ borderColor: BORDER, background: CREAM }}>
      <p className="text-[9px] font-bold uppercase" style={{ letterSpacing: '0.12em', color: GREY }}>{label}</p>
      <p className="mt-1 text-lg font-black" style={{ color: INK }}>{value}</p>
    </div>
  )
}

function ScoreBar({ label, value, max, note }: { label: string; value: number; max: number; note: string }) {
  const pctWidth = Math.max(0, Math.min(100, (value / max) * 100))
  return (
    <div className="rounded-lg border p-3" style={{ borderColor: BORDER }}>
      <div className="flex items-baseline justify-between">
        <p className="text-[9px] font-bold uppercase" style={{ letterSpacing: '0.1em', color: GREY }}>{label}</p>
        <p className="text-base font-black">{value}<span className="text-[10px] font-semibold" style={{ color: GREY }}>/{max}</span></p>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full" style={{ background: '#EFEBE3' }}>
        <div className="h-full rounded-full" style={{ width: `${pctWidth}%`, background: CHAMPAGNE }} />
      </div>
      <p className="mt-1.5 text-[10px] leading-snug" style={{ color: GREY }}>{note}</p>
    </div>
  )
}

function ReadyChip({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span
      className="rounded-full border px-3 py-1 font-semibold"
      style={{
        borderColor: ok ? '#BFD8CC' : BORDER,
        background: ok ? '#EFF7F3' : '#F7F7F7',
        color: ok ? '#2D7A5F' : GREY,
      }}
    >
      {ok ? '✓' : '○'} {label}
    </span>
  )
}

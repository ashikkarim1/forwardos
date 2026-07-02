import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { PublicHeader } from '@/components/Navigation'
import { CopilotFab } from '@/components/copilot/CopilotFab'
import { pageMetadata, breadcrumbLd, jsonLdScript } from '@/lib/seo'
import { confidentialTitle, maskCity } from '@/lib/listing-helpers'
import { generateNarrative, industryLabel } from '@/lib/listing-narrative'
import { getComparables, CONFIDENCE_LABEL } from '@/lib/services/comparables'
import { COLOR_PRIMARY, COLOR_TEXT_SECONDARY, COLOR_BORDER, COLOR_ACCENT, COLOR_BG_PRIMARY } from '@/styles/forward-colors'
import {
  ChevronRight, MapPin, Users, Calendar, ShieldCheck, Sparkles, TrendingUp,
  Lock, FileText, BarChart3, Target, AlertTriangle, ArrowRight, Mail,
  DollarSign, PieChart, Clock, Heart, Share2, Building2, Briefcase,
} from 'lucide-react'

interface Props { params: { slug: string } }

async function getDeal(slug: string) {
  return prisma.deal.findUnique({
    where: { slug },
    select: {
      id: true, slug: true, title: true, description: true, industry: true, subIndustry: true,
      country: true, city: true, stateProvince: true,
      revenue: true, ebitda: true, askingPrice: true, ebitdaMargin: true, grossMargin: true, pricingMultiple: true,
      employees: true, foundedYear: true, yearsInOperation: true,
      reasonForSale: true, businessModel: true, customerConcentration: true,
      inventoryIncluded: true, realEstateIncluded: true, equipmentIncluded: true, isFranchise: true,
      keyStrengths: true, growthOpportunities: true, riskFactors: true,
      heatScore: true, dealQualityScore: true, predictedCloseProb: true,
      financingEligible: true, financingNote: true,
      status: true, publishedAt: true,
    },
  })
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const deal = await getDeal(params.slug).catch(() => null)
  if (!deal) return { title: 'Listing not found', robots: { index: false, follow: false } }
  const indLabel = industryLabel(deal.industry)
  const region = maskCity(deal.city, deal.country)
  const ask = deal.askingPrice ? `$${(Number(deal.askingPrice) / 100 / 1_000_000).toFixed(1)}M` : 'price on request'
  return pageMetadata({
    title: `Confidential ${indLabel} for Sale — ${region} · ${ask}`,
    description: `A confidential ${indLabel.toLowerCase()} business in ${region}. Asking ${ask}. Verified by Forward Intelligence — identity revealed to qualified buyers via Forward.`,
    path: `/listing/${deal.slug}`,
    keywords: [
      `${deal.industry.toLowerCase()} business for sale`,
      `business for sale ${deal.country}`,
      `confidential ${indLabel.toLowerCase()} for sale`,
    ],
  })
}

export const revalidate = 300

const fmtMoney = (cents: bigint | null): string => {
  if (cents == null) return '—'
  const dollars = Number(cents) / 100
  if (dollars >= 1_000_000) return `$${(dollars / 1_000_000).toFixed(2)}M`
  if (dollars >= 1_000) return `$${Math.round(dollars / 1_000)}K`
  return `$${Math.round(dollars)}`
}

const parseJsonArray = (s: string | null): string[] => {
  if (!s) return []
  try { const x = JSON.parse(s); return Array.isArray(x) ? x.filter((v: unknown) => typeof v === 'string') : [] }
  catch { return [] }
}

const HERO_IMAGE_BY_INDUSTRY: Record<string, string> = {
  SAAS: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1600&h=900&fit=crop',
  FINTECH: 'https://images.unsplash.com/photo-1565514020179-026b92b84bb6?w=1600&h=900&fit=crop',
  HEALTHCARE: 'https://images.unsplash.com/photo-1576091160550-112173f31c77?w=1600&h=900&fit=crop',
  HOSPITALITY: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&h=900&fit=crop',
  LOGISTICS: 'https://images.unsplash.com/photo-1586398128686-0a03e8917b87?w=1600&h=900&fit=crop',
  RETAIL: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&h=900&fit=crop',
  ECOMMERCE: 'https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=1600&h=900&fit=crop',
  SERVICES: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=1600&h=900&fit=crop',
  MANUFACTURING: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1600&h=900&fit=crop',
  EDUCATION: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1600&h=900&fit=crop',
  ENERGY: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=1600&h=900&fit=crop',
  DEFAULT: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1600&h=900&fit=crop',
}

export default async function ListingPage({ params }: Props) {
  const deal = await getDeal(params.slug).catch(() => null)
  if (!deal) notFound()
  if (deal.status !== 'ACTIVE' && deal.status !== 'PUBLISHED') notFound()

  const session = await getSession()
  const copilotRole = session ? roleForCopilot(session.role) : null

  const comps = await getComparables({
    industry: deal.industry,
    country: deal.country,
    revenueUsd: deal.revenue ? Number(deal.revenue) / 100 : null,
    excludeDealId: deal.id,
  }).catch(() => null)

  // Bump the view counter (best-effort, never blocks the page render).
  // This is intentionally not deduped per-IP at the page level — the
  // /api/deals/[slug]/view endpoint is for client-side bumps with rate
  // limiting; this server-side bump fires on every render path so
  // analytics + Heat score have a baseline signal even without JS.
  prisma.deal.updateMany({
    where: { slug: params.slug },
    data: { viewCount: { increment: 1 } },
  }).catch(() => {})

  // Identity is masked everywhere — generated from non-identifying fields.
  const headline = confidentialTitle(deal.industry, deal.country, deal.id)
  const region = maskCity(deal.city, deal.country)
  const indLabel = industryLabel(deal.industry)
  const heroImage = HERO_IMAGE_BY_INDUSTRY[deal.industry] || HERO_IMAGE_BY_INDUSTRY.DEFAULT

  // Narrative input (the AI-style writeup).
  const revenueDollars = deal.revenue ? Number(deal.revenue) / 100 : 0
  const ebitdaDollars = deal.ebitda ? Number(deal.ebitda) / 100 : 0
  const askingDollars = deal.askingPrice ? Number(deal.askingPrice) / 100 : 0
  const narrative = generateNarrative({
    title: headline,
    category: deal.industry,
    location: region,
    country: deal.country,
    askingPrice: askingDollars,
    annualRevenue: revenueDollars,
    ebitda: ebitdaDollars,
    profitMarginPercent: Math.round(deal.ebitdaMargin ?? 20),
    heatIndex: deal.heatScore ?? 50,
    dealQualityScore: deal.dealQualityScore ?? 50,
    growthRate: deal.predictedCloseProb != null ? Math.round(deal.predictedCloseProb) : 30,
    employeeCount: deal.employees ?? 0,
    daysOnMarket: deal.publishedAt ? Math.max(1, Math.round((Date.now() - new Date(deal.publishedAt).getTime()) / 86_400_000)) : 30,
    marketPosition: 'fair',
    sellerMotivation: 'STRATEGIC_EXIT',
    financingEligible: deal.financingEligible,
  })

  const strengths = parseJsonArray(deal.keyStrengths)
  const opportunities = parseJsonArray(deal.growthOpportunities)
  const risks = parseJsonArray(deal.riskFactors)

  const ldBreadcrumbs = breadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Marketplace', path: '/marketplace' },
    { name: indLabel, path: `/marketplace?industry=${deal.industry}` },
    { name: region, path: `/marketplace?country=${deal.country}` },
    { name: headline, path: `/listing/${deal.slug}` },
  ])

  return (
    <div className="min-h-screen" style={{ background: COLOR_BG_PRIMARY }}>
      <PublicHeader />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(ldBreadcrumbs) }} />

      {/* ─── Breadcrumbs ─────────────────────────────────────────────── */}
      <nav aria-label="Breadcrumb" className="border-b" style={{ borderColor: COLOR_BORDER, background: 'white' }}>
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-1.5 text-xs flex-wrap">
          <Link href="/" className="hover:underline" style={{ color: COLOR_TEXT_SECONDARY }}>Home</Link>
          <ChevronRight size={12} style={{ color: COLOR_TEXT_SECONDARY }} />
          <Link href="/marketplace" className="hover:underline" style={{ color: COLOR_TEXT_SECONDARY }}>Marketplace</Link>
          <ChevronRight size={12} style={{ color: COLOR_TEXT_SECONDARY }} />
          <Link href={`/marketplace?industry=${deal.industry}`} className="hover:underline" style={{ color: COLOR_TEXT_SECONDARY }}>{indLabel}</Link>
          <ChevronRight size={12} style={{ color: COLOR_TEXT_SECONDARY }} />
          <Link href={`/marketplace?country=${deal.country}`} className="hover:underline" style={{ color: COLOR_TEXT_SECONDARY }}>{region}</Link>
          <ChevronRight size={12} style={{ color: COLOR_TEXT_SECONDARY }} />
          <span className="font-semibold truncate max-w-[40ch]" style={{ color: COLOR_PRIMARY }}>{headline}</span>
        </div>
      </nav>

      {/* ─── Hero ────────────────────────────────────────────────────── */}
      <section className="relative" style={{ background: '#0F1419' }}>
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={heroImage} alt="Confidential business listing" className="w-full h-full object-cover opacity-50" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(15,20,25,0.4) 0%, rgba(15,20,25,0.85) 100%)' }} />
        </div>
        <div className="relative max-w-6xl mx-auto px-6 py-16 md:py-24">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-bold tracking-widest text-white mb-5" style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(6px)' }}>
            <Lock size={11} /> CONFIDENTIAL · FORWARD-VERIFIED
          </div>
          <p className="text-[11px] font-bold tracking-[0.28em] mb-3" style={{ color: '#B8956A' }}>
            {indLabel.toUpperCase()} · {region.toUpperCase()}
          </p>
          <h1 className="text-3xl md:text-5xl font-black text-white max-w-4xl leading-tight mb-3">{headline}</h1>
          <p className="text-lg max-w-2xl" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Verified business opportunity · Identity revealed to qualified buyers through Forward Intelligence
          </p>
          <div className="mt-7 flex flex-wrap gap-4 text-xs text-white">
            <HeroBadge icon={<DollarSign size={13} />} label="Asking" value={fmtMoney(deal.askingPrice)} bold />
            <HeroBadge icon={<TrendingUp size={13} />} label="Revenue" value={fmtMoney(deal.revenue)} />
            <HeroBadge icon={<BarChart3 size={13} />} label="EBITDA" value={fmtMoney(deal.ebitda)} />
            {deal.employees != null && <HeroBadge icon={<Users size={13} />} label="Team" value={String(deal.employees)} />}
            {deal.foundedYear && <HeroBadge icon={<Calendar size={13} />} label="Founded" value={String(deal.foundedYear)} />}
          </div>
        </div>
      </section>

      {/* ─── Body — two columns ──────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-6 py-12 grid lg:grid-cols-3 gap-10">
        <main className="lg:col-span-2 space-y-12">
          {/* The Forward Brief */}
          <Section eyebrow="The Forward Brief" title="An Intelligence-led Summary">
            <p className="text-base md:text-lg leading-relaxed" style={{ color: COLOR_TEXT_SECONDARY }}>{narrative}</p>
            {deal.description && (
              <div className="mt-6 pt-6 border-t" style={{ borderColor: COLOR_BORDER }}>
                <p className="text-[11px] font-bold tracking-widest uppercase mb-2" style={{ color: COLOR_TEXT_SECONDARY }}>Seller&apos;s overview</p>
                <p className="text-sm leading-relaxed" style={{ color: COLOR_PRIMARY }}>{deal.description}</p>
              </div>
            )}
          </Section>

          {/* Forward Intelligence dashboard */}
          <Section eyebrow="Forward Intelligence" title="Decision-making metrics">
            <div className="grid sm:grid-cols-2 gap-4">
              <MetricCard label="Forward Score" value={`${deal.heatScore ?? '—'}°`} sub="Platform-wide engagement signal" tone={deal.heatScore && deal.heatScore >= 85 ? 'hot' : 'neutral'} />
              <MetricCard label="Quality Score" value={`${deal.dealQualityScore ?? '—'}/100`} sub="Financial consistency + transferability" />
              <MetricCard label="Predicted Close" value={`${Math.round(deal.predictedCloseProb ?? 0)}%`} sub="Signal-based close-probability score" />
              <MetricCard label="EBITDA Multiple" value={deal.pricingMultiple ? `${deal.pricingMultiple.toFixed(1)}x` : '—'} sub="Implied at the asking price" />
            </div>
            {deal.financingEligible && (
              <div className="mt-5 rounded-xl border p-4 flex items-start gap-3" style={{ borderColor: '#D6C5A8', background: '#FAF6EF' }}>
                <ShieldCheck size={18} style={{ color: '#B8956A' }} className="flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-sm mb-0.5" style={{ color: COLOR_PRIMARY }}>Financing pre-qualified</p>
                  <p className="text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>{deal.financingNote || 'This listing qualifies for SBA / CSBFP / BDC / Sharia-compliant acquisition financing through Forward Finance partners.'}</p>
                </div>
              </div>
            )}
          </Section>

          {/* Financial summary */}
          <Section eyebrow="Financial Profile" title="The numbers">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <FinancialRow label="Annual revenue" value={fmtMoney(deal.revenue)} />
              <FinancialRow label="EBITDA" value={fmtMoney(deal.ebitda)} />
              <FinancialRow label="EBITDA margin" value={deal.ebitdaMargin != null ? `${Math.round(deal.ebitdaMargin)}%` : '—'} />
              <FinancialRow label="Gross margin" value={deal.grossMargin != null ? `${Math.round(deal.grossMargin)}%` : '—'} />
            </div>
            {deal.customerConcentration && (
              <p className="mt-5 text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>
                <strong style={{ color: COLOR_PRIMARY }}>Customer concentration:</strong> {deal.customerConcentration}
              </p>
            )}
          </Section>

          {/* Live comparables */}
          {comps && comps.sampleSize >= 3 && (
            <Section eyebrow="How this compares" title="Live market comparables" icon={<BarChart3 size={14} style={{ color: '#B8956A' }} />}>
              <div className="grid sm:grid-cols-2 gap-4">
                {comps.askingPriceUsd && (
                  <CompBand
                    label="Asking price — comparable range"
                    p25={fmtUsd(comps.askingPriceUsd.p25)}
                    median={fmtUsd(comps.askingPriceUsd.median)}
                    p75={fmtUsd(comps.askingPriceUsd.p75)}
                    subject={deal.askingPrice ? fmtMoney(deal.askingPrice) : null}
                    subjectLabel="This listing"
                  />
                )}
                {comps.ebitdaMultiple && (
                  <CompBand
                    label="EBITDA multiple — comparable range"
                    p25={`${comps.ebitdaMultiple.p25.toFixed(1)}x`}
                    median={`${comps.ebitdaMultiple.median.toFixed(1)}x`}
                    p75={`${comps.ebitdaMultiple.p75.toFixed(1)}x`}
                    subject={deal.pricingMultiple ? `${deal.pricingMultiple.toFixed(1)}x` : null}
                    subjectLabel="This listing"
                  />
                )}
              </div>
              <p className="mt-4 text-xs leading-relaxed" style={{ color: COLOR_TEXT_SECONDARY }}>
                <strong style={{ color: COLOR_PRIMARY }}>{CONFIDENCE_LABEL[comps.confidence]}.</strong>{' '}
                {comps.basis}, computed live from Forward marketplace data — not a static industry table. Small samples are directional; use them to frame diligence, not to price a deal.
              </p>
            </Section>
          )}

          {/* Strengths */}
          {strengths.length > 0 && (
            <Section eyebrow="Why it stands out" title="Key strengths" icon={<Sparkles size={14} style={{ color: '#B8956A' }} />}>
              <ul className="space-y-2.5">{strengths.map((s, i) => <ListBullet key={i}>{s}</ListBullet>)}</ul>
            </Section>
          )}

          {/* Opportunities */}
          {opportunities.length > 0 && (
            <Section eyebrow="Where the upside is" title="Growth opportunities" icon={<TrendingUp size={14} style={{ color: '#2D7A5F' }} />}>
              <ul className="space-y-2.5">{opportunities.map((s, i) => <ListBullet key={i}>{s}</ListBullet>)}</ul>
            </Section>
          )}

          {/* Risks */}
          {risks.length > 0 && (
            <Section eyebrow="The honest read" title="Risks to diligence" icon={<AlertTriangle size={14} style={{ color: '#B45309' }} />}>
              <ul className="space-y-2.5">{risks.map((s, i) => <ListBullet key={i}>{s}</ListBullet>)}</ul>
            </Section>
          )}

          {/* Business details */}
          <Section eyebrow="Business profile" title="Operating details">
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <DetailRow icon={<Briefcase size={14} />} label="Industry" value={indLabel + (deal.subIndustry ? ` · ${deal.subIndustry}` : '')} />
              <DetailRow icon={<Building2 size={14} />} label="Business model" value={deal.businessModel || '—'} />
              <DetailRow icon={<MapPin size={14} />} label="Region" value={region} />
              <DetailRow icon={<Calendar size={14} />} label="Years in operation" value={deal.yearsInOperation ? `${deal.yearsInOperation}` : '—'} />
              <DetailRow icon={<Users size={14} />} label="Team size" value={deal.employees != null ? String(deal.employees) : '—'} />
              <DetailRow icon={<Clock size={14} />} label="Reason for sale" value={deal.reasonForSale || 'Confidential — disclosed under NDA'} />
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {deal.inventoryIncluded && <Badge>Inventory included</Badge>}
              {deal.realEstateIncluded && <Badge>Real estate included</Badge>}
              {deal.equipmentIncluded && <Badge>Equipment included</Badge>}
              {deal.isFranchise && <Badge>Franchise opportunity</Badge>}
            </div>
          </Section>

          <div className="border-t pt-8" style={{ borderColor: COLOR_BORDER }}>
            <p className="text-xs leading-relaxed" style={{ color: COLOR_TEXT_SECONDARY }}>
              <strong style={{ color: COLOR_PRIMARY }}>About this listing:</strong> Forward Intelligence verifies every business and seller before publishing. The seller&apos;s identity, exact location, and contact details are confidential and shared only with qualified buyers who have requested an introduction through Forward. Forward facilitates the introduction and acts as the binding intermediary for any subsequent transaction.
            </p>
          </div>
        </main>

        {/* ─── Sticky deal sidebar ─────────────────────────────────── */}
        <aside className="lg:col-span-1">
          <div className="sticky top-6 space-y-4">
            <div className="rounded-xl border bg-white overflow-hidden" style={{ borderColor: COLOR_BORDER }}>
              <div className="p-6 border-b" style={{ borderColor: COLOR_BORDER }}>
                <p className="text-[10px] font-bold tracking-widest uppercase mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>Asking price</p>
                <p className="text-3xl font-black mb-3" style={{ color: COLOR_PRIMARY }}>{fmtMoney(deal.askingPrice)}</p>
                <Link
                  href={`/listing/${deal.slug}/contact`}
                  className="block w-full text-center px-5 py-3.5 rounded-lg font-bold text-white text-sm hover:opacity-90 transition-opacity"
                  style={{ background: COLOR_PRIMARY }}
                >
                  <Mail size={14} className="inline mr-1.5 -mt-0.5" />
                  Contact seller
                </Link>
                <p className="text-[10px] text-center mt-2" style={{ color: COLOR_TEXT_SECONDARY }}>
                  Forward facilitates the introduction. Free for buyers.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-px" style={{ background: COLOR_BORDER }}>
                <SideMetric label="Revenue" value={fmtMoney(deal.revenue)} />
                <SideMetric label="EBITDA" value={fmtMoney(deal.ebitda)} />
                <SideMetric label="Heat" value={`${deal.heatScore ?? '—'}°`} />
                <SideMetric label="Quality" value={`${deal.dealQualityScore ?? '—'}/100`} />
              </div>
              <div className="p-4 border-t flex items-center justify-around" style={{ borderColor: COLOR_BORDER }}>
                <SideAction label="Save"><Heart size={14} /></SideAction>
                <SideAction label="Share"><Share2 size={14} /></SideAction>
                <Link
                  href={`/listing/${deal.slug}/report`}
                  className="flex flex-col items-center gap-1 px-2 py-1 hover:opacity-70 transition-opacity"
                  style={{ color: COLOR_TEXT_SECONDARY }}
                >
                  <FileText size={14} />
                  <span className="text-[10px] font-bold tracking-wide uppercase">Report</span>
                </Link>
              </div>
            </div>

            <Link
              href={`/listing/${deal.slug}/report`}
              className="block rounded-xl border p-4 hover:opacity-90 transition-opacity"
              style={{ borderColor: '#D6C5A8', background: '#FAF6EF' }}
            >
              <div className="flex items-center gap-2 mb-1">
                <BarChart3 size={14} style={{ color: '#B8956A' }} />
                <p className="text-xs font-bold" style={{ color: COLOR_PRIMARY }}>Intelligence Report</p>
              </div>
              <p className="text-[11px] leading-snug" style={{ color: COLOR_TEXT_SECONDARY }}>
                One-page brief: live comparables, demand signal, scores, and transaction readiness. Print-ready PDF.
              </p>
            </Link>

            {/* Financing helper */}
            {deal.financingEligible && (
              <div className="rounded-xl border bg-white p-5" style={{ borderColor: COLOR_BORDER }}>
                <div className="flex items-center gap-2 mb-2">
                  <Target size={14} style={{ color: '#B8956A' }} />
                  <p className="text-xs font-bold tracking-wide uppercase" style={{ color: COLOR_PRIMARY }}>Financing pre-qualified</p>
                </div>
                <p className="text-xs mb-3" style={{ color: COLOR_TEXT_SECONDARY }}>Estimate your monthly payment and screen against SBA / CSBFP / BDC / Sharia-compliant partners.</p>
                <Link href="/finance-center" className="text-xs font-bold hover:underline inline-flex items-center gap-1" style={{ color: COLOR_PRIMARY }}>
                  Open finance center <ArrowRight size={11} />
                </Link>
              </div>
            )}

            {/* Trust strip */}
            <div className="rounded-xl border bg-white p-5 text-xs" style={{ borderColor: COLOR_BORDER }}>
              <div className="flex items-center gap-2 mb-2" style={{ color: COLOR_PRIMARY }}>
                <ShieldCheck size={14} /><p className="font-bold tracking-wide uppercase">Verified by Forward</p>
              </div>
              <p style={{ color: COLOR_TEXT_SECONDARY }}>Seller identity verified, financial documentation reviewed, sanctions-screened. Every introduction is binding under Forward&apos;s intermediary agreement.</p>
            </div>
          </div>
        </aside>
      </div>
      {copilotRole && (
        <CopilotFab role={copilotRole} dealContext={{ dealId: deal.id, title: headline }} />
      )}
    </div>
  )
}

function roleForCopilot(sessionRole: string): 'buyer' | 'seller' | 'broker' {
  if (sessionRole === 'SELLER') return 'seller'
  if (sessionRole === 'BROKER') return 'broker'
  return 'buyer'
}

/* ─── Section helpers ─────────────────────────────────────────────── */

function Section({ eyebrow, title, icon, children }: { eyebrow: string; title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <p className="text-[10px] font-bold tracking-[0.22em] uppercase" style={{ color: '#B8956A' }}>{eyebrow}</p>
      </div>
      <h2 className="text-2xl md:text-3xl font-black mb-5 leading-tight" style={{ color: COLOR_PRIMARY }}>{title}</h2>
      {children}
    </section>
  )
}

function HeroBadge({ icon, label, value, bold }: { icon: React.ReactNode; label: string; value: string; bold?: boolean }) {
  return (
    <div className="rounded-lg px-3 py-2 inline-flex items-center gap-2" style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(8px)' }}>
      {icon}
      <span className="opacity-70">{label}</span>
      <span className={bold ? 'font-black' : 'font-bold'}>{value}</span>
    </div>
  )
}

function MetricCard({ label, value, sub, tone }: { label: string; value: string; sub: string; tone?: 'hot' | 'neutral' }) {
  return (
    <div className="rounded-xl border p-5" style={{ borderColor: tone === 'hot' ? '#B8956A' : COLOR_BORDER, background: tone === 'hot' ? '#FAF6EF' : 'white' }}>
      <p className="text-[10px] font-bold tracking-widest uppercase mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>{label}</p>
      <p className="text-3xl font-black mb-2" style={{ color: tone === 'hot' ? '#B8956A' : COLOR_PRIMARY }}>{value}</p>
      <p className="text-[11px]" style={{ color: COLOR_TEXT_SECONDARY }}>{sub}</p>
    </div>
  )
}

function FinancialRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b pb-2.5" style={{ borderColor: COLOR_BORDER }}>
      <p className="text-[10px] font-bold tracking-widest uppercase mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>{label}</p>
      <p className="text-lg font-black" style={{ color: COLOR_PRIMARY }}>{value}</p>
    </div>
  )
}

function ListBullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5 text-sm leading-relaxed" style={{ color: COLOR_PRIMARY }}>
      <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#B8956A' }} />
      <span>{children}</span>
    </li>
  )
}

function DetailRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="border-b pb-3" style={{ borderColor: COLOR_BORDER }}>
      <div className="flex items-center gap-1.5 mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>{icon}<p className="text-[10px] font-bold tracking-widest uppercase">{label}</p></div>
      <p className="text-sm font-semibold" style={{ color: COLOR_PRIMARY }}>{value}</p>
    </div>
  )
}

function Badge({ children }: { children: React.ReactNode }) {
  return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold border" style={{ borderColor: COLOR_BORDER, color: COLOR_PRIMARY }}>{children}</span>
}

function SideMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white p-4 text-center">
      <p className="text-[10px] font-bold tracking-widest uppercase mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>{label}</p>
      <p className="text-base font-black" style={{ color: COLOR_PRIMARY }}>{value}</p>
    </div>
  )
}

const fmtUsd = (dollars: number): string => {
  if (dollars >= 1_000_000) return `$${(dollars / 1_000_000).toFixed(2)}M`
  if (dollars >= 1_000) return `$${Math.round(dollars / 1_000)}K`
  return `$${Math.round(dollars)}`
}

function CompBand({
  label, p25, median, p75, subject, subjectLabel,
}: {
  label: string; p25: string; median: string; p75: string
  subject: string | null; subjectLabel: string
}) {
  return (
    <div className="rounded-xl border p-4" style={{ borderColor: COLOR_BORDER, background: '#FFFFFF' }}>
      <p className="text-[10px] font-bold tracking-widest uppercase mb-3" style={{ color: COLOR_TEXT_SECONDARY }}>{label}</p>
      <div className="flex items-end justify-between gap-2">
        <div className="text-center">
          <p className="text-[10px] mb-0.5" style={{ color: COLOR_TEXT_SECONDARY }}>P25</p>
          <p className="text-sm font-semibold" style={{ color: COLOR_PRIMARY }}>{p25}</p>
        </div>
        <div className="text-center">
          <p className="text-[10px] mb-0.5" style={{ color: COLOR_TEXT_SECONDARY }}>Median</p>
          <p className="text-lg font-black" style={{ color: COLOR_PRIMARY }}>{median}</p>
        </div>
        <div className="text-center">
          <p className="text-[10px] mb-0.5" style={{ color: COLOR_TEXT_SECONDARY }}>P75</p>
          <p className="text-sm font-semibold" style={{ color: COLOR_PRIMARY }}>{p75}</p>
        </div>
      </div>
      {subject && (
        <div className="mt-3 pt-3 border-t flex items-center justify-between" style={{ borderColor: COLOR_BORDER }}>
          <p className="text-[10px] font-bold tracking-widest uppercase" style={{ color: '#B8956A' }}>{subjectLabel}</p>
          <p className="text-sm font-black" style={{ color: '#B8956A' }}>{subject}</p>
        </div>
      )}
    </div>
  )
}

function SideAction({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <button className="flex flex-col items-center gap-1 px-2 py-1 hover:opacity-70 transition-opacity" style={{ color: COLOR_TEXT_SECONDARY }}>
      {children}
      <span className="text-[10px] font-bold tracking-wide uppercase">{label}</span>
    </button>
  )
}

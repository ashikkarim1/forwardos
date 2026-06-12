import { notFound, redirect } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { PublicHeader } from '@/components/Navigation'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { pageMetadata, breadcrumbLd, jsonLdScript } from '@/lib/seo'
import { confidentialTitle, maskCity } from '@/lib/listing-helpers'
import { COLOR_PRIMARY, COLOR_TEXT_SECONDARY, COLOR_BORDER, COLOR_ACCENT, COLOR_BG_PRIMARY } from '@/styles/forward-colors'
import { TrendingUp, MapPin, Users, Eye, ShieldCheck, Sparkles, DollarSign } from 'lucide-react'

interface Props { params: { slug: string } }

async function getDeal(slug: string) {
  return prisma.deal.findUnique({
    where: { slug },
    select: {
      id: true, slug: true, title: true, description: true, industry: true,
      country: true, city: true, revenue: true, ebitda: true, askingPrice: true,
      employees: true, foundedYear: true, heatScore: true, dealQualityScore: true,
      isConfidential: true, isFranchise: true, financingEligible: true, financingNote: true,
      status: true, publishedAt: true,
    },
  })
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const deal = await getDeal(params.slug).catch(() => null)
  if (!deal) return { title: 'Listing not found', robots: { index: false, follow: false } }
  const title = deal.isConfidential ? confidentialTitle(deal.industry, deal.country, deal.id) : deal.title
  const location = deal.isConfidential ? maskCity(deal.city, deal.country) : (deal.city || deal.country)
  const ask = deal.askingPrice ? `$${(Number(deal.askingPrice) / 100 / 1_000_000).toFixed(1)}M` : 'price on request'
  return pageMetadata({
    title: `${title} (${location}) — ${ask}`,
    description: deal.description?.slice(0, 160) || `${deal.industry} business for sale in ${location}. Verified Forward listing.`,
    path: `/listing/${deal.slug}`,
    keywords: [
      `${deal.industry.toLowerCase()} business for sale`,
      `business for sale ${deal.country}`,
      ...(deal.city ? [`businesses for sale in ${deal.city}`] : []),
    ],
  })
}

// 5-minute ISR — listings are added/modified infrequently relative to traffic.
export const revalidate = 300

export default async function ListingPage({ params }: Props) {
  const deal = await getDeal(params.slug).catch(() => null)
  if (!deal) notFound()
  if (deal.status !== 'ACTIVE' && deal.status !== 'PUBLISHED') {
    // Treat draft/archived listings as 404 to the public.
    notFound()
  }

  const title = deal.isConfidential ? confidentialTitle(deal.industry, deal.country, deal.id) : deal.title
  const location = deal.isConfidential ? maskCity(deal.city, deal.country) : (deal.city || deal.country)
  const ask = deal.askingPrice ? Number(deal.askingPrice) / 100 : null
  const rev = deal.revenue ? Number(deal.revenue) / 100 : null
  const ebitda = deal.ebitda ? Number(deal.ebitda) / 100 : null

  const ldBreadcrumbs = breadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Marketplace', path: '/marketplace' },
    { name: title, path: `/listing/${deal.slug}` },
  ])

  return (
    <div className="min-h-screen" style={{ background: COLOR_BG_PRIMARY }}>
      <PublicHeader />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(ldBreadcrumbs) }} />

      <div className="max-w-4xl mx-auto px-6 py-8">
        <Breadcrumbs items={[
          { label: 'Home', href: '/' },
          { label: 'Marketplace', href: '/marketplace' },
          { label: title.length > 60 ? title.slice(0, 60) + '…' : title },
        ]} />

        <div className="mt-6 rounded-2xl border bg-white p-8" style={{ borderColor: COLOR_BORDER }}>
          {deal.isConfidential && (
            <div className="mb-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold" style={{ background: '#EFF6FF', color: COLOR_ACCENT }}>
              <Eye size={12} /> CONFIDENTIAL LISTING — IDENTITY MASKED
            </div>
          )}
          <h1 className="text-3xl md:text-4xl font-black mb-3" style={{ color: COLOR_PRIMARY }}>{title}</h1>
          <div className="flex flex-wrap gap-4 mb-5 text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
            <span className="flex items-center gap-1"><MapPin size={14} /> {location}</span>
            <span className="flex items-center gap-1"><Sparkles size={14} /> {deal.industry.replace(/_/g, ' ')}</span>
            {deal.employees && <span className="flex items-center gap-1"><Users size={14} /> {deal.employees} employees</span>}
            {deal.foundedYear && <span>Founded {deal.foundedYear}</span>}
          </div>

          <div className="grid sm:grid-cols-3 gap-4 my-6">
            <Stat icon={<DollarSign size={16} />} label="Asking price" value={ask ? formatMoney(ask) : '—'} highlight />
            <Stat icon={<TrendingUp size={16} />} label="Annual revenue" value={rev ? formatMoney(rev) : '—'} />
            <Stat icon={<ShieldCheck size={16} />} label="EBITDA" value={ebitda ? formatMoney(ebitda) : '—'} />
          </div>

          {deal.description && (
            <div className="my-6">
              <h2 className="text-lg font-bold mb-2" style={{ color: COLOR_PRIMARY }}>About this business</h2>
              <p className="text-sm leading-relaxed" style={{ color: COLOR_TEXT_SECONDARY }}>{deal.description}</p>
            </div>
          )}

          {deal.financingEligible && (
            <div className="rounded-lg border p-4 mt-6 flex items-start gap-3" style={{ borderColor: COLOR_BORDER, background: '#EAF5F0' }}>
              <ShieldCheck size={20} style={{ color: '#2D7A5F' }} />
              <div>
                <p className="font-bold text-sm" style={{ color: COLOR_PRIMARY }}>Financing-eligible</p>
                <p className="text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>{deal.financingNote || 'Eligible for SBA / CSBFP / BDC / Sharia-compliant financing — apply through Forward Finance Center.'}</p>
              </div>
            </div>
          )}

          <div className="border-t mt-8 pt-6" style={{ borderColor: COLOR_BORDER }}>
            <p className="text-sm mb-3" style={{ color: COLOR_TEXT_SECONDARY }}>
              Interested? Forward verifies every buyer with KYC + funds-of-source before connecting them with the seller.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href={`/auth/login?redirect=/deal/${deal.id}/inquire`} className="px-5 py-3 rounded-lg font-bold text-white hover:opacity-90" style={{ background: COLOR_ACCENT }}>
                Inquire — verified buyer
              </Link>
              <Link href="/auth/signup" className="px-5 py-3 rounded-lg font-bold border hover:bg-gray-50" style={{ borderColor: COLOR_BORDER, color: COLOR_PRIMARY }}>
                Create a buyer account
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-xl border p-6 text-center" style={{ borderColor: COLOR_BORDER, background: '#EFF6FF' }}>
          <p className="text-sm font-bold mb-2" style={{ color: COLOR_PRIMARY }}>Selling a similar business?</p>
          <p className="text-sm mb-3" style={{ color: COLOR_TEXT_SECONDARY }}>List free, anonymously, in 90 seconds.</p>
          <Link href={`/list?industry=${deal.industry}&country=${deal.country}`} className="inline-flex items-center gap-2 px-5 py-3 rounded-lg font-bold text-white hover:opacity-90" style={{ background: COLOR_ACCENT }}>
            Publish my confidential listing
          </Link>
        </div>
      </div>
    </div>
  )
}

function Stat({ icon, label, value, highlight }: { icon: React.ReactNode; label: string; value: string; highlight?: boolean }) {
  return (
    <div className="rounded-lg border p-4" style={{ borderColor: highlight ? COLOR_ACCENT : COLOR_BORDER, background: highlight ? '#EFF6FF' : 'white', borderWidth: highlight ? 2 : 1 }}>
      <div className="flex items-center gap-1.5 mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>{icon}<span className="text-xs font-semibold">{label}</span></div>
      <p className="text-xl font-black" style={{ color: highlight ? COLOR_ACCENT : COLOR_PRIMARY }}>{value}</p>
    </div>
  )
}

function formatMoney(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`
  return `$${n.toFixed(0)}`
}

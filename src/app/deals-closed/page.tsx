import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { PublicHeader } from '@/components/Navigation'
import { pageMetadata, breadcrumbLd, jsonLdScript } from '@/lib/seo'
import { industryLabel } from '@/lib/listing-narrative'
import { maskCity } from '@/lib/listing-helpers'
import { formatAskingRange } from '@/lib/public-listing'
import { DEALS_CLOSED_PUBLIC_THRESHOLD } from '@/lib/pricing'
import { COLOR_PRIMARY, COLOR_TEXT_SECONDARY, COLOR_BORDER, COLOR_BG_PRIMARY } from '@/styles/forward-colors'
import { CheckCircle2, ArrowRight, ChevronRight } from 'lucide-react'

export const metadata: Metadata = pageMetadata({
  title: 'Deals Closed — Forward Intelligence',
  description: 'Confidential business sales closed through Forward Intelligence. Anonymized to protect every party.',
  path: '/deals-closed',
})

export const revalidate = 600 // 10 minutes

export default async function DealsClosedPage() {
  // Hide the page entirely until we have meaningful social proof.
  // Empty "we've closed 0 deals" is worse than no page.
  const total = await prisma.deal.count({ where: { status: 'CLOSED' } }).catch(() => 0)
  if (total < DEALS_CLOSED_PUBLIC_THRESHOLD) {
    notFound()
  }

  // Pull the most recent 30 closed deals — anonymized.
  const closed = await prisma.deal.findMany({
    where: { status: 'CLOSED' },
    orderBy: { closedAt: 'desc' },
    take: 30,
    select: { id: true, industry: true, country: true, city: true, askingPrice: true, closedAt: true },
  })

  const fmt = (d: Date | null) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '—'

  return (
    <div className="min-h-screen" style={{ background: COLOR_BG_PRIMARY }}>
      <PublicHeader />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Deals Closed', path: '/deals-closed' }])) }} />

      <nav aria-label="Breadcrumb" className="border-b" style={{ borderColor: COLOR_BORDER, background: 'white' }}>
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center gap-1.5 text-xs">
          <Link href="/" className="hover:underline" style={{ color: COLOR_TEXT_SECONDARY }}>Home</Link>
          <ChevronRight size={12} style={{ color: COLOR_TEXT_SECONDARY }} />
          <span className="font-semibold" style={{ color: COLOR_PRIMARY }}>Deals Closed</span>
        </div>
      </nav>

      <section className="px-6 py-14 border-b text-center" style={{ borderColor: COLOR_BORDER, background: 'white' }}>
        <p className="text-[10px] font-bold tracking-[0.25em] mb-3" style={{ color: '#B8956A' }}>FORWARD TRACK RECORD</p>
        <h1 className="text-4xl md:text-6xl font-black mb-4" style={{ color: COLOR_PRIMARY }}>
          {total.toLocaleString()} businesses sold through Forward.
        </h1>
        <p className="text-lg max-w-2xl mx-auto" style={{ color: COLOR_TEXT_SECONDARY }}>
          Every deal is confidential — we never reveal seller identity, even after sale. Below is an anonymized sample of recent transactions.
        </p>
      </section>

      <section className="px-6 py-12">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-black mb-6" style={{ color: COLOR_PRIMARY }}>Most recent closes</h2>
          <div className="rounded-2xl border bg-white overflow-hidden" style={{ borderColor: COLOR_BORDER }}>
            <div className="grid grid-cols-[auto_1fr_auto_auto] gap-x-6 gap-y-0 text-sm">
              <div className="contents text-[10px] font-bold tracking-widest uppercase" style={{ color: COLOR_TEXT_SECONDARY }}>
                <div className="px-5 py-3 border-b" style={{ borderColor: COLOR_BORDER }}>Industry</div>
                <div className="px-5 py-3 border-b" style={{ borderColor: COLOR_BORDER }}>Region</div>
                <div className="px-5 py-3 border-b" style={{ borderColor: COLOR_BORDER }}>Asking Range</div>
                <div className="px-5 py-3 border-b" style={{ borderColor: COLOR_BORDER }}>Closed</div>
              </div>
              {closed.map((d) => (
                <div key={d.id} className="contents">
                  <div className="px-5 py-3 border-b font-semibold flex items-center gap-2" style={{ borderColor: COLOR_BORDER, color: COLOR_PRIMARY }}>
                    <CheckCircle2 size={13} style={{ color: '#2D7A5F' }} />
                    {industryLabel(d.industry)}
                  </div>
                  <div className="px-5 py-3 border-b" style={{ borderColor: COLOR_BORDER, color: COLOR_TEXT_SECONDARY }}>{maskCity(d.city, d.country)}</div>
                  <div className="px-5 py-3 border-b" style={{ borderColor: COLOR_BORDER, color: COLOR_PRIMARY }}>{formatAskingRange(d.askingPrice ?? null)}</div>
                  <div className="px-5 py-3 border-b text-xs" style={{ borderColor: COLOR_BORDER, color: COLOR_TEXT_SECONDARY }}>{fmt(d.closedAt)}</div>
                </div>
              ))}
            </div>
          </div>
          <p className="text-xs mt-6" style={{ color: COLOR_TEXT_SECONDARY }}>
            Forward never names a buyer, seller, or company — not before, during, or after the sale. Closed-deal data exists to demonstrate platform velocity, not to compromise confidentiality.
          </p>
        </div>
      </section>

      <section className="px-6 py-16 border-t text-center" style={{ borderColor: COLOR_BORDER, background: 'white' }}>
        <h2 className="text-2xl md:text-3xl font-black mb-3" style={{ color: COLOR_PRIMARY }}>Could your business be next?</h2>
        <p className="mb-6 max-w-md mx-auto" style={{ color: COLOR_TEXT_SECONDARY }}>List free, confidentially, in 90 seconds.</p>
        <Link href="/list" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-white hover:opacity-90" style={{ background: COLOR_PRIMARY }}>
          List your business <ArrowRight size={15} />
        </Link>
      </section>
    </div>
  )
}

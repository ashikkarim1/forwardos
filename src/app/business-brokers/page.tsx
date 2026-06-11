import type { Metadata } from 'next'
import Link from 'next/link'
import { PublicHeader } from '@/components/Navigation'
import { BROKERS, REGION_FLAGS, LANGUAGE_LABELS } from '@/lib/broker-data'
import { pageMetadata, breadcrumbLd, faqLd, jsonLdScript } from '@/lib/seo'
import { COLOR_PRIMARY, COLOR_TEXT_SECONDARY, COLOR_BORDER, COLOR_ACCENT, COLOR_BG_PRIMARY } from '@/styles/forward-colors'

export const metadata: Metadata = pageMetadata({
  title: 'Business Brokers in Canada & the UAE — Verified Directory',
  description: 'Find a verified business broker in Canada or the UAE. Browse advisors by region, industry, and language (EN/FR/AR), read verified-deal reviews, or join as a broker to list businesses.',
  path: '/business-brokers',
  keywords: ['business brokers', 'business broker', 'M&A advisors', 'business brokers Canada', 'business brokers UAE', 'business brokers Dubai', 'sell business through broker', 'become a business broker'],
})

const faqs = [
  { q: 'What does a business broker do?', a: 'A business broker helps owners sell their business — valuing it, marketing it confidentially, qualifying buyers, and managing negotiations through to closing.' },
  { q: 'How do I choose a broker on Forward?', a: 'Browse our verified directory by region, industry, and language. Each broker profile shows their track record, specialties, and reviews tied to real closed deals.' },
  { q: 'Can brokers list multiple businesses?', a: 'Yes. Brokers can join Forward to list and manage multiple businesses, reach verified buyers across Canada and the UAE, and build a reviewed public profile.' },
]

export default function BusinessBrokersPage() {
  const featured = BROKERS.filter((b) => b.isFeatured).concat(BROKERS.filter((b) => !b.isFeatured)).slice(0, 6)
  return (
    <div className="min-h-screen" style={{ background: COLOR_BG_PRIMARY }}>
      <PublicHeader />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Business Brokers', path: '/business-brokers' }])) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(faqLd(faqs)) }} />

      <section className="px-6 py-12 border-b" style={{ borderColor: COLOR_BORDER, background: '#EFF6FF' }}>
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-black mb-3" style={{ color: COLOR_PRIMARY }}>Business Brokers in Canada & the UAE</h1>
          <p className="text-lg max-w-3xl mb-6" style={{ color: COLOR_TEXT_SECONDARY }}>
            Find a verified M&A advisor by region, industry, and language — or join Forward as a broker to list
            businesses and reach verified buyers. Every review is tied to a real closed deal.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/brokers" className="px-6 py-3 rounded-lg font-bold text-white hover:opacity-90" style={{ background: COLOR_ACCENT }}>Browse the directory</Link>
            <Link href="/seller/register?plan=premium" className="px-6 py-3 rounded-lg font-bold border bg-white hover:bg-gray-50" style={{ borderColor: COLOR_BORDER, color: COLOR_PRIMARY }}>Join as a broker</Link>
          </div>
        </div>
      </section>

      <section className="px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-black mb-6" style={{ color: COLOR_PRIMARY }}>Featured brokers</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((b) => (
              <Link key={b.id} href={`/brokers/${b.id}`} className="block bg-white rounded-xl border p-6 hover:shadow-md transition-shadow" style={{ borderColor: COLOR_BORDER }}>
                <h3 className="font-bold mb-1" style={{ color: COLOR_PRIMARY }}>{b.name}</h3>
                <p className="text-sm font-medium mb-2" style={{ color: COLOR_TEXT_SECONDARY }}>{b.company}</p>
                <p className="text-sm mb-3" style={{ color: COLOR_PRIMARY }}>{b.headline}</p>
                <div className="flex flex-wrap gap-1.5">
                  {b.regions.map((r) => <span key={r} className="text-xs px-2 py-0.5 rounded-md" style={{ background: '#F3F4F6', color: COLOR_PRIMARY }}>{REGION_FLAGS[r]} {r === 'CANADA' ? 'Canada' : 'UAE'}</span>)}
                  {b.languages.map((l) => <span key={l} className="text-xs px-2 py-0.5 rounded-md" style={{ background: '#EFF6FF', color: COLOR_ACCENT }}>{LANGUAGE_LABELS[l]}</span>)}
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-8">
            <Link href="/brokers" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white hover:opacity-90" style={{ background: COLOR_ACCENT }}>See all brokers →</Link>
          </div>
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-black mb-6" style={{ color: COLOR_PRIMARY }}>Frequently asked questions</h2>
          <div className="space-y-4">
            {faqs.map((f) => (
              <div key={f.q} className="bg-white rounded-xl border p-5" style={{ borderColor: COLOR_BORDER }}>
                <h3 className="font-bold mb-1" style={{ color: COLOR_PRIMARY }}>{f.q}</h3>
                <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

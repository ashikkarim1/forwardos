import type { Metadata } from 'next'
import Link from 'next/link'
import { PublicHeader } from '@/components/Navigation'
import { SeoDealGrid } from '@/components/seo/SeoDealGrid'
import { franchiseDeals } from '@/lib/seo-deals'
import { SEO_LOCATIONS } from '@/lib/seo-locations'
import { pageMetadata, breadcrumbLd, faqLd, itemListLd, jsonLdScript } from '@/lib/seo'
import { COLOR_PRIMARY, COLOR_TEXT_SECONDARY, COLOR_BORDER, COLOR_ACCENT, COLOR_BG_PRIMARY } from '@/styles/forward-colors'

export const metadata: Metadata = pageMetadata({
  title: 'Franchises for Sale in Canada & the UAE (2026)',
  description: 'Browse franchise opportunities and resale franchises for sale in Canada and the UAE. Verified listings, transparent financials, financing options, and AI deal intelligence.',
  path: '/franchises-for-sale',
  keywords: ['franchises for sale', 'franchise for sale', 'buy a franchise', 'franchise opportunities', 'franchise resale', 'franchises for sale Canada', 'franchises for sale UAE'],
})

const faqs = [
  { q: 'What does it cost to buy a franchise?', a: 'Franchise costs vary widely by brand and territory. Listings on Forward show the asking price and, where available, revenue and cash flow so you can assess the full investment.' },
  { q: 'Can I finance a franchise purchase?', a: 'Yes — Canadian buyers can use CSBFP and BDC financing, and UAE buyers can access SME and Sharia-compliant products. Model your payments in the Finance Center.' },
  { q: 'Are these new franchises or resales?', a: 'Both. Forward lists new franchise opportunities and existing franchise resales (buy-ins), each clearly labelled.' },
]

export default async function FranchisesPage() {
  const deals = await franchiseDeals()
  return (
    <div className="min-h-screen" style={{ background: COLOR_BG_PRIMARY }}>
      <PublicHeader />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Franchises for Sale', path: '/franchises-for-sale' }])) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(itemListLd(deals)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(faqLd(faqs)) }} />

      <section className="px-6 py-12 border-b" style={{ borderColor: COLOR_BORDER, background: '#EFF6FF' }}>
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-black mb-3" style={{ color: COLOR_PRIMARY }}>Franchises for Sale</h1>
          <p className="text-lg max-w-3xl" style={{ color: COLOR_TEXT_SECONDARY }}>
            Discover new franchise opportunities and franchise resales across Canada and the UAE — with verified
            financials, AI deal scores, and financing options on every listing.
          </p>
        </div>
      </section>

      <section className="px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-black mb-6" style={{ color: COLOR_PRIMARY }}>Featured franchise listings</h2>
          <SeoDealGrid deals={deals} />
          <div className="mt-8">
            <Link href="/marketplace?industries=" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white hover:opacity-90" style={{ background: COLOR_ACCENT }}>
              Browse all listings →
            </Link>
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
          <div className="mt-10 flex flex-wrap gap-2">
            {SEO_LOCATIONS.map((l) => (
              <Link key={l.slug} href={`/businesses-for-sale/${l.slug}`} className="px-3 py-1.5 rounded-full text-sm font-semibold border hover:bg-gray-50" style={{ borderColor: COLOR_BORDER, color: COLOR_PRIMARY }}>
                Businesses in {l.name}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PublicHeader } from '@/components/Navigation'
import { SeoDealGrid } from '@/components/seo/SeoDealGrid'
import { SEO_LOCATIONS, getSeoLocation } from '@/lib/seo-locations'
import { dealsByLocation, dealCountByLocation } from '@/lib/seo-deals'
import { pageMetadata, breadcrumbLd, faqLd, itemListLd, jsonLdScript } from '@/lib/seo'
import { COLOR_PRIMARY, COLOR_TEXT_SECONDARY, COLOR_BORDER, COLOR_ACCENT, COLOR_BG_PRIMARY } from '@/styles/forward-colors'

export function generateStaticParams() {
  return SEO_LOCATIONS.map((l) => ({ location: l.slug }))
}

export async function generateMetadata({ params }: { params: { location: string } }): Promise<Metadata> {
  const loc = getSeoLocation(params.location)
  if (!loc) return { title: 'Businesses for Sale' }
  const title = `Businesses for Sale in ${loc.name} (2026) — Verified Listings`
  return pageMetadata({
    title,
    description: `Browse verified businesses and franchises for sale in ${loc.name}. Real financials, AI deal scores, and financing options. ${loc.financing}`,
    path: `/businesses-for-sale/${loc.slug}`,
    keywords: [
      `businesses for sale in ${loc.name}`, `business for sale ${loc.name}`,
      `buy a business in ${loc.name}`, `franchises for sale ${loc.name}`, `${loc.name} business brokers`,
    ],
  })
}

export default async function LocationPage({ params }: { params: { location: string } }) {
  const loc = getSeoLocation(params.location)
  if (!loc) notFound()

  const [deals, count] = await Promise.all([
    dealsByLocation({ country: loc.dbCountry, city: loc.dbCity }),
    dealCountByLocation(loc.dbCountry, loc.dbCity),
  ])

  const faqs = [
    { q: `How many businesses are for sale in ${loc.name}?`, a: `Forward currently lists ${count || 'a growing number of'} verified businesses for sale in ${loc.name}, updated daily across industries including services, retail, hospitality, technology, and franchises.` },
    { q: `How do I finance a business acquisition in ${loc.name}?`, a: loc.financing },
    { q: `Are the listings in ${loc.name} verified?`, a: `Yes. Sellers complete identity and business verification, and every listing carries an AI deal-quality score so you can shop with confidence.` },
    { q: `Can I sell my business in ${loc.name} on Forward?`, a: `Absolutely. List free, or choose Premium for featured placement — currently 50% off during our 90-day launch.` },
  ]

  return (
    <div className="min-h-screen" style={{ background: COLOR_BG_PRIMARY }}>
      <PublicHeader />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(breadcrumbLd([
        { name: 'Home', path: '/' },
        { name: 'Businesses for Sale', path: '/marketplace' },
        { name: loc.name, path: `/businesses-for-sale/${loc.slug}` },
      ])) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(itemListLd(deals)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(faqLd(faqs)) }} />

      {/* Hero */}
      <section className="px-6 py-12 border-b" style={{ borderColor: COLOR_BORDER, background: '#EFF6FF' }}>
        <div className="max-w-6xl mx-auto">
          <nav className="text-sm mb-3" style={{ color: COLOR_TEXT_SECONDARY }}>
            <Link href="/" style={{ color: COLOR_ACCENT }}>Home</Link> ›{' '}
            <Link href="/marketplace" style={{ color: COLOR_ACCENT }}>Businesses for Sale</Link> › {loc.name}
          </nav>
          <h1 className="text-4xl md:text-5xl font-black mb-3" style={{ color: COLOR_PRIMARY }}>
            Businesses for Sale in {loc.name}
          </h1>
          <p className="text-lg max-w-3xl" style={{ color: COLOR_TEXT_SECONDARY }}>{loc.intro}</p>
        </div>
      </section>

      {/* Listings */}
      <section className="px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-black mb-6" style={{ color: COLOR_PRIMARY }}>
            {count > 0 ? `${count} businesses for sale in ${loc.name}` : `Featured businesses in ${loc.name}`}
          </h2>
          <SeoDealGrid deals={deals} />
          <div className="mt-8">
            <Link href="/marketplace" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white hover:opacity-90" style={{ background: COLOR_ACCENT }}>
              See all listings & filters →
            </Link>
          </div>
        </div>
      </section>

      {/* Financing + internal links */}
      <section className="px-6 pb-10">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border p-6" style={{ borderColor: COLOR_BORDER }}>
            <h3 className="text-lg font-bold mb-2" style={{ color: COLOR_PRIMARY }}>Financing your acquisition</h3>
            <p className="text-sm mb-3" style={{ color: COLOR_TEXT_SECONDARY }}>{loc.financing}</p>
            <Link href="/finance-center" style={{ color: COLOR_ACCENT }} className="text-sm font-semibold">Open the Finance Center →</Link>
          </div>
          <div className="bg-white rounded-xl border p-6" style={{ borderColor: COLOR_BORDER }}>
            <h3 className="text-lg font-bold mb-2" style={{ color: COLOR_PRIMARY }}>Selling a business in {loc.name}?</h3>
            <p className="text-sm mb-3" style={{ color: COLOR_TEXT_SECONDARY }}>List free or go Premium at 50% off during our 90-day launch. The more complete your listing, the more buyers you reach.</p>
            <Link href="/sell-your-business" style={{ color: COLOR_ACCENT }} className="text-sm font-semibold">Sell your business →</Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
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

          {/* Other locations — internal linking */}
          <div className="mt-10">
            <h3 className="font-bold mb-3" style={{ color: COLOR_PRIMARY }}>Explore other locations</h3>
            <div className="flex flex-wrap gap-2">
              {SEO_LOCATIONS.filter((l) => l.slug !== loc.slug).map((l) => (
                <Link key={l.slug} href={`/businesses-for-sale/${l.slug}`} className="px-3 py-1.5 rounded-full text-sm font-semibold border hover:bg-gray-50" style={{ borderColor: COLOR_BORDER, color: COLOR_PRIMARY }}>
                  {l.name}
                </Link>
              ))}
              <Link href="/franchises-for-sale" className="px-3 py-1.5 rounded-full text-sm font-semibold border hover:bg-gray-50" style={{ borderColor: COLOR_BORDER, color: COLOR_ACCENT }}>
                Franchises for sale
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

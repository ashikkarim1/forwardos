import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PublicHeader } from '@/components/Navigation'
import { SeoDealGrid } from '@/components/seo/SeoDealGrid'
import { SEO_INDUSTRIES, getSeoIndustry } from '@/lib/seo-industries'
import { SEO_LOCATIONS } from '@/lib/seo-locations'
import { dealsByIndustry, dealCountByIndustry } from '@/lib/seo-deals'
import { pageMetadata, breadcrumbLd, faqLd, itemListLd, jsonLdScript } from '@/lib/seo'
import { COLOR_PRIMARY, COLOR_TEXT_SECONDARY, COLOR_BORDER, COLOR_ACCENT, COLOR_BG_PRIMARY } from '@/styles/forward-colors'

export function generateStaticParams() {
  return SEO_INDUSTRIES.map((i) => ({ industry: i.slug }))
}

export async function generateMetadata({ params }: { params: { industry: string } }): Promise<Metadata> {
  const ind = getSeoIndustry(params.industry)
  if (!ind) return { title: 'Businesses for Sale' }
  // Pick the right noun: "SaaS / E-Commerce / Healthcare Businesses for Sale" vs
  // "Restaurants / Hotels for Sale" (already-plural nouns shouldn't get "Businesses").
  const alreadyPlural = ['Restaurants'].includes(ind.name)
  const title = `${ind.name}${alreadyPlural ? '' : ' Businesses'} for Sale (2026) — Verified Listings`
  return pageMetadata({
    title,
    description: `Browse verified ${ind.name.toLowerCase()} businesses for sale across the USA, Canada, and the UAE. ${ind.hero.split('—')[1]?.trim() || ind.hero}`,
    path: `/businesses-for-sale/industry/${ind.slug}`,
    keywords: ind.keywords,
  })
}

export default async function IndustryPage({ params }: { params: { industry: string } }) {
  const ind = getSeoIndustry(params.industry)
  if (!ind) notFound()

  const [deals, count] = await Promise.all([
    ind.dbIndustry ? dealsByIndustry(ind.dbIndustry) : Promise.resolve([]),
    ind.dbIndustry ? dealCountByIndustry(ind.dbIndustry) : Promise.resolve(0),
  ])

  const faqs = [
    { q: `How are ${ind.name.toLowerCase()} businesses typically valued?`, a: ind.what },
    { q: `How do buyers finance a ${ind.name.toLowerCase()} acquisition?`, a: ind.financing },
    { q: `Are listings on Forward Intelligence verified?`, a: 'Yes — sellers complete identity and business verification, and every listing carries an AI deal-quality score plus financials cross-checking.' },
    { q: `How many ${ind.name.toLowerCase()} businesses are listed right now?`, a: count > 0 ? `Forward currently lists ${count} verified ${ind.name.toLowerCase()} businesses for sale, updated daily.` : `New ${ind.name.toLowerCase()} listings are added daily — set up a saved-search alert to be notified the moment a match goes live.` },
  ]

  return (
    <div className="min-h-screen" style={{ background: COLOR_BG_PRIMARY }}>
      <PublicHeader />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(breadcrumbLd([
        { name: 'Home', path: '/' }, { name: 'Businesses for Sale', path: '/marketplace' }, { name: ind.name, path: `/businesses-for-sale/industry/${ind.slug}` },
      ])) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(itemListLd(deals)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(faqLd(faqs)) }} />

      <section className="px-6 py-12 border-b" style={{ borderColor: COLOR_BORDER, background: '#EFF6FF' }}>
        <div className="max-w-6xl mx-auto">
          <nav className="text-sm mb-3" style={{ color: COLOR_TEXT_SECONDARY }}>
            <Link href="/" style={{ color: COLOR_ACCENT }}>Home</Link> ›{' '}
            <Link href="/marketplace" style={{ color: COLOR_ACCENT }}>Businesses for Sale</Link> › {ind.name}
          </nav>
          <h1 className="text-4xl md:text-5xl font-black mb-3" style={{ color: COLOR_PRIMARY }}>
            {ind.name} Businesses for Sale
          </h1>
          <p className="text-lg max-w-3xl" style={{ color: COLOR_TEXT_SECONDARY }}>{ind.hero}</p>
        </div>
      </section>

      <section className="px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-black mb-6" style={{ color: COLOR_PRIMARY }}>
            {count > 0 ? `${count} ${ind.name.toLowerCase()} businesses for sale` : `Featured ${ind.name.toLowerCase()} businesses`}
          </h2>
          <SeoDealGrid deals={deals} />
          <div className="mt-8">
            <Link href="/marketplace" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white hover:opacity-90" style={{ background: COLOR_ACCENT }}>
              See all listings & filters →
            </Link>
          </div>
        </div>
      </section>

      {/* What to look for + financing */}
      <section className="px-6 pb-10">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border p-6" style={{ borderColor: COLOR_BORDER }}>
            <h3 className="text-lg font-bold mb-2" style={{ color: COLOR_PRIMARY }}>What to diligence in a {ind.name.toLowerCase()} acquisition</h3>
            <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>{ind.what}</p>
          </div>
          <div className="bg-white rounded-xl border p-6" style={{ borderColor: COLOR_BORDER }}>
            <h3 className="text-lg font-bold mb-2" style={{ color: COLOR_PRIMARY }}>Financing options</h3>
            <p className="text-sm mb-3" style={{ color: COLOR_TEXT_SECONDARY }}>{ind.financing}</p>
            <Link href="/finance-center" style={{ color: COLOR_ACCENT }} className="text-sm font-semibold">Open the Finance Center →</Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 pb-10">
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

      {/* Cross-linking: other industries + locations */}
      <section className="px-6 pb-20">
        <div className="max-w-3xl mx-auto">
          <h3 className="font-bold mb-3" style={{ color: COLOR_PRIMARY }}>Explore other industries</h3>
          <div className="flex flex-wrap gap-2 mb-6">
            {SEO_INDUSTRIES.filter((i) => i.slug !== ind.slug).map((i) => (
              <Link key={i.slug} href={`/businesses-for-sale/industry/${i.slug}`} className="px-3 py-1.5 rounded-full text-sm font-semibold border hover:bg-gray-50" style={{ borderColor: COLOR_BORDER, color: COLOR_PRIMARY }}>{i.name}</Link>
            ))}
          </div>
          <h3 className="font-bold mb-3" style={{ color: COLOR_PRIMARY }}>By location</h3>
          <div className="flex flex-wrap gap-2">
            {SEO_LOCATIONS.map((l) => (
              <Link key={l.slug} href={`/businesses-for-sale/${l.slug}`} className="px-3 py-1.5 rounded-full text-sm font-semibold border hover:bg-gray-50" style={{ borderColor: COLOR_BORDER, color: COLOR_PRIMARY }}>{l.name}</Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

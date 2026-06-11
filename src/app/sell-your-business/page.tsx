import type { Metadata } from 'next'
import Link from 'next/link'
import { PublicHeader } from '@/components/Navigation'
import { SEO_LOCATIONS } from '@/lib/seo-locations'
import { pageMetadata, breadcrumbLd, faqLd, jsonLdScript } from '@/lib/seo'
import { PRICING, LAUNCH_DISCOUNT_PCT } from '@/lib/pricing'
import { COLOR_PRIMARY, COLOR_TEXT_SECONDARY, COLOR_BORDER, COLOR_ACCENT, COLOR_BG_PRIMARY } from '@/styles/forward-colors'

export const metadata: Metadata = pageMetadata({
  title: 'Sell Your Business — List Free in the USA, Canada & the UAE',
  description: 'Sell your business or franchise on Forward. List free, reach verified buyers, get an AI valuation, and only pay for Premium placement — currently 50% off for 90 days.',
  path: '/sell-your-business',
  keywords: ['sell my business', 'sell a business', 'how to sell my business', 'sell my business online', 'business for sale by owner', 'sell my business Canada', 'sell my business UAE'],
})

const steps = [
  { n: '1', t: 'Create your free account', d: 'Sign up and verify your email. No credit card required.' },
  { n: '2', t: 'Get verified', d: 'Complete quick identity and business verification to build buyer trust.' },
  { n: '3', t: 'Build your listing', d: 'Add your financials, photos, and story. The more complete, the more buyers you reach.' },
  { n: '4', t: 'Reach verified buyers', d: 'Get matched with qualified buyers, message securely, and share documents in a data room.' },
]

const faqs = [
  { q: 'How much does it cost to sell my business?', a: `Listing is free. Premium featured placement is normally $${PRICING.premium.regular}/mo and is currently ${LAUNCH_DISCOUNT_PCT}% off — just $${PRICING.premium.launch}/mo during our 90-day launch.` },
  { q: 'How is my business valued?', a: 'Forward provides a free AI valuation range based on your financials and comparable sales, so you can price with confidence.' },
  { q: 'Who sees my listing?', a: 'Verified buyers across the USA, Canada and the UAE discover your listing through search, alerts, and our marketplace. Confidential details are only shared after NDA.' },
  { q: 'Do I pay commission?', a: 'Forward charges no success commission. You keep your proceeds (any broker you separately engage sets their own terms).' },
]

export default function SellYourBusinessPage() {
  return (
    <div className="min-h-screen" style={{ background: COLOR_BG_PRIMARY }}>
      <PublicHeader />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Sell Your Business', path: '/sell-your-business' }])) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(faqLd(faqs)) }} />

      <section className="px-6 py-14 border-b" style={{ borderColor: COLOR_BORDER, background: '#EFF6FF' }}>
        <div className="max-w-5xl mx-auto text-center">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold text-white mb-4" style={{ background: '#2D7A5F' }}>
            LIST FREE · PREMIUM {LAUNCH_DISCOUNT_PCT}% OFF FOR 90 DAYS
          </span>
          <h1 className="text-4xl md:text-5xl font-black mb-3" style={{ color: COLOR_PRIMARY }}>Sell your business with confidence</h1>
          <p className="text-lg max-w-2xl mx-auto mb-6" style={{ color: COLOR_TEXT_SECONDARY }}>
            List your business or franchise free, reach verified buyers across the USA, Canada and the UAE, and get a free
            AI valuation. Only pay if you want featured placement.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/seller/register?plan=freemium" className="px-6 py-3 rounded-lg font-bold text-white hover:opacity-90" style={{ background: COLOR_ACCENT }}>List your business free</Link>
            <Link href="/pricing" className="px-6 py-3 rounded-lg font-bold border bg-white hover:bg-gray-50" style={{ borderColor: COLOR_BORDER, color: COLOR_PRIMARY }}>See pricing</Link>
          </div>
        </div>
      </section>

      <section className="px-6 py-12">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-black mb-8 text-center" style={{ color: COLOR_PRIMARY }}>How it works</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {steps.map((s) => (
              <div key={s.n} className="bg-white rounded-xl border p-6" style={{ borderColor: COLOR_BORDER }}>
                <div className="w-9 h-9 rounded-full flex items-center justify-center font-black text-white mb-3" style={{ background: COLOR_ACCENT }}>{s.n}</div>
                <h3 className="font-bold mb-1" style={{ color: COLOR_PRIMARY }}>{s.t}</h3>
                <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>{s.d}</p>
              </div>
            ))}
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

import type { Metadata } from 'next'
import Link from 'next/link'
import { PublicHeader } from '@/components/Navigation'
import { SEO_LOCATIONS } from '@/lib/seo-locations'
import { pageMetadata, breadcrumbLd, faqLd, jsonLdScript } from '@/lib/seo'
import { PRICING, LAUNCH_DISCOUNT_PCT } from '@/lib/pricing'
import { BuyerDemandHero } from '@/components/BuyerDemandSignal'
import { COLOR_PRIMARY, COLOR_TEXT_SECONDARY, COLOR_BORDER, COLOR_ACCENT, COLOR_BG_PRIMARY } from '@/styles/forward-colors'
import { Eye, ShieldCheck, Sparkles, Zap, TrendingUp, ChevronRight } from 'lucide-react'

export const metadata: Metadata = pageMetadata({
  title: 'Sell Your Business — List Free in 90 Seconds (Anonymous)',
  description: 'Sell your business or franchise on Forward. Free anonymous listing in 90 seconds, reach verified buyers across USA, Canada & UAE, free AI valuation, no commission.',
  path: '/sell-your-business',
  keywords: ['sell my business', 'sell a business', 'how to sell my business', 'sell my business online', 'business for sale by owner', 'sell my business Canada', 'sell my business UAE'],
})

const fastSteps = [
  { n: '1', t: 'Tell us about your business', d: 'Industry, country, revenue & asking ranges. 6 fields. No financials required.' },
  { n: '2', t: 'Listing goes live — anonymous', d: 'Verified buyers can discover it immediately. Name, exact city, identity all masked.' },
  { n: '3', t: 'Reveal more when you\'re ready', d: 'Add photos, financials, identity. Upgrade buyer fit in your dashboard — at your pace.' },
]

const faqs = [
  { q: 'Who can see my listing? Will my employees or competitors find out?', a: 'Listings publish **anonymous by default** — buyers see industry + country + financial ranges only. Your name, company, exact city, and identifying details are masked. You choose if and when to reveal more, only to specific buyers after they sign an NDA in-app.' },
  { q: 'How much does it cost to sell my business?', a: `Listing is **100% free**. Premium featured placement is currently $${PRICING.premium.launch}/mo (${LAUNCH_DISCOUNT_PCT}% off for 90 days) — optional. We charge **no success commission**, ever.` },
  { q: 'How is my business valued?', a: 'Use our [free Valuation tool](/valuation) — 8 questions, instant range, no signup. Or just pick from asking-price ranges and refine later. We pull from industry-multiple comparables in your country.' },
  { q: 'How long does it take to list?', a: 'About 90 seconds. No documents required to publish. You can come back later to add photos, financials, or identity verification to boost visibility.' },
  { q: 'Will Forward really have buyers for me?', a: 'See the live buyer-demand counter on this page. We seed every region with verified buyer accounts before opening seller signups. Plus financing partners (SBA, BDC, CSBFP, Sharia-compliant) bring funded buyers directly to your listing.' },
  { q: 'Do I pay commission?', a: 'No. Forward charges no success commission. You keep your proceeds. Any broker you separately engage sets their own terms.' },
]

export default function SellYourBusinessPage() {
  return (
    <div className="min-h-screen" style={{ background: COLOR_BG_PRIMARY }}>
      <PublicHeader />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Sell Your Business', path: '/sell-your-business' }])) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(faqLd(faqs)) }} />

      {/* ─── Hero ──────────────────────────────────────────────────────────── */}
      <section className="px-6 py-14 border-b" style={{ borderColor: COLOR_BORDER, background: '#FAF6EF' }}>
        <div className="max-w-5xl mx-auto text-center">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold text-white mb-4" style={{ background: '#2D7A5F' }}>
            LIST FREE · 90 SECONDS · ANONYMOUS BY DEFAULT
          </span>
          <h1 className="text-4xl md:text-5xl font-black mb-3" style={{ color: COLOR_PRIMARY }}>
            Sell your business — confidentially, in 90 seconds
          </h1>
          <p className="text-lg max-w-2xl mx-auto mb-6" style={{ color: COLOR_TEXT_SECONDARY }}>
            Publish an anonymous listing today. No name, no company, no financials required. Reveal what you want, when you want. Reach verified buyers across the USA, Canada & UAE.
          </p>
          <div className="flex flex-wrap gap-3 justify-center mb-8">
            <Link href="/list" className="px-6 py-3 rounded-lg font-bold text-white hover:opacity-90 inline-flex items-center gap-2" style={{ background: COLOR_ACCENT }}>
              List my business free <ChevronRight size={16} />
            </Link>
            <Link href="/valuation" className="px-6 py-3 rounded-lg font-bold border bg-white hover:bg-gray-50 inline-flex items-center gap-2" style={{ borderColor: COLOR_BORDER, color: COLOR_PRIMARY }}>
              <TrendingUp size={16} /> Free valuation tool
            </Link>
          </div>
          <BuyerDemandHero />
        </div>
      </section>

      {/* ─── Trust strip ───────────────────────────────────────────────────── */}
      <section className="border-b" style={{ borderColor: COLOR_BORDER, background: 'white' }}>
        <div className="max-w-5xl mx-auto px-6 py-8 grid md:grid-cols-3 gap-6">
          <TrustChip icon={<Eye size={18} />} title="Anonymous by default" body="Name, city, identity all masked. Reveal only after the buyer signs an NDA." />
          <TrustChip icon={<ShieldCheck size={18} />} title="No commission, ever" body="Listing is free. Premium placement is optional. We never take a success fee." />
          <TrustChip icon={<Zap size={18} />} title="Refine later" body="Photos, financials, KYC — all optional. Your listing publishes immediately." />
        </div>
      </section>

      {/* ─── How it works (now actually 3 steps) ──────────────────────────── */}
      <section className="px-6 py-12">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-black mb-3 text-center" style={{ color: COLOR_PRIMARY }}>How it works</h2>
          <p className="text-center mb-8" style={{ color: COLOR_TEXT_SECONDARY }}>Three real steps. No multi-page wizard. No paywall.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {fastSteps.map((s) => (
              <div key={s.n} className="bg-white rounded-xl border p-6" style={{ borderColor: COLOR_BORDER }}>
                <div className="w-9 h-9 rounded-full flex items-center justify-center font-black text-white mb-3" style={{ background: COLOR_ACCENT }}>{s.n}</div>
                <h3 className="font-bold mb-1" style={{ color: COLOR_PRIMARY }}>{s.t}</h3>
                <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>{s.d}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/list" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-white hover:opacity-90" style={{ background: COLOR_ACCENT }}>
              <Sparkles size={16} /> Start my 90-second listing <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="px-6 pb-20">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-black mb-6" style={{ color: COLOR_PRIMARY }}>What sellers ask before they list</h2>
          <div className="space-y-4">
            {faqs.map((f) => (
              <div key={f.q} className="bg-white rounded-xl border p-5" style={{ borderColor: COLOR_BORDER }}>
                <h3 className="font-bold mb-1" style={{ color: COLOR_PRIMARY }}>{f.q}</h3>
                <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }} dangerouslySetInnerHTML={{ __html: renderInline(f.a) }} />
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

function TrustChip({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-1" style={{ color: COLOR_ACCENT }}>{icon}<span className="font-bold" style={{ color: COLOR_PRIMARY }}>{title}</span></div>
      <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>{body}</p>
    </div>
  )
}

// Tiny inline-markdown renderer for FAQ answers — bold + links only.
function renderInline(s: string): string {
  return s
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" style="color:#B8956A;text-decoration:underline">$1</a>')
}

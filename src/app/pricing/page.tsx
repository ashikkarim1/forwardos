import type { Metadata } from 'next'
import Link from 'next/link'
import { PublicHeader } from '@/components/Navigation'
import { pageMetadata, breadcrumbLd, jsonLdScript } from '@/lib/seo'
import { PRICING } from '@/lib/pricing'
import { COLOR_PRIMARY, COLOR_TEXT_SECONDARY, COLOR_BORDER, COLOR_BG_PRIMARY } from '@/styles/forward-colors'
import { Check, ArrowRight, Sparkles, Zap, Building2 } from 'lucide-react'

export const metadata: Metadata = pageMetadata({
  title: 'Pricing — Forward Intelligence',
  description: 'Transparent pricing for buyers, sellers, and brokers. Buyer accounts and basic seller listings are free. Premium upgrades unlock AI matching, featured placement, and broker-grade tools.',
  path: '/pricing',
})

interface PlanCol {
  role: 'Buyers' | 'Sellers' | 'Brokers'
  intro?: string
  tiers: PlanTier[]
}
interface PlanTier {
  name: string
  price: string
  cadence: string
  description: string
  features: string[]
  cta: { label: string; href: string }
  highlight?: boolean
}

const COLUMNS: PlanCol[] = [
  {
    role: 'Buyers',
    intro: 'Browse confidentially. Contact sellers through Forward. We never share your details publicly.',
    tiers: [
      {
        name: 'Free',
        price: '$0',
        cadence: 'forever',
        description: 'Everything you need to research, save, and inquire on listings.',
        features: [
          'Browse all confidential listings',
          'Contact sellers via Forward (binding intro)',
          'AI search across the marketplace',
          'Saved searches',
          'Deal alerts by email',
        ],
        cta: { label: 'Create free buyer account', href: '/auth/signup?type=buyer' },
      },
      {
        name: 'Premium Buyer',
        price: `$${PRICING.buyer.premium.monthly}`,
        cadence: 'per month',
        description: 'Get the edge — see deals first, score them with our intelligence layer.',
        features: [
          'Early access to new listings (24–48h ahead)',
          'Advanced AI buyer-to-deal matching',
          'Market analytics & sector dashboards',
          'Comparable transactions database',
          'Acquisition scoring on every listing',
        ],
        cta: { label: 'Upgrade to Premium', href: '/api/billing/checkout?tier=BUYER_PREMIUM' },
        highlight: true,
      },
    ],
  },
  {
    role: 'Sellers',
    intro: 'List for free. Upgrade individual listings to Premium when you need maximum reach.',
    tiers: [
      {
        name: 'Basic Listing',
        price: '$0',
        cadence: 'free, anonymous',
        description: 'Publish a confidential listing in 90 seconds. No credit card.',
        features: [
          'Publish anonymously in 90 seconds',
          'Forward-verified buyer introductions',
          'Standard placement in the marketplace',
          'Manage every listing from your dashboard',
        ],
        cta: { label: 'List for free', href: '/list' },
      },
      {
        name: 'Premium Listing',
        price: `$${PRICING.seller.premium.monthly}`,
        cadence: 'per month, per listing',
        description: 'For sellers who want the deal moved.',
        features: [
          'Featured placement across the marketplace',
          'AI valuation embedded in your listing',
          'AI listing enhancement (auto-written copy)',
          'Performance analytics (views, watchers, inquiries)',
          'Lead management — qualified inquiry inbox',
          'Outbound curated email to our buyer audience',
        ],
        cta: { label: 'Go Premium', href: '/api/billing/checkout?tier=SELLER_PREMIUM' },
        highlight: true,
      },
    ],
  },
  {
    role: 'Brokers',
    intro: 'This is where you make money early. Forward gives brokers the tools to win and the leads to grow.',
    tiers: [
      {
        name: 'Broker Pro',
        price: `$${PRICING.broker.pro.monthly}`,
        cadence: 'per month',
        description: 'Everything in seller Premium, plus the broker toolkit.',
        features: [
          'Unlimited listings',
          'Built-in CRM',
          'AI prospecting (find your next listing)',
          'Marketing automation',
          'In-app deal room',
          'Realtime updates — one-click contact-seller from email',
          'Deal analytics to get the deal done',
        ],
        cta: { label: 'Become a Broker Pro', href: '/api/billing/checkout?tier=BROKER_PRO' },
        highlight: true,
      },
    ],
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen" style={{ background: COLOR_BG_PRIMARY }}>
      <PublicHeader />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Pricing', path: '/pricing' }])) }} />

      <section className="px-6 py-14 border-b" style={{ borderColor: COLOR_BORDER, background: 'white' }}>
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[10px] font-bold tracking-[0.25em] mb-4" style={{ color: '#B8956A' }}>FORWARD PRICING</p>
          <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight" style={{ color: COLOR_PRIMARY }}>
            Free to start. Pay only when Forward makes you money.
          </h1>
          <p className="text-lg" style={{ color: COLOR_TEXT_SECONDARY }}>
            Buyer accounts are always free. Basic seller listings are always free. Premium tiers unlock matching, intelligence, and outbound — every dollar is tied to outcomes.
          </p>
        </div>
      </section>

      {COLUMNS.map((col) => (
        <section key={col.role} className="px-6 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2 mb-2">
              <h2 className="text-3xl md:text-4xl font-black" style={{ color: COLOR_PRIMARY }}>{col.role}</h2>
              {col.intro && <p className="text-base max-w-xl" style={{ color: COLOR_TEXT_SECONDARY }}>{col.intro}</p>}
            </div>
            <div className={`mt-8 grid gap-6 ${col.tiers.length === 1 ? 'md:grid-cols-1 max-w-2xl' : 'md:grid-cols-2'}`}>
              {col.tiers.map((tier) => (
                <article
                  key={tier.name}
                  className="rounded-2xl border bg-white overflow-hidden flex flex-col"
                  style={{ borderColor: tier.highlight ? '#B8956A' : COLOR_BORDER, borderWidth: tier.highlight ? 2 : 1 }}
                >
                  {tier.highlight && (
                    <div className="px-4 py-1.5 text-center text-[10px] font-bold tracking-widest text-white" style={{ background: '#B8956A' }}>
                      MOST POPULAR
                    </div>
                  )}
                  <div className="p-7 flex-1">
                    <div className="flex items-baseline gap-2 mb-1">
                      {col.role === 'Brokers' ? <Building2 size={18} style={{ color: '#B8956A' }} /> : tier.highlight ? <Sparkles size={18} style={{ color: '#B8956A' }} /> : <Zap size={18} style={{ color: COLOR_TEXT_SECONDARY }} />}
                      <h3 className="text-xl font-black" style={{ color: COLOR_PRIMARY }}>{tier.name}</h3>
                    </div>
                    <p className="text-sm mb-5" style={{ color: COLOR_TEXT_SECONDARY }}>{tier.description}</p>
                    <div className="mb-6">
                      <p className="text-5xl font-black inline-block" style={{ color: COLOR_PRIMARY }}>{tier.price}</p>
                      <span className="text-sm ml-2" style={{ color: COLOR_TEXT_SECONDARY }}>{tier.cadence}</span>
                    </div>
                    <ul className="space-y-2.5 mb-7">
                      {tier.features.map((f) => (
                        <li key={f} className="flex items-start gap-2.5 text-sm" style={{ color: COLOR_PRIMARY }}>
                          <Check size={15} style={{ color: '#2D7A5F' }} className="flex-shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                    <Link
                      href={tier.cta.href}
                      className="inline-flex items-center justify-center gap-2 w-full px-5 py-3 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity"
                      style={{ background: tier.highlight ? COLOR_PRIMARY : '#F4F2EE', color: tier.highlight ? 'white' : COLOR_PRIMARY }}
                    >
                      {tier.cta.label} <ArrowRight size={14} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      ))}

      <section className="px-6 py-16 border-t" style={{ borderColor: COLOR_BORDER, background: 'white' }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-black mb-6" style={{ color: COLOR_PRIMARY }}>FAQ</h2>
          <div className="space-y-5">
            {[
              ['Can I unlist or downgrade a paid listing?', 'Yes. Sellers can unlist or downgrade any individual listing from their dashboard. No charges accrue while a paid listing is unlisted; relist or upgrade again anytime.'],
              ['Can I cancel anytime?', 'Yes. Cancel any paid plan from your dashboard. You keep access through the end of the billing period; no further charges.'],
              ['Do you charge a success fee on sales?', 'Forward never takes a commission on the deal close. We only charge the subscription tier you opted into. Buyer-seller introductions through Forward are binding under our terms.'],
              ['What if a buyer is on Free but wants to contact a seller?', 'Free buyers can contact sellers — that\'s deliberate. Verified matching, comparables, and acquisition scoring are the Premium upgrade.'],
              ['Can a broker manage many listings on Pro?', 'Yes. Broker Pro removes the listing cap and turns on the CRM, deal room, AI prospecting, marketing automation, and analytics suite.'],
            ].map(([q, a]) => (
              <div key={q} className="rounded-xl border p-5" style={{ borderColor: COLOR_BORDER }}>
                <h3 className="font-bold mb-1" style={{ color: COLOR_PRIMARY }}>{q}</h3>
                <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

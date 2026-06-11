import type { Metadata } from 'next'
import { PricingPageContent } from './PricingPageContent'
import { pageMetadata, faqLd, jsonLdScript } from '@/lib/seo'
import { PRICING, LAUNCH_DISCOUNT_PCT } from '@/lib/pricing'

export const metadata: Metadata = pageMetadata({
  title: 'Pricing — List Your Business for 50% Less (90-Day Launch)',
  description: `Sell your business for less. List free, or go Premium at $${PRICING.premium.launch}/mo — ${LAUNCH_DISCOUNT_PCT}% off and half the price of BizBuySell and other marketplaces. Limited 90-day launch pricing.`,
  path: '/pricing',
  keywords: ['business listing cost', 'sell business cost', 'BizBuySell alternative', 'cheapest business marketplace', 'list business for sale price'],
})

const pricingFaqs = [
  { q: 'How much does it cost to list a business for sale?', a: `Listing is free on Forward. Premium featured placement is $${PRICING.premium.launch}/month during our 90-day launch (regularly $${PRICING.premium.regular}) — about half the price of comparable featured listings on BizBuySell and other marketplaces.` },
  { q: 'Is Forward cheaper than BizBuySell?', a: `Yes. BizBuySell's featured listings run roughly $100–$200/month; Forward Premium is $${PRICING.premium.launch}/month during launch — at least 50% less.` },
  { q: 'Do you charge a sales commission?', a: 'No. Forward charges no success commission when your business sells.' },
  { q: 'How long does launch pricing last?', a: 'Launch pricing is available for 90 days. Lock it in now and keep the rate for your listing period.' },
]

export default function PricingPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(faqLd(pricingFaqs)) }} />
      <PricingPageContent />
    </>
  )
}

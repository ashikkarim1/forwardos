import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: 'Business-for-Sale Market Insights — Canada & UAE',
  description: 'Live market intelligence for the Canadian and UAE business-for-sale markets: median asking prices, valuation multiples, sales-to-ask ratios, and sector momentum.',
  path: '/market-insights',
  keywords: ['business for sale market trends', 'business valuation multiples', 'M&A market report', 'sales to ask ratio', 'business sale prices'],
})

export default function SegmentLayout({ children }: { children: React.ReactNode }) {
  return children
}

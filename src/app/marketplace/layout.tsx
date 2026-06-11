import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: 'Businesses & Franchises for Sale — Marketplace',
  description: 'Browse verified businesses and franchises for sale in Canada and the UAE. Filter by industry, location, price, and cash flow, with AI deal scores and financing on every listing.',
  path: '/marketplace',
  keywords: ['businesses for sale', 'franchises for sale', 'buy a business', 'business listings', 'business marketplace'],
})

export default function SegmentLayout({ children }: { children: React.ReactNode }) {
  return children
}

import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: 'Learning Center — Buying & Selling Businesses',
  description: 'Guides on buying and selling businesses and franchises: valuation (SDE, EBITDA), financing (CSBFP, BDC, Murabaha, Ijara), due diligence, LOIs, and an M&A glossary.',
  path: '/learning-center',
  keywords: ['how to buy a business', 'how to sell a business', 'business valuation guide', 'SDE EBITDA', 'due diligence', 'M&A glossary'],
})

export default function SegmentLayout({ children }: { children: React.ReactNode }) {
  return children
}

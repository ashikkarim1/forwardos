import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: 'Business Acquisition Financing — USA, Canada & UAE',
  description: 'Finance your business acquisition with SBA 7(a) in the U.S., CSBFP and BDC in Canada, or SME and Sharia-compliant Murabaha/Ijara in the UAE. Model your monthly payments and check financing readiness.',
  path: '/finance-center',
  keywords: ['business acquisition financing', 'SBA 7(a)', 'SBA loan', 'CSBFP', 'BDC loan', 'SME loan UAE', 'Islamic business financing', 'Murabaha', 'Ijara', 'buy a business loan'],
})

export default function SegmentLayout({ children }: { children: React.ReactNode }) {
  return children
}

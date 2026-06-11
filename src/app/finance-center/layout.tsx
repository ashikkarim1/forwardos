import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: 'Business Acquisition Financing — Canada & UAE',
  description: 'Finance your business acquisition. Compare lenders (CSBFP, BDC, SME, and Sharia-compliant Murabaha/Ijara), model monthly payments, and check your financing readiness.',
  path: '/finance-center',
  keywords: ['business acquisition financing', 'SBA alternative', 'CSBFP', 'BDC loan', 'SME loan UAE', 'Islamic business financing', 'buy a business loan'],
})

export default function SegmentLayout({ children }: { children: React.ReactNode }) {
  return children
}

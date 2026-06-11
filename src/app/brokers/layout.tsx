import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: 'Business Brokers Directory — USA, Canada & UAE',
  description: 'Find a verified business broker by region, industry, and language (EN/FR/AR). Read verified-deal reviews and connect with M&A advisors across the USA, Canada and the UAE.',
  path: '/brokers',
  keywords: ['business brokers', 'M&A advisors', 'business broker directory', 'business brokers USA', 'business brokers Canada', 'business brokers UAE'],
})

export default function SegmentLayout({ children }: { children: React.ReactNode }) {
  return children
}

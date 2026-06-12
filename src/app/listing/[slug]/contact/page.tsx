import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { confidentialTitle, maskCity } from '@/lib/listing-helpers'
import { industryLabel } from '@/lib/listing-narrative'
import { ContactForm } from './ContactForm'

interface Props { params: { slug: string } }

export const dynamic = 'force-dynamic'

async function getDeal(slug: string) {
  return prisma.deal.findUnique({
    where: { slug },
    select: {
      id: true, slug: true, industry: true, country: true, city: true,
      askingPrice: true, heatScore: true, dealQualityScore: true, status: true,
    },
  })
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const deal = await getDeal(params.slug).catch(() => null)
  if (!deal) return { title: 'Contact seller — Forward Intelligence', robots: { index: false, follow: false } }
  return {
    title: `Request introduction — Confidential ${industryLabel(deal.industry)} · Forward`,
    description: 'Request an introduction to the seller through Forward Intelligence. Verified buyers, binding introductions.',
    robots: { index: false, follow: false }, // contact pages aren't for search
  }
}

export default async function ContactSellerPage({ params }: Props) {
  const deal = await getDeal(params.slug).catch(() => null)
  if (!deal) notFound()
  if (deal.status !== 'ACTIVE' && deal.status !== 'PUBLISHED') notFound()

  const indLabel = industryLabel(deal.industry)
  const region = maskCity(deal.city, deal.country)
  const headline = confidentialTitle(deal.industry, deal.country, deal.id)
  const askingDollars = deal.askingPrice ? Number(deal.askingPrice) / 100 : 0
  const askDisplay = askingDollars >= 1_000_000 ? `$${(askingDollars / 1_000_000).toFixed(2)}M` : askingDollars >= 1_000 ? `$${Math.round(askingDollars / 1_000)}K` : '—'

  return (
    <ContactForm
      dealId={deal.id}
      slug={deal.slug ?? ''}
      headline={headline}
      indLabel={indLabel}
      region={region}
      askDisplay={askDisplay}
      heatScore={deal.heatScore}
      qualityScore={deal.dealQualityScore}
    />
  )
}

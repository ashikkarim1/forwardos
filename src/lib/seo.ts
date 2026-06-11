/**
 * Central SEO configuration + helpers: site constants, a metadata builder, and
 * JSON-LD structured-data builders. Used by the root layout, per-route metadata,
 * the sitemap, and the programmatic landing pages.
 */
import type { Metadata } from 'next'

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.forwardos.ai').replace(/\/$/, '')
export const SITE_NAME = 'Forward Intelligence'
export const SITE_TAGLINE = 'Buy & Sell Businesses and Franchises in the USA, Canada & the UAE'

export const DEFAULT_DESCRIPTION =
  'Forward Intelligence is the modern marketplace to buy and sell businesses and franchises across the USA, Canada, and the UAE. ' +
  'Browse verified listings, get AI deal intelligence, find financing (SBA, CSBFP, BDC, SME & Sharia-compliant), ' +
  'connect with vetted brokers, and list your business for 50% less than anywhere else.'

export const DEFAULT_KEYWORDS = [
  'businesses for sale', 'business for sale', 'buy a business', 'sell my business',
  'franchises for sale', 'franchise for sale', 'business brokers', 'business acquisition',
  'businesses for sale Canada', 'businesses for sale UAE', 'businesses for sale Dubai',
  'small business for sale', 'SME for sale', 'business valuation', 'business financing',
  'M&A marketplace', 'buy a franchise', 'business listings',
]

export const OG_IMAGE = `${SITE_URL}/FOS.jpg`

interface PageMetaInput {
  title: string
  description?: string
  path?: string // e.g. '/marketplace'
  keywords?: string[]
  image?: string
}

/** Build a complete Next Metadata object for a page with sensible SEO defaults. */
export function pageMetadata({ title, description, path = '/', keywords, image }: PageMetaInput): Metadata {
  const url = `${SITE_URL}${path}`
  const desc = description || DEFAULT_DESCRIPTION
  return {
    title,
    description: desc,
    keywords: keywords ?? DEFAULT_KEYWORDS,
    alternates: { canonical: url },
    openGraph: {
      title, description: desc, url, siteName: SITE_NAME, type: 'website',
      images: [{ url: image || OG_IMAGE, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image', title, description: desc, images: [image || OG_IMAGE],
    },
    robots: { index: true, follow: true },
  }
}

// ---------- JSON-LD builders ----------

export function organizationLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: OG_IMAGE,
    description: DEFAULT_DESCRIPTION,
    areaServed: ['US', 'CA', 'AE'],
    sameAs: [] as string[],
    contactPoint: [{ '@type': 'ContactPoint', email: 'support@forwardos.ai', contactType: 'customer support' }],
  }
}

export function webSiteLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/marketplace?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  }
}

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem', position: i + 1, name: it.name, item: `${SITE_URL}${it.path}`,
    })),
  }
}

export function faqLd(faqs: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question', name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
}

/** A business-for-sale listing as a Product+Offer (closest fit for marketplaces). */
export function listingLd(deal: { id: string; title: string; description?: string; price?: number; currency?: string; image?: string; country?: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: deal.title,
    description: deal.description || `${deal.title} — business for sale on ${SITE_NAME}.`,
    image: deal.image || OG_IMAGE,
    url: `${SITE_URL}/deal/${deal.id}`,
    ...(deal.price
      ? { offers: { '@type': 'Offer', price: deal.price, priceCurrency: deal.currency || 'USD', availability: 'https://schema.org/InStock', areaServed: deal.country } }
      : {}),
  }
}

export function itemListLd(deals: { id: string; title: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    numberOfItems: deals.length,
    itemListElement: deals.slice(0, 50).map((d, i) => ({
      '@type': 'ListItem', position: i + 1, url: `${SITE_URL}/deal/${d.id}`, name: d.title,
    })),
  }
}

/** Render helper: a <script type="application/ld+json"> string for embedding. */
export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data)
}

import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo'
import { ARTICLES } from '@/content/learning'
import { BROKERS } from '@/lib/broker-data'
import { prisma } from '@/lib/prisma'
import { SEO_LOCATIONS } from '@/lib/seo-locations'
import { SEO_INDUSTRIES } from '@/lib/seo-industries'

/**
 * Dynamic sitemap: static pages + SEO landing pages + every deal, broker, and
 * learning article. Search engines crawl this to discover all listings.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticPaths = [
    '', '/marketplace', '/finance-center', '/brokers', '/learning-center',
    '/learning-center/glossary', '/market-insights', '/pricing', '/saved-searches',
    '/privacy', '/terms', '/security', '/compliance',
    '/franchises-for-sale', '/sell-your-business', '/business-brokers',
  ].map((p) => ({
    url: `${SITE_URL}${p}`,
    lastModified: now,
    changeFrequency: 'daily' as const,
    priority: p === '' ? 1 : 0.8,
  }))

  // Location landing pages (/businesses-for-sale/[location])
  const locationPaths = SEO_LOCATIONS.map((loc) => ({
    url: `${SITE_URL}/businesses-for-sale/${loc.slug}`,
    lastModified: now,
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }))

  // Industry landing pages (/businesses-for-sale/industry/[industry])
  const industryPaths = SEO_INDUSTRIES.map((ind) => ({
    url: `${SITE_URL}/businesses-for-sale/industry/${ind.slug}`,
    lastModified: now,
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }))

  const articlePaths = ARTICLES.map((a) => ({
    url: `${SITE_URL}/learning-center/${a.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  const brokerPaths = BROKERS.map((b) => ({
    url: `${SITE_URL}/brokers/${b.id}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  let dealPaths: MetadataRoute.Sitemap = []
  try {
    const deals = await prisma.deal.findMany({
      where: { status: { in: ['ACTIVE', 'PUBLISHED'] } },
      select: { id: true, updatedAt: true },
      take: 5000,
    })
    dealPaths = deals.map((d) => ({
      url: `${SITE_URL}/deal/${d.id}`,
      lastModified: d.updatedAt ?? now,
      changeFrequency: 'daily' as const,
      priority: 0.7,
    }))
  } catch {
    // No DB — ship the static + content sitemap.
  }

  return [...staticPaths, ...locationPaths, ...industryPaths, ...articlePaths, ...brokerPaths, ...dealPaths]
}

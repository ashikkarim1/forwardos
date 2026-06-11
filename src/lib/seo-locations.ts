/**
 * Location definitions powering the programmatic SEO landing pages
 * (/businesses-for-sale/[location]) and the sitemap.
 *
 * Each location targets a high-intent query like "businesses for sale in Dubai".
 * `dbCountry` / `dbCity` map to the Deal fields used to filter matching listings.
 */
export interface SeoLocation {
  slug: string
  name: string // display name, e.g. "Canada", "Dubai"
  dbCountry?: string // matches Deal.country
  dbCity?: string // matches Deal.city
  currency: 'CAD' | 'AED' | 'USD'
  intro: string
  financing: string // region-specific financing hook
}

export const SEO_LOCATIONS: SeoLocation[] = [
  {
    slug: 'canada',
    name: 'Canada',
    dbCountry: 'Canada',
    currency: 'CAD',
    intro:
      'Browse verified businesses for sale across Canada — from SaaS and services to manufacturing, retail, and franchises. Filter by province, price, and cash flow, and get AI-powered deal intelligence on every listing.',
    financing: 'Canadian buyers can finance acquisitions through the CSBFP and BDC — model your payments in our Finance Center.',
  },
  {
    slug: 'uae',
    name: 'the UAE',
    dbCountry: 'UAE',
    currency: 'AED',
    intro:
      'Discover established businesses for sale across the United Arab Emirates — free-zone and mainland companies in F&B, logistics, e-commerce, retail, and services. Every listing carries verification and AI deal scoring.',
    financing: 'UAE buyers can access SME loans and Sharia-compliant financing (Murabaha, Ijara) via our Finance Center.',
  },
  {
    slug: 'dubai',
    name: 'Dubai',
    dbCountry: 'UAE',
    dbCity: 'Dubai',
    currency: 'AED',
    intro:
      'Find businesses for sale in Dubai — hospitality, F&B, e-commerce, and service businesses across the emirate, including free-zone licences. Verified sellers, transparent financials, AI-ranked opportunities.',
    financing: 'Finance a Dubai acquisition with SME or Sharia-compliant products — see eligible lenders in our Finance Center.',
  },
  {
    slug: 'abu-dhabi',
    name: 'Abu Dhabi',
    dbCountry: 'UAE',
    dbCity: 'Abu Dhabi',
    currency: 'AED',
    intro:
      'Explore businesses for sale in Abu Dhabi across logistics, services, and consumer sectors. Vetted listings with full deal intelligence and financing guidance.',
    financing: 'Abu Dhabi buyers can tap EDB SME financing and Islamic facilities — compare options in our Finance Center.',
  },
  {
    slug: 'toronto',
    name: 'Toronto',
    dbCountry: 'Canada',
    dbCity: 'Toronto',
    currency: 'CAD',
    intro:
      'Businesses for sale in Toronto and the GTA — recurring-revenue software, professional services, and established consumer businesses. AI scoring and verified financials on every deal.',
    financing: 'CSBFP and BDC financing are available to qualified Toronto buyers — calculate your payments in our Finance Center.',
  },
  {
    slug: 'vancouver',
    name: 'Vancouver',
    dbCountry: 'Canada',
    dbCity: 'Vancouver',
    currency: 'CAD',
    intro:
      'Find businesses for sale in Vancouver and BC — retail, services, hospitality, and tech. Verified listings with transparent numbers and AI deal intelligence.',
    financing: 'Vancouver acquisitions can be financed through CSBFP and BDC — model the numbers in our Finance Center.',
  },
  {
    slug: 'montreal',
    name: 'Montréal',
    dbCountry: 'Canada',
    dbCity: 'Montréal',
    currency: 'CAD',
    intro:
      'Browse businesses for sale in Montréal and Québec — founder-led services, manufacturing, and franchises, with bilingual broker support. Verified, AI-scored opportunities.',
    financing: 'Québec buyers can use CSBFP and BDC financing — see what you qualify for in our Finance Center.',
  },
]

export function getSeoLocation(slug: string): SeoLocation | undefined {
  return SEO_LOCATIONS.find((l) => l.slug === slug)
}

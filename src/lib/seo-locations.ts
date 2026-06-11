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
  {
    slug: 'usa',
    name: 'the USA',
    dbCountry: 'USA',
    currency: 'USD',
    intro:
      'Browse verified businesses and franchises for sale across the United States — SaaS, services, healthcare, retail, manufacturing, and more. Real financials, AI deal scores, and SBA-eligible financing on every qualifying listing.',
    financing: 'U.S. buyers can finance acquisitions with SBA 7(a) loans — check eligibility and model payments in our Finance Center.',
  },
  {
    slug: 'new-york',
    name: 'New York',
    dbCountry: 'USA',
    dbCity: 'New York',
    currency: 'USD',
    intro:
      'Find businesses for sale in New York — fintech, professional services, hospitality, and established consumer businesses. Verified sellers and AI-ranked opportunities.',
    financing: 'New York buyers can use SBA 7(a) financing — see eligible lenders in our Finance Center.',
  },
  {
    slug: 'los-angeles',
    name: 'Los Angeles',
    dbCountry: 'USA',
    dbCity: 'Los Angeles',
    currency: 'USD',
    intro:
      'Explore businesses for sale in Los Angeles and Southern California — media, e-commerce, services, and consumer brands. Transparent financials and AI deal intelligence.',
    financing: 'LA acquisitions are often SBA 7(a)-eligible — model your financing in our Finance Center.',
  },
  {
    slug: 'miami',
    name: 'Miami',
    dbCountry: 'USA',
    dbCity: 'Miami',
    currency: 'USD',
    intro:
      'Businesses for sale in Miami and South Florida — hospitality, logistics, services, and fast-growing consumer businesses. Verified listings with full deal intelligence.',
    financing: 'Miami buyers can finance with SBA 7(a) loans — compare options in our Finance Center.',
  },
  {
    slug: 'austin',
    name: 'Austin',
    dbCountry: 'USA',
    dbCity: 'Austin',
    currency: 'USD',
    intro:
      'Find businesses for sale in Austin, Texas — SaaS, tech-enabled services, and consumer businesses in one of the fastest-growing U.S. markets. AI-scored, verified deals.',
    financing: 'Austin acquisitions are frequently SBA 7(a)-eligible — see what you qualify for in our Finance Center.',
  },
  {
    slug: 'chicago',
    name: 'Chicago',
    dbCountry: 'USA',
    dbCity: 'Chicago',
    currency: 'USD',
    intro:
      'Browse businesses for sale in Chicago and the Midwest — manufacturing, B2B services, food & beverage, and established consumer businesses. Verified, AI-scored opportunities.',
    financing: 'Chicago buyers can finance with SBA 7(a) and SBA 504 (real-estate-heavy deals) — model your payments in our Finance Center.',
  },
  {
    slug: 'houston',
    name: 'Houston',
    dbCountry: 'USA',
    dbCity: 'Houston',
    currency: 'USD',
    intro:
      'Explore businesses for sale in Houston — energy services, distribution, healthcare, and consumer businesses. Real financials and AI deal intelligence.',
    financing: 'Houston acquisitions are commonly SBA 7(a)-financed — see eligible lenders in our Finance Center.',
  },
  {
    slug: 'seattle',
    name: 'Seattle',
    dbCountry: 'USA',
    dbCity: 'Seattle',
    currency: 'USD',
    intro:
      'Find businesses for sale in Seattle and the Pacific Northwest — SaaS, e-commerce, professional services, and specialty retail. Vetted listings with full deal intelligence.',
    financing: 'Seattle buyers can use SBA 7(a) financing — calculate payments in our Finance Center.',
  },
  {
    slug: 'atlanta',
    name: 'Atlanta',
    dbCountry: 'USA',
    dbCity: 'Atlanta',
    currency: 'USD',
    intro:
      'Browse businesses for sale in Atlanta and Georgia — logistics, services, hospitality, and fast-growing consumer brands. AI-scored, verified opportunities.',
    financing: 'Atlanta acquisitions are SBA 7(a)-friendly — see options in our Finance Center.',
  },
  {
    slug: 'calgary',
    name: 'Calgary',
    dbCountry: 'Canada',
    dbCity: 'Calgary',
    currency: 'CAD',
    intro:
      'Find businesses for sale in Calgary and Alberta — energy services, professional services, trades, and consumer businesses. Verified financials and AI deal scores.',
    financing: 'Calgary buyers can use CSBFP and BDC financing — model your payments in our Finance Center.',
  },
  {
    slug: 'ottawa',
    name: 'Ottawa',
    dbCountry: 'Canada',
    dbCity: 'Ottawa',
    currency: 'CAD',
    intro:
      'Explore businesses for sale in Ottawa and Eastern Ontario — government services, tech, professional services, and consumer businesses. AI-ranked, verified deals.',
    financing: 'Ottawa buyers can use CSBFP and BDC financing — see what you qualify for in our Finance Center.',
  },
  {
    slug: 'edmonton',
    name: 'Edmonton',
    dbCountry: 'Canada',
    dbCity: 'Edmonton',
    currency: 'CAD',
    intro:
      'Browse businesses for sale in Edmonton and northern Alberta — trades, services, distribution, and consumer businesses. Verified, AI-scored opportunities.',
    financing: 'Edmonton acquisitions are CSBFP and BDC-friendly — model your financing in our Finance Center.',
  },
  {
    slug: 'sharjah',
    name: 'Sharjah',
    dbCountry: 'UAE',
    dbCity: 'Sharjah',
    currency: 'AED',
    intro:
      'Find businesses for sale in Sharjah — manufacturing, trading, F&B, and services across the emirate, including free-zone licences. Verified sellers and AI deal intelligence.',
    financing: 'Sharjah acquisitions can be financed with SME loans and Sharia-compliant products — see eligible lenders in our Finance Center.',
  },
]

export function getSeoLocation(slug: string): SeoLocation | undefined {
  return SEO_LOCATIONS.find((l) => l.slug === slug)
}

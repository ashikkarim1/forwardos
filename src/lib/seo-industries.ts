/**
 * Industry-vertical SEO landing pages. Each one targets a high-volume buyer
 * query like "saas businesses for sale" or "restaurants for sale".
 *
 * `dbIndustry` maps to Deal.industry so the page can show real matching deals.
 */
export interface SeoIndustry {
  slug: string
  name: string
  dbIndustry?: string // matches Deal.industry enum
  hero: string
  what: string // what buyers should look for
  financing: string // typical financing notes
  keywords: string[]
}

export const SEO_INDUSTRIES: SeoIndustry[] = [
  {
    slug: 'saas',
    name: 'SaaS',
    dbIndustry: 'SAAS',
    hero:
      'Browse verified SaaS businesses for sale across the USA, Canada, and the UAE — from bootstrapped micro-SaaS to lower-mid-market companies with strong MRR and net retention.',
    what:
      'Buyers should weight ARR growth, gross margin, net revenue retention, churn, CAC payback, and customer concentration. Strong SaaS deals trade at 3–6× ARR depending on growth and retention.',
    financing:
      'Recurring-revenue businesses are particularly attractive to lenders — SBA 7(a) in the U.S., CSBFP and BDC in Canada are all common.',
    keywords: ['saas for sale', 'saas business for sale', 'buy a saas company', 'software business for sale', 'micro saas for sale', 'recurring revenue business for sale'],
  },
  {
    slug: 'restaurants',
    name: 'Restaurants',
    dbIndustry: 'HOSPITALITY',
    hero:
      'Discover restaurants for sale — independent operators, chains, and franchises across the USA, Canada, and the UAE. Verified financials, lease terms, and growth runway on every listing.',
    what:
      'Diligence rent + lease term, food cost %, labor %, prime cost (target <60%), and customer concentration in delivery channels. Liquor licenses, food safety records, and equipment age matter.',
    financing:
      'Restaurant acquisitions are often financed via SBA 7(a) with seller-carry; in Canada the CSBFP commonly covers equipment + leaseholds. UAE buyers often combine SME loans with Sharia-compliant facilities.',
    keywords: ['restaurants for sale', 'restaurant for sale', 'buy a restaurant', 'pizza shop for sale', 'cafe for sale', 'food business for sale'],
  },
  {
    slug: 'ecommerce',
    name: 'E-Commerce',
    dbIndustry: 'ECOMMERCE',
    hero:
      'Explore e-commerce businesses for sale — DTC brands, Amazon FBA, Shopify stores, and subscription boxes across multiple markets. Verified sales data and platform analytics.',
    what:
      'Focus on supplier diversification, ad spend efficiency (ROAS), product margin, inventory turnover, repeat-purchase rate, and platform dependency. Be alert to one-channel reliance (Amazon-only) risk.',
    financing:
      'E-commerce buyers often combine SBA 7(a) with revenue-based or A/R financing. Inventory-heavy deals may use asset-based lending.',
    keywords: ['ecommerce business for sale', 'amazon fba for sale', 'shopify store for sale', 'dtc brand for sale', 'online business for sale', 'buy an ecommerce business'],
  },
  {
    slug: 'healthcare',
    name: 'Healthcare',
    dbIndustry: 'HEALTHCARE',
    hero:
      'Find healthcare businesses for sale — dental practices, medical clinics, home-health, vet clinics, and specialty providers across the USA, Canada, and the UAE.',
    what:
      'Patient retention, payor mix, contract renewals, licensing transfers, and clinician continuity are critical. Reg/AML/HIPAA (US) and PHIPA/PIPEDA (CA) compliance materially affect price.',
    financing:
      'Healthcare deals are well-suited to SBA 7(a) (often 10-year terms) and BDC professional-practice financing. UAE healthcare buyers use SME and Sharia-compliant lenders.',
    keywords: ['healthcare business for sale', 'medical practice for sale', 'dental practice for sale', 'vet clinic for sale', 'home health business for sale', 'buy a medical clinic'],
  },
  {
    slug: 'manufacturing',
    name: 'Manufacturing',
    dbIndustry: 'MANUFACTURING',
    hero:
      'Browse manufacturing businesses for sale — contract manufacturers, light industrial, custom fab, and specialty producers across the USA, Canada, and the UAE.',
    what:
      'Inspect equipment age and condition, capacity utilization, customer concentration, supplier reliability, and environmental compliance. Real estate ownership vs lease is a major value driver.',
    financing:
      'Manufacturing deals often combine SBA 7(a) with 504 (equipment/real estate) in the U.S. and CSBFP-eligible BDC financing in Canada — well-secured assets attract favorable terms.',
    keywords: ['manufacturing business for sale', 'factory for sale', 'machine shop for sale', 'fabrication business for sale', 'industrial business for sale', 'buy a manufacturer'],
  },
  {
    slug: 'retail',
    name: 'Retail',
    dbIndustry: 'RETAIL',
    hero:
      'Discover retail businesses for sale — boutiques, specialty stores, convenience, and multi-unit retailers across the USA, Canada, and the UAE.',
    what:
      'Inventory turn, gross margin, lease economics, foot-traffic data, and omnichannel exposure all drive value. Beware concentrated supplier or anchor-tenant risk.',
    financing:
      'Retail acquisitions are commonly SBA-financed with inventory-based working-capital lines. Canadian buyers often use CSBFP for equipment + leaseholds.',
    keywords: ['retail business for sale', 'retail store for sale', 'boutique for sale', 'convenience store for sale', 'buy a retail business', 'specialty store for sale'],
  },
  {
    slug: 'services',
    name: 'Services',
    dbIndustry: 'SERVICES',
    hero:
      'Find service businesses for sale — professional services, home services, B2B services, and recurring-revenue providers across the USA, Canada, and the UAE.',
    what:
      'Recurring contracts, customer retention, technician/staff continuity, and route density (home services) are key. Owner-dependence is the #1 hidden risk — diligence delegation.',
    financing:
      'Service businesses with recurring revenue are highly bankable — SBA 7(a) is the dominant U.S. path; BDC and CSBFP in Canada cover most service acquisitions.',
    keywords: ['service business for sale', 'services business for sale', 'home services for sale', 'b2b services for sale', 'professional services for sale', 'buy a service business'],
  },
  {
    slug: 'hospitality',
    name: 'Hospitality',
    dbIndustry: 'HOSPITALITY',
    hero:
      'Browse hospitality businesses for sale — hotels, B&Bs, event venues, and tourism operators across the USA, Canada, and the UAE.',
    what:
      'Look at RevPAR, OCC%, OTA dependency, brand affiliation, FF&E condition, and recent capex. Real-estate ownership materially changes valuation methodology.',
    financing:
      'Hotel acquisitions often combine SBA 7(a) + SBA 504 (real estate). UAE hotel buyers commonly use Islamic project finance (Murabaha/Ijara) for FF&E and property.',
    keywords: ['hotel for sale', 'hospitality business for sale', 'b&b for sale', 'event venue for sale', 'hotel for sale Canada', 'hotel for sale UAE'],
  },
]

export function getSeoIndustry(slug: string): SeoIndustry | undefined {
  return SEO_INDUSTRIES.find((i) => i.slug === slug)
}

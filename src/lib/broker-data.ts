/**
 * Canonical broker dataset for the Broker Directory — Canada + UAE.
 *
 * Source of truth for the API's no-DB fallback so the directory renders real,
 * region- and language-tagged profiles whether or not a database is connected.
 * The language + region tagging (EN/FR/AR, Canada/UAE) is the edge over
 * BizBuySell's US-centric directory for cross-border buyers.
 */

export interface BrokerReviewSeed {
  id: string
  authorName: string
  rating: number
  title: string
  comment: string
  isVerifiedDeal: boolean
  createdAt: string
}

export interface BrokerSeed {
  id: string
  name: string
  company: string
  headline: string
  bio: string
  avatarUrl: string
  specialties: string[]
  industries: string[]
  regions: ('CANADA' | 'UAE')[]
  languages: ('EN' | 'FR' | 'AR')[]
  yearsExperience: number
  dealsClosed: number
  totalValueClosedUsd: number // dollars
  isVerified: boolean
  isFeatured: boolean
  avgRating: number
  reviewCount: number
  reviews: BrokerReviewSeed[]
}

export const LANGUAGE_LABELS: Record<string, string> = { EN: 'English', FR: 'Français', AR: 'العربية' }
export const REGION_FLAGS: Record<string, string> = { CANADA: '🇨🇦', UAE: '🇦🇪' }

export const BROKERS: BrokerSeed[] = [
  {
    id: 'broker-amelie-tremblay',
    name: 'Amélie Tremblay',
    company: 'Boréal M&A Advisors',
    headline: 'Lower-mid-market M&A across Québec & Ontario',
    bio: 'Bilingual (EN/FR) advisor specialising in founder-led exits in services and light manufacturing. 14 years guiding Canadian SMBs through CSBFP- and BDC-financed transactions.',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=160&h=160&fit=crop',
    specialties: ['Founder exits', 'Succession planning', 'CSBFP-financed deals'],
    industries: ['SERVICES', 'MANUFACTURING', 'RETAIL'],
    regions: ['CANADA'],
    languages: ['EN', 'FR'],
    yearsExperience: 14,
    dealsClosed: 96,
    totalValueClosedUsd: 184_000_000,
    isVerified: true,
    isFeatured: true,
    avgRating: 4.9,
    reviewCount: 2,
    reviews: [
      { id: 'r1', authorName: 'Jean-Philippe R.', rating: 5, title: 'Sold my HVAC business in 5 months', comment: 'Amélie ran a tight bilingual process and lined up a BDC-backed buyer. Exceptional.', isVerifiedDeal: true, createdAt: '2026-03-12T00:00:00Z' },
      { id: 'r2', authorName: 'Karen M.', rating: 4.8, title: 'Knows the Québec market cold', comment: 'Great comps and realistic pricing. Closed near ask.', isVerifiedDeal: true, createdAt: '2026-01-22T00:00:00Z' },
    ],
  },
  {
    id: 'broker-omar-al-rashid',
    name: 'Omar Al-Rashid',
    company: 'Gulf Bridge Capital',
    headline: 'UAE SME & cross-border acquisitions, Sharia-aware structuring',
    bio: 'Dubai-based dealmaker fluent in Arabic and English. Specialises in free-zone and mainland business sales with Sharia-compliant financing structures (Murabaha/Ijara).',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=160&h=160&fit=crop',
    specialties: ['Free-zone transfers', 'Islamic financing', 'Cross-border (GCC)'],
    industries: ['HOSPITALITY', 'LOGISTICS', 'ECOMMERCE', 'SERVICES'],
    regions: ['UAE'],
    languages: ['EN', 'AR'],
    yearsExperience: 12,
    dealsClosed: 71,
    totalValueClosedUsd: 142_000_000,
    isVerified: true,
    isFeatured: true,
    avgRating: 4.8,
    reviewCount: 2,
    reviews: [
      { id: 'r3', authorName: 'Fatima A.', rating: 5, title: 'Seamless free-zone sale', comment: 'Omar handled the licensing transfer and found a Sharia-compliant buyer. Highly professional.', isVerifiedDeal: true, createdAt: '2026-04-02T00:00:00Z' },
      { id: 'r4', authorName: 'David L.', rating: 4.6, title: 'Strong GCC network', comment: 'Brought multiple qualified buyers from the wider Gulf. Closed above expectations.', isVerifiedDeal: true, createdAt: '2026-02-15T00:00:00Z' },
    ],
  },
  {
    id: 'broker-priya-sharma',
    name: 'Priya Sharma',
    company: 'Maple Tech Partners',
    headline: 'SaaS & tech-enabled services M&A, Toronto',
    bio: 'Former operator turned advisor focused on recurring-revenue software businesses ($1M–$20M). Data-driven valuations and a deep strategic-acquirer network.',
    avatarUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=160&h=160&fit=crop',
    specialties: ['SaaS', 'Recurring revenue', 'Strategic buyers'],
    industries: ['SAAS', 'FINTECH', 'SERVICES'],
    regions: ['CANADA'],
    languages: ['EN'],
    yearsExperience: 9,
    dealsClosed: 54,
    totalValueClosedUsd: 121_000_000,
    isVerified: true,
    isFeatured: false,
    avgRating: 4.7,
    reviewCount: 1,
    reviews: [
      { id: 'r5', authorName: 'Marcus T.', rating: 4.7, title: 'Got us a strategic premium', comment: 'Priya positioned our SaaS to strategics and drove a competitive process.', isVerifiedDeal: true, createdAt: '2026-03-28T00:00:00Z' },
    ],
  },
  {
    id: 'broker-layla-haddad',
    name: 'Layla Haddad',
    company: 'Levant & Emirates Advisory',
    headline: 'Retail, F&B and hospitality exits across the UAE',
    bio: 'Trilingual (AR/EN/FR) advisor with a decade in UAE consumer businesses. Known for discreet, relationship-led sales of established F&B and retail operations.',
    avatarUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=160&h=160&fit=crop',
    specialties: ['F&B', 'Retail', 'Confidential sales'],
    industries: ['HOSPITALITY', 'RETAIL', 'SERVICES'],
    regions: ['UAE'],
    languages: ['AR', 'EN', 'FR'],
    yearsExperience: 11,
    dealsClosed: 63,
    totalValueClosedUsd: 98_000_000,
    isVerified: true,
    isFeatured: false,
    avgRating: 4.9,
    reviewCount: 1,
    reviews: [
      { id: 'r6', authorName: 'Sami K.', rating: 5, title: 'Discreet and effective', comment: 'Sold our restaurant group quietly without disrupting operations. Trilingual support was invaluable.', isVerifiedDeal: true, createdAt: '2026-05-01T00:00:00Z' },
    ],
  },
]

export function filterBrokers(
  brokers: BrokerSeed[],
  opts: { region?: string; industry?: string; language?: string; q?: string },
): BrokerSeed[] {
  return brokers.filter((b) => {
    if (opts.region && !b.regions.includes(opts.region as 'CANADA' | 'UAE')) return false
    if (opts.industry && !b.industries.includes(opts.industry)) return false
    if (opts.language && !b.languages.includes(opts.language as 'EN' | 'FR' | 'AR')) return false
    if (opts.q) {
      const hay = `${b.name} ${b.company} ${b.headline} ${b.specialties.join(' ')}`.toLowerCase()
      if (!hay.includes(opts.q.toLowerCase())) return false
    }
    return true
  })
}

export function getBroker(id: string): BrokerSeed | undefined {
  return BROKERS.find((b) => b.id === id)
}

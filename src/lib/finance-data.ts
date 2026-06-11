/**
 * Canonical lender dataset for the Finance Center — Canada + UAE.
 *
 * This is the single source of truth used by BOTH the seed script
 * (`prisma/seed-lenders.ts`) and the API route's no-DB fallback, so the Finance
 * Center renders real, region-appropriate lenders whether or not a database is
 * connected. Amounts are USD base (cents) to match the schema; the UI converts.
 *
 * BizBuySell offers US SBA matching only. ForwardOS covers Canada (CSBFP/BDC)
 * AND UAE — including Sharia-compliant Murabaha/Ijara — which BizBuySell cannot serve.
 */

export type LenderRegion = 'USA' | 'CANADA' | 'UAE' | 'GLOBAL'
export type FinancingType =
  | 'SBA' | 'CSBFP' | 'BDC' | 'BANK_TERM' | 'SME_LOAN'
  | 'ISLAMIC_MURABAHA' | 'ISLAMIC_IJARA' | 'SELLER_FINANCING'

export interface LenderSeed {
  id: string
  name: string
  region: LenderRegion
  financingTypes: FinancingType[]
  description: string
  logoUrl?: string
  applyUrl?: string
  minAmount: number // USD cents
  maxAmount: number // USD cents
  interestRateMin: number
  interestRateMax: number
  termMonthsMin: number
  termMonthsMax: number
  maxLtvPercent: number
  shariaCompliant: boolean
}

const usd = (dollars: number) => Math.round(dollars * 100)

export const FINANCING_TYPE_LABELS: Record<FinancingType, string> = {
  SBA: 'SBA 7(a)',
  CSBFP: 'Canada Small Business Financing Program',
  BDC: 'BDC Acquisition Loan',
  BANK_TERM: 'Bank Term Loan',
  SME_LOAN: 'SME Loan',
  ISLAMIC_MURABAHA: 'Islamic — Murabaha',
  ISLAMIC_IJARA: 'Islamic — Ijara',
  SELLER_FINANCING: 'Seller Financing',
}

export const REGION_LABELS: Record<LenderRegion, string> = {
  USA: 'United States 🇺🇸',
  CANADA: 'Canada 🇨🇦',
  UAE: 'United Arab Emirates 🇦🇪',
  GLOBAL: 'Global 🌍',
}

export const LENDERS: LenderSeed[] = [
  // ---------------- USA ----------------
  {
    id: 'lender-live-oak',
    name: 'Live Oak Bank — SBA 7(a)',
    region: 'USA',
    financingTypes: ['SBA', 'BANK_TERM'],
    description:
      'The nation\'s leading SBA 7(a) lender by volume, specializing in business-acquisition loans with long terms and low down payments for qualified U.S. buyers.',
    applyUrl: 'https://www.liveoakbank.com/business-acquisition-financing/',
    minAmount: usd(50_000),
    maxAmount: usd(5_000_000),
    interestRateMin: 10.5,
    interestRateMax: 11.5,
    termMonthsMin: 84,
    termMonthsMax: 300,
    maxLtvPercent: 90,
    shariaCompliant: false,
  },
  {
    id: 'lender-newtek',
    name: 'Newtek Small Business Finance — SBA 7(a)',
    region: 'USA',
    financingTypes: ['SBA', 'SME_LOAN'],
    description:
      'A top non-bank SBA 7(a) lender offering acquisition and working-capital financing nationwide, with a fast digital application and flexible structures.',
    applyUrl: 'https://www.newtekone.com/lending/sba-7a-loans/',
    minAmount: usd(25_000),
    maxAmount: usd(5_000_000),
    interestRateMin: 10.5,
    interestRateMax: 12.5,
    termMonthsMin: 60,
    termMonthsMax: 300,
    maxLtvPercent: 90,
    shariaCompliant: false,
  },
  {
    id: 'lender-huntington',
    name: 'Huntington Bank — SBA Lending',
    region: 'USA',
    financingTypes: ['SBA', 'BANK_TERM'],
    description:
      'A leading originator of SBA 7(a) loans by unit volume, with relationship banking and acquisition financing for small and lower-mid-market U.S. businesses.',
    applyUrl: 'https://www.huntington.com/Commercial/loans-leasing/sba',
    minAmount: usd(50_000),
    maxAmount: usd(5_000_000),
    interestRateMin: 10.0,
    interestRateMax: 12.0,
    termMonthsMin: 84,
    termMonthsMax: 300,
    maxLtvPercent: 85,
    shariaCompliant: false,
  },
  // ---------------- CANADA ----------------
  {
    id: 'lender-bdc',
    name: 'BDC — Business Development Bank of Canada',
    region: 'CANADA',
    financingTypes: ['BDC', 'BANK_TERM'],
    description:
      'Canada\'s bank for entrepreneurs. Dedicated business-acquisition and transition financing with flexible repayment and no penalty for early repayment.',
    applyUrl: 'https://www.bdc.ca/en/financing/business-loans',
    minAmount: usd(50_000),
    maxAmount: usd(25_000_000),
    interestRateMin: 7.5,
    interestRateMax: 11.0,
    termMonthsMin: 12,
    termMonthsMax: 300,
    maxLtvPercent: 85,
    shariaCompliant: false,
  },
  {
    id: 'lender-csbfp',
    name: 'Canada Small Business Financing Program (CSBFP)',
    region: 'CANADA',
    financingTypes: ['CSBFP'],
    description:
      'Government-backed program (via RBC, BMO, Scotiabank, TD, CIBC) sharing lender risk to fund equipment, property and business purchases up to $1.15M.',
    applyUrl: 'https://ised-isde.canada.ca/site/canada-small-business-financing-program/en',
    minAmount: usd(10_000),
    maxAmount: usd(1_150_000),
    interestRateMin: 8.0,
    interestRateMax: 10.5,
    termMonthsMin: 24,
    termMonthsMax: 180,
    maxLtvPercent: 90,
    shariaCompliant: false,
  },
  {
    id: 'lender-rbc-sme',
    name: 'RBC Royal Bank — Business Acquisition',
    region: 'CANADA',
    financingTypes: ['BANK_TERM', 'CSBFP'],
    description:
      'Term financing for established cash-flowing businesses, with CSBFP participation and integrated cash-management for the acquired entity.',
    applyUrl: 'https://www.rbcroyalbank.com/business/loans/',
    minAmount: usd(25_000),
    maxAmount: usd(5_000_000),
    interestRateMin: 7.9,
    interestRateMax: 12.0,
    termMonthsMin: 12,
    termMonthsMax: 240,
    maxLtvPercent: 80,
    shariaCompliant: false,
  },
  // ---------------- UAE ----------------
  {
    id: 'lender-edb',
    name: 'Emirates Development Bank (EDB)',
    region: 'UAE',
    financingTypes: ['SME_LOAN', 'BANK_TERM'],
    description:
      'Federal development bank prioritising SME growth and business acquisition across priority sectors, with competitive rates for UAE-based entities.',
    applyUrl: 'https://www.edb.gov.ae/en/products/business-loans',
    minAmount: usd(50_000),
    maxAmount: usd(15_000_000),
    interestRateMin: 5.0,
    interestRateMax: 9.0,
    termMonthsMin: 12,
    termMonthsMax: 180,
    maxLtvPercent: 80,
    shariaCompliant: false,
  },
  {
    id: 'lender-dib',
    name: 'Dubai Islamic Bank — Business Finance',
    region: 'UAE',
    financingTypes: ['ISLAMIC_MURABAHA', 'ISLAMIC_IJARA'],
    description:
      'Sharia-compliant acquisition finance structured as Murabaha (cost-plus) or Ijara (lease-to-own). No riba (interest); profit rate agreed upfront.',
    applyUrl: 'https://www.dib.ae/business',
    minAmount: usd(40_000),
    maxAmount: usd(20_000_000),
    interestRateMin: 4.5, // profit rate equivalent
    interestRateMax: 8.5,
    termMonthsMin: 12,
    termMonthsMax: 144,
    maxLtvPercent: 80,
    shariaCompliant: true,
  },
  {
    id: 'lender-mashreq',
    name: 'Mashreq — SME Business Banking',
    region: 'UAE',
    financingTypes: ['SME_LOAN', 'BANK_TERM'],
    description:
      'Conventional and Islamic SME financing with fast digital onboarding for UAE trade-licensed businesses and acquisition buyers.',
    applyUrl: 'https://www.mashreq.com/en/uae/business/',
    minAmount: usd(30_000),
    maxAmount: usd(8_000_000),
    interestRateMin: 6.0,
    interestRateMax: 11.5,
    termMonthsMin: 12,
    termMonthsMax: 120,
    maxLtvPercent: 75,
    shariaCompliant: false,
  },
  {
    id: 'lender-beehive',
    name: 'Beehive — Sharia-Compliant P2P Finance',
    region: 'UAE',
    financingTypes: ['ISLAMIC_MURABAHA', 'SME_LOAN'],
    description:
      'UAE\'s first regulated peer-to-peer platform offering fast, Sharia-compliant SME finance — well suited to smaller acquisitions and working capital.',
    applyUrl: 'https://www.beehive.ae/',
    minAmount: usd(25_000),
    maxAmount: usd(2_000_000),
    interestRateMin: 7.0, // profit rate equivalent
    interestRateMax: 14.0,
    termMonthsMin: 6,
    termMonthsMax: 60,
    maxLtvPercent: 70,
    shariaCompliant: true,
  },
  // ---------------- GLOBAL ----------------
  {
    id: 'lender-seller-finance',
    name: 'Seller Financing (Vendor Take-Back)',
    region: 'GLOBAL',
    financingTypes: ['SELLER_FINANCING'],
    description:
      'Negotiate part of the purchase price as a seller note or earnout. Common in 20-40% of SMB deals; reduces upfront capital and signals seller confidence.',
    minAmount: usd(0),
    maxAmount: usd(50_000_000),
    interestRateMin: 5.0,
    interestRateMax: 10.0,
    termMonthsMin: 12,
    termMonthsMax: 84,
    maxLtvPercent: 40,
    shariaCompliant: false,
  },
]

/** Filter helper shared by the API route and seed verification. */
export function filterLenders(
  lenders: LenderSeed[],
  opts: { region?: LenderRegion; shariaOnly?: boolean; amountUsdCents?: number },
): LenderSeed[] {
  return lenders.filter((l) => {
    if (opts.region && l.region !== opts.region && l.region !== 'GLOBAL') return false
    if (opts.shariaOnly && !l.shariaCompliant) return false
    if (opts.amountUsdCents != null) {
      if (opts.amountUsdCents < l.minAmount || opts.amountUsdCents > l.maxAmount) return false
    }
    return true
  })
}

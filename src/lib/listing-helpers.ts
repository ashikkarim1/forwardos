/**
 * Helpers for the quick-list flow and confidential / SEO listing surfaces.
 * All exports here are pure — no DB / IO — so they're safe to import from
 * either the server or the client.
 */

// ─── Slug ──────────────────────────────────────────────────────────────────────

const SLUG_NOISE = /[^a-z0-9]+/g
const SLUG_TRIM = /^-+|-+$/g

/** Slugify a human title. Returns kebab-case, ascii-only, capped at 60 chars. */
export function slugify(input: string): string {
  if (!input) return ''
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(SLUG_NOISE, '-')
    .replace(SLUG_TRIM, '')
    .slice(0, 60)
}

/** Stable, SEO-friendly slug for a Deal: `title-slug-{6 of dealId}`. */
export function dealSlug(title: string, dealId: string): string {
  const base = slugify(title) || 'business'
  const suffix = dealId.replace(/[^a-z0-9]/gi, '').slice(-6).toLowerCase()
  return `${base}-${suffix}`
}

// ─── Confidential listing masking ──────────────────────────────────────────────

const REGION_BY_CITY: Record<string, string> = {
  // USA — major metros → broader region
  'New York': 'NYC Metro', 'Brooklyn': 'NYC Metro', 'Queens': 'NYC Metro',
  'Los Angeles': 'Greater LA', 'San Francisco': 'Bay Area', 'San Diego': 'San Diego County',
  'Seattle': 'Puget Sound', 'Chicago': 'Chicagoland', 'Boston': 'Greater Boston',
  'Miami': 'South Florida', 'Atlanta': 'Metro Atlanta', 'Austin': 'Central Texas',
  'Houston': 'Greater Houston', 'Dallas': 'DFW', 'Denver': 'Front Range',
  'Phoenix': 'Greater Phoenix', 'Philadelphia': 'Greater Philly',
  // Canada
  'Toronto': 'GTA', 'Vancouver': 'Metro Vancouver', 'Montreal': 'Greater Montreal',
  'Calgary': 'Calgary Region', 'Ottawa': 'National Capital Region', 'Edmonton': 'Edmonton Region',
  'Halifax': 'Halifax Region',
  // UAE
  'Dubai': 'UAE', 'Abu Dhabi': 'UAE', 'Sharjah': 'UAE', 'Ajman': 'UAE',
}

/** Mask an exact city to a broader metro / region for confidential listings. */
export function maskCity(city: string | null | undefined, country: string): string {
  if (!city) return country
  return REGION_BY_CITY[city] || `${country} (region withheld)`
}

/**
 * Deterministic 4-char ref code from a deal id. Hash-based — NOT a substring
 * of the id, because seeded ids like "deal-ca-saas" end in the industry name
 * and produced refs like "SAAS" that collided with the headline.
 */
export function refCode(dealId: string): string {
  let h = 0
  for (let i = 0; i < dealId.length; i++) {
    h = (h * 31 + dealId.charCodeAt(i)) >>> 0
  }
  // Base-36, zero-padded, skip ambiguous look — 4 chars gives 1.7M codes.
  return h.toString(36).toUpperCase().padStart(4, '0').slice(-4)
}

/** Build a confidential teaser title from industry + country, without seller name. */
export function confidentialTitle(industry: string, country: string, dealId: string): string {
  const ind = industry
    .split('_')
    .map((w) => w[0] + w.slice(1).toLowerCase())
    .join(' ')
  return `Confidential ${ind} business — ${country} · ref #${refCode(dealId)}`
}

// ─── Revenue / asking range presets (for the quick-list dropdowns) ────────────

export const REVENUE_RANGES = [
  { id: 'under-250k',  label: 'Under $250K',  midCents: 12_500_000n },
  { id: '250k-500k',   label: '$250K – $500K', midCents: 37_500_000n },
  { id: '500k-1m',     label: '$500K – $1M',   midCents: 75_000_000n },
  { id: '1m-3m',       label: '$1M – $3M',     midCents: 200_000_000n },
  { id: '3m-5m',       label: '$3M – $5M',     midCents: 400_000_000n },
  { id: '5m-10m',      label: '$5M – $10M',    midCents: 750_000_000n },
  { id: '10m-25m',     label: '$10M – $25M',   midCents: 1_750_000_000n },
  { id: 'over-25m',    label: 'Over $25M',     midCents: 3_500_000_000n },
] as const

export const ASKING_RANGES = [
  { id: 'under-500k',  label: 'Under $500K',   midCents: 25_000_000n },
  { id: '500k-1m',     label: '$500K – $1M',   midCents: 75_000_000n },
  { id: '1m-2m',       label: '$1M – $2M',     midCents: 150_000_000n },
  { id: '2m-5m',       label: '$2M – $5M',     midCents: 350_000_000n },
  { id: '5m-10m',      label: '$5M – $10M',    midCents: 750_000_000n },
  { id: '10m-25m',     label: '$10M – $25M',   midCents: 1_750_000_000n },
  { id: '25m-50m',     label: '$25M – $50M',   midCents: 3_750_000_000n },
  { id: 'over-50m',    label: 'Over $50M',     midCents: 7_500_000_000n },
] as const

// EBITDA + Cash Flow / SDE — both optional on the quick-list flow, but
// dramatically improve buyer match quality when supplied (BizBuySell's #1
// search filter for SMB deals is cash flow, not revenue).
export const EBITDA_RANGES = [
  { id: 'ebitda-under-100k', label: 'Under $100K',     midCents: 5_000_000n },
  { id: 'ebitda-100k-250k',  label: '$100K – $250K',   midCents: 17_500_000n },
  { id: 'ebitda-250k-500k',  label: '$250K – $500K',   midCents: 37_500_000n },
  { id: 'ebitda-500k-1m',    label: '$500K – $1M',     midCents: 75_000_000n },
  { id: 'ebitda-1m-3m',      label: '$1M – $3M',       midCents: 200_000_000n },
  { id: 'ebitda-3m-5m',      label: '$3M – $5M',       midCents: 400_000_000n },
  { id: 'ebitda-over-5m',    label: 'Over $5M',        midCents: 750_000_000n },
] as const

export const CASH_FLOW_RANGES = [
  { id: 'cf-under-100k', label: 'Under $100K',     midCents: 5_000_000n },
  { id: 'cf-100k-250k',  label: '$100K – $250K',   midCents: 17_500_000n },
  { id: 'cf-250k-500k',  label: '$250K – $500K',   midCents: 37_500_000n },
  { id: 'cf-500k-1m',    label: '$500K – $1M',     midCents: 75_000_000n },
  { id: 'cf-1m-3m',      label: '$1M – $3M',       midCents: 200_000_000n },
  { id: 'cf-3m-5m',      label: '$3M – $5M',       midCents: 400_000_000n },
  { id: 'cf-over-5m',    label: 'Over $5M',        midCents: 750_000_000n },
] as const

export const REVENUE_RANGE_BY_ID = Object.fromEntries(REVENUE_RANGES.map((r) => [r.id, r])) as Record<string, (typeof REVENUE_RANGES)[number]>
export const ASKING_RANGE_BY_ID = Object.fromEntries(ASKING_RANGES.map((r) => [r.id, r])) as Record<string, (typeof ASKING_RANGES)[number]>
export const EBITDA_RANGE_BY_ID = Object.fromEntries(EBITDA_RANGES.map((r) => [r.id, r])) as Record<string, (typeof EBITDA_RANGES)[number]>
export const CASH_FLOW_RANGE_BY_ID = Object.fromEntries(CASH_FLOW_RANGES.map((r) => [r.id, r])) as Record<string, (typeof CASH_FLOW_RANGES)[number]>

// ─── Industries for quick-list dropdown (matches Prisma IndustryType) ─────────

export const QUICK_LIST_INDUSTRIES = [
  { value: 'SAAS', label: 'SaaS / Software' },
  { value: 'ECOMMERCE', label: 'E-Commerce' },
  { value: 'SERVICES', label: 'Professional Services' },
  { value: 'HOSPITALITY', label: 'Restaurants / Hospitality' },
  { value: 'RETAIL', label: 'Retail' },
  { value: 'HEALTHCARE', label: 'Healthcare / Medical' },
  { value: 'MANUFACTURING', label: 'Manufacturing' },
  { value: 'LOGISTICS', label: 'Logistics / Distribution' },
  { value: 'FINTECH', label: 'FinTech' },
  { value: 'EDUCATION', label: 'Education / EdTech' },
  { value: 'ENERGY', label: 'Energy / Utilities' },
  { value: 'REAL_ESTATE', label: 'Real Estate' },
  { value: 'AUTOMOTIVE', label: 'Automotive' },
  { value: 'AGRICULTURE', label: 'Agriculture' },
  { value: 'BIOTECH', label: 'Biotech / Life Sciences' },
  { value: 'CPG', label: 'Consumer Goods (CPG)' },
  { value: 'MEDIA', label: 'Media / Content' },
  { value: 'TELECOM', label: 'Telecom' },
  { value: 'OTHER', label: 'Other / Mixed' },
] as const

export const QUICK_LIST_COUNTRIES = [
  { value: 'USA', label: 'United States' },
  { value: 'Canada', label: 'Canada' },
  { value: 'UAE', label: 'United Arab Emirates' },
  { value: 'KSA', label: 'Saudi Arabia' },
] as const

// Country-marker hints used by the soft city/region warning on /list.
// Lowercase, single-word tokens that are *strongly indicative* of a
// country. Cross-country ambiguity (e.g. "London" → UK or Ontario) is
// the reason this is a warning, not a block — the seller may know
// something we don't. Keep the list short and high-precision.
const COUNTRY_MARKERS: Record<string, string[]> = {
  USA: [
    'usa', 'united states', 'us', 'america',
    // major US-only cities
    'new york', 'nyc', 'manhattan', 'brooklyn', 'queens', 'bronx',
    'los angeles', 'la', 'san francisco', 'sf', 'silicon valley',
    'chicago', 'austin', 'dallas', 'houston', 'denver', 'seattle',
    'portland', 'phoenix', 'miami', 'atlanta', 'boston', 'detroit',
    'philadelphia', 'philly', 'san diego', 'minneapolis', 'pittsburgh',
    // US state names (high signal)
    'california', 'texas', 'florida', 'illinois', 'new jersey',
    'pennsylvania', 'ohio', 'georgia', 'michigan', 'virginia',
    'washington state', 'massachusetts', 'colorado', 'arizona',
  ],
  Canada: [
    'canada', 'canadian',
    'toronto', 'ottawa', 'vancouver', 'montreal', 'calgary', 'edmonton',
    'winnipeg', 'quebec city', 'quebec', 'halifax', 'mississauga', 'brampton',
    'hamilton', 'kitchener', 'waterloo', 'victoria',
    'ontario', 'british columbia', 'alberta', 'saskatchewan', 'manitoba',
    'nova scotia', 'new brunswick', 'newfoundland',
  ],
  UAE: [
    'uae', 'emirates',
    'dubai', 'abu dhabi', 'sharjah', 'ajman', 'fujairah',
    'ras al khaimah', 'umm al quwain', 'al ain', 'jebel ali',
    'dxb', 'jvc', 'difc', 'jlt',
  ],
  KSA: [
    'ksa', 'saudi arabia', 'saudi',
    'riyadh', 'jeddah', 'mecca', 'medina', 'dammam', 'khobar',
    'tabuk', 'taif', 'abha', 'neom',
  ],
} as const

/**
 * Returns the country code that the given free-text region/city *appears*
 * to belong to, or null if no marker matched. Lowercases + word-boundary
 * matches so "Sandiego Plaza, Toronto" picks Canada (toronto match)
 * before USA (substring "sandiego" is not in the marker list).
 */
export function inferCountryFromRegion(text: string): keyof typeof COUNTRY_MARKERS | null {
  if (!text) return null
  const t = text.toLowerCase()
  for (const [country, markers] of Object.entries(COUNTRY_MARKERS) as Array<[keyof typeof COUNTRY_MARKERS, string[]]>) {
    for (const m of markers) {
      // Word-boundary check: the marker is preceded + followed by a non-letter
      // (or string edge). Avoids matching "san" in "Sandiego".
      const re = new RegExp(`(^|[^a-z])${m.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^a-z]|$)`, 'i')
      if (re.test(t)) return country
    }
  }
  return null
}

export function countryLabel(value: string): string {
  const found = QUICK_LIST_COUNTRIES.find((c) => c.value === value)
  return found ? found.label : value
}

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

export const REVENUE_RANGE_BY_ID = Object.fromEntries(REVENUE_RANGES.map((r) => [r.id, r])) as Record<string, (typeof REVENUE_RANGES)[number]>
export const ASKING_RANGE_BY_ID = Object.fromEntries(ASKING_RANGES.map((r) => [r.id, r])) as Record<string, (typeof ASKING_RANGES)[number]>

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

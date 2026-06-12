/**
 * Single source of truth for "what's safe to show publicly about a listing."
 *
 * PLATFORM RULE: company name, seller name, address, phone, email, and any
 * other identifying detail are NEVER shown to anyone except a verified,
 * authenticated buyer who has signed the NDA inside that listing's deal room.
 * Everywhere else — public marketplace, transactional emails, saved-search
 * digests, sold-deal notifications, JSON-LD, OG tags — we go through this
 * helper, which strips the identifying fields and substitutes a generated
 * confidential headline.
 *
 * Test rule of thumb: if you grep the rendered HTML/email for a real
 * company name and find a match, you're not going through this helper.
 */
import { confidentialTitle, maskCity } from '@/lib/listing-helpers'
import { industryLabel } from '@/lib/listing-narrative'

export interface PublicListingInput {
  id: string
  industry: string
  country: string
  city?: string | null
  slug?: string | null
  // Anything below is safe to expose — they're metrics, not identity.
  askingPriceCents?: bigint | number | null
  revenueCents?: bigint | number | null
  heatScore?: number | null
  qualityScore?: number | null
}

export interface PublicListing {
  id: string
  slug: string | null
  industry: string
  industryLabel: string
  country: string
  region: string            // masked city → metro region
  headline: string          // "Confidential SaaS business · UAE · ref #7K2A"
  askingPriceCents: bigint | null
  revenueCents: bigint | null
  heatScore: number | null
  qualityScore: number | null
}

export function toPublicListing(d: PublicListingInput): PublicListing {
  return {
    id: d.id,
    slug: d.slug ?? null,
    industry: d.industry,
    industryLabel: industryLabel(d.industry),
    country: d.country,
    region: maskCity(d.city, d.country),
    headline: confidentialTitle(d.industry, d.country, d.id),
    askingPriceCents:
      d.askingPriceCents == null ? null : typeof d.askingPriceCents === 'bigint' ? d.askingPriceCents : BigInt(Math.round(d.askingPriceCents)),
    revenueCents:
      d.revenueCents == null ? null : typeof d.revenueCents === 'bigint' ? d.revenueCents : BigInt(Math.round(d.revenueCents)),
    heatScore: d.heatScore ?? null,
    qualityScore: d.qualityScore ?? null,
  }
}

/** Pretty-format BigInt cents → "$1.2M" / "$450K" / "—". */
export function formatCents(cents: bigint | null): string {
  if (cents == null) return '—'
  const dollars = Number(cents) / 100
  if (dollars >= 1_000_000) return `$${(dollars / 1_000_000).toFixed(1)}M`
  if (dollars >= 1_000) return `$${Math.round(dollars / 1_000)}K`
  return `$${Math.round(dollars)}`
}

/**
 * Range bucket for asking price, used in emails where we want to be even
 * vaguer than a precise $-figure (e.g. "$1M–$2M" instead of "$1.5M").
 */
export function formatAskingRange(cents: bigint | null): string {
  if (cents == null) return 'price on request'
  const dollars = Number(cents) / 100
  const buckets: [number, number, string][] = [
    [0, 500_000, 'Under $500K'],
    [500_000, 1_000_000, '$500K – $1M'],
    [1_000_000, 2_000_000, '$1M – $2M'],
    [2_000_000, 5_000_000, '$2M – $5M'],
    [5_000_000, 10_000_000, '$5M – $10M'],
    [10_000_000, 25_000_000, '$10M – $25M'],
    [25_000_000, 50_000_000, '$25M – $50M'],
    [50_000_000, Infinity, 'Over $50M'],
  ]
  for (const [lo, hi, label] of buckets) if (dollars >= lo && dollars < hi) return label
  return 'price on request'
}

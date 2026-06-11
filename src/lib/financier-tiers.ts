/**
 * Financing-partner membership tiers — shown ONLY on the financier signup flow
 * (/financier/apply), never on the public pricing page. Also holds the
 * credential-validation rules (work email + LinkedIn/website).
 */
export type FinancierTierId = 'LISTED' | 'VERIFIED' | 'PREFERRED' | 'STRATEGIC'

export interface FinancierTier {
  id: FinancierTierId
  name: string
  price: string
  priceMonthly: number
  highlighted?: boolean
  benefits: string[]
  performance?: string[] // performance-based commercial terms
}

export const FINANCIER_TIERS: FinancierTier[] = [
  {
    id: 'LISTED',
    name: 'Listed Partner',
    price: 'Free',
    priceMonthly: 0,
    benefits: ['Profile and contact details'],
  },
  {
    id: 'VERIFIED',
    name: 'Verified Financing Partner',
    price: '$299/mo',
    priceMonthly: 299,
    benefits: ['Verified badge', 'Analytics dashboard'],
  },
  {
    id: 'PREFERRED',
    name: 'Preferred Partner',
    price: '$999/mo',
    priceMonthly: 999,
    highlighted: true,
    benefits: ['Featured placement', 'Lead routing'],
  },
  {
    id: 'STRATEGIC',
    name: 'Strategic Partner',
    price: '$5,000+/mo',
    priceMonthly: 5000,
    benefits: ['Homepage exposure — always on the main page', 'Exclusive categories'],
    performance: ['$250 per qualified lead', '0.25% of funded transactions'],
  },
]

export function getFinancierTier(id: string): FinancierTier | undefined {
  return FINANCIER_TIERS.find((t) => t.id === id)
}

// ---------- credential validation ----------

// Free / personal email providers — partners must use a work email.
const FREE_EMAIL_DOMAINS = new Set([
  'gmail.com', 'googlemail.com', 'yahoo.com', 'ymail.com', 'rocketmail.com',
  'hotmail.com', 'hotmail.co.uk', 'outlook.com', 'live.com', 'msn.com',
  'icloud.com', 'me.com', 'mac.com', 'aol.com', 'protonmail.com', 'proton.me',
  'gmx.com', 'gmx.net', 'mail.com', 'zoho.com', 'yandex.com', 'yandex.ru',
  'qq.com', '163.com', '126.com', 'pm.me', 'hey.com', 'fastmail.com',
])

export function isWorkEmail(email: string): boolean {
  const at = email.indexOf('@')
  if (at < 1) return false
  const domain = email.slice(at + 1).toLowerCase().trim()
  if (!domain || !domain.includes('.')) return false
  return !FREE_EMAIL_DOMAINS.has(domain)
}

const looksLikeUrl = (v?: string) => !!v && /\.[a-z]{2,}/i.test(v.trim())
const looksLikeLinkedIn = (v?: string) => !!v && /linkedin\.com\//i.test(v.trim())

/**
 * Partners must provide a work email AND at least one of website / LinkedIn.
 * Returns the first validation error message, or null if valid.
 */
export function validateFinancierCredentials(opts: { email?: string; website?: string; linkedin?: string }): string | null {
  if (!opts.email || !isWorkEmail(opts.email)) {
    return 'Please use your work email (free providers like Gmail/Outlook aren’t accepted).'
  }
  const hasSite = looksLikeUrl(opts.website)
  const hasLinkedIn = looksLikeLinkedIn(opts.linkedin) || looksLikeUrl(opts.linkedin)
  if (!hasSite && !hasLinkedIn) {
    return 'Please provide your company website and/or LinkedIn — at least one is required.'
  }
  return null
}

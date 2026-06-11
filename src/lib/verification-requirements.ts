/**
 * Region-aware required documents for seller / business verification.
 * One manual-review workflow serves all regions — the reviewer just sees the
 * right documents per region. UAE additionally requires beneficial-ownership (UBO).
 */
export type VerificationRegion = 'USA' | 'CANADA' | 'UAE'

export interface RequiredDoc {
  type: string
  label: string
  hint?: string
}

export interface RegionRequirements {
  label: string
  docs: RequiredDoc[]
  uboRequired: boolean
}

export const VERIFICATION_REQUIREMENTS: Record<VerificationRegion, RegionRequirements> = {
  USA: {
    label: 'United States 🇺🇸',
    uboRequired: false,
    docs: [
      { type: 'gov_id', label: 'Government photo ID', hint: 'Driver’s license or passport of the owner/officer' },
      { type: 'business_registration', label: 'Business registration', hint: 'Secretary of State filing / Certificate of Good Standing' },
      { type: 'ein', label: 'EIN confirmation', hint: 'IRS EIN letter (CP-575 / 147C)' },
      { type: 'proof_ownership', label: 'Proof of ownership', hint: 'Cap table, operating agreement, or share certificate' },
    ],
  },
  CANADA: {
    label: 'Canada 🇨🇦',
    uboRequired: false,
    docs: [
      { type: 'gov_id', label: 'Government photo ID', hint: 'Driver’s license or passport of the owner/officer' },
      { type: 'incorporation', label: 'Articles of incorporation', hint: 'Federal or provincial corporate registry document' },
      { type: 'proof_ownership', label: 'Proof of ownership', hint: 'Shareholder register or ownership declaration' },
    ],
  },
  UAE: {
    label: 'United Arab Emirates 🇦🇪',
    uboRequired: true,
    docs: [
      { type: 'emirates_id', label: 'Emirates ID or passport', hint: 'Of the signatory/owner' },
      { type: 'trade_licence', label: 'Trade Licence', hint: 'Valid (non-expired) mainland DED or free-zone licence' },
      { type: 'establishment_card', label: 'Establishment card', hint: 'Immigration establishment card' },
      { type: 'proof_ownership', label: 'Proof of ownership', hint: 'MoA / share certificate' },
    ],
  },
}

export function getRequirements(region: string): RegionRequirements | undefined {
  return VERIFICATION_REQUIREMENTS[region as VerificationRegion]
}

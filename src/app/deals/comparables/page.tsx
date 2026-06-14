import { LockedFeature } from '@/components/dashboard/LockedFeature'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Comparables · Forward Intelligence' }

export default function ComparablesPage() {
  return (
    <LockedFeature
      kicker="Intelligence"
      title="Deal Comparables"
      pitch="Anchor your valuation in real transactions, not gut feel. Pull comparable deals by sector, region, and revenue with full multiples breakdown."
      bullets={[
        'Median EBITDA & revenue multiples by sector',
        'Filter by region, size band, and deal age',
        'Export comparables to PDF for committee review',
        'Cross-reference against your saved listings',
      ]}
      requiredTier="BUYER_PREMIUM"
      comingSoon
    />
  )
}

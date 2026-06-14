import { LockedFeature } from '@/components/dashboard/LockedFeature'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Deal Signals · Forward Intelligence' }

export default function SignalsPage() {
  return (
    <LockedFeature
      kicker="Intelligence"
      title="Deal Signals"
      pitch="Early indicators that a business is about to come to market — leadership changes, succession events, financial distress, regulatory triggers."
      bullets={[
        'Pre-listing signals on private companies in your sector',
        'Succession & ownership transition watch list',
        'Distressed-asset indicators',
        'Regulatory & macro trigger alerts by region',
      ]}
      requiredTier="BUYER_PREMIUM"
      comingSoon
    />
  )
}

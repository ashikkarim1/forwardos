import { LockedFeature } from '@/components/dashboard/LockedFeature'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Real-Time Feeds · Forward Intelligence' }

export default function FeedsPage() {
  return (
    <LockedFeature
      kicker="Intelligence"
      title="Real-Time Feeds"
      pitch="A live stream of deal-relevant events — new listings, price moves, status changes, and broker activity — across your saved searches."
      bullets={[
        'Push notifications the moment a saved-search match goes live',
        'Asking-price change alerts on watched listings',
        'Broker activity on deals you are tracking',
        'Custom filters by industry, region, deal stage',
      ]}
      requiredTier="BUYER_PREMIUM"
      comingSoon
    />
  )
}

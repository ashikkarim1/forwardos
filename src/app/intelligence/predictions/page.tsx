import { LockedFeature } from '@/components/dashboard/LockedFeature'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'M&A Predictions · Forward Intelligence' }

export default function PredictionsPage() {
  return (
    <LockedFeature
      kicker="Intelligence"
      title="M&A Predictions"
      pitch="Our patent-pending model scores every active listing on the probability it closes — and how soon. Built from 500K+ deal outcomes."
      bullets={[
        'Close-probability score on every active listing',
        'Predicted time-to-close window',
        'Top 3 driver signals behind each prediction',
        'Daily refresh as new market signals land',
      ]}
      requiredTier="BUYER_PREMIUM"
      comingSoon
    />
  )
}

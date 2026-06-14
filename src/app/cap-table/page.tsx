import { LockedFeature } from '@/components/dashboard/LockedFeature'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Cap Table · Forward Intelligence' }

export default function CapTablePage() {
  return (
    <LockedFeature
      kicker="Tools"
      title="Cap Table"
      pitch="Model your acquisition's post-close ownership before you sign. Scenario test earn-outs, rollovers, and management equity in seconds."
      bullets={[
        'Pre- and post-close ownership scenarios',
        'Earn-out and seller-rollover modelling',
        'Management incentive pool sizing',
        'Export waterfall to PDF or Excel',
      ]}
      requiredTier="BUYER_PREMIUM"
      comingSoon
    />
  )
}

import { LockedFeature } from '@/components/dashboard/LockedFeature'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Heat Maps · Forward Intelligence' }

export default function HeatMapsPage() {
  return (
    <LockedFeature
      kicker="Intelligence"
      title="Heat Maps"
      pitch="See where buyer demand is concentrating in real time — by industry, region, and revenue band — so you can move on a deal before the market does."
      bullets={[
        'Live heat scores on every active listing',
        'Sector-by-region demand overlays for UAE, Canada & USA',
        'Watchlists for industries you are actively pursuing',
        '24–48h lead time on new listings before public release',
      ]}
      requiredTier="BUYER_PREMIUM"
      comingSoon
    />
  )
}

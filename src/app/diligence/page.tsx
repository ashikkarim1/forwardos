import { LockedFeature } from '@/components/dashboard/LockedFeature'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Advanced Diligence · Forward Intelligence' }

export default function DiligencePage() {
  return (
    <LockedFeature
      kicker="Tools"
      title="Advanced Diligence"
      pitch="Run a structured diligence playbook on any listing — financial cross-checks, customer concentration, KYC/AML, and red-flag scoring — without leaving Forward."
      bullets={[
        'Automated financial-document OCR & cross-check',
        'Customer concentration & churn analysis',
        'KYC / AML & sanctions screening on counterparties',
        'Risk-weighted red-flag report you can share',
      ]}
      requiredTier="BUYER_PREMIUM"
      comingSoon
    />
  )
}

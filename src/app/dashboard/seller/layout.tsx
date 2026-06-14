// Role-gates /dashboard/seller to SELLER (and ADMIN). Buyers/brokers
// landing here are bounced to their own dashboard.
import { requireRoleOrRedirect } from '@/lib/auth-guard'
import { UpgradeBanner } from '@/components/dashboard/UpgradeBanner'

export const dynamic = 'force-dynamic'

export default async function SellerDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireRoleOrRedirect('SELLER', '/dashboard/seller')
  return (
    <>
      <div style={{ padding: '24px 24px 0' }}>
        <UpgradeBanner role="seller" />
      </div>
      {children}
    </>
  )
}

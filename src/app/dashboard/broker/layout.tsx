// Role-gates /dashboard/broker to BROKER (and ADMIN). Buyers/sellers
// landing here are bounced to their own dashboard.
import { requireRoleOrRedirect } from '@/lib/auth-guard'
import { UpgradeBanner } from '@/components/dashboard/UpgradeBanner'

export const dynamic = 'force-dynamic'

export default async function BrokerDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireRoleOrRedirect('BROKER', '/dashboard/broker')
  return (
    <>
      <div style={{ padding: '24px 24px 0' }}>
        <UpgradeBanner role="broker" />
      </div>
      {children}
    </>
  )
}

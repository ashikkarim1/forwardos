// Role-gates /dashboard/broker to BROKER (and ADMIN). Buyers/sellers
// landing here are bounced to their own dashboard.
import { requireRoleOrRedirect } from '@/lib/auth-guard'

export const dynamic = 'force-dynamic'

export default async function BrokerDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireRoleOrRedirect('BROKER', '/dashboard/broker')
  return <>{children}</>
}

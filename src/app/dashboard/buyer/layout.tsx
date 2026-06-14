// Role-gates /dashboard/buyer to BUYER (and ADMIN for support). A SELLER
// or BROKER who lands here is bounced to their own dashboard.
import { requireRoleOrRedirect } from '@/lib/auth-guard'

export const dynamic = 'force-dynamic'

export default async function BuyerDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireRoleOrRedirect('BUYER', '/dashboard/buyer')
  return <>{children}</>
}

// Role-gates /dashboard/seller to SELLER (and ADMIN). Buyers/brokers
// landing here are bounced to their own dashboard.
import { requireRoleOrRedirect } from '@/lib/auth-guard'

export const dynamic = 'force-dynamic'

export default async function SellerDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireRoleOrRedirect('SELLER', '/dashboard/seller')
  return <>{children}</>
}

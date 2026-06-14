// Role-gates /dashboard/buyer to BUYER (and ADMIN for support). A SELLER
// or BROKER who lands here is bounced to their own dashboard.
import { requireRoleOrRedirect } from '@/lib/auth-guard'
import { UpgradeBanner } from '@/components/dashboard/UpgradeBanner'

export const dynamic = 'force-dynamic'

export default async function BuyerDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireRoleOrRedirect('BUYER', '/dashboard/buyer')
  return (
    <>
      {/* Surfaces only when the caller is on the FREE buyer tier; renders
          nothing for Premium Buyer subscribers. Pulls plan tier server-side
          from Prisma — feature pages stay 'use client' as-is. */}
      <div style={{ padding: '24px 24px 0' }}>
        <UpgradeBanner role="buyer" />
      </div>
      {children}
    </>
  )
}

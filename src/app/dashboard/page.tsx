/**
 * /dashboard — entry router. Forwards each visitor to the dashboard they
 * actually have access to based on their role. No UI of its own.
 *
 *   BUYER  → /dashboard/buyer
 *   SELLER → /dashboard/seller
 *   BROKER → /dashboard/broker
 *   ADMIN  → /admin
 *
 * The role-specific layouts under each child path then run their own gate
 * so a buyer who type-bashes /dashboard/seller is bounced back here.
 */
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export default async function DashboardEntry() {
  const session = await getSession()
  if (!session) {
    redirect('/auth/login?redirect=%2Fdashboard')
  }
  switch (session.role) {
    case 'BUYER':  redirect('/dashboard/buyer')
    case 'SELLER': redirect('/dashboard/seller')
    case 'BROKER': redirect('/dashboard/broker')
    case 'ADMIN':  redirect('/admin')
    default:       redirect('/marketplace')
  }
}

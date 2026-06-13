// SERVER COMPONENT — see /dashboard/layout.tsx for the why.
import { requireSessionOrRedirect } from '@/lib/auth-guard'
import NotificationsLayoutClient from './LayoutClient'

export const dynamic = 'force-dynamic'

export default async function NotificationsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireSessionOrRedirect('/notifications')
  return <NotificationsLayoutClient>{children}</NotificationsLayoutClient>
}

// SERVER COMPONENT — gates /messages with a session check. See
// /dashboard/layout.tsx for context on why we don't rely on middleware here.
import { requireSessionOrRedirect } from '@/lib/auth-guard'

export const dynamic = 'force-dynamic'

export default async function MessagesLayout({ children }: { children: React.ReactNode }) {
  await requireSessionOrRedirect('/messages')
  return <>{children}</>
}

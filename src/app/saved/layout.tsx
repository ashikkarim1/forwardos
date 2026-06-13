// SERVER COMPONENT — gates /saved. See /dashboard/layout.tsx for context.
import { requireSessionOrRedirect } from '@/lib/auth-guard'

export const dynamic = 'force-dynamic'

export default async function SavedLayout({ children }: { children: React.ReactNode }) {
  await requireSessionOrRedirect('/saved')
  return <>{children}</>
}

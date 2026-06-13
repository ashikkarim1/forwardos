// SERVER COMPONENT — runs the auth check before any HTML is sent. This
// supersedes middleware.ts because Vercel's edge cache serves statically
// prerendered pages without running middleware; the server render path
// always runs, cache or no cache.
import { requireSessionOrRedirect } from '@/lib/auth-guard'
import DashboardLayoutClient from './LayoutClient'

export const dynamic = 'force-dynamic'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireSessionOrRedirect('/dashboard')
  return <DashboardLayoutClient>{children}</DashboardLayoutClient>
}

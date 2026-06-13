// SERVER COMPONENT — admin guard + auth check. See /dashboard/layout.tsx
// for why we wrap a client layout in a server component (Vercel CDN cache).
import { requireAdminOrRedirect } from '@/lib/auth-guard'
import AdminLayoutClient from './LayoutClient'

export const dynamic = 'force-dynamic'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireAdminOrRedirect('/admin')
  return <AdminLayoutClient>{children}</AdminLayoutClient>
}

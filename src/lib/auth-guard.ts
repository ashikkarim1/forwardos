/**
 * Server-side auth guards used at the top of protected layout.tsx files.
 *
 * We have a middleware.ts that *should* handle this, but Vercel's CDN serves
 * statically-prerendered pages from cache before middleware can intercept.
 * These helpers run during server rendering — there is no cache layer that
 * can route around them.
 *
 * Pattern:
 *   // app/dashboard/layout.tsx  ← server component (no "use client")
 *   import { requireSessionOrRedirect } from '@/lib/auth-guard'
 *   import { DashboardLayoutClient } from './LayoutClient'
 *
 *   export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
 *     await requireSessionOrRedirect('/dashboard')
 *     return <DashboardLayoutClient>{children}</DashboardLayoutClient>
 *   }
 */
import { redirect } from 'next/navigation'
import { getSession } from './auth'

export async function requireSessionOrRedirect(returnTo: string): Promise<void> {
  const session = await getSession()
  if (!session) {
    redirect(`/auth/login?redirect=${encodeURIComponent(returnTo)}`)
  }
}

export async function requireAdminOrRedirect(returnTo: string): Promise<void> {
  const session = await getSession()
  if (!session) {
    redirect(`/auth/login?redirect=${encodeURIComponent(returnTo)}`)
  }
  if (session.role !== 'ADMIN') {
    // 404 the route — don't even confirm it exists for non-admins.
    redirect('/404')
  }
}

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

/**
 * Gate a dashboard to a specific role.
 *
 *  - Unauth → /auth/login?redirect=<returnTo>
 *  - Wrong role → /dashboard/<their-role> (friendlier than 404; sellers
 *    landing on /dashboard/buyer just get bounced to /dashboard/seller).
 *  - ADMIN always allowed for support / impersonation triage.
 *
 * Use in each per-role layout, e.g.:
 *    await requireRoleOrRedirect('BUYER', '/dashboard/buyer')
 */
type GateRole = 'BUYER' | 'SELLER' | 'BROKER' | 'ADMIN'

export async function requireRoleOrRedirect(
  expected: GateRole,
  returnTo: string,
): Promise<void> {
  const session = await getSession()
  if (!session) {
    redirect(`/auth/login?redirect=${encodeURIComponent(returnTo)}`)
  }
  if (session.role === 'ADMIN') return        // admin: always allowed
  if (session.role === expected) return       // role matches
  // Bounce to caller's own dashboard.
  switch (session.role) {
    case 'BUYER':  redirect('/dashboard/buyer')
    case 'SELLER': redirect('/dashboard/seller')
    case 'BROKER': redirect('/dashboard/broker')
    default:       redirect('/marketplace')
  }
}

/**
 * Read the session once and return it. Use when a layout / page needs the
 * session for capability checks beyond a single role gate.
 */
export async function loadSession() {
  return getSession()
}

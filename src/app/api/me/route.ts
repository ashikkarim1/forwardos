/**
 * GET /api/me — lightweight session probe.
 *
 * Returns { authenticated: false } when no valid session cookie exists,
 * or { authenticated: true, role, email, userId } otherwise. Used by the
 * public header to decide whether to render notification / unread badges
 * (those used to fire pre-auth, leaking session-shaped UI to crawlers).
 *
 * Cheap on purpose — no DB hit. The middleware + layout guards do the
 * real enforcement; this just informs the UI shell.
 */
import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET() {
  const s = await getSession()
  if (!s) return NextResponse.json({ authenticated: false })
  return NextResponse.json({
    authenticated: true,
    userId: s.userId,
    email: s.email,
    role: s.role,
  })
}

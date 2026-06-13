/**
 * Auth gate for protected app sections.
 *
 * Why this file exists: dashboard/notifications/messages/admin routes are all
 * client components with no server-side auth check. Without this middleware,
 * anyone — including search-engine crawlers — could hit /dashboard or
 * /notifications and see the (empty) UI shell. The middleware runs at the edge
 * before the page renders, verifies the JWT cookie, and redirects to
 * /auth/login?redirect=<original> if invalid or missing.
 *
 * On successful auth, the original URL is preserved so the user lands back
 * where they were trying to go after signing in.
 *
 * Admin gate: the matcher includes /admin/*, but we additionally check the JWT
 * role claim and 404 anyone who isn't ADMIN (better than 403 — doesn't reveal
 * the route exists).
 */
import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || 'dev-secret-key-change-in-production',
)

// Paths that require a signed-in user (any role).
const PROTECTED_PREFIXES = [
  '/dashboard',
  '/notifications',
  '/messages',
  '/saved',
  '/my-favourites',
  '/seller/onboarding',
  '/seller/checkout',
  '/seller/pending-approval',
  '/seller/business-submitted',
  '/seller/submit-business',
  '/seller/submit-deal',
  '/seller/verify',
]

// Paths that additionally require role === 'ADMIN'.
const ADMIN_PREFIX = '/admin'

function isProtected(pathname: string): boolean {
  return PROTECTED_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + '/'))
}

function isAdmin(pathname: string): boolean {
  return pathname === ADMIN_PREFIX || pathname.startsWith(ADMIN_PREFIX + '/')
}

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl
  const needsAuth = isProtected(pathname) || isAdmin(pathname)
  if (!needsAuth) return NextResponse.next()

  const token = req.cookies.get('auth-token')?.value
  if (!token) {
    // Not signed in — bounce to login and preserve the destination.
    const url = req.nextUrl.clone()
    url.pathname = '/auth/login'
    url.search = `?redirect=${encodeURIComponent(pathname + search)}`
    return NextResponse.redirect(url)
  }

  let payload: { role?: string } | null = null
  try {
    const verified = await jwtVerify(token, secret)
    payload = verified.payload as { role?: string }
  } catch {
    // Bad/expired token — clear it and send to login.
    const url = req.nextUrl.clone()
    url.pathname = '/auth/login'
    url.search = `?redirect=${encodeURIComponent(pathname + search)}`
    const res = NextResponse.redirect(url)
    res.cookies.delete('auth-token')
    return res
  }

  if (isAdmin(pathname) && payload?.role !== 'ADMIN') {
    // Authenticated but not admin — 404 (don't reveal the route exists).
    return NextResponse.rewrite(new URL('/404', req.url))
  }

  return NextResponse.next()
}

// Match only the protected sections — leave everything else (marketplace,
// listing pages, auth pages, API, static assets) untouched so the edge fn
// stays fast and the middleware can't accidentally gate something public.
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/dashboard',
    '/notifications/:path*',
    '/notifications',
    '/messages/:path*',
    '/messages',
    '/saved/:path*',
    '/saved',
    '/my-favourites/:path*',
    '/my-favourites',
    '/admin/:path*',
    '/admin',
    '/seller/onboarding/:path*',
    '/seller/checkout/:path*',
    '/seller/pending-approval',
    '/seller/business-submitted',
    '/seller/submit-business',
    '/seller/submit-deal/:path*',
    '/seller/verify',
  ],
}

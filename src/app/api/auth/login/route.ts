import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPassword, signToken, setAuthCookie } from '@/lib/auth'
import { rateLimit, clientIp, isSameOrigin } from '@/lib/rate-limit'
import { parseBody, loginSchema } from '@/lib/validation'
import { logAudit } from '@/lib/audit'

/**
 * POST /api/auth/login  { email, password }
 * Verifies credentials against the hashed password and sets an httpOnly session cookie.
 * Hardened: same-origin check, brute-force rate limit, validated input.
 */
export async function POST(request: NextRequest) {
  try {
    if (!isSameOrigin(request)) {
      return NextResponse.json({ error: 'Cross-origin request blocked' }, { status: 403 })
    }
    // Brute-force protection: 10 attempts / 15 min per IP.
    const rl = rateLimit(`login:${clientIp(request)}`, 10, 15 * 60_000)
    if (!rl.ok) {
      return NextResponse.json({ error: 'Too many attempts. Try again later.' }, {
        status: 429, headers: { 'Retry-After': String(rl.retryAfter) },
      })
    }

    const parsed = await parseBody(request, loginSchema)
    if (!parsed.ok) return parsed.response
    const { email, password } = parsed.data

    const user = await prisma.user.findUnique({ where: { email: String(email).toLowerCase() } })
    // Generic message — don't reveal whether the email exists.
    if (!user || !(await verifyPassword(password, user.password))) {
      // Record the failed attempt so brute-force patterns are visible in
      // /admin/activity. userId is null because we never auth'd the actor.
      await logAudit({
        req: request, userId: null, action: 'auth.login.failed',
        resourceType: 'user', resourceId: user?.id ?? null,
        changes: { email: String(email).toLowerCase() },
      })
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    const token = await signToken({
      userId: user.id,
      email: user.email,
      role: user.role as 'SELLER' | 'BUYER' | 'BROKER' | 'ADMIN',
      kycStatus: user.kycStatus as never,
    })
    await setAuthCookie(token)

    await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } }).catch(() => {})

    await logAudit({
      req: request, userId: user.id, action: 'auth.login.success',
      resourceType: 'user', resourceId: user.id,
      changes: { role: user.role },
    })

    return NextResponse.json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Login failed' }, { status: 500 })
  }
}

/**
 * POST /api/auth/reset-password  { token, password }
 *
 * Consumes a one-time reset token and sets the user's new password (bcrypt-
 * hashed). Token is marked usedAt + deleted in the same transaction so it
 * can't be replayed. Auto-logs the user in by setting the session cookie.
 */
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, signToken, setAuthCookie } from '@/lib/auth'
import { rateLimit, clientIp, isSameOrigin } from '@/lib/rate-limit'
import { logAudit } from '@/lib/audit'

export async function POST(request: NextRequest) {
  try {
    if (!isSameOrigin(request)) {
      return NextResponse.json({ error: 'Cross-origin blocked' }, { status: 403 })
    }
    const rl = rateLimit(`reset:${clientIp(request)}`, 10, 15 * 60_000)
    if (!rl.ok) {
      return NextResponse.json({ error: 'Too many attempts. Try again later.' }, {
        status: 429, headers: { 'Retry-After': String(rl.retryAfter) },
      })
    }

    const { token, password } = (await request.json().catch(() => ({}))) as { token?: string; password?: string }
    if (!token || typeof token !== 'string') {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }
    if (!password || password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
    }

    const rec = await prisma.passwordResetToken.findUnique({
      where: { token },
      include: { user: { select: { id: true, email: true, role: true, kycStatus: true } } },
    })
    if (!rec || rec.usedAt || rec.expiresAt < new Date()) {
      return NextResponse.json({ error: 'This reset link is invalid or has expired. Request a new one.' }, { status: 400 })
    }

    const hashed = await hashPassword(password)
    // Atomic: set new password + consume token. Also clears any other live
    // tokens for this user so two parallel reset emails can't both succeed.
    await prisma.$transaction([
      prisma.user.update({ where: { id: rec.user.id }, data: { password: hashed } }),
      prisma.passwordResetToken.update({ where: { id: rec.id }, data: { usedAt: new Date() } }),
      prisma.passwordResetToken.deleteMany({ where: { userId: rec.user.id, usedAt: null } }),
    ])

    // Auto-login.
    const sessionToken = await signToken({
      userId: rec.user.id,
      email: rec.user.email,
      role: rec.user.role as 'SELLER' | 'BUYER' | 'BROKER' | 'ADMIN',
      kycStatus: rec.user.kycStatus as never,
    })
    await setAuthCookie(sessionToken)

    await logAudit({
      req: request, userId: rec.user.id, action: 'auth.password.reset',
      resourceType: 'user', resourceId: rec.user.id,
    })
    return NextResponse.json({ success: true, role: rec.user.role })
  } catch (e) {
    console.error('[API] reset-password error:', e)
    return NextResponse.json({ error: 'Reset failed. Please try again.' }, { status: 500 })
  }
}

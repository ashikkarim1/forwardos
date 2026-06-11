import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmailVerification } from '@/lib/services/email'
import { rateLimit, clientIp, isSameOrigin } from '@/lib/rate-limit'
import crypto from 'crypto'

/**
 * Resend an email-verification link. Always returns success (without revealing
 * whether the email is registered) to avoid an email-enumeration oracle.
 *
 * Rate-limited per IP to prevent abuse.
 */
export async function POST(request: NextRequest) {
  try {
    if (!isSameOrigin(request)) {
      return NextResponse.json({ error: 'Cross-origin request blocked' }, { status: 403 })
    }
    const rl = rateLimit(`resend-verify:${clientIp(request)}`, 5, 60 * 60_000)
    if (!rl.ok) {
      return NextResponse.json({ error: 'Too many requests. Try again later.' }, {
        status: 429, headers: { 'Retry-After': String(rl.retryAfter) },
      })
    }

    const { email } = await request.json()
    if (!email || typeof email !== 'string') {
      // Same generic 200 — don't leak validation details that aid enumeration.
      return NextResponse.json({ success: true }, { status: 200 })
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      select: { id: true, email: true, emailVerified: true },
    })

    // Only send if the user exists AND is not already verified.
    if (user && !user.emailVerified) {
      // Invalidate prior tokens so old links can't be reused after a reset.
      await prisma.emailVerificationToken.deleteMany({ where: { userId: user.id } })

      const token = crypto.randomBytes(32).toString('hex')
      await prisma.emailVerificationToken.create({
        data: {
          userId: user.id,
          token,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
      })
      await sendEmailVerification(user.email, token)
    }

    // Generic response either way.
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('[API] Resend verification error:', error)
    return NextResponse.json({ success: true }, { status: 200 })
  }
}

/**
 * POST /api/auth/forgot-password  { email }
 *
 * Generates a one-time reset token (60-min expiry, single-use) and emails a
 * reset link. Always returns 200 with a generic message — never reveals
 * whether the email is registered (email-enumeration oracle protection).
 *
 * Rate-limited per IP. Old tokens for the same user are invalidated so a
 * burst of requests can't leave multiple live links lying around.
 */
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { rateLimit, clientIp, isSameOrigin } from '@/lib/rate-limit'
import { sendEmail } from '@/lib/services/email'
import { luxuryEmail } from '@/lib/email-templates'
import crypto from 'crypto'

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.forwardos.ai'

export async function POST(request: NextRequest) {
  try {
    if (!isSameOrigin(request)) {
      return NextResponse.json({ error: 'Cross-origin blocked' }, { status: 403 })
    }
    const rl = rateLimit(`forgot:${clientIp(request)}`, 5, 60 * 60_000)
    if (!rl.ok) {
      return NextResponse.json({ success: true }, { status: 200 }) // silent — don't leak rate-limit
    }

    const { email } = (await request.json().catch(() => ({}))) as { email?: string }
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ success: true }, { status: 200 })
    }

    const normalized = email.toLowerCase().trim()
    const user = await prisma.user.findUnique({
      where: { email: normalized },
      select: { id: true, email: true, name: true },
    })

    if (user) {
      // Invalidate any prior live tokens — only one outstanding link per user.
      await prisma.passwordResetToken.deleteMany({ where: { userId: user.id, usedAt: null } })

      const token = crypto.randomBytes(32).toString('hex')
      await prisma.passwordResetToken.create({
        data: {
          userId: user.id,
          token,
          expiresAt: new Date(Date.now() + 60 * 60_000), // 60 minutes
        },
      })

      const resetUrl = `${SITE}/auth/reset-password?token=${token}`
      const firstName = (user.name || '').split(' ')[0] || undefined

      sendEmail({
        to: user.email,
        subject: 'Reset your Forward Intelligence password',
        html: luxuryEmail({
          preheader: 'Click to reset your Forward password. This link expires in 60 minutes.',
          eyebrow: 'Password reset',
          title: 'Reset your password',
          greetingName: firstName,
          intro: 'We received a request to reset the password for your Forward Intelligence account. If that was you, click the button below within the next 60 minutes.',
          innerHtml: `
            <p style="margin:0 0 12px;font-family:-apple-system,Helvetica,Arial,sans-serif;font-size:13px;color:#717171">
              If you didn&apos;t request this, you can safely ignore this email — your password won&apos;t change unless you click the button and choose a new one.
            </p>
          `,
          cta: { label: 'Reset my password', href: resetUrl },
          footerNote: 'For security, this link expires in 60 minutes and can only be used once.',
        }),
      }).catch((e) => console.error('[forgot-password] send failed:', e))
    }

    // Always 200, regardless of whether the email exists. The success message
    // is "if an account exists, we sent a link" — no oracle.
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (e) {
    console.error('[API] forgot-password error:', e)
    // Still 200 — don't leak server errors through this endpoint either.
    return NextResponse.json({ success: true }, { status: 200 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmailVerification, sendAdminReviewNotification } from '@/lib/services/email'
import { hashPassword } from '@/lib/auth'
import { rateLimit, clientIp, isSameOrigin } from '@/lib/rate-limit'
import { parseBody, registerSchema } from '@/lib/validation'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    if (!isSameOrigin(request)) {
      return NextResponse.json({ error: 'Cross-origin request blocked' }, { status: 403 })
    }
    // Abuse protection: 5 signups / hour per IP.
    const rl = rateLimit(`register:${clientIp(request)}`, 5, 60 * 60_000)
    if (!rl.ok) {
      return NextResponse.json({ error: 'Too many signups. Try again later.' }, {
        status: 429, headers: { 'Retry-After': String(rl.retryAfter) },
      })
    }

    // ========== VALIDATION ==========
    const parsed = await parseBody(request, registerSchema)
    if (!parsed.ok) return parsed.response
    const body = parsed.data

    // ========== CHECK IF EMAIL EXISTS ==========
    const existingUser = await prisma.user.findUnique({
      where: { email: body.email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      )
    }

    // ========== CREATE USER ACCOUNT ==========
    const hashedPassword = await hashPassword(body.password)

    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: hashedPassword,
        name: `${body.firstName} ${body.lastName}`,
        role: 'SELLER',
        company: body.companyName,
        onboardingStatus: 'ACCOUNT_CREATED',
        sellerPlanTier: body.planTier === 'premium' ? 'PREMIUM' : 'FREEMIUM',
      },
    })

    // ========== CREATE EMAIL VERIFICATION TOKEN ==========
    const verificationToken = crypto.randomBytes(32).toString('hex')
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    await prisma.emailVerificationToken.create({
      data: {
        userId: user.id,
        token: verificationToken,
        expiresAt: tokenExpiry,
      },
    })

    // ========== SEND VERIFICATION EMAIL ==========
    await sendEmailVerification(body.email, verificationToken)

    // ========== NOTIFY ADMIN OF NEW ACCOUNT ==========
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@forward.com'
    await sendAdminReviewNotification(
      adminEmail,
      `${body.firstName} ${body.lastName}`,
      body.email,
      user.id
    )

    return NextResponse.json(
      {
        success: true,
        message: 'Account created. Check your email to verify.',
        userId: user.id,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('[API] Registration error:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Registration failed',
      },
      { status: 500 }
    )
  }
}

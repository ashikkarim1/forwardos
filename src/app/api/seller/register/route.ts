import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmailVerification, sendAdminReviewNotification } from '@/lib/services/email'
import crypto from 'crypto'

interface RegisterRequest {
  firstName: string
  lastName: string
  email: string
  companyName: string
  password: string
  planTier?: 'freemium' | 'premium'
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as RegisterRequest

    // ========== VALIDATION ==========
    if (!body.email || !body.password || !body.firstName || !body.lastName || !body.companyName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (body.password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }

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
    // In production, hash password with bcrypt
    const hashedPassword = body.password // TODO: Hash with bcrypt

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

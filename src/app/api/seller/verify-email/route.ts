import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json(
        { error: 'Verification token is required' },
        { status: 400 }
      )
    }

    // ========== FIND AND VALIDATE TOKEN ==========
    const verificationToken = await prisma.emailVerificationToken.findUnique({
      where: { token },
      include: { user: true },
    })

    if (!verificationToken) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 400 }
      )
    }

    if (verificationToken.expiresAt < new Date()) {
      await prisma.emailVerificationToken.delete({
        where: { id: verificationToken.id },
      })
      return NextResponse.json(
        { error: 'Token has expired' },
        { status: 400 }
      )
    }

    // ========== VERIFY EMAIL ==========
    await prisma.user.update({
      where: { id: verificationToken.userId },
      data: {
        emailVerified: true,
        emailVerifiedAt: new Date(),
        onboardingStatus: 'EMAIL_VERIFIED',
      },
    })

    // ========== DELETE TOKEN ==========
    await prisma.emailVerificationToken.delete({
      where: { id: verificationToken.id },
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Email verified successfully',
        userId: verificationToken.userId,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[API] Email verification error:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to verify email',
      },
      { status: 500 }
    )
  }
}

// GET endpoint to verify email via email link
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.redirect(new URL('/seller/onboarding?error=missing_token', request.url))
    }

    // ========== FIND AND VALIDATE TOKEN ==========
    const verificationToken = await prisma.emailVerificationToken.findUnique({
      where: { token },
      include: { user: true },
    })

    if (!verificationToken) {
      return NextResponse.redirect(new URL('/seller/onboarding?error=invalid_token', request.url))
    }

    if (verificationToken.expiresAt < new Date()) {
      await prisma.emailVerificationToken.delete({
        where: { id: verificationToken.id },
      })
      return NextResponse.redirect(new URL('/seller/onboarding?error=expired_token', request.url))
    }

    // ========== VERIFY EMAIL ==========
    await prisma.user.update({
      where: { id: verificationToken.userId },
      data: {
        emailVerified: true,
        emailVerifiedAt: new Date(),
        onboardingStatus: 'EMAIL_VERIFIED',
      },
    })

    // ========== DELETE TOKEN ==========
    await prisma.emailVerificationToken.delete({
      where: { id: verificationToken.id },
    })

    // Redirect to success page
    return NextResponse.redirect(new URL('/seller/onboarding/pending?verified=true', request.url))
  } catch (error) {
    console.error('[API] Email verification error:', error)
    return NextResponse.redirect(new URL('/seller/onboarding?error=verification_failed', request.url))
  }
}

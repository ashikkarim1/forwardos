import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // ========== FETCH USER ==========
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        onboardingStatus: true,
        listingApprovalStatus: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        userId: user.id,
        email: user.email,
        name: user.name,
        onboardingStatus: user.onboardingStatus,
        approved: user.onboardingStatus === 'APPROVED',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[API] Status check error:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Status check failed',
      },
      { status: 500 }
    )
  }
}

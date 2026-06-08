import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getSession } from '@/lib/auth'

const prisma = new PrismaClient()

// GET: Get current user's KYC status and progress
export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        kycStatus: true,
        kycData: true,
        kycStartedAt: true,
        kycCompletedAt: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Parse KYC data if it exists
    let kycData = {}
    if (user.kycData) {
      try {
        kycData = JSON.parse(user.kycData)
      } catch (e) {
        // If parsing fails, return empty object
      }
    }

    return NextResponse.json({
      user: {
        ...user,
        kycData,
      },
    })
  } catch (error) {
    console.error('Fetch KYC status error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST: Initiate KYC verification process
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { documentType, companyName, registrationNumber, taxId } = await request.json()

    // Update user KYC status to PENDING
    const user = await prisma.user.update({
      where: { id: session.userId },
      data: {
        kycStatus: 'PENDING',
        kycStartedAt: new Date(),
        kycData: JSON.stringify({
          documentType,
          companyName,
          registrationNumber,
          taxId,
          submittedAt: new Date().toISOString(),
        }),
      },
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: session.userId,
        action: 'KYC_INITIATED',
        details: `KYC verification started for ${companyName || 'N/A'}`,
        timestamp: new Date(),
      },
    })

    return NextResponse.json({
      user: {
        id: user.id,
        kycStatus: user.kycStatus,
        message: 'KYC verification process initiated. Please wait for verification.',
      },
    })
  } catch (error) {
    console.error('Initiate KYC error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

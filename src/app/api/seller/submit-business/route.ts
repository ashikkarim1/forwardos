import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createDataRoom } from '@/lib/services/dataroom'

interface SubmitBusinessRequest {
  userId: string
  businessDescription: string
  foundingYear: number
  teamSize: number
  topCustomers: string
  industry: string
  location: string
  financialsSummary: string
  photos: Array<{ url: string; name: string; isFeatured: boolean }>
  documents: Array<{ url: string; name: string }>
  completenessScore: number
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as SubmitBusinessRequest

    // ========== VALIDATION ==========
    if (!body.userId || !body.businessDescription || !body.industry || !body.location) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // ========== FETCH USER & VERIFY APPROVAL ==========
    const user = await prisma.user.findUnique({
      where: { id: body.userId },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    if (user.onboardingStatus !== 'APPROVED') {
      return NextResponse.json(
        { error: 'Account must be approved before submitting business info' },
        { status: 403 }
      )
    }

    // ========== CHECK IF LISTING EXISTS ==========
    let deal = await prisma.deal.findFirst({
      where: { sellerId: body.userId },
    })

    // ========== CREATE OR UPDATE DEAL ==========
    if (!deal) {
      deal = await prisma.deal.create({
        data: {
          title: `${user.company || user.name}'s Business`,
          description: body.businessDescription,
          sellerId: body.userId,
          industry: body.industry as any,
          country: body.location.split(',')[0].trim(),
          city: body.location,
          status: 'ACTIVE',
          publishedAt: new Date(),
          yearsInOperation: new Date().getFullYear() - body.foundingYear,
          foundedYear: body.foundingYear,
          employees: body.teamSize,
          customerConcentration: body.topCustomers,
        },
      })
    } else {
      deal = await prisma.deal.update({
        where: { id: deal.id },
        data: {
          description: body.businessDescription,
          industry: body.industry as any,
          country: body.location.split(',')[0].trim(),
          city: body.location,
          status: 'ACTIVE',
          publishedAt: new Date(),
          yearsInOperation: new Date().getFullYear() - body.foundingYear,
          foundedYear: body.foundingYear,
          employees: body.teamSize,
          customerConcentration: body.topCustomers,
        },
      })
    }

    // ========== UPLOAD PHOTOS ==========
    if (body.photos && body.photos.length > 0) {
      // Delete existing photos first
      await prisma.businessPhoto.deleteMany({
        where: { sellerId: body.userId },
      })

      for (let i = 0; i < body.photos.length; i++) {
        const photo = body.photos[i]
        await prisma.businessPhoto.create({
          data: {
            sellerId: body.userId,
            photoUrl: photo.url,
            photoName: photo.name,
            isFeatured: photo.isFeatured,
            displayOrder: i,
          },
        })
      }
    }

    // ========== UPLOAD DOCUMENTS ==========
    if (body.documents && body.documents.length > 0) {
      // Delete existing documents first
      await prisma.dealDocument.deleteMany({
        where: { dealId: deal.id },
      })

      for (const doc of body.documents) {
        await prisma.dealDocument.create({
          data: {
            dealId: deal.id,
            title: doc.name,
            documentUrl: doc.url,
            documentType: 'other',
            fileSize: BigInt(1000000), // Placeholder
          },
        })
      }
    }

    // ========== CREATE DATA ROOM IF NOT EXISTS ==========
    const existingDataRoom = await prisma.dataRoom.findUnique({
      where: { dealId: deal.id },
    })

    if (!existingDataRoom) {
      await createDataRoom({
        dealId: deal.id,
        sellerId: body.userId,
        title: `${user.company || user.name} Data Room`,
        description: 'Secure data room for buyer access',
        accessLevel: body.completenessScore >= 80 ? 'FULL_DATA_ROOM' : 'INITIAL_INFO',
      })
    }

    // ========== UPDATE DEAL QUALITY SCORE ==========
    await prisma.deal.update({
      where: { id: deal.id },
      data: {
        dealQualityScore: body.completenessScore,
        heatScore: Math.floor(body.completenessScore * 0.8), // Quality score influences heat
      },
    })

    // ========== UPDATE USER ONBOARDING STATUS ==========
    await prisma.user.update({
      where: { id: body.userId },
      data: {
        onboardingStatus: 'APPROVED',
        listingApprovalStatus: 'ACTIVE',
      },
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Business information submitted successfully',
        dealId: deal.id,
        completenessScore: body.completenessScore,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('[API] Submit business error:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to submit business information',
      },
      { status: 500 }
    )
  }
}

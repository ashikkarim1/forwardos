import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmail, sendEmailVerification, sendAdminReviewNotification } from '@/lib/services/email'
import { uploadFile } from '@/lib/services/storage'
import crypto from 'crypto'

interface OnboardingSubmission {
  email: string
  password: string
  firstName: string
  lastName: string
  companyName: string
  phone?: string
  businessDescription: string
  foundingYear: number
  teamSize: number
  topCustomers?: string
  industry: string
  location: string
  financialsSummary?: string
  planTier: 'freemium' | 'premium'
  photos: Array<{ name: string; data: string }> // base64
  documents: Array<{ name: string; data: string }> // base64
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as OnboardingSubmission

    // ========== VALIDATION ==========
    if (!body.email || !body.password || !body.firstName || !body.lastName || !body.companyName) {
      return NextResponse.json(
        { error: 'Missing required account fields' },
        { status: 400 }
      )
    }

    if (!body.businessDescription || !body.industry || !body.location) {
      return NextResponse.json(
        { error: 'Missing required business information' },
        { status: 400 }
      )
    }

    if (!body.photos || body.photos.length === 0) {
      return NextResponse.json(
        { error: 'At least one photo is required' },
        { status: 400 }
      )
    }

    if (!body.documents || body.documents.length === 0) {
      return NextResponse.json(
        { error: 'At least one document is required' },
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
        phone: body.phone,
        company: body.companyName,
        onboardingStatus: 'ACCOUNT_CREATED',
        sellerPlanTier: body.planTier === 'premium' ? 'PREMIUM' : 'FREEMIUM',
        listingApprovalStatus: 'PENDING_VERIFICATION',
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

    // ========== CREATE DEAL/LISTING ==========
    const deal = await prisma.deal.create({
      data: {
        title: body.companyName,
        description: body.businessDescription,
        sellerId: user.id,
        industry: body.industry as any, // Will be SAAS, HEALTHCARE, etc.
        country: body.location.split(',')[0].trim(),
        status: 'DRAFT',
        yearsInOperation: new Date().getFullYear() - body.foundingYear,
        foundedYear: body.foundingYear,
        employees: body.teamSize,
        businessModel: 'B2B', // Default, can be updated later
        customerConcentration: body.topCustomers || 'Not specified',
        reasonForSale: 'Strategic exit',
      },
    })

    // ========== UPLOAD PHOTOS ==========
    try {
      for (let i = 0; i < body.photos.length; i++) {
        const photo = body.photos[i]
        // In production, convert base64 to File and upload to S3
        // For now, we'll store the mock URL
        const photoUrl = `/uploads/photos/${Date.now()}-${photo.name}`

        await prisma.businessPhoto.create({
          data: {
            sellerId: user.id,
            photoUrl,
            photoName: photo.name,
            isFeatured: i === 0, // First photo is featured by default
            displayOrder: i,
          },
        })
      }
    } catch (error) {
      console.error('Failed to create photos:', error)
      // Continue - photos upload failure shouldn't block submission
    }

    // ========== UPLOAD DOCUMENTS ==========
    try {
      for (const doc of body.documents) {
        // In production, convert base64 to File and upload to S3
        const docUrl = `/uploads/documents/${Date.now()}-${doc.name}`

        await prisma.dealDocument.create({
          data: {
            dealId: deal.id,
            title: doc.name,
            documentUrl: docUrl,
            documentType: getDocumentType(doc.name),
            fileSize: BigInt(doc.data.length), // Approximate
          },
        })
      }
    } catch (error) {
      console.error('Failed to create documents:', error)
      // Continue - document upload failure shouldn't block submission
    }

    // ========== UPDATE USER ONBOARDING STATUS ==========
    await prisma.user.update({
      where: { id: user.id },
      data: {
        onboardingStatus: 'PENDING_APPROVAL',
      },
    })

    // ========== SEND VERIFICATION EMAIL ==========
    await sendEmailVerification(body.email, verificationToken)

    // ========== NOTIFY ADMIN ==========
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@forward.com'
    await sendAdminReviewNotification(adminEmail, `${body.firstName} ${body.lastName}`, body.email, deal.id)

    // ========== RETURN RESPONSE ==========
    return NextResponse.json(
      {
        success: true,
        message: 'Submission received. Check your email to verify your account.',
        userId: user.id,
        dealId: deal.id,
        planTier: body.planTier,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('[API] Seller onboarding error:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to process submission',
      },
      { status: 500 }
    )
  }
}

function getDocumentType(filename: string): string {
  const lower = filename.toLowerCase()
  if (lower.includes('tax')) return 'tax_certificate'
  if (lower.includes('statement')) return 'bank_statement'
  if (lower.includes('license')) return 'business_license'
  if (lower.includes('certificate')) return 'corporate_cert'
  return 'other'
}

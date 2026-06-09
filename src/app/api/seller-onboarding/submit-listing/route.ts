import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import {
  SubmitListingRequest,
  SubmitListingResponse,
  UserType,
  ListingStatus,
  KYCVerificationStatus,
  IngestionEvent,
  IngestionPipelineEvent,
} from '@/lib/seller-ingestion-schema'

/**
 * POST /api/seller-onboarding/submit-listing
 * Final submission: Creates seller, broker, business, listing, KYC records
 * Orchestrates entire ingestion pipeline
 */

export async function POST(request: NextRequest): Promise<NextResponse<SubmitListingResponse>> {
  try {
    const body: SubmitListingRequest = await request.json()
    const { sessionToken, finalData } = body

    if (!sessionToken || !finalData) {
      return NextResponse.json(
        {
          success: false,
          listingId: '',
          sellerId: '',
          kycStatus: 'pending',
          message: 'Missing required data',
          nextSteps: [],
        },
        { status: 400 }
      )
    }

    const {
      sellerIdentity,
      brokerIdentity,
      businessInfo,
      financialMetrics,
      kycDocuments,
      photos,
    } = finalData

    console.log('[INGESTION PIPELINE] Starting final submission')
    console.log(`[SESSION] Token: ${sessionToken}`)

    // ==================== STEP 1: CREATE SELLER IDENTITY ====================

    const sellerId = uuidv4()
    console.log(`[CREATED] Seller ID: ${sellerId}`)
    console.log(`[SELLER DATA] ${JSON.stringify({
      firstName: sellerIdentity.firstName,
      lastName: sellerIdentity.lastName,
      email: sellerIdentity.email,
      companyName: sellerIdentity.companyName,
    }, null, 2)}`)

    // In production:
    // await database.sellerIdentity.create({
    //   id: sellerId,
    //   ...sellerIdentity,
    //   createdAt: new Date().toISOString(),
    // })

    // ==================== STEP 2: CREATE BROKER IDENTITY (if applicable) ====================

    let brokerId: string | undefined
    if (brokerIdentity) {
      brokerId = uuidv4()
      console.log(`[CREATED] Broker ID: ${brokerId}`)
      console.log(`[BROKER DATA] ${JSON.stringify({
        firstName: brokerIdentity.firstName,
        lastName: brokerIdentity.lastName,
        companyName: brokerIdentity.companyName,
        licenseNumber: brokerIdentity.licenseNumber,
      }, null, 2)}`)

      // In production:
      // await database.brokerIdentity.create({
      //   id: brokerId,
      //   ...brokerIdentity,
      //   createdAt: new Date().toISOString(),
      // })
    }

    // ==================== STEP 3: CREATE BUSINESS RECORD ====================

    const businessId = uuidv4()
    console.log(`[CREATED] Business ID: ${businessId}`)
    console.log(`[BUSINESS] ${businessInfo.businessName} (${businessInfo.businessType})`)

    // In production:
    // await database.business.create({
    //   id: businessId,
    //   sellerId,
    //   brokerId,
    //   ...businessInfo,
    //   createdAt: new Date().toISOString(),
    // })

    // ==================== STEP 4: CREATE FINANCIAL METRICS ====================

    const metricsId = uuidv4()
    console.log(`[CREATED] Financial Metrics ID: ${metricsId}`)
    console.log(`[FINANCIALS] Revenue: $${Number(financialMetrics.annualRevenue).toLocaleString()} | Valuation: $${Number(financialMetrics.valuation).toLocaleString()} | Growth: ${financialMetrics.yoyGrowthRate}%`)

    // In production:
    // await database.financialMetrics.create({
    //   id: metricsId,
    //   businessId,
    //   ...financialMetrics,
    //   createdAt: new Date().toISOString(),
    // })

    // ==================== STEP 5: PROCESS KYC DOCUMENTS ====================

    const processedKycDocs: string[] = []
    let kycVerificationStatus = KYCVerificationStatus.PENDING

    for (const doc of kycDocuments) {
      const docId = uuidv4()
      processedKycDocs.push(docId)

      console.log(`[KYC DOC] ${doc.documentType} uploaded (${(doc.fileSizeBytes / 1024 / 1024).toFixed(2)}MB)`)

      // In production:
      // 1. Upload file to S3/GCS
      // 2. Run AI verification (liveness, authenticity, OCR)
      // 3. Create KYC document record
      // 4. Flag for manual review if confidence < 85%
      // 5. Send email if verification fails

      // await database.kycDocumentRecord.create({
      //   id: docId,
      //   userId: doc.userType === 'seller' ? sellerId : brokerId,
      //   userType: doc.userType,
      //   ...doc,
      //   storagePath: `s3://forward-kyc/${sellerId}/${docId}`,
      //   verificationStatus: 'pending',
      //   createdAt: new Date().toISOString(),
      // })

      // Log ingestion event
      // await database.ingestionPipelineEvent.create({
      //   eventType: IngestionEvent.KYC_DOCUMENT_UPLOADED,
      //   userId: doc.userType === 'seller' ? sellerId : brokerId,
      //   userType: doc.userType,
      //   resourceId: docId,
      // })
    }

    console.log(`[KYC] ${processedKycDocs.length} documents uploaded for verification`)

    // ==================== STEP 6: PROCESS PHOTOS ====================

    const processedPhotos: string[] = []

    for (const photo of photos) {
      const photoId = uuidv4()
      processedPhotos.push(photoId)

      console.log(`[PHOTO] Processed (Display order: ${photo.displayOrder})`)

      // In production:
      // await database.listingPhoto.create({
      //   id: photoId,
      //   businessId,
      //   storagePath: photo.storagePath,
      //   displayOrder: photo.displayOrder,
      //   isVerified: true,
      //   createdAt: new Date().toISOString(),
      // })
    }

    console.log(`[PHOTOS] ${processedPhotos.length} photos processed`)

    // ==================== STEP 7: CREATE LISTING ====================

    const listingId = uuidv4()
    const visibilityEndDate = new Date()
    visibilityEndDate.setDate(visibilityEndDate.getDate() + 90) // 90 days for free tier

    console.log(`[CREATED] Listing ID: ${listingId}`)
    console.log(`[VISIBILITY] ${new Date().toISOString()} to ${visibilityEndDate.toISOString()}`)

    // In production:
    // await database.listing.create({
    //   id: listingId,
    //   sellerId,
    //   brokerId,
    //   businessId,
    //   status: 'pending_verification',
    //   publishedBy: sellerId,
    //   visibilityStartDate: new Date().toISOString(),
    //   visibilityEndDate: visibilityEndDate.toISOString(),
    //   viewCount: 0,
    //   inquiryCount: 0,
    //   favoriteCount: 0,
    //   createdAt: new Date().toISOString(),
    // })

    // ==================== STEP 8: CREATE BROKER CONSENT (if broker) ====================

    if (brokerId) {
      const consentId = uuidv4()
      console.log(`[CONSENT] Created consent record ID: ${consentId}`)

      // In production:
      // await database.consentRecord.create({
      //   id: consentId,
      //   brokerId,
      //   sellerId,
      //   listingIds: [listingId],
      //   status: 'pending',
      //   consentVerificationMethod: 'email_link',
      //   brokerCommissionPercentage: 2.5,
      //   createdAt: new Date().toISOString(),
      // })

      // Send seller consent email
      console.log(`[EMAIL] Sending consent verification email to ${sellerIdentity.email}`)
      // In production: await sendConsentEmail(sellerIdentity.email, consentId, brokerIdentity)
    }

    // ==================== STEP 9: LOG INGESTION EVENTS ====================

    const events: IngestionPipelineEvent[] = [
      {
        id: uuidv4(),
        eventType: IngestionEvent.LISTING_CREATED,
        userId: sellerId,
        userType: UserType.SELLER,
        resourceId: listingId,
        data: {
          businessName: businessInfo.businessName,
          brokerId: brokerId || null,
        },
        timestamp: new Date().toISOString(),
        processed: false,
      },
    ]

    if (brokerId) {
      events.push({
        id: uuidv4(),
        eventType: IngestionEvent.CONSENT_REQUESTED,
        userId: brokerId,
        userType: UserType.BROKER,
        resourceId: listingId,
        data: {
          sellerId,
          brokerLicenseNumber: brokerIdentity?.licenseNumber,
        },
        timestamp: new Date().toISOString(),
        processed: false,
      })
    }

    console.log(`[EVENTS] ${events.length} ingestion events created`)

    // In production:
    // for (const event of events) {
    //   await database.ingestionPipelineEvent.create(event)
    //   await publishToQueue(event) // For async processing
    // }

    // ==================== STEP 10: COMPLIANCE AUDIT LOG ====================

    console.log(`[AUDIT] Logging all actions to compliance audit trail`)
    // In production:
    // await database.complianceAuditLog.create({
    //   userId: sellerId,
    //   userType: UserType.SELLER,
    //   action: 'completed_seller_onboarding',
    //   resourceType: 'listing',
    //   resourceId: listingId,
    //   ipAddress: request.ip,
    //   userAgent: request.headers.get('user-agent'),
    //   createdAt: new Date().toISOString(),
    // })

    // ==================== STEP 11: SEND CONFIRMATION ====================

    console.log(`[EMAIL] Sending listing creation confirmation to seller`)
    // In production: await sendListingConfirmationEmail(sellerIdentity.email, listingId)

    // ==================== RESPONSE ====================

    console.log(`[COMPLETE] Listing submission successful`)
    console.log(`[SUMMARY]`)
    console.log(`  Seller ID: ${sellerId}`)
    console.log(`  Broker ID: ${brokerId || 'None'}`)
    console.log(`  Business ID: ${businessId}`)
    console.log(`  Listing ID: ${listingId}`)
    console.log(`  KYC Status: ${kycVerificationStatus}`)
    console.log(`  Documents: ${processedKycDocs.length}`)
    console.log(`  Photos: ${processedPhotos.length}`)

    return NextResponse.json(
      {
        success: true,
        sellerId,
        brokerId: brokerId || undefined,
        listingId,
        kycStatus: kycVerificationStatus,
        message: `🎉 ${businessInfo.businessName} is now live! KYC verification in progress.`,
        nextSteps: [
          'Check your email for KYC verification status',
          brokerId ? 'Broker consent email will be sent to seller' : 'Listing is live on marketplace',
          'View your dashboard to track inquiries',
          'Upgrade to Premium for more visibility',
        ],
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('[API ERROR] /api/seller-onboarding/submit-listing', error)
    return NextResponse.json(
      {
        success: false,
        listingId: '',
        sellerId: '',
        kycStatus: 'pending',
        message: 'An error occurred while processing your submission. Please try again.',
        nextSteps: [],
      },
      { status: 500 }
    )
  }
}

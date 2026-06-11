import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendApprovalNotification, sendPremiumPaymentLink, sendEmail } from '@/lib/services/email'
import { requireRole } from '@/lib/auth'

interface ApprovalRequest {
  action: 'approve' | 'reject' | 'request_changes'
  notes: string
  planTier?: 'freemium' | 'premium'
}

export async function POST(request: NextRequest, { params }: { params: { dealId: string } }) {
  try {
    // Admin-only: reject anyone without an ADMIN session.
    if (!(await requireRole(['ADMIN']))) {
      return NextResponse.json({ error: 'Forbidden — admin access required' }, { status: 403 })
    }

    const body = await request.json() as ApprovalRequest
    const { dealId } = params

    // ========== FETCH DEAL & SELLER ==========
    const deal = await prisma.deal.findUnique({
      where: { id: dealId },
      include: { seller: true },
    })

    if (!deal || !deal.seller) {
      return NextResponse.json(
        { error: 'Deal or seller not found' },
        { status: 404 }
      )
    }

    // ========== PROCESS ACTION ==========
    if (body.action === 'approve') {
      // ========== APPROVE SUBMISSION ==========
      await prisma.deal.update({
        where: { id: dealId },
        data: {
          status: 'PUBLISHED',
          publishedAt: new Date(),
        },
      })

      await prisma.user.update({
        where: { id: deal.sellerId },
        data: {
          listingApprovalStatus: 'APPROVED',
          listingApprovedAt: new Date(),
          approvalNotes: body.notes,
          onboardingStatus: 'APPROVED',
        },
      })

      // If Freemium, list goes active immediately
      // If Premium, send Stripe payment link
      if (deal.seller.sellerPlanTier === 'PREMIUM') {
        // TODO: Generate Stripe checkout session
        const stripCheckoutUrl = `${process.env.APP_URL}/checkout?dealId=${dealId}&planTier=premium`
        await sendPremiumPaymentLink(deal.seller.email, deal.seller.name, stripCheckoutUrl)
      } else {
        // Activate listing for Freemium
        await prisma.deal.update({
          where: { id: dealId },
          data: { status: 'ACTIVE' },
        })
        await sendApprovalNotification(deal.seller.email, deal.seller.name, deal.title)
      }

      return NextResponse.json(
        {
          success: true,
          message: deal.seller.sellerPlanTier === 'PREMIUM' ? 'Seller approved. Payment link sent.' : 'Listing approved and activated.',
        },
        { status: 200 }
      )
    }

    if (body.action === 'reject') {
      // ========== REJECT SUBMISSION ==========
      await prisma.deal.update({
        where: { id: dealId },
        data: { status: 'WITHDRAWN' },
      })

      await prisma.user.update({
        where: { id: deal.sellerId },
        data: {
          listingApprovalStatus: 'REJECTED',
          approvalNotes: body.notes,
        },
      })

      // Send rejection email
      await sendEmail({
        to: deal.seller.email,
        subject: 'Your Forward Listing Submission - Rejection',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .alert { background-color: #FEE2E2; color: #7F1D1D; padding: 16px; border-left: 4px solid #EF4444; border-radius: 4px; margin: 20px 0; }
              </style>
            </head>
            <body>
              <div class="container">
                <h2>Submission Review - Rejection</h2>
                <p>Hi ${deal.seller.name},</p>
                <div class="alert">
                  <strong>Your listing submission has been reviewed and rejected.</strong>
                </div>
                <h3>Reason for Rejection:</h3>
                <p>${body.notes}</p>
                <p>You can submit a new listing with corrections at any time.</p>
                <p>If you have questions, please contact our support team.</p>
              </div>
            </body>
          </html>
        `,
      })

      return NextResponse.json(
        {
          success: true,
          message: 'Submission rejected. Notification sent to seller.',
        },
        { status: 200 }
      )
    }

    if (body.action === 'request_changes') {
      // ========== REQUEST CHANGES ==========
      await prisma.user.update({
        where: { id: deal.sellerId },
        data: {
          approvalNotes: body.notes,
        },
      })

      // Send request changes email
      await sendEmail({
        to: deal.seller.email,
        subject: 'Your Forward Listing - Changes Requested',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .info { background-color: #FEF3C7; color: #92400E; padding: 16px; border-left: 4px solid #F59E0B; border-radius: 4px; margin: 20px 0; }
              </style>
            </head>
            <body>
              <div class="container">
                <h2>Submission Review - Changes Requested</h2>
                <p>Hi ${deal.seller.name},</p>
                <div class="info">
                  <strong>Your listing submission is under review. We need some additional information or corrections:</strong>
                </div>
                <h3>Changes Needed:</h3>
                <p>${body.notes}</p>
                <p>Please log in to your dashboard to make these changes.</p>
                <p>Once updated, your listing will move to approval.</p>
              </div>
            </body>
          </html>
        `,
      })

      return NextResponse.json(
        {
          success: true,
          message: 'Change request sent to seller.',
        },
        { status: 200 }
      )
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error) {
    console.error('[API] Admin approval error:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to process approval',
      },
      { status: 500 }
    )
  }
}

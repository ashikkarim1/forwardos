import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/services/email'

interface AccountApprovalRequest {
  action: 'approve' | 'reject'
  notes: string
}

export async function POST(request: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const body = await request.json() as AccountApprovalRequest
    const { userId } = params

    // ========== FETCH USER ==========
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    if (body.action === 'approve') {
      // ========== APPROVE ACCOUNT ==========
      await prisma.user.update({
        where: { id: userId },
        data: {
          onboardingStatus: 'APPROVED',
        },
      })

      // ========== SEND APPROVAL EMAIL ==========
      await sendEmail({
        to: user.email,
        subject: '✅ Your Forward Account is Approved!',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .success { background-color: #D1FAE5; color: #065F46; padding: 16px; border-left: 4px solid #10B981; border-radius: 4px; margin: 20px 0; }
                .button { background-color: #FF6B35; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; }
              </style>
            </head>
            <body>
              <div class="container">
                <h2>✅ Your Account is Approved!</h2>
                <p>Hi ${user.name},</p>
                <div class="success">
                  <strong>Great news!</strong> Your Forward seller account has been verified and approved. Now you can submit your business details to get listed on the marketplace!
                </div>
                <h3>Next Steps:</h3>
                <ol>
                  <li>Log in to your seller account</li>
                  <li>Click "Submit Business Details"</li>
                  <li>Complete your business information (the more detailed, the more buyers will see you)</li>
                  <li>Upload photos and financial documents</li>
                  <li>Your listing goes live immediately!</li>
                </ol>
                <p><a href="${process.env.APP_URL}/dashboard/seller" class="button">Go to Dashboard</a></p>
                <p>Questions? Email us at support@forward.com</p>
              </div>
            </body>
          </html>
        `,
      })

      return NextResponse.json(
        {
          success: true,
          message: 'Account approved and notification sent',
        },
        { status: 200 }
      )
    }

    if (body.action === 'reject') {
      // ========== REJECT ACCOUNT ==========
      await prisma.user.update({
        where: { id: userId },
        data: {
          onboardingStatus: 'NOT_STARTED',
        },
      })

      // ========== SEND REJECTION EMAIL ==========
      await sendEmail({
        to: user.email,
        subject: 'Your Forward Account Application',
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
                <h2>Your Forward Account Application</h2>
                <p>Hi ${user.name},</p>
                <div class="alert">
                  <strong>Your account could not be verified at this time.</strong>
                </div>
                <h3>Reason:</h3>
                <p>${body.notes}</p>
                <p>You can create a new account with updated information at any time.</p>
                <p>If you have questions, please contact support@forward.com</p>
              </div>
            </body>
          </html>
        `,
      })

      return NextResponse.json(
        {
          success: true,
          message: 'Account rejected and notification sent',
        },
        { status: 200 }
      )
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error) {
    console.error('[API] Account approval error:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to process approval',
      },
      { status: 500 }
    )
  }
}

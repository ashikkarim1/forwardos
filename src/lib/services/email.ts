/**
 * Email Service
 * Handles all email communications using Resend
 */

interface EmailOptions {
  to: string
  subject: string
  html: string
  from?: string
}

export async function sendEmail(options: EmailOptions) {
  // In production, this would use Resend API
  // For now, we'll prepare the structure

  const from = options.from || process.env.EMAIL_FROM_ADDRESS || 'noreply@forward.com'

  try {
    // TODO: Integrate with Resend API
    // const response = await fetch('https://api.resend.com/emails', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     from,
    //     to: options.to,
    //     subject: options.subject,
    //     html: options.html,
    //   }),
    // })

    // For development, just log
    console.log('[EMAIL]', {
      to: options.to,
      subject: options.subject,
      from,
    })

    return { success: true }
  } catch (error) {
    console.error('Email send failed:', error)
    throw error
  }
}

export async function sendEmailVerification(email: string, token: string) {
  const verificationUrl = `${process.env.APP_URL || 'http://localhost:3000'}/verify-email?token=${token}`

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .button { background-color: #FF6B35; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; }
          .footer { color: #666; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Verify Your Email Address</h2>
          <p>Welcome to Forward! Click the button below to verify your email address and complete your account setup.</p>
          <p><a href="${verificationUrl}" class="button">Verify Email Address</a></p>
          <p>Or copy and paste this link in your browser:<br/>${verificationUrl}</p>
          <p>This link expires in 24 hours.</p>
          <div class="footer">
            <p>If you didn't create this account, please ignore this email.</p>
            <p>© 2026 Forward OS. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `

  return sendEmail({
    to: email,
    subject: 'Verify Your Forward Account Email',
    html,
  })
}

export async function sendApprovalNotification(email: string, sellerName: string, listingTitle: string) {
  const dashboardUrl = `${process.env.APP_URL || 'http://localhost:3000'}/dashboard/seller`

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .success { background-color: #D1FAE5; color: #065F46; padding: 16px; border-left: 4px solid #10B981; border-radius: 4px; margin: 20px 0; }
          .button { background-color: #FF6B35; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>🎉 Your Listing is Live!</h2>
          <p>Hi ${sellerName},</p>
          <div class="success">
            <strong>Great news!</strong> Your listing "<strong>${listingTitle}</strong>" has been approved and is now live on the Forward marketplace!
          </div>
          <p>Buyers can now see your business profile, and you can start receiving inquiries.</p>
          <p><a href="${dashboardUrl}" class="button">View Your Dashboard</a></p>
          <h3>Next Steps:</h3>
          <ul>
            <li>Complete your seller profile for maximum visibility</li>
            <li>Monitor buyer inquiries in your dashboard</li>
            <li>Share your listing with your network</li>
            <li>Keep your information updated</li>
          </ul>
          <p>Questions? Reply to this email or contact our support team.</p>
          <div style="color: #666; font-size: 12px; margin-top: 30px; border-top: 1px solid #ccc; padding-top: 20px;">
            <p>© 2026 Forward OS. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `

  return sendEmail({
    to: email,
    subject: `🎉 Your listing "${listingTitle}" is now live!`,
    html,
  })
}

export async function sendPremiumPaymentLink(email: string, sellerName: string, checkoutUrl: string) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .button { background-color: #F59E0B; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; }
          .info { background-color: #FEF3C7; padding: 16px; border-left: 4px solid #F59E0B; border-radius: 4px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Complete Your Premium Setup</h2>
          <p>Hi ${sellerName},</p>
          <p>Your listing has been verified and approved! Now it's time to activate your <strong>Premium Plan</strong> to unlock featured placement and advanced features.</p>
          <div class="info">
            <h3 style="margin-top: 0;">Premium Features:</h3>
            <ul>
              <li>🔍 Featured on marketplace homepage</li>
              <li>📊 Full analytics dashboard</li>
              <li>🔐 Secure data room for buyers</li>
              <li>💬 Priority support</li>
              <li>⭐ Premium seller badge</li>
            </ul>
            <p style="margin-bottom: 0;"><strong>Only $99/month</strong> (cancel anytime)</p>
          </div>
          <p><a href="${checkoutUrl}" class="button">Complete Payment</a></p>
          <p>Your listing will remain active during checkout. Premium features activate immediately after payment.</p>
          <p>Questions? We're here to help!</p>
          <div style="color: #666; font-size: 12px; margin-top: 30px; border-top: 1px solid #ccc; padding-top: 20px;">
            <p>© 2026 Forward OS. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `

  return sendEmail({
    to: email,
    subject: '✨ Activate Your Premium Plan',
    html,
  })
}

export async function sendAdminReviewNotification(adminEmail: string, sellerName: string, sellerEmail: string, dealId: string) {
  const reviewUrl = `${process.env.APP_URL || 'http://localhost:3000'}/admin/approvals/${dealId}`

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .button { background-color: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>New Seller Submission Pending Review</h2>
          <p>A new seller has submitted their business information and is awaiting approval.</p>
          <p>
            <strong>Seller:</strong> ${sellerName}<br/>
            <strong>Email:</strong> ${sellerEmail}<br/>
            <strong>Listing ID:</strong> ${dealId}
          </p>
          <p><a href="${reviewUrl}" class="button">Review Submission</a></p>
          <p>Please review the submitted information and either approve or request revisions.</p>
        </div>
      </body>
    </html>
  `

  return sendEmail({
    to: adminEmail,
    subject: `[ADMIN] New Seller Submission: ${sellerName}`,
    html,
  })
}

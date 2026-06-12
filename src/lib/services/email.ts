/**
 * Email Service — delivers via Resend when RESEND_API_KEY is set, otherwise logs
 * to the console (so flows keep working in dev/preview without a key).
 */
import { Resend } from 'resend'

interface EmailOptions {
  to: string
  subject: string
  html: string
  from?: string
}

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null
const DEFAULT_FROM = process.env.EMAIL_FROM_ADDRESS || 'Forward Intelligence <noreply@forwardos.ai>'

export async function sendEmail(options: EmailOptions) {
  const from = options.from || DEFAULT_FROM

  // No key configured → log instead of sending (never throws, so callers don't break).
  if (!resend) {
    console.log('[EMAIL:mock]', { to: options.to, subject: options.subject, from })
    return { success: true, mocked: true as const }
  }

  try {
    const { data, error } = await resend.emails.send({
      from,
      to: options.to,
      subject: options.subject,
      html: options.html,
      ...(process.env.EMAIL_REPLY_TO ? { replyTo: process.env.EMAIL_REPLY_TO } : {}),
    })
    if (error) {
      console.error('[EMAIL] Resend error:', error)
      return { success: false as const, error }
    }
    return { success: true as const, id: data?.id }
  } catch (error) {
    console.error('[EMAIL] send failed:', error)
    return { success: false as const, error }
  }
}

export async function sendEmailVerification(email: string, token: string) {
  const verificationUrl = `${process.env.NEXT_PUBLIC_SITE_URL || process.env.APP_URL || 'http://localhost:3000'}/verify-email?token=${token}`

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .button { background-color: #B8956A; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; }
          .footer { color: #666; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Verify Your Email Address</h2>
          <p>Welcome to Forward Intelligence! Click the button below to verify your email address and complete your account setup.</p>
          <p><a href="${verificationUrl}" style="background-color:#B8956A;color:#ffffff !important;padding:12px 24px;text-decoration:none;border-radius:8px;display:inline-block;font-weight:bold;"><span style="color:#ffffff;">Verify Email Address</span></a></p>
          <p>Or copy and paste this link in your browser:<br/>${verificationUrl}</p>
          <p>This link expires in 24 hours.</p>
          <div class="footer">
            <p>If you didn't create this account, please ignore this email.</p>
            <p>© 2026 Forward Intelligence. All rights reserved.</p>
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
  const dashboardUrl = `${process.env.NEXT_PUBLIC_SITE_URL || process.env.APP_URL || 'http://localhost:3000'}/dashboard/seller`

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .success { background-color: #D1FAE5; color: #065F46; padding: 16px; border-left: 4px solid #10B981; border-radius: 4px; margin: 20px 0; }
          .button { background-color: #B8956A; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 10px 0; }
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
          <p><a href="${dashboardUrl}" style="background-color:#B8956A;color:#ffffff !important;padding:12px 24px;text-decoration:none;border-radius:8px;display:inline-block;font-weight:bold;"><span style="color:#ffffff;">View Your Dashboard</span></a></p>
          <h3>Next Steps:</h3>
          <ul>
            <li>Complete your seller profile for maximum visibility</li>
            <li>Monitor buyer inquiries in your dashboard</li>
            <li>Share your listing with your network</li>
            <li>Keep your information updated</li>
          </ul>
          <p>Questions? Reply to this email or contact our support team.</p>
          <div style="color: #666; font-size: 12px; margin-top: 30px; border-top: 1px solid #ccc; padding-top: 20px;">
            <p>© 2026 Forward Intelligence. All rights reserved.</p>
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
            <p style="margin-bottom: 0;"><strong>Only $39/month</strong> (cancel anytime)</p>
          </div>
          <p><a href="${checkoutUrl}" style="background-color:#B8956A;color:#ffffff !important;padding:12px 24px;text-decoration:none;border-radius:8px;display:inline-block;font-weight:bold;"><span style="color:#ffffff;">Complete Payment</span></a></p>
          <p>Your listing will remain active during checkout. Premium features activate immediately after payment.</p>
          <p>Questions? We're here to help!</p>
          <div style="color: #666; font-size: 12px; margin-top: 30px; border-top: 1px solid #ccc; padding-top: 20px;">
            <p>© 2026 Forward Intelligence. All rights reserved.</p>
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
  const reviewUrl = `${process.env.NEXT_PUBLIC_SITE_URL || process.env.APP_URL || 'http://localhost:3000'}/admin/approvals/${dealId}`

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .button { background-color: #B8956A; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; }
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
          <p><a href="${reviewUrl}" style="background-color:#B8956A;color:#ffffff !important;padding:12px 24px;text-decoration:none;border-radius:8px;display:inline-block;font-weight:bold;"><span style="color:#ffffff;">Review Submission</span></a></p>
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

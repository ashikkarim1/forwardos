/**
 * Email Service - Resend Integration
 * Handles all transactional emails for seller onboarding, KYC, and consent
 */

import { Resend } from 'resend'

interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
  replyTo?: string
}

interface EmailResult {
  success: boolean
  messageId?: string
  error?: string
}

class EmailService {
  private resend: Resend
  private fromAddress: string
  private fromName: string

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY)
    this.fromAddress = process.env.EMAIL_FROM_ADDRESS || 'noreply@forward-os.com'
    this.fromName = process.env.EMAIL_FROM_NAME || 'Forward OS'
  }

  /**
   * Send Listing Confirmation Email (Seller)
   */
  async sendListingConfirmation(
    sellerName: string,
    sellerEmail: string,
    businessName: string,
    listingId: string,
    kycStatus: string
  ): Promise<EmailResult> {
    try {
      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto; color: #1A1A1A; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #B8956A, #A3805A); color: white; padding: 30px; border-radius: 8px; text-align: center; }
              .content { margin: 30px 0; line-height: 1.6; }
              .button { display: inline-block; background: #B8956A; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin: 10px 0; }
              .status-box { background: #EAF5F0; border-left: 4px solid #2D7A5F; padding: 15px; margin: 20px 0; }
              .footer { border-top: 1px solid #E5E7EB; padding-top: 20px; font-size: 12px; color: #717171; text-align: center; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🎉 Your Listing is Live!</h1>
              </div>

              <div class="content">
                <p>Hi <strong>${sellerName}</strong>,</p>

                <p>Great news! <strong>${businessName}</strong> has been successfully listed on Forward OS and is now visible to our network of 5,000+ verified buyers.</p>

                <div class="status-box">
                  <p><strong>Listing ID:</strong> ${listingId}</p>
                  <p><strong>KYC Status:</strong> ${this._formatKYCStatus(kycStatus)}</p>
                  <p><strong>Visibility:</strong> 90 days (Free tier)</p>
                </div>

                <h3>What's Next?</h3>
                <ul>
                  <li><strong>KYC Verification:</strong> We're verifying your documents (24-48 hours)</li>
                  <li><strong>Buyer Inquiries:</strong> You'll receive notifications when buyers contact you</li>
                  <li><strong>Dashboard:</strong> Monitor views, inquiries, and buyer interest in real-time</li>
                  <li><strong>Upgrade:</strong> Upgrade to Premium ($499/year) for 3x more visibility</li>
                </ul>

                <p><a href="https://forward-os.com/dashboard" class="button">View Your Dashboard →</a></p>

                <h3>Premium Listing Benefits</h3>
                <p>Want to increase your chances of selling?</p>
                <ul>
                  <li>✓ Featured in weekly newsletter to 5,000+ buyers</li>
                  <li>✓ Up to 20 professional photos (vs 3)</li>
                  <li>✓ Featured on landing page carousel</li>
                  <li>✓ Real-time analytics dashboard</li>
                  <li>✓ Broker network matching</li>
                </ul>

                <p><a href="https://forward-os.com/pricing" class="button">Upgrade to Premium →</a></p>

                <p>Questions? Reply to this email or contact us at support@forward-os.com</p>
              </div>

              <div class="footer">
                <p>© 2024 Forward OS. All rights reserved.</p>
                <p><a href="#">Unsubscribe</a> | <a href="#">Privacy Policy</a> | <a href="#">Terms of Service</a></p>
              </div>
            </div>
          </body>
        </html>
      `

      const result = await this.resend.emails.send({
        from: `${this.fromName} <${this.fromAddress}>`,
        to: sellerEmail,
        subject: `✅ ${businessName} is Now Listed on Forward OS!`,
        html,
      })

      if (result.error) {
        console.error('[EMAIL] Error sending listing confirmation:', result.error)
        return {
          success: false,
          error: result.error.message,
        }
      }

      console.log(`[EMAIL] Listing confirmation sent to ${sellerEmail}`)

      return {
        success: true,
        messageId: result.data?.id,
      }
    } catch (error) {
      console.error('[EMAIL] Error sending listing confirmation:', error)
      return {
        success: false,
        error: String(error),
      }
    }
  }

  /**
   * Send Broker Consent Request Email (Seller)
   */
  async sendBrokerConsentRequest(
    sellerName: string,
    sellerEmail: string,
    businessName: string,
    brokerName: string,
    brokerCompany: string,
    brokerLicense: string,
    consentToken: string
  ): Promise<EmailResult> {
    try {
      const consentUrl = `https://forward-os.com/consent/approve?token=${consentToken}`

      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto; color: #1A1A1A; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .alert-box { background: #EFF6FF; border-left: 4px solid #8C6D45; padding: 15px; margin: 20px 0; }
              .button { display: inline-block; background: #B8956A; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; }
              .broker-card { background: #FFFFFF; border: 1px solid #E5E7EB; padding: 15px; border-radius: 6px; margin: 20px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <h2>Action Required: Broker Listing Permission</h2>

              <p>Hi ${sellerName},</p>

              <div class="alert-box">
                <p><strong>${brokerName}</strong> from <strong>${brokerCompany}</strong> is requesting permission to list your business <strong>${businessName}</strong> on Forward OS.</p>
              </div>

              <h3>Broker Information</h3>
              <div class="broker-card">
                <p><strong>Name:</strong> ${brokerName}</p>
                <p><strong>Company:</strong> ${brokerCompany}</p>
                <p><strong>License:</strong> ${brokerLicense}</p>
                <p><strong>Commission Rate:</strong> 1% (of deal value)</p>
              </div>

              <h3>What This Means</h3>
              <ul>
                <li>Your listing will be managed by ${brokerName}</li>
                <li>The broker will earn 1% commission if a deal closes</li>
                <li>You retain full control of your listing</li>
                <li>You can revoke broker access anytime</li>
                <li>All buyer inquiries come directly to you</li>
              </ul>

              <p><a href="${consentUrl}" class="button">✓ Approve Listing Permission →</a></p>

              <p>Or decline:</p>
              <p><a href="https://forward-os.com/consent/decline?token=${consentToken}">I prefer to list on my own</a></p>

              <h3>Your Rights</h3>
              <ul>
                <li>✓ You can revoke broker access at any time</li>
                <li>✓ Your data is never shared without permission</li>
                <li>✓ Commission is only owed if a deal closes</li>
                <li>✓ You can contact buyers directly</li>
              </ul>

              <p>Questions? Contact us at support@forward-os.com</p>
            </div>
          </body>
        </html>
      `

      const result = await this.resend.emails.send({
        from: `${this.fromName} <${this.fromAddress}>`,
        to: sellerEmail,
        subject: `${brokerName} from ${brokerCompany} Requests Permission to List Your Business`,
        html,
      })

      if (result.error) {
        console.error('[EMAIL] Error sending broker consent request:', result.error)
        return {
          success: false,
          error: result.error.message,
        }
      }

      console.log(`[EMAIL] Broker consent request sent to ${sellerEmail}`)

      return {
        success: true,
        messageId: result.data?.id,
      }
    } catch (error) {
      console.error('[EMAIL] Error sending broker consent request:', error)
      return {
        success: false,
        error: String(error),
      }
    }
  }

  /**
   * Send KYC Verification Complete Email (Seller)
   */
  async sendKYCVerificationComplete(
    sellerName: string,
    sellerEmail: string,
    businessName: string,
    verificationStatus: 'verified' | 'rejected'
  ): Promise<EmailResult> {
    try {
      const isVerified = verificationStatus === 'verified'

      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto; color: #1A1A1A; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .success { background: #EAF5F0; border-left: 4px solid #2D7A5F; padding: 15px; margin: 20px 0; }
              .error { background: #F3F4F6; border-left: 4px solid #B8956A; padding: 15px; margin: 20px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              ${isVerified ? `
                <h2>✅ KYC Verification Complete!</h2>
                <div class="success">
                  <p>Your identity and business documents have been verified successfully.</p>
                </div>
                <p>Your listing for <strong>${businessName}</strong> is now fully active and visible to all buyers.</p>
              ` : `
                <h2>⚠️ KYC Verification Review</h2>
                <div class="error">
                  <p>Your documents require additional review. Please reply to this email to resolve any issues.</p>
                </div>
              `}
              <p>Thank you for listing with Forward OS!</p>
            </div>
          </body>
        </html>
      `

      const result = await this.resend.emails.send({
        from: `${this.fromName} <${this.fromAddress}>`,
        to: sellerEmail,
        subject: isVerified ? `✅ KYC Verification Complete - ${businessName} is Fully Active` : `⚠️ KYC Verification Review Required`,
        html,
      })

      if (result.error) {
        console.error('[EMAIL] Error sending KYC verification email:', result.error)
        return {
          success: false,
          error: result.error.message,
        }
      }

      console.log(`[EMAIL] KYC verification email sent to ${sellerEmail}`)

      return {
        success: true,
        messageId: result.data?.id,
      }
    } catch (error) {
      console.error('[EMAIL] Error sending KYC verification email:', error)
      return {
        success: false,
        error: String(error),
      }
    }
  }

  /**
   * Send Commission Earned Notification (Broker)
   */
  async sendCommissionNotification(
    brokerName: string,
    brokerEmail: string,
    businessName: string,
    dealValue: number,
    commissionAmount: number
  ): Promise<EmailResult> {
    try {
      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto; color: #1A1A1A; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .card { background: #FFFFFF; border: 1px solid #E5E7EB; padding: 20px; border-radius: 6px; margin: 20px 0; }
              .amount { font-size: 24px; font-weight: bold; color: #B8956A; }
            </style>
          </head>
          <body>
            <div class="container">
              <h2>💰 Commission Earned!</h2>
              <p>Hi ${brokerName},</p>

              <p>Congratulations! A deal has closed for <strong>${businessName}</strong>.</p>

              <div class="card">
                <p><strong>Deal Value:</strong> $${dealValue.toLocaleString()}</p>
                <p><strong>Commission Rate:</strong> 1%</p>
                <p class="amount">Commission: $${commissionAmount.toLocaleString()}</p>
                <p><strong>Payment Schedule:</strong> Net-30 (30 days after close)</p>
              </div>

              <p>Payment will be processed to your registered account within 30 days.</p>

              <p><a href="https://forward-os.com/broker-dashboard">View Your Dashboard →</a></p>
            </div>
          </body>
        </html>
      `

      const result = await this.resend.emails.send({
        from: `${this.fromName} <${this.fromAddress}>`,
        to: brokerEmail,
        subject: `💰 Commission Earned: $${commissionAmount.toLocaleString()}`,
        html,
      })

      if (result.error) {
        console.error('[EMAIL] Error sending commission notification:', result.error)
        return {
          success: false,
          error: result.error.message,
        }
      }

      console.log(`[EMAIL] Commission notification sent to ${brokerEmail}`)

      return {
        success: true,
        messageId: result.data?.id,
      }
    } catch (error) {
      console.error('[EMAIL] Error sending commission notification:', error)
      return {
        success: false,
        error: String(error),
      }
    }
  }

  /**
   * Helper: Format KYC status for email
   */
  private _formatKYCStatus(status: string): string {
    switch (status) {
      case 'verified':
        return '✅ Verified'
      case 'pending':
        return '⏳ Pending Review (24-48 hours)'
      case 'rejected':
        return '❌ Needs Review'
      case 'manual_review':
        return '👤 Manual Review Required'
      default:
        return status
    }
  }
}

export const emailService = new EmailService()
export type { EmailOptions, EmailResult }

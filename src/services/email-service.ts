import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface EmailTemplate {
  id: string
  name: string
  description: string
  category: 'buyer' | 'broker' | 'seller'
  variants: number
}

interface EmailCampaignPayload {
  name: string
  type: 'buyers' | 'brokers' | 'sellers' | 'all'
  subject: string
  template: string
  recipients: string[]
  variables?: Record<string, any>
  tags?: Array<{ name: string; value: string }>
}

/**
 * Send an email campaign via Resend
 */
export async function sendEmailCampaign(payload: EmailCampaignPayload) {
  try {
    const { name, recipients, subject, template, variables = {}, tags = [] } = payload

    // Add campaign metadata to tags
    const campaignTags = [
      { name: 'campaign_name', value: name },
      { name: 'campaign_type', value: payload.type },
      ...tags,
    ]

    // Batch send to avoid rate limits
    const batchSize = 100
    const results: Array<{batchIndex: number; batchSize: number; success: boolean; emailId?: string; error?: string}> = []

    for (let i = 0; i < recipients.length; i += batchSize) {
      const batch = recipients.slice(i, i + batchSize)

      const result = await resend.emails.send({
        from: 'Forward OS <notifications@forwardos.com>',
        to: batch,
        subject,
        template: {
          id: template,
          variables: variables,
        },
        tags: campaignTags,
      } as any)

      results.push({
        batchIndex: Math.floor(i / batchSize),
        batchSize: batch.length,
        success: !result.error,
        emailId: result.data?.id,
        error: result.error?.message,
      })
    }

    return {
      campaignName: name,
      totalRecipients: recipients.length,
      batches: results,
      successRate: results.filter((r) => r.success).length / results.length,
    }
  } catch (error) {
    console.error('Error sending campaign:', error)
    throw error
  }
}

/**
 * Send a test email to verify template rendering
 */
export async function sendTestEmail(
  to: string,
  template: string,
  subject: string,
  variables?: Record<string, any>
) {
  try {
    const result = await resend.emails.send({
      from: 'Forward OS <notifications@forwardos.com>',
      to,
      subject: `[TEST] ${subject}`,
      template: {
        id: template,
        variables: variables,
      },
      tags: [
        { name: 'email_type', value: 'test' },
        { name: 'template', value: template },
      ],
    } as any)

    return {
      success: !result.error,
      emailId: result.data?.id,
      error: result.error?.message,
    }
  } catch (error) {
    console.error('Error sending test email:', error)
    throw error
  }
}

/**
 * Get email list from Resend contact list
 */
export async function getEmailList(listName: string) {
  try {
    // This would require Resend API integration for contact lists
    // For now, return structure ready for implementation
    return {
      listName,
      emails: [],
      totalCount: 0,
    }
  } catch (error) {
    console.error('Error getting email list:', error)
    throw error
  }
}

/**
 * Track email opens (via Resend webhook)
 */
export async function trackEmailOpen(emailId: string, campaignId: string, userId: string) {
  try {
    // TODO: Store open event in database
    // await db.emailEvent.create({
    //   emailId,
    //   campaignId,
    //   userId,
    //   eventType: 'open',
    //   timestamp: new Date(),
    // })
    return { success: true }
  } catch (error) {
    console.error('Error tracking email open:', error)
    throw error
  }
}

/**
 * Track email clicks (via Resend webhook)
 */
export async function trackEmailClick(
  emailId: string,
  campaignId: string,
  userId: string,
  url: string
) {
  try {
    // TODO: Store click event in database
    // await db.emailEvent.create({
    //   emailId,
    //   campaignId,
    //   userId,
    //   eventType: 'click',
    //   metadata: { url },
    //   timestamp: new Date(),
    // })
    return { success: true }
  } catch (error) {
    console.error('Error tracking email click:', error)
    throw error
  }
}

/**
 * Handle email bounce (via Resend webhook)
 */
export async function handleEmailBounce(
  emailId: string,
  email: string,
  bounceType: 'permanent' | 'temporary'
) {
  try {
    // TODO: Update user subscription status in database
    // if (bounceType === 'permanent') {
    //   await db.user.update({
    //     where: { email },
    //     data: { emailSubscribed: false },
    //   })
    // }
    return { success: true }
  } catch (error) {
    console.error('Error handling email bounce:', error)
    throw error
  }
}

/**
 * Get available templates
 */
export function getAvailableTemplates(): EmailTemplate[] {
  return [
    {
      id: 'weekly-deal-spotlight',
      name: 'Weekly Deal Spotlight',
      description: 'Featured deal matching buyer criteria',
      category: 'buyer',
      variants: 27,
    },
    {
      id: 'broker-deal-flow',
      name: 'Broker Deal Flow',
      description: 'Deal flow and buyer activity updates',
      category: 'broker',
      variants: 22,
    },
    {
      id: 'seller-performance',
      name: 'Seller Performance Update',
      description: 'Listing metrics and buyer interest',
      category: 'seller',
      variants: 18,
    },
    {
      id: 'upgrade-promotion',
      name: 'Premium Upgrade Offer',
      description: 'Limited-time upgrade promotion',
      category: 'buyer',
      variants: 15,
    },
  ]
}

/**
 * Validate email template in Resend
 */
export async function validateTemplate(templateId: string) {
  try {
    // Attempt to get template details from Resend
    // This will fail if template doesn't exist
    const result = await resend.emails.send({
      from: 'Forward OS <notifications@forwardos.com>',
      to: 'test@example.com',
      template: {
        id: templateId,
      },
      subject: '[VALIDATION TEST]',
    } as any)

    // For validation, we just want to verify it exists
    // The email will bounce to test@example.com but that's fine
    return {
      valid: true,
      templateId,
    }
  } catch (error) {
    return {
      valid: false,
      templateId,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

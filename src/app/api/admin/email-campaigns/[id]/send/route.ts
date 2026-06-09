import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

let resend: Resend | null = null

function getResend() {
  if (!resend) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY environment variable is not set')
    }
    resend = new Resend(process.env.RESEND_API_KEY)
  }
  return resend
}

interface SendEmailRequest {
  campaignId: string
  recipients: string[]
  subject: string
  templateId: string
  variables?: Record<string, any>
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const campaignId = params.id
    const body = await request.json() as SendEmailRequest

    const { recipients, subject, templateId, variables = {} } = body

    if (!recipients || recipients.length === 0) {
      return NextResponse.json(
        { error: 'No recipients specified' },
        { status: 400 }
      )
    }

    const resendClient = getResend()

    // Example: Send with Resend using different templates
    const results: Array<{
      batch: number
      status: string
      message: string
      sentCount: number
    }> = []
    const batchSize = 100 // Resend recommends batching

    for (let i = 0; i < recipients.length; i += batchSize) {
      const batch = recipients.slice(i, i + batchSize)

      // Map template IDs to Resend template IDs
      const resendTemplateId = getResendTemplate(templateId)

      try {
        const response = await resendClient.emails.send({
          from: 'Forward OS <notifications@forwardos.com>',
          to: batch,
          subject: subject,
          template: {
            id: resendTemplateId,
            variables: variables,
          },
          tags: [
            {
              name: 'campaign_id',
              value: campaignId,
            },
            {
              name: 'template',
              value: templateId,
            },
          ],
        } as any)

        results.push({
          batch: Math.floor(i / batchSize) + 1,
          status: response.error ? 'failed' : 'sent',
          message: response.error ? response.error.message : 'Sent successfully',
          sentCount: response.error ? 0 : batch.length,
        })
      } catch (error) {
        console.error(`Error sending batch ${Math.floor(i / batchSize) + 1}:`, error)
        results.push({
          batch: Math.floor(i / batchSize) + 1,
          status: 'failed',
          message: error instanceof Error ? error.message : 'Unknown error',
          sentCount: 0,
        })
      }
    }

    // Update campaign status in database
    // TODO: Update campaign status to 'sending' or 'completed'

    const totalSent = results.reduce((sum, r) => sum + r.sentCount, 0)

    return NextResponse.json({
      campaignId,
      totalRecipients: recipients.length,
      totalSent,
      batches: results,
      status: totalSent === recipients.length ? 'completed' : 'partial',
    })
  } catch (error) {
    console.error('Error sending campaign:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to send campaign' },
      { status: 500 }
    )
  }
}

function getResendTemplate(templateId: string): string {
  // Map your template IDs to Resend template IDs
  // You'll need to create these templates in Resend dashboard first
  const templateMap: Record<string, string> = {
    'weekly-deal-spotlight': 'weekly-deal-spotlight', // Your Resend template ID
    'broker-deal-flow': 'broker-deal-flow',
    'seller-performance': 'seller-performance',
    'upgrade-promotion': 'upgrade-promotion',
  }

  return templateMap[templateId] || templateId
}

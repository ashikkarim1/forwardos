import { NextRequest, NextResponse } from 'next/server'
import {
  trackEmailClick,
  trackEmailOpen,
  handleEmailBounce,
} from '@/services/email-service'

/**
 * Webhook handler for Resend email events
 * Set up in Resend dashboard: https://resend.com/webhooks
 *
 * Events:
 * - email.sent
 * - email.opened
 * - email.clicked
 * - email.bounced
 * - email.complained
 * - email.delivered
 */
export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get('svix-signature')
    const body = await request.text()

    // TODO: Verify Resend webhook signature
    // const wh = new Webhook(process.env.RESEND_WEBHOOK_SECRET!)
    // const event = wh.verify(body, signature || '') as ResendEvent

    // Parse webhook manually for now
    const event = JSON.parse(body)

    console.log('Resend webhook event:', event.type)

    switch (event.type) {
      case 'email.sent':
        await handleEmailSent(event.data)
        break

      case 'email.delivered':
        await handleEmailDelivered(event.data)
        break

      case 'email.opened':
        await handleEmailOpened(event.data)
        break

      case 'email.clicked':
        await handleEmailClicked(event.data)
        break

      case 'email.bounced':
        await handleEmailBounced(event.data)
        break

      case 'email.complained':
        await handleEmailComplained(event.data)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error processing Resend webhook:', error)
    return NextResponse.json({ error: 'Failed to process webhook' }, { status: 500 })
  }
}

interface ResendEventData {
  email: string
  email_id: string
  created_at: string
  [key: string]: any
}

async function handleEmailSent(data: ResendEventData) {
  console.log(`Email sent: ${data.email}`)
  // TODO: Update campaign metrics in database
  // await db.emailMetric.upsert({
  //   where: { emailId: data.email_id },
  //   update: { status: 'sent', sentAt: new Date(data.created_at) },
  //   create: { emailId: data.email_id, email: data.email, status: 'sent' },
  // })
}

async function handleEmailDelivered(data: ResendEventData) {
  console.log(`Email delivered: ${data.email}`)
  // TODO: Update campaign metrics
  // await db.emailMetric.update({
  //   where: { emailId: data.email_id },
  //   data: { status: 'delivered', deliveredAt: new Date(data.created_at) },
  // })
}

async function handleEmailOpened(data: ResendEventData) {
  try {
    console.log(`Email opened: ${data.email}`)

    // Extract campaign ID from tags if available
    const campaignId = data.tags?.find((t: any) => t.name === 'campaign_id')?.value
    const userId = data.tags?.find((t: any) => t.name === 'user_id')?.value

    if (campaignId && userId) {
      await trackEmailOpen(data.email_id, campaignId, userId)
    }

    // TODO: Update campaign open metrics
    // await db.emailMetric.update({
    //   where: { emailId: data.email_id },
    //   data: {
    //     status: 'opened',
    //     openedAt: new Date(data.created_at),
    //     openCount: { increment: 1 },
    //   },
    // })
  } catch (error) {
    console.error('Error tracking email open:', error)
  }
}

async function handleEmailClicked(data: ResendEventData) {
  try {
    console.log(`Email clicked: ${data.email} - ${data.link}`)

    // Extract metadata
    const campaignId = data.tags?.find((t: any) => t.name === 'campaign_id')?.value
    const userId = data.tags?.find((t: any) => t.name === 'user_id')?.value

    if (campaignId && userId) {
      await trackEmailClick(data.email_id, campaignId, userId, data.link)
    }

    // TODO: Update campaign click metrics
    // await db.emailMetric.update({
    //   where: { emailId: data.email_id },
    //   data: {
    //     clickCount: { increment: 1 },
    //     lastClickedAt: new Date(data.created_at),
    //   },
    // })

    // TODO: Track link click for attribution
    // await db.linkClick.create({
    //   data: {
    //     campaignId,
    //     userId,
    //     link: data.link,
    //     timestamp: new Date(data.created_at),
    //   },
    // })
  } catch (error) {
    console.error('Error tracking email click:', error)
  }
}

async function handleEmailBounced(data: ResendEventData) {
  try {
    console.log(`Email bounced: ${data.email} - ${data.bounce_type}`)

    const bounceType = data.bounce_type === 'permanent' ? 'permanent' : 'temporary'
    await handleEmailBounce(data.email_id, data.email, bounceType)

    // TODO: Update user subscription status if permanent bounce
    // if (bounceType === 'permanent') {
    //   await db.user.update({
    //     where: { email: data.email },
    //     data: { emailSubscribed: false },
    //   })
    // }
  } catch (error) {
    console.error('Error handling email bounce:', error)
  }
}

async function handleEmailComplained(data: ResendEventData) {
  try {
    console.log(`Email complaint: ${data.email}`)

    // TODO: Unsubscribe user from all future emails
    // await db.user.update({
    //   where: { email: data.email },
    //   data: { emailSubscribed: false },
    // })
  } catch (error) {
    console.error('Error handling email complaint:', error)
  }
}

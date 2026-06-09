import { NextRequest, NextResponse } from 'next/server'

interface EmailCampaign {
  id: string
  name: string
  type: 'buyers' | 'brokers' | 'sellers' | 'all'
  subject: string
  templateId: string
  recipients: string[]
  status: 'draft' | 'scheduled' | 'sending' | 'completed'
  scheduledFor?: Date
  sentAt?: Date
  metrics: {
    sent: number
    delivered: number
    opened: number
    clicked: number
    unsubscribed: number
    bounced: number
  }
}

// Get all campaigns
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const type = searchParams.get('type')

    // TODO: Query from database
    // For now, return mock data structure ready for integration
    const campaigns: EmailCampaign[] = [
      {
        id: '1',
        name: 'Weekly Deal Spotlight',
        type: 'buyers',
        subject: 'Your perfect match: SaaS Platform +45% growth',
        templateId: 'weekly-deal-spotlight',
        recipients: [],
        status: 'completed',
        sentAt: new Date('2026-03-08T09:00:00'),
        metrics: {
          sent: 12340,
          delivered: 12298,
          opened: 4706,
          clicked: 2029,
          unsubscribed: 38,
          bounced: 42,
        },
      },
    ]

    return NextResponse.json(campaigns)
  } catch (error) {
    console.error('Error fetching campaigns:', error)
    return NextResponse.json({ error: 'Failed to fetch campaigns' }, { status: 500 })
  }
}

// Create new campaign
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, type, subject, templateId, recipients, scheduledFor } = body

    // Validate required fields
    if (!name || !type || !subject || !templateId) {
      return NextResponse.json(
        { error: 'Missing required fields: name, type, subject, templateId' },
        { status: 400 }
      )
    }

    if (!recipients || recipients.length === 0) {
      return NextResponse.json(
        { error: 'At least one recipient is required' },
        { status: 400 }
      )
    }

    // Create campaign in database
    // TODO: Save to database
    const campaign: EmailCampaign = {
      id: Date.now().toString(),
      name,
      type,
      subject,
      templateId,
      recipients,
      status: scheduledFor ? 'scheduled' : 'draft',
      scheduledFor: scheduledFor ? new Date(scheduledFor) : undefined,
      metrics: {
        sent: 0,
        delivered: 0,
        opened: 0,
        clicked: 0,
        unsubscribed: 0,
        bounced: 0,
      },
    }

    return NextResponse.json(campaign, { status: 201 })
  } catch (error) {
    console.error('Error creating campaign:', error)
    return NextResponse.json({ error: 'Failed to create campaign' }, { status: 500 })
  }
}

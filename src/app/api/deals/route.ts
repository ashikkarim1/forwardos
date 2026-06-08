import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getSession } from '@/lib/auth'

const prisma = new PrismaClient()

// GET: List deals (with filters)
export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const industry = searchParams.get('industry')
    const sellerId = searchParams.get('sellerId')

    const where: any = {}
    if (status) where.status = status
    if (industry) where.industry = industry
    if (sellerId) where.sellerId = sellerId

    const deals = await prisma.deal.findMany({
      where,
      include: { dataRoom: true, dataRoomRequests: true },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })

    return NextResponse.json({ deals, count: deals.length })
  } catch (error) {
    console.error('Fetch deals error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST: Create deal
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'SELLER') {
      return NextResponse.json({ error: 'Unauthorized: Sellers only' }, { status: 401 })
    }

    const { title, description, industry, revenue, ebitda, askingPrice, country, city, reasonForSale } = await request.json()

    const deal = await prisma.deal.create({
      data: {
        title,
        description,
        industry,
        revenue: Number(revenue),
        ebitda: Number(ebitda),
        askingPrice: askingPrice ? Number(askingPrice) : null,
        country,
        city,
        reasonForSale,
        sellerId: session.userId,
        status: 'DRAFT',
      },
    })

    return NextResponse.json({ deal }, { status: 201 })
  } catch (error) {
    console.error('Create deal error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

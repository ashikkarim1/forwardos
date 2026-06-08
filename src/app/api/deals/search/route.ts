import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getSession } from '@/lib/auth'

const prisma = new PrismaClient()

// GET: Search deals
export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const industry = searchParams.get('industry')
    const location = searchParams.get('location')
    const minValuation = searchParams.get('minValuation')
    const maxValuation = searchParams.get('maxValuation')
    const status = searchParams.get('status') || 'PUBLISHED'

    let where: any = {
      status, // Default to published
    }

    // Text search on title and description
    if (query) {
      where.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ]
    }

    // Industry filter
    if (industry && industry !== 'all') {
      where.industry = industry
    }

    // Location filter
    if (location && location !== 'all') {
      where.location = { contains: location, mode: 'insensitive' }
    }

    // Valuation range filter
    if (minValuation || maxValuation) {
      where.estimatedValuation = {}
      if (minValuation) {
        where.estimatedValuation.gte = parseInt(minValuation)
      }
      if (maxValuation) {
        where.estimatedValuation.lte = parseInt(maxValuation)
      }
    }

    const deals = await prisma.deal.findMany({
      where,
      select: {
        id: true,
        title: true,
        description: true,
        industry: true,
        location: true,
        estimatedValuation: true,
        annualRevenue: true,
        status: true,
        createdAt: true,
        seller: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })

    return NextResponse.json({
      deals,
      count: deals.length,
    })
  } catch (error) {
    console.error('Search deals error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

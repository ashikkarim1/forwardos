import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getSession } from '@/lib/auth'

const prisma = new PrismaClient()

// GET: Get all deals in pipeline (Kanban view by stages)
export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const sellerId = searchParams.get('sellerId') || session.userId
    const viewType = searchParams.get('view') || 'kanban' // kanban, list, timeline

    // Get all deals for this seller with their pipeline info
    const deals = await prisma.deal.findMany({
      where: {
        sellerId,
      },
      include: {
        pipeline: true,
        seller: { select: { name: true, email: true } },
      },
      orderBy: {
        pipeline: {
          stageStartedAt: 'desc',
        },
      },
    })

    if (viewType === 'kanban') {
      // Group by stage for Kanban view
      const stages = [
        'INTEREST',
        'QUALIFICATION',
        'DUE_DILIGENCE',
        'LOI',
        'OFFERS',
        'NEGOTIATION',
        'FINAL_AGREEMENT',
        'CLOSING',
        'CLOSED',
        'WITHDRAWN',
      ]

      const kanban = stages.reduce((acc, stage) => {
        acc[stage] = deals.filter((d) => d.pipeline?.currentStage === stage)
        return acc
      }, {} as Record<string, typeof deals>)

      return NextResponse.json({
        view: 'kanban',
        kanban,
        totalDeals: deals.length,
      })
    } else if (viewType === 'timeline') {
      // Timeline view showing progression
      const timeline = deals.map((deal) => ({
        dealId: deal.id,
        title: deal.title,
        industry: deal.industry,
        currentStage: deal.pipeline?.currentStage,
        progressPercent: deal.pipeline?.progressPercent || 0,
        stageStartedAt: deal.pipeline?.stageStartedAt,
        estimatedClosing: deal.pipeline?.estimatedClosingDate,
        revenue: deal.revenue,
        valuation: deal.askingPrice,
      }))

      return NextResponse.json({
        view: 'timeline',
        timeline,
        totalDeals: timeline.length,
      })
    } else {
      // List view
      const list = deals.map((deal) => ({
        dealId: deal.id,
        title: deal.title,
        industry: deal.industry,
        revenue: deal.revenue,
        valuation: deal.askingPrice,
        currentStage: deal.pipeline?.currentStage,
        progressPercent: deal.pipeline?.progressPercent || 0,
        stageStartedAt: deal.pipeline?.stageStartedAt,
        daysInStage: deal.pipeline?.stageStartedAt
          ? Math.floor((new Date().getTime() - new Date(deal.pipeline.stageStartedAt).getTime()) / (1000 * 60 * 60 * 24))
          : 0,
      }))

      return NextResponse.json({
        view: 'list',
        deals: list,
        totalDeals: list.length,
      })
    }
  } catch (error) {
    console.error('Fetch pipeline error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

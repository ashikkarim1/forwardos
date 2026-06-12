/**
 * GET /api/seller/deals — every listing the current seller owns, with
 * per-deal status, plan, and inquiry count. Used by the seller dashboard
 * to render the per-deal control rows (edit / unlist / relist / sold /
 * cancel / upgrade / downgrade).
 */
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const deals = await prisma.deal.findMany({
    where: { sellerId: session.userId },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true, slug: true, title: true, industry: true, country: true, city: true,
      askingPrice: true, revenue: true, ebitda: true, heatScore: true, dealQualityScore: true,
      status: true, dealPlan: true, dealPlanActiveUntil: true, isConfidential: true,
      publishedAt: true, closedAt: true, createdAt: true,
      _count: { select: { enquiries: true } },
    },
  })

  // BigInt → number for JSON.
  const serialized = deals.map((d) => ({
    ...d,
    askingPrice: d.askingPrice != null ? Number(d.askingPrice) : null,
    revenue: d.revenue != null ? Number(d.revenue) : null,
    ebitda: d.ebitda != null ? Number(d.ebitda) : null,
    enquiryCount: d._count.enquiries,
    _count: undefined,
  }))

  return NextResponse.json({ deals: serialized })
}

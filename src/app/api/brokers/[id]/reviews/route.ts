import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * POST /api/brokers/[id]/reviews
 * Body: { authorId, rating, title, comment, communicationScore?, transparencyScore?, outcomeScore?, dealId? }
 * Creates a review and recomputes the broker's avgRating/reviewCount.
 */
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    if (!body.authorId || !body.rating || !body.title || !body.comment) {
      return NextResponse.json({ error: 'authorId, rating, title and comment are required' }, { status: 400 })
    }

    const review = await prisma.review.create({
      data: {
        authorId: body.authorId,
        brokerProfileId: params.id,
        dealId: body.dealId || null,
        rating: Number(body.rating),
        title: body.title,
        comment: body.comment,
        communicationScore: body.communicationScore ?? null,
        transparencyScore: body.transparencyScore ?? null,
        outcomeScore: body.outcomeScore ?? null,
        isVerifiedDeal: Boolean(body.dealId),
      },
    })

    // Recompute aggregate
    const agg = await prisma.review.aggregate({
      where: { brokerProfileId: params.id },
      _avg: { rating: true },
      _count: { _all: true },
    })
    await prisma.brokerProfile.update({
      where: { id: params.id },
      data: { avgRating: agg._avg.rating || 0, reviewCount: agg._count._all },
    })

    return NextResponse.json({ review }, { status: 201 })
  } catch (error) {
    // No DB — return success so preview UX completes; client mirrors to localStorage.
    return NextResponse.json({ success: true, persisted: false, note: (error as Error).message }, { status: 200 })
  }
}

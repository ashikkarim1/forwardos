import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getBroker } from '@/lib/broker-data'

/**
 * GET /api/brokers/[id] — one broker profile with reviews.
 * DB first; static dataset fallback.
 */
export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const pr = await prisma.brokerProfile.findUnique({
      where: { id: params.id },
      include: {
        user: { select: { name: true, company: true, profileImage: true } },
        reviews: { orderBy: { createdAt: 'desc' } },
      },
    })
    if (pr) {
      return NextResponse.json({
        broker: {
          id: pr.id,
          name: pr.user.name,
          company: pr.user.company || '',
          headline: pr.headline,
          bio: pr.bio,
          avatarUrl: pr.user.profileImage || '',
          specialties: JSON.parse(pr.specialties),
          industries: JSON.parse(pr.industries),
          regions: JSON.parse(pr.regions),
          languages: JSON.parse(pr.languages),
          yearsExperience: pr.yearsExperience,
          dealsClosed: pr.dealsClosed,
          totalValueClosedUsd: Number(pr.totalValueClosed) / 100,
          isVerified: pr.isVerified,
          isFeatured: pr.isFeatured,
          avgRating: pr.avgRating,
          reviewCount: pr.reviewCount,
          reviews: pr.reviews.map((r) => ({
            id: r.id, authorName: 'Verified buyer', rating: r.rating, title: r.title,
            comment: r.comment, isVerifiedDeal: r.isVerifiedDeal, createdAt: r.createdAt,
          })),
        },
        source: 'db',
      })
    }
    throw new Error('not-in-db')
  } catch {
    const broker = getBroker(params.id)
    if (!broker) return NextResponse.json({ error: 'Broker not found' }, { status: 404 })
    return NextResponse.json({ broker, source: 'static' })
  }
}

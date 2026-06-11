import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { BROKERS, filterBrokers } from '@/lib/broker-data'

/**
 * GET /api/brokers?region=&industry=&language=&q=
 * Tries DB broker profiles; falls back to the canonical dataset when no DB.
 *
 * POST /api/brokers — create/update the caller's broker profile (production path).
 */
export async function GET(request: NextRequest) {
  const p = request.nextUrl.searchParams
  const opts = {
    region: p.get('region') || undefined,
    industry: p.get('industry') || undefined,
    language: p.get('language') || undefined,
    q: p.get('q') || undefined,
  }

  try {
    const profiles = await prisma.brokerProfile.findMany({
      include: { user: { select: { name: true, company: true, profileImage: true } } },
      orderBy: [{ isFeatured: 'desc' }, { avgRating: 'desc' }],
    })
    if (profiles.length > 0) {
      const mapped = profiles
        .map((pr) => ({
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
        }))
        // apply same filters as static
        .filter((b) => {
          if (opts.region && !b.regions.includes(opts.region)) return false
          if (opts.industry && !b.industries.includes(opts.industry)) return false
          if (opts.language && !b.languages.includes(opts.language)) return false
          return true
        })
      return NextResponse.json({ brokers: mapped, source: 'db' })
    }
    throw new Error('no-db-rows')
  } catch {
    const brokers = filterBrokers(BROKERS, opts).map(({ reviews, ...b }) => b)
    return NextResponse.json({ brokers, source: 'static' })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    if (!body.userId || !body.headline) {
      return NextResponse.json({ error: 'userId and headline are required' }, { status: 400 })
    }
    const profile = await prisma.brokerProfile.upsert({
      where: { userId: body.userId },
      update: {
        headline: body.headline,
        bio: body.bio || '',
        specialties: JSON.stringify(body.specialties || []),
        industries: JSON.stringify(body.industries || []),
        regions: JSON.stringify(body.regions || []),
        languages: JSON.stringify(body.languages || []),
        yearsExperience: body.yearsExperience || 0,
      },
      create: {
        userId: body.userId,
        headline: body.headline,
        bio: body.bio || '',
        specialties: JSON.stringify(body.specialties || []),
        industries: JSON.stringify(body.industries || []),
        regions: JSON.stringify(body.regions || []),
        languages: JSON.stringify(body.languages || []),
        yearsExperience: body.yearsExperience || 0,
      },
    })
    return NextResponse.json({ profile }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Save failed' }, { status: 500 })
  }
}

// GDPR Art. 15/20 — right of access & data portability. Returns the signed-in
// user's personal data as a downloadable JSON file.
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { logAudit } from '@/lib/audit'

export const dynamic = 'force-dynamic'

// JSON can't serialize BigInt — convert recursively to numbers.
function deBigInt(value: unknown): unknown {
  if (typeof value === 'bigint') return Number(value)
  if (Array.isArray(value)) return value.map(deBigInt)
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value as Record<string, unknown>).map(([k, v]) => [k, deBigInt(v)]))
  }
  return value
}

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  const userId = session.userId

  try {
    const [user, savedSearches, brokerProfile, reviews, financingInquiries, savedDeals, deals, feedback] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true, email: true, name: true, role: true, company: true, phone: true, bio: true,
          website: true, linkedinUrl: true, kycStatus: true, createdAt: true, lastLoginAt: true,
        },
      }),
      prisma.savedSearch.findMany({ where: { userId } }),
      prisma.brokerProfile.findUnique({ where: { userId } }).catch(() => null),
      prisma.review.findMany({ where: { authorId: userId } }),
      prisma.financingInquiry.findMany({ where: { userId } }),
      prisma.savedDeal.findMany({ where: { userId } }),
      prisma.deal.findMany({ where: { sellerId: userId }, select: { id: true, title: true, status: true, createdAt: true } }),
      prisma.feedback.findMany({ where: { userId } }),
    ])

    const payload = deBigInt({
      exportedAt: new Date().toISOString(),
      subject: { userId },
      data: { user, savedSearches, brokerProfile, reviews, financingInquiries, savedDeals, deals, feedback },
      note: 'This is the personal data Forward Intelligence holds about you. For requests we cannot self-serve (rectification, restriction, objection), email privacy@forwardos.ai.',
    })

    await logAudit({ userId, action: 'data.export', resourceType: 'user', resourceId: userId })

    return new NextResponse(JSON.stringify(payload, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="forward-data-export-${userId}.json"`,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Export failed' }, { status: 500 })
  }
}

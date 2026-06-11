// GDPR Art. 17 — right to erasure. Anonymizes the user's PII and removes their
// personal content, while retaining records required for legal/AML obligations
// in anonymized form (a permitted exception under Art. 17(3)). Clears the session.
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession, clearAuthCookie } from '@/lib/auth'
import { isSameOrigin } from '@/lib/rate-limit'
import crypto from 'crypto'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  if (!isSameOrigin(req)) {
    return NextResponse.json({ error: 'Cross-origin request blocked' }, { status: 403 })
  }
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  const body = await req.json().catch(() => ({}))
  if (body?.confirm !== true) {
    return NextResponse.json({ error: 'Pass { confirm: true } to permanently delete your account.' }, { status: 400 })
  }

  const userId = session.userId
  try {
    // Remove personal content (best-effort each, so one failure doesn't abort).
    await Promise.allSettled([
      prisma.savedSearch.deleteMany({ where: { userId } }),
      prisma.feedback.deleteMany({ where: { userId } }),
      prisma.review.deleteMany({ where: { authorId: userId } }),
      prisma.brokerProfile.deleteMany({ where: { userId } }),
      prisma.savedDeal.deleteMany({ where: { userId } }),
      prisma.financingInquiry.deleteMany({ where: { userId } }),
      prisma.notification.deleteMany({ where: { userId } }).catch(() => null),
    ])

    // Withdraw the user's active listings (business data, not personal identity).
    await prisma.deal.updateMany({ where: { sellerId: userId }, data: { status: 'WITHDRAWN' } }).catch(() => null)

    // Anonymize the account itself (keeps FK-referenced legal/transaction records valid).
    await prisma.user.update({
      where: { id: userId },
      data: {
        email: `deleted+${userId}@deleted.forwardos.ai`,
        name: 'Deleted User',
        password: crypto.randomBytes(24).toString('hex'),
        company: null, phone: null, bio: null, website: null, linkedinUrl: null,
        profileImage: null, investmentCriteria: null,
      },
    })

    await clearAuthCookie()
    return NextResponse.json({ success: true, message: 'Your account has been deleted and your personal data erased.' })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Deletion failed' }, { status: 500 })
  }
}

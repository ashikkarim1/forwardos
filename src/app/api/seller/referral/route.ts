/**
 * GET /api/seller/referral?userId=...
 *
 * Returns the seller's referral code + the count of referrals + the share URL.
 * Lazily generates a code if the user doesn't have one yet.
 */
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId')
    if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 })

    let user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, referralCode: true },
    })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    if (!user.referralCode) {
      const code = crypto.createHash('sha256').update(user.id + 'forward2026').digest('hex').slice(0, 24)
      user = await prisma.user.update({
        where: { id: userId },
        data: { referralCode: code },
        select: { id: true, email: true, referralCode: true },
      })
    }

    const count = await prisma.user.count({ where: { referredById: userId } })
    const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.forwardos.ai'

    return NextResponse.json({
      referralCode: user.referralCode,
      referralUrl: `${base}/list?ref=${user.referralCode}`,
      referralCount: count,
      reward: '3 months Premium free for both of you when your referral lists a business',
    })
  } catch (e) {
    console.error('[API] referral error:', e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

/**
 * POST /api/deals/mark-sold
 *
 * Flip a deal to CLOSED and trigger the follower-notification loop. Two
 * gates: CRON_SECRET for cron-driven flips, ADMIN role for manual flips
 * from the dashboard. Either gate alone is sufficient.
 */
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { notifySoldFollowers } from '@/lib/services/sold-notifications'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const auth = request.headers.get('authorization') || ''
    const expected = `Bearer ${process.env.CRON_SECRET}`
    const isCron = !!process.env.CRON_SECRET && auth === expected

    const { dealId, testEmail } = await request.json()
    if (!dealId) return NextResponse.json({ error: 'dealId required' }, { status: 400 })

    if (!isCron) {
      // No admin session middleware in this app yet — gate manual flips behind
      // the same CRON_SECRET for now. (Replace with role check when auth lands.)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const deal = await prisma.deal.findUnique({ where: { id: dealId }, select: { status: true } })
    if (!deal) return NextResponse.json({ error: 'Deal not found' }, { status: 404 })

    if (deal.status !== 'CLOSED') {
      await prisma.deal.update({
        where: { id: dealId },
        data: { status: 'CLOSED', closedAt: new Date() },
      })
    }

    const result = await notifySoldFollowers(dealId, testEmail ? { toOverride: testEmail } : {})
    return NextResponse.json({ success: true, ...result })
  } catch (e) {
    console.error('[mark-sold] error:', e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

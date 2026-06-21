/**
 * GET /api/dashboard/counts?role=buyer|seller|broker
 *
 * Returns the real, signed-in user's counters for their dashboard
 * stat cards. Lets us replace hardcoded mockDeals.length numbers
 * (which would have shown "5 Active Deals" to a brand-new user who
 * just signed up — exactly the kind of thing a hostile press demo
 * would screenshot).
 *
 * Falls back to zeros on any DB error. Never echoes mock numbers.
 */
import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

interface BuyerCounts  { savedDeals: number; activeEnquiries: number; pendingDataRoomRequests: number; unreadMessages: number }
interface SellerCounts { publishedDeals: number; pendingDeals: number; totalViews: number; pendingDataRoomRequests: number; unreadMessages: number; totalEnquiries: number }
interface BrokerCounts { clientDeals: number; pendingApprovals: number; activeEnquiries: number; unreadMessages: number }

export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ counts: null }, { status: 401 })

  const role = req.nextUrl.searchParams.get('role') || 'buyer'

  try {
    if (role === 'seller' || role === 'broker') {
      type DealRow = { id: string; status: string; viewCount: number }
      type EnqRow = { status: string }
      const myDeals: DealRow[] = await prisma.deal.findMany({
        where: { sellerId: session.userId },
        select: { id: true, status: true, viewCount: true },
      }).catch(() => [] as DealRow[]) as DealRow[]
      const dealIds = myDeals.map((d) => d.id)

      const [enquiries, unreadMessages] = await Promise.all([
        prisma.enquiry.findMany({
          where: { dealId: { in: dealIds } },
          select: { status: true },
        }).catch(() => [] as EnqRow[]) as Promise<EnqRow[]>,
        prisma.message.count({
          where: { recipientId: session.userId, isRead: false },
        }).catch(() => 0),
      ])

      if (role === 'broker') {
        const counts: BrokerCounts = {
          clientDeals: myDeals.filter((d) => d.status === 'PUBLISHED' || d.status === 'ACTIVE').length,
          pendingApprovals: enquiries.filter((e) => e.status === 'pending').length,
          activeEnquiries: enquiries.filter((e) => e.status === 'responded').length,
          unreadMessages,
        }
        return NextResponse.json({ counts })
      }

      const counts: SellerCounts = {
        publishedDeals: myDeals.filter((d) => d.status === 'PUBLISHED' || d.status === 'ACTIVE').length,
        pendingDeals:   myDeals.filter((d) => d.status === 'DRAFT').length,
        totalViews:     myDeals.reduce((s, d) => s + (d.viewCount ?? 0), 0),
        pendingDataRoomRequests: enquiries.filter((e) => e.status === 'pending').length,
        unreadMessages,
        totalEnquiries: enquiries.length,
      }
      return NextResponse.json({ counts })
    }

    // Buyer
    type EnqRow = { status: string }
    const [savedCount, enquiriesOnRecord, unreadMessages] = await Promise.all([
      prisma.savedDeal.count({ where: { userId: session.userId } }).catch(() => 0),
      prisma.enquiry.findMany({
        where: { inquirerId: session.userId },
        select: { status: true },
      }).catch(() => [] as EnqRow[]) as Promise<EnqRow[]>,
      prisma.message.count({
        where: { recipientId: session.userId, isRead: false },
      }).catch(() => 0),
    ])
    const counts: BuyerCounts = {
      savedDeals: savedCount,
      activeEnquiries: enquiriesOnRecord.filter((e) => e.status === 'responded').length,
      pendingDataRoomRequests: enquiriesOnRecord.filter((e) => e.status === 'pending').length,
      unreadMessages,
    }
    return NextResponse.json({ counts })
  } catch {
    return NextResponse.json({ counts: null }, { status: 500 })
  }
}

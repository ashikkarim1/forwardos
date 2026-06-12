/**
 * POST /api/seller/listing-visibility
 *
 * Lets the seller flip a listing between confidential (anonymous) and public
 * identity-revealed. Verifies the seller owns the deal.
 */
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isSameOrigin } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  try {
    if (!isSameOrigin(request)) {
      return NextResponse.json({ error: 'Cross-origin blocked' }, { status: 403 })
    }
    const { dealId, userId, isConfidential } = await request.json()
    if (!dealId || !userId || typeof isConfidential !== 'boolean') {
      return NextResponse.json({ error: 'dealId, userId, isConfidential required' }, { status: 400 })
    }

    const deal = await prisma.deal.findUnique({
      where: { id: dealId },
      select: { sellerId: true },
    })
    if (!deal) return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
    if (deal.sellerId !== userId) return NextResponse.json({ error: 'Not your listing' }, { status: 403 })

    await prisma.deal.update({
      where: { id: dealId },
      data: { isConfidential },
    })

    return NextResponse.json({ success: true, isConfidential })
  } catch (e) {
    console.error('[API] listing-visibility error:', e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

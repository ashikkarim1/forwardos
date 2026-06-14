/**
 * GET /api/notifications/open?u=<userId>&s=<sendId>&t=<sig>
 *
 * 1×1 transparent GIF that fires on email open. Updates the user's
 * lastEmailEngagedAt — that's the timestamp the send-window's
 * engagement-decay logic reads to decide whether to step a user down
 * from INSTANT/DAILY to WEEKLY (no opens in 14 days → step down).
 *
 * Always returns a 200 + valid GIF, even on signature failure or DB
 * error. Tracking pixels must never visibly break the email.
 */
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyTrackingToken } from '@/lib/notifications/tracking'
import { recordEngagement } from '@/lib/notifications/preferences'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// 1×1 transparent GIF, base64.
const PIXEL = Buffer.from(
  'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
  'base64',
)

function pixelResponse(): NextResponse {
  return new NextResponse(PIXEL, {
    status: 200,
    headers: {
      'Content-Type': 'image/gif',
      'Content-Length': PIXEL.length.toString(),
      // No-cache so a Gmail-style image proxy doesn't single-fire then
      // skip subsequent opens — we want every render to land.
      'Cache-Control': 'no-store, max-age=0, must-revalidate',
      'Pragma': 'no-cache',
    },
  })
}

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('u') || ''
  const sendId = req.nextUrl.searchParams.get('s') || ''
  const token  = req.nextUrl.searchParams.get('t') || ''

  // Fire-and-forget the engagement update; never block the pixel.
  void (async () => {
    try {
      if (!userId || !sendId || !token) return
      if (!verifyTrackingToken(userId, sendId, token)) return
      // User must still exist.
      const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true } })
      if (!user) return
      await recordEngagement(userId)
    } catch {
      // Pixel must never break — swallow any failure here.
    }
  })()

  return pixelResponse()
}

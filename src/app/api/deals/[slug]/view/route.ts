/**
 * POST /api/deals/[slug]/view — bump the viewCount on a listing.
 *
 * Called from /listing/[slug] on mount. Anonymous, rate-limited per-IP per
 * deal to prevent obvious abuse (refresh-spam). Best-effort: failure is
 * silent — view counters are nice-to-have, not load-bearing.
 *
 * The viewCount appears on /admin/listings, the seller dashboard analytics,
 * and any "Heat" computation that needs raw demand input.
 */
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { rateLimit, clientIp } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest, { params }: { params: { slug: string } }) {
  const slug = params.slug
  if (!slug) return NextResponse.json({ ok: true })   // no-op

  // 1 view per IP per slug per 5 min — generous enough for real usage,
  // strict enough to make refresh-spamming pointless.
  const rl = rateLimit(`view:${slug}:${clientIp(req)}`, 1, 5 * 60_000)
  if (!rl.ok) return NextResponse.json({ ok: true, throttled: true })

  try {
    await prisma.deal.updateMany({
      where: { slug },
      data: { viewCount: { increment: 1 } },
    })
  } catch (err) {
    console.error('[view] failed:', err)
  }
  return NextResponse.json({ ok: true })
}

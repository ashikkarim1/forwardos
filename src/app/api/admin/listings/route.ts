/**
 * GET /api/admin/listings — moderation feed for /admin/listings.
 *
 * Returns every Deal regardless of status so admins can review, approve,
 * flag, and reject. Admin-only — middleware + layout guards enforce role.
 * This endpoint additionally verifies role === 'ADMIN' so a stray client
 * can't pull the moderation feed even if it somehow reaches the route.
 *
 * Each row is shaped to match the AdminListing interface in the admin
 * page; if you add a column there, add the field here too.
 */
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export const dynamic = 'force-dynamic'

function fmtUSD(cents: bigint | number | null): string {
  if (cents == null) return '—'
  const n = typeof cents === 'bigint' ? Number(cents) / 100 : cents
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `$${Math.round(n / 1_000)}K`
  return `$${Math.round(n)}`
}

// Map Deal.status (ACTIVE/PUBLISHED/DRAFT/etc) → moderation status.
function moderationStatus(status: string): 'approved' | 'pending' | 'flagged' | 'rejected' {
  switch (status) {
    case 'ACTIVE':
    case 'PUBLISHED':
      return 'approved'
    case 'DRAFT':
    case 'UNDER_REVIEW':
      return 'pending'
    case 'FLAGGED':
      return 'flagged'
    case 'REJECTED':
    case 'REMOVED':
      return 'rejected'
    default:
      return 'pending'
  }
}

function tierFromDealPlan(plan: string | null | undefined): 'premium' | 'standard' | 'free' {
  if (plan === 'PREMIUM') return 'premium'
  if (plan === 'BASIC') return 'standard'
  return 'free'
}

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Sign in required.' }, { status: 401 })
  if (session.role !== 'ADMIN') return NextResponse.json({ error: 'Admins only.' }, { status: 403 })

  try {
    const rows = await prisma.deal.findMany({
      orderBy: { updatedAt: 'desc' },
      take: 500,
      include: {
        seller: { select: { name: true, email: true } },
      },
    })

    const listings = rows.map((d) => ({
      id: d.id,
      name: d.title || `Listing ${d.id.slice(-6)}`,
      location: [d.city, d.country].filter(Boolean).join(', ') || d.country || '—',
      owner: d.seller?.name || d.seller?.email || 'Unknown',
      status: moderationStatus(d.status),
      tier: tierFromDealPlan(d.dealPlan as string | null),
      revenue: fmtUSD(d.revenue),
      valuation: fmtUSD(d.askingPrice),
      views: d.viewCount ?? 0,
      saves: d.savedCount ?? 0,
      featured: d.dealPlan === 'PREMIUM',
      flagReason: undefined as string | undefined,
    }))

    return NextResponse.json({ listings })
  } catch (err) {
    console.error('[API] admin listings error:', err)
    return NextResponse.json({ error: 'Failed to load listings.' }, { status: 500 })
  }
}

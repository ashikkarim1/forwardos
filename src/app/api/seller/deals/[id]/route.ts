/**
 * Per-deal lifecycle API for sellers + brokers.
 *
 *   GET  /api/seller/deals/[id]                — load deal (owner only)
 *   PATCH /api/seller/deals/[id]               — edit fields
 *   POST /api/seller/deals/[id]/action         — { action: 'unlist' | 'relist' | 'sold' | 'cancel' | 'upgrade' | 'downgrade' }
 *
 * Status transitions:
 *   ACTIVE / PUBLISHED  → ARCHIVED  (unlist; no charges accrue while unlisted)
 *   ARCHIVED            → ACTIVE    (relist)
 *   ACTIVE / PUBLISHED  → CLOSED    (sold — adds to deals-closed page when threshold met)
 *   any                 → WITHDRAWN (cancel — permanent for this listing)
 *
 * dealPlan transitions (per-listing upgrade):
 *   BASIC   → PREMIUM (upgrade — Forward bills, sets dealPlanActiveUntil)
 *   PREMIUM → BASIC   (downgrade — keeps current paid window; doesn't accrue further)
 *
 * Authorization: must be the deal's seller. Admins also allowed.
 */
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { isSameOrigin } from '@/lib/rate-limit'
import { notifySoldFollowers } from '@/lib/services/sold-notifications'
import { logAudit } from '@/lib/audit'

const VALID_ACTIONS = new Set(['unlist', 'relist', 'sold', 'cancel', 'upgrade', 'downgrade'])

async function loadOwnedDeal(dealId: string) {
  const session = await getSession()
  if (!session) return { error: 'Unauthorized', status: 401 as const }
  const deal = await prisma.deal.findUnique({
    where: { id: dealId },
    select: {
      id: true, sellerId: true, status: true, dealPlan: true,
      dealPlanActiveUntil: true, slug: true, title: true,
    },
  })
  if (!deal) return { error: 'Listing not found', status: 404 as const }
  if (deal.sellerId !== session.userId && session.role !== 'ADMIN') {
    return { error: 'Not your listing', status: 403 as const }
  }
  return { deal, session }
}

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  const res = await loadOwnedDeal(params.id)
  if ('error' in res) return NextResponse.json({ error: res.error }, { status: res.status })
  return NextResponse.json({ deal: res.deal })
}

interface PatchBody {
  description?: string
  city?: string
  reasonForSale?: string
  keyStrengths?: string[]
  growthOpportunities?: string[]
  riskFactors?: string[]
  isConfidential?: boolean
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: 'Cross-origin blocked' }, { status: 403 })
  const res = await loadOwnedDeal(params.id)
  if ('error' in res) return NextResponse.json({ error: res.error }, { status: res.status })

  const body = (await request.json().catch(() => ({}))) as PatchBody
  const data: Record<string, unknown> = {}
  if (typeof body.description === 'string') data.description = body.description.slice(0, 8000)
  if (typeof body.city === 'string') data.city = body.city.slice(0, 80)
  if (typeof body.reasonForSale === 'string') data.reasonForSale = body.reasonForSale.slice(0, 500)
  if (Array.isArray(body.keyStrengths)) data.keyStrengths = JSON.stringify(body.keyStrengths.slice(0, 10).map(String))
  if (Array.isArray(body.growthOpportunities)) data.growthOpportunities = JSON.stringify(body.growthOpportunities.slice(0, 10).map(String))
  if (Array.isArray(body.riskFactors)) data.riskFactors = JSON.stringify(body.riskFactors.slice(0, 10).map(String))
  if (typeof body.isConfidential === 'boolean') data.isConfidential = body.isConfidential

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: 'Nothing to update' }, { status: 400 })
  }
  await prisma.deal.update({ where: { id: res.deal.id }, data })
  return NextResponse.json({ success: true })
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: 'Cross-origin blocked' }, { status: 403 })
  const res = await loadOwnedDeal(params.id)
  if ('error' in res) return NextResponse.json({ error: res.error }, { status: res.status })
  const deal = res.deal

  const { action } = (await request.json().catch(() => ({}))) as { action?: string }
  if (!action || !VALID_ACTIONS.has(action)) {
    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  }

  // One audit row per lifecycle action — gives compliance a single timeline
  // per deal. Resolved before the switch so we don't repeat it.
  const session = await getSession()
  await logAudit({
    req: request, userId: session?.userId ?? null,
    action: `deal.${action}`,
    resourceType: 'deal', resourceId: deal.id,
    changes: { before: { status: deal.status, dealPlan: deal.dealPlan } },
  })

  switch (action) {
    case 'unlist': {
      if (deal.status === 'CLOSED' || deal.status === 'WITHDRAWN') {
        return NextResponse.json({ error: `Listing is ${deal.status.toLowerCase()} and can't be unlisted.` }, { status: 400 })
      }
      await prisma.deal.update({ where: { id: deal.id }, data: { status: 'ARCHIVED' } })
      return NextResponse.json({ success: true, status: 'ARCHIVED', note: 'No charges accrue while unlisted.' })
    }

    case 'relist': {
      if (deal.status !== 'ARCHIVED' && deal.status !== 'WITHDRAWN') {
        return NextResponse.json({ error: 'This listing is already live.' }, { status: 400 })
      }
      await prisma.deal.update({ where: { id: deal.id }, data: { status: 'ACTIVE', publishedAt: new Date() } })
      return NextResponse.json({ success: true, status: 'ACTIVE' })
    }

    case 'sold': {
      if (deal.status === 'CLOSED') return NextResponse.json({ success: true, status: 'CLOSED' })
      await prisma.deal.update({ where: { id: deal.id }, data: { status: 'CLOSED', closedAt: new Date() } })
      // Anonymized follower notification + add to deals-closed log.
      const notify = await notifySoldFollowers(deal.id).catch((e) => {
        console.error('[seller/deals/sold] notify failed', e)
        return { sent: 0, followers: 0 }
      })
      return NextResponse.json({ success: true, status: 'CLOSED', notified: notify })
    }

    case 'cancel': {
      // Permanent withdrawal for THIS listing; doesn't affect seller's account.
      await prisma.deal.update({ where: { id: deal.id }, data: { status: 'WITHDRAWN' } })
      return NextResponse.json({ success: true, status: 'WITHDRAWN' })
    }

    case 'upgrade': {
      // Move to PREMIUM tier for 30 days. Stripe checkout flow lives at
      // /api/billing/checkout?tier=SELLER_PREMIUM&dealId=…; this endpoint is
      // the post-payment activator (idempotent if already on premium).
      if (deal.dealPlan === 'PREMIUM' && deal.dealPlanActiveUntil && deal.dealPlanActiveUntil > new Date()) {
        return NextResponse.json({ success: true, dealPlan: 'PREMIUM', alreadyPremium: true })
      }
      const activeUntil = new Date(Date.now() + 30 * 24 * 60 * 60_000)
      await prisma.deal.update({
        where: { id: deal.id },
        data: { dealPlan: 'PREMIUM', dealPlanActiveUntil: activeUntil },
      })
      return NextResponse.json({ success: true, dealPlan: 'PREMIUM', activeUntil })
    }

    case 'downgrade': {
      // Don't void the current paid window; just stop accruing. Returns to
      // BASIC once dealPlanActiveUntil passes.
      await prisma.deal.update({ where: { id: deal.id }, data: { dealPlan: 'BASIC' } })
      return NextResponse.json({ success: true, dealPlan: 'BASIC', keepUntil: deal.dealPlanActiveUntil })
    }
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}

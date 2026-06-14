/**
 * POST /api/admin/listings/[id]/status — moderate a listing.
 *
 * Admin-only. Updates Deal.status based on the moderation action and writes
 * an AuditLog row so /admin/activity shows who did what, when, to whom.
 *
 * Body:
 *   { action: "approve" | "reject" | "flag" | "pending", note?: string }
 *
 * The note (if any) is captured in the audit log's `changes` field so
 * compliance can review the moderator's rationale.
 *
 * Status mapping:
 *   approve → ACTIVE     (visible on marketplace)
 *   reject  → ARCHIVED   (hidden, with audit reason "rejected")
 *   flag    → ARCHIVED   (hidden, audit captures the flag rationale)
 *   pending → DRAFT      (back to queue)
 *
 * Schema-shape: Deal status doesn't have explicit FLAGGED / REJECTED values
 * today; we capture the semantic via the audit action and the `changes`
 * field rather than expanding the enum (no migration needed).
 */
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { logAudit } from '@/lib/audit'

export const dynamic = 'force-dynamic'

type ModAction = 'approve' | 'reject' | 'flag' | 'pending'

const ACTION_TO_STATUS: Record<ModAction, 'ACTIVE' | 'ARCHIVED' | 'DRAFT'> = {
  approve: 'ACTIVE',
  reject:  'ARCHIVED',
  flag:    'ARCHIVED',
  pending: 'DRAFT',
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Sign in required.' }, { status: 401 })
  if (session.role !== 'ADMIN') return NextResponse.json({ error: 'Admins only.' }, { status: 403 })

  const dealId = params.id
  if (!dealId) return NextResponse.json({ error: 'Listing id missing.' }, { status: 400 })

  const body = await req.json().catch(() => ({}))
  const action = String(body?.action ?? '') as ModAction
  const note = typeof body?.note === 'string' ? body.note.slice(0, 500) : null

  if (!ACTION_TO_STATUS[action]) {
    return NextResponse.json(
      { error: `Unknown action "${action}". Use approve, reject, flag, or pending.` },
      { status: 400 },
    )
  }

  try {
    const existing = await prisma.deal.findUnique({
      where: { id: dealId },
      select: { id: true, status: true, sellerId: true, title: true },
    })
    if (!existing) return NextResponse.json({ error: 'Listing not found.' }, { status: 404 })

    const nextStatus = ACTION_TO_STATUS[action]
    await prisma.deal.update({
      where: { id: dealId },
      data: { status: nextStatus },
    })

    await logAudit({
      req,
      userId: session.userId,
      action: `admin.listing.${action}`,
      resourceType: 'deal',
      resourceId: dealId,
      changes: {
        before: { status: existing.status },
        after:  { status: nextStatus },
        note,
        sellerId: existing.sellerId,
        title: existing.title,
      },
    })

    return NextResponse.json({
      success: true,
      id: dealId,
      status: nextStatus,
      moderationStatus: action === 'approve' ? 'approved'
        : action === 'reject'  ? 'rejected'
        : action === 'flag'    ? 'flagged'
        : 'pending',
    })
  } catch (err) {
    console.error('[API] admin listing moderate error:', err)
    return NextResponse.json({ error: 'Failed to update listing.' }, { status: 500 })
  }
}

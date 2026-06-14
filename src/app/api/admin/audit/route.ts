/**
 * GET /api/admin/audit — paginated audit-log feed for /admin/activity.
 *
 * Admin-only. Returns the most recent AuditLog rows, optionally filtered
 * by action prefix (e.g. `?action=stripe.` for billing events). Designed
 * for compliance review — "who did what, when, to whom."
 *
 *   ?action=stripe.       // prefix filter
 *   ?resourceType=deal    // exact resource type
 *   ?take=100             // up to 500
 */
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Sign in required.' }, { status: 401 })
  if (session.role !== 'ADMIN') return NextResponse.json({ error: 'Admins only.' }, { status: 403 })

  const url = req.nextUrl
  const actionPrefix = url.searchParams.get('action') ?? undefined
  const resourceType = url.searchParams.get('resourceType') ?? undefined
  const takeRaw = Number(url.searchParams.get('take') ?? '200')
  const take = Math.min(Math.max(takeRaw || 200, 1), 500)

  try {
    const rows = await prisma.auditLog.findMany({
      where: {
        ...(actionPrefix ? { action: { startsWith: actionPrefix } } : {}),
        ...(resourceType ? { resourceType } : {}),
      },
      orderBy: { createdAt: 'desc' },
      take,
    })

    // Best-effort hydrate of the actor's email so the UI can show a human.
    const userIds = Array.from(new Set(rows.map((r) => r.userId).filter((u): u is string => Boolean(u))))
    const users = userIds.length
      ? await prisma.user.findMany({ where: { id: { in: userIds } }, select: { id: true, email: true, name: true } })
      : []
    const byId = new Map(users.map((u) => [u.id, u]))

    const entries = rows.map((r) => ({
      id: r.id,
      action: r.action,
      resourceType: r.resourceType,
      resourceId: r.resourceId,
      userId: r.userId,
      actor: r.userId ? (byId.get(r.userId)?.name || byId.get(r.userId)?.email || r.userId) : 'system',
      changes: r.changes,
      ipAddress: r.ipAddress,
      userAgent: r.userAgent,
      createdAt: r.createdAt.toISOString(),
    }))

    return NextResponse.json({ entries })
  } catch (err) {
    console.error('[API] admin audit error:', err)
    return NextResponse.json({ error: 'Failed to load audit log.' }, { status: 500 })
  }
}

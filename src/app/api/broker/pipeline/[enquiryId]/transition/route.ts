/**
 * POST /api/broker/pipeline/[enquiryId]/transition
 * Body: { action: 'mark-contacted' | 'mark-closed' | 'reopen' }
 *
 * Manual stage transitions a broker can drive from the Kanban. The
 * NDA / data-room / diligence transitions stay auto-derived from
 * buyer-side signals — only the bookend transitions are manually
 * settable (move out of NEW once you've replied, mark CLOSED when
 * the deal is dead, or reopen a wrongly-closed one).
 *
 * Authz: deal owner (broker == seller in our SMB model) OR ADMIN.
 * Returns 403 otherwise. Always audit-logs.
 */
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { logAudit } from '@/lib/audit'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const BodySchema = z.object({
  action: z.enum(['mark-contacted', 'mark-closed', 'reopen']),
})

export async function POST(req: NextRequest, { params }: { params: { enquiryId: string } }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const parsed = BodySchema.safeParse(await req.json().catch(() => ({})))
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const enquiry = await prisma.enquiry.findUnique({
    where: { id: params.enquiryId },
    select: { id: true, status: true, dealId: true, deal: { select: { sellerId: true } } },
  })
  if (!enquiry) return NextResponse.json({ error: 'not_found' }, { status: 404 })

  const me = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { role: true },
  })
  const isOwner = enquiry.deal.sellerId === session.userId
  const isAdmin = me?.role === 'ADMIN'
  if (!isOwner && !isAdmin) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  let newStatus: string
  switch (parsed.data.action) {
    case 'mark-contacted': newStatus = 'responded'; break
    case 'mark-closed':    newStatus = 'closed';    break
    case 'reopen':         newStatus = 'pending';   break
  }

  await prisma.enquiry.update({
    where: { id: enquiry.id },
    data: {
      status: newStatus,
      respondedAt: parsed.data.action === 'mark-closed' || parsed.data.action === 'mark-contacted'
        ? new Date() : null,
    },
  })

  await logAudit({
    req, userId: session.userId,
    action: `pipeline.${parsed.data.action}`,
    resourceType: 'enquiry', resourceId: enquiry.id,
    changes: { from: enquiry.status, to: newStatus, dealId: enquiry.dealId },
  })

  return NextResponse.json({ ok: true, status: newStatus })
}

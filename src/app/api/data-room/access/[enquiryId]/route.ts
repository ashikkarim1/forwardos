/**
 * POST /api/data-room/access/[enquiryId]
 * Body: { action: 'approve' | 'decline' | 'request-info', message?: string }
 *
 * Real approval/decline endpoint for data room access requests. Replaces
 * the previous confirm() + alert() mock pattern in the seller and broker
 * dashboards — those buttons now persist the decision, log it for audit,
 * and notify the buyer via email.
 *
 * Authz:
 *   - Only the deal's seller (or a BROKER user delegated to that deal,
 *     or ADMIN) can approve/decline.
 *   - Returns 403 if the caller doesn't own the deal.
 *
 * Side effects on approve:
 *   - DataRoomAccess row created (or its existing one promoted to APPROVED).
 *   - Enquiry.status → 'responded'.
 *   - Buyer email — uses the existing email service.
 *   - AuditLog row written.
 *
 * Side effects on decline:
 *   - Enquiry.status → 'closed'.
 *   - Optional decline reason saved as Enquiry.response.
 *   - Buyer email.
 *   - AuditLog row written.
 *
 * request-info:
 *   - No state change. Just records the message in Enquiry.response, sends
 *     it as an email so the buyer can reply.
 */
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { sendEmail } from '@/lib/services/email'
import { logAudit } from '@/lib/audit'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const BodySchema = z.object({
  action:  z.enum(['approve', 'decline', 'request-info']),
  message: z.string().max(2000).optional(),
})

export async function POST(req: NextRequest, { params }: { params: { enquiryId: string } }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const parsed = BodySchema.safeParse(await req.json().catch(() => ({})))
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  const { action, message } = parsed.data

  const enquiry = await prisma.enquiry.findUnique({
    where: { id: params.enquiryId },
    include: {
      deal: { select: { id: true, sellerId: true, title: true, slug: true } },
      inquirer: { select: { id: true, email: true, name: true } },
    },
  })
  if (!enquiry) return NextResponse.json({ error: 'not_found' }, { status: 404 })

  // Authz: deal owner, ADMIN, or a broker delegated to this deal.
  const me = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, role: true },
  })
  const isOwner = enquiry.deal.sellerId === session.userId
  const isAdmin = me?.role === 'ADMIN'
  let isDelegatedBroker = false
  if (!isOwner && !isAdmin && me?.role === 'BROKER') {
    const delegations = await prisma.brokerDelegation.findMany({
      where: { brokerId: session.userId, isActive: true },
      select: { dealIds: true },
    })
    isDelegatedBroker = delegations.some((d) => {
      try {
        const arr = JSON.parse(d.dealIds) as string[]
        return Array.isArray(arr) && arr.includes(enquiry.deal.id)
      } catch { return false }
    })
  }
  if (!isOwner && !isAdmin && !isDelegatedBroker) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  const site = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.forwardos.ai'
  const listingHref = `${site}/listing/${enquiry.deal.slug || enquiry.deal.id}`

  if (action === 'approve') {
    // Find-or-create the DataRoom for this deal, then upsert the access.
    const room = await prisma.dataRoom.upsert({
      where: { dealId: enquiry.deal.id },
      update: {},
      create: { dealId: enquiry.deal.id, sellerId: enquiry.deal.sellerId, title: `${enquiry.deal.title} Data Room` },
    })
    await prisma.dataRoomAccess.upsert({
      where: { dataRoomId_userId: { dataRoomId: room.id, userId: enquiry.inquirerId } },
      update: { accessLevel: 'INITIAL_INFO', approvedAt: new Date() },
      create: {
        dataRoomId: room.id,
        userId: enquiry.inquirerId,
        accessLevel: 'INITIAL_INFO',
        approvedAt: new Date(),
      },
    })
    await prisma.enquiry.update({
      where: { id: enquiry.id },
      data: { status: 'responded', respondedAt: new Date(), response: message ?? 'Access approved.' },
    })

    void sendEmail({
      to: enquiry.inquirer.email,
      subject: `Data room access approved — ${enquiry.deal.title}`,
      html: simpleEmail({
        title: 'Access approved',
        body: `Your data room access request for <strong>${escape(enquiry.deal.title)}</strong> has been approved. Sign in to Forward to enter.${message ? `<br><br><em>Note from the seller:</em> ${escape(message)}` : ''}`,
        ctaLabel: 'Open data room', ctaHref: `${site}/data-rooms`,
        listingHref,
      }),
    })

    await logAudit({
      req, userId: session.userId,
      action: 'data_room.approve',
      resourceType: 'enquiry', resourceId: enquiry.id,
      changes: { dealId: enquiry.deal.id, buyerId: enquiry.inquirerId },
    })
    return NextResponse.json({ ok: true })
  }

  if (action === 'decline') {
    await prisma.enquiry.update({
      where: { id: enquiry.id },
      data: { status: 'closed', respondedAt: new Date(), response: message ?? 'Access declined.' },
    })

    void sendEmail({
      to: enquiry.inquirer.email,
      subject: `Update on your inquiry — ${enquiry.deal.title}`,
      html: simpleEmail({
        title: 'Inquiry update',
        body: `The seller has reviewed your data room access request for <strong>${escape(enquiry.deal.title)}</strong> and is unable to proceed at this time.${message ? `<br><br><em>Note from the seller:</em> ${escape(message)}` : ''}<br><br>You can keep browsing similar opportunities on Forward.`,
        ctaLabel: 'Browse marketplace', ctaHref: `${site}/marketplace`,
        listingHref,
      }),
    })

    await logAudit({
      req, userId: session.userId,
      action: 'data_room.decline',
      resourceType: 'enquiry', resourceId: enquiry.id,
      changes: { dealId: enquiry.deal.id, buyerId: enquiry.inquirerId },
    })
    return NextResponse.json({ ok: true })
  }

  // action === 'request-info'
  await prisma.enquiry.update({
    where: { id: enquiry.id },
    data: { response: message ?? 'Seller has requested more information.' },
  })
  void sendEmail({
    to: enquiry.inquirer.email,
    subject: `The seller has a question — ${enquiry.deal.title}`,
    html: simpleEmail({
      title: 'A question from the seller',
      body: `Before processing your data room access on <strong>${escape(enquiry.deal.title)}</strong>, the seller would like to ask:${message ? `<br><br><blockquote style="margin:12px 0;padding:8px 14px;border-left:3px solid #8C6D45">${escape(message)}</blockquote>` : ''}<br>Reply via Forward Messages to keep the conversation tied to the listing.`,
      ctaLabel: 'Reply on Forward', ctaHref: `${site}/messages`,
      listingHref,
    }),
  })
  await logAudit({
    req, userId: session.userId,
    action: 'data_room.request_info',
    resourceType: 'enquiry', resourceId: enquiry.id,
    changes: { dealId: enquiry.deal.id, buyerId: enquiry.inquirerId },
  })
  return NextResponse.json({ ok: true })
}

function escape(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!))
}

function simpleEmail({ title, body, ctaLabel, ctaHref, listingHref }: { title: string; body: string; ctaLabel: string; ctaHref: string; listingHref: string }): string {
  return `<!DOCTYPE html><html><body style="font-family:-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#0F1419;background:#FAF6EF">
    <div style="background:#fff;border:1px solid #E8EAED;border-radius:12px;padding:32px">
      <p style="font-size:11px;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:#8C6D45;margin:0 0 8px">Forward Intelligence</p>
      <h1 style="font-size:22px;font-weight:800;color:#0F1419;margin:0 0 12px">${escape(title)}</h1>
      <p style="font-size:14px;color:#454D58;line-height:1.55;margin:0 0 20px">${body}</p>
      <p style="margin:0 0 8px"><a href="${ctaHref}" style="display:inline-block;padding:10px 18px;background:#0F1419;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;font-size:14px">${escape(ctaLabel)}</a></p>
      <p style="margin:16px 0 0;font-size:12px;color:#6C7480">Listing: <a href="${listingHref}" style="color:#8C6D45">${escape(listingHref)}</a></p>
    </div>
  </body></html>`
}

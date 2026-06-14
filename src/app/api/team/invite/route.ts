/**
 * POST /api/team/invite — invite a teammate by email
 * Body: { email, role? = 'MEMBER' }
 *
 * Only OWNER or ADMIN can invite. Creates a TeamInvite row with a one-time
 * token; the invitee accepts via /settings/team/accept?token=...
 *
 * Email delivery is best-effort — failure is logged but does not roll back
 * the invite (the link still works if shared out-of-band).
 */
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { sendEmail } from '@/lib/services/email'
import { logAudit } from '@/lib/audit'
import crypto from 'crypto'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Sign in required.' }, { status: 401 })

  const membership = await prisma.teamMember.findFirst({ where: { userId: session.userId } })
  if (!membership) return NextResponse.json({ error: 'Create a team first.' }, { status: 400 })
  if (membership.role !== 'OWNER' && membership.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Only owners and admins can invite.' }, { status: 403 })
  }

  const body = await req.json().catch(() => ({}))
  const email = String(body?.email ?? '').trim().toLowerCase()
  const role = body?.role === 'ADMIN' ? 'ADMIN' : 'MEMBER'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Valid email required.' }, { status: 400 })
  }

  // Don't re-invite an existing teammate or duplicate a pending invite.
  const existingMember = await prisma.user.findUnique({ where: { email }, select: { id: true } })
  if (existingMember) {
    const already = await prisma.teamMember.findFirst({
      where: { teamId: membership.teamId, userId: existingMember.id },
    })
    if (already) return NextResponse.json({ error: 'That user is already on your team.' }, { status: 409 })
  }
  const pending = await prisma.teamInvite.findFirst({
    where: { teamId: membership.teamId, email, acceptedAt: null, expiresAt: { gt: new Date() } },
  })
  if (pending) return NextResponse.json({ error: 'An invite is already pending for that email.' }, { status: 409 })

  const token = crypto.randomBytes(24).toString('hex')
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60_000)
  const invite = await prisma.teamInvite.create({
    data: { teamId: membership.teamId, email, role, token, invitedById: session.userId, expiresAt },
  })

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.forwardos.ai'
  const acceptUrl = `${baseUrl}/settings/team/accept?token=${token}`

  sendEmail({
    to: email,
    subject: `You're invited to join a team on Forward`,
    html: `
      <!DOCTYPE html><html><body style="font-family:-apple-system,Helvetica,Arial,sans-serif;max-width:560px;margin:0 auto;padding:32px;color:#0F1419">
        <p style="font-size:11px;font-weight:700;letter-spacing:0.25em;text-transform:uppercase;color:#B8956A;margin:0 0 8px">You're invited</p>
        <h1 style="font-size:24px;line-height:1.3;margin:0 0 16px">Join a team on Forward Intelligence</h1>
        <p style="font-size:15px;line-height:1.6;color:#454D58;margin:0 0 24px">
          ${session.email} added you to their team. Click below to accept. The link expires in 7 days.
        </p>
        <p style="margin:0 0 16px"><a href="${acceptUrl}" style="background:#0F1419;color:#fff;padding:14px 24px;border-radius:8px;text-decoration:none;display:inline-block;font-weight:600">Accept invitation</a></p>
        <p style="font-size:12px;color:#6C7480;margin:24px 0 0">If the button doesn't work, paste this link in your browser:<br/><span style="word-break:break-all">${acceptUrl}</span></p>
      </body></html>`,
  }).catch((e) => console.error('[team/invite] email failed:', e))

  await logAudit({
    req, userId: session.userId, action: 'team.invite.sent',
    resourceType: 'team_invite', resourceId: invite.id,
    changes: { teamId: membership.teamId, email, role },
  })

  return NextResponse.json({ success: true, inviteId: invite.id })
}

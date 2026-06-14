/**
 * POST /api/team/accept — accept a team invite using the one-time token.
 * Body: { token }
 *
 * Requires the caller to be signed in. The invite email must match the
 * caller's user email (case-insensitive). On accept: marks the invite,
 * creates the TeamMember row, and logs an audit entry.
 */
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { logAudit } from '@/lib/audit'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Sign in first.' }, { status: 401 })

  const { token } = (await req.json().catch(() => ({}))) as { token?: string }
  if (!token) return NextResponse.json({ error: 'Token required.' }, { status: 400 })

  const invite = await prisma.teamInvite.findUnique({ where: { token } })
  if (!invite) return NextResponse.json({ error: 'Invite not found.' }, { status: 404 })
  if (invite.acceptedAt) return NextResponse.json({ error: 'Already accepted.' }, { status: 410 })
  if (invite.expiresAt < new Date()) return NextResponse.json({ error: 'Invite expired.' }, { status: 410 })
  if (invite.email.toLowerCase() !== session.email.toLowerCase()) {
    return NextResponse.json({ error: 'This invite was sent to a different email.' }, { status: 403 })
  }

  // Idempotent: if for some reason the member already exists, skip create.
  const alreadyMember = await prisma.teamMember.findFirst({
    where: { teamId: invite.teamId, userId: session.userId },
  })
  if (!alreadyMember) {
    await prisma.teamMember.create({
      data: { teamId: invite.teamId, userId: session.userId, role: invite.role },
    })
  }
  await prisma.teamInvite.update({
    where: { id: invite.id },
    data: { acceptedAt: new Date() },
  })
  await logAudit({
    req, userId: session.userId, action: 'team.invite.accepted',
    resourceType: 'team', resourceId: invite.teamId,
    changes: { inviteId: invite.id, role: invite.role },
  })

  return NextResponse.json({ success: true, teamId: invite.teamId })
}

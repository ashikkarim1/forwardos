/**
 * GET  /api/team — load the caller's team (members + pending invites)
 * POST /api/team — create a team (one-time per user). { name }
 *
 * Roles: OWNER (creator), ADMIN (delegated), MEMBER. The creator is
 * automatically added as the OWNER.
 */
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { logAudit } from '@/lib/audit'

export const dynamic = 'force-dynamic'

async function loadCallerTeam(userId: string) {
  const membership = await prisma.teamMember.findFirst({
    where: { userId },
    include: { team: true },
  })
  if (!membership) return null
  const [members, invites] = await Promise.all([
    prisma.teamMember.findMany({ where: { teamId: membership.teamId } }),
    prisma.teamInvite.findMany({
      where: { teamId: membership.teamId, acceptedAt: null, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: 'desc' },
    }),
  ])
  // Hydrate user details for each member (display name + email).
  const userIds = members.map((m) => m.userId)
  const users = userIds.length
    ? await prisma.user.findMany({ where: { id: { in: userIds } }, select: { id: true, name: true, email: true, role: true } })
    : []
  const byId = new Map(users.map((u) => [u.id, u]))
  return {
    team: { id: membership.team.id, name: membership.team.name, createdAt: membership.team.createdAt.toISOString() },
    role: membership.role,
    members: members.map((m) => ({
      id: m.id,
      userId: m.userId,
      role: m.role,
      joinedAt: m.joinedAt.toISOString(),
      name: byId.get(m.userId)?.name ?? null,
      email: byId.get(m.userId)?.email ?? null,
      forwardRole: byId.get(m.userId)?.role ?? null,
    })),
    invites: invites.map((i) => ({
      id: i.id,
      email: i.email,
      role: i.role,
      expiresAt: i.expiresAt.toISOString(),
      createdAt: i.createdAt.toISOString(),
    })),
  }
}

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Sign in required.' }, { status: 401 })
  const team = await loadCallerTeam(session.userId)
  if (!team) return NextResponse.json({ team: null })
  return NextResponse.json(team)
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Sign in required.' }, { status: 401 })

  const existing = await prisma.teamMember.findFirst({ where: { userId: session.userId } })
  if (existing) return NextResponse.json({ error: 'You already belong to a team.' }, { status: 409 })

  const body = await req.json().catch(() => ({}))
  const name = String(body?.name ?? '').trim().slice(0, 80)
  if (!name) return NextResponse.json({ error: 'Team name required.' }, { status: 400 })

  const team = await prisma.team.create({
    data: {
      name,
      createdById: session.userId,
      members: { create: { userId: session.userId, role: 'OWNER' } },
    },
  })
  await logAudit({
    req, userId: session.userId, action: 'team.created',
    resourceType: 'team', resourceId: team.id, changes: { name },
  })
  return NextResponse.json({ success: true, teamId: team.id })
}

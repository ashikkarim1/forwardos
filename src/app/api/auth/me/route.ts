import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

/** GET /api/auth/me — returns the current authenticated user, or 401. */
export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ user: null }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, name: true, email: true, role: true, company: true, kycStatus: true },
  }).catch(() => null)

  return NextResponse.json({ user: user ?? { id: session.userId, email: session.email, role: session.role } })
}

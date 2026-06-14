/**
 * GET  /api/notifications/preferences — returns current user's prefs
 * PATCH /api/notifications/preferences — updates a subset of prefs
 *
 * Only the calling user can read/write their own prefs. Admin override
 * is intentionally not provided — preferences are personal.
 */
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { getPreferences, type NonTxCategory } from '@/lib/notifications/preferences'

export const dynamic = 'force-dynamic'

const PatchSchema = z.object({
  matchAlertCadence:  z.enum(['INSTANT', 'DAILY', 'WEEKLY']).optional(),
  quietHoursStart:    z.number().int().min(0).max(23).optional(),
  quietHoursEnd:      z.number().int().min(0).max(23).optional(),
  timezoneOffsetMin:  z.number().int().min(-720).max(840).optional(),
  maxDailyEmails:     z.number().int().min(1).max(10).optional(),
  disabledCategories: z.array(z.string()).optional(),
})

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const prefs = await getPreferences(session.userId)
  return NextResponse.json({ prefs })
}

export async function PATCH(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const body = await req.json().catch(() => ({}))
  const parsed = PatchSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const { disabledCategories, ...rest } = parsed.data
  const patch = {
    ...rest,
    ...(disabledCategories
      ? { disabledCategories: JSON.stringify(disabledCategories as NonTxCategory[]) }
      : {}),
  }
  await prisma.notificationPreference.upsert({
    where: { userId: session.userId },
    update: patch,
    create: { userId: session.userId, ...patch },
  })
  return NextResponse.json({ ok: true })
}

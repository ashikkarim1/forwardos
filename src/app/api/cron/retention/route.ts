// Automated data-retention purge — call from a scheduler (e.g. Vercel Cron).
// Protected by a bearer secret (CRON_SECRET) since it mutates data.
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { purgeExpired } from '@/lib/retention'
import { logAudit } from '@/lib/audit'

export const dynamic = 'force-dynamic'

async function run(req: NextRequest) {
  const secret = process.env.CRON_SECRET
  const auth = req.headers.get('authorization')
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const result = await purgeExpired(prisma)
  await logAudit({ action: 'retention.purge', resourceType: 'system', changes: result })
  return NextResponse.json({ ok: true, purged: result })
}

// Vercel Cron invokes the path with GET and an Authorization: Bearer $CRON_SECRET header.
export const GET = run
export const POST = run

/**
 * GET /api/cron/notifications-weekly  (Vercel cron, Monday 7am UTC)
 *
 * Forces a WEEKLY-cadence drain regardless of normal pacing. This is
 * the path that delivers the free-tier weekly digest. Premium users
 * who happen to be on WEEKLY cadence (rare; manual opt) also get it.
 *
 * Internally identical to /notifications-send but with forceCadence
 * so the every-15-min path doesn't try to send weekly digests too.
 */
import { NextRequest, NextResponse } from 'next/server'
import { runSendWindow } from '@/lib/notifications/send-window'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization') || ''
  const expected = process.env.CRON_SECRET
  if (expected && auth !== `Bearer ${expected}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const result = await runSendWindow({ forceCadence: 'WEEKLY' })
  return NextResponse.json({ ok: true, ...result })
}

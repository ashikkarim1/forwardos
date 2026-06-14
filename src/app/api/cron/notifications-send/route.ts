/**
 * GET /api/cron/notifications-send  (Vercel cron, every 15 min)
 *
 * Drains PendingAlert into per-user digest emails, respecting tier,
 * preferences, quiet hours, and the daily cap. See lib/notifications/
 * send-window.ts for the gating logic — this route is just the wrapper.
 *
 * Protected by CRON_SECRET (Vercel sets this header on its cron runs).
 * Returns a summary so the cron run log is informative.
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

  const result = await runSendWindow()
  return NextResponse.json({ ok: true, ...result })
}

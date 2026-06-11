// Demonstrable consent (GDPR Art. 7) — persists each consent choice server-side
// so we can prove what a visitor agreed to, and when.
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { isSameOrigin, rateLimit, clientIp } from '@/lib/rate-limit'
import { logAudit } from '@/lib/audit'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  if (!isSameOrigin(req)) {
    return NextResponse.json({ ok: false, error: 'Cross-origin request blocked' }, { status: 403 })
  }
  const rl = rateLimit(`consent:${clientIp(req)}`, 30, 60_000)
  if (!rl.ok) return NextResponse.json({ ok: false, error: 'Too many requests' }, { status: 429 })

  const body = await req.json().catch(() => null)
  if (!body || typeof body.analytics !== 'boolean' || typeof body.marketing !== 'boolean') {
    return NextResponse.json({ ok: false, error: 'analytics and marketing booleans required' }, { status: 400 })
  }

  let userId: string | null = null
  try { userId = (await getSession())?.userId ?? null } catch { /* anon */ }

  try {
    await prisma.consentLog.create({
      data: {
        anonId: typeof body.anonId === 'string' ? body.anonId.slice(0, 36) : null,
        userId,
        analytics: body.analytics,
        marketing: body.marketing,
        version: typeof body.version === 'number' ? body.version : 1,
        source: typeof body.source === 'string' ? body.source.slice(0, 24) : 'banner',
        ip: clientIp(req),
        userAgent: req.headers.get('user-agent')?.slice(0, 300) ?? null,
      },
    })
    await logAudit({ req, userId, action: 'consent.update', resourceType: 'consent', changes: { analytics: body.analytics, marketing: body.marketing } })
  } catch {
    // No DB — the client still holds the preference; acknowledge.
  }
  return NextResponse.json({ ok: true })
}

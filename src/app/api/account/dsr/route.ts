// GDPR data-subject requests we don't fully self-serve (rectification,
// restriction, objection, or general privacy requests). Routes the request to
// the privacy team; works logged-in or anonymous (with a contact email).
import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { sendEmail } from '@/lib/services/email'
import { rateLimit, clientIp, isSameOrigin } from '@/lib/rate-limit'
import { logAudit } from '@/lib/audit'

export const dynamic = 'force-dynamic'

const TYPES = new Set(['access', 'rectification', 'erasure', 'restriction', 'objection', 'portability', 'other'])

export async function POST(req: NextRequest) {
  if (!isSameOrigin(req)) {
    return NextResponse.json({ error: 'Cross-origin request blocked' }, { status: 403 })
  }
  const rl = rateLimit(`dsr:${clientIp(req)}`, 5, 60 * 60_000)
  if (!rl.ok) return NextResponse.json({ error: 'Too many requests' }, { status: 429 })

  const body = await req.json().catch(() => null)
  const type = TYPES.has(String(body?.type)) ? String(body.type) : 'other'
  const message = String(body?.message ?? '').trim().slice(0, 4000)
  const contactEmail = String(body?.email ?? '').trim().slice(0, 254)
  if (message.length < 2 && type === 'other') {
    return NextResponse.json({ error: 'Please describe your request.' }, { status: 400 })
  }

  let userId: string | null = null
  try { userId = (await getSession())?.userId ?? null } catch { /* anon */ }

  await sendEmail({
    to: 'privacy@forwardos.ai',
    subject: `[DSR · ${type}] data-subject request`,
    html: `<p><strong>Type:</strong> ${type}</p>
      <p><strong>From:</strong> ${userId ? `user ${userId}` : 'anonymous'} ${contactEmail ? `(${contactEmail})` : ''}</p>
      <blockquote>${message.replace(/</g, '&lt;') || '(no message)'}</blockquote>
      <p>Respond within one month per GDPR Art. 12(3).</p>`,
  }).catch(() => {})

  await logAudit({ req, userId, action: 'dsr.request', resourceType: 'dsr', changes: { type } })

  return NextResponse.json({ success: true, message: 'Request received. We respond within 30 days.' })
}

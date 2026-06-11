// User feedback capture — feature requests, bugs, praise. Works logged-in or
// anonymous; attaches the session user server-side when present.
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { sendEmail } from '@/lib/services/email'
import { rateLimit, clientIp, isSameOrigin } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'

const KIND_MAP: Record<string, 'FEATURE' | 'BUG' | 'PRAISE' | 'OTHER'> = {
  feature: 'FEATURE', bug: 'BUG', praise: 'PRAISE', other: 'OTHER',
}

export async function POST(req: NextRequest) {
  if (!isSameOrigin(req)) {
    return NextResponse.json({ ok: false, error: 'Cross-origin request blocked' }, { status: 403 })
  }
  // Abuse guard: 20 submissions / 10 min per IP.
  const rl = rateLimit(`feedback:${clientIp(req)}`, 20, 10 * 60_000)
  if (!rl.ok) {
    return NextResponse.json({ ok: false, error: 'Too many submissions' }, { status: 429, headers: { 'Retry-After': String(rl.retryAfter) } })
  }

  const body = await req.json().catch(() => null)
  const message = String(body?.message ?? '').trim()
  if (message.length < 2 || message.length > 4000) {
    return NextResponse.json({ ok: false, error: 'bad-message' }, { status: 400 })
  }
  const kind = KIND_MAP[String(body?.kind)] ?? 'OTHER'
  const locale = typeof body?.locale === 'string' ? body.locale.slice(0, 5) : 'en'
  const anonId = typeof body?.anonId === 'string' ? body.anonId.slice(0, 36) : null
  const page = typeof body?.page === 'string' ? body.page.slice(0, 200) : null

  // Attach the session user if signed in (anonymous is fine otherwise).
  let userId: string | null = null
  try {
    const session = await getSession()
    userId = session?.userId ?? null
  } catch { /* anonymous */ }

  try {
    await prisma.feedback.create({
      data: { kind, message, page, locale, userId, anonId, userAgent: req.headers.get('user-agent')?.slice(0, 300) ?? null },
    })
  } catch (err) {
    // No DB / write failure — log and still acknowledge so the UX completes.
    console.error('[feedback]', err)
  }

  // Notify the team (no-ops to console until Resend is wired).
  await sendEmail({
    to: process.env.ADMIN_EMAIL || 'admin@forwardos.ai',
    subject: `[Feedback · ${kind}] new submission`,
    html: `<p><strong>${kind}</strong> feedback${userId ? ` from user ${userId}` : ' (anonymous)'}</p>
      <p><strong>Page:</strong> ${page || '—'}</p>
      <blockquote>${message.replace(/</g, '&lt;')}</blockquote>`,
  }).catch(() => {})

  return NextResponse.json({ ok: true })
}

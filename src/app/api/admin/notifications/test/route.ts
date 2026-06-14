/**
 * GET /api/admin/notifications/test?to=email@x.com
 *
 * E2E test for the notification system. Renders all three digest
 * cadences (Weekly, Smart Daily, Real-time) plus the welcome-premium
 * template with realistic data, then sends them to the address in `to`.
 *
 * Gated by ADMIN_TEST_TOKEN OR an authenticated ADMIN session. This is
 * deliberately the only "side channel" around the send-window — used
 * exclusively to validate templates and end-to-end delivery before a
 * launch.
 */
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { sendEmail } from '@/lib/services/email'
import { renderMatchDigest, renderWelcomePremium } from '@/lib/notifications/templates'
import type { AlertFrequency } from '@prisma/client'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const FALLBACK_DEALS = [
  { industry: 'SAAS',          city: 'Dubai',       country: 'UAE',    askingPriceCents: 4_200_000_00, heatScore: 88 },
  { industry: 'HEALTHCARE',    city: 'Toronto',     country: 'Canada', askingPriceCents: 8_700_000_00, heatScore: 92 },
  { industry: 'ECOMMERCE',     city: 'Austin',      country: 'USA',    askingPriceCents: 1_900_000_00, heatScore: 74 },
  { industry: 'PROFESSIONAL_SERVICES', city: 'Abu Dhabi', country: 'UAE', askingPriceCents: 6_300_000_00, heatScore: 81 },
  { industry: 'MANUFACTURING', city: 'Detroit',     country: 'USA',    askingPriceCents: 12_500_000_00, heatScore: 67 },
]

export async function GET(req: NextRequest) {
  // Authz: env-token OR an admin session.
  const token = req.nextUrl.searchParams.get('token')
  const session = await getSession()
  const isAdminSession = session && (await prisma.user.findUnique({
    where: { id: session.userId }, select: { role: true },
  }))?.role === 'ADMIN'
  const tokenOk = !!process.env.ADMIN_TEST_TOKEN && token === process.env.ADMIN_TEST_TOKEN
  if (!isAdminSession && !tokenOk) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const to = req.nextUrl.searchParams.get('to')
  if (!to) return NextResponse.json({ error: 'missing ?to=email' }, { status: 400 })

  // Pull real recent deals so the test email reflects the actual
  // marketplace. Falls back to a synthetic set if the DB has nothing
  // (cold environment / first-deploy).
  const real = await prisma.deal.findMany({
    where: { status: { in: ['PUBLISHED', 'ACTIVE'] } },
    orderBy: { createdAt: 'desc' },
    take: 5,
    select: { id: true, slug: true, industry: true, city: true, country: true, askingPrice: true, heatScore: true },
  }).catch(() => [])

  const dealCards = (real.length >= 3 ? real : FALLBACK_DEALS).slice(0, 5).map((d, i) => ({
    id: 'id' in d ? d.id : `sample-${i}`,
    slug: 'slug' in d ? d.slug : null,
    industry: String(d.industry),
    city: d.city,
    country: d.country,
    askingPriceCents: 'askingPrice' in d
      ? (d.askingPrice ? Number(d.askingPrice) : null)
      : (d as { askingPriceCents: number }).askingPriceCents,
    heatScore: d.heatScore ?? null,
  }))

  type Variant = { tag: string; cadence: AlertFrequency; isPaid: boolean; subject: string }
  const allVariants: Variant[] = [
    { tag: 'weekly-free',     cadence: 'WEEKLY',  isPaid: false, subject: '[TEST] Weekly digest — Free tier preview' },
    { tag: 'daily-premium',   cadence: 'DAILY',   isPaid: true,  subject: '[TEST] Smart Daily — Premium tier preview' },
    { tag: 'instant-premium', cadence: 'INSTANT', isPaid: true,  subject: '[TEST] Real-time batch — Premium tier preview' },
  ]
  // ?only=tag1,tag2 lets you re-fire a subset (e.g. retry one that
  // hit a rate limit) without re-sending the ones that already landed.
  const onlyParam = req.nextUrl.searchParams.get('only')
  const onlyTags = onlyParam ? new Set(onlyParam.split(',').map((s) => s.trim())) : null
  const variants = onlyTags ? allVariants.filter((v) => onlyTags.has(v.tag)) : allVariants
  const skipWelcome = onlyTags && !onlyTags.has('welcome-buyer-premium')

  // Resend caps free-tier sends at 2/sec. Space deliveries 600ms apart
  // so a 4-email test never trips the limit. The send-window cron has
  // its own pacing for production traffic and doesn't hit this code.
  const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms))

  const results: Array<{ tag: string; success: boolean; id?: string; mocked?: boolean }> = []
  for (const v of variants) {
    const html = renderMatchDigest({ cadence: v.cadence, isPaid: v.isPaid, userName: 'CEO', deals: dealCards.slice(0, v.cadence === 'INSTANT' ? 2 : 5) })
    const r = await sendEmail({ to, subject: v.subject, html })
    results.push({ tag: v.tag, success: r.success, ...('id' in r ? { id: r.id } : {}), ...('mocked' in r ? { mocked: r.mocked } : {}) })
    await sleep(600)
  }

  // Welcome email too — proves the welcome path is wired.
  if (!skipWelcome) {
    const welcomeHtml = renderWelcomePremium({ userName: 'CEO', tier: 'BUYER_PREMIUM' })
    const w = await sendEmail({ to, subject: '[TEST] Welcome to Buyer Premium', html: welcomeHtml })
    results.push({ tag: 'welcome-buyer-premium', success: w.success, ...('id' in w ? { id: w.id } : {}), ...('mocked' in w ? { mocked: w.mocked } : {}) })
  }

  return NextResponse.json({
    ok: true,
    to,
    dealCount: dealCards.length,
    realDeals: real.length,
    sent: results,
  })
}

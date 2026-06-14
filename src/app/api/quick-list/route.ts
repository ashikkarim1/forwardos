/**
 * POST /api/quick-list
 *
 * The 90-second listing endpoint. One round-trip from "I have a business to
 * sell" to "my listing is live on the marketplace". Deferred:
 *  - Password (we generate a random one; seller sets via magic-link in email)
 *  - Email verification (listing publishes; verification = trust badge later)
 *  - KYC / sanctions screen (only kicks in when a buyer engages)
 *  - Plan selection (everything here is free; upgrades live in dashboard)
 *
 * Anonymous by default: the public listing shows industry + country + ranges
 * with a "Confidential listing #XXXX" headline. Seller flips identity reveal
 * in their dashboard later.
 */
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { rateLimit, clientIp, isSameOrigin } from '@/lib/rate-limit'
import { sendEmail } from '@/lib/services/email'
import { logAudit } from '@/lib/audit'
import {
  REVENUE_RANGE_BY_ID,
  ASKING_RANGE_BY_ID,
  EBITDA_RANGE_BY_ID,
  CASH_FLOW_RANGE_BY_ID,
  QUICK_LIST_INDUSTRIES,
  QUICK_LIST_COUNTRIES,
  dealSlug,
  confidentialTitle,
} from '@/lib/listing-helpers'
import crypto from 'crypto'

const VALID_INDUSTRIES: Set<string> = new Set(QUICK_LIST_INDUSTRIES.map((i) => i.value))
const VALID_COUNTRIES: Set<string> = new Set(QUICK_LIST_COUNTRIES.map((c) => c.value))

export async function POST(request: NextRequest) {
  try {
    if (!isSameOrigin(request)) {
      return NextResponse.json({ error: 'Cross-origin blocked' }, { status: 403 })
    }
    const rl = rateLimit(`quick-list:${clientIp(request)}`, 8, 60 * 60_000)
    if (!rl.ok) {
      return NextResponse.json({ error: 'Too many submissions — try again later.' }, {
        status: 429, headers: { 'Retry-After': String(rl.retryAfter) },
      })
    }

    const body = await request.json().catch(() => ({}))
    const {
      industry, country, revenueRange, askingRange, headline,
      email, city, referralCode,
    } = body as Record<string, string>
    // Optional photo uploads (max 5; pre-uploaded via /api/upload, so we
    // just persist the URLs and pick the cover).
    const rawPhotos = Array.isArray((body as Record<string, unknown>).photos)
      ? ((body as Record<string, unknown>).photos as { url?: unknown; name?: unknown }[])
      : []
    const photos = rawPhotos
      .filter((p) => typeof p.url === 'string' && (p.url as string).startsWith('https://'))
      .slice(0, 5)
      .map((p) => ({ url: p.url as string, name: typeof p.name === 'string' ? p.name.slice(0, 200) : 'photo' }))
    const coverIndexRaw = (body as Record<string, unknown>).coverIndex
    const coverIndex = typeof coverIndexRaw === 'number' && coverIndexRaw >= 0 && coverIndexRaw < photos.length
      ? coverIndexRaw : 0

    // Optional boost fields — significantly improve marketplace match quality.
    const ebitdaRangeId = typeof (body as Record<string, unknown>).ebitdaRange === 'string'
      ? ((body as Record<string, unknown>).ebitdaRange as string) : ''
    const cashFlowRangeId = typeof (body as Record<string, unknown>).cashFlowRange === 'string'
      ? ((body as Record<string, unknown>).cashFlowRange as string) : ''
    const ebitdaPreset = ebitdaRangeId ? EBITDA_RANGE_BY_ID[ebitdaRangeId] : undefined
    const cashFlowPreset = cashFlowRangeId ? CASH_FLOW_RANGE_BY_ID[cashFlowRangeId] : undefined

    // Lister role + broker credentials. Default OWNER if anything's off.
    const rawRole = (body as Record<string, unknown>).listedByRole
    const listedByRole: 'OWNER' | 'BROKER' = rawRole === 'BROKER' ? 'BROKER' : 'OWNER'
    const brokerName = listedByRole === 'BROKER' && typeof (body as Record<string, unknown>).brokerName === 'string'
      ? ((body as Record<string, unknown>).brokerName as string).trim().slice(0, 120) || null : null
    const brokerLicense = listedByRole === 'BROKER' && typeof (body as Record<string, unknown>).brokerLicense === 'string'
      ? ((body as Record<string, unknown>).brokerLicense as string).trim().slice(0, 80) || null : null
    const brokerYearsRaw = (body as Record<string, unknown>).brokerYearsExperience
    const brokerYearsExperience = listedByRole === 'BROKER' && typeof brokerYearsRaw === 'number'
      && brokerYearsRaw >= 0 && brokerYearsRaw <= 60 ? Math.floor(brokerYearsRaw) : null
    const brokerDealsRaw = (body as Record<string, unknown>).brokerDealsClosed
    const brokerDealsClosed = listedByRole === 'BROKER' && typeof brokerDealsRaw === 'number'
      && brokerDealsRaw >= 0 && brokerDealsRaw <= 9999 ? Math.floor(brokerDealsRaw) : null

    // ─── validate ──────────────────────────────────────────────────────────
    const errors: string[] = []
    if (!industry || !VALID_INDUSTRIES.has(industry)) errors.push('Pick an industry')
    if (!country || !VALID_COUNTRIES.has(country))    errors.push('Pick a country')
    if (!revenueRange || !REVENUE_RANGE_BY_ID[revenueRange]) errors.push('Pick a revenue range')
    if (!askingRange || !ASKING_RANGE_BY_ID[askingRange])    errors.push('Pick an asking range')
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('Enter a valid email')
    if (errors.length) return NextResponse.json({ error: errors.join(', ') }, { status: 400 })

    const normalizedEmail = email.toLowerCase().trim()
    const revRange = REVENUE_RANGE_BY_ID[revenueRange]
    const askRange = ASKING_RANGE_BY_ID[askingRange]

    // ─── upsert seller user ────────────────────────────────────────────────
    let user = await prisma.user.findUnique({ where: { email: normalizedEmail } })
    if (user && user.role !== 'SELLER' && user.role !== 'ADMIN') {
      // Existing buyer / broker etc — don't let quick-list mutate their role.
      return NextResponse.json(
        { error: 'An account with that email already exists. Please sign in to add a listing.' },
        { status: 409 },
      )
    }

    let referredById: string | null = null
    if (referralCode) {
      const referrer = await prisma.user.findUnique({ where: { referralCode } })
      if (referrer) referredById = referrer.id
    }

    if (!user) {
      // Random unguessable password — user sets a real one via "set password" magic link.
      const randomPwd = crypto.randomBytes(24).toString('hex')
      user = await prisma.user.create({
        data: {
          email: normalizedEmail,
          name: 'Forward Seller',  // placeholder — they set real name in dashboard
          password: randomPwd,
          role: 'SELLER',
          referralCode: crypto.createHash('sha256').update(normalizedEmail + 'forward2026').digest('hex').slice(0, 24),
          referredById,
          onboardingStatus: 'ACCOUNT_CREATED',
        },
      })
    }

    // ─── create the listing ────────────────────────────────────────────────
    const dealId = `ql-${crypto.randomBytes(8).toString('hex')}`
    const fallbackTitle = confidentialTitle(industry, country, dealId)
    const finalTitle = (headline?.trim() ? headline.trim() : fallbackTitle).slice(0, 140)
    const slug = dealSlug(finalTitle, dealId)

    const trimmedCity = (city || '').trim().slice(0, 80) || null

    // Prefer the seller-supplied EBITDA range over the 20%-of-revenue fallback.
    // Cash flow is stored separately — buyers under $2M search on it directly.
    const revenueCents = revRange.midCents
    const ebitdaCents = ebitdaPreset ? ebitdaPreset.midCents : revenueCents / 5n
    const cashFlowCents = cashFlowPreset ? cashFlowPreset.midCents : null
    const ebitdaMarginPct = revenueCents > 0n
      ? Math.round(Number((ebitdaCents * 100n) / revenueCents))
      : 20

    const deal = await prisma.deal.create({
      data: {
        id: dealId,
        sellerId: user.id,
        title: finalTitle,
        slug,
        description: `Anonymous teaser listing. ${headline?.trim() || 'Seller will add a description shortly.'}`,
        status: 'ACTIVE',
        publishedAt: new Date(),
        industry: industry as never,  // validated against VALID_INDUSTRIES above
        country,
        city: trimmedCity,
        revenue: revenueCents,
        ebitda: ebitdaCents,
        cashFlow: cashFlowCents,
        askingPrice: askRange.midCents,
        ebitdaMargin: ebitdaMarginPct,
        listedByRole,
        brokerName,
        brokerLicense,
        brokerYearsExperience,
        brokerDealsClosed,
        isConfidential: true,
        // sensible defaults — seller refines later
        heatScore: 50,
        dealQualityScore: 50,
        predictedCloseProb: 35,
        financingEligible: false,
      },
      select: { id: true, slug: true, title: true },
    })

    // ─── notification match-evaluation (fire-and-forget) ─────────────────
    // Buffer matches into PendingAlert so the send-window cron can deliver
    // them respecting each user's preferences. Never block the publish
    // response on this — a slow query here would slow every listing.
    void (async () => {
      try {
        const { evaluateNewListing } = await import('@/lib/notifications/match-evaluator')
        const r = await evaluateNewListing(deal.id)
        console.log('[notifications] match-evaluation', r)
      } catch (e) {
        console.error('[notifications] match-evaluation failed:', e)
      }
    })()

    // ─── persist uploaded photos (best-effort; do not block listing) ──────
    if (photos.length > 0) {
      try {
        await prisma.businessPhoto.createMany({
          data: photos.map((p, i) => ({
            sellerId: user.id,
            dealId: deal.id,
            photoUrl: p.url,
            photoName: p.name,
            isFeatured: i === coverIndex,
            displayOrder: i,
          })),
        })
      } catch (e) {
        // Don't fail the whole listing if a photo write hiccups — the deal
        // is already live and the seller can add photos later from /list.
        console.error('[quick-list] photo persist failed:', e)
      }
    }

    // ─── confirmation email ────────────────────────────────────────────────
    const listingUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.forwardos.ai'}/listing/${deal.slug}`
    const dashboardUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.forwardos.ai'}/dashboard/seller`
    sendEmail({
      to: normalizedEmail,
      subject: `Your Forward listing is live (${deal.title})`,
      html: `
        <!DOCTYPE html><html><body style="font-family:-apple-system,sans-serif;max-width:600px;margin:0 auto;padding:24px">
          <h2 style="color:#1A1A1A;margin:0 0 8px">Your listing is live ✓</h2>
          <p style="color:#717171;font-size:14px;margin:0 0 16px">Buyers can already discover it on the Forward marketplace, fully anonymous.</p>
          <div style="background:#EFF6FF;padding:16px;border-radius:8px;margin:0 0 20px">
            <p style="margin:0 0 4px;color:#1A1A1A;font-weight:bold">${deal.title}</p>
            <p style="margin:0;color:#717171;font-size:13px">Industry: ${industry} · Country: ${country} · Asking: ${askRange.label}</p>
          </div>
          <p style="margin:0 0 16px"><a href="${listingUrl}" style="background:#B8956A;color:#ffffff !important;padding:12px 20px;text-decoration:none;border-radius:8px;display:inline-block;font-weight:bold"><span style="color:#ffffff">View your listing</span></a></p>
          <p style="color:#717171;font-size:13px;margin:0 0 8px">Next steps in your dashboard:</p>
          <ul style="color:#717171;font-size:13px;margin:0 0 16px;padding-left:20px">
            <li>Add photos → roughly 3x more buyer views</li>
            <li>Verify your business → unlock funded-buyer matching</li>
            <li>Upload financials → get a "Verified Financials" trust badge</li>
          </ul>
          <p style="margin:0 0 24px"><a href="${dashboardUrl}" style="color:#B8956A">Open seller dashboard →</a></p>
          <p style="color:#9A9A9A;font-size:11px;margin:24px 0 0">© 2026 Forward Intelligence. You're getting this because you just listed a business at forwardos.ai.</p>
        </body></html>
      `,
    }).catch((e) => console.error('[quick-list] email send failed:', e))

    await logAudit({
      req: request, userId: user.id, action: 'deal.created',
      resourceType: 'deal', resourceId: deal.id,
      changes: { industry, country, askingRange, revenueRange, photos: photos.length },
    })

    return NextResponse.json({
      success: true,
      dealId: deal.id,
      slug: deal.slug,
      listingUrl: `/listing/${deal.slug}`,
      isNewUser: !user.emailVerified,
    })
  } catch (e) {
    console.error('[API] quick-list error:', e)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}

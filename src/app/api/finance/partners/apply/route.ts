// Financier partner application. Creates a PENDING, un-marketed Lender record
// (isActive=false) for admin review. Public, same-origin + rate-limited.
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/services/email'
import { isSameOrigin, rateLimit, clientIp } from '@/lib/rate-limit'
import { logAudit } from '@/lib/audit'
import { validateFinancierCredentials, getFinancierTier } from '@/lib/financier-tiers'

export const dynamic = 'force-dynamic'

const REGIONS = new Set(['USA', 'CANADA', 'UAE', 'GLOBAL'])
const usdToCents = (n: unknown) => BigInt(Math.max(0, Math.round(Number(n) || 0)) * 100)

export async function POST(req: NextRequest) {
  if (!isSameOrigin(req)) {
    return NextResponse.json({ error: 'Cross-origin request blocked' }, { status: 403 })
  }
  const rl = rateLimit(`financier-apply:${clientIp(req)}`, 5, 60 * 60_000)
  if (!rl.ok) return NextResponse.json({ error: 'Too many applications. Try again later.' }, { status: 429 })

  try {
    const b = await req.json()
    if (!b?.name || !b?.contactEmail || !b?.region || !REGIONS.has(b.region)) {
      return NextResponse.json({ error: 'Company name, contact email, and a valid region are required.' }, { status: 400 })
    }

    // Work email + at least one of website / LinkedIn.
    const credError = validateFinancierCredentials({ email: b.contactEmail, website: b.website, linkedin: b.linkedinUrl })
    if (credError) return NextResponse.json({ error: credError }, { status: 400 })

    const tier = getFinancierTier(b.partnerTier)?.id ?? 'LISTED'
    const types = Array.isArray(b.financingTypes) && b.financingTypes.length ? b.financingTypes : ['BANK_TERM']

    const lender = await prisma.lender.create({
      data: {
        name: String(b.name).slice(0, 160),
        region: b.region,
        financingTypes: JSON.stringify(types),
        description: String(b.description || '').slice(0, 2000),
        applyUrl: b.website ? String(b.website).slice(0, 300) : null,
        minAmount: usdToCents(b.minAmount),
        maxAmount: usdToCents(b.maxAmount || b.minAmount || 0),
        interestRateMin: Number(b.interestRateMin) || 0,
        interestRateMax: Number(b.interestRateMax) || 0,
        termMonthsMin: Number(b.termMonthsMin) || 12,
        termMonthsMax: Number(b.termMonthsMax) || 120,
        shariaCompliant: Boolean(b.shariaCompliant),
        // Application/onboarding state
        status: 'PENDING',
        isActive: false, // not marketed until approved + agreement signed
        partnerTier: tier,
        contactName: b.contactName ? String(b.contactName).slice(0, 120) : null,
        contactEmail: String(b.contactEmail).slice(0, 254),
        contactPhone: b.contactPhone ? String(b.contactPhone).slice(0, 40) : null,
        linkedinUrl: b.linkedinUrl ? String(b.linkedinUrl).slice(0, 300) : null,
        referralFeePercent: b.referralFeePercent != null ? Number(b.referralFeePercent) : null,
        referralPlan: b.referralPlan ? String(b.referralPlan).slice(0, 4000) : null,
      },
    })

    await logAudit({ req, action: 'financier.apply', resourceType: 'lender', resourceId: lender.id })
    await sendEmail({
      to: process.env.ADMIN_EMAIL || 'admin@forwardos.ai',
      subject: `[Financier] New partner application — ${lender.name}`,
      html: `<p>A new financing partner has applied and is awaiting review.</p>
        <ul>
          <li><strong>Company:</strong> ${lender.name}</li>
          <li><strong>Region:</strong> ${b.region}</li>
          <li><strong>Contact:</strong> ${b.contactName || '—'} (${b.contactEmail})</li>
          <li><strong>Proposed referral:</strong> ${b.referralFeePercent ?? '—'}% — ${b.referralPlan || '—'}</li>
        </ul>
        <p>Review at ${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin/financiers</p>`,
    }).catch(() => {})

    return NextResponse.json({ success: true, id: lender.id }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Application failed' }, { status: 500 })
  }
}

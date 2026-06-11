// Seller/business verification submission. Stores uploaded documents + (UAE) UBO,
// runs sanctions screening, and queues a PENDING case for manual admin review.
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { isSameOrigin, rateLimit, clientIp } from '@/lib/rate-limit'
import { getRequirements } from '@/lib/verification-requirements'
import { screenNames } from '@/lib/sanctions'
import { sendEmail } from '@/lib/services/email'
import { logAudit } from '@/lib/audit'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  if (!isSameOrigin(req)) return NextResponse.json({ error: 'Cross-origin request blocked' }, { status: 403 })
  const rl = rateLimit(`verify:${clientIp(req)}`, 10, 60 * 60_000)
  if (!rl.ok) return NextResponse.json({ error: 'Too many submissions' }, { status: 429 })

  try {
    const b = await req.json()
    const requirements = getRequirements(b.region)
    if (!b.businessName || !requirements) {
      return NextResponse.json({ error: 'Business name and a valid region (USA/CANADA/UAE) are required.' }, { status: 400 })
    }

    const documents: { type: string; label: string; url: string; name?: string }[] = Array.isArray(b.documents) ? b.documents : []
    // Require every region-mandated document to be present.
    const missing = requirements.docs.filter((d) => !documents.some((u) => u.type === d.type && u.url))
    if (missing.length) {
      return NextResponse.json({ error: `Missing required documents: ${missing.map((m) => m.label).join(', ')}` }, { status: 400 })
    }
    const ubo: { name: string; ownershipPct?: number }[] = Array.isArray(b.ubo) ? b.ubo : []
    if (requirements.uboRequired && ubo.length === 0) {
      return NextResponse.json({ error: 'At least one beneficial owner (UBO) is required for UAE.' }, { status: 400 })
    }

    // Sanctions screening: business + signatory + beneficial owners.
    const screen = screenNames([b.businessName, b.signatoryName, ...ubo.map((o) => o.name)])

    const session = await getSession().catch(() => null)
    const created = await prisma.verificationCase.create({
      data: {
        userId: session?.userId ?? b.userId ?? null,
        businessName: String(b.businessName).slice(0, 200),
        region: b.region,
        contactEmail: b.contactEmail ? String(b.contactEmail).slice(0, 254) : session?.email ?? null,
        documents: JSON.stringify(documents),
        ubo: ubo.length ? JSON.stringify(ubo) : null,
        sanctionsClear: screen.clear,
        sanctionsResult: JSON.stringify(screen),
        status: 'PENDING',
      },
    })

    await logAudit({ req, userId: session?.userId, action: 'verification.submit', resourceType: 'verificationCase', resourceId: created.id, changes: { region: b.region, sanctionsClear: screen.clear } })
    await sendEmail({
      to: process.env.ADMIN_EMAIL || 'admin@forwardos.ai',
      subject: `[Verification] New ${b.region} case — ${b.businessName}${screen.clear ? '' : ' ⚠️ SANCTIONS HIT'}`,
      html: `<p>New verification case awaiting review.</p>
        <ul><li><strong>Business:</strong> ${b.businessName}</li><li><strong>Region:</strong> ${b.region}</li>
        <li><strong>Documents:</strong> ${documents.length}</li>
        <li><strong>Sanctions:</strong> ${screen.clear ? 'clear' : `⚠️ ${screen.matches.length} potential match(es)`}</li></ul>
        <p>Review at ${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin/verifications</p>`,
    }).catch(() => {})

    return NextResponse.json({ success: true, id: created.id, sanctionsClear: screen.clear }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Submission failed' }, { status: 500 })
  }
}

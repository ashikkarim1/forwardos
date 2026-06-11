// Digital signing of the referral agreement (UpCapital Global FZCO — Forward OS).
// Saves the signature + signer details, records IP/timestamp for the e-signature
// audit trail, then ACTIVATES and markets the financier (isActive = true).
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isSameOrigin, clientIp, rateLimit } from '@/lib/rate-limit'
import { logAudit } from '@/lib/audit'

export const dynamic = 'force-dynamic'
export const AGREEMENT_VERSION = 'referral-v1-2026-06'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isSameOrigin(req)) return NextResponse.json({ error: 'Cross-origin request blocked' }, { status: 403 })
  const rl = rateLimit(`sign:${clientIp(req)}`, 10, 60 * 60_000)
  if (!rl.ok) return NextResponse.json({ error: 'Too many attempts' }, { status: 429 })

  try {
    const b = await req.json()
    if (!b?.agreed || !b?.signerName || !b?.signatureDataUrl) {
      return NextResponse.json({ error: 'Signer name, signature, and agreement consent are required.' }, { status: 400 })
    }
    // Guard signature payload size (data URL).
    if (String(b.signatureDataUrl).length > 600_000) {
      return NextResponse.json({ error: 'Signature image too large.' }, { status: 413 })
    }

    const lender = await prisma.lender.findUnique({ where: { id: params.id } })
    if (!lender) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if (lender.status === 'PENDING') return NextResponse.json({ error: 'Application is still under review.' }, { status: 409 })
    if (lender.status === 'REJECTED') return NextResponse.json({ error: 'This application was not approved.' }, { status: 409 })
    if (lender.status === 'ACTIVE') return NextResponse.json({ error: 'Agreement already signed.' }, { status: 409 })

    await prisma.lender.update({
      where: { id: params.id },
      data: {
        status: 'ACTIVE',
        isActive: true, // now marketed in the Finance Center directory
        agreementVersion: AGREEMENT_VERSION,
        agreementSignerName: String(b.signerName).slice(0, 160),
        agreementSignerTitle: b.signerTitle ? String(b.signerTitle).slice(0, 160) : null,
        agreementSignatureUrl: String(b.signatureDataUrl),
        agreementSignedAt: new Date(),
        agreementIp: clientIp(req),
      },
    })

    await logAudit({ req, action: 'financier.agreement.signed', resourceType: 'lender', resourceId: params.id, changes: { signer: b.signerName, version: AGREEMENT_VERSION } })
    return NextResponse.json({ success: true, status: 'ACTIVE' })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Signing failed' }, { status: 500 })
  }
}

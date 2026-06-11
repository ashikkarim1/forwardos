// Public fetch of a financier application for the agreement-signing page.
// Returns only non-sensitive fields needed to render & sign the agreement.
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const l = await prisma.lender.findUnique({ where: { id: params.id } })
    if (!l || !l.contactEmail) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({
      partner: {
        id: l.id,
        name: l.name,
        contactName: l.contactName,
        status: l.status,
        referralFeePercent: l.referralFeePercent,
        referralPlan: l.referralPlan,
        agreementSignedAt: l.agreementSignedAt,
        agreementSignerName: l.agreementSignerName,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed' }, { status: 500 })
  }
}

// Admin: list financier partner applications (lenders that came in via the
// partner form — they carry a contactEmail; seeded directory lenders don't).
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireRole } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  if (!(await requireRole(['ADMIN']))) {
    return NextResponse.json({ error: 'Forbidden — admin access required' }, { status: 403 })
  }
  try {
    const rows = await prisma.lender.findMany({
      where: { contactEmail: { not: null } },
      orderBy: { createdAt: 'desc' },
      take: 200,
    })
    const applications = rows.map((l) => ({
      id: l.id, name: l.name, region: l.region, status: l.status, partnerTier: l.partnerTier,
      contactName: l.contactName, contactEmail: l.contactEmail, contactPhone: l.contactPhone, linkedinUrl: l.linkedinUrl,
      financingTypes: JSON.parse(l.financingTypes),
      referralModel: l.referralModel, referralFeePercent: l.referralFeePercent, referralFlatAmount: l.referralFlatAmount, referralPlan: l.referralPlan,
      description: l.description, shariaCompliant: l.shariaCompliant,
      agreementSignedAt: l.agreementSignedAt, agreementSignerName: l.agreementSignerName,
      createdAt: l.createdAt,
    }))
    return NextResponse.json({ applications })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed' }, { status: 500 })
  }
}

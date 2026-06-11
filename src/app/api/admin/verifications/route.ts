import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireRole } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(_req: NextRequest) {
  if (!(await requireRole(['ADMIN']))) {
    return NextResponse.json({ error: 'Forbidden — admin access required' }, { status: 403 })
  }
  const rows = await prisma.verificationCase.findMany({ orderBy: { createdAt: 'desc' }, take: 200 })
  const cases = rows.map((c) => ({
    id: c.id, businessName: c.businessName, region: c.region, status: c.status,
    contactEmail: c.contactEmail, userId: c.userId,
    documents: JSON.parse(c.documents),
    ubo: c.ubo ? JSON.parse(c.ubo) : [],
    sanctionsClear: c.sanctionsClear,
    sanctionsResult: c.sanctionsResult ? JSON.parse(c.sanctionsResult) : null,
    reviewerNotes: c.reviewerNotes, createdAt: c.createdAt,
  }))
  return NextResponse.json({ cases })
}

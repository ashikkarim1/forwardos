import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { LENDERS, filterLenders, type LenderRegion } from '@/lib/finance-data'

/**
 * GET /api/finance/lenders?region=CANADA|UAE&sharia=true&amount=<usdCents>
 *
 * Returns region-appropriate lenders. Tries the database first; if no DB is
 * connected (or it's empty), falls back to the canonical static dataset so the
 * Finance Center always renders.
 */
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams
  const region = (params.get('region') as LenderRegion | null) || undefined
  const shariaOnly = params.get('sharia') === 'true'
  const amountUsdCents = params.get('amount') ? Number(params.get('amount')) : undefined

  try {
    const where: Record<string, unknown> = { isActive: true }
    if (region) where.region = { in: [region, 'GLOBAL'] }
    if (shariaOnly) where.shariaCompliant = true

    const dbLenders = await prisma.lender.findMany({
      where,
      orderBy: [{ region: 'asc' }, { interestRateMin: 'asc' }],
    })

    if (dbLenders.length > 0) {
      const serialized = dbLenders.map((l) => ({
        ...l,
        minAmount: Number(l.minAmount),
        maxAmount: Number(l.maxAmount),
        financingTypes: JSON.parse(l.financingTypes),
      }))
      return NextResponse.json({ lenders: serialized, source: 'db' })
    }
    // DB connected but unseeded → fall through to static
    throw new Error('no-db-rows')
  } catch {
    const lenders = filterLenders(LENDERS, { region, shariaOnly, amountUsdCents })
    return NextResponse.json({ lenders, source: 'static' })
  }
}

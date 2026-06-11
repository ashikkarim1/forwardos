import { NextRequest, NextResponse } from 'next/server'
import { getRegionInsight, type Region } from '@/lib/market-insights'

/**
 * GET /api/market-insights?region=CANADA|UAE
 * Returns the regional market report. Currently served from curated regional
 * baselines; swap to live Deal aggregation once production data volume supports it.
 */
export async function GET(request: NextRequest) {
  const region = (request.nextUrl.searchParams.get('region') as Region) || 'CANADA'
  if (region !== 'CANADA' && region !== 'UAE') {
    return NextResponse.json({ error: 'region must be CANADA or UAE' }, { status: 400 })
  }
  return NextResponse.json({ insight: getRegionInsight(region) })
}

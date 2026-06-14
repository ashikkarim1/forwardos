/**
 * GET /api/dashboard/signals?role=buyer|seller|broker
 *
 * Returns real, computed-from-DB market signals for the requesting
 * user's role-specific dashboard. Replaces the hardcoded
 * "Healthcare Sector Heat Spike +34%" mock strings that previously
 * misled paying customers into thinking they were buying real intel.
 */
import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { buyerSignals, sellerSignals, brokerSignals } from '@/lib/services/market-signals'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ signals: [] }, { status: 401 })

  const role = req.nextUrl.searchParams.get('role') || 'buyer'
  try {
    const signals =
      role === 'seller' ? await sellerSignals(session.userId) :
      role === 'broker' ? await brokerSignals(session.userId) :
                          await buyerSignals()
    return NextResponse.json({ signals, computedAt: new Date().toISOString() })
  } catch {
    // Defensive: any DB hiccup → return an empty array, not stale mocks.
    // The dashboard treats empty as "loading / no signals yet" rather
    // than rendering a fake number.
    return NextResponse.json({ signals: [], error: 'compute_failed' }, { status: 500 })
  }
}

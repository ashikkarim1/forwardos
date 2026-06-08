import { NextRequest, NextResponse } from 'next/server'
import { getDealById } from '@/lib/services/deals-service'
import { getComparables } from '@/lib/services/intelligence-service'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deal = await getDealById(params.id)

    if (!deal) {
      return NextResponse.json(
        { error: 'Deal not found', success: false },
        { status: 404 }
      )
    }

    const comparables = await getComparables(params.id, 5)

    return NextResponse.json({
      deal,
      comparables,
      success: true,
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch deal', success: false },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { getSignals } from '@/lib/services/intelligence-service'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Math.min(parseInt(searchParams.get('limit') || '100'), 500)
    const severity = searchParams.get('severity')

    let signals = await getSignals(limit)

    if (severity) {
      signals = signals.filter(s => s.severity === severity)
    }

    const stats = {
      totalSignals: signals.length,
      critical: signals.filter(s => s.severity === 'critical').length,
      high: signals.filter(s => s.severity === 'high').length,
      medium: signals.filter(s => s.severity === 'medium').length,
      low: signals.filter(s => s.severity === 'low').length,
    }

    return NextResponse.json({
      signals,
      stats,
      count: signals.length,
      success: true,
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch signals', success: false },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { getPredictions } from '@/lib/services/intelligence-service'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100)

    const predictions = await getPredictions(limit)

    const stats = {
      totalPredictions: predictions.length,
      avgCloseProbability: Math.round(
        predictions.reduce((sum, p) => sum + p.closeProbability, 0) / predictions.length || 0
      ),
      highProbability: predictions.filter(p => p.closeProbability >= 70).length,
      avgConfidence: (predictions.reduce((sum, p) => sum + p.confidence, 0) / predictions.length || 0).toFixed(2),
    }

    return NextResponse.json({
      predictions,
      stats,
      count: predictions.length,
      success: true,
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch predictions', success: false },
      { status: 500 }
    )
  }
}

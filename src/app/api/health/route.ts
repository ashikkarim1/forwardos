import { NextRequest, NextResponse } from 'next/server'
import { health } from '@/lib/db/client'

export async function GET(request: NextRequest) {
  try {
    const dbHealth = await health()

    return NextResponse.json({
      status: dbHealth.status === 'ok' ? 'healthy' : 'unhealthy',
      database: dbHealth,
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      services: {
        api: 'operational',
        auth: 'operational',
        intelligence: 'operational',
        deals: 'operational',
      },
      success: true,
    })
  } catch (error) {
    console.error('Health check error:', error)
    return NextResponse.json(
      {
        status: 'unhealthy',
        error: 'Health check failed',
        timestamp: new Date().toISOString(),
        success: false,
      },
      { status: 503 }
    )
  }
}

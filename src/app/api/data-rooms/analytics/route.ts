import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const dataRoomId = request.nextUrl.searchParams.get('dataRoomId')
    if (!dataRoomId) {
      return NextResponse.json({ error: 'Missing dataRoomId' }, { status: 400 })
    }

    return NextResponse.json({
      analytics: {
        totalViews: 0,
        totalDownloads: 0,
        totalDocuments: 0,
        activeViewers: 0,
        mostViewedDocs: [],
        recentActivity: [],
      },
      success: true,
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
  }
}

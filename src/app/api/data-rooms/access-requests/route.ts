import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const requestId = `req_${Date.now()}`

    return NextResponse.json({
      requestId,
      status: 'pending',
      createdAt: new Date(),
      success: true,
    }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create request' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const dataRoomId = request.nextUrl.searchParams.get('dataRoomId')
    if (!dataRoomId) {
      return NextResponse.json({ error: 'Missing dataRoomId' }, { status: 400 })
    }

    return NextResponse.json({ requests: [], success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch requests' }, { status: 500 })
  }
}

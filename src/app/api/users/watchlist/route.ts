import { NextRequest, NextResponse } from 'next/server'
import { getWatchlist, addToWatchlist, removeFromWatchlist } from '@/lib/services/user-service'

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')

    if (!userId) {
      return NextResponse.json(
        { error: 'User not authenticated', success: false },
        { status: 401 }
      )
    }

    const watchlist = await getWatchlist(userId)

    return NextResponse.json({
      dealIds: watchlist,
      count: watchlist.length,
      success: true,
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch watchlist', success: false },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')

    if (!userId) {
      return NextResponse.json(
        { error: 'User not authenticated', success: false },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { dealId, action } = body

    if (!dealId) {
      return NextResponse.json(
        { error: 'Deal ID required', success: false },
        { status: 400 }
      )
    }

    if (action === 'add') {
      await addToWatchlist(userId, dealId)
    } else if (action === 'remove') {
      await removeFromWatchlist(userId, dealId)
    } else {
      return NextResponse.json(
        { error: 'Invalid action', success: false },
        { status: 400 }
      )
    }

    const watchlist = await getWatchlist(userId)

    return NextResponse.json({
      dealIds: watchlist,
      count: watchlist.length,
      success: true,
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to update watchlist', success: false },
      { status: 500 }
    )
  }
}

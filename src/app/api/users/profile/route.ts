import { NextRequest, NextResponse } from 'next/server'
import { getUserByEmail, updateUserPreferences } from '@/lib/services/user-service'

export async function GET(request: NextRequest) {
  try {
    const email = request.headers.get('x-user-email')

    if (!email) {
      return NextResponse.json(
        { error: 'No user email provided', success: false },
        { status: 401 }
      )
    }

    const user = await getUserByEmail(email)

    if (!user) {
      return NextResponse.json(
        { error: 'User not found', success: false },
        { status: 404 }
      )
    }

    return NextResponse.json({
      user,
      success: true,
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user profile', success: false },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const email = request.headers.get('x-user-email')
    const userId = request.headers.get('x-user-id')

    if (!email || !userId) {
      return NextResponse.json(
        { error: 'User not authenticated', success: false },
        { status: 401 }
      )
    }

    const body = await request.json()

    const success = await updateUserPreferences(userId, body)

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to update preferences', success: false },
        { status: 500 }
      )
    }

    const updatedUser = await getUserByEmail(email)

    return NextResponse.json({
      user: updatedUser,
      success: true,
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to update profile', success: false },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { getUserByEmail, createUser } from '@/lib/services/user-service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, name, role } = body

    if (!email || !name) {
      return NextResponse.json(
        { error: 'Email and name are required', success: false },
        { status: 400 }
      )
    }

    // Check if user exists
    let user = await getUserByEmail(email)

    // If not, create new user
    if (!user) {
      user = await createUser({
        email,
        name,
        role: role || 'buyer',
        currency: 'USD',
        language: 'en',
      })
    }

    if (!user) {
      return NextResponse.json(
        { error: 'Failed to create user', success: false },
        { status: 500 }
      )
    }

    // Create response with auth headers
    const response = NextResponse.json({
      user,
      token: Buffer.from(`${user.id}:${email}`).toString('base64'),
      success: true,
    })

    // Set auth cookies
    response.cookies.set('userId', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    })

    response.cookies.set('userEmail', email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60,
    })

    return response
  } catch (error) {
    console.error('Login Error:', error)
    return NextResponse.json(
      { error: 'Login failed', success: false },
      { status: 500 }
    )
  }
}

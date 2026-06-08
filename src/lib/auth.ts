import { jwtVerify, SignJWT } from 'jose'
import { cookies } from 'next/headers'

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'dev-secret-key-change-in-production')

export interface JWTPayload {
  userId: string
  email: string
  role: 'SELLER' | 'BUYER' | 'BROKER'
  kycStatus: 'NOT_STARTED' | 'PENDING' | 'VERIFIED' | 'REJECTED' | 'EXPIRED'
}

export async function signToken(payload: JWTPayload): Promise<string> {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret)

  return token
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const verified = await jwtVerify(token, secret)
    return verified.payload as JWTPayload
  } catch (err) {
    return null
  }
}

export async function getSession(): Promise<JWTPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth-token')?.value

  if (!token) return null

  return verifyToken(token)
}

export async function setAuthCookie(token: string): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
}

export async function clearAuthCookie(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete('auth-token')
}

export function requireAuth(role?: 'SELLER' | 'BUYER' | 'BROKER') {
  return async function checkAuth() {
    const session = await getSession()

    if (!session) {
      throw new Error('Unauthorized: No session')
    }

    if (role && session.role !== role) {
      throw new Error(`Unauthorized: Expected role ${role}, got ${session.role}`)
    }

    if (session.kycStatus !== 'VERIFIED') {
      throw new Error('Unauthorized: KYC not verified')
    }

    return session
  }
}

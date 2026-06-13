import { jwtVerify, SignJWT } from 'jose'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'dev-secret-key-change-in-production')

export type UserRole = 'SELLER' | 'BUYER' | 'BROKER' | 'ADMIN'

export interface JWTPayload {
  userId: string
  email: string
  role: UserRole
  kycStatus: 'NOT_STARTED' | 'PENDING' | 'VERIFIED' | 'REJECTED' | 'EXPIRED'
  [key: string]: any
}

// ---------- password hashing ----------
export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 12)
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  // Tolerate legacy plaintext rows (pre-hashing) so existing accounts still log in,
  // but registration never writes plaintext again.
  if (!hash.startsWith('$2')) return plain === hash
  return bcrypt.compare(plain, hash)
}

export async function signToken(payload: JWTPayload): Promise<string> {
  const token = await new SignJWT(payload as Record<string, any>)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret)

  return token
}

/**
 * Sessions issued before this Unix timestamp are rejected on verify, even if
 * the JWT signature is still valid. Bump this constant + redeploy to
 * force-logout every existing user on next request — useful before a demo,
 * after a perceived leak, or after a credential rotation.
 *
 * Unix seconds. Current value picked to invalidate all tokens issued during
 * pre-launch testing (covers the $99 Stripe smoke-test sessions).
 */
const SESSION_REVOKE_BEFORE = 1781400000 // 2026-06-13 ~ deploy moment

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const verified = await jwtVerify(token, secret)
    const iat = typeof verified.payload.iat === 'number' ? verified.payload.iat : 0
    if (iat < SESSION_REVOKE_BEFORE) return null   // revoked — re-login required
    return {
      userId: verified.payload.userId as string,
      email: verified.payload.email as string,
      role: verified.payload.role as any,
      kycStatus: verified.payload.kycStatus as any,
    } as JWTPayload
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

export function requireAuth(role?: UserRole) {
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

/**
 * Lightweight role gate for API routes — checks an authenticated session whose
 * role is in `roles`, WITHOUT requiring KYC (use requireAuth for KYC-gated flows).
 * Returns the session or null; callers respond 401/403 on null.
 */
export async function requireRole(roles: UserRole[]): Promise<JWTPayload | null> {
  const session = await getSession()
  if (!session || !roles.includes(session.role)) return null
  return session
}

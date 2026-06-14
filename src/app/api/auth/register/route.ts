/**
 * POST /api/auth/register  { firstName, lastName, email, password, type }
 *
 * Free account creation — the ONLY workflow for signup. No plan choice, no
 * checkout, no pricing gate: accounts are free for buyers and sellers; paid
 * tiers are dashboard upsells later. Auto-logs the user in by setting the
 * httpOnly session cookie, so the post-signup redirect lands authenticated
 * (e.g. straight back to the contact-seller form they came from).
 */
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, signToken, setAuthCookie } from '@/lib/auth'
import { rateLimit, clientIp, isSameOrigin } from '@/lib/rate-limit'
import { logAudit } from '@/lib/audit'
import crypto from 'crypto'

const VALID_TYPES = new Set(['buyer', 'seller', 'broker'])

export async function POST(request: NextRequest) {
  try {
    if (!isSameOrigin(request)) {
      return NextResponse.json({ error: 'Cross-origin request blocked' }, { status: 403 })
    }
    const rl = rateLimit(`register:${clientIp(request)}`, 5, 60 * 60_000)
    if (!rl.ok) {
      return NextResponse.json({ error: 'Too many signups. Try again later.' }, {
        status: 429, headers: { 'Retry-After': String(rl.retryAfter) },
      })
    }

    const body = await request.json().catch(() => ({}))
    const { firstName, lastName, email, password, type } = body as Record<string, string>

    const errors: string[] = []
    if (!firstName?.trim()) errors.push('First name')
    if (!lastName?.trim()) errors.push('Last name')
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('Valid email')
    if (!password || password.length < 8) errors.push('Password (8+ characters)')
    if (!type || !VALID_TYPES.has(type)) errors.push('Account type')
    if (errors.length) {
      return NextResponse.json({ error: `Missing or invalid: ${errors.join(', ')}` }, { status: 400 })
    }

    const normalizedEmail = email.toLowerCase().trim()
    const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } })
    if (existing) {
      return NextResponse.json({ error: 'An account with that email already exists. Try signing in.' }, { status: 409 })
    }

    const role = type === 'seller' ? 'SELLER' : type === 'broker' ? 'BROKER' : 'BUYER'
    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        name: `${firstName.trim()} ${lastName.trim()}`,
        password: await hashPassword(password),
        role,
        referralCode: crypto.createHash('sha256').update(normalizedEmail + 'forward2026').digest('hex').slice(0, 24),
        onboardingStatus: 'ACCOUNT_CREATED',
      },
      select: { id: true, email: true, name: true, role: true, kycStatus: true },
    })

    // Auto-login: same session cookie the login route sets.
    const token = await signToken({
      userId: user.id,
      email: user.email,
      role: user.role as 'SELLER' | 'BUYER' | 'BROKER' | 'ADMIN',
      kycStatus: user.kycStatus as never,
    })
    await setAuthCookie(token)

    await logAudit({
      req: request, userId: user.id, action: 'auth.register',
      resourceType: 'user', resourceId: user.id,
      changes: { role: user.role, email: user.email },
    })

    return NextResponse.json({ success: true, user: { id: user.id, name: user.name, email: user.email, role: user.role } }, { status: 201 })
  } catch (e) {
    console.error('[API] register error:', e)
    return NextResponse.json({ error: 'Registration failed. Please try again.' }, { status: 500 })
  }
}

'use client'

/**
 * Free account creation — the only signup workflow.
 *
 * No plan picker, no checkout, no pricing: accounts are free for buyers,
 * sellers, and brokers; paid tiers are dashboard upsells later. Honors
 * ?type=buyer|seller|broker (pre-selects the role) and ?redirect= (where to
 * land after signup — e.g. back to the contact-seller form). Auto-login via
 * the session cookie set by /api/auth/register.
 */
import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { PublicHeader } from '@/components/Navigation'
import {
  Briefcase, TrendingUp, Users, Loader, AlertCircle, ArrowRight,
  ShieldCheck, Lock, CheckCircle2,
} from 'lucide-react'
import { PasswordInput } from '@/components/PasswordInput'
import { COLOR_PRIMARY, COLOR_TEXT_SECONDARY, COLOR_BORDER, COLOR_BG_PRIMARY } from '@/styles/forward-colors'

const TYPES = [
  { id: 'buyer', label: 'I want to buy a business', icon: Briefcase },
  { id: 'seller', label: 'I want to sell my business', icon: TrendingUp },
  { id: 'broker', label: "I'm a broker", icon: Users },
] as const

// Tier → copy + role pre-selection when the user came from a paid CTA.
const TIER_COPY = {
  BUYER_PREMIUM:  { role: 'buyer',  name: 'Buyer Premium',  price: '$99/mo'  },
  SELLER_PREMIUM: { role: 'seller', name: 'Seller Premium', price: '$199/mo' },
  BROKER_PRO:     { role: 'broker', name: 'Broker Pro',     price: '$599/mo' },
} as const

export function SignupContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const typeParam = searchParams?.get('type') || ''
  const redirectParam = searchParams?.get('redirect') || ''

  // Detect "I want to upgrade after signing up" intent. If the redirect points
  // at /api/billing/checkout?tier=X, the user came from a paid CTA on the
  // pricing page — we surface that in the copy + pre-pick the right role so
  // they don't see "Free account · 60s" when they're about to pay $99/mo.
  const upgradeTier = (() => {
    try {
      if (!redirectParam.startsWith('/api/billing/checkout')) return null
      const q = new URLSearchParams(redirectParam.split('?')[1] || '')
      const tier = q.get('tier') || ''
      return tier in TIER_COPY ? (tier as keyof typeof TIER_COPY) : null
    } catch { return null }
  })()

  const defaultType: string = upgradeTier
    ? TIER_COPY[upgradeTier].role
    : ['buyer', 'seller', 'broker'].includes(typeParam) ? typeParam : 'buyer'

  const [type, setType] = useState<string>(defaultType)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [agree, setAgree] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const canSubmit =
    firstName.trim() && lastName.trim() &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
    password.length >= 8 && agree

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit) return
    setLoading(true)
    setError('')
    try {
      const r = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, password, type }),
      })
      const data = await r.json()
      if (!r.ok) { setError(data.error || 'Signup failed'); return }

      // Honor ?redirect= (same-origin relative paths only — open-redirect guard).
      if (redirectParam && redirectParam.startsWith('/') && !redirectParam.startsWith('//')) {
        // API routes need a full browser navigation so the new auth cookie
        // is sent. router.push() does a soft client-side nav that doesn't
        // fire the API handler at all — caused the "loops back to signup"
        // bug when the redirect was /api/billing/checkout.
        if (redirectParam.startsWith('/api/')) {
          window.location.href = redirectParam
        } else {
          router.push(redirectParam)
        }
        return
      }
      // Role-appropriate landing: sellers go list, buyers browse, brokers dashboard.
      if (type === 'seller') router.push('/list')
      else if (type === 'broker') router.push('/dashboard/broker')
      else router.push('/marketplace')
    } catch {
      setError('Network error — please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen" style={{ background: COLOR_BG_PRIMARY }}>
      <PublicHeader />

      <div className="max-w-md mx-auto px-6 py-12">
        {upgradeTier ? (
          <>
            <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-center mb-3" style={{ color: '#B8956A' }}>
              Step 1 of 2 · Create your account
            </p>
            <h1 className="text-3xl md:text-4xl font-black text-center mb-3" style={{ color: COLOR_PRIMARY }}>
              Join Forward to subscribe
            </h1>
            <p className="text-sm text-center mb-8" style={{ color: COLOR_TEXT_SECONDARY }}>
              You&apos;re subscribing to <strong>{TIER_COPY[upgradeTier].name}</strong> · <strong>{TIER_COPY[upgradeTier].price}</strong>.
              We&apos;ll take you to Stripe to complete payment right after this step.
            </p>
          </>
        ) : (
          <>
            <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-center mb-3" style={{ color: '#B8956A' }}>
              Free account · 60 seconds
            </p>
            <h1 className="text-3xl md:text-4xl font-black text-center mb-3" style={{ color: COLOR_PRIMARY }}>
              Join Forward
            </h1>
            <p className="text-sm text-center mb-8" style={{ color: COLOR_TEXT_SECONDARY }}>
              Free forever for browsing, saving, and contacting sellers. No credit card.
            </p>
          </>
        )}

        <form onSubmit={submit} className="space-y-4">
          {/* Role selector */}
          <div className="space-y-2">
            {TYPES.map((t) => {
              const Icon = t.icon
              const active = type === t.id
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setType(t.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-sm font-bold text-left transition-colors"
                  style={{
                    borderColor: active ? '#B8956A' : COLOR_BORDER,
                    background: active ? '#FAF6EF' : 'white',
                    color: COLOR_PRIMARY,
                  }}
                >
                  <Icon size={18} style={{ color: active ? '#B8956A' : COLOR_TEXT_SECONDARY }} />
                  {t.label}
                  {active && <CheckCircle2 size={16} className="ml-auto" style={{ color: '#B8956A' }} />}
                </button>
              )
            })}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input
              type="text" required placeholder="First name" value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="px-3 py-3 rounded-lg border bg-white text-sm focus:outline-none focus:ring-2"
              style={{ borderColor: COLOR_BORDER }}
            />
            <input
              type="text" required placeholder="Last name" value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="px-3 py-3 rounded-lg border bg-white text-sm focus:outline-none focus:ring-2"
              style={{ borderColor: COLOR_BORDER }}
            />
          </div>
          <input
            type="email" required placeholder="you@example.com" value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-3 rounded-lg border bg-white text-sm focus:outline-none focus:ring-2"
            style={{ borderColor: COLOR_BORDER }}
          />
          <PasswordInput
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password (8+ characters)"
            className="w-full px-3 py-3 rounded-lg border bg-white text-sm focus:outline-none focus:ring-2"
            style={{ borderColor: COLOR_BORDER }}
          />

          <label className="flex items-start gap-2.5 cursor-pointer text-xs leading-relaxed" style={{ color: COLOR_TEXT_SECONDARY }}>
            <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-0.5 accent-[#B8956A]" />
            <span>
              I agree to the <Link href="/terms" className="underline" style={{ color: '#B8956A' }}>Terms</Link> and{' '}
              <Link href="/privacy" className="underline" style={{ color: '#B8956A' }}>Privacy Policy</Link>.
            </span>
          </label>

          {error && (
            <div className="rounded-lg border p-3 text-sm flex items-start gap-2" style={{ borderColor: '#FCA5A5', background: '#FEE2E2', color: '#991B1B' }}>
              <AlertCircle size={15} className="flex-shrink-0 mt-0.5" /> {error}
            </div>
          )}

          <button
            type="submit" disabled={!canSubmit || loading}
            className="w-full px-6 py-3.5 rounded-lg font-bold text-white text-sm hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
            style={{ background: COLOR_PRIMARY }}
          >
            {loading
              ? <><Loader size={15} className="animate-spin" /> Creating account…</>
              : upgradeTier
                ? <>Continue to payment <ArrowRight size={15} /></>
                : <>Create free account <ArrowRight size={15} /></>
            }
          </button>

          <p className="text-center text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
            Already have an account?{' '}
            <Link href={`/auth/login${redirectParam ? `?redirect=${encodeURIComponent(redirectParam)}` : ''}`} className="font-bold underline" style={{ color: COLOR_PRIMARY }}>
              Sign in
            </Link>
          </p>
        </form>

        <div className="mt-10 pt-6 border-t space-y-2.5 text-xs" style={{ borderColor: COLOR_BORDER, color: COLOR_TEXT_SECONDARY }}>
          <div className="flex items-start gap-2"><ShieldCheck size={13} style={{ color: '#2D7A5F' }} className="mt-0.5 flex-shrink-0" /><span>Forward verifies every buyer and seller before any introduction.</span></div>
          <div className="flex items-start gap-2"><Lock size={13} style={{ color: '#B8956A' }} className="mt-0.5 flex-shrink-0" /><span>Your details stay private — never shared publicly, never sold.</span></div>
        </div>
      </div>
    </div>
  )
}

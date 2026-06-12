'use client'

export const dynamic = 'force-dynamic'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { CheckCircle2, XCircle, Loader, Mail } from 'lucide-react'
import { PublicHeader } from '@/components/Navigation'
import { COLOR_PRIMARY, COLOR_TEXT_SECONDARY, COLOR_BORDER, COLOR_ACCENT, COLOR_BG_PRIMARY } from '@/styles/forward-colors'

type State = 'idle' | 'verifying' | 'ok' | 'error'

function VerifyEmailInner() {
  const params = useSearchParams()
  const token = params?.get('token') ?? ''
  const [state, setState] = useState<State>('idle')
  const [message, setMessage] = useState('')
  const [resendEmail, setResendEmail] = useState('')
  const [resendStatus, setResendStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  // We DO NOT auto-fire the POST on page load. Email security scanners
  // (Microsoft Safe Links, Mimecast, Proofpoint, Gmail link-safety, etc.)
  // prefetch links with headless browsers, which would silently consume the
  // one-time token before the human ever clicks. Requiring an explicit click
  // defeats that — scanners follow links, but they don't click buttons.

  async function confirmVerification() {
    if (!token) { setState('error'); setMessage('No verification token in the link.'); return }
    setState('verifying')
    try {
      const r = await fetch('/api/seller/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })
      const d = await r.json().catch(() => ({}))
      if (r.ok) setState('ok')
      else { setState('error'); setMessage(d.error || 'This link is invalid or has expired.') }
    } catch {
      setState('error'); setMessage('Something went wrong. Please try again.')
    }
  }

  async function resendVerification() {
    if (!resendEmail) return
    setResendStatus('sending')
    try {
      const r = await fetch('/api/seller/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resendEmail }),
      })
      setResendStatus(r.ok ? 'sent' : 'error')
    } catch {
      setResendStatus('error')
    }
  }

  return (
    <div className="min-h-screen" style={{ background: COLOR_BG_PRIMARY }}>
      <PublicHeader />
      <div className="max-w-md mx-auto px-6 py-20 text-center">
        {state === 'idle' && token && (
          <>
            <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4" style={{ background: '#FAF6EF' }}>
              <Mail size={32} style={{ color: COLOR_ACCENT }} />
            </div>
            <h1 className="text-3xl font-black mb-2" style={{ color: COLOR_PRIMARY }}>Confirm your email</h1>
            <p className="mb-6" style={{ color: COLOR_TEXT_SECONDARY }}>Click the button below to verify your email address.</p>
            <button onClick={confirmVerification} className="px-6 py-3 rounded-lg font-bold text-white hover:opacity-90" style={{ background: COLOR_ACCENT }}>
              Confirm email address
            </button>
          </>
        )}

        {state === 'idle' && !token && (
          <>
            <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4" style={{ background: '#FEE2E2' }}>
              <XCircle size={32} style={{ color: '#DC2626' }} />
            </div>
            <h1 className="text-2xl font-black mb-2" style={{ color: COLOR_PRIMARY }}>No verification token</h1>
            <p className="mb-6" style={{ color: COLOR_TEXT_SECONDARY }}>This link is missing the verification code. Use the button below to send a new email.</p>
          </>
        )}

        {state === 'verifying' && (
          <>
            <Loader size={40} className="mx-auto mb-4 animate-spin" style={{ color: COLOR_ACCENT }} />
            <p style={{ color: COLOR_TEXT_SECONDARY }}>Verifying your email…</p>
          </>
        )}

        {state === 'ok' && (
          <>
            <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4" style={{ background: '#EAF5F0' }}>
              <CheckCircle2 size={32} style={{ color: '#2D7A5F' }} />
            </div>
            <h1 className="text-3xl font-black mb-2" style={{ color: COLOR_PRIMARY }}>Email verified ✓</h1>
            <p className="mb-6" style={{ color: COLOR_TEXT_SECONDARY }}>Thanks — your email is confirmed. You can finish setting up your listing.</p>
            <div className="flex gap-3 justify-center">
              <Link href="/seller/onboarding" className="px-5 py-3 rounded-lg font-bold text-white hover:opacity-90" style={{ background: COLOR_ACCENT }}>Continue setup</Link>
              <Link href="/auth/login" className="px-5 py-3 rounded-lg font-bold border hover:bg-gray-50" style={{ borderColor: COLOR_BORDER, color: COLOR_PRIMARY }}>Sign in</Link>
            </div>
          </>
        )}

        {state === 'error' && (
          <>
            <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4" style={{ background: '#FEE2E2' }}>
              <XCircle size={32} style={{ color: '#DC2626' }} />
            </div>
            <h1 className="text-2xl font-black mb-2" style={{ color: COLOR_PRIMARY }}>Verification failed</h1>
            <p className="mb-6" style={{ color: COLOR_TEXT_SECONDARY }}>{message}</p>
            <p className="text-sm mb-4" style={{ color: COLOR_TEXT_SECONDARY }}>
              <Link href="/auth/login" className="underline" style={{ color: COLOR_ACCENT }}>Try signing in</Link>
              {' — if your email was already verified by a previous click, your account is ready.'}
            </p>
          </>
        )}

        {(state === 'error' || (state === 'idle' && !token)) && (
          <div className="mt-10 pt-6 border-t" style={{ borderColor: COLOR_BORDER }}>
            <p className="text-sm font-bold mb-3" style={{ color: COLOR_PRIMARY }}>Send a new verification email</p>
            {resendStatus === 'sent' ? (
              <p className="text-sm" style={{ color: '#2D7A5F' }}>✓ If that email is registered and not yet verified, we've sent a new link. Check your inbox.</p>
            ) : (
              <div className="flex gap-2 max-w-sm mx-auto">
                <input
                  type="email"
                  value={resendEmail}
                  onChange={(e) => setResendEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 px-3 py-2 rounded border text-sm"
                  style={{ borderColor: COLOR_BORDER }}
                />
                <button
                  onClick={resendVerification}
                  disabled={resendStatus === 'sending' || !resendEmail}
                  className="px-4 py-2 rounded text-sm font-bold text-white disabled:opacity-50"
                  style={{ background: COLOR_ACCENT }}
                >
                  {resendStatus === 'sending' ? 'Sending…' : 'Resend'}
                </button>
              </div>
            )}
            {resendStatus === 'error' && (
              <p className="text-xs mt-2" style={{ color: '#DC2626' }}>Couldn't send. Try again in a moment.</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailInner />
    </Suspense>
  )
}

'use client'

export const dynamic = 'force-dynamic'

import { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { CheckCircle2, XCircle, Loader } from 'lucide-react'
import { PublicHeader } from '@/components/Navigation'
import { COLOR_PRIMARY, COLOR_TEXT_SECONDARY, COLOR_BORDER, COLOR_ACCENT, COLOR_BG_PRIMARY } from '@/styles/forward-colors'

function VerifyEmailInner() {
  const params = useSearchParams()
  const token = params?.get('token') ?? ''
  const [state, setState] = useState<'verifying' | 'ok' | 'error'>('verifying')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!token) { setState('error'); setMessage('No verification token provided.'); return }
    fetch('/api/seller/verify-email', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token }),
    })
      .then(async (r) => {
        const d = await r.json().catch(() => ({}))
        if (r.ok) setState('ok')
        else { setState('error'); setMessage(d.error || 'This link is invalid or has expired.') }
      })
      .catch(() => { setState('error'); setMessage('Something went wrong. Please try again.') })
  }, [token])

  return (
    <div className="min-h-screen" style={{ background: COLOR_BG_PRIMARY }}>
      <PublicHeader />
      <div className="max-w-md mx-auto px-6 py-20 text-center">
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
            <Link href="/seller/register" className="px-5 py-3 rounded-lg font-bold text-white hover:opacity-90" style={{ background: COLOR_ACCENT }}>Back to sign up</Link>
          </>
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

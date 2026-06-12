'use client'

export const dynamic = 'force-dynamic'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  AlertCircle, ArrowRight, CheckCircle2, Loader, Lock, ShieldCheck,
} from 'lucide-react'
import { PasswordInput } from '@/components/PasswordInput'
import { PublicHeader } from '@/components/Navigation'
import { COLOR_PRIMARY, COLOR_TEXT_SECONDARY, COLOR_BORDER, COLOR_BG_PRIMARY } from '@/styles/forward-colors'

function ResetPasswordInner() {
  const router = useRouter()
  const params = useSearchParams()
  const token = params?.get('token') ?? ''

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState<{ role: string } | null>(null)

  // We do NOT consume the token on page load — email scanners (Microsoft Safe
  // Links, Mimecast, etc.) prefetch links and would burn the token before
  // the human ever sees this page. Same hardening pattern as /verify-email.

  const canSubmit = token && password.length >= 8 && password === confirm

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit) return
    setSubmitting(true)
    setError('')
    try {
      const r = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })
      const data = await r.json()
      if (!r.ok) { setError(data.error || 'Reset failed'); return }
      setDone({ role: data.role })
      // Auto-redirect to a sensible landing for the role after a beat.
      setTimeout(() => {
        if (data.role === 'SELLER') router.push('/dashboard/seller')
        else if (data.role === 'BROKER') router.push('/dashboard/broker')
        else if (data.role === 'ADMIN') router.push('/admin/listings')
        else router.push('/marketplace')
      }, 1400)
    } catch {
      setError('Network error — please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (!token) {
    return (
      <div className="min-h-screen" style={{ background: COLOR_BG_PRIMARY }}>
        <PublicHeader />
        <div className="max-w-md mx-auto px-6 py-16 text-center">
          <p className="text-sm mb-4" style={{ color: COLOR_TEXT_SECONDARY }}>
            This link is missing its reset token.
          </p>
          <Link href="/auth/forgot-password" className="font-bold underline" style={{ color: COLOR_PRIMARY }}>
            Request a new reset link →
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: COLOR_BG_PRIMARY }}>
      <PublicHeader />
      <div className="max-w-md mx-auto px-6 py-16">
        {done ? (
          <div className="text-center">
            <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4" style={{ background: '#EAF5F0' }}>
              <CheckCircle2 size={28} style={{ color: '#2D7A5F' }} />
            </div>
            <p className="text-[10px] font-bold tracking-[0.25em] uppercase mb-2" style={{ color: '#B8956A' }}>You&apos;re back in</p>
            <h1 className="text-3xl font-black mb-3" style={{ color: COLOR_PRIMARY }}>Password updated.</h1>
            <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>Redirecting you to your dashboard…</p>
          </div>
        ) : (
          <>
            <p className="text-[10px] font-bold tracking-[0.25em] uppercase mb-2" style={{ color: '#B8956A' }}>Set a new password</p>
            <h1 className="text-3xl font-black mb-3" style={{ color: COLOR_PRIMARY }}>Choose your new password</h1>
            <p className="text-sm mb-6" style={{ color: COLOR_TEXT_SECONDARY }}>
              Pick something at least 8 characters long. You&apos;ll be signed in right after.
            </p>

            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold mb-1" style={{ color: COLOR_PRIMARY }}>New password</label>
                <PasswordInput
                  required value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full px-3 py-3 rounded-lg border bg-white text-sm focus:outline-none focus:ring-2"
                  style={{ borderColor: COLOR_BORDER }}
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1" style={{ color: COLOR_PRIMARY }}>Confirm password</label>
                <PasswordInput
                  required value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Re-enter your new password"
                  className="w-full px-3 py-3 rounded-lg border bg-white text-sm focus:outline-none focus:ring-2"
                  style={{ borderColor: COLOR_BORDER }}
                />
                {confirm.length > 0 && confirm !== password && (
                  <p className="text-[11px] mt-1" style={{ color: '#B45309' }}>Passwords don&apos;t match yet.</p>
                )}
              </div>

              {error && (
                <div className="rounded-lg border p-3 text-sm flex items-start gap-2" style={{ borderColor: '#FCA5A5', background: '#FEE2E2', color: '#991B1B' }}>
                  <AlertCircle size={15} className="flex-shrink-0 mt-0.5" /> {error}
                </div>
              )}

              <button
                type="submit" disabled={!canSubmit || submitting}
                className="w-full px-6 py-3.5 rounded-lg font-bold text-white text-sm hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                style={{ background: COLOR_PRIMARY }}
              >
                {submitting ? <><Loader size={15} className="animate-spin" /> Updating…</> : <>Set new password <ArrowRight size={15} /></>}
              </button>

              <div className="pt-4 border-t mt-6 text-xs space-y-2" style={{ borderColor: COLOR_BORDER, color: COLOR_TEXT_SECONDARY }}>
                <div className="flex items-start gap-2"><Lock size={12} style={{ color: '#B8956A' }} className="mt-0.5 flex-shrink-0" /><span>Reset link is one-time use and expires in 60 minutes.</span></div>
                <div className="flex items-start gap-2"><ShieldCheck size={12} style={{ color: '#2D7A5F' }} className="mt-0.5 flex-shrink-0" /><span>You&apos;ll be signed in automatically — no second step.</span></div>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return <Suspense fallback={null}><ResetPasswordInner /></Suspense>
}

'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, CheckCircle2, Loader, Mail } from 'lucide-react'
import { PublicHeader } from '@/components/Navigation'
import { COLOR_PRIMARY, COLOR_TEXT_SECONDARY, COLOR_BORDER, COLOR_BG_PRIMARY } from '@/styles/forward-colors'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return
    setSubmitting(true)
    try {
      await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })
      setSubmitted(true)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen" style={{ background: COLOR_BG_PRIMARY }}>
      <PublicHeader />
      <div className="max-w-md mx-auto px-6 py-16">
        <Link href="/auth/login" className="inline-flex items-center gap-1.5 text-sm font-semibold mb-6 hover:underline" style={{ color: COLOR_TEXT_SECONDARY }}>
          <ArrowLeft size={14} /> Back to sign in
        </Link>

        {submitted ? (
          <div className="text-center">
            <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4" style={{ background: '#EAF5F0' }}>
              <CheckCircle2 size={28} style={{ color: '#2D7A5F' }} />
            </div>
            <p className="text-[10px] font-bold tracking-[0.25em] uppercase mb-2" style={{ color: '#B8956A' }}>Check your inbox</p>
            <h1 className="text-3xl font-black mb-3" style={{ color: COLOR_PRIMARY }}>If we have you on file, a reset link is on its way.</h1>
            <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
              We sent a password reset link to <strong>{email}</strong> if that address has a Forward account.
              The link expires in 60 minutes. Check your spam folder if you don&apos;t see it within a minute or two.
            </p>
            <p className="text-xs mt-6" style={{ color: COLOR_TEXT_SECONDARY }}>
              Wrong email?{' '}
              <button onClick={() => { setSubmitted(false); setEmail('') }} className="underline font-semibold" style={{ color: COLOR_PRIMARY }}>
                Try a different one
              </button>
            </p>
          </div>
        ) : (
          <>
            <p className="text-[10px] font-bold tracking-[0.25em] uppercase mb-2" style={{ color: '#B8956A' }}>Reset your password</p>
            <h1 className="text-3xl font-black mb-3" style={{ color: COLOR_PRIMARY }}>Let&apos;s get you back in.</h1>
            <p className="text-sm mb-6" style={{ color: COLOR_TEXT_SECONDARY }}>
              Enter the email you signed up with — we&apos;ll send a reset link valid for 60 minutes.
            </p>

            <form onSubmit={submit} className="space-y-4">
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: COLOR_TEXT_SECONDARY }} />
                <input
                  type="email" required value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-3 py-3 rounded-lg border bg-white text-sm focus:outline-none focus:ring-2"
                  style={{ borderColor: COLOR_BORDER }}
                  autoFocus
                />
              </div>
              <button
                type="submit" disabled={submitting}
                className="w-full px-6 py-3.5 rounded-lg font-bold text-white text-sm hover:opacity-90 disabled:opacity-50 inline-flex items-center justify-center gap-2"
                style={{ background: COLOR_PRIMARY }}
              >
                {submitting ? <><Loader size={15} className="animate-spin" /> Sending…</> : <>Email me a reset link <ArrowRight size={15} /></>}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

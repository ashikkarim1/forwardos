'use client'

import { useState } from 'react'
import { useLocale } from '@/context/LocaleContext'
import { hasConsent } from '@/lib/consent'

const KINDS = ['feature', 'bug', 'praise', 'other'] as const
const KIND_ICON: Record<string, string> = { feature: '💡', bug: '🐞', praise: '💜', other: '💬' }
const KIND_LABEL: Record<string, string> = { feature: 'Feature idea', bug: 'Bug', praise: 'Praise', other: 'Other' }

/**
 * Stable pseudonymous id used to correlate a visitor's own submissions. Gated on
 * analytics consent: without consent we never create or read the id, so feedback
 * is fully anonymous.
 */
function anonId(): string | null {
  if (typeof window === 'undefined') return null
  if (!hasConsent('analytics')) return null
  try {
    let id = localStorage.getItem('forward_anon_id')
    if (!id) {
      id = 'anon_' + Math.random().toString(36).slice(2) + Date.now().toString(36)
      localStorage.setItem('forward_anon_id', id)
    }
    return id
  } catch {
    return null
  }
}

/**
 * Site-wide "Share feedback" widget — floating trigger + modal with feature/bug/
 * praise/other categories. Mirrors the Firmologist feedback capability. Posts to
 * /api/feedback (works logged-in or anonymous).
 */
export default function FeedbackWidget() {
  const { locale } = useLocale()
  const [open, setOpen] = useState(false)
  const [kind, setKind] = useState<string>('feature')
  const [message, setMessage] = useState('')
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')

  async function submit() {
    if (message.trim().length < 2) return
    setState('sending')
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kind, message, locale, anonId: anonId(), page: window.location.pathname }),
      })
      if (!res.ok) return setState('error')
      setState('done')
      setTimeout(() => {
        setOpen(false)
        setState('idle')
        setMessage('')
        setKind('feature')
      }, 1800)
    } catch {
      setState('error')
    }
  }

  return (
    <>
      {/* Floating trigger — above the mobile bottom area */}
      <button
        onClick={() => setOpen(true)}
        className="print:hidden fixed z-40 bottom-20 md:bottom-6 right-4 md:right-6 inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-full bg-slate-900 text-white text-sm font-bold shadow-lg hover:bg-slate-800 transition"
        aria-label="Share feedback"
      >
        💬 <span className="hidden sm:inline">Feedback</span>
      </button>

      {open && (
        <div
          className="print:hidden fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-slate-900/40"
          onClick={() => setOpen(false)}
        >
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-5" onClick={(e) => e.stopPropagation()}>
            {state === 'done' ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-2" aria-hidden>🫶</div>
                <p className="font-bold text-slate-900">Thank you — we read every message.</p>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-bold text-slate-900 text-lg">Share feedback</p>
                    <p className="text-xs text-slate-500 mt-0.5">Feature ideas, bugs, or just hello — we read everything.</p>
                  </div>
                  <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-700 text-xl leading-none" aria-label="Close">×</button>
                </div>

                <div className="mt-4 grid grid-cols-4 gap-1.5">
                  {KINDS.map((k) => (
                    <button
                      key={k}
                      onClick={() => setKind(k)}
                      className={`flex flex-col items-center gap-1 py-2.5 rounded-xl border-2 text-[11px] font-semibold transition ${
                        kind === k ? 'border-[#B8956A] bg-[#FAF6EF] text-[#8C6D45]' : 'border-slate-200 text-slate-500 hover:border-slate-300'
                      }`}
                    >
                      <span className="text-base" aria-hidden>{KIND_ICON[k]}</span>
                      {KIND_LABEL[k]}
                    </button>
                  ))}
                </div>

                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="What would make Forward Intelligence better for you?"
                  rows={4}
                  maxLength={4000}
                  className="mt-3 w-full rounded-xl border border-slate-300 px-3.5 py-3 text-slate-900 focus:border-[#B8956A] focus:ring-2 focus:ring-[#FAF6EF] outline-none resize-none"
                />

                {state === 'error' && <p className="mt-2 text-xs font-semibold text-red-700">Something went wrong. Please try again.</p>}

                <button
                  onClick={submit}
                  disabled={state === 'sending' || message.trim().length < 2}
                  className="mt-3 w-full px-6 py-3 rounded-xl bg-[#1A1A1A] text-white font-bold  transition disabled:opacity-50"
                >
                  {state === 'sending' ? 'Sending…' : 'Send feedback'}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}

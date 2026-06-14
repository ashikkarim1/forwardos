'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  ChevronRight, Lock, ShieldCheck, ArrowLeft, CheckCircle2, Mail,
  Loader, AlertCircle, UserPlus, LogIn, ShieldAlert,
} from 'lucide-react'
import { PublicHeader } from '@/components/Navigation'
import { COLOR_PRIMARY, COLOR_TEXT_SECONDARY, COLOR_BORDER, COLOR_ACCENT, COLOR_BG_PRIMARY } from '@/styles/forward-colors'
import { palette } from '@/styles/tokens'

interface AuthUser { id: string; name?: string | null; email: string; role?: string }

interface Props {
  dealId: string
  slug: string
  headline: string
  indLabel: string
  region: string
  askDisplay: string
  heatScore: number | null
  qualityScore: number | null
}

const CAPITAL_RANGES = [
  'Under $500K', '$500K – $1M', '$1M – $2M', '$2M – $5M',
  '$5M – $10M', '$10M – $25M', '$25M – $50M', 'Over $50M',
]
const TIMELINES = [
  { id: 'immediate', label: 'Ready to move immediately' },
  { id: '1-3mo', label: 'Within 1–3 months' },
  { id: '3-6mo', label: 'Within 3–6 months' },
  { id: '6-12mo', label: 'Within 6–12 months' },
  { id: 'exploring', label: 'Exploring the market' },
]
const BUYER_TYPES = [
  { id: 'individual', label: 'Individual buyer' },
  { id: 'family-office', label: 'Family office' },
  { id: 'pe', label: 'Private equity firm' },
  { id: 'strategic', label: 'Strategic acquirer' },
  { id: 'broker', label: 'Broker representing buyer' },
]
const COUNTRIES = [
  'United States', 'Canada', 'United Arab Emirates', 'United Kingdom',
  'Saudi Arabia', 'Germany', 'France', 'Australia', 'Singapore', 'Other',
]

export function ContactForm(props: Props) {
  const { dealId, slug, headline, indLabel, region, askDisplay, heatScore, qualityScore } = props
  const pathname = usePathname()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<{ reference: string } | null>(null)
  // null = checking; undefined = no user (anonymous); object = signed in
  const [authUser, setAuthUser] = useState<AuthUser | null | undefined>(null)
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', country: '',
    capitalAvailableRange: '', timeline: '', financingNeed: '',
    buyerType: '', message: '', bindingAcknowledged: false,
  })

  // Check whether the visitor has an active session. Sellers vet inquiries
  // looking for real buyers, not bot traffic — so the form is gated behind
  // a Forward account. We pre-populate name + email from the session, then
  // the buyer fills the rest.
  useEffect(() => {
    let cancelled = false
    fetch('/api/auth/me', { credentials: 'include' })
      .then(async (r) => {
        if (cancelled) return
        if (r.ok) {
          const data = await r.json()
          const user = data?.user as AuthUser | null
          if (user) {
            setAuthUser(user)
            // Pre-populate from session so the buyer doesn't re-type.
            const [first, ...rest] = (user.name || '').split(' ')
            setForm((prev) => ({
              ...prev,
              firstName: prev.firstName || first || '',
              lastName: prev.lastName || rest.join(' ') || '',
              email: prev.email || user.email || '',
            }))
          } else {
            setAuthUser(undefined)
          }
        } else {
          setAuthUser(undefined)
        }
      })
      .catch(() => { if (!cancelled) setAuthUser(undefined) })
    return () => { cancelled = true }
  }, [])

  function update<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [k]: v }))
  }

  const canSubmit =
    form.firstName.trim() && form.lastName.trim() &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) &&
    form.phone.replace(/\D/g, '').length >= 6 &&
    form.country && form.timeline && form.buyerType &&
    form.message.trim().length >= 10 && form.bindingAcknowledged

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit) return
    setSubmitting(true)
    setError('')
    try {
      const r = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dealId, ...form }),
      })
      const data = await r.json()
      if (!r.ok) { setError(data.error || 'Failed to submit. Please try again.'); return }
      setResult({ reference: data.reference })
    } catch {
      setError('Network error — please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  // ─── Success ─────────────────────────────────────────────────────────
  if (result) {
    return (
      <div className="min-h-screen" style={{ background: COLOR_BG_PRIMARY }}>
        <PublicHeader />
        <div className="max-w-2xl mx-auto px-6 py-16">
          <div className="rounded-2xl border bg-white p-10 text-center" style={{ borderColor: COLOR_BORDER }}>
            <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-5" style={{ background: palette.emerald[50] }}>
              <CheckCircle2 size={28} style={{ color: palette.emerald[500] }} />
            </div>
            <p className="text-[10px] font-bold tracking-[0.22em] uppercase mb-3" style={{ color: palette.champagne[500] }}>Introduction received</p>
            <h1 className="text-3xl md:text-4xl font-black mb-3" style={{ color: COLOR_PRIMARY }}>Thank you — we&apos;ll be in touch.</h1>
            <p className="text-base mb-6" style={{ color: COLOR_TEXT_SECONDARY }}>
              Forward Intelligence is verifying your details. A confirmation has been sent to <strong>{form.email}</strong>.
              We typically introduce buyers and sellers within 24 hours.
            </p>
            <div className="rounded-lg p-4 mb-6 text-sm" style={{ background: palette.cream[200], color: COLOR_PRIMARY }}>
              Reference · <strong className="font-mono">{result.reference}</strong>
            </div>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href={`/listing/${slug}`} className="px-5 py-3 rounded-lg font-bold text-white text-sm hover:opacity-90" style={{ background: COLOR_PRIMARY }}>Back to listing</Link>
              <Link href="/marketplace" className="px-5 py-3 rounded-lg font-bold border bg-white text-sm hover:bg-gray-50" style={{ borderColor: COLOR_BORDER, color: COLOR_PRIMARY }}>Browse more</Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ─── Auth gate ───────────────────────────────────────────────────────
  // Show a polished modal when the visitor isn't signed in. Sellers are
  // looking for real buyers, not bot traffic, so we require an account
  // before any inquiry hits the database. Email/name pre-populate from
  // the session once they sign in and return.
  const showAuthGate = authUser === undefined
  const checkingAuth = authUser === null

  // ─── Form ────────────────────────────────────────────────────────────
  const returnTo = encodeURIComponent(pathname || `/listing/${slug}/contact`)

  return (
    <div className="min-h-screen" style={{ background: COLOR_BG_PRIMARY }}>
      <PublicHeader />

      {/* Auth-gate modal — non-dismissable; the buyer must sign in or sign up. */}
      {showAuthGate && (
        <div role="dialog" aria-modal="true" aria-labelledby="auth-gate-title"
             className="fixed inset-0 z-50 flex items-center justify-center px-4"
             style={{ background: 'rgba(15,20,25,0.65)', backdropFilter: 'blur(4px)' }}>
          <div className="rounded-2xl bg-white shadow-2xl max-w-md w-full overflow-hidden" style={{ border: `1px solid ${palette.cream[300]}` }}>
            <div className="p-7 pb-5 text-center">
              <div className="w-14 h-14 mx-auto rounded-full flex items-center justify-center mb-4" style={{ background: palette.cream[100] }}>
                <ShieldAlert size={24} style={{ color: palette.champagne[500] }} />
              </div>
              <p className="text-[10px] font-bold tracking-[0.22em] uppercase mb-2" style={{ color: palette.champagne[500] }}>Verified Buyers Only</p>
              <h2 id="auth-gate-title" className="text-2xl font-black mb-3 leading-tight" style={{ color: COLOR_PRIMARY }}>
                Sign in to introduce yourself to the seller.
              </h2>
              <p className="text-sm leading-relaxed mb-5" style={{ color: COLOR_TEXT_SECONDARY }}>
                Sellers on Forward are looking for serious, verifiable buyers — not anonymous tire-kickers. Create a free Forward account (60 seconds) and we&apos;ll vouch for you to the seller.
              </p>

              <div className="text-left rounded-lg p-4 mb-5" style={{ background: palette.cream[200] }}>
                <ul className="space-y-2 text-xs" style={{ color: COLOR_PRIMARY }}>
                  <li className="flex items-start gap-2"><CheckCircle2 size={13} style={{ color: palette.emerald[500] }} className="mt-0.5 flex-shrink-0" /><span>Forward verifies every buyer before introducing</span></li>
                  <li className="flex items-start gap-2"><CheckCircle2 size={13} style={{ color: palette.emerald[500] }} className="mt-0.5 flex-shrink-0" /><span>Your details stay private — we never share them publicly</span></li>
                  <li className="flex items-start gap-2"><CheckCircle2 size={13} style={{ color: palette.emerald[500] }} className="mt-0.5 flex-shrink-0" /><span>Track inquiries and saved listings in one dashboard</span></li>
                </ul>
              </div>

              <Link
                href={`/auth/signup?type=buyer&redirect=${returnTo}`}
                className="block w-full px-5 py-3.5 rounded-lg font-bold text-white text-sm hover:opacity-90 transition-opacity mb-2"
                style={{ background: COLOR_PRIMARY }}
              >
                <UserPlus size={14} className="inline mr-1.5 -mt-0.5" />
                Create a free buyer account
              </Link>
              <Link
                href={`/auth/login?redirect=${returnTo}`}
                className="block w-full px-5 py-3 rounded-lg font-bold text-sm border bg-white hover:bg-gray-50 transition-colors"
                style={{ borderColor: COLOR_BORDER, color: COLOR_PRIMARY }}
              >
                <LogIn size={14} className="inline mr-1.5 -mt-0.5" />
                I already have an account
              </Link>
            </div>
            <div className="px-7 py-4 border-t text-center" style={{ borderColor: COLOR_BORDER, background: palette.cream[50] }}>
              <Link href={`/listing/${slug}`} className="text-xs font-semibold hover:underline" style={{ color: COLOR_TEXT_SECONDARY }}>
                ← Back to the listing
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Lightweight overlay while we resolve auth state on first paint. */}
      {checkingAuth && (
        <div className="fixed inset-0 z-40 flex items-center justify-center" style={{ background: 'rgba(244,242,238,0.8)' }}>
          <Loader size={20} className="animate-spin" style={{ color: COLOR_PRIMARY }} />
        </div>
      )}

      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="border-b" style={{ borderColor: COLOR_BORDER, background: 'white' }}>
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center gap-1.5 text-xs flex-wrap">
          <Link href="/" className="hover:underline" style={{ color: COLOR_TEXT_SECONDARY }}>Home</Link>
          <ChevronRight size={12} style={{ color: COLOR_TEXT_SECONDARY }} />
          <Link href="/marketplace" className="hover:underline" style={{ color: COLOR_TEXT_SECONDARY }}>Marketplace</Link>
          <ChevronRight size={12} style={{ color: COLOR_TEXT_SECONDARY }} />
          <Link href={`/listing/${slug}`} className="hover:underline truncate max-w-[36ch]" style={{ color: COLOR_TEXT_SECONDARY }}>{headline}</Link>
          <ChevronRight size={12} style={{ color: COLOR_TEXT_SECONDARY }} />
          <span className="font-semibold" style={{ color: COLOR_PRIMARY }}>Contact seller</span>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10 grid lg:grid-cols-3 gap-10">
        {/* Form */}
        <main className="lg:col-span-2">
          <Link href={`/listing/${slug}`} className="inline-flex items-center gap-1.5 text-sm font-semibold mb-4 hover:underline" style={{ color: COLOR_TEXT_SECONDARY }}>
            <ArrowLeft size={14} /> Back to listing
          </Link>
          <p className="text-[10px] font-bold tracking-[0.22em] uppercase mb-2" style={{ color: palette.champagne[500] }}>Request introduction</p>
          <h1 className="text-3xl md:text-4xl font-black mb-3" style={{ color: COLOR_PRIMARY }}>
            Tell us about you, and we&apos;ll make the introduction.
          </h1>
          <p className="text-base mb-8" style={{ color: COLOR_TEXT_SECONDARY }}>
            Forward Intelligence facilitates every introduction personally. The seller never receives your contact details until they choose to engage. We never share your information beyond this transaction.
          </p>

          <form onSubmit={submit} className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="First name *">
                <input type="text" required value={form.firstName} onChange={(e) => update('firstName', e.target.value)} className={inputCls} />
              </Field>
              <Field label="Last name *">
                <input type="text" required value={form.lastName} onChange={(e) => update('lastName', e.target.value)} className={inputCls} />
              </Field>
              <Field label="Email *">
                <input type="email" required value={form.email} onChange={(e) => update('email', e.target.value)} className={inputCls} />
              </Field>
              <Field label="Phone (with country code) *">
                <input type="tel" required value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="+1 555 555 5555" className={inputCls} />
              </Field>
              <Field label="Country *">
                <select required value={form.country} onChange={(e) => update('country', e.target.value)} className={selectCls}>
                  <option value="">Select…</option>
                  {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Capital available">
                <select value={form.capitalAvailableRange} onChange={(e) => update('capitalAvailableRange', e.target.value)} className={selectCls}>
                  <option value="">Prefer not to say</option>
                  {CAPITAL_RANGES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </Field>
            </div>

            <Field label="Buyer profile *">
              <div className="grid sm:grid-cols-2 gap-2">
                {BUYER_TYPES.map((b) => (
                  <RadioChip key={b.id} label={b.label} checked={form.buyerType === b.id} onClick={() => update('buyerType', b.id)} />
                ))}
              </div>
            </Field>

            <Field label="Timeline *">
              <div className="grid sm:grid-cols-2 gap-2">
                {TIMELINES.map((t) => (
                  <RadioChip key={t.id} label={t.label} checked={form.timeline === t.id} onClick={() => update('timeline', t.id)} />
                ))}
              </div>
            </Field>

            <Field label="Will you need financing?">
              <div className="grid grid-cols-3 gap-2">
                {[{ id: 'no', label: 'No — cash' }, { id: 'maybe', label: 'Maybe' }, { id: 'yes', label: 'Yes' }].map((f) => (
                  <RadioChip key={f.id} label={f.label} checked={form.financingNeed === f.id} onClick={() => update('financingNeed', f.id)} />
                ))}
              </div>
            </Field>

            <Field label="Your message to the seller *" hint="What about this listing interests you? Forward will share this with the seller alongside your buyer profile.">
              <textarea
                required minLength={10} maxLength={4000} rows={5}
                value={form.message}
                onChange={(e) => update('message', e.target.value)}
                placeholder="I'm interested in this listing because…"
                className="w-full px-3 py-3 rounded-lg border bg-white text-sm focus:outline-none focus:ring-2"
                style={{ borderColor: COLOR_BORDER, outlineColor: COLOR_ACCENT }}
              />
              <p className="text-[10px] text-right mt-1" style={{ color: COLOR_TEXT_SECONDARY }}>{form.message.length}/4000</p>
            </Field>

            <div className="rounded-xl border p-4" style={{ borderColor: palette.champagne[200], background: palette.cream[100] }}>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox" required
                  checked={form.bindingAcknowledged}
                  onChange={(e) => update('bindingAcknowledged', e.target.checked)}
                  className="mt-1 w-4 h-4 cursor-pointer"
                />
                <span className="text-sm leading-relaxed" style={{ color: COLOR_PRIMARY }}>
                  I acknowledge this is a <strong>binding introduction</strong> — Forward Intelligence facilitates this introduction, and a success fee applies if a transaction closes through Forward. I confirm the details I&apos;ve provided are accurate.{' '}
                  <Link href="/terms" className="underline" style={{ color: palette.champagne[500] }}>Forward terms →</Link>
                </span>
              </label>
            </div>

            {error && (
              <div className="rounded-lg border p-3 text-sm flex items-start gap-2" style={{ borderColor: palette.crimson[200], background: palette.crimson[50], color: palette.crimson[700] }}>
                <AlertCircle size={16} className="flex-shrink-0 mt-0.5" /> <span>{error}</span>
              </div>
            )}

            <button
              type="submit" disabled={!canSubmit || submitting}
              className="w-full px-6 py-4 rounded-lg font-bold text-white text-sm hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
              style={{ background: COLOR_PRIMARY }}
            >
              {submitting ? <><Loader size={16} className="animate-spin" /> Submitting introduction…</> : <><Mail size={16} /> Submit introduction request</>}
            </button>
          </form>
        </main>

        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="sticky top-6 rounded-xl border bg-white p-6" style={{ borderColor: COLOR_BORDER }}>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold mb-3" style={{ background: palette.cream[200], color: palette.champagne[500] }}>
              <Lock size={10} /> CONFIDENTIAL
            </div>
            <p className="text-[10px] font-bold tracking-[0.22em] uppercase mb-2" style={{ color: COLOR_TEXT_SECONDARY }}>{indLabel}</p>
            <h2 className="text-lg font-black mb-3 leading-tight" style={{ color: COLOR_PRIMARY }}>{headline}</h2>
            <div className="space-y-2 text-xs pb-4 border-b" style={{ color: COLOR_TEXT_SECONDARY, borderColor: COLOR_BORDER }}>
              <p><strong style={{ color: COLOR_PRIMARY }}>Region:</strong> {region}</p>
              <p><strong style={{ color: COLOR_PRIMARY }}>Asking:</strong> {askDisplay}</p>
              {heatScore != null && <p><strong style={{ color: COLOR_PRIMARY }}>Forward score:</strong> {heatScore}°</p>}
              {qualityScore != null && <p><strong style={{ color: COLOR_PRIMARY }}>Quality:</strong> {qualityScore}/100</p>}
            </div>
            <div className="pt-4 space-y-3 text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>
              <div className="flex items-start gap-2"><ShieldCheck size={13} style={{ color: palette.emerald[500] }} className="mt-0.5 flex-shrink-0" /><span>Forward verifies your details before introducing.</span></div>
              <div className="flex items-start gap-2"><Lock size={13} style={{ color: palette.champagne[500] }} className="mt-0.5 flex-shrink-0" /><span>The seller never sees your contact details until they engage.</span></div>
              <div className="flex items-start gap-2"><CheckCircle2 size={13} style={{ color: COLOR_ACCENT }} className="mt-0.5 flex-shrink-0" /><span>You hear back within 24 hours, on average.</span></div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

const inputCls =
  'w-full px-3 py-2.5 rounded-lg border bg-white text-sm focus:outline-none focus:ring-2'
const selectCls = inputCls

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-bold mb-1" style={{ color: COLOR_PRIMARY }}>{label}</label>
      {hint && <p className="text-[11px] mb-2" style={{ color: COLOR_TEXT_SECONDARY }}>{hint}</p>}
      {children}
    </div>
  )
}

function RadioChip({ label, checked, onClick }: { label: string; checked: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-3 py-2.5 rounded-lg border text-xs font-semibold text-left transition-colors"
      style={{
        borderColor: checked ? COLOR_PRIMARY : COLOR_BORDER,
        background: checked ? palette.cream[200] : 'white',
        color: COLOR_PRIMARY,
      }}
    >
      {checked && <CheckCircle2 size={11} className="inline mr-1.5 -mt-0.5" style={{ color: COLOR_PRIMARY }} />}
      {label}
    </button>
  )
}

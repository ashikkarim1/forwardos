'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ChevronRight, Lock, ShieldCheck, ArrowLeft, CheckCircle2, Mail,
  Loader, AlertCircle,
} from 'lucide-react'
import { PublicHeader } from '@/components/Navigation'
import { COLOR_PRIMARY, COLOR_TEXT_SECONDARY, COLOR_BORDER, COLOR_ACCENT, COLOR_BG_PRIMARY } from '@/styles/forward-colors'

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
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<{ reference: string } | null>(null)
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', country: '',
    capitalAvailableRange: '', timeline: '', financingNeed: '',
    buyerType: '', message: '', bindingAcknowledged: false,
  })

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
            <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-5" style={{ background: '#EAF5F0' }}>
              <CheckCircle2 size={28} style={{ color: '#2D7A5F' }} />
            </div>
            <p className="text-[10px] font-bold tracking-[0.22em] uppercase mb-3" style={{ color: '#B8956A' }}>Introduction received</p>
            <h1 className="text-3xl md:text-4xl font-black mb-3" style={{ color: COLOR_PRIMARY }}>Thank you — we&apos;ll be in touch.</h1>
            <p className="text-base mb-6" style={{ color: COLOR_TEXT_SECONDARY }}>
              Forward Intelligence is verifying your details. A confirmation has been sent to <strong>{form.email}</strong>.
              We typically introduce buyers and sellers within 24 hours.
            </p>
            <div className="rounded-lg p-4 mb-6 text-sm" style={{ background: '#F4F2EE', color: COLOR_PRIMARY }}>
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

  // ─── Form ────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen" style={{ background: COLOR_BG_PRIMARY }}>
      <PublicHeader />

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
          <p className="text-[10px] font-bold tracking-[0.22em] uppercase mb-2" style={{ color: '#B8956A' }}>Request introduction</p>
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

            <div className="rounded-xl border p-4" style={{ borderColor: '#D6C5A8', background: '#FAF6EF' }}>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox" required
                  checked={form.bindingAcknowledged}
                  onChange={(e) => update('bindingAcknowledged', e.target.checked)}
                  className="mt-1 w-4 h-4 cursor-pointer"
                />
                <span className="text-sm leading-relaxed" style={{ color: COLOR_PRIMARY }}>
                  I acknowledge this is a <strong>binding introduction</strong> — Forward Intelligence facilitates this introduction, and a success fee applies if a transaction closes through Forward. I confirm the details I&apos;ve provided are accurate.{' '}
                  <Link href="/terms" className="underline" style={{ color: '#B8956A' }}>Forward terms →</Link>
                </span>
              </label>
            </div>

            {error && (
              <div className="rounded-lg border p-3 text-sm flex items-start gap-2" style={{ borderColor: '#FCA5A5', background: '#FEE2E2', color: '#991B1B' }}>
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
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold mb-3" style={{ background: '#F4F2EE', color: '#B8956A' }}>
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
              <div className="flex items-start gap-2"><ShieldCheck size={13} style={{ color: '#2D7A5F' }} className="mt-0.5 flex-shrink-0" /><span>Forward verifies your details before introducing.</span></div>
              <div className="flex items-start gap-2"><Lock size={13} style={{ color: '#B8956A' }} className="mt-0.5 flex-shrink-0" /><span>The seller never sees your contact details until they engage.</span></div>
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
        background: checked ? '#F4F2EE' : 'white',
        color: COLOR_PRIMARY,
      }}
    >
      {checked && <CheckCircle2 size={11} className="inline mr-1.5 -mt-0.5" style={{ color: COLOR_PRIMARY }} />}
      {label}
    </button>
  )
}

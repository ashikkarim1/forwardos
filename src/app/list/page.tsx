'use client'

export const dynamic = 'force-dynamic'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle2, ChevronRight, Loader, ShieldCheck, Eye, Sparkles, Zap } from 'lucide-react'
import { PublicHeader } from '@/components/Navigation'
import { ImageUploader, type UploadedPhoto } from '@/components/ImageUploader'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER, COLOR_BG_PRIMARY } from '@/styles/forward-colors'
import {
  QUICK_LIST_INDUSTRIES, QUICK_LIST_COUNTRIES,
  REVENUE_RANGES, ASKING_RANGES,
} from '@/lib/listing-helpers'

function ListInner() {
  const router = useRouter()
  const params = useSearchParams()
  // Allow valuation tool to deep-link with pre-filled values.
  const [industry, setIndustry] = useState(params?.get('industry') || '')
  const [country, setCountry] = useState(params?.get('country') || 'USA')
  const [revenueRange, setRevenueRange] = useState(params?.get('revenue') || '')
  const [askingRange, setAskingRange] = useState(params?.get('asking') || '')
  const [headline, setHeadline] = useState(params?.get('headline') || '')
  const [city, setCity] = useState('')
  const [email, setEmail] = useState('')
  const [photos, setPhotos] = useState<UploadedPhoto[]>([])
  const [coverIndex, setCoverIndex] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState<{ slug: string; title: string } | null>(null)

  const referralCode = params?.get('ref') || ''

  const canSubmit = industry && country && revenueRange && askingRange && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit) return
    setSubmitting(true)
    setError('')
    try {
      const r = await fetch('/api/quick-list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          industry, country, revenueRange, askingRange,
          headline: headline.trim(), email: email.trim(), city: city.trim(),
          referralCode,
          photos: photos.map((p) => ({ url: p.url, name: p.name })),
          coverIndex,
        }),
      })
      const data = await r.json()
      if (!r.ok) { setError(data.error || 'Submission failed'); return }
      setSuccess({ slug: data.slug, title: data.title || 'Your listing' })
    } catch {
      setError('Network error — please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen" style={{ background: COLOR_BG_PRIMARY }}>
        <PublicHeader />
        <div className="max-w-2xl mx-auto px-6 py-16 text-center">
          <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4" style={{ background: '#EAF5F0' }}>
            <CheckCircle2 size={32} style={{ color: '#2D7A5F' }} />
          </div>
          <h1 className="text-3xl md:text-4xl font-black mb-2" style={{ color: COLOR_PRIMARY }}>Your listing is live ✓</h1>
          <p className="mb-6" style={{ color: COLOR_TEXT_SECONDARY }}>
            Verified buyers can already discover it on the Forward marketplace — fully anonymous until you choose to reveal more.
          </p>
          <div className="rounded-xl border p-5 text-left mb-6" style={{ borderColor: COLOR_BORDER, background: '#FAF6EF' }}>
            <p className="text-xs font-semibold mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>Confidential listing published as:</p>
            <p className="font-bold" style={{ color: COLOR_PRIMARY }}>{success.title}</p>
          </div>
          <div className="flex flex-wrap gap-3 justify-center mb-8">
            <Link href={`/listing/${success.slug}`} className="px-5 py-3 rounded-lg font-bold text-white hover:opacity-90" style={{ background: COLOR_ACCENT }}>View your listing</Link>
            <Link href="/dashboard/seller" className="px-5 py-3 rounded-lg font-bold border bg-white hover:bg-gray-50" style={{ borderColor: COLOR_BORDER, color: COLOR_PRIMARY }}>Open dashboard</Link>
          </div>
          <div className="text-left max-w-md mx-auto">
            <p className="text-sm font-bold mb-2" style={{ color: COLOR_PRIMARY }}>Boost discoverability (optional):</p>
            <ul className="text-sm space-y-1" style={{ color: COLOR_TEXT_SECONDARY }}>
              <li className="flex items-center gap-2"><Sparkles size={14} style={{ color: COLOR_ACCENT }} /> Add photos → ~3x more buyer views</li>
              <li className="flex items-center gap-2"><ShieldCheck size={14} style={{ color: COLOR_ACCENT }} /> Verify business → matched with funded buyers</li>
              <li className="flex items-center gap-2"><Zap size={14} style={{ color: COLOR_ACCENT }} /> Upload financials → Verified Financials badge</li>
            </ul>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: COLOR_BG_PRIMARY }}>
      <PublicHeader />

      <section className="px-6 py-10 border-b" style={{ borderColor: COLOR_BORDER, background: '#FAF6EF' }}>
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold text-white mb-3" style={{ background: '#2D7A5F' }}>
            LIST FREE · 90 SECONDS · ANONYMOUS BY DEFAULT
          </span>
          <h1 className="text-3xl md:text-4xl font-black mb-2" style={{ color: COLOR_PRIMARY }}>
            Publish your confidential listing in 90 seconds
          </h1>
          <p className="text-base max-w-2xl mx-auto" style={{ color: COLOR_TEXT_SECONDARY }}>
            We mask your business name, exact city, and identity. Buyers see industry, country, and financial ranges only — until you choose to reveal more.
          </p>
        </div>
      </section>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto px-6 py-10 space-y-5">
        <Field label="Industry *" hint="Used to match the right buyers + comparables">
          <select required value={industry} onChange={(e) => setIndustry(e.target.value)} className="w-full px-3 py-3 rounded-lg border bg-white text-sm" style={{ borderColor: COLOR_BORDER }}>
            <option value="">Choose an industry…</option>
            {QUICK_LIST_INDUSTRIES.map((i) => <option key={i.value} value={i.value}>{i.label}</option>)}
          </select>
        </Field>

        <Field label="Country *" hint="We localize buyer demand + financing options to your country">
          <select required value={country} onChange={(e) => setCountry(e.target.value)} className="w-full px-3 py-3 rounded-lg border bg-white text-sm" style={{ borderColor: COLOR_BORDER }}>
            {QUICK_LIST_COUNTRIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </Field>

        <Field label="City or region (optional)" hint="Public listing will mask this to the broader metro for confidentiality">
          <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Toronto, Dubai, Austin" className="w-full px-3 py-3 rounded-lg border bg-white text-sm" style={{ borderColor: COLOR_BORDER }} />
        </Field>

        <Field label="Annual revenue *" hint="A range is fine — exact numbers stay private">
          <select required value={revenueRange} onChange={(e) => setRevenueRange(e.target.value)} className="w-full px-3 py-3 rounded-lg border bg-white text-sm" style={{ borderColor: COLOR_BORDER }}>
            <option value="">Choose a range…</option>
            {REVENUE_RANGES.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}
          </select>
        </Field>

        <Field label="Asking price *" hint="Not sure? Try our free valuation tool first">
          <select required value={askingRange} onChange={(e) => setAskingRange(e.target.value)} className="w-full px-3 py-3 rounded-lg border bg-white text-sm" style={{ borderColor: COLOR_BORDER }}>
            <option value="">Choose a range…</option>
            {ASKING_RANGES.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}
          </select>
          <Link href="/valuation" className="inline-block mt-2 text-sm font-semibold" style={{ color: COLOR_ACCENT }}>
            Get a free valuation → instant range
          </Link>
        </Field>

        <Field label="One-line headline (optional)" hint="Auto-generated if blank. Don't include identifying details.">
          <input type="text" value={headline} onChange={(e) => setHeadline(e.target.value)} maxLength={140} placeholder="e.g. Profitable B2B SaaS, 70% recurring, growing 40% YoY" className="w-full px-3 py-3 rounded-lg border bg-white text-sm" style={{ borderColor: COLOR_BORDER }} />
        </Field>

        <div>
          <ImageUploader photos={photos} setPhotos={setPhotos} coverIndex={coverIndex} setCoverIndex={setCoverIndex} />
        </div>

        <Field label="Your email *" hint="We email a link to manage your listing. We do not share this.">
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full px-3 py-3 rounded-lg border bg-white text-sm" style={{ borderColor: COLOR_BORDER }} />
        </Field>

        {error && (
          <div className="rounded-lg border p-3 text-sm" style={{ borderColor: '#FCA5A5', background: '#FEE2E2', color: '#991B1B' }}>{error}</div>
        )}

        <button type="submit" disabled={!canSubmit || submitting} className="w-full px-6 py-4 rounded-lg font-bold text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2" style={{ background: COLOR_ACCENT }}>
          {submitting ? <><Loader size={18} className="animate-spin" /> Publishing…</> : <>Publish my confidential listing <ChevronRight size={18} /></>}
        </button>

        <p className="text-xs text-center" style={{ color: COLOR_TEXT_SECONDARY }}>
          By publishing, you agree to our <Link href="/terms" className="underline">Terms</Link> and <Link href="/privacy" className="underline">Privacy Policy</Link>. No credit card. Cancel anytime.
        </p>
      </form>

      <section className="px-6 pb-16 border-t" style={{ borderColor: COLOR_BORDER, background: 'white' }}>
        <div className="max-w-3xl mx-auto py-10 grid md:grid-cols-3 gap-6 text-sm">
          <Reassurance icon={<Eye size={20} />} title="Anonymous by default" body="We mask your name, city, and any identifying details. Reveal only after the buyer signs an NDA in-app." />
          <Reassurance icon={<ShieldCheck size={20} />} title="No commission, no surprises" body="Listing is 100% free. Premium placement is optional. We never charge a success fee." />
          <Reassurance icon={<Sparkles size={20} />} title="Refine later" body="Photos, financials, identity verification — all optional. Your listing publishes immediately and you upgrade when ready." />
        </div>
      </section>
    </div>
  )
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-bold mb-1" style={{ color: COLOR_PRIMARY }}>{label}</label>
      {hint && <p className="text-xs mb-2" style={{ color: COLOR_TEXT_SECONDARY }}>{hint}</p>}
      {children}
    </div>
  )
}

function Reassurance({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2" style={{ color: COLOR_ACCENT }}>{icon}<span className="font-bold" style={{ color: COLOR_PRIMARY }}>{title}</span></div>
      <p style={{ color: COLOR_TEXT_SECONDARY }}>{body}</p>
    </div>
  )
}

export default function ListPage() {
  return <Suspense fallback={null}><ListInner /></Suspense>
}

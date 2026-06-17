'use client'

export const dynamic = 'force-dynamic'

import { Suspense, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Briefcase, CheckCircle2, ChevronRight, Loader, ShieldCheck, Eye, Sparkles, User as UserIcon, Zap } from 'lucide-react'
import { PublicHeader } from '@/components/Navigation'
import { ImageUploader, type UploadedPhoto } from '@/components/ImageUploader'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER, COLOR_BG_PRIMARY } from '@/styles/forward-colors'
import {
  QUICK_LIST_INDUSTRIES, QUICK_LIST_COUNTRIES,
  inferCountryFromRegion, countryLabel,
  REVENUE_RANGES, ASKING_RANGES, EBITDA_RANGES, CASH_FLOW_RANGES,
} from '@/lib/listing-helpers'

type ListerRole = 'OWNER' | 'BROKER'

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
  // Optional boost fields — supplying these dramatically improves match quality.
  const [ebitdaRange, setEbitdaRange] = useState('')
  const [cashFlowRange, setCashFlowRange] = useState('')
  // Who's listing — owners vs brokers. Brokers get credential fields below.
  const [listerRole, setListerRole] = useState<ListerRole>('OWNER')
  const [brokerName, setBrokerName] = useState('')
  const [brokerLicense, setBrokerLicense] = useState('')
  const [brokerYears, setBrokerYears] = useState('')
  const [brokerDealsClosed, setBrokerDealsClosed] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState<{ slug: string; title: string } | null>(null)

  const referralCode = params?.get('ref') || ''

  const canSubmit = industry && country && revenueRange && askingRange && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  // Live boost score — buyers respond to listings with more signal. Each
  // optional field nudges the meter so the seller sees the payoff in real time.
  const boostScore = useMemo(() => {
    let score = 40 // baseline once required fields are filled
    if (headline.trim()) score += 8
    if (city.trim()) score += 6
    if (ebitdaRange) score += 14
    if (cashFlowRange) score += 14
    if (photos.length > 0) score += 12
    if (photos.length >= 3) score += 6
    if (listerRole === 'BROKER' && brokerName.trim()) score += 5
    if (listerRole === 'BROKER' && (brokerLicense.trim() || brokerDealsClosed)) score += 5
    return Math.min(100, score)
  }, [headline, city, ebitdaRange, cashFlowRange, photos.length, listerRole, brokerName, brokerLicense, brokerDealsClosed])

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
          ebitdaRange: ebitdaRange || undefined,
          cashFlowRange: cashFlowRange || undefined,
          listedByRole: listerRole,
          brokerName: listerRole === 'BROKER' ? brokerName.trim() || undefined : undefined,
          brokerLicense: listerRole === 'BROKER' ? brokerLicense.trim() || undefined : undefined,
          brokerYearsExperience: listerRole === 'BROKER' && brokerYears ? parseInt(brokerYears, 10) : undefined,
          brokerDealsClosed: listerRole === 'BROKER' && brokerDealsClosed ? parseInt(brokerDealsClosed, 10) : undefined,
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
        {/* Role chooser — Owner vs Broker. Drives the broker credential block. */}
        <div>
          <label className="block text-sm font-bold mb-1" style={{ color: COLOR_PRIMARY }}>I&apos;m a… *</label>
          <p className="text-xs mb-2" style={{ color: COLOR_TEXT_SECONDARY }}>
            We tailor the listing surface accordingly. Brokers can show credentials and a track record.
          </p>
          <div className="grid grid-cols-2 gap-2">
            <RoleTile
              active={listerRole === 'OWNER'}
              onClick={() => setListerRole('OWNER')}
              icon={<UserIcon size={16} />}
              title="Seller"
              body="I own or control this business."
            />
            <RoleTile
              active={listerRole === 'BROKER'}
              onClick={() => setListerRole('BROKER')}
              icon={<Briefcase size={16} />}
              title="Broker"
              body="I represent the seller."
            />
          </div>
        </div>

        {listerRole === 'BROKER' && (
          <div className="rounded-xl border p-4 space-y-3" style={{ borderColor: COLOR_BORDER, background: '#FAF6EF' }}>
            <p className="text-xs font-bold tracking-wide uppercase" style={{ color: '#B8956A' }}>
              Broker credentials (optional but recommended)
            </p>
            <p className="text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>
              Buyers respond ~3× more often to broker listings that show credentials and a track record.
            </p>
            <Field label="Brokerage name">
              <input type="text" value={brokerName} onChange={(e) => setBrokerName(e.target.value)} maxLength={120} placeholder="e.g. Sunbelt Toronto" className="w-full px-3 py-3 rounded-lg border bg-white text-sm" style={{ borderColor: COLOR_BORDER }} />
            </Field>
            <Field label="License # / credential" hint="e.g. CBI, M&AMI, REBNY — shown alongside your profile.">
              <input type="text" value={brokerLicense} onChange={(e) => setBrokerLicense(e.target.value)} maxLength={80} placeholder="e.g. CBI #1234" className="w-full px-3 py-3 rounded-lg border bg-white text-sm" style={{ borderColor: COLOR_BORDER }} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Years brokering">
                <input type="number" inputMode="numeric" min={0} max={60} value={brokerYears} onChange={(e) => setBrokerYears(e.target.value)} placeholder="e.g. 8" className="w-full px-3 py-3 rounded-lg border bg-white text-sm" style={{ borderColor: COLOR_BORDER }} />
              </Field>
              <Field label="Deals closed">
                <input type="number" inputMode="numeric" min={0} max={9999} value={brokerDealsClosed} onChange={(e) => setBrokerDealsClosed(e.target.value)} placeholder="e.g. 47" className="w-full px-3 py-3 rounded-lg border bg-white text-sm" style={{ borderColor: COLOR_BORDER }} />
              </Field>
            </div>
          </div>
        )}

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
          {/* Soft warning when the free-text region appears to belong
              to a different country than the selected dropdown. NOT a
              block — the seller may know something we don't, so submit
              still goes through. We just flag it. */}
          {(() => {
            const inferred = inferCountryFromRegion(city)
            if (!inferred || inferred === country) return null
            return (
              <div role="status" className="mt-2 px-3 py-2 rounded-md text-xs flex items-start gap-2" style={{ background: '#FFFAE6', border: '1px solid #FFEEB5', color: '#7A3608' }}>
                <span style={{ flexShrink: 0 }}>⚠️</span>
                <span>
                  "{city}" looks like a <strong>{countryLabel(inferred)}</strong> location, but you selected <strong>{countryLabel(country)}</strong>. Double-check the country dropdown — or continue if this is correct.
                </span>
              </div>
            )
          })()}
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

        {/* Optional financial boosters — significantly improve buyer match quality. */}
        <div className="rounded-xl border p-4 space-y-3" style={{ borderColor: COLOR_BORDER, background: '#FAF6EF' }}>
          <div className="flex items-start gap-2">
            <Sparkles size={14} style={{ color: '#B8956A' }} className="mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-bold tracking-wide uppercase" style={{ color: '#B8956A' }}>
                Boost match quality (optional)
              </p>
              <p className="text-xs mt-0.5" style={{ color: COLOR_TEXT_SECONDARY }}>
                Listings with EBITDA + cash flow surface to ~5× more qualified buyers and rank higher in search.
              </p>
            </div>
          </div>
          <Field label="EBITDA range" hint="Earnings before interest, taxes, depreciation, amortization. Approximate is fine.">
            <select value={ebitdaRange} onChange={(e) => setEbitdaRange(e.target.value)} className="w-full px-3 py-3 rounded-lg border bg-white text-sm" style={{ borderColor: COLOR_BORDER }}>
              <option value="">Choose a range…</option>
              {EBITDA_RANGES.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}
            </select>
          </Field>
          <Field label="Cash flow / SDE range" hint="Owner cash flow / Seller's Discretionary Earnings. Buyers under $2M look at this first.">
            <select value={cashFlowRange} onChange={(e) => setCashFlowRange(e.target.value)} className="w-full px-3 py-3 rounded-lg border bg-white text-sm" style={{ borderColor: COLOR_BORDER }}>
              <option value="">Choose a range…</option>
              {CASH_FLOW_RANGES.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}
            </select>
          </Field>
        </div>

        <Field label="One-line headline (optional)" hint="Auto-generated if blank. Don't include identifying details.">
          <input type="text" value={headline} onChange={(e) => setHeadline(e.target.value)} maxLength={140} placeholder="e.g. Profitable B2B SaaS, 70% recurring, growing 40% YoY" className="w-full px-3 py-3 rounded-lg border bg-white text-sm" style={{ borderColor: COLOR_BORDER }} />
        </Field>

        <div>
          <ImageUploader photos={photos} setPhotos={setPhotos} coverIndex={coverIndex} setCoverIndex={setCoverIndex} />
        </div>

        <Field label="Your email *" hint="We email a link to manage your listing. We do not share this.">
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full px-3 py-3 rounded-lg border bg-white text-sm" style={{ borderColor: COLOR_BORDER }} />
        </Field>

        {/* Boost meter — live feedback that optional fields are paying off. */}
        <div className="rounded-xl border p-4" style={{ borderColor: COLOR_BORDER, background: 'white' }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold tracking-wide uppercase" style={{ color: COLOR_PRIMARY }}>
              Listing strength
            </span>
            <span className="text-xs font-bold" style={{ color: boostScore >= 80 ? '#2D7A5F' : '#B8956A' }}>
              {boostScore}/100 {boostScore >= 80 ? '· Strong' : boostScore >= 60 ? '· Solid' : '· Add more signal'}
            </span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: '#F4F2EE' }}>
            <div className="h-full rounded-full transition-all" style={{ width: `${boostScore}%`, background: boostScore >= 80 ? '#2D7A5F' : '#B8956A' }} />
          </div>
          {boostScore < 80 && (
            <p className="text-[11px] mt-2" style={{ color: COLOR_TEXT_SECONDARY }}>
              Tip: add EBITDA, cash flow, and at least one photo to maximize qualified buyer matches.
            </p>
          )}
        </div>

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

function RoleTile({
  active, onClick, icon, title, body,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  title: string
  body: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-left rounded-xl border p-3 transition-all"
      style={{
        borderColor: active ? '#B8956A' : COLOR_BORDER,
        background: active ? '#FAF6EF' : 'white',
        outline: active ? '2px solid rgba(184,149,106,0.25)' : 'none',
      }}
    >
      <div className="flex items-center gap-2 mb-1" style={{ color: active ? '#B8956A' : COLOR_PRIMARY }}>
        {icon}
        <span className="text-sm font-bold" style={{ color: COLOR_PRIMARY }}>{title}</span>
      </div>
      <p className="text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>{body}</p>
    </button>
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

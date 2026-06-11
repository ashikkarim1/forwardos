'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CheckCircle2, Landmark } from 'lucide-react'
import { PublicHeader } from '@/components/Navigation'
import { FINANCING_TYPE_LABELS, REGION_LABELS, type FinancingType, type LenderRegion } from '@/lib/finance-data'
import { FINANCIER_TIERS, validateFinancierCredentials, QUALIFIED_LEAD_FEE, type FinancierTierId } from '@/lib/financier-tiers'
import { COLOR_PRIMARY, COLOR_TEXT_SECONDARY, COLOR_BORDER, COLOR_ACCENT, COLOR_BG_PRIMARY } from '@/styles/forward-colors'

const TYPES = Object.keys(FINANCING_TYPE_LABELS) as FinancingType[]
const REGIONS = Object.keys(REGION_LABELS) as LenderRegion[]

export default function FinancierApplyPage() {
  const [form, setForm] = useState({
    partnerTier: 'LISTED' as FinancierTierId,
    name: '', contactName: '', contactEmail: '', contactPhone: '', website: '', linkedinUrl: '',
    region: 'USA' as LenderRegion, financingTypes: ['BANK_TERM'] as string[], shariaCompliant: false,
    minAmount: '', maxAmount: '', interestRateMin: '', interestRateMax: '',
    termMonthsMin: '12', termMonthsMax: '120', description: '',
    referralModel: 'PERCENTAGE' as 'PERCENTAGE' | 'FLAT', referralFeePercent: '', referralFlatAmount: '', referralPlan: '',
  })
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')
  const [error, setError] = useState('')

  const set = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }))
  const toggleType = (t: string) =>
    setForm((f) => ({ ...f, financingTypes: f.financingTypes.includes(t) ? f.financingTypes.filter((x) => x !== t) : [...f.financingTypes, t] }))

  async function submit() {
    if (!form.name) { setError('Company name is required.'); return }
    const credError = validateFinancierCredentials({ email: form.contactEmail, website: form.website, linkedin: form.linkedinUrl })
    if (credError) { setError(credError); return }
    setState('sending'); setError('')
    try {
      const res = await fetch('/api/finance/partners/apply', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Application failed'); setState('error'); return }
      setState('done')
    } catch { setError('Request failed'); setState('error') }
  }

  if (state === 'done') {
    return (
      <Shell>
        <div className="max-w-xl mx-auto px-6 py-20 text-center">
          <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4" style={{ background: '#EAF5F0' }}>
            <CheckCircle2 size={32} style={{ color: '#2D7A5F' }} />
          </div>
          <h1 className="text-3xl font-black mb-2" style={{ color: COLOR_PRIMARY }}>Application received</h1>
          <p style={{ color: COLOR_TEXT_SECONDARY }} className="mb-6">
            Thank you. Our team will review your application. Once approved, you&apos;ll receive a referral agreement to
            sign digitally — after that you&apos;re onboarded and marketed to qualified buyers across our marketplace.
          </p>
          <Link href="/finance-center" className="px-6 py-3 rounded-lg font-bold text-white hover:opacity-90" style={{ background: COLOR_ACCENT }}>
            Back to Finance Center
          </Link>
        </div>
      </Shell>
    )
  }

  return (
    <Shell>
      <section className="px-6 py-8 border-b" style={{ borderColor: COLOR_BORDER, background: '#EFF6FF' }}>
        <div className="max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-3 text-white" style={{ background: COLOR_ACCENT }}>
            <Landmark size={13} /> BECOME A FINANCING PARTNER
          </span>
          <h1 className="text-3xl md:text-4xl font-black mb-2" style={{ color: COLOR_PRIMARY }}>Join our lender network</h1>
          <p style={{ color: COLOR_TEXT_SECONDARY }}>
            Get matched with qualified business buyers across the USA, Canada, and the UAE. Apply below — once approved
            and your referral agreement is signed, you&apos;re listed and actively marketed in our Finance Center.
          </p>
        </div>
      </section>

      <section className="px-6 py-10">
        <div className="max-w-3xl mx-auto space-y-6">
          <Group title="Choose your partnership tier">
            <div className="grid sm:grid-cols-2 gap-3">
              {FINANCIER_TIERS.map((tier) => {
                const selected = form.partnerTier === tier.id
                return (
                  <button
                    type="button"
                    key={tier.id}
                    onClick={() => set('partnerTier', tier.id)}
                    className="text-left p-4 rounded-xl border-2 transition-all"
                    style={{ borderColor: selected ? COLOR_ACCENT : COLOR_BORDER, background: selected ? COLOR_ACCENT + '0D' : 'white' }}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-bold" style={{ color: COLOR_PRIMARY }}>{tier.name}</span>
                      <span className="text-sm font-black" style={{ color: COLOR_ACCENT }}>{tier.price}</span>
                    </div>
                    <ul className="text-xs space-y-0.5" style={{ color: COLOR_TEXT_SECONDARY }}>
                      {tier.benefits.map((b) => <li key={b}>• {b}</li>)}
                      {tier.performance?.map((p) => <li key={p} style={{ color: '#2D7A5F' }}>+ {p}</li>)}
                    </ul>
                  </button>
                )
              })}
            </div>
            <p className="text-xs mt-3" style={{ color: COLOR_TEXT_SECONDARY }}>
              Pick the tier you&apos;re interested in — our team confirms it during review. You can start free as a Listed Partner.
              Qualified-lead fee: <strong>${QUALIFIED_LEAD_FEE.standard}/lead</strong> standard, just <strong>${QUALIFIED_LEAD_FEE.strategic}/lead</strong> for Strategic Partners.
            </p>
          </Group>

          <Group title="Company & contact">
            <p className="text-xs mb-3" style={{ color: COLOR_TEXT_SECONDARY }}>
              Please use your <strong>work email</strong>, and provide your <strong>website and/or LinkedIn</strong> (at least one required).
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Company / institution name *"><input className={inp} value={form.name} onChange={(e) => set('name', e.target.value)} /></Field>
              <Field label="Work email *"><input type="email" className={inp} value={form.contactEmail} onChange={(e) => set('contactEmail', e.target.value)} placeholder="you@yourcompany.com" /></Field>
              <Field label="Company website (LinkedIn or website required)"><input className={inp} value={form.website} onChange={(e) => set('website', e.target.value)} placeholder="https://yourcompany.com" /></Field>
              <Field label="LinkedIn (profile or company)"><input className={inp} value={form.linkedinUrl} onChange={(e) => set('linkedinUrl', e.target.value)} placeholder="https://linkedin.com/in/…" /></Field>
              <Field label="Contact name"><input className={inp} value={form.contactName} onChange={(e) => set('contactName', e.target.value)} /></Field>
              <Field label="Contact phone"><input className={inp} value={form.contactPhone} onChange={(e) => set('contactPhone', e.target.value)} /></Field>
              <Field label="Primary region">
                <select className={inp} value={form.region} onChange={(e) => set('region', e.target.value)}>
                  {REGIONS.map((r) => <option key={r} value={r}>{REGION_LABELS[r]}</option>)}
                </select>
              </Field>
            </div>
          </Group>

          <Group title="Financing offered">
            <p className="text-sm mb-3" style={{ color: COLOR_TEXT_SECONDARY }}>Select the products you offer:</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {TYPES.map((t) => (
                <button key={t} type="button" onClick={() => toggleType(t)}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors"
                  style={{ borderColor: form.financingTypes.includes(t) ? COLOR_ACCENT : COLOR_BORDER, background: form.financingTypes.includes(t) ? COLOR_ACCENT : 'white', color: form.financingTypes.includes(t) ? 'white' : COLOR_PRIMARY }}>
                  {FINANCING_TYPE_LABELS[t]}
                </button>
              ))}
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Min amount (USD)"><input type="number" className={inp} value={form.minAmount} onChange={(e) => set('minAmount', e.target.value)} placeholder="50000" /></Field>
              <Field label="Max amount (USD)"><input type="number" className={inp} value={form.maxAmount} onChange={(e) => set('maxAmount', e.target.value)} placeholder="5000000" /></Field>
              <Field label="Rate / profit rate min (% p.a.)"><input type="number" className={inp} value={form.interestRateMin} onChange={(e) => set('interestRateMin', e.target.value)} placeholder="7.5" /></Field>
              <Field label="Rate / profit rate max (% p.a.)"><input type="number" className={inp} value={form.interestRateMax} onChange={(e) => set('interestRateMax', e.target.value)} placeholder="11" /></Field>
            </div>
            <label className="flex items-center gap-2 mt-3 text-sm cursor-pointer" style={{ color: COLOR_PRIMARY }}>
              <input type="checkbox" checked={form.shariaCompliant} onChange={(e) => set('shariaCompliant', e.target.checked)} className="accent-green-700" />
              We offer Sharia-compliant products (Murabaha / Ijara)
            </label>
            <Field label="Description (shown in the directory)"><textarea rows={3} className={inp} value={form.description} onChange={(e) => set('description', e.target.value)} /></Field>
          </Group>

          <Group title="Referral plan">
            <p className="text-sm mb-3" style={{ color: COLOR_TEXT_SECONDARY }}>
              How would the referral relationship work? Choose how you&apos;d compensate referrals — these terms form the basis
              of your referral agreement with <strong>UpCapital Global FZCO</strong> (Forward OS platform).
            </p>

            {/* Percentage vs flat-fee / lump-sum toggle */}
            <div className="inline-flex rounded-lg border p-1 mb-4" style={{ borderColor: COLOR_BORDER }}>
              {(['PERCENTAGE', 'FLAT'] as const).map((m) => (
                <button key={m} type="button" onClick={() => set('referralModel', m)}
                  className="px-4 py-1.5 rounded-md text-sm font-semibold transition-colors"
                  style={{ background: form.referralModel === m ? COLOR_ACCENT : 'transparent', color: form.referralModel === m ? 'white' : COLOR_PRIMARY }}>
                  {m === 'PERCENTAGE' ? '% of funded value' : 'Flat fee / lump sum'}
                </button>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {form.referralModel === 'PERCENTAGE' ? (
                <Field label="Proposed referral fee (%)"><input type="number" className={inp} value={form.referralFeePercent} onChange={(e) => set('referralFeePercent', e.target.value)} placeholder="1.0" /></Field>
              ) : (
                <Field label="Flat fee / lump sum per deal (USD)"><input type="number" className={inp} value={form.referralFlatAmount} onChange={(e) => set('referralFlatAmount', e.target.value)} placeholder="2500" /></Field>
              )}
            </div>
            <Field label="Referral plan / terms"><textarea rows={4} className={inp} value={form.referralPlan} onChange={(e) => set('referralPlan', e.target.value)} placeholder="e.g. paid on drawdown; per-referral or revenue-share; any caps, minimums, or how the flat fee applies." /></Field>
          </Group>

          {error && <p className="text-sm font-semibold" style={{ color: '#DC2626' }}>{error}</p>}

          <button onClick={submit} disabled={state === 'sending'} className="w-full px-6 py-3 rounded-lg font-bold text-white hover:opacity-90 disabled:opacity-50" style={{ background: COLOR_ACCENT }}>
            {state === 'sending' ? 'Submitting…' : 'Submit application for review'}
          </button>
          <p className="text-xs text-center" style={{ color: COLOR_TEXT_SECONDARY }}>
            After admin approval you&apos;ll receive a referral agreement to sign digitally before going live.
          </p>
        </div>
      </section>
    </Shell>
  )
}

const inp = 'w-full px-3 py-2 rounded-lg border text-sm bg-white focus:outline-none focus:ring-2'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold mb-1" style={{ color: COLOR_PRIMARY }}>{label}</span>
      {children}
    </label>
  )
}
function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border p-6" style={{ borderColor: COLOR_BORDER }}>
      <h2 className="text-lg font-bold mb-4" style={{ color: COLOR_PRIMARY }}>{title}</h2>
      {children}
    </div>
  )
}
function Shell({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen" style={{ background: COLOR_BG_PRIMARY }}><PublicHeader />{children}</div>
}

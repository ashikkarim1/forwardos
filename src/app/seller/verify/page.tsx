'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CheckCircle2, ShieldCheck, Upload, Trash2, Plus } from 'lucide-react'
import { PublicHeader } from '@/components/Navigation'
import { VERIFICATION_REQUIREMENTS, type VerificationRegion } from '@/lib/verification-requirements'
import { COLOR_PRIMARY, COLOR_TEXT_SECONDARY, COLOR_BORDER, COLOR_ACCENT, COLOR_BG_PRIMARY } from '@/styles/forward-colors'

type Doc = { type: string; label: string; url: string; name: string }
type Ubo = { name: string; ownershipPct: string }

export default function SellerVerifyPage() {
  const [region, setRegion] = useState<VerificationRegion>('USA')
  const [businessName, setBusinessName] = useState('')
  const [signatoryName, setSignatoryName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [docs, setDocs] = useState<Record<string, Doc>>({})
  const [ubo, setUbo] = useState<Ubo[]>([{ name: '', ownershipPct: '' }])
  const [uploading, setUploading] = useState<string | null>(null)
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')
  const [error, setError] = useState('')

  const req = VERIFICATION_REQUIREMENTS[region]

  async function uploadDoc(type: string, label: string, file: File) {
    setUploading(type); setError('')
    try {
      const fd = new FormData(); fd.append('file', file); fd.append('bucket', 'kyc')
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const d = await res.json()
      if (!res.ok) { setError(d.error || 'Upload failed'); return }
      setDocs((prev) => ({ ...prev, [type]: { type, label, url: d.url, name: d.name } }))
    } finally { setUploading(null) }
  }

  async function submit() {
    if (!businessName) { setError('Business name is required.'); return }
    const missing = req.docs.filter((d) => !docs[d.type])
    if (missing.length) { setError(`Please upload: ${missing.map((m) => m.label).join(', ')}`); return }
    const cleanUbo = ubo.filter((o) => o.name.trim()).map((o) => ({ name: o.name.trim(), ownershipPct: o.ownershipPct ? Number(o.ownershipPct) : undefined }))
    if (req.uboRequired && cleanUbo.length === 0) { setError('Add at least one beneficial owner (UBO).'); return }

    setState('sending'); setError('')
    try {
      const res = await fetch('/api/verification/submit', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ region, businessName, signatoryName, contactEmail, documents: Object.values(docs), ubo: cleanUbo }),
      })
      const d = await res.json()
      if (!res.ok) { setError(d.error || 'Submission failed'); setState('error'); return }
      setState('done')
    } catch { setError('Request failed'); setState('error') }
  }

  if (state === 'done') {
    return (
      <Shell>
        <div className="max-w-xl mx-auto px-6 py-20 text-center">
          <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4" style={{ background: '#EAF5F0' }}><CheckCircle2 size={32} style={{ color: '#2D7A5F' }} /></div>
          <h1 className="text-3xl font-black mb-2" style={{ color: COLOR_PRIMARY }}>Submitted for verification</h1>
          <p style={{ color: COLOR_TEXT_SECONDARY }} className="mb-6">Our team will review your documents and confirm your business. Once approved, your listing carries the <strong>Verified</strong> badge.</p>
          <Link href="/dashboard/seller" className="px-6 py-3 rounded-lg font-bold text-white hover:opacity-90" style={{ background: COLOR_ACCENT }}>Go to dashboard</Link>
        </div>
      </Shell>
    )
  }

  return (
    <Shell>
      <section className="px-6 py-8 border-b" style={{ borderColor: COLOR_BORDER, background: '#EFF6FF' }}>
        <div className="max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-3 text-white" style={{ background: COLOR_ACCENT }}><ShieldCheck size={13} /> BUSINESS VERIFICATION</span>
          <h1 className="text-3xl font-black mb-1" style={{ color: COLOR_PRIMARY }}>Verify your business</h1>
          <p style={{ color: COLOR_TEXT_SECONDARY }}>Verified businesses get a trust badge and far more buyer interest. Documents are reviewed privately by our team.</p>
        </div>
      </section>

      <section className="px-6 py-10">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Region */}
          <div className="bg-white rounded-xl border p-6" style={{ borderColor: COLOR_BORDER }}>
            <h2 className="text-lg font-bold mb-3" style={{ color: COLOR_PRIMARY }}>Where is your business registered?</h2>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(VERIFICATION_REQUIREMENTS) as VerificationRegion[]).map((r) => (
                <button key={r} type="button" onClick={() => { setRegion(r); setDocs({}) }}
                  className="px-4 py-2 rounded-lg text-sm font-semibold border-2 transition-all"
                  style={{ borderColor: region === r ? COLOR_ACCENT : COLOR_BORDER, background: region === r ? COLOR_ACCENT + '0D' : 'white', color: COLOR_PRIMARY }}>
                  {VERIFICATION_REQUIREMENTS[r].label}
                </button>
              ))}
            </div>
          </div>

          {/* Business details */}
          <div className="bg-white rounded-xl border p-6 grid md:grid-cols-2 gap-4" style={{ borderColor: COLOR_BORDER }}>
            <Field label="Legal business name *"><input className={inp} value={businessName} onChange={(e) => setBusinessName(e.target.value)} /></Field>
            <Field label="Signatory / owner name"><input className={inp} value={signatoryName} onChange={(e) => setSignatoryName(e.target.value)} /></Field>
            <Field label="Contact email"><input type="email" className={inp} value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} /></Field>
          </div>

          {/* Documents */}
          <div className="bg-white rounded-xl border p-6" style={{ borderColor: COLOR_BORDER }}>
            <h2 className="text-lg font-bold mb-1" style={{ color: COLOR_PRIMARY }}>Required documents — {req.label}</h2>
            <p className="text-xs mb-4" style={{ color: COLOR_TEXT_SECONDARY }}>PDF or image, up to 15MB each. Stored privately.</p>
            <div className="space-y-3">
              {req.docs.map((d) => {
                const uploaded = docs[d.type]
                return (
                  <div key={d.type} className="flex items-center justify-between gap-3 p-3 rounded-lg border" style={{ borderColor: COLOR_BORDER }}>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm" style={{ color: COLOR_PRIMARY }}>{d.label}</p>
                      {d.hint && <p className="text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>{d.hint}</p>}
                      {uploaded && <p className="text-xs mt-0.5" style={{ color: '#2D7A5F' }}>✓ {uploaded.name}</p>}
                    </div>
                    <label className="shrink-0 px-3 py-2 rounded-lg text-sm font-semibold cursor-pointer border flex items-center gap-1 hover:bg-gray-50" style={{ borderColor: COLOR_BORDER, color: COLOR_ACCENT }}>
                      <Upload size={14} /> {uploading === d.type ? 'Uploading…' : uploaded ? 'Replace' : 'Upload'}
                      <input type="file" accept="image/*,application/pdf" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadDoc(d.type, d.label, f) }} />
                    </label>
                  </div>
                )
              })}
            </div>
          </div>

          {/* UBO (UAE) */}
          {req.uboRequired && (
            <div className="bg-white rounded-xl border p-6" style={{ borderColor: COLOR_BORDER }}>
              <h2 className="text-lg font-bold mb-1" style={{ color: COLOR_PRIMARY }}>Beneficial owners (UBO)</h2>
              <p className="text-xs mb-4" style={{ color: COLOR_TEXT_SECONDARY }}>UAE requires disclosure of individuals who ultimately own/control the business.</p>
              <div className="space-y-2">
                {ubo.map((o, i) => (
                  <div key={i} className="flex gap-2">
                    <input className={inp} placeholder="Full name" value={o.name} onChange={(e) => setUbo((u) => u.map((x, j) => j === i ? { ...x, name: e.target.value } : x))} />
                    <input className={`${inp} w-28`} type="number" placeholder="% owned" value={o.ownershipPct} onChange={(e) => setUbo((u) => u.map((x, j) => j === i ? { ...x, ownershipPct: e.target.value } : x))} />
                    <button type="button" onClick={() => setUbo((u) => u.filter((_, j) => j !== i))} className="p-2 rounded-lg border" style={{ borderColor: COLOR_BORDER }}><Trash2 size={15} style={{ color: '#DC2626' }} /></button>
                  </div>
                ))}
              </div>
              <button type="button" onClick={() => setUbo((u) => [...u, { name: '', ownershipPct: '' }])} className="mt-2 flex items-center gap-1 text-sm font-semibold" style={{ color: COLOR_ACCENT }}><Plus size={14} /> Add owner</button>
            </div>
          )}

          {error && <p className="text-sm font-semibold" style={{ color: '#DC2626' }}>{error}</p>}
          <button onClick={submit} disabled={state === 'sending'} className="w-full px-6 py-3 rounded-lg font-bold text-white hover:opacity-90 disabled:opacity-50" style={{ background: COLOR_ACCENT }}>
            {state === 'sending' ? 'Submitting…' : 'Submit for verification'}
          </button>
        </div>
      </section>
    </Shell>
  )
}

const inp = 'w-full px-3 py-2 rounded-lg border text-sm bg-white focus:outline-none focus:ring-2'
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="block text-xs font-semibold mb-1" style={{ color: COLOR_PRIMARY }}>{label}</span>{children}</label>
}
function Shell({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen" style={{ background: COLOR_BG_PRIMARY }}><PublicHeader />{children}</div>
}

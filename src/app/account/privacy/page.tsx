'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Download, Trash2, ShieldCheck, Settings } from 'lucide-react'
import { PublicHeader } from '@/components/Navigation'
import { setConsent, getConsent } from '@/lib/consent'
import { COLOR_PRIMARY, COLOR_TEXT_SECONDARY, COLOR_BORDER, COLOR_ACCENT, COLOR_BG_PRIMARY } from '@/styles/forward-colors'

export default function PrivacySettingsPage() {
  const [deleting, setDeleting] = useState(false)
  const [confirmText, setConfirmText] = useState('')
  const [msg, setMsg] = useState('')
  const [dsrType, setDsrType] = useState('rectification')
  const [dsrMsg, setDsrMsg] = useState('')
  const [dsrSent, setDsrSent] = useState(false)

  async function deleteAccount() {
    if (confirmText !== 'DELETE') return
    setDeleting(true); setMsg('')
    try {
      const res = await fetch('/api/account/delete', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirm: true }),
      })
      const data = await res.json()
      if (res.ok) { setMsg('Your account has been deleted. Redirecting…'); setTimeout(() => { window.location.href = '/' }, 2000) }
      else setMsg(data.error || 'Deletion failed')
    } catch { setMsg('Request failed') } finally { setDeleting(false) }
  }

  async function submitDsr() {
    const res = await fetch('/api/account/dsr', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: dsrType, message: dsrMsg }),
    })
    if (res.ok) { setDsrSent(true); setDsrMsg('') }
  }

  return (
    <div className="min-h-screen" style={{ background: COLOR_BG_PRIMARY }}>
      <PublicHeader />
      <div className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-black mb-2" style={{ color: COLOR_PRIMARY }}>Privacy & your data</h1>
        <p className="mb-8" style={{ color: COLOR_TEXT_SECONDARY }}>
          Exercise your data rights. See our <Link href="/privacy" style={{ color: COLOR_ACCENT }}>Privacy Policy</Link> for details.
        </p>

        {/* Export */}
        <Card icon={<Download size={20} />} title="Download your data" desc="Get a copy of the personal data we hold about you (GDPR Art. 15 & 20).">
          <a href="/api/account/export" className="inline-block px-5 py-2.5 rounded-lg font-semibold text-white hover:opacity-90" style={{ background: COLOR_ACCENT }}>
            Download JSON export
          </a>
        </Card>

        {/* Consent */}
        <Card icon={<Settings size={20} />} title="Cookie & tracking preferences" desc="Update what non-essential storage you allow.">
          <div className="flex gap-2">
            <button onClick={() => { setConsent({ analytics: true, marketing: true }) }} className="px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ background: COLOR_ACCENT }}>Allow all</button>
            <button onClick={() => { setConsent({ analytics: false, marketing: false }) }} className="px-4 py-2 rounded-lg text-sm font-semibold border" style={{ borderColor: COLOR_BORDER, color: COLOR_PRIMARY }}>Essential only</button>
          </div>
          <p className="text-xs mt-2" style={{ color: COLOR_TEXT_SECONDARY }}>
            Current: {getConsent() ? `analytics ${getConsent()!.analytics ? 'on' : 'off'}, marketing ${getConsent()!.marketing ? 'on' : 'off'}` : 'not set'}
          </p>
        </Card>

        {/* DSR */}
        <Card icon={<ShieldCheck size={20} />} title="Make a request" desc="Rectification, restriction, objection, or any other privacy request.">
          {dsrSent ? (
            <p className="text-sm font-semibold" style={{ color: '#2D7A5F' }}>✓ Request received — we respond within 30 days.</p>
          ) : (
            <div className="space-y-2">
              <select value={dsrType} onChange={(e) => setDsrType(e.target.value)} className="px-3 py-2 rounded-lg border text-sm" style={{ borderColor: COLOR_BORDER }}>
                <option value="rectification">Correct my data (rectification)</option>
                <option value="restriction">Restrict processing</option>
                <option value="objection">Object to processing</option>
                <option value="other">Other</option>
              </select>
              <textarea value={dsrMsg} onChange={(e) => setDsrMsg(e.target.value)} placeholder="Describe your request…" rows={3} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ borderColor: COLOR_BORDER }} />
              <button onClick={submitDsr} className="px-5 py-2.5 rounded-lg font-semibold text-white hover:opacity-90" style={{ background: COLOR_ACCENT }}>Submit request</button>
            </div>
          )}
        </Card>

        {/* Delete */}
        <div className="bg-white rounded-xl border p-6 mt-6" style={{ borderColor: '#FCA5A5' }}>
          <div className="flex items-center gap-2 mb-1" style={{ color: '#DC2626' }}>
            <Trash2 size={20} />
            <h2 className="text-lg font-bold">Delete your account</h2>
          </div>
          <p className="text-sm mb-3" style={{ color: COLOR_TEXT_SECONDARY }}>
            Permanently erases your personal data and withdraws your listings (GDPR Art. 17). Some records may be retained
            in anonymized form where required by law (e.g. AML). This cannot be undone.
          </p>
          <p className="text-sm mb-2" style={{ color: COLOR_PRIMARY }}>Type <strong>DELETE</strong> to confirm:</p>
          <div className="flex gap-2">
            <input value={confirmText} onChange={(e) => setConfirmText(e.target.value)} placeholder="DELETE" className="px-3 py-2 rounded-lg border text-sm" style={{ borderColor: COLOR_BORDER }} />
            <button onClick={deleteAccount} disabled={confirmText !== 'DELETE' || deleting} className="px-5 py-2.5 rounded-lg font-bold text-white disabled:opacity-50" style={{ background: '#DC2626' }}>
              {deleting ? 'Deleting…' : 'Delete my account'}
            </button>
          </div>
          {msg && <p className="text-sm mt-3 font-semibold" style={{ color: COLOR_PRIMARY }}>{msg}</p>}
        </div>
      </div>
    </div>
  )
}

function Card({ icon, title, desc, children }: { icon: React.ReactNode; title: string; desc: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border p-6 mb-6" style={{ borderColor: COLOR_BORDER }}>
      <div className="flex items-center gap-2 mb-1" style={{ color: COLOR_ACCENT }}>{icon}<h2 className="text-lg font-bold" style={{ color: COLOR_PRIMARY }}>{title}</h2></div>
      <p className="text-sm mb-3" style={{ color: COLOR_TEXT_SECONDARY }}>{desc}</p>
      {children}
    </div>
  )
}

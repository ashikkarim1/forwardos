'use client'

import { useEffect, useState } from 'react'
import { CheckCircle2, XCircle, Clock, Landmark } from 'lucide-react'
import { COLOR_PRIMARY, COLOR_TEXT_SECONDARY, COLOR_BORDER, COLOR_ACCENT, COLOR_BG_PRIMARY } from '@/styles/forward-colors'

interface App {
  id: string; name: string; region: string; status: string; partnerTier: string | null
  contactName: string | null; contactEmail: string | null; contactPhone: string | null; linkedinUrl: string | null
  financingTypes: string[]; referralFeePercent: number | null; referralPlan: string | null
  description: string; shariaCompliant: boolean; agreementSignedAt: string | null; createdAt: string
}

const TIER_LABEL: Record<string, string> = {
  LISTED: 'Listed (Free)', VERIFIED: 'Verified ($299)', PREFERRED: 'Preferred ($999)', STRATEGIC: 'Strategic ($5,000+)',
}

const STATUS_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  PENDING: { bg: '#FEF3C7', color: '#92400E', label: 'Pending review' },
  APPROVED: { bg: '#EFF6FF', color: '#1D4ED8', label: 'Approved · awaiting signature' },
  ACTIVE: { bg: '#EAF5F0', color: '#2D7A5F', label: 'Active · marketed' },
  REJECTED: { bg: '#FEE2E2', color: '#991B1B', label: 'Rejected' },
  SIGNED: { bg: '#EAF5F0', color: '#2D7A5F', label: 'Signed' },
}

export default function AdminFinanciersPage() {
  const [apps, setApps] = useState<App[]>([])
  const [loading, setLoading] = useState(true)
  const [forbidden, setForbidden] = useState(false)
  const [busy, setBusy] = useState<string | null>(null)

  function load() {
    fetch('/api/admin/financiers').then(async (r) => {
      if (r.status === 403) { setForbidden(true); return }
      const d = await r.json(); setApps(d.applications || [])
    }).finally(() => setLoading(false))
  }
  useEffect(load, [])

  async function act(id: string, action: 'approve' | 'reject') {
    if (action === 'reject' && !confirm('Reject this application?')) return
    setBusy(id)
    try {
      await fetch(`/api/admin/financiers/${id}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action }),
      })
      load()
    } finally { setBusy(null) }
  }

  return (
    <div className="min-h-screen px-6 py-10" style={{ background: COLOR_BG_PRIMARY }}>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-2 mb-1" style={{ color: COLOR_ACCENT }}><Landmark size={22} />
          <h1 className="text-3xl font-black" style={{ color: COLOR_PRIMARY }}>Financier applications</h1>
        </div>
        <p className="mb-8" style={{ color: COLOR_TEXT_SECONDARY }}>Review partner applications. Approving emails them a referral agreement to sign; they go live once signed.</p>

        {forbidden ? (
          <div className="bg-white rounded-xl border p-8 text-center" style={{ borderColor: COLOR_BORDER }}>
            <p style={{ color: COLOR_PRIMARY }} className="font-bold mb-1">Admin access required</p>
            <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-sm">Sign in with an ADMIN account to review applications.</p>
          </div>
        ) : loading ? (
          <p style={{ color: COLOR_TEXT_SECONDARY }}>Loading…</p>
        ) : apps.length === 0 ? (
          <p style={{ color: COLOR_TEXT_SECONDARY }}>No applications yet.</p>
        ) : (
          <div className="space-y-4">
            {apps.map((a) => {
              const s = STATUS_STYLE[a.status] || STATUS_STYLE.PENDING
              return (
                <div key={a.id} className="bg-white rounded-xl border p-5" style={{ borderColor: COLOR_BORDER }}>
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-lg font-bold" style={{ color: COLOR_PRIMARY }}>{a.name}</h3>
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: s.bg, color: s.color }}>{s.label}</span>
                        {a.partnerTier && <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: '#EFF6FF', color: COLOR_ACCENT }}>{TIER_LABEL[a.partnerTier] || a.partnerTier}</span>}
                      </div>
                      <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                        {a.region} · {a.contactName || '—'} · {a.contactEmail} {a.contactPhone ? `· ${a.contactPhone}` : ''}
                      </p>
                      {(a.linkedinUrl || a.description) && (
                        <p className="text-xs mt-0.5" style={{ color: COLOR_TEXT_SECONDARY }}>
                          {a.linkedinUrl ? <a href={a.linkedinUrl} target="_blank" rel="noopener noreferrer" style={{ color: COLOR_ACCENT }}>LinkedIn</a> : null}
                        </p>
                      )}
                    </div>
                    {a.status === 'PENDING' && (
                      <div className="flex gap-2">
                        <button onClick={() => act(a.id, 'approve')} disabled={busy === a.id} className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-bold text-white disabled:opacity-50" style={{ background: '#2D7A5F' }}>
                          <CheckCircle2 size={15} /> Approve
                        </button>
                        <button onClick={() => act(a.id, 'reject')} disabled={busy === a.id} className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-bold border" style={{ borderColor: COLOR_BORDER, color: '#DC2626' }}>
                          <XCircle size={15} /> Reject
                        </button>
                      </div>
                    )}
                    {a.status === 'APPROVED' && (
                      <span className="flex items-center gap-1 text-sm font-semibold" style={{ color: '#1D4ED8' }}><Clock size={15} /> Awaiting signature</span>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mt-4 text-sm">
                    <div>
                      <p className="text-xs font-semibold uppercase mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>Financing</p>
                      <p style={{ color: COLOR_PRIMARY }}>{a.financingTypes.join(', ')}{a.shariaCompliant ? ' · Sharia-compliant' : ''}</p>
                      {a.description && <p className="mt-1" style={{ color: COLOR_TEXT_SECONDARY }}>{a.description}</p>}
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>Proposed referral plan</p>
                      <p style={{ color: COLOR_PRIMARY }}><strong>{a.referralFeePercent != null ? `${a.referralFeePercent}%` : '—'}</strong> {a.referralPlan || ''}</p>
                      {a.agreementSignedAt && <p className="mt-1 text-xs" style={{ color: '#2D7A5F' }}>✓ Agreement signed {new Date(a.agreementSignedAt).toLocaleDateString()}</p>}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

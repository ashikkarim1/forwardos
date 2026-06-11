'use client'

import { useEffect, useState } from 'react'
import { CheckCircle2, XCircle, ShieldCheck, AlertTriangle, FileText, Calculator } from 'lucide-react'
import { COLOR_PRIMARY, COLOR_TEXT_SECONDARY, COLOR_BORDER, COLOR_ACCENT, COLOR_BG_PRIMARY } from '@/styles/forward-colors'

interface VCase {
  id: string; businessName: string; region: string; status: string; contactEmail: string | null
  documents: { type: string; label: string; url: string; name?: string }[]
  ubo: { name: string; ownershipPct?: number }[]
  sanctionsClear: boolean
  sanctionsResult: { matches: { name: string; list: string; score: number }[] } | null
  createdAt: string
}

const ST: Record<string, { bg: string; color: string; label: string }> = {
  PENDING: { bg: '#FEF3C7', color: '#92400E', label: 'Pending' },
  APPROVED: { bg: '#EAF5F0', color: '#2D7A5F', label: 'Verified' },
  REJECTED: { bg: '#FEE2E2', color: '#991B1B', label: 'Rejected' },
  NEEDS_INFO: { bg: '#EFF6FF', color: '#1D4ED8', label: 'Needs info' },
}

export default function AdminVerificationsPage() {
  const [cases, setCases] = useState<VCase[]>([])
  const [loading, setLoading] = useState(true)
  const [forbidden, setForbidden] = useState(false)
  const [busy, setBusy] = useState<string | null>(null)

  function load() {
    fetch('/api/admin/verifications').then(async (r) => {
      if (r.status === 403) { setForbidden(true); return }
      const d = await r.json(); setCases(d.cases || [])
    }).finally(() => setLoading(false))
  }
  useEffect(load, [])

  async function act(id: string, action: 'approve' | 'reject' | 'request_info') {
    let notes: string | null = ''
    if (action !== 'approve') { notes = prompt(action === 'reject' ? 'Reason for rejection (optional):' : 'What info is needed?') ; if (notes === null) return }
    setBusy(id)
    try {
      await fetch(`/api/admin/verifications/${id}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action, notes }) })
      load()
    } finally { setBusy(null) }
  }

  return (
    <div className="min-h-screen px-6 py-10" style={{ background: COLOR_BG_PRIMARY }}>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-2 mb-1" style={{ color: COLOR_ACCENT }}><ShieldCheck size={22} /><h1 className="text-3xl font-black" style={{ color: COLOR_PRIMARY }}>Business verifications</h1></div>
        <p className="mb-8" style={{ color: COLOR_TEXT_SECONDARY }}>Review documents per region (US/CA/UAE), check sanctions screening, and approve to grant the Verified badge.</p>

        {forbidden ? (
          <div className="bg-white rounded-xl border p-8 text-center" style={{ borderColor: COLOR_BORDER }}><p className="font-bold" style={{ color: COLOR_PRIMARY }}>Admin access required</p></div>
        ) : loading ? <p style={{ color: COLOR_TEXT_SECONDARY }}>Loading…</p>
        : cases.length === 0 ? <p style={{ color: COLOR_TEXT_SECONDARY }}>No verification cases yet.</p>
        : (
          <div className="space-y-4">
            {cases.map((c) => {
              const s = ST[c.status] || ST.PENDING
              return (
                <div key={c.id} className="bg-white rounded-xl border p-5" style={{ borderColor: COLOR_BORDER }}>
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-lg font-bold" style={{ color: COLOR_PRIMARY }}>{c.businessName}</h3>
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: s.bg, color: s.color }}>{s.label}</span>
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: '#F3F4F6', color: COLOR_PRIMARY }}>{c.region}</span>
                        {c.sanctionsClear
                          ? <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: '#EAF5F0', color: '#2D7A5F' }}>Sanctions: clear</span>
                          : <span className="px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1" style={{ background: '#FEE2E2', color: '#991B1B' }}><AlertTriangle size={11} /> Sanctions hit</span>}
                      </div>
                      <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>{c.contactEmail || '—'}</p>
                    </div>
                    {c.status === 'PENDING' && (
                      <div className="flex gap-2">
                        <button onClick={() => act(c.id, 'approve')} disabled={busy === c.id} className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-bold text-white disabled:opacity-50" style={{ background: '#2D7A5F' }}><CheckCircle2 size={15} /> Verify</button>
                        <button onClick={() => act(c.id, 'request_info')} disabled={busy === c.id} className="px-3 py-2 rounded-lg text-sm font-semibold border" style={{ borderColor: COLOR_BORDER, color: COLOR_PRIMARY }}>Need info</button>
                        <button onClick={() => act(c.id, 'reject')} disabled={busy === c.id} className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold border" style={{ borderColor: COLOR_BORDER, color: '#DC2626' }}><XCircle size={15} /></button>
                      </div>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mt-4 text-sm">
                    <div>
                      <p className="text-xs font-semibold uppercase mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>Documents ({c.documents.length})</p>
                      <ul className="space-y-1">
                        {c.documents.map((d) => (
                          <li key={d.type}><a href={d.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:underline" style={{ color: COLOR_ACCENT }}><FileText size={13} /> {d.label}</a></li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      {c.ubo.length > 0 && <>
                        <p className="text-xs font-semibold uppercase mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>Beneficial owners</p>
                        <ul className="mb-2" style={{ color: COLOR_PRIMARY }}>{c.ubo.map((o, i) => <li key={i}>{o.name}{o.ownershipPct != null ? ` — ${o.ownershipPct}%` : ''}</li>)}</ul>
                      </>}
                      {!c.sanctionsClear && c.sanctionsResult?.matches?.length ? (
                        <div className="text-xs" style={{ color: '#991B1B' }}>
                          <p className="font-semibold">Potential matches:</p>
                          {c.sanctionsResult.matches.map((m, i) => <p key={i}>{m.name} ({m.list}, {Math.round(m.score * 100)}%)</p>)}
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <FinancialAnalyzer />
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

interface Extracted { revenue?: { currentYear?: number }; ebitda?: { currentYear?: number }; margin?: number; grossMargin?: number; confidence?: number }
interface Cmp { field: string; entered: number; extracted: number; deltaPct: number; flag: boolean }

const fmt = (n?: number) => (n == null ? '—' : `$${n.toLocaleString()}`)

/** Reviewer tool: paste a P&L / financial statement (and the seller's claimed
 *  figures) to extract numbers and flag mismatches via /api/ocr/analyze. */
function FinancialAnalyzer() {
  const [open, setOpen] = useState(false)
  const [text, setText] = useState('')
  const [revenue, setRevenue] = useState('')
  const [ebitda, setEbitda] = useState('')
  const [busy, setBusy] = useState(false)
  const [res, setRes] = useState<{ extracted: Extracted; comparison?: Cmp[]; source: string } | null>(null)
  const [err, setErr] = useState('')

  async function run() {
    if (text.trim().length < 10) { setErr('Paste the financial statement text first.'); return }
    setBusy(true); setErr(''); setRes(null)
    try {
      const entered = (revenue || ebitda) ? { revenue: revenue ? Number(revenue) : undefined, ebitda: ebitda ? Number(ebitda) : undefined } : undefined
      const r = await fetch('/api/ocr/analyze', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text, entered }) })
      const d = await r.json()
      if (!r.ok) { setErr(d.error || 'Analysis failed'); return }
      setRes(d)
    } finally { setBusy(false) }
  }

  return (
    <div className="mt-4 pt-4 border-t" style={{ borderColor: COLOR_BORDER }}>
      <button onClick={() => setOpen((o) => !o)} className="flex items-center gap-1.5 text-sm font-semibold" style={{ color: COLOR_ACCENT }}>
        <Calculator size={15} /> {open ? 'Hide' : 'Analyze financials'}
      </button>
      {open && (
        <div className="mt-3 space-y-2">
          <textarea value={text} onChange={(e) => setText(e.target.value)} rows={3} placeholder="Paste the P&L / financial statement text…"
            className="w-full px-3 py-2 rounded-lg border text-sm" style={{ borderColor: COLOR_BORDER }} />
          <div className="flex gap-2 flex-wrap items-end">
            <label className="text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>Claimed revenue ($)<input value={revenue} onChange={(e) => setRevenue(e.target.value)} type="number" className="block w-36 px-2 py-1.5 rounded border text-sm" style={{ borderColor: COLOR_BORDER }} /></label>
            <label className="text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>Claimed EBITDA ($)<input value={ebitda} onChange={(e) => setEbitda(e.target.value)} type="number" className="block w-36 px-2 py-1.5 rounded border text-sm" style={{ borderColor: COLOR_BORDER }} /></label>
            <button onClick={run} disabled={busy} className="px-4 py-2 rounded-lg text-sm font-bold text-white disabled:opacity-50" style={{ background: COLOR_ACCENT }}>{busy ? 'Analyzing…' : 'Analyze'}</button>
          </div>
          {err && <p className="text-xs font-semibold" style={{ color: '#DC2626' }}>{err}</p>}
          {res && (
            <div className="text-sm rounded-lg p-3" style={{ background: '#F9FAFB' }}>
              <p style={{ color: COLOR_PRIMARY }}>
                Extracted — Revenue {fmt(res.extracted.revenue?.currentYear)}, EBITDA {fmt(res.extracted.ebitda?.currentYear)}
                {res.extracted.margin != null ? `, margin ${res.extracted.margin}%` : ''} · confidence {res.extracted.confidence ?? 0}% ({res.source})
              </p>
              {res.comparison?.map((c) => (
                <p key={c.field} className="text-xs mt-1" style={{ color: c.flag ? '#991B1B' : '#2D7A5F' }}>
                  {c.flag ? '⚠️' : '✓'} {c.field}: claimed {fmt(c.entered)} vs extracted {fmt(c.extracted)} ({c.deltaPct}% diff)
                </p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

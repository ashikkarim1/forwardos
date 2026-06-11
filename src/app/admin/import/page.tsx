'use client'

import { useState } from 'react'
import { Upload, FileText, CheckCircle2, AlertCircle } from 'lucide-react'
import { COLOR_PRIMARY, COLOR_TEXT_SECONDARY, COLOR_BORDER, COLOR_ACCENT, COLOR_BG_PRIMARY } from '@/styles/forward-colors'

interface ImportResult { created: number; updated: number; skipped: number; errors: { row: number; error: string }[] }

const TEMPLATE_HEADER = 'title,description,industry,country,city,revenue,ebitda,askingPrice,employees,foundedYear,isFranchise,financingEligible,financingNote,heatScore,sellerEmail,sellerName'

export default function AdminImportPage() {
  const [csv, setCsv] = useState('')
  const [fileName, setFileName] = useState('')
  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState<ImportResult | null>(null)
  const [error, setError] = useState('')

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    setFileName(f.name)
    f.text().then(setCsv)
  }

  async function submit() {
    setBusy(true); setError(''); setResult(null)
    try {
      const res = await fetch('/api/admin/import-deals', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ csv }),
      })
      const data = await res.json()
      if (!res.ok) setError(data.error || 'Import failed')
      else setResult(data)
    } catch {
      setError('Request failed')
    } finally {
      setBusy(false)
    }
  }

  const rowCount = csv ? Math.max(0, csv.trim().split('\n').length - 1) : 0

  return (
    <div className="min-h-screen px-6 py-10" style={{ background: COLOR_BG_PRIMARY }}>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-black mb-2" style={{ color: COLOR_PRIMARY }}>Import listings</h1>
        <p className="mb-6" style={{ color: COLOR_TEXT_SECONDARY }}>
          Bulk-upload businesses from a CSV. Admin only. Re-importing updates existing rows (matched by seller + title).
        </p>

        <div className="bg-white rounded-xl border p-6 mb-6" style={{ borderColor: COLOR_BORDER }}>
          <label className="flex items-center gap-3 px-4 py-3 rounded-lg border-2 border-dashed cursor-pointer hover:bg-gray-50" style={{ borderColor: COLOR_BORDER }}>
            <Upload size={20} style={{ color: COLOR_ACCENT }} />
            <span style={{ color: COLOR_PRIMARY }} className="font-semibold">{fileName || 'Choose a CSV file…'}</span>
            <input type="file" accept=".csv,text/csv" onChange={onFile} className="hidden" />
          </label>

          {csv && (
            <p className="text-sm mt-3" style={{ color: COLOR_TEXT_SECONDARY }}>
              <FileText size={14} className="inline mr-1" /> {rowCount} row{rowCount === 1 ? '' : 's'} detected.
            </p>
          )}

          <button
            onClick={submit}
            disabled={!csv || busy}
            className="mt-4 w-full px-6 py-3 rounded-lg font-bold text-white transition-all hover:opacity-90 disabled:opacity-50"
            style={{ background: COLOR_ACCENT }}
          >
            {busy ? 'Importing…' : `Import ${rowCount || ''} listing${rowCount === 1 ? '' : 's'}`}
          </button>
        </div>

        {error && (
          <div className="bg-white rounded-xl border p-5 mb-6 flex items-start gap-3" style={{ borderColor: '#FCA5A5' }}>
            <AlertCircle size={20} style={{ color: '#EF4444' }} />
            <p style={{ color: '#991B1B' }}>{error}</p>
          </div>
        )}

        {result && (
          <div className="bg-white rounded-xl border p-6" style={{ borderColor: COLOR_BORDER }}>
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 size={22} style={{ color: '#2D7A5F' }} />
              <h2 className="text-lg font-bold" style={{ color: COLOR_PRIMARY }}>Import complete</h2>
            </div>
            <div className="flex gap-6 mb-4">
              <Stat label="Created" value={result.created} color="#2D7A5F" />
              <Stat label="Updated" value={result.updated} color={COLOR_ACCENT} />
              <Stat label="Skipped" value={result.skipped} color="#B45309" />
            </div>
            {result.errors.length > 0 && (
              <div>
                <p className="font-semibold mb-2" style={{ color: COLOR_PRIMARY }}>Issues</p>
                <ul className="text-sm space-y-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                  {result.errors.slice(0, 20).map((e, i) => <li key={i}>Row {e.row}: {e.error}</li>)}
                </ul>
              </div>
            )}
          </div>
        )}

        <details className="mt-6">
          <summary className="cursor-pointer font-semibold" style={{ color: COLOR_ACCENT }}>CSV format</summary>
          <p className="text-sm mt-2 mb-2" style={{ color: COLOR_TEXT_SECONDARY }}>Header row (money in whole units, e.g. dollars):</p>
          <pre className="text-xs p-3 rounded-lg overflow-x-auto" style={{ background: '#F3F4F6', color: COLOR_PRIMARY }}>{TEMPLATE_HEADER}</pre>
          <p className="text-sm mt-2" style={{ color: COLOR_TEXT_SECONDARY }}>
            industry must be one of: SAAS, HEALTHCARE, RETAIL, ECOMMERCE, MANUFACTURING, FINTECH, SERVICES, HOSPITALITY,
            EDUCATION, ENERGY, REAL_ESTATE, LOGISTICS, AUTOMOTIVE, AGRICULTURE, BIOTECH, CPG, MEDIA, TELECOM, OTHER.
          </p>
        </details>
      </div>
    </div>
  )
}

function Stat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <p className="text-3xl font-black" style={{ color }}>{value}</p>
      <p className="text-xs uppercase tracking-wide" style={{ color: COLOR_TEXT_SECONDARY }}>{label}</p>
    </div>
  )
}

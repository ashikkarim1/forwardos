'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Bell, BellOff, Trash2, Search, ArrowRight, Plus } from 'lucide-react'
import { PublicHeader } from '@/components/Navigation'
import { useLocale } from '@/context/LocaleContext'
import { formatCurrency, type Currency } from '@/lib/currency'
import {
  listSavedSearches, deleteSavedSearch, toggleAlert, filtersToQuery,
  type SavedSearchRecord,
} from '@/lib/saved-search-client'
import { COLOR_PRIMARY, COLOR_TEXT_SECONDARY, COLOR_BORDER, COLOR_ACCENT, COLOR_BG_PRIMARY } from '@/styles/forward-colors'

export default function SavedSearchesPage() {
  const { currency, isRTL } = useLocale()
  const cur = currency as Currency
  const [searches, setSearches] = useState<SavedSearchRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    listSavedSearches().then((s) => { setSearches(s); setLoading(false) })
  }, [])

  async function handleToggle(id: string, enabled: boolean) {
    setSearches((prev) => prev.map((s) => (s.id === id ? { ...s, alertEnabled: enabled } : s)))
    await toggleAlert(id, enabled)
  }
  async function handleDelete(id: string) {
    setSearches((prev) => prev.filter((s) => s.id !== id))
    await deleteSavedSearch(id)
  }

  function summarize(s: SavedSearchRecord): string {
    const f = s.filters
    const parts: string[] = []
    if (f.industries?.length) parts.push(f.industries.map((i) => i.toLowerCase()).join(', '))
    if (f.country) parts.push(f.country)
    if (f.minPrice != null || f.maxPrice != null) {
      parts.push(`${f.minPrice != null ? formatCurrency(f.minPrice / 100, cur) : 'any'} – ${f.maxPrice != null ? formatCurrency(f.maxPrice / 100, cur) : 'any'}`)
    }
    if (f.financingEligible) parts.push('financing eligible')
    if (f.isFranchise) parts.push('franchise')
    return parts.length ? parts.join(' · ') : 'All businesses'
  }

  return (
    <div className="min-h-screen" style={{ background: COLOR_BG_PRIMARY }} dir={isRTL ? 'rtl' : 'ltr'}>
      <PublicHeader />

      <section className="px-6 py-10 border-b" style={{ borderColor: COLOR_BORDER }}>
        <div className="max-w-5xl mx-auto flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl md:text-4xl font-black mb-2" style={{ color: COLOR_PRIMARY }}>
              Saved searches & alerts
            </h1>
            <p style={{ color: COLOR_TEXT_SECONDARY }}>
              Get notified the moment a new business matches your criteria — ranked by AI heat score.
            </p>
          </div>
          <Link href="/marketplace" className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white hover:opacity-90" style={{ background: COLOR_ACCENT }}>
            <Plus size={16} /> New search
          </Link>
        </div>
      </section>

      <section className="px-6 py-10">
        <div className="max-w-5xl mx-auto">
          {loading ? (
            <p style={{ color: COLOR_TEXT_SECONDARY }}>Loading…</p>
          ) : searches.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border" style={{ borderColor: COLOR_BORDER }}>
              <div className="w-14 h-14 mx-auto rounded-full flex items-center justify-center mb-4" style={{ background: '#FAF6EF' }}>
                <Search size={26} style={{ color: COLOR_ACCENT }} />
              </div>
              <h2 className="text-xl font-bold mb-2" style={{ color: COLOR_PRIMARY }}>No saved searches yet</h2>
              <p className="mb-6" style={{ color: COLOR_TEXT_SECONDARY }}>
                Set your filters in the marketplace, then tap <strong>“Save search &amp; alert me.”</strong>
              </p>
              <Link href="/marketplace" className="inline-flex items-center gap-2 px-5 py-3 rounded-lg font-semibold text-white hover:opacity-90" style={{ background: COLOR_ACCENT }}>
                Browse marketplace <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {searches.map((s, i) => (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-xl border p-5 flex items-center justify-between gap-4 flex-wrap"
                  style={{ borderColor: COLOR_BORDER }}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold truncate" style={{ color: COLOR_PRIMARY }}>{s.name}</h3>
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: s.alertEnabled ? '#EAF5F0' : '#F3F4F6', color: s.alertEnabled ? '#2D7A5F' : '#717171' }}>
                        {s.alertEnabled ? `${s.alertFrequency.toLowerCase()} alerts` : 'alerts off'}
                      </span>
                    </div>
                    <p className="text-sm truncate" style={{ color: COLOR_TEXT_SECONDARY }}>{summarize(s)}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/marketplace?${filtersToQuery(s.filters)}`}
                      className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold border hover:bg-gray-50"
                      style={{ borderColor: COLOR_BORDER, color: COLOR_ACCENT }}
                    >
                      View matches <ArrowRight size={14} />
                    </Link>
                    <button
                      onClick={() => handleToggle(s.id, !s.alertEnabled)}
                      className="p-2 rounded-lg border hover:bg-gray-50"
                      style={{ borderColor: COLOR_BORDER }}
                      title={s.alertEnabled ? 'Turn alerts off' : 'Turn alerts on'}
                    >
                      {s.alertEnabled ? <Bell size={16} style={{ color: COLOR_ACCENT }} /> : <BellOff size={16} style={{ color: COLOR_TEXT_SECONDARY }} />}
                    </button>
                    <button
                      onClick={() => handleDelete(s.id)}
                      className="p-2 rounded-lg border hover:bg-red-50"
                      style={{ borderColor: COLOR_BORDER }}
                      title="Delete"
                    >
                      <Trash2 size={16} style={{ color: '#EF4444' }} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

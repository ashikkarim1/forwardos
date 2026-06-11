'use client'

import { useState } from 'react'
import { Bell, Check } from 'lucide-react'
import { createSavedSearch } from '@/lib/saved-search-client'
import type { SavedSearchFilters } from '@/lib/services/saved-search-service'
import { COLOR_ACCENT } from '@/styles/forward-colors'

/**
 * "Save this search" — serializes the current marketplace filters into a saved
 * search with email alerts. Drop into the marketplace toolbar with the active filters.
 */
export function SaveSearchButton({ filters }: { filters: SavedSearchFilters }) {
  const [saved, setSaved] = useState(false)
  const [busy, setBusy] = useState(false)

  async function handleSave() {
    if (saved || busy) return
    const name = window.prompt('Name this search (you\'ll get alerts when new matches list):', 'My search')
    if (!name) return
    setBusy(true)
    try {
      await createSavedSearch(name, filters)
      setSaved(true)
      setTimeout(() => setSaved(false), 4000)
    } finally {
      setBusy(false)
    }
  }

  return (
    <button
      onClick={handleSave}
      disabled={busy}
      className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-60"
      style={{ background: COLOR_ACCENT }}
      title="Save this search and get email alerts for new matches"
    >
      {saved ? <Check size={16} /> : <Bell size={16} />}
      {saved ? 'Saved — alerts on' : 'Save search & alert me'}
    </button>
  )
}

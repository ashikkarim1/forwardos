/**
 * Client-side saved-search store.
 *
 * Tries the API first; falls back to localStorage so the feature is fully usable
 * in preview without a database. Same shape either way.
 */
import type { SavedSearchFilters } from '@/lib/services/saved-search-service'

export interface SavedSearchRecord {
  id: string
  name: string
  filters: SavedSearchFilters
  country?: string | null
  alertEnabled: boolean
  alertFrequency: 'INSTANT' | 'DAILY' | 'WEEKLY'
  createdAt: string
}

const LS_KEY = 'forward_saved_searches'
// Stable demo user id (no auth/session in the app yet)
export const DEMO_USER_ID = 'demo-user'

function readLocal(): SavedSearchRecord[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || '[]')
  } catch {
    return []
  }
}

function writeLocal(records: SavedSearchRecord[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(records))
}

export async function listSavedSearches(): Promise<SavedSearchRecord[]> {
  try {
    const res = await fetch(`/api/saved-searches?userId=${DEMO_USER_ID}`)
    const data = await res.json()
    if (data.savedSearches?.length) return data.savedSearches
  } catch {
    /* fall through */
  }
  return readLocal()
}

export async function createSavedSearch(
  name: string,
  filters: SavedSearchFilters,
  opts?: { country?: string; alertFrequency?: SavedSearchRecord['alertFrequency'] },
): Promise<SavedSearchRecord> {
  const record: SavedSearchRecord = {
    id: `ss_${Date.now()}_${Math.floor(Math.random() * 1e4)}`,
    name,
    filters,
    country: opts?.country ?? null,
    alertEnabled: true,
    alertFrequency: opts?.alertFrequency ?? 'DAILY',
    createdAt: new Date().toISOString(),
  }
  // Best-effort API persist (production); always mirror to localStorage for preview
  try {
    await fetch('/api/saved-searches', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: DEMO_USER_ID, name, filters, country: opts?.country, alertFrequency: record.alertFrequency }),
    })
  } catch {
    /* ignore */
  }
  writeLocal([record, ...readLocal()])
  return record
}

export async function deleteSavedSearch(id: string): Promise<void> {
  try {
    await fetch(`/api/saved-searches/${id}`, { method: 'DELETE' })
  } catch {
    /* ignore */
  }
  writeLocal(readLocal().filter((r) => r.id !== id))
}

export async function toggleAlert(id: string, alertEnabled: boolean): Promise<void> {
  try {
    await fetch(`/api/saved-searches/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ alertEnabled }),
    })
  } catch {
    /* ignore */
  }
  writeLocal(readLocal().map((r) => (r.id === id ? { ...r, alertEnabled } : r)))
}

/** Serialize filters into marketplace querystring so "view matches" deep-links the marketplace. */
export function filtersToQuery(filters: SavedSearchFilters): string {
  const p = new URLSearchParams()
  if (filters.industries?.length) p.set('industries', filters.industries.join(','))
  if (filters.country) p.set('country', filters.country)
  if (filters.minPrice != null) p.set('minPrice', String(filters.minPrice))
  if (filters.maxPrice != null) p.set('maxPrice', String(filters.maxPrice))
  if (filters.financingEligible) p.set('financingEligible', 'true')
  if (filters.isFranchise) p.set('isFranchise', 'true')
  return p.toString()
}

'use client'

/**
 * Save / unsave a deal. Stores the saved deal-id set in localStorage so it
 * works for anonymous visitors immediately, no auth required. When a user
 * later logs in, this can be synced to the SavedDeal table via /api/saved-deals.
 *
 * Synchronizes across tabs via the 'storage' event so the heart icon stays
 * in sync if the user has the same listing open in multiple tabs.
 */
import { useEffect, useState, useCallback } from 'react'

const STORAGE_KEY = 'forward.savedDeals.v1'

function readSet(): Set<string> {
  if (typeof window === 'undefined') return new Set()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return new Set()
    const arr = JSON.parse(raw)
    return Array.isArray(arr) ? new Set(arr.filter((x: unknown) => typeof x === 'string')) : new Set()
  } catch {
    return new Set()
  }
}

function writeSet(s: Set<string>) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(s))) } catch {}
}

export function useSavedDeals() {
  // Always start with an empty set on SSR to keep hydration deterministic;
  // we hydrate from localStorage in a useEffect below.
  const [saved, setSaved] = useState<Set<string>>(() => new Set())
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setSaved(readSet())
    setHydrated(true)

    function onStorage(e: StorageEvent) {
      if (e.key === STORAGE_KEY) setSaved(readSet())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const toggle = useCallback((dealId: string) => {
    setSaved((prev) => {
      const next = new Set(prev)
      if (next.has(dealId)) next.delete(dealId)
      else next.add(dealId)
      writeSet(next)
      return next
    })
  }, [])

  const isSaved = useCallback((dealId: string) => saved.has(dealId), [saved])

  return { saved, isSaved, toggle, hydrated, count: saved.size }
}

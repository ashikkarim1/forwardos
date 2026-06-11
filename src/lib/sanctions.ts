/**
 * Basic sanctions / watchlist screening against public lists (OFAC SDN, UN
 * Consolidated, UAE Local Terrorist List).
 *
 * This ships with a small representative sample for offline/dev use and a clear
 * upgrade path: in production, load the full published feeds into
 * `loadWatchlist()` (OFAC SDN CSV, UN XML, UAE list) — the matching logic below
 * doesn't change. This is screening support, NOT legal clearance.
 */

export interface WatchlistEntry {
  name: string
  list: 'OFAC-SDN' | 'UN' | 'UAE'
  type?: string
}

// Representative sample only — REPLACE with the full published feeds for production.
const SAMPLE_WATCHLIST: WatchlistEntry[] = [
  { name: 'Specially Designated National Example', list: 'OFAC-SDN' },
  { name: 'Blocked Persons Test Entity', list: 'OFAC-SDN' },
  { name: 'United Nations Listed Person', list: 'UN' },
  { name: 'UAE Local List Sample Entity', list: 'UAE' },
]

let WATCHLIST: WatchlistEntry[] = SAMPLE_WATCHLIST

/** Override the watchlist (e.g. load full feeds at boot or via a cron). */
export function loadWatchlist(entries: WatchlistEntry[]): void {
  WATCHLIST = entries
}

function normalize(s: string): string {
  return s.toLowerCase().normalize('NFKD').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim()
}
function tokens(s: string): Set<string> {
  return new Set(normalize(s).split(' ').filter((t) => t.length > 1))
}

/** Token-overlap similarity (Jaccard) — simple, dependency-free fuzzy match. */
function similarity(a: string, b: string): number {
  const ta = tokens(a)
  const tb = tokens(b)
  if (ta.size === 0 || tb.size === 0) return 0
  let inter = 0
  for (const t of ta) if (tb.has(t)) inter++
  return inter / (ta.size + tb.size - inter)
}

export interface SanctionsMatch { name: string; list: string; score: number }
export interface SanctionsResult { clear: boolean; checkedAt: string; matches: SanctionsMatch[] }

/**
 * Screen one or more names against the watchlist. Flags fuzzy matches at/above
 * `threshold` (default 0.7). Returns clear=true when nothing matches.
 */
export function screenNames(names: (string | null | undefined)[], threshold = 0.7): SanctionsResult {
  const matches: SanctionsMatch[] = []
  for (const raw of names) {
    if (!raw || !raw.trim()) continue
    for (const entry of WATCHLIST) {
      const score = similarity(raw, entry.name)
      if (score >= threshold) matches.push({ name: entry.name, list: entry.list, score: Number(score.toFixed(2)) })
    }
  }
  // De-dupe + sort strongest first
  const unique = Array.from(new Map(matches.map((m) => [`${m.list}:${m.name}`, m])).values()).sort((a, b) => b.score - a.score)
  return { clear: unique.length === 0, checkedAt: new Date().toISOString(), matches: unique }
}

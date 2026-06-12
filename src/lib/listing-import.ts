/**
 * Bulk listing import — dependency-free CSV parsing, validation/mapping, and a
 * DB orchestration routine shared by the CLI script (prisma/import-listings.ts)
 * and the admin API (/api/admin/import-deals).
 *
 * CSV columns (header row required; extra columns ignored):
 *   title, description, industry, country, city, revenue, ebitda, askingPrice,
 *   employees, foundedYear, isFranchise, financingEligible, financingNote,
 *   heatScore, sellerEmail, sellerName
 * Money columns are in whole currency units (e.g. dollars); stored as cents.
 */
import crypto from 'crypto'

export const INDUSTRY_VALUES = [
  'SAAS', 'HEALTHCARE', 'RETAIL', 'ECOMMERCE', 'MANUFACTURING', 'FINTECH', 'SERVICES',
  'HOSPITALITY', 'EDUCATION', 'ENERGY', 'REAL_ESTATE', 'LOGISTICS', 'AUTOMOTIVE',
  'AGRICULTURE', 'BIOTECH', 'CPG', 'MEDIA', 'TELECOM', 'OTHER',
] as const

export const SELLER_TYPE_VALUES = [
  'FOUNDER', 'FAMILY', 'PE', 'CORPORATE', 'BROKER', 'MANAGEMENT', 'OTHER',
] as const

export const SELLER_MOTIVATION_VALUES = [
  'STRATEGIC_EXIT', 'SUCCESSION', 'RETIREMENT', 'GROWTH_CAPITAL',
  'PORTFOLIO_OPTIMIZATION', 'DISTRESSED', 'RELOCATION', 'OTHER',
] as const

export interface MappedDeal {
  title: string
  description: string | null
  industry: string
  country: string
  city: string | null
  revenueCents: bigint | null
  ebitdaCents: bigint | null
  askingPriceCents: bigint | null
  employees: number | null
  foundedYear: number | null
  isFranchise: boolean
  financingEligible: boolean
  financingNote: string | null
  heatScore: number | null
  sellerEmail: string | null
  sellerName: string | null
  sellerType: string | null
  sellerMotivation: string | null
}

/** Minimal RFC-4180-ish CSV parser: handles quoted fields, escaped quotes, commas, and newlines. */
export function parseCsv(text: string): Record<string, string>[] {
  const rows: string[][] = []
  let field = ''
  let row: string[] = []
  let inQuotes = false
  const s = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n')

  for (let i = 0; i < s.length; i++) {
    const c = s[i]
    if (inQuotes) {
      if (c === '"') {
        if (s[i + 1] === '"') { field += '"'; i++ } else inQuotes = false
      } else field += c
    } else if (c === '"') inQuotes = true
    else if (c === ',') { row.push(field); field = '' }
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = '' }
    else field += c
  }
  if (field.length > 0 || row.length > 0) { row.push(field); rows.push(row) }

  const nonEmpty = rows.filter((r) => r.some((c) => c.trim() !== ''))
  if (nonEmpty.length === 0) return []
  const headers = nonEmpty[0].map((h) => h.trim())
  return nonEmpty.slice(1).map((r) => {
    const obj: Record<string, string> = {}
    headers.forEach((h, i) => { obj[h] = (r[i] ?? '').trim() })
    return obj
  })
}

const toCents = (v: string): bigint | null => {
  if (!v) return null
  const n = Number(v.replace(/[$,\s]/g, ''))
  return Number.isFinite(n) ? BigInt(Math.round(n * 100)) : null
}
const toInt = (v: string): number | null => {
  if (!v) return null
  const n = parseInt(v.replace(/[,\s]/g, ''), 10)
  return Number.isFinite(n) ? n : null
}
const toBool = (v: string): boolean => /^(true|yes|y|1)$/i.test(v.trim())

/** Validate + normalize one CSV row. Returns the mapped deal or an error string. */
export function mapRow(row: Record<string, string>): { ok: true; deal: MappedDeal } | { ok: false; error: string } {
  const title = (row.title || '').trim()
  if (!title) return { ok: false, error: 'Missing title' }

  const industry = (row.industry || 'OTHER').trim().toUpperCase().replace(/[\s-]/g, '_')
  if (!INDUSTRY_VALUES.includes(industry as never)) {
    return { ok: false, error: `Invalid industry "${row.industry}" (allowed: ${INDUSTRY_VALUES.join(', ')})` }
  }
  const country = (row.country || '').trim()
  if (!country) return { ok: false, error: `Missing country for "${title}"` }

  // sellerType / sellerMotivation are optional; ignore unrecognized values
  // rather than reject the whole row.
  const rawType = (row.sellerType || '').trim().toUpperCase().replace(/[\s-]/g, '_')
  const sellerType = SELLER_TYPE_VALUES.includes(rawType as never) ? rawType : null
  const rawMot = (row.sellerMotivation || '').trim().toUpperCase().replace(/[\s-]/g, '_')
  const sellerMotivation = SELLER_MOTIVATION_VALUES.includes(rawMot as never) ? rawMot : null

  return {
    ok: true,
    deal: {
      title,
      description: row.description?.trim() || null,
      industry,
      country,
      city: row.city?.trim() || null,
      revenueCents: toCents(row.revenue || ''),
      ebitdaCents: toCents(row.ebitda || ''),
      askingPriceCents: toCents(row.askingPrice || ''),
      employees: toInt(row.employees || ''),
      foundedYear: toInt(row.foundedYear || ''),
      isFranchise: toBool(row.isFranchise || ''),
      financingEligible: toBool(row.financingEligible || ''),
      financingNote: row.financingNote?.trim() || null,
      heatScore: toInt(row.heatScore || ''),
      sellerEmail: row.sellerEmail?.trim().toLowerCase() || null,
      sellerName: row.sellerName?.trim() || null,
      sellerType,
      sellerMotivation,
    },
  }
}

export interface ImportResult {
  created: number
  updated: number
  skipped: number
  errors: { row: number; error: string }[]
}

/**
 * Orchestrate the import against a Prisma client. Creates a seller user per
 * unique sellerEmail (placeholder, non-login until they reset), then upserts a
 * deal per row keyed by a deterministic slug of title+seller.
 */
export async function runImport(csvText: string, db: any): Promise<ImportResult> {
  const rows = parseCsv(csvText)
  const result: ImportResult = { created: 0, updated: 0, skipped: 0, errors: [] }
  const sellerCache = new Map<string, string>() // email → userId

  // Default catch-all importer seller for rows with no sellerEmail.
  const DEFAULT_SELLER = 'importer@forwardos.ai'

  async function ensureSeller(email: string, name: string | null): Promise<string> {
    if (sellerCache.has(email)) return sellerCache.get(email)!
    const existing = await db.user.findUnique({ where: { email } })
    if (existing) { sellerCache.set(email, existing.id); return existing.id }
    const user = await db.user.create({
      data: {
        email,
        name: name || email.split('@')[0],
        // Random, non-loginable placeholder until the seller sets a password.
        password: crypto.randomBytes(24).toString('hex'),
        role: 'SELLER',
      },
    })
    sellerCache.set(email, user.id)
    return user.id
  }

  for (let i = 0; i < rows.length; i++) {
    const mapped = mapRow(rows[i])
    if (!mapped.ok) { result.skipped++; result.errors.push({ row: i + 2, error: mapped.error }); continue }
    const d = mapped.deal
    try {
      const sellerEmail = d.sellerEmail || DEFAULT_SELLER
      const sellerId = await ensureSeller(sellerEmail, d.sellerName)
      const id = `imp-${crypto.createHash('sha1').update(`${sellerEmail}|${d.title}`).digest('hex').slice(0, 16)}`

      const data = {
        sellerId, title: d.title, description: d.description, status: 'ACTIVE' as const,
        publishedAt: new Date(), industry: d.industry as never, country: d.country, city: d.city,
        revenue: d.revenueCents, ebitda: d.ebitdaCents, askingPrice: d.askingPriceCents,
        employees: d.employees, foundedYear: d.foundedYear, isFranchise: d.isFranchise,
        financingEligible: d.financingEligible, financingNote: d.financingNote,
        heatScore: d.heatScore,
        sellerType: d.sellerType as never,
        sellerMotivation: d.sellerMotivation as never,
      }
      const existing = await db.deal.findUnique({ where: { id } })
      if (existing) { await db.deal.update({ where: { id }, data }); result.updated++ }
      else { await db.deal.create({ data: { id, ...data } }); result.created++ }
    } catch (e) {
      result.skipped++
      result.errors.push({ row: i + 2, error: (e as Error).message })
    }
  }
  return result
}

/**
 * Document OCR Service
 * Extracts financial data from uploaded documents using OCR
 */

interface ExtractedFinancialData {
  revenue?: {
    currentYear?: number
    previousYear?: number
    twoYearsAgo?: number
    trend?: 'growing' | 'stable' | 'declining'
  }
  ebitda?: {
    currentYear?: number
    previousYear?: number
  }
  margin?: number
  grossMargin?: number
  customers?: Array<{
    name: string
    revenue: number
    percentage: number
  }>
  growthRate?: number
  keyMetrics?: Record<string, any>
  confidence?: number // 0-100
}

/**
 * Parse a financial document.
 *  - If AWS Textract is configured (and the SDK is installed), OCR the file.
 *  - Otherwise, fetch the document and extract from any readable text
 *    (works for text-based PDFs / plain text), so it's usable without a vendor.
 * Returns { confidence: 0 } when nothing could be extracted.
 */
export async function parseFinancialDocument(fileUrl: string, fileName: string): Promise<ExtractedFinancialData & { source?: string }> {
  // 1) AWS Textract (production) — only if configured AND SDK present.
  if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_TEXTRACT_ENABLED === 'true') {
    try {
      const text = await extractTextFromDocument(fileUrl)
      if (text) return { ...extractFinancialsFromText(text), source: 'textract' }
    } catch (e) {
      console.warn('[OCR] Textract path failed, falling back:', (e as Error).message)
    }
  }

  // 2) Best-effort text fetch (works for text/CSV/text-PDF served over HTTP or /uploads).
  try {
    const url = fileUrl.startsWith('http') ? fileUrl : `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}${fileUrl}`
    const res = await fetch(url)
    const ct = res.headers.get('content-type') || ''
    if (ct.includes('text') || ct.includes('csv') || ct.includes('json') || /\.(txt|csv)$/i.test(fileName)) {
      const text = await res.text()
      return { ...extractFinancialsFromText(text), source: 'text' }
    }
  } catch (e) {
    console.warn('[OCR] text fetch failed:', (e as Error).message)
  }

  // Couldn't read it (e.g. scanned/binary PDF with no Textract) → manual review.
  return { confidence: 0, source: 'unsupported' }
}

const moneyToNumber = (s: string): number => {
  const mult = /m\b|million/i.test(s) ? 1_000_000 : /k\b|thousand/i.test(s) ? 1_000 : 1
  const n = parseFloat(s.replace(/[^0-9.]/g, ''))
  return Number.isFinite(n) ? Math.round(n * mult) : 0
}

/**
 * Extract financial figures from raw text (Textract output, pasted P&L, CSV…).
 * Regex-based — dependency-free and provider-agnostic.
 */
export function extractFinancialsFromText(text: string): ExtractedFinancialData {
  const find = (labels: string[]): number => {
    for (const label of labels) {
      const re = new RegExp(`${label}[^0-9$]{0,20}\\$?\\s*([0-9][0-9,.]*\\s*(?:million|thousand|[mMkK])?)`, 'i')
      const m = text.match(re)
      if (m) return moneyToNumber(m[1])
    }
    return 0
  }
  const revenue = find(['total revenue', 'net revenue', 'revenue', 'total sales', 'turnover'])
  const ebitda = find(['ebitda', 'operating income', 'operating profit'])
  const grossProfit = find(['gross profit', 'gross margin'])
  const result: ExtractedFinancialData = { confidence: 0 }
  if (revenue) result.revenue = { currentYear: revenue }
  if (ebitda) result.ebitda = { currentYear: ebitda }
  if (revenue && grossProfit) result.grossMargin = Math.round((grossProfit / revenue) * 100)
  if (revenue && ebitda) result.margin = Math.round((ebitda / revenue) * 100)
  // Confidence reflects how many anchors we found.
  const found = [revenue, ebitda, grossProfit].filter(Boolean).length
  result.confidence = found === 0 ? 0 : Math.min(95, 40 + found * 18)
  return result
}

/**
 * Cross-check seller-entered figures against extracted figures. Flags material
 * mismatches (>10% off) so a reviewer can confirm "verified financials".
 */
export function compareFinancials(
  entered: { revenue?: number; ebitda?: number },
  extracted: ExtractedFinancialData,
): { field: string; entered: number; extracted: number; deltaPct: number; flag: boolean }[] {
  const out: { field: string; entered: number; extracted: number; deltaPct: number; flag: boolean }[] = []
  const check = (field: string, e?: number, x?: number) => {
    if (e == null || !x) return
    const deltaPct = Math.round((Math.abs(e - x) / Math.max(e, x)) * 100)
    out.push({ field, entered: e, extracted: x, deltaPct, flag: deltaPct > 10 })
  }
  check('revenue', entered.revenue, extracted.revenue?.currentYear)
  check('ebitda', entered.ebitda, extracted.ebitda?.currentYear)
  return out
}

/**
 * Verify document authenticity
 * In production, would cross-reference with government databases, banks, etc.
 */
export async function verifyDocumentAuthenticity(fileName: string, documentType: string): Promise<{
  isAuthentic: boolean
  confidence: number
  warnings?: string[]
}> {
  try {
    console.log('[OCR] Verifying document:', fileName, documentType)

    // Mock verification
    return {
      isAuthentic: true,
      confidence: 90,
    }
  } catch (error) {
    console.error('[OCR] Verification failed:', error)
    throw error
  }
}

/**
 * Extract text from document
 */
export async function extractTextFromDocument(fileUrl: string): Promise<string> {
  try {
    // TODO: Implement AWS Textract
    console.log('[OCR] Extracting text from:', fileUrl)
    return ''
  } catch (error) {
    console.error('[OCR] Text extraction failed:', error)
    throw error
  }
}

/**
 * Detect document type from content
 */
export async function detectDocumentType(fileName: string, textContent?: string): Promise<string> {
  const lower = fileName.toLowerCase()

  // Try to detect from filename first
  if (lower.includes('tax')) return 'tax_certificate'
  if (lower.includes('statement')) return 'bank_statement'
  if (lower.includes('license')) return 'business_license'
  if (lower.includes('certificate')) return 'corporate_cert'
  if (lower.includes('contract')) return 'contract'
  if (lower.includes('pal')) return 'payroll'

  // Could also analyze textContent here
  return 'other'
}

/**
 * Extract key metrics from financial data
 */
export function extractKeyMetrics(data: ExtractedFinancialData) {
  return {
    revenue: data.revenue?.currentYear,
    revenueGrowth: data.growthRate,
    ebitda: data.ebitda?.currentYear,
    margin: data.margin,
    topCustomers: data.customers?.slice(0, 3),
    confidence: data.confidence,
  }
}

/**
 * Flag potential issues with financial data
 */
export function flagPotentialIssues(data: ExtractedFinancialData): string[] {
  const issues: string[] = []

  if (!data.revenue) {
    issues.push('Revenue data not found')
  }

  if (data.confidence && data.confidence < 70) {
    issues.push('Low OCR confidence - may need manual review')
  }

  if (data.margin && (data.margin < 0 || data.margin > 100)) {
    issues.push('Unusual margin percentage - verify manually')
  }

  if (data.customers && data.customers.length > 0) {
    const topThreeRevenue = data.customers.slice(0, 3).reduce((sum, c) => sum + c.percentage, 0)
    if (topThreeRevenue > 80) {
      issues.push('High customer concentration risk')
    }
  }

  return issues
}

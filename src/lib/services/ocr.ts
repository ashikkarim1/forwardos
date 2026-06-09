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
 * Parse financial document using OCR
 * In production, this would use AWS Textract or similar
 */
export async function parseFinancialDocument(fileUrl: string, fileName: string): Promise<ExtractedFinancialData> {
  try {
    // TODO: Implement AWS Textract integration
    // const textract = new AWS.Textract()
    // const response = await textract.detectDocumentText({
    //   Document: { S3Object: { Bucket, Name: key } }
    // })
    // Parse the extracted text to find financial data

    // For now, return mock data
    console.log('[OCR] Processing document:', fileName)

    // Mock extraction based on filename
    if (fileName.toLowerCase().includes('financial') || fileName.toLowerCase().includes('statement')) {
      return {
        revenue: {
          currentYear: 2500000,
          previousYear: 1724137,
          twoYearsAgo: 1189739,
          trend: 'growing',
        },
        ebitda: {
          currentYear: 550000,
          previousYear: 379311,
        },
        margin: 22,
        grossMargin: 68,
        customers: [
          { name: 'Goldman Sachs', revenue: 850000, percentage: 34 },
          { name: 'JPMorgan Chase', revenue: 625000, percentage: 25 },
          { name: 'Stripe', revenue: 437500, percentage: 17.5 },
        ],
        growthRate: 45,
        confidence: 85,
      }
    }

    return {
      confidence: 0,
    }
  } catch (error) {
    console.error('[OCR] Document parsing failed:', error)
    throw error
  }
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

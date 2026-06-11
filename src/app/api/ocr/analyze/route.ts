// Financial-document analysis. Extracts revenue/EBITDA/margins from a document
// (Textract when configured) or pasted text, and optionally cross-checks against
// seller-entered figures. Authenticated.
import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { isSameOrigin, rateLimit, clientIp } from '@/lib/rate-limit'
import { parseFinancialDocument, extractFinancialsFromText, compareFinancials } from '@/lib/services/ocr'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  if (!isSameOrigin(req)) return NextResponse.json({ error: 'Cross-origin request blocked' }, { status: 403 })
  if (!(await getSession())) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  const rl = rateLimit(`ocr:${clientIp(req)}`, 30, 60 * 60_000)
  if (!rl.ok) return NextResponse.json({ error: 'Too many requests' }, { status: 429 })

  try {
    const b = await req.json()
    let extracted
    let source = 'text'
    if (b.text && typeof b.text === 'string') {
      extracted = extractFinancialsFromText(b.text.slice(0, 200_000))
    } else if (b.fileUrl) {
      const r = await parseFinancialDocument(String(b.fileUrl), String(b.fileName || ''))
      extracted = r
      source = r.source || 'unknown'
    } else {
      return NextResponse.json({ error: 'Provide `text` or `fileUrl`.' }, { status: 400 })
    }

    const comparison = b.entered ? compareFinancials(b.entered, extracted) : undefined
    return NextResponse.json({ success: true, source, extracted, comparison })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Analysis failed' }, { status: 500 })
  }
}

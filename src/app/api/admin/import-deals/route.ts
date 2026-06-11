import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireRole } from '@/lib/auth'
import { runImport } from '@/lib/listing-import'

/**
 * POST /api/admin/import-deals  { csv: string }
 * Admin-only bulk import of listings from CSV text. Returns created/updated/skipped counts.
 */
export async function POST(request: NextRequest) {
  if (!(await requireRole(['ADMIN']))) {
    return NextResponse.json({ error: 'Forbidden — admin access required' }, { status: 403 })
  }
  try {
    const { csv } = await request.json()
    if (!csv || typeof csv !== 'string') {
      return NextResponse.json({ error: 'Provide CSV text in the "csv" field' }, { status: 400 })
    }
    if (csv.length > 5_000_000) {
      return NextResponse.json({ error: 'CSV too large (max ~5MB)' }, { status: 413 })
    }
    const result = await runImport(csv, prisma)
    return NextResponse.json({ success: true, ...result })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Import failed' }, { status: 500 })
  }
}

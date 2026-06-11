import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { matchDeals } from '@/lib/services/saved-search-service'

/**
 * GET /api/saved-searches/[id]/matches
 * Runs the saved search's filters and returns AI-ranked matching deals.
 */
export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const search = await prisma.savedSearch.findUnique({ where: { id: params.id } })
    if (!search) return NextResponse.json({ error: 'Saved search not found' }, { status: 404 })

    const matches = await matchDeals(JSON.parse(search.filters))
    return NextResponse.json({ matches, count: matches.length })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Match failed', matches: [] }, { status: 500 })
  }
}

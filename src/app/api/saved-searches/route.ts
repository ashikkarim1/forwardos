import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET  /api/saved-searches?userId=...   → list a user's saved searches
 * POST /api/saved-searches              → create { userId, name, filters, country?, alertFrequency? }
 */
export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId')
  if (!userId) return NextResponse.json({ error: 'userId is required' }, { status: 400 })

  try {
    const searches = await prisma.savedSearch.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({ savedSearches: searches.map((s) => ({ ...s, filters: JSON.parse(s.filters) })) })
  } catch (error) {
    // No DB — client falls back to localStorage
    return NextResponse.json({ savedSearches: [], source: 'none', note: (error as Error).message })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    if (!body.userId || !body.name || !body.filters) {
      return NextResponse.json({ error: 'userId, name and filters are required' }, { status: 400 })
    }

    const search = await prisma.savedSearch.create({
      data: {
        userId: body.userId,
        name: body.name,
        filters: typeof body.filters === 'string' ? body.filters : JSON.stringify(body.filters),
        country: body.country || null,
        alertEnabled: body.alertEnabled ?? true,
        alertFrequency: body.alertFrequency || 'DAILY',
      },
    })
    return NextResponse.json({ savedSearch: { ...search, filters: JSON.parse(search.filters) } }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Create failed' }, { status: 500 })
  }
}

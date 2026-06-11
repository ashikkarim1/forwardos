import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * PATCH  /api/saved-searches/[id]  → update alert settings/name { alertEnabled?, alertFrequency?, name? }
 * DELETE /api/saved-searches/[id]
 */
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const data: Record<string, unknown> = {}
    if (body.alertEnabled != null) data.alertEnabled = body.alertEnabled
    if (body.alertFrequency) data.alertFrequency = body.alertFrequency
    if (body.name) data.name = body.name
    if (body.filters) data.filters = typeof body.filters === 'string' ? body.filters : JSON.stringify(body.filters)

    const updated = await prisma.savedSearch.update({ where: { id: params.id }, data })
    return NextResponse.json({ savedSearch: { ...updated, filters: JSON.parse(updated.filters) } })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Update failed' }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.savedSearch.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Delete failed' }, { status: 500 })
  }
}

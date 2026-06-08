import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getSession } from '@/lib/auth'

const prisma = new PrismaClient()

// POST: Add note to deal pipeline
export async function POST(request: NextRequest, context: any) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: dealId } = context.params
    const { note, stage } = await request.json()

    if (!note) {
      return NextResponse.json({ error: 'Missing note' }, { status: 400 })
    }

    // Verify deal ownership
    const deal = await prisma.deal.findUnique({
      where: { id: dealId },
      select: { sellerId: true, pipeline: true },
    })

    if (!deal || deal.sellerId !== session.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get current notes
    const currentNotes = deal.pipeline?.internalNotes
      ? JSON.parse(deal.pipeline.internalNotes)
      : []

    // Add new note
    const newNote = {
      id: Math.random().toString(36),
      text: note,
      stage: stage || deal.pipeline?.currentStage,
      addedBy: session.userId,
      addedAt: new Date().toISOString(),
    }

    const updatedNotes = [newNote, ...currentNotes]

    // Update pipeline with new notes
    const updatedPipeline = await prisma.dealPipeline.update({
      where: { dealId },
      data: {
        internalNotes: JSON.stringify(updatedNotes),
      },
    })

    return NextResponse.json({
      pipeline: updatedPipeline,
      notes: updatedNotes,
      message: 'Note added successfully',
    })
  } catch (error) {
    console.error('Add note error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// GET: Get notes for a deal
export async function GET(request: NextRequest, context: any) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: dealId } = context.params

    const deal = await prisma.deal.findUnique({
      where: { id: dealId },
      include: { pipeline: true },
    })

    if (!deal || deal.sellerId !== session.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const notes = deal.pipeline?.internalNotes
      ? JSON.parse(deal.pipeline.internalNotes)
      : []

    return NextResponse.json({
      dealId,
      notes,
      count: notes.length,
    })
  } catch (error) {
    console.error('Fetch notes error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

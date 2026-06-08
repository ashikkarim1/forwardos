import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getSession } from '@/lib/auth'

const prisma = new PrismaClient()

// POST: Send message
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { receiverId, content, dealId } = await request.json()

    const message = await prisma.message.create({
      data: {
        senderId: session.userId,
        receiverId,
        content,
        dealId: dealId || null,
      },
      include: {
        sender: { select: { id: true, name: true, email: true } },
        receiver: { select: { id: true, name: true, email: true } },
      },
    })

    return NextResponse.json({ message }, { status: 201 })
  } catch (error) {
    console.error('Send message error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// GET: List conversations
export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const conversationWith = searchParams.get('with')

    let where: any = {
      OR: [
        { senderId: session.userId },
        { receiverId: session.userId },
      ],
    }

    if (conversationWith) {
      where = {
        ...where,
        OR: [
          { senderId: session.userId, receiverId: conversationWith },
          { senderId: conversationWith, receiverId: session.userId },
        ],
      }
    }

    const messages = await prisma.message.findMany({
      where,
      include: {
        sender: { select: { id: true, name: true, email: true } },
        receiver: { select: { id: true, name: true, email: true } },
        deal: { select: { id: true, title: true } },
      },
      orderBy: { createdAt: 'asc' },
      take: 100,
    })

    return NextResponse.json({ messages, count: messages.length })
  } catch (error) {
    console.error('Fetch messages error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

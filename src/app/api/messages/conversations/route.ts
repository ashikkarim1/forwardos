import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getSession } from '@/lib/auth'

const prisma = new PrismaClient()

// GET: List conversations for current user
export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const dealId = searchParams.get('dealId')

    let where: any = {
      OR: [
        { senderId: session.userId },
        { receiverId: session.userId },
      ],
    }

    if (dealId) {
      where.dealId = dealId
    }

    // Get all messages for this user
    const messages = await prisma.message.findMany({
      where,
      include: {
        sender: { select: { id: true, name: true, email: true } },
        receiver: { select: { id: true, name: true, email: true } },
        deal: { select: { id: true, title: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    // Group by conversation (opposite user)
    const conversations = new Map()

    messages.forEach(msg => {
      const otherUserId = msg.senderId === session.userId ? msg.receiverId : msg.senderId
      const key = `${dealId || 'general'}_${otherUserId}`

      if (!conversations.has(key)) {
        const otherUser = msg.senderId === session.userId ? msg.receiver : msg.sender
        conversations.set(key, {
          userId: otherUserId,
          name: otherUser.name,
          email: otherUser.email,
          dealId: msg.dealId,
          dealTitle: msg.deal?.title,
          lastMessage: msg.content,
          lastMessageAt: msg.createdAt,
          unreadCount: 0,
        })
      }

      // Count unread messages
      if (msg.receiverId === session.userId && !msg.readAt) {
        conversations.get(key).unreadCount += 1
      }
    })

    const conversationList = Array.from(conversations.values()).sort(
      (a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
    )

    return NextResponse.json({
      conversations: conversationList,
      count: conversationList.length,
    })
  } catch (error) {
    console.error('Fetch conversations error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

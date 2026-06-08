import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getSession } from '@/lib/auth'

const prisma = new PrismaClient()

// GET: Get conversation with specific user
export async function GET(request: NextRequest, context: any) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { userId } = context.params
    const { searchParams } = new URL(request.url)
    const dealId = searchParams.get('dealId')

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
    }

    let where: any = {
      OR: [
        { senderId: session.userId, receiverId: userId },
        { senderId: userId, receiverId: session.userId },
      ],
    }

    if (dealId) {
      where.dealId = dealId
    }

    const messages = await prisma.message.findMany({
      where,
      include: {
        sender: { select: { id: true, name: true, email: true } },
        receiver: { select: { id: true, name: true, email: true } },
        deal: { select: { id: true, title: true } },
      },
      orderBy: { createdAt: 'asc' },
    })

    // Mark messages as read
    await prisma.message.updateMany({
      where: {
        AND: [
          {
            OR: where.OR,
          },
          { receiverId: session.userId },
          { readAt: null },
        ],
      },
      data: {
        readAt: new Date(),
      },
    })

    return NextResponse.json({
      messages,
      count: messages.length,
    })
  } catch (error) {
    console.error('Fetch conversation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

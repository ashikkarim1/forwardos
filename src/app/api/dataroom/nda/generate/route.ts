import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getSession } from '@/lib/auth'

const prisma = new PrismaClient()

// POST: Generate NDA for data room access
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { requestId } = await request.json()

    if (!requestId) {
      return NextResponse.json({ error: 'Missing requestId' }, { status: 400 })
    }

    // Get the request details
    const dataRoomRequest = await prisma.dataRoomRequest.findUnique({
      where: { id: requestId },
      include: {
        deal: {
          select: {
            id: true,
            title: true,
            seller: { select: { name: true, email: true } },
          },
        },
        buyer: { select: { name: true, email: true } },
      },
    })

    if (!dataRoomRequest) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 })
    }

    // Generate NDA template
    const today = new Date()
    const expiryDate = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000) // 7 days

    const ndaContent = `
NON-DISCLOSURE AGREEMENT (NDA)
Forward OS Confidential Data Room Access

This Non-Disclosure Agreement ("NDA") is entered into as of ${today.toLocaleDateString()}
between:

SELLER: ${dataRoomRequest.deal.seller.name} (${dataRoomRequest.deal.seller.email})
BUYER: ${dataRoomRequest.buyer.name} (${dataRoomRequest.buyer.email})
DEAL: ${dataRoomRequest.deal.title}

1. CONFIDENTIAL INFORMATION
The Buyer agrees to maintain strict confidentiality of all documents, financial information,
operational data, and strategic information provided in the data room.

2. PERMITTED USE
Information may be used solely for the purpose of evaluating a potential business transaction
related to ${dataRoomRequest.deal.title}.

3. RESTRICTIONS
- No disclosure to third parties without written consent
- No copying or reproduction of documents
- No use for competitive purposes
- Return or destruction of all materials upon request

4. TERM
This NDA is valid for 7 days from the date of signing, expiring on ${expiryDate.toLocaleDateString()}.

5. GOVERNING LAW
This agreement is governed by UAE law.

6. ACKNOWLEDGMENT
By signing below, Buyer acknowledges receipt and understanding of this NDA.

Buyer Signature: _______________________
Date: _______________________

Seller Signature: _______________________
Date: _______________________
    `.trim()

    // Create NDA record
    const nda = await prisma.nda.create({
      data: {
        requestId,
        content: ndaContent,
        status: 'PENDING_SIGNATURE',
        expiresAt: expiryDate,
        createdAt: today,
      },
    })

    return NextResponse.json(
      {
        nda,
        message: 'NDA generated successfully',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Generate NDA error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

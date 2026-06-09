/**
 * Data Room Service
 * Manages data rooms for deals (automatically created on approval)
 */

import { prisma } from '@/lib/prisma'

interface CreateDataRoomOptions {
  dealId: string
  sellerId: string
  title: string
  description?: string
  accessLevel?: 'INITIAL_INFO' | 'FINANCIAL_DATA' | 'FULL_DATA_ROOM'
}

/**
 * Automatically create a data room when a deal is approved
 */
export async function createDataRoom(options: CreateDataRoomOptions) {
  try {
    const dataRoom = await prisma.dataRoom.create({
      data: {
        dealId: options.dealId,
        sellerId: options.sellerId,
        title: options.title,
        description: options.description,
        accessLevel: options.accessLevel || 'INITIAL_INFO',
        ndaRequired: true,
        passwordProtected: false,
      },
    })

    console.log('[DATA ROOM] Created:', {
      dataRoomId: dataRoom.id,
      dealId: options.dealId,
      title: options.title,
    })

    return dataRoom
  } catch (error) {
    console.error('[DATA ROOM] Creation failed:', error)
    throw error
  }
}

/**
 * Grant access to a buyer for a data room
 */
export async function grantDataRoomAccess(options: {
  dataRoomId: string
  buyerId: string
  accessLevel: 'TEASER' | 'INITIAL_INFO' | 'FINANCIAL_DATA' | 'FULL_DATA_ROOM'
}) {
  try {
    const access = await prisma.dataRoomAccess.upsert({
      where: {
        dataRoomId_userId: {
          dataRoomId: options.dataRoomId,
          userId: options.buyerId,
        },
      },
      create: {
        dataRoomId: options.dataRoomId,
        userId: options.buyerId,
        accessLevel: options.accessLevel,
        approvedAt: new Date(),
      },
      update: {
        accessLevel: options.accessLevel,
        approvedAt: new Date(),
      },
    })

    console.log('[DATA ROOM ACCESS] Granted:', {
      dataRoomId: options.dataRoomId,
      buyerId: options.buyerId,
      accessLevel: options.accessLevel,
    })

    return access
  } catch (error) {
    console.error('[DATA ROOM ACCESS] Grant failed:', error)
    throw error
  }
}

/**
 * Revoke access to a data room
 */
export async function revokeDataRoomAccess(dataRoomId: string, buyerId: string) {
  try {
    await prisma.dataRoomAccess.delete({
      where: {
        dataRoomId_userId: {
          dataRoomId,
          userId: buyerId,
        },
      },
    })

    console.log('[DATA ROOM ACCESS] Revoked:', {
      dataRoomId,
      buyerId,
    })
  } catch (error) {
    console.error('[DATA ROOM ACCESS] Revoke failed:', error)
    throw error
  }
}

/**
 * Upload document to data room
 */
export async function uploadDataRoomDocument(options: {
  dataRoomId: string
  dealId: string
  title: string
  documentUrl: string
  documentType: string
  fileSize: bigint
}) {
  try {
    const document = await prisma.dealDocument.create({
      data: {
        dealId: options.dealId,
        title: options.title,
        documentUrl: options.documentUrl,
        documentType: options.documentType,
        fileSize: options.fileSize,
      },
    })

    // Update data room document count
    const dataRoom = await prisma.dataRoom.findUnique({
      where: { id: options.dataRoomId },
    })

    if (dataRoom) {
      await prisma.dataRoom.update({
        where: { id: options.dataRoomId },
        data: {
          documentsCount: (dataRoom.documentsCount || 0) + 1,
        },
      })
    }

    console.log('[DATA ROOM DOCUMENT] Uploaded:', {
      dataRoomId: options.dataRoomId,
      documentId: document.id,
      title: options.title,
    })

    return document
  } catch (error) {
    console.error('[DATA ROOM DOCUMENT] Upload failed:', error)
    throw error
  }
}

/**
 * Request data room access from seller
 */
export async function requestDataRoomAccess(options: {
  dataRoomId: string
  buyerId: string
  buyerName: string
  buyerEmail: string
  message?: string
}) {
  try {
    // TODO: Send email to seller requesting approval
    // Send notification to buyer that request was sent

    console.log('[DATA ROOM REQUEST] Access requested:', {
      dataRoomId: options.dataRoomId,
      buyerId: options.buyerId,
      buyerEmail: options.buyerEmail,
    })

    return { success: true }
  } catch (error) {
    console.error('[DATA ROOM REQUEST] Failed:', error)
    throw error
  }
}

/**
 * Get data room access logs
 */
export async function getAccessLogs(dataRoomId: string) {
  try {
    const logs = await prisma.dataRoomAccess.findMany({
      where: { dataRoomId },
      include: { user: true },
    })

    return logs
  } catch (error) {
    console.error('[DATA ROOM LOGS] Fetch failed:', error)
    throw error
  }
}

/**
 * Require NDA signature before access
 */
export async function requireNDAsignature(options: {
  dataRoomId: string
  buyerId: string
  ndaText: string
}) {
  try {
    // TODO: Generate NDA document and track signatures
    console.log('[DATA ROOM NDA] Required:', {
      dataRoomId: options.dataRoomId,
      buyerId: options.buyerId,
    })

    return { success: true }
  } catch (error) {
    console.error('[DATA ROOM NDA] Failed:', error)
    throw error
  }
}

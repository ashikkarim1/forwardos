/**
 * Data Room Service
 * Handles data room operations: documents, access, analytics
 *
 * Note: Mock implementation for development
 * Production uses @vercel/blob with BLOB_READ_WRITE_TOKEN
 */

// Mock Vercel Blob for development
const mockBlobStore: Map<string, { pathname: string; url: string; size: number; contentType: string; uploadedAt: Date }> = new Map()

async function mockPut(pathname: string, file: File, options: any) {
  const url = `https://blob.vercel.sh/${pathname}`
  mockBlobStore.set(pathname, {
    pathname,
    url,
    size: file.size,
    contentType: file.type,
    uploadedAt: new Date(),
  })
  return { url }
}

async function mockList(options: any) {
  const prefix = options.prefix
  const blobs = Array.from(mockBlobStore.entries())
    .filter(([pathname]) => pathname.startsWith(prefix))
    .map(([pathname, data]) => ({
      pathname,
      url: data.url,
      size: data.size,
      contentType: data.contentType,
      uploadedAt: data.uploadedAt.toISOString(),
    }))
  return { blobs }
}

async function mockDel(url: string) {
  const pathname = Array.from(mockBlobStore.keys()).find(
    (key) => mockBlobStore.get(key)?.url === url
  )
  if (pathname) {
    mockBlobStore.delete(pathname)
  }
}

export interface DataRoom {
  id: string
  dealId: string
  name: string
  description?: string
  createdBy: string
  createdAt: Date
  isActive: boolean
  settings: {
    allowDownloads: boolean
    allowExports: boolean
    watermark: boolean
    screenshotDetection: boolean
  }
}

export interface DataRoomDocument {
  id: string
  dataRoomId: string
  fileName: string
  fileType: string
  fileSize: number
  blobUrl: string
  folderPath: string
  uploadedBy: string
  uploadedAt: Date
  isPinned: boolean
  viewCount: number
}

export interface DataRoomAccess {
  id: string
  dataRoomId: string
  userId: string
  accessLevel: 'view_only' | 'download' | 'export' | 'admin'
  grantedBy: string
  approvedAt?: Date
  expiresAt?: Date
  isActive: boolean
  reason?: string
}

export interface DataRoomActivity {
  id: string
  dataRoomId: string
  documentId?: string
  userId: string
  action: 'view' | 'download' | 'request' | 'approve' | 'revoke'
  durationSeconds?: number
  ipAddress?: string
  timestamp: Date
}

/**
 * Upload document to data room
 */
export async function uploadDocument(
  dataRoomId: string,
  file: File,
  folderPath: string = 'root',
  uploadedBy: string
): Promise<DataRoomDocument> {
  try {
    const fileName = file.name
    const fileType = file.type
    const fileSize = file.size

    // Upload to Vercel Blob (or mock in dev)
    const blob = await mockPut(`data-rooms/${dataRoomId}/${Date.now()}-${fileName}`, file, {
      access: 'private',
      addRandomSuffix: false,
    })

    // Return document metadata (in production, save to DB)
    return {
      id: `doc_${Date.now()}`,
      dataRoomId,
      fileName,
      fileType,
      fileSize,
      blobUrl: blob.url,
      folderPath,
      uploadedBy,
      uploadedAt: new Date(),
      isPinned: false,
      viewCount: 0,
    }
  } catch (error) {
    console.error('Document upload failed:', error)
    throw new Error('Failed to upload document')
  }
}

/**
 * List documents in data room
 */
export async function listDocuments(dataRoomId: string): Promise<DataRoomDocument[]> {
  try {
    const blobs = await mockList({
      prefix: `data-rooms/${dataRoomId}`,
    })

    return blobs.blobs.map((blob) => ({
      id: blob.pathname,
      dataRoomId,
      fileName: blob.pathname.split('/').pop() || '',
      fileType: blob.contentType || 'unknown',
      fileSize: blob.size,
      blobUrl: blob.url,
      folderPath: 'root',
      uploadedBy: 'system',
      uploadedAt: new Date(blob.uploadedAt),
      isPinned: false,
      viewCount: 0,
    }))
  } catch (error) {
    console.error('Failed to list documents:', error)
    throw new Error('Failed to list documents')
  }
}

/**
 * Delete document
 */
export async function deleteDocument(blobUrl: string): Promise<void> {
  try {
    await mockDel(blobUrl)
  } catch (error) {
    console.error('Document deletion failed:', error)
    throw new Error('Failed to delete document')
  }
}

/**
 * Record activity (view, download, etc.)
 */
export async function recordActivity(
  dataRoomId: string,
  userId: string,
  action: DataRoomActivity['action'],
  documentId?: string,
  durationSeconds?: number,
  ipAddress?: string
): Promise<DataRoomActivity> {
  // In production, save to database
  return {
    id: `act_${Date.now()}`,
    dataRoomId,
    documentId,
    userId,
    action,
    durationSeconds,
    ipAddress,
    timestamp: new Date(),
  }
}

/**
 * Get analytics for data room
 */
export async function getAnalytics(dataRoomId: string) {
  // In production, query from database
  return {
    totalViews: 0,
    totalDownloads: 0,
    totalDocuments: 0,
    activeViewers: 0,
    mostViewedDocs: [],
    recentActivity: [],
  }
}

export default {
  uploadDocument,
  listDocuments,
  deleteDocument,
  recordActivity,
  getAnalytics,
}

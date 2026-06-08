import { NextRequest, NextResponse } from 'next/server'

interface DocumentMeta {
  documentId: string
  userId: string
  documentType: string
  fileName: string
  fileSize: number
  uploadedAt: string
  status: 'pending_review' | 'approved' | 'rejected'
  verificationScore?: number
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const userId = formData.get('userId') as string
    const documentType = formData.get('documentType') as string

    if (!file || !userId || !documentType) {
      return NextResponse.json(
        { error: 'Missing required fields: file, userId, documentType' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only PDF, JPG, and PNG are allowed.' },
        { status: 400 }
      )
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit' },
        { status: 400 }
      )
    }

    // Mock document upload - in production, upload to S3/Cloud Storage
    const documentId = `DOC-${userId}-${Date.now()}`

    const documentMeta: DocumentMeta = {
      documentId,
      userId,
      documentType,
      fileName: file.name,
      fileSize: file.size,
      uploadedAt: new Date().toISOString(),
      status: 'pending_review',
      verificationScore: Math.floor(Math.random() * 30) + 70, // Mock score 70-100
    }

    console.log('Document uploaded:', {
      documentId,
      userId,
      documentType,
      fileName: file.name,
      fileSize: file.size,
      uploadedAt: new Date().toISOString(),
    })

    return NextResponse.json(
      {
        success: true,
        document: documentMeta,
        message: 'Document uploaded successfully. Under review.',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Document upload error:', error)
    return NextResponse.json({ error: 'Failed to upload document' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId parameter' },
        { status: 400 }
      )
    }

    // Mock document retrieval
    const mockDocuments: DocumentMeta[] = [
      {
        documentId: 'DOC-001',
        userId,
        documentType: 'government_id',
        fileName: 'passport_scan.pdf',
        fileSize: 2048576,
        uploadedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'approved',
        verificationScore: 98,
      },
      {
        documentId: 'DOC-002',
        userId,
        documentType: 'address_proof',
        fileName: 'utility_bill.pdf',
        fileSize: 1024576,
        uploadedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'approved',
        verificationScore: 95,
      },
      {
        documentId: 'DOC-003',
        userId,
        documentType: 'business_registration',
        fileName: 'incorporation_certificate.pdf',
        fileSize: 3145728,
        uploadedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'approved',
        verificationScore: 92,
      },
    ]

    return NextResponse.json(
      {
        success: true,
        documents: mockDocuments,
        total: mockDocuments.length,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Document retrieval error:', error)
    return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { uploadDocument, listDocuments } from '@/lib/services/data-room-service'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const dataRoomId = formData.get('dataRoomId') as string
    const uploadedBy = formData.get('uploadedBy') as string || 'system'

    if (!file || !dataRoomId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const document = await uploadDocument(dataRoomId, file, 'root', uploadedBy)
    return NextResponse.json({ document, success: true }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const dataRoomId = request.nextUrl.searchParams.get('dataRoomId')
    if (!dataRoomId) {
      return NextResponse.json({ error: 'Missing dataRoomId' }, { status: 400 })
    }

    const documents = await listDocuments(dataRoomId)
    return NextResponse.json({ documents, success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to list documents' }, { status: 500 })
  }
}

// Authenticated file upload — accepts multipart/form-data and persists via the
// storage service (Vercel Blob in prod, local fs in dev). Returns the file URL.
import { NextRequest, NextResponse } from 'next/server'
import { uploadFile } from '@/lib/services/storage'
import { getSession } from '@/lib/auth'
import { isSameOrigin, rateLimit, clientIp } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'

const MAX_BYTES = 15 * 1024 * 1024 // 15MB
const ALLOWED = new Set([
  'image/jpeg', 'image/png', 'image/webp', 'image/gif',
  'application/pdf',
])

export async function POST(req: NextRequest) {
  if (!isSameOrigin(req)) return NextResponse.json({ error: 'Cross-origin request blocked' }, { status: 403 })
  const rl = rateLimit(`upload:${clientIp(req)}`, 60, 60 * 60_000)
  if (!rl.ok) return NextResponse.json({ error: 'Too many uploads' }, { status: 429 })

  try {
    const form = await req.formData()
    const file = form.get('file') as File | null
    const bucket = (form.get('bucket') as string) || 'documents'
    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    if (file.size > MAX_BYTES) return NextResponse.json({ error: 'File too large (max 15MB)' }, { status: 413 })
    if (file.type && !ALLOWED.has(file.type)) {
      return NextResponse.json({ error: 'Only images and PDF are allowed' }, { status: 415 })
    }

    // Namespace uploads by the signed-in user when present.
    const session = await getSession().catch(() => null)
    const folder = session?.userId ? `u/${session.userId}` : 'public'
    const validBucket = ['photos', 'documents', 'kyc'].includes(bucket) ? (bucket as 'photos' | 'documents' | 'kyc') : 'documents'

    const result = await uploadFile({ file, path: folder, bucket: validBucket })
    return NextResponse.json({ success: true, url: result.url, key: result.key, name: file.name })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Upload failed' }, { status: 500 })
  }
}

/**
 * File Storage Service.
 *
 * Persists uploads for real:
 *  - Production: Vercel Blob when BLOB_READ_WRITE_TOKEN is set.
 *  - Dev/local: writes to public/uploads so files actually persist without any
 *    cloud account (Vercel's filesystem is read-only, so Blob is used there).
 *
 * Swap to S3 later by changing only this file.
 */
import { promises as fs } from 'fs'
import path from 'path'

interface UploadOptions {
  file: File
  path: string
  bucket?: 'photos' | 'documents' | 'kyc'
}

interface UploadResult {
  url: string
  key: string
  bucket: string
}

function safeName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(-120)
}

export async function uploadFile(options: UploadOptions): Promise<UploadResult> {
  const bucket = options.bucket || 'documents'
  const key = `${bucket}/${options.path}/${Date.now()}-${safeName(options.file.name)}`.replace(/\/+/g, '/')

  // 1) Vercel Blob (production)
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { put } = await import('@vercel/blob')
    const blob = await put(key, options.file, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
      addRandomSuffix: false,
    })
    return { url: blob.url, key, bucket: getBucketName(bucket) }
  }

  // 2) On Vercel without a Blob token there's no working path — Vercel's
  // filesystem is read-only. Throw a diagnostic error instead of silently
  // failing through to the local-fs branch (which would say only
  // "Failed to upload file" and waste someone's afternoon).
  if (process.env.VERCEL === '1') {
    throw new Error(
      'Photo storage not configured. Connect a Vercel Blob store to this ' +
      'project so BLOB_READ_WRITE_TOKEN is available. ' +
      'Dashboard → Project → Storage → Connect Store → choose forwardos-uploads.'
    )
  }

  // 3) Local filesystem (dev) — genuinely persists under /public/uploads
  try {
    const buf = Buffer.from(await options.file.arrayBuffer())
    const dest = path.join(process.cwd(), 'public', 'uploads', key)
    await fs.mkdir(path.dirname(dest), { recursive: true })
    await fs.writeFile(dest, buf)
    return { url: `/uploads/${key}`, key, bucket: getBucketName(bucket) }
  } catch (error) {
    console.error('Local file upload failed:', error)
    throw new Error('Failed to upload file')
  }
}

/** Protected files: Blob URLs are already accessible; local files are served from /public. */
export async function getPresignedUrl(key: string): Promise<string> {
  if (key.startsWith('http')) return key
  return `/uploads/${key}`
}

export async function deleteFile(key: string): Promise<void> {
  try {
    if (process.env.BLOB_READ_WRITE_TOKEN && key.startsWith('http')) {
      const { del } = await import('@vercel/blob')
      await del(key, { token: process.env.BLOB_READ_WRITE_TOKEN })
      return
    }
    await fs.unlink(path.join(process.cwd(), 'public', 'uploads', key)).catch(() => {})
  } catch (error) {
    console.error('File deletion failed:', error)
  }
}

function getBucketName(bucket: string): string {
  const bucketMap = {
    photos: process.env.AWS_S3_BUCKET_PHOTOS || 'forward-os-listing-photos',
    documents: process.env.AWS_S3_BUCKET_DOCUMENTS || 'forward-os-documents',
    kyc: process.env.AWS_S3_BUCKET_KYC || 'forward-os-kyc-documents',
  }
  return bucketMap[bucket as keyof typeof bucketMap] || 'forward-os-documents'
}

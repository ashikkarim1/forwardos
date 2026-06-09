/**
 * Storage Service - AWS S3 Integration
 * Handles KYC document uploads, photo storage, and CDN delivery
 */

import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  PutObjectAclCommand,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import crypto from 'crypto'

interface UploadResult {
  success: boolean
  filePath: string
  publicUrl: string
  metadata: {
    fileName: string
    fileSize: number
    contentType: string
    uploadedAt: string
  }
}

interface SignedUrlResult {
  url: string
  expiresIn: number
}

class StorageService {
  private s3Client: S3Client
  private kycBucket: string
  private photoBucket: string
  private publicUrl: string

  constructor() {
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    })

    this.kycBucket = process.env.AWS_S3_BUCKET_KYC!
    this.photoBucket = process.env.AWS_S3_BUCKET_PHOTOS!
    this.publicUrl = process.env.AWS_S3_PUBLIC_URL!
  }

  /**
   * Upload KYC Document
   * Stores in encrypted, private S3 bucket with 7-year retention
   */
  async uploadKYCDocument(
    file: Buffer,
    userId: string,
    documentType: string,
    fileName: string,
    contentType: string
  ): Promise<UploadResult> {
    try {
      // Generate secure path: kyc/{userId}/{year}/{month}/{hash}
      const now = new Date()
      const year = now.getFullYear()
      const month = String(now.getMonth() + 1).padStart(2, '0')
      const hash = crypto.randomBytes(16).toString('hex')
      const fileExtension = fileName.split('.').pop()

      const filePath = `kyc/${userId}/${year}/${month}/${hash}.${fileExtension}`

      // Upload to S3 with encryption
      const command = new PutObjectCommand({
        Bucket: this.kycBucket,
        Key: filePath,
        Body: file,
        ContentType: contentType,
        ServerSideEncryption: 'AES256',
        Metadata: {
          userId,
          documentType,
          uploadedAt: now.toISOString(),
          originalFileName: Buffer.from(fileName).toString('base64'),
        },
        // Lifecycle: Delete after 7 years (auto-handled by bucket policy)
        StorageClass: 'STANDARD_IA', // Infrequent access cheaper storage
      })

      await this.s3Client.send(command)

      console.log(`[S3] KYC document uploaded: ${filePath}`)

      return {
        success: true,
        filePath,
        publicUrl: '', // KYC docs are not public
        metadata: {
          fileName,
          fileSize: file.length,
          contentType,
          uploadedAt: now.toISOString(),
        },
      }
    } catch (error) {
      console.error('[S3] Error uploading KYC document:', error)
      throw new Error('Failed to upload KYC document')
    }
  }

  /**
   * Upload Listing Photo
   * Public CDN delivery with optimization
   */
  async uploadListingPhoto(
    file: Buffer,
    listingId: string,
    displayOrder: number,
    fileName: string,
    contentType: string
  ): Promise<UploadResult> {
    try {
      const now = new Date()
      const hash = crypto.randomBytes(8).toString('hex')
      const fileExtension = fileName.split('.').pop()

      // Path: photos/{listingId}/{displayOrder}-{hash}.{ext}
      const filePath = `photos/${listingId}/${displayOrder}-${hash}.${fileExtension}`

      const command = new PutObjectCommand({
        Bucket: this.photoBucket,
        Key: filePath,
        Body: file,
        ContentType: contentType,
        ServerSideEncryption: 'AES256',
        CacheControl: 'public, max-age=31536000', // 1 year cache
        Metadata: {
          listingId,
          displayOrder: String(displayOrder),
          uploadedAt: now.toISOString(),
        },
      })

      await this.s3Client.send(command)

      // Generate public CDN URL
      const publicUrl = `${this.publicUrl}/${filePath}`

      console.log(`[S3] Photo uploaded: ${filePath}`)

      return {
        success: true,
        filePath,
        publicUrl,
        metadata: {
          fileName,
          fileSize: file.length,
          contentType,
          uploadedAt: now.toISOString(),
        },
      }
    } catch (error) {
      console.error('[S3] Error uploading photo:', error)
      throw new Error('Failed to upload photo')
    }
  }

  /**
   * Generate Signed URL for KYC Document Access
   * Only for authorized users (seller, broker, Forward OS staff)
   */
  async getSignedKYCUrl(filePath: string, expiresInSeconds: number = 3600): Promise<SignedUrlResult> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.kycBucket,
        Key: filePath,
      })

      const url = await getSignedUrl(this.s3Client, command, { expiresIn: expiresInSeconds })

      return {
        url,
        expiresIn: expiresInSeconds,
      }
    } catch (error) {
      console.error('[S3] Error generating signed URL:', error)
      throw new Error('Failed to generate signed URL')
    }
  }

  /**
   * Delete KYC Document (after retention period or seller request)
   */
  async deleteKYCDocument(filePath: string): Promise<boolean> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.kycBucket,
        Key: filePath,
      })

      await this.s3Client.send(command)

      console.log(`[S3] KYC document deleted: ${filePath}`)
      return true
    } catch (error) {
      console.error('[S3] Error deleting KYC document:', error)
      throw new Error('Failed to delete KYC document')
    }
  }

  /**
   * Delete Listing Photo
   */
  async deleteListingPhoto(filePath: string): Promise<boolean> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.photoBucket,
        Key: filePath,
      })

      await this.s3Client.send(command)

      console.log(`[S3] Photo deleted: ${filePath}`)
      return true
    } catch (error) {
      console.error('[S3] Error deleting photo:', error)
      throw new Error('Failed to delete photo')
    }
  }
}

export const storageService = new StorageService()
export type { UploadResult, SignedUrlResult }

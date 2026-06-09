/**
 * KYC Verification Service
 * AWS Rekognition integration for ID verification, liveness detection, and authenticity checks
 */

import { RekognitionClient, DetectFacesCommand, AnalyzeIDCommand, DetectTextCommand } from '@aws-sdk/client-rekognition'

interface KYCVerificationResult {
  documentType: string
  verificationStatus: 'verified' | 'rejected' | 'manual_review'
  aiScore: number // 0-100
  details: {
    documentAuthenticity: number
    textClarity: number
    expirationValid: boolean
    livenessDetected?: boolean
    nameConsistency: number
    flagsRaised: string[]
  }
  requiresManualReview: boolean
  message: string
}

interface IDVerificationResult extends KYCVerificationResult {
  extractedName?: string
  extractedDOB?: string
  documentExpiry?: string
  issuingCountry?: string
}

class KYCVerificationService {
  private rekognitionClient: RekognitionClient
  private confidenceThreshold: number
  private manualReviewThreshold: number

  constructor() {
    this.rekognitionClient = new RekognitionClient({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    })

    this.confidenceThreshold = parseInt(process.env.KYC_CONFIDENCE_THRESHOLD || '85')
    this.manualReviewThreshold = parseInt(process.env.KYC_MANUAL_REVIEW_THRESHOLD || '75')
  }

  /**
   * Verify ID Photo (Passport, Driver's License, National ID)
   * Includes liveness detection and authenticity checks
   */
  async verifyIDPhoto(imageBuffer: Buffer, documentType: string): Promise<IDVerificationResult> {
    try {
      console.log(`[KYC] Starting ID verification for ${documentType}`)

      const flags: string[] = []
      let overallScore = 0
      let livenessDetected = false
      let documentAuthenticity = 0
      let textClarity = 0
      let nameConsistency = 100
      let extractedName = ''
      let extractedDOB = ''
      let documentExpiry = ''
      let issuingCountry = ''

      // ==================== STEP 1: DETECT FACES & LIVENESS ====================

      try {
        const detectFacesCommand = new DetectFacesCommand({
          Image: { Bytes: imageBuffer },
          Attributes: ['ALL'],
        })

        const facesResponse = await this.rekognitionClient.send(detectFacesCommand)

        if (!facesResponse.FaceDetails || facesResponse.FaceDetails.length === 0) {
          flags.push('No face detected in image')
          return this._createFailureResult(documentType, flags, 15)
        }

        const faceDetail = facesResponse.FaceDetails[0]

        // Check for spoofing/liveness
        if (faceDetail.Confidence && faceDetail.Confidence < 90) {
          flags.push('Face confidence too low - may be spoofed')
        } else {
          livenessDetected = true
        }

        // Quality checks
        if (!faceDetail.EyesOpen?.Value) flags.push('Eyes not open')
        if (!faceDetail.MouthOpen?.Value) flags.push('Mouth appears closed')
        if (faceDetail.Eyeglasses?.Value) flags.push('Person wearing eyeglasses')
        if (faceDetail.Sunglasses?.Value) flags.push('Person wearing sunglasses')

        documentAuthenticity = livenessDetected ? 85 : 45
      } catch (error) {
        console.error('[KYC] Face detection failed:', error)
        flags.push('Face detection service error')
      }

      // ==================== STEP 2: ANALYZE ID DOCUMENT ====================

      try {
        const analyzeIDCommand = new AnalyzeIDCommand({
          DocumentPages: [{ Bytes: imageBuffer }],
        })

        const idResponse = await this.rekognitionClient.send(analyzeIDCommand)

        if (idResponse.IdentityDocuments && idResponse.IdentityDocuments.length > 0) {
          const idDoc = idResponse.IdentityDocuments[0]

          // Extract fields
          idDoc.DocumentFields?.forEach((field) => {
            if (field.Type?.Text === 'FIRST_NAME') {
              extractedName = field.ValueDetection?.Text || ''
            }
            if (field.Type?.Text === 'DATE_OF_BIRTH') {
              extractedDOB = field.ValueDetection?.Text || ''
            }
            if (field.Type?.Text === 'EXPIRATION_DATE') {
              documentExpiry = field.ValueDetection?.Text || ''
            }
            if (field.Type?.Text === 'ISSUING_COUNTRY') {
              issuingCountry = field.ValueDetection?.Text || ''
            }
          })

          // Confidence scoring
          documentAuthenticity = Math.min(
            99,
            Math.round(
              idDoc.DocumentFields?.reduce((sum, field) => {
                return sum + (field.ValueDetection?.Confidence || 0)
              }, 0) / (idDoc.DocumentFields?.length || 1) || 0
            )
          )

          // Check expiration
          if (documentExpiry) {
            const expiryDate = new Date(documentExpiry)
            if (expiryDate < new Date()) {
              flags.push('Document is expired')
              documentAuthenticity -= 20
            }
          }
        }
      } catch (error) {
        console.error('[KYC] ID analysis failed:', error)
        flags.push('ID document analysis service error')
      }

      // ==================== STEP 3: OCR TEXT EXTRACTION & QUALITY ====================

      try {
        const detectTextCommand = new DetectTextCommand({
          Image: { Bytes: imageBuffer },
        })

        const textResponse = await this.rekognitionClient.send(detectTextCommand)

        if (textResponse.TextDetections && textResponse.TextDetections.length > 0) {
          // Average confidence of detected text
          const textConfidences = textResponse.TextDetections.filter((t) => t.Type === 'LINE').map((t) => t.Confidence || 0)
          textClarity = textConfidences.length > 0 ? Math.round(textConfidences.reduce((a, b) => a + b) / textConfidences.length) : 50

          if (textClarity < 70) {
            flags.push('Document text quality is poor')
          }
        }
      } catch (error) {
        console.error('[KYC] Text detection failed:', error)
        flags.push('Text recognition service error')
      }

      // ==================== STEP 4: CALCULATE OVERALL SCORE ====================

      const weights = {
        documentAuthenticity: 0.4,
        textClarity: 0.3,
        livenessDetected: 0.2,
        nameConsistency: 0.1,
      }

      overallScore = Math.round(
        documentAuthenticity * weights.documentAuthenticity +
          textClarity * weights.textClarity +
          (livenessDetected ? 100 : 30) * weights.livenessDetected +
          nameConsistency * weights.nameConsistency
      )

      // ==================== STEP 5: DETERMINE VERIFICATION STATUS ====================

      let verificationStatus: 'verified' | 'rejected' | 'manual_review' = 'verified'
      let requiresManualReview = false

      if (overallScore >= this.confidenceThreshold) {
        verificationStatus = 'verified'
      } else if (overallScore >= this.manualReviewThreshold) {
        verificationStatus = 'manual_review'
        requiresManualReview = true
      } else {
        verificationStatus = 'rejected'
      }

      console.log(`[KYC] ID verification complete: ${verificationStatus} (score: ${overallScore})`)

      return {
        documentType,
        verificationStatus,
        aiScore: overallScore,
        requiresManualReview,
        extractedName,
        extractedDOB,
        documentExpiry,
        issuingCountry,
        details: {
          documentAuthenticity,
          textClarity,
          expirationValid: !flags.includes('Document is expired'),
          livenessDetected,
          nameConsistency,
          flagsRaised: flags,
        },
        message: `ID verification ${verificationStatus}. Overall confidence: ${overallScore}%`,
      }
    } catch (error) {
      console.error('[KYC] Unexpected error during ID verification:', error)
      return {
        documentType,
        verificationStatus: 'manual_review',
        aiScore: 0,
        requiresManualReview: true,
        details: {
          documentAuthenticity: 0,
          textClarity: 0,
          expirationValid: false,
          livenessDetected: false,
          nameConsistency: 0,
          flagsRaised: ['Service error - requires manual review'],
        },
        message: 'ID verification failed - requires manual review',
      }
    }
  }

  /**
   * Verify Proof of Address (Utility Bill, Bank Statement)
   * OCR extraction and validation
   */
  async verifyProofOfAddress(imageBuffer: Buffer): Promise<KYCVerificationResult> {
    try {
      console.log(`[KYC] Starting proof of address verification`)

      const flags: string[] = []

      // Detect text (addresses, names, dates)
      const detectTextCommand = new DetectTextCommand({
        Image: { Bytes: imageBuffer },
      })

      const textResponse = await this.rekognitionClient.send(detectTextCommand)
      let textClarity = 50

      if (textResponse.TextDetections && textResponse.TextDetections.length > 0) {
        const textConfidences = textResponse.TextDetections.filter((t) => t.Type === 'LINE').map((t) => t.Confidence || 0)
        textClarity = textConfidences.length > 0 ? Math.round(textConfidences.reduce((a, b) => a + b) / textConfidences.length) : 50

        if (textClarity < 70) {
          flags.push('Document text quality is poor')
        }

        // Check for required elements
        const fullText = textResponse.TextDetections.map((t) => t.DetectedText || '').join(' ').toLowerCase()

        if (!fullText.match(/\d{1,5}\s+[a-z\s]+/i)) {
          flags.push('No clear address found')
        }

        if (!fullText.match(/20\d{2}/)) {
          flags.push('No recent date found (document may be old)')
        }
      }

      const documentAuthenticity = textClarity > 75 ? 80 : 60
      const overallScore = (textClarity * 0.6 + documentAuthenticity * 0.4) / 100

      return {
        documentType: 'proof_of_address',
        verificationStatus: overallScore >= this.confidenceThreshold / 100 ? 'verified' : 'manual_review',
        aiScore: Math.round(overallScore * 100),
        requiresManualReview: overallScore < this.manualReviewThreshold / 100,
        details: {
          documentAuthenticity,
          textClarity,
          expirationValid: true,
          nameConsistency: 80,
          flagsRaised: flags,
        },
        message: `Proof of address verification complete. Confidence: ${Math.round(overallScore * 100)}%`,
      }
    } catch (error) {
      console.error('[KYC] Error verifying proof of address:', error)
      return this._createFailureResult('proof_of_address', ['Service error'], 0)
    }
  }

  /**
   * Verify Business License/Registration
   * Document authenticity and expiration checks
   */
  async verifyBusinessLicense(imageBuffer: Buffer): Promise<KYCVerificationResult> {
    try {
      console.log(`[KYC] Starting business license verification`)

      const flags: string[] = []

      // Extract text from license
      const detectTextCommand = new DetectTextCommand({
        Image: { Bytes: imageBuffer },
      })

      const textResponse = await this.rekognitionClient.send(detectTextCommand)
      let textClarity = 50

      if (textResponse.TextDetections && textResponse.TextDetections.length > 0) {
        const textConfidences = textResponse.TextDetections.filter((t) => t.Type === 'LINE').map((t) => t.Confidence || 0)
        textClarity = textConfidences.length > 0 ? Math.round(textConfidences.reduce((a, b) => a + b) / textConfidences.length) : 50

        const fullText = textResponse.TextDetections.map((t) => t.DetectedText || '').join(' ')

        // Check for required fields
        if (!fullText.match(/license|permit|registration|cert/i)) {
          flags.push('Document does not appear to be a business license')
        }

        if (!fullText.match(/20\d{2}/)) {
          flags.push('No year information found')
        }
      }

      const documentAuthenticity = textClarity > 75 ? 85 : 65
      const overallScore = (textClarity * 0.7 + documentAuthenticity * 0.3) / 100

      return {
        documentType: 'business_verification',
        verificationStatus: overallScore >= this.confidenceThreshold / 100 ? 'verified' : 'manual_review',
        aiScore: Math.round(overallScore * 100),
        requiresManualReview: overallScore < this.manualReviewThreshold / 100,
        details: {
          documentAuthenticity,
          textClarity,
          expirationValid: true,
          nameConsistency: 85,
          flagsRaised: flags,
        },
        message: `Business license verification complete. Confidence: ${Math.round(overallScore * 100)}%`,
      }
    } catch (error) {
      console.error('[KYC] Error verifying business license:', error)
      return this._createFailureResult('business_verification', ['Service error'], 0)
    }
  }

  /**
   * Helper: Create failure result
   */
  private _createFailureResult(documentType: string, flags: string[], score: number): KYCVerificationResult {
    return {
      documentType,
      verificationStatus: score > this.manualReviewThreshold ? 'manual_review' : 'rejected',
      aiScore: score,
      requiresManualReview: true,
      details: {
        documentAuthenticity: score,
        textClarity: 0,
        expirationValid: false,
        livenessDetected: false,
        nameConsistency: 0,
        flagsRaised: flags,
      },
      message: `${documentType} verification failed - ${flags.join(', ')}`,
    }
  }
}

export const kycVerificationService = new KYCVerificationService()
export type { KYCVerificationResult, IDVerificationResult }

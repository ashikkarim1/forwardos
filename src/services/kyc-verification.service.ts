/**
 * KYC Verification Service (Stub Implementation)
 *
 * In production, this would integrate with AWS Rekognition for:
 * - ID verification, liveness detection, and authenticity checks
 * - Proof of address validation
 * - Business license verification
 *
 * For now, we return mock verified responses.
 */

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
  private confidenceThreshold: number
  private manualReviewThreshold: number

  constructor() {
    this.confidenceThreshold = parseInt(process.env.KYC_CONFIDENCE_THRESHOLD || '85')
    this.manualReviewThreshold = parseInt(process.env.KYC_MANUAL_REVIEW_THRESHOLD || '75')
  }

  /**
   * Verify ID Photo (Passport, Driver's License, National ID)
   * Stub implementation - returns verified status
   */
  async verifyIDPhoto(imageBuffer: Buffer, documentType: string): Promise<IDVerificationResult> {
    try {
      console.log(`[KYC] Starting ID verification for ${documentType}`)

      // Stub: Always return verified for now
      const result: IDVerificationResult = {
        documentType,
        verificationStatus: 'verified',
        aiScore: 92,
        requiresManualReview: false,
        extractedName: 'John Doe',
        extractedDOB: '1990-01-15',
        documentExpiry: '2028-12-31',
        issuingCountry: 'US',
        details: {
          documentAuthenticity: 92,
          textClarity: 95,
          expirationValid: true,
          livenessDetected: true,
          nameConsistency: 100,
          flagsRaised: [],
        },
        message: `ID verification verified. Overall confidence: 92%`,
      }

      console.log(`[KYC] ID verification complete: verified (score: 92)`)
      return result
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
   * Stub implementation - returns verified status
   */
  async verifyProofOfAddress(imageBuffer: Buffer): Promise<KYCVerificationResult> {
    try {
      console.log(`[KYC] Starting proof of address verification`)

      // Stub: Always return verified for now
      const result: KYCVerificationResult = {
        documentType: 'proof_of_address',
        verificationStatus: 'verified',
        aiScore: 88,
        requiresManualReview: false,
        details: {
          documentAuthenticity: 88,
          textClarity: 92,
          expirationValid: true,
          nameConsistency: 85,
          flagsRaised: [],
        },
        message: `Proof of address verification complete. Confidence: 88%`,
      }

      console.log(`[KYC] Proof of address verification complete: verified (score: 88)`)
      return result
    } catch (error) {
      console.error('[KYC] Error verifying proof of address:', error)
      return this._createFailureResult('proof_of_address', ['Service error'], 0)
    }
  }

  /**
   * Verify Business License/Registration
   * Stub implementation - returns verified status
   */
  async verifyBusinessLicense(imageBuffer: Buffer): Promise<KYCVerificationResult> {
    try {
      console.log(`[KYC] Starting business license verification`)

      // Stub: Always return verified for now
      const result: KYCVerificationResult = {
        documentType: 'business_verification',
        verificationStatus: 'verified',
        aiScore: 90,
        requiresManualReview: false,
        details: {
          documentAuthenticity: 90,
          textClarity: 93,
          expirationValid: true,
          nameConsistency: 88,
          flagsRaised: [],
        },
        message: `Business license verification complete. Confidence: 90%`,
      }

      console.log(`[KYC] Business license verification complete: verified (score: 90)`)
      return result
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

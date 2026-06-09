/**
 * Forward OS Seller Listing Ingestion Schema
 * Complete data model for seller/broker onboarding, KYC, and listing creation
 * This schema drives the database, API validation, and wizard flow
 */

// ==================== ENUMS ====================

export enum UserType {
  SELLER = 'seller',
  BROKER = 'broker',
}

export enum KYCDocumentType {
  ID_PHOTO = 'id_photo',
  PROOF_OF_ADDRESS = 'proof_of_address',
  BUSINESS_VERIFICATION = 'business_verification',
  BROKER_LICENSE = 'broker_license',
  EO_INSURANCE = 'eo_insurance',
}

export enum KYCVerificationStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
  MANUAL_REVIEW = 'manual_review',
}

export enum ConsentStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  REVOKED = 'revoked',
}

export enum ListingStatus {
  DRAFT = 'draft',
  PENDING_VERIFICATION = 'pending_verification',
  LIVE = 'live',
  CLOSED = 'closed',
  DELISTED = 'delisted',
}

export enum CommissionStatus {
  PENDING_DEAL = 'pending_deal',
  EARNED = 'earned',
  PAYMENT_PROCESSED = 'payment_processed',
  PAID = 'paid',
}

// ==================== SELLER IDENTITY ====================

export interface SellerIdentity {
  id: string // UUID
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  companyName?: string // Optional, for business entity
  dateOfBirth?: string // ISO 8601
  citizenship: string // ISO 3166-1 alpha-2
  residenceCountry: string

  // Metadata
  createdAt: string // ISO 8601
  updatedAt: string
  verifiedAt?: string
}

// ==================== BROKER IDENTITY ====================

export interface BrokerIdentity {
  id: string // UUID
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  companyName: string // Brokerage name
  licenseNumber: string
  licenseState?: string // US state if applicable
  licenseType: 'ma_broker' | 'business_broker' | 'investment_banker' | 'other'
  yearsInBusiness: number

  // Verification
  licenseVerificationStatus: KYCVerificationStatus
  licenseVerificationDate?: string
  licenseExpiryDate?: string

  // Insurance
  eoInsuranceProvider?: string
  eoInsurancePolicyNumber?: string
  eoInsuranceAmount?: number // In USD

  // Metadata
  createdAt: string
  updatedAt: string
}

// ==================== KYC DOCUMENTS ====================

export interface KYCDocumentRecord {
  id: string // UUID
  userId: string // seller or broker ID
  userType: UserType
  documentType: KYCDocumentType

  // File information
  fileName: string
  fileFormat: 'pdf' | 'jpg' | 'png'
  fileSizeBytes: number
  uploadedAt: string // ISO 8601

  // Cloud storage
  storagePath: string // S3/GCS path
  storageProvider: 'aws_s3' | 'google_cloud' | 'azure'

  // Verification
  verificationStatus: KYCVerificationStatus
  aiVerificationScore: number // 0-100 confidence
  aiVerificationDetails: {
    documentAuthenticity: number
    textClarity: number
    expirationValid: boolean
    livenessDetected?: boolean
    nameConsistency: number
  }

  // Manual review (if needed)
  manualReviewRequired: boolean
  reviewedBy?: string // Forward OS team member ID
  reviewedAt?: string
  reviewNotes?: string

  // Expiration
  expiresAt?: string // Document expiration date

  // Metadata
  createdAt: string
  updatedAt: string
}

// ==================== BUSINESS INFORMATION ====================

export interface BusinessInformation {
  id: string // UUID
  sellerId: string
  brokerId?: string // If broker-managed

  // Basic info
  businessName: string
  businessType: string // SaaS, E-commerce, Franchise, etc.
  description: string // 20-1000 chars
  website?: string // Valid URL

  // Location
  primaryLocation: string // City, State/Country
  operatingCountries: string[] // ISO 3166-1 alpha-2

  // History
  yearFounded: number
  yearsInOperation: number
  teamSize: number

  // Seller motivation
  whySellingReason: string // Why are you selling
  idealBuyerProfile?: string // What kind of buyer

  // Metadata
  createdAt: string
  updatedAt: string
}

// ==================== FINANCIAL METRICS ====================

export interface FinancialMetrics {
  id: string // UUID
  businessId: string

  // Primary metrics
  annualRevenue: number // USD
  annualRevenueVerified: boolean
  revenueVerificationMethod?: 'tax_return' | 'bank_statement' | 'audited_financials' | 'self_reported'

  valuation: number // USD
  valuationMethod?: 'seller_estimate' | 'industry_multiple' | 'comparable_analysis' | 'professional_appraisal'

  yoyGrowthRate: number // Percentage (-100 to 1000)
  growthRate3Year?: number

  // Additional metrics (optional)
  ebitda?: number
  netProfit?: number
  monthlyRecurringRevenue?: number // For SaaS
  customerCount?: number
  churnRate?: number

  // Metadata
  createdAt: string
  updatedAt: string
  reportingPeriod?: string // e.g., "2024-Q1"
}

// ==================== BROKER LISTING RELATIONSHIP ====================

export interface BrokerListingRelationship {
  id: string // UUID
  brokerId: string
  sellerId: string
  listingId: string

  // Consent
  consentStatus: ConsentStatus
  consentGivenAt?: string // ISO 8601
  consentVerificationMethod: 'email_link' | 'phone_sms' | 'digital_signature'
  consentProof: {
    emailToken?: string
    smsToken?: string
    signatureTimestamp?: string
    ipAddress: string
    userAgent: string
    phoneVerificationTimestamp?: string
  }

  // Permissions (granular access control)
  permissions: {
    canEditListing: boolean
    canViewAnalytics: boolean
    canViewBuyerInquiries: boolean
    canSendMessages: boolean
    canModifyPrice: boolean
    canCloseOrDelete: boolean
  }

  // Commission
  commissionRate: number // 0.02 (2%), 0.025 (2.5%), 0.03 (3%)
  commissionStatus: CommissionStatus
  commissionEarnedAmount?: number
  dealClosureDate?: string

  // Revocation
  revokedAt?: string
  revokedByUserId?: string // Seller who revoked
  revocationReason?: string

  // Audit
  createdAt: string
  updatedAt: string
}

// ==================== LISTING RECORD ====================

export interface ListingRecord {
  id: string // UUID
  sellerId: string
  brokerId?: string // If broker-managed
  businessId: string

  // Status
  status: ListingStatus
  publishedAt?: string
  closedAt?: string

  // Content
  businessName: string
  businessDescription: string
  photos: ListingPhoto[] // Array of photo records

  // Visibility
  isVisible: boolean
  visibilityStartDate: string
  visibilityEndDate: string // 90 days for free, 365 for premium

  // Analytics
  viewCount: number
  inquiryCount: number
  favoriteCount: number
  lastViewedAt?: string

  // Metadata
  createdAt: string
  updatedAt: string
  publishedBy: string // seller or broker ID
}

export interface ListingPhoto {
  id: string // UUID
  listingId: string
  uploadedAt: string
  storagePath: string
  displayOrder: number
  isVerified: boolean // Passed fraud checks
}

// ==================== WIZARD SESSION ====================

export interface SellerWizardSession {
  id: string // UUID
  sessionToken: string // For client-side session tracking
  userType: UserType

  // Current state
  currentStep: string // 'user-type', 'seller-identity', 'business-info', etc.
  completedSteps: string[]

  // Form data (progressive)
  formData: {
    // Seller identity
    sellerIdentity?: Partial<SellerIdentity>

    // Broker identity (if broker)
    brokerIdentity?: Partial<BrokerIdentity>

    // Business
    businessInfo?: Partial<BusinessInformation>
    financialMetrics?: Partial<FinancialMetrics>

    // Photos
    photoUploadTemporaryUrls?: string[] // Temporary storage before listing creation

    // KYC
    kycDocuments?: Partial<KYCDocumentRecord>[]
  }

  // Status
  submissionStatus: 'in_progress' | 'submitted' | 'processing' | 'completed' | 'failed'
  submissionTimestamp?: string

  // Error tracking
  errors?: Array<{
    step: string
    field: string
    message: string
    timestamp: string
  }>

  // Metadata
  createdAt: string
  updatedAt: string
  expiresAt: string // Session expires after 7 days
  ipAddress: string
  userAgent: string
}

// ==================== CONSENT RECORD ====================

export interface ConsentRecord {
  id: string // UUID
  brokerId: string
  sellerId: string
  listingIds: string[] // Array of listing IDs under this consent

  // Consent details
  status: ConsentStatus
  consentGivenAt?: string
  consentVerificationMethod: 'email_link' | 'phone_sms' | 'digital_signature'
  consentProof: {
    ipAddress: string
    userAgent: string
    timestamp: string
    emailToken?: string
    phoneToken?: string
  }

  // Terms
  brokerCommissionPercentage: number
  brokerCompanyName: string
  brokerLicenseNumber: string

  // Revocation
  revokedAt?: string
  revocationReason?: string
  revokedByUserId: string // seller ID who revoked

  // Metadata
  createdAt: string
  updatedAt: string
}

// ==================== COMMISSION RECORD ====================

export interface CommissionRecord {
  id: string // UUID
  brokerId: string
  sellerId: string
  listingId: string
  dealId?: string // Created when deal closes

  // Deal information
  dealValue: number // USD
  dealClosureDate?: string
  dealVerificationStatus: 'pending' | 'verified' | 'disputed' | 'resolved'

  // Commission calculation
  commissionRate: number // 0.02, 0.025, or 0.03
  commissionAmount: number // Calculated as dealValue * commissionRate
  commissionStatus: CommissionStatus

  // Payment
  paymentSchedule: 'at_closing' | 'net_30' | 'net_60'
  paymentDate?: string
  paymentMethod?: 'ach' | 'wire' | 'check'
  paymentReference?: string
  paymentVerificationUrl?: string // Bank confirmation

  // Notes
  brokerNotes?: string
  forwardOsNotes?: string

  // Audit
  createdAt: string
  updatedAt: string
  verifiedBy?: string // Forward OS team
  verifiedAt?: string
}

// ==================== COMPLIANCE AUDIT LOG ====================

export interface ComplianceAuditLog {
  id: string // UUID - immutable
  timestamp: string // ISO 8601

  // Actor
  userId: string
  userType: UserType | 'forward_os'

  // Action
  action: string // 'created_listing', 'modified_price', 'submitted_kyc', etc.
  resourceType: 'listing' | 'seller' | 'broker' | 'commission' | 'consent'
  resourceId: string

  // Changes
  changeBefore?: object // JSON of values before
  changeAfter?: object // JSON of values after
  reason?: string // Why this action was taken

  // IP/Device
  ipAddress: string
  userAgent: string

  // Signature
  verified: boolean // Cryptographic HMAC verification
  signature?: string // HMAC-SHA256

  // Metadata
  createdAt: string // Cannot be changed
}

// ==================== API REQUEST/RESPONSE TYPES ====================

export interface SubmitWizardStepRequest {
  sessionToken: string
  step: string
  data: Record<string, any>
}

export interface SubmitWizardStepResponse {
  success: boolean
  sessionToken: string
  currentStep: string
  nextStep?: string
  errors?: Array<{ field: string; message: string }>
  data?: Record<string, any>
}

export interface SubmitListingRequest {
  sessionToken: string
  finalData: {
    sellerIdentity: SellerIdentity
    brokerIdentity?: BrokerIdentity
    businessInfo: BusinessInformation
    financialMetrics: FinancialMetrics
    kycDocuments: KYCDocumentRecord[]
    photos: ListingPhoto[]
  }
}

export interface SubmitListingResponse {
  success: boolean
  listingId: string
  sellerId: string
  brokerId?: string
  kycStatus: KYCVerificationStatus
  message: string
  nextSteps: string[]
}

// ==================== INGESTION PIPELINE EVENTS ====================

export enum IngestionEvent {
  WIZARD_STARTED = 'wizard_started',
  WIZARD_STEP_COMPLETED = 'wizard_step_completed',
  WIZARD_STEP_FAILED = 'wizard_step_failed',
  KYC_DOCUMENT_UPLOADED = 'kyc_document_uploaded',
  KYC_VERIFICATION_COMPLETED = 'kyc_verification_completed',
  KYC_MANUAL_REVIEW_REQUIRED = 'kyc_manual_review_required',
  CONSENT_REQUESTED = 'consent_requested',
  CONSENT_APPROVED = 'consent_approved',
  LISTING_CREATED = 'listing_created',
  LISTING_PUBLISHED = 'listing_published',
  LISTING_CLOSED = 'listing_closed',
  COMMISSION_EARNED = 'commission_earned',
  COMMISSION_PAID = 'commission_paid',
  COMPLIANCE_FLAG_RAISED = 'compliance_flag_raised',
  DISPUTE_CREATED = 'dispute_created',
}

export interface IngestionPipelineEvent {
  id: string // UUID
  eventType: IngestionEvent
  userId: string
  userType: UserType
  resourceId?: string // listing, seller, broker, etc.
  data: Record<string, any>
  timestamp: string
  processed: boolean
  processedAt?: string
}

// ==================== EXPORT SUMMARY ====================

/**
 * This schema defines:
 * 1. Complete seller/broker identity capture
 * 2. Business information & financials
 * 3. KYC document handling & verification
 * 4. Broker consent & permissions
 * 5. Commission tracking & payment
 * 6. Compliance audit logging
 * 7. Wizard session management
 * 8. Event-driven ingestion pipeline
 *
 * Usage:
 * - Database: Create tables from interfaces
 * - API: Validate requests/responses with types
 * - Wizard: Store form data in SellerWizardSession
 * - Processing: Use enums for status management
 * - Compliance: Log all actions to ComplianceAuditLog
 */

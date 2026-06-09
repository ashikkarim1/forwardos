# Forward OS Seller Onboarding Ingestion Flow

Complete data flow from wizard submission to listing publication and commission tracking.

---

## 1. HIGH-LEVEL ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────┐
│                    SELLER WIZARD UI                         │
│  (SellerKYCUploadWizard.tsx - Design system compliant)      │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│         STEP-BY-STEP FORM VALIDATION & PERSISTENCE           │
│  POST /api/seller-onboarding/submit-step                     │
│  - Validates each step against schema                        │
│  - Stores partial data in wizard session                     │
│  - Logs errors for recovery                                 │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│            FINAL SUBMISSION - COMPLETE DATA                  │
│  POST /api/seller-onboarding/submit-listing                 │
│  - Validates all required fields                            │
│  - Orchestrates multi-step ingestion                        │
│  - Creates database records atomically                      │
└──────────────────────────┬──────────────────────────────────┘
                           │
           ┌───────────────┼───────────────┐
           ▼               ▼               ▼
      ┌─────────┐  ┌──────────┐  ┌─────────────┐
      │ SELLER  │  │ BUSINESS │  │ FINANCIAL   │
      │ RECORD  │  │ RECORD   │  │ METRICS     │
      └─────────┘  └──────────┘  └─────────────┘
           │
      ┌────┴──────────┬─────────────┬──────────────┐
      ▼               ▼             ▼              ▼
   ┌─────┐      ┌──────────┐  ┌──────────┐  ┌──────────┐
   │BROKER│      │KYC DOCS  │  │ LISTING  │  │ COMPLIANCE│
   │RECORD│      │(Upload)  │  │ RECORD   │  │ AUDIT LOG│
   └─────┘      └──────────┘  └──────────┘  └──────────┘
      │               │             │              │
      │    ┌──────────┴──────┐      │              │
      │    ▼                 ▼      │              │
      │  AI/ML VERIFICATION  │      │              │
      │  (Authenticity       │      │              │
      │   Liveness Check)    │      │              │
      │    │                 │      │              │
      └────┴─────────────────┴──────┴──────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              LISTING PUBLICATION ENGINE                     │
│  - Generate listing slug & URL                              │
│  - Add to search index                                      │
│  - Notify buyer network                                     │
│  - Create analytics dashboard                               │
└──────────────────────────┬──────────────────────────────────┘
                           │
                ┌──────────┼──────────┐
                ▼          ▼          ▼
         ┌─────────┐ ┌─────────┐ ┌───────────┐
         │DATABASE │ │SEARCH   │ │MESSAGING  │
         │TABLES   │ │INDEX    │ │QUEUE      │
         │UPDATED  │ │UPDATED  │ │PUBLISHED  │
         └─────────┘ └─────────┘ └───────────┘
```

---

## 2. WIZARD STEP-BY-STEP FLOW

### Step 1: User Type Selection

```javascript
// INPUT
{
  userType: 'seller' | 'broker'
}

// VALIDATION
- userType is required
- userType must be 'seller' or 'broker'

// OUTPUT
Session created with:
{
  sessionToken: UUID,
  userType: 'seller' | 'broker',
  currentStep: 'user-type',
  formData: {}
}
```

### Step 2: Seller/Broker Identity

**For Sellers:**
```javascript
{
  sellerFirstName: string,
  sellerLastName: string,
  sellerEmail: string (validated),
  sellerPhone: string (validated),
  sellerCompany?: string
}
```

**For Brokers (Step 2):**
```javascript
{
  brokerFirstName: string,
  brokerLastName: string,
  brokerEmail: string (validated),
  brokerPhone: string (validated),
  brokerCompanyName: string,
  brokerLicenseNumber: string
}
```

### Step 3: Business Information

```javascript
{
  businessName: string (2+ chars),
  businessType: string (dropdown),
  location: string,
  yearFounded: number (1900-present),
  employees: number (1+),
  website?: string (optional, URL validated)
}
```

### Step 4: Financial Metrics

```javascript
{
  annualRevenue: number (validated),
  valuation: number (validated),
  growthRate: number (-100 to 1000%, validated)
}
```

### Step 5: Business Description

```javascript
{
  businessDescription: string (20-1000 chars),
  whySellingReason: string (10+ chars)
}
```

### Step 6: KYC Documents

```javascript
{
  kycDocuments: [
    {
      documentType: 'id_photo' | 'proof_of_address' | 'business_verification' | 'broker_license',
      file: File,
      fileFormat: 'pdf' | 'jpg' | 'png',
      fileSizeBytes: number (max 10MB)
    }
  ]
}
```

### Step 7: Review & Publish

```javascript
// REVIEW PAGE SHOWS:
- All collected data formatted nicely
- Option to edit any section
- Final confirmation checkbox
- Premium upsell offer

// ON SUBMIT:
POST /api/seller-onboarding/submit-listing
{
  sessionToken,
  finalData: {
    sellerIdentity,
    brokerIdentity?,
    businessInfo,
    financialMetrics,
    kycDocuments,
    photos
  }
}
```

---

## 3. DATA INGESTION PIPELINE (POST /submit-listing)

### Phase 1: Validation & Preparation

```
Input received
  ↓
Validate sessionToken exists
  ↓
Validate all finalData sections present
  ↓
Validate no missing required fields
  ↓
Parse numeric fields (revenue, valuation)
  ↓
Normalize phone numbers & emails
  ↓
Ready for database operations
```

### Phase 2: Create Core Records

**Sequential Operations (must maintain order):**

```javascript
1. CREATE SellerIdentity
   - ID: UUID
   - Fields: firstName, lastName, email, phone, company?, citizenship, residence
   - Metadata: createdAt, updatedAt

2. CREATE BrokerIdentity (if applicable)
   - ID: UUID
   - Fields: All broker info
   - License verification status: 'pending'
   - Metadata: createdAt, updatedAt

3. CREATE Business
   - ID: UUID
   - Links: sellerId, brokerId?
   - Fields: name, type, description, location, founded, employees
   - Metadata: createdAt, updatedAt

4. CREATE FinancialMetrics
   - ID: UUID
   - Links: businessId
   - Fields: revenue, valuation, growth, ebitda?, netProfit?
   - Metadata: createdAt, updatedAt

5. CREATE KYC Documents
   - ID: UUID per document
   - Links: userId (seller or broker)
   - Fields: type, fileName, fileSize, uploadPath, verification status
   - AI Verification: Run async (don't block)
   - Metadata: createdAt, uploadedAt

6. CREATE Listing
   - ID: UUID
   - Links: sellerId, brokerId?, businessId
   - Status: 'pending_verification'
   - Visibility: +90 days (free tier)
   - Metadata: createdAt, publishedBy: sellerId

7. CREATE Consent Record (if broker)
   - ID: UUID
   - Links: brokerId, sellerId, listingId
   - Status: 'pending'
   - Method: 'email_link'
   - Commission: 2.5% (default)

8. LOG Compliance Audit
   - Immutable log of creation
   - IP address, user agent
   - Signature verification
```

### Phase 3: Async Processing (Fire & Forget)

```javascript
// These happen AFTER response is sent to user

1. KYC AI Verification
   - Run liveness detection on ID photo
   - Extract text via OCR
   - Check authenticity
   - Compare against database for duplicates
   - Score: 0-100
   - If < 85%, flag for manual review

2. Upload Photos to CDN
   - Create image variants (thumbnail, full-res)
   - Add to S3/GCS
   - Update listing with URLs
   - Run image moderation

3. Send Confirmation Emails
   - Seller: "Your listing is live!"
   - Broker: Consent verification link (if applicable)

4. Index Listing for Search
   - Add to Elasticsearch
   - Add to geographic indices
   - Update buyer feeds

5. Publish Messaging Events
   - IngestionEvent.LISTING_CREATED
   - IngestionEvent.KYC_DOCUMENT_UPLOADED (per doc)
   - IngestionEvent.CONSENT_REQUESTED (if broker)
   - Subscribers: Analytics, Notifications, Compliance
```

---

## 4. DATABASE SCHEMA RELATIONSHIPS

```
SELLER_IDENTITY
├── id (PK)
├── firstName
├── lastName
├── email (unique index)
└── created_at

BUSINESS
├── id (PK)
├── seller_id (FK → SELLER_IDENTITY)
├── broker_id (FK → BROKER_IDENTITY, nullable)
├── businessName
└── created_at

FINANCIAL_METRICS
├── id (PK)
├── business_id (FK → BUSINESS)
├── annualRevenue
├── valuation
└── created_at

LISTING
├── id (PK)
├── seller_id (FK → SELLER_IDENTITY)
├── broker_id (FK → BROKER_IDENTITY, nullable)
├── business_id (FK → BUSINESS)
├── status (enum)
├── visibility_end_date
└── created_at

KYC_DOCUMENTS
├── id (PK)
├── user_id (FK → SELLER_IDENTITY or BROKER_IDENTITY)
├── user_type (enum: seller, broker)
├── document_type (enum)
├── storage_path
├── verification_status (enum)
└── created_at

BROKER_IDENTITY
├── id (PK)
├── firstName
├── lastName
├── email (unique index)
├── companyName
├── licenseNumber (unique index)
└── created_at

BROKER_LISTING_RELATIONSHIP
├── id (PK)
├── broker_id (FK → BROKER_IDENTITY)
├── seller_id (FK → SELLER_IDENTITY)
├── listing_id (FK → LISTING)
├── consent_status (enum)
├── commission_rate (decimal)
└── created_at

CONSENT_RECORD
├── id (PK)
├── broker_id (FK → BROKER_IDENTITY)
├── seller_id (FK → SELLER_IDENTITY)
├── listing_ids (array of listing IDs)
├── consent_status (enum)
├── consent_given_at
└── created_at

COMMISSION_RECORD
├── id (PK)
├── broker_id (FK → BROKER_IDENTITY)
├── seller_id (FK → SELLER_IDENTITY)
├── listing_id (FK → LISTING)
├── deal_id (FK → DEAL, nullable until closed)
├── deal_value (decimal)
├── commission_amount (decimal)
├── commission_status (enum)
└── created_at

COMPLIANCE_AUDIT_LOG (Immutable)
├── id (PK, UUID)
├── timestamp (NOT NULL, indexed)
├── user_id (FK, indexed)
├── user_type (enum)
├── action (string)
├── resource_type (enum)
├── resource_id (UUID, indexed)
├── change_before (JSON)
├── change_after (JSON)
├── ip_address
├── user_agent
├── signature (HMAC-SHA256)
├── verified (boolean)
└── created_at (NOT NULL, immutable)

INGESTION_PIPELINE_EVENT
├── id (PK)
├── event_type (enum)
├── user_id (FK)
├── user_type (enum)
├── resource_id (FK)
├── data (JSON)
├── processed (boolean)
└── timestamp (indexed)
```

---

## 5. ERROR HANDLING & RECOVERY

### Validation Errors (422)

```javascript
// If validation fails at submit-step
{
  success: false,
  currentStep: 'business-info',
  errors: [
    { field: 'businessName', message: 'Business name is required' },
    { field: 'yearFounded', message: 'Year must be between 1900 and 2024' }
  ]
}

// User can fix and resubmit same step
```

### KYC Verification Failures

```javascript
// If AI verification fails (score < 85%)
{
  success: true,
  listingId: 'listing_xyz',
  kycStatus: 'manual_review',
  message: 'Your listing is live but needs manual review of documents'
}

// Manual review happens in background
// Email sent when ready: "KYC verification complete - status: verified"
```

### Broker Consent Not Given

```javascript
// If broker-managed listing but seller doesn't approve
Seller gets email: "Broker Jane Smith is requesting permission to list your business"
Seller can: [APPROVE] [DECLINE]

// If declined:
- Listing stays live for seller
- Broker loses commission claims
- Listing becomes seller-direct
```

---

## 6. COMMISSION TRACKING FLOW

```
Seller lists business (Broker-managed)
  ↓
Broker gets 2.5% commission rate
  ↓
Buyer contacts seller via listing
  ↓
Buyer and seller negotiate
  ↓
Deal closes (signed agreement)
  ↓
Forward OS confirms closure
  ↓
Commission Record created:
  - dealValue: $2,500,000
  - commissionRate: 0.025 (2.5%)
  - commissionAmount: $62,500
  - status: 'earned'
  ↓
Payment scheduled (Net-30)
  ↓
ACH payment to broker's registered account
  ↓
Commission Record updated:
  - status: 'paid'
  - paidDate: '2024-07-09'
  ↓
Seller gets $0 from Forward OS
  (Seller-broker commission negotiated separately)
```

---

## 7. REAL-TIME ANALYTICS INGESTION

```
After listing created, track:

Listing Analytics:
├── Views (unique visitors)
├── Inquiries (buyer messages)
├── Favorites (saved by buyers)
├── Engagement rate (interactions per view)
└── Traffic source (search, browse, recommendation)

Seller Dashboard:
├── My Listing Status
├── Views This Week
├── Inquiries Pending
├── Commission Status (if broker)
└── KYC Verification Status

Broker Dashboard (if applicable):
├── Managed Listings
├── Total Commission Earned
├── Pending Commission
├── Deals Closed
├── Win Rate (listings that close)
└── Top Performing Listings
```

---

## 8. COMPLIANCE & SECURITY

```
All Operations:
├── Log to COMPLIANCE_AUDIT_LOG (immutable)
├── Sign with HMAC-SHA256
├── Include IP & user agent
├── Timestamp in ISO 8601
└── Retained 7 years

KYC Documents:
├── Encrypted at rest
├── HTTPS in transit
├── Access logged
├── Retention per regulatory requirements
└── Deletion after verification success

Seller Data:
├── PII encrypted
├── Seller can export on request
├── GDPR right to deletion (except audit logs)
└── CCPA compliant

Broker Data:
├── License verification ongoing
├── Suspicious activity flagged
├── Commission transactions auditable
└── Email/sms consent documented
```

---

## 9. EXAMPLE: COMPLETE FLOW

### Broker Lists on Behalf of Seller

```
STEP 1: Broker selects "I'm a Broker"
STEP 2: Broker enters:
  - Jane Smith, jane@smith-advisors.com
  - Smith & Associates M&A
  - License: BL-2024-000123
STEP 3: Broker enters seller details:
  - John Doe, john@techflow.com
  - TechFlow Inc
STEP 4: Business info:
  - TechFlow SaaS, Founded 2018, 12 employees
STEP 5: Financials:
  - Revenue: $850K, Valuation: $2.5M, Growth: 45%
STEP 6: Description:
  - "Rapidly growing SaaS platform..."
  - "Looking for strategic buyer in tech sector"
STEP 7: Upload documents:
  - ID photo (Jane & John)
  - Proof of address
  - Business license
  - Broker license (Jane)
STEP 8: Review & Submit

BACKEND INGESTION:
1. Create seller (John Doe)
2. Create broker (Jane Smith)
3. Create business (TechFlow SaaS)
4. Create financials
5. Upload + verify KYC docs (async)
6. Create listing (status: pending_verification)
7. Create consent record (pending)
8. Log all actions

RESPONSE:
✅ "TechFlow SaaS is now live!"
- Next: Consent email sent to john@techflow.com
- He approves Jane as broker
- Listing goes fully live
- Broker gets commission if deal closes

COMMISSION TRACKING:
- Buyer contacts TechFlow through Forward OS
- Deal negotiates & closes at $2.7M
- Commission earned: $67,500 (2.5%)
- Payment: 30 days after close
- Jane receives ACH payment
```

---

## 10. DEPLOYMENT CHECKLIST

- [ ] Database schema created & tested
- [ ] API endpoints deployed (`/submit-step`, `/submit-listing`)
- [ ] File upload service configured (S3/GCS)
- [ ] KYC AI verification service integrated
- [ ] Email service configured
- [ ] Search indexing configured
- [ ] Analytics pipeline connected
- [ ] Audit logging enabled
- [ ] Error tracking (Sentry) enabled
- [ ] Load testing complete
- [ ] Security audit completed
- [ ] GDPR/CCPA compliance verified
- [ ] Broker license verification API integrated
- [ ] Payment processing verified
- [ ] Staging environment tested
- [ ] Go-live monitoring setup

---

**Document Version:** 1.0
**Last Updated:** 2024-06-09
**Maintained By:** Forward OS Backend Team

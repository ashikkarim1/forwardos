# KYC (Know Your Customer) Verification System

## Overview

A world-class identity and credential verification system built into Forward OS. This system ensures all platform users are verified before conducting transactions, preventing fraud and ensuring regulatory compliance.

## Components & Pages

### 1. **KYC Verification Component**
- **File:** `/src/components/KYCVerification.tsx`
- **Description:** Main multi-step form component for user verification
- **Features:**
  - 5-step verification process (User Type → Personal Info → Address → Credentials → Review)
  - File upload support for documents (ID, address proof, business docs, etc.)
  - Real-time validation
  - Animated progress tracking
  - Role-specific credential collection (seller, buyer, broker)

### 2. **KYC Status Card Component**
- **File:** `/src/components/KYCStatusCard.tsx`
- **Description:** Dashboard widget showing user verification status
- **Features:**
  - Real-time status display (not started, in progress, completed, failed, expired)
  - Progress bar with percentage
  - Risk assessment badge
  - Verification dates and expiry tracking
  - Quick action buttons to complete verification

### 3. **Pages & Routes**

#### `/dashboard/kyc`
- **File:** `/src/app/dashboard/kyc/page.tsx`
- **Purpose:** Standalone KYC verification page for all users
- **Features:**
  - Main KYC verification flow
  - Progress tracking
  - Security & support information

#### `/dashboard/seller/kyc`
- **File:** `/src/app/dashboard/seller/kyc/page.tsx`
- **Purpose:** Seller-specific KYC verification page
- **Features:**
  - Seller-focused messaging
  - Document requirements for sellers
  - Support contact information
  - Progress indicators

#### `/dashboard/kyc-guide`
- **File:** `/src/app/dashboard/kyc-guide/page.tsx`
- **Purpose:** Educational resource explaining KYC process
- **Features:**
  - Why KYC is required
  - 5-step process breakdown
  - FAQ section
  - Quick links to verification
  - Support resources

### 4. **Seller Dashboard Integration**
- **File:** `/src/app/dashboard/seller/v2/page.tsx`
- **Updates:**
  - Added KYCStatusCard component
  - Displays verification status at top of dashboard
  - Removed emoji, replaced with modern icons
  - Linked KYC status card to verification pages

## API Endpoints

### 1. **POST /api/kyc/verify**
Performs KYC verification checks against submitted data.

**Request:**
```json
{
  "userId": "string",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "phone": "string",
  "dateOfBirth": "string",
  "nationality": "string",
  "address": "string",
  "city": "string",
  "state": "string",
  "country": "string",
  "zipCode": "string",
  "idType": "passport|national_id|drivers_license",
  "idNumber": "string",
  "userType": "buyer|seller|broker",
  "companyName": "string (optional)",
  "companyRegistration": "string (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "userId": "string",
  "verificationId": "string",
  "status": "pending|verified|failed|manual_review",
  "checks": {
    "identity": { "passed": bool, "score": number, "details": string },
    "address": { "passed": bool, "score": number, "details": string },
    "sanctions": { "passed": bool, "score": number, "details": string },
    "pep": { "passed": bool, "score": number, "details": string },
    "aml": { "passed": bool, "score": number, "details": string }
  },
  "overallScore": number,
  "riskLevel": "low|medium|high",
  "message": "string",
  "nextSteps": ["string"]
}
```

**Verification Checks:**
- **Identity:** Government ID validation
- **Address:** Address verification against public records
- **Sanctions:** OFAC, UN, EU sanctions list screening
- **PEP:** Politically Exposed Person detection
- **AML:** Anti-Money Laundering database checks

### 2. **GET /api/kyc/status?userId=string**
Retrieves current KYC verification status for a user.

**Response:**
```json
{
  "userId": "string",
  "status": "not_started|in_progress|completed|failed|expired",
  "completionPercentage": number,
  "steps": [
    {
      "name": "string",
      "status": "pending|completed|failed",
      "completedAt": "ISO date (optional)"
    }
  ],
  "riskScore": number,
  "riskLevel": "low|medium|high",
  "verificationId": "string (optional)",
  "lastVerificationDate": "ISO date (optional)",
  "expiryDate": "ISO date (optional)",
  "approvalStatus": "approved|rejected|pending_review",
  "notes": ["string"]
}
```

### 3. **POST /api/kyc/documents**
Uploads documents for verification.

**Request:** Form data with file and metadata
```
file: File (PDF, JPG, PNG - max 10MB)
userId: string
documentType: string
```

**Response:**
```json
{
  "success": true,
  "document": {
    "documentId": "string",
    "userId": "string",
    "documentType": "string",
    "fileName": "string",
    "fileSize": number,
    "uploadedAt": "ISO date",
    "status": "pending_review|approved|rejected",
    "verificationScore": number
  }
}
```

### 4. **GET /api/kyc/documents?userId=string**
Retrieves list of uploaded documents for a user.

## 5-Step Verification Process

### Step 1: Account Type (2 min)
- Select role: Buyer, Seller, or Broker
- Tailors verification to user type

### Step 2: Personal Information (5 min)
- Full name, email, phone
- Date of birth
- Nationality
- Government-issued ID upload (Passport, National ID, Driver's License)
- ID number, issued date, expiry date

### Step 3: Address Verification (3 min)
- Residential/business address
- City, state, postal code, country
- Address proof document upload (utility bill, bank statement)

### Step 4: Credential Verification (5 min)
**For Sellers:**
- Company legal name
- Company registration number / Tax ID
- Business license/Articles of Incorporation upload

**For Buyers:**
- Proof of funds upload (bank statement, LOI)
- Investment experience documentation

**For Brokers:**
- Professional certifications (CFA, MBA, Series 7, etc.)
- License uploads
- Regulatory credentials

### Step 5: Review & Submit (2 min)
- Review all submitted information
- Accept terms & conditions
- Submit for verification

**Processing Time:**
- Automated checks: 5-10 minutes
- Manual review (if needed): 24 hours

## Risk Scoring & Levels

### Risk Score Components
- Identity verification: 0-100
- Address verification: 0-100
- Sanctions screening: 0-100
- PEP detection: 0-100
- AML checks: 0-100

### Overall Risk Level
- **Low Risk:** Score 80+
- **Medium Risk:** Score 50-79
- **High Risk:** Score <50

### Actions by Risk Level
- **Low:** Automatic approval
- **Medium:** Manual review required (24-48 hours)
- **High:** Verification failed, resubmission required

## Verification Validity

- **Validity Period:** 365 days from approval
- **Expiration Notice:** Sent 30 days before expiry
- **Re-verification:** Automatic reminder after expiry

## Security & Compliance

### Data Protection
- End-to-end encryption for all submitted data
- Secure file storage (AWS S3 with encryption)
- No third-party sharing without explicit consent

### Regulatory Compliance
- **GDPR** (General Data Protection Regulation)
- **CCPA** (California Consumer Privacy Act)
- **KYC/AML** (Know Your Customer / Anti-Money Laundering)
- **OFAC** (Office of Foreign Assets Control)
- **FinCEN** (Financial Crimes Enforcement Network)

## Database Schema

### KYCVerification Model
```prisma
model KYCVerification {
  id                    String      @id @default(cuid())
  userId                String      @unique
  status                String      // not_started, in_progress, completed, failed, expired
  userType              String      // buyer, seller, broker
  
  // Personal Info
  firstName             String?
  lastName              String?
  email                 String?
  phone                 String?
  dateOfBirth          String?
  nationality          String?
  
  // Address
  address              String?
  city                 String?
  state                String?
  country              String?
  zipCode              String?
  
  // Identity
  idType               String?
  idNumber             String?
  idDocumentUrl        String?
  
  // Company Info (Sellers)
  companyName          String?
  companyRegistration  String?
  businessLicenseUrl   String?
  
  // Verification Results
  overallScore         Int?
  riskLevel            String? // low, medium, high
  verificationId       String?
  approvalStatus       String? // approved, rejected, pending_review
  
  // Timestamps
  createdAt            DateTime    @default(now())
  completedAt          DateTime?
  expiresAt            DateTime?
  updatedAt            DateTime    @updatedAt
}

model KYCDocument {
  id                   String      @id @default(cuid())
  kycVerificationId    String
  documentType         String      // government_id, address_proof, business_license, etc.
  fileUrl              String
  fileName             String
  fileSize             Int
  status               String      // pending_review, approved, rejected
  verificationScore    Int?
  createdAt            DateTime    @default(now())
}
```

## Integration Checklist

- [x] KYCVerification component
- [x] KYCStatusCard component
- [x] Standalone KYC pages
- [x] Seller dashboard integration
- [x] KYC guide/help page
- [x] API endpoints
- [x] Modern icon system
- [x] Emoji removal from UI
- [ ] Database migrations
- [ ] Connect API endpoints to components
- [ ] Real payment/sanctions database integration
- [ ] Email notifications (Resend integration)
- [ ] Admin dashboard for manual reviews
- [ ] Document OCR/verification

## Testing

### Manual Testing Checklist
- [ ] Complete 5-step verification form
- [ ] Submit documents
- [ ] Check verification status
- [ ] View KYC status card on dashboard
- [ ] Test all validation rules
- [ ] Check responsive design

### Test Users
```
Buyer: buyer@forward.com (complete KYC)
Seller: seller@forward.com (complete KYC)
Broker: broker@forward.com (complete KYC)
Pending: pending@forward.com (in progress)
Failed: failed@forward.com (failed verification)
```

## Future Enhancements

1. **Advanced Document Verification**
   - OCR for document text extraction
   - AI-powered document authentication
   - Liveness detection for ID verification

2. **Real-Time Database Integration**
   - Live OFAC sanctions screening
   - Real-time PEP detection
   - Integration with government databases

3. **Enhanced Analytics**
   - Verification trends and metrics
   - Risk profile dashboard
   - Approval rate tracking

4. **Admin Features**
   - Manual review dashboard
   - Bulk verification operations
   - Compliance reporting

5. **User Experience**
   - Mobile-optimized verification flow
   - Document scanning via camera
   - Auto-document detection
   - Multi-language support

## Support & Resources

- **Help Page:** `/dashboard/kyc-guide`
- **Email:** kyc@forward.com
- **Phone:** +1 (555) 123-4567
- **Live Chat:** Available 9am-6pm EST, Mon-Fri
- **FAQ:** Included in KYC guide page

## Troubleshooting

### Common Issues

**Verification Fails:**
- Ensure all required fields are complete
- Check document quality (clear, legible)
- Verify document hasn't expired
- Try re-uploading with higher quality

**Status Not Updating:**
- Refresh the page
- Check notification email
- Wait 24 hours for manual review
- Contact support

**Document Upload Issues:**
- File must be PDF, JPG, or PNG
- File size must be under 10MB
- Ensure proper file format

## Contact & Support

For questions or issues, contact:
- **Email:** kyc@forward.com
- **Phone:** +1 (555) 123-4567
- **Website:** www.forward.com/kyc-help

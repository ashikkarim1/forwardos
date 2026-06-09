# Forward OS Broker Protocols & Data Management

## 1. BROKER LISTING WORKFLOWS

### 1.1 Broker Listing on Behalf of Seller (Delegated Listing)

**Workflow Overview:**
```
Broker Initiation
  ↓
Broker Verification (KYC)
  ↓
Seller Consent & Details Entry
  ↓
Business Information Submission
  ↓
KYC Document Verification
  ↓
Listing Goes Live
  ↓
Commission Tracking & Reporting
```

### 1.2 Data Ownership & Control

**Critical Protocol:**
- **Listing Owner**: Seller (verified via KYC)
- **Listing Facilitator**: Broker (acts as agent)
- **Consent Record**: Digital signature or email confirmation from seller required
- **Data Access**: Seller has ultimate control; broker has delegated access

**Consent Mechanism:**
```javascript
// Broker consent data structure
{
  brokerId: "broker_123",
  sellerId: "seller_456",
  consentTimestamp: "2024-06-09T12:00:00Z",
  consentMethod: "email_link" | "digital_signature" | "phone_verified",
  consentProof: {
    emailToken: "token_xyz",
    ipAddress: "192.168.1.1",
    userAgent: "Mozilla/5.0..."
  },
  listingIds: ["listing_001", "listing_002"],
  brokerCommissionPercentage: 2.5, // 2-3% range
  revoked: false,
  revokedAt: null
}
```

---

## 2. WORLD-CLASS KYC INTEGRATION

### 2.1 KYC Documents Required

**For Sellers (Individual):**
1. **Government ID** (Photo required)
   - Passport, Driver's License, or National ID
   - Must be current and valid
   - Name must match seller profile

2. **Proof of Address** (Not older than 6 months)
   - Utility bill, bank statement, or government document
   - Must show name and address
   - Digital or scanned version accepted

3. **Business Verification** (If applicable)
   - Business license or registration documents
   - Tax ID or EIN documentation
   - Articles of incorporation (if LLC/Corp)

**For Brokers:**
1. **Government ID** (Photo required)
2. **Proof of Address** (Not older than 6 months)
3. **Broker License Verification**
   - Active broker license scan
   - License number verified against state registry
   - E&O (Errors & Omissions) insurance proof (recommended)

### 2.2 Document Upload Specifications

```javascript
// Document upload interface
interface KYCDocument {
  documentType: 'id_photo' | 'proof_of_address' | 'business_verification' | 'broker_license' | 'eo_insurance'
  userId: string
  userType: 'seller' | 'broker'
  fileFormat: 'pdf' | 'jpg' | 'png' // 2 formats max
  fileSizeBytes: number // Max 10MB
  uploadedAt: string
  expiresAt: string | null
  verificationStatus: 'pending' | 'verified' | 'rejected'
  verificationNotes: string
  verifiedBy: string // Forward OS team member ID
  verifiedAt: string | null
  aiVerificationScore: number // 0-100 confidence
  manualReviewRequired: boolean
}
```

### 2.3 Verification Process

**Automated Checks (AI/ML):**
- Document authenticity (liveness detection for ID photos)
- Text clarity and readability
- Expiration date validation
- Name/address consistency across documents

**Manual Review (if score < 85%):**
- Forward OS compliance team reviews
- 24-48 hour turnaround
- Seller/broker notified if issues
- Right to re-submit or appeal

**Approval Criteria:**
- All required documents present
- AI verification score ≥ 85%
- No fraud flags
- Identity consistency across all documents

---

## 3. COMMISSION TRACKING & BROKER ACCOUNTING

### 3.1 Commission Structure

```javascript
// Broker commission data
interface BrokerCommission {
  brokerId: string
  sellerId: string
  listingId: string
  dealId: string // Created when deal is closed
  dealValue: number
  commissionRate: number // 2-3% (Standard 2%, Premium 2.5%, Elite 3%)
  commissionAmount: number
  status: 'pending_deal' | 'deal_closed' | 'payment_processed' | 'paid'
  dealClosedDate: string | null
  paymentSchedule: 'at_closing' | 'net_30' | 'net_60'
  paidDate: string | null
  brokerNotes: string
  verifiedByForward: boolean
}
```

### 3.2 Commission Calculation Rules

**Trigger Event:**
- Commission accrues when deal closes
- Requires seller + broker + buyer signatures
- Forward OS confirms deal closure via three-party verification

**Payment Processing:**
- Standard: 2% commission
- Premium brokers (10+ listings): 2.5%
- Elite brokers (50+ listings): 3%
- Commission paid Net-30 after deal closes
- Payment via ACH, wire, or check

**Seller View:**
```
Your Listing | Deal Value | Broker | Commission | Status
TechFlow     | $2.5M      | Jane S | $62,500    | Paid
             | Broker gets 2.5% | Forward OS gets 0% from seller
             | (Seller pays $0)
```

---

## 4. BROKER DASHBOARD & REPORTING

### 4.1 Broker Management Interface

```javascript
// Broker dashboard data
interface BrokerDashboard {
  brokerId: string
  companyName: string
  licenseNumber: string
  totalListings: number
  activeListings: number
  closedDeals: number
  totalCommissionsEarned: number
  pendingCommissions: number
  paidCommissions: number
  avgCommissionPerDeal: number
  brokerWinRate: number // % of listings that close
  
  // Seller relationships
  managedSellers: Array<{
    sellerId: string
    sellerName: string
    businessName: string
    listingStatus: 'active' | 'closed' | 'draft'
    consentGiven: boolean
    consentDate: string
    canRevoke: boolean
  }>
  
  // Performance metrics
  metrics: {
    listingToClosureRate: number
    avgTimeToClose: number
    buyerInquiriesPerListing: number
    buyerConversionRate: number
  }
  
  // Reports
  monthlyReports: Array<{
    month: string
    newListings: number
    closedDeals: number
    commissionEarned: number
  }>
}
```

### 4.2 Broker Transparency Tools

**What Brokers See:**
- Real-time listing performance (views, inquiries)
- Buyer interest analytics
- Messaging history with sellers
- Commission tracking & payment status
- Performance benchmarks vs other brokers

**What Brokers Cannot See:**
- Seller financial data (earnings, valuations) without permission
- Other brokers' listings or commissions
- Buyer private information
- Forward OS operational data

---

## 5. SELLER CONSENT & REVOCATION

### 5.1 Broker Authorization Consent

**Initial Consent Flow:**
```
Broker sends consent link via email
Seller clicks link
Seller verifies phone (SMS verification)
Seller reviews broker information
Seller approves broker as agent
Consent recorded with timestamp & IP
```

**Consent Email Template:**
```
Subject: [Seller Name], broker Jane Smith is requesting to list [Business Name]

Hi [Seller Name],

Jane Smith from Smith & Associates M&A is requesting permission to list your business ([Business Name]) on Forward OS marketplace.

Broker Details:
- Name: Jane Smith
- License: BL-2024-000123
- Company: Smith & Associates M&A
- Est. Commission: 2.5%

Your rights as seller:
✓ You retain 100% control of listing details
✓ You can revoke broker permission anytime
✓ You receive all buyer inquiries directly
✓ You approve any deal terms

[APPROVE LISTING] [DECLINE]
```

### 5.2 Revocation Protocol

**Seller Can Revoke:**
- Broker access to listing
- Broker commission claims
- Broker contact access
- Takes effect immediately

**Revocation Process:**
```
Seller initiates revocation in dashboard
Broker notified immediately
Listing transitions to seller-direct
Future commissions for this listing: $0
Existing pending commissions: Still owed
```

**Data After Revocation:**
- Broker loses listing edit access
- Broker loses commission eligibility
- Seller keeps all buyer inquiries
- Conversation history remains (read-only for broker)

---

## 6. FRAUD PREVENTION & COMPLIANCE

### 6.1 Anti-Fraud Measures

**Broker Verification:**
- State license database verification
- E&O insurance check
- Address validation
- Duplicate account detection
- IP geolocation consistency

**Seller Verification:**
- KYC document authenticity
- Identity consistency across fields
- Liveness detection on ID photos
- Address cross-reference checks
- Multi-factor authentication

### 6.2 Suspicious Activity Flags

```javascript
// Risk scoring
interface FraudRiskScore {
  userId: string
  userType: 'seller' | 'broker'
  overallScore: number // 0-100 (100 = highest risk)
  
  factors: {
    documentQuality: number
    idConsistency: number
    addressVerification: number
    ipGeolocation: number
    behaviorAnomaly: number
    multipleAccounts: number
  }
  
  flags: Array<{
    flagType: 'suspicious_docs' | 'inconsistent_identity' | 'high_risk_country' | 'velocity_check'
    severity: 'low' | 'medium' | 'high'
    description: string
    action: 'auto_approve' | 'manual_review' | 'reject'
  }>
  
  requiresManualReview: boolean
  reviewedBy: string | null
  reviewedAt: string | null
  decision: 'approved' | 'rejected' | 'pending' | null
}
```

### 6.3 Compliance Logging

```javascript
// All broker actions logged
interface ComplianceLog {
  id: string
  brokerId: string
  sellerId: string
  action: 'created_listing' | 'sent_message' | 'modified_listing' | 'revoked_access'
  timestamp: string
  details: object
  ipAddress: string
  userAgent: string
  verifiedBy: string // Forward OS team
}
```

---

## 7. DATA ARCHITECTURE & STORAGE

### 7.1 Broker-Seller-Listing Relationship

```javascript
// Core data model
interface BrokerListingRelationship {
  id: string
  
  // Parties
  brokerId: string
  brokeredByName: string
  sellerId: string
  sellerName: string
  listingId: string
  
  // Consent
  consentStatus: 'pending' | 'approved' | 'rejected' | 'revoked'
  consentGivenAt: string | null
  consentVerificationMethod: 'email' | 'phone' | 'digital_signature'
  
  // Permissions (granular)
  permissions: {
    canEditListing: boolean
    canViewAnalytics: boolean
    canViewBuyerInquiries: boolean
    canSendMessages: boolean
    canModifyPrice: boolean
    canCloseOrDelete: boolean
  }
  
  // Commission
  commissionRate: number
  commissionStatus: 'pending_deal' | 'earned' | 'paid'
  
  // Audit
  createdAt: string
  updatedAt: string
  revokedAt: string | null
  revokedByUserId: string | null
}
```

### 7.2 Audit Trail (Immutable)

Every broker action creates immutable audit record:
```javascript
interface AuditLogEntry {
  id: string // UUID
  timestamp: string // ISO 8601
  userId: string
  userType: 'seller' | 'broker' | 'forward_os'
  action: string
  resourceType: 'listing' | 'message' | 'commission' | 'consent'
  resourceId: string
  changeBefore: object
  changeAfter: object
  reason: string
  ipAddress: string
  verified: boolean // Cryptographic signature
}
```

---

## 8. BUYER EXPERIENCE WITH BROKER LISTINGS

### 8.1 Broker Attribution

**What Buyers See:**
```
Business Name: TechFlow SaaS
Founded: 2018
Revenue: $850K

Listing managed by:
Jane Smith, Smith & Associates M&A
License: BL-2024-000123
⭐ 4.8/5 (12 successful deals)

[Contact Seller] [Ask Broker a Question]
```

### 8.2 Communication Routing

- Buyer inquiries go to BOTH seller & broker
- Broker can facilitate but seller has final say
- All messages logged & disclosed
- Option to exclude broker from specific communications

---

## 9. SETTLEMENT & PAYMENTS

### 9.1 Broker Commission Payment

**Flow:**
1. Deal closes (seller + buyer agreement signed)
2. Forward OS confirms closure
3. Commission invoice generated
4. Payment processed Net-30 after closing
5. ACH/Wire/Check to broker's registered business account

**Example:**
```
Deal Value: $2,500,000
Commission Rate: 2.5%
Commission Owed: $62,500

Payment Terms: Net-30 (30 days after close)
Payment Method: ACH to Smith & Associates M&A
Status: Scheduled for [Date]
```

---

## 10. DISPUTE RESOLUTION

### 10.1 Commission Disputes

**If seller disputes broker claim:**
1. Seller submits dispute with reason
2. Forward OS reviews consent records & agreement
3. Interview both parties
4. Render decision within 5 business days
5. Payment held pending resolution

**Common Disputes:**
- "Broker didn't actually facilitate this deal"
- "Seller revoked consent before closing"
- "Commission rate was negotiated lower"

**Resolution Paths:**
- Uphold seller claim → Commission reversed
- Uphold broker claim → Commission paid
- Partial commission → Split agreed amount
- Arbitration → Third-party mediator

---

## 11. REGULATORY COMPLIANCE

### 11.1 Jurisdictional Requirements

**US Requirements:**
- M&A brokers vary by state
- Some states require licensing
- Forward OS verifies state requirements
- Broker license portability confirmed

**International (Canada, UAE):**
- Canada: Register with investment dealer associations
- UAE: ADGM registration for brokerage operations
- Forward OS maintains compliance checklist per region

### 11.2 Data Privacy (GDPR/CCPA)

- Seller data never shared without consent
- Broker-seller relationship data retained 7 years
- Right to deletion (except audit logs)
- Data export available on request

---

## 12. IMPLEMENTATION CHECKLIST

- [ ] KYC document upload & verification system
- [ ] Broker license database integration
- [ ] Consent mechanism (email + phone verification)
- [ ] Broker dashboard build
- [ ] Commission tracking & payment processing
- [ ] Audit logging system
- [ ] Revocation workflow
- [ ] Dispute resolution platform
- [ ] Compliance reporting tools
- [ ] Seller transparency tools
- [ ] Buyer communication routing
- [ ] Testing with 20+ brokers
- [ ] Legal review by counsel
- [ ] Go-live & monitoring

---

**Document Version:** 1.0
**Last Updated:** 2024-06-09
**Maintainer:** Forward OS Compliance & Risk Team

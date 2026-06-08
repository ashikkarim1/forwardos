# KYC System - Quick Start Guide

## For Developers

### Getting Started (5 minutes)

#### 1. Access KYC Pages in Browser
```
# Main KYC verification page
http://localhost:3001/dashboard/kyc

# Seller-specific KYC page
http://localhost:3001/dashboard/seller/kyc

# KYC help & guide
http://localhost:3001/dashboard/kyc-guide

# Seller dashboard (shows KYC status card)
http://localhost:3001/dashboard/seller/v2
```

#### 2. Test the Verification Flow
1. Go to `/dashboard/seller/kyc`
2. Click through the 5-step process:
   - **Step 1:** Select "Seller"
   - **Step 2:** Fill in name, email, phone, select ID type, upload dummy file
   - **Step 3:** Fill in address fields, upload dummy file
   - **Step 4:** Upload business license
   - **Step 5:** Review and submit

#### 3. Check the Seller Dashboard
1. Navigate to `/dashboard/seller/v2`
2. You'll see the KYC Status Card at the top
3. Shows verification status, progress, and risk assessment

### File Organization

```
Forward OS
├── src/
│   ├── components/
│   │   ├── KYCVerification.tsx (main 5-step form)
│   │   ├── KYCStatusCard.tsx (dashboard widget)
│   │   └── Icons/
│   │       └── FeatureIcons.tsx (modern icon system)
│   │
│   ├── app/
│   │   ├── dashboard/
│   │   │   ├── kyc/
│   │   │   │   └── page.tsx (main KYC page)
│   │   │   ├── seller/
│   │   │   │   └── kyc/
│   │   │   │       └── page.tsx (seller KYC page)
│   │   │   └── kyc-guide/
│   │   │       └── page.tsx (help & guide)
│   │   │
│   │   └── api/
│   │       └── kyc/
│   │           ├── verify/
│   │           │   └── route.ts (verification endpoint)
│   │           ├── status/
│   │           │   └── route.ts (status endpoint)
│   │           └── documents/
│   │               └── route.ts (document upload)
│   │
│   └── styles/
│       └── forward-colors.ts (design system)
│
├── KYC_SYSTEM.md (comprehensive documentation)
├── KYC_IMPLEMENTATION_SUMMARY.md (what was built)
└── KYC_QUICK_START.md (this file)
```

### Component Tree

```
Dashboard
├── KYCStatusCard
│   ├── Progress Bar
│   ├── Risk Level Badge
│   ├── Verification Status
│   ├── Dates (verified, expires)
│   └── Action Buttons

KYCVerification (5 steps)
├── Step 0: Account Type Selection
├── Step 1: Personal Information & ID Upload
├── Step 2: Address & Proof Upload
├── Step 3: Credentials (role-specific)
└── Step 4: Review & Submit
```

## API Endpoints

### Test Verification
```bash
curl -X POST http://localhost:3001/api/kyc/verify \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+1 (555) 123-4567",
    "dateOfBirth": "1990-01-15",
    "nationality": "United States",
    "address": "123 Main St",
    "city": "New York",
    "state": "NY",
    "country": "United States",
    "zipCode": "10001",
    "idType": "passport",
    "idNumber": "AB123456789",
    "userType": "seller",
    "companyName": "Tech Startup Inc",
    "companyRegistration": "EIN-12-3456789"
  }'
```

### Expected Response (Low Risk)
```json
{
  "success": true,
  "userId": "user123",
  "verificationId": "KYC-1717842345678-abc123def",
  "status": "verified",
  "checks": {
    "identity": { "passed": true, "score": 95, "details": "..." },
    "address": { "passed": true, "score": 90, "details": "..." },
    "sanctions": { "passed": true, "score": 100, "details": "..." },
    "pep": { "passed": true, "score": 100, "details": "..." },
    "aml": { "passed": true, "score": 100, "details": "..." }
  },
  "overallScore": 97,
  "riskLevel": "low",
  "approvalStatus": "approved",
  "message": "Your identity has been verified successfully!",
  "nextSteps": [
    "Upload business registration and proof of ownership documents"
  ]
}
```

### Check Status
```bash
curl http://localhost:3001/api/kyc/status?userId=user123
```

## Key Code Snippets

### Using KYCStatusCard in a Page
```tsx
import { KYCStatusCard } from '@/components/KYCStatusCard'

export default function MyDashboard() {
  return (
    <KYCStatusCard
      status="completed"
      completionPercentage={100}
      riskLevel="low"
      approvalStatus="approved"
      lastVerificationDate={new Date().toISOString()}
      expiryDate={new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()}
    />
  )
}
```

### Using FeatureIcon
```tsx
import { FeatureIcon } from '@/components/Icons/FeatureIcons'

// Available icons: deal, comparables, pipeline, security, success, etc.
<FeatureIcon name="deal" size={40} />
```

## Common Tasks

### Task: Add KYC Check to a Page
```tsx
import { KYCVerification } from '@/components/KYCVerification'

export default function MyPage() {
  return <KYCVerification />
}
```

### Task: Display User's Verification Status
```tsx
import { KYCStatusCard } from '@/components/KYCStatusCard'

export default function ProfilePage() {
  // Fetch from /api/kyc/status?userId={userId}
  const status = 'completed'
  const completionPercentage = 100
  const riskLevel = 'low'
  
  return (
    <KYCStatusCard
      status={status}
      completionPercentage={completionPercentage}
      riskLevel={riskLevel}
      approvalStatus="approved"
    />
  )
}
```

### Task: Verify a User
```tsx
const response = await fetch('/api/kyc/verify', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: userID,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    // ... other fields
  })
})

const result = await response.json()
console.log(result.status) // 'verified' or 'failed' or 'manual_review'
```

## Testing Scenarios

### Scenario 1: Happy Path (Auto-Approved)
1. Fill in all information correctly
2. Upload valid documents
3. Should get "verified" status with low risk

### Scenario 2: Manual Review
1. Fill in some fields with edge cases
2. Should get "manual_review" status with medium risk
3. User gets email notification

### Scenario 3: Verification Failed
1. Enter invalid information
2. Should get "failed" status with high risk
3. User sees feedback and can resubmit

## Troubleshooting

### Issue: FeatureIcon not working
**Solution:** Check that icon name exists in `/src/components/Icons/FeatureIcons.tsx`

Valid names: `deal`, `comparables`, `pipeline`, `security`, `success`, `analytics`, `messaging`, `dataRoom`, `heatMap`, `predictions`, `feeds`, `trends`, `global`, `integration`, `timeline`, `risk`, `export`, `settings`

### Issue: Component not rendering
**Solution:** Ensure component has 'use client' directive if using hooks/state

### Issue: API returning error
**Solution:** Check required fields in request body. All of these are required:
- userId
- firstName
- lastName
- email
- idType
- idNumber
- userType

## Next: Implement Database

To go live, you need to:

1. **Run Prisma migrations:**
   ```bash
   npx prisma migrate dev --name add_kyc_verification
   ```

2. **Connect API endpoints to database:**
   - Update `/api/kyc/verify` to save to DB
   - Update `/api/kyc/status` to fetch from DB
   - Implement real verification logic

3. **Add real verification services:**
   - OFAC sanctions list API
   - PEP database API
   - Government ID verification service
   - Address verification service

4. **Setup email notifications:**
   - Email on verification complete
   - Email on manual review required
   - Email 30 days before expiry

## Resources

- Full docs: `KYC_SYSTEM.md`
- Implementation summary: `KYC_IMPLEMENTATION_SUMMARY.md`
- Component code: `/src/components/KYCVerification.tsx`
- API code: `/src/app/api/kyc/*`

## Support

For questions or issues:
- Check the KYC_SYSTEM.md documentation
- Review component code comments
- Check API endpoint specifications
- Test with curl commands above

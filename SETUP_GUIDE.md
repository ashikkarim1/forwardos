# Forward OS - Complete Setup Guide

## Installation & Configuration (Production-Ready)

This guide covers the complete setup for Forward OS seller onboarding, KYC verification, database integration, and email notifications.

---

## 1. DATABASE SETUP (PostgreSQL)

### Step 1.1: Install PostgreSQL

```bash
# macOS
brew install postgresql@15
brew services start postgresql@15

# Ubuntu/Debian
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql

# Windows
# Download from https://www.postgresql.org/download/windows/
```

### Step 1.2: Create Database

```bash
# Create database
createdb forward_os

# Verify
psql -l | grep forward_os
```

### Step 1.3: Update Environment Variables

```bash
# Copy example file
cp .env.example .env

# Edit .env and set:
DATABASE_URL="postgresql://user:password@localhost:5432/forward_os"
DATABASE_POOL_SIZE=20
```

### Step 1.4: Run Database Migrations

```bash
# Install Prisma
npm install @prisma/client
npm install -D prisma

# Generate Prisma client
npx prisma generate

# Run SQL migration to create all tables
psql forward_os < migrations/001_initial_schema.sql

# Verify tables created
psql forward_os -c "\dt"
```

**Tables created:**
- seller_identity
- broker_identity
- business
- financial_metrics
- kyc_documents
- listing
- listing_photos
- consent_record
- broker_listing_relationship
- commission_record
- compliance_audit_log
- seller_wizard_session
- ingestion_pipeline_event

---

## 2. AWS S3 SETUP (File Storage)

### Step 2.1: Create AWS S3 Buckets

```bash
# Login to AWS Console or use AWS CLI

# Create KYC bucket (private, encrypted)
aws s3 mb s3://forward-os-kyc-documents --region us-east-1

# Create photos bucket (public CDN)
aws s3 mb s3://forward-os-listing-photos --region us-east-1
```

### Step 2.2: Configure Bucket Policies

```bash
# KYC Bucket - Private with encryption
# Set these in AWS Console:
# - Block public access: ON
# - Server-side encryption: AES-256
# - Lifecycle: Delete after 7 years
# - Versioning: Enable

# Photos Bucket - Public CDN
# Set these in AWS Console:
# - Block public access: OFF (for CDN)
# - CloudFront distribution: Create
# - Default TTL: 31536000 (1 year)
```

### Step 2.3: Create IAM User

```bash
# Create programmatic access user
# Permissions needed:
# - s3:GetObject
# - s3:PutObject
# - s3:DeleteObject
# - s3:ListBucket

# Export credentials:
AWS_ACCESS_KEY_ID=xxx
AWS_SECRET_ACCESS_KEY=xxx
AWS_REGION=us-east-1
```

### Step 2.4: Setup CloudFront CDN (for photos)

```bash
# In AWS Console:
# 1. CloudFront → Create Distribution
# 2. Origin: forward-os-listing-photos S3 bucket
# 3. Default TTL: 31536000 seconds
# 4. Compress: ON
# 5. Note the distribution domain (d123.cloudfront.net)

# Update .env:
AWS_S3_PUBLIC_URL="https://d123.cloudfront.net"
```

---

## 3. EMAIL SERVICE SETUP (SendGrid)

### Step 3.1: Create SendGrid Account

```bash
# Sign up: https://sendgrid.com/
# Upgrade to paid ($20/month minimum)
```

### Step 3.2: Get API Key

```bash
# In SendGrid dashboard:
# Settings → API Keys → Create API Key
# Name: "Forward OS Production"
# Permissions: Full Access
# Copy the key

# Update .env:
SENDGRID_API_KEY="SG.xxx"
EMAIL_FROM_ADDRESS="noreply@forward-os.com"
EMAIL_FROM_NAME="Forward OS"
```

### Step 3.3: Verify From Address

```bash
# In SendGrid Console:
# Settings → Sender Authentication
# Verify "noreply@forward-os.com" domain (DKIM/SPF)
# Takes ~24 hours
```

### Step 3.4: Create Email Templates (Optional)

```bash
# In SendGrid Console:
# Dynamic Templates → Create
# Use the email templates from email.service.ts

# Update service with template IDs:
# const result = await sgMail.send({
#   ...
#   templateId: 'd-xxxxx',
#   dynamicTemplateData: { ... }
# })
```

---

## 4. KYC VERIFICATION SETUP (AWS Rekognition)

### Step 4.1: Enable AWS Rekognition

```bash
# In AWS Console:
# Services → Rekognition → Enable
# Region: us-east-1
```

### Step 4.2: IAM Permissions

```bash
# Add to IAM user policy:
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "rekognition:DetectFaces",
        "rekognition:AnalyzeID",
        "rekognition:DetectText"
      ],
      "Resource": "*"
    }
  ]
}
```

### Step 4.3: Configure Thresholds

```bash
# Update .env:
KYC_VERIFICATION_PROVIDER="aws_rekognition"
KYC_CONFIDENCE_THRESHOLD=85
KYC_MANUAL_REVIEW_THRESHOLD=75
```

---

## 5. BROKER LICENSE VERIFICATION

### Step 5.1: Integrate Regulatory APIs

```bash
# Options:
# 1. FINRA BrokerCheck API
# 2. SEC IAPD
# 3. State-specific APIs (DRE, DPOR, etc.)

# For now, mock implementation handles basic validation
# Update broker-verification.service.ts when ready
```

### Step 5.2: E&O Insurance Verification (Optional)

```bash
# Contact major insurers for API access:
# - The Hartford
# - Chubb
# - XL Specialty
# - Travelers
```

---

## 6. INSTALL NODE DEPENDENCIES

```bash
# Install all required packages
npm install

# Key packages added:
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
npm install @aws-sdk/client-rekognition
npm install @sendgrid/mail
npm install @prisma/client uuid
npm install -D prisma typescript

# Verify installations
npm list @aws-sdk/client-s3
npm list @sendgrid/mail
npm list @prisma/client
```

---

## 7. ENVIRONMENT VARIABLES (Complete)

```bash
# Copy and fill in all values
cp .env.example .env

# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/forward_os"
DATABASE_POOL_SIZE=20

# AWS
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID="AKIA..."
AWS_SECRET_ACCESS_KEY="xxx"
AWS_S3_BUCKET_KYC="forward-os-kyc-documents"
AWS_S3_BUCKET_PHOTOS="forward-os-listing-photos"
AWS_S3_PUBLIC_URL="https://d123.cloudfront.net"

# KYC
KYC_VERIFICATION_PROVIDER="aws_rekognition"
KYC_CONFIDENCE_THRESHOLD=85
KYC_MANUAL_REVIEW_THRESHOLD=75

# Email
EMAIL_PROVIDER="sendgrid"
SENDGRID_API_KEY="SG.xxx"
EMAIL_FROM_ADDRESS="noreply@forward-os.com"
EMAIL_FROM_NAME="Forward OS"

# Broker License
BROKER_LICENSE_VERIFICATION_PROVIDER="regulatory_api"
BROKER_LICENSE_API_KEY="xxx"

# Commission
BROKER_COMMISSION_RATE=0.01  # 1% flat fee

# Elasticsearch
ELASTICSEARCH_URL="https://localhost:9200"
ELASTICSEARCH_USERNAME="elastic"
ELASTICSEARCH_PASSWORD="password"

# Analytics
ANALYTICS_PROVIDER="segment"
SEGMENT_WRITE_KEY="xxx"

# Compliance
SENTRY_DSN="https://xxx@sentry.io/123"
AUDIT_LOG_RETENTION_YEARS=7

# App
NODE_ENV="production"
APP_URL="https://forward-os.com"
APP_SECRET="your_app_secret_key_min_32_chars"
```

---

## 8. TEST THE SETUP

### Step 8.1: Test Database Connection

```bash
# Create test file
cat > test-db.js << 'EOF'
const { PrismaClient } = require('@prisma/client')
const db = new PrismaClient()

async function main() {
  const count = await db.seller_identity.count()
  console.log(`✅ Database connected. Sellers: ${count}`)
}

main()
  .catch(e => {
    console.error('❌ Database error:', e)
    process.exit(1)
  })
  .finally(async () => await db.$disconnect())
EOF

node test-db.js
```

### Step 8.2: Test S3 Connection

```bash
# Create test file
cat > test-s3.js << 'EOF'
const { storageService } = require('./src/services/storage.service')

async function main() {
  try {
    console.log('✅ S3 service initialized')
    // Create presigned URL
    const url = await storageService.getSignedKYCUrl('test/path.pdf')
    console.log('✅ Presigned URL generated')
  } catch (e) {
    console.error('❌ S3 error:', e.message)
  }
}

main()
EOF

node test-s3.js
```

### Step 8.3: Test SendGrid

```bash
# Create test file
cat > test-email.js << 'EOF'
const { emailService } = require('./src/services/email.service')

async function main() {
  const result = await emailService.sendListingConfirmation(
    'John Doe',
    'test@example.com',
    'Test Business',
    'listing_123',
    'verified'
  )
  
  if (result.success) {
    console.log('✅ Email sent:', result.messageId)
  } else {
    console.error('❌ Email error:', result.error)
  }
}

main()
EOF

node test-email.js
```

---

## 9. START DEVELOPMENT SERVER

```bash
# Install Next.js dev server
npm install -D next

# Update package.json scripts:
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}

# Run development server
npm run dev

# Server starts at http://localhost:3000
```

---

## 10. TEST SELLER ONBOARDING

### Step 10.1: Open Wizard

```
http://localhost:3000/auth/signup-seller
```

### Step 10.2: Complete Workflow

1. Select "I'm a Seller"
2. Enter seller details
3. Enter business information
4. Enter financial metrics
5. Enter description
6. Upload KYC documents & photos
7. Review & submit

### Step 10.3: Verify Database

```bash
psql forward_os

# Check seller created
SELECT id, first_name, last_name, email FROM seller_identity;

# Check listing created
SELECT id, status FROM listing;

# Check KYC documents
SELECT document_type, verification_status, ai_verification_score FROM kyc_documents;
```

---

## 11. PRODUCTION DEPLOYMENT

### Step 11.1: Build Production Bundle

```bash
npm run build

# Verify no errors
# Creates .next/ directory with optimized bundle
```

### Step 11.2: Deploy to Vercel/AWS

```bash
# Option A: Vercel (recommended)
npm install -g vercel
vercel

# Option B: AWS EC2
# 1. Launch Ubuntu t3.medium instance
# 2. Install Node.js, npm, PostgreSQL
# 3. Clone repo, npm install
# 4. Set environment variables
# 5. npm run build
# 6. pm2 start "npm start"

# Option C: Docker
docker build -t forward-os .
docker run -p 3000:3000 forward-os
```

### Step 11.3: Configure Production Database

```bash
# Use managed PostgreSQL (AWS RDS, Heroku, Railway)
# Create read replicas for analytics queries
# Enable automated backups
# Set up monitoring & alerts
```

### Step 11.4: Setup Monitoring

```bash
# Sentry (error tracking)
npm install @sentry/nextjs
# Update next.config.js with Sentry DSN

# CloudWatch (AWS logs)
# Setup log groups for Lambda/Fargate
# Create dashboards & alarms

# Datadog (APM)
# npm install -D @datadog/browser-rum
```

---

## 12. VERIFY COMPLETE SETUP

```bash
# Checklist:
✅ PostgreSQL running locally
✅ All tables created
✅ AWS S3 buckets created
✅ AWS IAM user configured
✅ SendGrid API key configured
✅ AWS Rekognition enabled
✅ .env file complete
✅ npm dependencies installed
✅ Dev server running
✅ Database connection verified
✅ S3 connection verified
✅ Email sending verified
✅ Seller wizard accessible
✅ Ingestion API working

# When ALL checks pass, system is ready for:
✅ Production deployment
✅ Buyer platform integration
✅ Broker platform integration
✅ Real seller/broker onboarding
✅ Real KYC verification
✅ Real deal closing & commission tracking
```

---

## 13. COMMISSION TRACKING (1% Flat Fee)

### Broker Commission Flow

```
Deal Value: $2,500,000
Commission Rate: 1% (flat)
Commission Amount: $25,000

Payment Schedule: Net-30 (30 days after close)

Status Flow:
pending_deal → earned → payment_processed → paid

When:
- Deal closes → Commission earned
- 30 days after close → Payment processed to broker's account
- ACH/Wire sent → Commission marked as paid
```

### Commission Database

```sql
-- Check pending commissions
SELECT broker_id, SUM(commission_amount) 
FROM commission_record 
WHERE commission_status IN ('earned', 'payment_processed')
GROUP BY broker_id;

-- Check paid commissions
SELECT broker_id, SUM(commission_amount) 
FROM commission_record 
WHERE commission_status = 'paid'
GROUP BY broker_id;
```

---

## 14. TROUBLESHOOTING

### Issue: Database Connection Failed

```bash
# Check PostgreSQL running
sudo systemctl status postgresql

# Check credentials in .env
psql -U user -d forward_os

# Reset connection pool
npm run dev  # Forces reconnection
```

### Issue: S3 Upload Failed

```bash
# Verify AWS credentials
aws sts get-caller-identity

# Check bucket permissions
aws s3 ls s3://forward-os-kyc-documents

# Verify CORS configuration (if needed)
aws s3api get-bucket-cors --bucket forward-os-photos
```

### Issue: Email Not Sending

```bash
# Verify SendGrid API key
curl -X GET https://api.sendgrid.com/v3/mail/settings/footer \
  -H "Authorization: Bearer $SENDGRID_API_KEY"

# Check sender authentication
# SendGrid Console → Settings → Sender Authentication
# Must be verified before sending
```

### Issue: KYC Verification Failing

```bash
# Verify AWS Rekognition enabled
aws rekognition describe-collection --region us-east-1

# Check file format & size
# Supported: JPEG, PNG
# Max: 5MB

# Test with clear document photo
```

---

## Documentation Links

- [Prisma Documentation](https://www.prisma.io/docs/)
- [AWS S3 SDK](https://docs.aws.amazon.com/sdk-for-javascript/latest/developer-guide/s3.html)
- [SendGrid API](https://sendgrid.com/docs/api-reference/)
- [AWS Rekognition](https://docs.aws.amazon.com/rekognition/latest/dg/what-is.html)
- [Next.js Deployment](https://nextjs.org/docs/deployment/vercel)

---

**Setup Complete!** 🚀

Your Forward OS infrastructure is now ready for:
- ✅ Seller onboarding with KYC verification
- ✅ Broker listing management & commission tracking
- ✅ Automated email notifications
- ✅ 1% flat broker commission tracking
- ✅ 7-year compliance audit logging
- ✅ Production-scale deployment

**Next Steps:**
1. Deploy buyer platform
2. Integrate broker dashboard
3. Setup deal closing workflow
4. Launch MVP with first 10 brokers

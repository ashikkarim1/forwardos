/**
 * Database Client - Prisma ORM
 * Handles all database operations with type safety and connection pooling
 *
 * Setup:
 * npm install @prisma/client
 * npm install -D prisma
 * npx prisma init
 */

import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const db =
  globalForPrisma.prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db
}

/**
 * Example Prisma schema (prisma/schema.prisma)
 *
 * generator client {
 *   provider = "prisma-client-js"
 * }
 *
 * datasource db {
 *   provider = "postgresql"
 *   url      = env("DATABASE_URL")
 * }
 *
 * model SellerIdentity {
 *   id                 String     @id @default(uuid())
 *   firstName          String
 *   lastName           String
 *   email              String     @unique
 *   phoneNumber        String
 *   companyName        String?
 *   dateOfBirth        DateTime?
 *   citizenship        String?
 *   residenceCountry   String?
 *   createdAt          DateTime   @default(now())
 *   updatedAt          DateTime   @updatedAt
 *   verifiedAt         DateTime?
 *
 *   // Relations
 *   businesses         Business[]
 *   listings           Listing[]
 *   consentRecords     ConsentRecord[]
 *   commissionRecords  CommissionRecord[]
 *   brokerRelations    BrokerListingRelationship[]
 *
 *   @@index([email])
 *   @@index([phoneNumber])
 * }
 *
 * model BrokerIdentity {
 *   id                     String    @id @default(uuid())
 *   firstName              String
 *   lastName               String
 *   email                  String    @unique
 *   phoneNumber            String
 *   companyName            String
 *   licenseNumber          String    @unique
 *   licenseState           String?
 *   licenseType            String
 *   yearsInBusiness        Int?
 *   licenseVerificationStatus String  @default("pending")
 *   licenseVerificationDate DateTime?
 *   licenseExpiryDate      DateTime?
 *   eoInsuranceProvider    String?
 *   eoInsurancePolicyNumber String?
 *   eoInsuranceAmount      Decimal?
 *   createdAt              DateTime  @default(now())
 *   updatedAt              DateTime  @updatedAt
 *
 *   // Relations
 *   businesses             Business[]
 *   listings               Listing[]
 *   consentRecords         ConsentRecord[]
 *   commissionRecords      CommissionRecord[]
 *   brokerRelations        BrokerListingRelationship[]
 *
 *   @@index([email])
 *   @@index([licenseNumber])
 * }
 *
 * model Business {
 *   id                  String            @id @default(uuid())
 *   sellerId            String
 *   seller              SellerIdentity    @relation(fields: [sellerId], references: [id], onDelete: Cascade)
 *   brokerId            String?
 *   broker              BrokerIdentity?   @relation(fields: [brokerId], references: [id], onDelete: SetNull)
 *   businessName        String
 *   businessType        String
 *   description         String
 *   website             String?
 *   primaryLocation     String
 *   operatingCountries  String[]
 *   yearFounded         Int
 *   yearsInOperation    Int?
 *   teamSize            Int
 *   whySellingReason    String
 *   idealBuyerProfile   String?
 *   createdAt           DateTime          @default(now())
 *   updatedAt           DateTime          @updatedAt
 *
 *   // Relations
 *   financials          FinancialMetrics?
 *   listings            Listing[]
 *
 *   @@index([sellerId])
 *   @@index([brokerId])
 *   @@index([businessType])
 * }
 *
 * model FinancialMetrics {
 *   id                       String   @id @default(uuid())
 *   businessId               String   @unique
 *   business                 Business @relation(fields: [businessId], references: [id], onDelete: Cascade)
 *   annualRevenue            Decimal
 *   annualRevenueVerified    Boolean  @default(false)
 *   revenueVerificationMethod String?
 *   valuation                Decimal
 *   valuationMethod          String?
 *   yoyGrowthRate            Decimal
 *   growthRate3Year          Decimal?
 *   ebitda                   Decimal?
 *   netProfit                Decimal?
 *   monthlyRecurringRevenue  Decimal?
 *   customerCount            Int?
 *   churnRate                Decimal?
 *   createdAt                DateTime @default(now())
 *   updatedAt                DateTime @updatedAt
 *   reportingPeriod          String?
 * }
 *
 * model Listing {
 *   id                  String                   @id @default(uuid())
 *   sellerId            String
 *   seller              SellerIdentity           @relation(fields: [sellerId], references: [id], onDelete: Cascade)
 *   brokerId            String?
 *   broker              BrokerIdentity?          @relation(fields: [brokerId], references: [id], onDelete: SetNull)
 *   businessId          String
 *   business            Business                 @relation(fields: [businessId], references: [id], onDelete: Cascade)
 *   status              String                   @default("draft")
 *   publishedAt         DateTime?
 *   closedAt            DateTime?
 *   isVisible           Boolean                  @default(false)
 *   visibilityStartDate DateTime?
 *   visibilityEndDate   DateTime?
 *   viewCount           Int                      @default(0)
 *   inquiryCount        Int                      @default(0)
 *   favoriteCount       Int                      @default(0)
 *   lastViewedAt        DateTime?
 *   publishedBy         String
 *   createdAt           DateTime                 @default(now())
 *   updatedAt           DateTime                 @updatedAt
 *
 *   // Relations
 *   photos              ListingPhotos[]
 *   brokerRelations     BrokerListingRelationship[]
 *   commissionRecords   CommissionRecord[]
 *
 *   @@index([sellerId])
 *   @@index([brokerId])
 *   @@index([businessId])
 *   @@index([status])
 *   @@index([isVisible, visibilityEndDate])
 * }
 *
 * model ListingPhotos {
 *   id          String   @id @default(uuid())
 *   listingId   String
 *   listing     Listing  @relation(fields: [listingId], references: [id], onDelete: Cascade)
 *   storagePath String
 *   displayOrder Int
 *   isVerified  Boolean  @default(false)
 *   uploadedAt  DateTime @default(now())
 *   createdAt   DateTime @default(now())
 *
 *   @@index([listingId, displayOrder])
 * }
 *
 * model KYCDocuments {
 *   id                     String   @id @default(uuid())
 *   userId                 String
 *   userType               String
 *   documentType           String
 *   fileName               String
 *   fileFormat             String
 *   fileSizeBytes          Int
 *   storagePath            String
 *   storageProvider        String
 *   verificationStatus     String   @default("pending")
 *   aiVerificationScore    Int      @default(0)
 *   aiVerificationDetails  Json     @default("{}")
 *   manualReviewRequired   Boolean  @default(false)
 *   reviewedBy             String?
 *   reviewedAt             DateTime?
 *   reviewNotes            String?
 *   expiresAt              DateTime?
 *   uploadedAt             DateTime @default(now())
 *   createdAt              DateTime @default(now())
 *   updatedAt              DateTime @updatedAt
 *
 *   @@index([userId, userType])
 *   @@index([verificationStatus])
 *   @@index([uploadedAt])
 * }
 *
 * model ConsentRecord {
 *   id                        String   @id @default(uuid())
 *   brokerId                  String
 *   broker                    BrokerIdentity @relation(fields: [brokerId], references: [id], onDelete: Cascade)
 *   sellerId                  String
 *   seller                    SellerIdentity @relation(fields: [sellerId], references: [id], onDelete: Cascade)
 *   listingIds                String[]
 *   status                    String   @default("pending")
 *   consentGivenAt            DateTime?
 *   consentVerificationMethod String
 *   consentProof              Json     @default("{}")
 *   brokerCommissionPercentage Decimal  @default(1.00)
 *   brokerCompanyName         String
 *   brokerLicenseNumber       String
 *   revokedAt                 DateTime?
 *   revocationReason          String?
 *   revokedByUserId           String?
 *   createdAt                 DateTime @default(now())
 *   updatedAt                 DateTime @updatedAt
 *
 *   @@index([brokerId])
 *   @@index([sellerId])
 *   @@index([status])
 * }
 *
 * model BrokerListingRelationship {
 *   id                        String   @id @default(uuid())
 *   brokerId                  String
 *   broker                    BrokerIdentity @relation(fields: [brokerId], references: [id], onDelete: Cascade)
 *   sellerId                  String
 *   seller                    SellerIdentity @relation(fields: [sellerId], references: [id], onDelete: Cascade)
 *   listingId                 String
 *   listing                   Listing  @relation(fields: [listingId], references: [id], onDelete: Cascade)
 *   consentStatus             String   @default("pending")
 *   consentGivenAt            DateTime?
 *   consentVerificationMethod String?
 *   consentProof              Json     @default("{}")
 *   permissions               Json     @default("{ \"canEditListing\": true, \"canViewAnalytics\": true, \"canViewBuyerInquiries\": true, \"canSendMessages\": true, \"canModifyPrice\": false, \"canCloseOrDelete\": false }")
 *   commissionRate            Decimal  @default(0.01)
 *   commissionStatus          String   @default("pending_deal")
 *   revokedAt                 DateTime?
 *   revokedByUserId           String?
 *   revocationReason          String?
 *   createdAt                 DateTime @default(now())
 *   updatedAt                 DateTime @updatedAt
 *
 *   @@unique([brokerId, listingId])
 *   @@index([sellerId, listingId])
 * }
 *
 * model CommissionRecord {
 *   id                       String   @id @default(uuid())
 *   brokerId                 String
 *   broker                   BrokerIdentity @relation(fields: [brokerId], references: [id], onDelete: Cascade)
 *   sellerId                 String
 *   seller                   SellerIdentity @relation(fields: [sellerId], references: [id], onDelete: Cascade)
 *   listingId                String
 *   listing                  Listing  @relation(fields: [listingId], references: [id], onDelete: Cascade)
 *   dealId                   String?
 *   dealValue                Decimal
 *   dealClosureDate          DateTime?
 *   dealVerificationStatus   String   @default("pending")
 *   commissionRate           Decimal  @default(0.01)
 *   commissionAmount         Decimal
 *   commissionStatus         String   @default("pending_deal")
 *   paymentSchedule          String   @default("net_30")
 *   paymentDate              DateTime?
 *   paymentMethod            String?
 *   paymentReference         String?
 *   paymentVerificationUrl   String?
 *   brokerNotes              String?
 *   forwardOsNotes           String?
 *   verifiedBy               String?
 *   verifiedAt               DateTime?
 *   createdAt                DateTime @default(now())
 *   updatedAt                DateTime @updatedAt
 *
 *   @@index([brokerId])
 *   @@index([sellerId])
 *   @@index([commissionStatus])
 *   @@index([dealId])
 * }
 *
 * model ComplianceAuditLog {
 *   id          String   @id @default(uuid())
 *   timestamp   DateTime @default(now())
 *   userId      String
 *   userType    String
 *   action      String
 *   resourceType String
 *   resourceId  String
 *   changeBefore Json?
 *   changeAfter Json?
 *   reason      String?
 *   ipAddress   String?
 *   userAgent   String?
 *   verified    Boolean  @default(false)
 *   signature   String?
 *   createdAt   DateTime @default(now())
 *
 *   @@index([timestamp])
 *   @@index([userId])
 *   @@index([action])
 *   @@index([resourceType, resourceId])
 * }
 *
 * model IngestionPipelineEvent {
 *   id          String   @id @default(uuid())
 *   eventType   String
 *   userId      String
 *   userType    String
 *   resourceId  String?
 *   data        Json     @default("{}")
 *   processed   Boolean  @default(false)
 *   processedAt DateTime?
 *   createdAt   DateTime @default(now())
 *   timestamp   DateTime @default(now())
 *
 *   @@index([eventType])
 *   @@index([userId])
 *   @@index([processed, timestamp])
 * }
 */

export default db

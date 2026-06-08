import { PrismaClient, IndustryType, DealStatus, UserRole, DealPipelineStage, KYCStatus, VerificationStatus, RiskLevel, MessageType, DocumentAccessLevel, KYCDocumentType } from '@prisma/client'

const prisma = new PrismaClient()

const COMPANIES = [
  // Tech & SaaS
  { name: 'TechFlow Solutions', industry: 'SAAS', country: 'UAE', city: 'Dubai', revenue: 250000000, ebitda: 75000000, growth: '45%', employees: 45, yearsInOp: 5 },
  { name: 'CloudCore Infrastructure', industry: 'SAAS', country: 'UAE', city: 'Abu Dhabi', revenue: 420000000, ebitda: 126000000, growth: '52%', employees: 72, yearsInOp: 7 },
  { name: 'DataStream Analytics', industry: 'SAAS', country: 'KSA', city: 'Riyadh', revenue: 180000000, ebitda: 54000000, growth: '38%', employees: 38, yearsInOp: 4 },
  { name: 'SecureVault Systems', industry: 'SAAS', country: 'UAE', city: 'Dubai', revenue: 310000000, ebitda: 93000000, growth: '41%', employees: 55, yearsInOp: 6 },
  { name: 'NextGen AI Platform', industry: 'SAAS', country: 'UAE', city: 'Dubai', revenue: 210000000, ebitda: 63000000, growth: '58%', employees: 62, yearsInOp: 3 },

  // Healthcare
  { name: 'Emirates Healthcare Network', industry: 'HEALTHCARE', country: 'UAE', city: 'Dubai', revenue: 520000000, ebitda: 156000000, growth: '28%', employees: 180, yearsInOp: 12 },
  { name: 'MedTech Innovations', industry: 'HEALTHCARE', country: 'UAE', city: 'Abu Dhabi', revenue: 380000000, ebitda: 114000000, growth: '32%', employees: 125, yearsInOp: 8 },
  { name: 'Diagnostic Centers Plus', industry: 'HEALTHCARE', country: 'UAE', city: 'Dubai', revenue: 410000000, ebitda: 123000000, growth: '22%', employees: 95, yearsInOp: 9 },

  // Retail & E-Commerce
  { name: 'RetailCo Stores', industry: 'RETAIL', country: 'UAE', city: 'Dubai', revenue: 890000000, ebitda: 178000000, growth: '15%', employees: 210, yearsInOp: 15 },
  { name: 'NextGen E-Commerce', industry: 'ECOMMERCE', country: 'UAE', city: 'Abu Dhabi', revenue: 340000000, ebitda: 68000000, growth: '62%', employees: 85, yearsInOp: 5 },
  { name: 'Fashion Hub Middle East', industry: 'RETAIL', country: 'KSA', city: 'Jeddah', revenue: 560000000, ebitda: 112000000, growth: '20%', employees: 140, yearsInOp: 10 },

  // Manufacturing
  { name: 'Precision Manufacturing', industry: 'MANUFACTURING', country: 'UAE', city: 'Ajman', revenue: 720000000, ebitda: 144000000, growth: '18%', employees: 165, yearsInOp: 18 },
  { name: 'Industrial Solutions ME', industry: 'MANUFACTURING', country: 'KSA', city: 'Jeddah', revenue: 650000000, ebitda: 130000000, growth: '14%', employees: 140, yearsInOp: 20 },
  { name: 'Advanced Composites Inc', industry: 'MANUFACTURING', country: 'UAE', city: 'Sharjah', revenue: 480000000, ebitda: 96000000, growth: '22%', employees: 98, yearsInOp: 11 },

  // FinTech & Finance
  { name: 'FintechFlow Banking', industry: 'FINTECH', country: 'UAE', city: 'Dubai', revenue: 420000000, ebitda: 126000000, growth: '48%', employees: 78, yearsInOp: 6 },
  { name: 'AlManara Finance', industry: 'FINTECH', country: 'UAE', city: 'Abu Dhabi', revenue: 310000000, ebitda: 93000000, growth: '55%', employees: 62, yearsInOp: 5 },
  { name: 'Digital Payment Solutions', industry: 'FINTECH', country: 'KSA', city: 'Riyadh', revenue: 260000000, ebitda: 78000000, growth: '64%', employees: 52, yearsInOp: 4 },

  // Services
  { name: 'Digital Marketing Pro', industry: 'SERVICES', country: 'UAE', city: 'Dubai', revenue: 210000000, ebitda: 63000000, growth: '48%', employees: 45, yearsInOp: 8 },
  { name: 'Consulting & Advisory Group', industry: 'SERVICES', country: 'UAE', city: 'Abu Dhabi', revenue: 380000000, ebitda: 114000000, growth: '28%', employees: 95, yearsInOp: 14 },
  { name: 'Gulf Logistics Hub', industry: 'LOGISTICS', country: 'UAE', city: 'Dubai', revenue: 560000000, ebitda: 112000000, growth: '22%', employees: 220, yearsInOp: 16 },

  // Hospitality
  { name: 'Premium Hotels Group', industry: 'HOSPITALITY', country: 'UAE', city: 'Dubai', revenue: 1120000000, ebitda: 224000000, growth: '16%', employees: 450, yearsInOp: 22 },
  { name: 'Resort & Spa Operator', industry: 'HOSPITALITY', country: 'UAE', city: 'Abu Dhabi', revenue: 680000000, ebitda: 136000000, growth: '12%', employees: 280, yearsInOp: 18 },
  { name: 'Restaurant Chain GCC', industry: 'HOSPITALITY', country: 'KSA', city: 'Jeddah', revenue: 420000000, ebitda: 84000000, growth: '24%', employees: 180, yearsInOp: 13 },

  // Energy
  { name: 'Renewable Energy Solutions', industry: 'ENERGY', country: 'UAE', city: 'Abu Dhabi', revenue: 780000000, ebitda: 234000000, growth: '35%', employees: 125, yearsInOp: 9 },
  { name: 'Solar Installation Services', industry: 'ENERGY', country: 'UAE', city: 'Dubai', revenue: 240000000, ebitda: 72000000, growth: '48%', employees: 65, yearsInOp: 6 },

  // Real Estate
  { name: 'Real Estate Ventures', industry: 'REAL_ESTATE', country: 'UAE', city: 'Dubai', revenue: 920000000, ebitda: 276000000, growth: '14%', employees: 85, yearsInOp: 19 },
  { name: 'Property Management ME', industry: 'REAL_ESTATE', country: 'UAE', city: 'Abu Dhabi', revenue: 360000000, ebitda: 108000000, growth: '20%', employees: 75, yearsInOp: 12 },

  // Education
  { name: 'EdTech Innovators', industry: 'EDUCATION', country: 'UAE', city: 'Dubai', revenue: 190000000, ebitda: 57000000, growth: '62%', employees: 48, yearsInOp: 4 },
  { name: 'International School Group', industry: 'EDUCATION', country: 'UAE', city: 'Dubai', revenue: 820000000, ebitda: 246000000, growth: '8%', employees: 450, yearsInOp: 25 },
]

async function main() {
  console.log('🌱 Starting database seed...')
  console.log('━'.repeat(50))

  // Clear existing data
  console.log('🔄 Clearing existing data...')
  await prisma.dealProgressionHistory.deleteMany({})
  await prisma.dealMilestone.deleteMany({})
  await prisma.nDASignature.deleteMany({})
  await prisma.dataRoomAccess.deleteMany({})
  await prisma.dataRoom.deleteMany({})
  await prisma.enquiry.deleteMany({})
  await prisma.message.deleteMany({})
  await prisma.notification.deleteMany({})
  await prisma.brokerDelegation.deleteMany({})
  await prisma.transaction.deleteMany({})
  await prisma.buyerSeriousness.deleteMany({})
  await prisma.dealComparable.deleteMany({})
  await prisma.dealHeat.deleteMany({})
  await prisma.dealDocument.deleteMany({})
  await prisma.dealPipeline.deleteMany({})
  await prisma.savedDeal.deleteMany({})
  await prisma.deal.deleteMany({})
  await prisma.riskAssessment.deleteMany({})
  await prisma.fraudFlag.deleteMany({})
  await prisma.kYCSubmission.deleteMany({})
  await prisma.kYCDocument.deleteMany({})
  await prisma.user.deleteMany({})

  // Create demo users
  console.log('👥 Creating demo users...')
  const seller = await prisma.user.create({
    data: {
      email: 'seller@forward.com',
      name: 'Sarah Al-Mansouri',
      password: 'demo123',
      role: UserRole.SELLER,
      company: 'TechFlow Solutions',
      phone: '+971 50 123 4567',
      kycStatus: KYCStatus.VERIFIED,
      kycVerifiedAt: new Date(),
      verificationStatus: VerificationStatus.VERIFIED,
      riskScore: 15,
      riskLevel: RiskLevel.LOW,
      emailVerified: true,
      emailVerifiedAt: new Date(),
    },
  })

  const buyer = await prisma.user.create({
    data: {
      email: 'buyer@forward.com',
      name: 'Ahmed Al-Mazrouei',
      password: 'demo123',
      role: UserRole.BUYER,
      company: 'AlManara Capital Partners',
      phone: '+971 50 234 5678',
      kycStatus: KYCStatus.VERIFIED,
      kycVerifiedAt: new Date(),
      verificationStatus: VerificationStatus.VERIFIED,
      riskScore: 20,
      riskLevel: RiskLevel.LOW,
      investmentAmount: 500000000, // $5M AED
      emailVerified: true,
      emailVerifiedAt: new Date(),
    },
  })

  const broker = await prisma.user.create({
    data: {
      email: 'broker@forward.com',
      name: 'Fatima Al-Ketbi',
      password: 'demo123',
      role: UserRole.BROKER,
      company: 'Gulf Advisory Group',
      phone: '+971 50 345 6789',
      kycStatus: KYCStatus.VERIFIED,
      kycVerifiedAt: new Date(),
      verificationStatus: VerificationStatus.VERIFIED,
      riskScore: 18,
      riskLevel: RiskLevel.LOW,
      dealsClosed: 12,
      averageDealSize: 300000000,
      emailVerified: true,
      emailVerifiedAt: new Date(),
    },
  })

  console.log('✅ Created 3 demo users')

  // Create deals
  console.log('🏢 Creating deals...')
  const deals = []

  for (let i = 0; i < COMPANIES.length; i++) {
    const company = COMPANIES[i]
    const askingPrice = Math.round(company.revenue * (3 + Math.random() * 2))

    const deal = await prisma.deal.create({
      data: {
        title: company.name,
        description: `Leading ${company.industry.toLowerCase()} business based in ${company.city}, ${company.country}. Profitable, growing, and ready for new ownership.`,
        slug: company.name.toLowerCase().replace(/\s+/g, '-'),
        sellerId: seller.id,
        status: DealStatus.PUBLISHED,
        publishedAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
        industry: company.industry as IndustryType,
        country: company.country,
        city: company.city,
        revenue: BigInt(company.revenue),
        ebitda: BigInt(company.ebitda),
        grossMargin: 45 + Math.random() * 30,
        ebitdaMargin: (company.ebitda / company.revenue) * 100,
        askingPrice: BigInt(askingPrice),
        pricingMultiple: askingPrice / company.revenue,
        employees: company.employees,
        yearsInOperation: company.yearsInOp,
        foundedYear: new Date().getFullYear() - company.yearsInOp,
        reasonForSale: ['Founder retirement', 'Strategic exit', 'Family succession', 'Growth capital'][Math.floor(Math.random() * 4)],
        businessModel: ['B2B', 'B2C', 'B2B2C'][Math.floor(Math.random() * 3)],
        customerConcentration: Math.random() > 0.5 ? 'Top 3 customers = 35% revenue' : 'Diversified customer base',
        inventoryIncluded: Math.random() > 0.6,
        realEstateIncluded: Math.random() > 0.7,
        equipmentIncluded: Math.random() > 0.5,
        isFranchise: Math.random() > 0.9,
        views: Math.floor(Math.random() * 500) + 50,
        uniqueVisitors: Math.floor(Math.random() * 200) + 20,
        returningVisitors: Math.floor(Math.random() * 50) + 5,
        inquiries: Math.floor(Math.random() * 15) + 2,
        heatScore: Math.floor(Math.random() * 100),
        predictedCloseProb: Math.random() * 100,
        dealQualityScore: Math.floor(Math.random() * 100),
      },
    })
    deals.push(deal)
  }

  console.log(`✅ Created ${deals.length} deals`)

  // Create pipelines for each deal
  console.log('📊 Creating deal pipelines...')
  for (const deal of deals) {
    const stages = Object.values(DealPipelineStage)
    const randomStage = stages[Math.floor(Math.random() * stages.length)]

    await prisma.dealPipeline.create({
      data: {
        dealId: deal.id,
        currentStage: randomStage,
        progressPercent: Math.floor(Math.random() * 100),
        stageStartedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        estimatedClosingDate: new Date(Date.now() + (60 + Math.random() * 120) * 24 * 60 * 60 * 1000),
      },
    })
  }
  console.log('✅ Created deal pipelines')

  // Create heat maps
  console.log('🔥 Creating heat maps...')
  for (const deal of deals) {
    await prisma.dealHeat.create({
      data: {
        dealId: deal.id,
        viewsLastWeek: Math.floor(Math.random() * 100),
        inquiriesLastWeek: Math.floor(Math.random() * 20),
        buyerCompetition: Math.floor(Math.random() * 8),
        urgencyLevel: Math.floor(Math.random() * 10),
        brokerActivity: Math.floor(Math.random() * 10),
        heatScore: Math.floor(Math.random() * 100),
        trend: ['rising', 'stable', 'falling'][Math.floor(Math.random() * 3)],
      },
    })
  }
  console.log('✅ Created heat maps')

  // Create saved deals for buyer
  console.log('💾 Creating saved deals...')
  const randomDeals = deals.sort(() => Math.random() - 0.5).slice(0, 15)
  for (const deal of randomDeals) {
    await prisma.savedDeal.create({
      data: {
        userId: buyer.id,
        dealId: deal.id,
        notes: 'Interested in this opportunity',
      },
    })
  }
  console.log('✅ Created saved deals')

  // Create buyer seriousness scores
  console.log('🎯 Creating buyer seriousness scores...')
  for (const deal of deals.slice(0, 10)) {
    await prisma.buyerSeriousness.create({
      data: {
        dealId: deal.id,
        buyerId: buyer.id,
        seriousnessScore: Math.floor(Math.random() * 100),
        confidenceLevel: Math.floor(Math.random() * 100),
        signals: JSON.stringify({ documentViews: Math.random() > 0.5, dataRoomAccess: Math.random() > 0.5 }),
        lastEngagementAt: new Date(),
      },
    })
  }
  console.log('✅ Created buyer seriousness scores')

  // Create sample messages
  console.log('💬 Creating messages...')
  await prisma.message.create({
    data: {
      authorId: buyer.id,
      recipientId: seller.id,
      dealId: deals[0].id,
      messageType: MessageType.DEAL_INQUIRY,
      subject: 'Interest in ' + deals[0].title,
      content: 'Hello, I am very interested in your business. Can we schedule a call to discuss?',
      isRead: true,
    },
  })

  await prisma.message.create({
    data: {
      authorId: seller.id,
      recipientId: buyer.id,
      dealId: deals[0].id,
      messageType: MessageType.DIRECT_MESSAGE,
      subject: 'Re: Interest in ' + deals[0].title,
      content: 'Thank you for your interest! I would be happy to discuss the opportunity. How about Tuesday at 2 PM?',
      isRead: false,
    },
  })
  console.log('✅ Created messages')

  // Create data room for first deal
  console.log('📁 Creating data rooms...')
  const dataRoom = await prisma.dataRoom.create({
    data: {
      dealId: deals[0].id,
      sellerId: seller.id,
      title: `Data Room - ${deals[0].title}`,
      description: 'Complete financial and operational documents for due diligence',
      accessLevel: DocumentAccessLevel.INITIAL_INFO,
      ndaRequired: true,
      passwordProtected: true,
      documentsCount: 15,
    },
  })

  await prisma.dataRoomAccess.create({
    data: {
      dataRoomId: dataRoom.id,
      userId: buyer.id,
      accessLevel: DocumentAccessLevel.INITIAL_INFO,
      approvedAt: new Date(),
      ndaSigned: true,
      ndaSignedAt: new Date(),
    },
  })
  console.log('✅ Created data rooms')

  console.log('')
  console.log('━'.repeat(50))
  console.log('✨ Database seed completed successfully!')
  console.log('━'.repeat(50))
  console.log('')
  console.log('📋 Demo Accounts:')
  console.log('  • Seller:  seller@forward.com / demo123')
  console.log('  • Buyer:   buyer@forward.com / demo123')
  console.log('  • Broker:  broker@forward.com / demo123')
  console.log('')
  console.log(`📊 Data Summary:`)
  console.log(`  • Deals:        ${deals.length}`)
  console.log(`  • Users:        3`)
  console.log(`  • Pipelines:    ${deals.length}`)
  console.log(`  • Heat Maps:    ${deals.length}`)
  console.log(`  • Data Rooms:   1`)
  console.log(`  • Messages:     2`)
  console.log('')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

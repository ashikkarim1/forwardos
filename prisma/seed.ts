import { PrismaClient, IndustryType, DealStatus, UserRole } from '@prisma/client'

const prisma = new PrismaClient()

const COMPANIES = [
  // Tech & SaaS
  { name: 'TechFlow Solutions', industry: 'SAAS', country: 'UAE', city: 'Dubai', revenue: 2500000, ebitda: 750000, growth: '45%' },
  { name: 'CloudCore Infrastructure', industry: 'SAAS', country: 'UAE', city: 'Abu Dhabi', revenue: 4200000, ebitda: 1260000, growth: '52%' },
  { name: 'DataStream Analytics', industry: 'SAAS', country: 'KSA', city: 'Riyadh', revenue: 1800000, ebitda: 540000, growth: '38%' },
  { name: 'SecureVault Systems', industry: 'SAAS', country: 'UAE', city: 'Dubai', revenue: 3100000, ebitda: 930000, growth: '41%' },
  { name: 'NextGen AI Platform', industry: 'SAAS', country: 'UAE', city: 'Dubai', revenue: 2100000, ebitda: 630000, growth: '58%' },
  { name: 'Quantum Analytics', industry: 'SAAS', country: 'KSA', city: 'Jeddah', revenue: 1600000, ebitda: 480000, growth: '35%' },

  // Healthcare
  { name: 'Emirates Healthcare Network', industry: 'HEALTHCARE', country: 'UAE', city: 'Dubai', revenue: 5200000, ebitda: 1560000, growth: '28%' },
  { name: 'MedTech Innovations', industry: 'HEALTHCARE', country: 'UAE', city: 'Abu Dhabi', revenue: 3800000, ebitda: 1140000, growth: '32%' },
  { name: 'Wellness Solutions GCC', industry: 'HEALTHCARE', country: 'KSA', city: 'Riyadh', revenue: 2900000, ebitda: 870000, growth: '25%' },
  { name: 'Diagnostic Centers Plus', industry: 'HEALTHCARE', country: 'UAE', city: 'Dubai', revenue: 4100000, ebitda: 1230000, growth: '22%' },
  { name: 'Pharma Distribution ME', industry: 'HEALTHCARE', country: 'KSA', city: 'Riyadh', revenue: 6200000, ebitda: 1860000, growth: '18%' },

  // Retail & E-Commerce
  { name: 'RetailCo Stores', industry: 'RETAIL', country: 'UAE', city: 'Dubai', revenue: 8900000, ebitda: 1780000, growth: '15%' },
  { name: 'NextGen E-Commerce', industry: 'ECOMMERCE', country: 'UAE', city: 'Abu Dhabi', revenue: 3400000, ebitda: 680000, growth: '62%' },
  { name: 'Fashion Hub Middle East', industry: 'RETAIL', country: 'KSA', city: 'Jeddah', revenue: 5600000, ebitda: 1120000, growth: '20%' },
  { name: 'Luxury Goods Distributor', industry: 'RETAIL', country: 'UAE', city: 'Dubai', revenue: 12000000, ebitda: 3600000, growth: '12%' },
  { name: 'Online Marketplace GCC', industry: 'ECOMMERCE', country: 'KSA', city: 'Riyadh', revenue: 2800000, ebitda: 840000, growth: '71%' },

  // Manufacturing
  { name: 'Precision Manufacturing', industry: 'MANUFACTURING', country: 'UAE', city: 'Ajman', revenue: 7200000, ebitda: 1440000, growth: '18%' },
  { name: 'Industrial Solutions ME', industry: 'MANUFACTURING', country: 'KSA', city: 'Jeddah', revenue: 6500000, ebitda: 1300000, growth: '14%' },
  { name: 'Advanced Composites Inc', industry: 'MANUFACTURING', country: 'UAE', city: 'Sharjah', revenue: 4800000, ebitda: 960000, growth: '22%' },
  { name: 'Metal Works & Fabrication', industry: 'MANUFACTURING', country: 'UAE', city: 'Dubai', revenue: 5100000, ebitda: 1020000, growth: '16%' },
  { name: 'Specialty Products Mfg', industry: 'MANUFACTURING', country: 'KSA', city: 'Dammam', revenue: 3600000, ebitda: 720000, growth: '19%' },

  // FinTech & Finance
  { name: 'FintechFlow Banking', industry: 'FINTECH', country: 'UAE', city: 'Dubai', revenue: 4200000, ebitda: 1260000, growth: '48%' },
  { name: 'AlManara Finance', industry: 'FINTECH', country: 'UAE', city: 'Abu Dhabi', revenue: 3100000, ebitda: 930000, growth: '55%' },
  { name: 'Digital Payment Solutions', industry: 'FINTECH', country: 'KSA', city: 'Riyadh', revenue: 2600000, ebitda: 780000, growth: '64%' },
  { name: 'Investment Advisory ME', industry: 'FINTECH', country: 'UAE', city: 'Dubai', revenue: 1900000, ebitda: 570000, growth: '52%' },
  { name: 'Blockchain Solutions Inc', industry: 'FINTECH', country: 'UAE', city: 'Dubai', revenue: 1400000, ebitda: 420000, growth: '75%' },

  // Services
  { name: 'Digital Marketing Pro', industry: 'SERVICES', country: 'UAE', city: 'Dubai', revenue: 2100000, ebitda: 630000, growth: '48%' },
  { name: 'Consulting & Advisory Group', industry: 'SERVICES', country: 'UAE', city: 'Abu Dhabi', revenue: 3800000, ebitda: 1140000, growth: '28%' },
  { name: 'Gulf Logistics Hub', industry: 'SERVICES', country: 'UAE', city: 'Dubai', revenue: 5600000, ebitda: 1120000, growth: '22%' },
  { name: 'HR Solutions MENA', industry: 'SERVICES', country: 'KSA', city: 'Riyadh', revenue: 1600000, ebitda: 480000, growth: '35%' },
  { name: 'Legal Services Network', industry: 'SERVICES', country: 'UAE', city: 'Dubai', revenue: 2800000, ebitda: 840000, growth: '18%' },

  // Hospitality
  { name: 'Premium Hotels Group', industry: 'HOSPITALITY', country: 'UAE', city: 'Dubai', revenue: 11200000, ebitda: 2240000, growth: '16%' },
  { name: 'Resort & Spa Operator', industry: 'HOSPITALITY', country: 'UAE', city: 'Abu Dhabi', revenue: 6800000, ebitda: 1360000, growth: '12%' },
  { name: 'Restaurant Chain GCC', industry: 'HOSPITALITY', country: 'KSA', city: 'Jeddah', revenue: 4200000, ebitda: 840000, growth: '24%' },
  { name: 'Tourism & Travel Agency', industry: 'HOSPITALITY', country: 'UAE', city: 'Dubai', revenue: 2900000, ebitda: 580000, growth: '32%' },
  { name: 'Event Management Services', industry: 'HOSPITALITY', country: 'KSA', city: 'Riyadh', revenue: 1800000, ebitda: 360000, growth: '28%' },

  // Education & EdTech
  { name: 'EdTech Innovators', industry: 'SERVICES', country: 'UAE', city: 'Dubai', revenue: 1900000, ebitda: 570000, growth: '62%' },
  { name: 'Online Learning Platform', industry: 'SERVICES', country: 'UAE', city: 'Abu Dhabi', revenue: 1200000, ebitda: 360000, growth: '71%' },
  { name: 'Training & Development ME', industry: 'SERVICES', country: 'KSA', city: 'Riyadh', revenue: 1600000, ebitda: 480000, growth: '42%' },
  { name: 'International School Group', industry: 'SERVICES', country: 'UAE', city: 'Dubai', revenue: 8200000, ebitda: 2460000, growth: '8%' },

  // Energy & Renewable
  { name: 'Renewable Energy Solutions', industry: 'MANUFACTURING', country: 'UAE', city: 'Abu Dhabi', revenue: 7800000, ebitda: 2340000, growth: '35%' },
  { name: 'Solar Installation Services', industry: 'SERVICES', country: 'UAE', city: 'Dubai', revenue: 2400000, ebitda: 720000, growth: '48%' },
  { name: 'Energy Efficiency Tech', industry: 'SAAS', country: 'KSA', city: 'Riyadh', revenue: 1300000, ebitda: 390000, growth: '55%' },
  { name: 'Sustainable Solutions Inc', industry: 'SERVICES', country: 'UAE', city: 'Dubai', revenue: 2100000, ebitda: 630000, growth: '42%' },

  // Real Estate & Property
  { name: 'Real Estate Ventures', industry: 'SERVICES', country: 'UAE', city: 'Dubai', revenue: 9200000, ebitda: 2760000, growth: '14%' },
  { name: 'Property Management ME', industry: 'SERVICES', country: 'UAE', city: 'Abu Dhabi', revenue: 3600000, ebitda: 1080000, growth: '20%' },
  { name: 'Construction Services', industry: 'SERVICES', country: 'KSA', city: 'Riyadh', revenue: 12800000, ebitda: 2560000, growth: '12%' },
  { name: 'Developer & Builder Group', industry: 'SERVICES', country: 'UAE', city: 'Dubai', revenue: 15200000, ebitda: 3040000, growth: '10%' },

  // Biotech & Research
  { name: 'BioMed Research Labs', industry: 'HEALTHCARE', country: 'UAE', city: 'Abu Dhabi', revenue: 3200000, ebitda: 960000, growth: '52%' },
  { name: 'Life Sciences Innovation', industry: 'HEALTHCARE', country: 'UAE', city: 'Dubai', revenue: 2100000, ebitda: 630000, growth: '58%' },
  { name: 'Clinical Trials Network', industry: 'HEALTHCARE', country: 'KSA', city: 'Riyadh', revenue: 1800000, ebitda: 540000, growth: '48%' },

  // Consumer & CPG
  { name: 'ConsumerTech Retail', industry: 'RETAIL', country: 'UAE', city: 'Dubai', revenue: 6100000, ebitda: 1220000, growth: '32%' },
  { name: 'Food & Beverage Producer', industry: 'MANUFACTURING', country: 'UAE', city: 'Ajman', revenue: 8400000, ebitda: 1680000, growth: '18%' },
  { name: 'Beauty & Personal Care', industry: 'RETAIL', country: 'KSA', city: 'Jeddah', revenue: 4800000, ebitda: 960000, growth: '28%' },
  { name: 'Consumer Goods Distribution', industry: 'SERVICES', country: 'UAE', city: 'Dubai', revenue: 7200000, ebitda: 1440000, growth: '14%' },

  // Media & Entertainment
  { name: 'Media Production House', industry: 'SERVICES', country: 'UAE', city: 'Dubai', revenue: 2800000, ebitda: 840000, growth: '35%' },
  { name: 'Digital Content Platform', industry: 'SAAS', country: 'UAE', city: 'Abu Dhabi', revenue: 1600000, ebitda: 480000, growth: '68%' },
  { name: 'Entertainment Group ME', industry: 'SERVICES', country: 'KSA', city: 'Riyadh', revenue: 3100000, ebitda: 930000, growth: '32%' },

  // Automotive
  { name: 'Auto Dealership Group', industry: 'RETAIL', country: 'UAE', city: 'Dubai', revenue: 14200000, ebitda: 2840000, growth: '11%' },
  { name: 'Vehicle Maintenance Services', industry: 'SERVICES', country: 'UAE', city: 'Abu Dhabi', revenue: 2900000, ebitda: 870000, growth: '22%' },
  { name: 'Auto Parts Distributor', industry: 'RETAIL', country: 'KSA', city: 'Dammam', revenue: 5200000, ebitda: 1040000, growth: '16%' },
  { name: 'Fleet Management Solutions', industry: 'SAAS', country: 'UAE', city: 'Dubai', revenue: 1700000, ebitda: 510000, growth: '54%' },

  // Agriculture
  { name: 'Agri-Tech Solutions', industry: 'SAAS', country: 'UAE', city: 'Abu Dhabi', revenue: 1100000, ebitda: 330000, growth: '72%' },
  { name: 'Farming & Agriculture ME', industry: 'SERVICES', country: 'KSA', city: 'Riyadh', revenue: 2600000, ebitda: 520000, growth: '28%' },
  { name: 'Organic Products Producer', industry: 'MANUFACTURING', country: 'UAE', city: 'Fujairah', revenue: 1800000, ebitda: 360000, growth: '42%' },

  // Additional diverse companies
  { name: 'Water Treatment Systems', industry: 'MANUFACTURING', country: 'UAE', city: 'Abu Dhabi', revenue: 3400000, ebitda: 680000, growth: '24%' },
  { name: 'Waste Management Services', industry: 'SERVICES', country: 'UAE', city: 'Dubai', revenue: 2700000, ebitda: 810000, growth: '18%' },
  { name: 'Cybersecurity Firm', industry: 'SAAS', country: 'UAE', city: 'Dubai', revenue: 2300000, ebitda: 690000, growth: '62%' },
  { name: 'IT Outsourcing Services', industry: 'SERVICES', country: 'UAE', city: 'Abu Dhabi', revenue: 4100000, ebitda: 1230000, growth: '35%' },
  { name: 'Telecom Solutions', industry: 'FINTECH', country: 'KSA', city: 'Riyadh', revenue: 3800000, ebitda: 1140000, growth: '28%' },
  { name: 'Business Intelligence Platform', industry: 'SAAS', country: 'UAE', city: 'Dubai', revenue: 1900000, ebitda: 570000, growth: '59%' },
  { name: 'Mobile App Development', industry: 'SERVICES', country: 'UAE', city: 'Dubai', revenue: 1300000, ebitda: 390000, growth: '54%' },
  { name: 'Cloud Hosting Provider', industry: 'SAAS', country: 'UAE', city: 'Abu Dhabi', revenue: 2200000, ebitda: 660000, growth: '51%' },
  { name: 'Supply Chain Software', industry: 'SAAS', country: 'UAE', city: 'Dubai', revenue: 1800000, ebitda: 540000, growth: '48%' },
  { name: 'Project Management Tools', industry: 'SAAS', country: 'KSA', city: 'Riyadh', revenue: 1500000, ebitda: 450000, growth: '65%' },
]

async function main() {
  console.log('Starting database seed...')

  // Delete existing data (careful with this!)
  await prisma.deal.deleteMany({})
  await prisma.user.deleteMany({})

  // Create demo users
  const seller = await prisma.user.create({
    data: {
      email: 'seller@forward.com',
      name: 'Sarah Al-Mansouri',
      password: 'demo123', // In production, hash this!
      role: 'SELLER',
      company: 'TechFlow Solutions',
      phone: '+971 50 123 4567',
      kycStatus: 'VERIFIED',
    },
  })

  const buyer = await prisma.user.create({
    data: {
      email: 'buyer@forward.com',
      name: 'Ahmed Al-Mazrouei',
      password: 'demo123',
      role: 'BUYER',
      company: 'AlManara Capital Partners',
      phone: '+971 50 234 5678',
      kycStatus: 'VERIFIED',
    },
  })

  const broker = await prisma.user.create({
    data: {
      email: 'broker@forward.com',
      name: 'Fatima Al-Ketbi',
      password: 'demo123',
      role: 'BROKER',
      company: 'Gulf Advisory Group',
      phone: '+971 50 345 6789',
      kycStatus: 'VERIFIED',
    },
  })

  console.log('Created demo users')

  // Create 100 deals
  const dealsToCreate = COMPANIES.map((company, index) => ({
    title: company.name,
    description: `${company.name} is a leading ${company.industry.toLowerCase()} business based in ${company.city}, ${company.country}. Established business with strong fundamentals and growth potential.`,
    status: 'PUBLISHED' as DealStatus,
    sellerId: seller.id,
    industry: company.industry as IndustryType,
    revenue: company.revenue,
    ebitda: company.ebitda,
    askingPrice: Math.round(company.revenue * (3 + Math.random() * 2)), // 3-5x revenue
    employees: Math.round(Math.random() * 200) + 10,
    yearsInOperation: Math.round(Math.random() * 15) + 3,
    reasonForSale: ['Founder retirement', 'Strategic exit', 'Family succession', 'Growth opportunity'][Math.floor(Math.random() * 4)],
    country: company.country,
    city: company.city,
    inventoryIncluded: Math.random() > 0.7,
    realEstateIncluded: Math.random() > 0.8,
    isFranchise: Math.random() > 0.9,
    views: Math.floor(Math.random() * 500) + 50,
    uniqueVisitors: Math.floor(Math.random() * 200) + 20,
    returningVisitors: Math.floor(Math.random() * 50) + 5,
    inquiries: Math.floor(Math.random() * 30) + 2,
    publishedAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000), // Last 90 days
  }))

  const createdDeals = await prisma.deal.createMany({
    data: dealsToCreate,
  })

  console.log(`Created ${createdDeals.count} deals`)

  // Create DealPipeline for each deal
  const deals = await prisma.deal.findMany({
    take: 100,
  })

  for (const deal of deals) {
    await prisma.dealPipeline.create({
      data: {
        dealId: deal.id,
        currentStage: 'INTEREST',
        progressPercent: Math.floor(Math.random() * 60),
        stageStartedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        estimatedClosingDate: new Date(Date.now() + (60 + Math.random() * 120) * 24 * 60 * 60 * 1000),
      },
    })
  }

  console.log('Created deal pipeline records')

  // Create some saved deals for buyer
  const randomDeals = deals.sort(() => Math.random() - 0.5).slice(0, 15)
  for (const deal of randomDeals) {
    await prisma.savedDeal.create({
      data: {
        userId: buyer.id,
        dealId: deal.id,
      },
    })
  }

  console.log('Created saved deals for buyer')

  console.log('✅ Database seed completed successfully!')
  console.log('')
  console.log('Demo Accounts:')
  console.log('  Seller: seller@forward.com / demo123')
  console.log('  Buyer: buyer@forward.com / demo123')
  console.log('  Broker: broker@forward.com / demo123')
  console.log('')
  console.log(`Total deals created: ${deals.length}`)
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

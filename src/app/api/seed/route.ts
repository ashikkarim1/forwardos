import { NextRequest, NextResponse } from 'next/server'

// NOTE: This is for development/testing only
// In production, this endpoint should be protected or removed

export async function POST(request: NextRequest) {
  try {
    // Seed 10 test companies
    const testListings = [
      {
        businessName: 'TechFlow Solutions',
        industry: 'SaaS / Software',
        country: 'UAE',
        city: 'Dubai',
        revenue: 5000000,
        ebitda: 1500000,
        askingPrice: 12000000,
        employees: 25,
        yearsInOperation: 5,
        description: 'Cloud-based business process automation platform serving mid-market enterprises across MENA region. 90% customer retention, 40% YoY growth. Strong technical team with enterprise SaaS experience.',
        reasonForSale: 'Growth Capital',
        inventoryIncluded: false,
        realEstateIncluded: false,
        franchiseStatus: false,
        status: 'published',
      },
      {
        businessName: 'DubaiRetail Group',
        industry: 'Retail',
        country: 'UAE',
        city: 'Dubai',
        revenue: 8000000,
        ebitda: 1200000,
        askingPrice: 9600000,
        employees: 45,
        yearsInOperation: 8,
        description: 'Multi-brand luxury retail business with 5 flagship locations across Dubai and Abu Dhabi. Exclusive distribution agreements with premium international brands. Strong supplier relationships and loyal customer base.',
        reasonForSale: 'Owner Retirement',
        inventoryIncluded: true,
        realEstateIncluded: false,
        franchiseStatus: false,
        status: 'published',
      },
      {
        businessName: 'Gulf Logistics Express',
        industry: 'Professional Services',
        country: 'UAE',
        city: 'Abu Dhabi',
        revenue: 3000000,
        ebitda: 600000,
        askingPrice: 4500000,
        employees: 18,
        yearsInOperation: 4,
        description: 'Full-service logistics and warehousing provider specializing in pharmaceutical and automotive supplies. Licensed JAFZA operations, certified for temperature-controlled storage. Growing fleet and expanding customer roster.',
        reasonForSale: 'Strategic Exit',
        inventoryIncluded: false,
        realEstateIncluded: true,
        franchiseStatus: false,
        status: 'published',
      },
      {
        businessName: 'Emirates Healthcare Network',
        industry: 'Healthcare',
        country: 'UAE',
        city: 'Dubai',
        revenue: 12000000,
        ebitda: 3000000,
        askingPrice: 39000000,
        employees: 120,
        yearsInOperation: 12,
        description: 'Multi-specialty private clinic network with 3 locations, 80+ physicians, and advanced diagnostic facilities. ISO 9001 certified. Strong patient base with growing health insurance partnerships. Attractive margins and recurring revenue.',
        reasonForSale: 'Growth Capital',
        inventoryIncluded: false,
        realEstateIncluded: false,
        franchiseStatus: false,
        status: 'published',
      },
      {
        businessName: 'FinTech Innovations UAE',
        industry: 'FinTech',
        country: 'UAE',
        city: 'Dubai',
        revenue: 7000000,
        ebitda: 2100000,
        askingPrice: 21000000,
        employees: 35,
        yearsInOperation: 6,
        description: 'B2B payment processing and financial tech platform with 500+ merchant partners and AED 200M monthly transaction volume. SCA/3D Secure compliant, multiple payment gateway integrations. Scalable, recurring revenue model.',
        reasonForSale: 'Growth Capital',
        inventoryIncluded: false,
        realEstateIncluded: false,
        franchiseStatus: false,
        status: 'published',
      },
      {
        businessName: 'AlManufacturing LLC',
        industry: 'Manufacturing',
        country: 'UAE',
        city: 'Sharjah',
        revenue: 15000000,
        ebitda: 2250000,
        askingPrice: 18000000,
        employees: 85,
        yearsInOperation: 10,
        description: 'Industrial machinery parts manufacturing with modern CNC capabilities. Government approved vendor for 8 major enterprises. 95% on-time delivery rate. Strong relationships with OEMs. Upgrade-ready facility.',
        reasonForSale: 'Owner Retirement',
        inventoryIncluded: true,
        realEstateIncluded: true,
        franchiseStatus: false,
        status: 'published',
      },
      {
        businessName: 'eCommerce UAE',
        industry: 'E-commerce',
        country: 'UAE',
        city: 'Dubai',
        revenue: 4000000,
        ebitda: 800000,
        askingPrice: 6400000,
        employees: 22,
        yearsInOperation: 3,
        description: 'Fast-growing fashion e-commerce platform with 50,000 monthly active users. Direct supplier relationships reduce costs. Mobile-first UX, 60% repeat customers. Inventory funded, ready for new owner.',
        reasonForSale: 'Growth Capital',
        inventoryIncluded: false,
        realEstateIncluded: false,
        franchiseStatus: false,
        status: 'published',
      },
      {
        businessName: 'Hospitality Group Middle East',
        industry: 'Hospitality',
        country: 'UAE',
        city: 'Dubai',
        revenue: 6000000,
        ebitda: 900000,
        askingPrice: 9000000,
        employees: 60,
        yearsInOperation: 7,
        description: 'Upscale boutique hotel and catering service with 150-room operation and banquet facilities. Licensed kitchen, professional F&B team, consistent occupancy rates. Strong corporate event bookings pipeline.',
        reasonForSale: 'Health Reasons',
        inventoryIncluded: false,
        realEstateIncluded: true,
        franchiseStatus: false,
        status: 'published',
      },
      {
        businessName: 'Business Consulting Group',
        industry: 'Professional Services',
        country: 'UAE',
        city: 'Abu Dhabi',
        revenue: 2500000,
        ebitda: 500000,
        askingPrice: 3750000,
        employees: 12,
        yearsInOperation: 3,
        description: 'Management consulting firm specializing in digital transformation for UAE enterprises. Strong advisory network, 100% client retention. All work product owned by firm. Scalable service delivery model.',
        reasonForSale: 'Other',
        inventoryIncluded: false,
        realEstateIncluded: false,
        franchiseStatus: false,
        status: 'published',
      },
      {
        businessName: 'Premium Tech Consulting',
        industry: 'Professional Services',
        country: 'UAE',
        city: 'Dubai',
        revenue: 9000000,
        ebitda: 2700000,
        askingPrice: 24300000,
        employees: 42,
        yearsInOperation: 9,
        description: 'Boutique IT consulting firm serving Fortune 500 companies with cybersecurity and cloud transformation expertise. Recurring managed services revenue (70% of total). Certified partners with major tech vendors. Low churn, high margins.',
        reasonForSale: 'Strategic Exit',
        inventoryIncluded: false,
        realEstateIncluded: false,
        franchiseStatus: false,
        status: 'published',
      },
    ]

    // Call the listings API to create all 10
    const results = []
    for (const listing of testListings) {
      try {
        const response = await fetch('http://localhost:3000/api/listings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(listing),
        })
        const data = await response.json()
        results.push({
          name: listing.businessName,
          status: response.ok ? 'created' : 'failed',
          data,
        })
      } catch (error) {
        results.push({
          name: listing.businessName,
          status: 'error',
          error: String(error),
        })
      }
    }

    return NextResponse.json({
      message: 'Seeding complete',
      count: results.length,
      results,
    })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json({ error: 'Seeding failed' }, { status: 500 })
  }
}

// GET endpoint returns seeded companies list
export async function GET(request: NextRequest) {
  const testCompanies = [
    'TechFlow Solutions',
    'DubaiRetail Group',
    'Gulf Logistics Express',
    'Emirates Healthcare Network',
    'FinTech Innovations UAE',
    'AlManufacturing LLC',
    'eCommerce UAE',
    'Hospitality Group Middle East',
    'Business Consulting Group',
    'Premium Tech Consulting',
  ]

  return NextResponse.json({
    message: 'Test seed data available',
    companies: testCompanies,
    count: testCompanies.length,
    endpoint: 'POST /api/seed to create all 10 listings',
  })
}

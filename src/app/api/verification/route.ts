import { NextRequest, NextResponse } from 'next/server'

interface VerificationRequest {
  id: string
  companyName: string
  legalName: string
  email: string
  phone: string
  website?: string
  linkedinProfile?: string
  yearsInBusiness: number
  dealHistory: number
  status: 'pending' | 'approved' | 'rejected'
  riskScore: number
  createdAt: string
}

const mockVerifications: VerificationRequest[] = [
  {
    id: 'verify_1',
    companyName: 'Goldman Partners LLC',
    legalName: 'Goldman Partners, LLC',
    email: 'team@goldmanpartners.com',
    phone: '+1-212-555-1234',
    website: 'goldmanpartners.com',
    linkedinProfile: 'linkedin.com/company/goldman-partners',
    yearsInBusiness: 25,
    dealHistory: 150,
    status: 'approved',
    riskScore: 15,
    createdAt: '2026-06-01',
  },
  {
    id: 'verify_2',
    companyName: 'TechVentures Advisors',
    legalName: 'TechVentures Advisors, Inc.',
    email: 'hello@techventures.io',
    phone: '+1-650-555-9876',
    website: 'techventures.io',
    yearsInBusiness: 8,
    dealHistory: 45,
    status: 'approved',
    riskScore: 32,
    createdAt: '2026-06-02',
  },
  {
    id: 'verify_3',
    companyName: 'New Deal Associates',
    legalName: 'New Deal Associates LLC',
    email: 'contact@newdealassociates.com',
    phone: '+1-415-555-4321',
    yearsInBusiness: 1,
    dealHistory: 2,
    status: 'pending',
    riskScore: 68,
    createdAt: '2026-06-05',
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    let verifications = mockVerifications

    if (status) {
      verifications = verifications.filter(v => v.status === status)
    }

    const stats = {
      total: mockVerifications.length,
      approved: mockVerifications.filter(v => v.status === 'approved').length,
      pending: mockVerifications.filter(v => v.status === 'pending').length,
      rejected: mockVerifications.filter(v => v.status === 'rejected').length,
      avgRiskScore: Math.round(
        mockVerifications.reduce((sum, v) => sum + v.riskScore, 0) / mockVerifications.length
      ),
    }

    return NextResponse.json({
      verifications,
      stats,
      count: verifications.length,
      success: true,
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch verifications', success: false },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      companyName,
      legalName,
      email,
      phone,
      website,
      linkedinProfile,
      yearsInBusiness,
      dealHistory,
    } = body

    // Simple risk scoring (0-100)
    let riskScore = 50 // Base score

    // License/registration (-20 to +25)
    if (legalName) riskScore -= 20

    // Business maturity (-15 to +20)
    if (yearsInBusiness >= 10) riskScore -= 15
    else if (yearsInBusiness >= 5) riskScore -= 10
    else if (yearsInBusiness >= 2) riskScore -= 5
    else if (yearsInBusiness < 1) riskScore += 20

    // Deal history (-15 to +10)
    if (dealHistory >= 50) riskScore -= 15
    else if (dealHistory >= 20) riskScore -= 10
    else if (dealHistory >= 5) riskScore -= 5
    else if (dealHistory === 0) riskScore += 10

    // Web presence (-5 each)
    if (website) riskScore -= 5
    if (linkedinProfile) riskScore -= 5

    riskScore = Math.max(0, Math.min(100, riskScore))

    const verification: VerificationRequest = {
      id: `verify_${Date.now()}`,
      companyName,
      legalName,
      email,
      phone,
      website,
      linkedinProfile,
      yearsInBusiness,
      dealHistory,
      status: 'pending',
      riskScore,
      createdAt: new Date().toISOString().split('T')[0],
    }

    return NextResponse.json({
      verification,
      status: riskScore < 40 ? 'approved' : 'pending',
      message: riskScore < 40 ? 'Application approved!' : 'Under review',
      success: true,
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to submit verification', success: false },
      { status: 500 }
    )
  }
}

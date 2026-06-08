import { NextRequest, NextResponse } from 'next/server'

interface KYCStatus {
  userId: string
  status: 'not_started' | 'in_progress' | 'completed' | 'failed' | 'expired'
  completionPercentage: number
  steps: {
    name: string
    status: 'pending' | 'completed' | 'failed'
    completedAt?: string
  }[]
  riskScore: number
  riskLevel: 'low' | 'medium' | 'high'
  verificationId?: string
  lastVerificationDate?: string
  expiryDate?: string
  approvalStatus: 'approved' | 'rejected' | 'pending_review'
  notes?: string[]
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId parameter' },
        { status: 400 }
      )
    }

    // Mock KYC Status - in production, fetch from database
    const mockStatus: KYCStatus = {
      userId,
      status: 'completed',
      completionPercentage: 100,
      steps: [
        {
          name: 'Personal Information',
          status: 'completed',
          completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          name: 'Identity Verification',
          status: 'completed',
          completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          name: 'Address Verification',
          status: 'completed',
          completedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          name: 'Credential Verification',
          status: 'completed',
          completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          name: 'Final Approval',
          status: 'completed',
          completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ],
      riskScore: 92,
      riskLevel: 'low',
      verificationId: `KYC-${Date.now()}-verified`,
      lastVerificationDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      approvalStatus: 'approved',
      notes: ['Identity verified against government database', 'No sanctions matches found', 'Low risk profile'],
    }

    return NextResponse.json(mockStatus, { status: 200 })
  } catch (error) {
    console.error('KYC status error:', error)
    return NextResponse.json({ error: 'Failed to fetch KYC status' }, { status: 500 })
  }
}

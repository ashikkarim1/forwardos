import { NextRequest, NextResponse } from 'next/server'

interface KYCVerificationRequest {
  userId: string
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  nationality: string
  address: string
  city: string
  state: string
  country: string
  zipCode: string
  idType: string
  idNumber: string
  userType: 'buyer' | 'seller' | 'broker'
  companyName?: string
  companyRegistration?: string
}

interface VerificationResult {
  success: boolean
  userId: string
  verificationId: string
  status: 'pending' | 'verified' | 'failed' | 'manual_review'
  checks: {
    identity: { passed: boolean; score: number; details: string }
    address: { passed: boolean; score: number; details: string }
    sanctions: { passed: boolean; score: number; details: string }
    pep: { passed: boolean; score: number; details: string }
    aml: { passed: boolean; score: number; details: string }
  }
  overallScore: number
  riskLevel: 'low' | 'medium' | 'high'
  message: string
  nextSteps: string[]
}

// Simulated verification checks
function performIdentityCheck(firstName: string, lastName: string, idType: string, idNumber: string): {
  passed: boolean
  score: number
  details: string
} {
  // Basic validation - in production, this would check against government databases
  const isValid = firstName && lastName && idType && idNumber && idNumber.length > 3
  return {
    passed: isValid,
    score: isValid ? 95 : 20,
    details: isValid
      ? `Government ID (${idType}) validated successfully`
      : 'Government ID validation failed - please re-submit',
  }
}

function performAddressCheck(address: string, city: string, country: string): {
  passed: boolean
  score: number
  details: string
} {
  const isValid = address && city && country
  return {
    passed: isValid,
    score: isValid ? 90 : 15,
    details: isValid ? 'Address verified against public records' : 'Address information incomplete',
  }
}

function performSanctionsCheck(firstName: string, lastName: string, country: string): {
  passed: boolean
  score: number
  details: string
} {
  // In production, check against OFAC, UN, EU sanctions lists
  const sanctionedCountries = ['North Korea', 'Iran', 'Syria', 'Cuba']
  const isSanctioned = sanctionedCountries.includes(country)

  return {
    passed: !isSanctioned,
    score: isSanctioned ? 0 : 100,
    details: isSanctioned
      ? `Country ${country} is on restricted list`
      : 'No sanctions match found (OFAC/UN/EU lists)',
  }
}

function performPEPCheck(firstName: string, lastName: string): {
  passed: boolean
  score: number
  details: string
} {
  // In production, check PEP database
  // This is a mock check - high-risk names like "Vladimir Putin" would fail
  const isPEP = false // Mock: not PEP

  return {
    passed: !isPEP,
    score: isPEP ? 20 : 100,
    details: isPEP
      ? 'Individual flagged as Politically Exposed Person'
      : 'No PEP flags detected',
  }
}

function performAMLCheck(companyName?: string): {
  passed: boolean
  score: number
  details: string
} {
  // In production, check AML databases
  const hasMatch = false // Mock: no AML matches

  return {
    passed: !hasMatch,
    score: hasMatch ? 0 : 100,
    details: hasMatch
      ? 'Potential AML match detected - manual review required'
      : 'No AML matches detected',
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: KYCVerificationRequest = await request.json()

    // Validate required fields
    const requiredFields = ['userId', 'firstName', 'lastName', 'email', 'idType', 'idNumber']
    const missingFields = requiredFields.filter(field => !body[field as keyof KYCVerificationRequest])

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Missing required fields: ${missingFields.join(', ')}`,
        },
        { status: 400 }
      )
    }

    // Perform verification checks
    const identityCheck = performIdentityCheck(body.firstName, body.lastName, body.idType, body.idNumber)
    const addressCheck = performAddressCheck(body.address, body.city, body.country)
    const sanctionsCheck = performSanctionsCheck(body.firstName, body.lastName, body.country)
    const pepCheck = performPEPCheck(body.firstName, body.lastName)
    const amlCheck = performAMLCheck(body.companyName)

    // Calculate overall score
    const scores = [
      identityCheck.score,
      addressCheck.score,
      sanctionsCheck.score,
      pepCheck.score,
      amlCheck.score,
    ]
    const overallScore = Math.round(scores.reduce((a, b) => a + b) / scores.length)

    // Determine risk level
    let riskLevel: 'low' | 'medium' | 'high' = 'low'
    if (overallScore < 50) riskLevel = 'high'
    else if (overallScore < 75) riskLevel = 'medium'

    // Determine status
    let status: 'pending' | 'verified' | 'failed' | 'manual_review' = 'pending'
    const allChecksPassed =
      identityCheck.passed && addressCheck.passed && sanctionsCheck.passed && pepCheck.passed && amlCheck.passed

    if (allChecksPassed && overallScore >= 80) {
      status = 'verified'
    } else if (riskLevel === 'high' || !identityCheck.passed || !sanctionsCheck.passed) {
      status = 'failed'
    } else if (riskLevel === 'medium') {
      status = 'manual_review'
    }

    // Generate next steps
    const nextSteps: string[] = []
    if (!identityCheck.passed) nextSteps.push('Re-submit government ID with better quality')
    if (!addressCheck.passed) nextSteps.push('Provide proof of address (utility bill or bank statement)')
    if (riskLevel === 'medium') nextSteps.push('Verification under manual review - will complete within 24 hours')
    if (status === 'verified') {
      if (body.userType === 'seller')
        nextSteps.push('Upload business registration and proof of ownership documents')
      else if (body.userType === 'buyer')
        nextSteps.push('Upload proof of funds (bank statement or LOI)')
      else if (body.userType === 'broker') nextSteps.push('Upload professional certifications and licenses')
    }

    const result: VerificationResult = {
      success: true,
      userId: body.userId,
      verificationId: `KYC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      status,
      checks: {
        identity: identityCheck,
        address: addressCheck,
        sanctions: sanctionsCheck,
        pep: pepCheck,
        aml: amlCheck,
      },
      overallScore,
      riskLevel,
      message:
        status === 'verified'
          ? 'Your identity has been verified successfully!'
          : status === 'manual_review'
            ? 'Your verification is under manual review. We will contact you within 24 hours.'
            : 'Verification failed. Please review the issues and resubmit.',
      nextSteps,
    }

    // Log verification attempt
    console.log('KYC Verification:', {
      userId: body.userId,
      email: body.email,
      status,
      overallScore,
      riskLevel,
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    console.error('KYC verification error:', error)
    return NextResponse.json({ error: 'Failed to process KYC verification' }, { status: 500 })
  }
}

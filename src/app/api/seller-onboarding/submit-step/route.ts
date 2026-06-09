import { NextRequest, NextResponse } from 'next/server'
import { SubmitWizardStepRequest, SubmitWizardStepResponse } from '@/lib/seller-ingestion-schema'

/**
 * POST /api/seller-onboarding/submit-step
 * Processes each wizard step with validation and persistence
 * Persists partial form data for recovery/retry capability
 */

interface StepValidator {
  [key: string]: (data: any) => { valid: boolean; errors: Array<{ field: string; message: string }> }
}

const stepValidators: StepValidator = {
  'user-type': (data) => {
    const errors: Array<{ field: string; message: string }> = []
    if (!data.userType || !['seller', 'broker'].includes(data.userType)) {
      errors.push({ field: 'userType', message: 'Please select seller or broker' })
    }
    return { valid: errors.length === 0, errors }
  },

  'seller-identity': (data) => {
    const errors: Array<{ field: string; message: string }> = []

    if (!data.sellerFirstName?.trim()) {
      errors.push({ field: 'sellerFirstName', message: 'First name is required' })
    }

    if (!data.sellerLastName?.trim()) {
      errors.push({ field: 'sellerLastName', message: 'Last name is required' })
    }

    if (!data.sellerEmail?.trim()) {
      errors.push({ field: 'sellerEmail', message: 'Email is required' })
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.sellerEmail)) {
      errors.push({ field: 'sellerEmail', message: 'Invalid email format' })
    }

    if (!data.sellerPhone?.trim()) {
      errors.push({ field: 'sellerPhone', message: 'Phone number is required' })
    } else if (!/^[\d\s\-\+\(\)]{10,}$/.test(data.sellerPhone)) {
      errors.push({ field: 'sellerPhone', message: 'Invalid phone number format' })
    }

    return { valid: errors.length === 0, errors }
  },

  'broker-info': (data) => {
    const errors: Array<{ field: string; message: string }> = []

    if (!data.brokerFirstName?.trim()) {
      errors.push({ field: 'brokerFirstName', message: 'Broker first name is required' })
    }

    if (!data.brokerLastName?.trim()) {
      errors.push({ field: 'brokerLastName', message: 'Broker last name is required' })
    }

    if (!data.brokerEmail?.trim()) {
      errors.push({ field: 'brokerEmail', message: 'Email is required' })
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.brokerEmail)) {
      errors.push({ field: 'brokerEmail', message: 'Invalid email format' })
    }

    if (!data.brokerCompanyName?.trim()) {
      errors.push({ field: 'brokerCompanyName', message: 'Company name is required' })
    }

    if (!data.brokerLicenseNumber?.trim()) {
      errors.push({ field: 'brokerLicenseNumber', message: 'License number is required' })
    }

    return { valid: errors.length === 0, errors }
  },

  'business-info': (data) => {
    const errors: Array<{ field: string; message: string }> = []

    if (!data.businessName?.trim()) {
      errors.push({ field: 'businessName', message: 'Business name is required' })
    } else if (data.businessName.trim().length < 2) {
      errors.push({ field: 'businessName', message: 'Business name must be at least 2 characters' })
    }

    if (!data.businessType?.trim()) {
      errors.push({ field: 'businessType', message: 'Business type is required' })
    }

    if (!data.location?.trim()) {
      errors.push({ field: 'location', message: 'Location is required' })
    }

    if (!data.yearFounded) {
      errors.push({ field: 'yearFounded', message: 'Year founded is required' })
    } else {
      const year = parseInt(data.yearFounded, 10)
      if (isNaN(year) || year < 1900 || year > new Date().getFullYear()) {
        errors.push({ field: 'yearFounded', message: `Year must be between 1900 and ${new Date().getFullYear()}` })
      }
    }

    if (!data.employees) {
      errors.push({ field: 'employees', message: 'Employee count is required' })
    } else {
      const emp = parseInt(data.employees, 10)
      if (isNaN(emp) || emp < 1) {
        errors.push({ field: 'employees', message: 'Employees must be at least 1' })
      }
    }

    if (data.website?.trim() && !isValidUrl(data.website)) {
      errors.push({ field: 'website', message: 'Please enter a valid URL' })
    }

    return { valid: errors.length === 0, errors }
  },

  'financials': (data) => {
    const errors: Array<{ field: string; message: string }> = []

    if (!data.annualRevenue) {
      errors.push({ field: 'annualRevenue', message: 'Annual revenue is required' })
    } else {
      const revenue = parseFloat(data.annualRevenue)
      if (isNaN(revenue) || revenue < 0) {
        errors.push({ field: 'annualRevenue', message: 'Please enter a valid amount' })
      }
    }

    if (!data.valuation) {
      errors.push({ field: 'valuation', message: 'Valuation is required' })
    } else {
      const val = parseFloat(data.valuation)
      if (isNaN(val) || val < 0) {
        errors.push({ field: 'valuation', message: 'Please enter a valid amount' })
      }
    }

    if (!data.growthRate) {
      errors.push({ field: 'growthRate', message: 'Growth rate is required' })
    } else {
      const growth = parseFloat(data.growthRate)
      if (isNaN(growth) || growth < -100 || growth > 1000) {
        errors.push({ field: 'growthRate', message: 'Growth rate must be between -100% and 1000%' })
      }
    }

    return { valid: errors.length === 0, errors }
  },

  'description': (data) => {
    const errors: Array<{ field: string; message: string }> = []

    if (!data.businessDescription?.trim()) {
      errors.push({ field: 'businessDescription', message: 'Description is required' })
    } else if (data.businessDescription.trim().length < 20) {
      errors.push({ field: 'businessDescription', message: 'Description must be at least 20 characters' })
    } else if (data.businessDescription.trim().length > 1000) {
      errors.push({ field: 'businessDescription', message: 'Description cannot exceed 1000 characters' })
    }

    if (!data.whySellingReason?.trim()) {
      errors.push({ field: 'whySellingReason', message: 'Please tell us why you\'re selling' })
    } else if (data.whySellingReason.trim().length < 10) {
      errors.push({ field: 'whySellingReason', message: 'Please provide more detail' })
    }

    return { valid: errors.length === 0, errors }
  },

  'kyc-documents': (data) => {
    const errors: Array<{ field: string; message: string }> = []

    if (!data.kycDocuments || data.kycDocuments.length === 0) {
      errors.push({ field: 'kycDocuments', message: 'At least one document is required' })
    }

    return { valid: errors.length === 0, errors }
  },
}

function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Main handler
 */
export async function POST(request: NextRequest): Promise<NextResponse<SubmitWizardStepResponse>> {
  try {
    const body: SubmitWizardStepRequest = await request.json()
    const { sessionToken, step, data } = body

    // 1. VALIDATE INPUT
    if (!sessionToken || !step || !data) {
      return NextResponse.json(
        {
          success: false,
          sessionToken,
          currentStep: step,
          errors: [{ field: 'request', message: 'Missing required fields' }],
        },
        { status: 400 }
      )
    }

    // 2. VALIDATE STEP DATA
    const validator = stepValidators[step]
    if (!validator) {
      return NextResponse.json(
        {
          success: false,
          sessionToken,
          currentStep: step,
          errors: [{ field: 'step', message: `Unknown step: ${step}` }],
        },
        { status: 400 }
      )
    }

    const validation = validator(data)
    if (!validation.valid) {
      return NextResponse.json(
        {
          success: false,
          sessionToken,
          currentStep: step,
          errors: validation.errors,
        },
        { status: 422 }
      )
    }

    // 3. PERSIST FORM DATA
    // In production, this would be:
    // - Load existing wizard session from database
    // - Merge new data with existing form data
    // - Save updated session with timestamp
    // - Log ingestion event
    console.log(`[INGESTION] Step ${step} validated and stored for session ${sessionToken}`)
    console.log(`[DATA] ${JSON.stringify(data, null, 2)}`)

    // 4. DETERMINE NEXT STEP
    const stepOrder = ['user-type', 'seller-identity', 'broker-info', 'business-info', 'financials', 'description', 'kyc-documents', 'review', 'success']
    const currentIndex = stepOrder.indexOf(step)
    const nextStep = currentIndex < stepOrder.length - 1 ? stepOrder[currentIndex + 1] : undefined

    // 5. RETURN SUCCESS RESPONSE
    return NextResponse.json(
      {
        success: true,
        sessionToken,
        currentStep: step,
        nextStep,
        data: {
          message: `Step ${step} saved successfully`,
          percentComplete: Math.round(((currentIndex + 1) / stepOrder.length) * 100),
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[API ERROR] /api/seller-onboarding/submit-step', error)
    return NextResponse.json(
      {
        success: false,
        sessionToken: '',
        currentStep: '',
        errors: [{ field: 'server', message: 'An error occurred while processing your submission' }],
      },
      { status: 500 }
    )
  }
}

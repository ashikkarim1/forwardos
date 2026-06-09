'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckCircle,
  Upload,
  AlertCircle,
  ArrowRight,
  X,
  Shield,
  User,
  Building2,
  FileText,
  Id,
  PhoneCall,
} from 'lucide-react'
import { useLocale } from '@/context/LocaleContext'
import {
  COLOR_PRIMARY,
  COLOR_ACCENT,
  COLOR_TEXT_PRIMARY,
  COLOR_TEXT_SECONDARY,
  COLOR_TEXT_TERTIARY,
  COLOR_BORDER,
  COLOR_BG_PRIMARY,
  COLOR_SURFACE_PRIMARY,
  COLOR_SUCCESS,
  COLOR_ERROR,
  COLOR_SUCCESS_SOFT,
  COLOR_INFO_SOFT,
} from '@/styles/forward-colors'
import { getSortedCountries, getCountryByCode, validatePhoneForCountry, getPhonePlaceholder, type CountryInfo } from '@/lib/countries'

type WizardStep = 'user-type' | 'seller-identity' | 'broker-info' | 'business-info' | 'financials' | 'description' | 'kyc-documents' | 'review' | 'success'

interface SellerData {
  // User type
  userType: 'seller' | 'broker'

  // Seller identity
  sellerFirstName: string
  sellerLastName: string
  sellerEmail: string
  sellerCountry: string // ISO country code (e.g., 'US', 'AE', 'CA')
  sellerPhone: string
  sellerCompany: string

  // Broker info (if applicable)
  brokerFirstName: string
  brokerLastName: string
  brokerEmail: string
  brokerCountry: string // ISO country code
  brokerPhone: string
  brokerCompanyName: string
  brokerLicenseNumber: string

  // KYC Documents
  kycDocuments: {
    idPhoto: File | null
    proofOfAddress: File | null
    businessVerification: File | null
  }

  // Business details
  businessName: string
  businessType: string
  location: string
  yearFounded: string
  employees: string
  website: string

  // Financials
  annualRevenue: string
  valuation: string
  growthRate: string

  // Description
  businessDescription: string
  whySellingReason: string

  // Metadata
  createdAt: string
  kycStatus: 'pending' | 'verified' | 'rejected'
}

interface ValidationErrors {
  [key: string]: string
}

export function SellerKYCUploadWizard() {
  const { locale, isRTL } = useLocale()
  const [currentStep, setCurrentStep] = useState<WizardStep>('user-type')
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [submitting, setSubmitting] = useState(false)

  const [sellerData, setSellerData] = useState<SellerData>({
    userType: 'seller',
    sellerFirstName: '',
    sellerLastName: '',
    sellerEmail: '',
    sellerCountry: 'CA', // Default to Canada
    sellerPhone: '',
    sellerCompany: '',
    brokerFirstName: '',
    brokerLastName: '',
    brokerEmail: '',
    brokerCountry: 'CA', // Default to Canada
    brokerPhone: '',
    brokerCompanyName: '',
    brokerLicenseNumber: '',
    kycDocuments: {
      idPhoto: null,
      proofOfAddress: null,
      businessVerification: null,
    },
    businessName: '',
    businessType: '',
    location: '',
    yearFounded: '',
    employees: '',
    website: '',
    annualRevenue: '',
    valuation: '',
    growthRate: '',
    businessDescription: '',
    whySellingReason: '',
    createdAt: new Date().toISOString(),
    kycStatus: 'pending',
  })

  // ==================== VALIDATION ====================

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const validatePhone = (phone: string, countryCode: string): boolean => {
    // Use country-specific validation
    return validatePhoneForCountry(phone, countryCode)
  }

  const validateStep = (step: WizardStep): boolean => {
    const newErrors: ValidationErrors = {}

    if (step === 'user-type') {
      if (!sellerData.userType) {
        newErrors.userType = 'Please select whether you are a seller or broker'
      }
    }

    if (step === 'seller-identity') {
      if (!sellerData.sellerFirstName.trim()) {
        newErrors.sellerFirstName = 'First name is required'
      }
      if (!sellerData.sellerLastName.trim()) {
        newErrors.sellerLastName = 'Last name is required'
      }
      if (!sellerData.sellerEmail.trim()) {
        newErrors.sellerEmail = 'Email is required'
      } else if (!validateEmail(sellerData.sellerEmail)) {
        newErrors.sellerEmail = 'Please enter a valid email address'
      }
      if (!sellerData.sellerCountry) {
        newErrors.sellerCountry = 'Country is required'
      }
      if (!sellerData.sellerPhone.trim()) {
        newErrors.sellerPhone = 'Phone number is required'
      } else if (!validatePhone(sellerData.sellerPhone, sellerData.sellerCountry)) {
        const country = getCountryByCode(sellerData.sellerCountry)
        newErrors.sellerPhone = `Please enter a valid phone number (e.g., ${country?.examplePhone || ''})`
      }
    }

    if (step === 'broker-info' && sellerData.userType === 'broker') {
      if (!sellerData.brokerFirstName.trim()) {
        newErrors.brokerFirstName = 'Broker first name is required'
      }
      if (!sellerData.brokerLastName.trim()) {
        newErrors.brokerLastName = 'Broker last name is required'
      }
      if (!sellerData.brokerEmail.trim()) {
        newErrors.brokerEmail = 'Broker email is required'
      } else if (!validateEmail(sellerData.brokerEmail)) {
        newErrors.brokerEmail = 'Please enter a valid email address'
      }
      if (!sellerData.brokerCountry) {
        newErrors.brokerCountry = 'Country is required'
      }
      if (!sellerData.brokerPhone.trim()) {
        newErrors.brokerPhone = 'Phone number is required'
      } else if (!validatePhone(sellerData.brokerPhone, sellerData.brokerCountry)) {
        const country = getCountryByCode(sellerData.brokerCountry)
        newErrors.brokerPhone = `Please enter a valid phone number (e.g., ${country?.examplePhone || ''})`
      }
      if (!sellerData.brokerCompanyName.trim()) {
        newErrors.brokerCompanyName = 'Brokerage company name is required'
      }
      if (!sellerData.brokerLicenseNumber.trim()) {
        newErrors.brokerLicenseNumber = 'Broker license number is required'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (!validateStep(currentStep)) {
      return
    }

    const stepOrder: WizardStep[] =
      sellerData.userType === 'broker'
        ? ['user-type', 'broker-info', 'seller-identity', 'business-info', 'financials', 'description', 'kyc-documents', 'review', 'success']
        : ['user-type', 'seller-identity', 'business-info', 'financials', 'description', 'kyc-documents', 'review', 'success']

    const currentIndex = stepOrder.indexOf(currentStep)
    if (currentIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentIndex + 1])
      window.scrollTo(0, 0)
    }
  }

  const handleBack = () => {
    const stepOrder: WizardStep[] =
      sellerData.userType === 'broker'
        ? ['user-type', 'broker-info', 'seller-identity', 'business-info', 'financials', 'description', 'kyc-documents', 'review', 'success']
        : ['user-type', 'seller-identity', 'business-info', 'financials', 'description', 'kyc-documents', 'review', 'success']

    const currentIndex = stepOrder.indexOf(currentStep)
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1])
      window.scrollTo(0, 0)
    }
  }

  const handleInputChange = (field: keyof SellerData, value: any) => {
    // When country changes, auto-populate the phone field with area code
    if (field === 'sellerCountry' && value) {
      const country = getCountryByCode(value)
      setSellerData((prev) => ({
        ...prev,
        [field]: value,
        // Pre-fill phone with area code + space for easy input
        sellerPhone: country ? `${country.areaCode} ` : '',
      }))
    } else if (field === 'brokerCountry' && value) {
      const country = getCountryByCode(value)
      setSellerData((prev) => ({
        ...prev,
        [field]: value,
        // Pre-fill phone with area code + space for easy input
        brokerPhone: country ? `${country.areaCode} ` : '',
      }))
    } else {
      setSellerData((prev) => ({ ...prev, [field]: value }))
    }

    if (errors[field]) {
      setErrors((prev) => {
        const updated = { ...prev }
        delete updated[field]
        return updated
      })
    }
  }

  const handleKYCDocumentUpload = (docType: 'idPhoto' | 'proofOfAddress' | 'businessVerification', file: File) => {
    setSellerData((prev) => ({
      ...prev,
      kycDocuments: {
        ...prev.kycDocuments,
        [docType]: file,
      },
    }))
  }

  const getProgressPercentage = (): number => {
    const stepOrder: WizardStep[] =
      sellerData.userType === 'broker'
        ? ['user-type', 'broker-info', 'seller-identity', 'business-info', 'financials', 'description', 'kyc-documents', 'review', 'success']
        : ['user-type', 'seller-identity', 'business-info', 'financials', 'description', 'kyc-documents', 'review', 'success']

    const currentIndex = stepOrder.indexOf(currentStep)
    return ((currentIndex + 1) / stepOrder.length) * 100
  }

  // ==================== STEP 0: USER TYPE ====================

  if (currentStep === 'user-type') {
    return (
      <div className="min-h-screen" style={{ background: COLOR_BG_PRIMARY }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-black mb-6" style={{ color: COLOR_PRIMARY, fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
              List Your Business for Free
            </h1>
            <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-lg">
              Get discovered by 5,000+ verified buyers. Fast, secure, and transparent.
            </p>
          </div>

          {/* Selection Cards */}
          <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* Seller Card */}
            <button
              onClick={() => handleInputChange('userType', 'seller')}
              className={`p-8 rounded-2xl border-2 transition-all text-left ${
                sellerData.userType === 'seller'
                  ? 'ring-2 ring-offset-4'
                  : 'hover:border-opacity-50'
              }`}
              style={{
                borderColor: sellerData.userType === 'seller' ? COLOR_ACCENT : COLOR_BORDER,
                background: sellerData.userType === 'seller' ? COLOR_INFO_SOFT : COLOR_SURFACE_PRIMARY,
                ringColor: COLOR_ACCENT,
              }}
            >
              <div className="flex items-start gap-4 mb-4">
                <div
                  className="p-3 rounded-xl"
                  style={{ background: COLOR_ACCENT + '20' }}
                >
                  <User size={24} style={{ color: COLOR_ACCENT }} />
                </div>
                <div>
                  <h3 className="text-xl font-black" style={{ color: COLOR_PRIMARY, fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                    I'm a Seller
                  </h3>
                  <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-sm mt-1">
                    Listing my own business
                  </p>
                </div>
              </div>
              <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-sm">
                Fast track: 5 minutes to list. Direct contact with buyers. Real-time notifications.
              </p>
            </button>

            {/* Broker Card */}
            <button
              onClick={() => handleInputChange('userType', 'broker')}
              className={`p-8 rounded-2xl border-2 transition-all text-left ${
                sellerData.userType === 'broker'
                  ? 'ring-2 ring-offset-4'
                  : 'hover:border-opacity-50'
              }`}
              style={{
                borderColor: sellerData.userType === 'broker' ? COLOR_ACCENT : COLOR_BORDER,
                background: sellerData.userType === 'broker' ? COLOR_INFO_SOFT : COLOR_SURFACE_PRIMARY,
                ringColor: COLOR_ACCENT,
              }}
            >
              <div className="flex items-start gap-4 mb-4">
                <div
                  className="p-3 rounded-xl"
                  style={{ background: COLOR_ACCENT + '20' }}
                >
                  <Building2 size={24} style={{ color: COLOR_ACCENT }} />
                </div>
                <div>
                  <h3 className="text-xl font-black" style={{ color: COLOR_PRIMARY, fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                    I'm a Broker
                  </h3>
                  <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-sm mt-1">
                    Listing a client's business
                  </p>
                </div>
              </div>
              <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-sm">
                List on behalf of sellers. Track all broker-managed deals. Commission tracking.
              </p>
            </button>
          </motion.div>

          {/* Navigation */}
          <div className="flex gap-4 justify-center">
            <Link
              href="/"
              className="px-6 py-3 rounded-xl font-bold border transition-all hover:bg-gray-50"
              style={{ borderColor: COLOR_BORDER, color: COLOR_PRIMARY }}
            >
              Back to Home
            </Link>
            <button
              onClick={handleNext}
              disabled={!sellerData.userType}
              className="px-6 py-3 rounded-xl font-bold text-white hover:opacity-90 transition-all disabled:opacity-50 flex items-center gap-2"
              style={{ background: COLOR_ACCENT }}
            >
              Continue
              <ArrowRight size={18} style={{ transform: isRTL ? 'scaleX(-1)' : 'none' }} />
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ==================== STEP 1: BROKER INFO (if broker) ====================

  if (currentStep === 'broker-info' && sellerData.userType === 'broker') {
    return (
      <div className="min-h-screen" style={{ background: COLOR_BG_PRIMARY }}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Progress */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold" style={{ color: COLOR_PRIMARY }}>
                Step 1 of 8: Broker Verification
              </span>
              <span style={{ color: COLOR_TEXT_SECONDARY }} className="text-sm">
                {Math.round(getProgressPercentage())}%
              </span>
            </div>
            <div className="w-full h-2 rounded-full" style={{ background: COLOR_BORDER }}>
              <motion.div
                className="h-2 rounded-full"
                style={{ background: COLOR_ACCENT }}
                initial={{ width: 0 }}
                animate={{ width: `${getProgressPercentage()}%` }}
                transition={{ duration: 0.3 }}
              ></motion.div>
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4" style={{ background: COLOR_ACCENT + '20' }}>
              <Shield size={24} style={{ color: COLOR_ACCENT }} />
            </div>
            <h1 className="text-4xl font-black mb-4" style={{ color: COLOR_PRIMARY, fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
              Broker Verification
            </h1>
            <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-lg">
              Verify your broker credentials to list on behalf of sellers
            </p>
          </div>

          {/* Form */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Broker Personal Info */}
            <div className="p-6 rounded-2xl" style={{ background: COLOR_SURFACE_PRIMARY, border: `1px solid ${COLOR_BORDER}` }}>
              <h2 className="text-lg font-bold mb-6" style={{ color: COLOR_PRIMARY }}>
                Your Information
              </h2>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
                    First Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Jane"
                    value={sellerData.brokerFirstName}
                    onChange={(e) => handleInputChange('brokerFirstName', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all"
                    style={{
                      borderColor: errors.brokerFirstName ? COLOR_ERROR : COLOR_BORDER,
                      focusRingColor: COLOR_ACCENT,
                    }}
                  />
                  {errors.brokerFirstName && (
                    <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle size={14} /> {errors.brokerFirstName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
                    Last Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Smith"
                    value={sellerData.brokerLastName}
                    onChange={(e) => handleInputChange('brokerLastName', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all"
                    style={{
                      borderColor: errors.brokerLastName ? COLOR_ERROR : COLOR_BORDER,
                      focusRingColor: COLOR_ACCENT,
                    }}
                  />
                  {errors.brokerLastName && (
                    <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle size={14} /> {errors.brokerLastName}
                    </p>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  placeholder="jane@brokerage.com"
                  value={sellerData.brokerEmail}
                  onChange={(e) => handleInputChange('brokerEmail', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all"
                  style={{
                    borderColor: errors.brokerEmail ? COLOR_ERROR : COLOR_BORDER,
                    focusRingColor: COLOR_ACCENT,
                  }}
                />
                {errors.brokerEmail && (
                  <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle size={14} /> {errors.brokerEmail}
                  </p>
                )}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
                  Country/Region *
                </label>
                <select
                  value={sellerData.brokerCountry}
                  onChange={(e) => handleInputChange('brokerCountry', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all"
                  style={{
                    borderColor: errors.brokerCountry ? COLOR_ERROR : COLOR_BORDER,
                    focusRingColor: COLOR_ACCENT,
                    color: COLOR_TEXT_PRIMARY,
                  }}
                >
                  <option value="">Select your country</option>
                  {getSortedCountries().map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.name} ({country.areaCode})
                    </option>
                  ))}
                </select>
                {errors.brokerCountry && (
                  <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle size={14} /> {errors.brokerCountry}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
                  Phone Number * <span style={{ color: COLOR_TEXT_SECONDARY, fontSize: '0.85em', fontWeight: 'normal' }}>(area code pre-filled)</span>
                </label>
                {sellerData.brokerCountry && (
                  <div className="mb-3 p-3 rounded-lg" style={{ background: COLOR_ACCENT + '15' }}>
                    <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-xs font-medium">
                      Format: <span style={{ color: COLOR_PRIMARY }}>{getCountryByCode(sellerData.brokerCountry)?.phoneFormat}</span>
                    </p>
                  </div>
                )}
                <input
                  type="tel"
                  placeholder={getPhonePlaceholder(sellerData.brokerCountry)}
                  value={sellerData.brokerPhone}
                  onChange={(e) => handleInputChange('brokerPhone', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all"
                  style={{
                    borderColor: errors.brokerPhone ? COLOR_ERROR : COLOR_BORDER,
                    focusRingColor: COLOR_ACCENT,
                  }}
                />
                {errors.brokerPhone && (
                  <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle size={14} /> {errors.brokerPhone}
                  </p>
                )}
              </div>
            </div>

            {/* Brokerage Info */}
            <div className="p-6 rounded-2xl" style={{ background: COLOR_SURFACE_PRIMARY, border: `1px solid ${COLOR_BORDER}` }}>
              <h2 className="text-lg font-bold mb-6" style={{ color: COLOR_PRIMARY }}>
                Brokerage Information
              </h2>

              <div className="mb-6">
                <label className="block text-sm font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
                  Brokerage Company Name *
                </label>
                <input
                  type="text"
                  placeholder="Smith & Associates M&A Advisors"
                  value={sellerData.brokerCompanyName}
                  onChange={(e) => handleInputChange('brokerCompanyName', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all"
                  style={{
                    borderColor: errors.brokerCompanyName ? COLOR_ERROR : COLOR_BORDER,
                    focusRingColor: COLOR_ACCENT,
                  }}
                />
                {errors.brokerCompanyName && (
                  <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle size={14} /> {errors.brokerCompanyName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
                  Broker License Number *
                </label>
                <input
                  type="text"
                  placeholder="BL-2024-000123"
                  value={sellerData.brokerLicenseNumber}
                  onChange={(e) => handleInputChange('brokerLicenseNumber', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all"
                  style={{
                    borderColor: errors.brokerLicenseNumber ? COLOR_ERROR : COLOR_BORDER,
                    focusRingColor: COLOR_ACCENT,
                  }}
                />
                {errors.brokerLicenseNumber && (
                  <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle size={14} /> {errors.brokerLicenseNumber}
                  </p>
                )}
              </div>
            </div>

            {/* Info Box */}
            <div className="p-4 rounded-xl border flex gap-3" style={{ borderColor: COLOR_ACCENT + '40', background: COLOR_INFO_SOFT }}>
              <Shield size={20} style={{ color: COLOR_ACCENT, flexShrink: 0 }} />
              <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-sm">
                <strong>Broker Protocol:</strong> All broker-managed listings are tracked with broker commission allocations, seller verification, and buyer confirmation. License verification happens in KYC step.
              </p>
            </div>

            {/* Navigation */}
            <div className="flex gap-4 mt-8 pt-6 border-t" style={{ borderColor: COLOR_BORDER }}>
              <button
                onClick={handleBack}
                className="px-6 py-3 rounded-xl font-bold border hover:bg-gray-50 transition-all flex-1"
                style={{ borderColor: COLOR_BORDER, color: COLOR_PRIMARY }}
              >
                ← Back
              </button>
              <button
                onClick={handleNext}
                className="px-6 py-3 rounded-xl font-bold text-white hover:opacity-90 transition-all flex-1 flex items-center justify-center gap-2"
                style={{ background: COLOR_ACCENT }}
              >
                Next: Seller Details
                <ArrowRight size={18} style={{ transform: isRTL ? 'scaleX(-1)' : 'none' }} />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  // ==================== STEP: SELLER IDENTITY ====================

  if (currentStep === 'seller-identity') {
    const isBroker = sellerData.userType === 'broker'
    const stepNum = isBroker ? 3 : 2
    const totalSteps = isBroker ? 8 : 7

    return (
      <div className="min-h-screen" style={{ background: COLOR_BG_PRIMARY }}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Progress */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold" style={{ color: COLOR_PRIMARY }}>
                Step {stepNum} of {totalSteps}: Seller Identity
              </span>
              <span style={{ color: COLOR_TEXT_SECONDARY }} className="text-sm">
                {Math.round(getProgressPercentage())}%
              </span>
            </div>
            <div className="w-full h-2 rounded-full" style={{ background: COLOR_BORDER }}>
              <motion.div
                className="h-2 rounded-full"
                style={{ background: COLOR_ACCENT }}
                initial={{ width: 0 }}
                animate={{ width: `${getProgressPercentage()}%` }}
                transition={{ duration: 0.3 }}
              ></motion.div>
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4" style={{ background: COLOR_ACCENT + '20' }}>
              <User size={24} style={{ color: COLOR_ACCENT }} />
            </div>
            <h1 className="text-4xl font-black mb-4" style={{ color: COLOR_PRIMARY, fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
              {isBroker ? 'Seller Information' : 'Your Information'}
            </h1>
            <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-lg">
              {isBroker ? 'Details of the seller/owner' : 'We need to verify your identity'}
            </p>
          </div>

          {/* Form */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="p-6 rounded-2xl" style={{ background: COLOR_SURFACE_PRIMARY, border: `1px solid ${COLOR_BORDER}` }}>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
                    First Name *
                  </label>
                  <input
                    type="text"
                    placeholder="John"
                    value={sellerData.sellerFirstName}
                    onChange={(e) => handleInputChange('sellerFirstName', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all"
                    style={{
                      borderColor: errors.sellerFirstName ? COLOR_ERROR : COLOR_BORDER,
                      focusRingColor: COLOR_ACCENT,
                    }}
                  />
                  {errors.sellerFirstName && (
                    <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle size={14} /> {errors.sellerFirstName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
                    Last Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Doe"
                    value={sellerData.sellerLastName}
                    onChange={(e) => handleInputChange('sellerLastName', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all"
                    style={{
                      borderColor: errors.sellerLastName ? COLOR_ERROR : COLOR_BORDER,
                      focusRingColor: COLOR_ACCENT,
                    }}
                  />
                  {errors.sellerLastName && (
                    <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle size={14} /> {errors.sellerLastName}
                    </p>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  value={sellerData.sellerEmail}
                  onChange={(e) => handleInputChange('sellerEmail', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all"
                  style={{
                    borderColor: errors.sellerEmail ? COLOR_ERROR : COLOR_BORDER,
                    focusRingColor: COLOR_ACCENT,
                  }}
                />
                {errors.sellerEmail && (
                  <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle size={14} /> {errors.sellerEmail}
                  </p>
                )}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
                  Country/Region *
                </label>
                <select
                  value={sellerData.sellerCountry}
                  onChange={(e) => handleInputChange('sellerCountry', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all"
                  style={{
                    borderColor: errors.sellerCountry ? COLOR_ERROR : COLOR_BORDER,
                    focusRingColor: COLOR_ACCENT,
                    color: COLOR_TEXT_PRIMARY,
                  }}
                >
                  <option value="">Select your country</option>
                  {getSortedCountries().map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.name} ({country.areaCode})
                    </option>
                  ))}
                </select>
                {errors.sellerCountry && (
                  <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle size={14} /> {errors.sellerCountry}
                  </p>
                )}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
                  Phone Number * <span style={{ color: COLOR_TEXT_SECONDARY, fontSize: '0.85em', fontWeight: 'normal' }}>(area code pre-filled)</span>
                </label>
                {sellerData.sellerCountry && (
                  <div className="mb-3 p-3 rounded-lg" style={{ background: COLOR_ACCENT + '15' }}>
                    <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-xs font-medium">
                      Format: <span style={{ color: COLOR_PRIMARY }}>{getCountryByCode(sellerData.sellerCountry)?.phoneFormat}</span>
                    </p>
                  </div>
                )}
                <input
                  type="tel"
                  placeholder={getPhonePlaceholder(sellerData.sellerCountry)}
                  value={sellerData.sellerPhone}
                  onChange={(e) => handleInputChange('sellerPhone', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all"
                  style={{
                    borderColor: errors.sellerPhone ? COLOR_ERROR : COLOR_BORDER,
                    focusRingColor: COLOR_ACCENT,
                  }}
                />
                {errors.sellerPhone && (
                  <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle size={14} /> {errors.sellerPhone}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
                  Company/Entity Name (if applicable)
                </label>
                <input
                  type="text"
                  placeholder="My Company LLC"
                  value={sellerData.sellerCompany}
                  onChange={(e) => handleInputChange('sellerCompany', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all"
                  style={{
                    borderColor: COLOR_BORDER,
                    focusRingColor: COLOR_ACCENT,
                  }}
                />
                <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-xs mt-2">
                  Leave blank if selling as individual
                </p>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex gap-4 mt-8 pt-6 border-t" style={{ borderColor: COLOR_BORDER }}>
              <button
                onClick={handleBack}
                className="px-6 py-3 rounded-xl font-bold border hover:bg-gray-50 transition-all flex-1"
                style={{ borderColor: COLOR_BORDER, color: COLOR_PRIMARY }}
              >
                ← Back
              </button>
              <button
                onClick={handleNext}
                className="px-6 py-3 rounded-xl font-bold text-white hover:opacity-90 transition-all flex-1 flex items-center justify-center gap-2"
                style={{ background: COLOR_ACCENT }}
              >
                Next: Business Details
                <ArrowRight size={18} style={{ transform: isRTL ? 'scaleX(-1)' : 'none' }} />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  // For now, return a placeholder for remaining steps
  return (
    <div className="min-h-screen" style={{ background: COLOR_BG_PRIMARY }}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-4xl font-black mb-4" style={{ color: COLOR_PRIMARY }}>
          More steps coming...
        </h1>
        <p style={{ color: COLOR_TEXT_SECONDARY }}>Step: {currentStep}</p>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Upload, AlertCircle, Clock, X, ChevronRight } from 'lucide-react'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER } from '@/styles/forward-colors'
import { FeatureIcon } from './Icons/FeatureIcons'

interface KYCStep {
  id: string
  title: string
  description: string
  status: 'pending' | 'in_progress' | 'completed' | 'failed'
  requirements: string[]
}

interface KYCData {
  // Personal Info
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  nationality: string

  // Address
  address: string
  city: string
  state: string
  country: string
  zipCode: string

  // Identity Verification
  idType: 'passport' | 'national_id' | 'drivers_license' | ''
  idNumber: string
  idDocument: File | null
  issuedDate: string
  expiryDate: string

  // User Type Specific
  userType: 'buyer' | 'seller' | 'broker' | ''
  companyName: string
  companyRegistration: string
  businessLicense: File | null
  proofOfFunds: File | null
  advisorCertifications: string[]
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export function KYCVerification() {
  const [currentStep, setCurrentStep] = useState(0)
  const [kycData, setKYCData] = useState<KYCData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    nationality: '',
    address: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
    idType: '',
    idNumber: '',
    idDocument: null,
    issuedDate: '',
    expiryDate: '',
    userType: '',
    companyName: '',
    companyRegistration: '',
    businessLicense: null,
    proofOfFunds: null,
    advisorCertifications: [],
  })

  const [verificationStatus, setVerificationStatus] = useState<Record<string, 'pending' | 'verified' | 'failed'>>({
    identity: 'pending',
    address: 'pending',
    credentials: 'pending',
    aml: 'pending',
  })

  const [loading, setLoading] = useState(false)

  const steps: KYCStep[] = [
    {
      id: 'user_type',
      title: 'Account Type',
      description: 'Tell us who you are so we can tailor verification',
      status: kycData.userType ? 'completed' : 'pending',
      requirements: ['Select your account type'],
    },
    {
      id: 'personal_info',
      title: 'Personal Information',
      description: 'Verify your identity with government-issued documents',
      status: kycData.firstName && kycData.idDocument ? 'completed' : 'pending',
      requirements: [
        'Full name',
        'Email address',
        'Phone number',
        'Date of birth',
        'Government ID (Passport, National ID, or Driver\'s License)',
      ],
    },
    {
      id: 'address',
      title: 'Address Verification',
      description: 'Confirm your residential or business address',
      status: kycData.address && kycData.country ? 'completed' : 'pending',
      requirements: [
        'Full address',
        'City and country',
        'Postal code',
        'Address proof (utility bill or bank statement)',
      ],
    },
    {
      id: 'credentials',
      title: 'Credential Verification',
      description: 'Prove you have authority to conduct this transaction',
      status:
        kycData.userType === 'seller' && kycData.businessLicense
          ? 'completed'
          : kycData.userType === 'buyer' && kycData.proofOfFunds
            ? 'completed'
            : kycData.userType === 'broker' && kycData.advisorCertifications.length > 0
              ? 'completed'
              : 'pending',
      requirements:
        kycData.userType === 'seller'
          ? ['Business registration document', 'Proof of ownership (Articles of Incorporation, Tax ID)']
          : kycData.userType === 'buyer'
            ? ['Proof of funds (Bank statement, LOI)', 'Investment experience documentation']
            : kycData.userType === 'broker'
              ? ['Professional license/certification', 'Regulatory credentials']
              : [],
    },
    {
      id: 'review',
      title: 'Review & Submit',
      description: 'Review your information and submit for verification',
      status: 'pending',
      requirements: ['Review all information', 'Accept terms & conditions'],
    },
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setKYCData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: keyof KYCData) => {
    const file = e.target.files?.[0]
    if (file) {
      setKYCData(prev => ({ ...prev, [field]: file }))
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      // Simulate verification checks
      const checks = ['identity', 'address', 'credentials', 'aml']
      for (const check of checks) {
        await new Promise(resolve => setTimeout(resolve, 1500))
        setVerificationStatus(prev => ({ ...prev, [check]: Math.random() > 0.1 ? 'verified' : 'failed' }))
      }

      setCurrentStep(steps.length - 1)
    } finally {
      setLoading(false)
    }
  }

  const canProceedToNext = () => {
    switch (currentStep) {
      case 0:
        return !!kycData.userType
      case 1:
        return !!(kycData.firstName && kycData.lastName && kycData.email && kycData.phone && kycData.idDocument)
      case 2:
        return !!(kycData.address && kycData.city && kycData.country && kycData.zipCode)
      case 3:
        return !!(
          (kycData.userType === 'seller' && kycData.businessLicense) ||
          (kycData.userType === 'buyer' && kycData.proofOfFunds) ||
          (kycData.userType === 'broker' && kycData.advisorCertifications.length > 0)
        )
      default:
        return false
    }
  }

  const overallStatus = Object.values(verificationStatus).filter(s => s === 'verified').length / 4

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div initial="hidden" animate="visible" variants={containerVariants} className="space-y-8">
        {/* Progress */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-black" style={{ color: COLOR_PRIMARY }}>
              Identity & Credential Verification
            </h2>
            <div className="text-sm font-bold" style={{ color: COLOR_ACCENT }}>
              {currentStep + 1} of {steps.length}
            </div>
          </div>
          <div className="w-full h-2 rounded-full" style={{ background: COLOR_BORDER }}>
            <motion.div
              className="h-2 rounded-full"
              style={{ background: COLOR_ACCENT, width: `${((currentStep + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </motion.div>

        {/* Steps */}
        <motion.div variants={itemVariants} className="space-y-3">
          {steps.map((step, idx) => (
            <button
              key={step.id}
              onClick={() => idx <= currentStep && setCurrentStep(idx)}
              className="w-full p-4 rounded-lg border-2 text-left transition-all"
              style={{
                borderColor:
                  idx === currentStep ? COLOR_ACCENT : idx < currentStep ? COLOR_ACCENT : COLOR_BORDER,
                background: idx === currentStep ? COLOR_ACCENT + '15' : idx < currentStep ? COLOR_ACCENT + '08' : 'white',
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white"
                    style={{
                      background: idx < currentStep ? '#10B981' : idx === currentStep ? COLOR_ACCENT : COLOR_BORDER,
                    }}
                  >
                    {idx < currentStep ? <Check className="w-4 h-4" /> : idx + 1}
                  </div>
                  <div>
                    <p className="font-bold" style={{ color: COLOR_PRIMARY }}>
                      {step.title}
                    </p>
                    <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                      {step.description}
                    </p>
                  </div>
                </div>
                {idx === currentStep && <ChevronRight className="w-5 h-5" style={{ color: COLOR_ACCENT }} />}
              </div>
            </button>
          ))}
        </motion.div>

        {/* Current Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-8 rounded-lg border-2"
            style={{ borderColor: COLOR_BORDER, background: 'white' }}
          >
            {currentStep === 0 && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-lg mb-4" style={{ color: COLOR_PRIMARY }}>
                    What is your role on Forward OS?
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { value: 'buyer', label: 'Buyer / Investor', icon: 'deal', desc: 'Looking to acquire companies' },
                      { value: 'seller', label: 'Seller / Founder', icon: 'comparables', desc: 'Listing companies for sale' },
                      { value: 'broker', label: 'Broker / Advisor', icon: 'pipeline', desc: 'Facilitating transactions' },
                    ].map(option => (
                      <button
                        key={option.value}
                        onClick={() => setKYCData(prev => ({ ...prev, userType: option.value as any }))}
                        className="p-4 rounded-lg border-2 text-center transition-all"
                        style={{
                          borderColor: kycData.userType === option.value ? COLOR_ACCENT : COLOR_BORDER,
                          background: kycData.userType === option.value ? COLOR_ACCENT + '15' : 'white',
                        }}
                      >
                        <FeatureIcon name={option.icon as any} size={40} />
                        <p className="font-bold mt-2" style={{ color: COLOR_PRIMARY }}>
                          {option.label}
                        </p>
                        <p className="text-xs mt-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                          {option.desc}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-6">
                <h3 className="font-bold text-lg" style={{ color: COLOR_PRIMARY }}>
                  Personal Information & Identity Verification
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={kycData.firstName}
                    onChange={handleInputChange}
                    className="px-4 py-3 rounded-lg border"
                    style={{ borderColor: COLOR_BORDER }}
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={kycData.lastName}
                    onChange={handleInputChange}
                    className="px-4 py-3 rounded-lg border"
                    style={{ borderColor: COLOR_BORDER }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={kycData.email}
                    onChange={handleInputChange}
                    className="px-4 py-3 rounded-lg border"
                    style={{ borderColor: COLOR_BORDER }}
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    value={kycData.phone}
                    onChange={handleInputChange}
                    className="px-4 py-3 rounded-lg border"
                    style={{ borderColor: COLOR_BORDER }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={kycData.dateOfBirth}
                    onChange={handleInputChange}
                    className="px-4 py-3 rounded-lg border"
                    style={{ borderColor: COLOR_BORDER }}
                  />
                  <input
                    type="text"
                    name="nationality"
                    placeholder="Nationality"
                    value={kycData.nationality}
                    onChange={handleInputChange}
                    className="px-4 py-3 rounded-lg border"
                    style={{ borderColor: COLOR_BORDER }}
                  />
                </div>

                <div>
                  <label className="block font-bold mb-3" style={{ color: COLOR_PRIMARY }}>
                    Government-Issued ID
                  </label>
                  <select
                    name="idType"
                    value={kycData.idType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border mb-4"
                    style={{ borderColor: COLOR_BORDER }}
                  >
                    <option value="">Select ID Type</option>
                    <option value="passport">Passport</option>
                    <option value="national_id">National ID</option>
                    <option value="drivers_license">Driver's License</option>
                  </select>

                  <input
                    type="text"
                    name="idNumber"
                    placeholder="ID Number"
                    value={kycData.idNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border mb-4"
                    style={{ borderColor: COLOR_BORDER }}
                  />

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <input
                      type="date"
                      name="issuedDate"
                      placeholder="Issued Date"
                      value={kycData.issuedDate}
                      onChange={handleInputChange}
                      className="px-4 py-3 rounded-lg border"
                      style={{ borderColor: COLOR_BORDER }}
                    />
                    <input
                      type="date"
                      name="expiryDate"
                      placeholder="Expiry Date"
                      value={kycData.expiryDate}
                      onChange={handleInputChange}
                      className="px-4 py-3 rounded-lg border"
                      style={{ borderColor: COLOR_BORDER }}
                    />
                  </div>

                  <label className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-all"
                    style={{ borderColor: COLOR_ACCENT }}>
                    <Upload className="w-8 h-8 mx-auto mb-2" style={{ color: COLOR_ACCENT }} />
                    <p className="font-bold" style={{ color: COLOR_PRIMARY }}>
                      {kycData.idDocument ? '✓ Document uploaded' : 'Upload ID Document'}
                    </p>
                    <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                      PDF, JPG, or PNG (max 10MB)
                    </p>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.png"
                      onChange={e => handleFileUpload(e, 'idDocument')}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <h3 className="font-bold text-lg" style={{ color: COLOR_PRIMARY }}>
                  Address Verification
                </h3>

                <input
                  type="text"
                  name="address"
                  placeholder="Street Address"
                  value={kycData.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border"
                  style={{ borderColor: COLOR_BORDER }}
                />

                <div className="grid grid-cols-3 gap-4">
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={kycData.city}
                    onChange={handleInputChange}
                    className="px-4 py-3 rounded-lg border"
                    style={{ borderColor: COLOR_BORDER }}
                  />
                  <input
                    type="text"
                    name="state"
                    placeholder="State/Province"
                    value={kycData.state}
                    onChange={handleInputChange}
                    className="px-4 py-3 rounded-lg border"
                    style={{ borderColor: COLOR_BORDER }}
                  />
                  <input
                    type="text"
                    name="zipCode"
                    placeholder="Postal Code"
                    value={kycData.zipCode}
                    onChange={handleInputChange}
                    className="px-4 py-3 rounded-lg border"
                    style={{ borderColor: COLOR_BORDER }}
                  />
                </div>

                <input
                  type="text"
                  name="country"
                  placeholder="Country"
                  value={kycData.country}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border"
                  style={{ borderColor: COLOR_BORDER }}
                />

                <label className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-all"
                  style={{ borderColor: COLOR_ACCENT }}>
                  <Upload className="w-8 h-8 mx-auto mb-2" style={{ color: COLOR_ACCENT }} />
                  <p className="font-bold" style={{ color: COLOR_PRIMARY }}>
                    Upload Address Proof
                  </p>
                  <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                    Utility bill, bank statement, or lease agreement (max 10MB)
                  </p>
                  <input type="file" accept=".pdf,.jpg,.png" className="hidden" />
                </label>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <h3 className="font-bold text-lg" style={{ color: COLOR_PRIMARY }}>
                  Credential Verification
                </h3>

                {kycData.userType === 'seller' && (
                  <div>
                    <p className="mb-4" style={{ color: COLOR_TEXT_SECONDARY }}>
                      As a seller, we need to verify you have authority to list this company.
                    </p>
                    <input
                      type="text"
                      name="companyName"
                      placeholder="Company Legal Name"
                      value={kycData.companyName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border mb-4"
                      style={{ borderColor: COLOR_BORDER }}
                    />
                    <input
                      type="text"
                      name="companyRegistration"
                      placeholder="Company Registration Number / Tax ID"
                      value={kycData.companyRegistration}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border mb-4"
                      style={{ borderColor: COLOR_BORDER }}
                    />
                    <label className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-all"
                      style={{ borderColor: COLOR_ACCENT }}>
                      <Upload className="w-8 h-8 mx-auto mb-2" style={{ color: COLOR_ACCENT }} />
                      <p className="font-bold" style={{ color: COLOR_PRIMARY }}>
                        {kycData.businessLicense ? '✓ Business License Uploaded' : 'Upload Business License'}
                      </p>
                      <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                        Articles of Incorporation, Certificate of Good Standing, or Tax ID
                      </p>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.png"
                        onChange={e => handleFileUpload(e, 'businessLicense')}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}

                {kycData.userType === 'buyer' && (
                  <div>
                    <p className="mb-4" style={{ color: COLOR_TEXT_SECONDARY }}>
                      As a buyer, we need to verify proof of funds and investment capacity.
                    </p>
                    <label className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-all mb-4"
                      style={{ borderColor: COLOR_ACCENT }}>
                      <Upload className="w-8 h-8 mx-auto mb-2" style={{ color: COLOR_ACCENT }} />
                      <p className="font-bold" style={{ color: COLOR_PRIMARY }}>
                        {kycData.proofOfFunds ? '✓ Proof of Funds Uploaded' : 'Upload Proof of Funds'}
                      </p>
                      <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                        Bank statement, Letter of Credit, or Fund confirmation
                      </p>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.png"
                        onChange={e => handleFileUpload(e, 'proofOfFunds')}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}

                {kycData.userType === 'broker' && (
                  <div>
                    <p className="mb-4" style={{ color: COLOR_TEXT_SECONDARY }}>
                      As a broker/advisor, we need to verify your professional credentials.
                    </p>
                    <label className="block font-bold mb-3" style={{ color: COLOR_PRIMARY }}>
                      Professional Certifications (Select all that apply)
                    </label>
                    {['CFA', 'MBA', 'Series 7', 'Series 63', 'Real Estate License', 'Other'].map(cert => (
                      <label key={cert} className="flex items-center gap-2 mb-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={kycData.advisorCertifications.includes(cert)}
                          onChange={e => {
                            if (e.target.checked) {
                              setKYCData(prev => ({ ...prev, advisorCertifications: [...prev.advisorCertifications, cert] }))
                            } else {
                              setKYCData(prev => ({ ...prev, advisorCertifications: prev.advisorCertifications.filter(c => c !== cert) }))
                            }
                          }}
                        />
                        <span style={{ color: COLOR_PRIMARY }}>{cert}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6">
                <h3 className="font-bold text-lg" style={{ color: COLOR_PRIMARY }}>
                  Review Your Information
                </h3>

                <div className="p-4 rounded-lg" style={{ background: COLOR_ACCENT + '08', borderColor: COLOR_BORDER, borderWidth: 1 }}>
                  <p className="font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
                    Verification Status:
                  </p>
                  <div className="space-y-2">
                    {Object.entries(verificationStatus).map(([check, status]) => (
                      <div key={check} className="flex items-center justify-between">
                        <span style={{ color: COLOR_TEXT_SECONDARY }}>{check.replace('_', ' ')}</span>
                        <span className="font-bold">
                          {status === 'verified' && <span style={{ color: '#10B981' }}>✓ Verified</span>}
                          {status === 'failed' && <span style={{ color: '#EF4444' }}>✗ Failed</span>}
                          {status === 'pending' && <span style={{ color: COLOR_TEXT_SECONDARY }}>⏳ Pending</span>}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <label className="flex items-start gap-3 p-4 rounded-lg border" style={{ borderColor: COLOR_BORDER }}>
                  <input type="checkbox" className="mt-1" />
                  <div>
                    <p className="font-bold" style={{ color: COLOR_PRIMARY }}>
                      I confirm all information is accurate and complete
                    </p>
                    <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                      I authorize Forward OS to verify this information against government and financial databases
                    </p>
                  </div>
                </label>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <motion.div variants={itemVariants} className="flex gap-4 justify-between">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="px-6 py-3 rounded-lg font-bold border-2 disabled:opacity-30"
            style={{ borderColor: COLOR_BORDER, color: COLOR_PRIMARY }}
          >
            Back
          </button>

          {currentStep === steps.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-8 py-3 rounded-lg font-bold text-white"
              style={{ background: COLOR_ACCENT }}
            >
              {loading ? 'Verifying...' : 'Submit for Verification'}
            </button>
          ) : (
            <button
              onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
              disabled={!canProceedToNext()}
              className="px-8 py-3 rounded-lg font-bold text-white flex items-center gap-2 disabled:opacity-30"
              style={{ background: COLOR_ACCENT }}
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </motion.div>
      </motion.div>
    </div>
  )
}

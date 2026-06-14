'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mail,
  Lock,
  Building2,
  Image,
  FileText,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  AlertCircle,
  Zap,
  Crown,
  Upload,
  X,
} from 'lucide-react'
import { PasswordInput } from '@/components/PasswordInput'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER, COLOR_BG_PRIMARY } from '@/styles/forward-colors'
import { palette } from '@/styles/tokens'

interface Step {
  id: number
  title: string
  description: string
  icon: React.ReactNode
}

interface OnboardingData {
  // Account
  email: string
  password: string
  confirmPassword: string
  companyName: string
  firstName: string
  lastName: string
  phone: string
  emailVerified: boolean

  // Business Overview
  businessDescription: string
  foundingYear: number
  teamSize: number
  topCustomers: string
  industry: string
  location: string

  // Financial Summary
  financialsSummary: string

  // Photos
  photos: Array<{ url: string; name: string; isFeatured: boolean }>

  // Documents
  documents: Array<{ url: string; name: string; type: string }>

  // Plan
  planTier: 'freemium' | 'premium'
}

const STEPS: Step[] = [
  {
    id: 1,
    title: 'Create Account',
    description: 'Email and secure password',
    icon: <Mail className="w-5 h-5" />,
  },
  {
    id: 2,
    title: 'Business Info',
    description: 'Tell us about your business',
    icon: <Building2 className="w-5 h-5" />,
  },
  {
    id: 3,
    title: 'Add Photos',
    description: 'Upload business & team photos',
    icon: <Image className="w-5 h-5" />,
  },
  {
    id: 4,
    title: 'Documents',
    description: 'Financial statements & files',
    icon: <FileText className="w-5 h-5" />,
  },
  {
    id: 5,
    title: 'Choose Plan',
    description: 'Freemium or Premium',
    icon: <Zap className="w-5 h-5" />,
  },
]

const PREMIUM_BENEFITS = [
  '🔍 Higher search visibility',
  '⭐ Featured on marketplace',
  '📊 Advanced analytics dashboard',
  '🔐 Data room access for buyers',
  '💰 Premium seller badge',
  '📞 Priority broker support',
]

export default function SellerOnboarding() {
  const [currentStep, setCurrentStep] = useState(1)
  const [data, setData] = useState<OnboardingData>({
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    firstName: '',
    lastName: '',
    phone: '',
    emailVerified: false,
    businessDescription: '',
    foundingYear: new Date().getFullYear() - 5,
    teamSize: 10,
    topCustomers: '',
    industry: '',
    location: '',
    financialsSummary: '',
    photos: [],
    documents: [],
    planTier: 'freemium',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateData = (field: string, value: any) => {
    setData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}

    if (step === 1) {
      if (!data.email) newErrors.email = 'Email is required'
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) newErrors.email = 'Invalid email format'
      if (!data.password) newErrors.password = 'Password is required'
      else if (data.password.length < 8) newErrors.password = 'Password must be at least 8 characters'
      if (data.password !== data.confirmPassword) newErrors.confirmPassword = 'Passwords do not match'
      if (!data.firstName) newErrors.firstName = 'First name is required'
      if (!data.lastName) newErrors.lastName = 'Last name is required'
      if (!data.companyName) newErrors.companyName = 'Company name is required'
    }

    if (step === 2) {
      if (!data.businessDescription) newErrors.businessDescription = 'Business description is required'
      else if (data.businessDescription.length < 50) newErrors.businessDescription = 'Description must be at least 50 characters'
      if (!data.industry) newErrors.industry = 'Industry is required'
      if (!data.location) newErrors.location = 'Location is required'
      if (data.teamSize < 1) newErrors.teamSize = 'Team size must be at least 1'
    }

    if (step === 3) {
      if (data.photos.length === 0) newErrors.photos = 'Please upload at least one photo'
      if (!data.photos.some(p => p.isFeatured)) newErrors.featured = 'Please set a featured photo'
    }

    if (step === 4) {
      if (data.documents.length === 0) newErrors.documents = 'Please upload at least one document'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < STEPS.length) {
        setCurrentStep(currentStep + 1)
      }
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleAddPhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newPhotos = Array.from(e.target.files).map(file => ({
        url: URL.createObjectURL(file),
        name: file.name,
        isFeatured: data.photos.length === 0, // First photo is featured by default
      }))
      updateData('photos', [...data.photos, ...newPhotos])
    }
  }

  const handleRemovePhoto = (index: number) => {
    const newPhotos = data.photos.filter((_, i) => i !== index)
    // Ensure at least one is featured
    if (newPhotos.length > 0 && !newPhotos.some(p => p.isFeatured)) {
      newPhotos[0].isFeatured = true
    }
    updateData('photos', newPhotos)
  }

  const handleSetFeatured = (index: number) => {
    const newPhotos = data.photos.map((p, i) => ({
      ...p,
      isFeatured: i === index,
    }))
    updateData('photos', newPhotos)
  }

  const handleAddDocuments = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newDocs = Array.from(e.target.files).map(file => ({
        url: URL.createObjectURL(file),
        name: file.name,
        type: file.type,
      }))
      updateData('documents', [...data.documents, ...newDocs])
    }
  }

  const handleRemoveDocument = (index: number) => {
    updateData('documents', data.documents.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return

    setIsSubmitting(true)
    try {
      // TODO: API call to submit onboarding data
      // POST /api/seller/onboarding
      // For now, show success
      await new Promise(resolve => setTimeout(resolve, 2000))

      // If premium, redirect to Stripe checkout
      if (data.planTier === 'premium') {
        // TODO: Redirect to Stripe
        alert('Premium plan selected! Redirecting to Stripe...')
      } else {
        // Redirect to pending approval page
        window.location.href = '/seller/onboarding/pending'
      }
    } catch (error) {
      setErrors({ submit: 'Failed to submit. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <StepAccountCreation data={data} errors={errors} updateData={updateData} />
      case 2:
        return <StepBusinessInfo data={data} errors={errors} updateData={updateData} />
      case 3:
        return <StepPhotos data={data} errors={errors} onAddPhotos={handleAddPhotos} onRemovePhoto={handleRemovePhoto} onSetFeatured={handleSetFeatured} />
      case 4:
        return <StepDocuments data={data} errors={errors} onAddDocuments={handleAddDocuments} onRemoveDocument={handleRemoveDocument} />
      case 5:
        return <StepSelectPlan data={data} updateData={updateData} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen" style={{ background: COLOR_BG_PRIMARY }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 border-b"
        style={{ borderColor: COLOR_BORDER, background: 'white' }}
      >
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-6">
          <h1 className="text-3xl font-black mb-2" style={{ color: COLOR_PRIMARY }}>
            Get Started as a Seller
          </h1>
          <p style={{ color: COLOR_TEXT_SECONDARY }}>
            List your business on Forward and find the right buyer. Complete our guided wizard in 5 minutes.
          </p>
        </div>
      </motion.div>

      <div className="max-w-5xl mx-auto px-4 md:px-8 py-8">
        {/* Progress Indicator */}
        <div className="mb-12">
          <div className="flex gap-2 mb-6">
            {STEPS.map((step, idx) => (
              <motion.div
                key={step.id}
                className="flex-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.1 }}
              >
                <button
                  onClick={() => {
                    if (idx < currentStep) setCurrentStep(step.id)
                  }}
                  disabled={idx >= currentStep}
                  className={`w-full px-3 py-3 rounded-lg border transition-all text-xs sm:text-sm font-semibold flex items-center gap-2 ${
                    step.id === currentStep
                      ? 'opacity-100'
                      : step.id < currentStep
                        ? 'opacity-100'
                        : 'opacity-50'
                  }`}
                  style={{
                    borderColor: step.id <= currentStep ? COLOR_ACCENT : COLOR_BORDER,
                    color: step.id <= currentStep ? COLOR_ACCENT : COLOR_TEXT_SECONDARY,
                    background: step.id < currentStep ? COLOR_BG_PRIMARY : 'transparent',
                  }}
                >
                  <div className="flex-shrink-0">
                    {step.id < currentStep ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      step.icon
                    )}
                  </div>
                  <span className="hidden sm:inline">{step.title}</span>
                </button>
              </motion.div>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full transition-all"
              style={{
                width: `${(currentStep / STEPS.length) * 100}%`,
                background: COLOR_ACCENT,
              }}
              initial={{ width: 0 }}
              animate={{ width: `${(currentStep / STEPS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-lg border p-8" style={{ borderColor: COLOR_BORDER }}>
              <h2 className="text-2xl font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
                {STEPS[currentStep - 1].title}
              </h2>
              <p className="mb-8" style={{ color: COLOR_TEXT_SECONDARY }}>
                {STEPS[currentStep - 1].description}
              </p>

              {errors.submit && (
                <div className="mb-6 p-4 rounded-lg flex items-center gap-3" style={{ background: palette.crimson[50], borderLeft: `4px solid ${palette.crimson[400]}` }}>
                  <AlertCircle size={20} style={{ color: palette.crimson[600] }} />
                  <span style={{ color: palette.crimson[800] }} className="text-sm">
                    {errors.submit}
                  </span>
                </div>
              )}

              {renderStepContent()}

              {/* Navigation */}
              <div className="flex gap-4 mt-8 pt-8 border-t" style={{ borderColor: COLOR_BORDER }}>
                <button
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  className="px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all disabled:opacity-50 border"
                  style={{ borderColor: COLOR_BORDER, color: COLOR_PRIMARY }}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>

                <button
                  onClick={currentStep === STEPS.length ? handleSubmit : handleNext}
                  disabled={isSubmitting}
                  className="ml-auto px-6 py-3 rounded-lg font-semibold text-white flex items-center gap-2 transition-all hover:opacity-90 disabled:opacity-50"
                  style={{ background: COLOR_ACCENT }}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : currentStep === STEPS.length ? (
                    <>
                      Submit
                      <CheckCircle2 className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>

          {/* Sidebar - Plan Preview */}
          {currentStep === 5 ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <div className="sticky top-24 space-y-4">
                <div className="text-sm font-bold" style={{ color: COLOR_TEXT_SECONDARY }}>
                  SELECTED PLAN
                </div>
                <div className={`p-6 rounded-lg border-2 transition-all ${
                  data.planTier === 'freemium' ? 'border-gray-300' : 'border-gray-200'
                }`}>
                  <h3 className="font-bold text-lg mb-2" style={{ color: COLOR_PRIMARY }}>
                    Freemium
                  </h3>
                  <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-sm mb-4">
                    Free listing on marketplace with basic metrics
                  </p>
                  <button
                    onClick={() => updateData('planTier', 'freemium')}
                    className={`w-full py-2 rounded-lg font-semibold transition-all text-sm ${
                      data.planTier === 'freemium'
                        ? 'text-white'
                        : 'border'
                    }`}
                    style={{
                      background: data.planTier === 'freemium' ? COLOR_ACCENT : 'transparent',
                      borderColor: COLOR_BORDER,
                      color: data.planTier === 'freemium' ? 'white' : COLOR_PRIMARY,
                    }}
                  >
                    {data.planTier === 'freemium' ? '✓ Selected' : 'Select'}
                  </button>
                </div>

                <div className={`p-6 rounded-lg border-2 transition-all ${
                  data.planTier === 'premium' ? 'border-yellow-400' : 'border-gray-200'
                }`} style={{
                  background: data.planTier === 'premium' ? COLOR_BG_PRIMARY : 'white',
                }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Crown size={18} style={{ color: palette.amber[500] }} />
                    <h3 className="font-bold text-lg" style={{ color: COLOR_PRIMARY }}>
                      Premium
                    </h3>
                  </div>
                  <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-sm mb-4">
                    Featured listing with data room & analytics
                  </p>
                  <button
                    onClick={() => updateData('planTier', 'premium')}
                    className={`w-full py-2 rounded-lg font-semibold transition-all text-sm ${
                      data.planTier === 'premium'
                        ? 'text-white'
                        : 'border'
                    }`}
                    style={{
                      background: data.planTier === 'premium' ? COLOR_ACCENT : 'transparent',
                      borderColor: COLOR_BORDER,
                      color: data.planTier === 'premium' ? 'white' : COLOR_PRIMARY,
                    }}
                  >
                    {data.planTier === 'premium' ? '✓ Selected' : 'Select'}
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <div className="sticky top-24 bg-white rounded-lg border p-6 space-y-4" style={{ borderColor: COLOR_BORDER }}>
                <h3 className="font-bold" style={{ color: COLOR_PRIMARY }}>
                  Premium Benefits
                </h3>
                <div className="space-y-3">
                  {PREMIUM_BENEFITS.map((benefit, i) => (
                    <div key={i} className="flex items-start gap-3 text-sm">
                      <span className="text-base flex-shrink-0">✨</span>
                      <span style={{ color: COLOR_TEXT_SECONDARY }}>{benefit}</span>
                    </div>
                  ))}
                </div>
                <div className="p-3 rounded-lg" style={{ background: COLOR_BG_PRIMARY }}>
                  <p className="text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>
                    Unlock premium features after we verify your business details and approve your listing.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// STEP COMPONENTS
// ============================================================================

function StepAccountCreation({
  data,
  errors,
  updateData,
}: {
  data: OnboardingData
  errors: Record<string, string>
  updateData: (field: string, value: any) => void
}) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: COLOR_PRIMARY }}>
            First Name
          </label>
          <input
            type="text"
            placeholder="John"
            value={data.firstName}
            onChange={(e) => updateData('firstName', e.target.value)}
            className="w-full px-4 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2"
            style={{ borderColor: errors.firstName ? palette.crimson[400] : COLOR_BORDER, outlineColor: COLOR_ACCENT }}
          />
          {errors.firstName && <p className="text-xs mt-1" style={{ color: palette.crimson[400] }}>{errors.firstName}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: COLOR_PRIMARY }}>
            Last Name
          </label>
          <input
            type="text"
            placeholder="Doe"
            value={data.lastName}
            onChange={(e) => updateData('lastName', e.target.value)}
            className="w-full px-4 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2"
            style={{ borderColor: errors.lastName ? palette.crimson[400] : COLOR_BORDER, outlineColor: COLOR_ACCENT }}
          />
          {errors.lastName && <p className="text-xs mt-1" style={{ color: palette.crimson[400] }}>{errors.lastName}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2" style={{ color: COLOR_PRIMARY }}>
          Company Name
        </label>
        <input
          type="text"
          placeholder="Your Company Inc."
          value={data.companyName}
          onChange={(e) => updateData('companyName', e.target.value)}
          className="w-full px-4 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2"
          style={{ borderColor: errors.companyName ? palette.crimson[400] : COLOR_BORDER, outlineColor: COLOR_ACCENT }}
        />
        {errors.companyName && <p className="text-xs mt-1" style={{ color: palette.crimson[400] }}>{errors.companyName}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2" style={{ color: COLOR_PRIMARY }}>
          Email Address
        </label>
        <input
          type="email"
          placeholder="your@email.com"
          value={data.email}
          onChange={(e) => updateData('email', e.target.value)}
          className="w-full px-4 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2"
          style={{ borderColor: errors.email ? palette.crimson[400] : COLOR_BORDER, outlineColor: COLOR_ACCENT }}
        />
        {errors.email && <p className="text-xs mt-1" style={{ color: palette.crimson[400] }}>{errors.email}</p>}
        <p className="text-xs mt-2" style={{ color: COLOR_TEXT_SECONDARY }}>
          We'll send a verification link to this email
        </p>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2" style={{ color: COLOR_PRIMARY }}>
          Phone Number (Optional)
        </label>
        <input
          type="tel"
          placeholder="+1 (555) 123-4567"
          value={data.phone}
          onChange={(e) => updateData('phone', e.target.value)}
          className="w-full px-4 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2"
          style={{ borderColor: COLOR_BORDER, outlineColor: COLOR_ACCENT }}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2" style={{ color: COLOR_PRIMARY }}>
          Password
        </label>
        <PasswordInput
          placeholder="Min 8 characters"
          value={data.password}
          onChange={(e) => updateData('password', e.target.value)}
          className="w-full pl-4 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2"
          style={{ borderColor: errors.password ? palette.crimson[400] : COLOR_BORDER, outlineColor: COLOR_ACCENT }}
        />
        {errors.password && <p className="text-xs mt-1" style={{ color: palette.crimson[400] }}>{errors.password}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2" style={{ color: COLOR_PRIMARY }}>
          Confirm Password
        </label>
        <PasswordInput
          placeholder="Confirm password"
          value={data.confirmPassword}
          onChange={(e) => updateData('confirmPassword', e.target.value)}
          className="w-full pl-4 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2"
          style={{ borderColor: errors.confirmPassword ? palette.crimson[400] : COLOR_BORDER, outlineColor: COLOR_ACCENT }}
        />
        {errors.confirmPassword && <p className="text-xs mt-1" style={{ color: palette.crimson[400] }}>{errors.confirmPassword}</p>}
      </div>

      <div className="p-4 rounded-lg" style={{ background: COLOR_BG_PRIMARY }}>
        <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
          ✓ Your account is secure. Password-protected and encrypted.
        </p>
      </div>
    </div>
  )
}

function StepBusinessInfo({
  data,
  errors,
  updateData,
}: {
  data: OnboardingData
  errors: Record<string, string>
  updateData: (field: string, value: any) => void
}) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold mb-2" style={{ color: COLOR_PRIMARY }}>
          Business Description *
        </label>
        <textarea
          placeholder="Describe your business. What do you do, who are your customers, what makes you unique?"
          value={data.businessDescription}
          onChange={(e) => updateData('businessDescription', e.target.value)}
          className="w-full px-4 py-3 rounded-lg border text-sm resize-none h-28 focus:outline-none focus:ring-2"
          style={{ borderColor: errors.businessDescription ? palette.crimson[400] : COLOR_BORDER, outlineColor: COLOR_ACCENT }}
        />
        {errors.businessDescription && <p className="text-xs mt-1" style={{ color: palette.crimson[400] }}>{errors.businessDescription}</p>}
        <p className="text-xs mt-1" style={{ color: COLOR_TEXT_SECONDARY }}>
          {data.businessDescription.length}/500 characters (minimum 50)
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: COLOR_PRIMARY }}>
            Industry *
          </label>
          <select
            value={data.industry}
            onChange={(e) => updateData('industry', e.target.value)}
            className="w-full px-4 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2"
            style={{ borderColor: errors.industry ? palette.crimson[400] : COLOR_BORDER, outlineColor: COLOR_ACCENT }}
          >
            <option value="">Select industry...</option>
            <option value="SAAS">SaaS</option>
            <option value="HEALTHCARE">Healthcare</option>
            <option value="ECOMMERCE">Ecommerce</option>
            <option value="SERVICES">Services</option>
            <option value="RETAIL">Retail</option>
            <option value="FINTECH">Fintech</option>
            <option value="OTHER">Other</option>
          </select>
          {errors.industry && <p className="text-xs mt-1" style={{ color: palette.crimson[400] }}>{errors.industry}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: COLOR_PRIMARY }}>
            Location (Country/Region) *
          </label>
          <input
            type="text"
            placeholder="e.g., United States, Dubai"
            value={data.location}
            onChange={(e) => updateData('location', e.target.value)}
            className="w-full px-4 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2"
            style={{ borderColor: errors.location ? palette.crimson[400] : COLOR_BORDER, outlineColor: COLOR_ACCENT }}
          />
          {errors.location && <p className="text-xs mt-1" style={{ color: palette.crimson[400] }}>{errors.location}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: COLOR_PRIMARY }}>
            Founding Year
          </label>
          <input
            type="number"
            min="1990"
            max={new Date().getFullYear()}
            value={data.foundingYear}
            onChange={(e) => updateData('foundingYear', parseInt(e.target.value))}
            className="w-full px-4 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2"
            style={{ borderColor: COLOR_BORDER, outlineColor: COLOR_ACCENT }}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: COLOR_PRIMARY }}>
            Team Size
          </label>
          <input
            type="number"
            min="1"
            value={data.teamSize}
            onChange={(e) => updateData('teamSize', parseInt(e.target.value))}
            className="w-full px-4 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2"
            style={{ borderColor: errors.teamSize ? palette.crimson[400] : COLOR_BORDER, outlineColor: COLOR_ACCENT }}
          />
          {errors.teamSize && <p className="text-xs mt-1" style={{ color: palette.crimson[400] }}>{errors.teamSize}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2" style={{ color: COLOR_PRIMARY }}>
          Top 5 Customers (comma-separated, optional)
        </label>
        <textarea
          placeholder="e.g., Acme Corp, TechFlow Inc, Digital Solutions"
          value={data.topCustomers}
          onChange={(e) => updateData('topCustomers', e.target.value)}
          className="w-full px-4 py-3 rounded-lg border text-sm resize-none h-20 focus:outline-none focus:ring-2"
          style={{ borderColor: COLOR_BORDER, outlineColor: COLOR_ACCENT }}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2" style={{ color: COLOR_PRIMARY }}>
          Financial Summary (Optional)
        </label>
        <textarea
          placeholder="Summarize your last 2 years of performance: Revenue trend, profitability, key metrics, growth drivers"
          value={data.financialsSummary}
          onChange={(e) => updateData('financialsSummary', e.target.value)}
          className="w-full px-4 py-3 rounded-lg border text-sm resize-none h-24 focus:outline-none focus:ring-2"
          style={{ borderColor: COLOR_BORDER, outlineColor: COLOR_ACCENT }}
        />
      </div>
    </div>
  )
}

function StepPhotos({
  data,
  errors,
  onAddPhotos,
  onRemovePhoto,
  onSetFeatured,
}: {
  data: OnboardingData
  errors: Record<string, string>
  onAddPhotos: (e: React.ChangeEvent<HTMLInputElement>) => void
  onRemovePhoto: (index: number) => void
  onSetFeatured: (index: number) => void
}) {
  return (
    <div className="space-y-6">
      <div className="p-4 rounded-lg" style={{ background: COLOR_BG_PRIMARY }}>
        <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
          Upload 3-5 high-quality photos of your business, team, products, and office. The first photo will be your featured image.
        </p>
      </div>

      <div className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors" style={{ borderColor: COLOR_ACCENT }}>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={onAddPhotos}
          className="hidden"
          id="photo-upload"
        />
        <label htmlFor="photo-upload" className="cursor-pointer">
          <Upload size={32} className="mx-auto mb-2" style={{ color: COLOR_ACCENT }} />
          <p className="font-semibold" style={{ color: COLOR_PRIMARY }}>
            Click to upload photos
          </p>
          <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
            JPG, PNG • Up to 10MB each
          </p>
        </label>
      </div>

      {errors.photos && <p className="text-xs" style={{ color: palette.crimson[400] }}>{errors.photos}</p>}
      {errors.featured && <p className="text-xs" style={{ color: palette.crimson[400] }}>{errors.featured}</p>}

      {data.photos.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold mb-4" style={{ color: COLOR_PRIMARY }}>
            Uploaded Photos ({data.photos.length})
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {data.photos.map((photo, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative group"
              >
                <img
                  src={photo.url}
                  alt={photo.name}
                  className="w-full h-32 object-cover rounded-lg"
                />
                {photo.isFeatured && (
                  <div className="absolute top-2 left-2 bg-yellow-400 text-xs font-bold px-2 py-1 rounded text-white">
                    ⭐ FEATURED
                  </div>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                  {!photo.isFeatured && (
                    <button
                      onClick={() => onSetFeatured(idx)}
                      className="px-3 py-1 rounded-lg bg-yellow-400 text-white text-xs font-bold hover:bg-yellow-500 transition-all"
                    >
                      Set Featured
                    </button>
                  )}
                  <button
                    onClick={() => onRemovePhoto(idx)}
                    className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all"
                  >
                    <X size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function StepDocuments({
  data,
  errors,
  onAddDocuments,
  onRemoveDocument,
}: {
  data: OnboardingData
  errors: Record<string, string>
  onAddDocuments: (e: React.ChangeEvent<HTMLInputElement>) => void
  onRemoveDocument: (index: number) => void
}) {
  return (
    <div className="space-y-6">
      <div className="p-4 rounded-lg" style={{ background: COLOR_BG_PRIMARY }}>
        <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
          📄 Upload financial statements, P&L, tax returns, contracts, or any business documents. We'll OCR and verify them.
        </p>
      </div>

      <div className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors" style={{ borderColor: COLOR_ACCENT }}>
        <input
          type="file"
          multiple
          accept=".pdf,.xlsx,.csv,.doc,.docx"
          onChange={onAddDocuments}
          className="hidden"
          id="document-upload"
        />
        <label htmlFor="document-upload" className="cursor-pointer">
          <Upload size={32} className="mx-auto mb-2" style={{ color: COLOR_ACCENT }} />
          <p className="font-semibold" style={{ color: COLOR_PRIMARY }}>
            Upload documents
          </p>
          <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
            PDF, Excel, Word • Up to 50MB
          </p>
        </label>
      </div>

      {errors.documents && <p className="text-xs" style={{ color: palette.crimson[400] }}>{errors.documents}</p>}

      {data.documents.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold mb-4" style={{ color: COLOR_PRIMARY }}>
            Uploaded Documents ({data.documents.length})
          </h3>
          <div className="space-y-2">
            {data.documents.map((doc, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 p-3 rounded-lg"
                style={{ background: COLOR_BG_PRIMARY }}
              >
                <FileText size={20} style={{ color: COLOR_ACCENT }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: COLOR_PRIMARY }}>
                    {doc.name}
                  </p>
                </div>
                <button
                  onClick={() => onRemoveDocument(idx)}
                  className="p-2 rounded-lg hover:bg-gray-200 transition-all"
                >
                  <X size={16} style={{ color: COLOR_TEXT_SECONDARY }} />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function StepSelectPlan({ data, updateData }: { data: OnboardingData; updateData: (field: string, value: any) => void }) {
  return (
    <div className="space-y-6">
      <div className="p-4 rounded-lg" style={{ background: COLOR_BG_PRIMARY }}>
        <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
          Choose your plan. You can always upgrade later. If you select Premium, you'll pay after we verify your business is legitimate.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Freemium */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          onClick={() => updateData('planTier', 'freemium')}
          className={`p-6 rounded-lg border-2 text-left transition-all ${
            data.planTier === 'freemium'
              ? 'border-blue-400'
              : 'border-gray-200 hover:border-gray-300'
          }`}
          style={{
            background: data.planTier === 'freemium' ? COLOR_BG_PRIMARY : 'white',
          }}
        >
          <h3 className="text-lg font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
            Freemium
          </h3>
          <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-sm mb-6">
            Perfect for getting started
          </p>

          <ul className="space-y-2 mb-6 text-sm">
            <li className="flex items-start gap-2" style={{ color: COLOR_TEXT_SECONDARY }}>
              <span className="text-base flex-shrink-0">✓</span>
              <span>Listed on marketplace</span>
            </li>
            <li className="flex items-start gap-2" style={{ color: COLOR_TEXT_SECONDARY }}>
              <span className="text-base flex-shrink-0">✓</span>
              <span>Basic business metrics</span>
            </li>
            <li className="flex items-start gap-2" style={{ color: COLOR_TEXT_SECONDARY }}>
              <span className="text-base flex-shrink-0">✓</span>
              <span>Contact interested buyers</span>
            </li>
            <li className="flex items-start gap-2" style={{ color: COLOR_TEXT_SECONDARY }}>
              <span className="text-base flex-shrink-0">✓</span>
              <span>Email support</span>
            </li>
          </ul>

          <div className="text-2xl font-bold" style={{ color: COLOR_ACCENT }}>
            FREE
          </div>

          <button
            className={`w-full mt-4 py-2 rounded-lg font-semibold transition-all text-sm ${
              data.planTier === 'freemium'
                ? 'text-white'
                : 'border'
            }`}
            style={{
              background: data.planTier === 'freemium' ? COLOR_ACCENT : 'transparent',
              borderColor: COLOR_BORDER,
              color: data.planTier === 'freemium' ? 'white' : COLOR_PRIMARY,
            }}
          >
            {data.planTier === 'freemium' ? '✓ Selected' : 'Select'}
          </button>
        </motion.button>

        {/* Premium */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          onClick={() => updateData('planTier', 'premium')}
          className={`p-6 rounded-lg border-2 text-left transition-all relative overflow-hidden ${
            data.planTier === 'premium'
              ? 'border-yellow-400'
              : 'border-gray-200 hover:border-gray-300'
          }`}
          style={{
            background: data.planTier === 'premium' ? COLOR_BG_PRIMARY : 'white',
          }}
        >
          <div className="absolute top-3 right-3 bg-yellow-400 text-white text-xs font-bold px-3 py-1 rounded-full">
            RECOMMENDED
          </div>

          <h3 className="text-lg font-bold mb-2 flex items-center gap-2" style={{ color: COLOR_PRIMARY }}>
            <Crown size={20} style={{ color: palette.amber[500] }} />
            Premium
          </h3>
          <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-sm mb-6">
            Maximum exposure & buyer trust
          </p>

          <ul className="space-y-2 mb-6 text-sm">
            <li className="flex items-start gap-2" style={{ color: COLOR_TEXT_SECONDARY }}>
              <span className="text-base flex-shrink-0">✓</span>
              <span>Featured on marketplace</span>
            </li>
            <li className="flex items-start gap-2" style={{ color: COLOR_TEXT_SECONDARY }}>
              <span className="text-base flex-shrink-0">✓</span>
              <span>Financial data visible to buyers</span>
            </li>
            <li className="flex items-start gap-2" style={{ color: COLOR_TEXT_SECONDARY }}>
              <span className="text-base flex-shrink-0">✓</span>
              <span>Data room with buyer access</span>
            </li>
            <li className="flex items-start gap-2" style={{ color: COLOR_TEXT_SECONDARY }}>
              <span className="text-base flex-shrink-0">✓</span>
              <span>Analytics dashboard</span>
            </li>
            <li className="flex items-start gap-2" style={{ color: COLOR_TEXT_SECONDARY }}>
              <span className="text-base flex-shrink-0">✓</span>
              <span>Priority support</span>
            </li>
          </ul>

          <div className="text-2xl font-bold" style={{ color: COLOR_ACCENT }}>
            $99/mo
          </div>
          <p className="text-xs mt-1" style={{ color: COLOR_TEXT_SECONDARY }}>
            First month after approval
          </p>

          <button
            className={`w-full mt-4 py-2 rounded-lg font-semibold transition-all text-sm ${
              data.planTier === 'premium'
                ? 'text-white'
                : 'border'
            }`}
            style={{
              background: data.planTier === 'premium' ? COLOR_ACCENT : 'transparent',
              borderColor: COLOR_BORDER,
              color: data.planTier === 'premium' ? 'white' : COLOR_PRIMARY,
            }}
          >
            {data.planTier === 'premium' ? '✓ Selected' : 'Select'}
          </button>
        </motion.button>
      </div>
    </div>
  )
}

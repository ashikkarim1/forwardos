'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, Upload, AlertCircle, ArrowRight, X } from 'lucide-react'
import { useLocale } from '@/context/LocaleContext'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER } from '@/styles/forward-colors'

type WizardStep = 'business-info' | 'financials' | 'description' | 'photos' | 'review' | 'success'

interface BusinessData {
  // Step 1: Basic Info
  businessName: string
  businessType: string
  location: string
  yearFounded: string
  employees: string
  website: string

  // Step 2: Financials
  annualRevenue: string
  valuation: string
  growthRate: string

  // Step 3: Description
  businessDescription: string
  whySellingReason: string

  // Step 4: Photos
  photos: File[]

  // Metadata
  createdAt: string
}

interface ValidationErrors {
  [key: string]: string
}

export function SellerBusinessUploadWizard({ onSuccess }: { onSuccess?: () => void }) {
  const { locale, isRTL } = useLocale()
  const [currentStep, setCurrentStep] = useState<WizardStep>('business-info')
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [showPremiumUpsell, setShowPremiumUpsell] = useState(false)

  const [businessData, setBusinessData] = useState<BusinessData>({
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
    photos: [],
    createdAt: new Date().toISOString(),
  })

  // ==================== VALIDATION ====================

  const validateStep = (step: WizardStep): boolean => {
    const newErrors: ValidationErrors = {}

    if (step === 'business-info') {
      if (!businessData.businessName.trim()) {
        newErrors.businessName = 'Business name is required'
      } else if (businessData.businessName.trim().length < 2) {
        newErrors.businessName = 'Business name must be at least 2 characters'
      }

      if (!businessData.businessType.trim()) {
        newErrors.businessType = 'Business type is required'
      }

      if (!businessData.location.trim()) {
        newErrors.location = 'Location is required'
      }

      if (!businessData.yearFounded.trim()) {
        newErrors.yearFounded = 'Year founded is required'
      } else {
        const year = parseInt(businessData.yearFounded, 10)
        if (isNaN(year) || year < 1900 || year > new Date().getFullYear()) {
          newErrors.yearFounded = `Year must be between 1900 and ${new Date().getFullYear()}`
        }
      }

      if (!businessData.employees.trim()) {
        newErrors.employees = 'Number of employees is required'
      } else {
        const emp = parseInt(businessData.employees, 10)
        if (isNaN(emp) || emp < 1) {
          newErrors.employees = 'Employees must be at least 1'
        }
      }

      if (businessData.website.trim() && !isValidUrl(businessData.website)) {
        newErrors.website = 'Please enter a valid URL (e.g., https://example.com)'
      }
    }

    if (step === 'financials') {
      if (!businessData.annualRevenue.trim()) {
        newErrors.annualRevenue = 'Annual revenue is required'
      } else {
        const revenue = parseFloat(businessData.annualRevenue)
        if (isNaN(revenue) || revenue < 0) {
          newErrors.annualRevenue = 'Please enter a valid revenue amount'
        }
      }

      if (!businessData.valuation.trim()) {
        newErrors.valuation = 'Valuation is required'
      } else {
        const val = parseFloat(businessData.valuation)
        if (isNaN(val) || val < 0) {
          newErrors.valuation = 'Please enter a valid valuation'
        }
      }

      if (!businessData.growthRate.trim()) {
        newErrors.growthRate = 'Growth rate is required'
      } else {
        const growth = parseFloat(businessData.growthRate)
        if (isNaN(growth) || growth < -100 || growth > 1000) {
          newErrors.growthRate = 'Growth rate must be between -100% and 1000%'
        }
      }
    }

    if (step === 'description') {
      if (!businessData.businessDescription.trim()) {
        newErrors.businessDescription = 'Business description is required'
      } else if (businessData.businessDescription.trim().length < 20) {
        newErrors.businessDescription = 'Description must be at least 20 characters'
      } else if (businessData.businessDescription.trim().length > 1000) {
        newErrors.businessDescription = 'Description cannot exceed 1000 characters'
      }

      if (!businessData.whySellingReason.trim()) {
        newErrors.whySellingReason = 'Please tell us why you\'re selling'
      } else if (businessData.whySellingReason.trim().length < 10) {
        newErrors.whySellingReason = 'Please provide more detail (at least 10 characters)'
      }
    }

    if (step === 'photos') {
      if (businessData.photos.length === 0) {
        newErrors.photos = 'At least 1 photo is required. Free tier allows up to 3 photos.'
      } else if (businessData.photos.length > 3) {
        newErrors.photos = 'Free tier limited to 3 photos. Upgrade to Premium for up to 20 photos.'
      }

      // Validate photo formats and sizes
      businessData.photos.forEach((file, idx) => {
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
          newErrors[`photo_${idx}_type`] = 'Only JPG, PNG, and WebP are supported'
        }
        if (file.size > 5 * 1024 * 1024) {
          newErrors[`photo_${idx}_size`] = 'Photos must be under 5MB'
        }
      })
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  // ==================== STEP NAVIGATION ====================

  const handleNext = () => {
    if (!validateStep(currentStep)) {
      return
    }

    const stepOrder: WizardStep[] = ['business-info', 'financials', 'description', 'photos', 'review', 'success']
    const currentIndex = stepOrder.indexOf(currentStep)
    if (currentIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentIndex + 1])
      window.scrollTo(0, 0)
    }
  }

  const handleBack = () => {
    const stepOrder: WizardStep[] = ['business-info', 'financials', 'description', 'photos', 'review', 'success']
    const currentIndex = stepOrder.indexOf(currentStep)
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1])
      window.scrollTo(0, 0)
    }
  }

  const handleSubmit = async () => {
    if (!validateStep('review')) {
      return
    }

    setSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // In production, this would be:
    // const response = await fetch('/api/seller/business', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(businessData),
    // })

    setSubmitting(false)
    setCurrentStep('success')
    window.scrollTo(0, 0)
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const newPhotos = [...businessData.photos, ...files].slice(0, 3) // Max 3 for free tier
    setBusinessData({ ...businessData, photos: newPhotos })
    setErrors((prev) => {
      const updated = { ...prev }
      delete updated.photos
      return updated
    })
  }

  const removePhoto = (index: number) => {
    const newPhotos = businessData.photos.filter((_, i) => i !== index)
    setBusinessData({ ...businessData, photos: newPhotos })
  }

  const handleInputChange = (field: keyof BusinessData, value: string) => {
    setBusinessData((prev) => ({ ...prev, [field]: value }))
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const updated = { ...prev }
        delete updated[field]
        return updated
      })
    }
  }

  // ==================== STEP 1: BUSINESS INFO ====================

  if (currentStep === 'business-info') {
    return (
      <div className="min-h-screen bg-white" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-black mb-4" style={{ color: COLOR_PRIMARY }}>
              📝 List Your Business for Free
            </h1>
            <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-lg">
              Get discovered by 5,000+ verified buyers. It takes just 5 minutes.
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold" style={{ color: COLOR_PRIMARY }}>
                Step 1 of 5
              </span>
              <span style={{ color: COLOR_TEXT_SECONDARY }} className="text-sm">
                Business Info
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all"
                style={{ width: '20%', background: COLOR_ACCENT }}
              ></div>
            </div>
          </div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Business Name */}
            <div>
              <label className="block text-sm font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
                Business Name *
              </label>
              <input
                type="text"
                placeholder="e.g., TechFlow SaaS Inc."
                value={businessData.businessName}
                onChange={(e) => handleInputChange('businessName', e.target.value)}
                className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                style={{
                  borderColor: errors.businessName ? '#EF4444' : COLOR_BORDER,
                }}
              />
              {errors.businessName && (
                <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.businessName}
                </p>
              )}
            </div>

            {/* Business Type */}
            <div>
              <label className="block text-sm font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
                Business Type *
              </label>
              <select
                value={businessData.businessType}
                onChange={(e) => handleInputChange('businessType', e.target.value)}
                className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                style={{
                  borderColor: errors.businessType ? '#EF4444' : COLOR_BORDER,
                }}
              >
                <option value="">Select a category...</option>
                <option value="saas">SaaS / Software</option>
                <option value="ecommerce">E-commerce</option>
                <option value="marketplace">Marketplace</option>
                <option value="fintech">FinTech</option>
                <option value="healthtech">HealthTech</option>
                <option value="logistics">Logistics / Supply Chain</option>
                <option value="franchise">Franchise Network</option>
                <option value="services">Professional Services</option>
                <option value="other">Other</option>
              </select>
              {errors.businessType && (
                <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.businessType}
                </p>
              )}
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
                Primary Location *
              </label>
              <input
                type="text"
                placeholder="e.g., San Francisco, CA or Dubai, UAE"
                value={businessData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                style={{
                  borderColor: errors.location ? '#EF4444' : COLOR_BORDER,
                }}
              />
              {errors.location && (
                <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.location}
                </p>
              )}
            </div>

            {/* Year Founded */}
            <div>
              <label className="block text-sm font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
                Year Founded *
              </label>
              <input
                type="number"
                placeholder="e.g., 2018"
                value={businessData.yearFounded}
                onChange={(e) => handleInputChange('yearFounded', e.target.value)}
                className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                style={{
                  borderColor: errors.yearFounded ? '#EF4444' : COLOR_BORDER,
                }}
                min="1900"
                max={new Date().getFullYear()}
              />
              {errors.yearFounded && (
                <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.yearFounded}
                </p>
              )}
            </div>

            {/* Employees */}
            <div>
              <label className="block text-sm font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
                Number of Employees *
              </label>
              <input
                type="number"
                placeholder="e.g., 25"
                value={businessData.employees}
                onChange={(e) => handleInputChange('employees', e.target.value)}
                className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                style={{
                  borderColor: errors.employees ? '#EF4444' : COLOR_BORDER,
                }}
                min="1"
              />
              {errors.employees && (
                <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.employees}
                </p>
              )}
            </div>

            {/* Website */}
            <div>
              <label className="block text-sm font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
                Website (Optional)
              </label>
              <input
                type="url"
                placeholder="https://example.com"
                value={businessData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                style={{
                  borderColor: errors.website ? '#EF4444' : COLOR_BORDER,
                }}
              />
              {errors.website && (
                <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.website}
                </p>
              )}
            </div>

            {/* Navigation */}
            <div className="flex gap-4 mt-8 pt-6 border-t" style={{ borderColor: COLOR_BORDER }}>
              <button
                onClick={() => window.history.back()}
                className="px-6 py-3 rounded-lg font-bold border hover:bg-gray-50 transition-all flex-1"
                style={{ borderColor: COLOR_BORDER, color: COLOR_PRIMARY }}
              >
                Back
              </button>
              <button
                onClick={handleNext}
                className="px-6 py-3 rounded-lg font-bold text-white hover:opacity-90 transition-all flex-1 flex items-center justify-center gap-2"
                style={{ background: COLOR_ACCENT }}
              >
                Next: Financials
                <ArrowRight size={18} style={{ transform: isRTL ? 'scaleX(-1)' : 'none' }} />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  // ==================== STEP 2: FINANCIALS ====================

  if (currentStep === 'financials') {
    return (
      <div className="min-h-screen bg-white" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-black mb-4" style={{ color: COLOR_PRIMARY }}>
              💰 Financial Overview
            </h1>
            <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-lg">
              Help buyers understand your business value
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold" style={{ color: COLOR_PRIMARY }}>
                Step 2 of 5
              </span>
              <span style={{ color: COLOR_TEXT_SECONDARY }} className="text-sm">
                Financials
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all"
                style={{ width: '40%', background: COLOR_ACCENT }}
              ></div>
            </div>
          </div>

          {/* Form */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Annual Revenue */}
            <div>
              <label className="block text-sm font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
                Annual Revenue (USD) *
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-xl" style={{ color: COLOR_TEXT_SECONDARY }}>
                  $
                </span>
                <input
                  type="number"
                  placeholder="500000"
                  value={businessData.annualRevenue}
                  onChange={(e) => handleInputChange('annualRevenue', e.target.value)}
                  className="w-full pl-8 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                  style={{
                    borderColor: errors.annualRevenue ? '#EF4444' : COLOR_BORDER,
                  }}
                  min="0"
                />
              </div>
              {errors.annualRevenue && (
                <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.annualRevenue}
                </p>
              )}
            </div>

            {/* Valuation */}
            <div>
              <label className="block text-sm font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
                Business Valuation (USD) *
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-xl" style={{ color: COLOR_TEXT_SECONDARY }}>
                  $
                </span>
                <input
                  type="number"
                  placeholder="2500000"
                  value={businessData.valuation}
                  onChange={(e) => handleInputChange('valuation', e.target.value)}
                  className="w-full pl-8 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                  style={{
                    borderColor: errors.valuation ? '#EF4444' : COLOR_BORDER,
                  }}
                  min="0"
                />
              </div>
              {errors.valuation && (
                <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.valuation}
                </p>
              )}
            </div>

            {/* Growth Rate */}
            <div>
              <label className="block text-sm font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
                YoY Growth Rate (%) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  placeholder="45"
                  value={businessData.growthRate}
                  onChange={(e) => handleInputChange('growthRate', e.target.value)}
                  className="w-full px-4 pr-8 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                  style={{
                    borderColor: errors.growthRate ? '#EF4444' : COLOR_BORDER,
                  }}
                  min="-100"
                  max="1000"
                />
                <span className="absolute right-4 top-3 text-xl" style={{ color: COLOR_TEXT_SECONDARY }}>
                  %
                </span>
              </div>
              {errors.growthRate && (
                <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.growthRate}
                </p>
              )}
              <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-xs mt-2">
                Enter as a number (e.g., 45 for 45%). Negative numbers are allowed.
              </p>
            </div>

            {/* Info Box */}
            <div
              className="p-4 rounded-lg border flex gap-3"
              style={{ borderColor: COLOR_ACCENT + '40', background: COLOR_ACCENT + '08' }}
            >
              <AlertCircle size={20} style={{ color: COLOR_ACCENT, flexShrink: 0 }} />
              <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-sm">
                All financial data is displayed to verified buyers only. This information helps buyers assess fit and value.
              </p>
            </div>

            {/* Navigation */}
            <div className="flex gap-4 mt-8 pt-6 border-t" style={{ borderColor: COLOR_BORDER }}>
              <button
                onClick={handleBack}
                className="px-6 py-3 rounded-lg font-bold border hover:bg-gray-50 transition-all flex-1"
                style={{ borderColor: COLOR_BORDER, color: COLOR_PRIMARY }}
              >
                ← Back
              </button>
              <button
                onClick={handleNext}
                className="px-6 py-3 rounded-lg font-bold text-white hover:opacity-90 transition-all flex-1 flex items-center justify-center gap-2"
                style={{ background: COLOR_ACCENT }}
              >
                Next: Description
                <ArrowRight size={18} style={{ transform: isRTL ? 'scaleX(-1)' : 'none' }} />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  // ==================== STEP 3: DESCRIPTION ====================

  if (currentStep === 'description') {
    return (
      <div className="min-h-screen bg-white" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-black mb-4" style={{ color: COLOR_PRIMARY }}>
              📖 Tell Your Story
            </h1>
            <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-lg">
              Help buyers fall in love with your business
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold" style={{ color: COLOR_PRIMARY }}>
                Step 3 of 5
              </span>
              <span style={{ color: COLOR_TEXT_SECONDARY }} className="text-sm">
                Description
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all"
                style={{ width: '60%', background: COLOR_ACCENT }}
              ></div>
            </div>
          </div>

          {/* Form */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Business Description */}
            <div>
              <label className="block text-sm font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
                Business Description *
              </label>
              <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-xs mb-3">
                What does your business do? What problems do you solve? Keep it compelling (20-1000 characters).
              </p>
              <textarea
                placeholder="Tell us about your business. What's your value proposition? Who are your customers? What makes you unique?"
                value={businessData.businessDescription}
                onChange={(e) => handleInputChange('businessDescription', e.target.value)}
                className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all resize-none"
                style={{
                  borderColor: errors.businessDescription ? '#EF4444' : COLOR_BORDER,
                }}
                rows={6}
              />
              <div className="flex justify-between mt-2">
                <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-xs">
                  {businessData.businessDescription.length}/1000 characters
                </p>
                {errors.businessDescription && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle size={14} /> {errors.businessDescription}
                  </p>
                )}
              </div>
            </div>

            {/* Why Selling */}
            <div>
              <label className="block text-sm font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
                Why Are You Selling? *
              </label>
              <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-xs mb-3">
                Be transparent. Buyers respect honesty about motivation (retirement, new opportunity, growth funding, etc).
              </p>
              <textarea
                placeholder="Tell buyers why you're selling and what you're looking for in an ideal buyer..."
                value={businessData.whySellingReason}
                onChange={(e) => handleInputChange('whySellingReason', e.target.value)}
                className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all resize-none"
                style={{
                  borderColor: errors.whySellingReason ? '#EF4444' : COLOR_BORDER,
                }}
                rows={4}
              />
              {errors.whySellingReason && (
                <p className="text-sm text-red-500 mt-2 flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.whySellingReason}
                </p>
              )}
            </div>

            {/* Navigation */}
            <div className="flex gap-4 mt-8 pt-6 border-t" style={{ borderColor: COLOR_BORDER }}>
              <button
                onClick={handleBack}
                className="px-6 py-3 rounded-lg font-bold border hover:bg-gray-50 transition-all flex-1"
                style={{ borderColor: COLOR_BORDER, color: COLOR_PRIMARY }}
              >
                ← Back
              </button>
              <button
                onClick={handleNext}
                className="px-6 py-3 rounded-lg font-bold text-white hover:opacity-90 transition-all flex-1 flex items-center justify-center gap-2"
                style={{ background: COLOR_ACCENT }}
              >
                Next: Photos
                <ArrowRight size={18} style={{ transform: isRTL ? 'scaleX(-1)' : 'none' }} />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  // ==================== STEP 4: PHOTOS ====================

  if (currentStep === 'photos') {
    return (
      <div className="min-h-screen bg-white" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-black mb-4" style={{ color: COLOR_PRIMARY }}>
              📸 Add Photos
            </h1>
            <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-lg">
              High-quality photos help buyers visualize your business
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold" style={{ color: COLOR_PRIMARY }}>
                Step 4 of 5
              </span>
              <span style={{ color: COLOR_TEXT_SECONDARY }} className="text-sm">
                Photos (Free: 3, Premium: 20)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all"
                style={{ width: '80%', background: COLOR_ACCENT }}
              ></div>
            </div>
          </div>

          {/* Form */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Tier Info */}
            <div
              className="p-4 rounded-lg border flex gap-3"
              style={{ borderColor: COLOR_BORDER, background: COLOR_PRIMARY + '02' }}
            >
              <Upload size={20} style={{ color: COLOR_ACCENT, flexShrink: 0 }} />
              <div>
                <p className="font-bold text-sm mb-1" style={{ color: COLOR_PRIMARY }}>
                  Free Plan: Up to 3 Photos
                </p>
                <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-xs">
                  Upgrade to Premium to upload up to 20 photos, get professional curation, and featured newsletter placement.
                </p>
              </div>
            </div>

            {/* Upload Area */}
            <div>
              <label className="block text-sm font-bold mb-4" style={{ color: COLOR_PRIMARY }}>
                Upload Photos *
              </label>

              <label
                className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-all"
                style={{ borderColor: COLOR_ACCENT + '40' }}
              >
                <Upload size={32} className="mx-auto mb-3" style={{ color: COLOR_ACCENT }} />
                <p className="font-bold mb-1" style={{ color: COLOR_PRIMARY }}>
                  Click to upload or drag & drop
                </p>
                <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-sm">
                  JPG, PNG, or WebP (up to 5MB each)
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>

              {errors.photos && (
                <p className="text-sm text-red-500 mt-3 flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.photos}
                </p>
              )}
            </div>

            {/* Photo Preview */}
            {businessData.photos.length > 0 && (
              <div>
                <p className="text-sm font-bold mb-4" style={{ color: COLOR_PRIMARY }}>
                  Uploaded Photos ({businessData.photos.length}/3)
                </p>
                <div className="grid grid-cols-3 gap-4">
                  {businessData.photos.map((photo, idx) => (
                    <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border group" style={{ borderColor: COLOR_BORDER }}>
                      <img
                        src={URL.createObjectURL(photo)}
                        alt={`Photo ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => removePhoto(idx)}
                        className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center"
                      >
                        <X size={24} className="text-white" />
                      </button>
                      <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-xs mt-2 truncate">
                        {photo.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex gap-4 mt-8 pt-6 border-t" style={{ borderColor: COLOR_BORDER }}>
              <button
                onClick={handleBack}
                className="px-6 py-3 rounded-lg font-bold border hover:bg-gray-50 transition-all flex-1"
                style={{ borderColor: COLOR_BORDER, color: COLOR_PRIMARY }}
              >
                ← Back
              </button>
              <button
                onClick={handleNext}
                className="px-6 py-3 rounded-lg font-bold text-white hover:opacity-90 transition-all flex-1 flex items-center justify-center gap-2"
                style={{ background: COLOR_ACCENT }}
              >
                Review & Publish
                <ArrowRight size={18} style={{ transform: isRTL ? 'scaleX(-1)' : 'none' }} />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  // ==================== STEP 5: REVIEW ====================

  if (currentStep === 'review') {
    return (
      <div className="min-h-screen bg-white" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-black mb-4" style={{ color: COLOR_PRIMARY }}>
              ✓ Review & Publish
            </h1>
            <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-lg">
              Everything looks good? Let's go live!
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold" style={{ color: COLOR_PRIMARY }}>
                Step 5 of 5
              </span>
              <span style={{ color: COLOR_TEXT_SECONDARY }} className="text-sm">
                Review
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all"
                style={{ width: '100%', background: COLOR_ACCENT }}
              ></div>
            </div>
          </div>

          {/* Review Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Business Summary Card */}
            <div
              className="p-6 rounded-lg border"
              style={{ borderColor: COLOR_BORDER, background: COLOR_PRIMARY + '02' }}
            >
              <h2 className="text-xl font-black mb-4" style={{ color: COLOR_PRIMARY }}>
                Business Summary
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span style={{ color: COLOR_TEXT_SECONDARY }}>Business Name</span>
                  <span style={{ color: COLOR_PRIMARY }} className="font-bold">
                    {businessData.businessName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: COLOR_TEXT_SECONDARY }}>Type</span>
                  <span style={{ color: COLOR_PRIMARY }} className="font-bold">
                    {businessData.businessType}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: COLOR_TEXT_SECONDARY }}>Location</span>
                  <span style={{ color: COLOR_PRIMARY }} className="font-bold">
                    {businessData.location}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: COLOR_TEXT_SECONDARY }}>Founded</span>
                  <span style={{ color: COLOR_PRIMARY }} className="font-bold">
                    {businessData.yearFounded}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: COLOR_TEXT_SECONDARY }}>Employees</span>
                  <span style={{ color: COLOR_PRIMARY }} className="font-bold">
                    {businessData.employees}
                  </span>
                </div>
              </div>
            </div>

            {/* Financials Card */}
            <div
              className="p-6 rounded-lg border"
              style={{ borderColor: COLOR_BORDER, background: COLOR_PRIMARY + '02' }}
            >
              <h2 className="text-xl font-black mb-4" style={{ color: COLOR_PRIMARY }}>
                Financial Metrics
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span style={{ color: COLOR_TEXT_SECONDARY }}>Annual Revenue</span>
                  <span style={{ color: COLOR_PRIMARY }} className="font-bold">
                    ${parseInt(businessData.annualRevenue).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: COLOR_TEXT_SECONDARY }}>Valuation</span>
                  <span style={{ color: COLOR_PRIMARY }} className="font-bold">
                    ${parseInt(businessData.valuation).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: COLOR_TEXT_SECONDARY }}>YoY Growth</span>
                  <span style={{ color: '#10B981' }} className="font-bold">
                    {businessData.growthRate}%
                  </span>
                </div>
              </div>
            </div>

            {/* Content Card */}
            <div
              className="p-6 rounded-lg border"
              style={{ borderColor: COLOR_BORDER, background: COLOR_PRIMARY + '02' }}
            >
              <h2 className="text-xl font-black mb-4" style={{ color: COLOR_PRIMARY }}>
                Description
              </h2>

              <div className="space-y-4 text-sm">
                <div>
                  <p style={{ color: COLOR_TEXT_SECONDARY }} className="font-bold mb-2">
                    What You Do
                  </p>
                  <p style={{ color: COLOR_TEXT_SECONDARY }}>{businessData.businessDescription}</p>
                </div>
                <div>
                  <p style={{ color: COLOR_TEXT_SECONDARY }} className="font-bold mb-2">
                    Why You're Selling
                  </p>
                  <p style={{ color: COLOR_TEXT_SECONDARY }}>{businessData.whySellingReason}</p>
                </div>
              </div>
            </div>

            {/* Photos Card */}
            <div
              className="p-6 rounded-lg border"
              style={{ borderColor: COLOR_BORDER, background: COLOR_PRIMARY + '02' }}
            >
              <h2 className="text-xl font-black mb-4" style={{ color: COLOR_PRIMARY }}>
                Photos ({businessData.photos.length}/3)
              </h2>

              {businessData.photos.length > 0 ? (
                <div className="grid grid-cols-3 gap-4">
                  {businessData.photos.map((photo, idx) => (
                    <img
                      key={idx}
                      src={URL.createObjectURL(photo)}
                      alt={`Photo ${idx + 1}`}
                      className="w-full aspect-square object-cover rounded-lg"
                    />
                  ))}
                </div>
              ) : (
                <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-sm">
                  No photos uploaded
                </p>
              )}
            </div>

            {/* Premium Upsell */}
            <div
              className="p-6 rounded-lg border-2"
              style={{ borderColor: COLOR_ACCENT + '40', background: COLOR_ACCENT + '08' }}
            >
              <h3 className="text-lg font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
                💎 Upgrade to Premium for Maximum Impact
              </h3>
              <ul className="space-y-2 text-sm mb-4" style={{ color: COLOR_TEXT_SECONDARY }}>
                <li>✓ Up to 20 photos instead of 3</li>
                <li>✓ Weekly newsletter feature to 5,000+ verified buyers</li>
                <li>✓ Featured on landing page carousel</li>
                <li>✓ Real-time analytics dashboard</li>
                <li>✓ Broker network matching</li>
                <li>✓ 30-day money-back guarantee</li>
              </ul>
              <p style={{ color: COLOR_ACCENT }} className="font-bold text-sm mb-4">
                Just $499/year (~$42/month) - 3x more buyer inquiries
              </p>
            </div>

            {/* Navigation */}
            <div className="flex gap-4 mt-8 pt-6 border-t" style={{ borderColor: COLOR_BORDER }}>
              <button
                onClick={handleBack}
                className="px-6 py-3 rounded-lg font-bold border hover:bg-gray-50 transition-all flex-1"
                style={{ borderColor: COLOR_BORDER, color: COLOR_PRIMARY }}
              >
                ← Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-6 py-3 rounded-lg font-bold text-white hover:opacity-90 transition-all flex-1 flex items-center justify-center gap-2 disabled:opacity-50"
                style={{ background: COLOR_ACCENT }}
              >
                {submitting ? 'Publishing...' : '🚀 Publish Listing'}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  // ==================== SUCCESS ====================

  return (
    <div className="min-h-screen bg-white" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col items-center justify-center">
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 100, damping: 15 }}
          className="mb-8"
        >
          <CheckCircle size={80} style={{ color: COLOR_ACCENT }} />
        </motion.div>

        {/* Success Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-black mb-4" style={{ color: COLOR_PRIMARY }}>
            🎉 Your Business Is Live!
          </h1>
          <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-lg mb-4">
            Congratulations! {businessData.businessName} is now visible to 5,000+ verified buyers.
          </p>
          <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-sm">
            Listing published on: {new Date().toLocaleDateString()}
          </p>
        </motion.div>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="w-full space-y-6 mb-12"
        >
          {/* What's Next */}
          <div
            className="p-6 rounded-lg border"
            style={{ borderColor: COLOR_BORDER, background: COLOR_PRIMARY + '02' }}
          >
            <h2 className="text-lg font-black mb-4" style={{ color: COLOR_PRIMARY }}>
              ✓ What Happens Next
            </h2>
            <ul className="space-y-3 text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
              <li className="flex gap-3">
                <span style={{ color: COLOR_ACCENT }}>1.</span>
                <span>
                  <strong>Verification</strong> - Our team verifies your listing (24-48 hours)
                </span>
              </li>
              <li className="flex gap-3">
                <span style={{ color: COLOR_ACCENT }}>2.</span>
                <span>
                  <strong>Buyer Discovery</strong> - Buyers find you via marketplace search and smart filters
                </span>
              </li>
              <li className="flex gap-3">
                <span style={{ color: COLOR_ACCENT }}>3.</span>
                <span>
                  <strong>Inquiries</strong> - Qualified buyers & brokers reach out directly
                </span>
              </li>
              <li className="flex gap-3">
                <span style={{ color: COLOR_ACCENT }}>4.</span>
                <span>
                  <strong>Dashboard</strong> - Track viewer counts, inquiries, and buyer interest in real-time
                </span>
              </li>
            </ul>
          </div>

          {/* Premium Upsell */}
          <div
            className="p-6 rounded-lg border-2"
            style={{ borderColor: COLOR_ACCENT + '40', background: COLOR_ACCENT + '08' }}
          >
            <h2 className="text-lg font-black mb-2" style={{ color: COLOR_PRIMARY }}>
              💎 Want 3x More Buyer Inquiries?
            </h2>
            <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-sm mb-4">
              Upgrade to Premium ($499/year) for:
            </p>
            <ul className="space-y-2 text-sm mb-4" style={{ color: COLOR_TEXT_SECONDARY }}>
              <li>✓ Up to 20 professional photos (vs 3)</li>
              <li>✓ Featured in weekly newsletter to 5,000+ buyers every Monday</li>
              <li>✓ Landing page featured rotation</li>
              <li>✓ Seller + broker excitement emails when featured</li>
              <li>✓ Real-time analytics dashboard</li>
              <li>✓ Broker network matching</li>
            </ul>
            <button
              onClick={() => setShowPremiumUpsell(true)}
              className="w-full px-6 py-3 rounded-lg font-bold text-white hover:opacity-90 transition-all"
              style={{ background: COLOR_ACCENT }}
            >
              Upgrade to Premium ($499/year) →
            </button>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex gap-4 w-full"
        >
          <Link
            href="/dashboard"
            className="flex-1 px-6 py-3 rounded-lg font-bold text-white hover:opacity-90 transition-all text-center"
            style={{ background: COLOR_ACCENT }}
          >
            Go to Dashboard →
          </Link>
          <Link
            href="/marketplace"
            className="flex-1 px-6 py-3 rounded-lg font-bold border hover:bg-gray-50 transition-all text-center"
            style={{ borderColor: COLOR_BORDER, color: COLOR_PRIMARY }}
          >
            Browse Similar Listings
          </Link>
        </motion.div>

        {/* Free Tier Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 pt-8 border-t text-center"
          style={{ borderColor: COLOR_BORDER }}
        >
          <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-sm">
            <strong>Free Plan Benefits:</strong> Your listing stays live for 90 days with access to basic marketplace discovery. No credit card required. Cancel anytime.
          </p>
        </motion.div>
      </div>
    </div>
  )
}

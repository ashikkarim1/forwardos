'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Building2,
  Image,
  FileText,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  AlertCircle,
  Zap,
  TrendingUp,
  Users,
  Upload,
  X,
  ArrowRight,
  Lock,
} from 'lucide-react'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER, COLOR_BG_PRIMARY } from '@/styles/forward-colors'

interface SubmissionData {
  businessDescription: string
  foundingYear: number
  teamSize: number
  topCustomers: string
  industry: string
  location: string
  financialsSummary: string
  photos: Array<{ url: string; name: string; isFeatured: boolean }>
  documents: Array<{ url: string; name: string }>
}

const COMPLETION_WEIGHTS = {
  businessDescription: 15,
  foundingYear: 5,
  teamSize: 5,
  topCustomers: 15,
  industry: 5,
  location: 5,
  financialsSummary: 20,
  photos: 10,
  documents: 20,
}

export default function SubmitBusinessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const userId = searchParams.get('userId')

  const [data, setData] = useState<SubmissionData>({
    businessDescription: '',
    foundingYear: new Date().getFullYear() - 5,
    teamSize: 10,
    topCustomers: '',
    industry: '',
    location: '',
    financialsSummary: '',
    photos: [],
    documents: [],
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [completenessScore, setCompletenessScore] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Calculate completeness score
  useEffect(() => {
    let score = 0

    if (data.businessDescription.length > 50) score += COMPLETION_WEIGHTS.businessDescription
    if (data.foundingYear > 1990) score += COMPLETION_WEIGHTS.foundingYear
    if (data.teamSize > 0) score += COMPLETION_WEIGHTS.teamSize
    if (data.topCustomers.length > 10) score += COMPLETION_WEIGHTS.topCustomers
    if (data.industry) score += COMPLETION_WEIGHTS.industry
    if (data.location) score += COMPLETION_WEIGHTS.location
    if (data.financialsSummary.length > 30) score += COMPLETION_WEIGHTS.financialsSummary
    if (data.photos.length > 0) score += COMPLETION_WEIGHTS.photos
    if (data.documents.length > 0) score += COMPLETION_WEIGHTS.documents

    setCompletenessScore(Math.min(100, score))
  }, [data])

  const updateData = (field: string, value: any) => {
    setData(prev => ({ ...prev, [field as keyof SubmissionData]: value }))
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const getTier = () => {
    if (completenessScore >= 80) return { name: 'Full Transparency', icon: '🔓', color: '#10B981' }
    if (completenessScore >= 50) return { name: 'Premium Verified', icon: '⭐', color: COLOR_ACCENT }
    if (completenessScore >= 25) return { name: 'Basic Listed', icon: '📋', color: '#F59E0B' }
    return { name: 'Incomplete', icon: '📝', color: COLOR_TEXT_SECONDARY }
  }

  const tier = getTier()

  const handleAddPhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newPhotos = Array.from(e.target.files).map(file => ({
        url: URL.createObjectURL(file),
        name: file.name,
        isFeatured: data.photos.length === 0,
      }))
      updateData('photos', [...data.photos, ...newPhotos])
    }
  }

  const handleRemovePhoto = (index: number) => {
    const newPhotos = data.photos.filter((_, i) => i !== index)
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
      }))
      updateData('documents', [...data.documents, ...newDocs])
    }
  }

  const handleRemoveDocument = (index: number) => {
    updateData('documents', data.documents.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/seller/submit-business', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          ...data,
          completenessScore,
        }),
      })

      if (response.ok) {
        router.push(`/seller/business-submitted?score=${completenessScore}`)
      } else {
        const error = await response.json()
        setErrors({ submit: error.error })
      }
    } catch (error) {
      setErrors({ submit: 'Failed to submit. Please try again.' })
    } finally {
      setIsSubmitting(false)
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
            Submit Your Business Information
          </h1>
          <p style={{ color: COLOR_TEXT_SECONDARY }}>
            The more complete your information, the more likely buyers will find you
          </p>
        </div>
      </motion.div>

      <div className="max-w-5xl mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            {errors.submit && (
              <div className="p-4 rounded-lg flex items-center gap-3" style={{ background: '#FEE2E2', borderLeft: '4px solid #EF4444' }}>
                <AlertCircle size={20} style={{ color: '#DC2626' }} />
                <span style={{ color: '#7F1D1D' }} className="text-sm">
                  {errors.submit}
                </span>
              </div>
            )}

            {/* Business Overview */}
            <div className="bg-white rounded-lg border p-6" style={{ borderColor: COLOR_BORDER }}>
              <h2 className="text-xl font-bold mb-4" style={{ color: COLOR_PRIMARY }}>
                📝 Business Overview
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: COLOR_PRIMARY }}>
                    Business Description (50+ characters)
                  </label>
                  <textarea
                    placeholder="Describe your business: What do you do, who are your customers, what makes you unique?"
                    value={data.businessDescription}
                    onChange={(e) => updateData('businessDescription', e.target.value)}
                    className="w-full p-3 rounded-lg border text-sm resize-none h-24 focus:outline-none focus:ring-2"
                    style={{ borderColor: COLOR_BORDER, outlineColor: COLOR_ACCENT }}
                  />
                  <p className="text-xs mt-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                    {data.businessDescription.length}/500 characters
                    {data.businessDescription.length > 50 && ' ✓'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: COLOR_PRIMARY }}>
                      Industry *
                    </label>
                    <select
                      value={data.industry}
                      onChange={(e) => updateData('industry', e.target.value)}
                      className="w-full p-3 rounded-lg border text-sm focus:outline-none focus:ring-2"
                      style={{ borderColor: COLOR_BORDER, outlineColor: COLOR_ACCENT }}
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
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: COLOR_PRIMARY }}>
                      Location *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., San Francisco, USA"
                      value={data.location}
                      onChange={(e) => updateData('location', e.target.value)}
                      className="w-full p-3 rounded-lg border text-sm focus:outline-none focus:ring-2"
                      style={{ borderColor: COLOR_BORDER, outlineColor: COLOR_ACCENT }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
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
                      className="w-full p-3 rounded-lg border text-sm focus:outline-none focus:ring-2"
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
                      className="w-full p-3 rounded-lg border text-sm focus:outline-none focus:ring-2"
                      style={{ borderColor: COLOR_BORDER, outlineColor: COLOR_ACCENT }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: COLOR_PRIMARY }}>
                    Top 5 Customers (helps buyers trust you)
                  </label>
                  <textarea
                    placeholder="e.g., Acme Corp, TechFlow Inc, Digital Solutions"
                    value={data.topCustomers}
                    onChange={(e) => updateData('topCustomers', e.target.value)}
                    className="w-full p-3 rounded-lg border text-sm resize-none h-16 focus:outline-none focus:ring-2"
                    style={{ borderColor: COLOR_BORDER, outlineColor: COLOR_ACCENT }}
                  />
                  <p className="text-xs mt-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                    {data.topCustomers.length > 10 && '✓ Helps with buyer trust'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: COLOR_PRIMARY }}>
                    Financial Summary (Very important for serious buyers!)
                  </label>
                  <textarea
                    placeholder="Summarize: Revenue trend, profitability, key metrics, growth drivers. Example: 'Grew revenue 45% YoY to $2.5M ARR. Profitable at 22% margins with 90% retention.'"
                    value={data.financialsSummary}
                    onChange={(e) => updateData('financialsSummary', e.target.value)}
                    className="w-full p-3 rounded-lg border text-sm resize-none h-20 focus:outline-none focus:ring-2"
                    style={{ borderColor: COLOR_BORDER, outlineColor: COLOR_ACCENT }}
                  />
                  <p className="text-xs mt-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                    {data.financialsSummary.length > 30 && '✓ Major factor in buyer interest'}
                  </p>
                </div>
              </div>
            </div>

            {/* Photos */}
            <div className="bg-white rounded-lg border p-6" style={{ borderColor: COLOR_BORDER }}>
              <h2 className="text-xl font-bold mb-4" style={{ color: COLOR_PRIMARY }}>
                📸 Photos (3-5 recommended)
              </h2>

              <div className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors mb-4" style={{ borderColor: COLOR_ACCENT }}>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleAddPhotos}
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

              {data.photos.length > 0 && (
                <div>
                  <p className="text-sm font-semibold mb-3" style={{ color: COLOR_PRIMARY }}>
                    Uploaded Photos ({data.photos.length})
                  </p>
                  <div className="grid grid-cols-3 gap-4">
                    {data.photos.map((photo, idx) => (
                      <motion.div key={idx} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative group">
                        <img src={photo.url} alt={photo.name} className="w-full h-32 object-cover rounded-lg" />
                        {photo.isFeatured && (
                          <div className="absolute top-2 left-2 bg-yellow-400 text-white text-xs font-bold px-2 py-1 rounded">
                            ⭐ FEATURED
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                          {!photo.isFeatured && (
                            <button
                              onClick={() => handleSetFeatured(idx)}
                              className="px-2 py-1 rounded text-xs font-bold bg-yellow-400 text-white hover:bg-yellow-500"
                            >
                              Set Featured
                            </button>
                          )}
                          <button
                            onClick={() => handleRemovePhoto(idx)}
                            className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Documents */}
            <div className="bg-white rounded-lg border p-6" style={{ borderColor: COLOR_BORDER }}>
              <h2 className="text-xl font-bold mb-4" style={{ color: COLOR_PRIMARY }}>
                📄 Documents (Required for serious buyers)
              </h2>

              <div className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors mb-4" style={{ borderColor: COLOR_ACCENT }}>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.xlsx,.csv,.doc,.docx"
                  onChange={handleAddDocuments}
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

              {data.documents.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-semibold" style={{ color: COLOR_PRIMARY }}>
                    Uploaded Documents ({data.documents.length})
                  </p>
                  {data.documents.map((doc, idx) => (
                    <motion.div key={idx} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3 p-3 rounded-lg" style={{ background: COLOR_BG_PRIMARY }}>
                      <FileText size={20} style={{ color: COLOR_ACCENT }} />
                      <p className="text-sm flex-1 truncate" style={{ color: COLOR_PRIMARY }}>
                        {doc.name}
                      </p>
                      <button onClick={() => handleRemoveDocument(idx)} className="p-1 hover:bg-gray-300 rounded">
                        <X size={16} style={{ color: COLOR_TEXT_SECONDARY }} />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full py-4 rounded-lg font-bold text-white transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
              style={{ background: COLOR_ACCENT }}
            >
              {isSubmitting ? (
                <>
                  <motion.div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit Business Information
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </motion.div>

          {/* Sidebar - Completeness Score */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-24 space-y-6">
              {/* Completeness Score */}
              <div className="bg-white rounded-lg border p-6" style={{ borderColor: COLOR_BORDER }}>
                <h3 className="text-lg font-bold mb-4" style={{ color: COLOR_PRIMARY }}>
                  Listing Strength
                </h3>

                <div className="mb-6">
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" fill="none" stroke={COLOR_BORDER} strokeWidth="8" />
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke={COLOR_ACCENT}
                        strokeWidth="8"
                        strokeDasharray={`${(completenessScore / 100) * 283} 283`}
                        strokeLinecap="round"
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <p className="text-3xl font-black" style={{ color: COLOR_PRIMARY }}>
                        {completenessScore}%
                      </p>
                      <p className="text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>
                        Complete
                      </p>
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-2xl font-black mb-1" style={{ color: tier.color }}>
                      {tier.icon}
                    </p>
                    <p className="font-bold" style={{ color: COLOR_PRIMARY }}>
                      {tier.name}
                    </p>
                  </div>
                </div>

                {/* Progress Bars */}
                <div className="space-y-2 text-xs">
                  {[
                    { label: 'Business Info', filled: data.businessDescription.length > 50 && data.industry && data.location },
                    { label: 'Customers', filled: data.topCustomers.length > 10 },
                    { label: 'Financials', filled: data.financialsSummary.length > 30 },
                    { label: 'Photos', filled: data.photos.length > 0 },
                    { label: 'Documents', filled: data.documents.length > 0 },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span style={{ color: COLOR_TEXT_SECONDARY }} className="min-w-20">
                        {item.label}
                      </span>
                      <div className="flex-1 h-2 rounded-full" style={{ background: COLOR_BORDER }}>
                        {item.filled && <div className="h-full rounded-full w-full" style={{ background: COLOR_ACCENT }} />}
                      </div>
                      {item.filled && <CheckCircle2 size={14} style={{ color: '#10B981' }} />}
                    </div>
                  ))}
                </div>
              </div>

              {/* Benefits */}
              <div className="bg-white rounded-lg border p-6" style={{ borderColor: COLOR_BORDER }}>
                <h3 className="font-bold mb-4" style={{ color: COLOR_PRIMARY }}>
                  How Completeness Helps:
                </h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2" style={{ color: COLOR_TEXT_SECONDARY }}>
                    <TrendingUp size={16} className="flex-shrink-0 mt-0.5" style={{ color: COLOR_ACCENT }} />
                    <span>More complete = Higher visibility on marketplace</span>
                  </li>
                  <li className="flex items-start gap-2" style={{ color: COLOR_TEXT_SECONDARY }}>
                    <Users size={16} className="flex-shrink-0 mt-0.5" style={{ color: COLOR_ACCENT }} />
                    <span>Buyers trust complete listings more</span>
                  </li>
                  <li className="flex items-start gap-2" style={{ color: COLOR_TEXT_SECONDARY }}>
                    <Zap size={16} className="flex-shrink-0 mt-0.5" style={{ color: COLOR_ACCENT }} />
                    <span>Reach more serious buyers faster</span>
                  </li>
                </ul>
              </div>

              {/* Guidance */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-lg"
                style={{ background: '#F0F9FF' }}
              >
                <p className="text-xs" style={{ color: '#1E40AF' }}>
                  💡 <strong>Pro tip:</strong> Spend time on financials and customer info - these matter most to buyers!
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

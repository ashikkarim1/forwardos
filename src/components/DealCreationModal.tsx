'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Upload, Film, Image as ImageIcon, Trash2, ChevronRight, ChevronLeft } from 'lucide-react'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER } from '@/styles/forward-colors'

interface DealCreationModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
}

export function DealCreationModal({ isOpen, onClose, onSubmit }: DealCreationModalProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    companyName: '',
    industry: '',
    location: '',
    description: '',
    pitchSummary: '',
    revenue: '',
    ebitda: '',
    valuation: '',
    growth: '',
    stage: '',
    videoUrl: '',
    images: [] as File[],
    documents: [] as File[],
  })
  const [videoPreview, setVideoPreview] = useState<string | null>(null)
  const [imagePreviews, setImagePreviews] = useState<(string | null)[]>([])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData(prev => ({ ...prev, videoUrl: file.name }))
      const reader = new FileReader()
      reader.onloadend = () => {
        setVideoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    files.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, images: [...prev.images, file] }))
        setImagePreviews(prev => [...prev, reader.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
  }

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setFormData(prev => ({
      ...prev,
      documents: [...prev.documents, ...files],
    }))
  }

  const removeDocument = (index: number) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = () => {
    onSubmit(formData)
    onClose()
  }

  const canProceed = () => {
    if (step === 1) return formData.companyName && formData.industry && formData.location && formData.description
    if (step === 2) return formData.revenue && formData.ebitda && formData.valuation && formData.stage
    if (step === 3) return formData.pitchSummary
    return true
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between" style={{ borderColor: COLOR_BORDER }}>
            <div>
              <h2 className="text-2xl font-black" style={{ color: COLOR_PRIMARY }}>
                List Your Company
              </h2>
              <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-sm mt-1">
                Step {step} of 4 • {['Company Info', 'Financials', 'Pitch & Media', 'Review'][step - 1]}
              </p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-all">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Step 1: Company Info */}
            {step === 1 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
                    Company Name *
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    placeholder="e.g., TechFlow Solutions"
                    className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
                    style={{ borderColor: COLOR_BORDER, boxShadow: `inset 0 0 0 1px ${COLOR_BORDER}` }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
                      Industry *
                    </label>
                    <select
                      name="industry"
                      value={formData.industry}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
                      style={{ borderColor: COLOR_BORDER, boxShadow: `inset 0 0 0 1px ${COLOR_BORDER}` }}
                    >
                      <option value="">Select Industry</option>
                      <option value="SaaS">SaaS</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Finance">Finance</option>
                      <option value="Retail">Retail</option>
                      <option value="Manufacturing">Manufacturing</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
                      Location *
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="City, Country"
                      className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
                      style={{ borderColor: COLOR_BORDER, boxShadow: `inset 0 0 0 1px ${COLOR_BORDER}` }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
                    Company Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Tell us about your company, market position, and business model..."
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
                    style={{ borderColor: COLOR_BORDER, boxShadow: `inset 0 0 0 1px ${COLOR_BORDER}` }}
                  />
                </div>
              </motion.div>
            )}

            {/* Step 2: Financials */}
            {step === 2 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
                      Annual Revenue (AED M) *
                    </label>
                    <input
                      type="number"
                      name="revenue"
                      value={formData.revenue}
                      onChange={handleInputChange}
                      placeholder="e.g., 5"
                      className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
                      style={{ borderColor: COLOR_BORDER, boxShadow: `inset 0 0 0 1px ${COLOR_BORDER}` }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
                      EBITDA (AED M) *
                    </label>
                    <input
                      type="number"
                      name="ebitda"
                      value={formData.ebitda}
                      onChange={handleInputChange}
                      placeholder="e.g., 1.5"
                      className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
                      style={{ borderColor: COLOR_BORDER, boxShadow: `inset 0 0 0 1px ${COLOR_BORDER}` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
                      Asking Valuation (AED M) *
                    </label>
                    <input
                      type="number"
                      name="valuation"
                      value={formData.valuation}
                      onChange={handleInputChange}
                      placeholder="e.g., 25"
                      className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
                      style={{ borderColor: COLOR_BORDER, boxShadow: `inset 0 0 0 1px ${COLOR_BORDER}` }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
                      Company Stage *
                    </label>
                    <select
                      name="stage"
                      value={formData.stage}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
                      style={{ borderColor: COLOR_BORDER, boxShadow: `inset 0 0 0 1px ${COLOR_BORDER}` }}
                    >
                      <option value="">Select Stage</option>
                      <option value="Early">Early Stage</option>
                      <option value="Growth">Growth</option>
                      <option value="Mature">Mature</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
                    YoY Growth (%) (Optional)
                  </label>
                  <input
                    type="number"
                    name="growth"
                    value={formData.growth}
                    onChange={handleInputChange}
                    placeholder="e.g., 25"
                    className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
                    style={{ borderColor: COLOR_BORDER, boxShadow: `inset 0 0 0 1px ${COLOR_BORDER}` }}
                  />
                </div>
              </motion.div>
            )}

            {/* Step 3: Pitch & Media */}
            {step === 3 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
                    Pitch Summary *
                  </label>
                  <textarea
                    name="pitchSummary"
                    value={formData.pitchSummary}
                    onChange={handleInputChange}
                    placeholder="Provide a compelling summary of why buyers should be interested..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
                    style={{ borderColor: COLOR_BORDER, boxShadow: `inset 0 0 0 1px ${COLOR_BORDER}` }}
                  />
                </div>

                {/* Video Upload */}
                <div>
                  <label className="block text-sm font-bold mb-3" style={{ color: COLOR_PRIMARY }}>
                    <Film className="w-4 h-4 inline mr-2" />
                    Company Pitch Video (Optional)
                  </label>
                  {videoPreview ? (
                    <div className="bg-gray-100 rounded-lg p-4 mb-3">
                      <p className="text-sm font-medium mb-2" style={{ color: COLOR_PRIMARY }}>
                        ✓ {formData.videoUrl}
                      </p>
                      <button
                        onClick={() => {
                          setFormData(prev => ({ ...prev, videoUrl: '' }))
                          setVideoPreview(null)
                        }}
                        className="text-sm px-3 py-1 rounded border"
                        style={{ borderColor: COLOR_ACCENT, color: COLOR_ACCENT }}
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <label className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-all" style={{ borderColor: COLOR_ACCENT }}>
                      <Film className="w-8 h-8 mx-auto mb-2" style={{ color: COLOR_ACCENT }} />
                      <p className="font-medium" style={{ color: COLOR_PRIMARY }}>
                        Drop your video here
                      </p>
                      <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-sm">
                        MP4, WebM up to 500MB
                      </p>
                      <input type="file" accept="video/*" onChange={handleVideoUpload} className="hidden" />
                    </label>
                  )}
                </div>

                {/* Image Gallery */}
                <div>
                  <label className="block text-sm font-bold mb-3" style={{ color: COLOR_PRIMARY }}>
                    <ImageIcon className="w-4 h-4 inline mr-2" />
                    Company Images ({imagePreviews.length})
                  </label>
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    {imagePreviews.map((preview, idx) => (
                      <div key={idx} className="relative">
                        <img src={preview || ''} alt={`preview-${idx}`} className="w-full h-24 object-cover rounded-lg" />
                        <button
                          onClick={() => removeImage(idx)}
                          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <label className="border-2 border-dashed rounded-lg p-4 flex items-center justify-center cursor-pointer hover:bg-gray-50" style={{ borderColor: COLOR_BORDER }}>
                      <Upload className="w-6 h-6" style={{ color: COLOR_ACCENT }} />
                      <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  </div>
                </div>

                {/* Documents */}
                <div>
                  <label className="block text-sm font-bold mb-3" style={{ color: COLOR_PRIMARY }}>
                    Support Documents (Optional)
                  </label>
                  {formData.documents.length > 0 && (
                    <div className="bg-gray-50 rounded-lg p-3 mb-3 space-y-2">
                      {formData.documents.map((doc, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 bg-white rounded border" style={{ borderColor: COLOR_BORDER }}>
                          <span className="text-sm" style={{ color: COLOR_PRIMARY }}>
                            {doc.name}
                          </span>
                          <button onClick={() => removeDocument(idx)} className="text-red-500 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <label className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50" style={{ borderColor: COLOR_BORDER }}>
                    <Upload className="w-6 h-6 mx-auto mb-2" style={{ color: COLOR_ACCENT }} />
                    <p className="text-sm font-medium" style={{ color: COLOR_PRIMARY }}>
                      PDF, Word, Excel
                    </p>
                    <input type="file" multiple accept=".pdf,.doc,.docx,.xls,.xlsx" onChange={handleDocumentUpload} className="hidden" />
                  </label>
                </div>
              </motion.div>
            )}

            {/* Step 4: Review */}
            {step === 4 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm font-medium" style={{ color: COLOR_PRIMARY }}>
                    Ready to go live?
                  </p>
                  <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                    Your deal will be published to our network of 50,000+ qualified buyers and investors immediately.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="p-4 rounded-lg" style={{ background: '#f7f6f4' }}>
                    <p className="text-sm font-bold" style={{ color: COLOR_PRIMARY }}>
                      {formData.companyName}
                    </p>
                    <p className="text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>
                      {formData.industry} • {formData.location}
                    </p>
                    <p className="text-xs mt-2" style={{ color: COLOR_TEXT_SECONDARY }}>
                      <strong>Valuation:</strong> AED {formData.valuation}M • <strong>Revenue:</strong> AED {formData.revenue}M
                    </p>
                  </div>

                  <div className="border-t pt-3" style={{ borderColor: COLOR_BORDER }}>
                    <p className="text-xs font-bold" style={{ color: COLOR_PRIMARY }}>
                      You'll receive notifications for:
                    </p>
                    <ul className="text-xs mt-2 space-y-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                      <li>✓ Data room access requests</li>
                      <li>✓ Buyer questions and inquiries</li>
                      <li>✓ Meeting scheduling requests</li>
                      <li>✓ Offers and proposals</li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white border-t p-6 flex items-center justify-between" style={{ borderColor: COLOR_BORDER }}>
            <button
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
              className="px-6 py-2 rounded-lg font-bold flex items-center gap-2 disabled:opacity-30 transition-all"
              style={{ color: COLOR_ACCENT }}
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>

            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="px-6 py-2 rounded-lg font-bold border"
                style={{ borderColor: COLOR_BORDER, color: COLOR_PRIMARY }}
              >
                Save Draft
              </button>

              {step < 4 ? (
                <button
                  onClick={() => setStep(step + 1)}
                  disabled={!canProceed()}
                  className="px-6 py-2 rounded-lg font-bold text-white flex items-center gap-2 disabled:opacity-50 transition-all"
                  style={{ background: COLOR_ACCENT }}
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2 rounded-lg font-bold text-white transition-all hover:opacity-90"
                  style={{ background: COLOR_ACCENT }}
                >
                  Publish Deal
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, AlertCircle, Upload } from 'lucide-react'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER } from '@/styles/forward-colors'

export default function ProfessionalPartnerSignup() {
  const [step, setStep] = useState<'type' | 'info' | 'review' | 'submitted'>(
    'type'
  )
  const [selectedType, setSelectedType] = useState<
    'lawyer' | 'valuator' | 'accountant' | 'auditor' | 'insurance' | null
  >(null)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    specialization: '',
    yearsExperience: '',
    dealsCompleted: '',
    barNumber: '',
    certification: '',
    referralFee: '',
    websiteUrl: '',
    linkedinUrl: '',
    bio: '',
    files: [] as File[],
  })

  const serviceTypes = [
    { id: 'lawyer', name: 'M&A Lawyer', icon: '⚖️', referralFee: '$5,000' },
    { id: 'valuator', name: 'Business Valuator', icon: '💰', referralFee: '$3,500' },
    { id: 'accountant', name: 'CPA/Accountant', icon: '📊', referralFee: '$2,500' },
    { id: 'auditor', name: 'Auditor', icon: '✓', referralFee: '$4,000' },
    { id: 'insurance', name: 'Insurance Broker', icon: '🛡️', referralFee: '$3,000' },
  ]

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setFormData(prev => ({ ...prev, files: [...prev.files, ...files] }))
  }

  const handleSubmit = () => {
    // In a real app, this would send to your backend
    console.log('Submitting:', { type: selectedType, ...formData })
    setStep('submitted')
  }

  const currentServiceType = serviceTypes.find(t => t.id === selectedType)

  return (
    <div className="min-h-screen bg-white">
      {/* Step 1: Select Service Type */}
      {step === 'type' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-16 px-4 sm:px-6 lg:px-8"
        >
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-black mb-4" style={{ color: COLOR_PRIMARY }}>
              Join Forward OS Professional Network
            </h1>
            <p className="text-xl mb-12" style={{ color: COLOR_TEXT_SECONDARY }}>
              Get pre-qualified M&A deal flow. Pay only per referral. Build your reputation.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {serviceTypes.map(type => (
                <motion.button
                  key={type.id}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => {
                    setSelectedType(type.id as any)
                    setStep('info')
                  }}
                  className="p-8 rounded-lg border-2 text-center transition-all hover:shadow-lg"
                  style={{
                    borderColor: COLOR_BORDER,
                    background: 'white',
                  }}
                >
                  <p className="text-5xl mb-4">{type.icon}</p>
                  <h3 className="text-xl font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
                    {type.name}
                  </h3>
                  <p className="text-lg font-black mb-4" style={{ color: COLOR_ACCENT }}>
                    {type.referralFee}
                  </p>
                  <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                    per successful referral
                  </p>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Step 2: Collect Information */}
      {step === 'info' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-16 px-4 sm:px-6 lg:px-8"
        >
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <button
                onClick={() => setStep('type')}
                className="text-sm font-bold" style={{ color: COLOR_ACCENT }}
              >
                ← Back
              </button>
            </div>

            <h2 className="text-3xl font-black mb-2" style={{ color: COLOR_PRIMARY }}>
              {currentServiceType?.name}
            </h2>
            <p className="mb-8" style={{ color: COLOR_TEXT_SECONDARY }}>
              Referral Fee: <span className="font-bold text-lg" style={{ color: COLOR_ACCENT }}>
                {currentServiceType?.referralFee}
              </span>
            </p>

            <form className="space-y-6">
              {/* Personal Info */}
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border"
                  style={{ borderColor: COLOR_BORDER }}
                  placeholder="John Doe"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border"
                    style={{ borderColor: COLOR_BORDER }}
                    placeholder="john@example.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
                    Phone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border"
                    style={{ borderColor: COLOR_BORDER }}
                    placeholder="(555) 123-4567"
                    required
                  />
                </div>
              </div>

              {/* Company Info */}
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
                  Company/Firm Name *
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border"
                  style={{ borderColor: COLOR_BORDER }}
                  placeholder="Your Firm Name"
                  required
                />
              </div>

              {/* Credentials */}
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
                  {selectedType === 'lawyer' && 'Bar License Number'}
                  {selectedType === 'valuator' && 'ASA/CVA Certification'}
                  {selectedType === 'accountant' && 'CPA License Number'}
                  {selectedType === 'auditor' && 'CPA License Number'}
                  {selectedType === 'insurance' && 'License Type'} *
                </label>
                <input
                  type="text"
                  name="certification"
                  value={formData.certification}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border"
                  style={{ borderColor: COLOR_BORDER }}
                  placeholder="Your license/certification number"
                  required
                />
              </div>

              {/* Experience */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
                    Years Experience *
                  </label>
                  <input
                    type="number"
                    name="yearsExperience"
                    value={formData.yearsExperience}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border"
                    style={{ borderColor: COLOR_BORDER }}
                    placeholder="10"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
                    M&A Deals Completed *
                  </label>
                  <input
                    type="number"
                    name="dealsCompleted"
                    value={formData.dealsCompleted}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border"
                    style={{ borderColor: COLOR_BORDER }}
                    placeholder="50"
                    required
                  />
                </div>
              </div>

              {/* Links */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
                    Website URL
                  </label>
                  <input
                    type="url"
                    name="websiteUrl"
                    value={formData.websiteUrl}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border"
                    style={{ borderColor: COLOR_BORDER }}
                    placeholder="https://yoursite.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    name="linkedinUrl"
                    value={formData.linkedinUrl}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border"
                    style={{ borderColor: COLOR_BORDER }}
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
                  Professional Bio *
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border"
                  style={{ borderColor: COLOR_BORDER }}
                  placeholder="Tell us about your experience and specialization..."
                  rows={4}
                  required
                />
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
                  Upload Credentials (Optional)
                </label>
                <label className="flex items-center justify-center w-full px-4 py-8 border-2 border-dashed rounded-lg cursor-pointer transition-all hover:bg-gray-50"
                  style={{ borderColor: COLOR_BORDER }}>
                  <div className="text-center">
                    <Upload size={24} style={{ color: COLOR_ACCENT }} className="mx-auto mb-2" />
                    <p className="text-sm font-bold" style={{ color: COLOR_PRIMARY }}>
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>
                      PDF, DOC (Max 5MB)
                    </p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileUpload}
                    accept=".pdf,.doc,.docx"
                    multiple
                  />
                </label>
                {formData.files.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {formData.files.map((f, i) => (
                      <p key={i} className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                        ✓ {f.name}
                      </p>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => setStep('review')}
                className="w-full py-4 rounded-lg font-bold text-white transition-all hover:opacity-90"
                style={{ background: COLOR_ACCENT }}
              >
                Review & Submit →
              </button>
            </form>
          </div>
        </motion.div>
      )}

      {/* Step 3: Review */}
      {step === 'review' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-16 px-4 sm:px-6 lg:px-8"
        >
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-black mb-8" style={{ color: COLOR_PRIMARY }}>
              Review Your Information
            </h2>

            <div className="space-y-6 mb-8">
              <div className="p-6 rounded-lg border" style={{ borderColor: COLOR_BORDER }}>
                <p className="text-sm font-bold mb-2" style={{ color: COLOR_TEXT_SECONDARY }}>
                  SERVICE TYPE
                </p>
                <p className="text-lg font-bold" style={{ color: COLOR_PRIMARY }}>
                  {currentServiceType?.name}
                </p>
                <p className="text-lg font-black mt-2" style={{ color: COLOR_ACCENT }}>
                  {currentServiceType?.referralFee} per referral
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border" style={{ borderColor: COLOR_BORDER }}>
                  <p className="text-xs font-bold mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>Name</p>
                  <p className="font-bold" style={{ color: COLOR_PRIMARY }}>{formData.fullName}</p>
                </div>
                <div className="p-4 rounded-lg border" style={{ borderColor: COLOR_BORDER }}>
                  <p className="text-xs font-bold mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>Email</p>
                  <p className="font-bold" style={{ color: COLOR_PRIMARY }}>{formData.email}</p>
                </div>
                <div className="p-4 rounded-lg border" style={{ borderColor: COLOR_BORDER }}>
                  <p className="text-xs font-bold mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>Company</p>
                  <p className="font-bold" style={{ color: COLOR_PRIMARY }}>{formData.company}</p>
                </div>
                <div className="p-4 rounded-lg border" style={{ borderColor: COLOR_BORDER }}>
                  <p className="text-xs font-bold mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>Experience</p>
                  <p className="font-bold" style={{ color: COLOR_PRIMARY }}>{formData.yearsExperience} years</p>
                </div>
              </div>

              <div className="p-6 rounded-lg border" style={{ borderColor: COLOR_BORDER }}>
                <p className="text-sm font-bold mb-2" style={{ color: COLOR_TEXT_SECONDARY }}>BIO</p>
                <p style={{ color: COLOR_PRIMARY }}>{formData.bio}</p>
              </div>
            </div>

            <div className="p-6 rounded-lg" style={{ background: COLOR_ACCENT + '08', border: `1px solid ${COLOR_ACCENT}` }}>
              <p style={{ color: COLOR_PRIMARY }} className="text-sm">
                By submitting this application, you agree to our terms and conditions. 
                We'll review your information within 48 hours and notify you of our decision.
              </p>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setStep('info')}
                className="flex-1 py-3 rounded-lg font-bold border transition-all hover:bg-gray-50"
                style={{ borderColor: COLOR_BORDER, color: COLOR_PRIMARY }}
              >
                ← Back
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 py-3 rounded-lg font-bold text-white transition-all hover:opacity-90"
                style={{ background: COLOR_ACCENT }}
              >
                Submit Application →
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Step 4: Success */}
      {step === 'submitted' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="py-16 px-4 sm:px-6 lg:px-8 text-center"
        >
          <div className="max-w-2xl mx-auto">
            <div className="mb-6 flex justify-center">
              <CheckCircle2 size={64} style={{ color: COLOR_ACCENT }} />
            </div>

            <h2 className="text-4xl font-black mb-4" style={{ color: COLOR_PRIMARY }}>
              Application Submitted!
            </h2>

            <p className="text-xl mb-8" style={{ color: COLOR_TEXT_SECONDARY }}>
              Thank you for applying to join the Forward OS Professional Network.
            </p>

            <div className="p-8 rounded-lg" style={{ background: COLOR_ACCENT + '08', border: `1px solid ${COLOR_ACCENT}` }}>
              <p className="text-lg font-bold mb-4" style={{ color: COLOR_PRIMARY }}>
                What happens next:
              </p>
              <ul className="space-y-3 text-left max-w-md mx-auto">
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={20} style={{ color: COLOR_ACCENT }} className="flex-shrink-0 mt-1" />
                  <span style={{ color: COLOR_TEXT_SECONDARY }}>
                    We'll review your information within 48 hours
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={20} style={{ color: COLOR_ACCENT }} className="flex-shrink-0 mt-1" />
                  <span style={{ color: COLOR_TEXT_SECONDARY }}>
                    You'll receive an email with our decision
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={20} style={{ color: COLOR_ACCENT }} className="flex-shrink-0 mt-1" />
                  <span style={{ color: COLOR_TEXT_SECONDARY }}>
                    Once approved, you'll be listed in our directory and start receiving referrals
                  </span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => window.location.href = '/'}
              className="mt-8 px-8 py-3 rounded-lg font-bold text-white hover:opacity-90"
              style={{ background: COLOR_ACCENT }}
            >
              Return to Home →
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}

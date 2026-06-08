'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Upload, FileText, Users, BarChart3, Download, Trash2, Eye, Loader, Check, X } from 'lucide-react'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER, COLOR_SURFACE_SUCCESS } from '@/styles/forward-colors'

interface Document {
  id: string
  fileName: string
  fileSize: number
  uploadDate: string
  downloadCount: number
  uploadedBy: string
}

interface AccessRequest {
  id: string
  requesterEmail: string
  accessLevel: 'view_only' | 'download' | 'export'
  status: 'pending' | 'approved' | 'denied'
  requestedAt: string
}

interface Analytics {
  totalViews: number
  uniqueViewers: number
  totalDownloads: number
  avgViewTime: number
  mostViewedDocument: string
}

export default function DataRoomPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState('documents')
  const [documents, setDocuments] = useState<Document[]>([])
  const [accessRequests, setAccessRequests] = useState<AccessRequest[]>([])
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Load documents and analytics
    loadDocuments()
    loadAccessRequests()
    loadAnalytics()
  }, [params.id])

  const loadDocuments = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/data-rooms/documents?dataRoomId=${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setDocuments(data.documents || [])
      }
    } catch (err) {
      console.error('Failed to load documents:', err)
    } finally {
      setLoading(false)
    }
  }

  const loadAccessRequests = async () => {
    try {
      const response = await fetch(`/api/data-rooms/access-requests?dataRoomId=${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setAccessRequests(data.requests || [])
      }
    } catch (err) {
      console.error('Failed to load access requests:', err)
    }
  }

  const loadAnalytics = async () => {
    try {
      const response = await fetch(`/api/data-rooms/analytics?dataRoomId=${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data.analytics || null)
      }
    } catch (err) {
      console.error('Failed to load analytics:', err)
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files
    if (files) {
      await uploadFiles(files)
    }
  }

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = e.dataTransfer.files
    if (files) {
      await uploadFiles(files)
    }
  }

  const uploadFiles = async (files: FileList) => {
    setUploading(true)
    setErrorMessage('')

    try {
      for (const file of Array.from(files)) {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('dataRoomId', params.id)
        formData.append('folderPath', 'root')
        formData.append('uploadedBy', 'current-user')

        const response = await fetch('/api/data-rooms/documents', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          throw new Error(`Failed to upload ${file.name}`)
        }
      }

      setSuccessMessage(`Successfully uploaded ${Array.from(files).length} file(s)`)
      setTimeout(() => setSuccessMessage(''), 3000)
      loadDocuments()
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const deleteDocument = async (docId: string) => {
    try {
      const response = await fetch(`/api/data-rooms/documents/${docId}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        setDocuments(documents.filter(d => d.id !== docId))
        setSuccessMessage('Document deleted successfully')
        setTimeout(() => setSuccessMessage(''), 3000)
      }
    } catch (err) {
      setErrorMessage('Failed to delete document')
    }
  }

  const handleAccessRequest = async (email: string, accessLevel: 'view_only' | 'download' | 'export') => {
    try {
      const response = await fetch('/api/data-rooms/access-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dataRoomId: params.id,
          requesterEmail: email,
          accessLevel,
          reason: 'Due diligence',
          durationDays: 14,
        }),
      })

      if (response.ok) {
        setSuccessMessage('Access request created')
        setTimeout(() => setSuccessMessage(''), 3000)
        loadAccessRequests()
      }
    } catch (err) {
      setErrorMessage('Failed to create access request')
    }
  }

  const approveAccessRequest = async (requestId: string) => {
    try {
      // Mock approval - in production this would update the database
      setAccessRequests(
        accessRequests.map(r =>
          r.id === requestId ? { ...r, status: 'approved' as const } : r
        )
      )
      setSuccessMessage('Access request approved')
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (err) {
      setErrorMessage('Failed to approve request')
    }
  }

  const denyAccessRequest = async (requestId: string) => {
    try {
      setAccessRequests(
        accessRequests.map(r =>
          r.id === requestId ? { ...r, status: 'denied' as const } : r
        )
      )
      setSuccessMessage('Access request denied')
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (err) {
      setErrorMessage('Failed to deny request')
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  const tabs = [
    { id: 'documents', label: '📄 Documents' },
    { id: 'access', label: '👥 Access' },
    { id: 'analytics', label: '📊 Analytics' },
  ]

  return (
    <motion.div
      className="max-w-7xl mx-auto px-6 py-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {successMessage && (
        <motion.div
          className="mb-6 p-4 rounded-lg flex items-center gap-2"
          style={{ background: COLOR_SURFACE_SUCCESS, color: COLOR_ACCENT }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Check className="w-5 h-5" />
          {successMessage}
        </motion.div>
      )}

      {errorMessage && (
        <motion.div
          className="mb-6 p-4 rounded-lg flex items-center gap-2"
          style={{ background: '#FEE2CC', color: COLOR_ACCENT }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <X className="w-5 h-5" />
          {errorMessage}
        </motion.div>
      )}

      <motion.div variants={itemVariants} className="mb-8">
        <h1 className="text-4xl font-black mb-4" style={{ color: COLOR_PRIMARY }}>
          Data Room
        </h1>
        <p style={{ color: COLOR_TEXT_SECONDARY }}>
          Manage documents, control access, track activity
        </p>
      </motion.div>

      <motion.div variants={itemVariants} className="flex gap-4 mb-8 border-b" style={{ borderColor: COLOR_BORDER }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="px-4 py-3 font-semibold text-sm transition-all border-b-2"
            style={{
              color: activeTab === tab.id ? COLOR_ACCENT : COLOR_TEXT_SECONDARY,
              borderColor: activeTab === tab.id ? COLOR_ACCENT : 'transparent',
            }}
          >
            {tab.label}
          </button>
        ))}
      </motion.div>

      <motion.div variants={itemVariants}>
        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <div>
            {/* Upload Area */}
            <div
              className="p-12 rounded-lg border-2 border-dashed text-center mb-8 cursor-pointer transition-all"
              style={{
                borderColor: dragActive ? COLOR_PRIMARY : COLOR_ACCENT,
                background: dragActive ? '#FFF7F3' : '#FFF7F3',
              }}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-12 h-12 mx-auto mb-4" style={{ color: COLOR_ACCENT }} />
              <p className="font-semibold mb-2" style={{ color: COLOR_PRIMARY }}>
                {uploading ? 'Uploading...' : 'Drag & drop documents here'}
              </p>
              <p style={{ color: COLOR_TEXT_SECONDARY }}>
                or click to browse your computer
              </p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
                disabled={uploading}
              />
            </div>

            {/* Documents List */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader className="w-6 h-6 animate-spin" style={{ color: COLOR_ACCENT }} />
              </div>
            ) : documents.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 mx-auto mb-4" style={{ color: COLOR_TEXT_SECONDARY, opacity: 0.3 }} />
                <p style={{ color: COLOR_TEXT_SECONDARY }}>No documents uploaded yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {documents.map((doc) => (
                  <motion.div
                    key={doc.id}
                    className="p-4 rounded-lg border flex items-center justify-between"
                    style={{ borderColor: COLOR_BORDER, background: 'white' }}
                    whileHover={{ y: -2 }}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <FileText className="w-6 h-6" style={{ color: COLOR_ACCENT }} />
                      <div>
                        <p className="font-semibold" style={{ color: COLOR_PRIMARY }}>
                          {doc.fileName}
                        </p>
                        <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                          {(doc.fileSize / 1024 / 1024).toFixed(2)} MB • Uploaded {doc.uploadDate}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        className="p-2 hover:opacity-70 transition-opacity"
                        title="Download"
                      >
                        <Download className="w-5 h-5" style={{ color: COLOR_ACCENT }} />
                      </button>
                      <button
                        onClick={() => deleteDocument(doc.id)}
                        className="p-2 hover:opacity-70 transition-opacity"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" style={{ color: '#DC2626' }} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Access Tab */}
        {activeTab === 'access' && (
          <div className="space-y-6">
            {/* Grant New Access */}
            <motion.div
              className="p-6 rounded-lg border"
              style={{ borderColor: COLOR_BORDER, background: 'white' }}
              variants={itemVariants}
            >
              <h3 className="text-lg font-bold mb-4" style={{ color: COLOR_PRIMARY }}>
                Grant Access
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: COLOR_PRIMARY }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="buyer@company.com"
                    className="w-full px-4 py-2 rounded-lg border"
                    style={{ borderColor: COLOR_BORDER }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: COLOR_PRIMARY }}>
                    Access Level
                  </label>
                  <select
                    className="w-full px-4 py-2 rounded-lg border"
                    style={{ borderColor: COLOR_BORDER }}
                  >
                    <option value="view_only">View Only</option>
                    <option value="download">Download</option>
                    <option value="export">Export</option>
                  </select>
                </div>
                <button
                  className="w-full px-4 py-2 rounded-lg font-semibold text-white transition-all hover:opacity-90"
                  style={{ background: COLOR_ACCENT }}
                >
                  Send Access Request
                </button>
              </div>
            </motion.div>

            {/* Access Requests */}
            <motion.div
              className="p-6 rounded-lg border"
              style={{ borderColor: COLOR_BORDER, background: 'white' }}
              variants={itemVariants}
            >
              <h3 className="text-lg font-bold mb-4" style={{ color: COLOR_PRIMARY }}>
                Pending Requests
              </h3>
              {accessRequests.length === 0 ? (
                <p style={{ color: COLOR_TEXT_SECONDARY }}>No pending requests</p>
              ) : (
                <div className="space-y-3">
                  {accessRequests.map((req) => (
                    <motion.div
                      key={req.id}
                      className="p-4 rounded-lg border flex items-center justify-between"
                      style={{ borderColor: COLOR_BORDER, background: 'white' }}
                    >
                      <div>
                        <p className="font-semibold" style={{ color: COLOR_PRIMARY }}>
                          {req.requesterEmail}
                        </p>
                        <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                          {req.accessLevel} • {req.requestedAt}
                        </p>
                      </div>
                      {req.status === 'pending' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => approveAccessRequest(req.id)}
                            className="px-4 py-2 rounded-lg font-semibold text-white transition-all hover:opacity-90"
                            style={{ background: '#10b981' }}
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => denyAccessRequest(req.id)}
                            className="px-4 py-2 rounded-lg font-semibold text-white transition-all hover:opacity-90"
                            style={{ background: '#6B7280' }}
                          >
                            Deny
                          </button>
                        </div>
                      )}
                      {req.status === 'approved' && (
                        <span style={{ color: '#10b981', fontWeight: 'bold' }}>✓ Approved</span>
                      )}
                      {req.status === 'denied' && (
                        <span style={{ color: '#DC2626', fontWeight: 'bold' }}>✗ Denied</span>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div>
            {analytics ? (
              <motion.div
                className="grid grid-cols-1 md:grid-cols-4 gap-6"
                variants={containerVariants}
              >
                {[
                  { label: 'Total Views', value: analytics.totalViews },
                  { label: 'Unique Viewers', value: analytics.uniqueViewers },
                  { label: 'Total Downloads', value: analytics.totalDownloads },
                  { label: 'Avg View Time', value: `${analytics.avgViewTime}m` },
                ].map((stat) => (
                  <motion.div
                    key={stat.label}
                    className="p-6 rounded-lg border"
                    style={{ borderColor: COLOR_BORDER, background: 'white' }}
                    variants={itemVariants}
                    whileHover={{ y: -4 }}
                  >
                    <p className="text-sm font-semibold mb-2" style={{ color: COLOR_TEXT_SECONDARY }}>
                      {stat.label}
                    </p>
                    <p className="text-3xl font-black" style={{ color: COLOR_ACCENT }}>
                      {stat.value}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-12">
                <BarChart3 className="w-12 h-12 mx-auto mb-4" style={{ color: COLOR_TEXT_SECONDARY, opacity: 0.3 }} />
                <p style={{ color: COLOR_TEXT_SECONDARY }}>No analytics data available yet</p>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

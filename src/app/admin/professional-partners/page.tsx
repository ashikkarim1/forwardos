'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, XCircle, Mail, FileText } from 'lucide-react'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER } from '@/styles/forward-colors'

interface PartnerApplication {
  id: string
  name: string
  email: string
  company: string
  serviceType: 'lawyer' | 'valuator' | 'accountant' | 'auditor' | 'insurance'
  yearsExperience: number
  dealsCompleted: number
  certification: string
  bio: string
  appliedDate: string
  status: 'pending' | 'approved' | 'rejected'
  referralFee: string
}

export default function AdminProfessionalPartners() {
  const [applications, setApplications] = useState<PartnerApplication[]>([
    {
      id: '1',
      name: 'Jennifer Park',
      email: 'jennifer@parkmandala.com',
      company: 'Park M&A Legal',
      serviceType: 'lawyer',
      yearsExperience: 18,
      dealsCompleted: 234,
      certification: 'NY Bar #123456',
      bio: 'Specialized in small-mid market M&A with 18 years experience.',
      appliedDate: '2026-06-08',
      status: 'pending',
      referralFee: '$5,000',
    },
  ])

  const [selectedTab, setSelectedTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')

  const filteredApps = applications.filter(app => {
    if (selectedTab === 'all') return true
    return app.status === selectedTab
  })

  const handleApprove = (id: string) => {
    setApplications(apps =>
      apps.map(app => (app.id === id ? { ...app, status: 'approved' } : app))
    )
  }

  const handleReject = (id: string) => {
    setApplications(apps =>
      apps.map(app => (app.id === id ? { ...app, status: 'rejected' } : app))
    )
  }

  return (
    <div className="min-h-screen bg-white py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-black mb-2" style={{ color: COLOR_PRIMARY }}>
          Professional Partner Applications
        </h1>
        <p style={{ color: COLOR_TEXT_SECONDARY }} className="mb-8">
          Review and approve professional service providers
        </p>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-lg border" style={{ borderColor: COLOR_BORDER }}>
            <p className="text-xs font-bold" style={{ color: COLOR_TEXT_SECONDARY }}>Total</p>
            <p className="text-2xl font-black" style={{ color: COLOR_PRIMARY }}>{applications.length}</p>
          </div>
          <div className="p-4 rounded-lg border" style={{ borderColor: COLOR_BORDER }}>
            <p className="text-xs font-bold" style={{ color: COLOR_TEXT_SECONDARY }}>Pending</p>
            <p className="text-2xl font-black" style={{ color: '#fbbf24' }}>
              {applications.filter(a => a.status === 'pending').length}
            </p>
          </div>
          <div className="p-4 rounded-lg border" style={{ borderColor: COLOR_BORDER }}>
            <p className="text-xs font-bold" style={{ color: COLOR_TEXT_SECONDARY }}>Approved</p>
            <p className="text-2xl font-black text-green-600">
              {applications.filter(a => a.status === 'approved').length}
            </p>
          </div>
          <div className="p-4 rounded-lg border" style={{ borderColor: COLOR_BORDER }}>
            <p className="text-xs font-bold" style={{ color: COLOR_TEXT_SECONDARY }}>Rejected</p>
            <p className="text-2xl font-black text-red-600">
              {applications.filter(a => a.status === 'rejected').length}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b" style={{ borderColor: COLOR_BORDER }}>
          {[
            { id: 'all', label: 'All' },
            { id: 'pending', label: 'Pending' },
            { id: 'approved', label: 'Approved' },
            { id: 'rejected', label: 'Rejected' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id as any)}
              className={`px-4 py-3 font-bold text-sm border-b-2 transition-all`}
              style={{
                borderColor: selectedTab === tab.id ? COLOR_ACCENT : 'transparent',
                color: selectedTab === tab.id ? COLOR_ACCENT : COLOR_TEXT_SECONDARY,
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="space-y-4">
          {filteredApps.map(app => (
            <div key={app.id} className="p-6 rounded-lg border" style={{ borderColor: COLOR_BORDER }}>
              <div className="grid grid-cols-4 gap-6">
                <div>
                  <p className="font-bold" style={{ color: COLOR_PRIMARY }}>{app.name}</p>
                  <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>{app.company}</p>
                </div>
                <div>
                  <p className="text-sm font-bold" style={{ color: COLOR_TEXT_SECONDARY }}>Experience</p>
                  <p className="font-bold" style={{ color: COLOR_PRIMARY }}>{app.yearsExperience} years • {app.dealsCompleted} deals</p>
                </div>
                <div>
                  <p className="text-sm font-bold" style={{ color: COLOR_TEXT_SECONDARY }}>Referral Fee</p>
                  <p className="text-lg font-black" style={{ color: COLOR_ACCENT }}>{app.referralFee}</p>
                </div>
                <div className="flex flex-col gap-2">
                  {app.status === 'pending' && (
                    <>
                      <button onClick={() => handleApprove(app.id)} className="py-2 rounded font-bold text-white" style={{ background: COLOR_ACCENT }}>
                        Approve
                      </button>
                      <button onClick={() => handleReject(app.id)} className="py-2 rounded font-bold" style={{ background: '#fee2e2', color: '#991b1b' }}>
                        Reject
                      </button>
                    </>
                  )}
                  {app.status === 'approved' && (
                    <span className="px-3 py-1 rounded text-sm font-bold text-green-700 text-center" style={{ background: '#dcfce7' }}>
                      ✅ Approved
                    </span>
                  )}
                  {app.status === 'rejected' && (
                    <span className="px-3 py-1 rounded text-sm font-bold text-red-700 text-center" style={{ background: '#fee2e2' }}>
                      ❌ Rejected
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

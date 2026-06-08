'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Plus, FileText, Users, BarChart3 } from 'lucide-react'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER } from '@/styles/forward-colors'

export default function DataRoomsPage() {
  const [dataRooms, setDataRooms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In production, fetch from API
    setTimeout(() => {
      setLoading(false)
    }, 500)
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <motion.div
      className="max-w-7xl mx-auto px-6 py-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-black mb-2" style={{ color: COLOR_PRIMARY }}>
              Data Rooms
            </h1>
            <p className="text-lg" style={{ color: COLOR_TEXT_SECONDARY }}>
              Secure, organized document management for every deal
            </p>
          </div>
          <Link
            href="/data-rooms/new"
            className="flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-white transition-all hover:opacity-90"
            style={{ background: COLOR_ACCENT }}
          >
            <Plus className="w-5 h-5" />
            New Data Room
          </Link>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12" variants={containerVariants}>
        {[
          { label: 'Active Data Rooms', value: dataRooms.length, icon: FileText },
          { label: 'Total Documents', value: '0', icon: FileText },
          { label: 'Active Users', value: '0', icon: Users },
          { label: 'Avg Access Time', value: '2.3h', icon: BarChart3 },
        ].map((stat) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              className="p-6 rounded-lg border bg-white"
              style={{ borderColor: COLOR_BORDER }}
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium" style={{ color: COLOR_TEXT_SECONDARY }}>
                  {stat.label}
                </p>
                <Icon className="w-5 h-5" style={{ color: COLOR_ACCENT }} />
              </div>
              <p className="text-3xl font-black" style={{ color: COLOR_PRIMARY }}>
                {stat.value}
              </p>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Data Rooms List */}
      <motion.div variants={itemVariants}>
        {loading ? (
          <div className="text-center py-12">
            <p style={{ color: COLOR_TEXT_SECONDARY }}>Loading data rooms...</p>
          </div>
        ) : dataRooms.length === 0 ? (
          <div
            className="p-12 rounded-lg border text-center"
            style={{ borderColor: COLOR_BORDER, background: '#FFF7F3' }}
          >
            <FileText className="w-12 h-12 mx-auto mb-4" style={{ color: COLOR_ACCENT, opacity: 0.5 }} />
            <p className="text-lg font-semibold mb-2" style={{ color: COLOR_PRIMARY }}>
              No data rooms yet
            </p>
            <p style={{ color: COLOR_TEXT_SECONDARY }} className="mb-6">
              Create your first data room to start managing deal documents securely
            </p>
            <Link
              href="/data-rooms/new"
              className="inline-block px-6 py-3 rounded-lg font-bold text-white transition-all hover:opacity-90"
              style={{ background: COLOR_ACCENT }}
            >
              Create Data Room →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dataRooms.map((room) => (
              <Link
                key={room.id}
                href={`/data-rooms/${room.id}`}
                className="p-6 rounded-lg border bg-white hover:shadow-lg transition-all"
                style={{ borderColor: COLOR_BORDER }}
              >
                <h3 className="text-lg font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
                  {room.name}
                </h3>
                <p className="text-sm mb-4" style={{ color: COLOR_TEXT_SECONDARY }}>
                  {room.description}
                </p>
                <div className="flex items-center justify-between text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>
                  <span>📄 {room.documentCount || 0} documents</span>
                  <span>👥 {room.viewerCount || 0} viewers</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

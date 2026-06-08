'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Trash2, Archive, CheckCircle2, AlertCircle, MessageCircle, Eye, FileText } from 'lucide-react'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER, COLOR_SURFACE_SUCCESS } from '@/styles/forward-colors'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
}

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 },
}

interface Notification {
  id: string
  type: 'inquiry' | 'message' | 'listing' | 'system' | 'milestone'
  title: string
  description: string
  icon: React.ComponentType<any>
  color: string
  timestamp: string
  read: boolean
  actionUrl?: string
}

const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    type: 'inquiry',
    title: 'New Inquiry Received',
    description: 'Ahmed Al Mansouri is interested in TechFlow Solutions',
    icon: AlertCircle,
    color: '#FF8C00',
    timestamp: '2 mins ago',
    read: false,
    actionUrl: '/messages',
  },
  {
    id: 'notif-2',
    type: 'message',
    title: 'New Message',
    description: 'Fatima: Can you send me the latest revenue figures?',
    icon: MessageCircle,
    color: '#3B82F6',
    timestamp: '15 mins ago',
    read: false,
    actionUrl: '/messages',
  },
  {
    id: 'notif-3',
    type: 'listing',
    title: 'Listing Published',
    description: 'Your business listing is now live and visible to buyers',
    icon: CheckCircle2,
    color: '#10B981',
    timestamp: '1 hour ago',
    read: true,
    actionUrl: '/listings',
  },
  {
    id: 'notif-4',
    type: 'milestone',
    title: 'Milestone: 100 Views',
    description: 'Your TechFlow Solutions listing has reached 100 views!',
    icon: Eye,
    color: '#8B5CF6',
    timestamp: '2 hours ago',
    read: true,
  },
  {
    id: 'notif-5',
    type: 'inquiry',
    title: 'Follow-up: Scheduled Call',
    description: 'Mohammed Investment Group confirmed call for tomorrow at 2 PM',
    icon: AlertCircle,
    color: '#FF8C00',
    timestamp: '3 hours ago',
    read: true,
    actionUrl: '/messages',
  },
  {
    id: 'notif-6',
    type: 'system',
    title: 'NDA Signed',
    description: 'Sarah Johnson has signed the NDA for your listing review',
    icon: FileText,
    color: '#6B7280',
    timestamp: '5 hours ago',
    read: true,
  },
]

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  const unreadCount = notifications.filter(n => !n.read).length
  const filteredNotifications = filter === 'unread' ? notifications.filter(n => !n.read) : notifications

  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map(n => (n.id === id ? { ...n, read: true } : n)))
  }

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }

  const handleDelete = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id))
  }

  const handleArchive = (id: string) => {
    handleDelete(id)
  }

  return (
    <motion.div
      className="max-w-3xl mx-auto px-6 py-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-black" style={{ color: COLOR_PRIMARY }}>
            Notifications
          </h1>
          {unreadCount > 0 && (
            <div
              className="px-4 py-2 rounded-full text-sm font-bold text-white"
              style={{ background: COLOR_ACCENT }}
            >
              {unreadCount} new
            </div>
          )}
        </div>

        {/* Filters & Actions */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className="px-4 py-2 rounded-lg font-semibold text-sm transition-all"
              style={{
                background: filter === 'all' ? COLOR_ACCENT : '#F3F4F6',
                color: filter === 'all' ? 'white' : COLOR_PRIMARY,
              }}
            >
              All Notifications
            </button>
            <button
              onClick={() => setFilter('unread')}
              className="px-4 py-2 rounded-lg font-semibold text-sm transition-all"
              style={{
                background: filter === 'unread' ? COLOR_ACCENT : '#F3F4F6',
                color: filter === 'unread' ? 'white' : COLOR_PRIMARY,
              }}
            >
              Unread ({unreadCount})
            </button>
          </div>

          {unreadCount > 0 && (
            <motion.button
              onClick={handleMarkAllAsRead}
              className="text-sm font-semibold hover:opacity-70 transition-opacity"
              style={{ color: COLOR_ACCENT }}
              whileHover={{ scale: 1.05 }}
            >
              Mark all as read
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <motion.div
          className="text-center py-12"
          variants={itemVariants}
        >
          <div className="text-6xl mb-4">🎉</div>
          <p className="text-lg font-bold" style={{ color: COLOR_PRIMARY }}>
            You're all caught up!
          </p>
          <p style={{ color: COLOR_TEXT_SECONDARY }}>
            {filter === 'unread' ? 'No new notifications' : 'No notifications yet'}
          </p>
        </motion.div>
      ) : (
        <motion.div
          className="space-y-3"
          variants={containerVariants}
        >
          <AnimatePresence mode="popLayout">
            {filteredNotifications.map(notification => {
              const Icon = notification.icon
              return (
                <motion.div
                  key={notification.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="p-5 rounded-lg border-2 hover:shadow-md transition-all cursor-pointer group"
                  style={{
                    borderColor: notification.read ? COLOR_BORDER : notification.color,
                    background: notification.read ? 'white' : '#FFF7F3',
                    borderWidth: notification.read ? '1px' : '2px',
                  }}
                  onClick={() => !notification.read && handleMarkAsRead(notification.id)}
                  variants={itemVariants}
                  whileHover={{ y: -2 }}
                >
                  <div className="flex gap-4 items-start">
                    {/* Icon */}
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: notification.color + '20' }}
                    >
                      <Icon className="w-6 h-6" style={{ color: notification.color }} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-bold text-sm" style={{ color: COLOR_PRIMARY }}>
                          {notification.title}
                        </h3>
                        {!notification.read && (
                          <div
                            className="w-2 h-2 rounded-full flex-shrink-0"
                            style={{ background: COLOR_ACCENT }}
                          />
                        )}
                      </div>
                      <p className="text-sm mb-2 leading-relaxed" style={{ color: COLOR_TEXT_SECONDARY }}>
                        {notification.description}
                      </p>
                      <p className="text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>
                        {notification.timestamp}
                      </p>
                    </div>

                    {/* Actions */}
                    <div
                      className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {notification.actionUrl && (
                        <motion.a
                          href={notification.actionUrl}
                          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                          whileHover={{ scale: 1.1 }}
                        >
                          <CheckCircle2 className="w-5 h-5" style={{ color: COLOR_ACCENT }} />
                        </motion.a>
                      )}
                      <motion.button
                        onClick={() => handleArchive(notification.id)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        whileHover={{ scale: 1.1 }}
                      >
                        <Archive className="w-5 h-5" style={{ color: COLOR_TEXT_SECONDARY }} />
                      </motion.button>
                      <motion.button
                        onClick={() => handleDelete(notification.id)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        whileHover={{ scale: 1.1 }}
                      >
                        <Trash2 className="w-5 h-5" style={{ color: COLOR_TEXT_SECONDARY }} />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Info Card */}
      <motion.div
        className="mt-12 p-6 rounded-lg border-2"
        style={{ borderColor: COLOR_ACCENT, background: COLOR_SURFACE_SUCCESS }}
        variants={itemVariants}
      >
        <h3 className="font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
          💡 Notification Preferences
        </h3>
        <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-sm">
          Manage your notification settings in Account Settings to customize what notifications you receive and how you receive them.
        </p>
      </motion.div>
    </motion.div>
  )
}

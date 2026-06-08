'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Plus, Send, MoreVertical, Paperclip, Smile, Phone, Video, Archive, MessageCircle } from 'lucide-react'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER } from '@/styles/forward-colors'
import { DashboardHeader } from '@/components/DashboardHeader'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
}

interface Conversation {
  id: string
  name: string
  avatar: string
  lastMessage: string
  timestamp: string
  unreadCount: number
  isOnline: boolean
  role: string
}

interface Message {
  id: string
  sender: string
  senderRole: string
  content: string
  timestamp: string
  isOwn: boolean
  avatar: string
}

const mockConversations: Conversation[] = [
  {
    id: 'conv-1',
    name: 'Ahmed Al Mansouri',
    avatar: '👨‍💼',
    lastMessage: 'Great, I\'ll review the financials and get back to you',
    timestamp: '2 mins ago',
    unreadCount: 2,
    isOnline: true,
    role: 'Buyer - Tech Investor',
  },
  {
    id: 'conv-2',
    name: 'Fatima Al Khaleej',
    avatar: '👩‍💼',
    lastMessage: 'Can you send me the latest revenue figures?',
    timestamp: '1 hour ago',
    unreadCount: 0,
    isOnline: true,
    role: 'Broker',
  },
  {
    id: 'conv-3',
    name: 'Mohammed Investment Group',
    avatar: '🏢',
    lastMessage: 'We are interested in moving forward. Let\'s schedule a call.',
    timestamp: '3 hours ago',
    unreadCount: 1,
    isOnline: false,
    role: 'PE Firm',
  },
  {
    id: 'conv-4',
    name: 'Sarah Johnson',
    avatar: '👩‍💼',
    lastMessage: 'Thanks for the teaser. Very interested.',
    timestamp: 'Yesterday',
    unreadCount: 0,
    isOnline: false,
    role: 'Strategic Buyer',
  },
]

const mockMessages: Message[] = [
  {
    id: 'msg-1',
    sender: 'Ahmed Al Mansouri',
    senderRole: 'Buyer',
    content: 'Hi, I received your business listing. It looks very interesting.',
    timestamp: '10:30 AM',
    isOwn: false,
    avatar: '👨‍💼',
  },
  {
    id: 'msg-2',
    sender: 'You',
    senderRole: 'Seller',
    content: 'Thank you! Happy to discuss further. Would you like to schedule a call?',
    timestamp: '10:45 AM',
    isOwn: true,
    avatar: '👨‍💼',
  },
  {
    id: 'msg-3',
    sender: 'Ahmed Al Mansouri',
    senderRole: 'Buyer',
    content: 'Yes, tomorrow at 2 PM works for me. Can we cover: revenue breakdown, customer concentration, and growth trajectory?',
    timestamp: '11:00 AM',
    isOwn: false,
    avatar: '👨‍💼',
  },
  {
    id: 'msg-4',
    sender: 'You',
    senderRole: 'Seller',
    content: 'Perfect. I\'ll send you the teaser and some basic metrics before our call.',
    timestamp: '11:05 AM',
    isOwn: true,
    avatar: '👨‍💼',
  },
  {
    id: 'msg-5',
    sender: 'Ahmed Al Mansouri',
    senderRole: 'Buyer',
    content: 'Great, I\'ll review the financials and get back to you',
    timestamp: '2 mins ago',
    isOwn: false,
    avatar: '👨‍💼',
  },
]

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations)
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(mockConversations[0])
  const [messages, setMessages] = useState<Message[]>(mockMessages)
  const [messageText, setMessageText] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedConversation) return

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      sender: 'You',
      senderRole: 'Seller',
      content: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOwn: true,
      avatar: '👨‍💼',
    }

    setMessages([...messages, newMessage])
    setMessageText('')

    // Mark as read
    setConversations(
      conversations.map(c =>
        c.id === selectedConversation.id ? { ...c, unreadCount: 0 } : c
      )
    )

    // Simulate typing indicator
    setIsTyping(true)
    setTimeout(() => {
      const reply: Message = {
        id: `msg-${Date.now() + 1}`,
        sender: selectedConversation.name,
        senderRole: selectedConversation.role,
        content: 'Thanks for the update. I\'ll review and follow up soon.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOwn: false,
        avatar: selectedConversation.avatar,
      }
      setMessages(prev => [...prev, reply])
      setIsTyping(false)
    }, 2000)
  }

  const filteredConversations = conversations.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0)

  return (
    <>
      <DashboardHeader
        breadcrumbs={[
          { label: 'Forward OS', href: '/' },
          { label: 'Messages' },
        ]}
        onMenuToggle={() => window.dispatchEvent(new CustomEvent('toggleSidebar'))}
        sidebarOpen={true}
        title="Messages"
        subtitle="Real-time communication with buyers, sellers, and brokers"
        userProfile={{
          name: 'User',
          email: 'user@forward.ae',
          role: 'Member',
        }}
      />

      <motion.div
        className="flex h-[calc(100vh-120px)] bg-white"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
      {/* Sidebar - Conversations */}
      <motion.div
        className="w-full md:w-80 border-r flex flex-col"
        style={{ borderColor: COLOR_BORDER }}
        variants={itemVariants}
      >
        {/* Header */}
        <div className="p-6 border-b" style={{ borderColor: COLOR_BORDER }}>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-black" style={{ color: COLOR_PRIMARY }}>
              Messages
            </h1>
            {totalUnread > 0 && (
              <div
                className="px-3 py-1 rounded-full text-xs font-bold text-white"
                style={{ background: COLOR_ACCENT }}
              >
                {totalUnread}
              </div>
            )}
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5" style={{ color: COLOR_TEXT_SECONDARY }} />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
              style={{ borderColor: COLOR_BORDER, '--tw-ring-color': COLOR_ACCENT } as any}
            />
          </div>
        </div>

        {/* Conversations List */}
        <motion.div
          className="flex-1 overflow-y-auto"
          variants={containerVariants}
        >
          <AnimatePresence>
            {filteredConversations.map(conv => (
              <motion.button
                key={conv.id}
                onClick={() => setSelectedConversation(conv)}
                className="w-full px-4 py-4 border-b flex gap-3 hover:bg-gray-50 transition-colors text-left relative"
                style={{
                  borderColor: COLOR_BORDER,
                  background: selectedConversation?.id === conv.id ? '#FEE2CC' : 'transparent',
                }}
                variants={itemVariants}
                whileHover={{ x: 2 }}
              >
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl flex-shrink-0 relative">
                  {conv.avatar}
                  {conv.isOnline && (
                    <div
                      className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white"
                      style={{ background: '#10b981' }}
                    />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-bold" style={{ color: COLOR_PRIMARY }}>
                      {conv.name}
                    </p>
                    {conv.unreadCount > 0 && (
                      <div
                        className="px-2 py-1 rounded-full text-xs font-bold text-white flex-shrink-0"
                        style={{ background: COLOR_ACCENT }}
                      >
                        {conv.unreadCount}
                      </div>
                    )}
                  </div>
                  <p className="text-sm mb-1 truncate" style={{ color: COLOR_TEXT_SECONDARY }}>
                    {conv.role}
                  </p>
                  <p className="text-xs truncate" style={{ color: COLOR_TEXT_SECONDARY }}>
                    {conv.lastMessage}
                  </p>
                  <p className="text-xs mt-2" style={{ color: COLOR_TEXT_SECONDARY }}>
                    {conv.timestamp}
                  </p>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Main Chat Area */}
      {selectedConversation ? (
        <motion.div
          className="flex-1 hidden md:flex flex-col"
          key={selectedConversation.id}
          variants={itemVariants}
        >
          {/* Header */}
          <div className="p-6 border-b flex items-center justify-between" style={{ borderColor: COLOR_BORDER }}>
            <div className="flex items-center gap-3">
              <div className="text-4xl">{selectedConversation.avatar}</div>
              <div>
                <p className="font-bold" style={{ color: COLOR_PRIMARY }}>
                  {selectedConversation.name}
                </p>
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ background: selectedConversation.isOnline ? '#10b981' : '#9CA3AF' }}
                  />
                  <p className="text-xs" style={{ color: COLOR_TEXT_SECONDARY }}>
                    {selectedConversation.isOnline ? 'Active now' : 'Offline'}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <motion.button
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                whileHover={{ scale: 1.1 }}
              >
                <Phone className="w-5 h-5" style={{ color: COLOR_ACCENT }} />
              </motion.button>
              <motion.button
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                whileHover={{ scale: 1.1 }}
              >
                <Video className="w-5 h-5" style={{ color: COLOR_ACCENT }} />
              </motion.button>
              <motion.button
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                whileHover={{ scale: 1.1 }}
              >
                <MoreVertical className="w-5 h-5" style={{ color: COLOR_TEXT_SECONDARY }} />
              </motion.button>
            </div>
          </div>

          {/* Messages */}
          <motion.div
            className="flex-1 overflow-y-auto p-6 space-y-4"
            variants={containerVariants}
          >
            {messages.map(msg => (
              <motion.div
                key={msg.id}
                className={`flex gap-3 ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
                variants={itemVariants}
              >
                {!msg.isOwn && <div className="text-2xl flex-shrink-0">{msg.avatar}</div>}

                <div className={`max-w-xs ${msg.isOwn ? 'order-2' : 'order-1'}`}>
                  {!msg.isOwn && (
                    <p className="text-xs font-semibold mb-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                      {msg.sender}
                    </p>
                  )}
                  <motion.div
                    className="px-4 py-3 rounded-2xl"
                    style={{
                      background: msg.isOwn ? COLOR_ACCENT : '#F3F4F6',
                      color: msg.isOwn ? 'white' : COLOR_PRIMARY,
                    }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <p className="text-sm">{msg.content}</p>
                  </motion.div>
                  <p className="text-xs mt-1" style={{ color: COLOR_TEXT_SECONDARY }}>
                    {msg.timestamp}
                  </p>
                </div>

                {msg.isOwn && <div className="text-2xl flex-shrink-0">{msg.avatar}</div>}
              </motion.div>
            ))}

            {isTyping && (
              <motion.div
                className="flex gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="text-2xl">{selectedConversation.avatar}</div>
                <div className="px-4 py-3 rounded-2xl bg-gray-200 flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-gray-600 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-gray-600 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-gray-600 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </motion.div>

          {/* Input Area */}
          <div className="p-6 border-t" style={{ borderColor: COLOR_BORDER }}>
            <div className="flex gap-3 items-center">
              <motion.button
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                whileHover={{ scale: 1.1 }}
              >
                <Paperclip className="w-5 h-5" style={{ color: COLOR_ACCENT }} />
              </motion.button>

              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-1 px-4 py-3 rounded-full border focus:outline-none focus:ring-2"
                style={{ borderColor: COLOR_BORDER, '--tw-ring-color': COLOR_ACCENT } as any}
              />

              <motion.button
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                whileHover={{ scale: 1.1 }}
              >
                <Smile className="w-5 h-5" style={{ color: COLOR_ACCENT }} />
              </motion.button>

              <motion.button
                onClick={handleSendMessage}
                disabled={!messageText.trim()}
                className="p-3 rounded-full font-bold text-white transition-all hover:opacity-90 disabled:opacity-50"
                style={{ background: COLOR_ACCENT }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Send className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          className="flex-1 hidden md:flex items-center justify-center"
          variants={itemVariants}
        >
          <div className="text-center">
            <MessageCircle className="w-16 h-16 mx-auto mb-4" style={{ color: COLOR_ACCENT }} />
            <p className="text-lg font-bold" style={{ color: COLOR_PRIMARY }}>
              Select a conversation to start messaging
            </p>
            <p style={{ color: COLOR_TEXT_SECONDARY }}>
              Choose from your existing conversations or start a new one
            </p>
          </div>
        </motion.div>
      )}
      </motion.div>
    </>
  )
}

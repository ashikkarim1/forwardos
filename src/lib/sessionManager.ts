// Session Management with Persistence
interface User {
  id: string
  email: string
  fullName: string
  userType: 'buyer' | 'seller' | 'broker' | 'institutional' | 'professional'
  createdAt: string
  lastLogin: string
}

interface Session {
  token: string
  user: User
  expiresAt: number
  preferences: {
    lastViewedDeal?: number
    savedDeals?: number[]
    notificationSettings?: {
      emailAlerts: boolean
      newDeals: boolean
      newListings: boolean
    }
  }
}

const SESSION_STORAGE_KEY = 'forward_os_session'
const SESSION_TIMEOUT = 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds

export const sessionManager = {
  // Create a new session
  createSession: (user: User): Session => {
    const session: Session = {
      token: `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      user,
      expiresAt: Date.now() + SESSION_TIMEOUT,
      preferences: {
        savedDeals: [],
        notificationSettings: {
          emailAlerts: true,
          newDeals: true,
          newListings: true,
        },
      },
    }
    
    // Auth tokens/PII are NOT persisted to localStorage (XSS-exposable).
    // Real auth uses the httpOnly session cookie set server-side.

    return session
  },

  // Get current session
  getSession: (): Session | null => {
    if (typeof window === 'undefined') return null
    
    const sessionStr = localStorage.getItem(SESSION_STORAGE_KEY)
    if (!sessionStr) return null
    
    try {
      const session = JSON.parse(sessionStr) as Session
      
      // Check if expired
      if (Date.now() > session.expiresAt) {
        sessionManager.destroySession()
        return null
      }
      
      return session
    } catch {
      return null
    }
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    const session = sessionManager.getSession()
    return !!session && Date.now() < session.expiresAt
  },

  // Update session preferences
  updatePreferences: (preferences: Partial<Session['preferences']>) => {
    const session = sessionManager.getSession()
    if (!session) return
    
    session.preferences = { ...session.preferences, ...preferences }
    if (typeof window !== 'undefined') {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session))
    }
  },

  // Save a deal
  saveDeal: (dealId: number) => {
    const session = sessionManager.getSession()
    if (!session) return
    
    if (!session.preferences.savedDeals) {
      session.preferences.savedDeals = []
    }
    
    if (!session.preferences.savedDeals.includes(dealId)) {
      session.preferences.savedDeals.push(dealId)
      sessionManager.updatePreferences({ savedDeals: session.preferences.savedDeals })
    }
  },

  // Unsave a deal
  unsaveDeal: (dealId: number) => {
    const session = sessionManager.getSession()
    if (!session) return
    
    if (session.preferences.savedDeals) {
      session.preferences.savedDeals = session.preferences.savedDeals.filter(
        id => id !== dealId
      )
      sessionManager.updatePreferences({ savedDeals: session.preferences.savedDeals })
    }
  },

  // Check if deal is saved
  isDealSaved: (dealId: number): boolean => {
    const session = sessionManager.getSession()
    return !!(
      session?.preferences.savedDeals &&
      session.preferences.savedDeals.includes(dealId)
    )
  },

  // Get current user
  getUser: (): User | null => {
    const session = sessionManager.getSession()
    return session?.user || null
  },

  // Destroy session (logout)
  destroySession: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(SESSION_STORAGE_KEY)
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
    }
  },

  // Refresh session expiry
  refreshSession: () => {
    const session = sessionManager.getSession()
    if (session) {
      session.expiresAt = Date.now() + SESSION_TIMEOUT
      if (typeof window !== 'undefined') {
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session))
      }
    }
  },
}

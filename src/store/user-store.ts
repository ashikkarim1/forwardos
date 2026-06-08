'use client'

export type UserRole = 'buyer' | 'seller' | 'broker'

export interface UserStore {
  role: UserRole | null
  userId: string | null
  userEmail: string | null
  companyName: string | null
  currency: 'USD' | 'CAD' | 'AED' | 'SAR'
  language: 'en' | 'ar'
  timezone: string
  watchlist: {
    dealIds: string[]
    companies: string[]
  }
  notifications: {
    emailAlerts: boolean
    inAppNotifications: boolean
    dealHeatThreshold: number
    newDealAlerts: boolean
    buyerInterestAlerts: boolean
    priceChangeAlerts: boolean
    weeklyDigest: boolean
  }
}

const defaultState: UserStore = {
  role: null,
  userId: null,
  userEmail: null,
  companyName: null,
  currency: 'USD',
  language: 'en',
  timezone: 'America/New_York',
  watchlist: {
    dealIds: [],
    companies: [],
  },
  notifications: {
    emailAlerts: true,
    inAppNotifications: true,
    dealHeatThreshold: 70,
    newDealAlerts: true,
    buyerInterestAlerts: true,
    priceChangeAlerts: true,
    weeklyDigest: false,
  },
}

export function useUserStore() {
  return {
    ...defaultState,
    setRole: (role: UserRole) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('userRole', role)
      }
    },
    addToWatchlist: (dealId: string) => {
      if (typeof window !== 'undefined') {
        const current = JSON.parse(localStorage.getItem('watchlistDeals') || '[]')
        if (!current.includes(dealId)) {
          localStorage.setItem('watchlistDeals', JSON.stringify([...current, dealId]))
        }
      }
    },
    removeFromWatchlist: (dealId: string) => {
      if (typeof window !== 'undefined') {
        const current = JSON.parse(localStorage.getItem('watchlistDeals') || '[]')
        localStorage.setItem('watchlistDeals', JSON.stringify(current.filter((id: string) => id !== dealId)))
      }
    },
    updateNotificationPreferences: (prefs: any) => {
      if (typeof window !== 'undefined') {
        const current = JSON.parse(localStorage.getItem('notifications') || JSON.stringify(defaultState.notifications))
        localStorage.setItem('notifications', JSON.stringify({ ...current, ...prefs }))
      }
    },
    updateCurrency: (currency: any) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('currency', currency)
      }
    },
    updateLanguage: (lang: any) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('language', lang)
      }
    },
  }
}

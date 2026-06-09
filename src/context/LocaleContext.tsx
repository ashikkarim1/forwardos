'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import type { Locale } from '@/lib/translations'
import type { Currency } from '@/lib/currency'
import { getDefaultCurrency } from '@/lib/currency'

interface LocaleContextType {
  locale: Locale
  currency: Currency
  setLocale: (locale: Locale) => void
  setCurrency: (currency: Currency) => void
  isRTL: boolean
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined)

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en')
  const [currency, setCurrencyState] = useState<Currency>('USD')
  const [mounted, setMounted] = useState(false)

  // Initialize from localStorage on mount
  useEffect(() => {
    const savedLocale = localStorage.getItem('forward_locale') as Locale | null
    const savedCurrency = localStorage.getItem('forward_currency') as Currency | null

    if (savedLocale && ['en', 'fr', 'ar'].includes(savedLocale)) {
      setLocaleState(savedLocale)
    }

    if (savedCurrency && ['USD', 'CAD', 'AED'].includes(savedCurrency)) {
      setCurrencyState(savedCurrency)
    } else if (savedLocale) {
      setCurrencyState(getDefaultCurrency(savedLocale))
    }

    setMounted(true)
  }, [])

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem('forward_locale', newLocale)
    // Update HTML dir attribute
    document.documentElement.dir = newLocale === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = newLocale
  }

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency)
    localStorage.setItem('forward_currency', newCurrency)
  }

  if (!mounted) {
    return <>{children}</>
  }

  return (
    <LocaleContext.Provider value={{ locale, currency, setLocale, setCurrency, isRTL: locale === 'ar' }}>
      {children}
    </LocaleContext.Provider>
  )
}

const defaultContext: LocaleContextType = {
  locale: 'en',
  currency: 'USD',
  setLocale: () => {},
  setCurrency: () => {},
  isRTL: false,
}

export function useLocale() {
  const context = useContext(LocaleContext)
  return context ?? defaultContext
}

'use client'

import { useState, useRef, useEffect } from 'react'
import { useLocale } from '@/context/LocaleContext'
import { Globe } from 'lucide-react'
import type { Locale } from '@/lib/translations'
import type { Currency } from '@/lib/currency'

export function LocaleSelector() {
  const { locale, currency, setLocale, setCurrency } = useLocale()
  const [isOpen, setIsOpen] = useState(false)
  const popupRef = useRef<HTMLDivElement>(null)

  // Close popup when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const locales: { id: Locale; name: string; flag: string }[] = [
    { id: 'en', name: 'English', flag: '🇺🇸' },
    { id: 'fr', name: 'Français', flag: '🇨🇦' },
    { id: 'ar', name: 'العربية', flag: '🇦🇪' },
  ]

  const currencies: { id: Currency; name: string; region: string }[] = [
    { id: 'USD', name: 'US Dollars', region: 'United States' },
    { id: 'CAD', name: 'Canadian Dollars', region: 'Canada' },
    { id: 'AED', name: 'UAE Dirhams', region: 'UAE' },
  ]

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
        title="Change language and currency"
      >
        <Globe size={20} style={{ color: '#B8956A' }} />
        <span className="text-sm font-semibold uppercase">{locale}</span>
      </button>

      {isOpen && (
        <div
          ref={popupRef}
          className="absolute top-12 right-0 bg-white border rounded-lg shadow-xl z-50 min-w-[320px]"
          style={{ borderColor: '#E5E7EB' }}
        >
          {/* Language Selection */}
          <div className="border-b p-4" style={{ borderColor: '#E5E7EB' }}>
            <h3 className="text-xs font-bold uppercase mb-3" style={{ color: '#1A1A1A' }}>
              Language
            </h3>
            <div className="space-y-2">
              {locales.map((loc) => (
                <button
                  key={loc.id}
                  onClick={() => {
                    setLocale(loc.id)
                    setIsOpen(false)
                  }}
                  className={`w-full px-3 py-2 rounded text-sm font-medium text-left transition-colors ${
                    locale === loc.id ? 'text-white' : ''
                  }`}
                  style={{
                    background: locale === loc.id ? '#B8956A' : '#F9FAFB',
                    color: locale === loc.id ? 'white' : '#1A1A1A',
                  }}
                >
                  {loc.flag} {loc.name}
                </button>
              ))}
            </div>
          </div>

          {/* Currency Selection */}
          <div className="p-4">
            <h3 className="text-xs font-bold uppercase mb-3" style={{ color: '#1A1A1A' }}>
              Currency
            </h3>
            <div className="space-y-2">
              {currencies.map((curr) => (
                <button
                  key={curr.id}
                  onClick={() => {
                    setCurrency(curr.id)
                    setIsOpen(false)
                  }}
                  className={`w-full px-3 py-2 rounded text-sm font-medium text-left transition-colors flex justify-between items-center ${
                    currency === curr.id ? 'text-white' : ''
                  }`}
                  style={{
                    background: currency === curr.id ? '#B8956A' : '#FFFFFF',
                    color: currency === curr.id ? 'white' : '#1A1A1A',
                  }}
                >
                  <span>
                    {curr.id} · {curr.name}
                  </span>
                  <span className="text-xs opacity-75">{curr.region}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

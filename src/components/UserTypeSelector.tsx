'use client'

import { useState } from 'react'
import { X, Building2, Users, Briefcase } from 'lucide-react'
import { useLocale } from '@/context/LocaleContext'
import { useTranslation } from '@/hooks/useTranslation'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER } from '@/styles/forward-colors'

interface UserTypeSelectorProps {
  isOpen: boolean
  onClose: () => void
  redirectAfterSelection?: boolean
}

export function UserTypeSelector({ isOpen, onClose, redirectAfterSelection = true }: UserTypeSelectorProps) {
  const { locale, isRTL } = useLocale()
  const t = useTranslation()
  const [selectedType, setSelectedType] = useState<string | null>(null)

  const userTypes = [
    {
      key: 'sellers',
      icon: Building2,
      title: t('users.sellers.title'),
      description: t('users.sellers.desc'),
      href: '/auth/signup-seller',
      color: '#FF8C00',
    },
    {
      key: 'buyers',
      icon: Users,
      title: t('users.buyers.title'),
      description: t('users.buyers.desc'),
      href: '/auth/signup?type=buyer',
      color: '#FF8C00',
    },
    {
      key: 'brokers',
      icon: Briefcase,
      title: t('users.brokers.title'),
      description: t('users.brokers.desc'),
      href: '/auth/signup?type=broker',
      color: '#FF8C00',
    },
  ]

  const handleSelection = (href: string) => {
    setSelectedType(href)
    if (redirectAfterSelection) {
      window.location.href = href
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/50 z-40"
        style={{ animation: 'fadeIn 0.3s ease-in' }}
      />

      {/* Modal */}
      <div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl mx-4 rounded-lg bg-white shadow-2xl"
        style={{ animation: 'scaleIn 0.3s ease-out' }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Close"
        >
          <X size={24} style={{ color: COLOR_PRIMARY }} />
        </button>

        {/* Content */}
        <div className="p-8 sm:p-12" dir={isRTL ? 'rtl' : 'ltr'}>
          <h2 className="text-3xl font-black mb-2" style={{ color: COLOR_PRIMARY }}>
            {t('users.modal.title')}
          </h2>
          <p className="text-lg mb-8" style={{ color: COLOR_TEXT_SECONDARY }}>
            {t('users.modal.subtitle')}
          </p>

          {/* User Type Cards */}
          <div className={`grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8`}>
            {userTypes.map((userType) => {
              const Icon = userType.icon
              const isSelected = selectedType === userType.href
              return (
                <button
                  key={userType.key}
                  onClick={() => handleSelection(userType.href)}
                  disabled={selectedType !== null && !isSelected}
                  className={`p-6 rounded-lg border-2 transition-all text-center cursor-pointer ${
                    isSelected ? 'border-2' : ''
                  } ${selectedType !== null && !isSelected ? 'opacity-50 cursor-not-allowed' : ''}`}
                  style={{
                    borderColor: isSelected ? userType.color : COLOR_BORDER,
                    background: isSelected ? userType.color + '10' : 'white',
                    boxShadow: isSelected ? `0 0 0 3px ${userType.color}33` : 'none',
                  }}
                >
                  <Icon size={32} style={{ color: userType.color }} className="mx-auto mb-3" />
                  <h3 className="font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
                    {userType.title}
                  </h3>
                  <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
                    {userType.description}
                  </p>
                </button>
              )
            })}
          </div>

          {/* Info Text */}
          <div className="p-4 rounded-lg border" style={{ borderColor: COLOR_BORDER, background: COLOR_PRIMARY + '02' }}>
            <p className="text-sm" style={{ color: COLOR_TEXT_SECONDARY }}>
              {t('users.modal.info')}
            </p>
          </div>
        </div>

        <style jsx>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
          @keyframes scaleIn {
            from {
              opacity: 0;
              transform: scale(0.95);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
        `}</style>
      </div>
    </>
  )
}

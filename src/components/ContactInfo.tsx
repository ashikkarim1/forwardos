'use client'

import { useLocale } from '@/context/LocaleContext'
import { getOfficeByLocale } from '@/lib/office-locations'
import { t } from '@/lib/translations'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import { COLOR_PRIMARY, COLOR_TEXT_SECONDARY, COLOR_ACCENT } from '@/styles/forward-colors'

export function ContactInfo() {
  const { locale, isRTL } = useLocale()
  const office = getOfficeByLocale(locale)

  return (
    <div className={`space-y-4 ${isRTL ? 'text-right' : ''}`}>
      {/* Headquarters */}
      <div className="flex gap-3" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
        <MapPin size={20} style={{ color: COLOR_ACCENT, flexShrink: 0 }} />
        <div>
          <p style={{ color: COLOR_PRIMARY }} className="font-semibold">
            {t('contact.headquarters', locale)}
          </p>
          <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-sm">
            {t('contact.address', locale)}
          </p>
        </div>
      </div>

      {/* Phone */}
      <div className="flex gap-3" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
        <Phone size={20} style={{ color: COLOR_ACCENT, flexShrink: 0 }} />
        <div>
          <p style={{ color: COLOR_PRIMARY }} className="font-semibold text-sm">
            {t('contact.phone', locale)}
          </p>
        </div>
      </div>

      {/* Email */}
      <div className="flex gap-3" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
        <Mail size={20} style={{ color: COLOR_ACCENT, flexShrink: 0 }} />
        <div>
          <p style={{ color: COLOR_PRIMARY }} className="font-semibold text-sm">
            <a href={`mailto:${t('contact.email', locale)}`} className="hover:underline">
              {t('contact.email', locale)}
            </a>
          </p>
        </div>
      </div>

      {/* Hours */}
      <div className="flex gap-3" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
        <Clock size={20} style={{ color: COLOR_ACCENT, flexShrink: 0 }} />
        <div>
          <p style={{ color: COLOR_PRIMARY }} className="font-semibold text-sm">
            {t('contact.hours', locale)}
          </p>
        </div>
      </div>
    </div>
  )
}

// Minimal contact card for footer
export function ContactCard() {
  const { locale, isRTL } = useLocale()
  const office = getOfficeByLocale(locale)

  return (
    <div
      className="p-4 rounded-lg border space-y-2"
      style={{ borderColor: '#E5E4E0', direction: isRTL ? 'rtl' : 'ltr' }}
    >
      <h4 className="font-bold" style={{ color: COLOR_PRIMARY }}>
        {office.city}, {office.region}
      </h4>
      <p style={{ color: COLOR_TEXT_SECONDARY }} className="text-sm">
        {t('contact.address', locale)}
      </p>
      <p style={{ color: COLOR_ACCENT }} className="text-sm font-semibold">
        {t('contact.phone', locale)}
      </p>
    </div>
  )
}

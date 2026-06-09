'use client'

import { ReactNode } from 'react'
import { useLocale } from '@/context/LocaleContext'
import { COLOR_PRIMARY, COLOR_TEXT_SECONDARY, COLOR_BORDER } from '@/styles/forward-colors'
import { Breadcrumbs, BreadcrumbItem } from './Breadcrumbs'

interface PageHeaderProps {
  title: string
  subtitle?: string
  breadcrumbs?: BreadcrumbItem[]
  children?: ReactNode
}

export function PageHeader({ title, subtitle, breadcrumbs, children }: PageHeaderProps) {
  const { isRTL } = useLocale()

  return (
    <div className="border-b sticky top-0 z-40 bg-white" style={{ borderColor: COLOR_BORDER }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Header Content */}
        <div className={`py-6 flex items-start justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
            {/* Title - H1, 32px, font-black */}
            <h1
              className="text-3xl font-black mb-2 leading-tight"
              style={{ color: COLOR_PRIMARY }}
            >
              {title}
            </h1>

            {/* Subtitle - optional */}
            {subtitle && (
              <p
                className="text-base font-medium"
                style={{ color: COLOR_TEXT_SECONDARY }}
              >
                {subtitle}
              </p>
            )}
          </div>

          {/* Right side content (optional) */}
          {children && <div className={isRTL ? 'ml-6' : 'ml-6'}>{children}</div>}
        </div>

        {/* Breadcrumbs - Below Title */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <div className="pb-4 pt-0">
            <Breadcrumbs items={breadcrumbs} />
          </div>
        )}
      </div>
    </div>
  )
}

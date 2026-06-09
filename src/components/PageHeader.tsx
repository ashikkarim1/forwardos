'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
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
        <div className={`py-6 flex items-start justify-between gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          {/* Home Logo Link */}
          <Link
            href="/"
            className="flex-shrink-0 hover:opacity-80 transition-opacity -ml-2 -mt-1"
            title="Back to Home"
          >
            <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
              <text x="15" y="85" fontFamily="system-ui, -apple-system, 'Segoe UI', sans-serif" fontSize="72" fontWeight="700" fill="#f59e0b">F</text>
              <text x="55" y="85" fontFamily="system-ui, -apple-system, 'Segoe UI', sans-serif" fontSize="72" fontWeight="700" fill="#f59e0b">o</text>
              <g transform="translate(95, 50)">
                <line x1="0" y1="0" x2="20" y2="0" stroke="#ea580c" strokeWidth="4" strokeLinecap="round"/>
                <polygon points="20,0 14,-5 14,5" fill="#ea580c"/>
              </g>
            </svg>
          </Link>

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

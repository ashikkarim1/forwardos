'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { Sparkles } from 'lucide-react'
import { useLocale } from '@/context/LocaleContext'
import { COLOR_PRIMARY, COLOR_TEXT_SECONDARY, COLOR_BORDER, COLOR_ACCENT } from '@/styles/forward-colors'
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
        <div className={`py-4 md:py-6 flex items-start justify-between gap-2 md:gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          {/* Home Logo Link - Smaller on mobile */}
          <Link
            href="/"
            className="flex-shrink-0 hover:opacity-80 transition-opacity"
            title="Back to Home"
          >
            <Sparkles size={24} className="md:hidden" style={{ color: COLOR_ACCENT }} />
            <Sparkles size={32} className="hidden md:block" style={{ color: COLOR_ACCENT }} />
          </Link>

          <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
            {/* Title - Responsive sizing */}
            <h1
              className="text-2xl md:text-3xl font-black mb-1 md:mb-2 leading-tight"
              style={{ color: COLOR_PRIMARY }}
            >
              {title}
            </h1>

            {/* Subtitle - optional, hidden on very small screens */}
            {subtitle && (
              <p
                className="hidden sm:block text-sm md:text-base font-medium"
                style={{ color: COLOR_TEXT_SECONDARY }}
              >
                {subtitle}
              </p>
            )}
          </div>

          {/* Right side content (optional) */}
          {children && <div className={`flex-shrink-0 ${isRTL ? 'ml-6' : 'ml-6'}`}>{children}</div>}
        </div>

        {/* Breadcrumbs - Collapsed on mobile, full on desktop */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <div className="pb-3 md:pb-4 pt-0">
            <div className="hidden md:block">
              <Breadcrumbs items={breadcrumbs} />
            </div>
            {/* Mobile breadcrumb - show current page only */}
            <div className="md:hidden">
              {breadcrumbs.length > 1 && (
                <Link
                  href={breadcrumbs[0].href || '/'}
                  className="flex items-center gap-1 text-sm font-semibold hover:opacity-80 transition-opacity"
                  style={{ color: COLOR_PRIMARY }}
                >
                  <span>←</span>
                  <span className="truncate">{breadcrumbs[breadcrumbs.length - 2]?.label || 'Back'}</span>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

'use client'

import Link from 'next/link'
import { useLocale } from '@/context/LocaleContext'
import { ChevronRight } from 'lucide-react'
import { COLOR_PRIMARY, COLOR_TEXT_SECONDARY, COLOR_BORDER } from '@/styles/forward-colors'

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const { isRTL } = useLocale()

  return (
    <nav
      className={`flex items-center gap-2 text-sm ${isRTL ? 'flex-row-reverse' : ''}`}
      aria-label="Breadcrumb"
    >
      {items.map((item, idx) => (
        <div key={idx} className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          {idx > 0 && (
            <ChevronRight
              size={16}
              style={{ color: COLOR_TEXT_SECONDARY }}
              className={isRTL ? 'transform scale-x-[-1]' : ''}
            />
          )}
          {item.href ? (
            <Link
              href={item.href}
              className="font-medium hover:underline transition-colors"
              style={{ color: COLOR_PRIMARY }}
            >
              {item.label}
            </Link>
          ) : (
            <span style={{ color: COLOR_TEXT_SECONDARY }} className="font-medium">
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  )
}

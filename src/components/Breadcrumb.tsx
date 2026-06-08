/**
 * WEEK 1: BREADCRUMB COMPONENT
 * Semantic navigation with accessibility
 *
 * Usage:
 * import { Breadcrumb } from '@/components/Breadcrumb'
 *
 * const items = [
 *   { label: 'Home', href: '/' },
 *   { label: 'Deals', href: '/deals' },
 *   { label: 'Acme Corp', current: true }
 * ]
 * <Breadcrumb items={items} />
 */

import React from 'react';
import Link from 'next/link';
import { ChevronRightIcon } from '@heroicons/react/20/solid';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center gap-2 text-sm ${className}`}
    >
      <ol className="flex items-center gap-2">
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="flex items-center gap-2">
            {item.href && !item.current ? (
              <Link
                href={item.href}
                className="text-[#0066cc] hover:text-[#0052a3] focus:outline-2 focus:outline-offset-2 focus:outline-[#2D7A5F] rounded px-1"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={`px-1 ${
                  item.current
                    ? 'font-semibold text-[#1A1A1A]'
                    : 'text-[#666666]'
                }`}
                aria-current={item.current ? 'page' : undefined}
              >
                {item.label}
              </span>
            )}

            {index < items.length - 1 && (
              <ChevronRightIcon
                className="w-4 h-4 text-[#9ca3af]"
                aria-hidden="true"
              />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/**
 * EXAMPLE USAGE:
 *
 * import { Breadcrumb } from '@/components/Breadcrumb'
 *
 * export default function DealDetailPage() {
 *   return (
 *     <div className="space-y-6">
 *       <Breadcrumb
 *         items={[
 *           { label: 'Dashboard', href: '/dashboard' },
 *           { label: 'Deals', href: '/deals' },
 *           { label: 'Acme Corp Acquisition', current: true }
 *         ]}
 *       />
 *       <h1>Acme Corp Acquisition</h1>
 *     </div>
 *   )
 * }
 */

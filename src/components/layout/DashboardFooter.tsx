'use client'

import Link from 'next/link'
import { COLOR_PRIMARY, COLOR_TEXT_SECONDARY, COLOR_TEXT_TERTIARY, COLOR_BORDER, COLOR_ACCENT } from '@/styles/forward-colors'

export function DashboardFooter() {
  const year = new Date().getFullYear()

  return (
    <footer
      className="w-full border-t mt-auto"
      style={{
        background: '#FFFFFF',
        borderColor: COLOR_BORDER,
        padding: '20px 32px',
      }}
    >
      {/* Container */}
      <div className="max-w-[1440px] mx-auto">
        {/* Single Row - Multi Column (No Spillover) */}
        <div
          className="flex items-center justify-between"
          style={{ gap: '32px', flexWrap: 'nowrap' }}
        >
          {/* Left: Brand & Copyright */}
          <div style={{ flex: '0 0 auto', minWidth: '180px' }}>
            <p className="font-semibold text-sm" style={{ color: COLOR_PRIMARY, marginBottom: '4px' }}>
              Forward OS
            </p>
            <p className="text-xs" style={{ color: COLOR_TEXT_TERTIARY }}>
              © {year} Forward Inc.
            </p>
          </div>

          {/* Product Links */}
          <div style={{ flex: '0 0 auto' }}>
            <p className="text-xs font-bold mb-2" style={{ color: COLOR_TEXT_TERTIARY, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Product
            </p>
            <div className="flex gap-4">
              {[
                { label: 'Deals', href: '/deals' },
                { label: 'Intelligence', href: '/intelligence' },
                { label: 'Diligence', href: '/diligence' },
              ].map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-xs hover:transition-colors whitespace-nowrap"
                  style={{
                    color: COLOR_TEXT_SECONDARY,
                    textDecoration: 'none',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = COLOR_ACCENT)}
                  onMouseLeave={e => (e.currentTarget.style.color = COLOR_TEXT_SECONDARY)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div style={{ flex: '0 0 auto' }}>
            <p className="text-xs font-bold mb-2" style={{ color: COLOR_TEXT_TERTIARY, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Company
            </p>
            <div className="flex gap-4">
              {[
                { label: 'About', href: '/about' },
                { label: 'Blog', href: '/blog' },
                { label: 'Careers', href: '/careers' },
              ].map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-xs hover:transition-colors whitespace-nowrap"
                  style={{
                    color: COLOR_TEXT_SECONDARY,
                    textDecoration: 'none',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = COLOR_ACCENT)}
                  onMouseLeave={e => (e.currentTarget.style.color = COLOR_TEXT_SECONDARY)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Legal Links */}
          <div style={{ flex: '0 0 auto' }}>
            <p className="text-xs font-bold mb-2" style={{ color: COLOR_TEXT_TERTIARY, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Legal
            </p>
            <div className="flex gap-4">
              {[
                { label: 'Privacy', href: '/privacy' },
                { label: 'Terms', href: '/terms' },
                { label: 'Security', href: '/security' },
              ].map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-xs hover:transition-colors whitespace-nowrap"
                  style={{
                    color: COLOR_TEXT_SECONDARY,
                    textDecoration: 'none',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = COLOR_ACCENT)}
                  onMouseLeave={e => (e.currentTarget.style.color = COLOR_TEXT_SECONDARY)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Right: Social & Tagline */}
          <div style={{ flex: '0 0 auto', textAlign: 'right' }}>
            <div className="flex items-center justify-end gap-4 mb-2">
              {[
                { label: '𝕏', href: 'https://twitter.com/forwardos' },
                { label: 'in', href: 'https://linkedin.com/company/forwardos' },
                { label: '⚙️', href: 'https://github.com/forwardos' },
              ].map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold hover:transition-colors"
                  style={{
                    color: COLOR_TEXT_TERTIARY,
                    textDecoration: 'none',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = COLOR_ACCENT)}
                  onMouseLeave={e => (e.currentTarget.style.color = COLOR_TEXT_SECONDARY)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <p className="text-xs font-semibold" style={{ color: COLOR_TEXT_TERTIARY }}>
              The M&A OS
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

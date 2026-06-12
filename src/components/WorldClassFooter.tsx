'use client'

import Link from 'next/link'
import { useLocale } from '@/context/LocaleContext'
import {
  Mail,
  MapPin,
  Phone,
  Globe,
  Sparkles,
  Share2,
  MessageCircle,
  Briefcase,
} from 'lucide-react'
import { COLOR_PRIMARY, COLOR_TEXT_SECONDARY, COLOR_BORDER, COLOR_ACCENT } from '@/styles/forward-colors'

export function WorldClassFooter() {
  const { locale, isRTL } = useLocale()

  const currentYear = new Date().getFullYear()

  const footerLinks = {
    product: [
      { label: 'Marketplace', href: '/marketplace' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'For Sellers', href: '/for-sellers' },
      { label: 'For Buyers', href: '/for-buyers' },
      { label: 'For Brokers', href: '/for-brokers' },
    ],
    company: [
      { label: 'About Us', href: '/about' },
      { label: 'Blog', href: '/blog' },
      { label: 'Careers', href: '/careers' },
      { label: 'Press', href: '/press' },
      { label: 'Contact', href: '/contact' },
    ],
    resources: [
      { label: 'Help Center', href: '/help' },
      { label: 'Documentation', href: '/docs' },
      { label: 'API Docs', href: '/api-docs' },
      { label: 'Community', href: '/community' },
      { label: 'Status', href: '/status' },
    ],
    legal: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Cookie Policy', href: '/cookies' },
      { label: 'Compliance', href: '/compliance' },
      { label: 'Security', href: '/security' },
    ],
  }

  const offices = [
    {
      region: 'North America',
      city: 'San Francisco, CA',
      address: '123 Innovation Drive, San Francisco, CA 94105',
      phone: '+1 (888) FORWARD-1',
      email: 'hello@forwardos.ai',
      timezone: 'PT (UTC-8)',
    },
    {
      region: 'Canada',
      city: 'Toronto, ON',
      address: '456 Innovation Lane, Toronto, ON M5V 3A8',
      phone: '+1 (888) FORWARD-1',
      email: 'hello-ca@forwardos.ai',
      timezone: 'ET (UTC-5)',
    },
    {
      region: 'Middle East',
      city: 'Dubai, UAE',
      address: 'Building A1, Dubai Digital Park, Dubai Silicon Oasis',
      phone: '+971-4-XXX-XXXX',
      email: 'hello-ae@forwardos.ai',
      timezone: 'GST (UTC+4)',
    },
  ]

  const socialLinks = [
    { icon: Share2, href: 'https://twitter.com/forwardos', label: 'Twitter' },
    { icon: Briefcase, href: 'https://linkedin.com/company/forwardos', label: 'LinkedIn' },
    { icon: MessageCircle, href: 'https://github.com/forwardos', label: 'GitHub' },
    { icon: Mail, href: 'mailto:hello@forwardos.ai', label: 'Email' },
  ]

  return (
    <footer
      className="border-t"
      style={{ borderColor: 'rgba(255,255,255,0.12)', background: '#0F1419' }}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Top Section — brand block + 4 link columns = 5 columns on one row
            (md+). The grid was md:grid-cols-4 but housed 5 children, so the
            last column (Legal) was wrapping under the others. */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-16 pb-12 border-b" style={{ borderColor: 'rgba(255,255,255,0.12)' }}>
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={28} style={{ color: '#B8956A' }} />
              <span className="text-xl font-black" style={{ color: 'white' }}>
                Forward Intelligence
              </span>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.6)' }} className="text-sm leading-relaxed">
              The M&A platform built for intelligent deals. AI-powered intelligence, institutional network, professional services.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-4 mt-6">
              {socialLinks.map((social, idx) => {
                const Icon = social.icon
                return (
                  <a
                    key={idx}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg border hover:bg-white/10 transition-colors"
                    style={{ borderColor: 'rgba(255,255,255,0.12)' }}
                    aria-label={social.label}
                  >
                    <Icon size={18} style={{ color: 'white' }} />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Link Sections */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4
                className="font-bold text-sm uppercase tracking-wide mb-4"
                style={{ color: 'white' }}
              >
                {category === 'product'
                  ? 'Product'
                  : category === 'company'
                    ? 'Company'
                    : category === 'resources'
                      ? 'Resources'
                      : 'Legal'}
              </h4>
              <ul className="space-y-3">
                {links.map((link, idx) => (
                  <li key={idx}>
                    <Link
                      href={link.href}
                      className="text-sm hover:opacity-75 transition-opacity"
                      style={{ color: 'rgba(255,255,255,0.6)' }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Office Locations */}
        <div className="mb-16 pb-12 border-b" style={{ borderColor: 'rgba(255,255,255,0.12)' }}>
          <h3 className="text-xl font-bold mb-8" style={{ color: 'white' }}>
            🌍 Global Offices
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {offices.map((office, idx) => (
              <div
                key={idx}
                className="p-6 rounded-xl border"
                style={{ borderColor: 'rgba(255,255,255,0.12)', background: 'white' }}
              >
                <h4 className="font-bold text-lg mb-3" style={{ color: 'white' }}>
                  {office.region}
                </h4>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-bold uppercase mb-1" style={{ color: 'rgba(255,255,255,0.6)' }}>
                      Location
                    </p>
                    <p style={{ color: 'white' }} className="text-sm font-semibold">
                      {office.city}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase mb-1" style={{ color: 'rgba(255,255,255,0.6)' }}>
                      Address
                    </p>
                    <p style={{ color: 'rgba(255,255,255,0.6)' }} className="text-sm">
                      {office.address}
                    </p>
                  </div>

                  <div className="pt-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.12)' }}>
                    <div className="flex items-center gap-2 mb-2">
                      <Phone size={14} style={{ color: '#B8956A' }} />
                      <a href={`tel:${office.phone}`} style={{ color: 'white' }} className="text-sm font-semibold hover:opacity-75">
                        {office.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <Mail size={14} style={{ color: '#B8956A' }} />
                      <a href={`mailto:${office.email}`} style={{ color: 'white' }} className="text-sm font-semibold hover:opacity-75">
                        {office.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe size={14} style={{ color: '#B8956A' }} />
                      <span style={{ color: 'rgba(255,255,255,0.6)' }} className="text-sm">
                        {office.timezone}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Terms & Conditions Section */}
        <div className="mb-12 pb-12 border-b" style={{ borderColor: 'rgba(255,255,255,0.12)' }}>
          <h3 className="text-xl font-bold mb-6" style={{ color: 'white' }}>
            📋 Terms & Conditions
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: 'User Agreement',
                desc: 'Our terms of service outline the rules and guidelines for using Forward Intelligence. By accessing our platform, you agree to comply with these terms.',
              },
              {
                title: 'Privacy & Data Protection',
                desc: 'We take your privacy seriously. Our privacy policy explains how we collect, use, and protect your personal information.',
              },
              {
                title: 'Seller Verification',
                desc: 'All sellers on Forward Intelligence undergo rigorous verification. We verify identity, financial statements, and legal standing.',
              },
              {
                title: 'Buyer Protection',
                desc: 'We provide comprehensive due diligence support, AI market intelligence, and professional services to protect buyer interests.',
              },
              {
                title: 'Payment & Billing',
                desc: 'Forward Intelligence processes payments securely through Stripe. We support multiple currencies and offer flexible billing options.',
              },
              {
                title: 'Dispute Resolution',
                desc: 'We have a clear dispute resolution process. Contact our support team for any issues or concerns.',
              },
            ].map((item, idx) => (
              <div key={idx} className="p-4 rounded-lg border" style={{ borderColor: 'rgba(255,255,255,0.12)', background: 'white' }}>
                <h4 className="font-bold text-sm mb-2" style={{ color: 'white' }}>
                  {item.title}
                </h4>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Security & Compliance */}
        <div className="mb-12 pb-12 border-b" style={{ borderColor: 'rgba(255,255,255,0.12)' }}>
          <h3 className="text-xl font-bold mb-6" style={{ color: 'white' }}>
            🔒 Security & Compliance
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: 'Bank-Level Security', desc: 'Enterprise-grade encryption, secure data centers, and continuous security monitoring.' },
              { title: 'GDPR Compliant', desc: 'Full compliance with General Data Protection Regulation and international data privacy laws.' },
              { title: 'SOC 2 Type II', desc: 'Independently audited and certified for security, availability, and confidentiality.' },
              { title: '24/7 Monitoring', desc: 'Continuous monitoring and threat detection to protect our platform and your data.' },
            ].map((item, idx) => (
              <div key={idx} className="p-4 rounded-lg" style={{ background: COLOR_ACCENT + '05', borderLeft: `4px solid ${COLOR_ACCENT}` }}>
                <h4 className="font-bold text-sm mb-1" style={{ color: 'white' }}>
                  {item.title}
                </h4>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div
        className="border-t py-8"
        style={{ borderColor: 'rgba(255,255,255,0.12)', background: COLOR_PRIMARY + '05' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p style={{ color: 'rgba(255,255,255,0.6)' }} className="text-sm">
              © {currentYear} Forward Intelligence. All rights reserved.
            </p>

            <div className="flex items-center gap-6 text-sm">
              <Link
                href="/privacy"
                className="hover:opacity-75 transition-opacity"
                style={{ color: 'rgba(255,255,255,0.6)' }}
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="hover:opacity-75 transition-opacity"
                style={{ color: 'rgba(255,255,255,0.6)' }}
              >
                Terms
              </Link>
              <Link
                href="/cookies"
                className="hover:opacity-75 transition-opacity"
                style={{ color: 'rgba(255,255,255,0.6)' }}
              >
                Cookies
              </Link>
              <Link
                href="/security"
                className="hover:opacity-75 transition-opacity"
                style={{ color: 'rgba(255,255,255,0.6)' }}
              >
                Security
              </Link>
            </div>

            <p style={{ color: 'rgba(255,255,255,0.6)' }} className="text-sm">
              Made with ❤️ for the M&A community
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

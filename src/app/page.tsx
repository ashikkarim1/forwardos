'use client'

import Link from 'next/link'
import { COLOR_PRIMARY, COLOR_ACCENT, COLOR_TEXT_SECONDARY, COLOR_BORDER } from '@/styles/forward-colors'

export const dynamic = 'force-dynamic'

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{ borderBottom: `1px solid ${COLOR_BORDER}`, padding: '20px', background: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: COLOR_PRIMARY }}>Forward OS</div>
          <nav style={{ display: 'flex', gap: '20px' }}>
            <Link href="/marketplace" style={{ color: COLOR_PRIMARY, textDecoration: 'none' }}>Marketplace</Link>
            <Link href="/deals" style={{ color: COLOR_PRIMARY, textDecoration: 'none' }}>Deals</Link>
            <Link href="/help" style={{ color: COLOR_PRIMARY, textDecoration: 'none' }}>Help</Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <main style={{ flex: 1, padding: '80px 20px', textAlign: 'center', background: 'white' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '20px', color: COLOR_PRIMARY }}>
            M&A Intelligence Platform
          </h1>
          <p style={{ fontSize: '20px', color: COLOR_TEXT_SECONDARY, marginBottom: '40px' }}>
            Real-time deal intelligence, heat maps, and predictive M&A analysis for the modern investor.
          </p>

          {/* CTA Buttons */}
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginBottom: '60px' }}>
            <Link
              href="/marketplace"
              style={{
                padding: '15px 40px',
                background: COLOR_ACCENT,
                color: 'white',
                textDecoration: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                fontSize: '16px',
              }}
            >
              Browse Marketplace
            </Link>
            <Link
              href="/deals"
              style={{
                padding: '15px 40px',
                border: `2px solid ${COLOR_ACCENT}`,
                color: COLOR_ACCENT,
                textDecoration: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                fontSize: '16px',
                background: 'white',
              }}
            >
              View Deals
            </Link>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', marginTop: '60px', paddingTop: '60px', borderTop: `1px solid ${COLOR_BORDER}` }}>
            <div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: COLOR_ACCENT }}>29</div>
              <div style={{ color: COLOR_TEXT_SECONDARY }}>Businesses Listed</div>
            </div>
            <div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: COLOR_ACCENT }}>$10.5B</div>
              <div style={{ color: COLOR_TEXT_SECONDARY }}>Total Valuation</div>
            </div>
            <div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: COLOR_ACCENT }}>12</div>
              <div style={{ color: COLOR_TEXT_SECONDARY }}>Industries</div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ borderTop: `1px solid ${COLOR_BORDER}`, padding: '40px 20px', background: 'white', textAlign: 'center' }}>
        <p style={{ color: COLOR_TEXT_SECONDARY }}>© 2026 Forward OS. The M&A operating system.</p>
      </footer>
    </div>
  )
}

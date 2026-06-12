'use client'

import { useState } from 'react'

export default function TestDashboard() {
  const [count, setCount] = useState(0)

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ color: '#1A1A1A' }}>Test Dashboard (No AppShell)</h1>
      <p style={{ color: '#717171' }}>Testing dashboard without AppShell wrapper</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginTop: '30px' }}>
        {[
          { label: 'Watchlist', value: 0 },
          { label: 'Opportunities', value: 0 },
          { label: 'Avg Match Score', value: '0%' },
          { label: 'Pipeline Value', value: '$0B' }
        ].map((metric) => (
          <div key={metric.label} style={{
            padding: '20px',
            border: '1px solid #E5E7EB',
            borderRadius: '16px',
            background: '#FFFFFF'
          }}>
            <p style={{ color: '#717171', fontSize: '12px', marginBottom: '8px' }}>{metric.label}</p>
            <p style={{ color: '#B8956A', fontSize: '28px', fontWeight: 'bold', margin: '0' }}>{metric.value}</p>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '30px' }}>
        <button 
          onClick={() => setCount(count + 1)}
          style={{
            padding: '12px 24px',
            borderRadius: '8px',
            background: '#B8956A',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
        >
          Test Button (Clicked: {count})
        </button>
      </div>
    </div>
  )
}

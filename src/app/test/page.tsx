'use client'

export default function TestPage() {
  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <h1>✅ Forward OS Test Page</h1>
      <p style={{ color: '#717171' }}>If you can see this, the basic page rendering is working.</p>
      <div style={{
        padding: '20px',
        borderRadius: '8px',
        background: '#FFF7F3',
        border: '1px solid #E5E7EB',
        marginTop: '20px'
      }}>
        <h2 style={{ color: '#B8956A' }}>Orange Theme Test</h2>
        <p>Orange color: <span style={{ color: '#B8956A', fontWeight: 'bold' }}>#B8956A</span></p>
        <button style={{
          padding: '10px 20px',
          borderRadius: '8px',
          background: '#B8956A',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          marginTop: '10px'
        }}>
          Click Me
        </button>
      </div>
    </div>
  )
}

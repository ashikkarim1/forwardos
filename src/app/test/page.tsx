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
        border: '1px solid #E5E4E0',
        marginTop: '20px'
      }}>
        <h2 style={{ color: '#FF8C00' }}>Orange Theme Test</h2>
        <p>Orange color: <span style={{ color: '#FF8C00', fontWeight: 'bold' }}>#FF8C00</span></p>
        <button style={{
          padding: '10px 20px',
          borderRadius: '8px',
          background: '#FF8C00',
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

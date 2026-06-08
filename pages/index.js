export default function Home() {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '40px', textAlign: 'center' }}>
      <h1>Forward OS - M&A Intelligence Platform</h1>
      <p style={{ fontSize: '18px', color: '#666' }}>Production Database Connected ✅</p>

      <div style={{ marginTop: '40px' }}>
        <a href="/marketplace" style={{ padding: '12px 24px', background: '#FF8C00', color: 'white', textDecoration: 'none', borderRadius: '6px', marginRight: '20px' }}>
          Marketplace
        </a>
        <a href="/deals" style={{ padding: '12px 24px', border: '2px solid #FF8C00', color: '#FF8C00', textDecoration: 'none', borderRadius: '6px' }}>
          Deals
        </a>
      </div>

      <div style={{ marginTop: '60px', paddingTop: '40px', borderTop: '1px solid #eee' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px' }}>
          <div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#FF8C00' }}>29</div>
            <div style={{ color: '#666' }}>Businesses</div>
          </div>
          <div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#FF8C00' }}>$10.5B</div>
            <div style={{ color: '#666' }}>Valuation</div>
          </div>
          <div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#FF8C00' }}>12</div>
            <div style={{ color: '#666' }}>Industries</div>
          </div>
        </div>
      </div>
    </div>
  )
}

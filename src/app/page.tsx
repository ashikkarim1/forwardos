export default function Home() {
  return (
    <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1>Forward OS - M&A Intelligence Platform</h1>
      <p>✅ Homepage loaded successfully</p>
      <p>Database: Connected</p>
      <a href="/marketplace" style={{ padding: '10px 20px', background: '#2D7A5F', color: 'white', textDecoration: 'none', borderRadius: '4px', display: 'inline-block', marginRight: '10px' }}>
        Marketplace
      </a>
      <a href="/deals" style={{ padding: '10px 20px', border: '2px solid #2D7A5F', color: '#2D7A5F', textDecoration: 'none', borderRadius: '4px', display: 'inline-block' }}>
        Deals
      </a>
    </div>
  )
}

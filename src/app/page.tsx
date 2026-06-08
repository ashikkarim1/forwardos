import Link from 'next/link'

export default function Home() {
  return (
    <div style={{ padding: '60px 20px', textAlign: 'center', fontFamily: 'sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>Forward OS</h1>
      <h2 style={{ fontSize: '32px', color: '#666', marginBottom: '40px' }}>M&A Intelligence Platform</h2>
      
      <p style={{ fontSize: '18px', color: '#666', marginBottom: '40px' }}>
        ✅ Platform is live and running
      </p>

      <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginBottom: '60px', flexWrap: 'wrap' }}>
        <Link href="/marketplace" style={{ padding: '15px 40px', background: '#2D7A5F', color: 'white', textDecoration: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px' }}>
          Marketplace
        </Link>
        <Link href="/deals" style={{ padding: '15px 40px', border: '2px solid #2D7A5F', color: '#2D7A5F', textDecoration: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px' }}>
          Deals
        </Link>
        <Link href="/dashboard" style={{ padding: '15px 40px', border: '2px solid #666', color: '#666', textDecoration: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px' }}>
          Dashboard
        </Link>
      </div>

      <div style={{ background: '#f5f5f5', padding: '30px', borderRadius: '12px', marginTop: '40px' }}>
        <h3 style={{ marginBottom: '20px' }}>Quick Links</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', textAlign: 'left' }}>
          <div>
            <Link href="/help" style={{ color: '#2D7A5F', textDecoration: 'none', fontWeight: 'bold' }}>Help Center</Link>
          </div>
          <div>
            <Link href="/pricing" style={{ color: '#2D7A5F', textDecoration: 'none', fontWeight: 'bold' }}>Pricing</Link>
          </div>
          <div>
            <Link href="/auth/signin" style={{ color: '#2D7A5F', textDecoration: 'none', fontWeight: 'bold' }}>Sign In</Link>
          </div>
          <div>
            <Link href="/auth/signup" style={{ color: '#2D7A5F', textDecoration: 'none', fontWeight: 'bold' }}>Sign Up</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

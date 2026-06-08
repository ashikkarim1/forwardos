'use client';

import Link from 'next/link';

const PRIMARY_GREEN = '#2D7A5F';
const TEXT_PRIMARY = '#1A1A1A';
const TEXT_SECONDARY = '#7a7a7a';
const BACKGROUND = '#F7F6F4';

export default function HomePage() {
  // Feature data
  const features = [
    { icon: '🔐', title: 'Verified Trust Layer', desc: 'Reputation graph shows who can close' },
    { icon: '🤖', title: 'AI Deal Room OS', desc: 'Centralized diligence and task tracking' },
    { icon: '🎯', title: 'Counterparty Matching', desc: 'AI finds your best buyer or seller' },
    { icon: '📊', title: 'Negotiation Intelligence', desc: 'Market benchmarks and optimal structures' },
    { icon: '💰', title: 'Financing Marketplace', desc: 'Connect to lenders and model capital' },
    { icon: '🔮', title: 'Outcome Prediction', desc: 'AI predicts close probability' },
    { icon: '📈', title: 'Market Intelligence', desc: 'Real-time sector heatmaps and trends' },
    { icon: '⚡', title: 'Execution Automation', desc: 'Automated workflows and compliance' },
    { icon: '🛡️', title: 'Enterprise Security', desc: 'SOC 2 Type II and ISO 27001' },
  ];

  const workflow = [
    { step: '1', name: 'Deal Discovery', icon: '🔍' },
    { step: '2', name: 'Verification', icon: '✅' },
    { step: '3', name: 'Negotiation', icon: '🤝' },
    { step: '4', name: 'Diligence', icon: '📑' },
    { step: '5', name: 'Financing', icon: '💳' },
    { step: '6', name: 'Documentation', icon: '✍️' },
    { step: '7', name: 'Closing', icon: '🎉' },
    { step: '8', name: 'Integration', icon: '🔄' },
  ];

  return (
    <div style={{ background: '#ffffff' }}>
      {/* HERO SECTION */}
      <section style={{ background: '#ffffff', padding: '80px 24px', borderBottom: '1px solid rgba(26,26,26,0.06)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ marginBottom: '24px' }}>
            <span style={{
              display: 'inline-block',
              padding: '8px 16px',
              background: '#EBF5FF',
              color: PRIMARY_GREEN,
              borderRadius: '20px',
              fontSize: '13px',
              fontWeight: '600',
            }}>
              🚀 The AI Operating System for Corporate Transactions
            </span>
          </div>

          <h1 style={{
            fontSize: '56px',
            fontWeight: '700',
            color: TEXT_PRIMARY,
            margin: '0 0 20px 0',
            lineHeight: '1.2',
            letterSpacing: '-0.02em',
          }}>
            The Operating System<br />for M&A, Financing & Strategic Outcomes
          </h1>

          <p style={{
            fontSize: '20px',
            color: TEXT_SECONDARY,
            margin: '0 0 40px 0',
            lineHeight: '1.6',
            maxWidth: '700px',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}>
            Forward is where deals are discovered, trust is established, documents are exchanged, financing is arranged, and transactions close.
          </p>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '60px', flexWrap: 'wrap' }}>
            <Link href="/auth/signin" style={{
              padding: '16px 32px',
              background: PRIMARY_GREEN,
              color: '#ffffff',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '16px',
              fontWeight: '600',
            }}>
              Start Your Transaction
            </Link>
            <a href="#features" style={{
              padding: '16px 32px',
              background: '#F3F4F6',
              color: PRIMARY_GREEN,
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '16px',
              fontWeight: '600',
            }}>
              Learn How It Works
            </a>
          </div>

          {/* Trust Badges */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            padding: '40px',
            background: '#F9FAFB',
            borderRadius: '12px',
          }}>
            <div>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>🔒</div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: TEXT_PRIMARY }}>Enterprise Security</div>
              <div style={{ fontSize: '12px', color: TEXT_SECONDARY }}>SOC 2, ISO 27001, encryption</div>
            </div>
            <div>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>⭐</div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: TEXT_PRIMARY }}>Trust Verified</div>
              <div style={{ fontSize: '12px', color: TEXT_SECONDARY }}>Reputation graph on every deal</div>
            </div>
            <div>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>🤖</div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: TEXT_PRIMARY }}>AI-Powered</div>
              <div style={{ fontSize: '12px', color: TEXT_SECONDARY }}>Outcome prediction & matching</div>
            </div>
          </div>
        </div>
      </section>

      {/* VALUE PROPOSITIONS BY ROLE */}
      <section style={{ padding: '80px 24px', background: BACKGROUND }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '40px', fontWeight: '700', color: TEXT_PRIMARY, margin: '0 0 16px 0' }}>
              Purpose-Built for Every Role
            </h2>
            <p style={{ fontSize: '18px', color: TEXT_SECONDARY, margin: '0' }}>
              Designed for how deals actually work.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {[
              { emoji: '🎯', role: 'Buyers', items: ['Find matched deals', 'Know who can close', 'Predict your odds', 'Run diligence', 'Finance your deals'] },
              { emoji: '📈', role: 'Sellers', items: ['Reach serious buyers', 'Maintain confidentiality', 'Understand valuation', 'Track buyer interest', 'Control the process'] },
              { emoji: '💼', role: 'Brokers', items: ['Manage your pipeline', 'Match buyers & sellers', 'Track commissions', 'Build reputation', 'Find financing'] },
            ].map((card, i) => (
              <div key={i} style={{
                padding: '40px',
                background: '#ffffff',
                border: '1px solid rgba(26,26,26,0.06)',
                borderRadius: '12px',
                borderTop: `4px solid ${PRIMARY_GREEN}`,
              }}>
                <div style={{ fontSize: '32px', marginBottom: '16px' }}>{card.emoji}</div>
                <h3 style={{ fontSize: '20px', fontWeight: '700', color: TEXT_PRIMARY, margin: '0 0 16px 0' }}>
                  For {card.role}
                </h3>
                <ul style={{ margin: '0', padding: '0', listStyle: 'none', fontSize: '14px', color: TEXT_SECONDARY, lineHeight: '1.8' }}>
                  {card.items.map((item, j) => (
                    <li key={j}>✓ {item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES THAT MATTER */}
      <section id="features" style={{ padding: '80px 24px', background: '#ffffff' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '40px', fontWeight: '700', color: TEXT_PRIMARY, margin: '0 0 16px 0' }}>
              The Capabilities That Close Deals
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {features.map((feature, i) => (
              <div key={i} style={{
                padding: '24px',
                background: '#F9FAFB',
                border: '1px solid rgba(26,26,26,0.06)',
                borderRadius: '12px',
              }}>
                <div style={{ fontSize: '28px', marginBottom: '12px' }}>{feature.icon}</div>
                <h4 style={{ fontSize: '15px', fontWeight: '700', color: TEXT_PRIMARY, margin: '0 0 8px 0' }}>
                  {feature.title}
                </h4>
                <p style={{ fontSize: '13px', color: TEXT_SECONDARY, margin: '0', lineHeight: '1.6' }}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WORKFLOW SECTION */}
      <section style={{ padding: '80px 24px', background: BACKGROUND }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '40px', fontWeight: '700', color: TEXT_PRIMARY, margin: '0 0 16px 0' }}>
              The Complete Transaction Workflow
            </h2>
            <p style={{ fontSize: '18px', color: TEXT_SECONDARY, margin: '0' }}>
              From discovery to closing to integration.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            {workflow.map((item, i) => (
              <div key={i} style={{
                padding: '20px',
                background: '#ffffff',
                border: '1px solid rgba(26,26,26,0.06)',
                borderRadius: '8px',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '28px', marginBottom: '8px' }}>{item.icon}</div>
                <div style={{ fontSize: '11px', fontWeight: '700', color: PRIMARY_GREEN, marginBottom: '4px' }}>
                  STEP {item.step}
                </div>
                <h4 style={{ fontSize: '14px', fontWeight: '700', color: TEXT_PRIMARY, margin: '0' }}>
                  {item.name}
                </h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section style={{ padding: '80px 24px', background: PRIMARY_GREEN, color: '#ffffff', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '40px', fontWeight: '700', margin: '0 0 20px 0' }}>
            Ready to Transform How You Close Deals?
          </h2>
          <p style={{ fontSize: '18px', margin: '0 0 40px 0', opacity: 0.95 }}>
            Join buyers, sellers, brokers, and investors who are using Forward to close bigger deals, faster.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/auth/signin" style={{
              padding: '16px 32px',
              background: '#ffffff',
              color: PRIMARY_GREEN,
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '16px',
              fontWeight: '600',
            }}>
              Start Your Transaction
            </Link>
            <a href="mailto:hello@forward.com" style={{
              padding: '16px 32px',
              background: 'rgba(255,255,255,0.2)',
              color: '#ffffff',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '16px',
              fontWeight: '600',
              border: '2px solid #ffffff',
            }}>
              Schedule Demo
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <section style={{ padding: '40px 24px', background: '#ffffff', borderTop: '1px solid rgba(26,26,26,0.06)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: '12px', color: TEXT_SECONDARY, margin: '0' }}>
            © 2026 Forward Intelligence. Enterprise-grade security. Built for scale. Designed for outcomes.
          </p>
        </div>
      </section>
    </div>
  );
}

'use client'

import Link from 'next/link'

const PRIMARY_GREEN = '#2D7A5F'
const TEXT_PRIMARY = '#1A1A1A'
const TEXT_SECONDARY = '#7a7a7a'
const BACKGROUND = '#F7F6F4'

export default function HomePage() {
  const features = [
    { icon: '🔐', title: 'Verified Trust Layer', desc: 'Reputation graph shows who can close, who wastes time, who leaks info' },
    { icon: '🤖', title: 'AI Deal Room OS', desc: 'Centralized diligence, Q&A, task tracking, document intelligence in one place' },
    { icon: '🎯', title: 'Counterparty Matching', desc: 'AI finds your best buyer or seller based on strategic fit + acquisition history' },
    { icon: '📊', title: 'Negotiation Intelligence', desc: 'Market benchmarks, optimal structures, walk-away points, close probability' },
    { icon: '💰', title: 'Financing Marketplace', desc: 'Connect to lenders, model capital stacks, DSCR, debt capacity' },
    { icon: '🔮', title: 'Outcome Prediction', desc: 'AI predicts close probability, integration risk, synergy realization' },
    { icon: '📈', title: 'Market Intelligence', desc: 'Sector heatmaps, valuation trends, timing recommendations, buyer appetite' },
    { icon: '⚡', title: 'Execution Automation', desc: 'Automated workflows, compliance checks, filing alerts, integration tracking' },
    { icon: '🛡️', title: 'Enterprise Security', desc: 'SOC 2 Type II, ISO 27001, end-to-end encryption, audit logs' },
  ]

  const workflow = [
    { step: '1', name: 'Deal Discovery', desc: 'Find matches', icon: '🔍' },
    { step: '2', name: 'Verification', desc: 'Trust & capital checks', icon: '✅' },
    { step: '3', name: 'Negotiation', desc: 'AI-guided terms', icon: '🤝' },
    { step: '4', name: 'Diligence', desc: 'AI document analysis', icon: '📑' },
    { step: '5', name: 'Financing', desc: 'Capital marketplace', icon: '💳' },
    { step: '6', name: 'Documentation', desc: 'Secure signatures', icon: '✍️' },
    { step: '7', name: 'Closing', desc: 'Real-time tracking', icon: '🎉' },
    { step: '8', name: 'Integration', desc: 'Synergy tracking', icon: '🔄' },
  ]

  const gaps = [
    { gap: 'Trust Architecture', old: 'No verification', new: '✓ Reputation graph on every participant' },
    { gap: 'Counterparty Intelligence', old: 'Manual research', new: '✓ AI finds your ideal buyer/seller' },
    { gap: 'Deal Room OS', old: 'Fragmented tools', new: '✓ Unified diligence + Q&A + tasks' },
    { gap: 'Negotiation Support', old: 'Blind negotiation', new: '✓ AI benchmarks + optimal structures' },
    { gap: 'Financing Integration', old: 'Separate platforms', new: '✓ Integrated lender marketplace' },
    { gap: 'Market Intelligence', old: 'Outdated reports', new: '✓ Real-time sector heatmaps + trends' },
    { gap: 'Close Probability', old: 'Guesswork', new: '✓ AI predicts outcome odds' },
    { gap: 'Post-Close Integration', old: 'Deal tracking ends', new: '✓ Synergy forecasting + tracking' },
    { gap: 'Advisor Orchestration', old: 'Email chains', new: '✓ Centralized advisor coordination' },
    { gap: 'Regulatory Compliance', old: 'Manual checklists', new: '✓ Automated compliance workflows' },
    { gap: 'Data Security', old: 'Basic encryption', new: '✓ SOC 2 Type II + ISO 27001' },
    { gap: 'Outcome Flywheel', old: 'No feedback loop', new: '✓ Every deal improves the model' },
  ]

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
            Forward is where deals are discovered, trust is established, documents are exchanged, financing is arranged, and transactions close. Not a marketplace. A transaction OS.
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
            <a href="#why-forward" style={{
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

      {/* VALUE PROPOSITIONS */}
      <section id="why-forward" style={{ padding: '80px 24px', background: BACKGROUND }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '40px', fontWeight: '700', color: TEXT_PRIMARY, margin: '0 0 16px 0' }}>
              Purpose-Built for Every Role
            </h2>
            <p style={{ fontSize: '18px', color: TEXT_SECONDARY, margin: '0' }}>
              No compromises. No one-size-fits-all. Designed for how deals actually work.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {[
              { emoji: '🎯', role: 'Buyers', items: ['Find matched deals', 'Know who can close', 'Predict your odds', 'Run diligence', 'Finance your deals'] },
              { emoji: '📈', role: 'Sellers', items: ['Reach serious buyers', 'Maintain confidentiality', 'Understand valuation', 'Track buyer interest', 'Control the process'] },
              { emoji: '💼', role: 'Brokers', items: ['Manage your pipeline', 'Match buyers & sellers', 'Track commissions', 'Build reputation', 'Find financing'] },
              { emoji: '💰', role: 'PE Firms', items: ['Source deals at scale', 'Understand probability', 'Run diligence', 'Manage portfolio', 'Track IRR impact'] },
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

      {/* FEATURES */}
      <section style={{ padding: '80px 24px', background: '#ffffff' }}>
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

      {/* WORKFLOW */}
      <section style={{ padding: '80px 24px', background: BACKGROUND }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '40px', fontWeight: '700', color: TEXT_PRIMARY, margin: '0 0 16px 0' }}>
              The Complete Transaction Workflow
            </h2>
            <p style={{ fontSize: '18px', color: TEXT_SECONDARY, margin: '0' }}>
              From discovery to closing to integration. One unified operating system.
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
                <h4 style={{ fontSize: '14px', fontWeight: '700', color: TEXT_PRIMARY, margin: '0 0 4px 0' }}>
                  {item.name}
                </h4>
                <p style={{ fontSize: '12px', color: TEXT_SECONDARY, margin: '0' }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GAPS SOLVED */}
      <section style={{ padding: '80px 24px', background: '#ffffff' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '40px', fontWeight: '700', color: TEXT_PRIMARY, margin: '0 0 16px 0' }}>
              The 12 Gaps We Solve
            </h2>
            <p style={{ fontSize: '18px', color: TEXT_SECONDARY, margin: '0', maxWidth: '700px', marginLeft: 'auto', marginRight: 'auto' }}>
              Traditional platforms leave critical gaps. Forward fills them all.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {gaps.map((item, i) => (
              <div key={i} style={{
                padding: '24px',
                background: '#F9FAFB',
                border: '1px solid rgba(26,26,26,0.06)',
                borderRadius: '12px',
              }}>
                <div style={{ fontSize: '12px', fontWeight: '700', color: PRIMARY_GREEN, textTransform: 'uppercase', marginBottom: '8px' }}>
                  {item.gap}
                </div>
                <div style={{ fontSize: '13px', color: '#C84B31', marginBottom: '8px' }}>
                  ✗ {item.old}
                </div>
                <div style={{ fontSize: '13px', color: PRIMARY_GREEN, fontWeight: '600' }}>
                  {item.new}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 24px', background: PRIMARY_GREEN, color: '#ffffff', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '40px', fontWeight: '700', margin: '0 0 20px 0' }}>
            Ready to Transform How You Close Deals?
          </h2>
          <p style={{ fontSize: '18px', margin: '0 0 40px 0', opacity: 0.95, lineHeight: '1.6' }}>
            Join buyers, sellers, brokers, and investors who are using Forward to close bigger deals, faster, with better outcomes.
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
  )
}

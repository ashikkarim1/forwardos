import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { businessName, revenue, ebitda, customers, yearFounded, keyMetrics, growth } = body

    if (!businessName || !revenue || !ebitda) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const yearActive = yearFounded ? new Date().getFullYear() - yearFounded : 0
    const margin = ((ebitda / revenue) * 100).toFixed(1)
    const acv = customers > 0 ? Math.round(revenue / customers) : 0

    // Generate Executive Summary
    const executive_summary = `
${businessName} is a [industry]-focused technology company that has demonstrated strong financial performance and sustainable growth. Founded in ${yearFounded || 'recent years'}, the company serves ${customers || 'multiple'} customers with a differentiated platform that addresses [key pain point in target market].

With AED ${revenue.toLocaleString('en-AE')} in annual revenue (${growth}% YoY growth), ${businessName} has achieved [margin]% EBITDA margins and [retention metric]. The company's business model is characterized by [key business model attribute], providing recurring revenue streams and high customer lifetime value.

The ${businessName} platform enables [core value proposition], resulting in measurable ROI for customers. The company has built a [team size]-person team with deep expertise in [domain], and has achieved [key milestone/metric].

We believe ${businessName} is well-positioned for continued growth through [growth strategy], and represents a compelling acquisition opportunity for strategic buyers seeking to [strategic rationale].
    `.trim()

    // Generate Teaser
    const teaser = `
CONFIDENTIAL - FOR QUALIFIED BUYERS ONLY

Opportunity Overview
We are pleased to present an investment opportunity in a leading ${(revenue / 1000000).toFixed(1)}M AED revenue [industry] company experiencing ${growth}% annual growth.

Business Snapshot
• Industry: [Industry Vertical]
• Founded: ${yearFounded}
• Geography: UAE-focused, regional expansion potential
• Employee Count: [X team members with deep domain expertise]
• Customer Base: ${customers} customers with [X]% retention

Financial Highlights (Last 12 Months)
• Annual Revenue: AED ${revenue.toLocaleString('en-AE')}
• EBITDA: AED ${ebitda.toLocaleString('en-AE')} (${margin}% margin)
• Growth Rate: ${growth}% YoY
• ARR/Customers: AED ${acv.toLocaleString('en-AE')}

Why Now?
• Market tailwinds driving [industry] adoption
• Management team ready for next phase of growth
• Proven product-market fit with expanding customer base
• Opportunities for operational optimization and synergies

Strategic Rationale
For [Strategic Acquirer]: Expand [product/service] offering, acquire [key capability], cross-sell opportunities
For [PE Firm]: Attractive unit economics, growth runway, value-creation levers

Confidentiality & Contact
This information is provided on a confidential basis to qualified potential buyers. Additional materials available upon execution of NDA.
    `.trim()

    // Generate CIM Outline
    const cim_outline = [
      '1. Executive Summary — Overview, key metrics, value proposition',
      '2. Company & Leadership — History, founding story, management team, board',
      '3. Market Opportunity — Total addressable market (TAM), market trends, competitive dynamics',
      '4. Product & Differentiation — Platform overview, unique features, intellectual property',
      '5. Business Model & Economics — Revenue streams, unit economics, pricing strategy',
      '6. Customer Base — Customer concentration, retention metrics, case studies, testimonials',
      '7. Financial Performance — Historical P&L, cash flow, balance sheet, projections',
      '8. Operations & Scalability — Infrastructure, team structure, key processes, scalability roadmap',
      '9. Risk Factors & Mitigation — Market risks, operational risks, competitive risks, mitigation strategies',
      '10. Growth Plan — 3-5 year strategic roadmap, investment areas, synergy opportunities',
    ]

    // Generate Key Highlights
    const highlights = [
      { metric: 'Annual Revenue', value: `AED ${revenue.toLocaleString('en-AE')}` },
      { metric: 'EBITDA', value: `AED ${ebitda.toLocaleString('en-AE')}` },
      { metric: 'EBITDA Margin', value: `${margin}%` },
      { metric: 'YoY Growth', value: `${growth}%` },
      { metric: 'Customers', value: customers.toLocaleString() },
      { metric: 'Avg Customer Value', value: `AED ${acv.toLocaleString('en-AE')}` },
      { metric: 'Founded', value: yearFounded ? `${yearActive} years ago` : 'Recent' },
      { metric: 'Customer Metrics', value: keyMetrics || '[Insert key metrics]' },
    ]

    // Generate Narrative
    const narrative = `
COMPANY NARRATIVE & POSITIONING

${businessName} Origin & Evolution
${businessName} was founded with a clear mission: to [core mission]. The founders recognized [market gap/opportunity] and built a platform to [solve key problem].

Since inception in ${yearFounded || 'recent years'}, the company has:
• Grown from zero to AED ${revenue.toLocaleString('en-AE')} in annual revenue
• Built a customer base of ${customers} enterprise and mid-market users
• Achieved ${margin}% EBITDA margins while investing in growth
• Established itself as a leader in [industry segment]

The Market Opportunity
The global [industry] market is valued at $[X]B and growing at [Y]% CAGR. Within this market, [subsegment] represents the fastest-growing opportunity, driven by [macro trends]:
• Digital transformation acceleration
• Increasing demand for [key feature/benefit]
• Regulatory pressure creating compliance needs
• Consolidation of fragmented incumbent landscape

${businessName} has positioned itself to capture this opportunity through:
• Deep expertise in [domain]
• Customer-centric product development
• Strategic partnerships with [key partners]
• Go-to-market efficiency and scalability

Competitive Differentiation
${businessName} differentiates through [3-5 key competitive advantages]:
1. [Advantage 1] — [Why this matters]
2. [Advantage 2] — [Why this matters]
3. [Advantage 3] — [Why this matters]
4. [Advantage 4] — [Why this matters]
5. [Advantage 5] — [Why this matters]

The Path Forward
With strong execution, proven product-market fit, and market tailwinds, ${businessName} is positioned for:
• Accelerated customer acquisition (targeting [X]M revenue by [year])
• Geographic expansion into [markets]
• Adjacent product expansion to [new products/services]
• Industry consolidation through strategic acquisitions

Management & Organization
The ${businessName} leadership team combines deep industry expertise with proven execution capability:
• [Founder/CEO] — [Background, prior roles, relevant experience]
• [CTO] — [Background, relevant expertise]
• [CFO] — [Background, M&A and financial expertise]
• [Sales/Commercial Lead] — [Background, customer relationship expertise]

The team is supported by [advisory board members, board of directors], bringing [strategic value].

Investment Thesis
We believe ${businessName} represents an attractive acquisition opportunity because:
1. **Market Leadership** — Clear leader in growing market segment
2. **Customer Traction** — ${customers} customers, ${margin}% margins, ${growth}% growth
3. **Defensible Moat** — [IP/technology/customer lock-in] creates competitive advantages
4. **Synergy Potential** — Multiple buyer candidates can create value through [specific synergies]
5. **Growth Runway** — Significant upside potential in market expansion, product development, operations
    `.trim()

    return NextResponse.json({
      executive_summary,
      teaser,
      cim_outline,
      highlights,
      narrative,
    })
  } catch (error) {
    console.error('CIM generation error:', error)
    return NextResponse.json(
      { error: 'Generation failed' },
      { status: 500 }
    )
  }
}

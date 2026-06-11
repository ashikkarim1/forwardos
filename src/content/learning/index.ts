/**
 * Learning Center content — buyer/seller guides + glossary.
 *
 * Content-as-data (no DB). Bodies are lightweight markdown-ish paragraphs the
 * article page renders. Coverage intentionally includes UAE/Canada financing
 * specifics (CSBFP, BDC, Murabaha, Ijara) that BizBuySell's US-centric resource
 * center omits.
 */

export type ArticleCategory = 'Buying' | 'Selling' | 'Financing' | 'Valuation' | 'Legal & Deal-Making'

export interface Article {
  slug: string
  title: string
  category: ArticleCategory
  region?: 'CANADA' | 'UAE' | 'BOTH'
  readMinutes: number
  excerpt: string
  body: string[] // paragraphs / headers (lines starting with "## " render as headings)
}

export const ARTICLES: Article[] = [
  {
    slug: 'how-to-buy-a-business',
    title: 'How to Buy a Business: A Step-by-Step Guide',
    category: 'Buying',
    region: 'BOTH',
    readMinutes: 8,
    excerpt: 'From defining acquisition criteria to closing — the full buyer journey for the UAE and Canadian markets.',
    body: [
      '## 1. Define your acquisition criteria',
      'Decide on industry, location, deal size, and the cash flow you need. Save your criteria as a search on ForwardOS to get alerted the moment a matching business lists.',
      '## 2. Get pre-qualified for financing',
      'Knowing your budget up front makes you a credible buyer. In Canada, explore CSBFP and BDC acquisition loans; in the UAE, SME and Sharia-compliant facilities. Use the Finance Center calculator to size your monthly payment.',
      '## 3. Review listings and request information',
      'Shortlist businesses, sign NDAs, and request the data room. Look for clean financials, customer concentration, and the reason for sale.',
      '## 4. Make an offer (LOI)',
      'A Letter of Intent sets price and key terms and opens exclusivity for due diligence. It is usually non-binding except for confidentiality and exclusivity clauses.',
      '## 5. Due diligence',
      'Verify financials, contracts, licences, and liabilities. Engage an accountant and lawyer. This is where financing is finalised.',
      '## 6. Close',
      'Sign the purchase agreement, fund the deal, and transfer licences and ownership. Plan a transition period with the seller.',
    ],
  },
  {
    slug: 'how-to-sell-your-business',
    title: 'How to Sell Your Business for Maximum Value',
    category: 'Selling',
    region: 'BOTH',
    readMinutes: 7,
    excerpt: 'Preparation, pricing, and presentation strategies that drive more qualified buyers and higher offers.',
    body: [
      '## Get your house in order',
      'Clean, three-year financials and documented processes build buyer confidence. The more complete your ForwardOS listing, the more inquiries you attract — completeness correlates directly with buyer interest.',
      '## Price with evidence',
      'Use comparable sales and a defensible multiple. Overpricing lengthens days-on-market; underpricing leaves money on the table. See the Market Insights report for current regional multiples.',
      '## Present professionally',
      'Strong photos, a clear growth story, and an honest risk section. Consider a verified listing to signal legitimacy.',
      '## Qualify buyers',
      'Prioritise financed, serious buyers. ForwardOS scores buyer seriousness so you spend time on the right conversations.',
    ],
  },
  {
    slug: 'financing-a-business-acquisition-canada',
    title: 'Financing a Business Acquisition in Canada (CSBFP & BDC)',
    category: 'Financing',
    region: 'CANADA',
    readMinutes: 6,
    excerpt: 'How the Canada Small Business Financing Program and BDC acquisition loans work — and how to qualify.',
    body: [
      '## Canada Small Business Financing Program (CSBFP)',
      'A government-backed program delivered through major banks (RBC, BMO, Scotiabank, TD, CIBC). It shares risk with the lender, helping fund equipment, property, and business purchases up to $1.15M.',
      '## BDC acquisition financing',
      'The Business Development Bank of Canada offers dedicated acquisition and transition loans with flexible repayment and no penalty for early repayment — useful for cash-flowing businesses.',
      '## What lenders look for',
      'A debt-service coverage ratio of 1.25× or higher, a reasonable down payment (often 20-30%), and a credible transition plan. Model yours in the Finance Center calculator.',
    ],
  },
  {
    slug: 'islamic-financing-business-uae',
    title: 'Sharia-Compliant Business Financing in the UAE',
    category: 'Financing',
    region: 'UAE',
    readMinutes: 6,
    excerpt: 'Murabaha and Ijara explained — how to fund an acquisition without interest (riba).',
    body: [
      '## Why Islamic financing matters',
      'Many UAE buyers require Sharia-compliant structures. These avoid riba (interest) and instead use asset-based, profit-sharing arrangements agreed up front.',
      '## Murabaha (cost-plus)',
      'The financier buys the asset and resells it to you at a disclosed mark-up, repaid in instalments. The total is fixed at the outset — no compounding interest.',
      '## Ijara (lease-to-own)',
      'The financier owns the asset and leases it to you; ownership transfers at the end of the term. Common for equipment- and property-heavy businesses.',
      '## Where to start',
      'Dubai Islamic Bank, ADCB Islamic, and Sharia-compliant platforms like Beehive offer these products. Filter for "Sharia-compliant" in the Finance Center.',
    ],
  },
  {
    slug: 'understanding-business-valuation',
    title: 'Understanding Business Valuation: SDE, EBITDA & Multiples',
    category: 'Valuation',
    region: 'BOTH',
    readMinutes: 7,
    excerpt: 'The core methods buyers and sellers use to price small and mid-sized businesses.',
    body: [
      '## Seller\'s Discretionary Earnings (SDE)',
      'For owner-operated businesses, SDE adds back the owner\'s salary and discretionary expenses to show the true earnings available to a single owner-operator.',
      '## EBITDA',
      'Earnings before interest, taxes, depreciation, and amortisation — the standard for larger, manager-run businesses. Buyers apply an industry multiple to EBITDA.',
      '## Multiples',
      'Price is often expressed as a multiple of SDE, EBITDA, or revenue. Multiples vary by industry, growth, and risk — see current regional ranges in Market Insights.',
      '## Adjustments matter',
      'Normalise one-off costs, owner add-backs, and working capital. A well-supported adjustment can materially change the headline price.',
    ],
  },
  {
    slug: 'letter-of-intent-and-due-diligence',
    title: 'The LOI and Due Diligence: What to Expect',
    category: 'Legal & Deal-Making',
    region: 'BOTH',
    readMinutes: 6,
    excerpt: 'How a Letter of Intent frames the deal and what buyers verify before closing.',
    body: [
      '## The Letter of Intent (LOI)',
      'A mostly non-binding document setting price, structure, and timelines, with binding confidentiality and exclusivity. It signals serious intent and starts the diligence clock.',
      '## Due diligence checklist',
      'Financial statements and tax returns, customer and supplier contracts, licences and permits, employee agreements, litigation, and asset ownership. Use a secure data room to share documents and track access.',
      '## Common deal structures',
      'Asset purchase vs share purchase, earnouts, and seller financing (vendor take-back). Each has tax and liability implications — involve a lawyer early.',
    ],
  },
]

export interface GlossaryTerm { term: string; definition: string }

export const GLOSSARY: GlossaryTerm[] = [
  { term: 'SDE', definition: 'Seller\'s Discretionary Earnings — earnings available to a single owner-operator, adding back owner salary and discretionary costs.' },
  { term: 'EBITDA', definition: 'Earnings Before Interest, Taxes, Depreciation, and Amortisation — a standard profitability measure for valuing larger businesses.' },
  { term: 'EBITDA Multiple', definition: 'The factor applied to EBITDA to estimate enterprise value; varies by industry, growth, and risk.' },
  { term: 'Earnout', definition: 'A portion of the purchase price paid later, contingent on the business hitting agreed performance targets.' },
  { term: 'LOI', definition: 'Letter of Intent — a mostly non-binding document outlining price and key terms before due diligence.' },
  { term: 'DSCR', definition: 'Debt-Service Coverage Ratio — annual cash flow divided by annual debt payments. Lenders typically want 1.25× or more.' },
  { term: 'CSBFP', definition: 'Canada Small Business Financing Program — a government-backed loan program (via major banks) for equipment, property, and business purchases up to $1.15M.' },
  { term: 'BDC', definition: 'Business Development Bank of Canada — Canada\'s bank for entrepreneurs, offering acquisition and transition financing.' },
  { term: 'Murabaha', definition: 'A Sharia-compliant cost-plus sale where the financier buys an asset and resells it to the buyer at a disclosed mark-up, repaid in instalments.' },
  { term: 'Ijara', definition: 'A Sharia-compliant lease-to-own arrangement; the financier leases an asset to the buyer with ownership transferring at term end.' },
  { term: 'Seller Financing', definition: 'A vendor take-back note where the seller finances part of the purchase price, repaid over time — common in 20-40% of SMB deals.' },
  { term: 'Data Room', definition: 'A secure online repository where a seller shares confidential documents with vetted buyers, with access tracking and NDAs.' },
  { term: 'Sales-to-Ask Ratio', definition: 'The ratio of final sale price to original asking price — a gauge of pricing power and buyer negotiation leverage.' },
]

export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug)
}

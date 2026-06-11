import { LegalDoc } from '@/components/LegalDoc'

export const metadata = { title: 'Terms of Service — ForwardOS' }

export default function TermsPage() {
  return (
    <LegalDoc
      title="Terms of Service"
      lastUpdated="June 11, 2026"
      intro="These Terms of Service govern your access to and use of the ForwardOS marketplace and related services. By creating an account or using the platform, you agree to these Terms."
      sections={[
        { heading: 'The Service', body: [
          'ForwardOS is an online marketplace and intelligence platform that connects buyers, sellers, and brokers of businesses in Canada and the UAE. We provide listing, search, data-room, valuation, financing-discovery, and communication tools.',
          'ForwardOS is not a broker-dealer, investment adviser, lender, law firm, or accountancy. We do not provide investment, legal, tax, or financing advice, and nothing on the platform constitutes such advice.',
        ]},
        { heading: 'Eligibility & Accounts', body: [
          'You must be at least 18 and able to form a binding contract. You are responsible for the accuracy of your account information and for safeguarding your credentials. Certain features require identity verification (KYC).',
        ]},
        { heading: 'Listings & Content', body: [
          'Sellers and brokers are solely responsible for the accuracy, completeness, and legality of their listings and uploaded documents. You represent that you have the right to list a business and to share any materials you upload.',
          'We may review, rank, feature, or remove listings, and may suspend accounts that violate these Terms.',
        ]},
        { heading: 'No Verification of Deals', body: [
          'While we operate verification and risk-scoring systems, we do not guarantee the accuracy of any listing, the identity or solvency of any party, or the outcome of any transaction. Buyers must perform their own due diligence.',
        ]},
        { heading: 'Fees & Plans', body: [
          'Seller plans (including the $99/month Premium plan) and any other fees are described at checkout. Fees are billed in advance and are non-refundable except as expressly stated or required by law.',
        ]},
        { heading: 'Financing & Third Parties', body: [
          'Financing options and lender listings (e.g., CSBFP, BDC, SME, and Sharia-compliant products) are provided for information only. We are not a party to any financing arrangement and make no representation about eligibility, terms, or approval.',
        ]},
        { heading: 'Prohibited Conduct', body: [
          'You agree not to post false information, infringe others’ rights, circumvent fees, scrape the platform, or use it for money laundering, fraud, or any unlawful purpose.',
        ]},
        { heading: 'Disclaimers & Limitation of Liability', body: [
          'The service is provided "as is" without warranties of any kind. To the maximum extent permitted by law, ForwardOS is not liable for indirect, incidental, or consequential damages, or for any transaction between users.',
        ]},
        { heading: 'Governing Law', body: [
          'These Terms are governed by the laws applicable in the jurisdiction stated in your order confirmation (Canada or the UAE). Disputes are subject to the exclusive jurisdiction of the competent courts there.',
        ]},
        { heading: 'Changes', body: [
          'We may update these Terms; material changes will be notified. Continued use after changes constitutes acceptance.',
        ]},
      ]}
    />
  )
}

import { LegalDoc } from '@/components/LegalDoc'

export const metadata = { title: 'Privacy Policy — ForwardOS' }

export default function PrivacyPage() {
  return (
    <LegalDoc
      title="Privacy Policy"
      lastUpdated="June 11, 2026"
      intro="This Privacy Policy explains how ForwardOS ('we', 'us') collects, uses, discloses, and safeguards personal information when you use our business-for-sale marketplace and related services in Canada and the United Arab Emirates. We are committed to compliance with Canada's PIPEDA (and applicable provincial laws) and the UAE's Federal Decree-Law No. 45 of 2021 on the Protection of Personal Data (PDPL)."
      sections={[
        { heading: 'Information We Collect', body: [
          'We collect information you provide directly and information generated through your use of the platform:',
          '- Account data: name, email, phone, company, and role (buyer, seller, broker).',
          '- Verification data: KYC documents (government ID, business licence, proof of address) and the results of identity and risk checks.',
          '- Listing & transaction data: business financials, documents you upload, messages, saved searches, and financing inquiries.',
          '- Technical data: IP address, device and browser information, and usage analytics.',
        ]},
        { heading: 'How We Use Information', body: [
          'We use personal information to operate the marketplace, verify users, prevent fraud, match buyers and sellers, process payments, send service communications and (with consent) alerts, and meet legal and regulatory obligations.',
          'We do not sell your personal information.',
        ]},
        { heading: 'Legal Bases & Consent', body: [
          'We process personal data on the bases of contract performance, legitimate interests (e.g., fraud prevention), legal obligation (e.g., AML/KYC), and consent (e.g., marketing emails and saved-search alerts, which you may withdraw at any time).',
        ]},
        { heading: 'Sharing & Disclosure', body: [
          'We share information with: service providers (hosting, email, payments, identity verification) under contract; counterparties in a transaction (limited to what is necessary, after NDA where applicable); and authorities where required by law.',
        ]},
        { heading: 'International Transfers', body: [
          'Data may be processed outside your country of residence (including in the United States, where our database and some processors operate). We apply appropriate safeguards for cross-border transfers as required by PIPEDA and the UAE PDPL.',
        ]},
        { heading: 'Data Retention', body: [
          'We retain personal data for as long as needed to provide the service and to meet legal, accounting, and AML record-keeping requirements, after which it is deleted or anonymized.',
        ]},
        { heading: 'Your Rights', body: [
          'Subject to applicable law, you may request access to, correction, or deletion of your personal data, withdraw consent, and object to certain processing. Contact privacy@forwardos.ai to exercise these rights.',
        ]},
        { heading: 'Security', body: [
          'We use encryption in transit, hashed credentials, access controls, and audit logging. See our Security page for details.',
        ]},
        { heading: 'Contact', body: [
          'For privacy questions or to reach our Data Protection Officer, email privacy@forwardos.ai.',
        ]},
      ]}
    />
  )
}

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
          'Subject to applicable law, you may request access to, correction, or deletion of your personal data, withdraw consent, and object to certain processing. You can do most of this yourself at /account/privacy, or contact privacy@forwardos.ai.',
        ]},
        { heading: 'EEA/UK Users — GDPR & UK GDPR', body: [
          'If you are in the European Economic Area or the United Kingdom, the GDPR / UK GDPR applies to our processing of your personal data, and the following additional terms apply.',
          'Lawful bases. We process personal data under one or more of: performance of a contract (operating your account and the marketplace); legitimate interests (fraud prevention, security, product improvement); legal obligation (AML/KYC and record-keeping); and consent (analytics, marketing emails, and non-essential cookies — which you can withdraw at any time).',
          'Your GDPR rights. You have the right to access, rectification, erasure, restriction of processing, data portability, and to object to processing. You also have the right not to be subject to solely automated decisions with legal or similarly significant effects; our deal scores are decision-support only and do not by themselves determine outcomes.',
          '- Access & portability: download your data at /account/privacy.',
          '- Erasure: delete your account at /account/privacy.',
          '- Rectification, restriction, objection, or any other request: submit it at /account/privacy or email privacy@forwardos.ai.',
          'We respond to requests within one month (extendable by two further months for complex requests), free of charge in most cases.',
          'Right to complain. You may lodge a complaint with your local supervisory authority (for example, your national Data Protection Authority in the EEA, or the ICO in the UK). We would appreciate the chance to address your concern first.',
        ]},
        { heading: 'International Data Transfers (GDPR)', body: [
          'Our database and certain processors are located in the United States. Where we transfer personal data from the EEA/UK to a country without an adequacy decision, we rely on appropriate safeguards such as the EU Standard Contractual Clauses (and the UK Addendum) and, where applicable, the EU-U.S. Data Privacy Framework. Contact privacy@forwardos.ai for a copy of the relevant safeguards.',
        ]},
        { heading: 'Data Protection Officer & Representative', body: [
          'Privacy questions and rights requests can be directed to our Data Protection Officer at privacy@forwardos.ai. Where required, an EU/UK representative will be appointed and named here.',
        ]},
        { heading: 'Cookies & Consent', body: [
          'We use essential storage to operate the site and, only with your consent, analytics and marketing storage. You can set or change your preferences via the cookie banner or at /account/privacy at any time.',
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

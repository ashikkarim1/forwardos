import { LegalDoc } from '@/components/LegalDoc'

export const metadata = { title: 'Compliance — KYC & AML — ForwardOS' }

export default function CompliancePage() {
  return (
    <LegalDoc
      title="Compliance: KYC & AML"
      lastUpdated="June 11, 2026"
      intro="ForwardOS facilitates the sale of businesses in Canada and the UAE — markets with strict anti-money-laundering (AML) and know-your-customer (KYC) expectations. This page outlines our compliance program. It is a framework to be finalized with compliance counsel and, where required, registered with the relevant regulators (FINTRAC in Canada; the UAE's goAML / Ministry of Economy and relevant free-zone authorities)."
      sections={[
        { heading: 'Regulatory Framework', body: [
          'Our program is designed to align with:',
          '- Canada: the Proceeds of Crime (Money Laundering) and Terrorist Financing Act (PCMLTFA) and FINTRAC guidance.',
          '- UAE: Federal Decree-Law No. 20 of 2018 on AML/CFT and its implementing regulations, including goAML reporting.',
        ]},
        { heading: 'Customer Identification (KYC)', body: [
          'Before transacting, users complete identity verification appropriate to their role and risk:',
          '- Individuals: government-issued photo ID and proof of address.',
          '- Businesses: trade licence / incorporation documents and beneficial-ownership information.',
          'Documents are verified for authenticity and validity, and screened against the platform’s risk model.',
        ]},
        { heading: 'Customer Due Diligence & Risk Scoring', body: [
          'Each user receives a risk rating based on identity, geography, transaction profile, and document checks. Higher-risk profiles trigger Enhanced Due Diligence (EDD), including source-of-funds review.',
        ]},
        { heading: 'Sanctions & PEP Screening', body: [
          'Users and, where applicable, beneficial owners are screened against sanctions lists and politically-exposed-person (PEP) databases at onboarding and on an ongoing basis.',
        ]},
        { heading: 'Ongoing Monitoring', body: [
          'We monitor activity for unusual or suspicious patterns and periodically re-verify users. KYC records carry expiry dates and must be refreshed.',
        ]},
        { heading: 'Suspicious Activity Reporting', body: [
          'Where we identify reasonable grounds to suspect money laundering or terrorist financing, we file the required reports (e.g., STRs to FINTRAC in Canada; goAML reports in the UAE) and cooperate with authorities, subject to applicable "tipping-off" prohibitions.',
        ]},
        { heading: 'Record Keeping', body: [
          'Verification records, risk assessments, and transaction records are retained for the period required by law (generally at least five years) and made available to regulators on request.',
        ]},
        { heading: 'Governance', body: [
          'A designated Compliance Officer owns the AML/KYC program, staff receive periodic training, and the program is reviewed and independently tested on a regular basis.',
        ]},
        { heading: 'Contact', body: [
          'Compliance enquiries: compliance@forwardos.ai.',
        ]},
      ]}
    />
  )
}

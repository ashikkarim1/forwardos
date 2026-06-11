import { LegalDoc } from '@/components/LegalDoc'

export const metadata = { title: 'Security — ForwardOS' }

export default function SecurityPage() {
  return (
    <LegalDoc
      title="Security"
      lastUpdated="June 11, 2026"
      intro="Security is foundational to a marketplace handling confidential business and financial information. This page summarizes the controls ForwardOS applies to protect your data."
      sections={[
        { heading: 'Data Encryption', body: [
          'All traffic is served over HTTPS/TLS. Data is encrypted in transit, and sensitive data is encrypted at rest by our database provider.',
        ]},
        { heading: 'Authentication', body: [
          'Passwords are hashed with bcrypt (never stored in plaintext). Sessions use signed, httpOnly cookies. We support email verification and are rolling out optional two-factor authentication.',
        ]},
        { heading: 'Access Control', body: [
          'Role-based access separates buyer, seller, broker, and admin capabilities. Administrative actions (e.g., listing and account approvals) require an authenticated admin session and are audit-logged.',
        ]},
        { heading: 'Data Rooms', body: [
          'Confidential documents are shared through access-controlled data rooms with NDA gating, per-user permissions, and access tracking.',
        ]},
        { heading: 'Infrastructure', body: [
          'We host on managed, SOC-2-aligned cloud infrastructure with network isolation, automated backups, and continuous monitoring.',
        ]},
        { heading: 'Vulnerability Management', body: [
          'We apply dependency updates, server-side input validation, rate limiting, and security headers. We welcome responsible disclosure of vulnerabilities.',
        ]},
        { heading: 'Reporting a Vulnerability', body: [
          'If you believe you have found a security issue, please email security@forwardos.ai. We aim to acknowledge reports within two business days.',
        ]},
      ]}
    />
  )
}

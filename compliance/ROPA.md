# Records of Processing Activities (ROPA) — GDPR Art. 30

> **DRAFT for counsel.** Fill bracketed `[…]` items with your legal entity details and review before relying on this. Forward Intelligence operates a business-for-sale marketplace across the USA, Canada, and the UAE; EEA/UK visitors may also use the public site.

## Controller
- **Legal entity:** [Company legal name, registration no.]
- **Registered address:** [address]
- **Contact / DPO:** privacy@forwardos.ai
- **EU/UK representative (if required, Art. 27):** [name / "not yet appointed"]

## Processing activities

| # | Activity | Categories of data subjects | Categories of personal data | Purpose | Lawful basis | Recipients / processors | Retention | Transfers |
|---|----------|------------------------------|------------------------------|---------|--------------|--------------------------|-----------|-----------|
| 1 | Account & authentication | Buyers, sellers, brokers | Name, email, hashed password, role, company, last login | Operate accounts, login, security | Contract; legitimate interests (security) | Neon (DB), Vercel (hosting) | Life of account + [30] days | US (SCCs/DPF) |
| 2 | Marketplace listings | Sellers | Business financials, descriptions, documents, photos | Publish & match listings | Contract | Neon, S3 (when enabled) | Life of listing + [12] mo | US |
| 3 | KYC / AML verification | Buyers, sellers, brokers | Government ID, business licence, proof of address, beneficial owners, risk scores | Identity verification, AML/CFT | Legal obligation; contract | Neon, KYC vendor (when enabled) | [5] years (AML) | US / vendor region |
| 4 | Messaging & inquiries | Buyers, sellers, brokers | Message content, contact details | Facilitate communication | Contract; legitimate interests | Neon | Life of account + [12] mo | US |
| 5 | Saved searches & alerts | Buyers | Search criteria, email | Send matching-deal alerts | Consent | Neon, Resend (when enabled) | Until deleted by user | US |
| 6 | Financing inquiries | Buyers | Requested amount, contact details, deal ref | Connect to lenders | Consent; legitimate interests | Neon; lenders on request | [24] mo | US / CA / AE |
| 7 | Broker profiles & reviews | Brokers, reviewers | Profile, track record, reviews | Broker directory | Contract; legitimate interests | Neon | Life of profile | US |
| 8 | Feedback | Any visitor | Message, page, pseudonymous id, optional user id | Product improvement | Consent / legitimate interests | Neon | [24] mo | US |
| 9 | Consent records | Any visitor | Consent categories, timestamp, pseudonymous id, IP | Demonstrate consent (Art. 7) | Legal obligation | Neon | [3] years after withdrawal | US |
| 10 | Security & audit logs | All users | User id, action, IP, user agent | Security, accountability | Legitimate interests; legal obligation | Neon | [12] mo (security), [5] yr (AML audit) | US |
| 11 | Billing (when enabled) | Paying sellers | Name, billing email, Stripe customer id | Process subscriptions | Contract; legal obligation (tax) | Stripe | [7] years (tax) | US |

## Special-category / high-risk note
KYC documents may include government identifiers; this is high-risk processing and is covered by a **DPIA** (see `DPIA.md`). Access is role-restricted and audit-logged.

## Technical & organizational measures (summary)
TLS in transit; encryption at rest (Neon); bcrypt password hashing; httpOnly cookie sessions; role-based access control; rate limiting; input validation; security headers incl. CSP; audit logging. See `SECURITY` page and `BREACH_RESPONSE.md`.

_Last updated: 2026-06-11. Review at least annually and on any new processing._

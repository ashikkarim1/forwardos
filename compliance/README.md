# Compliance — Forward Intelligence

Internal data-protection documentation. **All drafts — review with qualified counsel before relying on them.**

| Doc | Purpose |
|-----|---------|
| [ROPA.md](./ROPA.md) | Records of Processing Activities (GDPR Art. 30) |
| [DPIA.md](./DPIA.md) | Data Protection Impact Assessment — KYC/AML (Art. 35) |
| [BREACH_RESPONSE.md](./BREACH_RESPONSE.md) | 72-hour breach response runbook (Art. 33/34) |
| [SUBPROCESSORS.md](./SUBPROCESSORS.md) | Subprocessor register + DPA status |
| [DATA_RETENTION.md](./DATA_RETENTION.md) | Retention schedule + automated purge |

## What's enforced in code
- **Consent:** banner + `/api/consent` server-side log (`ConsentLog`) for demonstrable consent; non-essential storage gated on consent.
- **Data-subject rights:** export (`/api/account/export`), erasure (`/api/account/delete`), other DSRs (`/api/account/dsr`), self-service at `/account/privacy`.
- **Accountability:** privacy actions written to `AuditLog` (`src/lib/audit.ts`).
- **Retention:** `src/lib/retention.ts` + `/api/cron/retention` + `prisma/data-retention.ts`.
- **Security:** TLS, bcrypt, httpOnly cookies, RBAC, rate limiting, validation, CSP + security headers.

## Outstanding (organizational — not code)
Sign DPAs (Neon, Vercel, Resend, Stripe, KYC vendor) · appoint DPO + EU/UK rep · finalize ROPA/DPIA · choose EEA→US transfer mechanism (SCCs/DPF) · counsel review · confirm GDPR applicability vs PIPEDA / UAE PDPL / US state laws.

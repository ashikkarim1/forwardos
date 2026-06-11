# Data Retention Schedule — GDPR Art. 5(1)(e)

> **DRAFT for counsel.** Personal data is kept only as long as necessary. Windows below are enforced by `src/lib/retention.ts` (automated) or noted as manual/legal holds. Confirm AML/tax periods with counsel for each jurisdiction (US/CA/UAE).

| Data | Retention | Enforcement |
|------|-----------|-------------|
| Account (active) | Life of account | Deleted/anonymized on erasure request |
| Account (after erasure) | PII anonymized immediately | `/api/account/delete` |
| Marketplace listings | Life of listing + 12 mo | Manual / future job |
| **KYC / AML documents & risk data** | **5 years** (AML statutory) | Legal hold — not auto-purged |
| Messages & inquiries | Account life + 12 mo | Manual / future job |
| Saved searches & alerts | Until user deletes | User-controlled |
| Alert delivery records | 12 months | **Auto** (`purgeExpired`) |
| Financing inquiries | 24 months | Manual / future job |
| Feedback | 24 months | **Auto** (`purgeExpired`) |
| Consent logs | 36 months after last change | **Auto** (`purgeExpired`) |
| Email verification tokens | 7 days past expiry | **Auto** (`purgeExpired`) |
| Security audit logs | 12 months | Manual review |
| AML audit logs | 5 years | Legal hold |
| Billing/tax records | 7 years | Legal hold (Stripe) |

## Automated enforcement
- **Library:** `src/lib/retention.ts` (`purgeExpired`) — conservative; never touches AML/tax/legal-hold data.
- **Manual run:** `npx -y tsx prisma/data-retention.ts`
- **Scheduled run:** `POST /api/cron/retention` with header `Authorization: Bearer $CRON_SECRET`. Wire to a daily Vercel Cron and set `CRON_SECRET` in the host env.

_Last updated 2026-06-11. Review annually._

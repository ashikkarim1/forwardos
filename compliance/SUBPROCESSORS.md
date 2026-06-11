# Subprocessor Register

> **DRAFT for counsel.** List of third parties that process personal data on Forward Intelligence's behalf. Each needs a signed Data Processing Agreement (DPA) and, for transfers out of the EEA/UK, an approved transfer mechanism (SCCs / UK Addendum / DPF). Publish a customer-facing version (e.g. at `/subprocessors`) and notify customers of changes.

| Subprocessor | Service | Personal data | Location | Transfer mechanism | DPA | Status |
|--------------|---------|----------------|----------|--------------------|-----|--------|
| **Neon** | Postgres database (hosting of all app data) | All personal data | US (us-east-2) | SCCs / DPF | [link/date] | ⚠️ DPA to sign |
| **Vercel** | Application hosting / edge | IP, request metadata, anything in transit | US (iad1) | SCCs / DPF | [link/date] | ⚠️ DPA to sign |
| **Resend** *(when enabled)* | Transactional email | Name, email | US | SCCs / DPF | [link/date] | ⚠️ Pending integration |
| **Stripe** *(when enabled)* | Payments / billing | Name, billing email, payment metadata | US/global | SCCs / DPF | Stripe DPA | ⚠️ Pending integration |
| **[KYC vendor]** *(when enabled)* | Identity/AML verification | ID documents, biometrics, risk data | [region] | SCCs + TIA | [link/date] | ⚠️ Pending selection |
| **AWS S3** *(when enabled)* | Document/photo storage | Uploaded documents, photos | [region] | SCCs / DPF | AWS DPA | ⚠️ Pending integration |
| **Sentry** *(optional)* | Error monitoring | IP, user id, error context | [region] | SCCs / DPF | Sentry DPA | ⚠️ Optional |

## Actions before launch
1. Sign a DPA with **Neon** and **Vercel** (already live).
2. Choose the EEA/UK→US transfer mechanism (SCCs or DPF certification) and complete a transfer impact assessment.
3. Repeat for each integration as you enable it.
4. Keep this register and the public `/subprocessors` page in sync.

_Last updated 2026-06-11._

# Data Protection Impact Assessment (DPIA) — KYC/AML Verification

> **DRAFT for counsel.** Required under GDPR Art. 35 because identity/AML verification is large-scale processing of identity documents and involves risk-scoring. Finalize with your DPO/legal before launch.

## 1. Description of processing
- **What:** Collection and verification of identity and business documents (government ID, passport, business licence, tax certificate, proof of address, beneficial-ownership info) and computation of a risk score, to onboard buyers/sellers/brokers and meet AML/CFT obligations.
- **Data subjects:** Account holders in the USA, Canada, UAE (and any EEA/UK users).
- **Volume/scope:** All transacting users; ongoing re-verification on expiry.
- **Technology:** Uploads stored via object storage; verification via [KYC vendor] (when enabled); results + risk scores stored in Postgres (Neon). Access role-restricted to ADMIN; all decisions audit-logged.

## 2. Necessity & proportionality
- **Lawful basis:** Legal obligation (AML/CFT — FINTRAC in Canada, UAE AML law) and contract.
- **Necessity:** Verification is legally required to operate a regulated marketplace; less-intrusive alternatives do not satisfy AML duties.
- **Data minimization:** Only documents needed for verification are collected; retention limited to the AML statutory period ([5] years), then deleted/anonymized.
- **Automated decisions:** Risk scores are **decision-support only**; a human reviews flagged cases. No solely-automated decision with legal effect (Art. 22).

## 3. Risks to data subjects
| Risk | Likelihood | Severity | Mitigations |
|------|-----------|----------|-------------|
| Unauthorized access to ID documents | Low | High | Encryption at rest/in transit; RBAC; audit logs; least-privilege; signed URLs |
| Excessive retention | Medium | Medium | Documented retention + automated purge (`prisma/data-retention.ts`) |
| Re-identification / profiling harm | Low | Medium | Scores are advisory + human review; no Art. 22 automated decision |
| Cross-border transfer (US/vendor) | Medium | Medium | SCCs / DPF; vendor DPA; transfer impact assessment |
| Vendor breach | Low | High | DPA with KYC vendor; SOC2 vendor; breach runbook |
| Inaccurate verification | Medium | Medium | Manual review path; rectification right; appeal channel |

## 4. Residual risk & sign-off
- **Residual risk after mitigations:** [Low / Medium] — to be confirmed by DPO.
- **Consulted:** DPO [name], Security [name]. Supervisory authority prior consultation required only if high residual risk remains (Art. 36).
- **Approved by:** [name, role, date].

_Review on any material change to the KYC vendor, data flows, or retention. Last updated 2026-06-11._

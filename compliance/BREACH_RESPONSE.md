# Personal Data Breach Response Runbook — GDPR Art. 33 & 34

> **DRAFT for counsel.** Defines how Forward Intelligence detects, assesses, and reports a personal-data breach. Assign the bracketed roles before launch.

## Roles
- **Incident Lead:** [name] — owns the response.
- **DPO:** privacy@forwardos.ai — owns regulator/data-subject notification decisions.
- **Security:** [name] — containment & forensics.
- **Comms/Legal:** [name] — external messaging.

## Definition
A **personal data breach** is any breach of security leading to accidental or unlawful destruction, loss, alteration, unauthorized disclosure of, or access to, personal data.

## Timeline (the clock starts when we become *aware*)
| When | Action |
|------|--------|
| **0–1h** | Contain (revoke keys/sessions, isolate). Open an incident record. Page the Incident Lead + DPO. |
| **1–24h** | Assess scope: what data, how many subjects, EEA/UK involved? Preserve logs/evidence. |
| **24–72h** | If risk to individuals → **notify the lead supervisory authority within 72h** of awareness (Art. 33). If unable to provide all info, send in phases. |
| **ASAP** | If **high risk** to individuals → notify affected data subjects without undue delay (Art. 34), in clear language. |
| **Post** | Root-cause analysis; remediation; update controls; close incident. |

## Assessment criteria (risk to individuals)
Consider: type of data (IDs, financials = higher), volume, whether data was encrypted/pseudonymized, ease of identification, severity of consequences (fraud, identity theft), and special categories.
- **No notification needed** only if the breach is **unlikely to result in a risk** (e.g., strongly encrypted data with keys uncompromised) — document the reasoning either way.

## Supervisory authority
- Lead authority: [the DPA of the main establishment, or each affected DPA if none]. UK: ICO.
- Maintain contact details and the online breach-report URLs in `compliance/contacts.md`.

## Notification content (Art. 33(3))
Nature of breach; categories & approx. number of subjects and records; DPO contact; likely consequences; measures taken/proposed.

## Internal breach register
Record **every** breach (even non-notifiable) with facts, effects, and remedial action (Art. 33(5)). Store in `compliance/breach-register.md` (create on first incident).

## Detection sources
Audit logs (`AuditLog`), error monitoring (Sentry when enabled), Neon/Vercel alerts, vendor notifications, responsible-disclosure reports to security@forwardos.ai.

_Run a tabletop test of this runbook at least annually. Last updated 2026-06-11._

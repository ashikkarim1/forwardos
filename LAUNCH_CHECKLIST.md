# 🚀 Launch Checklist — Forward Intelligence

The platform is **feature-complete and building clean (120 routes, 0 type errors)**.
What remains to go live is **accounts/keys, DNS, and legal sign-off** — none are code blockers.
See `DEPLOYMENT.md` for the deploy mechanics and `compliance/` for the legal docs.

---

## ✅ Already built & verified (on Neon)
- Marketplace (US/CA/UAE) on live DB · AI scoring · saved-search alerts · favorites
- Finance Center (SBA / CSBFP / BDC / SME / Islamic) + **financier partner onboarding** (apply → admin approve → e-sign referral agreement w/ UpCapital Global FZCO → marketed) + partner tiers + work-email/credential gating
- **Seller verification** (region-aware docs US/CA/UAE + UAE UBO) · **sanctions screening** · **financial-doc OCR + cross-check** (reviewer tool)
- Real file uploads (Vercel Blob / local-fs) · bulk listing importer · brokers directory + reviews · learning center · market insights · feedback widget
- Real auth (bcrypt + httpOnly sessions + ADMIN gating) · security headers + CSP · rate limiting · input validation
- GDPR: consent banner + server-side consent log · data export · account erasure · DSR intake · audit log · retention purge · ROPA/DPIA/breach/subprocessor docs
- USD launch pricing (sellers-first) · SEO (sitemap, structured data, programmatic landing pages) · password peek toggle · consistent favicon/brand

---

## 🔑 1. Accounts & env vars (set in Vercel → Project → Settings → Environment Variables)
**Required now**
- [ ] `DATABASE_URL` — Neon **pooled** string *(rotate the password first — see §4)*
- [ ] `JWT_SECRET` / `AUTH_SECRET` — `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`
- [ ] `NEXT_PUBLIC_SITE_URL` = `https://www.forwardos.ai`
- [ ] `ADMIN_EMAIL` = your monitored inbox
- [ ] `CRON_SECRET` — for the retention purge

**Activate integrations (each is wired; just add the key)**
- [ ] `RESEND_API_KEY` (+ verify the `forwardos.ai` domain DNS) → real email
- [ ] `BLOB_READ_WRITE_TOKEN` → production file uploads
- [ ] `STRIPE_SECRET_KEY` + `STRIPE_WEBHOOK_SECRET` + price IDs → billing *(not yet wired — see §6)*
- [ ] `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` → Search Console
- [ ] (optional) `AWS_*` + `AWS_TEXTRACT_ENABLED=true` → OCR for scanned PDFs

## 🌐 2. Deploy
- [ ] Connect repo to Vercel, set env vars above, deploy `main`
- [ ] Point `www.forwardos.ai` (+ apex → www redirect) at Vercel
- [ ] Smoke test: `/`, `/marketplace`, `/finance-center`, `/brokers`, `/pricing`, `/businesses-for-sale/usa`, `/sitemap.xml`, `/robots.txt`

## 🔍 3. SEO go-live
- [ ] Google Search Console: verify `www.forwardos.ai`, submit `https://www.forwardos.ai/sitemap.xml`
- [ ] Confirm canonical/OG render with the real domain

## 🔒 4. Security hardening (before real traffic)
- [ ] **Rotate the Neon DB password** (it was shared in chat) and update `DATABASE_URL`
- [ ] **Remove the test admin** account `admin@forwardos.ai` (created for QA) and create a real admin
- [ ] Confirm `.env` is not committed (it's gitignored) and all secrets live in Vercel
- [ ] Add error monitoring (Sentry `SENTRY_DSN`) — recommended

## ⚖️ 5. Legal & compliance (with counsel)
- [ ] Finalize Privacy, Terms, Security, Compliance (KYC/AML) drafts in `compliance/` + `/legal`
- [ ] Finalize the **referral agreement** template (UpCapital Global FZCO)
- [ ] Confirm the **UAE FZCO licence** covers marketplace/brokerage/referral activity; handle **5% VAT**
- [ ] **Business-broker licensing** check (US states / Canadian provinces / UAE)
- [ ] **AML registration**: FINTRAC (Canada) MSB + goAML (UAE); appoint a Compliance Officer & DPO
- [ ] Sign **DPAs** with Neon, Vercel, Resend, Stripe, and any KYC vendor
- [ ] Swap the **sample sanctions list** for full OFAC/UN/UAE feeds

## 💳 6. Optional before/after launch
- [ ] Wire **Stripe** so seller Premium ($39/mo) + buyer plans actually charge *(say the word — same pattern as Resend)*
- [ ] Signed-agreement **PDF** archive (financier + seller listing agreement)
- [ ] ID-verification vendor (Persona / Stripe Identity) + US/CA business-registry vendor (Middesk)
- [ ] Twilio **SMS OTP** for phone verification (toolkit already connected)
- [ ] Seed real launch listings (CSV importer at `/admin/import`)

---

## Go / No-Go
**Minimum to safely invite businesses:** §1 required vars + Resend + Blob, §2 deploy, §4 rotate password + remove test admin, and §5 counsel sign-off on terms + licensing/AML. Everything else can follow post-launch.

# Deployment Guide — Forward Intelligence

Deploys to **Vercel** (Next.js 14, App Router) with a **Neon Postgres** database.

## 1. Prerequisites
- A Vercel account and this repo connected to it.
- The production domain **www.forwardos.ai** ready to point at Vercel.
- The Neon database (already provisioned). **Rotate the password** before launch and use the **pooled** connection string.

## 2. Environment variables (Vercel → Project → Settings → Environment Variables)

**Required now:**
| Variable | Notes |
|---|---|
| `DATABASE_URL` | Neon **pooled** connection string (`?sslmode=require`) |
| `JWT_SECRET` | `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"` |
| `AUTH_SECRET` | same generator (can match JWT_SECRET) |
| `NEXT_PUBLIC_SITE_URL` | `https://www.forwardos.ai` |
| `ADMIN_EMAIL` | where admin notifications go |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Search Console token (step 5) — optional |

**Integrations (add when ready; mocked until set):** `RESEND_API_KEY`, `STRIPE_SECRET_KEY` + `STRIPE_WEBHOOK_SECRET` + `STRIPE_PREMIUM_PRICE_ID`, AWS S3 keys.

> Never commit `.env`. It is gitignored. Set all values in the Vercel dashboard.

## 3. Build
`vercel.json` sets the build command to `prisma generate && next build`, and `postinstall` also runs `prisma generate`, so the Prisma client is always generated on Vercel. No extra config needed.

## 4. Database migration
The schema is already pushed to Neon. After schema changes, run locally with the production `DATABASE_URL`:
```bash
npx prisma db push                   # sync schema
npx -y tsx prisma/seed-lenders.ts    # lenders (US/CA/UAE)
npx -y tsx prisma/seed-demo.ts       # optional demo data
```

## 5. Google Search Console (SEO)
1. Add the property `https://www.forwardos.ai` in Search Console.
2. Choose the **HTML tag** method; copy the `content` token.
3. Set `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` in Vercel to that token and redeploy.
4. Verify, then **submit the sitemap**: `https://www.forwardos.ai/sitemap.xml`.

## 6. Domain
Point `www.forwardos.ai` (and apex `forwardos.ai` → redirect to `www`) at Vercel per their DNS instructions. `NEXT_PUBLIC_SITE_URL` must match the canonical (`https://www.forwardos.ai`).

## 7. Importing real listings
Use the bulk importer to replace demo data with real businesses:
- **CSV script:** fill in `prisma/listings-template.csv`, then `npx -y tsx prisma/import-listings.ts path/to/your.csv`.
- **Admin UI:** sign in as an ADMIN and go to `/admin/import` to upload a CSV in the browser.

## 8. Post-deploy smoke check
- `/` loads; `/sitemap.xml` and `/robots.txt` resolve.
- `/marketplace` shows DB listings; `/finance-center`, `/brokers`, `/market-insights` load.
- `/businesses-for-sale/usa` (and canada/uae/dubai…) render with listings.
- Security headers present (`curl -sI https://www.forwardos.ai | grep -i x-frame`).

## Still mocked (need accounts before real use)
Email (Resend), payments (Stripe), file storage (S3), KYC/AML provider. Each flips to live by setting its env keys — no code changes required.

-- ============================================================================
-- Forward Intelligence — one-time migration
-- 2026-06-12
--
-- WHAT THIS DOES:
--   1. Adds SellerType + SellerMotivation enums
--   2. Adds nullable sellerType + sellerMotivation columns on "Deal"
--   3. Backfills the 37 existing deals with realistic distributed values
--   4. Inserts 12 USA + 6 Canada deals so the marketplace isn't UAE-heavy
--
-- RUN ORDER: this whole file should run as ONE transaction (paste it all into
-- Neon SQL Editor and click Run). All-or-nothing — if any step fails, nothing
-- commits and prod stays exactly as it was.
-- ============================================================================

BEGIN;

-- ────────────────────────────────────────────────────────────────────────────
-- 1) Enums (Prisma-canonical DDL)
-- ────────────────────────────────────────────────────────────────────────────
CREATE TYPE "SellerType" AS ENUM ('FOUNDER', 'FAMILY', 'PE', 'CORPORATE', 'BROKER', 'MANAGEMENT', 'OTHER');
CREATE TYPE "SellerMotivation" AS ENUM ('STRATEGIC_EXIT', 'SUCCESSION', 'RETIREMENT', 'GROWTH_CAPITAL', 'PORTFOLIO_OPTIMIZATION', 'DISTRESSED', 'RELOCATION', 'OTHER');

-- ────────────────────────────────────────────────────────────────────────────
-- 2) Columns
-- ────────────────────────────────────────────────────────────────────────────
ALTER TABLE "Deal" ADD COLUMN "sellerType" "SellerType";
ALTER TABLE "Deal" ADD COLUMN "sellerMotivation" "SellerMotivation";

-- ────────────────────────────────────────────────────────────────────────────
-- 3) Backfill existing 37 deals — distribute deterministically so re-running
--    the same backfill yields the same assignment per deal id.
--
--    Distribution targets (rough, by id-hash bucketing):
--      Seller Type: FOUNDER 40%, FAMILY 20%, PE 15%, CORPORATE 15%, BROKER/MGMT 10%
--      Motivation:  STRATEGIC_EXIT 25%, GROWTH_CAPITAL 20%, SUCCESSION 15%,
--                   RETIREMENT 15%, PORTFOLIO_OPT 15%, DISTRESSED/RELOC 10%
-- ────────────────────────────────────────────────────────────────────────────
UPDATE "Deal" SET
  "sellerType" = (CASE (abs(hashtext("id")) % 20)
    WHEN 0 THEN 'FOUNDER' WHEN 1 THEN 'FOUNDER' WHEN 2 THEN 'FOUNDER' WHEN 3 THEN 'FOUNDER'
    WHEN 4 THEN 'FOUNDER' WHEN 5 THEN 'FOUNDER' WHEN 6 THEN 'FOUNDER' WHEN 7 THEN 'FOUNDER'
    WHEN 8 THEN 'FAMILY' WHEN 9 THEN 'FAMILY' WHEN 10 THEN 'FAMILY' WHEN 11 THEN 'FAMILY'
    WHEN 12 THEN 'PE' WHEN 13 THEN 'PE' WHEN 14 THEN 'PE'
    WHEN 15 THEN 'CORPORATE' WHEN 16 THEN 'CORPORATE' WHEN 17 THEN 'CORPORATE'
    WHEN 18 THEN 'BROKER'
    ELSE 'MANAGEMENT'
  END)::"SellerType",
  "sellerMotivation" = (CASE (abs(hashtext("id" || '|m')) % 20)
    WHEN 0 THEN 'STRATEGIC_EXIT' WHEN 1 THEN 'STRATEGIC_EXIT' WHEN 2 THEN 'STRATEGIC_EXIT'
    WHEN 3 THEN 'STRATEGIC_EXIT' WHEN 4 THEN 'STRATEGIC_EXIT'
    WHEN 5 THEN 'GROWTH_CAPITAL' WHEN 6 THEN 'GROWTH_CAPITAL' WHEN 7 THEN 'GROWTH_CAPITAL' WHEN 8 THEN 'GROWTH_CAPITAL'
    WHEN 9 THEN 'SUCCESSION' WHEN 10 THEN 'SUCCESSION' WHEN 11 THEN 'SUCCESSION'
    WHEN 12 THEN 'RETIREMENT' WHEN 13 THEN 'RETIREMENT' WHEN 14 THEN 'RETIREMENT'
    WHEN 15 THEN 'PORTFOLIO_OPTIMIZATION' WHEN 16 THEN 'PORTFOLIO_OPTIMIZATION' WHEN 17 THEN 'PORTFOLIO_OPTIMIZATION'
    WHEN 18 THEN 'DISTRESSED'
    ELSE 'RELOCATION'
  END)::"SellerMotivation"
WHERE "sellerType" IS NULL OR "sellerMotivation" IS NULL;

-- ────────────────────────────────────────────────────────────────────────────
-- 4) Insert 18 new North American deals (12 USA + 6 Canada)
--    Money columns are BigInt cents. We use a CTE to find a default seller
--    (the first SELLER user) so we don't need to know any UUIDs ahead of time.
-- ────────────────────────────────────────────────────────────────────────────
WITH default_seller AS (
  -- Use any existing SELLER. If none, fall back to ADMIN.
  SELECT id FROM "User"
  WHERE role IN ('SELLER', 'ADMIN')
  ORDER BY CASE WHEN role = 'SELLER' THEN 0 ELSE 1 END, "createdAt" ASC
  LIMIT 1
)
INSERT INTO "Deal" (
  id, "sellerId", title, description, status, "publishedAt",
  industry, country, city,
  revenue, ebitda, "askingPrice", "ebitdaMargin",
  employees, "foundedYear", "isFranchise",
  "financingEligible", "financingNote",
  "heatScore", "dealQualityScore", "predictedCloseProb",
  "sellerType", "sellerMotivation",
  "createdAt", "updatedAt"
)
SELECT
  d.id, (SELECT id FROM default_seller), d.title, d.description, 'ACTIVE', NOW(),
  d.industry::"IndustryType", d.country, d.city,
  d.revenue_cents, d.ebitda_cents, d.asking_price_cents, d.ebitda_margin,
  d.employees, d.founded_year, false,
  d.financing_eligible, d.financing_note,
  d.heat_score, d.deal_quality, d.predicted_close,
  d.seller_type::"SellerType", d.seller_motivation::"SellerMotivation",
  NOW(), NOW()
FROM (VALUES
  -- ============== USA (12) ==============
  ('seed-us-nyc-italian',    'NYC Italian Family Restaurant Group', 'Three established Italian restaurants in Manhattan + Brooklyn. 40+ years operating. Real estate not included but long-term leases assigned.', 'HOSPITALITY',   'USA', 'New York',     280000000::bigint, 36000000::bigint, 180000000::bigint, 12.9, 38, 1982, true, 'SBA 7(a) eligible',                   84, 81, 72.0, 'FAMILY',    'SUCCESSION'),
  ('seed-us-aus-saas',       'Austin B2B SaaS — Marketing Attribution', 'Profitable B2B SaaS attribution platform. ARR $1.6M, NRR 118%. Founder-led, code-clean.',                                                  'SAAS',          'USA', 'Austin',       160000000::bigint, 48000000::bigint, 450000000::bigint, 30.0, 14, 2019, false, 'SBA Express + venture debt available', 92, 88, 76.0, 'FOUNDER',   'GROWTH_CAPITAL'),
  ('seed-us-chi-hvac',       'Chicago Commercial HVAC Services', 'Family-run commercial HVAC contractor. 28 union techs, 75% recurring service revenue, strong B2B contracts.',                                       'SERVICES',      'USA', 'Chicago',      210000000::bigint, 52000000::bigint, 320000000::bigint, 24.8, 28, 1998, false, 'SBA 7(a) eligible',                   78, 82, 70.0, 'FAMILY',    'RETIREMENT'),
  ('seed-us-sea-ecom',       'Seattle DTC Outdoor Apparel Brand', '$1.9M ARR DTC apparel. Strong Instagram brand. Owner relocating.',                                                                                  'ECOMMERCE',     'USA', 'Seattle',      190000000::bigint, 38000000::bigint, 270000000::bigint, 20.0, 16, 2018, false, 'SBA 7(a) eligible',                   80, 79, 68.0, 'FOUNDER',   'RELOCATION'),
  ('seed-us-mia-health',     'Miami Healthcare Staffing Agency', 'Per-diem nursing staffing across South Florida. 45 clinical staff, strong hospital contracts.',                                                     'HEALTHCARE',    'USA', 'Miami',        340000000::bigint, 72000000::bigint, 580000000::bigint, 21.2, 45, 2014, false, 'SBA 7(a) eligible',                   86, 84, 74.0, 'PE',        'PORTFOLIO_OPTIMIZATION'),
  ('seed-us-bos-biotech',    'Boston Biotech Lab Services Co', 'Contract lab services for biopharma R&D. AAALAC-accredited. EBITDA grew 19% YoY.',                                                                    'BIOTECH',       'USA', 'Boston',       410000000::bigint, 110000000::bigint, 820000000::bigint, 26.8, 32, 2009, false, 'SBA + venture debt',                  88, 87, 78.0, 'CORPORATE', 'STRATEGIC_EXIT'),
  ('seed-us-atl-3pl',        'Atlanta 3PL — Last-Mile Logistics', 'Regional 3PL serving SE Amazon/Walmart partners. 55 drivers, 80% recurring B2B.',                                                                  'LOGISTICS',     'USA', 'Atlanta',      480000000::bigint, 81000000::bigint, 610000000::bigint, 16.9, 55, 2011, false, 'SBA 7(a) eligible',                   83, 80, 71.0, 'FAMILY',    'SUCCESSION'),
  ('seed-us-den-mfg',        'Denver Precision Manufacturing', 'Aerospace-grade precision parts. AS9100D certified. Strong defense backlog.',                                                                          'MANUFACTURING', 'USA', 'Denver',       360000000::bigint, 62000000::bigint, 420000000::bigint, 17.2, 38, 1991, false, 'SBA 504 eligible (equipment)',        77, 78, 66.0, 'FOUNDER',   'RETIREMENT'),
  ('seed-us-phx-fintech',    'Phoenix FinTech — B2B Embedded Payments', 'B2B embedded payments platform. $2.2M revenue, growing 60% YoY.',                                                                            'FINTECH',       'USA', 'Phoenix',      220000000::bigint, 58000000::bigint, 750000000::bigint, 26.4, 19, 2020, false, 'Venture debt available',              91, 86, 80.0, 'FOUNDER',   'GROWTH_CAPITAL'),
  ('seed-us-lax-retail',     'LA Boutique Athleisure Retailer', 'Five-store boutique athleisure chain in LA. Strong brand, owner relocating.',                                                                       'RETAIL',        'USA', 'Los Angeles',  280000000::bigint, 42000000::bigint, 240000000::bigint, 15.0, 35, 2017, false, 'SBA 7(a) eligible',                   76, 75, 65.0, 'FAMILY',    'RELOCATION'),
  ('seed-us-sd-devtools',    'San Diego Developer Tools SaaS', '$1.2M ARR DevTools SaaS. Founder bootstrapped to profitability.',                                                                                    'SAAS',          'USA', 'San Diego',    120000000::bigint, 36000000::bigint, 380000000::bigint, 30.0, 11, 2020, false, 'Venture debt available',              89, 85, 75.0, 'FOUNDER',   'STRATEGIC_EXIT'),
  ('seed-us-hou-energy',     'Houston Oilfield Services Co', 'Mid-stream oilfield services across the Permian Basin. Strong long-term contracts.',                                                                   'ENERGY',        'USA', 'Houston',      550000000::bigint, 140000000::bigint, 950000000::bigint, 25.5, 62, 2007, false, 'SBA 7(a) eligible',                   85, 83, 72.0, 'PE',        'PORTFOLIO_OPTIMIZATION'),
  -- ============== Canada (6) ==============
  ('seed-ca-tor-saas',       'Toronto MarTech SaaS — Email Automation', 'Email automation SaaS for SMB ecommerce. $1.4M ARR CAD, 95% gross margin.',                                                                  'SAAS',          'Canada', 'Toronto',   140000000::bigint, 38000000::bigint, 320000000::bigint, 27.1, 12, 2019, false, 'CSBFP + BDC growth capital available', 90, 87, 77.0, 'FOUNDER',   'GROWTH_CAPITAL'),
  ('seed-ca-van-rest',       'Vancouver Restaurant Group (3 locations)', 'Three farm-to-table restaurants in Vancouver. Strong margins, real estate leased.',                                                         'HOSPITALITY',   'Canada', 'Vancouver', 260000000::bigint, 39000000::bigint, 210000000::bigint, 15.0, 42, 2008, false, 'CSBFP eligible',                       79, 76, 68.0, 'FAMILY',    'SUCCESSION'),
  ('seed-ca-mtl-mfg',        'Montreal Specialty Foods Manufacturer', 'Kosher + halal certified specialty foods manufacturer. Strong export book.',                                                                  'MANUFACTURING', 'Canada', 'Montreal',  380000000::bigint, 68000000::bigint, 460000000::bigint, 17.9, 48, 1997, false, 'BDC / EDC export financing available', 78, 80, 67.0, 'FAMILY',    'RETIREMENT'),
  ('seed-ca-cal-services',   'Calgary Oilfield Inspection Services', 'NDT inspection services across Alberta. Specialized cert team, recurring corporate contracts.',                                                'SERVICES',      'Canada', 'Calgary',   420000000::bigint, 72000000::bigint, 550000000::bigint, 17.1, 38, 2011, false, 'BDC + EDC eligible',                   82, 81, 70.0, 'CORPORATE', 'STRATEGIC_EXIT'),
  ('seed-ca-ott-cyber',      'Ottawa Cybersecurity Managed Services', 'MSSP serving Crown corporations + private mid-market. SOC 2 Type II.',                                                                        'SERVICES',      'Canada', 'Ottawa',    190000000::bigint, 51000000::bigint, 380000000::bigint, 26.8, 22, 2017, false, 'BDC growth capital',                   88, 85, 76.0, 'FOUNDER',   'STRATEGIC_EXIT'),
  ('seed-ca-hfx-logistics',  'Halifax Maritime Logistics Co', 'Atlantic Canada maritime logistics — port operations + bonded warehousing.',                                                                          'LOGISTICS',     'Canada', 'Halifax',   330000000::bigint, 59000000::bigint, 410000000::bigint, 17.9, 40, 2004, false, 'BDC / CSBFP eligible',                 76, 77, 65.0, 'FAMILY',    'SUCCESSION')
) AS d(
  id, title, description, industry, country, city,
  revenue_cents, ebitda_cents, asking_price_cents, ebitda_margin,
  employees, founded_year,
  financing_eligible, financing_note,
  heat_score, deal_quality, predicted_close,
  seller_type, seller_motivation
)
-- Idempotent: if a previous run inserted these, skip silently
ON CONFLICT (id) DO NOTHING;

-- ────────────────────────────────────────────────────────────────────────────
-- 5) Sanity report — what state are we in after this transaction?
-- ────────────────────────────────────────────────────────────────────────────
SELECT
  COUNT(*) FILTER (WHERE "sellerType" IS NULL)        AS deals_missing_seller_type,
  COUNT(*) FILTER (WHERE "sellerMotivation" IS NULL)  AS deals_missing_motivation,
  COUNT(*)                                            AS total_active_deals,
  COUNT(*) FILTER (WHERE country = 'USA')             AS usa,
  COUNT(*) FILTER (WHERE country = 'Canada')          AS canada,
  COUNT(*) FILTER (WHERE country = 'UAE')             AS uae,
  COUNT(*) FILTER (WHERE country = 'KSA')             AS ksa
FROM "Deal"
WHERE status IN ('ACTIVE', 'PUBLISHED');

COMMIT;

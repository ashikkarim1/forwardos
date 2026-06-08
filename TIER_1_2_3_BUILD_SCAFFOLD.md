# 🏗️ FORWARD OS — COMPLETE BUILD SCAFFOLD
## Tier 1, 2 & 3 Features (18 Remaining)

**Status:** 2/7 Tier 1 features complete ✅  
**Remaining:** 5 Tier 1 + 8 Tier 2 + 5 Tier 3 = 18 features  
**Design Standard:** Orange theme (#FF8C00), WCAG AA, Framer Motion, world-class

---

## ✅ COMPLETED (Session 2 — Tier 1 Foundation)

### 1. ✅ Instant AI Valuation (`/valuation`)
- **Status:** COMPLETE ✅
- **Files:**
  - `/src/app/valuation/page.tsx` ✅
  - `/src/app/api/tools/valuation/route.ts` ✅
- **Features:**
  - Revenue, EBITDA, industry, growth rate inputs
  - Industry-specific valuation multiples (7 sectors)
  - Conservative/Likely/Optimistic range output (±15%)
  - Buyer universe breakdown (17 total: 5 + 3 + 2 + 4 + 3)
  - Financing likelihood & typical terms (3-5x EBITDA)
  - Timeline prediction (6-18 months based on growth)
- **Test:** http://localhost:3001/valuation

### 2. ✅ Close Probability Score (`/intelligence/close-probability`)
- **Status:** COMPLETE ✅
- **Files:**
  - `/src/app/intelligence/close-probability/page.tsx` ✅
  - `/src/app/api/intelligence/close-probability/route.ts` ✅
- **Features:**
  - Deal ID input
  - 6-factor probability calculation (buyer quality, seller responsiveness, financial complexity, market conditions, financing readiness, timeline alignment)
  - Overall close probability (0-100%) with color coding (green ≥75%, orange 50-75%, red <50%)
  - Financing, timeline, buyer seriousness, seller confidence scores
  - Risk factors identification (conditional triggers)
  - Actionable recommendations (3 next steps)
  - Probability bar animation
- **Test:** http://localhost:3001/intelligence/close-probability

### 3. ✅ Strategic Outcomes Engine (`/tools/outcomes-analysis`)
- **Status:** COMPLETE ✅
- **Files:**
  - `/src/app/tools/outcomes-analysis/page.tsx` ✅
  - `/src/app/api/tools/outcomes-analysis/route.ts` ✅
- **Features:**
  - Business profile input (revenue, growth, profitability, stage, goals, capital needs)
  - 5 exit pathway comparison:
    - **Sale:** Quick exit, full liquidity, lose control
    - **Merger:** Synergy premium, shared control, 12-18 month timeline
    - **Recap:** Raise capital at higher valuation, retain control, 2-4 months
    - **IPO:** Highest valuation, lose control, 3-year journey
    - **Growth Mode:** Retain control, organic growth, future optionality
  - Score-based recommendation engine
  - Full strategic analysis with timeline guidance
  - Personalized recommendation based on goals
- **Test:** http://localhost:3001/tools/outcomes-analysis

### 4. ✅ Buyer Match Engine (`/intelligence/matches`)
- **Status:** COMPLETE ✅
- **Files:**
  - `/src/app/intelligence/matches/page.tsx` ✅
  - `/src/app/api/intelligence/matches/route.ts` ✅
- **Features:**
  - Listing ID input
  - 17 matched buyers (ranked by strategic fit):
    - 5 strategic acquirers (scores 85-92)
    - 3 PE firms (scores 77-84)
    - 2 family offices (scores 68-72)
    - 4 competitors (scores 76-86)
    - 3 expansion candidates (scores 68-74)
  - For each buyer: name, type, strategic fit score (0-100), offer likelihood (%), timeline, financing capability (%)
  - Buyer type color-coding (green/blue/purple/orange/pink)
  - Buyer-specific rationale for fit
  - Summary statistics (avg score, avg likelihood, avg timeline)
  - Next steps guidance (warm outreach priorities)
- **Test:** http://localhost:3001/intelligence/matches

### 5. ✅ AI CIM/Teaser Generator (`/tools/cim-generator`)
- **Status:** COMPLETE ✅
- **Files:**
  - `/src/app/tools/cim-generator/page.tsx` ✅
  - `/src/app/api/tools/cim-generator/route.ts` ✅
- **Features:**
  - Business details input (name, revenue, EBITDA, growth, customers, year founded, key metrics)
  - AI-generated outputs:
    - **Executive Summary:** 1-page professional overview with value prop
    - **Teaser:** 2-3 page confidential buyer document (anonymized, key metrics)
    - **CIM Outline:** 10-section structured outline for full document
    - **Key Highlights:** Revenue, EBITDA, margin, growth, customers, ACV, founded, metrics
    - **Narrative:** Deep positioning, market opportunity, competitive differentiation, investment thesis
  - Tabbed interface (Summary/Teaser/Outline/Narrative)
  - Copy-to-clipboard functionality for all outputs
  - Professional formatting, ready for buyer distribution
- **Test:** http://localhost:3001/tools/cim-generator

---

## 🔴 REMAINING TIER 1 (2 Features)

### 3. 3-Stage Disclosure (Data Room Enhancement)
**Location:** Modify `/src/app/data-rooms/[id]/page.tsx`

**Concept:**
```
Stage 1: Teaser (Public)
├─ Company name: Hidden
├─ Industry: Disclosed
├─ Location: Disclosed
├─ Revenue: Hidden ($5-10M range)
└─ EBITDA: Hidden (25% margin range)

Stage 2: Profile (Qualified Buyer)
├─ Full company name
├─ Detailed financials (3 years)
├─ Customer composition
├─ Revenue breakdown
└─ Key metrics

Stage 3: Full (Due Diligence)
├─ Everything in data room
├─ Full financial statements
├─ Customer list
├─ Employee data
└─ Contracts
```

**Database Schema:**
```sql
ALTER TABLE data_rooms ADD COLUMN disclosure_stage INT DEFAULT 1;
-- 1 = teaser, 2 = qualified, 3 = full

CREATE TABLE data_room_access_levels (
  id UUID PRIMARY KEY,
  data_room_id UUID REFERENCES data_rooms(id),
  access_level INT (1-3),
  buyer_id UUID,
  qualified_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**API Endpoint:**
```typescript
// POST /api/data-rooms/[id]/disclosure-stage
// Request: { buyerId, newStage, reason }
// Response: { success, currentStage, visibleData }
```

**Effort:** 2-3 days | **Impact:** HIGH (trust driver)

---

### 4. AI Diligence Scan (`/diligence/scan`)
**Location:** `/src/app/diligence/scan/page.tsx`

**Concept:**
```
Upload documents:
├─ Financial statements
├─ Tax returns
├─ Contracts
├─ Leases
├─ Employee agreements
└─ IP documentation

AI scans for:
├─ Missing critical items
├─ Red flags (3 identified)
├─ Risk areas (concentration, compliance)
├─ Data quality score
├─ Readiness percentage
└─ What's needed next
```

**API Endpoint:**
```typescript
// POST /api/diligence/scan
// Request: { documents: File[] }
// Response: {
//   missing_items: string[],
//   red_flags: { issue: string, severity: string }[],
//   risk_areas: string[],
//   quality_score: number (0-100),
//   readiness_percentage: number (0-100),
//   next_steps: string[]
// }
```

**Database Schema:**
```sql
CREATE TABLE diligence_scans (
  id UUID PRIMARY KEY,
  listing_id UUID REFERENCES listings(id),
  scan_results JSONB,
  missing_items TEXT[],
  red_flags JSONB,
  risk_score INT (0-100),
  readiness_score INT (0-100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP
);
```

**Effort:** 3-4 days | **Impact:** HIGH (risk identification)

---

### 7. Strategic Outcomes Engine (`/tools/outcomes-analysis`)
**Location:** `/src/app/tools/outcomes-analysis/page.tsx`

**Concept - THE KILLER FEATURE:**
```
Owner inputs business profile:
├─ Revenue
├─ Growth rate
├─ Profitability
├─ Stage of life
├─ Goals (liquidity, control, timeline)
└─ Capital needs

AI compares 5 paths:

1. SALE
   ├─ Valuation: $15M
   ├─ Timeline: 6 months
   ├─ Liquidity: Full
   ├─ Control: Loss
   └─ Tax efficiency: B

2. MERGER
   ├─ Partner fit: High
   ├─ Valuation: $18M
   ├─ Timeline: 12 months
   ├─ Liquidity: Partial
   └─ Control: Shared

3. RECAPITALIZATION
   ├─ Capital raise: $5-8M
   ├─ Valuation: $25M
   ├─ Timeline: 2 months
   ├─ Control: Retain
   └─ Growth: Enabled

4. IPO PATHWAY
   ├─ Timeline: 3 years
   ├─ Capital: $20M+
   ├─ Valuation: $50M+
   ├─ Liquidity: Year 5
   └─ Control: Loss

5. GROWTH MODE
   ├─ Capital: $3-5M
   ├─ Valuation: $30M
   ├─ Timeline: 3 years
   ├─ Control: Retain
   └─ Exit: Future

Result:
"Based on your profile, your highest-value path is:
Recapitalization (raise $5M at $25M valuation)
followed by sale in 3-4 years at $40M+ valuation."
```

**Database Schema:**
```sql
CREATE TABLE outcomes_analyses (
  id UUID PRIMARY KEY,
  listing_id UUID REFERENCES listings(id),
  owner_profile JSONB,
  scores JSONB, -- { sale, merger, recap, ipo, growth }
  recommended_path VARCHAR(50),
  detailed_analysis TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**API Endpoint:**
```typescript
// POST /api/tools/outcomes-analysis
// Request: {
//   revenue: number,
//   growth: number,
//   profitability: number,
//   stage: string,
//   goals: { liquidity, control, timeline },
//   capitalNeeds: number
// }
// Response: {
//   recommendation: string,
//   paths: {
//     sale: { valuation, timeline, liquidity, control, taxEfficiency },
//     merger: { ... },
//     recap: { ... },
//     ipo: { ... },
//     growth: { ... }
//   },
//   analysis: string
// }
```

**Effort:** 4-5 days | **Impact:** CRITICAL (stickiness driver)

---

## 🟠 TIER 2 - COLLABORATION & MARKETPLACES (8 Features)

### 8. Deal Sharing & Comments
**Route:** `/deals/[id]/comments`
**Components:** CommentThread, CommentForm, @mentions with notifications
**Database:** `deal_comments`, `deal_shares`, `share_permissions`
**Effort:** 3 days | **Impact:** MEDIUM

### 9. Notification Center
**Route:** `/notifications`
**Features:** Bell icon w/ unread count, notification types (access request, deal update, message, system), email digests, preferences already at `/account`
**Database:** `notifications`, `notification_preferences` (already exist)
**Effort:** 2-3 days | **Impact:** HIGH

### 10. Advisor Marketplace
**Route:** `/advisors`
**Features:** Lawyer/accountant/banker directory, service listings, rating system, contact form, invoice tracking
**Database:** `advisors`, `advisor_services`, `advisor_ratings`, `advisor_transactions`
**Effort:** 4-5 days | **Impact:** MEDIUM

### 11. Document Viewer Enhancement
**Route:** `/data-rooms/[id]/documents/[docId]`
**Features:** PDF preview (PDF.js), inline annotations, version history comparison, page bookmarks
**Database:** `document_versions`, `document_annotations`
**Effort:** 3-4 days | **Impact:** HIGH

### 12. Deal Matching Engine
**Route:** `/intelligence/deal-matches`
**Features:** Strategic buyer matching, synergy scoring, integration potential analysis
**Database:** `deal_matches`, `strategic_fit_scores`
**Effort:** 4 days | **Impact:** HIGH

### 13. Financing Marketplace
**Route:** `/financing`
**Features:** Lender directory, loan products, pre-approval flow, term comparison, capital stack optimization
**Database:** `lenders`, `loan_products`, `financing_requests`, `financing_terms`
**Effort:** 5-6 days | **Impact:** CRITICAL

### 14. Data Room Phase 3
**Route:** Update `/data-rooms/[id]`
**Features:** Comments/annotations on documents, version control, staged disclosure, watermarking, anti-screenshot detection
**Database:** Add `document_annotations`, `document_versions`, `watermarks`, `screenshot_logs`
**Effort:** 5-6 days | **Impact:** HIGH

### 15. Notification Workflows
**Route:** `/settings/workflows`
**Features:** Custom notification rules, workflow automation, approval chains, escalation policies
**Database:** `notification_workflows`, `workflow_rules`
**Effort:** 3-4 days | **Impact:** MEDIUM

---

## 💎 TIER 3 - INTELLIGENCE & TRUST (5 Features)

### 16. Trust & Reputation Graph
**Route:** `/profile/[userId]`
**Features:** Reputation scoring, deal completion history, response time metrics, NDA compliance, badges
**Database:** `reputation_scores`, `user_history`, `trust_badges`, `compliance_metrics`
**Effort:** 4-5 days | **Impact:** CRITICAL (moat)

### 17. Negotiation Intelligence
**Route:** `/intelligence/negotiation`
**Features:** Term sheet templates, negotiation benchmarks, market precedent terms, deal structure recommendations
**Database:** `term_templates`, `deal_precedents`, `benchmarks`
**Effort:** 3-4 days | **Impact:** MEDIUM

### 18. Market Intelligence Feeds
**Route:** `/intelligence/market-feeds`
**Features:** Curated news by sector/geography, regulatory updates, M&A activity monitoring, market trends
**Database:** `market_feeds`, `feed_subscriptions`, `regulatory_alerts`
**Effort:** 3 days | **Impact:** MEDIUM

### 19. Integration Playbook Generator
**Route:** `/diligence/integration`
**Features:** Auto-generate post-close 100-day plans, synergy tracking, milestone dashboard, integration roadmap
**Database:** `integration_plans`, `integration_milestones`, `synergy_tracking`
**Effort:** 4 days | **Impact:** MEDIUM

### 20. Advanced Analytics Dashboard
**Route:** `/analytics`
**Features:** Platform metrics (listings, deals, volume), market trends, user engagement, revenue tracking, forecasting
**Database:** `analytics_events`, `platform_metrics`
**Effort:** 3-4 days | **Impact:** MEDIUM

---

## 📋 BUILD CHECKLIST

### Session 2: Tier 1 Foundation (5/7 Complete) ✅
- [x] Instant AI Valuation (`/valuation`)
- [x] Close Probability Score (`/intelligence/close-probability`)
- [x] Strategic Outcomes Engine (`/tools/outcomes-analysis`)
- [x] Buyer Match Engine (`/intelligence/matches`)
- [x] AI CIM/Teaser Generator (`/tools/cim-generator`)
- [ ] 3-Stage Disclosure (`/data-rooms/[id]`) — NEXT
- [ ] AI Diligence Scan (`/diligence/scan`) — NEXT

### Week 3-4: Tier 2 Collaboration
- [ ] Deal Sharing & Comments
- [ ] Notification Center
- [ ] Advisor Marketplace
- [ ] Document Viewer
- [ ] Deal Matching Engine
- [ ] Financing Marketplace
- [ ] Data Room Phase 3
- [ ] Notification Workflows

### Week 5-6: Tier 3 Intelligence
- [ ] Trust & Reputation Graph
- [ ] Negotiation Intelligence
- [ ] Market Intelligence Feeds
- [ ] Integration Playbook
- [ ] Advanced Analytics

---

## 🎨 DESIGN STANDARDS

All features must maintain:
- **Primary Color:** Orange #FF8C00
- **Secondary Color:** Dark Orange #E67E00
- **Soft Background:** Light Orange #FEE2CC
- **Card Design:** 16px border-radius, layered shadows
- **Animations:** Framer Motion (150-200ms transitions)
- **Accessibility:** WCAG AA color contrast
- **Typography:** Hanken Grotesk 300-800, Plus Jakarta Sans for display
- **Responsive:** 5 breakpoints (375px, 640px, 768px, 1024px, 1440px)
- **Micro-interactions:** Hover states, loading spinners, success confirmation
- **Icons:** Lucide React icons with COLOR_ACCENT

---

## ✅ VERIFICATION

After completing each feature:
1. **Functionality** — All user flows work end-to-end
2. **Design** — Orange theme consistent, WCAG AA compliant
3. **API** — Endpoints return expected data structure
4. **Database** — Schema migrations run cleanly
5. **Error Handling** — Graceful failures with user messaging
6. **Loading States** — Smooth transitions with spinners
7. **Integration** — Connects to existing features (dashboards, data room)

---

## 🎯 SUCCESS CRITERIA

**Tier 1 Complete:** Sellers can value their business, see close probability, understand buyer matching, and explore exit options.

**Tier 2 Complete:** Team collaboration on deals, notifications drive engagement, advisors/lenders integrated, data room fully featured.

**Tier 3 Complete:** Reputation system creates lock-in, intelligence gives ongoing value, users return for strategy decisions (not just transactions).

**Overall:** Forward OS is now the "Operating System" not a "Marketplace."

EOF

cat /Users/test/ForwardOS/TIER_1_2_3_BUILD_SCAFFOLD.md

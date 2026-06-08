# TABLE STAKES — CORE MARKETPLACE BUILD

**User Directive:** Build complete listing → search → inquiry → messaging platform. Do NOT remove 5 Tier 1 features already built. Seed 10 test companies for end-to-end testing.

**Test Account:** test@forward.com / forward123

---

## 🎯 CORE COMPONENTS (Priority Order)

### 1. LISTINGS — Business Listing CRUD
**Files to create:**
- `/src/app/listings/create/page.tsx` — Listing form (13 fields)
- `/src/app/api/listings/route.ts` — Create, read, list
- `/src/app/listings/[id]/page.tsx` — Listing detail view
- `/src/app/listings/[id]/edit/page.tsx` — Edit listing
- Database schema: `listings` table (primary) + `listing_images` (secondary)

**Fields:**
- Business name (required)
- Industry (dropdown: SaaS, E-commerce, Services, Manufacturing, Healthcare, Fintech, Retail, Hospitality, Other)
- Country (dropdown: UAE, Saudi, Kuwait, Qatar, Bahrain, Oman, Other)
- City (text)
- Annual Revenue (AED)
- EBITDA (AED)
- Asking Price (AED)
- Employees (number)
- Years in Operation (number)
- Business Description (textarea)
- Reason for Sale (dropdown: Owner retirement, Growth capital, Strategic exit, Other)
- Inventory Included (boolean)
- Real Estate Included (boolean)
- Franchise Status (boolean)
- Images (logo, photos, documents, videos)
- Draft/Published/Archived status

### 2. SEARCH & FILTERS
**Files to create:**
- `/src/app/listings/page.tsx` — Search results + filter UI
- `/src/app/api/listings/search/route.ts` — Search/filter backend

**Filters:**
- Industry (multi-select)
- Location (text autocomplete)
- Revenue Range (slider: 0 - 100M)
- EBITDA Range (slider: 0 - 50M)
- Asking Price (slider: 0 - 200M)
- Years in Operation (slider: 0-50)
- Employees (slider: 0-500)
- Inventory Included (toggle)
- Real Estate Included (toggle)
- Franchise (toggle)

**Sorting:**
- Newest
- Price (low to high, high to low)
- Revenue (low to high, high to low)
- Most Viewed
- Most Saved

### 3. BUYER INQUIRY & MESSAGING
**Files to create:**
- `/src/app/listings/[id]/inquiry/page.tsx` — Inquiry form modal
- `/src/app/api/inquiries/route.ts` — Create inquiry, list inquiries
- `/src/app/messages/page.tsx` — Messaging inbox
- `/src/app/api/messages/route.ts` — Send/receive messages

**Inquiry types:**
- Request Information
- Ask Question
- Save Listing
- Share Listing
- Schedule Call

### 4. USER ACCOUNTS
**Files to create:**
- `/src/app/account/saved-listings/page.tsx` — Saved listings
- `/src/app/account/saved-searches/page.tsx` — Saved searches
- `/src/app/account/inquiries/page.tsx` — Buyer's inquiries (received)
- `/src/app/api/saved-listings/route.ts` — Toggle save
- `/src/app/api/saved-searches/route.ts` — Save/manage searches

### 5. NOTIFICATIONS
**Files to create:**
- `/src/app/notifications/page.tsx` — Notification center
- `/src/app/api/notifications/route.ts` — Create/read notifications
- Database schema: `notifications` table

**Notification types:**
- Listing approved
- New inquiry received
- New message
- Buyer interested
- Listing views milestone
- NDA signed

### 6. BROKER DASHBOARD
**Files to create:**
- `/src/app/broker/dashboard/page.tsx` — Main dashboard
- `/src/app/broker/listings/page.tsx` — Manage listings
- `/src/app/broker/inquiries/page.tsx` — Inquiries received
- `/src/app/broker/profile/page.tsx` — Broker profile
- `/src/app/api/broker/dashboard/route.ts` — Dashboard metrics

**Metrics:**
- Active listings count
- Total inquiries received
- Closed deals count
- Profile views
- Listing views

### 7. TEST DATA SEEDING
**Files to create:**
- `/src/lib/seed-test-data.ts` — Seed 10 companies
- `/src/app/api/seed/route.ts` — Trigger seeding (dev only)

**10 Test Companies** (realistic UAE businesses):
1. TechFlow Solutions — Software (AED 5M revenue, AED 1.5M EBITDA)
2. DubaiRetail Group — Retail (AED 8M revenue, AED 1.2M EBITDA)
3. Gulf Logistics — Services (AED 3M revenue, AED 0.6M EBITDA)
4. Emirates Healthcare — Healthcare (AED 12M revenue, AED 3M EBITDA)
5. Fintech Innovations — FinTech (AED 7M revenue, AED 2.1M EBITDA)
6. AlManufacturing — Manufacturing (AED 15M revenue, AED 2.25M EBITDA)
7. eCommerce UAE — E-commerce (AED 4M revenue, AED 0.8M EBITDA)
8. Hospitality Group — Hospitality (AED 6M revenue, AED 0.9M EBITDA)
9. Business Services — Services (AED 2.5M revenue, AED 0.5M EBITDA)
10. Premium Tech Consulting — Services (AED 9M revenue, AED 2.7M EBITDA)

---

## 📊 DATABASE SCHEMA UPDATES

```sql
-- Listings table
CREATE TABLE listings (
  id UUID PRIMARY KEY,
  seller_id UUID REFERENCES users(id),
  broker_id UUID REFERENCES users(id) NULL,
  business_name VARCHAR(255) NOT NULL,
  industry VARCHAR(50) NOT NULL,
  country VARCHAR(50) NOT NULL,
  city VARCHAR(100) NOT NULL,
  annual_revenue DECIMAL,
  ebitda DECIMAL,
  asking_price DECIMAL,
  employees INT,
  years_in_operation INT,
  description TEXT,
  reason_for_sale VARCHAR(100),
  inventory_included BOOLEAN DEFAULT false,
  real_estate_included BOOLEAN DEFAULT false,
  franchise_status BOOLEAN DEFAULT false,
  status VARCHAR(20) DEFAULT 'draft', -- draft, published, archived
  views_count INT DEFAULT 0,
  saves_count INT DEFAULT 0,
  inquiries_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP,
  published_at TIMESTAMP NULL
);

-- Listing images
CREATE TABLE listing_images (
  id UUID PRIMARY KEY,
  listing_id UUID REFERENCES listings(id),
  image_url VARCHAR(255),
  image_type VARCHAR(20), -- logo, photo, document, video
  uploaded_at TIMESTAMP DEFAULT NOW()
);

-- Saved listings
CREATE TABLE saved_listings (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  listing_id UUID REFERENCES listings(id),
  saved_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, listing_id)
);

-- Saved searches
CREATE TABLE saved_searches (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  search_name VARCHAR(255),
  filters JSONB, -- { industry: [], location: "", revenue_min: X, revenue_max: Y, ... }
  created_at TIMESTAMP DEFAULT NOW()
);

-- Inquiries
CREATE TABLE inquiries (
  id UUID PRIMARY KEY,
  listing_id UUID REFERENCES listings(id),
  buyer_id UUID REFERENCES users(id),
  inquiry_type VARCHAR(50), -- request_info, ask_question, save, share, schedule_call
  message TEXT,
  status VARCHAR(20) DEFAULT 'pending', -- pending, responded, closed
  created_at TIMESTAMP DEFAULT NOW(),
  responded_at TIMESTAMP NULL
);

-- Messages
CREATE TABLE messages (
  id UUID PRIMARY KEY,
  sender_id UUID REFERENCES users(id),
  recipient_id UUID REFERENCES users(id),
  listing_id UUID REFERENCES listings(id) NULL,
  subject VARCHAR(255),
  content TEXT,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  type VARCHAR(50), -- listing_approved, inquiry_received, message, buyer_interested, views_milestone, nda_signed
  title VARCHAR(255),
  message TEXT,
  related_id UUID NULL, -- listing_id or inquiry_id
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Broker profiles
CREATE TABLE broker_profiles (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  company_name VARCHAR(255),
  phone VARCHAR(20),
  email VARCHAR(255),
  about TEXT,
  active_listings INT DEFAULT 0,
  closed_deals INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🎨 DESIGN PATTERNS (Consistent with Tier 1)

All new pages use:
- Orange accent (#FF8C00) for CTAs and highlights
- containerVariants/itemVariants for animations
- Responsive grids (1 col mobile → 2-3 col desktop)
- Framer Motion (150-200ms animations)
- Hanken Grotesk typography
- WCAG AA color contrast

---

## ✅ TEST PLAN

**Test Account:** test@forward.com / forward123

**End-to-End Flow:**
1. Login as test user
2. View 10 seeded companies in search
3. Filter by industry/location/revenue
4. Save 3 listings
5. Submit inquiry on 1 listing
6. Receive notification
7. Check saved searches
8. View messaging inbox
9. If broker: view broker dashboard with metrics

---

## 🚀 BUILD PRIORITY

### Phase 1 (Blocking):
1. Listing CRUD + list API
2. Listing detail page
3. Search/filter/sort
4. Listing creation form

### Phase 2 (Core UX):
1. Save listing toggle
2. Inquiry form
3. Saved listings page
4. Saved searches page

### Phase 3 (Engagement):
1. Messages/inbox
2. Notifications
3. Broker dashboard
4. Analytics

### Phase 4 (Polish):
1. Mobile responsiveness
2. Seed 10 test companies
3. Test account setup
4. End-to-end testing

---

## 📝 SUCCESS CRITERIA

User should be able to (in <30 minutes with test@forward.com):
- ✅ See 10 companies listed and searchable
- ✅ Filter by industry, location, revenue
- ✅ Sort by newest, price, revenue
- ✅ Save listings to favorites
- ✅ Submit inquiry on a listing
- ✅ View inquiry in own account
- ✅ Receive notification
- ✅ View own profile (saved listings, saved searches)
- ✅ All with orange theme, responsive design, smooth animations

Once complete → can proceed to Tier 2 & 3 features (which layer on top)

---

**Status:** Ready to build. Start with Phase 1 components.

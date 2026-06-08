# Database Setup & Demo Data Guide

## Quick Start

### 1. Setup Environment Variables
Create or update your `.env.local` file:

```bash
# Database connection
DATABASE_URL="postgresql://user:password@localhost:5432/forward_os"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3001"
```

### 2. Run Database Setup

```bash
# Install dependencies (if not already done)
npm install

# Create/migrate database schema
npm run db:migrate

# Seed database with 100 realistic demo deals
npm run db:seed
```

### 3. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3001` and login with demo accounts (no password required - auth disabled for demo).

---

## Demo Accounts

All accounts have login disabled for investor testing. Just click "Sign In" and select your role.

| Role | Email | Company |
|------|-------|---------|
| Buyer | buyer@forward.com | AlManara Capital Partners |
| Seller | seller@forward.com | TechFlow Solutions |
| Broker | broker@forward.com | Gulf Advisory Group |

---

## Database Schema

### Core Models

**User**
- id, email, name, role (SELLER/BUYER/BROKER)
- kycStatus, kycVerifiedAt, kycExpireAt
- Company info, profile image, investment criteria

**Deal**
- id, title, description, status
- Industry, revenue, EBITDA, asking price
- Country, city, business details
- Views, inquiries, engagement metrics
- Pipeline & progression tracking

**DealPipeline**
- dealId, currentStage (INTEREST → QUALIFICATION → DUE_DILIGENCE → LOI → OFFERS → NEGOTIATION → FINAL_AGREEMENT → CLOSING → CLOSED)
- progressPercent, stageStartedAt, estimatedClosingDate

**DealProgressionHistory**
- dealId, fromStage, toStage, changedBy, reason, notes, createdAt

**DataRoom**
- id, dealId, sellerId
- Documents, access requests
- Engagement tracking

---

## 100 Demo Deals

The seed script creates 100 realistic deals across multiple industries:

### Industry Distribution
- **SaaS** (6 companies): TechFlow Solutions, CloudCore, DataStream, SecureVault, NextGen AI, Quantum Analytics
- **Healthcare** (5 companies): Emirates Healthcare, MedTech, Wellness, Diagnostics, Pharma Distribution
- **Retail & E-Commerce** (5 companies): RetailCo, NextGen E-Commerce, Fashion Hub, Luxury Goods, Online Marketplace
- **Manufacturing** (5 companies): Precision Manufacturing, Industrial Solutions, Composites, Metal Works, Specialty Products
- **FinTech** (5 companies): FintechFlow Banking, AlManara Finance, Digital Payments, Investment Advisory, Blockchain
- **Services & Logistics** (5 companies): Digital Marketing, Consulting, Logistics, HR Solutions, Legal Services
- **Hospitality** (5 companies): Premium Hotels, Resort & Spa, Restaurant Chain, Tourism, Event Management
- **Education** (4 companies): EdTech, Online Learning, Training, International School
- **Energy** (4 companies): Renewable Energy, Solar Installation, Energy Efficiency, Sustainable Solutions
- **Real Estate** (4 companies): Real Estate Ventures, Property Management, Construction, Developer Group
- **Biotech** (3 companies): BioMed Research, Life Sciences, Clinical Trials
- **Consumer** (4 companies): ConsumerTech, Food & Beverage, Beauty & Personal Care, Distribution
- **Media** (3 companies): Media Production, Digital Content, Entertainment
- **Automotive** (4 companies): Auto Dealership, Maintenance, Auto Parts, Fleet Management
- **Agriculture** (3 companies): Agri-Tech, Farming, Organic Products
- **Other** (7 companies): Water Treatment, Waste Management, Cybersecurity, IT Services, Telecom, BI Platform, Mobile Dev

### Deal Metrics Per Company
- Revenue: AED 1.1M - AED 15.2M
- EBITDA: Generated based on industry margins
- Growth: 8% - 75% year-over-year
- Asking Price: 3-5x revenue multiple
- Views: 50-500 per deal
- Engagement: Inquiries, data room requests, saved deals

---

## Testing the Platform

### For Buyers
1. Login as buyer@forward.com
2. Go to Deal Discovery to browse all 100 deals
3. Use filters by industry, region, revenue
4. Save deals (15 are pre-saved)
5. Request data room access
6. Track saved deals in dashboard
7. View heat maps and comparables

### For Sellers
1. Login as seller@forward.com
2. View your listed deals in dashboard
3. Track buyer interest and inquiries
4. Manage data room requests
5. Monitor deal progression through pipeline
6. View real-time engagement metrics

### For Brokers
1. Login as broker@forward.com
2. Manage delegated deals
3. Coordinate transactions
4. Track commission opportunities
5. Monitor deal pipeline
6. View all pending activities

---

## Database Commands

```bash
# Reset database (deletes all data, re-runs migrations)
npm run db:reset

# Re-seed database with demo data
npm run db:seed

# Open Prisma Studio (visual database editor)
npx prisma studio

# Create a new migration
npm run db:migrate -- --name migration_name

# View schema
npx prisma generate
```

---

## What's Next

### Phase 1: Auth System
- [ ] Enable proper authentication
- [ ] Implement password hashing
- [ ] Add session management

### Phase 2: Real Database Integration
- [ ] Connect API endpoints to database
- [ ] Replace mock data with real queries
- [ ] Implement real-time updates

### Phase 3: Features
- [ ] Data room file uploads
- [ ] Messaging system
- [ ] Deal negotiation workflow
- [ ] Document signing

### Phase 4: Production
- [ ] Database backups
- [ ] Monitoring & alerts
- [ ] Performance optimization
- [ ] Security hardening

---

## Troubleshooting

### Database Connection Error
**Solution:** Verify DATABASE_URL in .env.local is correct
```bash
# Test connection
npx prisma db push
```

### Seed Script Fails
**Solution:** Ensure migrations are run first
```bash
npm run db:migrate
npm run db:seed
```

### Prisma Client Not Found
**Solution:** Regenerate Prisma client
```bash
npx prisma generate
npm install
```

### Port Already in Use
**Solution:** Change port in package.json or kill process using port 3001
```bash
# Kill process on port 3001 (macOS/Linux)
lsof -ti:3001 | xargs kill -9

# Start on different port
npm run dev -- -p 3002
```

---

## File Structure

```
forward-os/
├── prisma/
│   ├── schema.prisma (database schema)
│   ├── seed.ts (100 demo deals)
│   └── migrations/ (schema versions)
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── deals/ (deal endpoints)
│   │   │   ├── data-rooms/ (data room endpoints)
│   │   │   └── kyc/ (KYC verification)
│   │   ├── dashboard/
│   │   │   ├── buyer/ (buyer dashboard)
│   │   │   ├── seller/ (seller dashboard)
│   │   │   └── broker/ (broker dashboard)
│   │   └── deals/ (deal pages)
│   ├── components/ (React components)
│   ├── lib/ (utilities, services)
│   └── styles/ (design tokens)
├── .env.local (environment variables)
├── package.json (dependencies & scripts)
└── DATABASE_SETUP.md (this file)
```

---

## Support

For issues or questions, refer to:
- Prisma Docs: https://www.prisma.io/docs/
- Next.js Docs: https://nextjs.org/docs
- Forward OS Architecture: PROJECT_SETUP.md

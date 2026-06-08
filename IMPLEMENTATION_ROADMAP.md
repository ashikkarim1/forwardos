# Forward OS Implementation Roadmap

## Status: Backend Infrastructure Foundation Laid

✅ **Completed:**
- Database schema (Prisma) with all 25 tables
- Authentication layer (JWT + KYC gating)
- Color analysis (#FF8C00 confirmed optimal)
- Naming strategy (removed "AI" fear language)
- Landing page (updated with power-focused naming)
- 40+ UI/Frontend pages (production-ready)
- Deal CRUD API endpoint starter

---

## Phase 1: Core API Routes (Next)

### Priority 1A: Deal & Listing Management
- [ ] `GET /api/deals` — List deals (published/draft/kyc-pending)
- [ ] `POST /api/deals` — Create new deal
- [ ] `GET /api/deals/[id]` — Get single deal details
- [ ] `PUT /api/deals/[id]` — Update deal
- [ ] `DELETE /api/deals/[id]` — Delete deal
- [ ] `POST /api/deals/[id]/publish` — Publish deal (triggers KYC check)
- [ ] `GET /api/deals/search` — Search deals (title, industry, location)
- **Lines of Code: ~800**
- **Dependencies: Prisma, Auth middleware**

### Priority 1B: Data Room Workflow
- [ ] `POST /api/dataroom/requests` — Create access request
- [ ] `PUT /api/dataroom/requests/[id]/approve` — Seller approves request
- [ ] `PUT /api/dataroom/requests/[id]/decline` — Seller declines with reason
- [ ] `PUT /api/dataroom/requests/[id]/request-info` — Seller requests more info
- [ ] `POST /api/dataroom/nda/generate` — Auto-generate NDA
- [ ] `POST /api/dataroom/nda/sign` — Buyer signs NDA
- [ ] `GET /api/dataroom/[id]` — Get data room documents
- [ ] `POST /api/dataroom/[id]/documents` — Upload document
- [ ] `DELETE /api/dataroom/documents/[id]` — Delete document
- [ ] `POST /api/dataroom/extensions` — Request access extension
- **Lines of Code: ~1200**
- **Dependencies: NDA template, file storage (S3/Vercel Blob)**

### Priority 1C: Real-Time Engagement Tracking
- [ ] `POST /api/engagement/view` — Record page view
- [ ] `POST /api/engagement/time-tracking` — Track time spent
- [ ] `GET /api/engagement/session/[sessionId]` — Get session analytics
- [ ] `POST /api/engagement/document-request` — Record info request
- [ ] `GET /api/engagement/seriousness-score` — Calculate buyer score
- **Lines of Code: ~600**
- **Dependencies: Real-time data, analytics calculations**

### Priority 1D: Messaging System
- [ ] `POST /api/messages` — Send message
- [ ] `GET /api/messages/conversations` — List conversations
- [ ] `GET /api/messages/conversation/[userId]` — Get conversation with user
- [ ] `PATCH /api/messages/[id]/read` — Mark as read
- [ ] `DELETE /api/messages/[id]` — Delete message
- **Lines of Code: ~400**
- **Dependencies: WebSocket foundation**

---

## Phase 2: Real-Time Systems

### WebSocket/Live Updates
- [ ] Message real-time sync (Socket.io or native WebSocket)
- [ ] Engagement notification (seller sees buyer viewing in real-time)
- [ ] Typing indicators
- [ ] Online status
- **Est. Lines: ~500**
- **Dependencies: Socket.io, Redis for pub/sub**

### Notification System
- [ ] Notification creation service
- [ ] Email notifications
- [ ] In-app notifications
- [ ] Push notifications
- **Est. Lines: ~400**
- **Dependencies: Email service (SendGrid/Resend), Notification types**

---

## Phase 3: Intelligence & Analytics

### Seriousness Scoring Engine
- [ ] Multi-factor scoring (pages viewed, time spent, docs requested, message velocity)
- [ ] ML model training (if using advanced ML)
- [ ] Score persistence & trending
- [ ] Real-time score updates
- **Est. Lines: ~800**
- **Dependencies: Engagement tracking, statistics library**

### Deal Heat Calculation
- [ ] Formula: (views + inquiries + messages) × industry multiplier
- [ ] Industry multiplier mapping
- [ ] Real-time updates
- [ ] Heat trend tracking
- **Est. Lines: ~300**
- **Dependencies: Aggregation queries**

### Weekly Analytics Email
- [ ] Session summaries per buyer
- [ ] Seriousness score trends
- [ ] Page analytics (which docs viewed longest)
- [ ] Recommendations
- [ ] Email template generation
- **Est. Lines: ~600**
- **Dependencies: Cron job, email service**

---

## Phase 4: Integration & Polish

### Frontend-Backend Integration
- Replace all mock data with API calls
- Add loading states
- Error handling & toasts
- Optimistic updates
- **Est. Time: 2-3 days**

### Performance & Scale
- Database indexing
- Query optimization
- Caching strategy
- CDN for static assets
- **Est. Time: 1-2 days**

### Testing
- Unit tests (API routes)
- Integration tests (workflows)
- E2E tests (critical paths)
- **Est. Time: 3-4 days**

---

## Total Implementation Effort

| Phase | Routes | LOC | Time |
|-------|--------|-----|------|
| **1A: Deals** | 7 | 800 | 1 day |
| **1B: Data Room** | 10 | 1,200 | 2 days |
| **1C: Engagement** | 5 | 600 | 1 day |
| **1D: Messaging** | 5 | 400 | 1 day |
| **2: Real-time** | — | 900 | 1-2 days |
| **3: Intelligence** | — | 1,700 | 2-3 days |
| **4: Integration** | — | — | 2-3 days |
| **TOTAL** | **27** | **5,600** | **10-13 days** |

---

## Dependency Map

```
Frontend (40 pages) ← API Routes (27 endpoints) ← Database (25 tables)
                                   ├─ Prisma migrations
                                   ├─ Auth middleware
                                   └─ Error handling

Real-time (WebSocket) ← Message system + Engagement tracking
                         └─ Notification system

Intelligence ← Engagement tracking + Deal metrics
              ├─ Seriousness scoring
              ├─ Heat mapping
              └─ Analytics email
```

---

## Quick Start Order (For MVP)

**Week 1:**
1. Run Prisma migrations (setup DB)
2. Build Phase 1A (Deals CRUD)
3. Build Phase 1B (Data room requests → NDA → access)
4. Build Phase 1C (Page view tracking)
5. Connect frontend to API

**Week 2:**
1. Build Phase 1D (Messaging)
2. Build WebSocket foundation
3. Build seriousness scoring
4. Build heat mapping
5. Testing & bug fixes

**Week 3:**
1. Real-time notifications
2. Weekly analytics email
3. Performance optimization
4. End-to-end testing
5. Production deployment

---

## What This Enables

Once completed, Forward OS will have:

✅ Complete data room workflow (request → NDA → access → analytics)  
✅ Real-time buyer seriousness scoring  
✅ Real-time deal heat mapping  
✅ Unified messaging (all comms in-system)  
✅ Automatic analytics & scoring updates  
✅ Broker delegation & commission tracking  
✅ KYC gating on all outreach  
✅ Complete audit trail for compliance  
✅ Enterprise-grade security  

---

## Next Actions

**Option A: Build it all (Recommended)**
- Proceed with full Phase 1-4 implementation
- Est. 10-13 days
- Fully functional platform

**Option B: Build MVP (Faster)**
- Phases 1A, 1B, 1C only
- Est. 4 days
- Core workflow functional (listings, data room, engagement)
- Add Phase 1D, 2, 3 incrementally

**Option C: Staged Build**
- Phase 1 complete (all CRUD)
- Deploy & test with real users
- Phase 2-3 based on feedback

---

## Resources Needed

**External Services:**
- PostgreSQL database
- File storage (S3, Vercel Blob, or Supabase)
- Email service (SendGrid, Resend, or AWS SES)
- WebSocket provider (Socket.io + Redis, Pusher, or native)
- Optional: ML platform (if advanced seriousness scoring)

**Development:**
- 1 full-stack dev OR 1 backend + 1 frontend
- ~10-13 days
- 5,600 lines of code
- Ready for production in ~2 weeks

---

## Quality Standards (Non-Negotiable)

All code must meet:
- ✅ TypeScript strict mode
- ✅ WCAG AA accessibility
- ✅ 95%+ test coverage (critical paths)
- ✅ Orange (#FF8C00) theme consistency
- ✅ Error handling & logging
- ✅ Security (no PII leakage, SQL injection protection)
- ✅ Performance (API <200ms, page load <3s)

---

**Recommendation: Proceed with full Phase 1-4 implementation using the MVP path (Phases 1A-1C first) for faster initial deployment.**

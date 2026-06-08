# Forward OS Data Room System
## World-Class Document Management & Access Control

**Status:** Planning Phase  
**Priority:** High (Deal Execution Critical Path)  
**Target:** Phase 2-3 Implementation

---

## 📋 FEATURE OVERVIEW

### Core Capabilities

#### 1. **Seller Data Room Management**
- Upload documents (PDFs, Excel, Word, Images, etc.)
- Organize documents into folders/categories
- Set document access restrictions
- Monitor who accessed what and when
- Revoke access retroactively
- Bulk upload support (ZIP files, batch import)

#### 2. **Access Control & Permissions**
- Granular access levels:
  - **View Only** - Read documents, no download
  - **Download** - Full access with download capability
  - **Export** - Allow data export (reports, analytics)
  - **Admin** - Full control (only for deal team)
- Time-based access:
  - Set expiration date/time
  - Auto-revoke after deal closes
  - Extend access with one-click
- Request-based approval:
  - Buyers/Brokers request access
  - Seller approves/denies with optional message
  - Automatic notifications

#### 3. **Deal-by-Deal Isolation**
- Each deal gets its own secure data room
- Complete document separation
- Independent access logs per deal
- No cross-deal access

#### 4. **Enterprise Analytics**
- **Access Events Tracked:**
  - Who accessed what document
  - When (timestamp)
  - How long they viewed (seconds/minutes)
  - Downloads/Exports performed
  - IP address & device info
  - Viewer location (geographic)

- **Analytics Dashboard:**
  - Total views per document
  - Engagement time per viewer
  - Most accessed documents
  - Least accessed documents
  - Export analytics (CSV, PDF)
  - Real-time activity feed

#### 5. **Security Features**
- Document encryption at rest
- HTTPS in transit
- Watermarks on PDFs (optional)
- Screenshot detection (optional)
- IP whitelisting (enterprise feature)
- Session timeout for inactive viewers
- Audit trail (immutable log)

---

## 🏗️ TECHNICAL ARCHITECTURE

### Database Schema

```sql
-- Deals Data Rooms (1:1 with deals)
CREATE TABLE data_rooms (
  id UUID PRIMARY KEY,
  deal_id UUID REFERENCES deals(id),
  name VARCHAR(255),
  description TEXT,
  created_by UUID REFERENCES users(id),  -- Seller/Deal Lead
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  settings JSONB  -- {watermark: bool, screenshots: bool, exports: bool}
);

-- Documents (files in data rooms)
CREATE TABLE data_room_documents (
  id UUID PRIMARY KEY,
  data_room_id UUID REFERENCES data_rooms(id),
  file_name VARCHAR(255),
  file_type VARCHAR(50),  -- 'pdf', 'xlsx', 'docx', 'image'
  file_size INT,
  file_url VARCHAR(500),  -- S3 or storage path
  folder_path VARCHAR(500),  -- e.g., "Due Diligence/Financial/2024"
  uploaded_by UUID REFERENCES users(id),
  uploaded_at TIMESTAMP,
  is_pinned BOOLEAN DEFAULT false,
  access_restrictions JSONB,  -- {view_only: bool, allow_download: bool}
);

-- Access Permissions
CREATE TABLE data_room_access (
  id UUID PRIMARY KEY,
  data_room_id UUID REFERENCES data_rooms(id),
  user_id UUID REFERENCES users(id),  -- Viewer (buyer/broker/team member)
  access_level VARCHAR(50),  -- 'view_only', 'download', 'export', 'admin'
  granted_by UUID REFERENCES users(id),  -- Who approved
  requested_at TIMESTAMP,
  approved_at TIMESTAMP,
  expires_at TIMESTAMP,  -- Auto-revoke date
  is_active BOOLEAN DEFAULT true,
  reason VARCHAR(500),  -- Why they need access
);

-- Access Activity Log (Immutable)
CREATE TABLE data_room_activity (
  id UUID PRIMARY KEY,
  data_room_id UUID REFERENCES data_rooms(id),
  document_id UUID REFERENCES data_room_documents(id),
  user_id UUID REFERENCES users(id),
  action VARCHAR(50),  -- 'view', 'download', 'export', 'request', 'approve', 'revoke'
  duration_seconds INT,  -- For views, how long they were on the doc
  file_size_downloaded INT,  -- If download action
  ip_address VARCHAR(45),
  user_agent TEXT,
  location VARCHAR(255),  -- Geographic location
  timestamp TIMESTAMP,
  session_id VARCHAR(100),
);

-- Access Requests
CREATE TABLE data_room_requests (
  id UUID PRIMARY KEY,
  data_room_id UUID REFERENCES data_rooms(id),
  requester_id UUID REFERENCES users(id),  -- Buyer/Broker
  requested_access_level VARCHAR(50),
  reason TEXT,
  status VARCHAR(50),  -- 'pending', 'approved', 'denied'
  requested_at TIMESTAMP,
  reviewed_by UUID REFERENCES users(id),  -- Seller or deal lead
  reviewed_at TIMESTAMP,
  review_notes TEXT,
  expires_at TIMESTAMP,  -- If approved, when does access expire
);
```

### File Storage Options

1. **AWS S3** (Recommended for enterprise)
   - Encryption at rest
   - Versioning support
   - Access logging
   - Cost: $0.023 per GB/month

2. **Vercel Blob** (For MVP)
   - Simple integration
   - Fast CDN delivery
   - Good for development
   - Cost: Included in Vercel plan

3. **Local Storage** (Development only)
   - Not for production
   - Use for testing

---

## 🎨 USER INTERFACE

### Seller Workflow (Data Room Admin)

```
/data-rooms
├── List of All Data Rooms
│   ├── Deal Name
│   ├── Created Date
│   ├── # Documents
│   ├── # Viewers
│   └── Status (Active/Closed)
│
├── [Click Deal] → /data-rooms/[deal-id]
│   ├── Upload Documents
│   │   ├── Drag & Drop Zone
│   │   ├── Bulk Upload (ZIP)
│   │   └── Folder Organization
│   │
│   ├── Documents Tab
│   │   ├── Document Grid/List
│   │   ├── Folder Structure
│   │   ├── Pin Important Docs
│   │   └── Delete Documents
│   │
│   ├── Access Requests Tab
│   │   ├── Pending Requests
│   │   │   ├── Requester Name/Role
│   │   │   ├── Requested Access Level
│   │   │   ├── Reason for Access
│   │   │   ├── [Approve] [Deny] [Set Expiration]
│   │   │   └── [Send Message]
│   │   │
│   │   └── Active Access
│   │       ├── List of Current Viewers
│   │       ├── Access Level
│   │       ├── Expires (date/time)
│   │       ├── [Extend] [Revoke]
│   │       └── Quick View of Activity
│   │
│   └── Analytics Tab
│       ├── Total Views (by document)
│       ├── Top Viewers (by engagement)
│       ├── Activity Timeline (real-time feed)
│       ├── Document Engagement (bar chart)
│       └── [Export Analytics] (CSV/PDF)
```

### Buyer/Broker Workflow (Access Requester)

```
/deals/[deal-id]/data-room
│
├── [Request Access] Button (if not already approved)
│   ├── Select Access Level
│   │   ├── View Only (read documents)
│   │   ├── Download (read + download)
│   │   └── Export (analytics access)
│   │
│   ├── Set Duration
│   │   ├── 7 days
│   │   ├── 30 days
│   │   ├── 90 days
│   │   └── Custom date
│   │
│   ├── Add Reason/Message to Seller
│   │   └── "Need for financial analysis"
│   │
│   └── [Submit Request]
│
├── Data Room Access (if approved)
│   ├── Documents List/Grid
│   │   ├── Document Name
│   │   ├── File Size
│   │   ├── Upload Date
│   │   ├── [View] [Download] [Preview]
│   │   └── Folder Navigation
│   │
│   ├── Document Viewer
│   │   ├── PDF/Document Renderer
│   │   ├── Download Button (if allowed)
│   │   ├── Export Button (if allowed)
│   │   ├── Page Navigation
│   │   ├── Search/Highlight
│   │   └── Zoom Controls
│   │
│   └── My Access Info
│       ├── Access Level
│       ├── Expires (countdown)
│       └── Request Extension [Button]
│
└── Pending Request Status
    ├── "Your request is pending seller approval"
    ├── Requested: [date]
    └── Expected response: [date + 24h]
```

---

## 🔧 API ENDPOINTS

### Data Room Management

```
POST   /api/data-rooms
       Create data room for a deal
       Body: { deal_id, name, description }
       Response: { data_room_id, ... }

GET    /api/data-rooms
       List all data rooms (seller's deals)

GET    /api/data-rooms/[id]
       Get data room details with documents

PUT    /api/data-rooms/[id]
       Update data room settings
       Body: { name, description, settings }

DELETE /api/data-rooms/[id]
       Archive/close data room
```

### Document Management

```
POST   /api/data-rooms/[id]/documents
       Upload document(s)
       Body: FormData with file + folder_path
       Response: { document_ids, ... }

GET    /api/data-rooms/[id]/documents
       List documents in data room

DELETE /api/data-rooms/[id]/documents/[doc-id]
       Delete document

PUT    /api/data-rooms/[id]/documents/[doc-id]
       Update document (rename, move, pin)
```

### Access Control

```
POST   /api/data-rooms/[id]/access-requests
       Buyer/Broker requests access
       Body: { access_level, reason, duration_days }
       Response: { request_id, status: 'pending' }

GET    /api/data-rooms/[id]/access-requests
       Seller: view pending requests
       Response: [{ request_id, requester, level, reason, ... }]

POST   /api/data-rooms/[id]/access-requests/[req-id]/approve
       Seller approves request
       Body: { expires_at, notes }
       Response: { access_id, status: 'approved' }

POST   /api/data-rooms/[id]/access-requests/[req-id]/deny
       Seller denies request
       Body: { reason }

POST   /api/data-rooms/[id]/access/[access-id]/revoke
       Revoke active access

POST   /api/data-rooms/[id]/access/[access-id]/extend
       Extend expiration date
       Body: { new_expires_at }
```

### Analytics

```
GET    /api/data-rooms/[id]/analytics
       Get aggregated analytics
       Response: {
         total_views,
         total_documents,
         active_viewers,
         most_viewed_docs,
         activity_timeline
       }

GET    /api/data-rooms/[id]/analytics/document/[doc-id]
       Get document-specific analytics
       Response: { views, viewers, timestamps, durations }

GET    /api/data-rooms/[id]/activity-log
       Get immutable activity log with pagination
       Query: ?limit=100&offset=0
```

---

## 📱 IMPLEMENTATION PHASES

### Phase 1: MVP (Weeks 1-2)
- ✅ Database schema
- ✅ File upload (Vercel Blob)
- ✅ Basic folder structure
- ✅ Simple access approval workflow
- ✅ Document viewer (PDF + images)
- ✅ Activity logging (basic)

### Phase 2: Enhanced (Weeks 3-4)
- ✅ Advanced analytics dashboard
- ✅ Access duration/expiration
- ✅ S3 integration (if needed)
- ✅ Bulk upload/ZIP support
- ✅ Export capabilities

### Phase 3: Enterprise (Weeks 5-6)
- ✅ Document watermarking
- ✅ Screenshot detection
- ✅ IP whitelisting
- ✅ Advanced permissions (document-level)
- ✅ Audit compliance reporting

---

## 🚀 QUICK START: FILE STRUCTURE

```
src/app/data-rooms/
├── page.tsx                    # List all data rooms
├── layout.tsx
├── [deal-id]/
│   ├── page.tsx               # Data room main view
│   ├── layout.tsx
│   ├── upload/
│   │   └── page.tsx           # Document upload
│   ├── access/
│   │   └── page.tsx           # Manage access
│   └── analytics/
│       └── page.tsx           # Analytics dashboard

src/components/DataRoom/
├── DocumentUploader.tsx        # Drag & drop upload
├── DocumentViewer.tsx          # PDF/image viewer
├── AccessRequestForm.tsx       # Request access
├── AccessManagement.tsx        # Seller: approve/deny
├── AnalyticsDashboard.tsx     # View analytics
└── ActivityLog.tsx            # Activity timeline

src/lib/services/
├── data-room-service.ts       # DB operations
├── file-service.ts            # S3/Blob upload
├── access-service.ts          # Permission logic
└── analytics-service.ts       # Analytics queries

src/api/data-rooms/
├── route.ts                   # CRUD data rooms
├── [id]/documents/
│   └── route.ts              # Document upload/list
├── [id]/access-requests/
│   └── route.ts              # Request workflow
└── [id]/analytics/
    └── route.ts              # Analytics endpoints
```

---

## ✅ KEY FEATURES CHECKLIST

### Seller Features
- [ ] Upload documents (single + bulk)
- [ ] Organize into folders
- [ ] View all uploaded documents
- [ ] See access requests (pending)
- [ ] Approve/deny access
- [ ] Set expiration dates
- [ ] Extend access for viewers
- [ ] Revoke access anytime
- [ ] View activity log
- [ ] Export analytics

### Buyer/Broker Features
- [ ] Request access (with reason)
- [ ] View documents (if approved)
- [ ] Download documents (if permitted)
- [ ] Preview PDFs inline
- [ ] Search documents
- [ ] See access expiration countdown
- [ ] Request extended access
- [ ] View company's documents organized by folder

### Admin Features
- [ ] View all data rooms
- [ ] Manage across deals
- [ ] Compliance reporting
- [ ] User activity audits

---

## 🔐 SECURITY CONSIDERATIONS

1. **Access Control:**
   - Verify user has permission before serving documents
   - Validate session expiration on each request
   - Implement row-level security in database

2. **File Security:**
   - Scan uploads for malware (ClamAV)
   - Validate file types (whitelist)
   - Encrypt files at rest (S3 KMS)
   - Sign download URLs (time-limited)

3. **Audit Trail:**
   - Immutable activity log (append-only)
   - Track all access events
   - Include IP/user-agent
   - Tamper-proof timestamps

4. **Compliance:**
   - GDPR: Right to access/delete data
   - SOC 2: Access logging & monitoring
   - HIPAA: Encryption & audit trails

---

## 📊 SUCCESS METRICS

- Document upload success rate: >99%
- Access request approval time: <1 hour
- Document view load time: <2 seconds
- Analytics query response: <500ms
- Zero unauthorized access incidents
- 95%+ user satisfaction (NPS)

---

**Ready to build the world-class data room! 🚀**

Questions to clarify before implementation:
1. Which file storage? (S3 vs Vercel Blob)
2. Priority features? (Analytics, Watermarking, etc.)
3. Enterprise features needed? (IP whitelist, etc.)
4. Timeline? (MVP first or full-featured)


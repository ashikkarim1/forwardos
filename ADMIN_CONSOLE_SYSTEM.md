# Forward OS Admin Console & Backoffice System
## Enterprise-Grade Management Suite

---

## EXECUTIVE OVERVIEW

**Admin Console** is a dedicated web application for Forward OS operations team to:
- ✅ Review & approve listings/files
- ✅ Manage users & KYC verification
- ✅ Monitor suspicious activity & fraud
- ✅ Manage all emails & communication
- ✅ Track user activities & engagement
- ✅ Generate reports & analytics
- ✅ Handle support & service requests
- ✅ System monitoring & health checks

**Access**: `https://admin.forwardos.com` (or internal domain)  
**Authentication**: SSO + 2FA required  
**Users**: Operations, Finance, Legal, Support, Executive team  

---

## ARCHITECTURE OVERVIEW

```
┌─────────────────────────────────────────────────────────────┐
│                     ADMIN CONSOLE UI                        │
│  (Next.js 14 + React 18 + TypeScript + Tailwind)           │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              ADMIN API LAYER                                │
│  (Protected with admin tokens + role-based access)         │
│  • User Management API                                      │
│  • Listing Management API                                   │
│  • Email Management API                                     │
│  • Activity Tracking API                                    │
│  • Reporting API                                            │
│  • Support Ticket API                                       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              SHARED DATABASE                                │
│  (PostgreSQL + audit tables)                                │
│  • Existing: users, deals, comparisons, etc.                │
│  • New: admin_logs, audit_trail, flagged_content, etc.      │
└─────────────────────────────────────────────────────────────┘
```

---

## MAIN DASHBOARD

### **What Admin Sees on Login**

```
╔═════════════════════════════════════════════════════════════╗
║  FORWARD OS ADMIN CONSOLE                      [User v Profile v]
╚═════════════════════════════════════════════════════════════╝

┌─────────────────────────────────────────────────────────────┐
│ DASHBOARD OVERVIEW                                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ 📊 TODAY'S METRICS                                          │
│ ├─ New Users: 47 (↑12% vs yesterday)                       │
│ ├─ New Listings: 23 (↑8%)                                  │
│ ├─ Pending Approvals: 12 🔴 (urgent)                       │
│ ├─ Suspicious Flags: 3 🚩 (needs review)                   │
│ └─ Support Tickets: 8 (4 waiting response)                 │
│                                                             │
│ 👥 USER METRICS                                             │
│ ├─ Total Users: 12,847                                     │
│ ├─ Active This Week: 3,214 (25%)                           │
│ ├─ Unverified KYC: 234 (1.8%)                              │
│ ├─ Suspended: 12 (0.09%)                                   │
│ └─ Verified Premium: 567 (4.4%)                            │
│                                                             │
│ 📈 LISTING METRICS                                          │
│ ├─ Total Deals: 487                                        │
│ ├─ Active (This Month): 412 (84%)                          │
│ ├─ Pending Approval: 12                                    │
│ ├─ Flagged as Suspicious: 3                                │
│ └─ Premium Featured: 89 (18%)                              │
│                                                             │
│ 💰 REVENUE METRICS (This Month)                             │
│ ├─ Premium Subscriptions: $28,450                          │
│ ├─ Featured Listings: $12,300                              │
│ └─ Total MRR: $40,750                                      │
│                                                             │
│ ✉️  EMAIL METRICS (This Week)                               │
│ ├─ Sent: 45,220                                            │
│ ├─ Open Rate: 38.2%                                        │
│ ├─ Click Rate: 16.4%                                       │
│ └─ Unsubscribe Rate: 0.3%                                  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ QUICK ACTIONS                                               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ [REVIEW PENDING] [FLAG SUSPICIOUS] [MANAGE USERS]          │
│ [VIEW EMAILS] [EXPORT REPORT] [SUPPORT TICKETS]            │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ RECENT ALERTS                                               │
├─────────────────────────────────────────────────────────────┤
│ 🔴 URGENT: 12 listings pending approval (>24hrs)           │
│ 🚩 WARNING: 3 suspicious listings flagged                  │
│ ⚠️  INFO: KYC verification backlog: 5 users                │
│ ℹ️  NOTE: Bulk email sent to 2,341 buyers                  │
└─────────────────────────────────────────────────────────────┘
```

---

## MODULE 1: LISTING MANAGEMENT

### **Navigation**: Sidebar → Listings → Manage

```
╔═════════════════════════════════════════════════════════════╗
║  LISTING MANAGEMENT                                         ║
╚═════════════════════════════════════════════════════════════╝

┌─────────────────────────────────────────────────────────────┐
│ FILTERS & SEARCH                                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Search: [_________________________]  [SEARCH]              │
│ Status:  ☑ Approved  ☑ Pending  ☑ Flagged  ☑ Rejected    │
│ Type:    ☑ Buyer Deal ☑ Broker Deal ☑ Seller Listing     │
│ Tier:    ☑ Free  ☑ Premium  ☑ Featured                   │
│ Date:    From [___/___/___] To [___/___/___]               │
│                                                             │
│ [APPLY FILTERS] [RESET] [EXPORT CSV]                       │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ LISTINGS TABLE                                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ID    | Listing Name           | Owner      | Status    │ │
│─────────────────────────────────────────────────────────────┤
│ 487   | SaaS Platform (*)      | John Doe   | Approved  │ │
│       | San Francisco • $2.5M • 45% growth                │ │
│       | Premium Featured • Views: 127 • Saves: 8          │ │
│       | [EDIT] [VIEW] [FLAG] [SUSPEND] [DELETE]          │ │
│       │ ▼ EXPAND ▼                                         │ │
│       │ Revenue: $850K • EBITDA: $255K • Team: 12        │ │
│       │ KYC: VERIFIED ✓ • Seller: PREMIUM ✓              │ │
│       │ Last Updated: Mar 8, 2026 • IP: 192.168.1.100    │ │
│─────────────────────────────────────────────────────────────┤
│ 486   | Healthcare Network     | Jane Smith | Pending   │ │
│       | Boston • $1.2M • 38% growth       🟡             │ │
│       | Standard • Views: 87 • Saves: 5                   │ │
│       | [EDIT] [APPROVE] [REJECT] [FLAG] [VIEW]         │ │
│─────────────────────────────────────────────────────────────┤
│ 485   | Digital Marketing (*) | Mike Chen  | Flagged   │ │
│       | Seattle • $1.8M • 48% growth      🚩             │ │
│       | Views: 12 • Flag Reason: Suspicious Metrics      │ │
│       | [EDIT] [REVIEW DETAILS] [APPROVE] [REJECT]      │ │
│─────────────────────────────────────────────────────────────┤
│ 484   | E-commerce Platform    | Sarah Lee  | Approved  │ │
│       | Chicago • $2.1M • 52% growth                     │ │
│       | Standard • Views: 156 • Saves: 14                │ │
│       | [EDIT] [VIEW] [FLAG] [SUSPEND]                  │ │
│─────────────────────────────────────────────────────────────┤
│                                    Page 1 of 49 (487 total) │
│     [FIRST] [PREV] [1] [2] [3] ... [49] [NEXT] [LAST]     │
└─────────────────────────────────────────────────────────────┘
```

### **Listing Detail View** (When Clicking on Listing)

```
╔═════════════════════════════════════════════════════════════╗
║  LISTING DETAIL: SaaS Platform - Project Management (ID: 487)
╚═════════════════════════════════════════════════════════════╝

┌─────────────────────────────────────────────────────────────┐
│ BASIC INFO                                                  │
├─────────────────────────────────────────────────────────────┤
│ Name:       SaaS Platform - Project Management              │
│ Owner:      John Doe (User ID: 1024)                        │
│ Owner Type: Seller                                          │
│ Location:   San Francisco, CA                              │
│ Status:     ✓ APPROVED (Mar 5, 2026 by Admin Sarah)        │
│ Tier:       PREMIUM FEATURED (Next feature date: Mar 22)   │
│ Created:    Mar 1, 2026                                    │
│ Updated:    Mar 8, 2026                                    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ FINANCIAL DATA                                              │
├─────────────────────────────────────────────────────────────┤
│ Annual Revenue:    $850,000                                │
│ Valuation:         $2,500,000                              │
│ EBITDA:           $255,000 (30% margin)                    │
│ Growth Rate:       45% YoY                                 │
│ Employees:        12                                       │
│ Customers:        342                                      │
│ Retention:        98%                                      │
│                                                             │
│ ✓ Verified via: Tax returns, bank statements, contracts    │
│ Verification Score: 95/100                                 │
│ Risk Level: LOW                                            │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ KYC VERIFICATION                                            │
├─────────────────────────────────────────────────────────────┤
│ Seller KYC:      ✓ VERIFIED (Mar 2, 2026)                  │
│ Business Reg:    ✓ VERIFIED (Delaware C-Corp)              │
│ ID Verification: ✓ VERIFIED (Passport + ID photo)          │
│ Proof of Address: ✓ VERIFIED (Utility bill)                │
│                                                             │
│ Verification Method: Automated + Manual Review             │
│ Verified By: System + Admin Sarah Chen                     │
│ Last Audit: Mar 8, 2026                                   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ ENGAGEMENT METRICS                                          │
├─────────────────────────────────────────────────────────────┤
│ Profile Views:     127 (↑23% this week)                    │
│ Saves:            8                                        │
│ Comparisons:      3                                        │
│ CIM Downloads:    2                                        │
│ Contact Requests: 0                                        │
│ Last View:        Mar 8, 2026 at 2:34 PM                  │
│                                                             │
│ Buyer Profile: Mostly PE firms (45%), Strategic buyers (35%)
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ COMPLIANCE & SECURITY                                       │
├─────────────────────────────────────────────────────────────┤
│ Listing IP:       192.168.1.100 (California, USA)          │
│ Last Edited From: 192.168.1.105                            │
│ Upload IPs:       [Show last 5 IPs]                        │
│ Red Flags:        None                                     │
│ Suspicious Score: 2/100 (Very Low Risk)                    │
│                                                             │
│ Audit Trail:  [View Full Audit Log (27 entries)]           │
│ - Mar 8, 2:30 PM: Updated revenue to $850K                │
│ - Mar 5, 10:15 AM: Approved by Admin Sarah                │
│ - Mar 3, 4:20 PM: Updated growth rate to 45%              │
│ - (showing 3 of 27)                                        │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ ADMIN ACTIONS                                               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ [EDIT LISTING] [VIEW FULL] [DOWNLOAD FILES] [AUDIT LOG]    │
│ [SEND MESSAGE] [REQUEST INFO] [FLAG AS SUSPICIOUS]         │
│ [SUSPEND] [REJECT] [DELETE] [REFUND]                       │
│                                                             │
│ Quick Flag:  [Report Issue] ──> Select reason below        │
│ ☐ Fraudulent data                                          │
│ ☐ Duplicate listing                                        │
│ ☐ Inappropriate content                                    │
│ ☐ KYC concerns                                             │
│ ☐ Other (explain): _____________________________           │
│                                                             │
│ [FLAG IT] [CANCEL]                                         │
└─────────────────────────────────────────────────────────────┘
```

---

## MODULE 2: USER MANAGEMENT

### **Navigation**: Sidebar → Users → Manage

```
╔═════════════════════════════════════════════════════════════╗
║  USER MANAGEMENT                                            ║
╚═════════════════════════════════════════════════════════════╝

┌─────────────────────────────────────────────────────────────┐
│ FILTERS & SEARCH                                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Search by Email: [_______________________]  [SEARCH]      │
│ Search by Name:  [_______________________]  [SEARCH]      │
│ User Type:       ☑ Buyers  ☑ Brokers  ☑ Sellers          │
│ Status:          ☑ Active  ☑ Inactive  ☑ Suspended       │
│ KYC Status:      ☑ Verified  ☑ Pending  ☑ Rejected       │
│ Tier:            ☑ Free  ☑ Premium  ☑ Enterprise         │
│ Signup Date:     From [___/___/___] To [___/___/___]      │
│ Last Active:     Within [7 days v] [14 days v] [30 days v]
│                                                             │
│ [APPLY] [RESET] [EXPORT CSV] [BULK ACTIONS v]             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ USERS TABLE                                                 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ID  | Name           | Email              | Type    | KYC │ │
│─────────────────────────────────────────────────────────────┤
│ 1024| John Doe       | john@example.com   | Seller  | ✓   │ │
│     | Premium • Joined: Mar 1, 2026 • Last: Mar 8, 4:20 PM │ │
│     | Listings: 2 • Views: 287 • Downloads: 4              │ │
│     | [VIEW PROFILE] [MANAGE] [SUSPEND] [MESSAGE]          │ │
│─────────────────────────────────────────────────────────────┤
│ 1023| Jane Smith     | jane@example.com   | Broker  | ✓   │ │
│     | Premium • Joined: Feb 20, 2026 • Last: Mar 8, 3:45 PM│ │
│     | Listings Managed: 5 • Buyers: 127 • Closes: 2        │ │
│     | [VIEW PROFILE] [MANAGE] [SUSPEND] [MESSAGE]          │ │
│─────────────────────────────────────────────────────────────┤
│ 1022| Mike Chen      | mike@example.com   | Buyer   | ✓   │ │
│     | Free • Joined: Mar 5, 2026 • Last: Mar 8, 2:10 PM    │ │
│     | Saved Deals: 12 • Comparisons: 3 • CIMs: 2           │ │
│     | [VIEW PROFILE] [MANAGE] [SUSPEND] [MESSAGE]          │ │
│─────────────────────────────────────────────────────────────┤
│ 1021| Sarah Lee      | sarah@example.com  | Buyer   | 🟡  │ │
│     | Free • Joined: Mar 6, 2026 • Last: Mar 7, 10:30 AM   │ │
│     | Saved Deals: 5 • KYC PENDING (requested info)        │ │
│     | [VIEW PROFILE] [VERIFY KYC] [REJECT KYC] [MESSAGE]  │ │
│─────────────────────────────────────────────────────────────┤
│ 1020| Alex Rodriguez | alex@example.com   | Broker  | 🚩  │ │
│     | Free • Joined: Feb 28, 2026 • Last: Mar 3, 5:15 PM   │ │
│     | Listings Managed: 1 • Flag: Suspicious Activity      │ │
│     | [VIEW PROFILE] [REVIEW] [APPROVE] [REJECT] [SUSPEND] │ │
│                                            Page 1 of 513    │
└─────────────────────────────────────────────────────────────┘
```

### **User Detail View**

```
╔═════════════════════════════════════════════════════════════╗
║  USER PROFILE: John Doe (ID: 1024)                          ║
╚═════════════════════════════════════════════════════════════╝

┌─────────────────────────────────────────────────────────────┐
│ ACCOUNT INFO                                                │
├─────────────────────────────────────────────────────────────┤
│ Name:              John Doe                                 │
│ Email:             john@example.com                        │
│ Phone:             +1 (415) 555-0123                       │
│ User Type:         Seller                                  │
│ Account Status:    ✓ ACTIVE                                │
│ Tier:              PREMIUM (expires: Apr 1, 2026)          │
│ Joined:            Mar 1, 2026                             │
│ Last Login:        Mar 8, 2026 at 4:20 PM                  │
│ IP Address:        192.168.1.100                           │
│ Country:           United States (California)              │
│ Time Zone:         PST (UTC-7)                             │
│ Language:          English                                 │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ KYC VERIFICATION                                            │
├─────────────────────────────────────────────────────────────┤
│ Status:           ✓ VERIFIED (Mar 2, 2026)                 │
│ ID Type:          Passport                                 │
│ ID Number:        [REDACTED SECURE]                        │
│ ID Verified:      ✓ (By: Admin Sarah, Mar 2)               │
│ Proof of Address: ✓ Utility Bill (Feb 2026)                │
│ Business Reg:     ✓ Delaware C-Corp                        │
│ Tax ID:           [REDACTED SECURE]                        │
│ Documents:        [View 4 uploaded documents]              │
│ Risk Score:       LOW (8/100)                              │
│                                                             │
│ [RE-REQUEST INFO] [REJECT KYC] [VIEW DOCUMENTS]            │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ LISTINGS & ACTIVITY                                         │
├─────────────────────────────────────────────────────────────┤
│ Active Listings:   2                                        │
│ • SaaS Platform - Project Management (ID: 487)             │
│ • Healthcare Network (ID: 486)                             │
│                                                             │
│ Total Views:       287                                     │
│ Total Saves:       15                                      │
│ Total Comparisons: 5                                        │
│ CIM Downloads:     4                                       │
│                                                             │
│ Premium Featured:  2x monthly (Last: Mar 8)                │
│ Featured Clicks:   127 views in past week                  │
│                                                             │
│ [VIEW ALL LISTINGS] [VIEW ACTIVITY LOG]                    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ PAYMENT & BILLING                                           │
├─────────────────────────────────────────────────────────────┤
│ Subscription:      Premium ($499/year)                     │
│ Billing Cycle:     Mar 1, 2026 - Feb 28, 2027              │
│ Payment Method:    Visa ending in 4242                     │
│ Status:            ✓ PAID                                  │
│ Last Payment:      Mar 1, 2026 ($499.00)                   │
│                                                             │
│ Revenue Sharing:   0% commission (seller only)             │
│ Total Revenue:     $499.00 (YTD)                           │
│                                                             │
│ [ISSUE REFUND] [UPDATE BILLING] [CHANGE TIER]             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ SECURITY & COMPLIANCE                                       │
├─────────────────────────────────────────────────────────────┤
│ 2FA Enabled:       ✓ YES (Authenticator app)               │
│ Login History:     [View last 10 logins]                   │
│ API Keys:          3 active (last used: Mar 8)             │
│ Sessions:          2 active (logout one session)           │
│ Flagged Activity:  None                                    │
│ Compliance:        ✓ COMPLIANT                             │
│ Last Audit:        Mar 5, 2026                             │
│                                                             │
│ [FORCE LOGOUT ALL] [RESET PASSWORD] [REVOKE API KEYS]     │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ ADMIN ACTIONS                                               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ [SEND MESSAGE] [ISSUE REFUND] [CHANGE TIER] [SUSPEND]     │
│ [RESET PASSWORD] [FORCE LOGOUT] [DELETE ACCOUNT]          │
│ [FLAG FOR REVIEW] [ADD NOTES]                              │
│                                                             │
│ Admin Notes:                                                │
│ ┌─────────────────────────────────────────────────────────┐
│ │ [Add notes about this user]                             │
│ │ ___________________________________________________      │
│ │ ___________________________________________________      │
│ │                                                         │
│ │ [SAVE NOTE]                                            │
│ └─────────────────────────────────────────────────────────┘
└─────────────────────────────────────────────────────────────┘
```

---

## MODULE 3: FRAUD & SUSPICIOUS ACTIVITY

### **Navigation**: Sidebar → Security → Suspicious Activity

```
╔═════════════════════════════════════════════════════════════╗
║  SUSPICIOUS ACTIVITY MONITORING                             ║
╚═════════════════════════════════════════════════════════════╝

┌─────────────────────────────────────────────────────────────┐
│ FLAGGED ITEMS                                               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ 🚩 3 items flagged for review                              │
│                                                             │
│ ────────────────────────────────────────────────────────────┤
│ ID 485 | Digital Marketing Agency (Listing)     [URGENT]  │
│        | Flagged: Mar 7 by System (Suspicious Metrics)    │
│        | Flag Score: 8.2/10 (HIGH RISK)                  │
│        | Owner: Mike Chen (ID: 1025)                      │
│        | Details:                                         │
│        │ • Revenue: $1.8M (claimed 48% growth)           │
│        │ • But only 12 profile views, 0 saves             │
│        │ • IP: 203.0.113.45 (Australia - mismatches       │
│        │   location claim of Seattle, WA)                 │
│        │ • Account created: Mar 5 (brand new)             │
│        │ • Already requesting $2,999 featured tier        │
│        │                                                  │
│        │ Recommended Action: REJECT or REQUEST INFO       │
│        │                                                  │
│        │ [APPROVE] [REQUEST INFO] [REJECT] [INVESTIGATE]│
│                                                             │
│ ────────────────────────────────────────────────────────────┤
│ ID 1020 | Alex Rodriguez (User Account)         [ALERT]   │
│        | Flagged: Mar 3 by System (Unusual Behavior)     │
│        | Flag Score: 6.5/10 (MEDIUM RISK)                │
│        | Account Status: FREE → Requested PREMIUM         │
│        | Details:                                         │
│        │ • Signed up: Feb 28                              │
│        │ • Listings: 1 deal worth $5.2M valuation         │
│        │ • Listed only 2 days after signup                │
│        │ • IP: 198.51.100.50 (Different from signup IP)  │
│        │ • Watching 50+ deals (bot behavior?)             │
│        │ • Uploading large files (8GB in 3 days)          │
│        │                                                  │
│        │ Possible Issues: Reseller account, bot activity, │
│        │                  or stolen account               │
│        │                                                  │
│        │ [APPROVE] [REQUEST INFO] [SUSPEND] [INVESTIGATE]
│                                                             │
│ ────────────────────────────────────────────────────────────┤
│ ID 523 | Duplicate Deal (Listing)               [INFO]    │
│        | Flagged: Mar 5 by Admin System (Duplicate Data)  │
│        | Flag Score: 4.2/10 (LOW RISK)                   │
│        | Details:                                         │
│        │ • Listing 523: "E-commerce Platform" ($2.1M)    │
│        │ • Listing 484: "E-commerce Platform" ($2.1M)    │
│        │ • Same owner, same details, posted twice         │
│        │ • May be accidental duplicate                    │
│        │                                                  │
│        │ [MERGE] [APPROVE BOTH] [DELETE DUPLICATE]       │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ AUTOMATED FRAUD DETECTION                                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ✓ Metric Validation    — Revenue/growth/team size          │
│ ✓ IP Geolocation       — Verify location matches           │
│ ✓ Timing Analysis      — Flag fast-track premium requests  │
│ ✓ Content Duplication  — Find copy-paste listings          │
│ ✓ Payment Fraud        — Check for stolen cards            │
│ ✓ Account Velocity     — New accounts with high activity   │
│ ✓ Bot Detection        — Unusual browsing patterns         │
│ ✓ Network Analysis     — Multiple accounts from same IP    │
│ ✓ Email Verification   — Check for disposable emails       │
│ ✓ KYC Document Check   — Verify ID authenticity           │
│                                                             │
│ Last Scan: Mar 8, 2026 at 4:30 PM                          │
│ Items Flagged This Week: 12                                │
│ Items Approved: 8                                          │
│ Items Rejected: 3                                          │
│ Pending Review: 1                                          │
└─────────────────────────────────────────────────────────────┘
```

---

## MODULE 4: EMAIL MANAGEMENT

### **Navigation**: Sidebar → Communications → Email Campaigns

```
╔═════════════════════════════════════════════════════════════╗
║  EMAIL CAMPAIGN MANAGEMENT                                  ║
╚═════════════════════════════════════════════════════════════╝

┌─────────────────────────────────────────────────────────────┐
│ CAMPAIGNS (This Week)                                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Campaign Name          | Sent   | Type    | Open  | Click │ │
│─────────────────────────────────────────────────────────────┤
│ Weekly Deal Spotlight  | 12,340 | Buyers  | 38.2% | 16.4% │ │
│ Sent: Mar 8 at 9 AM   | Status: COMPLETED                  │ │
│ [VIEW DETAILS] [VIEW RECIPIENTS] [RE-SEND] [CLONE]        │ │
│─────────────────────────────────────────────────────────────┤
│ Broker Deal Flow       | 2,150  | Brokers | 42.1% | 18.2% │ │
│ Sent: Mar 6 at 10 AM  | Status: COMPLETED                  │ │
│ [VIEW DETAILS] [VIEW RECIPIENTS] [RE-SEND] [CLONE]        │ │
│─────────────────────────────────────────────────────────────┤
│ Seller Performance     | 5,630  | Sellers | 35.4% | 14.7% │ │
│ Sent: Mar 5 at 8 AM   | Status: COMPLETED                  │ │
│ [VIEW DETAILS] [VIEW RECIPIENTS] [RE-SEND] [CLONE]        │ │
│─────────────────────────────────────────────────────────────┤
│ Upgrade Promotion      | 1,200  | Free Users | 22.1% | 5.3% │
│ Sent: Mar 3 at 10 AM  | Status: COMPLETED                  │ │
│ [VIEW DETAILS] [ARCHIVE]                                   │ │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ CREATE NEW CAMPAIGN                                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Campaign Type: [Select v]                                   │
│   • Buyer Notification                                      │
│   • Broker Alert                                            │
│   • Seller Update                                           │
│   • Promotional                                             │
│   • Custom/Bulk                                             │
│                                                             │
│ [SELECT RECIPIENTS] [DESIGN EMAIL] [SCHEDULE] [SEND]       │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ TEMPLATES                                                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Buyer Templates:                                            │
│  • Weekly Deal Spotlight (27 variations)                    │
│  • Trending Deals Alert (15 variations)                     │
│  • CIM Downloaded Notification                             │
│  • Buyer Upgrade Offer                                      │
│                                                             │
│ Broker Templates:                                           │
│  • Deal Flow Summary (22 variations)                        │
│  • Buyer Activity Alert                                     │
│  • Listing Performance Report                              │
│                                                             │
│ Seller Templates:                                           │
│  • Weekly Performance Update (18 variations)                │
│  • Buyer Interest Alert                                     │
│  • Premium Upgrade Pitch                                    │
│                                                             │
│ [CREATE NEW TEMPLATE] [EDIT TEMPLATE] [DUPLICATE]          │
└─────────────────────────────────────────────────────────────┘
```

### **Email Campaign Details**

```
╔═════════════════════════════════════════════════════════════╗
║  CAMPAIGN: Weekly Deal Spotlight (Mar 8, 2026)              ║
╚═════════════════════════════════════════════════════════════╝

┌─────────────────────────────────────────────────────────────┐
│ BASIC INFO                                                  │
├─────────────────────────────────────────────────────────────┤
│ Campaign Name:     Weekly Deal Spotlight                   │
│ Type:              Buyer Notification                      │
│ Template:          Weekly Spotlight v2.3                   │
│ Sent:              Mar 8, 2026 at 9:00 AM PST              │
│ Sent By:           System (Automated)                      │
│ Recipients:        12,340 buyers (targeted)                │
│ Status:            ✓ COMPLETED                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ PERFORMANCE                                                 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Sent:              12,340                                  │
│ Delivered:         12,298 (99.7%)                          │
│ Bounced:           42 (0.3%)                               │
│ Opened:            4,706 (38.2%)                           │
│ Clicked:           2,029 (16.4%)                           │
│ Unsubscribed:      38 (0.3%)                               │
│ Reported Spam:     2 (0.02%)                               │
│                                                             │
│ Charts: [Opens Over Time] [Click Heatmap] [Unsubscribe Trend]
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ CONTENT                                                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Subject: "Your perfect match: SaaS Platform +45% growth"   │
│ From:    "Forward OS" <notifications@forwardos.com>        │
│                                                             │
│ [PREVIEW EMAIL] [VIEW FULL HTML]                           │
│                                                             │
│ CTAs Tracked:                                               │
│ • [VIEW CIM DASHBOARD] — 847 clicks                        │
│ • [SAVE FOR LATER] — 312 clicks                            │
│ • [COMPARE] — 234 clicks                                   │
│ • [PREFERENCES] — 89 clicks                                │
│ • Unsubscribe link — 38 clicks                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ RECIPIENT INSIGHTS                                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Segmentation Used:                                          │
│ • Buyers (user_type = 'buyer')                             │
│ • Premium tier OR active last 30 days                      │
│ • Saved filters matching sent deals                        │
│                                                             │
│ Top Opening Countries:                                     │
│ 1. United States - 3,420 opens                             │
│ 2. Canada - 890 opens                                      │
│ 3. United Kingdom - 234 opens                              │
│                                                             │
│ [VIEW ALL RECIPIENTS] [EXPORT RECIPIENT LIST]              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ ACTIONS                                                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ [RE-SEND TO NON-OPENERS] [EXPORT METRICS] [VIEW IN CMS]    │
│ [ARCHIVE] [DELETE]                                          │
└─────────────────────────────────────────────────────────────┘
```

---

## MODULE 5: ACTIVITY MONITORING

### **Navigation**: Sidebar → Insights → Activity Log

```
╔═════════════════════════════════════════════════════════════╗
║  ACTIVITY MONITORING                                        ║
╚═════════════════════════════════════════════════════════════╝

┌─────────────────────────────────────────────────────────────┐
│ REAL-TIME ACTIVITY STREAM                                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Time     | User            | Action                | Details │
│──────────────────────────────────────────────────────────────│
│ 4:32 PM  | Jane Smith #1023| Viewed Deal #487      | SaaS Plat
│ 4:31 PM  | Mike Chen #1022 | Saved Deal #486       | Healthcare
│ 4:30 PM  | System          | Sent Email Campaign   | 12.3K users
│ 4:29 PM  | John Doe #1024  | Updated Listing #487  | New revenue
│ 4:28 PM  | Sarah Lee #1021 | Downloaded CIM        | Deal #487
│ 4:25 PM  | Admin Sarah     | Approved User #1021   | KYC verified
│ 4:20 PM  | Mike Chen #1022 | Ran Comparison        | 3 deals
│ 4:15 PM  | System          | Auto-flag Listing #523| Duplicate
│ 4:10 PM  | Jane Smith #1023| Sent Message          | Deal #487
│ 4:05 PM  | John Doe #1024  | Logged In             | IP: 192.168
│                                            (showing latest 10)
│ [LOAD MORE] [FILTER] [EXPORT CSV]                          │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ FILTERS                                                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Action Type:   ☑ Logins  ☑ Views  ☑ Downloads  ☑ Messages
│                ☑ Uploads ☑ Edits  ☑ Flags  ☑ Approvals    │
│ User:          [_________________]  [SEARCH]               │
│ User Type:     ☑ Buyers ☑ Brokers ☑ Sellers ☑ Admins    │
│ Time Range:    From [Mar 1] To [Mar 8]                    │
│                                                             │
│ [APPLY] [RESET] [EXPORT]                                   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ ANALYTICS                                                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ This Week's Activity:                                       │
│ • Total Logins: 8,234 (↑12% vs last week)                 │
│ • Total Deals Viewed: 45,120 (↑8%)                         │
│ • Total Comparisons: 2,345 (↑15%)                          │
│ • CIM Downloads: 567 (↑22%)                               │
│ • Messages Sent: 3,421 (↑5%)                               │
│ • New Listings: 127 (↑3%)                                  │
│                                                             │
│ Top Activities (7-day avg):                                │
│ 1. View Deal (58%) — Most common action                    │
│ 2. Save Deal (22%)                                         │
│ 3. Run Comparison (10%)                                    │
│ 4. Download CIM (6%)                                       │
│ 5. Message Seller (4%)                                     │
│                                                             │
│ [VIEW DETAILED CHARTS] [EXPORT REPORT]                    │
└─────────────────────────────────────────────────────────────┘
```

---

## MODULE 6: REPORTS & ANALYTICS

### **Navigation**: Sidebar → Reports → Dashboard

```
╔═════════════════════════════════════════════════════════════╗
║  REPORTS & ANALYTICS                                        ║
╚═════════════════════════════════════════════════════════════╝

┌─────────────────────────────────────────────────────────────┐
│ PRE-BUILT REPORTS                                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Executive Dashboard                                         │
│ └─ KPIs, trends, revenue, growth                           │
│    [VIEW] [DOWNLOAD PDF] [EMAIL DAILY]                    │
│                                                             │
│ User Growth Report                                          │
│ └─ New users, by type, activation, retention               │
│    [VIEW] [DOWNLOAD CSV] [SCHEDULE WEEKLY]                │
│                                                             │
│ Listing Health Report                                       │
│ └─ Approvals, suspensions, fraud, quality scores           │
│    [VIEW] [DOWNLOAD] [EMAIL TO SUPPORT]                   │
│                                                             │
│ Revenue Report                                              │
│ └─ Premium subscriptions, featured listings, MRR           │
│    [VIEW] [DOWNLOAD] [EXPORT ACCOUNTING]                  │
│                                                             │
│ Email Performance Report                                    │
│ └─ Campaigns, opens, clicks, conversions, unsubscribes    │
│    [VIEW] [DOWNLOAD] [SHARE WITH MARKETING]               │
│                                                             │
│ Fraud & Compliance Report                                   │
│ └─ Flagged items, investigations, resolutions              │
│    [VIEW] [DOWNLOAD] [ARCHIVE]                            │
│                                                             │
│ Support Tickets Report                                      │
│ └─ Volume, resolution time, satisfaction                   │
│    [VIEW] [DOWNLOAD] [EMAIL TO SUPPORT]                   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ CUSTOM REPORT BUILDER                                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Report Name: [_________________________]                    │
│ Data Source: [SELECT: Users/Listings/Emails/Activity]      │
│ Metrics:     [SELECT: ☑ ☑ ☑ ☑] (choose 2-10)             │
│ Dimensions:  [SELECT: ☑ ☑ ☑] (group by)                   │
│ Date Range:  From [___/___/___] To [___/___/___]           │
│ Filter:      [_________________________]                    │
│ Schedule:    [ONCE] [DAILY] [WEEKLY] [MONTHLY]             │
│ Export:      [PDF] [CSV] [EXCEL] [JSON]                    │
│ Recipients:  [admin@forward.com, marketing@forward.com]    │
│                                                             │
│ [CREATE] [PREVIEW] [SAVE AS TEMPLATE]                     │
└─────────────────────────────────────────────────────────────┘
```

---

## MODULE 7: SUPPORT TICKET MANAGEMENT

### **Navigation**: Sidebar → Support → Tickets

```
╔═════════════════════════════════════════════════════════════╗
║  SUPPORT TICKET MANAGEMENT                                  ║
╚═════════════════════════════════════════════════════════════╝

┌─────────────────────────────────────────────────────────────┐
│ QUEUE OVERVIEW                                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ 🔴 URGENT: 2 (Waiting response >4 hours)                   │
│ 🟡 HIGH:   5 (Waiting response >2 hours)                   │
│ 🟢 NORMAL: 12 (Waiting response >24 hours)                 │
│ ⚪ LOW:    23 (Waiting response, < 24 hours)               │
│                                                             │
│ Total Open: 42 | Closed This Week: 38 | Avg Resolution: 4h
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ TICKETS                                                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ID   | Ticket                    | User         | Priority │ │
│─────────────────────────────────────────────────────────────┤
│ #547 | Can't download CIM        | Mike Chen    | 🔴 URGENT│ │
│      | Created: Mar 8, 12:30 PM | Waiting: 4h 02m         │ │
│      | [VIEW DETAILS] [ASSIGN TO ME] [RESOLVE]            │ │
│─────────────────────────────────────────────────────────────┤
│ #546 | Listing not showing premium| Jane Smith   | 🔴 URGENT│ │
│      | Created: Mar 8, 12:15 PM | Waiting: 4h 17m         │ │
│      | [VIEW DETAILS] [ASSIGN TO ME] [RESOLVE]            │ │
│─────────────────────────────────────────────────────────────┤
│ #545 | Questions about KYC       | Sarah Lee    | 🟡 HIGH  │ │
│      | Created: Mar 8, 10:45 AM | Waiting: 5h 47m         │ │
│      | [VIEW DETAILS] [ASSIGN TO ME] [RESPOND]            │ │
│─────────────────────────────────────────────────────────────┤
│ (showing 3 of 42 open tickets)                              │ │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ TICKET DETAIL: #547 — Can't download CIM                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Status:       OPEN (Created: Mar 8, 12:30 PM)              │
│ Priority:     🔴 URGENT (Waiting 4h 2m)                    │
│ User:         Mike Chen (ID: 1022) [Buyer]                │
│ Category:     Technical Issue                              │
│ Email:        mike@example.com                             │
│                                                             │
│ Issue Description:                                          │
│ "I tried to download the CIM for the SaaS Platform deal    │
│  (#487) but got an error: 'File download failed'.          │
│  I've tried 3 times in the last hour."                     │
│                                                             │
│ Attachments: [Screenshot_error.png] [Browser_console.log] │
│                                                             │
│ Internal Notes:                                             │
│ "Checked deal #487 — CIM files are in S3. User's           │
│  subscription is valid. Issue likely on our end. Database  │
│  query shows slow response time for file list."            │
│                                                             │
│ [RESPOND] [RESOLVE] [ESCALATE] [CLOSE]                    │
│                                                             │
│ Response Template:                                          │
│ Hi Mike,                                                    │
│ Thank you for reporting this. We've identified a slowness  │
│ in our file serving system. This should be resolved within │
│ 15 minutes. Please try again.                              │
│ Best,                                                       │
│ Support Team                                                │
│                                                             │
│ [SEND RESPONSE] [SAVE DRAFT]                               │
└─────────────────────────────────────────────────────────────┘
```

---

## MODULE 8: SYSTEM SETTINGS & PERMISSIONS

### **Navigation**: Sidebar → Admin → Settings

```
╔═════════════════════════════════════════════════════════════╗
║  ADMIN SETTINGS & PERMISSIONS                               ║
╚═════════════════════════════════════════════════════════════╝

┌─────────────────────────────────────────────────────────────┐
│ ADMIN USERS                                                 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Admin            | Email                | Role      | 2FA  │ │
│─────────────────────────────────────────────────────────────┤
│ Sarah Chen       | sarah@forward.com    | Admin     | ✓   │ │
│ (Your account)   | Last login: Mar 8    | Full access     │ │
│                  | [EDIT PERMISSIONS]                      │ │
│─────────────────────────────────────────────────────────────┤
│ Tom Wilson       | tom@forward.com      | Moderator | ✓   │ │
│                  | Last login: Mar 7    |           │     │ │
│                  | [EDIT PERMISSIONS] [SUSPEND] [REMOVE]  │ │
│─────────────────────────────────────────────────────────────┤
│ Lisa Johnson     | lisa@forward.com     | Support   | ✓   │ │
│                  | Last login: Mar 8    |           │     │ │
│                  | [EDIT PERMISSIONS] [SUSPEND] [REMOVE]  │ │
│                                                             │
│ [INVITE NEW ADMIN] [AUDIT LOG]                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ ROLE PERMISSIONS                                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ADMIN (Full Access)                                         │
│ ☑ View All Users      ☑ Approve Listings   ☑ Manage Users │
│ ☑ View All Listings   ☑ Flag Suspicious    ☑ Edit Settings│
│ ☑ View All Activities ☑ Delete Content     ☑ Invite Admins│
│ ☑ View All Emails     ☑ Issue Refunds      ☑ View Audits  │
│ ☑ Send Messages       ☑ Manage Tickets     ☑ Export Data  │
│                                                             │
│ MODERATOR (Limited)                                         │
│ ☑ View All Users      ☑ Approve Listings   ☐ Manage Users │
│ ☑ View All Listings   ☑ Flag Suspicious    ☐ Edit Settings│
│ ☑ View Activities     ☐ Delete Content     ☐ Invite Admins│
│ ☐ View Emails         ☐ Issue Refunds      ☐ View Audits  │
│ ☑ Send Messages       ☑ Manage Tickets     ☐ Export Data  │
│                                                             │
│ SUPPORT (Most Limited)                                      │
│ ☑ View User Details   ☐ Approve Listings   ☐ Manage Users │
│ ☐ View Listings       ☐ Flag Suspicious    ☐ Edit Settings│
│ ☐ View Activities     ☐ Delete Content     ☐ Invite Admins│
│ ☐ View Emails         ☑ Issue Refunds      ☐ View Audits  │
│ ☑ Send Messages       ☑ Manage Tickets     ☐ Export Data  │
│                                                             │
│ [CUSTOMIZE ROLES] [CREATE NEW ROLE]                        │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ SYSTEM CONFIGURATION                                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Email Settings:                                             │
│ From Email: notifications@forwardos.com                    │
│ SMTP Server: mail.sendgrid.net                             │
│ Bounce Handling: Auto-unsubscribe on hard bounce ☑         │
│                                                             │
│ Fraud Detection:                                            │
│ Auto-flag threshold: 5/10 risk score ☑                    │
│ Require manual approval for >5/10 ☑                       │
│ IP geolocation check: Enabled ☑                           │
│ Bot detection: Enabled ☑                                  │
│                                                             │
│ Payment Processing:                                         │
│ Stripe integration: Connected ✓                            │
│ Auto-refund on user request: ☑                            │
│ Chargeback protection: Enabled ☑                          │
│                                                             │
│ Data & Privacy:                                             │
│ GDPR Compliance: ✓                                         │
│ Data Retention: 180 days (configurable)                   │
│ Audit Logging: Enabled ☑                                  │
│ PII Masking in logs: Enabled ☑                            │
│                                                             │
│ [SAVE SETTINGS] [RESET TO DEFAULT]                         │
└─────────────────────────────────────────────────────────────┘
```

---

## DATABASE SCHEMA ADDITIONS

### **New Admin Tables**

```sql
-- Admin audit trail
CREATE TABLE admin_logs (
  id UUID PRIMARY KEY,
  admin_id UUID REFERENCES users(id),
  action VARCHAR(255),           -- 'approved_listing', 'suspended_user', 'sent_email', etc.
  resource_type VARCHAR(100),    -- 'listing', 'user', 'email', etc.
  resource_id UUID,
  details JSONB,                 -- Store all relevant data about the action
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  INDEX (admin_id, created_at),
  INDEX (resource_type, resource_id)
);

-- Flagged content & activity
CREATE TABLE flagged_content (
  id UUID PRIMARY KEY,
  content_type VARCHAR(100),    -- 'listing', 'user', 'message'
  content_id UUID,
  flag_reason VARCHAR(255),
  flag_score DECIMAL(3,1),      -- 0-10 risk score
  flagged_by VARCHAR(100),      -- 'system', admin_id, or 'user'
  flagged_at TIMESTAMP DEFAULT NOW(),
  status VARCHAR(50),           -- 'pending', 'approved', 'rejected'
  resolved_by UUID REFERENCES users(id),
  resolved_at TIMESTAMP,
  notes TEXT,
  INDEX (status, created_at),
  INDEX (content_type)
);

-- Support tickets
CREATE TABLE support_tickets (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  category VARCHAR(100),
  subject TEXT,
  description TEXT,
  priority VARCHAR(50),         -- 'urgent', 'high', 'normal', 'low'
  status VARCHAR(50),           -- 'open', 'in_progress', 'resolved', 'closed'
  assigned_to UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP,
  resolved_at TIMESTAMP,
  INDEX (status, priority),
  INDEX (assigned_to)
);

-- Email campaigns
CREATE TABLE email_campaigns (
  id UUID PRIMARY KEY,
  campaign_name VARCHAR(255),
  template_id UUID,
  recipient_count INT,
  sent_count INT,
  delivered_count INT,
  bounced_count INT,
  opened_count INT,
  clicked_count INT,
  unsubscribed_count INT,
  reported_spam_count INT,
  created_by UUID REFERENCES users(id),
  sent_at TIMESTAMP,
  scheduled_for TIMESTAMP,
  status VARCHAR(50),           -- 'draft', 'scheduled', 'sending', 'completed'
  metadata JSONB,
  INDEX (status, sent_at)
);

-- Activity tracking
CREATE TABLE user_activities (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  activity_type VARCHAR(100),   -- 'view', 'save', 'compare', 'download_cim', 'send_message', 'login'
  resource_type VARCHAR(100),
  resource_id UUID,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  INDEX (user_id, created_at),
  INDEX (activity_type)
);
```

---

## API ENDPOINTS (Backend Requirements)

```typescript
// Admin User Management API
GET    /api/admin/users                    // List all users with filters
GET    /api/admin/users/:id                // Get user details
PUT    /api/admin/users/:id                // Update user info
POST   /api/admin/users/:id/suspend        // Suspend user
POST   /api/admin/users/:id/unsuspend      // Unsuspend user
DELETE /api/admin/users/:id                // Delete user (with audit)

// Admin Listing Management API
GET    /api/admin/listings                 // List all listings
GET    /api/admin/listings/:id             // Get listing details
PUT    /api/admin/listings/:id             // Update listing
POST   /api/admin/listings/:id/approve     // Approve listing
POST   /api/admin/listings/:id/reject      // Reject listing
POST   /api/admin/listings/:id/flag        // Flag as suspicious
POST   /api/admin/listings/:id/featured    // Toggle featured status

// Admin Email Management API
GET    /api/admin/email-campaigns          // List campaigns
GET    /api/admin/email-campaigns/:id      // Get campaign details
POST   /api/admin/email-campaigns          // Create new campaign
POST   /api/admin/email-campaigns/:id/send // Send campaign
GET    /api/admin/email-templates          // List templates
POST   /api/admin/email-templates          // Create template

// Admin Activity Tracking API
GET    /api/admin/activities               // List all activities
GET    /api/admin/activities/user/:id      // User-specific activities
GET    /api/admin/audit-log                // Admin action audit log

// Admin Fraud & Suspicious Content API
GET    /api/admin/flagged-content          // List flagged items
POST   /api/admin/flagged-content/:id/resolve
GET    /api/admin/fraud-scores/:id         // Get fraud score for content

// Admin Support Tickets API
GET    /api/admin/tickets                  // List open tickets
GET    /api/admin/tickets/:id              // Get ticket details
PUT    /api/admin/tickets/:id              // Update ticket
POST   /api/admin/tickets/:id/assign       // Assign to admin
POST   /api/admin/tickets/:id/resolve      // Mark resolved
POST   /api/admin/tickets/:id/close        // Close ticket

// Admin Reports API
GET    /api/admin/reports/:type            // Get pre-built report
POST   /api/admin/reports/custom           // Create custom report
GET    /api/admin/metrics                  // Dashboard metrics
```

---

## IMPLEMENTATION ROADMAP

### **Phase 1: Core Listing & User Management (Weeks 1-2)**
- [ ] Listing approval workflow
- [ ] User management (view, suspend, delete)
- [ ] KYC verification management
- [ ] Basic audit logging

### **Phase 2: Fraud & Compliance (Weeks 2-3)**
- [ ] Suspicious activity detection
- [ ] Manual flagging & review system
- [ ] Fraud scoring algorithm
- [ ] Compliance reporting

### **Phase 3: Email & Communications (Week 3)**
- [ ] Email campaign management
- [ ] Template management
- [ ] Campaign analytics
- [ ] Bulk communication tools

### **Phase 4: Support & Tickets (Week 4)**
- [ ] Support ticket system
- [ ] Assignment workflow
- [ ] Ticket templates
- [ ] Performance analytics

### **Phase 5: Reporting & Analytics (Week 4-5)**
- [ ] Pre-built reports
- [ ] Custom report builder
- [ ] Dashboard metrics
- [ ] Data export tools

### **Phase 6: Advanced Features (Week 5+)**
- [ ] Automated actions (auto-approve, auto-flag)
- [ ] Batch operations
- [ ] API rate limiting
- [ ] Advanced fraud detection ML models

---

## SECURITY & COMPLIANCE

### **Access Control**
- ✅ Role-based access control (RBAC)
- ✅ Admin authentication (SSO + 2FA)
- ✅ IP whitelisting (optional)
- ✅ Session timeout (15 minutes)

### **Audit & Compliance**
- ✅ Full audit trail of all admin actions
- ✅ Data retention policies
- ✅ GDPR compliance (right to be forgotten)
- ✅ PII masking in logs
- ✅ Encrypted sensitive data in DB

### **Security Best Practices**
- ✅ All APIs require authentication
- ✅ Rate limiting on admin endpoints
- ✅ CSRF protection
- ✅ SQL injection prevention
- ✅ XSS protection

---

## SUMMARY

This **Admin Console** gives your operations team:
- ✅ Full visibility into all users, listings, and activities
- ✅ Approval workflows for listings and KYC
- ✅ Fraud detection & suspicious activity management
- ✅ Email campaign management with analytics
- ✅ Support ticket system with assignment
- ✅ Comprehensive reporting & analytics
- ✅ Role-based access control & audit logging
- ✅ System configuration & settings management

**Ready to launch in 5 weeks with phased rollout.**

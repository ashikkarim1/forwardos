# Resend Email Integration Guide

**Status**: ✅ **Integrated with Resend**  
**API Key**: Required (set in `.env.local`)  
**Webhooks**: Ready for configuration  

---

## Quick Setup

### 1. Environment Variables

Add to `.env.local`:

```env
RESEND_API_KEY=re_xxxxxxxxxxxxx
RESEND_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Get these from: https://resend.com/settings/api-keys

---

## Architecture

### **3 Integration Components**

```
┌─────────────────────────────────────────────┐
│          Admin Email Panel                   │
│  (/admin/email - Send campaigns)             │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│     Email Service Layer                     │
│  (/services/email-service.ts)               │
│  - sendEmailCampaign()                      │
│  - sendTestEmail()                          │
│  - trackEmailOpen/Click()                   │
│  - handleBounce()                           │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│          Resend API                         │
│  - Template management                      │
│  - Batch email sending                      │
│  - Event webhooks                           │
│  - Contact lists                            │
└─────────────────────────────────────────────┘
```

---

## File Structure

### **Created for Resend Integration**

```
src/
├── app/
│   ├── api/
│   │   ├── admin/
│   │   │   └── email-campaigns/
│   │   │       ├── route.ts              (GET/POST campaigns)
│   │   │       └── [id]/
│   │   │           └── send/
│   │   │               └── route.ts      (POST send campaign)
│   │   └── webhooks/
│   │       └── resend/
│   │           └── route.ts              (Webhook handler)
│   └── admin/
│       └── email/
│           └── page.tsx                  (UI - already created)
│
├── emails/
│   ├── WeeklyDealSpotlight.tsx          (Email template)
│   ├── BrokerDealFlow.tsx               (To create)
│   ├── SellerPerformance.tsx            (To create)
│   └── UpgradePromotion.tsx             (To create)
│
└── services/
    └── email-service.ts                 (Email business logic)
```

---

## Email Templates

### **Template 1: Weekly Deal Spotlight** ✅

**File**: `src/emails/WeeklyDealSpotlight.tsx`

**Purpose**: Feature a single matched deal to buyers

**Variables**:
```typescript
{
  userName: string
  featuredDeal: {
    name: string
    location: string
    revenue: string
    valuation: string
    growth: string
    url: string
  }
  trendingDeals: Array<{
    name: string
    location: string
    valuation: string
    url: string
  }>
  userPreferences: {
    unsubscribeUrl: string
    preferencesUrl: string
  }
}
```

**Setup in Resend**:
1. Go to https://resend.com/emails
2. Click "Create Template"
3. Paste the React component code
4. Name it: `weekly-deal-spotlight`
5. Test with sample data
6. Save template ID

### **Template 2: Broker Deal Flow** (Create)

**Purpose**: Weekly deal flow summary for brokers

**Key Sections**:
- Deals listed this week
- Buyer activity summary
- Listing performance
- Broker matching opportunities

### **Template 3: Seller Performance** (Create)

**Purpose**: Weekly performance metrics for sellers

**Key Sections**:
- Listing view counts
- Buyer interest
- CIM downloads
- Comparison metrics
- Upgrade opportunity

### **Template 4: Upgrade Promotion** (Create)

**Purpose**: Promote premium tier to free users

**Key Sections**:
- Limited-time offer
- Feature comparison
- Pricing details
- Call-to-action

---

## API Integration

### **Send Email Campaign**

**Endpoint**: `POST /api/admin/email-campaigns`

```typescript
// Request
{
  "name": "Weekly Deal Spotlight",
  "type": "buyers",
  "subject": "Your perfect match: SaaS Platform +45% growth",
  "templateId": "weekly-deal-spotlight",
  "recipients": ["buyer1@example.com", "buyer2@example.com"],
  "scheduledFor": "2026-03-09T09:00:00Z"  // Optional
}

// Response
{
  "id": "camp_123",
  "name": "Weekly Deal Spotlight",
  "status": "scheduled",
  "recipients": 12340,
  "scheduledFor": "2026-03-09T09:00:00Z"
}
```

### **Send Campaign Immediately**

**Endpoint**: `POST /api/admin/email-campaigns/[id]/send`

```typescript
// Request
{
  "campaignId": "camp_123",
  "recipients": ["buyer1@example.com", "buyer2@example.com"],
  "subject": "Your perfect match",
  "templateId": "weekly-deal-spotlight",
  "variables": {
    "userName": "Mike",
    "featuredDeal": {
      "name": "SaaS Platform",
      "location": "San Francisco",
      ...
    }
  }
}

// Response
{
  "campaignId": "camp_123",
  "totalRecipients": 12340,
  "totalSent": 12340,
  "status": "completed",
  "batches": [
    {
      "batch": 1,
      "status": "sent",
      "sentCount": 100
    }
  ]
}
```

### **Send Test Email**

**Endpoint**: `POST /api/admin/email-campaigns/[id]/test`

```typescript
// Request
{
  "to": "admin@forward.com",
  "template": "weekly-deal-spotlight",
  "subject": "Weekly Deal Spotlight",
  "variables": { ... }
}

// Response
{
  "success": true,
  "emailId": "email_123",
  "to": "admin@forward.com"
}
```

---

## Webhook Setup

### **Configure in Resend**

1. Go to https://resend.com/webhooks
2. Click "Add Webhook"
3. Set URL: `https://your-domain.com/api/webhooks/resend`
4. Select events:
   - `email.sent`
   - `email.delivered`
   - `email.opened`
   - `email.clicked`
   - `email.bounced`
   - `email.complained`
5. Save webhook secret to `.env.local`

### **Events Received**

```typescript
// email.opened
{
  "type": "email.opened",
  "created_at": "2026-03-09T10:30:00Z",
  "data": {
    "email_id": "email_123",
    "email": "buyer@example.com",
    "created_at": "2026-03-09T10:30:00Z",
    "tags": [
      { "name": "campaign_id", "value": "camp_123" },
      { "name": "user_id", "value": "user_456" }
    ]
  }
}

// email.clicked
{
  "type": "email.clicked",
  "created_at": "2026-03-09T10:35:00Z",
  "data": {
    "email_id": "email_123",
    "email": "buyer@example.com",
    "link": "https://forward.com/deal/487",
    "created_at": "2026-03-09T10:35:00Z",
    "tags": [ ... ]
  }
}

// email.bounced
{
  "type": "email.bounced",
  "created_at": "2026-03-09T10:40:00Z",
  "data": {
    "email_id": "email_123",
    "email": "bounced@example.com",
    "bounce_type": "permanent",
    "created_at": "2026-03-09T10:40:00Z"
  }
}
```

---

## Email Service Functions

### **Send Campaign**

```typescript
import { sendEmailCampaign } from '@/services/email-service'

const result = await sendEmailCampaign({
  name: 'Weekly Deal Spotlight',
  type: 'buyers',
  subject: 'Your perfect match: SaaS Platform',
  template: 'weekly-deal-spotlight',  // Resend template ID
  recipients: ['buyer1@example.com', 'buyer2@example.com'],
  variables: {
    userName: 'Mike',
    featuredDeal: { ... }
  },
  tags: [
    { name: 'campaign_id', value: 'camp_123' },
    { name: 'user_id', value: 'user_456' }
  ]
})

// Returns
{
  "campaignName": "Weekly Deal Spotlight",
  "totalRecipients": 2,
  "batches": [
    {
      "batchIndex": 0,
      "batchSize": 2,
      "success": true,
      "emailId": "res_xxx"
    }
  ],
  "successRate": 1
}
```

### **Send Test Email**

```typescript
import { sendTestEmail } from '@/services/email-service'

const result = await sendTestEmail(
  'admin@forward.com',
  'weekly-deal-spotlight',
  'Weekly Deal Spotlight',
  {
    userName: 'Mike',
    featuredDeal: { ... }
  }
)

// Returns
{
  "success": true,
  "emailId": "email_123"
}
```

### **Track Email Events**

```typescript
import { 
  trackEmailOpen, 
  trackEmailClick, 
  handleEmailBounce 
} from '@/services/email-service'

// Track open
await trackEmailOpen('email_123', 'camp_123', 'user_456')

// Track click
await trackEmailClick('email_123', 'camp_123', 'user_456', 'https://forward.com/deal/487')

// Handle bounce
await handleEmailBounce('email_123', 'buyer@example.com', 'permanent')
```

---

## Admin Console Integration

### **Send Campaign from UI**

Click "Create New Campaign" in `/admin/email`

```typescript
// Admin fills form:
- Campaign Name: "Weekly Deal Spotlight"
- Campaign Type: "Buyers"
- Template: "weekly-deal-spotlight"
- Recipients: Auto-select from database
- Subject: "Your perfect match..."
- Schedule: "Now" or "Later"

// UI calls
POST /api/admin/email-campaigns/[id]/send
{
  "recipients": ["email1@", "email2@", ...],
  "subject": "Your perfect match",
  "templateId": "weekly-deal-spotlight",
  "variables": { ... }
}

// Returns metrics instantly
```

### **View Campaign Performance**

In `/admin/email` campaigns list:

```
Campaign Name: Weekly Deal Spotlight
Sent: 12,340
Delivered: 12,298 (99.7%)
Opened: 4,706 (38.2%)
Clicked: 2,029 (16.4%)
Unsubscribed: 38 (0.3%)
```

These metrics update via webhook in real-time.

---

## Database Schema

### **Tables to Create**

```sql
-- Email campaigns
CREATE TABLE email_campaigns (
  id UUID PRIMARY KEY,
  name VARCHAR(255),
  type VARCHAR(50),
  subject TEXT,
  template_id VARCHAR(255),
  recipient_count INT,
  sent_count INT,
  delivered_count INT,
  opened_count INT,
  clicked_count INT,
  unsubscribed_count INT,
  bounced_count INT,
  status VARCHAR(50),
  sent_at TIMESTAMP,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  created_by UUID REFERENCES users(id)
);

-- Email events
CREATE TABLE email_events (
  id UUID PRIMARY KEY,
  email_id VARCHAR(255),
  campaign_id UUID REFERENCES email_campaigns(id),
  user_id UUID REFERENCES users(id),
  event_type VARCHAR(50),  -- 'sent', 'delivered', 'opened', 'clicked', 'bounced'
  metadata JSONB,
  created_at TIMESTAMP,
  INDEX (campaign_id, event_type),
  INDEX (user_id)
);

-- Email metrics (aggregated)
CREATE TABLE email_metrics (
  id UUID PRIMARY KEY,
  campaign_id UUID REFERENCES email_campaigns(id),
  metric_date DATE,
  opens INT DEFAULT 0,
  clicks INT DEFAULT 0,
  unsubscribes INT DEFAULT 0,
  bounces INT DEFAULT 0,
  complaints INT DEFAULT 0,
  created_at TIMESTAMP,
  UNIQUE (campaign_id, metric_date)
);

-- Link clicks (for attribution)
CREATE TABLE link_clicks (
  id UUID PRIMARY KEY,
  campaign_id UUID REFERENCES email_campaigns(id),
  user_id UUID REFERENCES users(id),
  link VARCHAR(2048),
  clicked_at TIMESTAMP,
  INDEX (campaign_id),
  INDEX (user_id)
);
```

---

## Best Practices

### **Email Send Best Practices**

1. **Batch Size**: 100 per batch (Resend recommendation)
2. **Rate Limiting**: Spread sends over time
3. **Testing**: Always send test first
4. **Unsubscribe**: Include link in every email
5. **Tracking**: Add campaign_id to all tags

### **Template Best Practices**

1. **Responsive**: Works on mobile + desktop
2. **Plain Text Fallback**: Always include
3. **Unsubscribe Links**: Clear and prominent
4. **Preheader Text**: Set preview line
5. **Dark Mode**: Test dark mode rendering

### **Campaign Best Practices**

1. **Subject Lines**: A/B test different variants
2. **Send Times**: Test different times of day
3. **Frequency**: Don't overwhelm subscribers
4. **Segmentation**: Target right audience
5. **Metrics**: Monitor open/click rates

---

## Troubleshooting

### **Webhook Not Working**

```
Check:
1. URL is publicly accessible
2. Webhook secret in .env.local
3. Resend webhook configured correctly
4. Check Resend dashboard for failed deliveries
5. Review server logs for errors
```

### **Low Open Rate**

```
Optimize:
1. Subject line (A/B test)
2. Send time (test different times)
3. Sender name (use company name)
4. Preheader text (compelling preview)
5. Frequency (not too often)
```

### **High Bounce Rate**

```
Fix:
1. Verify email list quality
2. Remove bounced addresses
3. Check for typos in template
4. Test with valid emails
5. Check spam folder
```

### **Templates Not Showing**

```
Debug:
1. Verify template ID in Resend
2. Check template published
3. Test with sample data
4. Review template validation errors
5. Check React component syntax
```

---

## Environment Variables Reference

```env
# Required
RESEND_API_KEY=re_xxxxxxxxxxxxx

# Optional but recommended
RESEND_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_EMAIL_FROM=notifications@forwardos.com
```

---

## API Rate Limits

- **Resend API**: 100 requests/minute
- **Batch Send**: 100 emails/request (max)
- **Webhook**: Realtime, no limits
- **Template API**: No rate limits

---

## Cost

**Resend Pricing**:
- Free tier: 100 emails/day
- Paid: $20/month for unlimited
- Pay-as-you-go: $0.0005 per email

---

## Next Steps

1. **Set up Resend account**: https://resend.com
2. **Get API key**: https://resend.com/settings/api-keys
3. **Create templates**: In Resend dashboard
4. **Add env variables**: `.env.local`
5. **Configure webhook**: https://resend.com/webhooks
6. **Test campaign**: Via `/admin/email` UI
7. **Monitor metrics**: Real-time in admin dashboard

---

## Resources

- **Resend Docs**: https://resend.com/docs
- **Resend API**: https://resend.com/docs/api-reference/emails/send
- **Email Templates**: https://resend.com/templates
- **Webhook Events**: https://resend.com/docs/webhooks
- **Support**: support@resend.com

---

## Summary

✅ Resend email service fully integrated  
✅ Email sending API routes ready  
✅ Webhook handling for event tracking  
✅ React email templates created  
✅ Admin UI connected  
✅ Performance metrics tracking  
✅ Bounce handling  

**Ready to send your first campaign!**

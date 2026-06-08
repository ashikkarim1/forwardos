# Forward OS - Frontend Integration Guide

## Overview
This guide shows how to connect the frontend dashboards and pages to the completed backend API endpoints.

---

## 1. Buyer Dashboard Integration

### Current State: Mock Data
- Location: `/src/app/dashboard/buyer/v2/page.tsx`
- Features: Discover Deals, My Data Room Access, Messages, My Profile tabs
- Data Status: **Using mockFeaturedDeals & mockDataRoomAccess**

### Integration Steps:

#### Step 1: Replace Mock Deals with API Call
```typescript
// BEFORE: Using mockFeaturedDeals
const [deals, setDeals] = useState<Deal[]>(mockFeaturedDeals)

// AFTER: Using API
useEffect(() => {
  const fetchDeals = async () => {
    const response = await fetch('/api/deals?status=PUBLISHED')
    const data = await response.json()
    setDeals(data.deals)
  }
  fetchDeals()
}, [])
```

#### Step 2: Add Search Functionality
```typescript
const handleSearch = async (query: string) => {
  const response = await fetch(`/api/deals/search?q=${query}&status=PUBLISHED`)
  const data = await response.json()
  setDeals(data.deals)
}
```

#### Step 3: Fetch Real Data Room Access
```typescript
useEffect(() => {
  const fetchAccess = async () => {
    const response = await fetch('/api/dataroom/requests?buyerId=currentUserId')
    const data = await response.json()
    setDataRoomAccess(data.requests)
  }
  fetchAccess()
}, [])
```

#### Step 4: Load Seriousness Scores
```typescript
useEffect(() => {
  deals.forEach(deal => {
    fetch(`/api/intelligence/seriousness-score?buyerId=currentUserId&dealId=${deal.id}`)
      .then(r => r.json())
      .then(data => {
        setSeriousnessScores(prev => ({
          ...prev,
          [deal.id]: data.seriousness.score
        }))
      })
  })
}, [deals])
```

---

## 2. Seller Dashboard Integration

### Current State: Mock Data
- Location: `/src/app/dashboard/seller/v2/page.tsx`
- Features: Inbox (requests/messages), Deals, Analytics, Settings
- Data Status: **Using mockDataRoomRequests & mockDeals**

### Integration Steps:

#### Step 1: Fetch Seller's Published Deals
```typescript
useEffect(() => {
  const fetchDeals = async () => {
    const response = await fetch('/api/deals?sellerId=currentUserId&status=PUBLISHED')
    const data = await response.json()
    setDeals(data.deals)
  }
  fetchDeals()
}, [])
```

#### Step 2: Load Data Room Requests (Inbox)
```typescript
useEffect(() => {
  const fetchRequests = async () => {
    const response = await fetch('/api/dataroom/requests?sellerId=currentUserId')
    const data = await response.json()
    setRequests(data.requests)
  }
  fetchRequests()
}, [])
```

#### Step 3: Load Heat Maps for Analytics
```typescript
useEffect(() => {
  const fetchHeatMaps = async () => {
    const response = await fetch('/api/intelligence/heat-maps?sellerId=currentUserId')
    const data = await response.json()
    setHeatMaps(data.heatMaps)
  }
  fetchHeatMaps()
}, [])
```

#### Step 4: Load Close Probabilities
```typescript
useEffect(() => {
  const fetchProbabilities = async () => {
    const response = await fetch('/api/intelligence/close-probability?sellerId=currentUserId')
    const data = await response.json()
    setProbabilities(data.probabilities)
  }
  fetchProbabilities()
}, [])
```

#### Step 5: Handle Deal Publish
```typescript
const publishDeal = async (dealId: string) => {
  try {
    const response = await fetch(`/api/deals/${dealId}/publish`, {
      method: 'POST',
    })
    const data = await response.json()
    setPublishedDeal(data.deal)
    showToast('Deal published successfully!')
  } catch (error) {
    showToast('Failed to publish deal: ' + error.message)
  }
}
```

#### Step 6: Approve/Decline Data Room Requests
```typescript
const approveRequest = async (requestId: string) => {
  const response = await fetch('/api/dataroom/requests/approve', {
    method: 'PUT',
    body: JSON.stringify({ requestId })
  })
  const data = await response.json()
  showToast('Request approved. NDA sent to buyer.')
  refreshRequests()
}

const declineRequest = async (requestId: string, reason: string) => {
  const response = await fetch('/api/dataroom/requests/decline', {
    method: 'PUT',
    body: JSON.stringify({ requestId, reason })
  })
  showToast('Request declined.')
  refreshRequests()
}
```

---

## 3. Broker Dashboard Integration

### Current State: Mock Data
- Location: `/src/app/dashboard/broker/v2/page.tsx`
- Features: Inbox, Client Deals, Commissions, Analytics
- Data Status: **Using mock client deals & commission data**

### Integration Steps:

#### Step 1: Fetch Broker's Client Deals
```typescript
// Assuming broker has delegated authority from sellers
useEffect(() => {
  const fetchDelegations = async () => {
    const response = await fetch('/api/dataroom/requests?brokerId=currentUserId')
    const data = await response.json()
    setDelegations(data.requests)
  }
  fetchDelegations()
}, [])
```

#### Step 2: Approve Data Room Requests (If Delegated)
```typescript
const approveDealAccess = async (requestId: string) => {
  const response = await fetch('/api/dataroom/requests/approve', {
    method: 'PUT',
    body: JSON.stringify({ requestId })
  })
  showToast('Access approved.')
  refreshRequests()
}
```

---

## 4. Intelligence Pages Integration

### Heat Maps Page
**Location:** `/src/app/intelligence/disclosure/page.tsx` (or new heat-map page)

```typescript
useEffect(() => {
  const fetchHeatMaps = async () => {
    const response = await fetch(`/api/intelligence/heat-maps?sellerId=${userId}`)
    const data = await response.json()
    setHeatMaps(data.heatMaps)
  }
  fetchHeatMaps()
}, [userId])
```

### Deal Pipeline Page
**Location:** `/src/app/deal-pipeline/page.tsx`

```typescript
useEffect(() => {
  const fetchDeals = async () => {
    const response = await fetch('/api/deals?sellerId=currentUserId')
    const data = await response.json()
    // Map deals to Kanban stages based on status
    const stages = mapDealsToStages(data.deals)
    setStages(stages)
  }
  fetchDeals()
}, [])

// Map deal status to Kanban stage
const mapDealsToStages = (deals: Deal[]) => {
  return {
    lead: deals.filter(d => d.status === 'DRAFT'),
    qualified: deals.filter(d => d.status === 'KYC_COMPLETE'),
    negotiation: deals.filter(d => d.status === 'UNDER_NDA'),
    loi: deals.filter(d => d.status === 'NEGOTIATING'),
    closing: deals.filter(d => d.status === 'CLOSED'),
  }
}
```

### Outreach Page
**Location:** `/src/app/outreach/page.tsx`

```typescript
// Send message through in-system messaging
const sendOutreach = async (buyerId: string, content: string, dealId: string) => {
  // First check KYC status
  const kyc = await fetch(`/api/users/kyc`).then(r => r.json())
  if (kyc.user.kycStatus !== 'VERIFIED') {
    showToast('Please complete KYC verification before contacting buyers')
    return
  }
  
  // Send message
  const response = await fetch('/api/messages', {
    method: 'POST',
    body: JSON.stringify({
      receiverId: buyerId,
      content,
      dealId
    })
  })
  const data = await response.json()
  showToast('Message sent!')
}
```

### Analytics Page
**Location:** `/src/app/analytics/page.tsx`

```typescript
useEffect(() => {
  const fetchAnalytics = async () => {
    const response = await fetch(`/api/engagement/session?dealId=${dealId}`)
    const data = await response.json()
    setAnalytics({
      totalViews: data.sessions.reduce((sum, s) => sum + s.pagesViewed, 0),
      totalTime: data.sessions.reduce((sum, s) => sum + s.totalTimeMinutes, 0),
      topPages: aggregatePageTimes(data.sessions),
      returningVisitors: data.sessions.filter(s => s.returningVisitor).length,
    })
  }
  fetchAnalytics()
}, [dealId])
```

---

## 5. Common Patterns & Utilities

### Authentication Hook
```typescript
// Create this utility to check KYC before sensitive actions
export const useKYCGate = () => {
  const [kycStatus, setKycStatus] = useState(null)
  
  useEffect(() => {
    fetch('/api/users/kyc')
      .then(r => r.json())
      .then(data => setKycStatus(data.user.kycStatus))
  }, [])
  
  return {
    isVerified: kycStatus === 'VERIFIED',
    status: kycStatus,
    canMessage: kycStatus === 'VERIFIED',
    canAccessDataRoom: kycStatus === 'VERIFIED',
  }
}
```

### Deal Status Mapper
```typescript
export const dealStatusLabels = {
  DRAFT: '📝 Draft',
  KYC_PENDING: '⏳ KYC Pending',
  KYC_COMPLETE: '✅ KYC Complete',
  PUBLISHED: '🚀 Published',
  UNDER_NDA: '🔐 Under NDA',
  NEGOTIATING: '💬 Negotiating',
  CLOSED: '✔️ Closed',
  WITHDRAWN: '❌ Withdrawn',
}

export const dealStatusColor = {
  DRAFT: 'gray',
  KYC_PENDING: 'yellow',
  KYC_COMPLETE: 'green',
  PUBLISHED: 'blue',
  UNDER_NDA: 'purple',
  NEGOTIATING: 'orange',
  CLOSED: 'green',
  WITHDRAWN: 'red',
}
```

### Request Status Handler
```typescript
export const requestStatusLabels = {
  PENDING: '⏳ Pending Approval',
  APPROVED: '✅ Approved',
  NDA_SIGNED: '🔐 NDA Signed',
  ACCESSING: '👁️ Active Access',
  DECLINED: '❌ Declined',
  EXPIRED: '⏱️ Expired',
  INFO_REQUESTED: '📋 Info Needed',
}
```

---

## 6. Error Handling Strategy

### Global Error Handler
```typescript
const handleApiError = (error: any) => {
  if (error.status === 401) {
    // Redirect to login
    window.location.href = '/auth/signin'
  } else if (error.status === 403) {
    showToast('You do not have permission to access this')
  } else if (error.status === 400) {
    showToast(error.message || 'Invalid request')
  } else if (error.status === 500) {
    showToast('Server error. Please try again.')
  }
}
```

### API Wrapper
```typescript
export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  try {
    const response = await fetch(endpoint, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })
    
    if (!response.ok) {
      throw {
        status: response.status,
        message: (await response.json()).error,
      }
    }
    
    return await response.json()
  } catch (error) {
    handleApiError(error)
    throw error
  }
}
```

---

## 7. Real-Time Updates (Phase 2)

Once WebSocket is implemented, add live updates:

```typescript
// Example: Real-time view notifications
useEffect(() => {
  const socket = io('/api/socket')
  
  socket.on('deal:view', (data) => {
    // Seller gets notified when buyer views data room
    showNotification(`${data.buyerName} is viewing your deal`)
    updateHeatMapInRealTime(data.dealId)
  })
  
  socket.on('message:new', (data) => {
    // New message received
    showNotification(`New message from ${data.senderName}`)
    updateConversation(data)
  })
  
  return () => socket.disconnect()
}, [])
```

---

## 8. Testing API Endpoints

### Using cURL:
```bash
# Get all published deals
curl http://localhost:3000/api/deals?status=PUBLISHED

# Create new deal
curl -X POST http://localhost:3000/api/deals \
  -H "Content-Type: application/json" \
  -d '{"title":"My Company","industry":"SaaS","estimatedValuation":5000000}'

# Get heat maps
curl http://localhost:3000/api/intelligence/heat-maps

# Calculate close probability
curl -X POST http://localhost:3000/api/intelligence/close-probability \
  -H "Content-Type: application/json" \
  -d '{"dealId":"deal-123"}'
```

### Using Postman:
1. Import the API endpoints from swagger/OpenAPI spec (to be generated)
2. Set environment variables for `baseUrl` and `userId`
3. Test authentication flows (signup → login → publish deal → request access)

---

## 9. Performance Optimization Tips

1. **Implement SWR/React Query for caching:**
```typescript
import useSWR from 'swr'

const { data: deals } = useSWR('/api/deals?status=PUBLISHED', fetcher)
```

2. **Use pagination for large datasets:**
```typescript
const [page, setPage] = useState(1)
const fetchDeals = async () => {
  const response = await fetch(`/api/deals?page=${page}&limit=20`)
  // ...
}
```

3. **Implement infinite scroll for lists:**
```typescript
const [items, setItems] = useState([])
const [hasMore, setHasMore] = useState(true)

const loadMore = async () => {
  const response = await fetch(`/api/deals?page=${page}&limit=20`)
  setItems(prev => [...prev, ...response.deals])
  setHasMore(response.deals.length === 20)
}
```

---

## 10. Migration Checklist

- [ ] Replace all mock data imports with API calls
- [ ] Implement error handling for all API calls
- [ ] Add loading states to all data-fetching sections
- [ ] Implement KYC gate on sensitive operations
- [ ] Add optimistic updates for better UX
- [ ] Implement real-time updates with WebSocket
- [ ] Add proper TypeScript types for all API responses
- [ ] Create API utility functions to avoid duplication
- [ ] Implement caching strategy (SWR/React Query)
- [ ] Test all critical user flows end-to-end

---

## API Response Type Definitions

### Deal Type
```typescript
interface Deal {
  id: string
  title: string
  description?: string
  industry: string
  location?: string
  estimatedValuation: number
  annualRevenue?: number
  status: 'DRAFT' | 'KYC_PENDING' | 'KYC_COMPLETE' | 'PUBLISHED' | 'UNDER_NDA' | 'NEGOTIATING' | 'CLOSED' | 'WITHDRAWN'
  sellerId: string
  kycIdentityVerified?: boolean
  kycDocumentsVerified?: boolean
  kycAiVerified?: boolean
  publishedAt?: Date
  createdAt: Date
}
```

### DataRoomRequest Type
```typescript
interface DataRoomRequest {
  id: string
  dealId: string
  buyerId: string
  sellerId: string
  status: 'PENDING' | 'APPROVED' | 'NDA_SIGNED' | 'ACCESSING' | 'DECLINED' | 'EXPIRED'
  requestedAt: Date
  approvedAt?: Date
  declinedAt?: Date
  expiresAt?: Date
  approvalReason?: string
  declineReason?: string
}
```

### HeatMap Type
```typescript
interface HeatMap {
  dealId: string
  title: string
  industry: string
  temperature: number // 0-100
  heatLabel: string
  metrics: {
    views: number
    inquiries: number
    messages: number
    total: number
  }
  industryMultiplier: string
  timeToClose: string
}
```

---

## Estimated Integration Effort

| Component | Complexity | Time |
|-----------|------------|------|
| Buyer Dashboard | Medium | 4-6 hours |
| Seller Dashboard | High | 6-8 hours |
| Broker Dashboard | Medium | 4-6 hours |
| Intelligence Pages | High | 8-10 hours |
| Messaging | Medium | 4-6 hours |
| Error Handling | Low | 2-3 hours |
| Testing | High | 8-12 hours |
| **TOTAL** | — | **36-51 hours** |

---

## Next Steps

1. Start with one component (e.g., Buyer Dashboard)
2. Implement all API calls for that component
3. Add proper error handling
4. Test thoroughly with sample data
5. Move to next component
6. Repeat until all components are integrated
7. Implement WebSocket for real-time features
8. Performance testing and optimization

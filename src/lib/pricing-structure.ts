// Complete pricing and gating structure for Forward OS
// Includes buyers, sellers, and brokers

// ==================== SELLER TIERS ====================

export enum SellerTier {
  FREE = 'free',
  PREMIUM = 'premium',
}

export const SELLER_PRICING = {
  [SellerTier.FREE]: {
    name: 'Free Listing',
    price: 0,
    currency: 'USD',
    billingPeriod: 'lifetime',
    features: [
      'Basic business listing',
      'Up to 3 photos',
      'Basic information display',
      'Listing duration: 90 days',
      'Limited to 1 listing',
    ],
    gating: {
      newsletter: false,
      featuredSection: false,
      professionalPhotography: false,
      brokerMatching: false,
      analyticsAccess: false,
      cimHosting: false,
      prioritySupport: false,
    },
    description: 'Start with a basic listing to test the platform',
  },
  [SellerTier.PREMIUM]: {
    name: 'Premium Listing',
    price: 499,
    currency: 'USD',
    billingPeriod: 'annual',
    monthlyPrice: 49,
    features: [
      'Unlimited business listings',
      'Professional photography (up to 20 photos)',
      'Weekly newsletter feature (rotating)',
      'Featured section on landing page',
      'Seller + Broker visibility (both get email)',
      'Enhanced CIM hosting & security',
      'Broker network matching',
      'Real-time analytics dashboard',
      'Priority email support',
      'Listing duration: 365 days (auto-renew)',
      'SEO optimization',
      'Social media promotion package',
    ],
    gating: {
      newsletter: true,
      featuredSection: true,
      professionalPhotography: true,
      brokerMatching: true,
      analyticsAccess: true,
      cimHosting: true,
      prioritySupport: true,
    },
    description: 'Maximum visibility to find the right buyer faster',
  },
}

// ==================== BUYER TIERS ====================

export enum BuyerTier {
  STARTER = 'starter',
  PROFESSIONAL = 'professional',
  ENTERPRISE = 'enterprise',
}

export const BUYER_PRICING = {
  [BuyerTier.STARTER]: {
    name: 'Starter',
    monthlyPrice: 499,
    annualPrice: 499, // 15% discount applied
    currency: 'USD',
    features: [
      'Access to all listings (free + premium)',
      'Basic business information',
      'Advanced search & filters (10 categories)',
      'Deal heat scores & success probability',
      'Deal comparison (up to 3)',
      'PDF export for partners',
      'Basic financial metrics',
      'Saved searches & alerts',
      'Email support',
      'Monthly digest newsletter',
    ],
    gating: {
      premiumCIMs: false,
      advancedAnalytics: false,
      financialModeling: false,
      apiAccess: false,
      dealComparisons: 3,
      prioritySupport: false,
    },
    maxDealComparisons: 3,
    apiCallsPerMonth: 0,
  },
  [BuyerTier.PROFESSIONAL]: {
    name: 'Professional',
    monthlyPrice: 1999,
    annualPrice: 1999, // 15% discount applied
    currency: 'USD',
    features: [
      'Everything in Starter +',
      'Full access to premium listing CIMs',
      'Financial modeling tools (DCF, SDE, ROI)',
      'Deal comparison (up to 5)',
      'Portfolio dashboard & tracking',
      'AI-powered recommendations',
      'Comparables database access',
      'API access (10,000 calls/month)',
      'Priority support',
      'Discussion threads per deal',
      'Weekly featured deal brief',
      'Custom alerts & filters',
    ],
    gating: {
      premiumCIMs: true,
      advancedAnalytics: true,
      financialModeling: true,
      apiAccess: true,
      dealComparisons: 5,
      prioritySupport: true,
    },
    maxDealComparisons: 5,
    apiCallsPerMonth: 10000,
  },
  [BuyerTier.ENTERPRISE]: {
    name: 'Enterprise',
    monthlyPrice: 0, // Custom
    annualPrice: 0,
    currency: 'USD',
    features: [
      'Everything in Professional +',
      'Unlimited deal comparisons',
      'Unlimited API access',
      'Custom integrations',
      'White-label marketplace',
      'Dedicated account manager',
      'Custom reporting & analytics',
      'Institutional API tier',
      'Advanced pipeline analytics',
      'Priority phone support (24/7)',
      'Custom onboarding & training',
      'Exclusive deal sourcing',
    ],
    gating: {
      premiumCIMs: true,
      advancedAnalytics: true,
      financialModeling: true,
      apiAccess: true,
      dealComparisons: -1, // Unlimited
      prioritySupport: true,
    },
    maxDealComparisons: -1, // Unlimited
    apiCallsPerMonth: -1, // Unlimited
  },
}

// ==================== BROKER TIERS ====================

export enum BrokerTier {
  STANDARD = 'standard',
  PREMIUM = 'premium',
}

export const BROKER_PRICING = {
  [BrokerTier.STANDARD]: {
    name: 'Standard Broker',
    commission: 0.02, // 2% of deal value
    features: [
      'Access to buyer network',
      'Deal facilitation tools',
      'Basic analytics',
      'Email support',
      'Monthly broker digest',
    ],
  },
  [BrokerTier.PREMIUM]: {
    name: 'Premium Broker',
    commission: 0.025, // 2.5% of deal value
    features: [
      'Everything in Standard +',
      'API access for deal data',
      'Advanced analytics dashboard',
      'Priority support',
      'Featured broker badge',
      'Co-marketing opportunities',
      'Exclusive deal flow',
      'White-label integration',
    ],
  },
}

// ==================== GATING RULES ====================

export const CONTENT_GATING = {
  // What sellers can access
  seller: {
    basicListing: ['free', 'premium'],
    professionalPhotography: ['premium'],
    cimHosting: ['premium'],
    newsletterFeature: ['premium'],
    featuredLanding: ['premium'],
    brokerMatching: ['premium'],
    analytics: ['premium'],
    prioritySupport: ['premium'],
  },

  // What buyers can access
  buyer: {
    basicListings: ['starter', 'professional', 'enterprise'],
    premiumListings: ['starter', 'professional', 'enterprise'],
    premiumCIMs: ['professional', 'enterprise'],
    advancedFilters: ['starter', 'professional', 'enterprise'],
    dealComparison: ['starter', 'professional', 'enterprise'],
    financialModeling: ['professional', 'enterprise'],
    apiAccess: ['professional', 'enterprise'],
    prioritySupport: ['professional', 'enterprise'],
    weeklyBrief: ['professional', 'enterprise'],
  },

  // What brokers can access
  broker: {
    buyerNetwork: ['standard', 'premium'],
    dealFacilitation: ['standard', 'premium'],
    analytics: ['standard', 'premium'],
    apiAccess: ['premium'],
    coMarketing: ['premium'],
    featuredBadge: ['premium'],
  },
}

// ==================== REGIONAL PRICING ADJUSTMENTS ====================

export enum Region {
  US = 'us',
  CANADA = 'ca',
  UAE = 'ae',
}

export const REGIONAL_MULTIPLIERS = {
  [Region.US]: 1.0,
  [Region.CANADA]: 1.35,
  [Region.UAE]: 1.1, // 10% premium for UAE (more conservative than 20%)
}

// ==================== FEATURES BY REGION ====================

export const REGIONAL_FEATURES = {
  [Region.US]: {
    supportLanguages: ['en'],
    supportCurrency: ['USD'],
    listingTypes: ['general'],
    verificationRequired: true,
  },
  [Region.CANADA]: {
    supportLanguages: ['en', 'fr'],
    supportCurrency: ['CAD'],
    listingTypes: ['general', 'franchises'],
    verificationRequired: true,
  },
  [Region.UAE]: {
    supportLanguages: ['en', 'ar'],
    supportCurrency: ['AED'],
    listingTypes: ['general', 'franchises', 'sharia-compliant'],
    verificationRequired: true, // Extra verification for UAE
    verificationPartner: 'adgm', // Abu Dhabi Global Market
  },
}

// ==================== NEWSLETTER & PROMOTIONAL STRATEGY ====================

export const NEWSLETTER_CONFIG = {
  frequency: 'weekly',
  dayOfWeek: 'Monday',
  timeUtc: '08:00', // 8 AM UTC

  featuredListingsPerWeek: 3, // 3 premium listings featured

  recipients: {
    buyers: {
      starter: false, // Optional: only featured deal brief
      professional: true,
      enterprise: true,
    },
    sellers: {
      free: false,
      premium: true, // Sellers get copy of newsletter featuring them
    },
    brokers: {
      standard: true,
      premium: true,
    },
  },

  content: {
    headerMessage: 'This Week\'s Featured Premium Businesses',
    listingDetailsIncluded: [
      'Professional photos (5-8 best images)',
      'Business overview (2-3 sentences)',
      'Key metrics (valuation, revenue, growth)',
      'Why it\'s a great opportunity',
      'Call-to-action link',
      'Broker contact info',
    ],
    footerMessage: 'Buyers - Click to view full listing. Sellers/Brokers - Your business is featured!',
  },

  emailFlow: {
    sellerNotification: {
      subject: '🎉 Your Business is Featured in This Week\'s Forward OS Newsletter!',
      body: 'Your premium listing for [Business Name] is being featured to {X} verified buyers this week. Here\'s exactly what we\'re sending out...',
      includesScreenshot: true,
    },
    brokerNotification: {
      subject: '📊 Featured Deal Alert: [Business Name] Going to {X} Verified Buyers',
      body: 'Your managed listing [Business Name] is featured to {X} professional buyers this week...',
      includesScreenshot: true,
    },
  },
}

// ==================== PRICING PAGE DISPLAY ====================

export const PRICING_DISPLAY = {
  showSellerTiers: true,
  showBuyerTiers: true,
  showBrokerInfo: true,
  comparisonTableEnabled: true,
  regionalPricingSelector: true,
  billingToggle: {
    enableMonthly: true,
    enableAnnual: true,
    annualDiscount: 0.15, // 15% discount
  },
}

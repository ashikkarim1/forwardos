// Office locations and contact information for Forward OS

export interface OfficeLocation {
  country: string
  city: string
  region: string
  address: string
  phone: string
  email: string
  timezone: string
  businessHours: string
  currency: string
  locale: 'en' | 'fr' | 'ar'
}

export const officeLocations: Record<string, OfficeLocation> = {
  // United States - Primary office
  us: {
    country: 'United States',
    city: 'San Francisco',
    region: 'California',
    address: '123 Market Street, San Francisco, CA 94102, USA',
    phone: '+1-888-FORWARD-1',
    email: 'hello@forwardos.ai',
    timezone: 'America/Los_Angeles',
    businessHours: 'Mon-Fri, 9:00 AM - 6:00 PM PT',
    currency: 'USD',
    locale: 'en',
  },

  // Canada - Toronto office
  ca: {
    country: 'Canada',
    city: 'Toronto',
    region: 'Ontario',
    address: '456 Bloor Street West, Toronto, ON M5S 1X8, Canada',
    phone: '+1-888-FORWARD-1',
    email: 'hello-ca@forwardos.ai',
    timezone: 'America/Toronto',
    businessHours: 'Mon-Fri, 9:00 AM - 6:00 PM ET',
    currency: 'CAD',
    locale: 'fr',
  },

  // UAE - Dubai office
  ae: {
    country: 'United Arab Emirates',
    city: 'Dubai',
    region: 'Dubai',
    address: 'Building A1, Dubai Digital Park, Dubai Silicon Oasis, Dubai, United Arab Emirates',
    phone: '+971-4-XXX-XXXX',
    email: 'hello-ae@forwardos.ai',
    timezone: 'Asia/Dubai',
    businessHours: 'Sat-Thu, 9:00 AM - 6:00 PM GST',
    currency: 'AED',
    locale: 'ar',
  },
}

// Get office location by locale
export function getOfficeByLocale(locale: 'en' | 'fr' | 'ar'): OfficeLocation {
  if (locale === 'fr') return officeLocations.ca
  if (locale === 'ar') return officeLocations.ae
  return officeLocations.us
}

// Get office location by country code
export function getOfficeByCountry(countryCode: string): OfficeLocation {
  const code = countryCode.toLowerCase()
  return officeLocations[code] || officeLocations.us
}

// Get all office locations
export function getAllOffices(): OfficeLocation[] {
  return Object.values(officeLocations)
}

// Format office address for display
export function formatOfficeAddress(office: OfficeLocation): string {
  return `${office.address}`
}

// Format contact info
export function formatContactInfo(office: OfficeLocation): string {
  return `
${office.city}, ${office.region}
${office.phone}
${office.email}
${office.businessHours}
  `.trim()
}

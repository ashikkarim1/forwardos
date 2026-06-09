/**
 * Country Data - Area Codes and Phone Formats
 * Used for seller/broker registration phone number validation
 */

export interface CountryInfo {
  name: string
  code: string // ISO 3166-1 alpha-2
  areaCode: string // +1, +1, +971, +20, etc.
  phoneFormat: string // Display format (e.g., "+1 (555) 123-4456")
  phoneRegex: string // Regex pattern for validation
  examplePhone: string // Example phone number
}

export const COUNTRIES: CountryInfo[] = [
  {
    name: 'United States',
    code: 'US',
    areaCode: '+1',
    phoneFormat: '+1 (555) 123-4456',
    phoneRegex: '^(\\+1)?[- ]?\\(?([0-9]{3})\\)?[- ]?([0-9]{3})[- ]?([0-9]{4})$|^[0-9]{10}$',
    examplePhone: '+1 (555) 123-4456',
  },
  {
    name: 'Canada',
    code: 'CA',
    areaCode: '+1',
    phoneFormat: '+1 (555) 123-4456',
    phoneRegex: '^(\\+1)?[- ]?\\(?([0-9]{3})\\)?[- ]?([0-9]{3})[- ]?([0-9]{4})$|^[0-9]{10}$',
    examplePhone: '+1 (555) 123-4456',
  },
  {
    name: 'United Arab Emirates',
    code: 'AE',
    areaCode: '+971',
    phoneFormat: '+971 50 123 4567',
    phoneRegex: '^(\\+971|0)?[- ]?([0-9]{2})[- ]?([0-9]{3})[- ]?([0-9]{4})$',
    examplePhone: '+971 50 123 4567',
  },
  {
    name: 'Saudi Arabia',
    code: 'SA',
    areaCode: '+966',
    phoneFormat: '+966 50 123 4567',
    phoneRegex: '^(\\+966|0)?[- ]?([0-9]{2})[- ]?([0-9]{3})[- ]?([0-9]{4})$',
    examplePhone: '+966 50 123 4567',
  },
  {
    name: 'Egypt',
    code: 'EG',
    areaCode: '+20',
    phoneFormat: '+20 100 123 4567',
    phoneRegex: '^(\\+20)?[- ]?([0-9]{3})[- ]?([0-9]{3})[- ]?([0-9]{4})$',
    examplePhone: '+20 100 123 4567',
  },
  {
    name: 'Kuwait',
    code: 'KW',
    areaCode: '+965',
    phoneFormat: '+965 9999 9999',
    phoneRegex: '^(\\+965)?[- ]?([0-9]{4})[- ]?([0-9]{4})$',
    examplePhone: '+965 9999 9999',
  },
  {
    name: 'Qatar',
    code: 'QA',
    areaCode: '+974',
    phoneFormat: '+974 3312 3456',
    phoneRegex: '^(\\+974)?[- ]?([0-9]{4})[- ]?([0-9]{4})$',
    examplePhone: '+974 3312 3456',
  },
  {
    name: 'Bahrain',
    code: 'BH',
    areaCode: '+973',
    phoneFormat: '+973 3366 1234',
    phoneRegex: '^(\\+973)?[- ]?([0-9]{4})[- ]?([0-9]{4})$',
    examplePhone: '+973 3366 1234',
  },
  {
    name: 'Oman',
    code: 'OM',
    areaCode: '+968',
    phoneFormat: '+968 9123 4567',
    phoneRegex: '^(\\+968)?[- ]?([0-9]{4})[- ]?([0-9]{4})$',
    examplePhone: '+968 9123 4567',
  },
  {
    name: 'United Kingdom',
    code: 'GB',
    areaCode: '+44',
    phoneFormat: '+44 20 7946 0958',
    phoneRegex: '^(\\+44|0)?[- ]?([0-9]{2,4})[- ]?([0-9]{3,4})[- ]?([0-9]{3,4})$',
    examplePhone: '+44 20 7946 0958',
  },
  {
    name: 'Australia',
    code: 'AU',
    areaCode: '+61',
    phoneFormat: '+61 2 1234 5678',
    phoneRegex: '^(\\+61|0)?[- ]?([0-9]{1,2})[- ]?([0-9]{3,4})[- ]?([0-9]{4})$',
    examplePhone: '+61 2 1234 5678',
  },
]

/**
 * Get country by code
 */
export const getCountryByCode = (code: string): CountryInfo | undefined => {
  return COUNTRIES.find((c) => c.code === code)
}

/**
 * Get country by name
 */
export const getCountryByName = (name: string): CountryInfo | undefined => {
  return COUNTRIES.find((c) => c.name === name)
}

/**
 * Validate phone number for a country
 */
export const validatePhoneForCountry = (phone: string, countryCode: string): boolean => {
  const country = getCountryByCode(countryCode)
  if (!country) return false

  const regex = new RegExp(country.phoneRegex)
  return regex.test(phone)
}

/**
 * Format phone number for display
 */
export const formatPhoneDisplay = (phone: string, countryCode: string): string => {
  const country = getCountryByCode(countryCode)
  if (!country) return phone

  // Remove all non-digits except leading +
  const cleaned = phone.replace(/[^\d+]/g, '')

  // Return cleaned phone with country's area code
  if (!cleaned.startsWith('+')) {
    return `${country.areaCode}${cleaned}`
  }
  return cleaned
}

/**
 * Get placeholder hint showing remaining digits to enter
 */
export const getPhonePlaceholder = (countryCode: string): string => {
  const country = getCountryByCode(countryCode)
  if (!country) return 'Enter phone number'

  // Show the area code + hint about remaining digits
  // Extract just the digits portion of the example
  const exampleWithoutPrefix = country.examplePhone.replace(country.areaCode, '').trim()
  return `${country.areaCode} ${exampleWithoutPrefix}`
}

/**
 * Get sorted list of countries for dropdown
 */
export const getSortedCountries = (): CountryInfo[] => {
  return [...COUNTRIES].sort((a, b) => a.name.localeCompare(b.name))
}

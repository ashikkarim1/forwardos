// Currency support for USD, CAD, AED
export type Currency = 'USD' | 'CAD' | 'AED'

// Exchange rates (updated periodically - these are approximate)
const exchangeRates: Record<Currency, number> = {
  USD: 1.0,
  CAD: 1.35, // 1 USD = 1.35 CAD
  AED: 3.67, // 1 USD = 3.67 AED
}

const currencySymbols: Record<Currency, string> = {
  USD: '$',
  CAD: 'C$',
  AED: 'د.إ',
}

const currencyNames: Record<Currency, string> = {
  USD: 'US Dollars',
  CAD: 'Canadian Dollars',
  AED: 'UAE Dirhams',
}

export function convertCurrency(amount: number, fromCurrency: Currency = 'USD', toCurrency: Currency = 'USD'): number {
  if (fromCurrency === toCurrency) return amount

  // Convert to base (USD)
  const inUSD = amount / exchangeRates[fromCurrency]
  // Convert to target
  return inUSD * exchangeRates[toCurrency]
}

export function formatCurrency(amount: number, currency: Currency = 'USD', locale: string = 'en-US'): string {
  const symbol = currencySymbols[currency]
  const converted = convertCurrency(amount, 'USD', currency)

  // Format based on currency
  if (currency === 'AED') {
    // Arabic decimal formatting
    return `${symbol} ${converted.toLocaleString('ar-AE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
  }

  return `${symbol} ${converted.toLocaleString(locale, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
}

export function getCurrencySymbol(currency: Currency): string {
  return currencySymbols[currency]
}

export function getCurrencyName(currency: Currency): string {
  return currencyNames[currency]
}

// Default currencies by locale
export function getDefaultCurrency(locale: string): Currency {
  if (locale === 'fr') return 'CAD'
  if (locale === 'ar') return 'AED'
  return 'USD'
}

// Stat values for homepage
export const statValues = {
  market: 2500000000000, // $2.5T
  deals: 500,
  accuracy: 91,
  moat: 24,
}

// Format stat values with currency
export function formatStat(key: keyof typeof statValues, currency: Currency = 'USD'): string {
  const value = statValues[key]

  if (key === 'market') {
    const converted = convertCurrency(value, 'USD', currency)
    if (converted >= 1000000000000) {
      return `${getCurrencySymbol(currency)}${(converted / 1000000000000).toFixed(1)}T`
    }
    return `${getCurrencySymbol(currency)}${converted}`
  }

  return String(value)
}

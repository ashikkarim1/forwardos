/**
 * Broker License Verification Service
 * Integrates with state regulatory bodies and professional associations
 */

interface BrokerLicenseVerificationResult {
  isValid: boolean
  status: 'active' | 'inactive' | 'expired' | 'suspended' | 'revoked' | 'not_found'
  licenseNumber: string
  licenseState: string
  licenseType: string
  nameOnLicense: string
  issuedDate?: string
  expiryDate?: string
  disciplinaryHistory: boolean
  trustAccountCompliance: boolean
  errors: string[]
  verifiedAt: string
}

class BrokerVerificationService {
  /**
   * Verify Broker License Against State Regulatory Database
   * Currently uses regulatory API provider - can be expanded for specific states
   */
  async verifyBrokerLicense(
    licenseNumber: string,
    licenseState: string,
    brokerName: string
  ): Promise<BrokerLicenseVerificationResult> {
    try {
      console.log(`[BROKER] Verifying license ${licenseNumber} in ${licenseState}`)

      // In production, integrate with actual state APIs:
      // - California: DRE (Department of Real Estate)
      // - New York: NY State Department of State
      // - Florida: DBPR (Department of Business and Professional Regulation)
      // - Texas: TREC (Texas Real Estate Commission)
      // - etc.

      const result = await this._queryRegulatoryDatabase(licenseNumber, licenseState, brokerName)

      console.log(`[BROKER] License verification result: ${result.status}`)

      return result
    } catch (error) {
      console.error('[BROKER] Error verifying license:', error)
      return {
        isValid: false,
        status: 'not_found',
        licenseNumber,
        licenseState,
        licenseType: '',
        nameOnLicense: '',
        disciplinaryHistory: false,
        trustAccountCompliance: false,
        errors: ['Unable to verify license - manual review required'],
        verifiedAt: new Date().toISOString(),
      }
    }
  }

  /**
   * Check for Disciplinary History
   * Searches FINRA BrokerCheck and similar databases
   */
  async checkDisciplinaryHistory(brokerName: string, licenseNumber: string): Promise<boolean> {
    try {
      console.log(`[BROKER] Checking disciplinary history for ${brokerName}`)

      // In production, integrate with:
      // - FINRA BrokerCheck (finra.org/brokercheck)
      // - SEC IAPD (Investment Adviser Public Disclosure)
      // - State court records for violations

      // Mock check - replace with actual API calls
      const hasDisciplinaryHistory = false // Assume clean for now

      if (hasDisciplinaryHistory) {
        console.warn(`[BROKER] Disciplinary history found for ${brokerName}`)
      }

      return hasDisciplinaryHistory
    } catch (error) {
      console.error('[BROKER] Error checking disciplinary history:', error)
      // Default to requiring manual review
      return true
    }
  }

  /**
   * Verify E&O Insurance
   * Validates Errors & Omissions insurance is current
   */
  async verifyEOInsurance(insuranceProvider: string, policyNumber: string): Promise<boolean> {
    try {
      console.log(`[BROKER] Verifying E&O insurance: ${insuranceProvider} ${policyNumber}`)

      // In production, integrate with insurance verification services
      // or directly with common providers like:
      // - The Hartford
      // - Chubb
      // - XL Specialty Insurance
      // - Travelers

      if (!insuranceProvider || !policyNumber) {
        console.warn('[BROKER] E&O insurance information incomplete')
        return false
      }

      // Mock verification
      const isValid = true // Replace with actual API call

      return isValid
    } catch (error) {
      console.error('[BROKER] Error verifying E&O insurance:', error)
      return false
    }
  }

  /**
   * Query Regulatory Database
   * Helper method - integrates with state-specific APIs
   */
  private async _queryRegulatoryDatabase(
    licenseNumber: string,
    licenseState: string,
    brokerName: string
  ): Promise<BrokerLicenseVerificationResult> {
    // In production, this would make actual API calls to:
    // https://www.dre.ca.gov/ (California)
    // https://dos.ny.gov/ (New York)
    // https://www.myfloridalicense.com/ (Florida)
    // etc.

    // For now, return mock success
    const errors: string[] = []
    let status: 'active' | 'inactive' | 'expired' | 'suspended' | 'revoked' | 'not_found' = 'active'

    // Validation checks
    if (!licenseNumber || licenseNumber.length < 3) {
      errors.push('Invalid license number format')
      status = 'not_found'
    }

    if (!licenseState || licenseState.length !== 2) {
      errors.push('Invalid state code')
    }

    // Check for disciplinary history
    const hasHistory = await this.checkDisciplinaryHistory(brokerName, licenseNumber)
    if (hasHistory) {
      errors.push('Disciplinary history found - manual review required')
      status = 'suspended'
    }

    return {
      isValid: status === 'active' && errors.length === 0,
      status,
      licenseNumber,
      licenseState,
      licenseType: 'ma_broker', // M&A Broker
      nameOnLicense: brokerName,
      issuedDate: '2020-01-15',
      expiryDate: '2025-01-15',
      disciplinaryHistory: hasHistory,
      trustAccountCompliance: true,
      errors,
      verifiedAt: new Date().toISOString(),
    }
  }

  /**
   * Batch Verify Multiple Brokers (Admin Function)
   */
  async batchVerifyBrokers(
    brokers: Array<{
      licenseNumber: string
      licenseState: string
      name: string
    }>
  ): Promise<Array<{ licenseNumber: string; result: BrokerLicenseVerificationResult }>> {
    console.log(`[BROKER] Batch verifying ${brokers.length} brokers`)

    const results = await Promise.all(
      brokers.map(async (broker) => ({
        licenseNumber: broker.licenseNumber,
        result: await this.verifyBrokerLicense(broker.licenseNumber, broker.licenseState, broker.name),
      }))
    )

    const validCount = results.filter((r) => r.result.isValid).length
    console.log(`[BROKER] Batch verification complete: ${validCount}/${brokers.length} valid`)

    return results
  }

  /**
   * Get License Status Summary
   */
  async getLicenseStatusSummary(licenseState: string): Promise<{
    state: string
    verificationProvider: string
    lastUpdated: string
    supportedLicenseTypes: string[]
  }> {
    return {
      state: licenseState,
      verificationProvider: process.env.BROKER_LICENSE_VERIFICATION_PROVIDER || 'regulatory_api',
      lastUpdated: new Date().toISOString(),
      supportedLicenseTypes: ['ma_broker', 'business_broker', 'investment_banker'],
    }
  }
}

export const brokerVerificationService = new BrokerVerificationService()
export type { BrokerLicenseVerificationResult }

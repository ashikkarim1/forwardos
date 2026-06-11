/**
 * Finance Center — loan & affordability math.
 *
 * Pure, currency-agnostic functions. All amounts are plain numbers in a single
 * currency (the caller decides which, and formats with `@/lib/currency`).
 * Islamic products quote a "profit rate" that is mathematically equivalent to a
 * nominal annual rate for payment purposes, so the same amortization applies.
 */

export interface LoanInputs {
  purchasePrice: number
  downPaymentPct: number // 0-100
  annualRatePct: number // nominal annual %, e.g. 8.5
  termMonths: number
}

export interface LoanResult {
  loanAmount: number
  downPayment: number
  monthlyPayment: number
  totalPaid: number
  totalInterest: number
  annualDebtService: number
}

/** Standard fixed-rate amortizing monthly payment. */
export function monthlyPayment(principal: number, annualRatePct: number, termMonths: number): number {
  if (principal <= 0 || termMonths <= 0) return 0
  const r = annualRatePct / 100 / 12
  if (r === 0) return principal / termMonths
  return (principal * r) / (1 - Math.pow(1 + r, -termMonths))
}

export function calculateLoan(inputs: LoanInputs): LoanResult {
  const downPayment = inputs.purchasePrice * (inputs.downPaymentPct / 100)
  const loanAmount = Math.max(0, inputs.purchasePrice - downPayment)
  const pmt = monthlyPayment(loanAmount, inputs.annualRatePct, inputs.termMonths)
  const totalPaid = pmt * inputs.termMonths
  return {
    loanAmount,
    downPayment,
    monthlyPayment: pmt,
    totalPaid,
    totalInterest: Math.max(0, totalPaid - loanAmount),
    annualDebtService: pmt * 12,
  }
}

/**
 * Debt-Service Coverage Ratio = annual cash flow / annual debt service.
 * Lenders typically want >= 1.25. Higher is safer.
 */
export function debtServiceCoverage(annualCashFlow: number, annualDebtService: number): number {
  if (annualDebtService <= 0) return 0
  return annualCashFlow / annualDebtService
}

/**
 * Max purchase price a buyer can support given available down payment and the
 * business's annual cash flow (using a target DSCR). Helps buyers shop by budget.
 */
export function maxAffordablePrice(
  availableDownPayment: number,
  annualCashFlow: number,
  annualRatePct: number,
  termMonths: number,
  targetDscr = 1.25,
): number {
  const supportableAnnualDebt = annualCashFlow / targetDscr
  const supportableMonthly = supportableAnnualDebt / 12
  const r = annualRatePct / 100 / 12
  const maxLoan = r === 0
    ? supportableMonthly * termMonths
    : (supportableMonthly * (1 - Math.pow(1 + r, -termMonths))) / r
  return availableDownPayment + maxLoan
}

/**
 * A 0-100 financing-readiness score for a deal, used to drive the
 * "Financing Eligible" badge and lender matching. Considers down payment,
 * coverage, and term.
 */
export function eligibilityScore(params: {
  annualCashFlow: number
  loanResult: LoanResult
  downPaymentPct: number
}): number {
  const dscr = debtServiceCoverage(params.annualCashFlow, params.loanResult.annualDebtService)
  let score = 0
  // DSCR is the biggest factor (up to 60 pts; 1.5+ is excellent)
  score += Math.min(60, (dscr / 1.5) * 60)
  // Down payment (up to 30 pts; 30%+ is strong)
  score += Math.min(30, (params.downPaymentPct / 30) * 30)
  // Positive cash flow baseline (10 pts)
  if (params.annualCashFlow > 0) score += 10
  return Math.round(Math.max(0, Math.min(100, score)))
}

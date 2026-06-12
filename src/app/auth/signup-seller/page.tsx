import { redirect } from 'next/navigation'

// Consolidated — sellers now go to the 90-second /list flow.
// The KYC wizard moves to /dashboard/seller as an optional upgrade.
export default function SignupSellerRedirect(): never {
  redirect('/list')
}

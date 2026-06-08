'use client'

import { useRouter } from 'next/navigation'
import { useUserStore } from '@/store/user-store'
import { COLOR_ACCENT } from '@/styles/forward-colors'

interface RoleSelectorButtonProps {
  role: 'buyer' | 'seller' | 'broker'
  label: string
}

export function RoleSelectorButton({ role, label }: RoleSelectorButtonProps) {
  const router = useRouter()
  const { setRole } = useUserStore()

  const handleRoleSelect = () => {
    // Set the role in the store
    setRole(role)

    // Route to the appropriate dashboard
    const dashboardUrl = `/dashboard/${role}`
    router.push(dashboardUrl)
  }

  return (
    <button
      onClick={handleRoleSelect}
      className="w-full px-6 py-3 rounded-lg font-bold text-white transition-all hover:opacity-90 active:scale-95"
      style={{ background: COLOR_ACCENT }}
    >
      {label} →
    </button>
  )
}

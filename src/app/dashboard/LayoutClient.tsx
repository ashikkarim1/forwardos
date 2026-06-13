'use client'

import { AppShell } from '@/components/layout/AppShell'
import { DashboardFooter } from '@/components/layout/DashboardFooter'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AppShell>
      <div className="flex flex-col min-h-[calc(100vh-56px)]">
        <main className="flex-1">
          {children}
        </main>
        <DashboardFooter />
      </div>
    </AppShell>
  )
}

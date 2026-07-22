"use client"

import { Sidebar } from "@/components/sidebar/sidebar"
import { ProtectedRoute } from "@/components/protected-route"

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-muted/30">
        <Sidebar />
        <main className="md:pl-64">
          <div className="mx-auto max-w-7xl p-4 pt-16 md:p-8 md:pt-8">{children}</div>
        </main>
      </div>
    </ProtectedRoute>
  )
}

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
      <div className="flex">
        <Sidebar />
        <main className="flex-1">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}

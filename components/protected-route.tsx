"use client"

import { useSelector } from "react-redux"
import { useRouter, usePathname } from "next/navigation"
import { useEffect } from "react"
import type { RootState } from "@/lib/store"

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, isLoading } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`)
    }
  }, [user, isLoading, router, pathname])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-300 border-t-blue-500 mx-auto"></div>
          <p className="text-slate-600">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return <>{children}</>
}

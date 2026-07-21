"use client"

import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { createClient } from "@/lib/supabase/client"
import { setUser, setLoading } from "@/lib/features/auth/authSlice"

export function AuthInit({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch()

  useEffect(() => {
    const supabase = createClient()

    const initAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession()
        if (data.session?.user) {
          dispatch(setUser(data.session.user))
        } else {
          dispatch(setUser(null))
        }
      } catch (error) {
        console.error("Error initializing auth:", error)
        dispatch(setUser(null))
      } finally {
        dispatch(setLoading(false))
      }
    }

    initAuth()

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          dispatch(setUser(session.user))
        } else {
          dispatch(setUser(null))
        }
      }
    )

    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [dispatch])

  return <>{children}</>
}

import { useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import { createClient } from "@/lib/supabase/client"
import { setUser, setError, clearError } from "./authSlice"
import type { RootState } from "@/lib/store"

export function useAuth() {
  const dispatch = useDispatch()
  const { user, isLoading, error } = useSelector((state: RootState) => state.auth)
  const supabase = createClient()

  const signUp = useCallback(
    async (email: string, password: string) => {
      try {
        dispatch(clearError())
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        })

        if (signUpError) throw signUpError
        if (data.user) {
          dispatch(setUser(data.user))
        }
        return { success: true }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Error en el registro"
        dispatch(setError(message))
        return { success: false, error: message }
      }
    },
    [dispatch, supabase.auth]
  )

  const signIn = useCallback(
    async (email: string, password: string) => {
      try {
        dispatch(clearError())
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (signInError) throw signInError
        if (data.user) {
          dispatch(setUser(data.user))
        }
        return { success: true }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Error en el inicio de sesión"
        dispatch(setError(message))
        return { success: false, error: message }
      }
    },
    [dispatch, supabase.auth]
  )

  const signOut = useCallback(async () => {
    try {
      dispatch(clearError())
      const { error: signOutError } = await supabase.auth.signOut()
      if (signOutError) throw signOutError
      dispatch(setUser(null))
      return { success: true }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error al cerrar sesión"
      dispatch(setError(message))
      return { success: false, error: message }
    }
  }, [dispatch, supabase.auth])

  const getSession = useCallback(async () => {
    try {
      const { data, error: sessionError } = await supabase.auth.getSession()
      if (sessionError) throw sessionError
      if (data.session?.user) {
        dispatch(setUser(data.session.user))
      }
      return data.session
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error al obtener sesión"
      dispatch(setError(message))
      return null
    }
  }, [dispatch, supabase.auth])

  return {
    user,
    isLoading,
    error,
    signUp,
    signIn,
    signOut,
    getSession,
  }
}

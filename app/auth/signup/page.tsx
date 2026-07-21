"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/features/auth/authHooks"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function SignupPage() {
  const router = useRouter()
  const { signUp, error } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [passwordError, setPasswordError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError("")

    if (password !== confirmPassword) {
      setPasswordError("Las contraseñas no coinciden")
      return
    }

    if (password.length < 6) {
      setPasswordError("La contraseña debe tener al menos 6 caracteres")
      return
    }

    setIsLoading(true)

    const result = await signUp(email, password)
    if (result.success) {
      router.push("/auth/login?registered=true")
    }

    setIsLoading(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">Crear Cuenta</h1>
          <p className="mt-2 text-sm text-slate-400">Sistema de Ajuste Inventario</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 rounded-lg bg-slate-800 p-8">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-200">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
              className="mt-2"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-200">
              Contraseña
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="mt-2"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-200">
              Confirmar Contraseña
            </label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="mt-2"
            />
          </div>

          {error && <div className="rounded-md bg-red-500/10 p-3 text-sm text-red-400">{error}</div>}
          {passwordError && (
            <div className="rounded-md bg-yellow-500/10 p-3 text-sm text-yellow-400">{passwordError}</div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "Creando cuenta..." : "Registrarse"}
          </Button>
        </form>

        <p className="text-center text-sm text-slate-400">
          ¿Ya tienes cuenta?{" "}
          <Link href="/auth/login" className="font-medium text-blue-400 hover:text-blue-300">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/features/auth/authHooks"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, Mail, Lock, Check, X, Loader2 } from "lucide-react"

export default function SignupPage() {
  const router = useRouter()
  const { signUp, error } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const passwordLength = password.length >= 6
  const passwordsMatch = password === confirmPassword && password.length > 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!passwordLength || !passwordsMatch) {
      return
    }

    setIsLoading(true)

    const result = await signUp(email, password)
    if (result.success) {
      router.push("/auth/login")
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="space-y-3 text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-green-600 text-white mb-2">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Crear Cuenta</h1>
          <p className="text-slate-600 dark:text-slate-400">Únete a Sistema de Ajuste Inventario</p>
        </div>

        {/* Form Card */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle>Registro</CardTitle>
            <CardDescription>
              Completa los campos para crear tu cuenta
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  Correo electrónico
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    required
                    className="pl-10 bg-white dark:bg-slate-800"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="pl-10 pr-10 bg-white dark:bg-slate-800"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {/* Password Requirements */}
                <div className="flex items-center gap-2 text-xs">
                  {passwordLength ? (
                    <Check className="h-3 w-3 text-green-600" />
                  ) : (
                    <X className="h-3 w-3 text-slate-400" />
                  )}
                  <span className={passwordLength ? "text-green-600 dark:text-green-400" : "text-slate-500 dark:text-slate-400"}>
                    Al menos 6 caracteres
                  </span>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  Confirmar contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="pl-10 pr-10 bg-white dark:bg-slate-800"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {/* Password Match */}
                {confirmPassword && (
                  <div className="flex items-center gap-2 text-xs">
                    {passwordsMatch ? (
                      <Check className="h-3 w-3 text-green-600" />
                    ) : (
                      <X className="h-3 w-3 text-red-600" />
                    )}
                    <span className={passwordsMatch ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
                      {passwordsMatch ? "Las contraseñas coinciden" : "Las contraseñas no coinciden"}
                    </span>
                  </div>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="rounded-lg bg-red-50 dark:bg-red-950/30 p-3 border border-red-200 dark:border-red-800">
                  <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading || !passwordLength || !passwordsMatch}
                className="w-full h-10 text-base font-medium"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creando cuenta...
                  </>
                ) : (
                  "Crear cuenta"
                )}
              </Button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200 dark:border-slate-700" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-slate-950 px-2 text-slate-500 dark:text-slate-400">
                    o
                  </span>
                </div>
              </div>

              {/* Login Link */}
              <p className="text-center text-sm text-slate-600 dark:text-slate-400">
                ¿Ya tienes cuenta?{" "}
                <Link
                  href="/auth/login"
                  className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Inicia sesión
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-slate-500 dark:text-slate-500">
          Al registrarte aceptas nuestros términos y política de privacidad
        </p>
      </div>
    </div>
  )
}

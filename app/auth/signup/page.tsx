"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/features/auth/authHooks"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff, Mail, Lock, Check, X, Loader2, Boxes, User } from "lucide-react"

export default function SignupPage() {
  const router = useRouter()
  const { signUp, error } = useAuth()
  const [nombre, setNombre] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const nombreValido = nombre.trim().length >= 2
  const passwordLength = password.length >= 6
  const passwordsMatch = password === confirmPassword && password.length > 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nombreValido || !passwordLength || !passwordsMatch) return
    setIsLoading(true)
    const result = await signUp(email, password, nombre.trim())
    if (result.success) {
      router.push("/portal")
    }
    setIsLoading(false)
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Panel decorativo */}
      <div className="relative hidden overflow-hidden bg-primary lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, var(--primary-foreground) 0, transparent 40%), radial-gradient(circle at 80% 70%, var(--primary-foreground) 0, transparent 35%)",
          }}
        />
        <div className="relative flex items-center gap-2 text-primary-foreground">
          <Boxes className="h-7 w-7" />
          <span className="text-lg font-semibold">Sistema de Ajuste</span>
        </div>
        <div className="relative space-y-4 text-primary-foreground">
          <h2 className="text-3xl font-bold leading-tight">
            Empieza a controlar<br />tu inventario hoy
          </h2>
          <p className="max-w-md text-primary-foreground/80">
            Crea tu cuenta en segundos y accede a un panel completo para
            gestionar productos, variantes y existencias.
          </p>
        </div>
        <div className="relative text-sm text-primary-foreground/60">
          © {new Date().getFullYear()} Sistema de Ajuste Inventario
        </div>
      </div>

      {/* Formulario */}
      <div className="flex items-center justify-center bg-background p-6 sm:p-12">
        <div className="w-full max-w-sm space-y-8">
          <div className="flex items-center gap-2 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Boxes className="h-5 w-5" />
            </div>
            <span className="text-lg font-semibold text-foreground">Sistema de Ajuste</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Crear cuenta</h1>
            <p className="text-sm text-muted-foreground">
              Completa los campos para registrarte
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="nombre" className="text-sm font-medium text-foreground">
                Nombre
              </label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="nombre"
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Tu nombre"
                  required
                  className="pl-10"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                  className="pl-10"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="pl-10 pr-10"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  disabled={isLoading}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <div className="flex items-center gap-2 text-xs">
                {passwordLength ? (
                  <Check className="h-3 w-3 text-emerald-500" />
                ) : (
                  <X className="h-3 w-3 text-muted-foreground" />
                )}
                <span className={passwordLength ? "text-emerald-500" : "text-muted-foreground"}>
                  Al menos 6 caracteres
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                Confirmar contraseña
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="pl-10 pr-10"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  disabled={isLoading}
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {confirmPassword && (
                <div className="flex items-center gap-2 text-xs">
                  {passwordsMatch ? (
                    <Check className="h-3 w-3 text-emerald-500" />
                  ) : (
                    <X className="h-3 w-3 text-destructive" />
                  )}
                  <span className={passwordsMatch ? "text-emerald-500" : "text-destructive"}>
                    {passwordsMatch ? "Las contraseñas coinciden" : "Las contraseñas no coinciden"}
                  </span>
                </div>
              )}
            </div>

            {error && (
              <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading || !nombreValido || !passwordLength || !passwordsMatch}
              className="w-full"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creando cuenta...
                </>
              ) : (
                "Crear cuenta"
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            ¿Ya tienes cuenta?{" "}
            <Link
              href="/auth/login"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

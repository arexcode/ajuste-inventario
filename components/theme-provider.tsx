"use client"

import * as React from "react"

// Provider de tema propio (sin next-themes) para evitar el aviso de React 19
// sobre <script> dentro del árbol. El script anti-parpadeo vive en el <head>
// del layout (servidor); aquí solo gestionamos el estado y lo sincronizamos
// con la clase `dark` del <html> y con localStorage bajo la clave "theme".

type Theme = "light" | "dark" | "system"
type ResolvedTheme = "light" | "dark"

type ThemeContextValue = {
  theme: Theme
  resolvedTheme: ResolvedTheme
  setTheme: (theme: Theme) => void
}

const STORAGE_KEY = "theme"

const ThemeContext = React.createContext<ThemeContextValue | undefined>(undefined)

function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "light"
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

function resolve(theme: Theme, system: ResolvedTheme): ResolvedTheme {
  return theme === "system" ? system : theme
}

function applyTheme(resolved: ResolvedTheme) {
  const root = document.documentElement
  root.classList.toggle("dark", resolved === "dark")
  root.style.colorScheme = resolved
}

function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Estado inicial "system" en servidor; el script del <head> ya aplicó la
  // clase real antes de la hidratación, así que no hay parpadeo.
  const [theme, setThemeState] = React.useState<Theme>("system")
  const [systemTheme, setSystemTheme] = React.useState<ResolvedTheme>("light")

  // Al montar, leemos la preferencia guardada y el tema del sistema.
  React.useEffect(() => {
    const stored = (localStorage.getItem(STORAGE_KEY) as Theme | null) ?? "system"
    setThemeState(stored)
    setSystemTheme(getSystemTheme())

    const mq = window.matchMedia("(prefers-color-scheme: dark)")
    const onChange = () => setSystemTheme(mq.matches ? "dark" : "light")
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [])

  const resolvedTheme = resolve(theme, systemTheme)

  // Sincroniza la clase del <html> cuando cambia el tema resuelto.
  React.useEffect(() => {
    applyTheme(resolvedTheme)
  }, [resolvedTheme])

  const setTheme = React.useCallback((next: Theme) => {
    setThemeState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // localStorage puede fallar (modo privado); ignoramos.
    }
  }, [])

  const value = React.useMemo<ThemeContextValue>(
    () => ({ theme, resolvedTheme, setTheme }),
    [theme, resolvedTheme, setTheme]
  )

  return (
    <ThemeContext.Provider value={value}>
      <ThemeHotkey />
      {children}
    </ThemeContext.Provider>
  )
}

function useTheme(): ThemeContextValue {
  const ctx = React.useContext(ThemeContext)
  if (!ctx) {
    throw new Error("useTheme debe usarse dentro de <ThemeProvider>")
  }
  return ctx
}

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false
  }

  return (
    target.isContentEditable ||
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.tagName === "SELECT"
  )
}

function ThemeHotkey() {
  const { resolvedTheme, setTheme } = useTheme()

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented || event.repeat) {
        return
      }

      if (event.metaKey || event.ctrlKey || event.altKey) {
        return
      }

      if (event.key.toLowerCase() !== "d") {
        return
      }

      if (isTypingTarget(event.target)) {
        return
      }

      setTheme(resolvedTheme === "dark" ? "light" : "dark")
    }

    window.addEventListener("keydown", onKeyDown)

    return () => {
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [resolvedTheme, setTheme])

  return null
}

export { ThemeProvider, useTheme }

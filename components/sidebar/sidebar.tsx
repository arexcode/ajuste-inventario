"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useSelector } from "react-redux"
import { useAuth } from "@/lib/features/auth/authHooks"
import { Button } from "@/components/ui/button"
import {
  ChevronDown,
  Package,
  Building2,
  LogOut,
  Moon,
  Sun,
  Menu,
  X,
  User,
} from "lucide-react"
import { useTheme } from "next-themes"
import type { RootState } from "@/lib/store"

const MENU_ITEMS = [
  {
    section: "Almacenamiento",
    modules: [
      {
        name: "Inventario",
        href: "/portal/inventario",
        icon: Package,
      },
    ],
  },
  {
    section: "Modulos",
    modules: [
      {
        name: "Empresas",
        href: "/portal/empresas",
        icon: Building2,
      },
      {
        name: "Productos",
        href: "/portal/productos",
        icon: Package,
      },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user } = useSelector((state: RootState) => state.auth)
  const { signOut } = useAuth()
  const { theme, setTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const [expandedSections, setExpandedSections] = useState<string[]>(["Almacenamiento", "Modulos"])

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    )
  }

  const handleSignOut = async () => {
    await signOut()
    router.push("/auth/login")
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const isActive = (href: string) => pathname === href

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="fixed left-0 top-0 z-50 md:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="m-4 rounded-lg bg-slate-800 p-2 text-white hover:bg-slate-700"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 transform bg-slate-800 text-white transition-transform duration-300 md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } z-40 flex flex-col`}
      >
        {/* Header */}
        <div className="border-b border-slate-700 p-6">
          <h1 className="text-xl font-bold">Sistema de Ajuste</h1>
          <p className="text-xs text-slate-400">Inventario</p>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto space-y-2 p-4">
          {MENU_ITEMS.map((item) => (
            <div key={item.section} className="space-y-2">
              <button
                onClick={() => toggleSection(item.section)}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-700 hover:text-white"
              >
                {item.section}
                <ChevronDown
                  size={16}
                  className={`transform transition-transform ${
                    expandedSections.includes(item.section) ? "rotate-180" : ""
                  }`}
                />
              </button>

              {expandedSections.includes(item.section) && (
                <div className="space-y-1 pl-4">
                  {item.modules.map((module) => {
                    const Icon = module.icon
                    return (
                      <Link
                        key={module.href}
                        href={module.href}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                          isActive(module.href)
                            ? "bg-blue-600 text-white"
                            : "text-slate-400 hover:bg-slate-700 hover:text-white"
                        }`}
                      >
                        <Icon size={18} />
                        {module.name}
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-slate-700 p-4 space-y-4">
          {/* User Info */}
          {user && (
            <div className="flex items-center gap-3 rounded-lg bg-slate-700 p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600">
                <User size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium text-white">{user.email}</p>
                <p className="text-xs text-slate-400">Usuario</p>
              </div>
            </div>
          )}

          {/* Theme Toggle */}
          <Button
            onClick={toggleTheme}
            variant="outline"
            className="w-full justify-start gap-2"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            {theme === "dark" ? "Modo claro" : "Modo oscuro"}
          </Button>

          {/* Logout Button */}
          <Button
            onClick={handleSignOut}
            variant="destructive"
            className="w-full justify-start gap-2"
          >
            <LogOut size={18} />
            Cerrar sesión
          </Button>
        </div>
      </aside>

      {/* Main content offset */}
      <div className="hidden md:block w-64" />
    </>
  )
}

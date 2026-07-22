"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useSelector } from "react-redux"
import { useAuth } from "@/lib/features/auth/authHooks"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Boxes,
  Warehouse,
  Package,
  Building2,
  Palette,
  Ruler,
  Layers,
  FileStack,
  FileUp,
  FileDown,
  LogOut,
  Moon,
  Sun,
  Menu,
  X,
  ChevronsUpDown,
} from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import type { RootState } from "@/lib/store"
import type { LucideIcon } from "lucide-react"

type MenuModule = { name: string; href: string; icon: LucideIcon }
type MenuSection = { section: string; icon: LucideIcon; modules: MenuModule[] }

const MENU_ITEMS: MenuSection[] = [
  {
    section: "Almacenamiento",
    icon: Warehouse,
    modules: [{ name: "Inventario", href: "/portal/inventario", icon: Boxes }],
  },
  {
    section: "Modulos",
    icon: Package,
    modules: [
      { name: "Variantes", href: "/portal/variantes", icon: Layers },
      { name: "Empresas", href: "/portal/empresas", icon: Building2 },
      { name: "Productos", href: "/portal/productos", icon: Package },
      { name: "Colores", href: "/portal/colores", icon: Palette },
      { name: "Tallas", href: "/portal/tallas", icon: Ruler },
    ],
  },
  {
    section: "Form",
    icon: FileStack,
    modules: [
      { name: "Importación", href: "/portal/importacion", icon: FileUp },
      { name: "Exportación", href: "/portal/exportacion", icon: FileDown },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user } = useSelector((state: RootState) => state.auth)
  const { signOut } = useAuth()
  const { resolvedTheme, setTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    router.push("/auth/login")
  }

  const toggleTheme = () => setTheme(resolvedTheme === "dark" ? "light" : "dark")
  const isActive = (href: string) => pathname === href

  const initials = user?.email?.slice(0, 2).toUpperCase() ?? "US"

  return (
    <>
      {/* Botón menú mobile */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed left-4 top-4 z-50 rounded-lg border border-border bg-card p-2 text-foreground shadow-sm md:hidden"
        aria-label="Abrir menú"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Backdrop mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-transform duration-300 md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-sidebar-border px-5 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <Boxes className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">Sistema de Ajuste</p>
            <p className="truncate text-xs text-muted-foreground">Inventario</p>
          </div>
        </div>

        {/* Navegación */}
        <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
          {MENU_ITEMS.map((item) => {
            const SectionIcon = item.icon
            return (
              <div key={item.section} className="space-y-1">
                <div className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <SectionIcon className="h-3.5 w-3.5" />
                  {item.section}
                </div>
                <div className="space-y-0.5">
                  {item.modules.map((module) => {
                    const Icon = module.icon
                    const active = isActive(module.href)
                    return (
                      <Link
                        key={module.href}
                        href={module.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                          active
                            ? "bg-sidebar-primary text-sidebar-primary-foreground"
                            : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        )}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        {module.name}
                      </Link>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </nav>

        {/* Footer: tema + usuario */}
        <div className="space-y-2 border-t border-sidebar-border p-3">
          <Button
            onClick={toggleTheme}
            variant="ghost"
            className="w-full justify-start gap-2 text-sidebar-foreground/80"
          >
            {resolvedTheme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
            {resolvedTheme === "dark" ? "Modo claro" : "Modo oscuro"}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger
              nativeButton={false}
              render={<div role="button" tabIndex={0} />}
              className="flex w-full cursor-pointer items-center gap-3 rounded-md p-2 text-left transition-colors hover:bg-sidebar-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
            >
              <Avatar>
                <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{user?.email ?? "Usuario"}</p>
                <p className="truncate text-xs text-muted-foreground">Conectado</p>
              </div>
              <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" side="top" className="w-56">
              <DropdownMenuLabel className="truncate font-normal text-muted-foreground">
                {user?.email}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleSignOut}
                className="text-destructive focus:text-destructive"
              >
                <LogOut className="h-4 w-4" />
                Cerrar sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>
    </>
  )
}

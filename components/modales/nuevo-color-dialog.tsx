"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCrearColor } from "@/lib/features/catalogos/useCatalogos"
import { Plus, Loader2 } from "lucide-react"

const HEX_REGEX = /^#[0-9A-Fa-f]{6}$/

export function NuevoColorDialog() {
  const [open, setOpen] = useState(false)
  const [nombre, setNombre] = useState("")
  const [hex, setHex] = useState("#3b82f6")
  const { mutateAsync, isPending, error } = useCrearColor()

  const hexValido = HEX_REGEX.test(hex)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nombre.trim() || !hexValido) return
    try {
      await mutateAsync({ nombre: nombre.trim(), hex: hex.toLowerCase() })
      setNombre("")
      setHex("#3b82f6")
      setOpen(false)
    } catch {
      // el error se muestra abajo
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="gap-2" />}>
        <Plus className="h-4 w-4" />
        Nuevo color
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Nuevo color</DialogTitle>
            <DialogDescription>Agrega un color y elige su valor hexadecimal.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="color-nombre">Nombre</Label>
              <Input
                id="color-nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej. Rojo carmesí"
                autoFocus
                disabled={isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="color-hex">Color (Hex)</Label>
              <div className="flex items-center gap-3">
                {/* Selector de color nativo */}
                <input
                  type="color"
                  aria-label="Selector de color"
                  value={hexValido ? hex : "#000000"}
                  onChange={(e) => setHex(e.target.value)}
                  disabled={isPending}
                  className="h-10 w-14 shrink-0 cursor-pointer rounded-md border border-input bg-background p-1"
                />
                <Input
                  id="color-hex"
                  value={hex}
                  onChange={(e) => setHex(e.target.value)}
                  placeholder="#3b82f6"
                  disabled={isPending}
                  className="font-mono uppercase"
                  aria-invalid={!hexValido}
                />
                <span
                  className="h-10 w-10 shrink-0 rounded-md ring-1 ring-border"
                  style={{ backgroundColor: hexValido ? hex : "transparent" }}
                />
              </div>
              {!hexValido && (
                <p className="text-xs text-muted-foreground">
                  Formato válido: #RRGGBB (ej. #ff0000)
                </p>
              )}
            </div>

            {error && (
              <p className="text-sm text-destructive">
                {error instanceof Error ? error.message : "Error al guardar"}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending || !nombre.trim() || !hexValido}>
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Guardar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

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
import { useCrearTalla } from "@/lib/features/catalogos/useCatalogos"
import { Plus, Loader2 } from "lucide-react"

export function NuevaTallaDialog() {
  const [open, setOpen] = useState(false)
  const [nombre, setNombre] = useState("")
  const { mutateAsync, isPending, error } = useCrearTalla()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nombre.trim()) return
    try {
      await mutateAsync(nombre.trim())
      setNombre("")
      setOpen(false)
    } catch {
      // el error se muestra abajo
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="gap-2" />}>
        <Plus className="h-4 w-4" />
        Nueva talla
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Nueva talla</DialogTitle>
            <DialogDescription>Agrega una talla al catálogo.</DialogDescription>
          </DialogHeader>

          <div className="space-y-2 py-4">
            <Label htmlFor="talla-nombre">Nombre</Label>
            <Input
              id="talla-nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej. S, M, L, XL, 38, 40..."
              autoFocus
              disabled={isPending}
            />
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
            <Button type="submit" disabled={isPending || !nombre.trim()}>
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Guardar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

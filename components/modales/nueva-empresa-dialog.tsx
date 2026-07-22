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
import { useCrearEmpresa } from "@/lib/features/catalogos/useCatalogos"
import { Plus, Loader2 } from "lucide-react"

export function NuevaEmpresaDialog() {
  const [open, setOpen] = useState(false)
  const [nombre, setNombre] = useState("")
  const { mutateAsync, isPending, error } = useCrearEmpresa()

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
        Nueva empresa
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Nueva empresa</DialogTitle>
            <DialogDescription>Registra una nueva empresa en el sistema.</DialogDescription>
          </DialogHeader>

          <div className="space-y-2 py-4">
            <Label htmlFor="empresa-nombre">Nombre</Label>
            <Input
              id="empresa-nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej. Textiles del Sur"
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

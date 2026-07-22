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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCrearProducto } from "@/lib/features/catalogos/useCatalogos"
import { useEmpresas } from "@/lib/features/inventario/useInventario"
import { Plus, Loader2 } from "lucide-react"

export function NuevoProductoDialog() {
  const [open, setOpen] = useState(false)
  const [nombre, setNombre] = useState("")
  const [empresaId, setEmpresaId] = useState<string | null>(null)
  const { data: empresas } = useEmpresas()
  const { mutateAsync, isPending, error } = useCrearProducto()

  const valido = nombre.trim() !== ""

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!valido) return
    try {
      await mutateAsync({
        nombre: nombre.trim(),
        empresa_id: empresaId ? Number(empresaId) : null,
      })
      setNombre("")
      setEmpresaId(null)
      setOpen(false)
    } catch {
      // el error se muestra abajo
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="gap-2" />}>
        <Plus className="h-4 w-4" />
        Nuevo producto
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Nuevo producto</DialogTitle>
            <DialogDescription>Crea un producto asociado a una empresa.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="producto-nombre">Nombre</Label>
              <Input
                id="producto-nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej. Camisero Wafle"
                autoFocus
                disabled={isPending}
              />
            </div>

            <div className="space-y-2">
              <Label>Empresa</Label>
              <Select value={empresaId} onValueChange={setEmpresaId}>
                <SelectTrigger className="h-10 w-full">
                  <SelectValue placeholder="Selecciona una empresa" />
                </SelectTrigger>
                <SelectContent>
                  {empresas?.map((e) => (
                    <SelectItem key={e.id} value={String(e.id)}>
                      {e.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
            <Button type="submit" disabled={isPending || !valido}>
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Guardar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

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
import { useCrearVariante } from "@/lib/features/catalogos/useCatalogos"
import { useProductos, useColores, useTallas } from "@/lib/features/catalogos/useCatalogos"
import { Plus, Loader2 } from "lucide-react"

export function NuevaVarianteDialog() {
  const [open, setOpen] = useState(false)
  const [productoId, setProductoId] = useState<string | null>(null)
  const [colorId, setColorId] = useState<string | null>(null)
  const [tallaId, setTallaId] = useState<string | null>(null)
  const [sku, setSku] = useState("")

  const { data: productos } = useProductos()
  const { data: colores } = useColores()
  const { data: tallas } = useTallas()
  const { mutateAsync, isPending, error } = useCrearVariante()

  const valido = !!productoId && !!colorId && !!tallaId && sku.trim() !== ""

  const reset = () => {
    setProductoId(null)
    setColorId(null)
    setTallaId(null)
    setSku("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!valido) return
    try {
      await mutateAsync({
        producto_id: Number(productoId),
        color_id: Number(colorId),
        talla_id: Number(tallaId),
        sku: sku.trim(),
      })
      reset()
      setOpen(false)
    } catch {
      // el error se muestra abajo
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="gap-2" />}>
        <Plus className="h-4 w-4" />
        Nueva variante
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Nueva variante</DialogTitle>
            <DialogDescription>
              Combina un producto con un color y una talla, e indica su stock.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Producto</Label>
              <Select value={productoId} onValueChange={setProductoId}>
                <SelectTrigger className="h-10 w-full">
                  <SelectValue placeholder="Selecciona un producto" />
                </SelectTrigger>
                <SelectContent>
                  {productos?.map((p) => (
                    <SelectItem key={p.id} value={String(p.id)}>
                      {p.nombre} · {p.empresa?.nombre ?? "Sin empresa"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Color</Label>
                <Select value={colorId} onValueChange={setColorId}>
                  <SelectTrigger className="h-10 w-full">
                    <SelectValue placeholder="Color" />
                  </SelectTrigger>
                  <SelectContent>
                    {colores?.map((c) => (
                      <SelectItem key={c.id} value={String(c.id)}>
                        <span
                          className="h-3 w-3 rounded-full ring-1 ring-border"
                          style={{ backgroundColor: c.hex }}
                        />
                        {c.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Talla</Label>
                <Select value={tallaId} onValueChange={setTallaId}>
                  <SelectTrigger className="h-10 w-full">
                    <SelectValue placeholder="Talla" />
                  </SelectTrigger>
                  <SelectContent>
                    {tallas?.map((t) => (
                      <SelectItem key={t.id} value={String(t.id)}>
                        {t.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="variante-sku">SKU</Label>
              <Input
                id="variante-sku"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="Ej. CAM-WAF-AZ-S"
                className="font-mono uppercase"
                disabled={isPending}
              />
              <p className="text-xs text-muted-foreground">
                Código único de la variante. El stock se calcula con los conteos.
              </p>
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

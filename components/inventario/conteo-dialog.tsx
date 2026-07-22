"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useGuardarConteo } from "@/lib/features/inventario/useInventario"
import { Loader2 } from "lucide-react"
import type { CeldaSeleccionada } from "./producto-matriz-card"

export function ConteoDialog({
  celda,
  usuarioId,
  miConteoPrevio,
  onClose,
}: {
  celda: CeldaSeleccionada | null
  usuarioId: number | undefined
  miConteoPrevio: number | undefined
  onClose: () => void
}) {
  const [cantidad, setCantidad] = useState("0")
  const { mutateAsync, isPending, error } = useGuardarConteo()

  // Prellena con el conteo previo del usuario (o 0) al abrir.
  useEffect(() => {
    if (celda) setCantidad(String(miConteoPrevio ?? 0))
  }, [celda, miConteoPrevio])

  const cantidadNum = Number(cantidad)
  const valido = !!usuarioId && Number.isFinite(cantidadNum) && cantidadNum >= 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!celda || !valido) return
    try {
      await mutateAsync({
        variante_id: celda.varianteId,
        usuario_id: usuarioId!,
        cantidad: cantidadNum,
      })
      onClose()
    } catch {
      // el error se muestra abajo
    }
  }

  return (
    <Dialog open={!!celda} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        {celda && (
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Registrar conteo</DialogTitle>
              <DialogDescription>{celda.productoNombre}</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {/* Contexto de la variante */}
              <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                <span
                  className="h-6 w-6 shrink-0 rounded-full ring-1 ring-border"
                  style={{ backgroundColor: celda.colorHex }}
                />
                <div className="text-sm">
                  <p className="font-medium text-foreground">
                    {celda.colorNombre} · Talla {celda.tallaNombre}
                  </p>
                  <p className="text-muted-foreground">
                    Total acumulado (todos): {celda.stockTotal} uds.
                  </p>
                </div>
              </div>

              {!usuarioId ? (
                <p className="text-sm text-destructive">
                  No se pudo identificar tu usuario. Vuelve a iniciar sesión.
                </p>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="conteo-cantidad">Tu conteo</Label>
                  <Input
                    id="conteo-cantidad"
                    type="number"
                    min={0}
                    value={cantidad}
                    onChange={(e) => setCantidad(e.target.value)}
                    autoFocus
                    disabled={isPending}
                  />
                  <p className="text-xs text-muted-foreground">
                    Se guarda tu conteo individual; el total suma el de todos los usuarios.
                  </p>
                </div>
              )}

              {error && (
                <p className="text-sm text-destructive">
                  {error instanceof Error ? error.message : "Error al guardar"}
                </p>
              )}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending || !valido}>
                {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                Guardar conteo
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}

"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { ProductoMatriz, ColorRow, TallaCol } from "@/lib/features/inventario/matriz"

export interface CeldaSeleccionada {
  varianteId: number
  productoNombre: string
  colorNombre: string
  colorHex: string
  tallaNombre: string
  stockTotal: number
  miConteo: number
}

function stockClass(stock: number): string {
  if (stock === 0) return "text-muted-foreground"
  if (stock <= 5) return "text-amber-600 dark:text-amber-400 font-semibold"
  return "text-foreground font-medium"
}

export function ProductoMatrizCard({
  producto,
  onCeldaClick,
}: {
  producto: ProductoMatriz
  onCeldaClick: (celda: CeldaSeleccionada) => void
}) {
  const handleClick = (color: ColorRow, talla: TallaCol) => {
    const celda = color.celdaPorTalla[talla.id]
    if (!celda) return
    onCeldaClick({
      varianteId: celda.varianteId,
      productoNombre: producto.productoNombre,
      colorNombre: color.nombre,
      colorHex: color.hex,
      tallaNombre: talla.nombre,
      stockTotal: celda.stockTotal,
      miConteo: celda.miConteo,
    })
  }

  return (
    <Card className="gap-0 p-0">
      {/* Encabezado */}
      <div className="flex flex-wrap items-start justify-between gap-2 border-b border-border px-5 py-4">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-foreground">
            {producto.productoNombre}
          </h3>
          <p className="text-xs text-muted-foreground">{producto.empresaNombre}</p>
        </div>
        <Badge variant="secondary" className="shrink-0" title="Total acumulado de todos los usuarios">
          Total: {producto.totalStock} uds.
        </Badge>
      </div>

      {/* Matriz colores × tallas */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="sticky left-0 z-10 bg-card px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Color
              </th>
              {producto.tallas.map((talla) => (
                <th
                  key={talla.id}
                  className="min-w-14 px-3 py-2.5 text-center text-xs font-semibold text-foreground"
                >
                  {talla.nombre}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {producto.colores.map((color) => (
              <tr
                key={color.id}
                className="border-b border-border/50 last:border-0"
              >
                <td className="sticky left-0 z-10 bg-card px-4 py-2.5">
                  <span className="flex items-center gap-2">
                    <span
                      className="h-4 w-4 shrink-0 rounded-full ring-1 ring-border"
                      style={{ backgroundColor: color.hex }}
                      title={color.hex}
                    />
                    <span className="truncate text-foreground">{color.nombre}</span>
                  </span>
                </td>
                {producto.tallas.map((talla) => {
                  const celda = color.celdaPorTalla[talla.id]
                  if (!celda) {
                    return (
                      <td
                        key={talla.id}
                        className="px-3 py-2 text-center text-muted-foreground/40"
                      >
                        —
                      </td>
                    )
                  }
                  return (
                    <td key={talla.id} className="p-1 text-center">
                      <button
                        type="button"
                        onClick={() => handleClick(color, talla)}
                        className={cn(
                          "flex min-h-9 w-full flex-col items-center justify-center rounded-md px-2 py-1.5 leading-tight tabular-nums transition-colors hover:bg-primary/10 hover:ring-1 hover:ring-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                          stockClass(celda.miConteo)
                        )}
                        title={`Tu conteo: ${celda.miConteo} · Total (todos): ${celda.stockTotal} · ${color.nombre} / ${talla.nombre}`}
                      >
                        <span>{celda.miConteo}</span>
                        {celda.stockTotal !== celda.miConteo && (
                          <span className="text-[10px] font-normal text-muted-foreground/70">
                            Σ {celda.stockTotal}
                          </span>
                        )}
                      </button>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

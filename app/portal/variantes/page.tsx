"use client"

import { useMemo, useState } from "react"
import { Layers } from "lucide-react"
import { PageHeader } from "@/components/portal/page-header"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { SearchInput } from "@/components/ui/search-input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { NuevaVarianteDialog } from "@/components/modales/nueva-variante-dialog"
import { useVariantes, useResumenConteos } from "@/lib/features/inventario/useInventario"

function stockBadgeVariant(stock: number): "default" | "secondary" | "destructive" {
  if (stock === 0) return "destructive"
  if (stock <= 5) return "secondary"
  return "default"
}

export default function VariantesPage() {
  const { data: variantes, isLoading } = useVariantes()
  const { data: resumen } = useResumenConteos()
  const [searchTerm, setSearchTerm] = useState("")

  const stockPorVariante = useMemo(() => {
    const m = new Map<number, number>()
    for (const r of resumen ?? []) {
      m.set(r.variante_id, Number(r.stock_total_calculado) || 0)
    }
    return m
  }, [resumen])

  const ordenadas = useMemo(() => {
    let sorted = [...(variantes ?? [])].sort((a, b) => {
      const na = a.producto?.nombre ?? ""
      const nb = b.producto?.nombre ?? ""
      return na.localeCompare(nb)
    })

    if (!searchTerm.trim()) return sorted

    const term = searchTerm.toLowerCase()
    return sorted.filter((v) =>
      v.id.toString().includes(term) ||
      v.sku.toLowerCase().includes(term) ||
      v.producto?.nombre?.toLowerCase().includes(term) ||
      v.color?.nombre?.toLowerCase().includes(term) ||
      v.talla?.nombre?.toLowerCase().includes(term)
    )
  }, [variantes, searchTerm])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <PageHeader
          icon={Layers}
          title="Variantes"
          description="Combinaciones de producto, color y talla con su stock"
        />
        <NuevaVarianteDialog />
      </div>

      <SearchInput
        placeholder="Buscar por ID, SKU, producto, color o talla..."
        value={searchTerm}
        onChange={setSearchTerm}
      />

      <Card className="p-0">
        {isLoading ? (
          <div className="space-y-2 p-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Producto</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Color</TableHead>
                <TableHead>Talla</TableHead>
                <TableHead className="text-right">Stock</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ordenadas.length > 0 ? (
                ordenadas.map((v) => {
                  const stock = stockPorVariante.get(v.id) ?? 0
                  return (
                    <TableRow key={v.id}>
                      <TableCell className="font-mono text-sm text-muted-foreground">{v.id}</TableCell>
                      <TableCell className="font-medium">
                        {v.producto?.nombre ?? "—"}
                        <span className="block text-xs text-muted-foreground">
                          {v.producto?.empresa?.nombre ?? "—"}
                        </span>
                      </TableCell>
                      <TableCell className="font-mono text-xs uppercase text-muted-foreground">
                        {v.sku}
                      </TableCell>
                      <TableCell>
                        <span className="flex items-center gap-2">
                          <span
                            className="h-3.5 w-3.5 rounded-full ring-1 ring-border"
                            style={{ backgroundColor: v.color?.hex ?? "transparent" }}
                          />
                          {v.color?.nombre ?? "—"}
                        </span>
                      </TableCell>
                      <TableCell>{v.talla?.nombre ?? "—"}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant={stockBadgeVariant(stock)}>{stock}</Badge>
                      </TableCell>
                    </TableRow>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                    {searchTerm ? "No hay resultados que coincidan" : "No hay variantes registradas"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  )
}

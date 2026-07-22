"use client"

import { useMemo, useState } from "react"
import { FileDown, FileSpreadsheet, FileText, Package, Users, Hash, TrendingUp, ArrowUpDown } from "lucide-react"
import { PageHeader } from "@/components/portal/page-header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useConteosDetalle } from "@/lib/features/conteos/useConteosDetalle"
import { exportarExcel, exportarPDF } from "@/lib/features/conteos/exportar"

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Package
  label: string
  value: string | number
}) {
  return (
    <Card className="flex-row items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-2xl font-bold tabular-nums text-foreground">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </Card>
  )
}

type SortField = "producto" | "sku" | "color" | "talla" | "usuario" | "cantidad" | "overshark" | "bravos"
type SortOrder = "asc" | "desc" | null

export default function ExportacionPage() {
  const { data: conteos, isLoading } = useConteosDetalle()
  const [sortField, setSortField] = useState<SortField | null>(null)
  const [sortOrder, setSortOrder] = useState<SortOrder>(null)

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Cicla: asc → desc → null
      if (sortOrder === "asc") setSortOrder("desc")
      else if (sortOrder === "desc") setSortOrder(null)
      else setSortOrder("asc")
    } else {
      setSortField(field)
      setSortOrder("asc")
    }
  }

  const stats = useMemo(() => {
    const lista = conteos ?? []
    const totalUnidades = lista.reduce((acc, c) => acc + c.cantidad, 0)
    const overshark = Math.round(totalUnidades * 0.7)
    const bravos = totalUnidades - overshark
    const usuarios = new Set(lista.map((c) => c.usuario?.id).filter(Boolean))
    const variantes = new Set(lista.map((c) => c.variante?.id).filter(Boolean))
    return {
      registros: lista.length,
      totalUnidades,
      overshark,
      bravos,
      usuarios: usuarios.size,
      variantes: variantes.size,
    }
  }, [conteos])

  const hayDatos = (conteos?.length ?? 0) > 0

  const conteosOrdenados = useMemo(() => {
    if (!conteos || !sortField || !sortOrder) return conteos ?? []

    const sorted = [...conteos].sort((a, b) => {
      let valA: string | number = ""
      let valB: string | number = ""

      switch (sortField) {
        case "producto":
          valA = a.variante?.producto?.nombre ?? ""
          valB = b.variante?.producto?.nombre ?? ""
          break
        case "sku":
          valA = a.variante?.id ?? 0
          valB = b.variante?.id ?? 0
          break
        case "color":
          valA = a.variante?.color?.nombre ?? ""
          valB = b.variante?.color?.nombre ?? ""
          break
        case "talla":
          valA = a.variante?.talla?.nombre ?? ""
          valB = b.variante?.talla?.nombre ?? ""
          break
        case "usuario":
          valA = a.usuario?.nombre ?? a.usuario?.email ?? ""
          valB = b.usuario?.nombre ?? b.usuario?.email ?? ""
          break
        case "cantidad":
          valA = a.cantidad
          valB = b.cantidad
          break
        case "overshark":
          valA = Math.round(a.cantidad * 0.7)
          valB = Math.round(b.cantidad * 0.7)
          break
        case "bravos":
          valA = a.cantidad - Math.round(a.cantidad * 0.7)
          valB = b.cantidad - Math.round(b.cantidad * 0.7)
          break
      }

      if (typeof valA === "string") valA = valA.toLowerCase()
      if (typeof valB === "string") valB = valB.toLowerCase()

      if (valA < valB) return sortOrder === "asc" ? -1 : 1
      if (valA > valB) return sortOrder === "asc" ? 1 : -1
      return 0
    })

    return sorted
  }, [conteos, sortField, sortOrder])

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="ml-1 h-4 w-4 opacity-30" />
    return (
      <span className="ml-1">
        {sortOrder === "asc" ? "↑" : "↓"}
      </span>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <PageHeader
          icon={FileDown}
          title="Exportación"
          description="Resumen de conteos y descarga en Excel o PDF"
        />
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="gap-2"
            disabled={!hayDatos}
            onClick={() => conteos && exportarExcel(conteos)}
          >
            <FileSpreadsheet className="h-4 w-4" />
            Excel
          </Button>
          <Button
            variant="outline"
            className="gap-2"
            disabled={!hayDatos}
            onClick={() => conteos && exportarPDF(conteos)}
          >
            <FileText className="h-4 w-4" />
            PDF
          </Button>
        </div>
      </div>

      {/* Totales generales */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard icon={Hash} label="Registros de conteo" value={stats.registros} />
        <StatCard icon={Package} label="Unidades totales" value={stats.totalUnidades} />
        <StatCard icon={Users} label="Usuarios que contaron" value={stats.usuarios} />
        <StatCard icon={Package} label="Variantes contadas" value={stats.variantes} />
      </div>

      {/* Distribución de cantidades */}
      <Card className="border-primary/30 bg-primary/5 p-4">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">Distribución de cantidades</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-background p-4">
            <p className="text-2xl font-bold tabular-nums text-foreground">{stats.overshark}</p>
            <p className="text-sm text-muted-foreground">Overshark (70%)</p>
          </div>
          <div className="rounded-lg bg-background p-4">
            <p className="text-2xl font-bold tabular-nums text-foreground">{stats.bravos}</p>
            <p className="text-sm text-muted-foreground">Bravos (30%)</p>
          </div>
        </div>
      </Card>

      {/* Vista de conteos */}
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
                <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("producto")}>
                  Producto <SortIcon field="producto" />
                </TableHead>
                <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("sku")}>
                  SKU <SortIcon field="sku" />
                </TableHead>
                <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("color")}>
                  Color <SortIcon field="color" />
                </TableHead>
                <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("talla")}>
                  Talla <SortIcon field="talla" />
                </TableHead>
                <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("usuario")}>
                  Usuario <SortIcon field="usuario" />
                </TableHead>
                <TableHead className="cursor-pointer hover:bg-muted/50 text-right" onClick={() => handleSort("cantidad")}>
                  Cantidad Total <SortIcon field="cantidad" />
                </TableHead>
                <TableHead className="cursor-pointer hover:bg-muted/50 text-right" onClick={() => handleSort("overshark")}>
                  Overshark (70%) <SortIcon field="overshark" />
                </TableHead>
                <TableHead className="cursor-pointer hover:bg-muted/50 text-right" onClick={() => handleSort("bravos")}>
                  Bravos (30%) <SortIcon field="bravos" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {hayDatos ? (
                conteosOrdenados.map((c) => {
                  const cant = c.cantidad
                  const overshark = Math.round(cant * 0.7)
                  const bravos = cant - overshark
                  return (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium">
                        {c.variante?.producto?.nombre ?? "—"}
                      </TableCell>
                      <TableCell className="font-mono text-xs uppercase text-muted-foreground">
                        {c.variante?.id ?? "—"}
                      </TableCell>
                      <TableCell>{c.variante?.color?.nombre ?? "—"}</TableCell>
                      <TableCell>{c.variante?.talla?.nombre ?? "—"}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {c.usuario?.nombre ?? c.usuario?.email ?? "—"}
                      </TableCell>
                      <TableCell className="text-right font-medium tabular-nums">
                        {cant}
                      </TableCell>
                      <TableCell className="text-right tabular-nums text-blue-600 dark:text-blue-400">
                        {overshark}
                      </TableCell>
                      <TableCell className="text-right tabular-nums text-emerald-600 dark:text-emerald-400">
                        {bravos}
                      </TableCell>
                    </TableRow>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="py-10 text-center text-muted-foreground">
                    Aún no hay conteos registrados
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

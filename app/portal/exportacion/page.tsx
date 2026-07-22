"use client"

import { useMemo } from "react"
import { FileDown, FileSpreadsheet, FileText, Package, Users, Hash, TrendingUp } from "lucide-react" // TrendingUp es para el ícono de distribución
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

export default function ExportacionPage() {
  const { data: conteos, isLoading } = useConteosDetalle()

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
                <TableHead>Producto</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Color</TableHead>
                <TableHead>Talla</TableHead>
                <TableHead>Usuario</TableHead>
                <TableHead className="text-right">Cantidad Total</TableHead>
                <TableHead className="text-right">Overshark (70%)</TableHead>
                <TableHead className="text-right">Bravos (30%)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {hayDatos ? (
                conteos!.map((c) => {
                  const cant = c.cantidad
                  const overshark = Math.round(cant * 0.7)
                  const bravos = cant - overshark
                  return (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium">
                        {c.variante?.producto?.nombre ?? "—"}
                      </TableCell>
                      <TableCell className="font-mono text-xs uppercase text-muted-foreground">
                        {c.variante?.sku ?? "—"}
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

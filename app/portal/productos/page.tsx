"use client"

import { Package } from "lucide-react"
import { PageHeader } from "@/components/portal/page-header"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useProductos } from "@/lib/features/catalogos/useCatalogos"
import { NuevoProductoDialog } from "@/components/modales/nuevo-producto-dialog"

export default function ProductosPage() {
  const { data: productos, isLoading } = useProductos()

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <PageHeader
          icon={Package}
          title="Productos"
          description="Catálogo de productos por empresa"
        />
        <NuevoProductoDialog />
      </div>

      <Card className="p-0">
        {isLoading ? (
          <div className="space-y-2 p-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead>Empresa</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productos && productos.length > 0 ? (
                productos.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.nombre}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{p.empresa?.nombre ?? "Sin empresa"}</Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} className="py-10 text-center text-muted-foreground">
                    No hay productos registrados
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

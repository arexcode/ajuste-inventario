"use client"

import { useMemo, useState } from "react"
import { Package } from "lucide-react"
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
import { useProductos } from "@/lib/features/catalogos/useCatalogos"
import { NuevoProductoDialog } from "@/components/modales/nuevo-producto-dialog"

export default function ProductosPage() {
  const { data: productos, isLoading } = useProductos()
  const [searchTerm, setSearchTerm] = useState("")

  const filteredProductos = useMemo(() => {
    if (!productos || !searchTerm.trim()) return productos

    const term = searchTerm.toLowerCase()
    return productos.filter((p) =>
      p.id.toString().includes(term) ||
      p.nombre.toLowerCase().includes(term) ||
      p.empresa?.nombre?.toLowerCase().includes(term)
    )
  }, [productos, searchTerm])

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

      <SearchInput
        placeholder="Buscar por ID, nombre o empresa..."
        value={searchTerm}
        onChange={setSearchTerm}
      />

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
                <TableHead>ID</TableHead>
                <TableHead>Producto</TableHead>
                <TableHead>Empresa</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProductos && filteredProductos.length > 0 ? (
                filteredProductos.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-mono text-sm text-muted-foreground">{p.id}</TableCell>
                    <TableCell className="font-medium">{p.nombre}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{p.empresa?.nombre ?? "Sin empresa"}</Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="py-10 text-center text-muted-foreground">
                    {searchTerm ? "No hay resultados que coincidan" : "No hay productos registrados"}
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

"use client"

import { useMemo, useState } from "react"
import { Building2 } from "lucide-react"
import { PageHeader } from "@/components/portal/page-header"
import { Card } from "@/components/ui/card"
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
import { useEmpresas } from "@/lib/features/inventario/useInventario"
import { NuevaEmpresaDialog } from "@/components/modales/nueva-empresa-dialog"

export default function EmpresasPage() {
  const { data: empresas, isLoading } = useEmpresas()
  const [searchTerm, setSearchTerm] = useState("")

  const filteredEmpresas = useMemo(() => {
    if (!empresas || !searchTerm.trim()) return empresas

    const term = searchTerm.toLowerCase()
    return empresas.filter((e) =>
      e.id.toString().includes(term) ||
      e.nombre.toLowerCase().includes(term)
    )
  }, [empresas, searchTerm])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <PageHeader
          icon={Building2}
          title="Empresas"
          description="Empresas registradas en el sistema"
        />
        <NuevaEmpresaDialog />
      </div>

      <SearchInput
        placeholder="Buscar por ID o nombre..."
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
                <TableHead>Nombre</TableHead>
                <TableHead className="text-right">Registrada</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmpresas && filteredEmpresas.length > 0 ? (
                filteredEmpresas.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell className="font-mono text-sm text-muted-foreground">{e.id}</TableCell>
                    <TableCell className="font-medium">{e.nombre}</TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {new Date(e.created_at).toLocaleDateString("es")}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="py-10 text-center text-muted-foreground">
                    {searchTerm ? "No hay resultados que coincidan" : "No hay empresas registradas"}
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

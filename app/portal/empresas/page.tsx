"use client"

import { Building2 } from "lucide-react"
import { PageHeader } from "@/components/portal/page-header"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
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
                <TableHead>Nombre</TableHead>
                <TableHead className="text-right">Registrada</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {empresas && empresas.length > 0 ? (
                empresas.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell className="font-medium">{e.nombre}</TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {new Date(e.created_at).toLocaleDateString("es")}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} className="py-10 text-center text-muted-foreground">
                    No hay empresas registradas
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

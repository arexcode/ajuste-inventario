"use client"

import { useMemo, useState } from "react"
import { Palette } from "lucide-react"
import { PageHeader } from "@/components/portal/page-header"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { SearchInput } from "@/components/ui/search-input"
import { useColores } from "@/lib/features/catalogos/useCatalogos"
import { NuevoColorDialog } from "@/components/modales/nuevo-color-dialog"

export default function ColoresPage() {
  const { data: colores, isLoading } = useColores()
  const [searchTerm, setSearchTerm] = useState("")

  const filteredColores = useMemo(() => {
    if (!colores || !searchTerm.trim()) return colores

    const term = searchTerm.toLowerCase()
    return colores.filter((c) =>
      c.id.toString().includes(term) ||
      c.nombre.toLowerCase().includes(term) ||
      c.hex.toLowerCase().includes(term)
    )
  }, [colores, searchTerm])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <PageHeader icon={Palette} title="Colores" description="Paleta de colores disponible" />
        <NuevoColorDialog />
      </div>

      <SearchInput
        placeholder="Buscar por ID, nombre o código hex..."
        value={searchTerm}
        onChange={setSearchTerm}
      />

      {isLoading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      ) : filteredColores && filteredColores.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {filteredColores.map((c) => (
            <Card key={c.id} className="gap-0 overflow-hidden p-0">
              <div className="h-16 w-full" style={{ backgroundColor: c.hex }} />
              <div className="px-3 py-2.5">
                <p className="truncate text-sm font-medium text-foreground">{c.nombre}</p>
                <p className="text-xs uppercase text-muted-foreground">{c.hex}</p>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="py-10 text-center text-muted-foreground">
          {searchTerm ? "No hay resultados que coincidan" : "No hay colores registrados"}
        </Card>
      )}
    </div>
  )
}

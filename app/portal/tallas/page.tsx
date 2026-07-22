"use client"

import { useMemo, useState } from "react"
import { Ruler } from "lucide-react"
import { PageHeader } from "@/components/portal/page-header"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { SearchInput } from "@/components/ui/search-input"
import { useTallas } from "@/lib/features/catalogos/useCatalogos"
import { NuevaTallaDialog } from "@/components/modales/nueva-talla-dialog"

export default function TallasPage() {
  const { data: tallas, isLoading } = useTallas()
  const [searchTerm, setSearchTerm] = useState("")

  const filteredTallas = useMemo(() => {
    if (!tallas || !searchTerm.trim()) return tallas

    const term = searchTerm.toLowerCase()
    return tallas.filter((t) =>
      t.id.toString().includes(term) ||
      t.nombre.toLowerCase().includes(term)
    )
  }, [tallas, searchTerm])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <PageHeader icon={Ruler} title="Tallas" description="Tallas disponibles en el sistema" />
        <NuevaTallaDialog />
      </div>

      <SearchInput
        placeholder="Buscar por ID o nombre..."
        value={searchTerm}
        onChange={setSearchTerm}
      />

      <Card>
        {isLoading ? (
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-9 w-16 rounded-md" />
            ))}
          </div>
        ) : filteredTallas && filteredTallas.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {filteredTallas.map((t) => (
              <Badge key={t.id} variant="secondary" className="px-3 py-1.5 text-sm">
                {t.nombre}
              </Badge>
            ))}
          </div>
        ) : (
          <p className="py-6 text-center text-muted-foreground">
            {searchTerm ? "No hay resultados que coincidan" : "No hay tallas registradas"}
          </p>
        )}
      </Card>
    </div>
  )
}

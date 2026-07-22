"use client"

import { Ruler } from "lucide-react"
import { PageHeader } from "@/components/portal/page-header"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useTallas } from "@/lib/features/catalogos/useCatalogos"
import { NuevaTallaDialog } from "@/components/modales/nueva-talla-dialog"

export default function TallasPage() {
  const { data: tallas, isLoading } = useTallas()

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <PageHeader icon={Ruler} title="Tallas" description="Tallas disponibles en el sistema" />
        <NuevaTallaDialog />
      </div>

      <Card>
        {isLoading ? (
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-9 w-16 rounded-md" />
            ))}
          </div>
        ) : tallas && tallas.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {tallas.map((t) => (
              <Badge key={t.id} variant="secondary" className="px-3 py-1.5 text-sm">
                {t.nombre}
              </Badge>
            ))}
          </div>
        ) : (
          <p className="py-6 text-center text-muted-foreground">No hay tallas registradas</p>
        )}
      </Card>
    </div>
  )
}

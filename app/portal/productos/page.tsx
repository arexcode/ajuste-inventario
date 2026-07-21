"use client"

import { Button } from "@/components/ui/button"
import { Package } from "lucide-react"

export default function ProductosPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Productos</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Gestiona el catálogo de productos
          </p>
        </div>
        <Button className="gap-2">
          <Package size={20} />
          Agregar Producto
        </Button>
      </div>

      <div className="rounded-lg bg-white p-12 text-center dark:bg-slate-800">
        <Package className="mx-auto mb-4 h-12 w-12 text-slate-400" />
        <p className="text-slate-600 dark:text-slate-400">
          Sección de productos en construcción
        </p>
      </div>
    </div>
  )
}

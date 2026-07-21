"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Package, Trash2, Edit2 } from "lucide-react"

interface Product {
  id: string
  name: string
  description?: string
  price?: number
  stock?: number
}

export default function InventarioPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true)
        const supabase = createClient()
        const { data, error: dbError } = await supabase
          .from("product")
          .select("*")
          .order("created_at", { ascending: false })

        if (dbError) throw dbError
        setProducts(data || [])
      } catch (err) {
        const message = err instanceof Error ? err.message : "Error al cargar productos"
        setError(message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Inventario</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Gestiona todos los productos de tu inventario
          </p>
        </div>
        <Button className="gap-2">
          <Package size={20} />
          Agregar Producto
        </Button>
      </div>

      {error && (
        <div className="rounded-lg bg-red-500/10 p-4 text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center rounded-lg bg-slate-100 p-12 dark:bg-slate-800">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-slate-300 border-t-blue-500 dark:border-slate-600 dark:border-t-blue-400"></div>
            <p className="text-slate-600 dark:text-slate-400">Cargando productos...</p>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg bg-white dark:bg-slate-800 shadow">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-700">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">
                    Nombre
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">
                    Descripción
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">
                    Precio
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">
                    Stock
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <Package className="mx-auto mb-2 h-12 w-12 text-slate-400" />
                      <p className="text-slate-600 dark:text-slate-400">
                        No hay productos en el inventario
                      </p>
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr
                      key={product.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-700/50"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">
                        {product.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                        {product.description || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-900 dark:text-white">
                        ${product.price?.toFixed(2) || "0.00"}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                        {product.stock ?? "-"}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-2"
                          >
                            <Edit2 size={16} />
                            Editar
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-500/10"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

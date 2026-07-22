import { useQuery } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"

export interface ConteoDetalle {
  id: number
  cantidad: number
  created_at: string
  usuario: { id: number; nombre: string; email: string } | null
  variante: {
    id: number
    sku: string
    producto: { nombre: string; empresa: { nombre: string } | null } | null
    color: { nombre: string } | null
    talla: { nombre: string } | null
  } | null
}

/**
 * Trae el detalle de cada registro de conteo con sus relaciones,
 * para la vista y exportación (Excel / PDF).
 */
export function useConteosDetalle() {
  return useQuery({
    queryKey: ["conteos_detalle"],
    queryFn: async (): Promise<ConteoDetalle[]> => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("conteos_inventario")
        .select(
          `
          id,
          cantidad,
          created_at,
          usuario:usuarios ( id, nombre, email ),
          variante:producto_variantes (
            id,
            sku,
            producto:productos ( nombre, empresa:empresas ( nombre ) ),
            color:colores ( nombre ),
            talla:tallas ( nombre )
          )
        `
        )
        .order("created_at", { ascending: false })
      if (error) throw error
      return (data ?? []) as unknown as ConteoDetalle[]
    },
  })
}

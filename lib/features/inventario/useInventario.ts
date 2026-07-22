import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"
import type {
  Empresa,
  VarianteConRelaciones,
  ResumenConteo,
} from "@/lib/types/database"

// ---- Empresas (para el filtro) ----
async function fetchEmpresas(): Promise<Empresa[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("empresas")
    .select("*")
    .order("nombre", { ascending: true })

  if (error) throw error
  return data ?? []
}

export function useEmpresas() {
  return useQuery({
    queryKey: ["empresas"],
    queryFn: fetchEmpresas,
  })
}

// ---- Variantes de inventario con relaciones ----
async function fetchVariantes(): Promise<VarianteConRelaciones[]> {
  const supabase = createClient()
  const { data, error } = await supabase.from("producto_variantes").select(
    `
      id,
      sku,
      producto:productos (
        id,
        nombre,
        empresa_id,
        empresa:empresas ( id, nombre )
      ),
      color:colores ( id, nombre, hex ),
      talla:tallas ( id, nombre )
    `
  )

  if (error) throw error
  return (data ?? []) as unknown as VarianteConRelaciones[]
}

export function useVariantes() {
  return useQuery({
    queryKey: ["producto_variantes"],
    queryFn: fetchVariantes,
  })
}

// ---- Resumen de conteos (stock total por variante) ----
async function fetchResumenConteos(): Promise<ResumenConteo[]> {
  const supabase = createClient()
  const { data, error } = await supabase.from("resumen_conteos").select("*")
  if (error) throw error
  return (data ?? []) as ResumenConteo[]
}

export function useResumenConteos() {
  return useQuery({
    queryKey: ["resumen_conteos"],
    queryFn: fetchResumenConteos,
  })
}

// ---- Registrar / actualizar conteo del usuario (upsert) ----
export interface GuardarConteoInput {
  variante_id: number
  usuario_id: number
  cantidad: number
}

export function useGuardarConteo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ variante_id, usuario_id, cantidad }: GuardarConteoInput) => {
      const supabase = createClient()
      // Upsert: un conteo por (variante, usuario). Requiere la restricción
      // UNIQUE(variante_id, usuario_id) en la BD.
      const { data, error } = await supabase
        .from("conteos_inventario")
        .upsert(
          { variante_id, usuario_id, cantidad },
          { onConflict: "variante_id,usuario_id" }
        )
        .select()
        .single()
      if (error) {
        // Supabase pone el detalle útil en message/details/hint/code.
        console.error("Error al guardar conteo:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        })
        const detalle = [error.message, error.details, error.hint]
          .filter(Boolean)
          .join(" — ")
        throw new Error(detalle || "Error al guardar")
      }
      return data
    },
    onSuccess: () => {
      // Refresca los totales y el detalle del conteo del usuario.
      queryClient.invalidateQueries({ queryKey: ["resumen_conteos"] })
      queryClient.invalidateQueries({ queryKey: ["mis_conteos"] })
      queryClient.invalidateQueries({ queryKey: ["conteos_detalle"] })
    },
  })
}

// ---- Conteos del usuario actual (para prellenar celdas) ----
export function useMisConteos(usuarioId: number | undefined) {
  return useQuery({
    queryKey: ["mis_conteos", usuarioId],
    enabled: !!usuarioId,
    queryFn: async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("conteos_inventario")
        .select("variante_id, cantidad")
        .eq("usuario_id", usuarioId!)
      if (error) throw error
      return (data ?? []) as { variante_id: number; cantidad: number }[]
    },
  })
}

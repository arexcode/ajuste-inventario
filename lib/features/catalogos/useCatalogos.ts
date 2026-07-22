import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"
import type { Color, Talla, Producto } from "@/lib/types/database"

export function useColores() {
  return useQuery({
    queryKey: ["colores"],
    queryFn: async (): Promise<Color[]> => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("colores")
        .select("*")
        .order("nombre", { ascending: true })
      if (error) throw error
      return data ?? []
    },
  })
}

export function useTallas() {
  return useQuery({
    queryKey: ["tallas"],
    queryFn: async (): Promise<Talla[]> => {
      const supabase = createClient()
      const { data, error } = await supabase.from("tallas").select("*")
      if (error) throw error
      return data ?? []
    },
  })
}

export interface ProductoConEmpresa extends Producto {
  empresa: { id: string; nombre: string } | null
}

export function useProductos() {
  return useQuery({
    queryKey: ["productos"],
    queryFn: async (): Promise<ProductoConEmpresa[]> => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("productos")
        .select("id, empresa_id, nombre, created_at, empresa:empresas ( id, nombre )")
        .order("nombre", { ascending: true })
      if (error) throw error
      return (data ?? []) as unknown as ProductoConEmpresa[]
    },
  })
}

// ---- Mutaciones (crear) ----

export function useCrearEmpresa() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (nombre: string) => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("empresas")
        .insert({ nombre })
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["empresas"] })
    },
  })
}

export function useCrearColor() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ nombre, hex }: { nombre: string; hex: string }) => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("colores")
        .insert({ nombre, hex })
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["colores"] })
    },
  })
}

export function useCrearTalla() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (nombre: string) => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("tallas")
        .insert({ nombre })
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tallas"] })
    },
  })
}

export function useCrearProducto() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ nombre, empresa_id }: { nombre: string; empresa_id: number | null }) => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("productos")
        .insert({ nombre, empresa_id })
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productos"] })
    },
  })
}

export interface NuevaVariante {
  producto_id: number
  color_id: number
  talla_id: number
  sku: string
}

export function useCrearVariante() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (variante: NuevaVariante) => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("producto_variantes")
        .insert(variante)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      // Refresca tanto la lista de variantes como el inventario (matriz).
      queryClient.invalidateQueries({ queryKey: ["producto_variantes"] })
    },
  })
}

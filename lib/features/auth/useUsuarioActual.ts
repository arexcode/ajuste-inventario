import { useQuery } from "@tanstack/react-query"
import { useSelector } from "react-redux"
import { createClient } from "@/lib/supabase/client"
import type { RootState } from "@/lib/store"
import type { Usuario } from "@/lib/types/database"

/**
 * Resuelve la fila de `usuarios` (id bigint) a partir del auth_id del
 * usuario logueado. El trigger de Supabase crea esa fila al registrarse.
 */
export function useUsuarioActual() {
  const authUser = useSelector((state: RootState) => state.auth.user)

  return useQuery({
    queryKey: ["usuario-actual", authUser?.id],
    enabled: !!authUser?.id,
    staleTime: 1000 * 60 * 30,
    queryFn: async (): Promise<Usuario | null> => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("usuarios")
        .select("*")
        .eq("auth_id", authUser!.id)
        .maybeSingle()
      if (error) throw error
      return data
    },
  })
}

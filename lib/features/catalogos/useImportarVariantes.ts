import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"

export interface FilaImportacion {
  fila: number // número de fila en el Excel (para reportar errores)
  nombreProducto: string
  nombreColor: string
  nombreTalla: string
}

export interface ResultadoImportacion {
  totalFilas: number
  creadas: number
  duplicadasEnExcel: number
  yaExistian: number
  errores: Array<{ fila: number; motivo: string }>
}

function normalizar(v: string): string {
  return v.trim().toLowerCase()
}

export function useImportarVariantes() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (filas: FilaImportacion[]): Promise<ResultadoImportacion> => {
      const supabase = createClient()
      const errores: ResultadoImportacion["errores"] = []

      // 1. Traer catálogos para resolver nombres → IDs.
      const [prodRes, colorRes, tallaRes] = await Promise.all([
        supabase.from("productos").select("id, nombre"),
        supabase.from("colores").select("id, nombre"),
        supabase.from("tallas").select("id, nombre"),
      ])
      if (prodRes.error) throw prodRes.error
      if (colorRes.error) throw colorRes.error
      if (tallaRes.error) throw tallaRes.error

      // Mapas nombre normalizado → id (primer match gana en nombres repetidos).
      const productoMap = new Map<string, number>()
      for (const p of prodRes.data ?? []) {
        const k = normalizar(p.nombre)
        if (!productoMap.has(k)) productoMap.set(k, p.id)
      }
      const colorMap = new Map<string, number>()
      for (const c of colorRes.data ?? []) {
        const k = normalizar(c.nombre)
        if (!colorMap.has(k)) colorMap.set(k, c.id)
      }
      const tallaMap = new Map<string, number>()
      for (const t of tallaRes.data ?? []) {
        const k = normalizar(t.nombre)
        if (!tallaMap.has(k)) tallaMap.set(k, t.id)
      }

      // 2. Variantes existentes en BD → set de "producto-color-talla".
      const { data: existentes, error: existErr } = await supabase
        .from("producto_variantes")
        .select("producto_id, color_id, talla_id")
      if (existErr) throw existErr

      const claveExistente = (p: number, c: number, t: number) => `${p}-${c}-${t}`
      const yaEnBD = new Set(
        (existentes ?? []).map((v) => claveExistente(v.producto_id, v.color_id, v.talla_id))
      )

      // 3. Resolver cada fila, deduplicar dentro del Excel y contra la BD.
      const vistasEnExcel = new Set<string>()
      const aInsertar: Array<{
        producto_id: number
        color_id: number
        talla_id: number
        sku: string
      }> = []
      let duplicadasEnExcel = 0
      let yaExistian = 0

      for (const fila of filas) {
        const productoId = productoMap.get(normalizar(fila.nombreProducto))
        const colorId = colorMap.get(normalizar(fila.nombreColor))
        const tallaId = tallaMap.get(normalizar(fila.nombreTalla))

        const faltantes: string[] = []
        if (productoId === undefined) faltantes.push(`producto "${fila.nombreProducto}"`)
        if (colorId === undefined) faltantes.push(`color "${fila.nombreColor}"`)
        if (tallaId === undefined) faltantes.push(`talla "${fila.nombreTalla}"`)
        if (faltantes.length > 0) {
          errores.push({
            fila: fila.fila,
            motivo: `No se encontró ${faltantes.join(", ")} en el catálogo.`,
          })
          continue
        }

        const clave = claveExistente(productoId!, colorId!, tallaId!)

        // Duplicado dentro del mismo Excel.
        if (vistasEnExcel.has(clave)) {
          duplicadasEnExcel++
          continue
        }
        vistasEnExcel.add(clave)

        // Ya existe en la BD.
        if (yaEnBD.has(clave)) {
          yaExistian++
          continue
        }

        const sku = `${fila.nombreProducto.replace(/\s+/g, "-")}-${fila.nombreColor.replace(
          /\s+/g,
          "-"
        )}-${fila.nombreTalla}`.toUpperCase()

        aInsertar.push({
          producto_id: productoId!,
          color_id: colorId!,
          talla_id: tallaId!,
          sku,
        })
      }

      // 4. Insertar en lote.
      if (aInsertar.length > 0) {
        const { error: insertErr } = await supabase
          .from("producto_variantes")
          .insert(aInsertar)
        if (insertErr) throw insertErr
      }

      return {
        totalFilas: filas.length,
        creadas: aInsertar.length,
        duplicadasEnExcel,
        yaExistian,
        errores,
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["producto_variantes"] })
      queryClient.invalidateQueries({ queryKey: ["resumen_conteos"] })
    },
  })
}

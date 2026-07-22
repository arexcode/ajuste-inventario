import type { VarianteConRelaciones, ResumenConteo } from "@/lib/types/database"

export interface TallaCol {
  id: number
  nombre: string
}

export interface CeldaMatriz {
  varianteId: number
  stockTotal: number
  miConteo: number
}

export interface ColorRow {
  id: number
  nombre: string
  hex: string
  // celda por talla_id (contiene varianteId + stock total)
  celdaPorTalla: Record<number, CeldaMatriz>
}

export interface ProductoMatriz {
  productoId: number
  productoNombre: string
  empresaId: number
  empresaNombre: string
  tallas: TallaCol[]
  colores: ColorRow[]
  totalStock: number
}

// Orden lógico de tallas conocidas; el resto va alfabético al final.
const ORDEN_TALLAS = ["XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL", "3XL", "4XL"]

function compararTallas(a: string, b: string): number {
  const ia = ORDEN_TALLAS.indexOf(a.toUpperCase())
  const ib = ORDEN_TALLAS.indexOf(b.toUpperCase())
  if (ia !== -1 && ib !== -1) return ia - ib
  if (ia !== -1) return -1
  if (ib !== -1) return 1
  return a.localeCompare(b)
}

/**
 * Agrupa las variantes por producto y arma, para cada uno, la matriz
 * colores (filas) × tallas (columnas).
 * - `stockTotal` de cada celda proviene de resumen_conteos (suma de TODOS).
 * - `miConteo` es el conteo del usuario actual (0 si no ha contado).
 * El `totalStock` del producto usa el total acumulado; las celdas muestran
 * el conteo individual del usuario.
 */
export function agruparEnMatrices(
  variantes: VarianteConRelaciones[],
  resumen: ResumenConteo[],
  misConteos?: Map<number, number>
): ProductoMatriz[] {
  // Mapa variante_id → stock total calculado.
  const stockPorVariante = new Map<number, number>()
  for (const r of resumen) {
    stockPorVariante.set(r.variante_id, Number(r.stock_total_calculado) || 0)
  }

  const porProducto = new Map<
    number,
    {
      productoNombre: string
      empresaId: number
      empresaNombre: string
      tallas: Map<number, string>
      colores: Map<
        number,
        { nombre: string; hex: string; celdas: Map<number, CeldaMatriz> }
      >
      totalStock: number
    }
  >()

  for (const v of variantes) {
    if (!v.producto || !v.color || !v.talla) continue

    const pId = v.producto.id
    if (!porProducto.has(pId)) {
      porProducto.set(pId, {
        productoNombre: v.producto.nombre,
        empresaId: v.producto.empresa_id,
        empresaNombre: v.producto.empresa?.nombre ?? "Sin empresa",
        tallas: new Map(),
        colores: new Map(),
        totalStock: 0,
      })
    }

    const grupo = porProducto.get(pId)!
    grupo.tallas.set(v.talla.id, v.talla.nombre)

    if (!grupo.colores.has(v.color.id)) {
      grupo.colores.set(v.color.id, {
        nombre: v.color.nombre,
        hex: v.color.hex,
        celdas: new Map(),
      })
    }

    const stock = stockPorVariante.get(v.id) ?? 0
    const mio = misConteos?.get(v.id) ?? 0
    grupo.colores.get(v.color.id)!.celdas.set(v.talla.id, {
      varianteId: v.id,
      stockTotal: stock,
      miConteo: mio,
    })
    grupo.totalStock += stock
  }

  const resultado: ProductoMatriz[] = []

  for (const [productoId, grupo] of porProducto) {
    const tallas: TallaCol[] = Array.from(grupo.tallas.entries())
      .map(([id, nombre]) => ({ id, nombre }))
      .sort((a, b) => compararTallas(a.nombre, b.nombre))

    const colores: ColorRow[] = Array.from(grupo.colores.entries())
      .map(([id, c]) => ({
        id,
        nombre: c.nombre,
        hex: c.hex,
        celdaPorTalla: Object.fromEntries(c.celdas),
      }))
      .sort((a, b) => a.nombre.localeCompare(b.nombre))

    resultado.push({
      productoId,
      productoNombre: grupo.productoNombre,
      empresaId: grupo.empresaId,
      empresaNombre: grupo.empresaNombre,
      tallas,
      colores,
      totalStock: grupo.totalStock,
    })
  }

  return resultado.sort((a, b) => a.productoNombre.localeCompare(b.productoNombre))
}

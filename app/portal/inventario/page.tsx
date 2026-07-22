"use client"

import { useMemo, useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  ProductoMatrizCard,
  type CeldaSeleccionada,
} from "@/components/inventario/producto-matriz-card"
import { ConteoDialog } from "@/components/inventario/conteo-dialog"
import {
  useEmpresas,
  useVariantes,
  useResumenConteos,
  useMisConteos,
} from "@/lib/features/inventario/useInventario"
import { useUsuarioActual } from "@/lib/features/auth/useUsuarioActual"
import { agruparEnMatrices } from "@/lib/features/inventario/matriz"
import {
  Search,
  Boxes,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  PackageOpen,
} from "lucide-react"

const PAGE_SIZE = 8
const TODAS = "todas"

export default function InventarioPage() {
  const { data: empresas, isLoading: loadingEmpresas } = useEmpresas()
  const { data: variantes, isLoading, isError, error, refetch } = useVariantes()
  const { data: resumen } = useResumenConteos()
  const { data: usuario } = useUsuarioActual()
  const { data: misConteos } = useMisConteos(usuario?.id)

  const [busqueda, setBusqueda] = useState("")
  const [empresaId, setEmpresaId] = useState<string>(TODAS)
  const [pagina, setPagina] = useState(1)
  const [celda, setCelda] = useState<CeldaSeleccionada | null>(null)

  // Mapa variante_id → mi conteo (para prellenar el modal).
  const misConteosMap = useMemo(() => {
    const m = new Map<number, number>()
    for (const c of misConteos ?? []) m.set(c.variante_id, c.cantidad)
    return m
  }, [misConteos])

  // Agrupa variantes + resumen en matrices por producto.
  // Las celdas muestran el conteo individual del usuario (misConteosMap);
  // el total acumulado de todos queda en el encabezado del producto.
  const matrices = useMemo(
    () => (variantes ? agruparEnMatrices(variantes, resumen ?? [], misConteosMap) : []),
    [variantes, resumen, misConteosMap]
  )

  const filtradas = useMemo(() => {
    const q = busqueda.trim().toLowerCase()
    return matrices.filter((m) => {
      const coincideNombre = q === "" || m.productoNombre.toLowerCase().includes(q)
      const coincideEmpresa = empresaId === TODAS || String(m.empresaId) === empresaId
      return coincideNombre && coincideEmpresa
    })
  }, [matrices, busqueda, empresaId])

  const totalPaginas = Math.max(1, Math.ceil(filtradas.length / PAGE_SIZE))
  const paginaSegura = Math.min(pagina, totalPaginas)
  const visibles = filtradas.slice(
    (paginaSegura - 1) * PAGE_SIZE,
    paginaSegura * PAGE_SIZE
  )

  const onBuscar = (v: string) => {
    setBusqueda(v)
    setPagina(1)
  }
  const onEmpresa = (v: string | null) => {
    setEmpresaId(v ?? TODAS)
    setPagina(1)
  }

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Boxes className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Inventario</h1>
          <p className="text-sm text-muted-foreground">
            Haz clic en una celda para registrar tu conteo
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={busqueda}
            onChange={(e) => onBuscar(e.target.value)}
            placeholder="Buscar producto por nombre..."
            className="pl-10"
          />
        </div>
        <Select value={empresaId} onValueChange={onEmpresa}>
          <SelectTrigger className="h-10 w-full sm:w-56">
            <SelectValue placeholder="Todas las empresas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={TODAS}>Todas las empresas</SelectItem>
            {empresas?.map((e) => (
              <SelectItem key={e.id} value={String(e.id)}>
                {e.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Estados */}
      {isError ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-destructive/30 bg-destructive/5 py-16 text-center">
          <AlertCircle className="h-10 w-10 text-destructive" />
          <div>
            <p className="font-medium text-foreground">Error al cargar el inventario</p>
            <p className="text-sm text-muted-foreground">
              {error instanceof Error ? error.message : "Intenta nuevamente"}
            </p>
          </div>
          <Button variant="outline" onClick={() => refetch()}>
            Reintentar
          </Button>
        </div>
      ) : isLoading || loadingEmpresas ? (
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-56 w-full rounded-xl" />
          ))}
        </div>
      ) : filtradas.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border py-16 text-center">
          <PackageOpen className="h-10 w-10 text-muted-foreground" />
          <div>
            <p className="font-medium text-foreground">Sin resultados</p>
            <p className="text-sm text-muted-foreground">
              {busqueda || empresaId !== TODAS
                ? "Ajusta la búsqueda o el filtro de empresa"
                : "Aún no hay variantes registradas"}
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            {visibles.map((m) => (
              <ProductoMatrizCard
                key={m.productoId}
                producto={m}
                onCeldaClick={setCelda}
              />
            ))}
          </div>

          {/* Paginación */}
          <div className="flex items-center justify-between border-t border-border pt-4">
            <p className="text-sm text-muted-foreground">
              Mostrando{" "}
              <span className="font-medium text-foreground">
                {(paginaSegura - 1) * PAGE_SIZE + 1}–
                {Math.min(paginaSegura * PAGE_SIZE, filtradas.length)}
              </span>{" "}
              de <span className="font-medium text-foreground">{filtradas.length}</span> productos
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPagina((p) => Math.max(1, p - 1))}
                disabled={paginaSegura <= 1}
                aria-label="Página anterior"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="min-w-20 text-center text-sm text-muted-foreground">
                {paginaSegura} / {totalPaginas}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
                disabled={paginaSegura >= totalPaginas}
                aria-label="Página siguiente"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Modal de conteo */}
      <ConteoDialog
        celda={celda}
        usuarioId={usuario?.id}
        miConteoPrevio={celda ? misConteosMap.get(celda.varianteId) : undefined}
        onClose={() => setCelda(null)}
      />
    </div>
  )
}

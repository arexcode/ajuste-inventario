"use client"

import { useState } from "react"
import * as XLSX from "xlsx"
import {
  FileUp,
  UploadCloud,
  FileSpreadsheet,
  Info,
  Loader2,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react"
import { PageHeader } from "@/components/portal/page-header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  useImportarVariantes,
  type FilaImportacion,
  type ResultadoImportacion,
} from "@/lib/features/catalogos/useImportarVariantes"

// Lee la hoja como matriz cruda (array de arrays) y arma las filas de
// importación por POSICIÓN de columna, empezando en la fila 2 (índice 1):
//   Columna A (0) = NOMBRE PRODUCTO
//   Columna B (1) = COLOR
//   Columna C (2) = TALLA
//   Columna D (3) = PRECIO DE VENTA  (se ignora)
//   Columna E (4) = COSTO            (se ignora)
function leerFilas(matriz: unknown[][]): { filas: FilaImportacion[] } {
  const COL_PRODUCTO = 0
  const COL_COLOR = 1
  const COL_TALLA = 2
  const PRIMERA_FILA_DATOS = 1 // índice 1 = fila 2 del Excel

  const filas: FilaImportacion[] = []
  for (let r = PRIMERA_FILA_DATOS; r < matriz.length; r++) {
    const celdas = matriz[r] ?? []
    const nombreProducto = String(celdas[COL_PRODUCTO] ?? "").trim()
    const nombreColor = String(celdas[COL_COLOR] ?? "").trim()
    const nombreTalla = String(celdas[COL_TALLA] ?? "").trim()

    // Ignora filas totalmente vacías.
    if (!nombreProducto && !nombreColor && !nombreTalla) continue

    filas.push({
      fila: r + 1, // base 1, número de fila real en el Excel
      nombreProducto,
      nombreColor,
      nombreTalla,
    })
  }

  return { filas }
}

export default function ImportacionPage() {
  const [archivo, setArchivo] = useState<File | null>(null)
  const [errorArchivo, setErrorArchivo] = useState<string | null>(null)
  const [resultado, setResultado] = useState<ResultadoImportacion | null>(null)
  const [arrastrando, setArrastrando] = useState(false)
  const { mutateAsync, isPending } = useImportarVariantes()

  const seleccionar = (f: File | null) => {
    setArchivo(f)
    setResultado(null)
    setErrorArchivo(null)
  }

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    seleccionar(e.target.files?.[0] ?? null)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setArrastrando(false)
    const f = e.dataTransfer.files?.[0]
    if (f) seleccionar(f)
  }

  const procesar = async () => {
    if (!archivo) return
    setErrorArchivo(null)
    setResultado(null)
    try {
      const buffer = await archivo.arrayBuffer()
      const wb = XLSX.read(buffer, { type: "array" })
      if (wb.SheetNames.length === 0) {
        setErrorArchivo("El archivo no contiene ninguna hoja.")
        return
      }
      const hoja = wb.Sheets[wb.SheetNames[0]]
      // Lee como matriz cruda (array de arrays) para leer por posición de columna.
      const matriz = XLSX.utils.sheet_to_json<unknown[]>(hoja, {
        header: 1,
        defval: "",
        blankrows: false,
      })

      const { filas } = leerFilas(matriz)

      if (filas.length === 0) {
        setErrorArchivo("El archivo no contiene filas de datos.")
        return
      }

      const res = await mutateAsync(filas)
      setResultado(res)
    } catch (err) {
      setErrorArchivo(
        err instanceof Error ? err.message : "No se pudo procesar el archivo."
      )
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        icon={FileUp}
        title="Importación"
        description="Carga masiva de variantes desde un archivo Excel"
      />

      {/* Instrucciones de formato */}
      <Card className="flex-row items-start gap-3 border-primary/30 bg-primary/5">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
        <div className="text-sm">
          <p className="font-medium text-foreground">Formato esperado</p>
          <p className="text-muted-foreground">
            Las columnas se leen por posición, con los datos a partir de la{" "}
            <span className="font-medium text-foreground">fila 2</span>:{" "}
            <span className="font-medium text-foreground">A = NOMBRE PRODUCTO</span>,{" "}
            <span className="font-medium text-foreground">B = COLOR</span>,{" "}
            <span className="font-medium text-foreground">C = TALLA</span> (D = Precio y
            E = Costo se ignoran). Por cada fila se crea una variante; las combinaciones
            repetidas —dentro del Excel o que ya existan— se omiten automáticamente.
          </p>
        </div>
      </Card>

      {/* Zona de carga */}
      <Card>
        <label
          htmlFor="archivo-excel"
          onDragOver={(e) => {
            e.preventDefault()
            setArrastrando(true)
          }}
          onDragLeave={() => setArrastrando(false)}
          onDrop={handleDrop}
          className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed py-12 text-center transition-colors ${
            arrastrando
              ? "border-primary bg-primary/10"
              : "border-border hover:border-primary/50 hover:bg-muted/40"
          }`}
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <UploadCloud className="h-7 w-7" />
          </div>
          <div>
            <p className="font-medium text-foreground">
              {archivo ? archivo.name : "Arrastra un archivo o haz clic para seleccionar"}
            </p>
            <p className="text-sm text-muted-foreground">Formatos admitidos: .xlsx, .xls</p>
          </div>
          <input
            id="archivo-excel"
            type="file"
            accept=".xlsx,.xls"
            className="hidden"
            onChange={handleInput}
            disabled={isPending}
          />
        </label>

        {archivo && (
          <div className="mt-4 flex items-center justify-between rounded-lg bg-muted/50 p-3">
            <span className="flex items-center gap-2 text-sm">
              <FileSpreadsheet className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              {archivo.name}
              <span className="text-muted-foreground">
                ({(archivo.size / 1024).toFixed(1)} KB)
              </span>
            </span>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => seleccionar(null)}
                disabled={isPending}
              >
                Quitar
              </Button>
              <Button size="sm" onClick={procesar} disabled={isPending}>
                {isPending && <Loader2 className="mr-1 h-4 w-4 animate-spin" />}
                Procesar
              </Button>
            </div>
          </div>
        )}

        {errorArchivo && (
          <div className="mt-4 flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{errorArchivo}</span>
          </div>
        )}
      </Card>

      {/* Resultado */}
      {resultado && (
        <Card className="space-y-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="font-semibold text-foreground">Importación completada</h3>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <ResumenItem label="Filas leídas" value={resultado.totalFilas} />
            <ResumenItem
              label="Variantes creadas"
              value={resultado.creadas}
              destacado
            />
            <ResumenItem label="Ya existían" value={resultado.yaExistian} />
            <ResumenItem
              label="Duplicadas en Excel"
              value={resultado.duplicadasEnExcel}
            />
          </div>

          {resultado.errores.length > 0 && (
            <div className="space-y-2">
              <p className="flex items-center gap-2 text-sm font-medium text-amber-600 dark:text-amber-400">
                <AlertTriangle className="h-4 w-4" />
                {resultado.errores.length} fila(s) con problemas
              </p>
              <div className="max-h-56 overflow-y-auto rounded-lg border border-border">
                <ul className="divide-y divide-border text-sm">
                  {resultado.errores.map((e, i) => (
                    <li key={i} className="flex gap-3 px-3 py-2">
                      <span className="shrink-0 font-mono text-muted-foreground">
                        Fila {e.fila}
                      </span>
                      <span className="text-foreground">{e.motivo}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  )
}

function ResumenItem({
  label,
  value,
  destacado,
}: {
  label: string
  value: number
  destacado?: boolean
}) {
  return (
    <div className="rounded-lg bg-muted/50 p-3">
      <p
        className={`text-2xl font-bold tabular-nums ${
          destacado ? "text-emerald-600 dark:text-emerald-400" : "text-foreground"
        }`}
      >
        {value}
      </p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  )
}

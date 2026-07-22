import * as XLSX from "xlsx"
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"
import type { ConteoDetalle } from "./useConteosDetalle"

export interface FilaExport {
  empresa: string
  producto: string
  sku: string
  color: string
  talla: string
  usuario: string
  cantidad: number
  fecha: string
}

export function aFilas(conteos: ConteoDetalle[]): FilaExport[] {
  return conteos.map((c) => ({
    empresa: c.variante?.producto?.empresa?.nombre ?? "—",
    producto: c.variante?.producto?.nombre ?? "—",
    sku: c.variante?.sku ?? "—",
    color: c.variante?.color?.nombre ?? "—",
    talla: c.variante?.talla?.nombre ?? "—",
    usuario: c.usuario?.nombre ?? c.usuario?.email ?? "—",
    cantidad: c.cantidad,
    fecha: new Date(c.created_at).toLocaleString("es"),
  }))
}

const ENCABEZADOS = [
  "Empresa",
  "Producto",
  "SKU",
  "Color",
  "Talla",
  "Usuario",
  "Cantidad",
  "Fecha",
]

export function exportarExcel(conteos: ConteoDetalle[], nombre = "conteos") {
  const filas = aFilas(conteos)
  const ws = XLSX.utils.json_to_sheet(
    filas.map((f) => ({
      Empresa: f.empresa,
      Producto: f.producto,
      SKU: f.sku,
      Color: f.color,
      Talla: f.talla,
      Usuario: f.usuario,
      Cantidad: f.cantidad,
      Fecha: f.fecha,
    }))
  )
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, "Conteos")
  XLSX.writeFile(wb, `${nombre}.xlsx`)
}

export function exportarPDF(conteos: ConteoDetalle[], nombre = "conteos") {
  const filas = aFilas(conteos)
  const doc = new jsPDF()

  doc.setFontSize(14)
  doc.text("Reporte de conteos de inventario", 14, 16)
  doc.setFontSize(9)
  doc.setTextColor(120)
  doc.text(`Generado: ${new Date().toLocaleString("es")}`, 14, 22)

  autoTable(doc, {
    startY: 28,
    head: [ENCABEZADOS],
    body: filas.map((f) => [
      f.empresa,
      f.producto,
      f.sku,
      f.color,
      f.talla,
      f.usuario,
      String(f.cantidad),
      f.fecha,
    ]),
    styles: { fontSize: 8 },
    headStyles: { fillColor: [59, 130, 246] },
  })

  doc.save(`${nombre}.pdf`)
}

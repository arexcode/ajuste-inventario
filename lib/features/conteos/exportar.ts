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
  overshark70: number
  bravos30: number
  fecha: string
}

export function aFilas(conteos: ConteoDetalle[]): FilaExport[] {
  return conteos.map((c) => {
    const cantidad = c.cantidad
    const overshark70 = Math.round(cantidad * 0.7)
    const bravos30 = cantidad - overshark70 // Resto para que sume exacto
    return {
      empresa: c.variante?.producto?.empresa?.nombre ?? "—",
      producto: c.variante?.producto?.nombre ?? "—",
      sku: c.variante?.sku ?? "—",
      color: c.variante?.color?.nombre ?? "—",
      talla: c.variante?.talla?.nombre ?? "—",
      usuario: c.usuario?.nombre ?? c.usuario?.email ?? "—",
      cantidad,
      overshark70,
      bravos30,
      fecha: new Date(c.created_at).toLocaleString("es"),
    }
  })
}

const ENCABEZADOS = [
  "Empresa",
  "Producto",
  "SKU",
  "Color",
  "Talla",
  "Usuario",
  "Cantidad Total",
  "Overshark (70%)",
  "Bravos (30%)",
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
      "Cantidad Total": f.cantidad,
      "Overshark (70%)": f.overshark70,
      "Bravos (30%)": f.bravos30,
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
  doc.setFontSize(8)
  doc.setTextColor(100)
  doc.text("Distribución: Overshark 70% | Bravos 30%", 14, 27)

  autoTable(doc, {
    startY: 32,
    head: [ENCABEZADOS],
    body: filas.map((f) => [
      f.empresa,
      f.producto,
      f.sku,
      f.color,
      f.talla,
      f.usuario,
      String(f.cantidad),
      String(f.overshark70),
      String(f.bravos30),
      f.fecha,
    ]),
    styles: { fontSize: 7 },
    headStyles: { fillColor: [59, 130, 246] },
  })

  doc.save(`${nombre}.pdf`)
}

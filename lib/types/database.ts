// Tipos que reflejan el esquema de Supabase
// IDs son BIGSERIAL en la BD → number en el cliente.

export interface Empresa {
  id: number
  nombre: string
  created_at: string
}

export interface Color {
  id: number
  nombre: string
  hex: string
}

export interface Talla {
  id: number
  nombre: string
}

export interface Usuario {
  id: number
  auth_id: string | null
  nombre: string
  email: string
}

export interface Producto {
  id: number
  empresa_id: number
  nombre: string
  created_at: string
}

export interface ProductoVariante {
  id: number
  producto_id: number
  color_id: number
  talla_id: number
  sku: string
  created_at: string
}

export interface ConteoInventario {
  id: number
  variante_id: number
  usuario_id: number
  cantidad: number
  created_at: string
}

// Vista resumen_conteos (stock total por variante)
export interface ResumenConteo {
  variante_id: number
  stock_total_calculado: number
  numero_de_registros_de_conteo: number
}

// Variante con datos relacionados (para inventario y listado)
export interface VarianteConRelaciones {
  id: number
  sku: string
  producto: {
    id: number
    nombre: string
    empresa_id: number
    empresa: { id: number; nombre: string } | null
  } | null
  color: Color | null
  talla: Talla | null
}

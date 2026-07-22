-- ============================================================
-- Ejecutar en Supabase → SQL Editor
-- Arregla: "there is no unique or exclusion constraint matching
--          the ON CONFLICT specification"
-- Causa: falta UNIQUE(variante_id, usuario_id) en conteos_inventario,
--        que el upsert (onConflict) necesita.
-- Este script es idempotente: se puede correr varias veces.
-- ============================================================

-- PASO 1 — Detectar duplicados que impedirían crear el UNIQUE.
-- Si esta consulta devuelve filas, hay que limpiarlas antes (PASO 2).
SELECT variante_id, usuario_id, COUNT(*) AS repeticiones
FROM conteos_inventario
GROUP BY variante_id, usuario_id
HAVING COUNT(*) > 1;

-- PASO 2 — (SOLO si el PASO 1 devolvió filas) Elimina duplicados,
-- conservando el registro más reciente por (variante_id, usuario_id).
-- Descomenta para ejecutar:
--
-- DELETE FROM conteos_inventario c
-- USING conteos_inventario c2
-- WHERE c.variante_id = c2.variante_id
--   AND c.usuario_id  = c2.usuario_id
--   AND c.id < c2.id;

-- PASO 3 — Crear la restricción UNIQUE (idempotente).
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'conteos_variante_usuario_unique'
      AND conrelid = 'conteos_inventario'::regclass
  ) THEN
    ALTER TABLE conteos_inventario
      ADD CONSTRAINT conteos_variante_usuario_unique
      UNIQUE (variante_id, usuario_id);
  END IF;
END $$;

-- PASO 4 — Verificar que quedó creada. Debe devolver una fila.
SELECT conname, contype
FROM pg_constraint
WHERE conrelid = 'conteos_inventario'::regclass
  AND conname = 'conteos_variante_usuario_unique';

-- ============================================================
-- Ejecutar en Supabase → SQL Editor
-- Restricción para upsert de conteos + políticas RLS
-- ============================================================

-- 1) Un conteo por (variante, usuario): permite ON CONFLICT (upsert)
ALTER TABLE conteos_inventario
  ADD CONSTRAINT conteos_variante_usuario_unique
  UNIQUE (variante_id, usuario_id);

-- ============================================================
-- 2) Habilitar RLS en todas las tablas del esquema public
-- ============================================================
ALTER TABLE empresas             ENABLE ROW LEVEL SECURITY;
ALTER TABLE colores              ENABLE ROW LEVEL SECURITY;
ALTER TABLE tallas               ENABLE ROW LEVEL SECURITY;
ALTER TABLE usuarios             ENABLE ROW LEVEL SECURITY;
ALTER TABLE productos            ENABLE ROW LEVEL SECURITY;
ALTER TABLE producto_variantes   ENABLE ROW LEVEL SECURITY;
ALTER TABLE conteos_inventario   ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 3) Catálogos: lectura y escritura para usuarios autenticados
--    (empresas, colores, tallas, productos, producto_variantes)
-- ============================================================
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['empresas','colores','tallas','productos','producto_variantes']
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS "auth_select_%1$s" ON %1$s;', t);
    EXECUTE format('DROP POLICY IF EXISTS "auth_insert_%1$s" ON %1$s;', t);
    EXECUTE format('DROP POLICY IF EXISTS "auth_update_%1$s" ON %1$s;', t);

    EXECUTE format(
      'CREATE POLICY "auth_select_%1$s" ON %1$s FOR SELECT TO authenticated USING (true);', t);
    EXECUTE format(
      'CREATE POLICY "auth_insert_%1$s" ON %1$s FOR INSERT TO authenticated WITH CHECK (true);', t);
    EXECUTE format(
      'CREATE POLICY "auth_update_%1$s" ON %1$s FOR UPDATE TO authenticated USING (true) WITH CHECK (true);', t);
  END LOOP;
END $$;

-- ============================================================
-- 4) usuarios: cada quien lee/actualiza su propia fila
-- ============================================================
DROP POLICY IF EXISTS "usuarios_select_propio" ON usuarios;
DROP POLICY IF EXISTS "usuarios_update_propio" ON usuarios;

CREATE POLICY "usuarios_select_propio" ON usuarios
  FOR SELECT TO authenticated
  USING (auth_id = (select auth.uid()));

CREATE POLICY "usuarios_update_propio" ON usuarios
  FOR UPDATE TO authenticated
  USING (auth_id = (select auth.uid()))
  WITH CHECK (auth_id = (select auth.uid()));

-- ============================================================
-- 5) conteos_inventario: leer todos (para el total),
--    pero solo escribir/actualizar los propios
-- ============================================================
DROP POLICY IF EXISTS "conteos_select_todos" ON conteos_inventario;
DROP POLICY IF EXISTS "conteos_insert_propio" ON conteos_inventario;
DROP POLICY IF EXISTS "conteos_update_propio" ON conteos_inventario;

CREATE POLICY "conteos_select_todos" ON conteos_inventario
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "conteos_insert_propio" ON conteos_inventario
  FOR INSERT TO authenticated
  WITH CHECK (
    usuario_id IN (SELECT id FROM usuarios WHERE auth_id = (select auth.uid()))
  );

CREATE POLICY "conteos_update_propio" ON conteos_inventario
  FOR UPDATE TO authenticated
  USING (
    usuario_id IN (SELECT id FROM usuarios WHERE auth_id = (select auth.uid()))
  )
  WITH CHECK (
    usuario_id IN (SELECT id FROM usuarios WHERE auth_id = (select auth.uid()))
  );

-- ============================================================
-- 6) La vista resumen_conteos debe respetar RLS del invocador
--    (Postgres 15+). Así el total refleja las filas visibles.
-- ============================================================
ALTER VIEW resumen_conteos SET (security_invoker = true);

# ⚡ Quick Start - Guía Rápida

## 5 Minutos para que tu app funcione

### 1️⃣ Crear Proyecto en Supabase (2 min)

```
1. Ve a https://supabase.com
2. Haz clic en "New Project"
3. Crea tu proyecto
4. Espera a que se inicialice
```

### 2️⃣ Copiar Credenciales (1 min)

En tu proyecto de Supabase:
- Ve a **Settings → API**
- Copia **Project URL**
- Copia **anon public key**

### 3️⃣ Crear `.env.local` (30 sec)

En la raíz del proyecto:

```bash
cp .env.example .env.local
```

Edita `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_key_aqui
```

### 4️⃣ Crear Tabla de Productos (1 min)

En Supabase **SQL Editor**, copia y ejecuta:

```sql
CREATE TABLE IF NOT EXISTS product (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2),
  stock INTEGER,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

ALTER TABLE product ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view products" ON product
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert" ON product
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update" ON product
  FOR UPDATE USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete" ON product
  FOR DELETE USING (auth.role() = 'authenticated');
```

### 5️⃣ Ejecutar la App (30 sec)

```bash
npm install
npm run dev
```

## ✅ Listo! Prueba tu app

Abre [http://localhost:3000](http://localhost:3000)

### Credenciales de prueba:

```
Email: test@example.com
Contraseña: 123456
```

## 📍 Rutas principales

| Ruta | Descripción |
|------|-------------|
| `/` | Redirige a login si no está autenticado |
| `/auth/login` | Página de inicio de sesión |
| `/auth/signup` | Página de registro |
| `/portal` | Dashboard (protegido) |
| `/portal/inventario` | Tabla de productos |
| `/portal/empresas` | Sección de empresas |
| `/portal/productos` | Catálogo de productos |

## 🎨 Features

- ✅ Autenticación con Supabase
- ✅ Redux para estado global
- ✅ Protección de rutas
- ✅ Sidebar responsive
- ✅ Avatar del usuario
- ✅ Cambio de tema
- ✅ Tabla de productos desde BD
- ✅ Logout seguro

## 🔗 Archivos Importantes

- **Autenticación:** `app/auth/login`, `app/auth/signup`
- **Portal:** `app/portal/layout.tsx`, `app/portal/inventario`
- **Redux:** `lib/store.ts`, `lib/features/auth`
- **Supabase:** `lib/supabase/client.ts`
- **Sidebar:** `components/sidebar/sidebar.tsx`
- **Protección:** `components/protected-route.tsx`

## 📚 Documentación Detallada

- **CONFIGURATION.md** - Pasos detallados
- **ARCHITECTURE.md** - Diagrama de arquitectura
- **PROJECT_SUMMARY.md** - Resumen completo
- **SETUP.md** - Guía de instalación

## ⚠️ Recuerda

1. ✅ Crear `.env.local` (NO commitear)
2. ✅ Ejecutar SQL en Supabase
3. ✅ Instalar dependencias con `npm install`
4. ✅ Ejecutar `npm run dev`

---

**¿Dudas?** Revisa `CONFIGURATION.md` o `ARCHITECTURE.md`

**¡Listo para producción!** 🚀

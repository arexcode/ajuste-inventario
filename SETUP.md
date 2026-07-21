# Sistema de Ajuste Inventario - Guía de Configuración

## Requisitos Previos

- Node.js 18+
- npm o yarn
- Cuenta en Supabase

## Instalación

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar Supabase

#### 2.1 Obtener credenciales
1. Ve a [supabase.com](https://supabase.com) y crea un proyecto
2. En **Settings → API**, copia:
   - `Project URL`
   - `anon` (public) key

#### 2.2 Crear archivo .env.local

Copia `.env.example` y renómbralo a `.env.local`:

```bash
cp .env.example .env.local
```

Completa las variables:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_key_aqui
```

#### 2.3 Crear tabla de productos

En la consola SQL de Supabase, ejecuta:

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

-- Habilitar Row Level Security
ALTER TABLE product ENABLE ROW LEVEL SECURITY;

-- Política para SELECT (todos pueden ver)
CREATE POLICY "Anyone can view products" ON product
  FOR SELECT USING (true);

-- Política para INSERT (solo usuarios autenticados)
CREATE POLICY "Authenticated users can insert" ON product
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Política para UPDATE (solo usuarios autenticados)
CREATE POLICY "Authenticated users can update" ON product
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Política para DELETE (solo usuarios autenticados)
CREATE POLICY "Authenticated users can delete" ON product
  FOR DELETE USING (auth.role() = 'authenticated');
```

### 3. Ejecutar la aplicación

```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

## Estructura del Proyecto

### Autenticación (`/app/auth`)

- `/login` - Página de inicio de sesión
- `/signup` - Página de registro

**Características:**
- Autenticación con Supabase
- Redux para estado global
- Validación de formularios
- Protección de rutas

### Portal (`/app/portal`)

- `/inventario` - Tabla de productos
- `/empresas` - Sección de empresas (en construcción)
- `/productos` - Catálogo de productos (en construcción)

**Características:**
- Sidebar con menú
- Cambio de tema (claro/oscuro)
- Avatar del usuario
- Botón de cerrar sesión

## Estado Global (Redux)

### Store

Ubicado en `/lib/store.ts`

### Slices

- `authSlice` - Estado de autenticación

### Hooks

- `useAuth()` - Hook para autenticación

```typescript
const { user, isLoading, error, signUp, signIn, signOut, getSession } = useAuth()
```

## Componentes Principales

- `ProtectedRoute` - Protege rutas (redirige a login si no está autenticado)
- `Sidebar` - Menú lateral con navegación
- `AuthInit` - Inicializa estado de autenticación

## Próximos Pasos

1. Agregar más módulos en `/app/portal`
2. Implementar CRUD de productos
3. Implementar CRUD de empresas
4. Agregar filtros y búsqueda en inventario
5. Crear reportes

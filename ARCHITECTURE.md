# Arquitectura del Sistema

## Flujo de Autenticación

```
┌─────────────┐
│   Usuario   │
└──────┬──────┘
       │
       ▼
┌─────────────────┐      ┌──────────────────┐
│   /auth/login   │──────▶  Supabase Auth   │
│   /auth/signup  │      └──────────────────┘
└────────┬────────┘
         │
         ▼
┌──────────────────────┐
│   Redux Store        │
│  - Auth Slice        │
│  - User State        │
└──────────────────────┘
         │
         ▼
┌──────────────────────┐
│  ProtectedRoute      │
│  - Verifica user     │
│  - Redirige a login  │
└──────────────────────┘
         │
         ▼
┌──────────────────────┐
│   /portal/*          │
│  - Dashboard seguro  │
└──────────────────────┘
```

## Estructura de Carpetas

```
app-ajuste-inventario/
├── app/
│   ├── auth/                    # Autenticación
│   │   ├── login/
│   │   │   └── page.tsx         # Página de login
│   │   ├── signup/
│   │   │   └── page.tsx         # Página de registro
│   │   └── layout.tsx
│   ├── portal/                  # Dashboard protegido
│   │   ├── inventario/
│   │   │   └── page.tsx         # Tabla de productos
│   │   ├── empresas/
│   │   │   └── page.tsx         # Gestión de empresas
│   │   ├── productos/
│   │   │   └── page.tsx         # Catálogo de productos
│   │   └── layout.tsx           # Layout con sidebar
│   ├── layout.tsx               # Layout raíz
│   └── globals.css
├── lib/
│   ├── store.ts                 # Configuración de Redux
│   ├── supabase/
│   │   └── client.ts            # Cliente de Supabase
│   ├── features/
│   │   └── auth/
│   │       ├── authSlice.ts     # Redux slice
│   │       └── authHooks.ts     # Hooks personalizados
│   └── utils.ts
├── components/
│   ├── providers.tsx            # Redux + Theme Provider
│   ├── auth-init.tsx            # Inicializa autenticación
│   ├── protected-route.tsx      # Protección de rutas
│   ├── sidebar/
│   │   └── sidebar.tsx          # Menú lateral
│   ├── ui/
│   │   ├── button.tsx
│   │   └── input.tsx
│   └── theme-provider.tsx
├── SETUP.md                     # Guía de instalación
└── ARCHITECTURE.md              # Este archivo
```

## Componentes Principales

### 1. AuthInit (`components/auth-init.tsx`)

Inicializa el estado de autenticación al cargar la app:
- Obtiene la sesión actual
- Escucha cambios de autenticación
- Actualiza Redux store

### 2. ProtectedRoute (`components/protected-route.tsx`)

Protege rutas del portal:
- Verifica si hay usuario autenticado
- Redirige a login si no está autenticado
- Muestra loading mientras verifica

### 3. Sidebar (`components/sidebar/sidebar.tsx`)

Menú principal con:
- Navegación por secciones
- Información del usuario (avatar + email)
- Cambio de tema
- Botón de cerrar sesión

## Flujo de Datos (Redux)

```
┌─────────────────────────────────┐
│   Redux Store                   │
├─────────────────────────────────┤
│ auth: {                         │
│   user: User | null             │
│   isLoading: boolean            │
│   error: string | null          │
│ }                               │
└─────────────────────────────────┘
         ▲
         │
    Acciones:
    - setUser()
    - setLoading()
    - setError()
    - clearError()
```

## Seguridad

### 1. Autenticación
- Supabase Auth (email/password)
- JWT tokens gestionados automáticamente
- Sesiones persistentes

### 2. Protección de Rutas
- ProtectedRoute valida estado de auth
- Redirige a /auth/login si no autenticado
- Previene acceso directo a /portal

### 3. RLS (Row Level Security)
- Tabla `product` protegida con RLS
- Solo usuarios autenticados pueden insertar/actualizar/eliminar
- Todos pueden ver productos (SELECT)

## Variables de Entorno

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## Próximas Integraciones

- [ ] CRUD completo de productos
- [ ] CRUD de empresas
- [ ] Filtros y búsqueda
- [ ] Paginación
- [ ] Reportes
- [ ] Notificaciones
- [ ] Auditoría de cambios

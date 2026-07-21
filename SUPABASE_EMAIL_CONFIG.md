# Configuración de Email en Supabase

## Problema: "Email not confirmed"

Si al registrarte aparece el error "Email not confirmed" al intentar iniciar sesión, debes desactivar la verificación de email en Supabase.

## Solución

### Paso 1: Ir a Authentication Settings

1. Abre tu proyecto en [supabase.com](https://supabase.com)
2. Ve a **Authentication → Providers → Email**
3. En la sección **Email Confirmations**, desactiva:
   - ☐ "Confirm email" 

### Paso 2: Cambiar configuración

En la sección **Email Confirmations**:

- **Deselecciona** el checkbox de "Confirm email"
- Esto permitirá que los usuarios se registren sin tener que confirmar su email

### Paso 3: Guardar cambios

El cambio se guarda automáticamente.

## Verificación

Después de hacer este cambio:

1. **Registra un usuario nuevo** en `/auth/signup`
2. **Intenta iniciar sesión** en `/auth/login`
3. No debería aparecer el error "Email not confirmed"

## Resultado

Ahora los usuarios se registran e inician sesión inmediatamente sin necesidad de confirmar su email.

---

**Alternativa:** Si quieres mantener la confirmación de email, necesitarías:
- Enviar un email de confirmación
- Crear una página de callback para confirmar el email
- Esto es más complejo y requiere configuración adicional

Para este proyecto, recomendamos **desactivar la confirmación de email**.

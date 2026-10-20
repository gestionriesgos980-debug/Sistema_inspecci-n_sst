# CAM-SST — Activación de autenticación

Esta versión agrega una pantalla de inicio de sesión conectada a **Supabase Auth**. El acceso real no funcionará hasta configurar la clave pública del proyecto.

## Configuración obligatoria antes de probar
1. Abre `supabase-config.js`.
2. Conserva la URL del proyecto ya configurada si corresponde al proyecto de CAM-SST.
3. En Supabase, entra en **Project Settings → API Keys** y copia la clave **publishable** (o la `anon` heredada si ese proyecto todavía la usa).
4. Pégala en `SUPABASE_PUBLISHABLE_KEY`. Es una clave pública de cliente; **nunca uses `service_role` ni una secret key** en este archivo.
5. Guarda y publica todos los archivos de esta carpeta. La autenticación de Supabase debe tener habilitado el proveedor Email y los usuarios deben existir en Auth.

## Alcance y limitación importante
- El formulario valida correo y contraseña contra Supabase Auth; la sesión se mantiene mediante el cliente de Supabase y se puede cerrar desde el encabezado.
- No hay contraseña fija ni credenciales de demostración codificadas en el proyecto.
- **Esto autentica la identidad, pero todavía no reemplaza la autorización comercial de TECCHNEX**: antes de usar datos reales hay que enlazar la sesión con `tecchnex-product-authorize`, comprobar el cliente/contrato CAM-SST y aplicar aislamiento por cliente en el almacenamiento. Actualmente las evaluaciones y fotos continúan en IndexedDB local del navegador. No uses datos reales o sensibles hasta completar esa fase.
- La biblioteca de Supabase se carga desde `https://esm.sh`; la primera conexión requiere Internet.

## Verificación
1. Abre el proyecto mediante Live Server o GitHub Pages (no como archivo `file://`).
2. Comprueba que aparece la pantalla de acceso.
3. Sin configurar la clave pública, debe mostrar un aviso de configuración y no dejar entrar.
4. Después de configurar la clave, prueba con una cuenta real de Supabase Auth y verifica ingreso y cierre de sesión.

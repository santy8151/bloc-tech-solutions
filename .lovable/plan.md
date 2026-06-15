## Resumen

Activo Lovable Cloud, agrego botón "Acceso empleados" en el header, construyo un portal protegido con login cifrado, módulos CRUD (clientes, compras, proveedores, entregas, contratos), chat IA y generador de diagramas. Cargo logos originales en las secciones existentes y mejoro el diseño responsive.

## Cambios en el sitio público

- **Header**: nuevo botón "Acceso empleados" (icono candado) a la derecha, lleva a `/portal/login`.
- **Imágenes/logos**: reemplazo logos rotos (operadores, partners, software) por SVGs oficiales servidos desde Wikimedia/CDNs estables, con fallback local. Cuadrículas con tamaño uniforme y fondo claro para que se vean siempre.
- **Diseño**: contenedores `max-w-7xl`, grids responsivos (`grid-cols-2 md:grid-cols-4 lg:grid-cols-6`), espaciados consistentes, tarjetas con altura uniforme y `object-contain` para logos.

## Portal de empleados (`/portal/*`)

Rutas bajo `src/routes/_authenticated/portal/`:

- `/portal/login` (público) — email + contraseña, Supabase Auth (bcrypt nativo).
- `/portal` — dashboard con KPIs (clientes activos, entregas pendientes, contratos por vencer).
- `/portal/clientes` — CRUD.
- `/portal/compras` — CRUD con totales.
- `/portal/proveedores` — CRUD.
- `/portal/entregas` — CRUD + estado (pendiente/en ruta/entregado).
- `/portal/contratos` — tabla con vencimiento, operador, estado + accesos directos a portales Claro/Tigo/Movistar (links externos).
- `/portal/chat-ia` — chat con Lovable AI (Gemini), historial por usuario.
- `/portal/diagramas` — generador de diagramas de cableado con IA (Gemini image), prompt + descarga PNG.

## Arquitectura backend (hexagonal limpia)

```text
src/
  domain/                      # núcleo, sin dependencias externas
    entities/                  # Cliente, Proveedor, Compra, Entrega, Contrato
    value-objects/             # Email, Money, EstadoEntrega
    ports/                     # interfaces de repositorios y servicios
      ClienteRepository.ts
      ProveedorRepository.ts
      ...
      AIChatService.ts
      DiagramGeneratorService.ts
  application/                 # casos de uso
    clientes/CrearCliente.ts
    entregas/MarcarEntregada.ts
    ia/GenerarDiagrama.ts
    ...
  infrastructure/              # adaptadores
    supabase/                  # implementaciones de los puertos con Supabase
    ai/                        # adaptador Lovable AI Gateway
  interface/                   # adaptadores de entrada (server fns + UI)
    server-fns/                # createServerFn que llaman a casos de uso
```

Reglas: `domain` no importa nada externo; `application` solo importa `domain`; `infrastructure` implementa puertos; los `createServerFn` instancian casos de uso inyectando adaptadores.

## Base de datos (Lovable Cloud)

Tablas con RLS escopada al empleado autenticado + rol `empleado`:

- `user_roles` (patrón seguro con `has_role`, enum `app_role`: empleado, admin).
- `clientes` (id, nombre, nit, email, telefono, direccion, ciudad, notas, created_by, timestamps).
- `proveedores` (id, nombre, tipo, contacto_nombre, contacto_email, contacto_tel, notas).
- `compras` (id, proveedor_id, descripcion, monto, fecha, estado, factura_url).
- `entregas` (id, cliente_id, descripcion, direccion, fecha_programada, estado, tecnico, notas).
- `contratos` (id, cliente_id, operador, plan, fecha_inicio, fecha_vencimiento, estado, monto_mensual, url_portal).
- `chat_mensajes` (id, user_id, role, content, created_at).
- `diagramas` (id, user_id, prompt, image_url, created_at).

Todas con `GRANT` explícito a `authenticated` + policies basadas en `has_role(auth.uid(), 'empleado')`.

## IA (Lovable AI Gateway)

- Server fn `chatWithAI` → `streamText` con Gemini 3 Flash, persiste mensajes.
- Server fn `generateDiagram` → modelo de imagen Lovable, guarda URL en `diagramas`, devuelve base64/URL.
- Toda la lógica IA en `infrastructure/ai/`, expuesta vía puertos.

## Contratos / portales Claro-Tigo

Combina las dos opciones: tabla de seguimiento manual (`contratos`) + columna con botones que abren el portal oficial del operador en nueva pestaña (links curados).

## Seguridad

- Supabase Auth (passwords cifradas con bcrypt nativo, nunca en frontend).
- Tabla `user_roles` separada con `has_role` security-definer (evita escalación de privilegios).
- `_authenticated/route.tsx` gestionado por la integración (gate del subtree).
- Server fns con `requireSupabaseAuth` + verificación de rol `empleado` para todas las operaciones del portal.
- Validación Zod en todos los inputs.

## Notas

- El primer empleado se crea registrándose en `/portal/login` (signup); luego le asignas el rol manualmente o lo automatizo via trigger para el primer usuario.
- Los portales de Claro/Tigo son enlaces externos (no tienen API pública); no se puede automatizar el "retiro" desde aquí.
- Es un alcance grande; lo entrego en una sola pasada pero puede haber ajustes finos después.

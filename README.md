# Portal Administrativo - Medix

Portal administrativo interno para consultar, supervisar y gestionar información operativa del ecosistema Medix. Este repositorio resuelve la necesidad de contar con una interfaz web de administración dentro del proyecto de grado, permitiendo visualizar pacientes, citas, integraciones con IPS y reportes de auditoría.

## Descripción general

Este repositorio implementa una aplicación frontend administrativa construida con Next.js App Router. La aplicación permite autenticar usuarios mediante Supabase Auth, consumir datos protegidos desde `medix-appointments-api` y presentar vistas operativas para pacientes, citas, integraciones y auditoría.

Pertenece al sistema Medix como módulo de administración web. Dentro de la arquitectura general, cumple el rol de portal interno para usuarios administrativos, actuando como cliente web autenticado entre Supabase y los servicios backend del proyecto.

## Tecnologías utilizadas

- Lenguaje: TypeScript
- Framework: Next.js 16 con App Router
- Librería UI: React 19
- Estilos: Tailwind CSS 4
- Autenticación: Supabase Auth con Magic Link
- Base de datos: Supabase DB para consulta de auditoría
- Herramientas: ESLint, PostCSS, npm
- Servicios externos: `medix-appointments-api`, Supabase

## Arquitectura del repositorio

```bash
/
├── docs/
├── public/
├── src/
│   ├── app/
│   ├── components/
│   ├── lib/
│   │   ├── medix-api/
│   │   └── supabase/
│   └── types/
├── .env.example
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── tsconfig.json
└── README.md
```

- `docs/`: documentación técnica complementaria sobre arquitectura, flujos y cambios de limpieza.
- `public/`: recursos públicos de la aplicación, incluyendo el logo usado en la interfaz.
- `src/app/`: rutas, layouts, páginas, server actions y callback de autenticación de Next.js App Router.
- `src/components/`: componentes visuales reutilizables, formularios, shell del dashboard y vistas administrativas.
- `src/lib/medix-api/`: cliente HTTP, configuración, tipos, adaptadores y funciones de carga de datos desde `medix-appointments-api`.
- `src/lib/supabase/`: clientes Supabase para navegador y servidor, lectura de variables de entorno y actualización de sesión.
- `src/types/`: tipos compartidos para las vistas administrativas.
- `.env.example`: plantilla de variables de entorno requeridas.
- `package.json`: dependencias y scripts principales del proyecto.
- `next.config.ts`, `tsconfig.json`, `eslint.config.mjs` y `postcss.config.mjs`: configuración de Next.js, TypeScript, ESLint y PostCSS.

## Requisitos previos

* Node.js compatible con Next.js 16. La versión exacta mínima debe ser validada por el equipo.
* npm como gestor de paquetes principal, según `package-lock.json`.
* Variables de entorno de Supabase y API Medix configuradas.
* Proyecto Supabase disponible con autenticación por Magic Link.
* Servicio `medix-appointments-api` en ejecución para consultar pacientes, instituciones, citas e integraciones.
* Servicio `ips-mock-service` en ejecución si se requiere probar integraciones IPS localmente.

## Instalación

```bash
git clone git@github.com:G11-Medix/portal-admin-medix.git
cd portal-admin-medix
npm install
```

## Variables de entorno

El repositorio incluye un archivo `.env.example` con las siguientes variables:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
MEDIX_API_URL=
```

- `NEXT_PUBLIC_SUPABASE_URL`: URL pública del proyecto Supabase.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: llave anónima pública de Supabase.
- `MEDIX_API_URL`: URL base de `medix-appointments-api`. Si no se define, el código usa `http://localhost:8001` como valor por defecto.

No se deben versionar credenciales reales en el repositorio.

## Ejecución local

Primero se deben iniciar los servicios requeridos por el portal, especialmente `medix-appointments-api` y, cuando aplique, `ips-mock-service`.

Luego se puede ejecutar la aplicación con:

```bash
npm run dev
```

Por defecto, Next.js expone la aplicación localmente en:

```bash
http://localhost:3000
```

Para generar una versión de producción local:

```bash
npm run build
npm run start
```

## Pruebas

No se identificó una configuración de pruebas automatizadas en este repositorio.

Para validación estática y de compilación, se identificaron los siguientes comandos:

```bash
npm run lint
npm run build
```

## Uso general

Este repositorio se usa como frontend administrativo del sistema Medix. El flujo general es:

1. El usuario accede a la aplicación web.
2. Si no tiene sesión activa, es redirigido a `/login`.
3. La autenticación se realiza con Supabase Auth mediante Magic Link.
4. Las vistas protegidas del dashboard consultan datos server-side usando el token de Supabase como `Authorization: Bearer`.

Rutas principales identificadas:

- `/`: redirecciona a `/dashboard`.
- `/login`: formulario de inicio de sesión por Magic Link.
- `/auth/callback`: callback de autenticación de Supabase.
- `/dashboard`: vista principal del panel administrativo.
- `/dashboard/users`: consulta de pacientes.
- `/dashboard/appointments`: consulta de citas por institución.
- `/dashboard/integrations`: gestión de instituciones IPS y health check.
- `/dashboard/audit-reports`: consulta de reportes de auditoría desde Supabase.

Endpoints externos consumidos desde `medix-appointments-api`:

- `GET /api/pacientes/?limit=100`
- `GET /api/instituciones/?limit=100`
- `GET /api/instituciones/{id_institucion}/citas/`
- `PUT /api/instituciones/{id}`
- `GET /api/instituciones/{id}/health`

La vista de auditoría consulta la tabla `Log_Auditoria` en Supabase.

## Relación con otros repositorios

Este repositorio se relaciona con otros componentes del ecosistema Medix:

- `medix-appointments-api`: servicio backend principal consumido por el portal para pacientes, instituciones, citas e integraciones.
- `ips-mock-service`: servicio usado para pruebas locales de integraciones IPS, según la documentación existente del repositorio.
- Supabase: servicio externo usado para autenticación, manejo de sesión y consulta de auditoría.

La relación exacta con otros repositorios adicionales debe ser documentada por el equipo de desarrollo.

## Estado del proyecto

Finalizado.

## Convenciones

Convenciones detectadas:

* Uso de TypeScript para el código de aplicación.
* Uso de Next.js App Router dentro de `src/app`.
* Separación entre rutas, componentes, librerías de integración y tipos compartidos.
* Variables de entorno documentadas en `.env.example`.
* Cliente Supabase separado para navegador y servidor.
* Cliente HTTP centralizado para `medix-appointments-api`.
* Uso de ESLint como herramienta de validación estática.

Convenciones recomendadas:

* Usar ramas descriptivas por tipo de cambio, por ejemplo `feature/nombre-funcionalidad`, `fix/nombre-error` o `docs/nombre-documentacion`.
* Mantener commits claros y atómicos, preferiblemente con estilo `tipo: descripción breve`, por ejemplo `docs: actualiza readme institucional`.
* No versionar archivos `.env` con credenciales reales.
* Mantener nuevas vistas del dashboard bajo `src/app/dashboard` y sus componentes asociados bajo `src/components/dashboard`.
* Ejecutar `npm run lint` y `npm run build` antes de integrar cambios relevantes.

## Autores

Proyecto desarrollado como parte del trabajo de grado.

Equipo de desarrollo:

* Adrián Eduardo Ruiz Cerquera
* Leonardo Velázquez Colin 
* Diego Alejandro Jara Rojas
* Jairo Andrés Sierra Combariza

## Licencia

* CC BY-NC 4.0

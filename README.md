# Medix Admin MVP

Portal interno en Next.js App Router para consultar pacientes y citas desde
`medix-appointments-api`. La autenticacion usa Supabase Auth con Magic Link y
las consultas protegidas envian el access token como `Authorization: Bearer`.

## Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS
- Supabase Auth

## Estructura

- `src/app/dashboard/*/page.tsx`: carga server-side de datos para cada vista.
- `src/components/dashboard/*`: componentes de presentacion y filtros locales.
- `src/lib/medix-api/*`: cliente HTTP, manejo de token Supabase y adaptadores API -> UI.
- `src/lib/supabase/*`: clientes Supabase para browser/server y refresco de sesion.
- `src/types/admin.ts`: tipos de UI usados por el dashboard.

## Datos del Dashboard

- Pacientes: `GET /api/pacientes?limit=100`.
- Instituciones: `GET /api/instituciones?limit=100`.
- Citas: `GET /api/instituciones/{id_institucion}/citas`.

En esta primera iteracion la vista de citas carga la primera institucion
disponible y permite filtrar en cliente los resultados recibidos.

## Correr local

Primero inicia `medix-appointments-api` e `ips-mock-service`

Luego inicia el portal:

```bash
npm install
npm run build
npm run dev
```


# Blackjack Royal Mern (Frontend)

Aplicacion frontend en React para jugar Blackjack, autenticarse, consultar estadisticas personales y estadisticas globales.

## Tecnologias

- React 19
- TypeScript
- Vite
- React Router
- Redux Toolkit
- Tailwind CSS

## Funcionalidades principales

- Inicio de sesion y registro de usuarios.
- Juego de Blackjack.
- Proteccion de rutas segun autenticacion.
- Vista de estadisticas del jugador autenticado.
- Vista de estadisticas globales.

Rutas principales de la aplicacion:

- `/casino`
- `/auth/login`
- `/estadisticas`
- `/estadisticas-globales`

## Requisitos previos

- Node.js 22+
- npm 11+
- Backend del proyecto ejecutandose (por defecto en `http://localhost:3000/api`)

## Configuracion de API

La URL base del backend se define en el archivo `.env` del frontend.

Ejemplo:

```env
VITE_API_URL=http://localhost:3000/api
```

Si cambias el puerto o dominio del backend, actualiza ese valor.

## Instalacion

```bash
npm install
```

## Scripts disponibles

```bash
# Desarrollo
npm run dev

# Build de produccion
npm run build

# Vista previa del build
npm run preview

# Lint
npm run lint
```

## Ejecucion en desarrollo

1. Levanta el backend.
2. Ejecuta este frontend:

```bash
npm run dev
```

3. Abre: `http://localhost:5173`

## Build para produccion

```bash
npm run build
```

Los archivos compilados se generan en `dist/`.

## Notas

- El frontend consume autenticacion JWT desde el backend.
- Si aparece un error de CORS o autenticacion, verifica que el backend este levantado y que `VITE_API_URL` apunte correctamente.

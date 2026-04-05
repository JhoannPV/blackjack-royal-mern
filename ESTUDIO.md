# ESTUDIO DEL FRONTEND - BLACKJACK ROYAL MERN

Este documento te da una ruta de estudio para entender la aplicacion de forma progresiva, desde el arranque hasta la logica de negocio.

## 1) Vision general rapida

Arquitectura en capas del frontend:

1. Arranque de React, Vite y proveedor global de Redux.
2. Enrutamiento principal y control de acceso por estado de auth.
3. Autenticacion (hook + slice + API client).
4. Features de UI y negocio (casino, login, estadisticas).
5. Estado global para estadisticas y consumo de API.
6. Componentes compartidos reutilizables.

Flujo funcional principal:

1. Usuario entra a la app.
2. Router valida sesion con token (renovacion).
3. Login o registro contra backend.
4. Axios agrega token JWT en llamadas privadas.
5. Juego registra resultados.
6. Estadisticas personales y globales consumen API.

## 2) Orden recomendado para estudiar (archivo por archivo)

### Fase A - Arranque y configuracion global

Objetivo: entender como inicia la app y que providers globales se montan.

Lee en este orden:

1. src/main.tsx
2. src/BlackjackRoyalApp.tsx
3. src/store/store.ts
4. src/store/index.ts
5. src/index.css
6. vite.config.ts

Preguntas que debes poder responder:

1. Como se monta el arbol React.
2. Donde se inyecta Redux Provider.
3. Como se registra Tailwind en Vite.
4. Que dependencias globales impactan dev/build.

### Fase B - Navegacion y control de acceso

Objetivo: entender entrada a cada pantalla y reglas de acceso.

Lee en este orden:

1. src/router/AppRouter.tsx
2. src/router/index.ts
3. src/blackjack-royal/index.ts

Preguntas clave:

1. Que rutas se muestran si el usuario no esta autenticado.
2. Que rutas se muestran si ya esta autenticado.
3. Como se fuerza la navegacion por defecto segun estado.

### Fase C - Autenticacion completa (columna vertebral)

Objetivo: dominar estado de sesion y relacion con backend.

Lee en este orden:

1. .env
2. src/helpers/getEnvVariables.ts
3. src/api/blackjackApi.ts
4. src/store/auth/authSlice.ts
5. src/hooks/types/StoreTypes.ts
6. src/hooks/useAuthStore.ts
7. src/blackjack-royal/login/pages/login.tsx
8. src/blackjack-royal/login/pages/login.css

En esta fase enfocate en:

1. Estado auth en Redux (checking/authenticated/not-authenticated).
2. Persistencia de token en localStorage.
3. Renovacion de token y cierre de sesion.
4. Flujo de login/registro en Login.
5. Manejo de errores de API para feedback al usuario.

Mini ejercicio:

1. Traza en papel el camino desde enviar formulario de login hasta llegar a /casino.

### Fase D - Estado de estadisticas (estado global de negocio)

Objetivo: entender como se sincronizan estadisticas con el backend.

Lee en este orden:

1. src/store/stats/statsSlice.ts
2. src/hooks/useStatsStore.ts
3. src/hooks/index.ts

Puntos criticos para estudiar:

1. Diferencia entre carga de stats personales y ranking global.
2. Registro de resultados en /stats/register-result.
3. Estados de carga y manejo de error.
4. Reutilizacion de datos en multiples pantallas.

### Fase E - Dominio del juego (core funcional)

Objetivo: entender logica de blackjack y su integracion con estadisticas.

Lee en este orden:

1. src/blackjack-royal/casino/types/casinoGameTypes.ts
2. src/blackjack-royal/casino/utils/casinoDeck.ts
3. src/blackjack-royal/casino/pages/casino.tsx
4. src/blackjack-royal/casino/pages/casino.css

Que revisar con detalle:

1. Como se crea y consume la baraja.
2. Estados locales del juego (cartas, puntos, finalizacion, modal).
3. Logica de turno de la computadora.
4. Algoritmo de determinarGanador.
5. Registro de resultados al finalizar partida.

Mini ejercicio:

1. Simula una partida manual y verifica como cambian los estados en cada accion.

### Fase F - Estadisticas y visualizacion de datos

Objetivo: comprender lectura y presentacion de resultados.

Lee en este orden:

1. src/blackjack-royal/estadisticas/pages/estadisticas.tsx
2. src/blackjack-royal/estadisticas/pages/estadisticas.css
3. src/blackjack-royal/estadisticas-globales/pages/estadisticas-globales.tsx
4. src/blackjack-royal/estadisticas-globales/pages/estadisticas-globales.css

Que revisar:

1. Reutilizacion de stats globales del store.
2. Carga de ranking global desde /stats/global.
3. Filtrado por texto y categoria con useMemo.
4. Ordenamiento por categoria seleccionada.

### Fase G - Componentes compartidos y experiencia de usuario

Objetivo: entender piezas reutilizadas en varias pantallas.

Lee en este orden:

1. src/blackjack-royal/shared/components/user-menu/UserMenu.tsx
2. src/blackjack-royal/shared/components/user-menu/user-menu.css
3. src/blackjack-royal/shared/components/result-modal/ResultModal.tsx
4. src/blackjack-royal/shared/components/result-modal/result-modal.css

Que debes observar:

1. Reutilizacion de componentes por props.
2. Navegacion desde menu contextual.
3. Manejo de modal desacoplado de la pagina.

## 3) Ruta de estudio sugerida en sesiones

Si estudias 1 a 2 horas por sesion, esta ruta funciona bien:

1. Sesion 1: Fase A + B
2. Sesion 2: Fase C
3. Sesion 3: Fase D + E (primera mitad)
4. Sesion 4: Fase E (segunda mitad) + F
5. Sesion 5: Fase G + repaso completo

## 4) Metodo de estudio recomendado

Aplica este ciclo en cada fase:

1. Leer archivo completo sin editar.
2. Resumir en 5 lineas que responsabilidad cumple.
3. Identificar entradas (inputs, parametros, API) y salidas (estado UI, navegacion, peticiones).
4. Trazar un flujo extremo a extremo de la feature.
5. Recien despues, hacer cambios pequenos y probar.

## 5) Checklist de comprension total

Al final deberias poder explicar sin mirar codigo:

1. Como se inicializa la app y como decide la ruta inicial.
2. Como se mantiene o invalida una sesion.
3. Como viaja el token en peticiones privadas.
4. Como se resuelve una partida y donde se persisten resultados.
5. Como se construyen estadisticas personales y globales.
6. Como se integra Redux para compartir estado entre pantallas.

Si puedes responder esos 6 puntos con claridad, ya tienes dominio real del frontend.

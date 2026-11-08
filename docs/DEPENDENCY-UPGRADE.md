# Actualizacion de dependencias - 5 de noviembre de 2026

Node 26.13.0 LTS; npm 12.2.2; pnpm 12.16.1. NVM conserva Node 20.12.2 y 24.15.0. Versiones estables verificadas contra los registros.

## Inventario

| Paquete | Antes (instalado) | Final |
| --- | --- | --- |
| @apollo/client | 3.11.8 | 4.3.7 |
| @emotion/react | 11.11.4 | 11.14.0 |
| @emotion/styled | 11.11.5 | 11.14.1 |
| @mui/material | 5.15.15 | 9.5.0 |
| @tippyjs/react | 4.2.6 | 4.2.6 |
| axios | 1.20.0 | 1.21.0 |
| chart.js | 4.4.7 | 4.6.1 |
| firebase | 10.14.1 | 13.2.0 |
| graphql | 16.9.0 | 17.1.0 |
| graphql-ws | 5.16.0 | 6.4.1 |
| html2canvas | 1.4.1 | 1.4.1 |
| jspdf | 2.5.2 | 4.2.1 |
| lucide-react | 1.66.0 | 1.69.0 |
| normalize.css | 8.0.1 | 8.0.1 |
| react | 18.2.0 | 19.3.1 |
| react-chartjs-2 | 5.2.0 | 5.3.1 |
| react-dom | 18.2.0 | 19.3.1 |
| react-modal | 3.16.1 | 3.16.3 |
| react-router-dom | 6.30.6 | 7.18.5 |
| react-router-hash-link | 2.4.3 | 2.4.3 |
| react-select | 5.8.0 | 5.10.2 |
| react-uuid | 2.0.0 | Retirado |
| subscriptions-transport-ws | 0.11.0 | Retirado |
| swiper | 11.2.10 | 14.4.0 |
| vite-plugin-pwa | 0.20.5 | 2.0.0 |
| zustand | 4.5.2 | 5.0.16 |
| @types/react | 18.2.74 | 19.3.0 |
| @types/react-dom | 18.2.24 | 19.3.0 |
| @vitejs/plugin-react-swc | 3.11.0 | 4.3.3 |
| cypress | 13.17.0 | 16.2.1 |
| eslint | 8.57.0 | 10.14.0 |
| eslint-plugin-react | 7.34.1 | Retirado |
| eslint-plugin-react-hooks | 4.6.0 | 7.1.1 |
| eslint-plugin-react-refresh | 0.4.6 | 0.5.7 |
| vite | 5.4.21 | 8.3.6 |
| rxjs | - | 7.8.2 |
| @eslint-react/eslint-plugin | - | 5.28.8 |
| @eslint/js | - | 10.0.1 |
| globals | - | 17.14.0 |
| typescript | - | 6.0.3 |

## Migraciones

- React 19, MUI 9, Router 7, Zustand 5, Firebase 13 y Swiper 14. Selectores individuales, claves de dominio estables y efectos con dependencias completas.
- Apollo Client 4: imports React separados, RxJS y cache/chat adaptados a GraphQL 17 y graphql-ws 6.
- Tippy conserva su apariencia usando referencias DOM explicitas, evitando el acceso a element.ref retirado por React 19.
- UUID nativo; retirados react-uuid y subscriptions-transport-ws.
- ESLint 10 con configuracion plana y @eslint-react, sin desactivar reglas globalmente para ocultar avisos. Servicios sin JSX renombrados .js. TypeScript 6.0.3 es un peer automatico del tooling (typescript-eslint exige <6.1); la aplicacion permanece JavaScript.
- Vite 8/SWC/PWA 2; PDF y html2canvas se cargan al exportar para cumplir el limite de precache de 2 MiB por archivo. Permanece el aviso informativo de chunk principal >500 kB.
- Storage inyectable para comprobar subida/renombrado sin contactar Firebase. Cypress usa REST simulado y un chat real local con PGlite, sin servicios ni credenciales de produccion.
- Scripts de instalacion permitidos: Cypress, SWC y esbuild; los scripts de anuncios/autoconfiguracion de core-js, protobufjs y Firebase util no son necesarios.
- Overrides acotados de grpc-js, glob y minimatch corrigen vulnerabilidades transitivas.

## Seguridad

Auditoria: 4 avisos bajos, 0 moderados, altos o criticos. Todos proceden de deepmerge 4.3.1 (GHSA-gcqx-w48m-w2h4), ultima version sin parche. Cadena: vite-plugin-pwa -> workbox-build -> @rollup/plugin-node-resolve -> deepmerge. Afecta la mezcla de objetos con claves especialmente construidas; aqui se utiliza al generar el build, no como entrada HTTP de la aplicacion. No se adopta el downgrade que sugiere npm. Revisar cuando exista parche: https://github.com/advisories/GHSA-gcqx-w48m-w2h4.

## Despliegue futuro

Netlify permite seleccionar Node mediante .nvmrc; el build debera usar Node 26.13.0 y npm 12.2.2. Hay configuraciones SPA previas que revisar antes de desplegar: netlify.toml redirige a /Page404 con 404, mientras public/_redirects usa /index.html con 200. No se ha desplegado ni validado en Netlify. Fuente: https://docs.netlify.com/build/configure-builds/available-software-at-build-time/.

## Verificaciones

Cypress 16.2.1 con Electron 146: 35/35 pruebas aprobadas, sin pendientes ni omisiones. Incluye navegacion y rutas protegidas, registro/login, busqueda, carrito, checkout, menu/horarios de restaurante, exportacion PDF y Apollo con chat HTTP/WebSocket real. Las 21 pruebas de medios verifican escritorio y movil.

React Modal 3.16.3 emite en desarrollo un aviso de registro repetido durante el doble montaje de StrictMode. Los flujos de apertura/cierre, previews y chat pasan; se conserva StrictMode. Electron esta deprecado como navegador de Cypress; puede seleccionarse Chrome con npm.cmd run test:e2e -- --browser chrome cuando este instalado.

La consulta final del 5 de noviembre incorporo tambien Apollo 4.3.7, Lucide 1.69.0 y Vite 8.3.6, publicados despues del inventario inicial.

## Cierre sobre el lockfile definitivo

- npm ci --prefer-offline --no-audit --no-fund: codigo 0, incluyendo scripts nativos autorizados.
- Lint con --max-warnings 0: codigo 0, sin errores ni advertencias.
- Pruebas unitarias: 8 aprobadas, 0 fallidas.
- Build/PWA: codigo 0; 11 entradas de precache.
- npm ls --all --json: codigo 0, sin problemas.
- npm outdated --json: {}, codigo 0.
- Cypress completo: 35 aprobadas, 0 fallidas/pendientes/omitidas. Incluye la visualizacion del tooltip con referencias DOM explicitas montadas antes de inicializar Tippy. No aparece el acceso obsoleto a element.ref.
- npm audit --json: codigo 1 esperado por los 4 avisos bajos sin parche descritos arriba; 0 moderados/altos/criticos.

Evidencia estructurada: [verification-results.json](verification-results.json), [audit-results.json](audit-results.json), [outdated-results.json](outdated-results.json).

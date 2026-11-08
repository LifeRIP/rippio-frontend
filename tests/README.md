# Pruebas

Ejecutar los comandos desde la raiz de `rippio-frontend`, con las dependencias
instaladas y las versiones de Node y npm indicadas en el [README principal](../README.md).

## Pruebas unitarias

```powershell
npm.cmd test
```

Las pruebas unitarias de almacenamiento usan un transporte simulado.

## Pruebas E2E

```powershell
npm.cmd run test:e2e
```

Las pruebas E2E requieren el backend instalado en `../rippio-backend`.
El ejecutor arranca y cierra Vite en `127.0.0.1:5175` y un backend de pruebas
con PGlite en memoria en `127.0.0.1:4010`. REST usa fixtures; el chat usa
HTTP/WebSocket reales. No se cargan credenciales de la base de datos del backend.

Para ejecutar solo las pruebas de medios:

```powershell
npm.cmd run test:media:e2e
```

Para seleccionar Chrome, cuando este instalado:

```powershell
npm.cmd run test:e2e -- --browser chrome
```

## Lint y build

```powershell
npm.cmd run lint
npm.cmd run build
```

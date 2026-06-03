# Guia de despliegue

## Objetivo

El juego es una web estatica hecha con HTML, CSS y JavaScript vanilla. No necesita Vite ni un paso de compilacion con bundler.

Debe funcionar en:

```txt
https://jarramplas.alon.one/
https://usuario.github.io/nombre-repo/
```

## GitHub Pages

El workflow `.github/workflows/deploy-pages.yml` publica automaticamente cuando hay push a `main` o cuando se lanza manualmente desde GitHub Actions.

Pasos del workflow:

1. `npm install`
2. `npm run build:pages`
3. subir `pages-dist/` como artefacto de GitHub Pages
4. desplegar con `actions/deploy-pages`

El script `npm run build:pages` copia solo los archivos necesarios para produccion:

- `index.html`, CSS y JavaScript
- `assets/`
- `manifest.webmanifest`
- `service-worker.js`
- `pwa-assets.js`
- `CNAME`
- `.nojekyll`

Quedan fuera `node_modules`, tests, resultados de tests, `.git` y documentacion de desarrollo.

## Configuracion en GitHub

En el repositorio, ve a:

```txt
Settings > Pages > Build and deployment
```

Selecciona:

```txt
Source: GitHub Actions
```

Si usas el dominio personalizado actual, manten `CNAME` con:

```txt
jarramplas.alon.one
```

## Probar localmente el build de Pages

```bash
npm run build:pages
python3 -m http.server 4174 -d pages-dist
```

Abre:

```txt
http://127.0.0.1:4174/
```

## PWA y cache

Cuando cambien `game.js`, `styles.css`, assets importantes o `index.html`, sube `APP_BUILD` en `pwa-assets.js`.

La version actual esta en:

```js
const APP_BUILD = "20260603-1";
```

## Checklist

- Funciona en local con `npm run build:pages`.
- `pages-dist/` contiene `index.html`.
- `pages-dist/assets/generated/` contiene los sprites generados.
- No hay rutas absolutas duras para scripts, CSS ni assets del juego.
- GitHub Pages tiene `Source: GitHub Actions`.
- El dominio personalizado, si se usa, esta configurado tambien en DNS.

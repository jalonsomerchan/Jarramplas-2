# Inventario de ficheros

Este documento enumera los ficheros versionados del proyecto y para que sirve cada uno. No incluye dependencias instaladas ni salidas temporales como `node_modules/`, `pages-dist/` o `test-results/`.

Regla de mantenimiento: cuando se anada, elimine o renombre un fichero versionado, actualiza este inventario en el mismo cambio.

## Automatizacion GitHub

| Fichero | Para que sirve |
| --- | --- |
| `.github/workflows/ci.yml` | Workflow de GitHub Actions que ejecuta la verificacion continua del proyecto. |
| `.github/workflows/deploy-pages.yml` | Workflow de GitHub Actions para publicar la version estatica en GitHub Pages. |

## Raiz del proyecto

| Fichero | Para que sirve |
| --- | --- |
| `.gitignore` | Lista de ficheros y carpetas locales que Git debe ignorar. |
| `.nojekyll` | Evita que GitHub Pages procese el sitio con Jekyll. |
| `AGENTS.md` | Guia principal para agentes: contexto del proyecto, comandos, flujos, reglas y enlaces de documentacion. |
| `analytics.js` | Registro de eventos y metricas del juego, con tolerancia cuando no hay proveedor externo. |
| `asset-fallbacks.js` | Mapa de rutas alternativas para assets, usado cuando una imagen principal no carga. |
| `CNAME` | Dominio personalizado usado por GitHub Pages. |
| `config.js` | Configuracion editable de niveles, tipos de partida, mapas, personajes, variantes de Jarramplas, textos y claves de storage. |
| `firebase-config.js` | Configuracion de Firebase para ranking o persistencia remota cuando esta disponible. |
| `game.js` | Punto de arranque del juego: inicializa PixiJS, carga assets, enlaza UI/input, activa el loop y expone debug. |
| `GameAPI.js` | API global de apoyo para exponer acciones o integraciones del juego desde JavaScript. |
| `home-title.css` | Estilos especificos del titulo o portada de la pantalla inicial. |
| `index.html` | Estructura HTML de pantallas, HUD, modales, botones, selectores y canvas #game. |
| `leaderboard.js` | Ranking local/remoto y persistencia de puntuaciones. |
| `map-editor.html` | Editor visual de mapas para anadir, mover, redimensionar proporcionalmente y eliminar objetos, edificios y suelos; exporta/importa JSON. |
| `manifest.webmanifest` | Manifest PWA con nombre, iconos y comportamiento instalable. |
| `package-lock.json` | Bloqueo exacto de dependencias npm, incluida la version instalada de PixiJS. |
| `package.json` | Metadatos del proyecto, scripts npm y dependencias de runtime/desarrollo. |
| `playwright.config.js` | Configuracion de Playwright y servidor local para tests. |
| `pwa-assets.js` | Listado compartido de assets para PWA/cache, incluyendo el bundle local de PixiJS. |
| `service-worker.js` | Service worker para cache PWA, assets estaticos y funcionamiento offline o semioffline. |
| `storage.js` | Helpers de localStorage con lectura/escritura robusta. |
| `styles.css` | Estilos globales del juego: pantallas, layout, selectores, HUD, responsive y controles moviles. |

## Assets

| Fichero | Para que sirve |
| --- | --- |
| `assets/favicon.svg` | Icono SVG principal del sitio. |
| `assets/fondos/ayuntamiento.png` | Fondo o imagen base del mapa `ayuntamiento`. |
| `assets/fondos/campo_de_futbol.png` | Fondo o imagen base del mapa `campo de futbol`. |
| `assets/fondos/casa_cultura.png` | Fondo o imagen base del mapa `casa cultura`. |
| `assets/fondos/estatua_jarramplas.png` | Fondo o imagen base del mapa `estatua jarramplas`. |
| `assets/fondos/fachada_jarramplas.png` | Fondo o imagen base del mapa `fachada jarramplas`. |
| `assets/fondos/fondo2.png` | Fondo o imagen base del mapa `fondo2`. |
| `assets/fondos/iglesia2.png` | Fondo o imagen base del mapa `iglesia2`. |
| `assets/fondos/mirador.png` | Fondo o imagen base del mapa `mirador`. |
| `assets/fondos/nieve.png` | Fondo o imagen base del mapa `nieve`. |
| `assets/fondos/parada.png` | Fondo o imagen base del mapa `parada`. |
| `assets/fondos/plaza_de_toros.png` | Fondo o imagen base del mapa `plaza de toros`. |
| `assets/generated/animals/cat_walk/down-1.png` | Frame 1 mirando abajo de la animacion de caminar de animal `cat`. |
| `assets/generated/animals/cat_walk/down-2.png` | Frame 2 mirando abajo de la animacion de caminar de animal `cat`. |
| `assets/generated/animals/cat_walk/down-3.png` | Frame 3 mirando abajo de la animacion de caminar de animal `cat`. |
| `assets/generated/animals/cat_walk/down-4.png` | Frame 4 mirando abajo de la animacion de caminar de animal `cat`. |
| `assets/generated/animals/cat_walk/down-strip.png` | Tira de frames mirando abajo de la animacion de caminar de animal `cat`. |
| `assets/generated/animals/cat_walk/down.gif` | GIF de previsualizacion mirando abajo de animal `cat`. |
| `assets/generated/animals/cat_walk/left-1.png` | Frame 1 mirando izquierda de la animacion de caminar de animal `cat`. |
| `assets/generated/animals/cat_walk/left-2.png` | Frame 2 mirando izquierda de la animacion de caminar de animal `cat`. |
| `assets/generated/animals/cat_walk/left-3.png` | Frame 3 mirando izquierda de la animacion de caminar de animal `cat`. |
| `assets/generated/animals/cat_walk/left-4.png` | Frame 4 mirando izquierda de la animacion de caminar de animal `cat`. |
| `assets/generated/animals/cat_walk/left-strip.png` | Tira de frames mirando izquierda de la animacion de caminar de animal `cat`. |
| `assets/generated/animals/cat_walk/left.gif` | GIF de previsualizacion mirando izquierda de animal `cat`. |
| `assets/generated/animals/cat_walk/pipeline-meta.json` | Metadatos del procesado de la hoja de caminar de animal `cat`. |
| `assets/generated/animals/cat_walk/prompt-used.txt` | Prompt usado para generar la hoja de caminar de animal `cat`. |
| `assets/generated/animals/cat_walk/raw-sheet-clean.png` | Hoja limpia intermedia de caminar de animal `cat` tras procesado. |
| `assets/generated/animals/cat_walk/raw-sheet.png` | Hoja bruta generada para caminar de animal `cat`, conservada como fuente. |
| `assets/generated/animals/cat_walk/right-1.png` | Frame 1 mirando derecha de la animacion de caminar de animal `cat`. |
| `assets/generated/animals/cat_walk/right-2.png` | Frame 2 mirando derecha de la animacion de caminar de animal `cat`. |
| `assets/generated/animals/cat_walk/right-3.png` | Frame 3 mirando derecha de la animacion de caminar de animal `cat`. |
| `assets/generated/animals/cat_walk/right-4.png` | Frame 4 mirando derecha de la animacion de caminar de animal `cat`. |
| `assets/generated/animals/cat_walk/right-strip.png` | Tira de frames mirando derecha de la animacion de caminar de animal `cat`. |
| `assets/generated/animals/cat_walk/right.gif` | GIF de previsualizacion mirando derecha de animal `cat`. |
| `assets/generated/animals/cat_walk/sheet-transparent.png` | Spritesheet transparente 4x4 de caminar para animal `cat`, usado por PixiJS en runtime. |
| `assets/generated/animals/cat_walk/up-1.png` | Frame 1 mirando arriba de la animacion de caminar de animal `cat`. |
| `assets/generated/animals/cat_walk/up-2.png` | Frame 2 mirando arriba de la animacion de caminar de animal `cat`. |
| `assets/generated/animals/cat_walk/up-3.png` | Frame 3 mirando arriba de la animacion de caminar de animal `cat`. |
| `assets/generated/animals/cat_walk/up-4.png` | Frame 4 mirando arriba de la animacion de caminar de animal `cat`. |
| `assets/generated/animals/cat_walk/up-strip.png` | Tira de frames mirando arriba de la animacion de caminar de animal `cat`. |
| `assets/generated/animals/cat_walk/up.gif` | GIF de previsualizacion mirando arriba de animal `cat`. |
| `assets/generated/animals/dog_walk/down-1.png` | Frame 1 mirando abajo de la animacion de caminar de animal `dog`. |
| `assets/generated/animals/dog_walk/down-2.png` | Frame 2 mirando abajo de la animacion de caminar de animal `dog`. |
| `assets/generated/animals/dog_walk/down-3.png` | Frame 3 mirando abajo de la animacion de caminar de animal `dog`. |
| `assets/generated/animals/dog_walk/down-4.png` | Frame 4 mirando abajo de la animacion de caminar de animal `dog`. |
| `assets/generated/animals/dog_walk/down-strip.png` | Tira de frames mirando abajo de la animacion de caminar de animal `dog`. |
| `assets/generated/animals/dog_walk/down.gif` | GIF de previsualizacion mirando abajo de animal `dog`. |
| `assets/generated/animals/dog_walk/left-1.png` | Frame 1 mirando izquierda de la animacion de caminar de animal `dog`. |
| `assets/generated/animals/dog_walk/left-2.png` | Frame 2 mirando izquierda de la animacion de caminar de animal `dog`. |
| `assets/generated/animals/dog_walk/left-3.png` | Frame 3 mirando izquierda de la animacion de caminar de animal `dog`. |
| `assets/generated/animals/dog_walk/left-4.png` | Frame 4 mirando izquierda de la animacion de caminar de animal `dog`. |
| `assets/generated/animals/dog_walk/left-strip.png` | Tira de frames mirando izquierda de la animacion de caminar de animal `dog`. |
| `assets/generated/animals/dog_walk/left.gif` | GIF de previsualizacion mirando izquierda de animal `dog`. |
| `assets/generated/animals/dog_walk/pipeline-meta.json` | Metadatos del procesado de la hoja de caminar de animal `dog`. |
| `assets/generated/animals/dog_walk/prompt-used.txt` | Prompt usado para generar la hoja de caminar de animal `dog`. |
| `assets/generated/animals/dog_walk/raw-sheet-clean.png` | Hoja limpia intermedia de caminar de animal `dog` tras procesado. |
| `assets/generated/animals/dog_walk/raw-sheet.png` | Hoja bruta generada para caminar de animal `dog`, conservada como fuente. |
| `assets/generated/animals/dog_walk/right-1.png` | Frame 1 mirando derecha de la animacion de caminar de animal `dog`. |
| `assets/generated/animals/dog_walk/right-2.png` | Frame 2 mirando derecha de la animacion de caminar de animal `dog`. |
| `assets/generated/animals/dog_walk/right-3.png` | Frame 3 mirando derecha de la animacion de caminar de animal `dog`. |
| `assets/generated/animals/dog_walk/right-4.png` | Frame 4 mirando derecha de la animacion de caminar de animal `dog`. |
| `assets/generated/animals/dog_walk/right-strip.png` | Tira de frames mirando derecha de la animacion de caminar de animal `dog`. |
| `assets/generated/animals/dog_walk/right.gif` | GIF de previsualizacion mirando derecha de animal `dog`. |
| `assets/generated/animals/dog_walk/sheet-transparent.png` | Spritesheet transparente 4x4 de caminar para animal `dog`, usado por PixiJS en runtime. |
| `assets/generated/animals/dog_walk/up-1.png` | Frame 1 mirando arriba de la animacion de caminar de animal `dog`. |
| `assets/generated/animals/dog_walk/up-2.png` | Frame 2 mirando arriba de la animacion de caminar de animal `dog`. |
| `assets/generated/animals/dog_walk/up-3.png` | Frame 3 mirando arriba de la animacion de caminar de animal `dog`. |
| `assets/generated/animals/dog_walk/up-4.png` | Frame 4 mirando arriba de la animacion de caminar de animal `dog`. |
| `assets/generated/animals/dog_walk/up-strip.png` | Tira de frames mirando arriba de la animacion de caminar de animal `dog`. |
| `assets/generated/animals/dog_walk/up.gif` | GIF de previsualizacion mirando arriba de animal `dog`. |
| `assets/generated/characters/agricultor_throw/animation.gif` | GIF de previsualizacion de lanzamiento para personaje `agricultor`. |
| `assets/generated/characters/agricultor_throw/pipeline-meta.json` | Metadatos del procesado de la hoja de lanzamiento de personaje `agricultor`. |
| `assets/generated/characters/agricultor_throw/prompt-used.txt` | Prompt usado para generar la hoja de lanzamiento de personaje `agricultor`. |
| `assets/generated/characters/agricultor_throw/raw-sheet-clean.png` | Hoja limpia intermedia de lanzamiento de personaje `agricultor` tras procesado. |
| `assets/generated/characters/agricultor_throw/raw-sheet.png` | Hoja bruta generada para lanzamiento de personaje `agricultor`, conservada como fuente. |
| `assets/generated/characters/agricultor_throw/sheet-transparent.png` | Spritesheet transparente 2x3 de lanzamiento para personaje `agricultor`, usado por PixiJS en runtime. |
| `assets/generated/characters/agricultor_throw/throw-1.png` | Frame 1 de la animacion de lanzamiento para personaje `agricultor`. |
| `assets/generated/characters/agricultor_throw/throw-2.png` | Frame 2 de la animacion de lanzamiento para personaje `agricultor`. |
| `assets/generated/characters/agricultor_throw/throw-3.png` | Frame 3 de la animacion de lanzamiento para personaje `agricultor`. |
| `assets/generated/characters/agricultor_throw/throw-4.png` | Frame 4 de la animacion de lanzamiento para personaje `agricultor`. |
| `assets/generated/characters/agricultor_throw/throw-5.png` | Frame 5 de la animacion de lanzamiento para personaje `agricultor`. |
| `assets/generated/characters/agricultor_throw/throw-6.png` | Frame 6 de la animacion de lanzamiento para personaje `agricultor`. |
| `assets/generated/characters/agricultor_walk/down-1.png` | Frame 1 mirando abajo de la animacion de caminar de personaje `agricultor`. |
| `assets/generated/characters/agricultor_walk/down-2.png` | Frame 2 mirando abajo de la animacion de caminar de personaje `agricultor`. |
| `assets/generated/characters/agricultor_walk/down-3.png` | Frame 3 mirando abajo de la animacion de caminar de personaje `agricultor`. |
| `assets/generated/characters/agricultor_walk/down-4.png` | Frame 4 mirando abajo de la animacion de caminar de personaje `agricultor`. |
| `assets/generated/characters/agricultor_walk/down-strip.png` | Tira de frames mirando abajo de la animacion de caminar de personaje `agricultor`. |
| `assets/generated/characters/agricultor_walk/down.gif` | GIF de previsualizacion mirando abajo de personaje `agricultor`. |
| `assets/generated/characters/agricultor_walk/left-1.png` | Frame 1 mirando izquierda de la animacion de caminar de personaje `agricultor`. |
| `assets/generated/characters/agricultor_walk/left-2.png` | Frame 2 mirando izquierda de la animacion de caminar de personaje `agricultor`. |
| `assets/generated/characters/agricultor_walk/left-3.png` | Frame 3 mirando izquierda de la animacion de caminar de personaje `agricultor`. |
| `assets/generated/characters/agricultor_walk/left-4.png` | Frame 4 mirando izquierda de la animacion de caminar de personaje `agricultor`. |
| `assets/generated/characters/agricultor_walk/left-strip.png` | Tira de frames mirando izquierda de la animacion de caminar de personaje `agricultor`. |
| `assets/generated/characters/agricultor_walk/left.gif` | GIF de previsualizacion mirando izquierda de personaje `agricultor`. |
| `assets/generated/characters/agricultor_walk/pipeline-meta.json` | Metadatos del procesado de la hoja de caminar de personaje `agricultor`. |
| `assets/generated/characters/agricultor_walk/prompt-used.txt` | Prompt usado para generar la hoja de caminar de personaje `agricultor`. |
| `assets/generated/characters/agricultor_walk/raw-sheet-clean.png` | Hoja limpia intermedia de caminar de personaje `agricultor` tras procesado. |
| `assets/generated/characters/agricultor_walk/raw-sheet.png` | Hoja bruta generada para caminar de personaje `agricultor`, conservada como fuente. |
| `assets/generated/characters/agricultor_walk/right-1.png` | Frame 1 mirando derecha de la animacion de caminar de personaje `agricultor`. |
| `assets/generated/characters/agricultor_walk/right-2.png` | Frame 2 mirando derecha de la animacion de caminar de personaje `agricultor`. |
| `assets/generated/characters/agricultor_walk/right-3.png` | Frame 3 mirando derecha de la animacion de caminar de personaje `agricultor`. |
| `assets/generated/characters/agricultor_walk/right-4.png` | Frame 4 mirando derecha de la animacion de caminar de personaje `agricultor`. |
| `assets/generated/characters/agricultor_walk/right-strip.png` | Tira de frames mirando derecha de la animacion de caminar de personaje `agricultor`. |
| `assets/generated/characters/agricultor_walk/right.gif` | GIF de previsualizacion mirando derecha de personaje `agricultor`. |
| `assets/generated/characters/agricultor_walk/sheet-transparent.png` | Spritesheet transparente 4x4 de caminar para personaje `agricultor`, usado por PixiJS en runtime. |
| `assets/generated/characters/agricultor_walk/up-1.png` | Frame 1 mirando arriba de la animacion de caminar de personaje `agricultor`. |
| `assets/generated/characters/agricultor_walk/up-2.png` | Frame 2 mirando arriba de la animacion de caminar de personaje `agricultor`. |
| `assets/generated/characters/agricultor_walk/up-3.png` | Frame 3 mirando arriba de la animacion de caminar de personaje `agricultor`. |
| `assets/generated/characters/agricultor_walk/up-4.png` | Frame 4 mirando arriba de la animacion de caminar de personaje `agricultor`. |
| `assets/generated/characters/agricultor_walk/up-strip.png` | Tira de frames mirando arriba de la animacion de caminar de personaje `agricultor`. |
| `assets/generated/characters/agricultor_walk/up.gif` | GIF de previsualizacion mirando arriba de personaje `agricultor`. |
| `assets/generated/characters/ama_de_casa_throw/animation.gif` | GIF de previsualizacion de lanzamiento para personaje `ama_de_casa`. |
| `assets/generated/characters/ama_de_casa_throw/pipeline-meta.json` | Metadatos del procesado de la hoja de lanzamiento de personaje `ama_de_casa`. |
| `assets/generated/characters/ama_de_casa_throw/prompt-used.txt` | Prompt usado para generar la hoja de lanzamiento de personaje `ama_de_casa`. |
| `assets/generated/characters/ama_de_casa_throw/raw-sheet-clean.png` | Hoja limpia intermedia de lanzamiento de personaje `ama_de_casa` tras procesado. |
| `assets/generated/characters/ama_de_casa_throw/raw-sheet.png` | Hoja bruta generada para lanzamiento de personaje `ama_de_casa`, conservada como fuente. |
| `assets/generated/characters/ama_de_casa_throw/sheet-transparent.png` | Spritesheet transparente 2x3 de lanzamiento para personaje `ama_de_casa`, usado por PixiJS en runtime. |
| `assets/generated/characters/ama_de_casa_throw/throw-1.png` | Frame 1 de la animacion de lanzamiento para personaje `ama_de_casa`. |
| `assets/generated/characters/ama_de_casa_throw/throw-2.png` | Frame 2 de la animacion de lanzamiento para personaje `ama_de_casa`. |
| `assets/generated/characters/ama_de_casa_throw/throw-3.png` | Frame 3 de la animacion de lanzamiento para personaje `ama_de_casa`. |
| `assets/generated/characters/ama_de_casa_throw/throw-4.png` | Frame 4 de la animacion de lanzamiento para personaje `ama_de_casa`. |
| `assets/generated/characters/ama_de_casa_throw/throw-5.png` | Frame 5 de la animacion de lanzamiento para personaje `ama_de_casa`. |
| `assets/generated/characters/ama_de_casa_throw/throw-6.png` | Frame 6 de la animacion de lanzamiento para personaje `ama_de_casa`. |
| `assets/generated/characters/ama_de_casa_walk/down-1.png` | Frame 1 mirando abajo de la animacion de caminar de personaje `ama_de_casa`. |
| `assets/generated/characters/ama_de_casa_walk/down-2.png` | Frame 2 mirando abajo de la animacion de caminar de personaje `ama_de_casa`. |
| `assets/generated/characters/ama_de_casa_walk/down-3.png` | Frame 3 mirando abajo de la animacion de caminar de personaje `ama_de_casa`. |
| `assets/generated/characters/ama_de_casa_walk/down-4.png` | Frame 4 mirando abajo de la animacion de caminar de personaje `ama_de_casa`. |
| `assets/generated/characters/ama_de_casa_walk/down-strip.png` | Tira de frames mirando abajo de la animacion de caminar de personaje `ama_de_casa`. |
| `assets/generated/characters/ama_de_casa_walk/down.gif` | GIF de previsualizacion mirando abajo de personaje `ama_de_casa`. |
| `assets/generated/characters/ama_de_casa_walk/left-1.png` | Frame 1 mirando izquierda de la animacion de caminar de personaje `ama_de_casa`. |
| `assets/generated/characters/ama_de_casa_walk/left-2.png` | Frame 2 mirando izquierda de la animacion de caminar de personaje `ama_de_casa`. |
| `assets/generated/characters/ama_de_casa_walk/left-3.png` | Frame 3 mirando izquierda de la animacion de caminar de personaje `ama_de_casa`. |
| `assets/generated/characters/ama_de_casa_walk/left-4.png` | Frame 4 mirando izquierda de la animacion de caminar de personaje `ama_de_casa`. |
| `assets/generated/characters/ama_de_casa_walk/left-strip.png` | Tira de frames mirando izquierda de la animacion de caminar de personaje `ama_de_casa`. |
| `assets/generated/characters/ama_de_casa_walk/left.gif` | GIF de previsualizacion mirando izquierda de personaje `ama_de_casa`. |
| `assets/generated/characters/ama_de_casa_walk/pipeline-meta.json` | Metadatos del procesado de la hoja de caminar de personaje `ama_de_casa`. |
| `assets/generated/characters/ama_de_casa_walk/prompt-used.txt` | Prompt usado para generar la hoja de caminar de personaje `ama_de_casa`. |
| `assets/generated/characters/ama_de_casa_walk/raw-sheet-clean.png` | Hoja limpia intermedia de caminar de personaje `ama_de_casa` tras procesado. |
| `assets/generated/characters/ama_de_casa_walk/raw-sheet.png` | Hoja bruta generada para caminar de personaje `ama_de_casa`, conservada como fuente. |
| `assets/generated/characters/ama_de_casa_walk/right-1.png` | Frame 1 mirando derecha de la animacion de caminar de personaje `ama_de_casa`. |
| `assets/generated/characters/ama_de_casa_walk/right-2.png` | Frame 2 mirando derecha de la animacion de caminar de personaje `ama_de_casa`. |
| `assets/generated/characters/ama_de_casa_walk/right-3.png` | Frame 3 mirando derecha de la animacion de caminar de personaje `ama_de_casa`. |
| `assets/generated/characters/ama_de_casa_walk/right-4.png` | Frame 4 mirando derecha de la animacion de caminar de personaje `ama_de_casa`. |
| `assets/generated/characters/ama_de_casa_walk/right-strip.png` | Tira de frames mirando derecha de la animacion de caminar de personaje `ama_de_casa`. |
| `assets/generated/characters/ama_de_casa_walk/right.gif` | GIF de previsualizacion mirando derecha de personaje `ama_de_casa`. |
| `assets/generated/characters/ama_de_casa_walk/sheet-transparent.png` | Spritesheet transparente 4x4 de caminar para personaje `ama_de_casa`, usado por PixiJS en runtime. |
| `assets/generated/characters/ama_de_casa_walk/up-1.png` | Frame 1 mirando arriba de la animacion de caminar de personaje `ama_de_casa`. |
| `assets/generated/characters/ama_de_casa_walk/up-2.png` | Frame 2 mirando arriba de la animacion de caminar de personaje `ama_de_casa`. |
| `assets/generated/characters/ama_de_casa_walk/up-3.png` | Frame 3 mirando arriba de la animacion de caminar de personaje `ama_de_casa`. |
| `assets/generated/characters/ama_de_casa_walk/up-4.png` | Frame 4 mirando arriba de la animacion de caminar de personaje `ama_de_casa`. |
| `assets/generated/characters/ama_de_casa_walk/up-strip.png` | Tira de frames mirando arriba de la animacion de caminar de personaje `ama_de_casa`. |
| `assets/generated/characters/ama_de_casa_walk/up.gif` | GIF de previsualizacion mirando arriba de personaje `ama_de_casa`. |
| `assets/generated/characters/borracho_throw/animation.gif` | GIF de previsualizacion de lanzamiento para personaje `borracho`. |
| `assets/generated/characters/borracho_throw/pipeline-meta.json` | Metadatos del procesado de la hoja de lanzamiento de personaje `borracho`. |
| `assets/generated/characters/borracho_throw/prompt-used.txt` | Prompt usado para generar la hoja de lanzamiento de personaje `borracho`. |
| `assets/generated/characters/borracho_throw/raw-sheet-clean.png` | Hoja limpia intermedia de lanzamiento de personaje `borracho` tras procesado. |
| `assets/generated/characters/borracho_throw/raw-sheet.png` | Hoja bruta generada para lanzamiento de personaje `borracho`, conservada como fuente. |
| `assets/generated/characters/borracho_throw/sheet-transparent.png` | Spritesheet transparente 2x3 de lanzamiento para personaje `borracho`, usado por PixiJS en runtime. |
| `assets/generated/characters/borracho_throw/throw-1.png` | Frame 1 de la animacion de lanzamiento para personaje `borracho`. |
| `assets/generated/characters/borracho_throw/throw-2.png` | Frame 2 de la animacion de lanzamiento para personaje `borracho`. |
| `assets/generated/characters/borracho_throw/throw-3.png` | Frame 3 de la animacion de lanzamiento para personaje `borracho`. |
| `assets/generated/characters/borracho_throw/throw-4.png` | Frame 4 de la animacion de lanzamiento para personaje `borracho`. |
| `assets/generated/characters/borracho_throw/throw-5.png` | Frame 5 de la animacion de lanzamiento para personaje `borracho`. |
| `assets/generated/characters/borracho_throw/throw-6.png` | Frame 6 de la animacion de lanzamiento para personaje `borracho`. |
| `assets/generated/characters/borracho_walk/down-1.png` | Frame 1 mirando abajo de la animacion de caminar de personaje `borracho`. |
| `assets/generated/characters/borracho_walk/down-2.png` | Frame 2 mirando abajo de la animacion de caminar de personaje `borracho`. |
| `assets/generated/characters/borracho_walk/down-3.png` | Frame 3 mirando abajo de la animacion de caminar de personaje `borracho`. |
| `assets/generated/characters/borracho_walk/down-4.png` | Frame 4 mirando abajo de la animacion de caminar de personaje `borracho`. |
| `assets/generated/characters/borracho_walk/down-strip.png` | Tira de frames mirando abajo de la animacion de caminar de personaje `borracho`. |
| `assets/generated/characters/borracho_walk/down.gif` | GIF de previsualizacion mirando abajo de personaje `borracho`. |
| `assets/generated/characters/borracho_walk/left-1.png` | Frame 1 mirando izquierda de la animacion de caminar de personaje `borracho`. |
| `assets/generated/characters/borracho_walk/left-2.png` | Frame 2 mirando izquierda de la animacion de caminar de personaje `borracho`. |
| `assets/generated/characters/borracho_walk/left-3.png` | Frame 3 mirando izquierda de la animacion de caminar de personaje `borracho`. |
| `assets/generated/characters/borracho_walk/left-4.png` | Frame 4 mirando izquierda de la animacion de caminar de personaje `borracho`. |
| `assets/generated/characters/borracho_walk/left-strip.png` | Tira de frames mirando izquierda de la animacion de caminar de personaje `borracho`. |
| `assets/generated/characters/borracho_walk/left.gif` | GIF de previsualizacion mirando izquierda de personaje `borracho`. |
| `assets/generated/characters/borracho_walk/pipeline-meta.json` | Metadatos del procesado de la hoja de caminar de personaje `borracho`. |
| `assets/generated/characters/borracho_walk/prompt-used.txt` | Prompt usado para generar la hoja de caminar de personaje `borracho`. |
| `assets/generated/characters/borracho_walk/raw-sheet-clean.png` | Hoja limpia intermedia de caminar de personaje `borracho` tras procesado. |
| `assets/generated/characters/borracho_walk/raw-sheet.png` | Hoja bruta generada para caminar de personaje `borracho`, conservada como fuente. |
| `assets/generated/characters/borracho_walk/right-1.png` | Frame 1 mirando derecha de la animacion de caminar de personaje `borracho`. |
| `assets/generated/characters/borracho_walk/right-2.png` | Frame 2 mirando derecha de la animacion de caminar de personaje `borracho`. |
| `assets/generated/characters/borracho_walk/right-3.png` | Frame 3 mirando derecha de la animacion de caminar de personaje `borracho`. |
| `assets/generated/characters/borracho_walk/right-4.png` | Frame 4 mirando derecha de la animacion de caminar de personaje `borracho`. |
| `assets/generated/characters/borracho_walk/right-strip.png` | Tira de frames mirando derecha de la animacion de caminar de personaje `borracho`. |
| `assets/generated/characters/borracho_walk/right.gif` | GIF de previsualizacion mirando derecha de personaje `borracho`. |
| `assets/generated/characters/borracho_walk/sheet-transparent.png` | Spritesheet transparente 4x4 de caminar para personaje `borracho`, usado por PixiJS en runtime. |
| `assets/generated/characters/borracho_walk/up-1.png` | Frame 1 mirando arriba de la animacion de caminar de personaje `borracho`. |
| `assets/generated/characters/borracho_walk/up-2.png` | Frame 2 mirando arriba de la animacion de caminar de personaje `borracho`. |
| `assets/generated/characters/borracho_walk/up-3.png` | Frame 3 mirando arriba de la animacion de caminar de personaje `borracho`. |
| `assets/generated/characters/borracho_walk/up-4.png` | Frame 4 mirando arriba de la animacion de caminar de personaje `borracho`. |
| `assets/generated/characters/borracho_walk/up-strip.png` | Tira de frames mirando arriba de la animacion de caminar de personaje `borracho`. |
| `assets/generated/characters/borracho_walk/up.gif` | GIF de previsualizacion mirando arriba de personaje `borracho`. |
| `assets/generated/characters/cura_throw/animation.gif` | GIF de previsualizacion de lanzamiento para personaje `cura`. |
| `assets/generated/characters/cura_throw/pipeline-meta.json` | Metadatos del procesado de la hoja de lanzamiento de personaje `cura`. |
| `assets/generated/characters/cura_throw/prompt-used.txt` | Prompt usado para generar la hoja de lanzamiento de personaje `cura`. |
| `assets/generated/characters/cura_throw/raw-sheet-clean.png` | Hoja limpia intermedia de lanzamiento de personaje `cura` tras procesado. |
| `assets/generated/characters/cura_throw/raw-sheet.png` | Hoja bruta generada para lanzamiento de personaje `cura`, conservada como fuente. |
| `assets/generated/characters/cura_throw/sheet-transparent.png` | Spritesheet transparente 2x3 de lanzamiento para personaje `cura`, usado por PixiJS en runtime. |
| `assets/generated/characters/cura_throw/throw-1.png` | Frame 1 de la animacion de lanzamiento para personaje `cura`. |
| `assets/generated/characters/cura_throw/throw-2.png` | Frame 2 de la animacion de lanzamiento para personaje `cura`. |
| `assets/generated/characters/cura_throw/throw-3.png` | Frame 3 de la animacion de lanzamiento para personaje `cura`. |
| `assets/generated/characters/cura_throw/throw-4.png` | Frame 4 de la animacion de lanzamiento para personaje `cura`. |
| `assets/generated/characters/cura_throw/throw-5.png` | Frame 5 de la animacion de lanzamiento para personaje `cura`. |
| `assets/generated/characters/cura_throw/throw-6.png` | Frame 6 de la animacion de lanzamiento para personaje `cura`. |
| `assets/generated/characters/cura_walk/down-1.png` | Frame 1 mirando abajo de la animacion de caminar de personaje `cura`. |
| `assets/generated/characters/cura_walk/down-2.png` | Frame 2 mirando abajo de la animacion de caminar de personaje `cura`. |
| `assets/generated/characters/cura_walk/down-3.png` | Frame 3 mirando abajo de la animacion de caminar de personaje `cura`. |
| `assets/generated/characters/cura_walk/down-4.png` | Frame 4 mirando abajo de la animacion de caminar de personaje `cura`. |
| `assets/generated/characters/cura_walk/down-strip.png` | Tira de frames mirando abajo de la animacion de caminar de personaje `cura`. |
| `assets/generated/characters/cura_walk/down.gif` | GIF de previsualizacion mirando abajo de personaje `cura`. |
| `assets/generated/characters/cura_walk/left-1.png` | Frame 1 mirando izquierda de la animacion de caminar de personaje `cura`. |
| `assets/generated/characters/cura_walk/left-2.png` | Frame 2 mirando izquierda de la animacion de caminar de personaje `cura`. |
| `assets/generated/characters/cura_walk/left-3.png` | Frame 3 mirando izquierda de la animacion de caminar de personaje `cura`. |
| `assets/generated/characters/cura_walk/left-4.png` | Frame 4 mirando izquierda de la animacion de caminar de personaje `cura`. |
| `assets/generated/characters/cura_walk/left-strip.png` | Tira de frames mirando izquierda de la animacion de caminar de personaje `cura`. |
| `assets/generated/characters/cura_walk/left.gif` | GIF de previsualizacion mirando izquierda de personaje `cura`. |
| `assets/generated/characters/cura_walk/pipeline-meta.json` | Metadatos del procesado de la hoja de caminar de personaje `cura`. |
| `assets/generated/characters/cura_walk/prompt-used.txt` | Prompt usado para generar la hoja de caminar de personaje `cura`. |
| `assets/generated/characters/cura_walk/raw-sheet-clean.png` | Hoja limpia intermedia de caminar de personaje `cura` tras procesado. |
| `assets/generated/characters/cura_walk/raw-sheet.png` | Hoja bruta generada para caminar de personaje `cura`, conservada como fuente. |
| `assets/generated/characters/cura_walk/right-1.png` | Frame 1 mirando derecha de la animacion de caminar de personaje `cura`. |
| `assets/generated/characters/cura_walk/right-2.png` | Frame 2 mirando derecha de la animacion de caminar de personaje `cura`. |
| `assets/generated/characters/cura_walk/right-3.png` | Frame 3 mirando derecha de la animacion de caminar de personaje `cura`. |
| `assets/generated/characters/cura_walk/right-4.png` | Frame 4 mirando derecha de la animacion de caminar de personaje `cura`. |
| `assets/generated/characters/cura_walk/right-strip.png` | Tira de frames mirando derecha de la animacion de caminar de personaje `cura`. |
| `assets/generated/characters/cura_walk/right.gif` | GIF de previsualizacion mirando derecha de personaje `cura`. |
| `assets/generated/characters/cura_walk/sheet-transparent.png` | Spritesheet transparente 4x4 de caminar para personaje `cura`, usado por PixiJS en runtime. |
| `assets/generated/characters/cura_walk/up-1.png` | Frame 1 mirando arriba de la animacion de caminar de personaje `cura`. |
| `assets/generated/characters/cura_walk/up-2.png` | Frame 2 mirando arriba de la animacion de caminar de personaje `cura`. |
| `assets/generated/characters/cura_walk/up-3.png` | Frame 3 mirando arriba de la animacion de caminar de personaje `cura`. |
| `assets/generated/characters/cura_walk/up-4.png` | Frame 4 mirando arriba de la animacion de caminar de personaje `cura`. |
| `assets/generated/characters/cura_walk/up-strip.png` | Tira de frames mirando arriba de la animacion de caminar de personaje `cura`. |
| `assets/generated/characters/cura_walk/up.gif` | GIF de previsualizacion mirando arriba de personaje `cura`. |
| `assets/generated/characters/deportista_throw/animation.gif` | GIF de previsualizacion de lanzamiento para personaje `deportista`. |
| `assets/generated/characters/deportista_throw/pipeline-meta.json` | Metadatos del procesado de la hoja de lanzamiento de personaje `deportista`. |
| `assets/generated/characters/deportista_throw/prompt-used.txt` | Prompt usado para generar la hoja de lanzamiento de personaje `deportista`. |
| `assets/generated/characters/deportista_throw/raw-sheet-clean.png` | Hoja limpia intermedia de lanzamiento de personaje `deportista` tras procesado. |
| `assets/generated/characters/deportista_throw/raw-sheet.png` | Hoja bruta generada para lanzamiento de personaje `deportista`, conservada como fuente. |
| `assets/generated/characters/deportista_throw/sheet-transparent.png` | Spritesheet transparente 2x3 de lanzamiento para personaje `deportista`, usado por PixiJS en runtime. |
| `assets/generated/characters/deportista_throw/throw-1.png` | Frame 1 de la animacion de lanzamiento para personaje `deportista`. |
| `assets/generated/characters/deportista_throw/throw-2.png` | Frame 2 de la animacion de lanzamiento para personaje `deportista`. |
| `assets/generated/characters/deportista_throw/throw-3.png` | Frame 3 de la animacion de lanzamiento para personaje `deportista`. |
| `assets/generated/characters/deportista_throw/throw-4.png` | Frame 4 de la animacion de lanzamiento para personaje `deportista`. |
| `assets/generated/characters/deportista_throw/throw-5.png` | Frame 5 de la animacion de lanzamiento para personaje `deportista`. |
| `assets/generated/characters/deportista_throw/throw-6.png` | Frame 6 de la animacion de lanzamiento para personaje `deportista`. |
| `assets/generated/characters/deportista_walk/down-1.png` | Frame 1 mirando abajo de la animacion de caminar de personaje `deportista`. |
| `assets/generated/characters/deportista_walk/down-2.png` | Frame 2 mirando abajo de la animacion de caminar de personaje `deportista`. |
| `assets/generated/characters/deportista_walk/down-3.png` | Frame 3 mirando abajo de la animacion de caminar de personaje `deportista`. |
| `assets/generated/characters/deportista_walk/down-4.png` | Frame 4 mirando abajo de la animacion de caminar de personaje `deportista`. |
| `assets/generated/characters/deportista_walk/down-strip.png` | Tira de frames mirando abajo de la animacion de caminar de personaje `deportista`. |
| `assets/generated/characters/deportista_walk/down.gif` | GIF de previsualizacion mirando abajo de personaje `deportista`. |
| `assets/generated/characters/deportista_walk/left-1.png` | Frame 1 mirando izquierda de la animacion de caminar de personaje `deportista`. |
| `assets/generated/characters/deportista_walk/left-2.png` | Frame 2 mirando izquierda de la animacion de caminar de personaje `deportista`. |
| `assets/generated/characters/deportista_walk/left-3.png` | Frame 3 mirando izquierda de la animacion de caminar de personaje `deportista`. |
| `assets/generated/characters/deportista_walk/left-4.png` | Frame 4 mirando izquierda de la animacion de caminar de personaje `deportista`. |
| `assets/generated/characters/deportista_walk/left-strip.png` | Tira de frames mirando izquierda de la animacion de caminar de personaje `deportista`. |
| `assets/generated/characters/deportista_walk/left.gif` | GIF de previsualizacion mirando izquierda de personaje `deportista`. |
| `assets/generated/characters/deportista_walk/pipeline-meta.json` | Metadatos del procesado de la hoja de caminar de personaje `deportista`. |
| `assets/generated/characters/deportista_walk/prompt-used.txt` | Prompt usado para generar la hoja de caminar de personaje `deportista`. |
| `assets/generated/characters/deportista_walk/raw-sheet-clean.png` | Hoja limpia intermedia de caminar de personaje `deportista` tras procesado. |
| `assets/generated/characters/deportista_walk/raw-sheet.png` | Hoja bruta generada para caminar de personaje `deportista`, conservada como fuente. |
| `assets/generated/characters/deportista_walk/right-1.png` | Frame 1 mirando derecha de la animacion de caminar de personaje `deportista`. |
| `assets/generated/characters/deportista_walk/right-2.png` | Frame 2 mirando derecha de la animacion de caminar de personaje `deportista`. |
| `assets/generated/characters/deportista_walk/right-3.png` | Frame 3 mirando derecha de la animacion de caminar de personaje `deportista`. |
| `assets/generated/characters/deportista_walk/right-4.png` | Frame 4 mirando derecha de la animacion de caminar de personaje `deportista`. |
| `assets/generated/characters/deportista_walk/right-strip.png` | Tira de frames mirando derecha de la animacion de caminar de personaje `deportista`. |
| `assets/generated/characters/deportista_walk/right.gif` | GIF de previsualizacion mirando derecha de personaje `deportista`. |
| `assets/generated/characters/deportista_walk/sheet-transparent.png` | Spritesheet transparente 4x4 de caminar para personaje `deportista`, usado por PixiJS en runtime. |
| `assets/generated/characters/deportista_walk/up-1.png` | Frame 1 mirando arriba de la animacion de caminar de personaje `deportista`. |
| `assets/generated/characters/deportista_walk/up-2.png` | Frame 2 mirando arriba de la animacion de caminar de personaje `deportista`. |
| `assets/generated/characters/deportista_walk/up-3.png` | Frame 3 mirando arriba de la animacion de caminar de personaje `deportista`. |
| `assets/generated/characters/deportista_walk/up-4.png` | Frame 4 mirando arriba de la animacion de caminar de personaje `deportista`. |
| `assets/generated/characters/deportista_walk/up-strip.png` | Tira de frames mirando arriba de la animacion de caminar de personaje `deportista`. |
| `assets/generated/characters/deportista_walk/up.gif` | GIF de previsualizacion mirando arriba de personaje `deportista`. |
| `assets/generated/characters/nino_throw/animation.gif` | GIF de previsualizacion de lanzamiento para personaje `nino`. |
| `assets/generated/characters/nino_throw/pipeline-meta.json` | Metadatos del procesado de la hoja de lanzamiento de personaje `nino`. |
| `assets/generated/characters/nino_throw/prompt-used.txt` | Prompt usado para generar la hoja de lanzamiento de personaje `nino`. |
| `assets/generated/characters/nino_throw/raw-sheet-clean.png` | Hoja limpia intermedia de lanzamiento de personaje `nino` tras procesado. |
| `assets/generated/characters/nino_throw/raw-sheet.png` | Hoja bruta generada para lanzamiento de personaje `nino`, conservada como fuente. |
| `assets/generated/characters/nino_throw/sheet-transparent.png` | Spritesheet transparente 2x3 de lanzamiento para personaje `nino`, usado por PixiJS en runtime. |
| `assets/generated/characters/nino_throw/throw-1.png` | Frame 1 de la animacion de lanzamiento para personaje `nino`. |
| `assets/generated/characters/nino_throw/throw-2.png` | Frame 2 de la animacion de lanzamiento para personaje `nino`. |
| `assets/generated/characters/nino_throw/throw-3.png` | Frame 3 de la animacion de lanzamiento para personaje `nino`. |
| `assets/generated/characters/nino_throw/throw-4.png` | Frame 4 de la animacion de lanzamiento para personaje `nino`. |
| `assets/generated/characters/nino_throw/throw-5.png` | Frame 5 de la animacion de lanzamiento para personaje `nino`. |
| `assets/generated/characters/nino_throw/throw-6.png` | Frame 6 de la animacion de lanzamiento para personaje `nino`. |
| `assets/generated/characters/nino_walk/down-1.png` | Frame 1 mirando abajo de la animacion de caminar de personaje `nino`. |
| `assets/generated/characters/nino_walk/down-2.png` | Frame 2 mirando abajo de la animacion de caminar de personaje `nino`. |
| `assets/generated/characters/nino_walk/down-3.png` | Frame 3 mirando abajo de la animacion de caminar de personaje `nino`. |
| `assets/generated/characters/nino_walk/down-4.png` | Frame 4 mirando abajo de la animacion de caminar de personaje `nino`. |
| `assets/generated/characters/nino_walk/down-strip.png` | Tira de frames mirando abajo de la animacion de caminar de personaje `nino`. |
| `assets/generated/characters/nino_walk/down.gif` | GIF de previsualizacion mirando abajo de personaje `nino`. |
| `assets/generated/characters/nino_walk/left-1.png` | Frame 1 mirando izquierda de la animacion de caminar de personaje `nino`. |
| `assets/generated/characters/nino_walk/left-2.png` | Frame 2 mirando izquierda de la animacion de caminar de personaje `nino`. |
| `assets/generated/characters/nino_walk/left-3.png` | Frame 3 mirando izquierda de la animacion de caminar de personaje `nino`. |
| `assets/generated/characters/nino_walk/left-4.png` | Frame 4 mirando izquierda de la animacion de caminar de personaje `nino`. |
| `assets/generated/characters/nino_walk/left-strip.png` | Tira de frames mirando izquierda de la animacion de caminar de personaje `nino`. |
| `assets/generated/characters/nino_walk/left.gif` | GIF de previsualizacion mirando izquierda de personaje `nino`. |
| `assets/generated/characters/nino_walk/pipeline-meta.json` | Metadatos del procesado de la hoja de caminar de personaje `nino`. |
| `assets/generated/characters/nino_walk/prompt-used.txt` | Prompt usado para generar la hoja de caminar de personaje `nino`. |
| `assets/generated/characters/nino_walk/raw-sheet-clean.png` | Hoja limpia intermedia de caminar de personaje `nino` tras procesado. |
| `assets/generated/characters/nino_walk/raw-sheet.png` | Hoja bruta generada para caminar de personaje `nino`, conservada como fuente. |
| `assets/generated/characters/nino_walk/right-1.png` | Frame 1 mirando derecha de la animacion de caminar de personaje `nino`. |
| `assets/generated/characters/nino_walk/right-2.png` | Frame 2 mirando derecha de la animacion de caminar de personaje `nino`. |
| `assets/generated/characters/nino_walk/right-3.png` | Frame 3 mirando derecha de la animacion de caminar de personaje `nino`. |
| `assets/generated/characters/nino_walk/right-4.png` | Frame 4 mirando derecha de la animacion de caminar de personaje `nino`. |
| `assets/generated/characters/nino_walk/right-strip.png` | Tira de frames mirando derecha de la animacion de caminar de personaje `nino`. |
| `assets/generated/characters/nino_walk/right.gif` | GIF de previsualizacion mirando derecha de personaje `nino`. |
| `assets/generated/characters/nino_walk/sheet-transparent.png` | Spritesheet transparente 4x4 de caminar para personaje `nino`, usado por PixiJS en runtime. |
| `assets/generated/characters/nino_walk/up-1.png` | Frame 1 mirando arriba de la animacion de caminar de personaje `nino`. |
| `assets/generated/characters/nino_walk/up-2.png` | Frame 2 mirando arriba de la animacion de caminar de personaje `nino`. |
| `assets/generated/characters/nino_walk/up-3.png` | Frame 3 mirando arriba de la animacion de caminar de personaje `nino`. |
| `assets/generated/characters/nino_walk/up-4.png` | Frame 4 mirando arriba de la animacion de caminar de personaje `nino`. |
| `assets/generated/characters/nino_walk/up-strip.png` | Tira de frames mirando arriba de la animacion de caminar de personaje `nino`. |
| `assets/generated/characters/nino_walk/up.gif` | GIF de previsualizacion mirando arriba de personaje `nino`. |
| `assets/generated/characters/piornala_throw/animation.gif` | GIF de previsualizacion de lanzamiento para personaje `piornala`. |
| `assets/generated/characters/piornala_throw/pipeline-meta.json` | Metadatos del procesado de la hoja de lanzamiento de personaje `piornala`. |
| `assets/generated/characters/piornala_throw/prompt-used.txt` | Prompt usado para generar la hoja de lanzamiento de personaje `piornala`. |
| `assets/generated/characters/piornala_throw/raw-sheet-clean.png` | Hoja limpia intermedia de lanzamiento de personaje `piornala` tras procesado. |
| `assets/generated/characters/piornala_throw/raw-sheet.png` | Hoja bruta generada para lanzamiento de personaje `piornala`, conservada como fuente. |
| `assets/generated/characters/piornala_throw/sheet-transparent.png` | Spritesheet transparente 2x3 de lanzamiento para personaje `piornala`, usado por PixiJS en runtime. |
| `assets/generated/characters/piornala_throw/throw-1.png` | Frame 1 de la animacion de lanzamiento para personaje `piornala`. |
| `assets/generated/characters/piornala_throw/throw-2.png` | Frame 2 de la animacion de lanzamiento para personaje `piornala`. |
| `assets/generated/characters/piornala_throw/throw-3.png` | Frame 3 de la animacion de lanzamiento para personaje `piornala`. |
| `assets/generated/characters/piornala_throw/throw-4.png` | Frame 4 de la animacion de lanzamiento para personaje `piornala`. |
| `assets/generated/characters/piornala_throw/throw-5.png` | Frame 5 de la animacion de lanzamiento para personaje `piornala`. |
| `assets/generated/characters/piornala_throw/throw-6.png` | Frame 6 de la animacion de lanzamiento para personaje `piornala`. |
| `assets/generated/characters/piornala_walk/down-1.png` | Frame 1 mirando abajo de la animacion de caminar de personaje `piornala`. |
| `assets/generated/characters/piornala_walk/down-2.png` | Frame 2 mirando abajo de la animacion de caminar de personaje `piornala`. |
| `assets/generated/characters/piornala_walk/down-3.png` | Frame 3 mirando abajo de la animacion de caminar de personaje `piornala`. |
| `assets/generated/characters/piornala_walk/down-4.png` | Frame 4 mirando abajo de la animacion de caminar de personaje `piornala`. |
| `assets/generated/characters/piornala_walk/down-strip.png` | Tira de frames mirando abajo de la animacion de caminar de personaje `piornala`. |
| `assets/generated/characters/piornala_walk/down.gif` | GIF de previsualizacion mirando abajo de personaje `piornala`. |
| `assets/generated/characters/piornala_walk/left-1.png` | Frame 1 mirando izquierda de la animacion de caminar de personaje `piornala`. |
| `assets/generated/characters/piornala_walk/left-2.png` | Frame 2 mirando izquierda de la animacion de caminar de personaje `piornala`. |
| `assets/generated/characters/piornala_walk/left-3.png` | Frame 3 mirando izquierda de la animacion de caminar de personaje `piornala`. |
| `assets/generated/characters/piornala_walk/left-4.png` | Frame 4 mirando izquierda de la animacion de caminar de personaje `piornala`. |
| `assets/generated/characters/piornala_walk/left-strip.png` | Tira de frames mirando izquierda de la animacion de caminar de personaje `piornala`. |
| `assets/generated/characters/piornala_walk/left.gif` | GIF de previsualizacion mirando izquierda de personaje `piornala`. |
| `assets/generated/characters/piornala_walk/pipeline-meta.json` | Metadatos del procesado de la hoja de caminar de personaje `piornala`. |
| `assets/generated/characters/piornala_walk/prompt-used.txt` | Prompt usado para generar la hoja de caminar de personaje `piornala`. |
| `assets/generated/characters/piornala_walk/raw-sheet-clean.png` | Hoja limpia intermedia de caminar de personaje `piornala` tras procesado. |
| `assets/generated/characters/piornala_walk/raw-sheet.png` | Hoja bruta generada para caminar de personaje `piornala`, conservada como fuente. |
| `assets/generated/characters/piornala_walk/right-1.png` | Frame 1 mirando derecha de la animacion de caminar de personaje `piornala`. |
| `assets/generated/characters/piornala_walk/right-2.png` | Frame 2 mirando derecha de la animacion de caminar de personaje `piornala`. |
| `assets/generated/characters/piornala_walk/right-3.png` | Frame 3 mirando derecha de la animacion de caminar de personaje `piornala`. |
| `assets/generated/characters/piornala_walk/right-4.png` | Frame 4 mirando derecha de la animacion de caminar de personaje `piornala`. |
| `assets/generated/characters/piornala_walk/right-strip.png` | Tira de frames mirando derecha de la animacion de caminar de personaje `piornala`. |
| `assets/generated/characters/piornala_walk/right.gif` | GIF de previsualizacion mirando derecha de personaje `piornala`. |
| `assets/generated/characters/piornala_walk/sheet-transparent.png` | Spritesheet transparente 4x4 de caminar para personaje `piornala`, usado por PixiJS en runtime. |
| `assets/generated/characters/piornala_walk/up-1.png` | Frame 1 mirando arriba de la animacion de caminar de personaje `piornala`. |
| `assets/generated/characters/piornala_walk/up-2.png` | Frame 2 mirando arriba de la animacion de caminar de personaje `piornala`. |
| `assets/generated/characters/piornala_walk/up-3.png` | Frame 3 mirando arriba de la animacion de caminar de personaje `piornala`. |
| `assets/generated/characters/piornala_walk/up-4.png` | Frame 4 mirando arriba de la animacion de caminar de personaje `piornala`. |
| `assets/generated/characters/piornala_walk/up-strip.png` | Tira de frames mirando arriba de la animacion de caminar de personaje `piornala`. |
| `assets/generated/characters/piornala_walk/up.gif` | GIF de previsualizacion mirando arriba de personaje `piornala`. |
| `assets/generated/characters/senor_mayor_throw/animation.gif` | GIF de previsualizacion de lanzamiento para personaje `senor_mayor`. |
| `assets/generated/characters/senor_mayor_throw/pipeline-meta.json` | Metadatos del procesado de la hoja de lanzamiento de personaje `senor_mayor`. |
| `assets/generated/characters/senor_mayor_throw/prompt-used.txt` | Prompt usado para generar la hoja de lanzamiento de personaje `senor_mayor`. |
| `assets/generated/characters/senor_mayor_throw/raw-sheet-clean.png` | Hoja limpia intermedia de lanzamiento de personaje `senor_mayor` tras procesado. |
| `assets/generated/characters/senor_mayor_throw/raw-sheet.png` | Hoja bruta generada para lanzamiento de personaje `senor_mayor`, conservada como fuente. |
| `assets/generated/characters/senor_mayor_throw/sheet-transparent.png` | Spritesheet transparente 2x3 de lanzamiento para personaje `senor_mayor`, usado por PixiJS en runtime. |
| `assets/generated/characters/senor_mayor_throw/throw-1.png` | Frame 1 de la animacion de lanzamiento para personaje `senor_mayor`. |
| `assets/generated/characters/senor_mayor_throw/throw-2.png` | Frame 2 de la animacion de lanzamiento para personaje `senor_mayor`. |
| `assets/generated/characters/senor_mayor_throw/throw-3.png` | Frame 3 de la animacion de lanzamiento para personaje `senor_mayor`. |
| `assets/generated/characters/senor_mayor_throw/throw-4.png` | Frame 4 de la animacion de lanzamiento para personaje `senor_mayor`. |
| `assets/generated/characters/senor_mayor_throw/throw-5.png` | Frame 5 de la animacion de lanzamiento para personaje `senor_mayor`. |
| `assets/generated/characters/senor_mayor_throw/throw-6.png` | Frame 6 de la animacion de lanzamiento para personaje `senor_mayor`. |
| `assets/generated/characters/senor_mayor_walk/down-1.png` | Frame 1 mirando abajo de la animacion de caminar de personaje `senor_mayor`. |
| `assets/generated/characters/senor_mayor_walk/down-2.png` | Frame 2 mirando abajo de la animacion de caminar de personaje `senor_mayor`. |
| `assets/generated/characters/senor_mayor_walk/down-3.png` | Frame 3 mirando abajo de la animacion de caminar de personaje `senor_mayor`. |
| `assets/generated/characters/senor_mayor_walk/down-4.png` | Frame 4 mirando abajo de la animacion de caminar de personaje `senor_mayor`. |
| `assets/generated/characters/senor_mayor_walk/down-strip.png` | Tira de frames mirando abajo de la animacion de caminar de personaje `senor_mayor`. |
| `assets/generated/characters/senor_mayor_walk/down.gif` | GIF de previsualizacion mirando abajo de personaje `senor_mayor`. |
| `assets/generated/characters/senor_mayor_walk/left-1.png` | Frame 1 mirando izquierda de la animacion de caminar de personaje `senor_mayor`. |
| `assets/generated/characters/senor_mayor_walk/left-2.png` | Frame 2 mirando izquierda de la animacion de caminar de personaje `senor_mayor`. |
| `assets/generated/characters/senor_mayor_walk/left-3.png` | Frame 3 mirando izquierda de la animacion de caminar de personaje `senor_mayor`. |
| `assets/generated/characters/senor_mayor_walk/left-4.png` | Frame 4 mirando izquierda de la animacion de caminar de personaje `senor_mayor`. |
| `assets/generated/characters/senor_mayor_walk/left-strip.png` | Tira de frames mirando izquierda de la animacion de caminar de personaje `senor_mayor`. |
| `assets/generated/characters/senor_mayor_walk/left.gif` | GIF de previsualizacion mirando izquierda de personaje `senor_mayor`. |
| `assets/generated/characters/senor_mayor_walk/pipeline-meta.json` | Metadatos del procesado de la hoja de caminar de personaje `senor_mayor`. |
| `assets/generated/characters/senor_mayor_walk/prompt-used.txt` | Prompt usado para generar la hoja de caminar de personaje `senor_mayor`. |
| `assets/generated/characters/senor_mayor_walk/raw-sheet-clean.png` | Hoja limpia intermedia de caminar de personaje `senor_mayor` tras procesado. |
| `assets/generated/characters/senor_mayor_walk/raw-sheet.png` | Hoja bruta generada para caminar de personaje `senor_mayor`, conservada como fuente. |
| `assets/generated/characters/senor_mayor_walk/right-1.png` | Frame 1 mirando derecha de la animacion de caminar de personaje `senor_mayor`. |
| `assets/generated/characters/senor_mayor_walk/right-2.png` | Frame 2 mirando derecha de la animacion de caminar de personaje `senor_mayor`. |
| `assets/generated/characters/senor_mayor_walk/right-3.png` | Frame 3 mirando derecha de la animacion de caminar de personaje `senor_mayor`. |
| `assets/generated/characters/senor_mayor_walk/right-4.png` | Frame 4 mirando derecha de la animacion de caminar de personaje `senor_mayor`. |
| `assets/generated/characters/senor_mayor_walk/right-strip.png` | Tira de frames mirando derecha de la animacion de caminar de personaje `senor_mayor`. |
| `assets/generated/characters/senor_mayor_walk/right.gif` | GIF de previsualizacion mirando derecha de personaje `senor_mayor`. |
| `assets/generated/characters/senor_mayor_walk/sheet-transparent.png` | Spritesheet transparente 4x4 de caminar para personaje `senor_mayor`, usado por PixiJS en runtime. |
| `assets/generated/characters/senor_mayor_walk/up-1.png` | Frame 1 mirando arriba de la animacion de caminar de personaje `senor_mayor`. |
| `assets/generated/characters/senor_mayor_walk/up-2.png` | Frame 2 mirando arriba de la animacion de caminar de personaje `senor_mayor`. |
| `assets/generated/characters/senor_mayor_walk/up-3.png` | Frame 3 mirando arriba de la animacion de caminar de personaje `senor_mayor`. |
| `assets/generated/characters/senor_mayor_walk/up-4.png` | Frame 4 mirando arriba de la animacion de caminar de personaje `senor_mayor`. |
| `assets/generated/characters/senor_mayor_walk/up-strip.png` | Tira de frames mirando arriba de la animacion de caminar de personaje `senor_mayor`. |
| `assets/generated/characters/senor_mayor_walk/up.gif` | GIF de previsualizacion mirando arriba de personaje `senor_mayor`. |
| `assets/generated/characters/traje_tacones_throw/animation.gif` | GIF de previsualizacion de lanzamiento para personaje `traje_tacones`. |
| `assets/generated/characters/traje_tacones_throw/pipeline-meta.json` | Metadatos del procesado de la hoja de lanzamiento de personaje `traje_tacones`. |
| `assets/generated/characters/traje_tacones_throw/prompt-used.txt` | Prompt usado para generar la hoja de lanzamiento de personaje `traje_tacones`. |
| `assets/generated/characters/traje_tacones_throw/raw-sheet-clean.png` | Hoja limpia intermedia de lanzamiento de personaje `traje_tacones` tras procesado. |
| `assets/generated/characters/traje_tacones_throw/raw-sheet.png` | Hoja bruta generada para lanzamiento de personaje `traje_tacones`, conservada como fuente. |
| `assets/generated/characters/traje_tacones_throw/sheet-transparent.png` | Spritesheet transparente 2x3 de lanzamiento para personaje `traje_tacones`, usado por PixiJS en runtime. |
| `assets/generated/characters/traje_tacones_throw/throw-1.png` | Frame 1 de la animacion de lanzamiento para personaje `traje_tacones`. |
| `assets/generated/characters/traje_tacones_throw/throw-2.png` | Frame 2 de la animacion de lanzamiento para personaje `traje_tacones`. |
| `assets/generated/characters/traje_tacones_throw/throw-3.png` | Frame 3 de la animacion de lanzamiento para personaje `traje_tacones`. |
| `assets/generated/characters/traje_tacones_throw/throw-4.png` | Frame 4 de la animacion de lanzamiento para personaje `traje_tacones`. |
| `assets/generated/characters/traje_tacones_throw/throw-5.png` | Frame 5 de la animacion de lanzamiento para personaje `traje_tacones`. |
| `assets/generated/characters/traje_tacones_throw/throw-6.png` | Frame 6 de la animacion de lanzamiento para personaje `traje_tacones`. |
| `assets/generated/characters/traje_tacones_walk/down-1.png` | Frame 1 mirando abajo de la animacion de caminar de personaje `traje_tacones`. |
| `assets/generated/characters/traje_tacones_walk/down-2.png` | Frame 2 mirando abajo de la animacion de caminar de personaje `traje_tacones`. |
| `assets/generated/characters/traje_tacones_walk/down-3.png` | Frame 3 mirando abajo de la animacion de caminar de personaje `traje_tacones`. |
| `assets/generated/characters/traje_tacones_walk/down-4.png` | Frame 4 mirando abajo de la animacion de caminar de personaje `traje_tacones`. |
| `assets/generated/characters/traje_tacones_walk/down-strip.png` | Tira de frames mirando abajo de la animacion de caminar de personaje `traje_tacones`. |
| `assets/generated/characters/traje_tacones_walk/down.gif` | GIF de previsualizacion mirando abajo de personaje `traje_tacones`. |
| `assets/generated/characters/traje_tacones_walk/left-1.png` | Frame 1 mirando izquierda de la animacion de caminar de personaje `traje_tacones`. |
| `assets/generated/characters/traje_tacones_walk/left-2.png` | Frame 2 mirando izquierda de la animacion de caminar de personaje `traje_tacones`. |
| `assets/generated/characters/traje_tacones_walk/left-3.png` | Frame 3 mirando izquierda de la animacion de caminar de personaje `traje_tacones`. |
| `assets/generated/characters/traje_tacones_walk/left-4.png` | Frame 4 mirando izquierda de la animacion de caminar de personaje `traje_tacones`. |
| `assets/generated/characters/traje_tacones_walk/left-strip.png` | Tira de frames mirando izquierda de la animacion de caminar de personaje `traje_tacones`. |
| `assets/generated/characters/traje_tacones_walk/left.gif` | GIF de previsualizacion mirando izquierda de personaje `traje_tacones`. |
| `assets/generated/characters/traje_tacones_walk/pipeline-meta.json` | Metadatos del procesado de la hoja de caminar de personaje `traje_tacones`. |
| `assets/generated/characters/traje_tacones_walk/prompt-used.txt` | Prompt usado para generar la hoja de caminar de personaje `traje_tacones`. |
| `assets/generated/characters/traje_tacones_walk/raw-sheet-clean.png` | Hoja limpia intermedia de caminar de personaje `traje_tacones` tras procesado. |
| `assets/generated/characters/traje_tacones_walk/raw-sheet.png` | Hoja bruta generada para caminar de personaje `traje_tacones`, conservada como fuente. |
| `assets/generated/characters/traje_tacones_walk/right-1.png` | Frame 1 mirando derecha de la animacion de caminar de personaje `traje_tacones`. |
| `assets/generated/characters/traje_tacones_walk/right-2.png` | Frame 2 mirando derecha de la animacion de caminar de personaje `traje_tacones`. |
| `assets/generated/characters/traje_tacones_walk/right-3.png` | Frame 3 mirando derecha de la animacion de caminar de personaje `traje_tacones`. |
| `assets/generated/characters/traje_tacones_walk/right-4.png` | Frame 4 mirando derecha de la animacion de caminar de personaje `traje_tacones`. |
| `assets/generated/characters/traje_tacones_walk/right-strip.png` | Tira de frames mirando derecha de la animacion de caminar de personaje `traje_tacones`. |
| `assets/generated/characters/traje_tacones_walk/right.gif` | GIF de previsualizacion mirando derecha de personaje `traje_tacones`. |
| `assets/generated/characters/traje_tacones_walk/sheet-transparent.png` | Spritesheet transparente 4x4 de caminar para personaje `traje_tacones`, usado por PixiJS en runtime. |
| `assets/generated/characters/traje_tacones_walk/up-1.png` | Frame 1 mirando arriba de la animacion de caminar de personaje `traje_tacones`. |
| `assets/generated/characters/traje_tacones_walk/up-2.png` | Frame 2 mirando arriba de la animacion de caminar de personaje `traje_tacones`. |
| `assets/generated/characters/traje_tacones_walk/up-3.png` | Frame 3 mirando arriba de la animacion de caminar de personaje `traje_tacones`. |
| `assets/generated/characters/traje_tacones_walk/up-4.png` | Frame 4 mirando arriba de la animacion de caminar de personaje `traje_tacones`. |
| `assets/generated/characters/traje_tacones_walk/up-strip.png` | Tira de frames mirando arriba de la animacion de caminar de personaje `traje_tacones`. |
| `assets/generated/characters/traje_tacones_walk/up.gif` | GIF de previsualizacion mirando arriba de personaje `traje_tacones`. |
| `assets/generated/fountains/animation.gif` | GIF de previsualizacion de fuentes. |
| `assets/generated/fountains/fountain-1.png` | Sprite individual 1 de fuente. |
| `assets/generated/fountains/fountain-2.png` | Sprite individual 2 de fuente. |
| `assets/generated/fountains/fountain-3.png` | Sprite individual 3 de fuente. |
| `assets/generated/fountains/pipeline-meta.json` | Metadatos del procesado de fuentes. |
| `assets/generated/fountains/prompt-used.txt` | Prompt usado para generar fuentes. |
| `assets/generated/fountains/raw-sheet-clean.png` | Hoja limpia intermedia de fuentes tras procesado. |
| `assets/generated/fountains/raw-sheet.png` | Hoja bruta generada de fuentes, conservada como fuente. |
| `assets/generated/fountains/sheet-transparent.png` | Spritesheet transparente de fuentes, usado por el juego cuando esta configurado. |
| `assets/generated/houses/house1.png` | Casa oficial 1 usada por el juego y el editor. |
| `assets/generated/houses/house2.png` | Casa oficial 2 usada por el juego y el editor. |
| `assets/generated/houses/house3.png` | Casa oficial 3 usada por el juego y el editor. |
| `assets/generated/houses/house4.png` | Casa oficial 4 usada por el juego y el editor. |
| `assets/generated/houses/house5.png` | Casa oficial 5 usada por el juego y el editor. |
| `assets/generated/houses/house6.png` | Casa oficial 6 usada por el juego y el editor. |
| `assets/generated/houses/manifest.json` | Manifest generado con rutas y dimensiones de casas; se regenera con `npm run update:houses`. |
| `assets/generated/objects/manifest.json` | Manifest generado con rutas y dimensiones de objetos; se regenera con `npm run update:objects`. |
| `assets/generated/objects/object1.png` | Objeto oficial 1 usado por el juego y el editor. |
| `assets/generated/objects/object2.png` | Objeto oficial 2 usado por el juego y el editor. |
| `assets/generated/objects/object3.png` | Objeto oficial 3 usado por el juego y el editor. |
| `assets/generated/objects/object4.png` | Objeto oficial 4 usado por el juego y el editor. |
| `assets/generated/street_props/animation.gif` | GIF de previsualizacion de los props de calle generados. |
| `assets/generated/street_props/fence.png` | Sprite individual de valla de calle. |
| `assets/generated/street_props/flower-pot.png` | Sprite individual de maceta con flores. |
| `assets/generated/street_props/lamppost.png` | Sprite individual de farola de calle. |
| `assets/generated/street_props/pipeline-meta.json` | Metadatos del procesado de la hoja de props de calle. |
| `assets/generated/street_props/planter-horizontal.png` | Sprite individual de maceta ancha horizontal para calles. |
| `assets/generated/street_props/planter-vertical.png` | Sprite individual de maceta ancha vertical para calles. |
| `assets/generated/street_props/prompt-used.txt` | Prompt usado para generar la hoja de props de calle. |
| `assets/generated/street_props/prop-1.png` | Frame 1 de la hoja de props de calle: arbol. |
| `assets/generated/street_props/prop-2.png` | Frame 2 de la hoja de props de calle: maceta. |
| `assets/generated/street_props/prop-3.png` | Frame 3 de la hoja de props de calle: valla. |
| `assets/generated/street_props/prop-4.png` | Frame 4 de la hoja de props de calle: maceta ancha horizontal. |
| `assets/generated/street_props/prop-5.png` | Frame 5 de la hoja de props de calle: maceta ancha vertical. |
| `assets/generated/street_props/prop-6.png` | Frame 6 de la hoja de props de calle: farola. |
| `assets/generated/street_props/raw-sheet-clean.png` | Hoja limpia intermedia de props de calle tras procesado. |
| `assets/generated/street_props/raw-sheet.png` | Hoja bruta generada de props de calle, conservada como fuente. |
| `assets/generated/street_props/sheet-transparent.png` | Spritesheet transparente 2x3 de props de calle, usado por PixiJS en runtime. |
| `assets/generated/street_props/tree.png` | Sprite individual de arbol de calle. |
| `assets/generated/player_throw/sheet.png` | Spritesheet original del jugador lanzando nabos. |
| `assets/generated/player_walk/preview.png` | Preview del jugador original caminando. |
| `assets/generated/player_walk/sheet.png` | Spritesheet original del jugador caminando. |
| `assets/generated/turnip_piles_new/animation.gif` | GIF de previsualizacion de montones nuevos de nabos. |
| `assets/generated/turnip_piles_new/pipeline-meta.json` | Metadatos del procesado de montones nuevos de nabos. |
| `assets/generated/turnip_piles_new/prompt-used.txt` | Prompt usado para generar montones nuevos de nabos. |
| `assets/generated/turnip_piles_new/raw-sheet-clean.png` | Hoja limpia intermedia de montones nuevos de nabos tras procesado. |
| `assets/generated/turnip_piles_new/raw-sheet.png` | Hoja bruta generada de montones nuevos de nabos, conservada como fuente. |
| `assets/generated/turnip_piles_new/sheet-transparent.png` | Spritesheet transparente de montones nuevos de nabos, usado por el juego cuando esta configurado. |
| `assets/generated/turnip_piles_new/turnip_pile-1.png` | Sprite individual 1 de monton de nabos. |
| `assets/generated/turnip_piles_new/turnip_pile-2.png` | Sprite individual 2 de monton de nabos. |
| `assets/generated/turnip_piles_new/turnip_pile-3.png` | Sprite individual 3 de monton de nabos. |
| `assets/generated/turnip_piles_new/turnip_pile-4.png` | Sprite individual 4 de monton de nabos. |
| `assets/generated/turnip_piles/sheet.png` | Spritesheet antiguo de montones de nabos. |
| `assets/generated/villager_throw_new/animation.gif` | GIF de previsualizacion de vecino lanzando nuevo. |
| `assets/generated/villager_throw_new/pipeline-meta.json` | Metadatos del procesado de vecino lanzando nuevo. |
| `assets/generated/villager_throw_new/prompt-used.txt` | Prompt usado para generar vecino lanzando nuevo. |
| `assets/generated/villager_throw_new/raw-sheet-clean.png` | Hoja limpia intermedia de vecino lanzando nuevo tras procesado. |
| `assets/generated/villager_throw_new/raw-sheet.png` | Hoja bruta generada de vecino lanzando nuevo, conservada como fuente. |
| `assets/generated/villager_throw_new/sheet-transparent.png` | Spritesheet transparente de vecino lanzando nuevo, usado por el juego cuando esta configurado. |
| `assets/generated/villager_throw_new/villager-1.png` | Frame 1 del vecino lanzando nuevo. |
| `assets/generated/villager_throw_new/villager-2.png` | Frame 2 del vecino lanzando nuevo. |
| `assets/generated/villager_throw_new/villager-3.png` | Frame 3 del vecino lanzando nuevo. |
| `assets/generated/villager_throw_new/villager-4.png` | Frame 4 del vecino lanzando nuevo. |
| `assets/generated/villager_throw_new/villager-5.png` | Frame 5 del vecino lanzando nuevo. |
| `assets/generated/villager_throw_new/villager-6.png` | Frame 6 del vecino lanzando nuevo. |
| `assets/generated/villager_throw_types/type_1/animation.gif` | GIF de previsualizacion del vecino lanzando `type_1`. |
| `assets/generated/villager_throw_types/type_1/pipeline-meta.json` | Metadatos del procesado del vecino lanzando `type_1`. |
| `assets/generated/villager_throw_types/type_1/prompt-used.txt` | Prompt usado para generar el vecino lanzando `type_1`. |
| `assets/generated/villager_throw_types/type_1/raw-sheet-clean.png` | Hoja limpia intermedia del vecino lanzando `type_1`. |
| `assets/generated/villager_throw_types/type_1/raw-sheet.png` | Hoja bruta generada del vecino lanzando `type_1`, conservada como fuente. |
| `assets/generated/villager_throw_types/type_1/sheet-transparent.png` | Spritesheet transparente del vecino lanzando `type_1`, usado como variante de NPC. |
| `assets/generated/villager_throw_types/type_1/sheet.png` | Spritesheet base del vecino lanzando `type_1`. |
| `assets/generated/villager_throw_types/type_1/villager_elder-1.png` | Frame 1 de la variante de vecino lanzando `villager_elder` (type_1). |
| `assets/generated/villager_throw_types/type_1/villager_elder-2.png` | Frame 2 de la variante de vecino lanzando `villager_elder` (type_1). |
| `assets/generated/villager_throw_types/type_1/villager_elder-3.png` | Frame 3 de la variante de vecino lanzando `villager_elder` (type_1). |
| `assets/generated/villager_throw_types/type_1/villager_elder-4.png` | Frame 4 de la variante de vecino lanzando `villager_elder` (type_1). |
| `assets/generated/villager_throw_types/type_1/villager_elder-5.png` | Frame 5 de la variante de vecino lanzando `villager_elder` (type_1). |
| `assets/generated/villager_throw_types/type_1/villager_elder-6.png` | Frame 6 de la variante de vecino lanzando `villager_elder` (type_1). |
| `assets/generated/villager_throw_types/type_2/animation.gif` | GIF de previsualizacion del vecino lanzando `type_2`. |
| `assets/generated/villager_throw_types/type_2/pipeline-meta.json` | Metadatos del procesado del vecino lanzando `type_2`. |
| `assets/generated/villager_throw_types/type_2/prompt-used.txt` | Prompt usado para generar el vecino lanzando `type_2`. |
| `assets/generated/villager_throw_types/type_2/raw-sheet-clean.png` | Hoja limpia intermedia del vecino lanzando `type_2`. |
| `assets/generated/villager_throw_types/type_2/raw-sheet.png` | Hoja bruta generada del vecino lanzando `type_2`, conservada como fuente. |
| `assets/generated/villager_throw_types/type_2/sheet-transparent.png` | Spritesheet transparente del vecino lanzando `type_2`, usado como variante de NPC. |
| `assets/generated/villager_throw_types/type_2/sheet.png` | Spritesheet base del vecino lanzando `type_2`. |
| `assets/generated/villager_throw_types/type_2/villager_farmer-1.png` | Frame 1 de la variante de vecino lanzando `villager_farmer` (type_2). |
| `assets/generated/villager_throw_types/type_2/villager_farmer-2.png` | Frame 2 de la variante de vecino lanzando `villager_farmer` (type_2). |
| `assets/generated/villager_throw_types/type_2/villager_farmer-3.png` | Frame 3 de la variante de vecino lanzando `villager_farmer` (type_2). |
| `assets/generated/villager_throw_types/type_2/villager_farmer-4.png` | Frame 4 de la variante de vecino lanzando `villager_farmer` (type_2). |
| `assets/generated/villager_throw_types/type_2/villager_farmer-5.png` | Frame 5 de la variante de vecino lanzando `villager_farmer` (type_2). |
| `assets/generated/villager_throw_types/type_2/villager_farmer-6.png` | Frame 6 de la variante de vecino lanzando `villager_farmer` (type_2). |
| `assets/generated/villager_throw_types/type_3/animation.gif` | GIF de previsualizacion del vecino lanzando `type_3`. |
| `assets/generated/villager_throw_types/type_3/pipeline-meta.json` | Metadatos del procesado del vecino lanzando `type_3`. |
| `assets/generated/villager_throw_types/type_3/prompt-used.txt` | Prompt usado para generar el vecino lanzando `type_3`. |
| `assets/generated/villager_throw_types/type_3/raw-sheet-clean.png` | Hoja limpia intermedia del vecino lanzando `type_3`. |
| `assets/generated/villager_throw_types/type_3/raw-sheet.png` | Hoja bruta generada del vecino lanzando `type_3`, conservada como fuente. |
| `assets/generated/villager_throw_types/type_3/sheet-transparent.png` | Spritesheet transparente del vecino lanzando `type_3`, usado como variante de NPC. |
| `assets/generated/villager_throw_types/type_3/sheet.png` | Spritesheet base del vecino lanzando `type_3`. |
| `assets/generated/villager_throw_types/type_3/villager_young_woman-1.png` | Frame 1 de la variante de vecino lanzando `villager_young_woman` (type_3). |
| `assets/generated/villager_throw_types/type_3/villager_young_woman-2.png` | Frame 2 de la variante de vecino lanzando `villager_young_woman` (type_3). |
| `assets/generated/villager_throw_types/type_3/villager_young_woman-3.png` | Frame 3 de la variante de vecino lanzando `villager_young_woman` (type_3). |
| `assets/generated/villager_throw_types/type_3/villager_young_woman-4.png` | Frame 4 de la variante de vecino lanzando `villager_young_woman` (type_3). |
| `assets/generated/villager_throw_types/type_3/villager_young_woman-5.png` | Frame 5 de la variante de vecino lanzando `villager_young_woman` (type_3). |
| `assets/generated/villager_throw_types/type_3/villager_young_woman-6.png` | Frame 6 de la variante de vecino lanzando `villager_young_woman` (type_3). |
| `assets/generated/villager_throw_types/type_4/animation.gif` | GIF de previsualizacion del vecino lanzando `type_4`. |
| `assets/generated/villager_throw_types/type_4/pipeline-meta.json` | Metadatos del procesado del vecino lanzando `type_4`. |
| `assets/generated/villager_throw_types/type_4/prompt-used.txt` | Prompt usado para generar el vecino lanzando `type_4`. |
| `assets/generated/villager_throw_types/type_4/raw-sheet-clean.png` | Hoja limpia intermedia del vecino lanzando `type_4`. |
| `assets/generated/villager_throw_types/type_4/raw-sheet.png` | Hoja bruta generada del vecino lanzando `type_4`, conservada como fuente. |
| `assets/generated/villager_throw_types/type_4/sheet-transparent.png` | Spritesheet transparente del vecino lanzando `type_4`, usado como variante de NPC. |
| `assets/generated/villager_throw_types/type_4/sheet.png` | Spritesheet base del vecino lanzando `type_4`. |
| `assets/generated/villager_throw_types/type_4/villager_young_man-1.png` | Frame 1 de la variante de vecino lanzando `villager_young_man` (type_4). |
| `assets/generated/villager_throw_types/type_4/villager_young_man-2.png` | Frame 2 de la variante de vecino lanzando `villager_young_man` (type_4). |
| `assets/generated/villager_throw_types/type_4/villager_young_man-3.png` | Frame 3 de la variante de vecino lanzando `villager_young_man` (type_4). |
| `assets/generated/villager_throw_types/type_4/villager_young_man-4.png` | Frame 4 de la variante de vecino lanzando `villager_young_man` (type_4). |
| `assets/generated/villager_throw_types/type_4/villager_young_man-5.png` | Frame 5 de la variante de vecino lanzando `villager_young_man` (type_4). |
| `assets/generated/villager_throw_types/type_4/villager_young_man-6.png` | Frame 6 de la variante de vecino lanzando `villager_young_man` (type_4). |
| `assets/generated/villager_throw/sheet.png` | Spritesheet antiguo de vecino lanzando nabos. |
| `assets/generated/villager_types/sheet.png` | Spritesheet antiguo con tipos de vecinos/personas. |
| `assets/icons/apple-touch-icon.png` | Icono PWA (apple-touch-icon.png) usado por manifest, instalacion o dispositivos Apple. |
| `assets/icons/icon-192.png` | Icono PWA (icon-192.png) usado por manifest, instalacion o dispositivos Apple. |
| `assets/icons/icon-512.png` | Icono PWA (icon-512.png) usado por manifest, instalacion o dispositivos Apple. |
| `assets/jarramplas/modelo_buho_azul_front_8f_hd/frame_001.png` | Frame 001 de la animacion de la variante de Jarramplas `modelo_buho_azul_front_8f_hd`. |
| `assets/jarramplas/modelo_buho_azul_front_8f_hd/frame_002.png` | Frame 002 de la animacion de la variante de Jarramplas `modelo_buho_azul_front_8f_hd`. |
| `assets/jarramplas/modelo_buho_azul_front_8f_hd/frame_003.png` | Frame 003 de la animacion de la variante de Jarramplas `modelo_buho_azul_front_8f_hd`. |
| `assets/jarramplas/modelo_buho_azul_front_8f_hd/frame_004.png` | Frame 004 de la animacion de la variante de Jarramplas `modelo_buho_azul_front_8f_hd`. |
| `assets/jarramplas/modelo_buho_azul_front_8f_hd/frame_005.png` | Frame 005 de la animacion de la variante de Jarramplas `modelo_buho_azul_front_8f_hd`. |
| `assets/jarramplas/modelo_buho_azul_front_8f_hd/frame_006.png` | Frame 006 de la animacion de la variante de Jarramplas `modelo_buho_azul_front_8f_hd`. |
| `assets/jarramplas/modelo_buho_azul_front_8f_hd/frame_007.png` | Frame 007 de la animacion de la variante de Jarramplas `modelo_buho_azul_front_8f_hd`. |
| `assets/jarramplas/modelo_buho_azul_front_8f_hd/frame_008.png` | Frame 008 de la animacion de la variante de Jarramplas `modelo_buho_azul_front_8f_hd`. |
| `assets/jarramplas/modelo_centro_front_8f_hd/frame_001.png` | Frame 001 de la animacion de la variante de Jarramplas `modelo_centro_front_8f_hd`. |
| `assets/jarramplas/modelo_centro_front_8f_hd/frame_002.png` | Frame 002 de la animacion de la variante de Jarramplas `modelo_centro_front_8f_hd`. |
| `assets/jarramplas/modelo_centro_front_8f_hd/frame_003.png` | Frame 003 de la animacion de la variante de Jarramplas `modelo_centro_front_8f_hd`. |
| `assets/jarramplas/modelo_centro_front_8f_hd/frame_004.png` | Frame 004 de la animacion de la variante de Jarramplas `modelo_centro_front_8f_hd`. |
| `assets/jarramplas/modelo_centro_front_8f_hd/frame_005.png` | Frame 005 de la animacion de la variante de Jarramplas `modelo_centro_front_8f_hd`. |
| `assets/jarramplas/modelo_centro_front_8f_hd/frame_006.png` | Frame 006 de la animacion de la variante de Jarramplas `modelo_centro_front_8f_hd`. |
| `assets/jarramplas/modelo_centro_front_8f_hd/frame_007.png` | Frame 007 de la animacion de la variante de Jarramplas `modelo_centro_front_8f_hd`. |
| `assets/jarramplas/modelo_centro_front_8f_hd/frame_008.png` | Frame 008 de la animacion de la variante de Jarramplas `modelo_centro_front_8f_hd`. |
| `assets/jarramplas/modelo_derecha_front_8f_hd/frame_001.png` | Frame 001 de la animacion de la variante de Jarramplas `modelo_derecha_front_8f_hd`. |
| `assets/jarramplas/modelo_derecha_front_8f_hd/frame_002.png` | Frame 002 de la animacion de la variante de Jarramplas `modelo_derecha_front_8f_hd`. |
| `assets/jarramplas/modelo_derecha_front_8f_hd/frame_003.png` | Frame 003 de la animacion de la variante de Jarramplas `modelo_derecha_front_8f_hd`. |
| `assets/jarramplas/modelo_derecha_front_8f_hd/frame_004.png` | Frame 004 de la animacion de la variante de Jarramplas `modelo_derecha_front_8f_hd`. |
| `assets/jarramplas/modelo_derecha_front_8f_hd/frame_005.png` | Frame 005 de la animacion de la variante de Jarramplas `modelo_derecha_front_8f_hd`. |
| `assets/jarramplas/modelo_derecha_front_8f_hd/frame_006.png` | Frame 006 de la animacion de la variante de Jarramplas `modelo_derecha_front_8f_hd`. |
| `assets/jarramplas/modelo_derecha_front_8f_hd/frame_007.png` | Frame 007 de la animacion de la variante de Jarramplas `modelo_derecha_front_8f_hd`. |
| `assets/jarramplas/modelo_derecha_front_8f_hd/frame_008.png` | Frame 008 de la animacion de la variante de Jarramplas `modelo_derecha_front_8f_hd`. |
| `assets/jarramplas/modelo_izquierda_front_8f_hd/frame_001.png` | Frame 001 de la animacion de la variante de Jarramplas `modelo_izquierda_front_8f_hd`. |
| `assets/jarramplas/modelo_izquierda_front_8f_hd/frame_002.png` | Frame 002 de la animacion de la variante de Jarramplas `modelo_izquierda_front_8f_hd`. |
| `assets/jarramplas/modelo_izquierda_front_8f_hd/frame_003.png` | Frame 003 de la animacion de la variante de Jarramplas `modelo_izquierda_front_8f_hd`. |
| `assets/jarramplas/modelo_izquierda_front_8f_hd/frame_004.png` | Frame 004 de la animacion de la variante de Jarramplas `modelo_izquierda_front_8f_hd`. |
| `assets/jarramplas/modelo_izquierda_front_8f_hd/frame_005.png` | Frame 005 de la animacion de la variante de Jarramplas `modelo_izquierda_front_8f_hd`. |
| `assets/jarramplas/modelo_izquierda_front_8f_hd/frame_006.png` | Frame 006 de la animacion de la variante de Jarramplas `modelo_izquierda_front_8f_hd`. |
| `assets/jarramplas/modelo_izquierda_front_8f_hd/frame_007.png` | Frame 007 de la animacion de la variante de Jarramplas `modelo_izquierda_front_8f_hd`. |
| `assets/jarramplas/modelo_izquierda_front_8f_hd/frame_008.png` | Frame 008 de la animacion de la variante de Jarramplas `modelo_izquierda_front_8f_hd`. |
| `assets/jarramplas/modelo_leon_front_8f_hd/frame_001.png` | Frame 001 de la animacion de la variante de Jarramplas `modelo_leon_front_8f_hd`. |
| `assets/jarramplas/modelo_leon_front_8f_hd/frame_002.png` | Frame 002 de la animacion de la variante de Jarramplas `modelo_leon_front_8f_hd`. |
| `assets/jarramplas/modelo_leon_front_8f_hd/frame_003.png` | Frame 003 de la animacion de la variante de Jarramplas `modelo_leon_front_8f_hd`. |
| `assets/jarramplas/modelo_leon_front_8f_hd/frame_004.png` | Frame 004 de la animacion de la variante de Jarramplas `modelo_leon_front_8f_hd`. |
| `assets/jarramplas/modelo_leon_front_8f_hd/frame_005.png` | Frame 005 de la animacion de la variante de Jarramplas `modelo_leon_front_8f_hd`. |
| `assets/jarramplas/modelo_leon_front_8f_hd/frame_006.png` | Frame 006 de la animacion de la variante de Jarramplas `modelo_leon_front_8f_hd`. |
| `assets/jarramplas/modelo_leon_front_8f_hd/frame_007.png` | Frame 007 de la animacion de la variante de Jarramplas `modelo_leon_front_8f_hd`. |
| `assets/jarramplas/modelo_leon_front_8f_hd/frame_008.png` | Frame 008 de la animacion de la variante de Jarramplas `modelo_leon_front_8f_hd`. |
| `assets/jarramplas/modelo_negro_dorado_front_8f_hd/frame_001.png` | Frame 001 de la animacion de la variante de Jarramplas `modelo_negro_dorado_front_8f_hd`. |
| `assets/jarramplas/modelo_negro_dorado_front_8f_hd/frame_002.png` | Frame 002 de la animacion de la variante de Jarramplas `modelo_negro_dorado_front_8f_hd`. |
| `assets/jarramplas/modelo_negro_dorado_front_8f_hd/frame_003.png` | Frame 003 de la animacion de la variante de Jarramplas `modelo_negro_dorado_front_8f_hd`. |
| `assets/jarramplas/modelo_negro_dorado_front_8f_hd/frame_004.png` | Frame 004 de la animacion de la variante de Jarramplas `modelo_negro_dorado_front_8f_hd`. |
| `assets/jarramplas/modelo_negro_dorado_front_8f_hd/frame_005.png` | Frame 005 de la animacion de la variante de Jarramplas `modelo_negro_dorado_front_8f_hd`. |
| `assets/jarramplas/modelo_negro_dorado_front_8f_hd/frame_006.png` | Frame 006 de la animacion de la variante de Jarramplas `modelo_negro_dorado_front_8f_hd`. |
| `assets/jarramplas/modelo_negro_dorado_front_8f_hd/frame_007.png` | Frame 007 de la animacion de la variante de Jarramplas `modelo_negro_dorado_front_8f_hd`. |
| `assets/jarramplas/modelo_negro_dorado_front_8f_hd/frame_008.png` | Frame 008 de la animacion de la variante de Jarramplas `modelo_negro_dorado_front_8f_hd`. |
| `assets/jarramplas/modelo_rojo_verde_front_8f_hd/frame_001.png` | Frame 001 de la animacion de la variante de Jarramplas `modelo_rojo_verde_front_8f_hd`. |
| `assets/jarramplas/modelo_rojo_verde_front_8f_hd/frame_002.png` | Frame 002 de la animacion de la variante de Jarramplas `modelo_rojo_verde_front_8f_hd`. |
| `assets/jarramplas/modelo_rojo_verde_front_8f_hd/frame_003.png` | Frame 003 de la animacion de la variante de Jarramplas `modelo_rojo_verde_front_8f_hd`. |
| `assets/jarramplas/modelo_rojo_verde_front_8f_hd/frame_004.png` | Frame 004 de la animacion de la variante de Jarramplas `modelo_rojo_verde_front_8f_hd`. |
| `assets/jarramplas/modelo_rojo_verde_front_8f_hd/frame_005.png` | Frame 005 de la animacion de la variante de Jarramplas `modelo_rojo_verde_front_8f_hd`. |
| `assets/jarramplas/modelo_rojo_verde_front_8f_hd/frame_006.png` | Frame 006 de la animacion de la variante de Jarramplas `modelo_rojo_verde_front_8f_hd`. |
| `assets/jarramplas/modelo_rojo_verde_front_8f_hd/frame_007.png` | Frame 007 de la animacion de la variante de Jarramplas `modelo_rojo_verde_front_8f_hd`. |
| `assets/jarramplas/modelo_rojo_verde_front_8f_hd/frame_008.png` | Frame 008 de la animacion de la variante de Jarramplas `modelo_rojo_verde_front_8f_hd`. |
| `assets/jarramplas/snes_tamboril_front_8f_hd/frame_001.png` | Frame 001 de la animacion de la variante de Jarramplas `snes_tamboril_front_8f_hd`. |
| `assets/jarramplas/snes_tamboril_front_8f_hd/frame_002.png` | Frame 002 de la animacion de la variante de Jarramplas `snes_tamboril_front_8f_hd`. |
| `assets/jarramplas/snes_tamboril_front_8f_hd/frame_003.png` | Frame 003 de la animacion de la variante de Jarramplas `snes_tamboril_front_8f_hd`. |
| `assets/jarramplas/snes_tamboril_front_8f_hd/frame_004.png` | Frame 004 de la animacion de la variante de Jarramplas `snes_tamboril_front_8f_hd`. |
| `assets/jarramplas/snes_tamboril_front_8f_hd/frame_005.png` | Frame 005 de la animacion de la variante de Jarramplas `snes_tamboril_front_8f_hd`. |
| `assets/jarramplas/snes_tamboril_front_8f_hd/frame_006.png` | Frame 006 de la animacion de la variante de Jarramplas `snes_tamboril_front_8f_hd`. |
| `assets/jarramplas/snes_tamboril_front_8f_hd/frame_007.png` | Frame 007 de la animacion de la variante de Jarramplas `snes_tamboril_front_8f_hd`. |
| `assets/jarramplas/snes_tamboril_front_8f_hd/frame_008.png` | Frame 008 de la animacion de la variante de Jarramplas `snes_tamboril_front_8f_hd`. |
| `assets/personajes/frames/persona1/1.png` | Frame 1 del personaje clasico `persona1`, usado como sprite heredado de vecino/persona. |
| `assets/personajes/frames/persona1/2.png` | Frame 2 del personaje clasico `persona1`, usado como sprite heredado de vecino/persona. |
| `assets/personajes/frames/persona1/3.png` | Frame 3 del personaje clasico `persona1`, usado como sprite heredado de vecino/persona. |
| `assets/personajes/frames/persona1/4.png` | Frame 4 del personaje clasico `persona1`, usado como sprite heredado de vecino/persona. |
| `assets/personajes/frames/persona1/5.png` | Frame 5 del personaje clasico `persona1`, usado como sprite heredado de vecino/persona. |
| `assets/personajes/frames/persona1/6.png` | Frame 6 del personaje clasico `persona1`, usado como sprite heredado de vecino/persona. |
| `assets/personajes/frames/persona2/1.png` | Frame 1 del personaje clasico `persona2`, usado como sprite heredado de vecino/persona. |
| `assets/personajes/frames/persona2/2.png` | Frame 2 del personaje clasico `persona2`, usado como sprite heredado de vecino/persona. |
| `assets/personajes/frames/persona2/3.png` | Frame 3 del personaje clasico `persona2`, usado como sprite heredado de vecino/persona. |
| `assets/personajes/frames/persona2/4.png` | Frame 4 del personaje clasico `persona2`, usado como sprite heredado de vecino/persona. |
| `assets/personajes/frames/persona2/5.png` | Frame 5 del personaje clasico `persona2`, usado como sprite heredado de vecino/persona. |
| `assets/personajes/frames/persona2/6.png` | Frame 6 del personaje clasico `persona2`, usado como sprite heredado de vecino/persona. |
| `assets/personajes/frames/persona3/1.png` | Frame 1 del personaje clasico `persona3`, usado como sprite heredado de vecino/persona. |
| `assets/personajes/frames/persona3/2.png` | Frame 2 del personaje clasico `persona3`, usado como sprite heredado de vecino/persona. |
| `assets/personajes/frames/persona3/3.png` | Frame 3 del personaje clasico `persona3`, usado como sprite heredado de vecino/persona. |
| `assets/personajes/frames/persona3/4.png` | Frame 4 del personaje clasico `persona3`, usado como sprite heredado de vecino/persona. |
| `assets/personajes/frames/persona3/5.png` | Frame 5 del personaje clasico `persona3`, usado como sprite heredado de vecino/persona. |
| `assets/personajes/frames/persona3/6.png` | Frame 6 del personaje clasico `persona3`, usado como sprite heredado de vecino/persona. |
| `assets/personajes/frames/persona4/1.png` | Frame 1 del personaje clasico `persona4`, usado como sprite heredado de vecino/persona. |
| `assets/personajes/frames/persona4/2.png` | Frame 2 del personaje clasico `persona4`, usado como sprite heredado de vecino/persona. |
| `assets/personajes/frames/persona4/3.png` | Frame 3 del personaje clasico `persona4`, usado como sprite heredado de vecino/persona. |
| `assets/personajes/frames/persona4/4.png` | Frame 4 del personaje clasico `persona4`, usado como sprite heredado de vecino/persona. |
| `assets/personajes/frames/persona4/5.png` | Frame 5 del personaje clasico `persona4`, usado como sprite heredado de vecino/persona. |
| `assets/personajes/frames/persona4/6.png` | Frame 6 del personaje clasico `persona4`, usado como sprite heredado de vecino/persona. |
| `assets/personajes/frames/persona5/1.png` | Frame 1 del personaje clasico `persona5`, usado como sprite heredado de vecino/persona. |
| `assets/personajes/frames/persona5/2.png` | Frame 2 del personaje clasico `persona5`, usado como sprite heredado de vecino/persona. |
| `assets/personajes/frames/persona5/3.png` | Frame 3 del personaje clasico `persona5`, usado como sprite heredado de vecino/persona. |
| `assets/personajes/frames/persona5/4.png` | Frame 4 del personaje clasico `persona5`, usado como sprite heredado de vecino/persona. |
| `assets/personajes/frames/persona5/5.png` | Frame 5 del personaje clasico `persona5`, usado como sprite heredado de vecino/persona. |
| `assets/personajes/frames/persona5/6.png` | Frame 6 del personaje clasico `persona5`, usado como sprite heredado de vecino/persona. |
| `assets/personajes/frames/persona6/1.png` | Frame 1 del personaje clasico `persona6`, usado como sprite heredado de vecino/persona. |
| `assets/personajes/frames/persona6/2.png` | Frame 2 del personaje clasico `persona6`, usado como sprite heredado de vecino/persona. |
| `assets/personajes/frames/persona6/3.png` | Frame 3 del personaje clasico `persona6`, usado como sprite heredado de vecino/persona. |
| `assets/personajes/frames/persona6/4.png` | Frame 4 del personaje clasico `persona6`, usado como sprite heredado de vecino/persona. |
| `assets/personajes/frames/persona6/5.png` | Frame 5 del personaje clasico `persona6`, usado como sprite heredado de vecino/persona. |
| `assets/personajes/frames/persona6/6.png` | Frame 6 del personaje clasico `persona6`, usado como sprite heredado de vecino/persona. |
| `assets/portada.png` | Imagen de portada usada en la pantalla inicial o como recurso promocional del juego. |
| `assets/ui/home-fiesta-premium.png` | Referencia visual generada para el rediseño premium de la pantalla inicial. |

## Documentacion

| Fichero | Para que sirve |
| --- | --- |
| `docs/assets-guide.md` | Guia general de buenas practicas para assets del juego. |
| `docs/balance-guide.md` | Guia de balance para dificultad, ritmo, puntuacion y parametros jugables. |
| `docs/deployment-guide.md` | Guia para publicar y verificar el despliegue del sitio. |
| `docs/file-inventory.md` | Inventario mantenible de todos los ficheros versionados y su funcion. |
| `docs/game-architecture.md` | Guia de arquitectura para organizar juegos HTML5 con Canvas o PixiJS. |
| `docs/input-guide.md` | Guia de entrada de usuario: teclado, tactil, puntero y ergonomia. |
| `docs/testing-guide.md` | Guia de verificacion y pruebas del juego. |

## Modulos de juego

| Fichero | Para que sirve |
| --- | --- |
| `game/actors.js` | Funciones y helpers relacionados con actores del juego: jugador, vecinos, Jarramplas y entidades moviles. |
| `game/assets.js` | Carga y organizacion de imagenes y sprites usados en runtime. |
| `game/constants.js` | Constantes compartidas de gameplay, render, dimensiones base y spritesheets. |
| `game/dom.js` | Referencias DOM para conectar la interfaz HTML con la logica y el canvas usado por PixiJS. |
| `game/effects.js` | Efectos visuales o temporales del juego, como impactos, particulas o feedback. |
| `game/house-assets.js` | Lista generada de casas oficiales en `assets/generated/houses/`, con ruta, etiqueta y dimensiones base. |
| `game/map-assets.js` | Lista generada de mapas/fondos en `assets/fondos/`, con id, nombre, ruta y dimensiones base para el selector. |
| `game/object-assets.js` | Lista generada de objetos oficiales en `assets/generated/objects/`, con ruta, etiqueta y dimensiones base. |
| `game/input.js` | Gestion centralizada de teclado, puntero, tactil y controles moviles. |
| `game/physics.js` | Utilidades de fisica simple, colisiones, movimiento y comprobaciones espaciales. |
| `game/render.js` | Renderer PixiJS: inicializa la aplicacion, crea sprites/texturas, dibuja mapa, actores, efectos y controles. |
| `game/scenario-layouts.js` | Layouts jugables generados desde `maps/*.json`: suelo, caminos, plazas, obstaculos, casas y spawns. |
| `game/state.js` | Estado compartido de partida y helpers para inicializarlo o consultarlo. |
| `game/ui.js` | Logica de pantallas, botones, selectores, modales y actualizacion de UI; delega el resize del canvas a PixiJS. |
| `game/utils.js` | Utilidades generales reutilizadas por varios modulos del juego. |
| `game/world.js` | Construccion y actualizacion del mundo jugable: entidades, mapa y reglas de escenario. |

## Mapas JSON

| Fichero | Para que sirve |
| --- | --- |
| `maps/manifest.json` | Manifest generado de mapas creados desde JSON; alimenta el selector junto a `game/map-assets.js`. |
| `maps/piornal-editor-example.json` | Mapa de ejemplo para el editor visual, exportado en formato compatible con `scenarioLayouts`. |
| `maps/plaza.json` | Mapa creado con el editor y usado por el juego al regenerar con `npm run update:maps`. |

## Scripts

| Fichero | Para que sirve |
| --- | --- |
| `scripts/build-pages.mjs` | Script de build/export para preparar la salida de GitHub Pages, copiando tambien vendor. |
| `scripts/update-house-assets.mjs` | Escanea `assets/generated/houses/houseN.png` y regenera la lista de casas para juego, editor y PWA/cache. |
| `scripts/update-map-assets.mjs` | Escanea `maps/*.json` y regenera la lista de mapas, layouts jugables, manifest y PWA/cache. |
| `scripts/update-object-assets.mjs` | Escanea `assets/generated/objects/objectN.png` y regenera la lista de objetos para juego, editor y PWA/cache. |

## Herramientas

| Fichero | Para que sirve |
| --- | --- |
| `tools/map-editor.css` | Estilos del editor visual de mapas. |
| `tools/map-editor.js` | Logica del editor visual: canvas, paleta de edificios/objetos/suelo, drag, resize proporcional, seleccion, importacion y exportacion JSON. |

## Tests

| Fichero | Para que sirve |
| --- | --- |
| `tests/smoke.spec.js` | Pruebas de humo Playwright del flujo principal, selectores, spawns, retos, storage y render PixiJS. |

## Vendor

| Fichero | Para que sirve |
| --- | --- |
| `vendor/pixi/pixi.min.mjs` | Bundle ESM local de PixiJS usado por el navegador sin bundler. |

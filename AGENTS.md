# AGENTS.md

Guia rapida para trabajar en este proyecto sin perderse.

## Que es este proyecto

Este repo contiene un juego web de Jarramplas hecho con HTML, CSS y JavaScript puro. La partida se renderiza con PixiJS sobre el canvas `#game`, sin framework de frontend ni bundler obligatorio para desarrollo local: la app se sirve como archivos estaticos.

Flujo principal del juego:

1. Pantalla inicial.
2. Seleccion de tipo de partida.
3. Seleccion de personaje.
4. Seleccion de nivel.
5. Seleccion de mapa.
6. Seleccion de Jarramplas.
7. Partida renderizada con PixiJS.
8. Resultado, estadisticas y ranking local/Firebase si esta disponible.

## Comandos utiles

```sh
npm run serve
```

Levanta la app en `http://127.0.0.1:4173/`.

```sh
npm run test:smoke
```

Ejecuta los tests principales de Playwright.

```sh
npm test
```

Ejecuta toda la suite Playwright.

```sh
npm run build:pages
```

Prepara la salida para GitHub Pages cuando haga falta publicar.

## Documentacion del proyecto

- `AGENTS.md`: guia rapida de trabajo para agentes y colaboradores.
- `docs/file-inventory.md`: inventario de ficheros versionados y explicacion de para que sirve cada uno.
- `docs/game-architecture.md`: guia de arquitectura recomendada para juegos HTML5/Canvas.
- `docs/assets-guide.md`: guia de assets, sprites, fondos y rutas.
- `docs/balance-guide.md`: guia para ajustar dificultad, ritmo y puntuacion.
- `docs/input-guide.md`: guia de controles, teclado, puntero, tactil y ergonomia.
- `docs/testing-guide.md`: guia de pruebas y verificacion.
- `docs/deployment-guide.md`: guia de despliegue y GitHub Pages.

## Archivos principales

- `index.html`: estructura de pantallas, botones, HUD, modales y Canvas.
- `styles.css`: estilos de todas las pantallas, HUD, controles moviles, selectores y responsive.
- `game.js`: logica principal del juego, carga de assets, game loop, input, colisiones, render, mapas, personajes y flujo de pantallas.
- `game/render.js`: renderer PixiJS; dibuja mapa, sprites, actores, efectos y controles sobre el canvas.
- `map-editor.html`: editor visual de mapas para colocar, mover, redimensionar proporcionalmente y eliminar edificios/objetos/suelos, con export/import JSON.
- `config.js`: configuracion editable de niveles, modos, mapas, personajes jugables, variantes de Jarramplas, textos y claves de storage.
- `storage.js`: helpers de guardado local.
- `leaderboard.js`: ranking y persistencia remota/local.
- `firebase-config.js`: configuracion de Firebase.
- `analytics.js`: eventos/metricas.
- `asset-fallbacks.js`: rutas alternativas para assets.
- `service-worker.js`, `manifest.webmanifest`, `pwa-assets.js`: PWA, cache e iconos.
- `vendor/pixi/pixi.min.mjs`: bundle ESM versionado de PixiJS para mantener la app estatica sin bundler.
- `tests/smoke.spec.js`: pruebas de humo de flujo, pantallas, spawns y storage corrupto.
- `playwright.config.js`: configuracion de Playwright y servidor de test.
- `scripts/build-pages.mjs`: build/export para Pages.
- `tools/map-editor.js`, `tools/map-editor.css`: logica y estilos del editor visual de mapas.
- `maps/piornal-editor-example.json`: mapa de ejemplo en formato JSON compatible con el editor.

## Donde esta cada asset

- `assets/fondos/`: imagenes de mapas/fondos reales o base.
- `assets/jarramplas/`: animaciones de variantes de Jarramplas. Normalmente usan `frame_001.png`, `frame_002.png`, etc.
- `assets/personajes/frames/`: personajes antiguos por frames sueltos.
- `assets/generated/player_walk/`: hoja de caminar del jugador original.
- `assets/generated/player_throw/`: hoja de lanzar del jugador original.
- `assets/generated/characters/`: personajes nuevos jugables/NPC con subcarpetas `*_walk` y `*_throw`.
- `assets/generated/houses/`: casas oficiales usadas por el juego y el editor. Son las unicas casas que deben utilizarse.
- `assets/generated/objects/`: objetos oficiales usados por el juego y el editor. Son los unicos objetos decorativos/obstaculos que deben utilizarse.
- `assets/generated/turnip_piles/`: montones de nabos.
- `assets/generated/villager_throw_types/`: variantes antiguas de vecinos lanzando.
- `assets/icons/`: iconos PWA.

## Configuracion importante

La mayor parte de cambios de contenido se hacen en `config.js`.

### Niveles

Editar `difficultyConfig`:

- `label`: texto visible.
- `shareLabel`: texto para compartir.
- `meta`: descripcion corta.
- `people`: cantidad de vecinos.
- `crowdThrow`: frecuencia de lanzamiento de vecinos.
- `speed`: multiplicador de velocidad de Jarramplas.

### Tipos de partida

Editar `gameTypeConfig`:

- `timed`: partida por tiempo.
- `survival`: aguantar vida de Jarramplas.
- `limitedTurnips`: limite de nabos.
- `eviction`: limite de golpes a personas.

### Mapas

Editar `scenarios` en `config.js` para el selector visible.

Editar `scenarioLayouts` en `game/scenario-layouts.js` para el mapa jugable:

- `ground`: colores del suelo.
- `paths`: color de caminos.
- `plazas`: rectangulos de plaza.
- `spawn`: punto inicial de jugador, Jarramplas y target.
- `houses`: casas/obstaculos.
- `objects`: objetos/obstaculos.

Importante: cualquier nuevo spawn debe quedar en zona abierta. El juego usa `findFreeSpawn()` como red de seguridad, y el test `nadie empieza bloqueado por obstáculos en ningún mapa` debe seguir pasando.

### Personajes jugables

Editar `playerVariants` en `config.js`.

Cada personaje necesita:

```js
{
  id: "slug",
  name: "Nombre visible",
  meta: "Descripcion corta",
  walk: "assets/generated/characters/slug_walk/sheet-transparent.png",
  throw: "assets/generated/characters/slug_throw/sheet-transparent.png",
  preview: "assets/generated/characters/slug_walk/down-1.png",
}
```

Formato esperado:

- `walk`: spritesheet `4x4`, filas `down`, `left`, `right`, `up`, cuatro frames por fila.
- `throw`: spritesheet `2x3`, seis frames.
- `preview`: normalmente `down-1.png`.

El render de jugadores y vecinos usa estas mismas hojas mediante `drawActor()` en `game.js`.

### Variantes de Jarramplas

Editar `jarramplasVariants` en `config.js`.

Las carpetas suelen vivir en `assets/jarramplas/<nombre>/` y contener `frame_001.png` a `frame_008.png`. Tambien se soportan direcciones si se configura `directions`.

## Como generar sprites nuevos

Usar la skill:

```txt
$generate2dsprite
```

Flujo recomendado para personajes:

1. Generar hoja `walk` top-down `4x4`.
2. Generar hoja `throw` `2x3`.
3. Copiar el PNG bruto a:
   - `assets/generated/characters/<slug>_walk/raw-sheet.png`
   - `assets/generated/characters/<slug>_throw/raw-sheet.png`
4. Procesar con el script de la skill:

```sh
python3 /Users/jorgealonso/.codex/skills/generate2dsprite/scripts/generate2dsprite.py process \
  --input assets/generated/characters/<slug>_walk/raw-sheet.png \
  --target player \
  --mode player_sheet \
  --output-dir assets/generated/characters/<slug>_walk \
  --prompt "<descripcion>" \
  --cell-size 96 \
  --fit-scale 0.84 \
  --align feet \
  --shared-scale \
  --component-mode largest \
  --component-padding 4 \
  --min-component-area 30
```

```sh
python3 /Users/jorgealonso/.codex/skills/generate2dsprite/scripts/generate2dsprite.py process \
  --input assets/generated/characters/<slug>_throw/raw-sheet.png \
  --target asset \
  --mode sheet \
  --rows 2 \
  --cols 3 \
  --label-prefix throw \
  --output-dir assets/generated/characters/<slug>_throw \
  --prompt "<descripcion>" \
  --cell-size 128 \
  --fit-scale 0.86 \
  --align feet \
  --shared-scale \
  --component-mode largest \
  --component-padding 4 \
  --min-component-area 30
```

5. Revisar `sheet-transparent.png`, `down-1.png` y `pipeline-meta.json`.
6. Si algun frame sale cortado o toca bordes, reprocesar con menor `--fit-scale` o mas `--component-padding`.
7. Anadir el personaje a `playerVariants`.
8. Ejecutar `npm run test:smoke`.
9. Revisar visualmente el selector y una partida en `http://127.0.0.1:4173/`.

## Como generar o cambiar mapas

Para mapas completos o fondos nuevos, usar:

```txt
$generate2dmap
```

Para props concretos del mapa, como fuentes, casas o decoracion, usar:

```txt
$generate2dsprite
```

Despues de cambiar un mapa:

1. Anadir/actualizar la entrada en `scenarios` de `config.js`.
2. Crear/actualizar su `scenarioLayouts[scenario.id]` en `game/scenario-layouts.js`.
3. Ajustar `houses`, `objects`, `plazas` y `spawn`.
4. Comprobar colisiones. Obstaculos usan rectangulos `block`.
5. Ejecutar `npm run test:smoke`.
6. Probar en navegador en desktop y movil.

Para anadir objetos nuevos, guardar el PNG como `assets/generated/objects/objectN.png` y ejecutar:

```sh
npm run update:objects
```

Ese comando regenera `game/object-assets.js`, `assets/generated/objects/manifest.json` y la lista PWA/cache. El juego y el editor leeran el nuevo objeto sin tocar codigo a mano.

## Editor visual de mapas

Abrir:

```txt
http://127.0.0.1:4173/map-editor.html
```

El editor permite:

- Anadir las variantes oficiales de casas/edificios de `assets/generated/houses/` y objetos de `assets/generated/objects/` desde la paleta.
- Anadir y editar cuadrados/rectangulos de suelo, caminos y plazas de color.
- Mover objetos arrastrandolos en el canvas.
- Cambiar el tamano con los tiradores de las esquinas manteniendo siempre la proporcion.
- Editar posicion, tamano proporcional, variante, tipo, color y forma desde el panel lateral.
- Eliminar el objeto seleccionado.
- Importar/exportar mapas en JSON.

El formato exportado sigue la estructura de `scenarioLayouts`: `ground`, `paths`, `pathRects`, `plazas`, `spawn`, `houses` y `objects`.
Para integrar un mapa exportado en el juego, anadir su entrada a `scenarioLayouts` en `game/scenario-layouts.js` y revisar spawns/colisiones con `npm run test:smoke`.

Para anadir casas nuevas, guardar el PNG como `assets/generated/houses/houseN.png` y ejecutar:

```sh
npm run update:houses
```

Ese comando regenera `game/house-assets.js`, `assets/generated/houses/manifest.json` y la lista PWA/cache. El juego y el editor leeran la nueva casa sin tocar codigo a mano.

## Logica de colisiones y spawns

Las colisiones principales estan en `game.js`:

- `rectsIntersect()`: interseccion de rectangulos.
- `circleBlocked()`: comprueba si un actor circular choca con obstaculos.
- `findFreeSpawn()`: si un punto inicial cae bloqueado, busca un punto libre alrededor.
- `moveActor()`: movimiento con colision por eje.
- `house()` y `object()`: crean obstaculos con `block` y huella poligonal de colision.
- `spawnPeople()`: crea vecinos y tambien usa `findFreeSpawn()`.
- `startGame()`: crea mapa, jugador, Jarramplas, vecinos, nabos y estado inicial.

Si se cambia cualquier obstaculo grande, revisar spawns. El test de smoke cubre que nadie empiece bloqueado en ningun mapa.

## Render y assets en runtime

La carga de imagenes ocurre en `loadAssets()` y el dibujo en PixiJS se coordina desde `game/render.js`.

Entidades importantes:

- `assets.images.playerCharacters`: personajes jugables.
- `assets.images.houses`: casas.
- `assets.images.objects`: objetos.
- `assets.images.turnipPiles`: montones de nabos.
- `assets.jarramplas`: variantes de Jarramplas.

Render principal:

- `drawMap()`: suelo, caminos, plazas y decoracion base.
- `drawHouse()`: casas.
- `drawObject()`: objetos.
- `drawActor()`: jugador y vecinos.
- `drawJarramplas()`: Jarramplas.
- `render()`: ordena entidades por profundidad.

PixiJS se inicializa en `initPixiRenderer()` usando el canvas existente. La app no depende de un bundler: si se actualiza PixiJS con npm, copiar el nuevo bundle ESM a `vendor/pixi/pixi.min.mjs`, revisar `pwa-assets.js`, ejecutar `npm run test:smoke` y comprobar el build de Pages.

## UI y flujo de pantallas

Las pantallas estan en `index.html` y se controlan en `game.js` con `showScreen()`.

Pantallas principales:

- `loading`
- `start`
- `challenge`
- `type`
- `characterSelect`
- `select`
- `scenario`
- `jarramplasSelect`
- `pause`
- `result`
- `stats`

Si se anade una pantalla:

1. Crear la seccion en `index.html`.
2. Anadirla a `screens` en `game.js`.
3. Enlazar botones/eventos en `bindUi()`.
4. Dar estilos en `styles.css`.
5. Actualizar tests si cambia el flujo.

## Tests y verificacion

Antes de cerrar cambios:

```sh
npm run test:smoke
```

Los smoke tests cubren:

- carga inicial sin errores criticos,
- flujo basico de seleccion,
- selector de personajes,
- spawns no bloqueados en todos los mapas,
- pantalla de reto por URL,
- estadisticas con storage vacio,
- estadisticas con storage corrupto.

Despues de cambios visuales, abrir:

```txt
http://127.0.0.1:4173/
```

Revisar al menos:

- selector afectado,
- partida real,
- HUD,
- controles moviles si se toca layout,
- consola sin errores relevantes.

## Reglas de trabajo para futuros agentes

- No revertir cambios del usuario ni limpiar archivos generados sin permiso.
- Mantener cambios pequenos y centrados.
- Preferir editar configuracion en `config.js` antes de tocar logica.
- Si se toca `game.js`, entender primero el flujo de `startGame()`, `update()` y `render()`.
- Si se anaden assets, mantener rutas relativas y comprobar que cargan en local.
- Si se anade, elimina o renombra cualquier fichero versionado, actualizar `docs/file-inventory.md` en el mismo cambio.
- Para sprites generados, conservar `raw-sheet.png`, `raw-sheet-clean.png`, `sheet-transparent.png`, frames, GIFs y `pipeline-meta.json`.
- Si se cambian textos largos de botones/tarjetas, revisar movil para evitar cortes.
- Si se anaden personajes, actualizar tests que cuenten `[data-character]`.
- Si se anaden mapas, actualizar tests o anadir checks para spawns.
- No dejar servidores innecesarios corriendo salvo que el usuario quiera probar en navegador.

## Problemas frecuentes

- Personaje no aparece: revisar `playerVariants`, ruta `walk`, ruta `throw`, `preview` y consola.
- Sprite con fondo magenta: revisar que se use `sheet-transparent.png`, no `raw-sheet.png`.
- Sprite cortado: reprocesar con menor `--fit-scale` o mas `--component-padding`.
- Nombre cortado en selector: revisar `.character-card strong` en `styles.css`.
- Jugador atrapado al iniciar: ajustar `scenarioLayouts[...].spawn` y ejecutar smoke tests.
- Mapa sin asset: comprobar `scenarios[].path` y que el archivo exista en `assets/fondos/`.
- Jarramplas no anima: revisar carpeta de frames y `jarramplasVariants`.

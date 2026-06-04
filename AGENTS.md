# AGENTS.md

Guia rapida para trabajar en este proyecto sin perderse.

## Que es este proyecto

Este repo contiene un juego web de Jarramplas hecho con HTML, CSS y JavaScript puro sobre Canvas. No hay framework de frontend ni bundler obligatorio para desarrollo local: la app se sirve como archivos estaticos.

Flujo principal del juego:

1. Pantalla inicial.
2. Seleccion de tipo de partida.
3. Seleccion de personaje.
4. Seleccion de nivel.
5. Seleccion de mapa.
6. Seleccion de Jarramplas.
7. Partida en Canvas.
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

## Archivos principales

- `index.html`: estructura de pantallas, botones, HUD, modales y Canvas.
- `styles.css`: estilos de todas las pantallas, HUD, controles moviles, selectores y responsive.
- `game.js`: logica principal del juego, carga de assets, game loop, input, colisiones, render, mapas, personajes y flujo de pantallas.
- `config.js`: configuracion editable de niveles, modos, mapas, personajes jugables, variantes de Jarramplas, textos y claves de storage.
- `storage.js`: helpers de guardado local.
- `leaderboard.js`: ranking y persistencia remota/local.
- `firebase-config.js`: configuracion de Firebase.
- `analytics.js`: eventos/metricas.
- `asset-fallbacks.js`: rutas alternativas para assets.
- `service-worker.js`, `manifest.webmanifest`, `pwa-assets.js`: PWA, cache e iconos.
- `tests/smoke.spec.js`: pruebas de humo de flujo, pantallas, spawns y storage corrupto.
- `playwright.config.js`: configuracion de Playwright y servidor de test.
- `scripts/build-pages.mjs`: build/export para Pages.

## Donde esta cada asset

- `assets/fondos/`: imagenes de mapas/fondos reales o base.
- `assets/jarramplas/`: animaciones de variantes de Jarramplas. Normalmente usan `frame_001.png`, `frame_002.png`, etc.
- `assets/personajes/frames/`: personajes antiguos por frames sueltos.
- `assets/generated/player_walk/`: hoja de caminar del jugador original.
- `assets/generated/player_throw/`: hoja de lanzar del jugador original.
- `assets/generated/characters/`: personajes nuevos jugables/NPC con subcarpetas `*_walk` y `*_throw`.
- `assets/generated/fountains/`: sprites de fuentes de los mapas.
- `assets/generated/houses/`: sprites de casas.
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

Editar `scenarioLayouts` en `game.js` para el mapa jugable:

- `ground`: colores del suelo.
- `paths`: color de caminos.
- `plazas`: rectangulos de plaza.
- `fountain`: posicion, tamano y variante de fuente.
- `spawn`: punto inicial de jugador, Jarramplas y target.
- `houses`: casas/obstaculos.

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
2. Crear/actualizar su `scenarioLayouts[scenario.id]` en `game.js`.
3. Ajustar `fountain`, `houses`, `plazas` y `spawn`.
4. Comprobar colisiones. Obstaculos usan rectangulos `block`.
5. Ejecutar `npm run test:smoke`.
6. Probar en navegador en desktop y movil.

## Logica de colisiones y spawns

Las colisiones principales estan en `game.js`:

- `rectsIntersect()`: interseccion de rectangulos.
- `circleBlocked()`: comprueba si un actor circular choca con obstaculos.
- `findFreeSpawn()`: si un punto inicial cae bloqueado, busca un punto libre alrededor.
- `moveActor()`: movimiento con colision por eje.
- `fountain()` y `house()`: crean obstaculos con `block`.
- `spawnPeople()`: crea vecinos y tambien usa `findFreeSpawn()`.
- `startGame()`: crea mapa, jugador, Jarramplas, vecinos, nabos y estado inicial.

Si se cambia cualquier obstaculo grande, revisar spawns. El test de smoke cubre que nadie empiece bloqueado en ningun mapa.

## Render y assets en runtime

La carga de imagenes ocurre en `loadAssets()` en `game.js`.

Entidades importantes:

- `assets.images.playerCharacters`: personajes jugables.
- `assets.images.fountains`: sprites de fuentes.
- `assets.images.houses`: casas.
- `assets.images.turnipPiles`: montones de nabos.
- `assets.jarramplas`: variantes de Jarramplas.

Render principal:

- `drawMap()`: suelo, caminos, plazas y decoracion base.
- `drawFountain()`: fuente.
- `drawHouse()`: casas.
- `drawActor()`: jugador y vecinos.
- `drawJarramplas()`: Jarramplas.
- `render()`: ordena entidades por profundidad.

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

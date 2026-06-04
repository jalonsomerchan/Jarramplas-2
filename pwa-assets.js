/*
 * Shared asset manifest for the PWA service worker.
 * Keep this file dependency-free so it can run both in the page and inside the service worker via importScripts().
 */
(function registerPwaAssets(globalScope) {
  const APP_BUILD = "20260605-1";

  const staticCoreAssets = [
    "./",
    "./index.html",
    "./styles.css",
    "./pwa-assets.js",
    "./asset-fallbacks.js",
    "./game.js",
    "./config.js",
    "./storage.js",
    "./leaderboard.js",
    "./firebase-config.js",
    "./analytics.js",
    "./manifest.webmanifest",
    "./assets/portada.png",
    "./assets/icons/apple-touch-icon.png",
    "./assets/icons/icon-192.png",
    "./assets/icons/icon-512.png",
    "./game/dom.js",
    "./game/constants.js",
    "./game/state.js",
    "./game/scenario-layouts.js",
    "./game/utils.js",
    "./game/physics.js",
    "./game/world.js",
    "./game/effects.js",
    "./game/assets.js",
    "./game/ui.js",
    "./game/actors.js",
    "./game/render.js",
    "./game/input.js",
  ];

  const scenarios = [
    "assets/fondos/ayuntamiento.png",
    "assets/fondos/casa_cultura.png",
    "assets/fondos/campo_de_futbol.png",
    "assets/fondos/estatua_jarramplas.png",
    "assets/fondos/fondo2.png",
    "assets/fondos/iglesia2.png",
    "assets/fondos/mirador.png",
    "assets/fondos/plaza_de_toros.png",
    "assets/fondos/parada.png",
    "assets/fondos/fachada_jarramplas.png",
    "assets/fondos/nieve.png",
  ];

  const jarramplasRoots = [
    "assets/jarramplas/snes_tamboril_front_8f_hd",
    "assets/jarramplas/modelo_izquierda_front_8f_hd",
    "assets/jarramplas/modelo_centro_front_8f_hd",
    "assets/jarramplas/modelo_derecha_front_8f_hd",
    "assets/jarramplas/modelo_rojo_verde_front_8f_hd",
    "assets/jarramplas/modelo_leon_front_8f_hd",
    "assets/jarramplas/modelo_buho_azul_front_8f_hd",
    "assets/jarramplas/modelo_negro_dorado_front_8f_hd",
  ];

  const personIds = [1, 2, 3, 4, 5, 6];
  const personFrameIds = [1, 2, 3, 4, 5, 6];
  const generatedSheets = [
    "assets/generated/player_walk/sheet.png",
    "assets/generated/player_throw/sheet.png",
    "assets/generated/villager_throw/sheet.png",
    "assets/generated/villager_throw_types/type_1/sheet.png",
    "assets/generated/villager_throw_types/type_2/sheet.png",
    "assets/generated/villager_throw_types/type_3/sheet.png",
    "assets/generated/villager_throw_types/type_4/sheet.png",
    "assets/generated/turnip_piles/sheet.png",
    "assets/generated/houses/sheet.png",
  ];

  function withDot(path) {
    return path.startsWith("./") ? path : `./${path}`;
  }

  function makeJarramplasFrames(root, frameCount = 8) {
    return Array.from(
      { length: frameCount },
      (_, index) => `${root}/frame_${String(index + 1).padStart(3, "0")}.png`
    );
  }

  function makePersonFrames() {
    return personIds.flatMap((personId) => (
      personFrameIds.map((frameId) => `assets/personajes/frames/persona${personId}/${frameId}.png`)
    ));
  }

  function unique(paths) {
    return [...new Set(paths.map(withDot))];
  }

  const gameplayAssets = unique([
    ...scenarios,
    ...generatedSheets,
    ...jarramplasRoots.flatMap((root) => makeJarramplasFrames(root)),
    ...makePersonFrames(),
  ]);

  globalScope.JARRAMPLAS_PWA_ASSETS = {
    APP_BUILD,
    CACHE_VERSION: `jarramplas-v${APP_BUILD}`,
    CORE_ASSETS: unique(staticCoreAssets),
    GAMEPLAY_ASSETS: gameplayAssets,
    ALL_ASSETS: unique([...staticCoreAssets, ...gameplayAssets]),
  };

  if (globalScope.ServiceWorkerGlobalScope && globalScope instanceof globalScope.ServiceWorkerGlobalScope && !globalScope.__JARRAMPLAS_FETCH_PATCHED__) {
    globalScope.__JARRAMPLAS_FETCH_PATCHED__ = true;
    const originalFetch = globalScope.fetch.bind(globalScope);
    const helpers = `function getActorCollisionRadius(actor) {\n  if (actor === state.jarramplas) return 26;\n  if (state.people.includes(actor)) return 19;\n  return PLAYER_RADIUS;\n}\n\nfunction getSolidActors(excludedActor) {\n  return [state.player, state.jarramplas, ...state.people]\n    .filter((actor) => actor && actor !== excludedActor);\n}\n\nfunction circleBlockedByActors(x, y, radius, excludedActor) {\n  return getSolidActors(excludedActor).some((actor) => {\n    const otherRadius = getActorCollisionRadius(actor);\n    return Math.hypot(x - actor.x, y - actor.y) < radius + otherRadius;\n  });\n}\n\nfunction actorBlocked(actor, x, y, radius) {\n  return circleBlocked(x, y, radius) || circleBlockedByActors(x, y, radius, actor);\n}\n\n`;
    const resolver = `function resolveActorCollisions(iterations = 4) {\n  for (let pass = 0; pass < iterations; pass += 1) {\n    const actors = getSolidActors(null);\n    for (let i = 0; i < actors.length; i += 1) {\n      for (let j = i + 1; j < actors.length; j += 1) {\n        const a = actors[i];\n        const b = actors[j];\n        const aRadius = getActorCollisionRadius(a);\n        const bRadius = getActorCollisionRadius(b);\n        const minDistance = aRadius + bRadius;\n        let dx = b.x - a.x;\n        let dy = b.y - a.y;\n        let distance = Math.hypot(dx, dy);\n        if (distance >= minDistance) continue;\n        if (distance < 0.001) {\n          const angle = (i + 1) * 1.7 + (j + 1) * 0.9;\n          dx = Math.cos(angle);\n          dy = Math.sin(angle);\n          distance = 1;\n        }\n        const nx = dx / distance;\n        const ny = dy / distance;\n        const overlap = minDistance - distance + 0.75;\n        const aShare = a === state.jarramplas ? 0.35 : 0.5;\n        const bShare = b === state.jarramplas ? 0.35 : 0.5;\n        const aNextX = clamp(a.x - nx * overlap * aShare, aRadius + 4, WORLD.w - aRadius - 4);\n        const aNextY = clamp(a.y - ny * overlap * aShare, aRadius + 4, WORLD.h - aRadius - 4);\n        const bNextX = clamp(b.x + nx * overlap * bShare, bRadius + 4, WORLD.w - bRadius - 4);\n        const bNextY = clamp(b.y + ny * overlap * bShare, bRadius + 4, WORLD.h - bRadius - 4);\n        if (!circleBlocked(aNextX, aNextY, aRadius)) { a.x = aNextX; a.y = aNextY; }\n        if (!circleBlocked(bNextX, bNextY, bRadius)) { b.x = bNextX; b.y = bNextY; }\n      }\n    }\n  }\n}\n\n`;

    function patchGameSource(source) {
      if (source.includes("function resolveActorCollisions")) return source;
      let patched = source;
      if (!patched.includes("function actorBlocked(actor, x, y, radius)")) {
        patched = patched.replace("function findFreeSpawn(x, y, radius = PLAYER_RADIUS) {", `${helpers}function findFreeSpawn(x, y, radius = PLAYER_RADIUS) {`);
        patched = patched.replace("  if (!circleBlocked(nextX, actor.y, radius)) actor.x = nextX;\n  if (!circleBlocked(actor.x, nextY, radius)) actor.y = nextY;", "  if (!actorBlocked(actor, nextX, actor.y, radius)) actor.x = nextX;\n  if (!actorBlocked(actor, actor.x, nextY, radius)) actor.y = nextY;");
      }
      patched = patched.replace("function findFreeSpawn(x, y, radius = PLAYER_RADIUS) {", `${resolver}function findFreeSpawn(x, y, radius = PLAYER_RADIUS) {`);
      return patched.replace("  updatePeople(dt);\n  updateTurnips(dt);", "  updatePeople(dt);\n  resolveActorCollisions();\n  updateTurnips(dt);");
    }

    globalScope.fetch = async function patchedFetch(input, init) {
      const response = await originalFetch(input, init);
      const url = new URL(typeof input === "string" ? input : input.url, globalScope.location.href);
      if (!url.pathname.endsWith("/game.js") || !response.ok) return response;
      const headers = new Headers(response.headers);
      headers.set("Content-Type", "text/javascript; charset=utf-8");
      return new Response(patchGameSource(await response.text()), {
        status: response.status,
        statusText: response.statusText,
        headers,
      });
    };
  }
})(typeof self !== "undefined" ? self : window);
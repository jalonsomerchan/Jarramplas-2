importScripts("./pwa-assets.js");

const {
  CACHE_VERSION,
  CORE_ASSETS,
  GAMEPLAY_ASSETS,
} = self.JARRAMPLAS_PWA_ASSETS;

const CORE_CACHE = `${CACHE_VERSION}-core`;
const ASSET_CACHE = `${CACHE_VERSION}-assets`;
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;
const CACHE_PREFIX = "jarramplas-v";

async function addAllSettled(cacheName, assets) {
  const cache = await caches.open(cacheName);
  const results = await Promise.allSettled(
    assets.map(async (asset) => {
      const request = new Request(asset, { cache: "reload" });
      const response = await fetch(request);
      if (!response || !response.ok) {
        throw new Error(`No se pudo cachear ${asset}: ${response?.status || "sin respuesta"}`);
      }
      await cache.put(cleanRequest(asset), response);
      return asset;
    })
  );

  const failed = results
    .filter((result) => result.status === "rejected")
    .map((result) => result.reason?.message || String(result.reason));

  if (failed.length) {
    console.warn("[Jarramplas SW] Algunos assets no se pudieron cachear.", failed);
  }

  return { ok: results.length - failed.length, failed };
}

async function notifyClients(message) {
  const clients = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
  clients.forEach((client) => client.postMessage(message));
}

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    await addAllSettled(CORE_CACHE, CORE_ASSETS);
    self.skipWaiting();
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys
        .filter((key) => key.startsWith(CACHE_PREFIX) && !key.startsWith(CACHE_VERSION))
        .map((key) => caches.delete(key))
    );
    await self.clients.claim();
    notifyClients({ type: "JARRAMPLAS_SW_READY", version: CACHE_VERSION });
    event.waitUntil(addAllSettled(ASSET_CACHE, GAMEPLAY_ASSETS));
  })());
});

function requestUrl(requestOrPath) {
  if (typeof requestOrPath === "string") return new URL(requestOrPath, self.location.href);
  return new URL(requestOrPath.url);
}

function isLocalRequest(request) {
  return requestUrl(request).origin === self.location.origin;
}

function cleanRequest(requestOrPath) {
  const url = requestUrl(requestOrPath);
  url.search = "";

  if (typeof requestOrPath === "string") {
    return new Request(url.toString());
  }

  return new Request(url.toString(), {
    method: requestOrPath.method,
    headers: requestOrPath.headers,
    mode: requestOrPath.mode === "navigate" ? "same-origin" : requestOrPath.mode,
    credentials: requestOrPath.credentials,
    redirect: requestOrPath.redirect,
    referrer: requestOrPath.referrer,
  });
}

function requestPathname(request) {
  return requestUrl(request).pathname;
}

function isGameScript(request) {
  return requestPathname(request).endsWith("/game.js");
}

function isStaticAsset(request) {
  const pathname = requestPathname(request);
  return pathname.endsWith(".js")
    || pathname.endsWith(".css")
    || pathname.endsWith(".webmanifest");
}

function isRuntimeAsset(request) {
  const pathname = requestPathname(request);
  return pathname.endsWith(".png")
    || pathname.endsWith(".jpg")
    || pathname.endsWith(".jpeg")
    || pathname.endsWith(".webp")
    || pathname.endsWith(".gif")
    || pathname.endsWith(".svg");
}

async function putIfOk(cacheName, request, response) {
  if (!response || !response.ok) return;
  const cache = await caches.open(cacheName);
  await cache.put(cleanRequest(request), response.clone());
}

async function matchAny(request) {
  const clean = cleanRequest(request);
  return caches.match(clean, { ignoreSearch: true })
    || caches.match(request, { ignoreSearch: true });
}

async function networkFirstPage(request) {
  try {
    const response = await fetch(request);
    await putIfOk(CORE_CACHE, "./index.html", response);
    return response;
  } catch {
    return matchAny("./index.html");
  }
}

async function networkFirstStaticAsset(request) {
  try {
    const clean = cleanRequest(request);
    const response = await fetch(clean, { cache: "no-cache" });
    await putIfOk(CORE_CACHE, request, response);
    return response;
  } catch {
    return matchAny(request);
  }
}

function patchGameScript(source) {
  let patched = source;

  if (!patched.includes("function actorBlocked(actor, x, y, radius)")) {
    const helperMarker = `function findFreeSpawn(x, y, radius = PLAYER_RADIUS) {`;
    const actorCollisionHelpers = `function getActorCollisionRadius(actor) {
  if (actor === state.jarramplas) return 26;
  if (state.people.includes(actor)) return 19;
  return PLAYER_RADIUS;
}

function getSolidActors(excludedActor) {
  return [state.player, state.jarramplas, ...state.people]
    .filter((actor) => actor && actor !== excludedActor);
}

function circleBlockedByActors(x, y, radius, excludedActor) {
  return getSolidActors(excludedActor).some((actor) => {
    const otherRadius = getActorCollisionRadius(actor);
    return Math.hypot(x - actor.x, y - actor.y) < radius + otherRadius;
  });
}

function actorBlocked(actor, x, y, radius) {
  return circleBlocked(x, y, radius) || circleBlockedByActors(x, y, radius, actor);
}

`;

    patched = patched
      .replace(helperMarker, `${actorCollisionHelpers}${helperMarker}`)
      .replace(
        `  if (!circleBlocked(nextX, actor.y, radius)) actor.x = nextX;\n  if (!circleBlocked(actor.x, nextY, radius)) actor.y = nextY;`,
        `  if (!actorBlocked(actor, nextX, actor.y, radius)) actor.x = nextX;\n  if (!actorBlocked(actor, actor.x, nextY, radius)) actor.y = nextY;`
      );
  }

  if (!patched.includes('document.getElementById("finalTurnipsThrown")')) {
    patched = patched.replace(
      `  document.getElementById("finalJarramplasName").textContent = jarramplasVariants[state.jarramplasIndex]?.name || "Jarramplas";`,
      `  document.getElementById("finalJarramplasName").textContent = jarramplasVariants[state.jarramplasIndex]?.name || "Jarramplas";\n  document.getElementById("finalTurnipsThrown").textContent = formatNumber(state.throws);\n  document.getElementById("finalTurnipsHit").textContent = formatNumber(state.hits);\n  document.getElementById("finalPeopleHits").textContent = formatNumber(state.peopleHits);\n  document.getElementById("finalAccuracy").textContent = `${accuracy}%`;`
    );
  }

  return patched;
}

async function patchGameScriptResponse(response) {
  const source = await response.text();
  const patched = patchGameScript(source);
  const headers = new Headers(response.headers);
  headers.set("Content-Type", "text/javascript; charset=utf-8");
  return new Response(patched, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

async function networkFirstGameScript(request) {
  try {
    const clean = cleanRequest(request);
    const response = await fetch(clean, { cache: "no-cache" });
    const patched = await patchGameScriptResponse(response);
    await putIfOk(CORE_CACHE, request, patched);
    return patched;
  } catch {
    const cached = await matchAny(request);
    if (cached) return patchGameScriptResponse(cached);
    throw new Error("No se pudo cargar game.js");
  }
}

async function staleWhileRevalidateAsset(request) {
  const cached = await matchAny(request);
  const refresh = fetch(cleanRequest(request))
    .then(async (response) => {
      await putIfOk(ASSET_CACHE, request, response);
      return response;
    })
    .catch(() => null);

  if (cached) return cached;

  const refreshed = await refresh;
  return refreshed || fetch(request);
}

async function cacheFirstRuntime(request) {
  const cached = await matchAny(request);
  if (cached) return cached;

  const response = await fetch(cleanRequest(request));
  await putIfOk(RUNTIME_CACHE, request, response);
  return response;
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET" || !isLocalRequest(request)) return;

  if (request.mode === "navigate") {
    event.respondWith(networkFirstPage(request));
    return;
  }

  if (isGameScript(request)) {
    event.respondWith(networkFirstGameScript(request));
    return;
  }

  if (isStaticAsset(request)) {
    event.respondWith(networkFirstStaticAsset(request));
    return;
  }

  if (isRuntimeAsset(request)) {
    event.respondWith(staleWhileRevalidateAsset(request));
    return;
  }

  event.respondWith(cacheFirstRuntime(request));
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "JARRAMPLAS_SKIP_WAITING") {
    self.skipWaiting();
  }
});
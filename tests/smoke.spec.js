import { expect, test } from "@playwright/test";

const ignoredConsolePatterns = [
  /Firebase/i,
  /service worker/i,
  /ERR_SOCKET_NOT_CONNECTED/i,
];

function collectUnexpectedConsoleErrors(page) {
  const errors = [];
  page.on("console", (message) => {
    if (message.type() !== "error") return;
    const text = message.text();
    if (ignoredConsolePatterns.some((pattern) => pattern.test(text))) return;
    errors.push(text);
  });
  page.on("pageerror", (error) => {
    errors.push(error.message);
  });
  return errors;
}

async function waitForHomeReady(page) {
  await expect(page.locator("#start")).toBeVisible({ timeout: 25_000 });
  await expect(page.locator("#loading")).not.toBeVisible({ timeout: 25_000 });
  await expect(page.locator("#playButton")).toBeEnabled({ timeout: 25_000 });
  await expect(page.locator("#playButton")).toHaveText(/Jugar/i, { timeout: 25_000 });
}

async function visibleGameScreen(page) {
  return page.evaluate(() => {
    if (document.querySelector("#type")?.classList.contains("is-visible")) return "type";
    if (document.querySelector("#tutorial")?.classList.contains("is-visible")) return "tutorial";
    return "";
  });
}

async function openGameTypeScreen(page) {
  await page.locator("#playButton").click();
  await expect.poll(() => visibleGameScreen(page), { timeout: 10_000 }).toMatch(/^(type|tutorial)$/);

  if (await page.locator("#tutorial").isVisible()) {
    await page.locator("#tutorialButton").click();
  }

  await expect(page.locator("#type")).toBeVisible();
}

async function startMap(page, scenarioIndex) {
  await page.goto("/");
  await waitForHomeReady(page);
  await openGameTypeScreen(page);
  await page.locator("[data-game-type='timed']").click();
  await page.locator("[data-character='0']").click();
  await page.locator("[data-level='day19Morning']").click();
  await page.locator(`[data-scenario='${scenarioIndex}']`).click();
  await page.locator("[data-jarramplas='0']").click();
  await expect(page.locator(".hud.is-visible")).toBeVisible({ timeout: 10_000 });
}

test("carga la pantalla inicial sin errores críticos", async ({ page }) => {
  const consoleErrors = collectUnexpectedConsoleErrors(page);

  await page.goto("/");

  await expect(page).toHaveTitle(/Jarramplas/i);
  await expect(page.locator("#game")).toBeVisible();
  await waitForHomeReady(page);

  expect(consoleErrors).toEqual([]);
});

test("permite navegar por el flujo básico de selección", async ({ page }) => {
  const consoleErrors = collectUnexpectedConsoleErrors(page);

  await page.goto("/");
  await waitForHomeReady(page);

  await openGameTypeScreen(page);

  await page.locator("[data-game-type='timed']").click();
  await expect(page.locator("#characterSelect")).toBeVisible();
  await expect(page.locator("[data-character]")).toHaveCount(5);

  await page.locator("[data-character='1']").click();
  await expect(page.locator("#select")).toBeVisible();

  await page.locator("[data-level='day19Morning']").click();
  await expect(page.locator("#scenario")).toBeVisible();
  await expect(page.locator("[data-scenario]")).toHaveCount(3);

  await page.locator("[data-scenario='0']").click();
  await expect(page.locator("#jarramplasSelect")).toBeVisible();

  await page.locator("[data-jarramplas='0']").click();
  await expect(page.locator(".hud.is-visible")).toBeVisible({ timeout: 10_000 });
  await expect(page.locator("#score")).toContainText("pts");

  expect(consoleErrors).toEqual([]);
});

test("nadie empieza bloqueado por obstáculos en ningún mapa", async ({ page }) => {
  const consoleErrors = collectUnexpectedConsoleErrors(page);

  for (const scenarioIndex of [0, 1, 2]) {
    await startMap(page, scenarioIndex);
    const report = await page.evaluate(() => window.__JARRAMPLAS_DEBUG__.getSpawnCollisionReport());
    expect(report.filter((entry) => entry.blocked), `mapa ${scenarioIndex}: ${JSON.stringify(report)}`).toEqual([]);
    const player = report.find((entry) => entry.name === "player");
    const jarramplas = report.find((entry) => entry.name === "jarramplas");
    expect(Math.hypot(player.x - jarramplas.x, player.y - jarramplas.y)).toBeGreaterThan(500);
  }

  expect(consoleErrors).toEqual([]);
});

test("los personajes mantienen escala visual al caminar y tirar", async ({ page }) => {
  const consoleErrors = collectUnexpectedConsoleErrors(page);

  await startMap(page, 0);

  const measurements = await page.evaluate(async () => {
    const debug = window.__JARRAMPLAS_DEBUG__;
    const canvas = document.querySelector("#game");
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    const frame = () => new Promise((resolve) => requestAnimationFrame(() => resolve()));
    const characterCount = document.querySelectorAll("[data-character]").length;

    function captureDiffBox(baseline, left, top, size) {
      const current = ctx.getImageData(left, top, size, size).data;
      let minX = size;
      let minY = size;
      let maxX = -1;
      let maxY = -1;
      for (let y = 0; y < size; y += 1) {
        for (let x = 0; x < size; x += 1) {
          const offset = (y * size + x) * 4;
          const diff = Math.abs(current[offset] - baseline[offset])
            + Math.abs(current[offset + 1] - baseline[offset + 1])
            + Math.abs(current[offset + 2] - baseline[offset + 2]);
          if (diff <= 45) continue;
          minX = Math.min(minX, x);
          minY = Math.min(minY, y);
          maxX = Math.max(maxX, x);
          maxY = Math.max(maxY, y);
        }
      }
      return maxX < minX ? null : { w: maxX - minX + 1, h: maxY - minY + 1 };
    }

    async function measureCharacter(characterIndex, throwing) {
      const state = debug.state;
      state.playerIndex = characterIndex;
      state.scenarioIndex = 0;
      state.jarramplasIndex = 0;
      state.difficulty = "day18Evening";
      state.gameType = "timed";
      debug.startGame();

      Object.assign(state, {
        mode: "pause",
        obstacles: [],
        piles: [],
        people: [],
        bystanders: [],
        turnips: [],
        particles: [],
        impacts: [],
        floaters: [],
        jarramplas: null,
      });
      state.camera.x = 900;
      state.camera.y = 720;
      state.player.x = 1260;
      state.player.y = 1080;
      state.player.dir = "down";
      state.player.walking = false;
      state.player.throwAnim = 0;

      const dpr = canvas.width / state.w;
      const centerX = Math.round((state.player.x - state.camera.x) * dpr);
      const centerY = Math.round((state.player.y - state.camera.y + 18) * dpr);
      const size = Math.round(150 * dpr);
      const left = Math.round(centerX - size / 2);
      const top = Math.round(centerY - size);
      const player = state.player;
      state.player = null;
      await frame();
      await frame();
      const baseline = ctx.getImageData(left, top, size, size).data.slice();

      state.player = player;
      state.player.throwAnim = throwing ? 0.25 : 0;
      await frame();
      await frame();
      return captureDiffBox(baseline, left, top, size);
    }

    const results = [];
    for (let characterIndex = 0; characterIndex < characterCount; characterIndex += 1) {
      const idle = await measureCharacter(characterIndex, false);
      const throwing = await measureCharacter(characterIndex, true);
      results.push({
        characterIndex,
        idleHeight: idle?.h || 0,
        throwHeight: throwing?.h || 0,
        ratio: idle?.h && throwing?.h ? throwing.h / idle.h : 0,
      });
    }
    return results;
  });

  measurements.forEach((measurement) => {
    expect(measurement.idleHeight, JSON.stringify(measurement)).toBeGreaterThan(45);
    expect(measurement.throwHeight, JSON.stringify(measurement)).toBeGreaterThan(45);
    expect(measurement.ratio, JSON.stringify(measurement)).toBeGreaterThan(0.86);
    expect(measurement.ratio, JSON.stringify(measurement)).toBeLessThan(1.14);
  });
  expect(consoleErrors).toEqual([]);
});

test("los edificios mantienen una escala proporcional en todos los mapas", async ({ page }) => {
  const consoleErrors = collectUnexpectedConsoleErrors(page);

  for (const scenarioIndex of [0, 1, 2]) {
    await startMap(page, scenarioIndex);
    const houseSizes = await page.evaluate(() => window.__JARRAMPLAS_DEBUG__.state.obstacles
      .filter((obstacle) => obstacle.type === "house")
      .map((house) => ({
        variant: house.variant,
        visualWidth: Math.round((house.block.w / 0.88) * 10) / 10,
        visualHeight: Math.round((house.block.h / 0.85) * 10) / 10,
      })));

    const heights = houseSizes.map((house) => house.visualHeight);
    const widths = houseSizes.map((house) => house.visualWidth);
    const minHeight = Math.min(...heights);
    const maxHeight = Math.max(...heights);
    const maxWidth = Math.max(...widths);

    expect(minHeight, `mapa ${scenarioIndex}: ${JSON.stringify(houseSizes)}`).toBeGreaterThanOrEqual(250);
    expect(maxHeight, `mapa ${scenarioIndex}: ${JSON.stringify(houseSizes)}`).toBeLessThanOrEqual(500);
    expect(maxHeight / minHeight, `mapa ${scenarioIndex}: ${JSON.stringify(houseSizes)}`).toBeLessThanOrEqual(2.15);
    expect(maxWidth, `mapa ${scenarioIndex}: ${JSON.stringify(houseSizes)}`).toBeLessThanOrEqual(610);
  }

  expect(consoleErrors).toEqual([]);
});

test("abre la pantalla de reto cuando llega una URL con challenge", async ({ page }) => {
  const consoleErrors = collectUnexpectedConsoleErrors(page);

  await page.goto("/?challenge=precision&level=day20Morning&seed=12345&target=85&usuario=Jorge");
  await expect(page.locator("#loading")).not.toBeVisible({ timeout: 25_000 });
  await expect(page.locator("#playButton")).toHaveText(/Jugar/i, { timeout: 25_000 });

  await expect(page.locator("#challenge")).toBeVisible();
  await expect(page.locator("#challengeTitle")).toContainText(/Reto/i);
  await expect(page.locator("#challengeGoal")).toContainText("85");
  await expect(page.locator("#acceptChallengeButton")).toBeVisible();

  expect(consoleErrors).toEqual([]);
});

test("la pantalla de estadísticas funciona con localStorage vacío", async ({ page }) => {
  const consoleErrors = collectUnexpectedConsoleErrors(page);

  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();

  await expect(page.locator("#statsButton")).toBeVisible({ timeout: 20_000 });
  await page.locator("#statsButton").click();

  await expect(page.locator("#stats")).toBeVisible();
  await expect(page.locator("#statsGrid")).toContainText("Partidas jugadas");
  await expect(page.locator("#statsLeaderboardStatus")).toBeVisible();

  expect(consoleErrors).toEqual([]);
});

test("la pantalla de estadísticas tolera localStorage corrupto", async ({ page }) => {
  const consoleErrors = collectUnexpectedConsoleErrors(page);

  await page.goto("/");
  await page.evaluate(() => {
    localStorage.setItem("jarramplas.records.v1", "{mal json");
    localStorage.setItem("jarramplas.stats.v1", "{mal json");
    localStorage.setItem("jarramplas.leaderboard.v1", "{mal json");
  });
  await page.reload();

  await expect(page.locator("#statsButton")).toBeVisible({ timeout: 20_000 });
  await page.locator("#statsButton").click();

  await expect(page.locator("#stats")).toBeVisible();
  await expect(page.locator("#statsGrid")).toContainText("Partidas jugadas");

  expect(consoleErrors).toEqual([]);
});

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

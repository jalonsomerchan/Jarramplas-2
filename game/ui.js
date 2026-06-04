import {
  APP_VERSION,
  difficultyConfig,
  gameTypeConfig,
  getCharacterAttributes,
  jarramplasVariants,
  playerVariants,
  scenarios,
} from "../config.js";
import {
  formatNumber,
  formatPercent,
  getLocalLeaderboard,
  getPlayerName,
  getRecord,
  getStats,
  hasSeenTutorial,
  markTutorialSeen,
  savePlayerName,
} from "../storage.js";
import { DPR } from "./constants.js";
import {
  canvas,
  characterOptions,
  comboEl,
  ctx,
  gameVersionEl,
  hud,
  jarramplasCountdownEl,
  jarramplasOptions,
  playButton,
  playerNameInput,
  recordEl,
  scenarioOptions,
  scoreEl,
  screens,
  statsDetails,
  statsGrid,
  statsLeaderboard,
  statsLeaderboardDifficulty,
  statsLeaderboardStatus,
  statsLeaderboardType,
  timeEl,
} from "./dom.js";
import { state } from "./state.js";

export function showScreen(name) {
  Object.entries(screens).forEach(([screenName, el]) => {
    el?.classList.toggle("is-visible", screenName === name);
  });
  hud?.classList.toggle("is-visible", name === "game");
  state.mode = name;
}

export function resize() {
  const rect = canvas.getBoundingClientRect();
  state.w = Math.max(1, Math.floor(rect.width));
  state.h = Math.max(1, Math.floor(rect.height));
  canvas.width = Math.floor(state.w * DPR);
  canvas.height = Math.floor(state.h * DPR);
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  ctx.imageSmoothingEnabled = false;
}

export function updateHud() {
  scoreEl.textContent = `${formatNumber(state.score)} pts`;
  timeEl.textContent = state.gameType === "timed" ? `${Math.max(0, Math.ceil(state.timeLeft))} s` : `${Math.ceil(state.life)} vida`;
  comboEl.textContent = `${state.turnipsLeft} nabos`;
  recordEl.textContent = `Récord ${formatNumber(getRecord(state.gameType, state.difficulty))}`;
}

function renderCharacterStats(index) {
  const attrs = getCharacterAttributes(index);
  return `Vel ${attrs.speed} · Tiro x${attrs.throwForce} · ${attrs.maxTurnips} nabos · ${attrs.life} vida`;
}

export function populateScenarioOptions() {
  characterOptions.innerHTML = playerVariants.map((variant, index) => (
    `<button class="character-card" type="button" data-character="${index}">
      <img src="${variant.preview}" alt="">
      <strong>${variant.name}</strong>
      <span>${variant.meta}</span>
      <small>${renderCharacterStats(index)}</small>
    </button>`
  )).join("");
  scenarioOptions.innerHTML = scenarios.map((scenario, index) => (
    `<button class="scenario-card" type="button" data-scenario="${index}">
      <img src="${scenario.path}" alt="">
      <strong>${scenario.name}</strong>
      <span>${scenario.meta}</span>
    </button>`
  )).join("");
  jarramplasOptions.innerHTML = jarramplasVariants.map((variant, index) => (
    `<button type="button" data-jarramplas="${index}">${variant.name.replace(" HD", "")}<span>Animado</span></button>`
  )).join("");
}

export function populateStatsFilters() {
  if (!statsLeaderboardType || !statsLeaderboardDifficulty) return;
  statsLeaderboardType.innerHTML = Object.entries(gameTypeConfig).map(([key, item]) => `<option value="${key}">${item.label}</option>`).join("");
  statsLeaderboardDifficulty.innerHTML = Object.entries(difficultyConfig).map(([key, item]) => `<option value="${key}">${item.label}</option>`).join("");
}

export function renderStats() {
  const stats = getStats();
  statsGrid.innerHTML = `
    <div><strong>${formatNumber(stats.gamesStarted)}</strong><span>Partidas jugadas</span></div>
    <div><strong>${formatNumber(stats.bestScore)}</strong><span>Mejor puntuación</span></div>
    <div><strong>${formatPercent(stats.turnipsHit, stats.turnipsThrown)}</strong><span>Precisión</span></div>
    <div><strong>${formatNumber(stats.peopleHits)}</strong><span>Golpes recibidos</span></div>
  `;
  statsDetails.innerHTML = "";
  const type = statsLeaderboardType?.value || "timed";
  const difficulty = statsLeaderboardDifficulty?.value || "day19Morning";
  const entries = getLocalLeaderboard(type, difficulty);
  statsLeaderboardStatus.textContent = entries.length ? "Ranking local" : "Aún no hay partidas guardadas para este modo.";
  statsLeaderboard.innerHTML = entries.map((entry) => `<li><span>${entry.playerName}</span><strong>${formatNumber(entry.score)} pts</strong></li>`).join("");
}

export function parseChallenge() {
  const params = new URLSearchParams(window.location.search);
  const type = params.get("challenge");
  const level = params.get("level");
  if (!type || !difficultyConfig[level]) return null;
  return {
    type,
    difficulty: level,
    target: Number(params.get("target") || 0),
    name: String(params.get("usuario") || "Un amigo").slice(0, 24),
  };
}

export function renderChallenge(challenge) {
  state.activeChallenge = challenge;
  document.getElementById("challengeTitle").textContent = "Reto abierto";
  document.getElementById("challengeSubtitle").textContent = `${challenge.name} te ha retado`;
  document.getElementById("challengeGoal").textContent = `Objetivo: ${formatNumber(challenge.target)}${challenge.type === "precision" ? "% precisión" : " pts"}`;
  document.getElementById("challengeDescription").textContent = "Acepta el reto y juega con la misma dificultad en el pueblo de Piornal.";
  document.getElementById("challengeDetails").innerHTML = `<div><span>Nivel</span><strong>${difficultyConfig[challenge.difficulty].label}</strong></div>`;
  showScreen("challenge");
}

export function updateCountdown() {
  const now = new Date();
  const year = now.getMonth() === 0 && now.getDate() <= 20 ? now.getFullYear() : now.getFullYear() + 1;
  const target = new Date(year, 0, 20, 0, 0, 0);
  const ms = Math.max(0, target - now);
  const days = Math.floor(ms / 86400000);
  const hours = Math.floor((ms / 3600000) % 24);
  const minutes = Math.floor((ms / 60000) % 60);
  const seconds = Math.floor((ms / 1000) % 60);
  jarramplasCountdownEl.textContent = `${days} días · ${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function bindUi({ startGame }) {
  gameVersionEl.textContent = `v.${APP_VERSION}`;
  playerNameInput.value = getPlayerName();
  playerNameInput.addEventListener("change", () => savePlayerName(playerNameInput.value));
  playButton.addEventListener("click", () => {
    savePlayerName(playerNameInput.value);
    state.tutorialNextScreen = "type";
    showScreen(hasSeenTutorial() ? "type" : "tutorial");
  });
  document.getElementById("tutorialButton").addEventListener("click", () => {
    markTutorialSeen();
    showScreen(state.tutorialNextScreen);
  });
  document.getElementById("howToButton").addEventListener("click", () => {
    state.tutorialNextScreen = "start";
    showScreen("tutorial");
  });
  document.getElementById("aboutButton").addEventListener("click", () => showScreen("about"));
  document.getElementById("aboutBackButton").addEventListener("click", () => showScreen("start"));
  document.getElementById("statsButton").addEventListener("click", () => {
    renderStats();
    showScreen("stats");
  });
  document.getElementById("statsBackButton").addEventListener("click", () => showScreen("start"));
  document.getElementById("shareButton").addEventListener("click", async () => {
    const shareData = { title: "Jarramplas", text: "Juega a Jarramplas en Piornal", url: location.href };
    if (navigator.share) await navigator.share(shareData).catch(() => {});
  });
  document.querySelectorAll("[data-game-type]").forEach((button) => {
    button.addEventListener("click", () => {
      state.gameType = button.dataset.gameType;
      showScreen("characterSelect");
    });
  });
  characterOptions.addEventListener("click", (event) => {
    const button = event.target.closest("[data-character]");
    if (!button) return;
    state.playerIndex = Number(button.dataset.character);
      showScreen("select");
  });
  document.querySelectorAll("[data-level]").forEach((button) => {
    button.addEventListener("click", () => {
      state.difficulty = button.dataset.level;
      state.scenarioIndex = 0;
      state.jarramplasIndex = 0;
      showScreen("scenario");
    });
  });
  scenarioOptions.addEventListener("click", (event) => {
    const button = event.target.closest("[data-scenario]");
    if (!button) return;
    state.scenarioIndex = Number(button.dataset.scenario);
    showScreen("jarramplasSelect");
  });
  jarramplasOptions.addEventListener("click", (event) => {
    const button = event.target.closest("[data-jarramplas]");
    if (!button) return;
    state.jarramplasIndex = Number(button.dataset.jarramplas);
    startGame();
  });
  document.getElementById("typeBackButton").addEventListener("click", () => showScreen("start"));
  document.getElementById("characterBackButton").addEventListener("click", () => showScreen("type"));
  document.getElementById("backButton").addEventListener("click", () => showScreen("characterSelect"));
  document.getElementById("levelBackButton").addEventListener("click", () => showScreen("select"));
  document.getElementById("jarramplasBackButton").addEventListener("click", () => showScreen("scenario"));
  document.getElementById("pauseButton").addEventListener("click", () => showScreen("pause"));
  document.getElementById("resumeButton").addEventListener("click", () => {
    state.last = performance.now();
    showScreen("game");
  });
  document.getElementById("restartButton").addEventListener("click", startGame);
  document.getElementById("homeButton").addEventListener("click", () => showScreen("start"));
  document.getElementById("resultHomeButton")?.addEventListener("click", () => showScreen("start"));
  document.getElementById("playAgainButton")?.addEventListener("click", startGame);
  document.getElementById("againButton")?.addEventListener("click", () => showScreen("type"));
  document.getElementById("acceptChallengeButton").addEventListener("click", () => {
    if (state.activeChallenge) state.difficulty = state.activeChallenge.difficulty;
    state.gameType = "timed";
    state.scenarioIndex = 0;
    state.jarramplasIndex = 0;
    startGame();
  });
  document.getElementById("skipChallengeButton").addEventListener("click", () => showScreen("start"));
  statsLeaderboardType?.addEventListener("change", renderStats);
  statsLeaderboardDifficulty?.addEventListener("change", renderStats);
}

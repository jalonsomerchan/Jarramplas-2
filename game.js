import { loadAssets } from "./game/assets.js";
import { bindInput } from "./game/input.js";
import { getSpawnCollisionReport } from "./game/physics.js";
import { render } from "./game/render.js";
import { state } from "./game/state.js";
import {
  bindUi,
  parseChallenge,
  populateScenarioOptions,
  populateStatsFilters,
  renderChallenge,
  resize,
  showScreen,
  updateCountdown,
} from "./game/ui.js";
import { playerThrow, startGame, updateRuntime } from "./game/actors.js";
import { loadingScreen } from "./game/dom.js";

function hideLoading() {
  loadingScreen?.classList.remove("is-visible");
}

function gameLoop(now) {
  const dt = Math.min(0.033, Math.max(0, (now - (state.last || now)) / 1000));
  state.last = now;

  if (state.mode === "game" && !state.ended && state.player && state.jarramplas) {
    updateRuntime(dt);
  }

  render();
  requestAnimationFrame(gameLoop);
}

async function boot() {
  window.__JARRAMPLAS_DEBUG__ = {
    state,
    getSpawnCollisionReport,
    startGame,
    updateRuntime,
  };

  resize();
  window.addEventListener("resize", resize);

  populateScenarioOptions();
  populateStatsFilters();
  bindUi({ startGame });
  bindInput({ playerThrow });

  updateCountdown();
  window.setInterval(updateCountdown, 1000);

  await loadAssets();
  hideLoading();

  const challenge = parseChallenge();
  if (challenge) {
    renderChallenge(challenge);
  } else {
    showScreen("start");
  }

  state.last = performance.now();
  requestAnimationFrame(gameLoop);
}

boot().catch((error) => {
  console.error("[Jarramplas] Error iniciando el juego", error);
  hideLoading();
  showScreen("start");
});

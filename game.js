import { loadingScreen } from "./game/dom.js";
import { state } from "./game/state.js";
import { loadAssets } from "./game/assets.js";
import { bindInput } from "./game/input.js";
import { getSpawnCollisionReport } from "./game/physics.js";
import { render } from "./game/render.js";
import { startGame, playerThrow, updateRuntime } from "./game/actors.js";
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

function loop(now) {
  const dt = Math.min(0.033, Math.max(0, (now - state.last) / 1000 || 0));
  state.last = now;
  if (state.mode === "game" && !state.ended) updateRuntime(dt);
  render();
  requestAnimationFrame(loop);
}

async function init() {
  resize();
  bindUi({ startGame });
  bindInput({ playerThrow });
  populateScenarioOptions();
  populateStatsFilters();
  updateCountdown();
  setInterval(updateCountdown, 1000);
  await loadAssets();
  loadingScreen?.classList.remove("is-visible");
  const challenge = parseChallenge();
  if (challenge) renderChallenge(challenge);
  else showScreen("start");
  state.last = performance.now();
  requestAnimationFrame(loop);
}

window.addEventListener("resize", resize);
if (navigator.webdriver) {
  window.__JARRAMPLAS_DEBUG__ = {
    getSpawnCollisionReport,
  };
}
init();
